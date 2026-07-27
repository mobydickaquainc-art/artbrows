import { NextResponse } from 'next/server';
import { listRecentVisits, listConsults } from '@/lib/admin/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/analytics — 대시보드 요약
export async function GET() {
  try {
    const [days, consults] = await Promise.all([listRecentVisits(30), listConsults()]);
    // 집계
    const totalVisits = days.reduce((s, d) => s + d.total, 0);
    const today = new Date().toISOString().slice(0, 10);
    const todayVisits = days.find((d) => d.date === today)?.total ?? 0;
    const byPath: Record<string, number> = {};
    const byLang: Record<string, number> = {};
    const byUa: Record<string, number> = {};
    for (const d of days) {
      for (const [k, v] of Object.entries(d.byPath)) byPath[k] = (byPath[k] ?? 0) + v;
      for (const [k, v] of Object.entries(d.byLang)) byLang[k] = (byLang[k] ?? 0) + v;
      for (const [k, v] of Object.entries(d.byUa)) byUa[k] = (byUa[k] ?? 0) + v;
    }
    const topPaths = Object.entries(byPath).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const consultCounts = consults.reduce<Record<string, number>>((acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1;
      return acc;
    }, {});
    return NextResponse.json({
      visits: {
        total: totalVisits,
        today: todayVisits,
        byDate: days.map((d) => ({ date: d.date, total: d.total })).sort((a, b) => a.date.localeCompare(b.date)),
        topPaths,
        byLang,
        byUa,
      },
      consults: {
        total: consults.length,
        counts: consultCounts,
        recent: consults.slice(0, 5),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 });
  }
}
