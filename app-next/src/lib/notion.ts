/**
 * Notion API append 클라이언트 (2026-07-27 · 카톡 챗봇 시나리오 §7·§8 연동)
 *   env: NOTION_API_KEY · NOTION_LEADS_DB_ID
 *   미설정 시 no-op (조용히 스킵 · leads 저장은 계속)
 *
 * DB 스키마 (docs/KAKAO-CHATBOT-SCENARIO-2026-07-27.md §8 참조)
 *   이름 (Title) · 연락처 (Phone) · 트랙 (Select) · 관심 (Select)
 *   방문 가능 (Select) · 지점 (Select) · 메모 (Text) · 소스 (Select)
 *   카카오 유저 ID (Text) · 상담 상태 (Select) · 접수일시 (Date) · 이력 링크 (URL)
 *
 * 노션 통합 페이지에서 이 DB에 「Connect」 권한을 준 후 사용.
 */
import type { Lead } from "./leads";

const API_KEY = process.env.NOTION_API_KEY;
const DB_ID = process.env.NOTION_LEADS_DB_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const TRACK_LABEL: Record<string, string> = {
  academy: "수강", procedure: "시술", info: "정보", live: "라이브",
};
const INTEREST_LABEL: Record<string, string> = {
  startup_890: "창업반 890", easy_69: "이지반 69", hyperreal_169: "극사실 169",
  brow: "눈썹", eyeline: "아이라인", lip: "입술", hairline: "헤어라인",
  scar_removal: "잔흔 복구", unsure: "미정",
};
const VISIT_LABEL: Record<string, string> = {
  weekday_am: "평일 오전", weekday_pm: "평일 오후", weekday_evening: "평일 저녁",
  weekend: "주말", any: "무관",
};
const LOCATION_LABEL: Record<string, string> = {
  seonleung: "선릉", samseong: "삼성", any: "무관",
};
const SOURCE_LABEL: Record<string, string> = {
  kakao_channel: "카톡 채널", kakao_k1: "K1 오픈채팅",
  instagram: "인스타", web_form: "홈페이지", phone: "전화", direct: "직접",
};

interface NotionResponse { id?: string; object?: string; message?: string; }

/**
 * Notion DB 에 lead 를 새 페이지로 append
 * env 미설정이면 null 반환 (silent skip)
 */
export async function notionAppendLead(lead: Lead): Promise<string | null> {
  if (!API_KEY || !DB_ID) return null;
  const props: Record<string, unknown> = {
    "이름": { title: [{ text: { content: lead.name } }] },
    "연락처": { phone_number: lead.phone },
    "메모": { rich_text: [{ text: { content: lead.message ?? "" } }] },
    "카카오 유저 ID": { rich_text: [{ text: { content: lead.kakao_user_id ?? "" } }] },
    "상담 상태": { select: { name: "신규" } },
    "접수일시": { date: { start: lead.created_at } },
    "이력 링크": { url: `${APP_URL}/admin/leads?id=${lead.id}` },
  };
  if (lead.track && TRACK_LABEL[lead.track])           props["트랙"]      = { select: { name: TRACK_LABEL[lead.track] } };
  if (lead.interest && INTEREST_LABEL[lead.interest])  props["관심"]      = { select: { name: INTEREST_LABEL[lead.interest] } };
  if (lead.visit_time && VISIT_LABEL[lead.visit_time]) props["방문 가능"] = { select: { name: VISIT_LABEL[lead.visit_time] } };
  if (lead.location && LOCATION_LABEL[lead.location])  props["지점"]      = { select: { name: LOCATION_LABEL[lead.location] } };
  if (lead.source && SOURCE_LABEL[lead.source])        props["소스"]      = { select: { name: SOURCE_LABEL[lead.source] } };

  try {
    const r = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parent: { database_id: DB_ID }, properties: props }),
    });
    const j = (await r.json().catch(() => ({}))) as NotionResponse;
    if (!r.ok) {
      console.error("[notion.append]", r.status, j?.message ?? "error");
      return null;
    }
    return j.id ?? null;
  } catch (e) {
    console.error("[notion.append.throw]", e);
    return null;
  }
}
