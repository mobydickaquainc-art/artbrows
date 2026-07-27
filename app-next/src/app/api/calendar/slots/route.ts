import { NextResponse } from 'next/server';
import { listSlots, type SlotKind } from '@/lib/admin/calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/calendar/slots?from=YYYY-MM-DD&to=YYYY-MM-DD&kind=treatment_consult
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const kind = searchParams.get('kind') as SlotKind | null;
    if (!from || !to || !kind) {
      return NextResponse.json({ error: 'from, to, kind required' }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
      return NextResponse.json({ error: 'date format YYYY-MM-DD' }, { status: 400 });
    }
    const slots = await listSlots({ from, to, kind });
    return NextResponse.json({ slots });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 });
  }
}
