/**
 * HomeV2Content · 원장님/본부장님 시안 (course-detail_8.html · 2026-07-30) 기반
 * 공용 컴포넌트 · 「/」 · 「/en」 · 「/zh」 · 「/sophia」 에서 재사용
 * 다국어: home-v2-translations.ts · tr(key, lang) 로 조회
 *
 * 정체성: Warm paper (#F7EFE6) + Ink (#14100F) + Pigment (#B85C34) + Brass (#D9945F)
 * Mobile-first (max-width 520px) · 편집자적 톤
 */

'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { getMessages, type Lang } from '@/lib/i18n/messages';
import { tr } from './home-v2-translations';

const LANG_HREF = { ko: '/', en: '/en', zh: '/zh' } as const;

const KAKAO_K1 = 'https://open.kakao.com/o/gWeAkSzi';                        // 무료 강의방 (수강생 락인)
const KAKAO_CHANNEL = 'https://pf.kakao.com/_BxnBWK';                        // 카카오 채널 (1:1 상담 정본 · 시안 제공)
const INSTA = 'https://www.instagram.com/artbrows_academy/';
const PHONE = '010-3239-5453';
const NAVER_MAP = 'https://pcmap.place.naver.com/place/1291899054/home?from=map&fromPanelNum=1';
const KAKAO_MAP = 'https://map.kakao.com/link/search/서울 강남구 봉은사로68길 55-3 2층';

// 2026-07-30 · 원장님/본부장님 시안 course-detail_8.html 에서 추출한 정본 이미지
const HERO_MAIN = '/brand/course8-2026-07-30/01-hero.jpg';
const DEFINE_IMG = '/brand/course8-2026-07-30/02-define.jpg';
const FOUNDER_KV = '/brand/course8-2026-07-30/03-founder.jpg';
const GALLERY_WORK1 = '/brand/course8-2026-07-30/04-gallery-work1.jpg';

const CLASS_DOCS = [
  GALLERY_WORK1,
  '/brand/class-documentary/KakaoTalk_20260724_191617717_02.jpg',
  '/brand/class-documentary/KakaoTalk_20260724_191628747_01.jpg',
  '/brand/class-documentary/KakaoTalk_20260724_191628747_03.jpg',
];
const REF_CARDS = [
  '/brand/reference-cards-2026-07-24/01-cover-macroface.png',
  '/brand/reference-cards-2026-07-24/02-founder-lecture.png',
  '/brand/reference-cards-2026-07-24/03-question1-why.png',
  '/brand/reference-cards-2026-07-24/04-question2-sketch.png',
];

const wrap: React.CSSProperties = { maxWidth: 520, margin: '0 auto', padding: '0 24px' };
const sectionBase: React.CSSProperties = { padding: '64px 0', position: 'relative' };
const label: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase',
  color: '#D9945F', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
};
const h2Serif: React.CSSProperties = {
  fontFamily: "'Pretendard', -apple-system, sans-serif",
  fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.5,
};
const pBase: React.CSSProperties = { marginTop: 16, color: '#241C19', fontSize: 18.5, lineHeight: 1.65 };

