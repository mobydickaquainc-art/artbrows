import Link from 'next/link';
import { listConsults, type ConsultStatus } from '@/lib/admin/storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const STATUS_LABEL: Record<ConsultStatus, string> = {
  new: '신규',
  contacted: '연락함',
  booked: '예약',
  done: '완료',
  canceled: '취소',
};

const STATUS_COLOR: Record<ConsultStatus, string> = {
  new: '#FF7A9C',
  contacted: '#C9A66B',
  booked: '#7ABF9A',
  done: '#7A9CBF',
  canceled: '#6A6864',
};

const TYPE_LABEL: Record<string, string> = {
  treatment: '시술',
  course: '수강',
  other: '기타',
};

export default async function AdminConsultPage() {
  const consults = await listConsults();
  const counts = consults.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: 32, maxWidth: 1400, margin: '0 auto' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 28, color: 'var(--ab-gold)', margin: 0 }}>💬 상담 신청 게시판</h1>
        <p style={{ fontSize: 13, color: 'var(--ab-ivory-mute)', marginTop: 6 }}>
          총 <b style={{ color: 'var(--ab-ivory)' }}>{consults.length}</b>건
          {(['new', 'contacted', 'booked', 'done', 'canceled'] as ConsultStatus[]).map((s) => (
            <span key={s} style={{ marginLeft: 14 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: STATUS_COLOR[s], marginRight: 5 }} />
              {STATUS_LABEL[s]} {counts[s] ?? 0}
            </span>
          ))}
        </p>
      </header>

      {consults.length === 0 ? (
        <div style={emptyBox}>
          아직 신청된 상담이 없습니다.
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ab-ivory-mute)' }}>
            홈페이지의 「상담 신청」 폼으로 접수된 데이터가 여기에 표시됩니다.
          </div>
        </div>
      ) : (
        <div style={{ overflow: 'auto', border: '1px solid var(--ab-line)', borderRadius: 6 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#141210', textAlign: 'left', color: 'var(--ab-gold-light)' }}>
                <th style={th}>상태</th>
                <th style={th}>유형</th>
                <th style={th}>이름</th>
                <th style={th}>연락처</th>
                <th style={th}>수업/문의</th>
                <th style={th}>채널</th>
                <th style={th}>메시지</th>
                <th style={th}>접수일시</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {consults.map((c) => (
                <tr key={c.id} style={{ borderTop: '1px solid var(--ab-line)' }}>
                  <td style={td}>
                    <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 3, background: STATUS_COLOR[c.status], color: '#0B0907', fontWeight: 600, fontSize: 11 }}>
                      {STATUS_LABEL[c.status]}
                    </span>
                  </td>
                  <td style={td}>{TYPE_LABEL[c.type] ?? c.type}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{c.name}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{c.phone}</td>
                  <td style={td}>{c.course ?? '-'}</td>
                  <td style={td}>{c.channel ?? '-'}</td>
                  <td style={{ ...td, maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--ab-ivory-mute)' }}>
                    {c.message ?? '-'}
                  </td>
                  <td style={{ ...td, fontSize: 11, color: 'var(--ab-ivory-mute)' }}>{formatKST(c.createdAt)}</td>
                  <td style={td}>
                    <Link href={`/admin/consult/${c.id}`} style={linkBtn}>상세</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: '10px 12px', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em' };
const td: React.CSSProperties = { padding: '10px 12px', verticalAlign: 'middle' };
const emptyBox: React.CSSProperties = {
  padding: 60,
  textAlign: 'center',
  border: '1px dashed var(--ab-line)',
  borderRadius: 6,
  color: 'var(--ab-ivory)',
  fontFamily: 'var(--ab-font-body)',
};
const linkBtn: React.CSSProperties = {
  padding: '4px 10px',
  border: '1px solid var(--ab-gold)',
  color: 'var(--ab-gold)',
  textDecoration: 'none',
  fontSize: 11,
  borderRadius: 3,
};

function formatKST(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}
