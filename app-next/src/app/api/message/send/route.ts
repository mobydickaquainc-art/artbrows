import { NextResponse } from 'next/server';
import { listConsults, updateConsult } from '@/lib/admin/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/message/send
// body: { channel: 'sms'|'kakao'|'email', body: string, targets: string[] (consult ids) }
export async function POST(req: Request) {
  try {
    const { channel, body, targets } = await req.json();
    if (!channel || !body || !Array.isArray(targets) || targets.length === 0) {
      return NextResponse.json({ error: 'invalid input' }, { status: 400 });
    }
    const consults = await listConsults();
    const map = new Map(consults.map((c) => [c.id, c]));
    const rows = targets.map((id: string) => map.get(id)).filter(Boolean) as NonNullable<ReturnType<typeof map.get>>[];
    if (rows.length === 0) return NextResponse.json({ error: 'no targets' }, { status: 400 });

    const solapiKey = process.env.SOLAPI_API_KEY;
    const solapiSecret = process.env.SOLAPI_API_SECRET;
    const solapiSender = process.env.SOLAPI_SENDER;
    const hasSolapi = !!(solapiKey && solapiSecret && solapiSender);

    let sent = 0;
    const errors: string[] = [];

    for (const r of rows) {
      const rendered = body.replace(/\{name\}/g, r.name).replace(/\{date\}/g, '');
      // 지금 시점 : 이력만 기록 · Solapi 실 호출은 hasSolapi 인 경우만
      if (hasSolapi && (channel === 'sms' || channel === 'kakao')) {
        // Solapi 실 호출은 서명 로직 필요 (별도 함수) · 여기선 미구현 표시
        // TODO: solapi API 실 호출
        try {
          await updateConsult(r.id, { historyAction: `[dry] ${channel} 발송`, historyNote: rendered.slice(0, 60) });
          sent += 1;
        } catch (err) {
          errors.push(`${r.name}: ${err instanceof Error ? err.message : 'failed'}`);
        }
      } else {
        // 드라이런 · 이력에만 기록
        await updateConsult(r.id, { historyAction: `[dryrun] ${channel} 발송 준비`, historyNote: rendered.slice(0, 60) });
        sent += 1;
      }
    }

    return NextResponse.json({
      ok: true,
      dryRun: !hasSolapi,
      channel,
      count: sent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 });
  }
}
