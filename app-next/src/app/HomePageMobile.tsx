'use client';

/**
 * HomePageMobile — 원장 시안 픽셀 재현 (2026-08-07)
 * 원장님 배포 KakaoTalk_20260806 시안을 픽셀 수준으로 재현
 *   시안 순서 = GNB → 히어로(사진+타이틀) → 인트로 카피 → 시술전 사진 → 인용 → 특허3 → 질문+가격표
 *              → 「이것이 극사실이다」 → 시술후 슬라이더 → B/A 얼굴 좌우 → 통계3 → CTA 2
 *   ⚠ FloatingCTA 제거 (시안에 없음) · 햄버거 메뉴 제거 (시안에 없음)
 */

import { useState } from 'react';
import Link from 'next/link';
import type { Lang } from '@/app/cardnews/types';

// 2026-08-07 · 원장 Canva 시안 (2026-08-06) 에서 crop 한 정본 이미지 사용
const CANVA = '/preview/canva';
const HERO_IMG = `${CANVA}/hero-portrait.jpg`;
const BEFORE_TREATMENT_IMG = `${CANVA}/before-face.jpg`;
const CLOSEUP_IMGS = [`${CANVA}/closeup-portrait.jpg`];
const BA_LEFT = `${CANVA}/ba-left.jpg`;
const BA_RIGHT = `${CANVA}/ba-right.jpg`;
const PATENTS = [
  { no: '10-2639903', kind: '특허', src: `${CANVA}/patent-01.jpg` },
  { no: '40-2300477', kind: '상표', src: `${CANVA}/patent-02.jpg` },
  { no: '10-2863985', kind: '특허', src: `${CANVA}/patent-03.jpg` },
];

const LANG_TAB: { key: Lang; label: string; href: string }[] = [
  { key: 'ko', label: 'KO', href: '/' },
  { key: 'en', label: 'EN', href: '/en' },
  { key: 'zh', label: '中', href: '/zh' },
];

