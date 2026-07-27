import { NextResponse } from "next/server";
import { saveLead, listLeads } from "@/lib/leads";
import { logEvent } from "@/lib/events";

export const runtime = "nodejs";

/**
 * POST /api/leads
 *   상담·모집 신청 폼 → content/leads/{id}.json 파일 저장 (모비딕 방식)
 *   + activity events 자동 기록 (content/events/YYYY-MM.jsonl)
 */
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const { name, phone, message, channel, kakao_id, email, lang } = body as {
    name?: string; phone?: string; message?: string; channel?: string;
    kakao_id?: string; email?: string; lang?: string;
  };

  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "name·phone required" }, { status: 400 });
  }

  try {
    const lead = await saveLead({ name, phone, message, channel, kakao_id, email, lang });
    // 활동 히스토리 자동 기록
    await logEvent({
      event_type: "lead_submit",
      page_path: "/enroll",
      data: {
        lead_id: lead.id,
        name,
        phone: phone ? `${phone.slice(0, 3)}-****-${phone.slice(-4)}` : null,
        channel: lead.channel,
        kakao_id: kakao_id ?? null,
        lang: lead.lang,
      },
    }).catch(() => { /* events 는 best-effort */ });

    return NextResponse.json({ ok: true, lead });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

/**
 * GET /api/leads
 *   관리자 목록 · content/leads/*.json 읽어 역순 반환
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit")) || 100));
  try {
    const items = await listLeads(limit);
    return NextResponse.json({ items });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ items: [], error: msg }, { status: 500 });
  }
}
