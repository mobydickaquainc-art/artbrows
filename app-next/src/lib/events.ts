/**
 * 활동 이벤트 파일 로그 (모비딕 방식 · 2026-07-20 Supabase 걷어냄)
 *   저장: content/events/YYYY-MM.jsonl  (월 단위 append-only)
 *   읽기: 최근 300건 (역순)
 *
 * 이벤트 타입 예: lead_submit · sms_sent · order_paid · member_signup · login
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const EVENTS_DIR = path.join(process.cwd(), "content", "events");

export type EventRecord = {
  id: string;
  created_at: string;
  event_type: string;
  page_path?: string | null;
  data?: Record<string, unknown> | null;
};

function monthFile(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return path.join(EVENTS_DIR, `${y}-${m}.jsonl`);
}

export async function logEvent(input: {
  event_type: string;
  page_path?: string | null;
  data?: Record<string, unknown> | null;
}): Promise<EventRecord> {
  await fs.mkdir(EVENTS_DIR, { recursive: true });
  const now = new Date();
  const rec: EventRecord = {
    id: `${now.toISOString().replace(/[:.]/g, "-")}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: now.toISOString(),
    event_type: input.event_type,
    page_path: input.page_path ?? null,
    data: input.data ?? null,
  };
  await fs.appendFile(monthFile(now), JSON.stringify(rec) + "\n", "utf-8");
  return rec;
}

// 최근 N개월 이벤트 (역순) — default 3개월 · 최대 limit 건
export async function listEvents(opts?: { months?: number; limit?: number }): Promise<EventRecord[]> {
  const months = opts?.months ?? 3;
  const limit = opts?.limit ?? 300;
  await fs.mkdir(EVENTS_DIR, { recursive: true });

  const now = new Date();
  const files: string[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    files.push(monthFile(d));
  }

  const out: EventRecord[] = [];
  for (const f of files) {
    try {
      const raw = await fs.readFile(f, "utf-8");
      for (const line of raw.split("\n")) {
        const t = line.trim();
        if (!t) continue;
        try {
          out.push(JSON.parse(t) as EventRecord);
        } catch { /* skip malformed line */ }
      }
    } catch { /* file may not exist yet */ }
  }
  out.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return out.slice(0, limit);
}
