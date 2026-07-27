import Link from 'next/link';
import '@/lib/artbrows/tokens.css';

export const metadata = { title: '운영자 · ARTbrows' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0907', color: 'var(--ab-ivory)', fontFamily: 'var(--ab-font-body)' }}>
      <nav style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid var(--ab-line)', background: '#0F0D0B' }}>
        <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 15, color: 'var(--ab-gold)', fontWeight: 800, letterSpacing: '0.1em' }}>ARTbrows · Admin</div>
        <div style={{ display: 'flex', gap: 4, marginLeft: 20 }}>
          <Link href="/admin" style={navLink}>📊 대시보드</Link>
          <Link href="/admin/consult" style={navLink}>💬 상담 신청</Link>
          <Link href="/admin/calendar" style={navLink}>📅 예약 캘린더</Link>
          <Link href="/admin/leads" style={navLink}>📇 모집 신청(Supabase)</Link>
          <Link href="/admin/message" style={navLink}>✉️ 메시지 발송</Link>
          <Link href="/admin/history" style={navLink}>📜 히스토리</Link>
          <Link href="/cardnews" style={navLink}>🃏 카드뉴스</Link>
        </div>
        <Link href="/" style={{ ...navLink, marginLeft: 'auto' }}>← 홈으로</Link>
      </nav>
      {children}
    </div>
  );
}

const navLink: React.CSSProperties = {
  padding: '6px 14px',
  fontSize: 12.5,
  color: 'var(--ab-gold-light)',
  textDecoration: 'none',
  fontFamily: 'var(--ab-font-body-latin)',
  letterSpacing: '0.05em',
  borderRadius: 3,
};
