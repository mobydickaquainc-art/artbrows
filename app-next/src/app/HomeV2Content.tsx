/**
 * HomeV2Content · 원장님/본부장님 시안 (course-detail_6.html · 2026-07-29) 기반
 * 공용 컴포넌트 · 「/」 와 「/sophia」 양쪽에서 재사용
 *
 * 정체성: Warm paper (#F7EFE6) + Ink (#14100F) + Pigment (#B85C34) + Brass (#D9945F)
 * Mobile-first (max-width 520px) · 편집자적 톤 · 아카데미 정규 커리큘럼 안내
 */

'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { getMessages, type Lang } from '@/lib/i18n/messages';

const LANG_HREF = { ko: '/', en: '/en', zh: '/zh' } as const;

const KAKAO_K1 = 'https://open.kakao.com/o/gWeAkSzi';                        // 무료 강의방 (수강생 락인)
const KAKAO_CHANNEL = 'https://pf.kakao.com/_BxnBWK';                        // 카카오 채널 (1:1 상담 정본 · 시안 제공)
const INSTA = 'https://www.instagram.com/artbrows_academy/';
const PHONE = '010-3239-5453';
const NAVER_MAP = 'https://pcmap.place.naver.com/place/1291899054/home?from=map&fromPanelNum=1';
const KAKAO_MAP = 'https://map.kakao.com/link/search/서울 강남구 봉은사로68길 55-3 2층';

// 2026-07-30 · 원장님/본부장님 시안 course-detail_8.html 에서 추출한 정본 이미지
const HERO_MAIN = '/brand/course8-2026-07-30/01-hero.jpg';            // 원장 소묘 근접 다큐
const DEFINE_IMG = '/brand/course8-2026-07-30/02-define.jpg';         // 극사실 결과 예시 (젊은 여성 자연 눈썹)
const FOUNDER_KV = '/brand/course8-2026-07-30/03-founder.jpg';        // 장미지 원장 프로필
const GALLERY_WORK1 = '/brand/course8-2026-07-30/04-gallery-work1.jpg'; // 시술 전 눈썹

