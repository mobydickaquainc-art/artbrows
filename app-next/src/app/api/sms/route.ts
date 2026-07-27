import { NextResponse } from "next/server";
import { logEvent } from "@/lib/events";

export const runtime = "nodejs";

/**
 * POST /api/sms
 *  - 문자(SMS/LMS) 발송 — Solapi REST API 사용
 *  - 환경변수: SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_SENDER (발신번호)
 *  - 키 없으면 mock 응답 반환 (UI 흐름 검증용)
 *  - 발송 결과는 파일 이벤트 로그(content/events/YYYY-MM.jsonl) 에 자동 기록
 */
const SOLAPI_KEY = process.env.SOLAPI_API_KEY ?? "";
const SOLAPI_SECRET = process.env.SOLAPI_API_SECRET ?? "";
const SOLAPI_SENDER = process.env.SOLAPI_SENDER ?? "";

async function solapiSend(to: string, text: string) {
  if (!SOLAPI_KEY || !SOLAPI_SECRET || !SOLAPI_SENDER) {
    return { mock: true, message: "SOLAPI env not configured — would have sent", to, text: text.slice(0, 60) };
  }

  const date = new Date().toISOString();
  const salt = Math.random().toString(36).substring(2, 15);
  const crypto = await import("node:crypto");
  const hmac = crypto.createHmac("sha256", SOLAPI_SECRET);
  hmac.update(date + salt);
  const signature = hmac.digest("hex");

  const body = {
    message: { to, from: SOLAPI_SENDER, text },
  };

  const resp = await fetch("https://api.solapi.com/messages/v4/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `HMAC-SHA256 apiKey=${SOLAPI_KEY}, date=${date}, salt=${salt}, signature=${signature}`,
    },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data?.errorMessage || `Solapi ${resp.status}`);
  return { ok: true, result: data };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lead_id, to, text } = body as { lead_id?: string; to: string; text: string };
    if (!to || !text) return NextResponse.json({ ok: false, error: "to·text required" }, { status: 400 });

    const sendResult = await solapiSend(to, text);

    // 파일 이벤트 로그
    await logEvent({
      event_type: "sms_sent",
      page_path: "/admin",
      data: {
        lead_id: lead_id ?? null,
        to: to ? `${to.slice(0, 3)}-****-${to.slice(-4)}` : null,
        text_preview: text.slice(0, 80),
        text_length: text.length,
        mock: "mock" in sendResult ? sendResult.mock : false,
      },
    }).catch(() => { /* best-effort */ });

    return NextResponse.json({ ok: true, ...sendResult });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
