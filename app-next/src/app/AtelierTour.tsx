'use client';

/**
 * AtelierTour — 선릉 본원 인터랙티브 카드 (아틀리에 4장 크로스페이드)
 * 2026-07-27 Phase 2 · 유미 LOCATION 대체 (최예진 안 · 「원장님이 어디서 강의하시는지」 시각 노출)
 * 4초마다 자동 크로스페이드 + 썸네일 4개 · 네이버 지도·오시는 길 CTA
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ATELIER_IMAGES = [
  { src: '/brand/ai-generated/atelier/atelier-01.png', caption: '선릉 본원 · 아틀리에 씬 1' },
  { src: '/brand/ai-generated/atelier/atelier-02.png', caption: '시술베드 · 골드 rim light' },
  { src: '/brand/ai-generated/atelier/atelier-03.png', caption: '원장 1:1 강의 공간' },
  { src: '/brand/ai-generated/atelier/atelier-04.png', caption: '창가 · 오후 3시 무드' },
];

// 2026-07-27 · 대표님 확인 「미지아카데미」 로 등록 명 우선 시도
const MAP_URL = 'https://map.naver.com/p/search/미지아카데미';

type Variant = 'desktop' | 'mobile';

export default function AtelierTour({ variant }: { variant: Variant }) {
  const [idx, setIdx] = useState(0);
  const isMobile = variant === 'mobile';

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ATELIER_IMAGES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
      gap: isMobile ? 14 : 26,
      alignItems: 'stretch',
    }}>
      {/* 메인 이미지 */}
      <div style={{
        position: 'relative',
        aspectRatio: isMobile ? '4/5' : '4/5',
        borderRadius: isMobile ? 10 : 6,
        overflow: 'hidden',
        background: '#0B0907',
        border: '1px solid rgba(224,192,136,.2)',
      }}>
        {ATELIER_IMAGES.map((im, i) => (
          <img key={im.src} src={im.src} alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', opacity: i === idx ? 1 : 0,
              transition: 'opacity 1.2s ease',
            }} />
        ))}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: isMobile ? '16px' : '20px 24px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(11,9,7,.85) 70%, rgba(11,9,7,.95) 100%)',
          color: '#F5EDE3',
        }}>
          <div style={{ fontSize: 10, letterSpacing: '.28em', color: '#E0C088', fontWeight: 800, marginBottom: 4 }}>
            ATELIER · {String(idx + 1).padStart(2, '0')} / {String(ATELIER_IMAGES.length).padStart(2, '0')}
          </div>
          <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: isMobile ? 14 : 16, fontWeight: 500 }}>
            {ATELIER_IMAGES[idx].caption}
          </div>
        </div>
      </div>

      {/* 정보 카드 */}
      <div style={{
        padding: isMobile ? 18 : '26px 28px',
        background: 'linear-gradient(180deg,#14100C,#0B0907)',
        border: '1px solid rgba(224,192,136,.2)',
        borderRadius: isMobile ? 10 : 6,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '.28em', color: '#C9A66B', fontWeight: 800, marginBottom: 6 }}>SEONLEUNG · MAIN ATELIER</div>
          <h3 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: isMobile ? 20 : 26, fontWeight: 500, margin: 0, lineHeight: 1.35, color: '#F5EDE3' }}>
            선릉 · 삼성 본원
          </h3>
          <p style={{ fontSize: 13, color: '#8A7B6C', marginTop: 8, lineHeight: 1.65 }}>
            서울 강남구 선릉 · 삼성역 도보 6분<br/>
            원장님 1:1 지도 · 소수 예약제 · 지점 없음
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[{ n: '20년+', l: '경력' }, { n: '900+', l: '수강 배출' }, { n: '3장', l: '특허' }].map((s) => (
            <div key={s.l} style={{ padding: '10px 8px', background: 'rgba(224,192,136,.06)', border: '1px solid rgba(224,192,136,.15)', borderRadius: 4, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond','Nanum Myeongjo',serif", fontSize: 20, color: '#E0C088', fontWeight: 700 }}>{s.n}</div>
              <div style={{ fontSize: 10, color: '#8A7B6C', marginTop: 2, letterSpacing: '.06em' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* 썸네일 4개 · 클릭으로 인덱스 이동 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {ATELIER_IMAGES.map((im, i) => (
            <button key={im.src} onClick={() => setIdx(i)} aria-label={`아틀리에 ${i + 1}`}
              style={{
                aspectRatio: '1/1', padding: 0, border: `2px solid ${i === idx ? '#E0C088' : 'transparent'}`,
                background: 'transparent', cursor: 'pointer', borderRadius: 4, overflow: 'hidden',
                opacity: i === idx ? 1 : 0.6, transition: 'all .25s',
              }}>
              <img src={im.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <a href={MAP_URL} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, padding: '12px 16px', background: '#03C75A', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: 12.5, fontWeight: 800, borderRadius: 4, letterSpacing: '.02em' }}>
            📍 네이버 지도
          </a>
          <Link href="/contact"
            style={{ flex: 1, padding: '12px 16px', background: 'transparent', color: '#E0C088', border: '1px solid rgba(224,192,136,.4)', textDecoration: 'none', textAlign: 'center', fontSize: 12.5, fontWeight: 700, borderRadius: 4, letterSpacing: '.02em' }}>
            오시는 길 상세
          </Link>
        </div>
      </div>
    </div>
  );
}
