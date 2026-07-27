import { NextResponse } from 'next/server';
import { saveConsult, listConsults, type ConsultRequest } from '@/lib/admin/storage';
import { listSlots, type SlotKind } from '@/lib/admin/calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/consult — 상담 신청 접수
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.name || !body?.phone) {
      return NextResponse.json({ error: 'name / phone required' }, { status: 400 });
    }
    const ip = maskIp(req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '');
    const ua = req.headers.get('user-agent') ?? '';

    // 슬롯 검증 (요청 시)
    let slot: ConsultRequest['slot'];
    if (body.slot && body.slot.date && body.slot.time && body.slot.kind) {
      const kind = body.slot.kind as SlotKind;
      if (!['treatment_consult', 'course_consult', 'treatment_session'].includes(kind)) {
        return NextResponse.json({ error: 'invalid slot kind' }, { status: 400 });
      }
      const slots = await listSlots({ from: body.slot.date, to: body.slot.date, kind });
      const match = slots.find((s) => s.time === body.slot.time);
      if (!match) {
        return NextResponse.json({ error: '해당 슬롯 없음 (근무일/시간 확인)' }, { status: 400 });
      }
      if (match.status !== 'available') {
        return NextResponse.json({ error: '이미 예약된 시간입니다' }, { status: 409 });
      }
      slot = { date: body.slot.date, time: body.slot.time, kind, status: 'held' };
    }

    const rec: Omit<ConsultRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'history'> & { slot?: ConsultRequest['slot'] } = {
      type: (body.type === 'course' || body.type === 'other') ? body.type : 'treatment',
      name: String(body.name).slice(0, 60),
      phone: String(body.phone).slice(0, 30),
      kakao_id: body.kakao_id ? String(body.kakao_id).slice(0, 60) : undefined,
      instagram: body.instagram ? String(body.instagram).slice(0, 100) : undefined,
      email: body.email ? String(body.email).slice(0, 120) : undefined,
      course: body.course ? String(body.course).slice(0, 80) : undefined,
      channel: body.channel ? String(body.channel).slice(0, 40) : undefined,
      experience: body.experience ? String(body.experience).slice(0, 40) : undefined,
      message: body.message ? String(body.message).slice(0, 2000) : undefined,
      utm_source: body.utm_source ? String(body.utm_source).slice(0, 60) : undefined,
      utm_medium: body.utm_medium ? String(body.utm_medium).slice(0, 60) : undefined,
      utm_campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 100) : undefined,
      referer: req.headers.get('referer') ?? undefined,
      user_agent: ua,
      ip,
      slot,
    };
    const saved = await saveConsult(rec);
    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (err) {
    console.error('[api/consult POST]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 });
  }
}

// GET /api/consult — 운영자 · 목록
export async function GET() {
  try {
    const items = await listConsults();
    return NextResponse.json({ items });
  } catch (err) {
    console.error('[api/consult GET]', err);
    return NextResponse.json({ error: 'failed to list' }, { status: 500 });
  }
}

function maskIp(ip: string): string {
  if (!ip) return '';
  const first = ip.split(',')[0].trim();
  const parts = first.split('.');
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
  return first.slice(0, 20);
}
