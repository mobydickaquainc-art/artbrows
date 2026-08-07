/**
 * /preview/b · 안 B · 원장 시안 이미지 원본 · 2026-08-07
 * 이미지 자체를 모바일 페이지 폭으로 세로 스크롤 렌더 · 시안 100% 원본 재현
 * 상단에 얇은 뒤로가기 바 · 하단에 원장 선택 CTA
 */
import Link from 'next/link';

const MOCKUP_SRC = '/preview/original-mockup-2026-08-06.jpg';

export const metadata = {
  title: 'B안 · 시안 원본 · 원장 시안 · ARTbrows',
  description: '원장님 2026-08-06 시안 이미지 원본 그대로',
};

export default function PreviewB() {
  return (
    <main style={{
      minHeight: '100vh', background: '#0B0907', color: '#F5EDE3',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: "'Pretendard', -apple-system, sans-serif",
    }}>
      {/* 상단 뒤로가기 */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        width: '100%', maxWidth: 520,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'rgba(11,9,7,.92)',
        borderBottom: '1px solid rgba(224,192,136,.18)',
        backdropFilter: 'blur(10px)',
      }}>
        <Link href="/preview" style={{ color: '#E0C088', fontSize: 12, letterSpacing: '.05em', textDecoration: 'none', fontWeight: 700 }}>
          ← 안 고르기로
        </Link>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: '.24em', color: '#8A7B6C' }}>
          OPTION B · MOCKUP
        </span>
      </nav>

      {/* 시안 이미지 · 모바일 폭 최대 520 (인스타 스크린 기준) */}
      <div style={{ width: '100%', maxWidth: 520, background: '#0B0907', lineHeight: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MOCKUP_SRC}
          alt="원장님 2026-08-06 시안 원본"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* 하단 CTA */}
      <div style={{
        width: '100%', maxWidth: 520,
        padding: '20px 16px calc(20px + env(safe-area-inset-bottom, 0))',
        borderTop: '1px solid rgba(224,192,136,.2)',
        background: '#0B0907',
      }}>
        <div style={{ fontSize: 12, color: '#8A7B6C', textAlign: 'center', marginBottom: 12, lineHeight: 1.6 }}>
          이 안은 <b style={{ color: '#F5EDE3' }}>이미지 원본</b>이라 클릭이 안 됩니다.<br/>
          A 안과 비교해서 마음에 드는 쪽을 알려주세요.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Link href="/preview/a" style={{
            padding: '13px 10px', textAlign: 'center', textDecoration: 'none',
            background: '#14100C', border: '1px solid rgba(224,192,136,.4)',
            color: '#F5EDE3', fontSize: 12.5, fontWeight: 700, borderRadius: 4,
          }}>
            A안 보러 가기
          </Link>
          <Link href="/preview" style={{
            padding: '13px 10px', textAlign: 'center', textDecoration: 'none',
            background: 'linear-gradient(135deg,#E0C088,#B08862)',
            color: '#0B0907', fontSize: 12.5, fontWeight: 800, borderRadius: 4,
          }}>
            선택 페이지로
          </Link>
        </div>
      </div>
    </main>
  );
}
