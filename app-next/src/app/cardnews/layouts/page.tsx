import '@/lib/artbrows/tokens.css';
import '../cardnews.css';
import Link from 'next/link';
import { SlideRender } from '../SlideRender';
import { demoAllLayouts } from '../demo-content';
import { sampleFourteenthEasy } from '../sample-content';
import { artbrowsPalette } from '@/lib/artbrows/tokens';

export const metadata = {
  title: 'ARTbrows · 12종 레이아웃 데모',
  description: '원장님 통합 브랜드 가이드 6톤 × 12종 슬라이드 레이아웃 데모',
};

export default function LayoutDemoPage() {
  return (
    <main className="cardnews-page">
      <div className="cn-wrap">
        <div className="cn-title">12종 레이아웃 데모</div>
        <div className="cn-subtitle">Layout Library · Reference</div>
        <div className="cn-meta">
          원장님 통합 브랜드 가이드 <b>6톤 팔레트 × 12종 레이아웃</b> 데모. 콘텐츠는 하드코딩된 참고용 · 실 프로젝트는{' '}
          <Link href="/cardnews" style={{ color: 'var(--ab-gold-light)', textDecoration: 'underline' }}>← 카드뉴스 프로젝트 관리</Link>{' '}에서 만들고 편집.
        </div>

        {/* ── 샘플 캐러셀: 14기 이지클래스 6장 ── */}
        <div className="cn-section-head">
          14기 이지클래스 캐러셀 (샘플 6장)
          <span className="caption">CATEGORY ORDER · FOUNDER → REVIEW → FOUNDER → CLASSROOM → DETAIL → TREATMENT</span>
        </div>
        <div className="cn-grid">
          {sampleFourteenthEasy.slides.map((s, i) => (
            <div className="cn-slide-wrap" key={`sample-${i}`}>
              <div className="slide-index">{i + 1}/{sampleFourteenthEasy.slides.length}</div>
              <SlideRender slide={s} />
              <div className="cn-slide-label">
                {s.kind}
                <span className="cat-chip">{artbrowsPalette[s.category].label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── 12종 데모 갤러리 ── */}
        <div className="cn-section-head">
          12종 레이아웃 데모
          <span className="caption">LAYOUT × CATEGORY MATRIX · KIND별 1샷씩</span>
        </div>
        <div className="cn-grid">
          {demoAllLayouts.map((s, i) => (
            <div className="cn-slide-wrap" key={`demo-${i}`}>
              <div className="slide-index">{String(i + 1).padStart(2, '0')} · {s.kind.toUpperCase()}</div>
              <SlideRender slide={s} />
              <div className="cn-slide-label">
                {s.kind}
                <span className="cat-chip">{artbrowsPalette[s.category].label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── 6톤 팔레트 참고 ── */}
        <div className="cn-section-head">
          원장님 정본 6톤 팔레트
          <span className="caption">INTEGRATED BRAND GUIDE 2026 · 인스타 피드 3열 반복 패턴</span>
        </div>
        <div className="cn-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {Object.values(artbrowsPalette).map((p) => (
            <div
              key={p.key}
              className={`slide-frame ab-cat-${p.key}`}
              data-tone={p.key === 'founder' || p.key === 'detail' ? 'light' : 'dark'}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '10%', textAlign: 'center', gap: 10 }}
            >
              <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.3em', opacity: 0.7, textTransform: 'uppercase' }}>
                {p.key}
              </div>
              <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 20, fontWeight: 800 }}>
                {p.label}
              </div>
              <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, letterSpacing: '0.1em', opacity: 0.75 }}>
                {p.bg}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
