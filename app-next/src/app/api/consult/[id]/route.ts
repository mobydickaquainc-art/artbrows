import { NextResponse } from 'next/server';
import { getConsult, updateConsult, type ConsultStatus } from '@/lib/admin/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const r = await getConsult(id);
  if (!r) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ item: r });
}

// PATCH /api/consult/[id]  body: { status?, notes?, historyAction?, historyNote? }
export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const ALLOWED: ConsultStatus[] = ['new', 'contacted', 'booked', 'done', 'canceled'];
  const patch: Parameters<typeof updateConsult>[1] = {};
  if (body.status && ALLOWED.includes(body.status)) patch.status = body.status;
  if (typeof body.notes === 'string') patch.notes = body.notes.slice(0, 4000);
  if (body.historyAction) patch.historyAction = String(body.historyAction).slice(0, 40);
  if (body.historyNote) patch.historyNote = String(body.historyNote).slice(0, 500);
  // 슬롯 상태 변경 (confirm/release)
  if (body.slotAction === 'confirm' || body.slotAction === 'release') {
    const cur = await getConsult(id);
    if (cur?.slot) {
      patch.slot = { ...cur.slot, status: body.slotAction === 'confirm' ? 'confirmed' : 'released' };
      patch.historyAction = body.slotAction === 'confirm' ? 'slot confirmed' : 'slot released';
      if (body.slotAction === 'confirm' && !patch.status) patch.status = 'booked';
    }
  }
  const r = await updateConsult(id, patch);
  if (!r) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ item: r });
}
