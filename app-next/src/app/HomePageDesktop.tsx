'use client';

// 2026-07-27 · 대표님 지시 「데스크톱·모바일 분리」 → 구 HomePage.tsx 를 Desktop 전용으로 리네임
// 우하단 상담 pill 을 유미식 우측 세로 플로팅 6개 CTA (FloatingCTA) 로 대체

import Link from 'next/link';
import FloatingCTA from './FloatingCTA';
import BeforeAfterCarousel from './BeforeAfterCarousel';
import AtelierTour from './AtelierTour';
import TrustAssets from './TrustAssets';
import { getMessages, type HomeMessages } from '@/lib/i18n/messages';
import type { Lang } from '@/app/cardnews/types';

// 이미지 경로 (언어 무관 · 상수)
// 2026-07-21 · Higgsfield 15장 신규 · PILLAR 4장 업그레이드 (품질·톤 통일)
const PILLAR_IMGS = [
  '/brand/ai-generated/macro/macro-01.png',        // 극사실 눈썹 매크로
  '/brand/ai-generated/hand-pencil/hand-01.png',   // 시술 전 펜슬 설계 · 손끝
  '/brand/ai-generated/atelier/atelier-01.png',    // 선릉 아틀리에 무드
  '/brand/ai-generated/atelier/atelier-02.png',    // 아틀리에 시술베드
];
// 2026-07-27 · 대표님 지정 · 강의 시연 다큐멘터리 (원장님 소묘 · 수강생 스마트폰 촬영)
// KakaoTalk_20260724_191628747_03.jpg · 2048x1365 landscape
const HERO_PORTRAIT = '/brand/hero-main-20260724.jpg';
const HERO_TRIPTYCH = [
  { src: '/brand/hero-main-20260724.jpg',                              tag: 'LIVE CLASS · SEONLEUNG', role: 'main'  as const },
  { src: '/brand/ai-generated/founder-persona/founder-03.png',         tag: 'FOUNDER',                role: 'sub-1' as const },
  { src: '/brand/reference-cards-2026-07-24/02-founder-lecture.png',   tag: 'HYPERREAL',              role: 'sub-2' as const },
];

const LANG_HREF: Record<Lang, string> = { ko: '/', en: '/en', zh: '/zh' };

function markHighlight(text: string, part?: string) {
  if (!part || !text.includes(part)) return text;
  const [before, ...after] = text.split(part);
  return (
    <>
      {before}
      <b>{part}</b>
      {after.join(part)}
    </>
  );
}

function goldHighlight(text: string, part?: string) {
  if (!part || !text.includes(part)) return text;
  const [before, ...after] = text.split(part);
  return (
    <>
      {before}
      <span className="gold">{part}</span>
      {after.join(part)}
    </>
  );
}

