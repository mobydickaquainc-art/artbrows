/**
 * POST /api/webhook/kakao-channel/skill
 *   Kakao i Open Builder 챗봇 시나리오 (docs/KAKAO-CHATBOT-SCENARIO-2026-07-27.md) skill webhook.
 *   요청은 카카오 스킬 프로토콜 · 응답은 3초 이내 카카오 SkillResponse JSON.
 *
 *   흐름:
 *     Kakao → 우리 서버 → { Supabase leads(파일) INSERT · Notion DB append · (선택) 대표님 친구톡 알림 }
 *          → Kakao SkillResponse (SimpleText + QuickReply)
 *
 *   보안: KAKAO_WEBHOOK_SECRET (env) 을 헤더 X-Kakao-Webhook-Secret 로 검증 (설정된 경우만)
 *   테스트: curl -X POST /api/webhook/kakao-channel/skill -H "Content-Type: application/json" -d @sample.json
 */
import { NextResponse } from "next/server";
import { saveLead, type LeadTrack, type LeadInterest, type LeadVisitTime, type LeadLocation } from "@/lib/leads";
import { notionAppendLead } from "@/lib/notion";
import { alimtalkToAdmins } from "@/lib/aligo";

// 알림톡 템플릿 코드 (카카오 심사 후 알리고 콘솔에서 부여받은 값 · env)
const TPL_LEAD_ADMIN = process.env.ALIGO_TPL_LEAD_ADMIN ?? "";

const INTEREST_LABEL: Record<string, string> = {
  startup_890: "창업반 890", easy_69: "이지반 69", hyperreal_169: "극사실 169",
  brow: "눈썹", eyeline: "아이라인", lip: "입술", hairline: "헤어라인",
  scar_removal: "잔흔 복구", unsure: "미정",
};
const VISIT_LABEL: Record<string, string> = {
  weekday_am: "평일 오전", weekday_pm: "평일 오후", weekday_evening: "평일 저녁",
  weekend: "주말", any: "무관",
};

export const runtime = "nodejs";
export const maxDuration = 8;   // 여유 (Kakao 자체는 5s 요구 · 우리는 3s 이내 응답 목표)

// ─── Kakao Skill 프로토콜 최소 스펙 ───
interface KakaoSkillRequest {
  intent?: { id?: string; name?: string };
  userRequest?: {
    utterance?: string;
    user?: { id?: string };
  };
  action?: {
    params?: Record<string, string | undefined>;
  };
}

interface KakaoSkillResponse {
  version: "2.0";
  template: {
    outputs: Array<{ simpleText?: { text: string } }>;
    quickReplies?: Array<{ label: string; action: "webLink" | "message"; webLinkUrl?: string; messageText?: string }>;
  };
}

const K1_URL = "https://open.kakao.com/o/gWeAkSzi";

// ─── param 정규화 ───
function coerceTrack(v: unknown): LeadTrack | null {
  const s = String(v ?? "").toLowerCase();
  return (["academy", "procedure", "info", "live"] as LeadTrack[]).includes(s as LeadTrack) ? (s as LeadTrack) : null;
}
function coerceInterest(v: unknown): LeadInterest | null {
  const s = String(v ?? "").toLowerCase();
  const ok: LeadInterest[] = ["startup_890", "easy_69", "hyperreal_169", "brow", "eyeline", "lip", "hairline", "scar_removal", "unsure"];
  return ok.includes(s as LeadInterest) ? (s as LeadInterest) : null;
}
function coerceVisitTime(v: unknown): LeadVisitTime | null {
  const s = String(v ?? "").toLowerCase();
  const ok: LeadVisitTime[] = ["weekday_am", "weekday_pm", "weekday_evening", "weekend", "any"];
  return ok.includes(s as LeadVisitTime) ? (s as LeadVisitTime) : null;
}
function coerceLocation(v: unknown): LeadLocation | null {
  const s = String(v ?? "").toLowerCase();
  const ok: LeadLocation[] = ["seonleung", "samseong", "any"];
  return ok.includes(s as LeadLocation) ? (s as LeadLocation) : null;
}

function reply(text: string, includeK1: boolean = true): KakaoSkillResponse {
  const quickReplies: KakaoSkillResponse["template"]["quickReplies"] = [];
  if (includeK1) quickReplies.push({ label: "K1 무료 강의방 참여", action: "webLink", webLinkUrl: K1_URL });
  quickReplies.push({ label: "처음으로", action: "message", messageText: "안녕하세요" });
  return {
    version: "2.0",
    template: { outputs: [{ simpleText: { text } }], quickReplies },
  };
}

