'use client';

/**
 * BeforeAfterCarousel — 원장 시술 매크로 Before/After 캐러셀
 * 2026-07-27 Phase 2 · 유미 벤치 훔침 · 유나·이서연 강력 지지
 *
 * 상하 분할 매크로 이미지 3장 (ba-01~03.png · Vogue Beauty 톤) · 좌우 스와이프 + 화살표.
 * 데스크톱·모바일 공통 컴포넌트. 실 시술은 원장님 실 사진으로 언제든 교체 가능.
 */

import { useEffect, useRef, useState } from 'react';

const IMAGES = [
  { src: '/brand/ai-generated/before-after/ba-01.png', caption: '자연스러운 결이 살아있는 눈썹' },
  { src: '/brand/ai-generated/before-after/ba-02.png', caption: '얼굴 구조에 맞춰 설계된 라인' },
  { src: '/brand/ai-generated/before-after/ba-03.png', caption: '털결 그대로 · 30년 노하우의 완성' },
];

type Variant = 'desktop' | 'mobile';

export default function BeforeAfterCarousel({ variant }: { variant: Variant }) {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);

  function go(delta: number) {
    setIdx((i) => (i + delta + IMAGES.length) % IMAGES.length);
  }

  // 모바일: 스와이프
  useEffect(() => {
    if (variant !== 'mobile' || !ref.current) return;
    const el = ref.current;
    const onStart = (e: TouchEvent) => { touchStart.current = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => {
      if (touchStart.current == null) return;
      const dx = e.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(dx) > 40) go(dx > 0 ? -1 : 1);
      touchStart.current = null;
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd);
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchend', onEnd); };
  }, [variant]);

  const isMobile = variant === 'mobile';
  const cur = IMAGES[idx];

  return (
    <div ref={ref} style={{ width: '100%', position: 'relative' }}>
      {/* 이미지 프레임 */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: isMobile ? '4/5' : '4/5',
        borderRadius: isMobile ? 10 : 6,
        overflow: 'hidden',
        background: '#0B0907',
        border: '1px solid rgba(224,192,136,.25)',
        boxShadow: '0 12px 40px rgba(0,0,0,.5)',
      }}>
        {IMAGES.map((im, i) => (
          <img key={im.src} src={im.src} alt=""
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              opacity: i === idx ? 1 : 0,
              transition: 'opacity .6s ease',
            }} />
        ))}
        {/* 좌우 화살표 */}
        {!isMobile ? (
          <>
            <button onClick={() => go(-1)} aria-label="이전"
              style={arrowStyle('left')}>‹</button>
            <button onClick={() => go(1)} aria-label="다음"
              style={arrowStyle('right')}>›</button>
          </>
        ) : null}
        {/* 하단 캡션 오버레이 */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: isMobile ? '20px 16px 16px' : '28px 24px 22px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(11,9,7,.85) 60%, rgba(11,9,7,.95) 100%)',
          color: '#F5EDE3',
        }}>
          <div style={{ fontSize: isMobile ? 9.5 : 10.5, letterSpacing: '.32em', color: '#E0C088', fontWeight: 800, marginBottom: 6 }}>
            CASE {String(idx + 1).padStart(2, '0')} · MIJI JANG SIGNATURE
          </div>
          <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: isMobile ? 15 : 18, fontWeight: 500, lineHeight: 1.4, textShadow: '0 2px 6px rgba(0,0,0,.5)' }}>
            {cur.caption}
          </div>
        </div>
      </div>

      {/* 인디케이터 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
        {IMAGES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`${i + 1} 번 케이스`}
            style={{
              width: i === idx ? 28 : 8, height: 8, padding: 0,
              background: i === idx ? '#E0C088' : 'rgba(224,192,136,.25)',
              border: 'none', borderRadius: 99, cursor: 'pointer',
              transition: 'width .25s, background .25s',
            }} />
        ))}
      </div>

      {isMobile ? (
        <div style={{ marginTop: 8, fontSize: 10.5, color: '#6B5A48', textAlign: 'center', letterSpacing: '.08em' }}>
          ← 좌우로 스와이프
        </div>
      ) : null}
    </div>
  );
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    [side]: 14, top: '50%', transform: 'translateY(-50%)',
    width: 44, height: 44, borderRadius: '50%',
    background: 'rgba(11,9,7,.7)', color: '#E0C088',
    border: '1px solid rgba(224,192,136,.4)',
    fontSize: 24, fontWeight: 300, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(6px)',
    zIndex: 5,
  };
}