export default function HomeV2Content({ lang = 'ko' }: { lang?: Lang } = {}) {
  const m = getMessages(lang);
  const T = (k: Parameters<typeof tr>[0]) => tr(k, lang);

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        body {
          background: #F7EFE6;
          color: #14100F;
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          line-height: 1.65;
          padding-bottom: 76px;
          margin: 0;
        }
        .home-v2 a { color: inherit; text-decoration: none; }
        .home-v2 img { max-width: 100%; display: block; }
        .home-v2 .label-line::before {
          content: ""; width: 18px; height: 1px; background: #D9945F; display: inline-block;
        }
        .home-v2 .btn-primary {
          display: block; text-align: center; padding: 15px 20px;
          font-size: 18.5px; font-weight: 700; border-radius: 2px;
          background: #B85C34; color: #F7EFE6;
        }
        .home-v2 .btn-ghost {
          display: block; text-align: center; padding: 15px 20px;
          font-size: 18.5px; font-weight: 700; border-radius: 2px;
          border: 1px solid rgba(247,239,230,0.18); color: #F7EFE6;
        }
      `}</style>

      <main className="home-v2">

        {/* 모바일 우선 GNB (2줄) · globals.css 의존 제거 · 375px 뷰포트 완전 표시
            Row1: brand · lang toggle · 전화 CTA
            Row2: 4 메뉴 균등 분배 (scroll fallback) */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(11,9,7,0.96)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(232,201,174,0.15)' }}>
          {/* Row 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', minHeight: 48 }}>
            <div style={{ fontFamily: "'Nanum Myeongjo', serif", fontSize: 17, fontWeight: 700, color: '#F7EFE6', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              {m.gnb.brand}
              <span style={{ fontFamily: "'Inter', 'Space Mono', sans-serif", fontSize: 9.5, color: '#D9945F', letterSpacing: '.18em', marginLeft: 6, fontWeight: 500, textTransform: 'uppercase' }}>
                {m.gnb.brandSub}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 3, marginLeft: 'auto', flexShrink: 0 }}>
              <Link href={LANG_HREF.ko} style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '.08em', padding: '4px 6px', border: '1px solid', borderColor: lang === 'ko' ? '#6B4530' : 'rgba(107,74,53,0.4)', color: lang === 'ko' ? '#E8C9AE' : '#B89880' }}>{m.langLabels.ko}</Link>
              <Link href={LANG_HREF.en} style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '.08em', padding: '4px 6px', border: '1px solid', borderColor: lang === 'en' ? '#6B4530' : 'rgba(107,74,53,0.4)', color: lang === 'en' ? '#E8C9AE' : '#B89880' }}>{m.langLabels.en}</Link>
              <Link href={LANG_HREF.zh} style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '.08em', padding: '4px 6px', border: '1px solid', borderColor: lang === 'zh' ? '#6B4530' : 'rgba(107,74,53,0.4)', color: lang === 'zh' ? '#E8C9AE' : '#B89880' }}>{m.langLabels.zh}</Link>
            </div>

            <a href={`tel:${PHONE}`} aria-label={T('gnbCtaProc')} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 32, background: '#D9945F', color: '#14100F', borderRadius: 2, flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1z"/></svg>
            </a>
          </div>

          {/* Row 2 : menu · 균등 분배 · 폰트 축소 */}
          <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid rgba(232,201,174,0.10)' }}>
            {[
              { href: '#master', label: T('gnbMasterMenu') },
              { href: '#define', label: T('gnbHyperMenu') },
              { href: '#gallery', label: T('gnbGalleryMenu') },
              { href: '#roadmap', label: T('gnbAcademyMenu') },
            ].map((item, i, arr) => (
              <li key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid rgba(232,201,174,0.08)' : 'none' }}>
                <a href={item.href} style={{ display: 'block', padding: '10px 4px', fontFamily: "'Nanum Myeongjo', 'Noto Serif SC', serif", fontSize: 13, color: '#E8D0B5', whiteSpace: 'nowrap' }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* HERO — GNB 2줄(약 88px) 여백 확보 */}
        <section style={{ background: '#14100F', color: '#F7EFE6', paddingTop: 88 }}>
          <div style={{ position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_MAIN} alt="ARTbrows Academy" style={{ width: '100%', height: '78vh', maxHeight: 560, minHeight: 400, objectFit: 'cover', objectPosition: 'center 15%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,16,15,.55) 0%, rgba(20,16,15,.15) 30%, rgba(20,16,15,.55) 62%, rgba(20,16,15,.98) 100%)' }} />
            <span style={{ position: 'absolute', left: 24, top: 20, zIndex: 2, fontFamily: "'Space Mono', monospace", fontSize: 12.5, letterSpacing: '.1em', color: '#D9945F', border: '1px solid rgba(247,239,230,0.18)', padding: '6px 12px' }}>
              {T('heroBadge')}
            </span>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 2, padding: '0 24px 26px' }}>
              <h1 style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.4, textAlign: 'center', letterSpacing: '-0.02em' }}>
                <em style={{ fontStyle: 'normal', color: '#D9945F', fontSize: 22, fontWeight: 600, display: 'inline-block' }}>{T('heroTitleTop')}</em><br />
                <span style={{ fontSize: 44, fontWeight: 800, display: 'inline-block', marginTop: 4 }}>{T('heroTitleBig')}</span>
              </h1>
              <p style={{ textAlign: 'center', color: '#B7A996', fontSize: 17.5, marginTop: 12 }}>
                {T('heroSubL1')}<br />{T('heroSubL2')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 20 }}>
                <a className="btn-primary" href={`tel:${PHONE}`}>{T('heroCtaPrimary')}</a>
                <a className="btn-ghost" href="#roadmap">{T('heroCtaGhost')}</a>
              </div>
            </div>
          </div>
          <div style={{ margin: '0 24px', transform: 'translateY(-1px)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid rgba(247,239,230,0.18)', borderTop: 'none', overflow: 'hidden' }}>
            {[
              { n: T('proof1n'), d: T('proof1d') },
              { n: T('proof2n'), d: T('proof2d') },
              { n: T('proof3n'), d: T('proof3d') },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '14px 6px', borderRight: i < 2 ? '1px solid rgba(247,239,230,0.18)' : 'none', background: '#14100F' }}>
                <div style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 900, fontSize: 20, color: '#D9945F' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: '#B7A996', marginTop: 4 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 01 · Origin */}
        <section style={sectionBase}>
          <div style={wrap}>
            <div className="label-line" style={label}>{T('originLabel')}</div>
            <h2 style={h2Serif}>{T('originTitle')}</h2>
            <p style={{ ...pBase, marginTop: 14, fontSize: 20, fontWeight: 700, color: '#B85C34' }}>{T('originLead')}</p>
            <p style={pBase}>{T('originP1')}</p>
            <p style={pBase}>{T('originP2')}</p>
            <p style={pBase}>{T('originP3')}</p>
            <div style={{ marginTop: 24, padding: 20, background: '#ECE0D2', borderLeft: '3px solid #B85C34', fontSize: 19, fontWeight: 700, lineHeight: 1.7 }}>
              {T('originQuote')}
            </div>
          </div>
        </section>

        {/* 02 · Define */}
        <section id="define" style={{ ...sectionBase, background: '#ECE0D2' }}>
          <div style={wrap}>
            <div className="label-line" style={label}>{T('defineLabel')}</div>
            <h2 style={h2Serif}>{T('defineTitle')}</h2>
            <p style={pBase}>{T('defineBody')}</p>
            <div style={{ border: '1px solid rgba(20,16,15,0.12)', padding: 4, marginTop: 24, background: '#F7EFE6' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DEFINE_IMG} alt="Hyperreal Brow example" style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ marginTop: 14, textAlign: 'center', fontFamily: "'Pretendard', sans-serif", fontStyle: 'italic', fontSize: 15.5, color: '#7A6C5D', lineHeight: 1.6 }}>
              {T('defineCaption')}
            </div>
            <div style={{ marginTop: 24, textAlign: 'center', fontWeight: 900, fontSize: 21, color: '#B85C34' }}>
              {T('defineMantra')}
            </div>
          </div>
        </section>

        {/* 03 · Master */}
        <section id="master" style={sectionBase}>
          <div style={wrap}>
            <div className="label-line" style={label}>{T('masterLabel')}</div>
            <div style={{ marginTop: 26, fontSize: 17, color: '#D9945F', fontWeight: 700 }}>{T('masterCrown')}</div>
            <h2 style={{ ...h2Serif, fontSize: 30, fontWeight: 900, marginTop: 4 }}>{T('masterName')}</h2>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#D9945F', marginTop: 8, letterSpacing: '.06em' }}>{T('masterRole')}</div>

            <div style={{ border: '1px solid rgba(20,16,15,0.12)', padding: 4, marginTop: 24 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={FOUNDER_KV} alt={T('masterName')} style={{ width: '100%' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
              {[
                [{ n: T('masterStat1n'), d: T('masterStat1d') }, { n: T('masterStat2n'), d: T('masterStat2d') }],
                [{ n: T('masterStat3n'), d: T('masterStat3d') }, { n: T('masterStat4n'), d: T('masterStat4d') }],
              ].map((row, ri) => (
                <div key={ri} style={{ display: 'flex', background: '#14100F', borderRadius: 6, overflow: 'hidden' }}>
                  {row.map((s, i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center', padding: '14px 6px', borderRight: i < row.length - 1 ? '1px solid rgba(247,239,230,0.18)' : 'none' }}>
                      <div style={{ fontWeight: 900, fontSize: 19, color: '#D9945F', lineHeight: 1.2 }}>{s.n}</div>
                      <div style={{ fontSize: 12, color: '#ECE0D2', marginTop: 3 }}>{s.d}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <p style={pBase}>{T('masterBio')}</p>

            <ul style={{ marginTop: 22, borderTop: '1px solid rgba(20,16,15,0.12)', listStyle: 'none', padding: 0 }}>
              {[T('cred1'), T('cred2'), T('cred3'), T('cred4')].map((c, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, padding: '13px 0', borderBottom: '1px solid rgba(20,16,15,0.12)', fontSize: 17.5 }}>
                  <span style={{ color: '#B85C34', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>0{i + 1}</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 24, padding: 20, background: '#ECE0D2', borderLeft: '3px solid #B85C34', fontSize: 17, lineHeight: 1.7 }}>
              {T('masterQuote')}
            </div>
            <div style={{ marginTop: 36, textAlign: 'right' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#7A6C5D' }}>{T('masterSignRole')}</div>
              <div style={{ fontFamily: "'Nanum Pen Script', cursive", fontSize: 36, color: '#14100F', marginTop: 4 }}>{T('masterSignName')}</div>
            </div>
          </div>
        </section>

        {/* 04 · Art Gallery */}
        <section id="gallery" style={{ ...sectionBase, background: '#ECE0D2' }}>
          <div style={wrap}>
            <div className="label-line" style={label}>{T('galleryLabel')}</div>
            <div style={{ fontSize: 15, color: '#D9945F', fontWeight: 700 }}>{T('galleryTag')}</div>
            <h2 style={{ ...h2Serif, marginTop: 4 }}>{T('galleryTitle')}</h2>
            <p style={{ marginTop: 12, color: '#7A6C5D', fontSize: 15 }}>{T('galleryDesc')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 22 }}>
              {CLASS_DOCS.map((src, i) => (
                <div key={i} style={{ aspectRatio: '1/1', border: '1px solid rgba(20,16,15,0.12)', background: '#F7EFE6', position: 'relative', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`WORK ${String(i + 1).padStart(2, '0')}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 10, left: 10, fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#D9945F', letterSpacing: '.05em', background: 'rgba(20,16,15,.6)', padding: '3px 8px' }}>
                    WORK {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 11.5, color: '#B7A996', textAlign: 'center' }}>{T('galleryNote')}</div>
          </div>
        </section>

        {/* 05 · Roadmap */}
        <section id="roadmap" style={{ ...sectionBase, background: '#F7EFE6' }}>
          <div style={wrap}>
            <div className="label-line" style={label}>{T('roadmapLabel')}</div>
            <h2 style={h2Serif}>{T('roadmapTitle')}</h2>
            <p style={{ marginTop: 14, color: '#7A6C5D', fontSize: 18.5 }}>{T('roadmapDesc')}</p>
            <p style={{ marginTop: 14, fontSize: 20.5, fontWeight: 700, color: '#14100F' }}>{T('roadmapLead')}</p>
            <p style={{ marginTop: 14, color: '#7A6C5D', fontSize: 18.5 }}>{T('roadmapSub')}</p>

            <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {[
                { n: '01', tk: 'courseAtitle', pk: 'courseAprice', ak: 'courseAaud', dk: 'courseAdesc', mk: 'courseAmeta' },
                { n: '02', tk: 'courseBtitle', pk: 'courseBprice', ak: 'courseBaud', dk: 'courseBdesc', mk: 'courseBmeta' },
                { n: '03', tk: 'courseCtitle', pk: 'courseCprice', ak: 'courseCaud', dk: 'courseCdesc', mk: 'courseCmeta' },
              ].map((step, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '0 0 34px 0', position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 44, position: 'relative' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#14100F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Pretendard', sans-serif", fontWeight: 900, fontSize: 21, color: '#D9945F', zIndex: 1 }}>
                      {step.n}
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ position: 'absolute', top: 44, bottom: -34, width: 2, background: 'rgba(20,16,15,0.12)', left: '50%', transform: 'translateX(-50%)' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700 }}>{T(step.tk as Parameters<typeof tr>[0])}</h3>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, color: '#B85C34', marginTop: 4 }}>{T(step.pk as Parameters<typeof tr>[0])}</div>
                    <div style={{ fontSize: 15.5, color: '#7A6C5D', marginTop: 8 }}>
                      <b>{lang === 'en' ? 'Audience · ' : lang === 'zh' ? '对象 · ' : '대상 · '}</b>{T(step.ak as Parameters<typeof tr>[0])}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 15.5, color: '#241C19' }}>{T(step.dk as Parameters<typeof tr>[0])}</div>
                    <div style={{ marginTop: 6, fontSize: 13, color: '#7A6C5D', fontFamily: "'Space Mono', monospace" }}>{T(step.mk as Parameters<typeof tr>[0])}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 06 · Flagship */}
        <section style={{ ...sectionBase, background: '#ECE0D2' }}>
          <div style={wrap}>
            <div className="label-line" style={label}>{T('flagshipLabel')}</div>
            <h2 style={{ ...h2Serif, fontSize: 26 }}>{T('flagshipTitleL1')}<br />{T('flagshipTitleL2')}</h2>
            <p style={pBase}>{T('flagshipDesc')}</p>

            <h3 style={{ marginTop: 24, fontSize: 18, fontWeight: 700 }}>{T('flagshipWhyTitle')}</h3>
            <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.9, color: '#241C19', fontSize: 16.5 }}>
              <li>{T('flagshipWhy1')}</li>
              <li>{T('flagshipWhy2')}</li>
              <li>{T('flagshipWhy3')}</li>
            </ul>

            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                { st: 'STEP 1', tk: 'step1t', dk: 'step1d' },
                { st: 'STEP 2', tk: 'step2t', dk: 'step2d' },
                { st: 'STEP 3', tk: 'step3t', dk: 'step3d' },
                { st: 'STEP 4', tk: 'step4t', dk: 'step4d' },
                { st: 'STEP 5', tk: 'step5t', dk: 'step5d' },
                { st: 'STEP 6', tk: 'step6t', dk: 'step6d' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '16px 14px', background: '#F7EFE6', border: '1px solid rgba(20,16,15,0.12)' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#D9945F', letterSpacing: '.08em', fontWeight: 700 }}>{s.st}</div>
                  <h4 style={{ fontSize: 15.5, fontWeight: 700, marginTop: 4 }}>{T(s.tk as Parameters<typeof tr>[0])}</h4>
                  <div style={{ fontSize: 12.5, color: '#7A6C5D', marginTop: 4 }}>{T(s.dk as Parameters<typeof tr>[0])}</div>
                </div>
              ))}
            </div>

            <h3 style={{ marginTop: 32, textAlign: 'center', fontSize: 17, fontWeight: 700 }}>{T('eduTitle')}</h3>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 4, marginTop: 20 }}>
              {[
                { n: '01', l: T('eduLabel1') },
                { n: '02', l: T('eduLabel2') },
                { n: '03', l: T('eduLabel3') },
                { n: '04', l: T('eduLabel4') },
              ].map((s, i, arr) => (
                <Fragment key={i}>
                  <div style={{ flex: 1, textAlign: 'center', background: 'rgba(20,16,15,.08)', border: '1px solid rgba(20,16,15,.12)', borderRadius: 6, padding: '16px 2px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13.5, color: '#B85C34', fontWeight: 700, letterSpacing: '.03em' }}>{s.n}</div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#14100F', marginTop: 5, whiteSpace: 'nowrap' }}>{s.l}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ color: '#B85C34', fontSize: 15, flex: 'none', alignSelf: 'center' }}>→</div>
                  )}
                </Fragment>
              ))}
            </div>

            <h3 style={{ marginTop: 26, fontSize: 16, fontWeight: 700 }}>{T('targetTitle')}</h3>
            <ul style={{ marginTop: 10, paddingLeft: 20, lineHeight: 1.8, color: '#241C19', fontSize: 15.5 }}>
              <li>{T('target1')}</li>
              <li>{T('target2')}</li>
              <li>{T('target3')}</li>
              <li>{T('target4')}</li>
            </ul>

            <div style={{ marginTop: 22, padding: 16, background: '#14100F', color: '#F7EFE6', textAlign: 'center' }}>
              <div style={{ fontSize: 15 }}>{T('priceNotice')}</div>
            </div>

            <a className="btn-primary" href={`tel:${PHONE}`} style={{ marginTop: 14 }}>{T('flagshipCta')}</a>
          </div>
        </section>

        {/* 07 · Graduates' Work */}
        <section style={sectionBase}>
          <div style={wrap}>
            <div className="label-line" style={label}>{T('gradsLabel')}</div>
            <div style={{ fontSize: 15, color: '#D9945F', fontWeight: 700 }}>{T('gradsTag')}</div>
            <h2 style={{ ...h2Serif, marginTop: 4 }}>{T('gradsTitle')}</h2>
            <p style={{ marginTop: 12, color: '#7A6C5D', fontSize: 15 }}>{T('gradsDesc')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 22 }}>
              {REF_CARDS.map((src, i) => (
                <div key={i} style={{ aspectRatio: '1/1', border: '1px solid rgba(20,16,15,0.12)', background: '#ECE0D2', position: 'relative', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`WORK ${String(i + 1).padStart(2, '0')}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 10, left: 10, fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#D9945F', letterSpacing: '.05em', background: 'rgba(20,16,15,.6)', padding: '3px 8px' }}>
                    WORK {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 11.5, color: '#B7A996', textAlign: 'center' }}>{T('gradsNote')}</div>
          </div>
        </section>

        {/* 08 · Location */}
        <section style={{ ...sectionBase, background: '#ECE0D2' }}>
          <div style={wrap}>
            <div className="label-line" style={label}>{T('locLabel')}</div>
            <h2 style={h2Serif}>{T('locTitle')}</h2>
            <div style={{ marginTop: 20, padding: 20, background: '#F7EFE6', border: '1px solid rgba(20,16,15,0.12)' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#14100F' }}>{T('locName')}</div>
              <div style={{ marginTop: 8, fontSize: 15.5, color: '#241C19' }}>{T('locAddr')}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: '#7A6C5D' }}>{T('locStation')}</div>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href={NAVER_MAP} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 14px', background: '#14100F', color: '#F7EFE6', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{T('locNaver')}</a>
                <a href={KAKAO_MAP} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 14px', border: '1px solid #14100F', color: '#14100F', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{T('locKakao')}</a>
              </div>
            </div>
          </div>
        </section>

        {/* 09 · FAQ */}
        <section style={sectionBase}>
          <div style={wrap}>
            <div className="label-line" style={label}>{T('faqLabel')}</div>
            <h2 style={h2Serif}>{T('faqTitle')}</h2>
            <div style={{ marginTop: 22 }}>
              {[
                { q: T('faq1q'), a: T('faq1a') },
                { q: T('faq2q'), a: T('faq2a') },
                { q: T('faq3q'), a: T('faq3a') },
                { q: T('faq4q'), a: T('faq4a') },
              ].map((f, i) => (
                <details key={i} style={{ padding: '14px 0', borderBottom: '1px solid rgba(20,16,15,0.12)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 16.5, color: '#14100F', listStyle: 'none' }}>
                    <span style={{ color: '#B85C34', fontFamily: "'Space Mono', monospace", marginRight: 8 }}>Q.</span>{f.q}
                  </summary>
                  <p style={{ marginTop: 10, fontSize: 15.5, color: '#241C19', lineHeight: 1.7 }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ ...sectionBase, background: '#14100F', color: '#F7EFE6', textAlign: 'center' }}>
          <div style={wrap}>
            <div className="label-line" style={{ ...label, justifyContent: 'center' }}>{T('finalLabel')}</div>
            <h2 style={{ ...h2Serif, fontSize: 26, color: '#F7EFE6', lineHeight: 1.5 }}>
              <span style={{ color: '#F7EFE6' }}>{T('finalTitleL1')}</span><br />
              <span style={{ color: '#D9945F' }}>{T('finalTitleL2')}</span>{T('finalTitleL3')}
            </h2>
            <p style={{ marginTop: 14, color: '#B7A996', fontSize: 17 }}>{T('finalDesc')}</p>
            <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a className="btn-primary" href={`tel:${PHONE}`}>{T('ctaTel')} · {PHONE}</a>
              <a className="btn-ghost" href={KAKAO_K1} target="_blank" rel="noopener noreferrer">{T('ctaKakaoK1')}</a>
              <a className="btn-ghost" href={INSTA} target="_blank" rel="noopener noreferrer">{T('ctaInsta')}</a>
            </div>
            <div style={{ marginTop: 28, fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#7A6C5D', letterSpacing: '.06em' }}>{T('finalFooter')}</div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: '#14100F', color: '#B7A996', padding: '32px 24px 40px', fontSize: 14, lineHeight: 1.8 }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{ padding: '5px 0' }}>
              <b style={{ color: '#F7EFE6', fontWeight: 500 }}>{T('footBrand')}</b> · {T('footBrandDesc')}
            </div>
            <div style={{ padding: '5px 0' }}>{T('footAddr')}</div>
            <div style={{ padding: '5px 0' }}>{T('footContact')}</div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(247,239,230,0.18)', fontSize: 13, color: '#6b5c4f' }}>
              {T('footCopyright')}
            </div>
          </div>
        </footer>

        {/* Sticky Bottom Bar */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, display: 'flex', background: '#14100F', borderTop: '1px solid rgba(247,239,230,0.18)' }}>
          <a href={`tel:${PHONE}`} style={{ flex: 1, textAlign: 'center', padding: '18px 10px', fontSize: 17, fontWeight: 700, background: '#B85C34', color: '#F7EFE6' }}>
            {T('stickyCall')}
          </a>
          <a href={KAKAO_CHANNEL} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', padding: '18px 10px', fontSize: 17, fontWeight: 700, background: '#F7EFE6', color: '#14100F' }}>
            {T('stickyKakao')}
          </a>
        </div>

      </main>
    </>
  );
}
