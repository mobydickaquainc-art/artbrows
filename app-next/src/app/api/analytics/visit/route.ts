import { NextResponse } from 'next/server';
import { trackVisit, detectUaKind } from '@/lib/admin/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/analytics/visit
// body: { path, lang?, variant? }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    if (!body?.path || typeof body.path !== 'string') return NextResponse.json({ error: 'path required' }, { status: 400 });
    const ua = req.headers.get('user-agent') ?? '';
    await trackVisit({
      at: new Date().toISOString(),
      path: String(body.path).slice(0, 200),
      lang: body.lang ? String(body.lang).slice(0, 8) : undefined,
      referer: req.headers.get('referer') ?? undefined,
      ua_kind: detectUaKind(ua),
      variant: body.variant ? String(body.variant).slice(0, 20) : undefined,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 });
  }
}
