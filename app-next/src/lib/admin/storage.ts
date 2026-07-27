/**
 * 운영자 데이터 저장 (로컬 파일 · 모비딕 방식)
 * - content/consult/*.json : 상담 신청
 * - content/visits/YYYY-MM-DD.json : 일별 방문 집계
 * 나중에 Supabase 이관 시 이 모듈만 교체.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const CONSULT_DIR = path.join(process.cwd(), 'content', 'consult');
const VISITS_DIR = path.join(process.cwd(), 'content', 'visits');

// ── 상담 신청 ──
export type ConsultStatus = 'new' | 'contacted' | 'booked' | 'done' | 'canceled';

export interface ConsultRequest {
  id: string;                    // ISO 타임스탬프 기반
  createdAt: string;
  updatedAt: string;
  status: ConsultStatus;
  type: 'treatment' | 'course' | 'other';    // 시술 · 수강 · 기타
  name: string;
  phone: string;
  kakao_id?: string;
  instagram?: string;
  email?: string;
  course?: string;               // course 선택 코드
  channel?: string;              // 유입 채널
  experience?: string;
  message?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referer?: string;
  user_agent?: string;
  ip?: string;                   // 마지막 옥텟 마스킹
  notes?: string;                // 운영자 메모
  history?: { at: string; action: string; note?: string }[];  // 상태 변경 기록
  slot?: {
    date: string;                // YYYY-MM-DD
    time: string;                // "HH:MM"
    kind: 'treatment_consult' | 'course_consult' | 'treatment_session';
    status: 'held' | 'confirmed' | 'released';
  };
}

export interface ConsultSummary {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ConsultStatus;
  type: ConsultRequest['type'];
  name: string;
  phone: string;
  email?: string;
  kakao_id?: string;
  instagram?: string;
  course?: string;
  channel?: string;
  message?: string;
}

function genId(): string {
  const t = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const rand = Math.random().toString(36).slice(2, 6);
  return `c-${t}-${rand}`;
}

export async function saveConsult(input: Omit<ConsultRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'history'> & { slot?: ConsultRequest['slot'] }): Promise<ConsultRequest> {
  await fs.mkdir(CONSULT_DIR, { recursive: true });
  const now = new Date().toISOString();
  const id = genId();
  const rec: ConsultRequest = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
    status: 'new',
    history: [{ at: now, action: 'created' }],
  };
  await fs.writeFile(path.join(CONSULT_DIR, `${id}.json`), JSON.stringify(rec, null, 2), 'utf-8');
  return rec;
}

export async function listConsults(): Promise<ConsultSummary[]> {
  await fs.mkdir(CONSULT_DIR, { recursive: true });
  const files = (await fs.readdir(CONSULT_DIR)).filter((f) => f.endsWith('.json'));
  const rows: ConsultSummary[] = [];
  for (const f of files) {
    try {
      const raw = await fs.readFile(path.join(CONSULT_DIR, f), 'utf-8');
      const r = JSON.parse(raw) as ConsultRequest;
      rows.push({
        id: r.id, createdAt: r.createdAt, updatedAt: r.updatedAt,
        status: r.status, type: r.type, name: r.name, phone: r.phone,
        email: r.email, kakao_id: r.kakao_id, instagram: r.instagram,
        course: r.course, channel: r.channel,
        message: (r as unknown as { message?: string }).message,
      });
    } catch { /* skip corrupt */ }
  }
  rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return rows;
}

export async function getConsult(id: string): Promise<ConsultRequest | null> {
  try {
    const raw = await fs.readFile(path.join(CONSULT_DIR, `${id}.json`), 'utf-8');
    return JSON.parse(raw) as ConsultRequest;
  } catch { return null; }
}

export async function updateConsult(id: string, patch: Partial<Pick<ConsultRequest, 'status' | 'notes' | 'slot'>> & { historyAction?: string; historyNote?: string }): Promise<ConsultRequest | null> {
  const cur = await getConsult(id);
  if (!cur) return null;
  const now = new Date().toISOString();
  const next: ConsultRequest = {
    ...cur,
    ...(patch.status ? { status: patch.status } : {}),
    ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
    ...(patch.slot !== undefined ? { slot: patch.slot ?? undefined } : {}),
    updatedAt: now,
    history: [...(cur.history ?? []), { at: now, action: patch.historyAction ?? 'updated', note: patch.historyNote }],
  };
  await fs.writeFile(path.join(CONSULT_DIR, `${id}.json`), JSON.stringify(next, null, 2), 'utf-8');
  return next;
}

// ── 방문 트래킹 (일별 집계 + 이벤트 로그) ──
export interface VisitEvent {
  at: string;
  path: string;
  lang?: string;
  referer?: string;
  ua_kind?: 'mobile' | 'tablet' | 'desktop' | 'bot';
  variant?: string;              // 'founder' | 'manager'
}

export interface DayVisits {
  date: string;                  // YYYY-MM-DD
  total: number;
  byPath: Record<string, number>;
  byLang: Record<string, number>;
  byUa: Record<string, number>;
  events: VisitEvent[];          // 최근 500개만 (오래된 것 잘림)
}

const MAX_EVENTS_PER_DAY = 500;

export async function trackVisit(ev: VisitEvent): Promise<void> {
  await fs.mkdir(VISITS_DIR, { recursive: true });
  const date = ev.at.slice(0, 10);
  const file = path.join(VISITS_DIR, `${date}.json`);
  let day: DayVisits;
  try {
    const raw = await fs.readFile(file, 'utf-8');
    day = JSON.parse(raw) as DayVisits;
  } catch {
    day = { date, total: 0, byPath: {}, byLang: {}, byUa: {}, events: [] };
  }
  day.total += 1;
  day.byPath[ev.path] = (day.byPath[ev.path] ?? 0) + 1;
  if (ev.lang) day.byLang[ev.lang] = (day.byLang[ev.lang] ?? 0) + 1;
  if (ev.ua_kind) day.byUa[ev.ua_kind] = (day.byUa[ev.ua_kind] ?? 0) + 1;
  day.events.push(ev);
  if (day.events.length > MAX_EVENTS_PER_DAY) day.events = day.events.slice(-MAX_EVENTS_PER_DAY);
  await fs.writeFile(file, JSON.stringify(day, null, 2), 'utf-8');
}

export async function listRecentVisits(days = 30): Promise<DayVisits[]> {
  await fs.mkdir(VISITS_DIR, { recursive: true });
  const files = (await fs.readdir(VISITS_DIR)).filter((f) => f.endsWith('.json')).sort().reverse().slice(0, days);
  const rows: DayVisits[] = [];
  for (const f of files) {
    try { rows.push(JSON.parse(await fs.readFile(path.join(VISITS_DIR, f), 'utf-8')) as DayVisits); } catch {}
  }
  return rows;
}

export function detectUaKind(ua: string): VisitEvent['ua_kind'] {
  const s = ua.toLowerCase();
  if (/bot|spider|crawler|slurp|yandex|bing/.test(s)) return 'bot';
  if (/ipad|tablet/.test(s)) return 'tablet';
  if (/mobile|iphone|android/.test(s)) return 'mobile';
  return 'desktop';
}