export async function POST(req: Request) {
  // 시크릿 검증 (설정된 경우만)
  const secret = process.env.KAKAO_WEBHOOK_SECRET;
  if (secret) {
    const provided = req.headers.get("X-Kakao-Webhook-Secret") ?? "";
    if (provided !== secret) {
      return NextResponse.json(reply("접수에 실패했습니다. 잠시 후 다시 시도해주세요.", false), { status: 200 });
    }
  }

  let body: KakaoSkillRequest;
  try { body = (await req.json()) as KakaoSkillRequest; }
  catch { return NextResponse.json(reply("요청 본문을 이해하지 못했어요.", false), { status: 200 }); }

  const p = body.action?.params ?? {};
  const kakaoUserId = body.userRequest?.user?.id ?? null;

  // 필수: 이름 · 연락처
  const name = String(p.name ?? "").trim();
  const phone = String(p.phone ?? "").trim().replace(/[^0-9\-+]/g, "");
  if (!name || !phone) {
    return NextResponse.json(reply("성함과 연락처가 확인되지 않습니다. 다시 한 번 입력해주세요.", false), { status: 200 });
  }

  // 정규화
  const track = coerceTrack(p.track);
  const interest = coerceInterest(p.interest);
  const visit_time = coerceVisitTime(p.visitTime);
  const location = coerceLocation(p.location);

  try {
    const lead = await saveLead({
      name, phone,
      channel: "kakao_channel",
      source: "kakao_channel",
      kakao_user_id: kakaoUserId,
      track, interest, visit_time, location,
      message: p.note ? String(p.note).trim() : null,
      lang: "ko",
    });

    // Notion append 는 비동기 · 실패해도 카카오 응답에는 영향 X (env 없으면 조용히 skip)
    notionAppendLead(lead).catch((e) => console.error("[notion.append.async]", e));

    // 알림톡 관리자 발송 (알리고 · env 미설정 시 콘솔 MOCK · 카카오 응답엔 영향 X)
    // 템플릿: docs/KAKAO-ALIMTALK-TEMPLATES-2026-07-27.md #1 「신규 상담」
    if (TPL_LEAD_ADMIN) {
      const trackText = track === "procedure" ? "시술" : track === "academy" ? "수강" : "일반";
      const interestText = interest ? (INTEREST_LABEL[interest] ?? interest) : "미정";
      const visitText = visit_time ? (VISIT_LABEL[visit_time] ?? visit_time) : "미정";
      const adminMsg = [
        "[장미지 ARTbrows] 신규 상담 접수",
        "",
        `구분: ${trackText}`,
        `이름: ${name}`,
        `연락처: ${phone}`,
        `관심: ${interestText}`,
        `방문 가능: ${visitText}`,
        p.note ? `메모: ${String(p.note).trim().slice(0, 60)}` : null,
        "",
        `상세: ${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/admin/leads?id=${lead.id}`,
      ].filter(Boolean).join("\n");
      alimtalkToAdmins(TPL_LEAD_ADMIN, `신규 상담 · ${name}`, adminMsg)
        .then((r) => console.log(`[aligo.admins] sent=${r.sent} failed=${r.failed}`))
        .catch((e) => console.error("[aligo.admins.async]", e));
    }

    const trackText = track === "procedure" ? "시술 상담" : "수강 상담";
    const summary = [
      `✅ ${trackText} 접수 완료!`,
      "",
      `성함: ${name}`,
      `연락처: ${phone}`,
      interest ? `관심: ${interest.replace("_", " ")}` : null,
      visit_time ? `상담 가능: ${visit_time.replace("_", " ")}` : null,
      location ? `지점: ${location}` : null,
      "",
      "원장님이 24시간 안 답 드립니다 💛",
    ].filter(Boolean).join("\n");

    return NextResponse.json(reply(summary, track === "academy"), { status: 200 });
  } catch (e) {
    console.error("[kakao.skill.error]", e);
    return NextResponse.json(reply("일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.", false), { status: 200 });
  }
}

// health-check (GET) — 배포 확인용
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "/api/webhook/kakao-channel/skill", version: "1.0", ts: new Date().toISOString() });
}
