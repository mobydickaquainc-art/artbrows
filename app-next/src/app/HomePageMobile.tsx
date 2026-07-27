'use client';

/**
 * HomePageMobile — 모바일 우선 홈 (2026-07-27 Phase 1 · 대표님 「데스크톱·모바일 2개 분리」 지시)
 * 유미 (youme-beauty.com) 모바일 UX 벤치마크 · Maison Noir 톤 유지 (유나 사수)
 * 골격만 · Phase 2~3 에서 Before/After 슬라이더·페르소나 카드·본원 카드 추가
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FloatingCTA from './FloatingCTA';
import BeforeAfterCarousel from './BeforeAfterCarousel';
import AtelierTour from './AtelierTour';
import TrustAssets from './TrustAssets';
import type { Lang } from '@/app/cardnews/types';
import { getMessages, type HomeMessages } from '@/lib/i18n/messages';

// 2026-07-27 · 대표님 지정 · 강의 시연 다큐멘터리
const HERO_IMG = '/brand/hero-main-20260724.jpg';

export default function HomePageMobile({ lang }: { lang: Lang }) {
  const m: HomeMessages = getMessages(lang);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [menuOpen]);

  return (
    <main style={{ background: '#0B0907', color: '#F5EDE3', minHeight: '100vh', paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 0))' }}>
      {/* ── 상단 GNB (모바일 · 햄버거) ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 80,
        background: 'linear-gradient(180deg,rgba(11,9,7,.96),rgba(11,9,7,.85))',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(224,192,136,.15)',
        padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: '#F5EDE3' }}>
          <span style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 15, fontWeight: 700, letterSpacing: '.04em' }}>ARTbrows</span>
          <span style={{ fontSize: 9, color: '#8A7B6C', letterSpacing: '.15em', marginTop: 1 }}>MIJI JANG · 20YR</span>
        </Link>
        <button onClick={() => setMenuOpen((v) => !v)} aria-label="menu"
          style={{ background: 'transparent', border: 'none', color: '#E0C088', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {menuOpen ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
          )}
        </button>
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

      {/* ── HERO (Full-bleed · 원장 인물 배경 · 대헤드 + 즉시 CTA 1개) ── */}
      <section style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', background: '#000' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMG} alt="장미지 원장" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(11,9,7,.85) 90%, #0B0907 100%)' }} />
        <div style={{ position: 'absolute', left: 20, right: 20, bottom: 28, textAlign: 'left' }}>
          <div style={{ fontSize: 10, letterSpacing: '.32em', color: '#E0C088', fontWeight: 800, marginBottom: 8 }}>ARTBROWS · SINCE THE ORIGINAL</div>
          <h1 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 30, fontWeight: 500, lineHeight: 1.28, color: '#F5EDE3', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,.5)' }}>
            {m.hero.headline || '극사실눈썹,\n그 원본의 손에서.'.split('\n').map((s, i) => <span key={i} style={{ display: 'block' }}>{s}</span>)}
          </h1>
          <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(245,237,227,.85)', lineHeight: 1.55 }}>
            20년+ 경력 · 5,000+ 시술 · 창업 수백여명 · 특허 3장
          </div>
          <Link href="/enroll" style={{ display: 'inline-block', marginTop: 18, padding: '13px 28px', background: 'linear-gradient(135deg,#E0C088,#B08862)', color: '#0B0907', borderRadius: 99, textDecoration: 'none', fontWeight: 800, fontSize: 14, letterSpacing: '.04em', boxShadow: '0 4px 14px rgba(224,192,136,.35)' }}>
            지금 무료 강의 신청 →
          </Link>
        </div>
      </section>

      {/* ── 신뢰 자산 4 카드 (통계) ── */}
      <section style={{ padding: '32px 20px', background: '#0B0907' }}>
        <div style={{ fontSize: 10, letterSpacing: '.28em', color: '#C9A66B', fontWeight: 800, marginBottom: 14 }}>NUMBERS · MIJI JANG</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { n: '20년+', l: '반영구 시술 경력' },
            { n: '5,000+', l: '시술 건수' },
            { n: '900+', l: '수강생 배출' },
            { n: '3장', l: '반영구 특허' },
          ].map((s) => (
            <div key={s.l} style={{ padding: '16px 14px', background: '#14100C', border: '1px solid rgba(224,192,136,.2)', borderRadius: 8 }}>
              <div style={{ fontFamily: "'Cormorant Garamond','Nanum Myeongjo',serif", fontSize: 30, color: '#E0C088', fontWeight: 700, letterSpacing: '.01em' }}>{s.n}</div>
              <div style={{ fontSize: 11.5, color: '#B8A897', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 학생 페르소나 4 카드 (유미 CONCERN 카피 · 콘텐츠 치환) — Phase 2 에서 상세화 ── */}
      <section style={{ padding: '28px 20px', background: '#0F0D0B' }}>
        <div style={{ fontSize: 10, letterSpacing: '.28em', color: '#C9A66B', fontWeight: 800, marginBottom: 6 }}>CONCERN · 어떤 분이 오시나요?</div>
        <h2 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 20, fontWeight: 500, lineHeight: 1.4, margin: '0 0 16px' }}>
          지금 필요한 배움은<br/>어느 쪽에 더 가까우신가요?
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '🌱', t: '완전 초보', d: '반영구가 처음이라 뭐부터 배워야 할지 모르겠어요', cta: '이지 클래스 15기' },
            { icon: '🔁', t: '재교육', d: '다른 학원 배웠는데 실전에서 안 됩니다', cta: '극사실 3일 집중' },
            { icon: '💼', t: '창업 준비', d: '내 매장을 열고 싶습니다', cta: '창업반 890만원' },
            { icon: '🎓', t: '현직 원장 심화', d: '한 단계 더 올리고 싶어요', cta: '패키지 199만원' },
          ].map((c) => (
            <Link key={c.t} href="/consult" style={{ display: 'flex', gap: 12, padding: 14, background: '#14100C', border: '1px solid rgba(224,192,136,.15)', borderRadius: 8, textDecoration: 'none', color: '#F5EDE3' }}>
              <div style={{ fontSize: 26, lineHeight: 1 }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 15, fontWeight: 700 }}>{c.t}</div>
                <div style={{ fontSize: 12, color: '#8A7B6C', marginTop: 3, lineHeight: 1.5 }}>{c.d}</div>
                <div style={{ marginTop: 6, fontSize: 11.5, color: '#E0C088', letterSpacing: '.04em', fontWeight: 700 }}>추천: {c.cta} →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Before / After 캐러셀 (Phase 2 완료) ── */}
      <section style={{ padding: '28px 20px', background: '#0B0907' }}>
        <div style={{ fontSize: 10, letterSpacing: '.28em', color: '#C9A66B', fontWeight: 800, marginBottom: 6 }}>BEFORE & AFTER</div>
        <h2 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 20, fontWeight: 500, margin: '0 0 14px', lineHeight: 1.4 }}>
          결의 차이,<br/>30년 노하우로 완성됩니다.
        </h2>
        <BeforeAfterCarousel variant="mobile" />
      </section>

      {/* ── 신뢰 자산 3 카드 (Phase 3 · 특허·상표 + 창업 + 강의자료) ── */}
      <section style={{ padding: '28px 20px', background: '#0F0D0B' }}>
        <div style={{ fontSize: 10, letterSpacing: '.28em', color: '#C9A66B', fontWeight: 800, marginBottom: 6 }}>TRUST · 원장 정본 자산</div>
        <h2 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 20, fontWeight: 500, margin: '0 0 14px', lineHeight: 1.4 }}>
          숫자가 아닌<br/>정본으로 증명합니다.
        </h2>
        <TrustAssets variant="mobile" />
      </section>

      {/* ── 커리큘럼 요약 → 상세 이동 ── */}
      <section style={{ padding: '28px 20px', background: '#0F0D0B' }}>
        <div style={{ fontSize: 10, letterSpacing: '.28em', color: '#C9A66B', fontWeight: 800, marginBottom: 6 }}>CURRICULUM · 5 프로그램</div>
        <h2 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 20, fontWeight: 500, margin: '0 0 14px' }}>원장님이 직접 가르칩니다</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { n: '01', t: '이지 클래스 15기', p: '69만원', s: '5주 15h · 반영구 입문 정석' },
            { n: '02', t: '극사실 3일 집중', p: '169만원', s: '3일 · 원장 직강 · 소묘 3회 포함' },
            { n: '03', t: '패키지 (이지+극사실+심화)', p: '199만원', s: '심화 3개월 · 실습 무제한' },
            { n: '04', t: '창업반 890 15기', p: '890만원', s: '6개월 + 추가 6개월 실습 무제한' },
          ].map((c) => (
            <Link key={c.n} href="/enroll" style={{ display: 'flex', gap: 12, padding: '12px 14px', background: '#14100C', border: '1px solid rgba(224,192,136,.15)', borderRadius: 8, textDecoration: 'none', color: '#F5EDE3', alignItems: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: '#E0C088', fontWeight: 700, minWidth: 32 }}>{c.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.t}</div>
                <div style={{ fontSize: 11, color: '#8A7B6C', marginTop: 2 }}>{c.s}</div>
              </div>
              <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 15, color: '#E0C088', fontWeight: 700 }}>{c.p}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 본원 · 아틀리에 인터랙티브 (Phase 2 완료) ── */}
      <section style={{ padding: '28px 20px 40px', background: '#0B0907' }}>
        <div style={{ fontSize: 10, letterSpacing: '.28em', color: '#C9A66B', fontWeight: 800, marginBottom: 6 }}>ATELIER · 선릉 본원</div>
        <h2 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 20, fontWeight: 500, margin: '0 0 14px' }}>원장님이 강의하시는 공간</h2>
        <AtelierTour variant="mobile" />
      </section>

      {/* 하단 고정 CTA */}
      <FloatingCTA variant="mobile" />
    </main>
  );
}
