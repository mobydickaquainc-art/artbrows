import { NextResponse } from 'next/server';
import { toggleBlock, listBlocks, getConfig, saveConfig } from '@/lib/admin/calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/calendar/block  body: { date, reason? }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
      return NextResponse.json({ error: 'date YYYY-MM-DD required' }, { status: 400 });
    }
    const res = await toggleBlock(body.date, body.reason);
    return NextResponse.json({ ok: true, ...res });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 });
  }
}

// GET /api/calendar/block?from=&to=
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    if (!from || !to) return NextResponse.json({ error: 'from, to required' }, { status: 400 });
    const blocks = await listBlocks(from, to);
    return NextResponse.json({ blocks });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 });
  }
}

// PATCH /api/calendar/block  body: partial config (근무일 등)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const cur = await getConfig();
    const next = {
      ...cur,
      ...(Array.isArray(body.workingDays) ? { workingDays: body.workingDays.filter((n: unknown) => typeof n === 'number' && n >= 0 && n <= 6) } : {}),
      ...(body.slotTemplates ? { slotTemplates: { ...cur.slotTemplates, ...body.slotTemplates } } : {}),
      ...(typeof body.holdHours === 'number' ? { holdHours: body.holdHours } : {}),
      ...(typeof body.horizonDays === 'number' ? { horizonDays: body.horizonDays } : {}),
    };
    await saveConfig(next);
    return NextResponse.json({ ok: true, config: next });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 });
  }
}
