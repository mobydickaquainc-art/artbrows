import { NextResponse } from "next/server";
import { supabase, isSupabaseReady } from "@/lib/supabase";

/**
 * GET /api/health
 *  - Supabase 연결 검증 (env 로드 OK · ping · 테이블 존재 확인)
 */
export async function GET() {
  if (!isSupabaseReady() || !supabase) {
    return NextResponse.json({ ok: false, stage: "env", message: "Supabase env not set" });
  }

  // 1) 직접 REST 호출로 테이블 존재 확인 (Supabase JS 클라이언트가 PGRST205 를 묵음 처리하는 이슈 회피)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const tables = ["leads", "members", "products", "orders", "posts", "uploads", "events"];
  const results: Record<string, string> = {};

  for (const t of tables) {
    const res = await fetch(`${url}/rest/v1/${t}?select=*&limit=0`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (res.ok) {
      results[t] = "ok";
    } else {
      const body = await res.json().catch(() => ({}));
      results[t] = body.code === "PGRST205" ? "MISSING (migration not applied)" : `error: ${body.message ?? res.statusText}`;
    }
  }

  const allOk = Object.values(results).every((v) => v === "ok");

  return NextResponse.json({
    ok: allOk,
    stage: allOk ? "ready" : "migration_required",
    tables: results,
    hint: allOk
      ? undefined
      : "Supabase Dashboard → SQL Editor 에서 app-next/supabase/migrations/0001_init.sql 통째로 붙여넣고 Run.",
  });
}
