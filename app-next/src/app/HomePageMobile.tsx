'use client';

/**
 * HomePageMobile — 원장 시안 정본 (2026-08-07)
 * 원장님 배포 KakaoTalk_20260806 시안 그대로 재구조화 · 스토리 순서 지킴
 *   히어로 → 인트로 카피 → 시술 전 → 인용 → 특허 3장 → 가격 비교 → 시술 후 슬라이더
 *   → Before/After 얼굴 → 통계 → CTA 2 (원장시술상담·교육상담) → FloatingCTA
 *
 * ⚠ 실 사진 대기: 시술전 클로즈업 · Before/After 얼굴 좌우 · 시술후 눈썹 슬라이더용 정본
 *   현재는 SAFE POOL 자산 (kidol-brow · founder-real) 임시 배치
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FloatingCTA from './FloatingCTA';
import type { Lang } from '@/app/cardnews/types';

// 2026-08-07 · CDN 다운 대비 로컬 자산으로 임시 매핑 · 원장 실 사진 도착 시 재교체
const HERO_IMG = '/brand/course8-2026-07-30/03-founder.jpg';
const BEFORE_TREATMENT_IMG = '/brand/founder-real-2026-08-03/miji01w.png';
const CLOSEUP_IMGS = [
  '/brand/hero/kidol-brow-01.png',
  '/brand/hero/kidol-brow-02.png',
  '/brand/hero/kidol-brow-03.png',
];
// Before/After 얼굴 좌우 · 원장 실 촬영 도착 시 교체 (안내 문구 노출)
const BA_LEFT = '/brand/hero/kidol-brow-02.png';
const BA_RIGHT = '/brand/hero/kidol-brow-03.png';
// 특허 원본 이미지는 CDN 이관 후 복구 예정. 지금은 텍스트 카드로 대체.
const PATENTS = [
  { no: '10-2639903', kind: '특허', title: '반영구 시술 방법' },
  { no: '40-2300477', kind: '상표', title: 'ARTbrows' },
  { no: '10-2863985', kind: '특허', title: '반영구 시술 도구' },
];

const LANG_TAB: { key: Lang; label: string; href: string }[] = [
  { key: 'ko', label: 'KO', href: '/' },
  { key: 'en', label: 'EN', href: '/en' },
  { key: 'zh', label: '中', href: '/zh' },
];

export default function HomePageMobile({ lang }: { lang: Lang }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closeupIdx, setCloseupIdx] = useState(0);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeupPrev = () => setCloseupIdx((i) => (i - 1 + CLOSEUP_IMGS.length) % CLOSEUP_IMGS.length);
  const closeupNext = () => setCloseupIdx((i) => (i + 1) % CLOSEUP_IMGS.length);

  return (
    <main style={{ background: '#0B0907', color: '#F5EDE3', minHeight: '100vh', overflowX: 'hidden', paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 0))' }}>

      {/* ── 상단 GNB (장미지 ARTBROWS + 언어 스위처 + 햄버거) ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 80,
        background: 'linear-gradient(180deg,rgba(11,9,7,.96),rgba(11,9,7,.85))',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(224,192,136,.15)',
        padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 6, textDecoration: 'none', color: '#F5EDE3' }}>
          <span style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 15, fontWeight: 700, color: '#E0C088', letterSpacing: '.02em' }}>장미지</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, fontWeight: 600, letterSpacing: '.18em' }}>ARTBROWS</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {LANG_TAB.map((t) => (
            <Link key={t.key} href={t.href}
              style={{
                padding: '5px 8px', minWidth: 28, textAlign: 'center',
                fontSize: 11, letterSpacing: '.06em', fontWeight: 700,
                textDecoration: 'none',
                color: t.key === lang ? '#0B0907' : '#F5EDE3',
                background: t.key === lang ? '#E0C088' : 'transparent',
                border: '1px solid rgba(224,192,136,.35)',
                borderRadius: 4,
              }}>{t.label}</Link>
          ))}
          <button onClick={() => setMenuOpen((v) => !v)} aria-label="menu"
            style={{ marginLeft: 6, background: 'transparent', border: 'none', color: '#E0C088', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {menuOpen ? (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* 햄버거 오버레이 */}
      {menuOpen ? (
        <div style={{ position: 'fixed', inset: '52px 0 0 0', background: 'rgba(11,9,7,.98)', zIndex: 79, padding: 24, overflowY: 'auto' }}>
          {[
            { l: '아카데미 방법론', h: '/academy/methodology' },
            { l: '수강 신청', h: '/enroll' },
            { l: '상담 신청', h: '/consult' },
            { l: '오시는 길', h: '/contact' },
            { l: '연구원 후기', h: '/review/2026-07-22' },
            { l: '무료 강의 (K1 카톡방)', h: 'https://open.kakao.com/o/gWeAkSzi', ext: true },
            { l: '인스타그램', h: 'https://www.instagram.com/artbrows_academy/', ext: true },
          ].map((it) => (
            <a key={it.l} href={it.h} target={it.ext ? '_blank' : undefined} rel={it.ext ? 'noopener noreferrer' : undefined}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '18px 8px', borderBottom: '1px solid rgba(224,192,136,.15)', color: '#F5EDE3', textDecoration: 'none', fontFamily: "'Nanum Myeongjo',serif", fontSize: 18 }}>
              {it.l} <span style={{ float: 'right', color: '#E0C088' }}>→</span>
            </a>
          ))}
        </div>
      ) : null}

      {/* ── HERO · 원장 얼굴 + 극사실눈썹 대헤드 ── */}
      <section style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', background: '#000' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMG} alt="장미지 원장" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 25%', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(11,9,7,.75) 78%, #0B0907 100%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 28, textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{
            fontFamily: "'Nanum Myeongjo',serif",
            fontSize: 44, fontWeight: 700, lineHeight: 1.05,
            color: '#F5EDE3', margin: 0, letterSpacing: '.02em',
            textShadow: '0 2px 12px rgba(0,0,0,.6)',
          }}>극사실눈썹</h1>
          <div style={{ marginTop: 12, fontFamily: "'Nanum Myeongjo',serif", fontSize: 14, color: '#E0C088', letterSpacing: '.03em' }}>
            창시자 <b style={{ fontWeight: 700 }}>ARTbrows 장미지 원장</b>
          </div>
          <div style={{ marginTop: 4, fontSize: 12, color: 'rgba(245,237,227,.75)', letterSpacing: '.05em' }}>
            국내최초 극사실눈썹 수강 시작
          </div>
        </div>
      </section>

      {/* ── INTRO · 브랜드 선언 카피 ── */}
      <section style={{ padding: '40px 24px 32px', background: '#0B0907', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Nanum Myeongjo',serif",
          fontSize: 19, lineHeight: 1.6, color: '#F5EDE3', margin: 0, fontWeight: 500,
        }}>
          반영구, 눈썹문신을 초월한,<br/>
          진짜 눈썹으로 새로 태어나는 기술<br/>
          <span style={{ color: '#E0C088' }}>오직 이곳에만 있습니다.</span>
        </p>
      </section>

      {/* ── 시술 전 클로즈업 (문제 제시) ── */}
      <section style={{ padding: '0 20px 8px', background: '#0B0907' }}>
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden',
          background: '#14100C', border: '1px solid rgba(224,192,136,.15)',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BEFORE_TREATMENT_IMG} alt="시술 전" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', top: 10, left: 10, padding: '4px 10px', background: 'rgba(11,9,7,.85)', border: '1px solid rgba(224,192,136,.4)', fontSize: 10, color: '#E0C088', letterSpacing: '.15em', fontWeight: 800 }}>
            BEFORE
          </div>
        </div>
      </section>

      {/* ── 인용 (원장 선언) ── */}
      <section style={{ padding: '32px 24px', background: '#0B0907', textAlign: 'center' }}>
        <blockquote style={{
          margin: 0, fontFamily: "'Nanum Myeongjo',serif",
          fontSize: 20, lineHeight: 1.55, color: '#F5EDE3', fontWeight: 500,
        }}>
          <span style={{ color: '#E0C088', fontSize: 24, verticalAlign: 'top', lineHeight: 1 }}>“</span>
          이것은 눈썹문신이 아니다<br/>
          새로 태어난 내 진짜 눈썹이다.
          <span style={{ color: '#E0C088', fontSize: 24, verticalAlign: 'bottom', lineHeight: 1 }}>”</span>
        </blockquote>
        <p style={{ marginTop: 16, fontSize: 13, color: '#B8A897', lineHeight: 1.55 }}>
          그래서 이 기술은,<br/>
          <b style={{ color: '#F5EDE3', fontWeight: 700 }}>아무나 가르치지 않습니다.</b>
        </p>
      </section>

      {/* ── 특허 3장 나란히 (텍스트 카드 · 원본 스캔 CDN 복구 후 이미지로 교체) ── */}
      <section style={{ padding: '16px 20px 32px', background: '#0B0907' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {PATENTS.map((p) => (
            <div key={p.no} style={{
              aspectRatio: '3/4', padding: '12px 8px',
              background: 'linear-gradient(135deg,#1A140E,#0F0B08)',
              border: '1px solid rgba(224,192,136,.35)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
              textAlign: 'center',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 99,
                background: 'linear-gradient(135deg,#E0C088,#B08862)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0B0907', fontSize: 16, fontWeight: 900,
              }}>★</div>
              <div>
                <div style={{ fontSize: 9.5, letterSpacing: '.18em', color: '#E0C088', fontWeight: 800 }}>{p.kind}</div>
                <div style={{ marginTop: 4, fontFamily: "'Nanum Myeongjo',serif", fontSize: 11, color: '#F5EDE3', fontWeight: 700, lineHeight: 1.35 }}>
                  {p.title}
                </div>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 10, color: '#8A7B6C', letterSpacing: '.02em' }}>
                제 {p.no}호
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, textAlign: 'center', fontSize: 10, color: '#8A7B6C', letterSpacing: '.05em' }}>
          특허 원본 스캔 이미지 준비 중 · 정식 오픈 시 이미지 교체
        </div>
      </section>

      {/* ── 왜 극사실 눈썹이 최상위 기술인가? · 가격 비교표 ── */}
      <section style={{ padding: '32px 20px', background: '#0F0D0B' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#E0C088', letterSpacing: '.28em', fontWeight: 800, marginBottom: 8 }}>“</div>
          <h2 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 22, fontWeight: 600, lineHeight: 1.35, margin: 0, color: '#F5EDE3' }}>
            왜 극사실 눈썹이<br/>
            <span style={{ color: '#E0C088' }}>최상위 기술</span>인가?
          </h2>
          <div style={{ fontSize: 11, color: '#E0C088', letterSpacing: '.28em', fontWeight: 800, marginTop: 4 }}>”</div>
        </div>

        {/* ONE TOP · 극사실 */}
        <div style={{
          padding: '14px 14px 16px', background: 'linear-gradient(135deg, #1A140E, #0F0B08)',
          border: '1px solid rgba(224,192,136,.5)', marginBottom: 8,
          boxShadow: '0 6px 20px rgba(224,192,136,.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{
              display: 'inline-block', padding: '4px 10px', background: '#E0C088', color: '#0B0907',
              fontSize: 10, fontWeight: 900, letterSpacing: '.1em',
            }}>ONE TOP</span>
            <span style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 15, fontWeight: 700, color: '#F5EDE3' }}>극사실눈썹</span>
          </div>
          <div style={{ fontSize: 13, color: '#E0C088', fontWeight: 700, marginBottom: 8 }}>
            XXX만원 이상의 시술금액대
          </div>
          <div style={{ fontSize: 11.5, color: '#B8A897', lineHeight: 1.55 }}>
            털의 구조와 비율, 눈썹의 형태를 고려하여 눈썹의 결이 잡히듯 그리는 기술로 · 고객의 완벽한 비율을 조정하여 눈썹으로 인상을 바꾸는 기술
          </div>
        </div>

        {/* 등급별 비교 */}
        {[
          { n: '02', t: '헤어 스트로크', p: '30~100만원 이하' },
          { n: '03', t: '화장눈썹 / 면눈썹', p: '10~30만원' },
          { n: '04', t: '자연눈썹 / 엠보기법 / 칼로긋는기법', p: '5만원~30만원' },
        ].map((r) => (
          <div key={r.n} style={{
            padding: '11px 12px', background: '#14100C',
            borderLeft: '2px solid rgba(224,192,136,.25)',
            marginBottom: 4,
            display: 'grid', gridTemplateColumns: '24px 1fr', gap: 10, alignItems: 'start',
          }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: '#8A7B6C', fontWeight: 700, lineHeight: 1.2 }}>{r.n}</div>
            <div>
              <div style={{ fontSize: 12.5, color: '#F5EDE3', fontWeight: 600, lineHeight: 1.35 }}>{r.t}</div>
              <div style={{ marginTop: 3, fontSize: 11, color: '#8A7B6C', letterSpacing: '.02em' }}>{r.p}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── 이것이 극사실이다 · 시술 후 클로즈업 슬라이더 ── */}
      <section style={{ padding: '40px 0 24px', background: '#0B0907' }}>
        <h2 style={{
          fontFamily: "'Nanum Myeongjo',serif", fontSize: 22, fontWeight: 600,
          textAlign: 'center', margin: '0 0 18px', color: '#F5EDE3', letterSpacing: '.02em',
        }}>
          이것이 <span style={{ color: '#E0C088' }}>극사실</span>이다
        </h2>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#000' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CLOSEUP_IMGS[closeupIdx]} alt={`시술 후 ${closeupIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <button onClick={closeupPrev} aria-label="이전"
            style={arrowStyle('left')}>‹</button>
          <button onClick={closeupNext} aria-label="다음"
            style={arrowStyle('right')}>›</button>
          <div style={{
            position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 6,
          }}>
            {CLOSEUP_IMGS.map((_, i) => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: 99,
                background: i === closeupIdx ? '#E0C088' : 'rgba(255,255,255,.35)',
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Before / After 얼굴 좌우 분할 ── */}
      <section style={{ padding: '24px 0', background: '#0B0907' }}>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#000' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BA_LEFT} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(.1) brightness(.9)' }} />
            <div style={{ position: 'absolute', top: 10, left: 10, padding: '3px 8px', background: 'rgba(11,9,7,.85)', border: '1px solid rgba(224,192,136,.4)', fontSize: 9, color: '#E0C088', letterSpacing: '.15em', fontWeight: 800 }}>‹‹</div>
          </div>
          <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#000' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BA_RIGHT} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', top: 10, right: 10, padding: '3px 8px', background: 'rgba(11,9,7,.85)', border: '1px solid rgba(224,192,136,.4)', fontSize: 9, color: '#E0C088', letterSpacing: '.15em', fontWeight: 800 }}>››</div>
          </div>
          {/* 중앙 텍스트 배지 */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            padding: '12px 18px', background: 'rgba(11,9,7,.78)', border: '1px solid rgba(224,192,136,.4)',
            textAlign: 'center', backdropFilter: 'blur(6px)',
          }}>
            <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 13, color: '#F5EDE3', fontWeight: 700, letterSpacing: '.02em' }}>
              극사실눈썹<br/>창시자 장미지
            </div>
          </div>
        </div>
      </section>

      {/* ── 통계 3칸 · 원장 시안 수치 ── */}
      <section style={{ padding: '32px 20px 24px', background: '#0B0907' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { n: '20년+', l: '창시자 경력' },
            { n: '10,000+', l: '누적 시술' },
            { n: '1,000+', l: '누적 수강생' },
          ].map((s) => (
            <div key={s.l} style={{ padding: '14px 8px', background: '#14100C', border: '1px solid rgba(224,192,136,.2)', borderRadius: 6, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond','Nanum Myeongjo',serif", fontSize: 24, color: '#E0C088', fontWeight: 700, letterSpacing: '.01em' }}>{s.n}</div>
              <div style={{ fontSize: 11, color: '#B8A897', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 인라인 CTA 2 · 원장 시안 (원장시술상담 · 교육상담) ── */}
      <section style={{ padding: '8px 20px 40px', background: '#0B0907' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Link href="/consult?type=procedure" style={{
            padding: '14px 6px', textAlign: 'center', textDecoration: 'none',
            background: '#14100C', border: '1px solid rgba(224,192,136,.5)',
            color: '#F5EDE3', fontSize: 12, fontWeight: 700,
            borderRadius: 4,
          }}>
            원장 시술 상담
          </Link>
          <Link href="/consult?type=academy" style={{
            padding: '14px 6px', textAlign: 'center', textDecoration: 'none',
            background: 'linear-gradient(135deg,#E0C088,#B08862)',
            color: '#0B0907', fontSize: 12, fontWeight: 800,
            borderRadius: 4,
          }}>
            교육 상담 신청
          </Link>
        </div>
      </section>

      {/* 하단 고정 CTA (K1·상담·전화 · FloatingCTA 유지) */}
      <FloatingCTA variant="mobile" />
    </main>
  );
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: 8,
    width: 34, height: 34, borderRadius: 99,
    background: 'rgba(11,9,7,.55)', color: '#F5EDE3',
    border: '1px solid rgba(224,192,136,.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, cursor: 'pointer', backdropFilter: 'blur(4px)',
  };
}
