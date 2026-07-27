'use client';

/**
 * TrustAssets — 신뢰 자산 3 카드 (특허·상표 3장 + 창업 수백여명 + 26년 강의자료)
 * 2026-07-27 Phase 3 · 대표님 안 (박정주 페르소나) 「가격 못 넣는 대신 신뢰 자산으로 대체」
 *
 * 유미의 「가격 투명성」 (정가+프로모션가 병기) 을 우리는 「특허·상표 실사 + 정본 자료」로 대체.
 * pages/mobydick-detail-agent 참조 원칙 (CLAUDE.md §7.1)
 */

import { useState } from 'react';
import Link from 'next/link';

const PATENTS = [
  { src: '/brand/patents/patent-01.jpeg', title: '「극사실기법」 상표등록증', no: '40-2300477', date: '2025-01-10' },
  { src: '/brand/patents/patent-02.jpeg', title: '「극사실눈썹」 상표등록증', no: '2건', date: '2024~2025' },
  { src: '/brand/patents/patent-03.jpeg', title: '반영구 머신 특허', no: '10-2863985', date: '2024' },
];

const KEYNOTE_PDF = '/brand/ref/26artbrows.pdf';

type Variant = 'desktop' | 'mobile';

export default function TrustAssets({ variant }: { variant: Variant }) {
  const isMobile = variant === 'mobile';
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr 1fr',
      gap: isMobile ? 14 : 20,
    }}>
      {/* 1. 특허·상표 3장 카드 */}
      <div style={cardStyle(isMobile, true)}>
        <div style={sectionLabel()}>PATENT · TRADEMARK · 3건</div>
        <h3 style={cardTitleStyle(isMobile)}>「극사실」 이라는 이름부터<br/><b style={{ color: '#E0C088', fontWeight: 700 }}>법으로 지켰습니다.</b></h3>
        <p style={cardDescStyle()}>극사실기법·극사실눈썹 상표 + 반영구 머신 특허 등 원장 정본 IP.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 14 }}>
          {PATENTS.map((p, i) => (
            <button key={p.no} onClick={() => setLightbox(i)} aria-label={p.title}
              style={{
                padding: 0, background: 'transparent', border: '1px solid rgba(224,192,136,.25)',
                borderRadius: 4, cursor: 'zoom-in', overflow: 'hidden', aspectRatio: '2/3',
                transition: 'border-color .2s, transform .2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E0C088'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(224,192,136,.25)'; e.currentTarget.style.transform = 'scale(1)'; }}>
              <img src={p.src} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 10.5, color: '#6B5A48', letterSpacing: '.06em', textAlign: 'center' }}>
          클릭 시 원본 크기 확인
        </div>
      </div>

      {/* 2. 창업 수백여명 카드 (Face Lab 연계 예정) */}
      <div style={cardStyle(isMobile)}>
        <div style={sectionLabel()}>FOUNDER LAB · 창업 배출</div>
        <h3 style={cardTitleStyle(isMobile)}>수백여명의<br/><b style={{ color: '#E0C088', fontWeight: 700 }}>원장</b>이 이곳에서.</h3>
        <div style={{ marginTop: 16, padding: '18px 14px', background: 'rgba(224,192,136,.06)', border: '1px solid rgba(224,192,136,.2)', borderRadius: 6 }}>
          <div style={{ fontFamily: "'Cormorant Garamond','Nanum Myeongjo',serif", fontSize: isMobile ? 40 : 52, color: '#E0C088', fontWeight: 700, lineHeight: 1, letterSpacing: '-.01em' }}>
            수백여명<span style={{ fontSize: 20, color: '#8A7B6C', marginLeft: 4 }}>+</span>
          </div>
          <div style={{ fontSize: 11.5, color: '#B8A897', marginTop: 8, letterSpacing: '.06em' }}>
            원장·강사 창업 배출 · 20년+ 누적
          </div>
        </div>
        <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['원장 직강 · 소수 예약제', '창업 컨설팅 상시 지원', '평생 실습·재교육 오픈'].map((li) => (
            <li key={li} style={{ fontSize: 12, color: '#B8A897', paddingLeft: 12, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: 7, width: 4, height: 4, background: '#E0C088', borderRadius: '50%' }} />
              {li}
            </li>
          ))}
        </ul>
        <Link href="/enroll?course=founder"
          style={{ marginTop: 'auto', display: 'block', padding: '11px 16px', background: 'linear-gradient(135deg,#E0C088,#B08862)', color: '#0B0907', textDecoration: 'none', textAlign: 'center', fontSize: 12.5, fontWeight: 800, borderRadius: 4, letterSpacing: '.02em' }}>
          창업반 890 15기 상세 →
        </Link>
      </div>

      {/* 3. 26년 강의자료 정본 다운로드 */}
      <div style={cardStyle(isMobile)}>
        <div style={sectionLabel()}>KEYNOTE · 정본 강의자료</div>
        <h3 style={cardTitleStyle(isMobile)}>26년 강의노트<br/><b style={{ color: '#E0C088', fontWeight: 700 }}>117p</b> 그대로.</h3>
        <div style={{ marginTop: 16, padding: '18px 14px', background: 'rgba(224,192,136,.06)', border: '1px solid rgba(224,192,136,.2)', borderRadius: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 34, lineHeight: 1 }}>📕</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 15, color: '#F5EDE3', fontWeight: 500, lineHeight: 1.35 }}>
                「극사실기법」 정본 (v2.1)
              </div>
              <div style={{ fontSize: 11, color: '#8A7B6C', marginTop: 4 }}>
                8 챕터 · 결의 법칙 1234321 · 8 스타일 진단 · A0-A3 색소론
              </div>
            </div>
          </div>
        </div>
        <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['디자인 4단계 · 단선 3구간', '표피 3층·5층 · 색소 A0-A3', '8 스타일 얼굴 진단표'].map((li) => (
            <li key={li} style={{ fontSize: 12, color: '#B8A897', paddingLeft: 12, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: 7, width: 4, height: 4, background: '#E0C088', borderRadius: '50%' }} />
              {li}
            </li>
          ))}
        </ul>
        <a href={KEYNOTE_PDF} target="_blank" rel="noopener noreferrer"
          style={{ marginTop: 'auto', display: 'block', padding: '11px 16px', background: 'transparent', color: '#E0C088', border: '1px solid rgba(224,192,136,.4)', textDecoration: 'none', textAlign: 'center', fontSize: 12.5, fontWeight: 700, borderRadius: 4, letterSpacing: '.02em' }}>
          📥 PDF 다운로드 · 미리보기
        </a>
      </div>

      {/* Lightbox */}
      {lightbox != null ? (
        <div onClick={() => setLightbox(null)} role="dialog" aria-modal="true"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(3,2,1,.94)', zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            cursor: 'zoom-out', backdropFilter: 'blur(8px)',
          }}>
          <div style={{ position: 'relative', maxWidth: 800, width: '100%' }}>
            <img src={PATENTS[lightbox].src} alt={PATENTS[lightbox].title}
              style={{ width: '100%', height: 'auto', borderRadius: 6, boxShadow: '0 20px 60px rgba(0,0,0,.7)' }} />
            <div style={{ marginTop: 12, textAlign: 'center', color: '#F5EDE3' }}>
              <div style={{ fontSize: 10.5, letterSpacing: '.28em', color: '#E0C088', fontWeight: 800 }}>등록번호 {PATENTS[lightbox].no} · {PATENTS[lightbox].date}</div>
              <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 18, fontWeight: 500, marginTop: 6 }}>{PATENTS[lightbox].title}</div>
              <div style={{ marginTop: 8, fontSize: 11, color: '#8A7B6C' }}>배경 아무 곳이나 클릭 시 닫힘</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function cardStyle(isMobile: boolean, tall = false): React.CSSProperties {
  return {
    padding: isMobile ? 18 : '24px 22px',
    background: 'linear-gradient(180deg,#14100C,#0B0907)',
    border: '1px solid rgba(224,192,136,.2)',
    borderRadius: 6,
    display: 'flex', flexDirection: 'column', gap: 6,
    minHeight: tall && !isMobile ? 460 : undefined,
  };
}
function sectionLabel(): React.CSSProperties {
  return { fontSize: 10, letterSpacing: '.28em', color: '#C9A66B', fontWeight: 800, textTransform: 'uppercase' };
}
function cardTitleStyle(isMobile: boolean): React.CSSProperties {
  return { fontFamily: "'Nanum Myeongjo',serif", fontSize: isMobile ? 18 : 22, fontWeight: 500, lineHeight: 1.4, color: '#F5EDE3', margin: '6px 0 4px' };
}
function cardDescStyle(): React.CSSProperties {
  return { fontSize: 12.5, color: '#8A7B6C', lineHeight: 1.6, margin: 0 };
}
