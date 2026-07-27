import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getConsult } from '@/lib/admin/storage';
import { ConsultDetailForm } from './ConsultDetailForm';
import { SlotConfirmButtons } from './SlotConfirmButtons';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ConsultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getConsult(id);
  if (!item) notFound();

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <Link href="/admin/consult" style={{ fontSize: 12, color: 'var(--ab-gold-light)', textDecoration: 'none' }}>← 목록으로</Link>
      </div>
      <h1 style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 24, color: 'var(--ab-gold)', margin: '0 0 4px' }}>
        {item.name} <span style={{ fontSize: 13, color: 'var(--ab-ivory-mute)', fontFamily: 'var(--ab-font-body-latin)' }}>· {item.id.slice(0, 8)}</span>
      </h1>
      <p style={{ fontSize: 12, color: 'var(--ab-ivory-mute)', margin: '0 0 24px' }}>
        접수 {new Date(item.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
        {item.updatedAt !== item.createdAt && ` · 갱신 ${new Date(item.updatedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={card}>
          <h3 style={cardH}>연락 정보</h3>
          <Row k="유형" v={item.type} />
          <Row k="전화" v={item.phone} mono />
          <Row k="카카오톡" v={item.kakao_id} />
          <Row k="인스타그램" v={item.instagram} />
          <Row k="이메일" v={item.email} />
          <Row k="메시지 채널" v={item.channel} />
        </div>
        <div style={card}>
          <h3 style={cardH}>문의 내용</h3>
          <Row k="관심 수업" v={item.course} />
          <Row k="경력·상태" v={item.experience} />
          {item.message && (
            <div style={{ marginTop: 12, padding: 12, background: '#0F0D0B', borderRadius: 4, fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {item.message}
            </div>
          )}
        </div>
      </div>

      {item.slot && (
        <div style={{ ...card, marginBottom: 24, border: item.slot.status === 'confirmed' ? '1px solid var(--ab-gold)' : '1px solid #FF7A9C' }}>
          <h3 style={cardH}>📅 예약 슬롯</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 22, fontFamily: 'var(--ab-font-headline)', color: 'var(--ab-gold)', fontWeight: 700 }}>
                {item.slot.date} <span style={{ fontSize: 18 }}>{item.slot.time}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ab-ivory-mute)', marginTop: 4 }}>
                {item.slot.kind === 'treatment_consult' ? '시술 상담' : item.slot.kind === 'course_consult' ? '수강 상담' : '실 시술'}
                {' · '}
                상태: <b style={{ color: item.slot.status === 'confirmed' ? 'var(--ab-gold)' : item.slot.status === 'released' ? 'var(--ab-ivory-mute)' : '#FF7A9C' }}>
                  {item.slot.status === 'held' ? '홀드 (승인 대기)' : item.slot.status === 'confirmed' ? '확정' : '해제'}
                </b>
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <SlotConfirmButtons id={item.id} status={item.slot.status} />
            </div>
          </div>
        </div>
      )}

      <div style={card}>
        <h3 style={cardH}>유입 경로</h3>
        <Row k="UTM 소스" v={item.utm_source} />
        <Row k="UTM 매체" v={item.utm_medium} />
        <Row k="UTM 캠페인" v={item.utm_campaign} />
        <Row k="Referer" v={item.referer} mono />
        <Row k="User Agent" v={item.user_agent} mono />
        <Row k="IP (부분 가림)" v={item.ip} mono />
      </div>

      <ConsultDetailForm id={item.id} status={item.status} notes={item.notes ?? ''} />

      {item.history && item.history.length > 0 && (
        <div style={{ ...card, marginTop: 24 }}>
          <h3 style={cardH}>이력</h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12 }}>
            {[...item.history].reverse().map((h, i) => (
              <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--ab-line)' }}>
                <div style={{ color: 'var(--ab-ivory-mute)' }}>{new Date(h.at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</div>
                <div>{h.action}</div>
                {h.note && <div style={{ color: 'var(--ab-ivory-mute)' }}>{h.note}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v?: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '5px 0', fontSize: 13 }}>
      <div style={{ width: 110, color: 'var(--ab-ivory-mute)', flexShrink: 0 }}>{k}</div>
      <div style={{ color: v ? 'var(--ab-ivory)' : 'var(--ab-ivory-mute)', fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>
        {v || '—'}
      </div>
    </div>
  );
}

const card: React.CSSProperties = { padding: 16, border: '1px solid var(--ab-line)', borderRadius: 6, background: '#0F0D0B' };
const cardH: React.CSSProperties = { margin: '0 0 12px', fontSize: 13, color: 'var(--ab-gold)', letterSpacing: '0.08em', fontFamily: 'var(--ab-font-headline)' };