const CLASS_DOCS = [
  GALLERY_WORK1,                                                        // WORK 01 · 시안 정본
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

        {/* 기존 GNB 유지 · HomePageDesktop 스타일 그대로 · 다크 톤 (HERO 다크와 정합) */}
        <nav className="top" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'linear-gradient(180deg, rgba(11,9,7,0.96) 0%, rgba(11,9,7,0.88) 100%)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--line-soft)' }}>
          <div className="wrap">
            <div className="nav-row" style={{ display: 'flex', alignItems: 'center', gap: 20, minHeight: 62 }}>
              {/* LEFT: icons + brand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <a href={KAKAO_K1} target="_blank" rel="noopener noreferrer" aria-label="KakaoTalk K1"
                  style={{ color: 'var(--rose-soft)', display: 'inline-flex', width: 20, height: 20 }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.84 5.32 4.6 6.72L5.4 21.6c-.09.28.22.51.47.35l4.4-2.9c.56.06 1.13.1 1.73.1 5.52 0 10-3.58 10-8s-4.48-8-10-8z" /></svg>
                </a>
                <a href={INSTA} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  style={{ color: 'var(--rose-soft)', display: 'inline-flex', width: 20, height: 20 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg>
                </a>
                <div className="brand" style={{ marginLeft: 6 }}>
                  {m.gnb.brand}<span className="sub">{m.gnb.brandSub}</span>
                </div>
              </div>

              {/* MIDDLE: 4 메뉴 */}
              <ul style={{ display: 'flex', gap: 28, listStyle: 'none', margin: '0 auto', padding: 0 }}>
                <li><a href="#master">대표원장</a></li>
                <li><a href="#define">장미지 극사실눈썹</a></li>
                <li><a href="#gallery">포트폴리오</a></li>
                <li><a href="#roadmap">아카데미</a></li>
              </ul>

              {/* RIGHT: lang + 2 CTA */}
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
                  교육 상담
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
                  시술 상담
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background: '#14100F', color: '#F7EFE6', paddingTop: 52 }}>
          <div style={{ position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_MAIN} alt="ARTbrows Academy" style={{ width: '100%', height: '78vh', maxHeight: 560, minHeight: 400, objectFit: 'cover', objectPosition: 'center 15%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,16,15,.55) 0%, rgba(20,16,15,.15) 30%, rgba(20,16,15,.55) 62%, rgba(20,16,15,.98) 100%)' }} />
            <span style={{ position: 'absolute', left: 24, top: 20, zIndex: 2, fontFamily: "'Space Mono', monospace", fontSize: 12.5, letterSpacing: '.1em', color: '#D9945F', border: '1px solid rgba(247,239,230,0.18)', padding: '6px 12px' }}>
              HYPERREAL BROW
            </span>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 2, padding: '0 24px 26px' }}>
              <h1 style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.4, textAlign: 'center', letterSpacing: '-0.02em' }}>
                <em style={{ fontStyle: 'normal', color: '#D9945F', fontSize: 22, fontWeight: 600, display: 'inline-block' }}>진짜에 가깝게!</em><br />
                <span style={{ fontSize: 44, fontWeight: 800, display: 'inline-block', marginTop: 4 }}>극사실눈썹</span>
              </h1>
              <p style={{ textAlign: 'center', color: '#B7A996', fontSize: 17.5, marginTop: 12 }}>
                진짜 눈썹처럼 자연스러운 극사실기법 특허 기술!<br />
                아트브로우가 최고의 반영구 전문가를 양성합니다.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 20 }}>
                <a className="btn-primary" href={`tel:${PHONE}`}>시술/교육 상담 →</a>
                <a className="btn-ghost" href="#roadmap">커리큘럼 보기</a>
              </div>
            </div>
          </div>
          <div style={{ margin: '0 24px', transform: 'translateY(-1px)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid rgba(247,239,230,0.18)', borderTop: 'none', overflow: 'hidden' }}>
            {[
              { n: '20년+', d: '창시자 경력' },
              { n: '8,000+', d: '누적 시술' },
              { n: '1,000+', d: '누적 수강생' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '14px 6px', borderRight: i < 2 ? '1px solid rgba(247,239,230,0.18)' : 'none', background: '#14100F' }}>
                <div style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 900, fontSize: 20, color: '#D9945F' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: '#B7A996', marginTop: 4 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 01 · The Origin */}
        <section style={sectionBase}>
          <div style={wrap}>
            <div className="label-line" style={label}>01 · The Origin</div>
            <h2 style={h2Serif}>극사실눈썹의 시작</h2>
            <p style={{ ...pBase, marginTop: 14, fontSize: 20, fontWeight: 700, color: '#B85C34' }}>
              천 명의 고객, 단 하나의 눈썹 패턴.
            </p>
            <p style={pBase}>20년간 장미지 원장은 늘 같은 장면을 마주했습니다.</p>
            <p style={pBase}>
              둥근 얼굴, 각진 얼굴, 긴 얼굴, 평평한 얼굴, 역삼각형 얼굴 등 — 얼굴형은 달라도 모든 사람에게, 모든 반영구 시술자가 일자눈썹만 시술했습니다. &ldquo;왜 진짜 눈썹이랑 결도 다르고, 방향도 어색하게 따로 놀까?&rdquo;
            </p>
            <p style={pBase}>
              그렇게 답을 찾기 시작했고, 만화가를 꿈꾸며 어릴 적 보던 해부학 책을 다시 펼쳐보며, 눈썹은 그 사람만의 골격과 모류 방향을 읽어내는 데서 시작해야 한다는 것을 깨달았습니다. 반영구 기법에 소묘의 원리를 정식으로 접목한 것 — 그것이 극사실눈썹의 시작이었습니다.
            </p>
            <div style={{ marginTop: 24, padding: 20, background: '#ECE0D2', borderLeft: '3px solid #B85C34', fontSize: 19, fontWeight: 700, lineHeight: 1.7 }}>
              &ldquo;나는 고객이 원하는 눈썹을 그리고 있는가.&rdquo;
            </div>
          </div>
        </section>

        {/* 02 · Define */}
        <section id="define" style={{ ...sectionBase, background: '#ECE0D2' }}>
          <div style={wrap}>
            <div className="label-line" style={label}>02 · What is Hyperreal Brow</div>
            <h2 style={h2Serif}>극사실눈썹이란?</h2>
            <p style={pBase}>
              극사실눈썹은 정해진 패턴을 그리는 시술이 아니라, 얼굴을 소묘하듯 관찰하고 설계하는 기법입니다. 골격, 눈매, 원래 모류의 결과 방향을 먼저 읽고 단순히 그리는 것이 아닌, 본연의 아름다움에 한 올 한 올 생장감을 불어넣는 작업. 똑같은 시간을 쓰더라도 전혀 다른 차원의 결과가 나오는 이유입니다.
            </p>
            {/* 시안 정본 · 극사실 결과 예시 (course-detail_8) */}
            <div style={{ border: '1px solid rgba(20,16,15,0.12)', padding: 4, marginTop: 24, background: '#F7EFE6' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DEFINE_IMG} alt="극사실눈썹 결과 예시" style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ marginTop: 14, textAlign: 'center', fontFamily: "'Pretendard', sans-serif", fontStyle: 'italic', fontSize: 15.5, color: '#7A6C5D', lineHeight: 1.6 }}>
              &ldquo;진짜를 그리면 인상이 달라진다, 인생이 달라진다&rdquo;
            </div>
            <div style={{ marginTop: 24, textAlign: 'center', fontWeight: 900, fontSize: 21, color: '#B85C34' }}>
              패턴이 아닌 · 소묘
            </div>
          </div>
        </section>

        {/* 03 · Master */}
        <section id="master" style={sectionBase}>
          <div style={wrap}>
            <div className="label-line" style={label}>03 · Master</div>
            <div style={{ marginTop: 26, fontSize: 17, color: '#D9945F', fontWeight: 700 }}>
              국내 눈썹문신의 정점에 있는 MASTER
            </div>
            <h2 style={{ ...h2Serif, fontSize: 30, fontWeight: 900, marginTop: 4 }}>장미지 대표원장</h2>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#D9945F', marginTop: 8, letterSpacing: '.06em' }}>
              ARTBROWS ACADEMY · FOUNDER
            </div>

            <div style={{ border: '1px solid rgba(20,16,15,0.12)', padding: 4, marginTop: 24 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={FOUNDER_KV} alt="장미지 대표원장" style={{ width: '100%' }} />
            </div>

            {/* 시안 · 통계 2 pill × 4 항목 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
              {[
                [{ n: '20년+', d: '시술 경력' }, { n: '10,000+', d: '누적 시술' }],
                [{ n: '1,000+', d: '누적 수강생' }, { n: '3장', d: '특허·상표' }],
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

            <p style={pBase}>
              「극사실눈썹」 기법 · 상표 · 머신 특허 3장 보유 (특허 10-2863985). 경력 5~10년차 원장님들도 스킬업 재교육을 받으러 오는 정본 방법론의 원본입니다.
            </p>

            <ul style={{ marginTop: 22, borderTop: '1px solid rgba(20,16,15,0.12)', listStyle: 'none', padding: 0 }}>
              {[
                'ARTBROWS ACADEMY 총괄 대표원장',
                '극사실눈썹 기법·상표·머신 특허 3장 등록',
                '누적 수강생 1,000+ · 창업 수백여명 배출',
                '2027-10 반영구 준합법화 대비 · 국내 유일 표준 방법론',
              ].map((c, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, padding: '13px 0', borderBottom: '1px solid rgba(20,16,15,0.12)', fontSize: 17.5 }}>
                  <span style={{ color: '#B85C34', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>0{i + 1}</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>

            {/* 시안 · 원장님 인용 quote-block + 손글씨 서명 */}
            <div style={{ marginTop: 24, padding: 20, background: '#ECE0D2', borderLeft: '3px solid #B85C34', fontSize: 17, lineHeight: 1.7 }}>
              &ldquo;극사실눈썹은 단순한 시술이 아니라, 한 사람의 표정과 인생을 바꾸는 일입니다.&rdquo;
            </div>
            <div style={{ marginTop: 36, textAlign: 'right' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#7A6C5D' }}>ARTBROWS 대표원장</div>
              <div style={{ fontFamily: "'Nanum Pen Script', cursive", fontSize: 36, color: '#14100F', marginTop: 4 }}>장미지</div>
            </div>
          </div>
        </section>

        {/* 04 · Art Gallery */}
        <section id="gallery" style={{ ...sectionBase, background: '#ECE0D2' }}>
          <div style={wrap}>
            <div className="label-line" style={label}>04 · Art Gallery</div>
            <div style={{ fontSize: 15, color: '#D9945F', fontWeight: 700 }}>국내 ONE TOP!</div>
            <h2 style={{ ...h2Serif, marginTop: 4 }}>장미지 원장의 Art Gallery</h2>
            <p style={{ marginTop: 12, color: '#7A6C5D', fontSize: 15 }}>극사실눈썹으로 완성한 실제 작품들입니다.</p>
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
            <div style={{ marginTop: 14, fontSize: 11.5, color: '#B7A996', textAlign: 'center' }}>
              작품 이미지는 원장님 승인 후 순차 업데이트됩니다
            </div>
          </div>
        </section>

        {/* 05 · Roadmap */}
        <section id="roadmap" style={{ ...sectionBase, background: '#F7EFE6' }}>
          <div style={wrap}>
            <div className="label-line" style={label}>05 · Curriculum Roadmap</div>
            <h2 style={h2Serif}>국내유일 극사실눈썹 교육 아카데미</h2>
            <p style={{ marginTop: 14, color: '#7A6C5D', fontSize: 18.5 }}>
              아트브로우 아카데미는 진짜 내 눈썹처럼 섬세하고 자연스러운 극사실 기법을 처음으로 정립하고 시술·교육하는 전문 뷰티 아카데미입니다.
            </p>
            <p style={{ marginTop: 14, fontSize: 20.5, fontWeight: 700, color: '#14100F' }}>
              입문부터 심화까지 3단계로 이어지는 원장 직강 정규 커리큘럼
            </p>
            <p style={{ marginTop: 14, color: '#7A6C5D', fontSize: 18.5 }}>각 과정은 독립적으로도 수강하실 수 있습니다.</p>

            <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {[
                { n: '01', title: '이지클래스', price: '69만원', audience: '반영구 입문자, 오래전에 배운 분, 아직 선 하나가 자신 없는 분', desc: '눈썹의 기초 이론과 실습을 처음부터 제대로 배우는 입문 과정.', meta: '일요일 5주 · 3시간×5회 (15H)' },
                { n: '02', title: '극사실기초 소묘수업', price: '66만원', audience: '이지클래스 졸업생, 경력자, 헤어스트록 수강자', desc: '진짜 눈썹을 보고 그리는 원리 수업. 배운 이론을 실전 시술에 녹여내는 과정.', meta: '3일 집중' },
                { n: '03', title: '극사실눈썹 강의', price: '169만원', audience: '소묘 과정 이수자, 극사실눈썹을 실전 시술로 완성하고 싶은 분', desc: '원장 직강 · 결의 재현 원리 · 실전 케이스 중심.', meta: '3일 집중 · 원장 직강' },
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
                    <h3 style={{ fontSize: 20, fontWeight: 700 }}>{step.title}</h3>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, color: '#B85C34', marginTop: 4 }}>{step.price}</div>
                    <div style={{ fontSize: 15.5, color: '#7A6C5D', marginTop: 8 }}>
                      <b>대상 ·</b> {step.audience}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 15.5, color: '#241C19' }}>{step.desc}</div>
                    <div style={{ marginTop: 6, fontSize: 13, color: '#7A6C5D', fontFamily: "'Space Mono', monospace" }}>{step.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 06 · Flagship */}
        <section style={{ ...sectionBase, background: '#ECE0D2' }}>
          <div style={wrap}>
            <div className="label-line" style={label}>06 · Flagship</div>
            <h2 style={{ ...h2Serif, fontSize: 26 }}>극사실눈썹 단기창업반<br />(교육+창업멘토링)</h2>
            <p style={pBase}>이지클래스부터 실전실습까지 전 과정을 통합한 6개월 플래그십 과정. 기술 습득은 물론 실제 창업까지 이어지는 로드맵을 함께 설계합니다.</p>

            <h3 style={{ marginTop: 24, fontSize: 18, fontWeight: 700 }}>왜 단기창업반인가요?</h3>
            <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.9, color: '#241C19', fontSize: 16.5 }}>
              <li>이지클래스부터 창업 컨설팅까지, 기술과 창업을 하나의 로드맵으로 연결합니다</li>
              <li>소묘·강의 각 4회 반복 수강으로 실력의 완성도를 끌어올립니다</li>
              <li>장미지 대표원장이 전 과정을 직접 지도하고, 창업 이후까지 함께합니다</li>
            </ul>

            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                { st: 'STEP 1', t: '이지클래스', d: '반영구 입문 정석과정' },
                { st: 'STEP 2', t: '극사실기초 소묘', d: '4회 반복 수강' },
                { st: 'STEP 3', t: '극사실눈썹 강의', d: '4회 반복 수강' },
                { st: 'STEP 4', t: '실전실습', d: '창업 실전 과정' },
                { st: 'STEP 5', t: '무제한 실습', d: '베드 무료오픈' },
                { st: 'STEP 6', t: '창업 컨설팅', d: '인테리어+마케팅' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '16px 14px', background: '#F7EFE6', border: '1px solid rgba(20,16,15,0.12)' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#D9945F', letterSpacing: '.08em', fontWeight: 700 }}>{s.st}</div>
                  <h4 style={{ fontSize: 15.5, fontWeight: 700, marginTop: 4 }}>{s.t}</h4>
                  <div style={{ fontSize: 12.5, color: '#7A6C5D', marginTop: 4 }}>{s.d}</div>
                </div>
              ))}
            </div>

            {/* 시안 · 교육시스템 flow */}
            <h3 style={{ marginTop: 32, textAlign: 'center', fontSize: 17, fontWeight: 700 }}>창업반의 체계적인 교육시스템</h3>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 4, marginTop: 20 }}>
              {[
                { n: '01', l: '수업' },
                { n: '02', l: '원장시연' },
                { n: '03', l: '실습' },
                { n: '04', l: '피드백' },
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

            <h3 style={{ marginTop: 26, fontSize: 16, fontWeight: 700 }}>이런 분께 추천합니다</h3>
            <ul style={{ marginTop: 10, paddingLeft: 20, lineHeight: 1.8, color: '#241C19', fontSize: 15.5 }}>
              <li>반영구 전문가로 확실하게 자리 잡고 싶은 분</li>
              <li>기술 습득을 넘어 실제 창업까지 계획하고 있는 분</li>
              <li>단발성 수강이나 독학으로는 한계를 느낀 분</li>
              <li>창업 준비부터 사후 지원까지 든든하게 받고 싶은 분</li>
            </ul>

            <div style={{ marginTop: 22, padding: 16, background: '#14100F', color: '#F7EFE6', textAlign: 'center' }}>
              <div style={{ fontSize: 15 }}>수강료는 상담을 통해 안내드립니다</div>
            </div>

            <a className="btn-primary" href={`tel:${PHONE}`} style={{ marginTop: 14 }}>단기창업반 상담 신청 →</a>
          </div>
        </section>

        {/* 07 · Graduates' Work */}
        <section style={sectionBase}>
          <div style={wrap}>
            <div className="label-line" style={label}>07 · Graduates&apos; Work</div>
            <div style={{ fontSize: 15, color: '#D9945F', fontWeight: 700 }}>수강생 졸업작품</div>
            <h2 style={{ ...h2Serif, marginTop: 4 }}>아카데미 수강생 Gallery</h2>
            <p style={{ marginTop: 12, color: '#7A6C5D', fontSize: 15 }}>ARTBROWS ACADEMY를 수료한 수강생들의 실제 작품입니다.</p>
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
            <div style={{ marginTop: 14, fontSize: 11.5, color: '#B7A996', textAlign: 'center' }}>
              작품 이미지는 수강생 동의 후 순차 업데이트됩니다
            </div>
          </div>
        </section>

        {/* 08 · Location */}
        <section style={{ ...sectionBase, background: '#ECE0D2' }}>
          <div style={wrap}>
            <div className="label-line" style={label}>08 · Location</div>
            <h2 style={h2Serif}>찾아오시는 길</h2>
            <div style={{ marginTop: 20, padding: 20, background: '#F7EFE6', border: '1px solid rgba(20,16,15,0.12)' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#14100F' }}>ARTBROWS ACADEMY</div>
              <div style={{ marginTop: 8, fontSize: 15.5, color: '#241C19' }}>서울 강남구 봉은사로68길 55-3 2층</div>
              <div style={{ marginTop: 4, fontSize: 13, color: '#7A6C5D' }}>선릉역 · 삼성중앙역 인근</div>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href={NAVER_MAP} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 14px', background: '#14100F', color: '#F7EFE6', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                  네이버 지도에서 보기 →
                </a>
                <a href={KAKAO_MAP} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 14px', border: '1px solid #14100F', color: '#14100F', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                  카카오맵에서 보기 →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 09 · FAQ */}
        <section style={sectionBase}>
          <div style={wrap}>
            <div className="label-line" style={label}>09 · FAQ</div>
            <h2 style={h2Serif}>자주 묻는 질문</h2>
            <div style={{ marginTop: 22 }}>
              {[
                { q: '어떤 순서로 수강해야 하나요?', a: '이지클래스 → 극사실눈썹 소묘 3일 → 극사실눈썹 3일 집중수업 → 실전실습 순으로 진행하시는 것을 권장합니다. 이미 현직 경력이 있다면 심화반부터 바로 시작하실 수도 있습니다.' },
                { q: '재료비도 포함인가요?', a: '수강료에 재료비는 별도이며, 개인 재료 사용도 가능합니다.' },
                { q: '수업 일정은 어떻게 확인하나요?', a: '수업 일정은 매달 계획되어 전월에 스케줄이 공지됩니다. 정확한 다음 일정은 전화 또는 카카오채널로 문의해 주세요.' },
                { q: '경력이 없어도 창업반 수강이 가능한가요?', a: '네, 단기창업반은 이지클래스부터 실전실습까지 전 과정을 포함하고 있어 입문자도 창업까지 이어지는 커리큘럼을 밟으실 수 있습니다.' },
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
            <div className="label-line" style={{ ...label, justifyContent: 'center' }}>Start Now</div>
            <h2 style={{ ...h2Serif, fontSize: 26, color: '#F7EFE6', lineHeight: 1.5 }}>
              <em style={{ fontStyle: 'normal' }}>
                <span style={{ color: '#F7EFE6' }}>극사실눈썹 창시자</span><br />
                <span style={{ color: '#D9945F' }}>장미지의 아트브로우</span>에서 시작하세요.
              </em>
            </h2>
            <p style={{ marginTop: 14, color: '#B7A996', fontSize: 17 }}>
              궁금하신 부분이나 자세한 상담은 언제든 전화 또는 카카오채널로 안내해드리겠습니다.
            </p>
            <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a className="btn-primary" href={`tel:${PHONE}`}>전화 상담 · {PHONE}</a>
              <a className="btn-ghost" href={KAKAO_K1} target="_blank" rel="noopener noreferrer">카톡 K1 무료 강의방 →</a>
              <a className="btn-ghost" href={INSTA} target="_blank" rel="noopener noreferrer">@artbrows_academy 팔로우</a>
            </div>
            <div style={{ marginTop: 28, fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#7A6C5D', letterSpacing: '.06em' }}>
              서울 강남구 · 선릉역 · 삼성중앙역 인근
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: '#14100F', color: '#B7A996', padding: '32px 24px 40px', fontSize: 14, lineHeight: 1.8 }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{ padding: '5px 0' }}>
              <b style={{ color: '#F7EFE6', fontWeight: 500 }}>ARTBROWS ACADEMY</b> · 극사실눈썹전문 아카데미
            </div>
            <div style={{ padding: '5px 0' }}>서울 강남구 · 선릉역 · 삼성중앙역 인근</div>
            <div style={{ padding: '5px 0' }}>TEL {PHONE} · 인스타 @artbrows_academy</div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(247,239,230,0.18)', fontSize: 13, color: '#6b5c4f' }}>
              © ARTBROWS ACADEMY (주식회사 미지아카데미). All rights reserved.
            </div>
          </div>
        </footer>

        {/* Sticky Bottom Bar (시안 정본 · 전화 + 카카오 채널) */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, display: 'flex', background: '#14100F', borderTop: '1px solid rgba(247,239,230,0.18)' }}>
          <a href={`tel:${PHONE}`} style={{ flex: 1, textAlign: 'center', padding: '18px 10px', fontSize: 17, fontWeight: 700, background: '#B85C34', color: '#F7EFE6' }}>
            📞 전화 상담
          </a>
          <a href={KAKAO_CHANNEL} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', padding: '18px 10px', fontSize: 17, fontWeight: 700, background: '#F7EFE6', color: '#14100F' }}>
            💬 카카오 상담
          </a>
        </div>

      </main>
    </>
  );
}
