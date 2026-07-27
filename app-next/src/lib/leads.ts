/**
 * 상담·모집 신청(leads) 파일 저장 (모비딕 방식 · 2026-07-20 Supabase 걷어냄)
 *   저장: content/leads/{id}.json  (한 건 = 한 파일)
 *   읽기: 목록 · 파일명(=ISO 타임스탬프)로 역정렬
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const LEADS_DIR = path.join(process.cwd(), "content", "leads");

// 2026-07-27 · 카톡 챗봇 시나리오 (docs/KAKAO-CHATBOT-SCENARIO-2026-07-27.md) 필드 확장
export type LeadSource = "direct" | "kakao_channel" | "kakao_k1" | "instagram" | "web_form" | "phone";
export type LeadTrack = "academy" | "procedure" | "info" | "live";
export type LeadInterest =
  | "startup_890" | "easy_69" | "hyperreal_169"
  | "brow" | "eyeline" | "lip" | "hairline" | "scar_removal"
  | "unsure";
export type LeadVisitTime = "weekday_am" | "weekday_pm" | "weekday_evening" | "weekend" | "any";
export type LeadLocation = "seonleung" | "samseong" | "any";

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  kakao_id?: string | null;
  email?: string | null;
  channel?: string | null;                  // (deprecated · use source)
  source?: LeadSource | null;               // 어느 채널에서 왔는가
  kakao_user_id?: string | null;            // 카톡 챗봇 재접속 매칭용
  track?: LeadTrack | null;                 // 수강·시술·정보·라이브
  interest?: LeadInterest | null;           // 관심 강의/시술
  visit_time?: LeadVisitTime | null;        // 방문 가능 시간
  location?: LeadLocation | null;           // 선호 지점 (시술만)
  message?: string | null;
  lang?: string | null;
  status: "new" | "contacted" | "consulted" | "converted" | "closed";
  notion_page_id?: string | null;           // Notion append 성공 시 page ID
};

export async function saveLead(input: Omit<Lead, "id" | "created_at" | "status">): Promise<Lead> {
  await fs.mkdir(LEADS_DIR, { recursive: true });
  const now = new Date();
  const created_at = now.toISOString();
  const stamp = created_at.replace(/[:.]/g, "-");
  const rand = Math.random().toString(36).slice(2, 8);
  const id = `${stamp}-${rand}`;
  const rec: Lead = {
    id,
    created_at,
    status: "new",
    name: input.name,
    phone: input.phone,
    kakao_id: input.kakao_id ?? null,
    email: input.email ?? null,
    channel: input.channel ?? "direct",
    source: input.source ?? (input.channel === "kakao_channel" ? "kakao_channel" : "direct"),
    kakao_user_id: input.kakao_user_id ?? null,
    track: input.track ?? null,
    interest: input.interest ?? null,
    visit_time: input.visit_time ?? null,
    location: input.location ?? null,
    message: input.message ?? null,
    lang: input.lang ?? "ko",
    notion_page_id: input.notion_page_id ?? null,
  };
  await fs.writeFile(path.join(LEADS_DIR, `${id}.json`), JSON.stringify(rec, null, 2), "utf-8");
  return rec;
}

export async function listLeads(limit = 100): Promise<Lead[]> {
  await fs.mkdir(LEADS_DIR, { recursive: true });
  const files = (await fs.readdir(LEADS_DIR))
    .filter((f) => f.endsWith(".json"))
    .sort() // 파일명이 ISO 타임스탬프여서 사전순 = 시간순
    .reverse()
    .slice(0, limit);
  const out: Lead[] = [];
  for (const f of files) {
    try {
      const raw = await fs.readFile(path.join(LEADS_DIR, f), "utf-8");
      out.push(JSON.parse(raw) as Lead);
    } catch { /* skip broken file */ }
  }
  return out;
}