export default function HomePage({ lang, variant = 'founder' }: { lang: Lang; variant?: 'founder' | 'manager' }) {
  const m: HomeMessages = getMessages(lang);
  const isManager = variant === 'manager';

  // 본부장 스토리보드 원본 = 핫핑크 CTA + Hero 팔레트 힌트 사각 + 얇은 핑크 스트립 + "WILD BROW" 라벨
  const ctaGoldStyle = isManager
    ? { background: '#FF3D6E', color: '#fff' } // 핫핑크 (스토리보드 원본)
    : undefined; // 기본 = 골드 (styles/globals.css)
  const heroLabel = isManager
    ? '原相机直出 · NATURAL · WILD BROW'
    : m.hero.figureLabel;

  return (
    <>
      {/* 통합 상단 1줄 GNB (2026-07-20 · 유미코리아 벤치 · 본부장 warmth 조합) */}
      <nav className="top" style={{ background: 'linear-gradient(180deg, rgba(11,9,7,0.96) 0%, rgba(11,9,7,0.88) 100%)', backdropFilter: 'blur(10px)' }}>
        <div className="wrap">
          <div className="nav-row" style={{ display: 'flex', alignItems: 'center', gap: 20, minHeight: 62 }}>
            {/* LEFT: icons + brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a href="https://open.kakao.com/o/gWeAkSzi" target="_blank" rel="noopener noreferrer" aria-label="KakaoTalk K1"
                 style={{ color: 'var(--rose-soft)', display: 'inline-flex', width: 20, height: 20 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.84 5.32 4.6 6.72L5.4 21.6c-.09.28.22.51.47.35l4.4-2.9c.56.06 1.13.1 1.73.1 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>
              </a>
              <a href="https://www.instagram.com/artbrows_academy/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                 style={{ color: 'var(--rose-soft)', display: 'inline-flex', width: 20, height: 20 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>
              </a>
              <div className="brand" style={{ marginLeft: 6 }}>
                {m.gnb.brand}<span className="sub">{m.gnb.brandSub}</span>
              </div>
            </div>

            {/* MIDDLE: 4 메뉴 (2026-07-20 회의 확정) */}
            <ul style={{ display: 'flex', gap: 28, listStyle: 'none', margin: '0 auto', padding: 0 }}>
              <li><a href="#founder">{lang === 'zh' ? '院长' : lang === 'en' ? 'Founder' : '대표원장'}</a></li>
              <li><a href="#hyperreal">{lang === 'zh' ? '张美枝极写实眉' : lang === 'en' ? 'JMJ Hyperreal Brow' : '장미지 극사실눈썹'}</a></li>
              <li><a href="#portfolio">{lang === 'zh' ? '作品集' : lang === 'en' ? 'Portfolio' : '포트폴리오'}</a></li>
              <li><a href="#academy">{lang === 'zh' ? '学院' : lang === 'en' ? 'Academy' : '아카데미'}</a></li>
            </ul>

            {/* RIGHT: lang + 2 CTA (교육·시술) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="lang">
                <Link href={LANG_HREF.ko} className={lang === 'ko' ? 'on' : ''}>{m.langLabels.ko}</Link>
                <Link href={LANG_HREF.en} className={lang === 'en' ? 'on' : ''}>{m.langLabels.en}</Link>
                <Link href={LANG_HREF.zh} className={lang === 'zh' ? 'on' : ''}>{m.langLabels.zh}</Link>
              </div>
              <a href="https://jangmiji.staris.cloud" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--gold-light)', fontSize: 11, letterSpacing: '0.24em', padding: '4px 10px', borderLeft: '1px solid var(--line)', textTransform: 'uppercase' }}>
                {m.gnb.menu.admin}
              </a>
              <Link href="/enroll"
                style={{
                  marginLeft: 4, padding: '9px 18px',
                  background: 'transparent',
                  color: 'var(--gold-light)', fontWeight: 500, fontSize: 11,
                  letterSpacing: '.14em', textDecoration: 'none', borderRadius: 0,
                  border: '1px solid var(--gold-deep)', textTransform: 'uppercase',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                {lang === 'zh' ? '课程咨询' : lang === 'en' ? 'COURSE CONSULT' : '교육 상담'}
              </Link>
              <Link href="/consult"
                style={{
                  padding: '9px 18px',
                  background: 'var(--gold)',
                  color: 'var(--bg-deep)', fontWeight: 700, fontSize: 11,
                  letterSpacing: '.14em', textDecoration: 'none', borderRadius: 0,
                  border: '1px solid var(--gold)', textTransform: 'uppercase',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                {lang === 'zh' ? '施术咨询' : lang === 'en' ? 'TREATMENT CONSULT' : '시술 상담'}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 상단 프로모션 스트립 (럭셔리 다크 · 골드 hair-line only · 원색 X) */}
      <div style={{ background: 'var(--bg-deep)', color: 'var(--gold-light)', textAlign: 'center', padding: '12px 16px', fontFamily: 'var(--ab-font-body-latin)', fontSize: 16.5, letterSpacing: '0.32em', fontWeight: 500, borderTop: '1px solid var(--gold-deep)', borderBottom: '1px solid var(--gold-deep)', textTransform: 'uppercase' }}>
        {lang === 'zh' ? '少数精英 · 创始人亲选 · 预约咨询' : lang === 'en' ? 'BY INVITATION · FOUNDER-SELECTED · PRIVATE CONSULT' : '소수정예 · 창시자 직접 선발 · 프라이빗 상담'}
      </div>

      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              {isManager ? <div style={{ width: 260, height: 8, background: '#FF3D6E', marginBottom: 22, borderRadius: 2, opacity: 0.85 }} /> : null}
              <div className="eyebrow">{m.hero.eyebrow}</div>
              <h1 className="serif">
                {m.hero.headline.map((line, i) => (
                  <span key={i}>
                    {goldHighlight(line, m.hero.highlight)}
                    {i < m.hero.headline.length - 1 ? <br /> : null}
                  </span>
                ))}
              </h1>
              <p className="lead">{m.hero.lead}</p>
              <div className="ctas">
                <a href="/enroll" className="primary">{m.hero.ctaPrimary}</a>
                <a href="#stmt" className="ghost">{m.hero.ctaGhost}</a>
              </div>
              {isManager ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 26 }} title="본부장 스토리보드 색상 팔레트 힌트 (결정 대기)">
                  <div style={{ width: 88, height: 108, background: '#6B2F4A', borderRadius: 2 }} />
                  <div style={{ width: 88, height: 108, background: '#FF3D6E', borderRadius: 2 }} />
                </div>
              ) : null}
            </div>
            <div className="figure-mosaic" aria-label={m.hero.figureAlt}>
              {HERO_TRIPTYCH.map((shot) => (
                <div key={shot.src} className={`fm-cell fm-${shot.role}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shot.src} alt={`${m.hero.figureAlt} · ${shot.tag}`} />
                  <div className="fm-overlay" />
                  <div className="fm-tag">{shot.tag}</div>
                  {shot.role === 'main' ? <div className="fm-label">{heroLabel}</div> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 신뢰 배지 카운터 스트립 (원장님 공식자료 2026-07-20 회의 정정) */}
      <div style={{ background: 'var(--bg-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, padding: '46px 0 20px' }}>
          {[
            { num: '20', unit: lang === 'zh' ? '年+' : lang === 'en' ? 'YRS+' : '년+', lbl: lang === 'zh' ? '施术经验' : lang === 'en' ? 'FOUNDER CRAFT' : '시술 경력' },
            { num: '8,000', unit: lang === 'zh' ? '例+' : '+', lbl: lang === 'zh' ? '累计施术' : lang === 'en' ? 'CLIENTS SERVED' : '누적 시술경험' },
            { num: '900', unit: lang === 'zh' ? '余名' : '+', lbl: lang === 'zh' ? '累计学员' : lang === 'en' ? 'GRADUATES' : '누적 수강생' },
            { num: '4.5', unit: '★', lbl: lang === 'zh' ? '学员满意度' : lang === 'en' ? 'STUDENT RATING' : '수강 만족도' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderLeft: i === 0 ? 'none' : '1px solid var(--line)', padding: '4px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, marginBottom: 12 }}>
                <span className="serif" style={{ fontSize: 48, fontWeight: 300, color: 'var(--gold-light)', lineHeight: 1, letterSpacing: '-0.01em' }}>
                  {s.num}
                </span>
                <span className="serif" style={{ fontSize: 22, color: 'var(--gold)', fontWeight: 300 }}>{s.unit}</span>
              </div>
              <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 9.5, letterSpacing: '0.35em', color: 'var(--text-soft)', textTransform: 'uppercase', fontWeight: 400 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
        {/* 창업 전환율 압도적 · 킬러 문구 (2026-07-20 회의) */}
        <div className="wrap" style={{ padding: '2px 0 40px', textAlign: 'center' }}>
          <div className="serif" style={{ fontSize: 20, color: 'var(--gold-light)', fontWeight: 300, letterSpacing: '-0.005em', marginBottom: 10, lineHeight: 1.5 }}>
            {lang === 'zh' ? '其中 · 创业开店的学员 数百余名 输出' : lang === 'en' ? 'Of these · hundreds launched their own studio.' : '그 중 · 창업한 수강생 수백여명 배출'}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 22, height: 1, background: 'var(--gold-deep)' }} />
            <span style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.42em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600 }}>
              {lang === 'zh' ? '业界压倒性创业转化率' : lang === 'en' ? 'Industry-Leading Startup Rate' : '업계 압도적 창업 전환율'}
            </span>
            <span style={{ width: 22, height: 1, background: 'var(--gold-deep)' }} />
          </div>
        </div>
      </div>

      {/* 국내 유일 특허 배지 (원장님 공식자료 2026-07-19) */}
      <div style={{ background: 'var(--bg-deep)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap" style={{ padding: '18px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.42em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 500 }}>
            {lang === 'zh' ? 'Korea 独有' : lang === 'en' ? 'ONLY IN KOREA' : '국내 유일'}
          </span>
          <span style={{ width: 1, height: 14, background: 'var(--gold-deep)', opacity: 0.5 }} />
          <span className="serif" style={{ fontSize: 15, color: 'var(--gold-light)', fontWeight: 300, letterSpacing: '0.02em' }}>
            {lang === 'zh' ? '「超写实眉」专利证书持有' : lang === 'en' ? '"Hyper Realistic Brow" Patent Holder' : '「극사실눈썹」특허 · 상표 · 기법 등록'}
          </span>
        </div>
      </div>

      {/* 2026-07-27 · 이미지 삽입 밴드 (원장 07-24 정본 카드뉴스 6장 · 인스타 갤러리 톤) */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--line)', padding: '46px 0 52px' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22, gap: 14, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.42em', color: 'var(--gold-light)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
                @artbrows_academy · Instagram
              </div>
              <div className="serif" style={{ fontSize: 24, color: 'var(--text)', fontWeight: 300, letterSpacing: '-0.005em' }}>
                {lang === 'zh' ? '院长每周亲发的原创内容' : lang === 'en' ? 'Founder-published, weekly.' : '원장님이 매주 직접 배포하는 정본'}
              </div>
            </div>
            <a href="https://www.instagram.com/artbrows_academy/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.28em', color: 'var(--gold-light)', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', border: '1px solid var(--gold-deep)', padding: '10px 18px', transition: 'all .18s' }}>
              {lang === 'zh' ? '前往 · Instagram' : lang === 'en' ? 'Follow →' : '팔로우 →'}
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {[
              '/brand/reference-cards-2026-07-24/01-cover-macroface.png',
              '/brand/reference-cards-2026-07-24/02-founder-lecture.png',
              '/brand/reference-cards-2026-07-24/03-question1-why.png',
              '/brand/reference-cards-2026-07-24/04-question2-sketch.png',
              '/brand/reference-cards-2026-07-24/05-question3-who.png',
              '/brand/reference-cards-2026-07-24/06-question4-how.png',
            ].map((src, i) => (
              <div key={i} style={{ aspectRatio: '1/1', overflow: 'hidden', background: 'var(--bg-deep)', border: '1px solid var(--line-soft)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`ARTbrows 인스타 정본 ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.05) saturate(1.05)', transition: 'transform .6s ease' }} onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }} onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═════════════ 대표원장 ═════════════ */}
      <section className="pillars" id="founder">
        <div className="wrap">
          <div className="sec-head">
            <div className="mark">FOUNDER · 대표원장</div>
            <h2 className="serif">장미지 · 극사실눈썹 <b>창시자</b></h2>
            <p>{lang === 'zh' ? '30年功力 · 一根一根 · 骨相之流。' : lang === 'en' ? '30 years · every strand · the flow of bone.' : '30년 경력 · 한 올 한 올 · 골상의 흐름.'}</p>
          </div>
          <div className="hero-grid" style={{ gap: 48, marginTop: 30 }}>
            <div className="figure" style={{ aspectRatio: '3/4', maxHeight: 520 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/founder-key-visual-2026-07-17.png" alt="장미지 원장" />
            </div>
            <div>
              <div className="eyebrow">SIGNATURE PHILOSOPHY</div>
              <h3 className="serif" style={{ fontSize: 28, marginBottom: 20, fontWeight: 700, lineHeight: 1.35, letterSpacing: '-0.005em' }}>
                {lang === 'zh' ? '「顾客想要的\n不是画出来的眉,\n而是像毛发的眉。」' : lang === 'en' ? '"What clients want is not\na drawn brow —\nbut a brow like real hair."' : '"고객이 원하는 것은\n그린 눈썹이 아니라\n털 같은 눈썹이다."'}
              </h3>
              <p style={{ color: 'var(--text-soft)', lineHeight: 1.9, marginBottom: 20 }}>
                {lang === 'zh' ? '20年+ 一根一根打磨的手艺 · 宣陵·三成 本院 · 韩国「超写实眉」创始人。' : lang === 'en' ? '20+ years of strand-by-strand craft · Seonleung–Samseong main atelier · Founder of Hyper Realistic Brow.' : '20년+ 한 올 한 올 다듬어 온 기술 · 선릉·삼성 본원 · 국내 극사실눈썹 창시자.'}
              </p>
              <blockquote style={{ borderLeft: '2px solid var(--gold)', paddingLeft: 18, fontStyle: 'italic', fontFamily: 'var(--ab-font-headline)', color: 'var(--text-soft)', fontSize: 13.5, lineHeight: 1.7 }}>
                {lang === 'zh' ? '不同于既有的人工眉,超写实眉观察并再现真实毛发的走向。' : lang === 'en' ? 'Unlike conventional artificial brows, Hyperreal reads and re-creates the real flow of hair.' : '기존 인위적 눈썹과 달리, 극사실눈썹은 진짜 털의 결을 관찰하고 재현합니다.'}
                <div style={{ marginTop: 10, color: 'var(--gold)', fontStyle: 'normal', fontSize: 11, letterSpacing: '0.3em' }}>— JANG MI-JI</div>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* 2026-07-27 · 실제 강의 다큐 밴드 (원장님 07-24 배포 8장) · 인스타 정본과 짝 */}
      <section id="live-class" style={{ background: 'var(--bg-deep)', borderTop: '1px solid var(--line)', padding: '56px 0 64px' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, gap: 14, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.42em', color: 'var(--gold-light)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
                Live Class · 선릉 본원
              </div>
              <div className="serif" style={{ fontSize: 28, color: 'var(--text)', fontWeight: 300, letterSpacing: '-0.005em', lineHeight: 1.35 }}>
                {lang === 'zh' ? '院长亲自授课 · 一人一对一 · 现场文档' : lang === 'en' ? 'Founder-led · 1:1 coaching · from our classroom.' : '원장님 직강 · 1:1 코칭 · 실제 강의 현장'}
              </div>
            </div>
            <a href="#academy" style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.28em', color: 'var(--gold-light)', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', border: '1px solid var(--gold-deep)', padding: '10px 18px' }}>
              {lang === 'zh' ? '课程详情 →' : lang === 'en' ? 'Curriculum →' : '커리큘럼 →'}
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '220px', gap: 10 }}>
            {[
              { src: '/brand/class-documentary/KakaoTalk_20260724_191628747_03.jpg', span: 'col-span-2 row-span-2', wide: true, tall: true },
              { src: '/brand/class-documentary/KakaoTalk_20260724_191617717_01.jpg', wide: false, tall: true },
              { src: '/brand/class-documentary/KakaoTalk_20260724_191617717_02.jpg', wide: false, tall: false },
              { src: '/brand/class-documentary/KakaoTalk_20260724_191628747_01.jpg', wide: false, tall: true },
              { src: '/brand/class-documentary/KakaoTalk_20260724_191628747_04.jpg', wide: false, tall: false },
              { src: '/brand/class-documentary/KakaoTalk_20260724_191617717_03.jpg', wide: true, tall: false },
              { src: '/brand/class-documentary/KakaoTalk_20260724_191628747_02.jpg', wide: false, tall: false },
              { src: '/brand/class-documentary/KakaoTalk_20260724_191428055.jpg',    wide: false, tall: false },
            ].map((it, i) => (
              <div key={i} style={{
                overflow: 'hidden',
                background: 'var(--bg-card)',
                border: '1px solid var(--line-soft)',
                gridColumn: i === 0 ? 'span 2' : 'span 1',
                gridRow: i === 0 ? 'span 2' : 'span 1',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.src} alt={`실제 강의 현장 ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.05) saturate(1.03)', transition: 'transform .5s ease' }} onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)'; }} onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════ 극사실눈썹이란 (PDF 4대 특징) ═════════════ */}
      <section className="stmt" id="hyperreal" style={{ background: 'var(--bg-card)' }}>
        <div className="wrap">
          <div className="mark">WHAT IS HYPER REALISTIC</div>
          <h2 className="serif" style={{ fontSize: 30, lineHeight: 1.45, marginBottom: 44 }}>
            {lang === 'zh' ? '不是套模式 · 是画出真实的一根一根。\n重新定义眉毛。' : lang === 'en' ? 'Not a pattern — every real strand redrawn.\nBrows, redefined.' : '패턴이 아닌 · 진짜 눈썹 털을 그린다.\n눈썹을 다시 정의합니다.'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginTop: 20, maxWidth: 940, marginInline: 'auto' }}>
            {[
              {
                head: lang === 'zh' ? '始于素描的美容美术' : lang === 'en' ? 'A craft rooted in fine-art drawing' : '소묘에서 출발한 미용미술',
                body: lang === 'zh' ? '超写实眉源自素描技法。有规则 · 无套版,每一笔都出自「意图」与「观察」。' : lang === 'en' ? "Hyperreal brow comes from sketching. There are rules, but no templates — every stroke comes from intention and observation." : '극사실눈썹은 소묘 기법에서 출발한 미용미술입니다. 규칙은 있으나 패턴은 없으며, 모든 선은 의도와 관찰에서 비롯됩니다.',
              },
              {
                head: lang === 'zh' ? '不是套模式 · 是画真实的毛发' : lang === 'en' ? 'Not a pattern — real hair, redrawn' : '패턴이 아닌 진짜 눈썹 털을 그린다',
                body: lang === 'zh' ? '与用重复图案填充的既有方式不同,超写实眉一根一根重现真实眉毛的走向,达至自然。' : lang === 'en' ? 'Unlike conventional methods that fill with repeating patterns, hyperreal reproduces every strand of real brow — arriving at true naturalness.' : '반복된 패턴으로 채우는 기존 방식과 달리, 극사실눈썹은 한 올 한 올 진짜 눈썹 털의 결을 그대로 재현하여 자연스러움을 완성합니다.',
              },
              {
                head: lang === 'zh' ? '「结」是观察与理解的结果' : lang === 'en' ? "The 'flow' is a result of observation" : '결은 관찰과 이해의 결과',
                body: lang === 'zh' ? '「结」不是模仿。深度观察真实毛发的方向与粗细,理解之后表现出来 — 这才是超写实眉。' : lang === 'en' ? 'Flow is not mimicry. It emerges from deep observation of real hair direction and thickness — then, understanding.' : '결은 단순히 흉내 내는 것이 아닙니다. 진짜 눈썹 털의 방향과 굵기를 깊이 관찰하고 이해한 결과가 극사실눈썹으로 표현됩니다.',
              },
              {
                head: lang === 'zh' ? '因脸型 · 眉位 · 走向而不同' : lang === 'en' ? 'Different by face · position · direction' : '얼굴·눈썹·위치별 결 재현',
                body: lang === 'zh' ? '脸型、眉毛位置、毛发方向各不相同。分析个人独有的「结」,只为这一位重现只属于他的眉。' : lang === 'en' ? 'Face shape, brow position, hair direction — all differ. We analyze each individual’s flow, engraving a brow that belongs to no one else.' : '얼굴형, 눈썹 위치, 털의 방향에 따라 결이 모두 다릅니다. 개인의 고유한 결을 분석하고 그 사람만의 눈썹을 새깁니다.',
              },
            ].map((it, i) => (
              <div key={i} style={{ padding: '26px 24px', border: '1px solid var(--line)', borderRadius: 4, background: 'var(--bg-deep)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
                  <span className="serif" style={{ fontSize: 26, color: 'var(--gold)', fontWeight: 300 }}>0{i + 1}</span>
                  <h3 className="serif" style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4 }}>{it.head}</h3>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.85 }}>{it.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, textAlign: 'center', fontFamily: 'var(--ab-font-headline)', fontSize: 22, fontWeight: 800, color: 'var(--gold-light)' }}>
            = {lang === 'zh' ? '超写实眉 · Hyper Realistic Brow' : lang === 'en' ? 'Hyper Realistic Brow' : '극사실눈썹 · Hyper Realistic Brow'}
          </div>

          {/* 극사실 4대 카테고리 우산 브랜드 (원장님 2026-07-20 회의) */}
          <div style={{ marginTop: 60, padding: '32px 26px', border: '1px solid var(--gold-deep)', background: 'var(--bg-deep)', maxWidth: 900, marginInline: 'auto' }}>
            <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10, letterSpacing: '0.42em', color: 'var(--gold)', textAlign: 'center', marginBottom: 18, textTransform: 'uppercase', fontWeight: 500 }}>
              {lang === 'zh' ? '「超写实」品牌宇宙' : lang === 'en' ? 'The Hyperreal Universe' : '극사실 · 4대 카테고리'}
            </div>
            <div className="serif" style={{ fontSize: 20, color: 'var(--gold-light)', textAlign: 'center', fontWeight: 300, lineHeight: 1.6, marginBottom: 24, letterSpacing: '-0.005em' }}>
              {lang === 'zh' ? '「真的是头发 · 真的是眉毛 · 那本来就是嘴唇的颜色」' : lang === 'en' ? '"It IS hair · it IS brow · that WAS her lip color."' : '"진짜 머리카락이야 · 진짜 눈썹이야 · 원래 입술 색깔 아니었어?"'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {[
                { k: lang === 'zh' ? '眉毛' : lang === 'en' ? 'BROW' : '눈썹', badge: lang === 'zh' ? '进行中' : lang === 'en' ? 'ACTIVE' : '진행 중', active: true },
                { k: lang === 'zh' ? '眼线' : lang === 'en' ? 'EYELINE' : '아이라인', badge: lang === 'zh' ? '即将推出' : lang === 'en' ? 'COMING' : '준비 중', active: false },
                { k: lang === 'zh' ? '唇' : lang === 'en' ? 'LIP' : '입술', badge: lang === 'zh' ? '即将推出' : lang === 'en' ? 'COMING' : '준비 중', active: false },
                { k: lang === 'zh' ? '发际线' : lang === 'en' ? 'HAIRLINE' : '헤어라인', badge: lang === 'zh' ? '即将推出' : lang === 'en' ? 'COMING' : '준비 중', active: false },
              ].map((c, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '18px 8px', border: `1px solid ${c.active ? 'var(--gold)' : 'var(--line)'}`, background: c.active ? 'var(--bg-card)' : 'transparent', opacity: c.active ? 1 : 0.6 }}>
                  <div className="serif" style={{ fontSize: 16, fontWeight: 700, color: c.active ? 'var(--gold-light)' : 'var(--text-soft)', letterSpacing: '0.06em', marginBottom: 6 }}>{c.k}</div>
                  <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 9, letterSpacing: '0.3em', color: c.active ? 'var(--gold)' : 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>{c.badge}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.7 }}>
              {lang === 'zh' ? '「超写实」 = 一次定义所有半永久领域' : lang === 'en' ? 'Hyperreal — one philosophy across all semi-permanent categories' : '「극사실」 = 반영구 전 영역의 통일된 철학'}
            </div>
          </div>
        </div>
      </section>

      {/* 2026-07-27 · 대표님 지시 「왜 배워야 하는가 (기술·차별화 관점)」 · WHAT→WHY→HOW 흐름 사이에 삽입 */}
      <section id="why-learn" style={{ background: 'linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-card) 100%)', borderTop: '1px solid var(--line)', padding: '80px 0 90px' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.5em', color: 'var(--gold-light)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
              Why Learn · 왜 극사실을 배워야 하는가
            </div>
            <h2 className="serif" style={{ fontSize: 40, color: 'var(--text)', fontWeight: 300, lineHeight: 1.35, letterSpacing: '-0.01em', maxWidth: 900, margin: '0 auto' }}>
              {lang === 'zh' ? '不是套模板的印章 · 是一根一根重画的技艺。' : lang === 'en' ? 'Not a stamped pattern — a strand-by-strand craft.' : '패턴 스탬프가 아닌 · 한 올 한 올 다시 그리는 기술.'}
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-soft)', maxWidth: 720, margin: '20px auto 0', lineHeight: 1.85 }}>
              {lang === 'zh' ? '大部分半永久 = 用预制模板盖印。超写实眉 = 观察真发的走向,一根一根重新描绘,与真发无法区分。' : lang === 'en' ? 'Most semi-permanent brows stamp a pre-made pattern. Hyperreal reads the direction of the real hair and redraws it, strand by strand — indistinguishable from real brows.' : '대다수의 반영구는 미리 만든 패턴을 도장처럼 찍습니다. 극사실은 실제 털의 결을 관찰해 한 올 한 올 다시 그리기 때문에 · 진짜 눈썹과 구별되지 않습니다.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {[
              {
                num: '01',
                head: lang === 'zh' ? '不是印章 · 是笔触' : lang === 'en' ? 'Craft, not a stamp' : '패턴 X · 결의 재현',
                body: lang === 'zh' ? '既有半永久 = 打印预制眉形。超写实 = 观察本人毛发的方向·间距·粗细,一根一根重现,与真发无异。' : lang === 'en' ? 'Traditional brows = stamp a template. Hyperreal reads each strand\'s direction, gap, thickness — redrawn one at a time.' : '기존 반영구는 미리 만든 눈썹 패턴을 도장처럼 찍습니다. 극사실은 본인 털의 결·방향·간격·굵기를 관찰해 한 올 한 올 재현합니다.'
              },
              {
                num: '02',
                head: lang === 'zh' ? '国内唯一专利 · 3证' : lang === 'en' ? 'Only in Korea · 3 Patents' : '국내 유일 · 특허 3장',
                body: lang === 'zh' ? '「超写实眉」的专利·商标·技法 — 3证均由院长注册。20年+经验 · 累计施术 8000+例的唯一方法论。' : lang === 'en' ? '"Hyperreal Brow" — 3 patents (technique + trademark + method) registered by the Founder. 20+ years, 8,000+ procedures — the only such methodology in Korea.' : '「극사실눈썹」 특허·상표·기법 — 3장 모두 원장님 등록. 20년+ 경력 · 누적 시술 8,000+ 케이스에서 축적된 국내 유일 방법론.'
              },
              {
                num: '03',
                head: lang === 'zh' ? '2027-10 半合法化 · 标准化第一课' : lang === 'en' ? '2027-10 · Standard-in-waiting' : '2027-10 준합법화 · 표준 원본',
                body: lang === 'zh' ? '2027-10 半永久准合法化即将到来。市面上大量存在的印章式将进一步大众化,超写实是「唯一标准的原本」——现在学 = 从创始人处直接学习标准的经历。' : lang === 'en' ? 'When Korea semi-legalizes microblading in Oct 2027, stamp-style will flood the market. Hyperreal is the only standardized reference — learning it now means being taught by the founder of the standard.' : '2027-10 반영구 준합법화가 임박했습니다. 패턴 시술은 대량화될 것 · 극사실은 표준화된 유일 원본. 지금 배우면 그 표준의 창시자에게 직접 배운 이력이 됩니다.'
              },
              {
                num: '04',
                head: lang === 'zh' ? '院长直授 · 一对一' : lang === 'en' ? 'Founder-led · 1:1' : '원장 직강 · 1:1 코칭',
                body: lang === 'zh' ? '不是讲师班。院长本人从素描基础到完成作品全程 1:1 亲自看着 · 每个人的姿势·下笔·力度都个别修正。' : lang === 'en' ? 'Not a franchise instructor. The Founder personally coaches every step — from sketch to finished piece — correcting each student\'s posture, pressure, and stroke individually.' : '강사반이 아닙니다. 원장님 본인이 소묘 기초부터 완성 작품까지 전 과정 1:1 로 직접 봐주시고 · 각자의 자세·필압·터치를 개별 교정합니다.'
              },
            ].map((it, i) => (
              <div key={i} style={{ padding: '32px 24px 28px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 3, position: 'relative', transition: 'transform .25s, border-color .25s' }}
                onMouseOver={(e) => { const t = e.currentTarget; t.style.transform = 'translateY(-4px)'; t.style.borderColor = 'var(--gold)'; }}
                onMouseOut={(e) => { const t = e.currentTarget; t.style.transform = 'translateY(0)'; t.style.borderColor = 'var(--line)'; }}
              >
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, color: 'var(--gold)', opacity: 0.55, fontWeight: 300, lineHeight: 1, marginBottom: 14 }}>{it.num}</div>
                <h3 className="serif" style={{ fontSize: 20, color: 'var(--gold-light)', fontWeight: 700, letterSpacing: '-.005em', lineHeight: 1.35, marginBottom: 12 }}>{it.head}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-soft)', lineHeight: 1.75, fontWeight: 300 }}>{it.body}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a href="#academy" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--gold)', color: 'var(--bg-deep)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 13.5, letterSpacing: '.18em', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase' }}>
              {lang === 'zh' ? '课程详情 →' : lang === 'en' ? 'See Curriculum →' : '커리큘럼 보러 가기 →'}
            </a>
          </div>
        </div>
      </section>

      {/* ═════════════ 아카데미 ═════════════ */}
      <section className="pillars" id="academy">
        <div className="wrap">
          <div className="sec-head">
            <div className="mark">ACADEMY · 아카데미</div>
            <h2 className="serif">{lang === 'zh' ? '小班精英大师课 · 创始人亲授' : lang === 'en' ? 'Small-cohort Masterclass · Directly by the Founder' : '소수 정예 · 창시자 직강 마스터클래스'}</h2>
            <p>{lang === 'zh' ? '宣陵·三成 本院 · 一对一指导 · 累计学员 900余名 · 30代+ 高阶职业转型' : lang === 'en' ? 'Seonleung–Samseong atelier · 1:1 coaching · 900+ graduates · a premium career shift for 30s and up.' : '선릉·삼성 본원 · 1:1 코칭 · 누적 수강생 900여명 · 30대+ 프리미엄 커리어 전환'}</p>
          </div>
          <div className="pillar-grid">
            {[
              { ord: '01', title: lang === 'zh' ? '「超写实眉」创始 atelier' : lang === 'en' ? 'The Original of Hyperreal Brow' : '극사실눈썹 창시 아틀리에', desc: lang === 'zh' ? 'The Original of Hyperreal Brow Craft · 唯一再现真实毛发的专家教育。' : lang === 'en' ? 'The Original of Hyperreal Brow Craft · the only academy training in real-hair reproduction.' : 'The Original of Hyperreal Brow Craft · 진짜 눈썹을 재현하는 유일한 전문가 교육.' },
              { ord: '02', title: lang === 'zh' ? '院长亲授' : lang === 'en' ? 'Founder-Direct Teaching' : '창시자 직강', desc: lang === 'zh' ? '20年+ 施术院长亲自授课 · 素描原理 → 施术完成。' : lang === 'en' ? '20+ years of founder-taught craft · from sketch principles to full treatment.' : '20년+ 원장 직강 · 소묘 원리부터 시술 완성까지.' },
              { ord: '03', title: lang === 'zh' ? '课程现场' : lang === 'en' ? 'Class in Session' : '수강 모습', desc: lang === 'zh' ? '真实模特实操 · 现场施术 · 「结」逐一 feedback。' : lang === 'en' ? 'Real model practice · live treatments · every strand critiqued.' : '실제 모델 실습 · 라이브 시술 · 한 올 한 올 피드백.' },
              { ord: '04', title: lang === 'zh' ? '国内独有专利' : lang === 'en' ? 'Korea-Only Patents' : '국내 유일 특허 · 상표', desc: lang === 'zh' ? '「超写实眉」专利 + 商标 + 技法登录 3种。' : lang === 'en' ? '"Hyperreal Brow" patent + trademark + method — three official registrations.' : '「극사실눈썹」특허 + 상표 + 기법 등록 3종.' },
              { ord: '05', title: lang === 'zh' ? '毕业生成就' : lang === 'en' ? "Graduates' Achievement" : '수강생 실적', desc: lang === 'zh' ? '累计学员 900余名 · 满意度 4.5★ · 出师后价格提升可见证。' : lang === 'en' ? '900+ graduates · 4.5★ satisfaction · verifiable price increase after graduation.' : '누적 수강생 900여명 · 만족도 4.5★ · 수강 후 시술가 상승 사례 다수.' },
              { ord: '06', title: lang === 'zh' ? '创业咨询·开店支持' : lang === 'en' ? 'Startup & Launch Support' : '창업 컨설팅 · 개원 지원', desc: lang === 'zh' ? '半永久创业班套餐 + 创业咨询包含 — 从入门到开店一站到底。' : lang === 'en' ? 'Semi-permanent startup package + consulting — from foundation to opening your own studio.' : '반영구 창업반 패키지 + 창업컨설팅 포함 — 입문부터 개원까지 원스톱.' },
            ].map((p) => (
              <div className="pillar" key={p.ord} style={{ padding: 26 }}>
                <div className="body">
                  <div className="ord">{p.ord}</div>
                  <h3 className="serif">{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* 방법론 상세 페이지 링크 · 2026-07-20 신설 (사용자 옵션 B) */}
          <div style={{ marginTop: 36, padding: '24px 30px', border: '1px solid var(--gold)', background: 'var(--bg-deep)', textAlign: 'center', maxWidth: 720, marginInline: 'auto' }}>
            <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>
              MASTER METHOD · 원장 26년 노하우 (참고 · 정리 중)
            </div>
            <div className="serif" style={{ fontSize: 22, color: 'var(--gold-light)', fontWeight: 300, marginBottom: 16, lineHeight: 1.4 }}>
              {lang === 'zh' ? '结 的 法则 · 1-2-3-4-3-2-1' : lang === 'en' ? 'The Rule of Flow · 1-2-3-4-3-2-1' : '결의 법칙 · 1-2-3-4-3-2-1'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.7, marginBottom: 20 }}>
              {lang === 'zh' ? '院长 30年 노하우 정본 · 特许 3장 · 极사실 머신 · 인증 색소 A0-A3' : lang === 'en' ? 'Founder\'s 30-year methodology · 3 patents · Hyperreal machine · Certified pigments A0-A3' : '원장 30년 노하우 정본 · 특허 3장 · 극사실 머신 · 인증 색소 A0-A3 · 디자인 4단계 · 진단 프레임워크'}
            </div>
            <a href="/academy/methodology" style={{ display: 'inline-block', padding: '11px 28px', background: 'var(--gold)', color: 'var(--bg-deep)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 11.5, letterSpacing: '0.28em', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase' }}>
              {lang === 'zh' ? '查看方法论 →' : lang === 'en' ? 'View Methodology →' : '방법론 전체 보기 →'}
            </a>
          </div>
        </div>
      </section>

      {/* ═════════════ 커리큘럼 ═════════════ */}
      <section className="stmt" id="curriculum" style={{ background: 'var(--bg-card)' }}>
        <div className="wrap">
          <div className="mark">CURRICULUM · 5 강의</div>
          <h2 className="serif" style={{ fontSize: 26, lineHeight: 1.4, marginBottom: 40 }}>
            {lang === 'zh' ? '五门课程 · 从基础到大师' : lang === 'en' ? 'Five Programs · from Foundation to Master' : '5 강의 카테고리 · 입문부터 대가까지'}
          </h2>
          <div style={{ maxWidth: 820, marginInline: 'auto', textAlign: 'left' }}>
            {[
              { num: '01', title: lang === 'zh' ? '易上手班 (Easy Class)' : lang === 'en' ? 'Easy Class' : '이지클래스', meta: lang === 'zh' ? '5周 · 15小时 · 69万韩元' : lang === 'en' ? '5 weeks · 15h · KRW 690K' : '5주차 · 15시간 · 69만원 · 토/일/월', desc: lang === 'zh' ? '半永久入门的正统课程 · 每日 feedback' : lang === 'en' ? 'Semi-permanent foundation · daily feedback' : '반영구 입문의 정석 · 매일 피드백 · 최소 4~12명' },
              { num: '02', title: lang === 'zh' ? '超写实基础素描' : lang === 'en' ? 'Hyperreal Foundation Sketching' : '극사실기초 소묘수업', meta: lang === 'zh' ? '3日 · 21小时 · 66万韩元' : lang === 'en' ? '3-day · 21h · KRW 660K' : '3일 · 21시간 · 66만원 · 화/수/목', desc: lang === 'zh' ? '看真实眉毛画出来的原理课' : lang === 'en' ? 'The principle class — drawing real brows as they are' : '눈썹결의 원리 · 초보·경력자 · 주말 2일반 격월 개설' },
              { num: '03', title: lang === 'zh' ? '★ 超写实眉讲义' : lang === 'en' ? '★ Hyperreal Brow' : '★ 극사실눈썹 강의', meta: lang === 'zh' ? '3日 · 21小时 · 169万韩元' : lang === 'en' ? '3-day · 21h · KRW 1.69M' : '3일 · 21시간 · 169만원 · 경력자', desc: lang === 'zh' ? '以施术为核心的3日完成课程' : lang === 'en' ? '3-day treatment-centered mastery' : '3일 시술중심의 완성과정 · 주말 2일반 격월' },
              { num: '04', title: lang === 'zh' ? '패키지 · 素描+眉' : lang === 'en' ? 'Package · Sketching + Brow' : '패키지 · 소묘+눈썹', meta: lang === 'zh' ? '66+169=235 → 199万韩元' : lang === 'en' ? '66+169=235 → KRW 1.99M' : '66+169=235 → 199만원 · 36만 할인', desc: lang === 'zh' ? '一起报名 · 优惠36万' : lang === 'en' ? 'Bundle discount · save 360K' : '소묘+눈썹 함께 · 36만원 할인' },
              { num: '05', title: lang === 'zh' ? '★★ 超写实短期创业班' : lang === 'en' ? '★★ Hyperreal Short-Term Startup Track' : '★★ 극사실눈썹 단기창업반', meta: lang === 'zh' ? '890万韩元 · 6个月 + 追加6个月无限实习' : lang === 'en' ? 'KRW 8.9M · 6M + bonus 6M unlimited' : '890만원 · 6개월 + 추가 6개월 무제한 실습', desc: lang === 'zh' ? '易×1 + 素描×3 + 眉×5 + 除去×1 + 创业咨询 + 讲师班资格' : lang === 'en' ? 'Easy×1 + Sketch×3 + Brow×5 + Removal×1 + Startup consulting + Instructor eligibility' : '이지×1 + 소묘×3 + 극사실눈썹×5 + 제거×1 + 창업컨설팅 + 강사반 지원 자격' },
              { num: '06', title: lang === 'zh' ? '讲师班' : lang === 'en' ? 'Instructor Track' : '강사반', meta: lang === 'zh' ? '创业班结业 · 少数选拔 · 1个月总2次' : lang === 'en' ? 'Startup grads · selected few · 2 sessions/month' : '창업반 수료 · 소수 선발 · 격주 1회 · 총 2회', desc: lang === 'zh' ? '院长 1:N · 讲师资格授予' : lang === 'en' ? 'Founder 1:N · instructor certification' : '원장 1:N 수업 · 이지클래스 강사 자격 부여' },
            ].map((r) => (
              <div key={r.num} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto auto', gap: 20, padding: '18px 0', borderBottom: '1px solid var(--line)', alignItems: 'center' }}>
                <div className="serif" style={{ fontSize: 22, color: 'var(--gold)', fontWeight: 300 }}>{r.num}</div>
                <div>
                  <div className="serif" style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-soft)', opacity: 0.85 }}>{r.desc}</div>
                </div>
                <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, color: 'var(--gold-light)', letterSpacing: '0.05em', textAlign: 'right', whiteSpace: 'nowrap' }}>{r.meta}</div>
                <a href="/consult" style={{ padding: '7px 14px', border: '1px solid var(--gold)', color: 'var(--gold)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.1em', fontWeight: 600, textDecoration: 'none', borderRadius: 3, whiteSpace: 'nowrap' }}>
                  {lang === 'zh' ? '咨询 →' : lang === 'en' ? 'CONSULT →' : '상담 →'}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════ 반영구 창업반 (종합 패키지 · 원장님 자료 2026-07-19) ═════════════ */}
      {/* 2026-07-27 Phase 3 압축 · STARTUP PACKAGE + INSTRUCTOR TRACK 두 섹션 폐기
          이유: CONCERN 4카드 「창업반 890 15기」 CTA + CURRICULUM 5강의 리스트 + TrustAssets 「창업 수백여명」 = 3중 노출로 이미 커버.
          강사반·파트너·SLOW CLASS 는 대상 소수 · 홈 상시 노출 필요성 낮음 → /enroll 페이지로 이관 예정. */}

      {/* ═════════════ AI Studio · 미지 아카데미 예고 (2026-07-20 · LMS 앱 연결) ═════════════ */}
      {/* 2026-07-27 Phase 3 압축 · AI STUDIO 섹션 폐기 (Coming Soon 실체 X · 별도 페이지 이관 예정) */}

      {/* ═════════════ 수강생 리얼 후기 (원장님 자료 2026-07-19) ═════════════ */}
      <section className="stmt" id="reviews" style={{ background: 'var(--bg-card)' }}>
        <div className="wrap">
          <div className="mark">REVIEWS · 수강생 리얼 후기</div>
          <h2 className="serif" style={{ fontSize: 28, lineHeight: 1.4, marginBottom: 12 }}>
            {lang === 'zh' ? '900余名 累计学员的证言' : lang === 'en' ? '900+ Graduates. Their Words.' : '900여명 누적 수강생의 증언'}
          </h2>
          <p style={{ color: 'var(--text-soft)', fontSize: 13.5, marginBottom: 40, lineHeight: 1.85 }}>
            {lang === 'zh' ? '满意度 4.5★ · 数百余名成功创业 · 业界压倒性转化率' : lang === 'en' ? 'Satisfaction 4.5★ · hundreds launched their own studio · industry-leading rate' : '만족도 4.5★ · 창업 수강생 수백여명 · 업계 압도적 창업 전환율'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, maxWidth: 1020, marginInline: 'auto' }}>
            {[
              { cohort: lang === 'zh' ? '1期 学员' : lang === 'en' ? 'Cohort 1' : '1기 수강생', who: lang === 'zh' ? '学生 李**' : lang === 'en' ? 'Student Lee' : '학생 이**님', q: lang === 'zh' ? '「模糊的职业规划,通过这一堂课变得清晰。」' : lang === 'en' ? '"My blurry career path became clear through this one course."' : '"막연했던 제 커리어가 이 강의 하나로 명확해졌어요."' },
              { cohort: lang === 'zh' ? '3期 学员' : lang === 'en' ? 'Cohort 3' : '3기 수강생', who: lang === 'zh' ? '半永久院长 李**' : lang === 'en' ? 'Studio Owner Lee' : '반영구원장 이**님', q: lang === 'zh' ? '「以前收 20万都难。学过后,现在收 50万+。」' : lang === 'en' ? '"Before I struggled to charge ₩200,000. Now I receive ₩500,000+."' : '"수강 후 시술가 20만원 → 50만원+ 로 상승했습니다."' },
              { cohort: lang === 'zh' ? '8期 学员' : lang === 'en' ? 'Cohort 8' : '8기 수강생', who: lang === 'zh' ? '设计师 金**' : lang === 'en' ? 'Designer Kim' : '디자이너 김**님', q: lang === 'zh' ? '「与其做人人都会的,不如学被真正认可的技能。」' : lang === 'en' ? '"Rather than what everyone does, I wanted a truly recognized skill."' : '"남들 다 하는 경쟁력 없는 것보다, 진짜 인정받는 걸 배우고 싶었습니다."' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '26px 22px', border: '1px solid var(--line)', borderRadius: 4, background: 'var(--bg-deep)', textAlign: 'left', position: 'relative' }}>
                <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase' }}>{r.cohort}</div>
                <div className="serif" style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold-light)', marginBottom: 4 }}>{r.who}</div>
                <div style={{ color: 'var(--gold)', fontSize: 13, letterSpacing: '0.15em', marginBottom: 16 }}>★ ★ ★ ★ ★</div>
                <div className="serif" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text)', fontStyle: 'italic' }}>{r.q}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════ 시술·수강 안내 (가격 미공개 · 상담 유도) ═════════════ */}
      <section className="pillars" id="pricing">
        <div className="wrap">
          <div className="sec-head">
            <div className="mark">BY CONSULTATION · 상담 안내</div>
            <h2 className="serif">
              {lang === 'zh' ? '施术与课程 · 私下咨询' : lang === 'en' ? 'Treatment & Programs · By Private Consult' : '시술 · 수강 · 프라이빗 상담'}
            </h2>
            <p>
              {lang === 'zh' ? '骨相分析后确定具体方案 · 请预约咨询。' : lang === 'en' ? 'Bespoke plan determined in person · book a private consult.' : '골상 분석 · 얼굴형 · 피부 상태 종합 후 맞춤 안내 · 상담 예약으로 확인하세요.'}
            </p>
          </div>

          <div style={{ maxWidth: 640, marginInline: 'auto', marginTop: 40, padding: '48px 40px', border: '1px solid var(--gold-deep)', textAlign: 'center', background: 'var(--bg-deep)' }}>
            <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10, letterSpacing: '0.42em', color: 'var(--gold)', marginBottom: 22, textTransform: 'uppercase', fontWeight: 500 }}>
              {lang === 'zh' ? '院长亲手施术 · 私人预约' : lang === 'en' ? 'By the Founder · Private Appointment' : '원장 직접 시술 · 프라이빗 예약'}
            </div>
            <div className="serif" style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.55, color: 'var(--gold-light)', marginBottom: 26, letterSpacing: '-0.005em' }}>
              {lang === 'zh' ? '每一位客人 · 一份专属方案' : lang === 'en' ? 'Every client · a bespoke plan' : '한 분 한 분 · 맞춤 설계'}
            </div>
            <a
              href="/consult"
              style={{
                display: 'inline-block', padding: '15px 40px',
                background: 'transparent', color: 'var(--gold-light)',
                border: '1px solid var(--gold-deep)',
                fontFamily: 'var(--ab-font-body-latin)', fontSize: 11.5, letterSpacing: '0.3em',
                fontWeight: 500, textDecoration: 'none', textTransform: 'uppercase',
              }}
            >
              {lang === 'zh' ? '预约咨询' : lang === 'en' ? 'Book Consult' : '상담 예약'}
            </a>
          </div>
        </div>
      </section>

      {/* 2026-07-27 Phase 3 압축 · CONSULT 프로세스 섹션 폐기 (FloatingCTA + CONCERN + LOCATION 카드로 이미 커버 · 중복 제거) */}

      {/* ═════════════ 아틀리에 위치 · 오시는 길 (2026-07-20 확장) ═════════════ */}
      <section className="pillars" id="location">
        <div className="wrap">
          <div className="sec-head">
            <div className="mark">LOCATION · 선릉·삼성 아틀리에</div>
            <h2 className="serif">
              {lang === 'zh' ? '首尔江南 · 宣陵·三成 本院' : lang === 'en' ? 'Gangnam · Seonleung·Samsung Atelier' : '강남 · 선릉·삼성 본원'}
            </h2>
            <p>{lang === 'zh' ? '院长直营单一工作室 · 少数预约 · 请务必事先咨询' : lang === 'en' ? 'Founder\'s single private atelier · appointment only · consult first' : '원장 직영 단일 아틀리에 · 예약제 · 사전 상담 필수'}</p>
          </div>
          {/* 2026-07-27 Phase 2 · 아틀리에 인터랙티브 시각 카드 (최예진 안) */}
          <div style={{ maxWidth: 1080, marginInline: 'auto', marginTop: 30 }}>
            <AtelierTour variant="desktop" />
          </div>
          <div style={{ maxWidth: 860, marginInline: 'auto', marginTop: 34, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { k: 'AREA', t: lang === 'zh' ? '首尔 江南区 · 宣陵·三成' : lang === 'en' ? 'Gangnam · Seonleung·Samsung' : '서울 강남구 · 선릉·삼성', d: lang === 'zh' ? '奉恩寺临近 · 三成·大峙之间' : lang === 'en' ? 'Near Bongeunsa · between Samsung & Daechi' : '봉은사 인근 · 삼성·대치 사이' },
              { k: 'ACCESS', t: lang === 'zh' ? '地铁 2号线宣陵站 / 9号线三成中央站' : lang === 'en' ? 'Line 2 Seonleung / Line 9 Samsung Jungang' : '2호선 선릉역 · 9호선 삼성중앙역', d: lang === 'zh' ? '步行5~8分 · 详细地址预约后告知' : lang === 'en' ? '5~8 min walk · exact address after appointment' : '도보 5~8분 · 정확 주소는 예약 시 안내' },
              { k: 'HOURS', t: lang === 'zh' ? '11:00~19:00 · 全预约制' : lang === 'en' ? '11:00~19:00 · Appointment only' : '11:00~19:00 · 전 예약제', d: lang === 'zh' ? '主日闭馆 · 授课日程另行安排' : lang === 'en' ? 'Sunday closed · class schedule separate' : '일요일 휴무 · 강의 일정 별도 · 카톡 K1 문의' },
            ].map((l) => (
              <div key={l.k} style={{ padding: '26px 22px', border: '1px solid var(--gold-line)', background: 'var(--bg-card)' }}>
                <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10, letterSpacing: '0.32em', color: 'var(--gold)', marginBottom: 12, fontWeight: 700 }}>{l.k}</div>
                <div className="serif" style={{ fontSize: 16, color: 'var(--gold-light)', marginBottom: 10, lineHeight: 1.4 }}>{l.t}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.7 }}>{l.d}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, textAlign: 'center', fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.22em', color: 'var(--gold)', textTransform: 'uppercase' }}>
            {lang === 'zh' ? '※ 无飞入店铺访问 · 请预约后来访 · 카톡 K1' : lang === 'en' ? '※ Walk-ins not accepted · appointment via KakaoTalk K1' : '※ 워크인 X · 예약 후 방문 · 카톡 K1 신청'}
          </div>
        </div>
      </section>

      {/* ═════════════ FAQ (2026-07-20 확장 · 유미코리아 벤치) ═════════════ */}
      <section className="stmt" id="faq" style={{ background: 'var(--bg-card)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="mark">FAQ · 자주 묻는 질문</div>
            <h2 className="serif">
              {lang === 'zh' ? '常见问题' : lang === 'en' ? 'Frequently Asked' : '자주 묻는 질문'}
            </h2>
          </div>
          <div style={{ maxWidth: 780, marginInline: 'auto', marginTop: 34, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              {
                q: lang === 'zh' ? '易上手班和超写实眉课有什么不同?' : lang === 'en' ? 'What is the difference between Easy Class and Hyperreal Brow?' : '이지클래스와 극사실눈썹 강의는 뭐가 다른가요?',
                a: lang === 'zh' ? '易上手班是半永久入门定型课 · 面向完全初学者。超写实眉是院长直讲的3日完成课 · 面向经验者。' : lang === 'en' ? 'Easy Class is the foundation for complete beginners. Hyperreal Brow is founder-led 3-day mastery for experienced artists.' : '이지클래스는 완전 초보 대상 반영구 입문 정석 (5주 15시간). 극사실눈썹은 경력자 대상 원장 직강 3일 완성 (21시간). 초보는 이지 → 소묘 → 극사실 순으로 권장.',
              },
              {
                q: lang === 'zh' ? '短期创业班的890万韩元包含哪些?' : lang === 'en' ? 'What is included in the KRW 8.9M Startup Track?' : '단기창업반 890만원에 무엇이 포함되나요?',
                a: lang === 'zh' ? '易上手×1 + 素描×3 + 眉×5 + 除去×1 + 创业咨询 + 讲师班资格 + 6个月过程 + 追加6个月无限实习(床位免费)' : lang === 'en' ? 'Easy×1 + Sketch×3 + Brow×5 + Removal×1 + Startup Consulting + Instructor eligibility + 6-month program + bonus 6M unlimited practice (free bed)' : '이지×1 + 소묘×3 + 극사실눈썹×5 + 제거×1 + 창업컨설팅 + 강사반 지원 자격 + 6개월 과정 + 추가 6개월 무제한 실습(베드 무료)',
              },
              {
                q: lang === 'zh' ? '素描+眉 套餐是什么?' : lang === 'en' ? 'What is the Sketching + Brow package?' : '소묘+눈썹 패키지는 뭔가요?',
                a: lang === 'zh' ? '素描 66万 + 眉 169万 = 235万 → 199万 (优惠36万)' : lang === 'en' ? 'Sketch 660K + Brow 1.69M = 2.35M → 1.99M (save 360K)' : '소묘 66만 + 눈썹 169만 = 235만 → 199만원 (36만원 할인). 초보·경력자 모두 · 소묘와 시술을 함께 배우고 싶은 분.',
              },
              {
                q: lang === 'zh' ? '施术是院长亲自做吗?' : lang === 'en' ? 'Does the founder perform treatments personally?' : '시술은 원장님이 직접 하시나요?',
                a: lang === 'zh' ? '是 · 全部院长 1:1 · 少数预约制 · 单一工作室' : lang === 'en' ? 'Yes · founder\'s personal 1:1 · appointment-limited · single atelier' : '네 · 전 시술 원장 직접 1:1 · 소수 예약제 · 단일 아틀리에 · 지점 없음.',
              },
              {
                q: lang === 'zh' ? '施术价格是多少?' : lang === 'en' ? 'What are the treatment prices?' : '시술 가격은 얼마인가요?',
                a: lang === 'zh' ? '施术价格网站不公开 · 请咨询 · 免费' : lang === 'en' ? 'Treatment prices are not published online — consult first, free.' : '시술 가격은 홈페이지에 표기하지 않습니다. 얼굴·개인 상태에 따라 상담 후 안내 (무료). 카톡 K1 or 상담 신청.',
              },
              {
                q: lang === 'zh' ? '有没有针对慢的学员的追加辅导?' : lang === 'en' ? 'Is there extra coaching for slower students?' : '실력이 느린 수강생을 위한 추가 수업이 있나요?',
                a: lang === 'zh' ? '有 · 通过率支援班 · 实战 1:1 P/N 未通过者 · 院长追加辅导' : lang === 'en' ? 'Yes · Pass-Support Track · additional coaching for those who did not pass 1:1 practical evaluation' : '네. 「느린 친구 추가 수업」 = 실전 1:1 P/N 미통과 수강생 대상. 원장이 별도 코칭 · 세부 조건은 상담.',
              },
              {
                q: lang === 'zh' ? '有 AI 助教吗?' : lang === 'en' ? 'Do you have an AI assistant?' : 'AI 챗봇이 있나요?',
                a: lang === 'zh' ? '在开发中 · 미지 아카데미 AI · 每日预复习首本 + 30年패턴 数据支持 · 2026 H2 发布' : lang === 'en' ? 'In development · 미지 아카데미 AI · daily review + 30-year pattern library · launch H2 2026' : '개발 중입니다. 「미지 아카데미 AI」 챗봇 · 매일 예/복습 자동 첨삭 · 원장 30년 패턴 라이브러리 기반 · 2026 하반기 앱 오픈 예정.',
              },
              {
                q: lang === 'zh' ? '地方(首尔外)学员也可以来吗?' : lang === 'en' ? 'Can students from outside Seoul attend?' : '지방 원장님도 수강 가능한가요?',
                a: lang === 'zh' ? '当然 · 3日集中制 · 3天不能休业者可选周末2日(隔月) · 6+6个月无限实习也可远程访问' : lang === 'en' ? 'Yes · 3-day intensive · weekend 2-day option (biweekly) · 6+6 unlimited practice with remote visits' : '가능합니다. 3일 집중제 (화/수/목) · 3일 자리 못 비우는 지방 원장님은 주말 2일반 격월 개설. 6+6개월 무제한 실습도 원격 방문 가능.',
              },
            ].map((f, i) => (
              <details key={i} style={{ padding: '18px 22px', border: '1px solid var(--gold-line)', background: 'var(--bg-deep)', borderRadius: 4 }}>
                <summary style={{ cursor: 'pointer', fontFamily: 'var(--ab-font-headline)', fontSize: 15, fontWeight: 600, color: 'var(--gold-light)', listStyle: 'none' }}>
                  <span style={{ color: 'var(--gold)', marginRight: 10, fontFamily: 'var(--ab-font-body-latin)', letterSpacing: '0.1em' }}>Q{String(i + 1).padStart(2, '0')}</span>
                  {f.q}
                </summary>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)', fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.75 }}>
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="stmt" id="stmt">
        <div className="wrap">
          <div className="mark">{m.stmt.mark}</div>
          <h2 className="serif">
            {m.stmt.lines.map((line, i) => (
              <span key={i}>
                {markHighlight(line, m.stmt.boldPart)}
                {i < m.stmt.lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>
          <div className="signature">{m.stmt.signature}</div>
        </div>
      </section>

      {/* 2026-07-27 Phase 2 · 학생 페르소나 4 카드 (유미 CONCERN 카피 · 박서윤 안) */}
      <section id="concern" style={{ padding: '70px 0 50px', background: '#0F0D0B' }}>
        <div className="wrap" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="sec-head" style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="mark" style={{ letterSpacing: '.32em', fontSize: 11, color: 'var(--gold)', fontWeight: 800 }}>CONCERN · 어떤 분이 오시나요?</div>
            <h2 className="serif" style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 34, fontWeight: 500, margin: '10px 0 8px', lineHeight: 1.35 }}>
              지금 필요한 배움은<br/><b style={{ color: 'var(--gold)', fontWeight: 700 }}>어느 쪽</b>에 더 가까우신가요?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>초보 · 재교육 · 창업 · 심화 — 원장님 1:1 매칭 상담</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            {[
              { icon: '🌱', t: '완전 초보', d: '반영구가 처음이라 어디서부터 배워야 할지 모르겠어요', cta: '이지 클래스 15기', href: '/enroll?course=easy', price: '69만원' },
              { icon: '🔁', t: '재교육', d: '다른 학원 배웠는데 실전에서 안 됩니다', cta: '극사실 3일 집중', href: '/enroll?course=hyperreal', price: '169만원' },
              { icon: '💼', t: '창업 준비', d: '내 매장을 열고 프리미엄 시장 진입', cta: '창업반 890 15기', href: '/enroll?course=founder', price: '890만원' },
              { icon: '🎓', t: '현직 심화', d: '이미 원장이지만 한 단계 더 올리고 싶어요', cta: '패키지 (이지+극사실+심화)', href: '/enroll?course=package', price: '199만원' },
            ].map((c) => (
              <a key={c.t} href={c.href} style={{
                display: 'block', padding: '22px 20px', background: 'linear-gradient(180deg,#14100C,#0B0907)',
                border: '1px solid rgba(224,192,136,.2)', borderRadius: 6, textDecoration: 'none', color: 'var(--ivory)',
                transition: 'transform .2s, border-color .2s, box-shadow .2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(224,192,136,.2)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 34, marginBottom: 12, lineHeight: 1 }}>{c.icon}</div>
                <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--ivory)' }}>{c.t}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, minHeight: 42, marginBottom: 14 }}>{c.d}</div>
                <div style={{ paddingTop: 12, borderTop: '1px solid rgba(224,192,136,.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: 11.5, color: 'var(--gold-light)', fontWeight: 700, letterSpacing: '.04em' }}>{c.cta}</div>
                  <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 16, color: 'var(--gold)', fontWeight: 700 }}>{c.price}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2026-07-27 Phase 3 · 신뢰 자산 3 카드 (특허·상표 3장 + 창업 수백여명 + 26년 강의자료) */}
      <section id="trust-assets" style={{ padding: '70px 0 60px', background: 'linear-gradient(180deg,#0F0D0B 0%, var(--bg-base) 100%)' }}>
        <div className="wrap" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="sec-head" style={{ textAlign: 'center', marginBottom: 34 }}>
            <div className="mark" style={{ letterSpacing: '.32em', fontSize: 11, color: 'var(--gold)', fontWeight: 800 }}>TRUST · 원장 정본 자산</div>
            <h2 className="serif" style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 34, fontWeight: 500, margin: '10px 0 8px', lineHeight: 1.35 }}>
              숫자가 아닌 <b style={{ color: 'var(--gold)', fontWeight: 700 }}>정본</b>으로 증명합니다.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>「극사실」 상표 · 반영구 머신 특허 · 26년 강의노트 정본 117p</p>
          </div>
          <TrustAssets variant="desktop" />
        </div>
      </section>

      {/* 2026-07-27 Phase 2 · Before/After 캐러셀 (유미 벤치 훔침 · 유나·이서연 안) */}
      <section id="before-after" style={{ padding: '80px 0 60px', background: 'linear-gradient(180deg, var(--bg-base) 0%, #0F0D0B 100%)' }}>
        <div className="wrap" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="sec-head" style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="mark" style={{ letterSpacing: '.32em', fontSize: 11, color: 'var(--gold)', fontWeight: 800 }}>BEFORE & AFTER · 원장 시술 시연</div>
            <h2 className="serif" style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 36, fontWeight: 500, margin: '10px 0 8px', lineHeight: 1.35 }}>
              결의 차이,<br/><b style={{ color: 'var(--gold)', fontWeight: 700 }}>30년 노하우</b>로 완성됩니다.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>한 얼굴에 맞는 라인 · 털결 그대로 · 특허 3장의 정본 시술</p>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <BeforeAfterCarousel variant="desktop" />
          </div>
        </div>
      </section>

      <section className="pillars" id="portfolio">
        <div className="wrap">
          <div className="sec-head">
            <div className="mark">PORTFOLIO · 포트폴리오</div>
            <h2 className="serif">
              {lang === 'zh' ? '院长' : lang === 'en' ? "Founder's " : ''}
              <b>{lang === 'zh' ? '亲手作品' : lang === 'en' ? 'Signature Works' : '대표 작품'}</b>
              {lang === 'ko' ? ' · 시그니처' : ''}
            </h2>
            <p>{lang === 'zh' ? '一根一根 · 骨相之流 · 极致沉淀。' : lang === 'en' ? 'Every strand · the flow of bone · a distilled craft.' : '한 올 한 올 · 골상의 흐름 · 30년의 정수.'}</p>
          </div>
          <div className="pillar-grid">
            {m.pillars.items.map((p, i) => (
              <div className="pillar" key={p.ord}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="img"><img src={PILLAR_IMGS[i]} alt={p.alt} /></div>
                <div className="body">
                  <div className="ord">{p.ord}</div>
                  <h3 className="serif">{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tracks" id="tracks">
        <div className="wrap">
          <div className="sec-head">
            <div className="mark">{m.tracks.mark}</div>
            <h2 className="serif">{markHighlight(m.tracks.title, m.tracks.boldPart)}</h2>
            <p>{m.tracks.lead}</p>
          </div>
          <div className="track-grid">
            <a className="track" href="https://jangmiji.staris.cloud" target="_blank" rel="noopener noreferrer">
              <div>
                <div className="ord">{m.tracks.a.ord}</div>
                <h3 className="serif">{markHighlight(m.tracks.a.title, m.tracks.a.boldPart)}</h3>
                <p>{m.tracks.a.desc}</p>
                <div className="stat">
                  {m.tracks.a.stats.map((s) => (
                    <div key={s.lbl}><div className="num">{s.num}</div><div className="lbl">{s.lbl}</div></div>
                  ))}
                </div>
              </div>
              <div className="go">{m.tracks.a.go}</div>
            </a>
            <a className="track" href="#axes" style={{ borderColor: "var(--gold-deep)", background: "linear-gradient(135deg, var(--bg-card2), var(--bg-card))" }}>
              <div>
                <div className="ord">{m.tracks.b.ord}</div>
                <h3 className="serif">{markHighlight(m.tracks.b.title, m.tracks.b.boldPart)}</h3>
                <p>{m.tracks.b.desc}</p>
                <div className="stat">
                  {m.tracks.b.stats.map((s) => (
                    <div key={s.lbl}><div className="num">{s.num}</div><div className="lbl">{s.lbl}</div></div>
                  ))}
                </div>
              </div>
              <div className="go">{m.tracks.b.go}</div>
            </a>
          </div>
        </div>
      </section>

      <section className="axes" id="axes">
        <div className="wrap">
          <div className="sec-head">
            <div className="mark">{m.axes.mark}</div>
            <h2 className="serif">{markHighlight(m.axes.title, m.axes.boldPart)}</h2>
            <p>{m.axes.lead}</p>
          </div>
          <div className="axis-grid">
            {m.axes.items.map((a) => (
              <div className="axis" key={a.ord}>
                <div className="ord">{a.ord}</div>
                <h4 className="serif">{a.title}</h4>
                <p>{a.desc}</p>
                <div className="status">{a.status}</div>
              </div>
            ))}
            <div className="axis" style={{ borderColor: "var(--gold-deep)", background: "var(--bg-card2)" }}>
              <div className="ord">{m.axes.axis5.ord}</div>
              <h4 className="serif">{m.axes.axis5.title}</h4>
              <p dangerouslySetInnerHTML={{ __html: m.axes.axis5.descHtml }} />
              <div className="status" style={{ color: "var(--gold-light)" }}>{m.axes.axis5.status}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="global" id="global">
        <div className="wrap">
          <div className="sec-head">
            <div className="mark">{m.global.mark}</div>
            <h2 className="serif">{markHighlight(m.global.title, m.global.boldPart)}</h2>
            <p>{m.global.lead}</p>
          </div>
          <div className="langs">
            {m.global.cards.map((c) => (
              <div className="lang-card" key={c.head}>
                <div className="flag">{c.flag}</div>
                <h4>{c.head}</h4>
                <p>{c.body}</p>
                <div className="ch">{c.ch}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band" id="cta">
        <h2 className="serif">
          {m.ctaBand.lines.map((line, i) => (
            <span key={i}>
              {markHighlight(line, m.ctaBand.boldPart)}
              {i < m.ctaBand.lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </h2>
        <p>{m.ctaBand.body}</p>
        <a href="/enroll">{m.ctaBand.button}</a>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="brand-mark">{m.footer.brand}<span>{m.footer.brandSub}</span></div>
              <p>{m.footer.blurb}</p>
            </div>
            <div>
              <h5>{m.footer.brandCol.title}</h5>
              <ul>
                {m.footer.brandCol.links.map((l) => (
                  <li key={l.text}>
                    {l.external
                      ? <a href={l.href} target="_blank" rel="noopener noreferrer">{l.text}</a>
                      : <a href={l.href}>{l.text}</a>}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5>{m.footer.tracksCol.title}</h5>
              <ul>
                {m.footer.tracksCol.links.map((l) => (
                  <li key={l.text}><a href={l.href}>{l.text}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5>{m.footer.contactCol.title}</h5>
              <ul>
                {m.footer.contactCol.links.map((l, i) => (
                  <li key={i}>{l.href ? <a href={l.href}>{l.text}</a> : l.text}</li>
                ))}
                <li style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--line)", fontSize: 11, color: "var(--gold-light)" }}>
                  {m.footer.contactCol.k1} <span style={{ color: "var(--muted)" }}>{m.footer.contactCol.k1Note}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>{m.footer.bottom}</span>
            <div className="pg">
              <span>TOSS PAYMENTS</span>
              <span>KAKAO PAY</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 우측 세로 플로팅 CTA 6개 (K1 · 인스타 · 무료강의 · 상담 · 전화 · 지도) */}
      <FloatingCTA variant="desktop" />
    </>
  );
}
