import { NextResponse } from "next/server";
import { listEvents } from "@/lib/events";

export const runtime = "nodejs";

// GET /api/events?months=3&limit=300 — 최근 이벤트 (역순)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const months = Math.min(24, Math.max(1, Number(url.searchParams.get("months")) || 3));
  const limit = Math.min(1000, Math.max(1, Number(url.searchParams.get("limit")) || 300));
  try {
    const items = await listEvents({ months, limit });
    return NextResponse.json({ items });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ items: [], error: msg }, { status: 500 });
  }
}
