'use client';

/**
 * FloatingCTA — 우측 세로 (데스크톱) or 하단 고정 바 (모바일) 진입 CTA
 * 2026-07-27 · Phase 1 · 유미 벤치 하이브리드 이식 (송하은·이서연 안)
 *
 * 데스크톱: 세로 6개 아이콘 (K1 32×32 강조 · 실시간 카운터 뱃지)
 * 모바일:   하단 고정 3~4개 (K1 · 무료강의 · 상담)
 */

import { useEffect, useState } from 'react';

const K1_URL = 'https://open.kakao.com/o/gWeAkSzi';
const INSTA_URL = 'https://www.instagram.com/artbrows_academy/';
const PHONE = 'tel:010-3239-5453';
const CONSULT_URL = '/consult';
const ENROLL_URL = '/enroll';
// 2026-07-27 · 대표님 확인 「미지아카데미」 로 등록 명 우선 시도 (검색 미매칭 시 스마트플레이스 등록 필요)
const MAP_URL = 'https://map.naver.com/p/search/미지아카데미';

type Variant = 'desktop' | 'mobile';

export default function FloatingCTA({ variant }: { variant: Variant }) {
  // 실시간 카운터 (K1 오픈방 인원) · 초기 200 + 시간대별 ±3 흔들림 (mock · 실 API 연동 예정)
  const [count, setCount] = useState(200);
  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => Math.max(180, Math.min(240, c + (Math.random() > 0.5 ? 1 : -1))));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  if (variant === 'mobile') {
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90,
        background: 'linear-gradient(180deg, rgba(11,9,7,.92), rgba(11,9,7,.98))',
        borderTop: '1px solid rgba(224,192,136,.35)',
        backdropFilter: 'blur(14px)',
        padding: '10px 12px calc(10px + env(safe-area-inset-bottom, 0))',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8, alignItems: 'stretch',
      }}>
        <a href={K1_URL} target="_blank" rel="noopener noreferrer" aria-label="K1 무료 강의 카톡방"
          style={mBtn('#FEE500', '#3A1D1D')}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>💬</span>
          <span style={{ fontSize: 11.5, fontWeight: 800, marginTop: 3 }}>무료 강의 K1</span>
          <span style={{ fontSize: 9.5, opacity: .75, marginTop: 1 }}>지금 {count}명</span>
        </a>
        <a href={CONSULT_URL} aria-label="상담 신청" style={mBtn('linear-gradient(135deg,#E0C088,#B08862)', '#0B0907')}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>✏️</span>
          <span style={{ fontSize: 11.5, fontWeight: 800, marginTop: 3 }}>상담 신청</span>
          <span style={{ fontSize: 9.5, opacity: .75, marginTop: 1 }}>선릉 · 1:1</span>
        </a>
        <a href={PHONE} aria-label="전화 상담" style={mBtn('rgba(255,255,255,.08)', '#F5EDE3')}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>📞</span>
          <span style={{ fontSize: 11.5, fontWeight: 800, marginTop: 3 }}>전화</span>
          <span style={{ fontSize: 9.5, opacity: .75, marginTop: 1 }}>010-3239-5453</span>
        </a>
      </div>
    );
  }

  // 데스크톱 · 우측 세로 스택
  return (
    <div style={{
      position: 'fixed', right: 18, top: '50%', transform: 'translateY(-50%)', zIndex: 90,
      display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch',
    }}>
      <a href={K1_URL} target="_blank" rel="noopener noreferrer" aria-label="K1 무료 강의 카톡방"
        style={dBtn('#FEE500', '#3A1D1D', true)}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>💬</span>
        <div style={{ fontSize: 10, fontWeight: 800, marginTop: 4, letterSpacing: '.02em' }}>K1 무료</div>
        <div style={{ position: 'absolute', top: -4, right: -4, background: '#E85A9E', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 99, boxShadow: '0 2px 6px rgba(0,0,0,.4)' }}>
          {count}
        </div>
      </a>
      <a href={INSTA_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
        style={dBtn('linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045)', '#fff')}>
        <span style={{ fontSize: 20 }}>📷</span>
        <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4 }}>Instagram</div>
      </a>
      <a href={ENROLL_URL} aria-label="무료 강의 신청" style={dBtn('rgba(224,192,136,.15)', '#E0C088')}>
        <span style={{ fontSize: 20 }}>🎓</span>
        <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4 }}>무료 강의</div>
      </a>
      <a href={CONSULT_URL} aria-label="상담 신청" style={dBtn('linear-gradient(135deg,#E0C088,#B08862)', '#0B0907')}>
        <span style={{ fontSize: 20 }}>✏️</span>
        <div style={{ fontSize: 10, fontWeight: 800, marginTop: 4 }}>상담</div>
      </a>
      <a href={PHONE} aria-label="전화 상담" style={dBtn('rgba(255,255,255,.08)', '#F5EDE3')}>
        <span style={{ fontSize: 20 }}>📞</span>
        <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4 }}>전화</div>
      </a>
      <a href={MAP_URL} target="_blank" rel="noopener noreferrer" aria-label="네이버 지도" style={dBtn('rgba(3,199,90,.15)', '#03C75A')}>
        <span style={{ fontSize: 20 }}>📍</span>
        <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4 }}>지도</div>
      </a>
    </div>
  );
}

// ── styles ──
function dBtn(bg: string, color: string, emphasized = false): React.CSSProperties {
  return {
    position: 'relative',
    width: emphasized ? 68 : 60, height: emphasized ? 68 : 60,
    background: bg, color,
    borderRadius: 14,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none',
    boxShadow: emphasized ? '0 4px 14px rgba(254,229,0,.35), 0 2px 6px rgba(0,0,0,.4)' : '0 2px 8px rgba(0,0,0,.4)',
    border: '1px solid rgba(255,255,255,.08)',
    transition: 'transform .15s',
  };
}

function mBtn(bg: string, color: string): React.CSSProperties {
  return {
    background: bg, color,
    borderRadius: 10,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none',
    padding: '8px 6px',
    boxShadow: '0 -2px 8px rgba(0,0,0,.3)',
    border: '1px solid rgba(255,255,255,.06)',
  };
}
