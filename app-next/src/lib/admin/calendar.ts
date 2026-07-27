/**
 * 예약 캘린더 · 승인제
 *  - content/calendar/config.json : 근무일 + 슬롯 템플릿
 *  - content/calendar/blocks/YYYY-MM.json : 개별 휴무일
 *  - slot.status: 'held' (신청 · 잠금 · 24h 자동해제) → 'confirmed' (원장님 확정) → 'released' (취소)
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { listConsults, getConsult } from './storage';

const CAL_DIR = path.join(process.cwd(), 'content', 'calendar');
const CONFIG_FILE = path.join(CAL_DIR, 'config.json');
const BLOCKS_DIR = path.join(CAL_DIR, 'blocks');

export type SlotKind = 'treatment_consult' | 'course_consult' | 'treatment_session';

export interface SlotTemplate {
  time: string;         // "10:00"
  durationMin: number;
  label: string;
}

export interface CalendarConfig {
  workingDays: number[];                       // 0=Sun … 6=Sat
  slotTemplates: Record<SlotKind, SlotTemplate[]>;
  holdHours: number;                            // 홀드 자동해제 시간
  horizonDays: number;                          // 예약 가능 최대 미래 일수
}

const DEFAULT_CONFIG: CalendarConfig = {
  workingDays: [2, 3, 4, 5, 6],                 // 화-토
  slotTemplates: {
    treatment_consult: [
      { time: '11:30', durationMin: 30, label: '오전 시술 상담' },
      { time: '19:00', durationMin: 30, label: '저녁 시술 상담' },
    ],
    course_consult: [
      { time: '12:00', durationMin: 30, label: '오전 수강 상담' },
      { time: '19:30', durationMin: 30, label: '저녁 수강 상담' },
    ],
    treatment_session: [
      { time: '10:00', durationMin: 240, label: '오전 시술' },
      { time: '14:30', durationMin: 240, label: '오후 시술' },
    ],
  },
  holdHours: 24,
  horizonDays: 21,
};

export async function getConfig(): Promise<CalendarConfig> {
  try {
    const raw = await fs.readFile(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<CalendarConfig>;
    return {
      workingDays: parsed.workingDays ?? DEFAULT_CONFIG.workingDays,
      slotTemplates: { ...DEFAULT_CONFIG.slotTemplates, ...(parsed.slotTemplates ?? {}) },
      holdHours: parsed.holdHours ?? DEFAULT_CONFIG.holdHours,
      horizonDays: parsed.horizonDays ?? DEFAULT_CONFIG.horizonDays,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(cfg: CalendarConfig): Promise<void> {
  await fs.mkdir(CAL_DIR, { recursive: true });
  await fs.writeFile(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf-8');
}

// ── 개별 휴무일 ──
export interface BlockedDate { date: string; reason?: string }

export async function listBlocks(fromDate: string, toDate: string): Promise<BlockedDate[]> {
  await fs.mkdir(BLOCKS_DIR, { recursive: true });
  const months = new Set<string>();
  const from = new Date(fromDate); const to = new Date(toDate);
  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const rows: BlockedDate[] = [];
  for (const m of months) {
    try {
      const raw = await fs.readFile(path.join(BLOCKS_DIR, `${m}.json`), 'utf-8');
      const parsed = JSON.parse(raw) as BlockedDate[];
      rows.push(...parsed.filter((b) => b.date >= fromDate && b.date <= toDate));
    } catch { /* empty */ }
  }
  return rows;
}

export async function toggleBlock(date: string, reason?: string): Promise<{ blocked: boolean }> {
  await fs.mkdir(BLOCKS_DIR, { recursive: true });
  const month = date.slice(0, 7);
  const file = path.join(BLOCKS_DIR, `${month}.json`);
  let arr: BlockedDate[] = [];
  try { arr = JSON.parse(await fs.readFile(file, 'utf-8')) as BlockedDate[]; } catch { /* new */ }
  const idx = arr.findIndex((b) => b.date === date);
  if (idx >= 0) {
    arr.splice(idx, 1);
    await fs.writeFile(file, JSON.stringify(arr, null, 2), 'utf-8');
    return { blocked: false };
  }
  arr.push({ date, reason });
  await fs.writeFile(file, JSON.stringify(arr, null, 2), 'utf-8');
  return { blocked: true };
}

// ── 슬롯 계산 ──
export interface AvailableSlot {
  date: string;         // YYYY-MM-DD
  time: string;         // "10:00"
  kind: SlotKind;
  label: string;
  durationMin: number;
  status: 'available' | 'held' | 'confirmed';
  heldByConsultId?: string;
}

export async function listSlots(opts: { from: string; to: string; kind: SlotKind }): Promise<AvailableSlot[]> {
  const cfg = await getConfig();
  const blocks = await listBlocks(opts.from, opts.to);
  const blockSet = new Set(blocks.map((b) => b.date));
  const templates = cfg.slotTemplates[opts.kind] ?? [];

  // 예약 상태 조회
  const consults = await listConsults();
  const holdCutoff = new Date(Date.now() - cfg.holdHours * 3600_000).toISOString();
  const bookedByKey = new Map<string, { status: 'held' | 'confirmed'; consultId: string }>();
  for (const c of consults) {
    const full = await getConsult(c.id);
    if (!full?.slot) continue;
    if (full.slot.kind !== opts.kind) continue;
    // 홀드 만료 시 사용 가능으로 처리
    if (full.slot.status === 'held' && full.updatedAt < holdCutoff) continue;
    if (full.slot.status === 'released') continue;
    const key = `${full.slot.date}T${full.slot.time}`;
    bookedByKey.set(key, { status: full.slot.status as 'held' | 'confirmed', consultId: full.id });
  }

  const rows: AvailableSlot[] = [];
  const start = new Date(opts.from);
  const end = new Date(opts.to);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!cfg.workingDays.includes(d.getDay())) continue;
    if (blockSet.has(dateStr)) continue;
    for (const t of templates) {
      const key = `${dateStr}T${t.time}`;
      const booking = bookedByKey.get(key);
      rows.push({
        date: dateStr,
        time: t.time,
        kind: opts.kind,
        label: t.label,
        durationMin: t.durationMin,
        status: booking ? booking.status : 'available',
        heldByConsultId: booking?.consultId,
      });
    }
  }
  return rows;
}
