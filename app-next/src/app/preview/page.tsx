/**
 * /preview · 원장님 선택 랜딩 · 2026-08-07
 * A안 (코드 재현 · 시안 스토리 순서 · 반응형 라이브) vs B안 (원장 시안 이미지 원본)
 * 모바일 우선 · 두 안 모두 375px 뷰포트에서 매끄럽게 동작 확인
 */
import Link from 'next/link';

export const metadata = {
  title: '홈 시안 선택 · 원장님용 · ARTbrows',
  description: 'A/B 두 안 중 원장님이 선택 · 2026-08-07',
};

export default function PreviewLanding() {
  return (
    <main style={{
      minHeight: '100vh', background: '#0B0907', color: '#F5EDE3',
      padding: '32px 20px 60px',
      fontFamily: "'Pretendard', -apple-system, sans-serif",
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 4px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, letterSpacing: '.28em', color: '#E0C088', fontWeight: 800, marginBottom: 8 }}>
          MIJI · PICK ONE
        </div>
        <h1 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 28, fontWeight: 600, margin: 0, lineHeight: 1.35 }}>
          원장님, <span style={{ color: '#E0C088' }}>어느 안</span>이 좋으세요?
        </h1>
        <p style={{ marginTop: 12, color: '#B8A897', fontSize: 14, lineHeight: 1.6 }}>
          원장님이 보내주신 시안 (2026-08-06) 을 두 방식으로 만들었습니다.<br/>
          한쪽 눌러서 확인하시고, 대표님께 말씀해 주세요.
        </p>

        <div style={{ display: 'grid', gap: 14, marginTop: 32 }}>
          {/* A 안 */}
          <Link href="/preview/a" style={cardStyle('linear-gradient(135deg,#1A140E,#0F0B08)', '#E0C088')}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: '#E0C088', fontWeight: 700, letterSpacing: '.02em' }}>A</div>
            <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 17, fontWeight: 700, marginTop: 4, color: '#F5EDE3' }}>
              코드로 재현한 안 · 반응형 라이브
            </div>
            <div style={{ marginTop: 6, fontSize: 12.5, color: '#B8A897', lineHeight: 1.55 }}>
              시안 순서·카피 그대로 재구성 · 실 페이지처럼 링크·버튼 눌러보실 수 있어요.<br/>
              사진은 지금 자산으로 임시 배치 (실 사진 오면 교체).
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: '#E0C088', letterSpacing: '.08em', fontWeight: 700 }}>
              열어보기 →
            </div>
          </Link>

          {/* B 안 */}
          <Link href="/preview/b" style={cardStyle('linear-gradient(135deg,#14100C,#0B0907)', 'rgba(224,192,136,.3)')}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: '#E0C088', fontWeight: 700, letterSpacing: '.02em' }}>B</div>
            <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 17, fontWeight: 700, marginTop: 4, color: '#F5EDE3' }}>
              원장님 시안 이미지 원본
            </div>
            <div style={{ marginTop: 6, fontSize: 12.5, color: '#B8A897', lineHeight: 1.55 }}>
              보내주신 그림 그대로. 눌러도 안 넘어감. 실 웹은 아니지만 <b style={{ color: '#F5EDE3' }}>느낌 100%</b>.
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: '#E0C088', letterSpacing: '.08em', fontWeight: 700 }}>
              열어보기 →
            </div>
          </Link>
        </div>

        <div style={{ marginTop: 40, padding: 16, background: '#14100C', border: '1px solid rgba(224,192,136,.2)', borderRadius: 6, fontSize: 12, color: '#8A7B6C', lineHeight: 1.7 }}>
          <div style={{ color: '#E0C088', fontWeight: 700, marginBottom: 4 }}>참고</div>
          두 안 모두 <b style={{ color: '#F5EDE3' }}>휴대폰</b> 에서 잘 보이도록 만들었습니다. PC 에서도 열립니다.<br/>
          지금 <b style={{ color: '#F5EDE3' }}>/</b> (홈) 은 이전 warm paper 톤 유지 · 이 미리보기와는 별개입니다.
        </div>
      </div>
    </main>
  );
}

function cardStyle(bg: string, borderColor: string): React.CSSProperties {
  return {
    display: 'block',
    padding: '20px 18px',
    background: bg,
    border: `1px solid ${borderColor}`,
    borderRadius: 6,
    textDecoration: 'none',
    color: '#F5EDE3',
    boxShadow: '0 6px 24px rgba(0,0,0,.35)',
  };
}
