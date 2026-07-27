import { listConsults } from '@/lib/admin/storage';
import { MessageComposer } from './MessageComposer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function MessagePage() {
  const consults = await listConsults();
  const hasSolapi = !!(process.env.SOLAPI_API_KEY && process.env.SOLAPI_API_SECRET && process.env.SOLAPI_SENDER);

  const recipients = consults
    .filter((c) => c.phone || c.email || c.kakao_id)
    .map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      kakao_id: c.kakao_id,
      status: c.status,
      type: c.type,
      createdAt: c.createdAt,
    }));

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 28, color: 'var(--ab-gold)', margin: 0 }}>✉️ 메시지 발송</h1>
        <p style={{ fontSize: 13, color: 'var(--ab-ivory-mute)', marginTop: 6 }}>
          상담 신청자 대상 SMS · 카카오 알림톡 · 이메일 일괄 발송.
        </p>
      </header>

      {!hasSolapi && (
        <div style={{
          padding: 14,
          border: '1px solid #FF7A9C',
          background: 'rgba(255, 122, 156, 0.05)',
          borderRadius: 4,
          fontSize: 13,
          color: '#FF7A9C',
          marginBottom: 20,
        }}>
          <b>준비 중</b> — Solapi API 키가 등록되지 않았습니다.
          <br />
          <span style={{ fontSize: 12, color: 'var(--ab-ivory-mute)' }}>
            .env.local 에 SOLAPI_API_KEY · SOLAPI_API_SECRET · SOLAPI_SENDER (발신번호) 를 설정하고 서버를 재시작하세요.
            지금은 UI 검증 · 발신 프리뷰만 가능합니다.
          </span>
        </div>
      )}

      <MessageComposer recipients={recipients} hasSolapi={hasSolapi} />
    </div>
  );
}