export default function HomePageMobile({ lang }: { lang: Lang }) {
  const [closeupIdx, setCloseupIdx] = useState(0);
  const [baIdx, setBaIdx] = useState(0);

  const closeupPrev = () => setCloseupIdx((i) => (i - 1 + CLOSEUP_IMGS.length) % CLOSEUP_IMGS.length);
  const closeupNext = () => setCloseupIdx((i) => (i + 1) % CLOSEUP_IMGS.length);
  const baPrev = () => setBaIdx((i) => Math.max(0, i - 1));
  const baNext = () => setBaIdx((i) => Math.min(1, i + 1));

  return (
    <main style={{ background: '#0B0907', color: '#F5EDE3', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── GNB · 장미지 ARTBROWS + 언어 스위처 (햄버거 없음) ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 80,
        background: '#0B0907',
        borderBottom: '1px solid rgba(224,192,136,.12)',
        padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 6, textDecoration: 'none', color: '#F5EDE3', minWidth: 0 }}>
          <span style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 15, fontWeight: 700, color: '#E0C088', letterSpacing: '.02em' }}>장미지</span>
          <span style={{ fontFamily: "'Cormorant Garamond','Inter',serif", fontSize: 11, fontWeight: 500, letterSpacing: '.22em', whiteSpace: 'nowrap' }}>ARTBROWS</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {LANG_TAB.map((t) => (
            <Link key={t.key} href={t.href}
              style={{
                padding: '3px 7px', minWidth: 22, textAlign: 'center',
                fontSize: 10.5, letterSpacing: '.04em', fontWeight: 700,
                textDecoration: 'none',
                color: t.key === lang ? '#F5EDE3' : '#8A7B6C',
                border: '1px solid rgba(224,192,136,.3)',
                borderRadius: 2,
              }}>{t.label}</Link>
          ))}
        </div>
      </nav>

      {/* ── HERO · 원장 얼굴 상단 + 극사실눈썹 대헤드 하단 ── */}
      <section style={{ position: 'relative', width: '100%', background: '#0B0907', paddingTop: 16 }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMG} alt="장미지 원장" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(11,9,7,.75) 78%, #0B0907 100%)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', padding: '0 16px' }}>
            <h1 style={{
              fontFamily: "'Nanum Myeongjo',serif",
              fontSize: 52, fontWeight: 800, lineHeight: 1,
              color: '#F5EDE3', margin: 0, letterSpacing: '.01em',
              textShadow: '0 3px 14px rgba(0,0,0,.7)',
            }}>극사실눈썹</h1>
            <div style={{ marginTop: 14, fontFamily: "'Nanum Myeongjo',serif", fontSize: 13.5, color: '#E0C088', letterSpacing: '.02em' }}>
              창시자 <b style={{ fontWeight: 700 }}>ARTbrows</b> 장미지 원장
            </div>
            <div style={{ marginTop: 5, fontSize: 11, color: 'rgba(245,237,227,.65)', letterSpacing: '.08em' }}>
              국내최초 극사실눈썹 수강 시작
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO · 브랜드 선언 카피 (Pretendard bold · 3줄) ── */}
      <section style={{ padding: '44px 20px 32px', background: '#0B0907', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Pretendard','Nanum Myeongjo',serif",
          fontSize: 19, lineHeight: 1.55, color: '#F5EDE3', margin: 0, fontWeight: 700, letterSpacing: '-.005em',
        }}>
          반영구, 눈썹문신을 초월한,<br/>
          진짜 눈썹으로 새로 태어나는 기술<br/>
          오직 이곳에만 있습니다.
        </p>
      </section>

      {/* ── 시술 전 클로즈업 (문제 제시 · 뱃지 없음 · full-bleed) ── */}
      <section style={{ padding: '0', background: '#0B0907' }}>
        <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BEFORE_TREATMENT_IMG} alt="시술 전" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </section>

      {/* ── 인용 · 「이것은 눈썹문신이 아니다」 ── */}
      <section style={{ padding: '38px 24px 32px', background: '#0B0907', textAlign: 'center' }}>
        <blockquote style={{
          margin: 0, fontFamily: "'Nanum Myeongjo',serif",
          fontSize: 20, lineHeight: 1.5, color: '#F5EDE3', fontWeight: 600, letterSpacing: '-.005em',
        }}>
          <span style={{ color: '#E0C088', fontSize: 22, verticalAlign: 'top', lineHeight: 1, marginRight: 2 }}>“</span>
          이것은 눈썹문신이 아니다<br/>
          새로 태어난 내 진짜 눈썹이다.
          <span style={{ color: '#E0C088', fontSize: 22, verticalAlign: 'bottom', lineHeight: 1, marginLeft: 2 }}>”</span>
        </blockquote>
        <p style={{ marginTop: 20, fontSize: 13, color: '#B8A897', lineHeight: 1.55, letterSpacing: '-.005em' }}>
          그래서 이 기술은, <b style={{ color: '#F5EDE3', fontWeight: 700 }}>아무나 가르치지 않습니다.</b>
        </p>
      </section>

      {/* ── 특허 3장 (Canva 시안 실 스캔 crop) ── */}
      <section style={{ padding: '8px 20px 40px', background: '#0B0907' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {PATENTS.map((p) => (
            <div key={p.no} style={{ aspectRatio: '3/4', background: '#F5EDE3', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={`${p.kind} 제 ${p.no}호`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
          {PATENTS.map((p) => (
            <div key={p.no} style={{ fontSize: 10, color: '#B8A897', letterSpacing: '.01em', lineHeight: 1.35 }}>
              {p.kind} 제 {p.no}호
            </div>
          ))}
        </div>
      </section>

      {/* ── 왜 극사실 눈썹이 최상위 기술인가? ── */}
      <section style={{ padding: '18px 20px 8px', background: '#0B0907' }}>
        <h2 style={{
          fontFamily: "'Nanum Myeongjo',serif", fontSize: 22, fontWeight: 700, lineHeight: 1.4,
          margin: 0, color: '#F5EDE3', textAlign: 'center', letterSpacing: '-.005em',
        }}>
          <span style={{ color: '#E0C088', fontWeight: 800, marginRight: 4 }}>“</span>
          왜 극사실 눈썹이<br/>
          최상위 기술인가?
          <span style={{ color: '#E0C088', fontWeight: 800, marginLeft: 4 }}>”</span>
        </h2>
      </section>

      {/* ── 가격 비교표 ── */}
      <section style={{ padding: '24px 20px 40px', background: '#0B0907' }}>
        {/* ONE TOP · 극사실 (강조 박스) */}
        <div style={{
          padding: '14px 14px 16px', background: '#14100C',
          border: '1px solid rgba(224,192,136,.4)', marginBottom: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: 46, height: 46, background: '#E0C088', color: '#0B0907',
              fontSize: 9, fontWeight: 900, letterSpacing: '.06em', lineHeight: 1.15, textAlign: 'center',
            }}>
              <span>ONE</span><span>TOP</span>
            </div>
            <div style={{ fontFamily: "'Pretendard',sans-serif", fontSize: 14, fontWeight: 800, color: '#F5EDE3', letterSpacing: '-.005em' }}>
              극사실눈썹 : <span style={{ color: '#E0C088' }}>XXX만원</span> 이상의 시술금액대
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: '#B8A897', lineHeight: 1.6, letterSpacing: '-.005em' }}>
            뼈의 구조와 비율, 눈썹의 형태를 고려하여 눈썹의 질감까지 그리는 기술로 · 고객의 완벽한 비율을 조정하며 눈썹으로 인상을 바꾸는 기술
          </div>
        </div>

        {/* 등급별 비교 (02·03·04 · 시안 그대로 · 매우 심플) */}
        {[
          { n: '02', t: '헤어 스트로크', p: '30~100만원 이하' },
          { n: '03', t: '화장눈썹 / 면눈썹', p: '10~30만원' },
          { n: '04', t: '자연눈썹 / 엠보기법 / 칼로긋는기법', p: '5만원~30만원' },
        ].map((r) => (
          <div key={r.n} style={{
            padding: '11px 14px',
            display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12, alignItems: 'start',
          }}>
            <div style={{ fontFamily: "'Pretendard',sans-serif", fontSize: 13, color: '#8A7B6C', fontWeight: 800, lineHeight: 1.35, paddingTop: 1 }}>{r.n}</div>
            <div style={{ fontFamily: "'Pretendard',sans-serif", fontSize: 12.5, color: '#F5EDE3', fontWeight: 500, lineHeight: 1.45, letterSpacing: '-.005em' }}>
              {r.t}: <span style={{ color: '#8A7B6C' }}>{r.p}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ── 이것이 극사실이다 (헤드) ── */}
      <section style={{ padding: '20px 20px 24px', background: '#0B0907' }}>
        <h2 style={{
          fontFamily: "'Nanum Myeongjo',serif", fontSize: 22, fontWeight: 700,
          textAlign: 'center', margin: 0, color: '#F5EDE3', letterSpacing: '-.005em',
        }}>
          이것이 극사실이다
        </h2>
      </section>

      {/* ── 시술 후 클로즈업 슬라이더 ── */}
      <section style={{ padding: '0', background: '#0B0907' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#000' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CLOSEUP_IMGS[closeupIdx]} alt={`시술 후 ${closeupIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <button onClick={closeupPrev} aria-label="이전" style={arrowStyle('left')}>‹‹</button>
          <button onClick={closeupNext} aria-label="다음" style={arrowStyle('right')}>››</button>
        </div>
      </section>

      {/* ── Before / After 얼굴 좌우 분할 (중앙 배지) ── */}
      <section style={{ padding: '24px 0 0', background: '#0B0907' }}>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#000' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BA_LEFT} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', display: 'block' }} />
            <button onClick={baPrev} aria-label="이전"
              style={{ ...arrowStyle('left'), left: 6, background: 'transparent', border: 'none', fontSize: 22, color: '#F5EDE3' }}>‹‹</button>
          </div>
          <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#000' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BA_RIGHT} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', display: 'block' }} />
            <button onClick={baNext} aria-label="다음"
              style={{ ...arrowStyle('right'), right: 6, background: 'transparent', border: 'none', fontSize: 22, color: '#F5EDE3' }}>››</button>
          </div>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            padding: '10px 14px', textAlign: 'center', pointerEvents: 'none',
          }}>
            <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 12.5, color: '#F5EDE3', fontWeight: 700, letterSpacing: '.02em', textShadow: '0 2px 8px rgba(0,0,0,.85)', lineHeight: 1.4 }}>
              극사실눈썹<br/>창시자 장미지
            </div>
          </div>
        </div>
      </section>

      {/* ── 통계 3칸 + CTA 2 (시안 하단 · 배경 조금 밝은 상자) ── */}
      <section style={{ padding: '30px 20px 32px', background: '#100C0A' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 22 }}>
          {[
            { n: '20년+', l: '창시자 경력' },
            { n: '10,000+', l: '누적 시술' },
            { n: '1,000+', l: '누적 수강생' },
          ].map((s) => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond','Nanum Myeongjo',serif", fontSize: 22, color: '#E0C088', fontWeight: 700, letterSpacing: '.01em' }}>{s.n}</div>
              <div style={{ fontSize: 11, color: '#B8A897', marginTop: 4, letterSpacing: '.02em' }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Link href="/consult?type=procedure" style={{
            padding: '13px 6px', textAlign: 'center', textDecoration: 'none',
            background: 'transparent', border: '1px solid rgba(224,192,136,.55)',
            color: '#F5EDE3', fontSize: 12, fontWeight: 700, borderRadius: 2, letterSpacing: '-.005em',
          }}>
            원장시술상담신청
          </Link>
          <Link href="/consult?type=academy" style={{
            padding: '13px 6px', textAlign: 'center', textDecoration: 'none',
            background: 'rgba(224,192,136,.15)', border: '1px solid rgba(224,192,136,.55)',
            color: '#F5EDE3', fontSize: 12, fontWeight: 800, borderRadius: 2, letterSpacing: '-.005em',
          }}>
            교육상담신청
          </Link>
        </div>
      </section>

      {/* ═════════ PAGE 2 · 아카데미 차별화 + 커리큘럼 + 수강생 작품 ═════════ */}

      {/* ── 일반 반영구 vs ARTbrows 차이 ── */}
      <section style={{ padding: '40px 20px 20px', background: '#0B0907', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Pretendard',sans-serif", fontSize: 22, fontWeight: 800, margin: 0, color: '#F5EDE3', lineHeight: 1.35 }}>
          일반 반영구 아카데미와<br/>무엇이 다른가?
        </h2>
        <p style={{ marginTop: 8, fontSize: 12.5, color: '#B8A897', letterSpacing: '-.005em' }}>
          배우는 기술의 수준 자체가 다릅니다.
        </p>
      </section>
      <section style={{ padding: '0', background: '#0B0907' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${CANVA}/p2-macro-brow.jpg`} alt="눈썹 매크로" style={{ width: '100%', display: 'block' }} />
      </section>
      <section style={{ padding: '24px 24px 20px', background: '#0B0907', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#F5EDE3', lineHeight: 1.65, fontWeight: 500, letterSpacing: '-.005em', margin: 0 }}>
          진짜 눈썹을 반영구로 재현하기 위해<br/>
          진짜 눈썹을 보고, 그리고, 패턴화 하는 소묘에서 부터<br/>
          <b style={{ color: '#E0C088', fontWeight: 700 }}>극사실눈썹 수업</b>은 시작합니다.
        </p>
      </section>
      <section style={{ padding: '0 20px 40px', background: '#0B0907' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${CANVA}/p2-class-photo.jpg`} alt="강의 사진" style={{ width: '100%', display: 'block' }} />
      </section>

      {/* ── 초보를 프로로 만드는곳 · 비교표 ── */}
      <section style={{ padding: '20px 20px 12px', background: '#0B0907', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Pretendard',sans-serif", fontSize: 22, fontWeight: 800, margin: 0, color: '#F5EDE3' }}>
          초보를 프로로 만드는곳
        </h2>
        <p style={{ marginTop: 6, fontSize: 12.5, color: '#B8A897' }}>
          극사실 눈썹 창시자가 1:1 밀착으로 직접 가르칩니다.
        </p>
      </section>
      <section style={{ padding: '8px 20px 40px', background: '#0B0907' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, color: '#F5EDE3' }}>
          <thead>
            <tr style={{ background: '#14100C' }}>
              <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 700, borderBottom: '1px solid rgba(224,192,136,.2)', width: '35%' }}></th>
              <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700, borderBottom: '1px solid rgba(224,192,136,.2)', color: '#8A7B6C' }}>일반 아카데미</th>
              <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 800, borderBottom: '1px solid rgba(224,192,136,.4)', color: '#E0C088' }}>ARTbrows</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['접근 방식', '정해진 패턴 적용', '1:1 맞춤 소묘'],
              ['직강 여부', '조교·강사 진행', '창시자 100% 직강'],
              ['기술 근거', '표준 커리큘럼', '특허 3건 보유 기술'],
              ['수료 후', '사후관리 없음', '평생 A/S 피드백'],
            ].map(([k, a, b]) => (
              <tr key={k} style={{ borderBottom: '1px solid rgba(224,192,136,.1)' }}>
                <td style={{ padding: '10px 8px', color: '#B8A897', fontWeight: 600 }}>{k}</td>
                <td style={{ padding: '10px 8px', textAlign: 'center', color: '#8A7B6C', fontSize: 11.5 }}>{a}</td>
                <td style={{ padding: '10px 8px', textAlign: 'center', color: '#F5EDE3', fontWeight: 700, fontSize: 11.5 }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── 단계별 커리큘럼 로드맵 ── */}
      <section style={{ padding: '20px 20px 12px', background: '#0B0907', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Pretendard',sans-serif", fontSize: 22, fontWeight: 800, margin: 0, color: '#F5EDE3' }}>
          단계별 커리큘럼 로드맵
        </h2>
        <p style={{ marginTop: 6, fontSize: 12.5, color: '#B8A897' }}>
          입문부터 창업까지, 단계별로 완성됩니다.
        </p>
      </section>
      <section style={{ padding: '0', background: '#0B0907' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${CANVA}/p2-lip-illustration.jpg`} alt="커리큘럼 시각" style={{ width: '100%', display: 'block' }} />
      </section>
      <section style={{ padding: '24px 20px 20px', background: '#0B0907' }}>
        {[
          { n: 1, t: '이지클래스', d: '입문자를 위한 기초과정: 주1회 5주 15시간 오전11~2시' },
          { n: 2, t: '극사실소묘수업', d: '소묘원리 집중 3일 수업\n월 1회 3일 오전 11시~오후 6시까지' },
          { n: 3, t: '극사실눈썹 3일', d: '소묘를 얼굴에 시술하는 극사실눈썹 3일 수업\n월 1회 3일 오전 11~오후 6시 실습가능수업' },
          { n: 4, t: '단기창업반', d: '6개월 통합과정, 창업 멘토링, 마케팅, 샵이용 모두 포함 성공적 창업제시' },
        ].map((c) => (
          <div key={c.n} style={{
            display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12, alignItems: 'start',
            padding: '12px 12px', marginBottom: 8,
            border: '1px solid rgba(224,192,136,.35)', borderRadius: 4,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 99,
              background: 'linear-gradient(135deg,#E0C088,#B08862)', color: '#0B0907',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 900, marginTop: 2,
            }}>{c.n}</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#F5EDE3', letterSpacing: '-.005em' }}>{c.t}</div>
              <div style={{ marginTop: 3, fontSize: 11.5, color: '#B8A897', lineHeight: 1.55, whiteSpace: 'pre-line' }}>{c.d}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── CTA 2 (중간 위치) ── */}
      <section style={{ padding: '4px 20px 32px', background: '#0B0907' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Link href="/consult?type=procedure" style={ctaOutlineStyle()}>원장시술상담신청</Link>
          <Link href="/consult?type=academy" style={ctaFilledStyle()}>교육상담신청</Link>
        </div>
      </section>

      {/* ── 초보 수강생 작품 (실 사진 도착 시 재활성) ── */}
      <section style={{ padding: '20px 20px 40px', background: '#0B0907', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Pretendard',sans-serif", fontSize: 22, fontWeight: 800, margin: 0, color: '#F5EDE3' }}>
          초보 수강생 작품
        </h2>
        <p style={{ marginTop: 6, fontSize: 12.5, color: '#B8A897' }}>
          경력자 같은 초보 수강생들의 실제 작품
        </p>
        <div style={{
          marginTop: 16, padding: '18px 14px',
          border: '1px dashed rgba(224,192,136,.35)', borderRadius: 6,
          fontSize: 11.5, color: '#8A7B6C', letterSpacing: '-.005em',
        }}>
          실 수강생 작품 사진 준비 중
        </div>
      </section>

      {/* ═════════ PAGE 3 · FAQ + 오시는 길 + 소셜 + 최종 CTA ═════════ */}

      {/* ── 경험한 사람만 아는 차이 (헤딩만 · 후기는 소셜 grid 로 흡수) ── */}
      <section style={{ padding: '20px 20px 12px', background: '#0B0907', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Pretendard',sans-serif", fontSize: 22, fontWeight: 800, margin: 0, color: '#F5EDE3' }}>
          경험한 사람만 아는 차이
        </h2>
        <p style={{ marginTop: 6, fontSize: 12.5, color: '#B8A897' }}>
          수강생후기와 고객님들 후기입니다.
        </p>
      </section>

      {/* ── FAQ (자주 묻는 질문 · 아코디언) ── */}
      <section style={{ padding: '32px 20px 20px', background: '#0B0907' }}>
        <h2 style={{ fontFamily: "'Pretendard',sans-serif", fontSize: 20, fontWeight: 800, margin: '0 0 14px', color: '#F5EDE3' }}>
          자주 묻는 질문
        </h2>
        {[
          { q: '수강 순서는 어떻게 되나요?', a: '이지클래스 → 극사실기초 소묘수업 → 극사실눈썹 감의 순으로 진행되는 것을 권장합니다. 경력에 따라 상담 후 단계를 조정할 수 있습니다.' },
          { q: '재료비는 별도인가요?', a: '수강료에 포함 여부는 과정별로 다릅니다. 상담 시 안내드립니다.' },
          { q: '일정은 어떻게 진행되나요?', a: '월 개강 일정과 신청 방식은 상담 시 안내드립니다.' },
          { q: '입문자도 수강 가능한가요?', a: '네, 이지클래스는 입문자 대상으로 설계되어 있어 미경험자도 수강 가능합니다.' },
        ].map((f, i) => (
          <details key={i} style={{ padding: '12px 14px', borderTop: i === 0 ? '1px solid rgba(224,192,136,.15)' : 'none', borderBottom: '1px solid rgba(224,192,136,.15)' }}>
            <summary style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', fontSize: 13, fontWeight: 700, color: '#F5EDE3' }}>
              <span>{f.q}</span>
              <span style={{ color: '#E0C088', fontSize: 16, fontWeight: 400, marginLeft: 8 }}>+</span>
            </summary>
            <div style={{ marginTop: 8, fontSize: 12, color: '#B8A897', lineHeight: 1.65 }}>{f.a}</div>
          </details>
        ))}
      </section>

      {/* ── ARTbrows 미지아카데미 · 오시는 길 ── */}
      <section style={{ padding: '32px 20px 16px', background: '#0B0907', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Pretendard',sans-serif", fontSize: 22, fontWeight: 800, margin: 0, color: '#F5EDE3' }}>
          ARTbrows 미지아카데미
        </h2>
      </section>
      <section style={{ padding: '0 20px 12px', background: '#0B0907' }}>
        <a href="https://map.naver.com/p/search/미지아카데미" target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${CANVA}/p3-map.jpg`} alt="지도" style={{ width: '100%', display: 'block' }} />
        </a>
      </section>
      <section style={{ padding: '8px 20px 20px', background: '#0B0907' }}>
        <div style={{ fontSize: 12.5, color: '#F5EDE3', lineHeight: 1.7 }}>
          <div><b style={{ color: '#E0C088', fontWeight: 700 }}>주소</b> · 서울 강남구 봉은사로68길 55-3 2층</div>
          <div style={{ marginTop: 4 }}><b style={{ color: '#E0C088', fontWeight: 700 }}>교통</b> · 선릉역·삼성중앙역 인근</div>
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <a href="https://map.naver.com/p/search/미지아카데미" target="_blank" rel="noopener noreferrer" style={ctaOutlineStyle()}>네이버지도</a>
          <a href="https://map.kakao.com/link/search/서울 강남구 봉은사로68길 55-3 2층" target="_blank" rel="noopener noreferrer" style={ctaOutlineStyle()}>카카오맵</a>
        </div>
      </section>

      {/* ── 인스타그램 · 유튜브 쇼츠 grid ── */}
      <section style={{ padding: '32px 20px 12px', background: '#0B0907', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Pretendard',sans-serif", fontSize: 20, fontWeight: 800, margin: 0, color: '#F5EDE3' }}>
          인스타그램 · 유튜브 쇼츠
        </h2>
      </section>
      <section style={{ padding: '8px 20px 20px', background: '#0B0907' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <a key={n} href="https://www.instagram.com/artbrows_academy/" target="_blank" rel="noopener noreferrer"
              style={{ aspectRatio: '1/1', overflow: 'hidden', background: '#14100C', display: 'block' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${CANVA}/p3-social-0${n}.jpg`} alt={`SNS ${n}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </a>
          ))}
        </div>
      </section>

      {/* ── 소셜 링크 pill 3개 ── */}
      <section style={{ padding: '20px 20px 32px', background: '#0B0907' }}>
        {[
          { l: '인스타그램: @ARTbrows_academy', h: 'https://www.instagram.com/artbrows_academy/' },
          { l: 'youtube: @artbrows5453', h: 'https://www.youtube.com/@artbrows5453' },
          { l: 'blog: https://blog.naver.com/artbrows/', h: 'https://blog.naver.com/artbrows/' },
        ].map((s) => (
          <a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer"
            style={{ display: 'block', padding: '13px 16px', marginBottom: 10, textAlign: 'center', textDecoration: 'none', color: '#F5EDE3', fontSize: 12.5, fontWeight: 600, background: '#14100C', border: '1px solid rgba(224,192,136,.3)', borderRadius: 99 }}>
            {s.l}
          </a>
        ))}
      </section>

      {/* ── 최종 CTA 카드 2개 (교육 → 시술) ── */}
      <section style={{ padding: '16px 20px 20px', background: '#0B0907' }}>
        <div style={{
          padding: '24px 20px', textAlign: 'center',
          background: 'linear-gradient(135deg,#1A140E,#14100C)', border: '1px solid rgba(224,192,136,.3)',
          marginBottom: 12, borderRadius: 6,
        }}>
          <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 17, fontWeight: 700, color: '#F5EDE3', lineHeight: 1.4 }}>
            창시자의 기술,<br/>당신도 배울 수 있습니다
          </div>
          <div style={{ marginTop: 6, fontSize: 11.5, color: '#B8A897' }}>
            이지클래스 · 소묘수업 · 극사실눈썹 감의 · 플래그십 창업반
          </div>
          <Link href="/consult?type=academy" style={{ ...ctaFilledStyle(), display: 'inline-block', marginTop: 14, padding: '12px 32px' }}>교육상담신청</Link>
        </div>
        <div style={{
          padding: '24px 20px', textAlign: 'center',
          background: 'linear-gradient(135deg,#1A140E,#14100C)', border: '1px solid rgba(224,192,136,.3)',
          borderRadius: 6,
        }}>
          <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 17, fontWeight: 700, color: '#F5EDE3', lineHeight: 1.4 }}>
            지금 시술을 원하신다면
          </div>
          <div style={{ marginTop: 6, fontSize: 11.5, color: '#B8A897' }}>
            원장 단독 시술 · 소수 인원만 진행
          </div>
          <Link href="/consult?type=procedure" style={{ ...ctaFilledStyle(), display: 'inline-block', marginTop: 14, padding: '12px 32px' }}>원장시술상담신청</Link>
        </div>
      </section>

      {/* 하단 여백 */}
      <div style={{ height: 24, background: '#0B0907' }} />
    </main>
  );
}

function ctaOutlineStyle(): React.CSSProperties {
  return {
    padding: '13px 6px', textAlign: 'center', textDecoration: 'none',
    background: 'transparent', border: '1px solid rgba(224,192,136,.55)',
    color: '#F5EDE3', fontSize: 12, fontWeight: 700, borderRadius: 2,
    letterSpacing: '-.005em', display: 'block',
  };
}
function ctaFilledStyle(): React.CSSProperties {
  return {
    padding: '13px 6px', textAlign: 'center', textDecoration: 'none',
    background: 'linear-gradient(135deg,#E0C088,#B08862)',
    color: '#0B0907', fontSize: 12, fontWeight: 800, borderRadius: 2,
    letterSpacing: '-.005em', display: 'block',
  };
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: 6,
    background: 'transparent', color: '#F5EDE3', border: 'none',
    fontSize: 22, cursor: 'pointer', padding: 6, lineHeight: 1,
    textShadow: '0 2px 4px rgba(0,0,0,.7)',
  };
}
