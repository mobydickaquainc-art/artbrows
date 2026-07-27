/**
 * /sophia · Sophia Brow (sophiabrow.com) 구조 클론 + ARTbrows 콘텐츠 오버레이
 * 2026-07-27 · 대표님 지시 「Sophia 구조 그대로 · 우리 장미지 아카데미 내용 덮어 씌워라」
 *
 * 참조 구조 (16 섹션):
 *  1. GNB · 소개·본원·포트폴리오·교육·상담
 *  2. Hero — ACADEMY 대헤드 + 배너
 *  3. Reservation CTA
 *  4. About — 원장 브랜드 인트로 (잔흔 복구 → 우리는 「패턴 X」로 오버레이)
 *  5. 4대 카테고리 그리드 (Sophia PMU 3열 → 우리 4열)
 *  6. Before/After 갤러리
 *  7. 도발적 훅 카피
 *  8. Location & 카톡 CTA (Sophia 4개 → 우리 선릉·삼성 4개)
 *  9. Founder Profile — 원장 자격증·SNS
 * 10. Academy Overview — 프로그램 카드 3장
 * 11. Why ARTbrows — 대기하는 이유
 * 12. Work Quality — 원장 기술력
 * 13. Advanced Technique — 상위 1% 극사실
 * 14. Correction — 잔흔 복구 Before/After
 * 15. Final CTA — 명품눈썹 대사
 * 16. Portfolio Gallery — 24장
 */

import Link from 'next/link';

const KAKAO_K1 = 'https://open.kakao.com/o/gWeAkSzi';
const INSTA = 'https://www.instagram.com/artbrows_academy/';

const HERO_MAIN = '/brand/hero-main-20260724.jpg';
const FOUNDER = '/brand/ai-generated/founder-persona/founder-03.png';
const FOUNDER_KV = '/brand/founder-key-visual-2026-07-17.png';

// 인스타 정본 카드뉴스 6장 (Sophia 갤러리 대체용 상단 배너)
const INSTA_CARDS = [
  '/brand/reference-cards-2026-07-24/01-cover-macroface.png',
  '/brand/reference-cards-2026-07-24/02-founder-lecture.png',
  '/brand/reference-cards-2026-07-24/03-question1-why.png',
  '/brand/reference-cards-2026-07-24/04-question2-sketch.png',
  '/brand/reference-cards-2026-07-24/05-question3-who.png',
  '/brand/reference-cards-2026-07-24/06-question4-how.png',
];

// 실 강의 다큐 8장 (포트폴리오 갤러리)
const CLASS_DOCS = [
  '/brand/class-documentary/KakaoTalk_20260724_191428055.jpg',
  '/brand/class-documentary/KakaoTalk_20260724_191617717_01.jpg',
  '/brand/class-documentary/KakaoTalk_20260724_191617717_02.jpg',
  '/brand/class-documentary/KakaoTalk_20260724_191617717_03.jpg',
  '/brand/class-documentary/KakaoTalk_20260724_191628747_01.jpg',
  '/brand/class-documentary/KakaoTalk_20260724_191628747_02.jpg',
  '/brand/class-documentary/KakaoTalk_20260724_191628747_03.jpg',
  '/brand/class-documentary/KakaoTalk_20260724_191628747_04.jpg',
];

// 4대 카테고리 이미지
const PILLARS = [
  { src: '/brand/ai-generated/macro/macro-01.png', title: '눈썹', en: 'BROW', tag: '극사실눈썹 창시자 정본' },
  { src: '/brand/ai-generated/hand-pencil/hand-01.png', title: '아이라인', en: 'EYELINE', tag: '2027-10 합법화 대비' },
  { src: '/brand/ai-generated/atelier/atelier-01.png', title: '입술', en: 'LIP', tag: '원장님 컬러 시그니처' },
  { src: '/brand/ai-generated/atelier/atelier-02.png', title: '헤어라인', en: 'HAIRLINE', tag: '결의 재현 · 자연스러움' },
];

export const metadata = {
  title: '장미지 ARTbrows · 극사실눈썹 창시자 아카데미',
  description: 'Sophia Brow 구조 참조 · 장미지 원장 · 극사실눈썹 창시자 · 선릉·삼성 본원',
};

export default function SophiaStylePage() {
  return (
    <main style={{ background: 'var(--bg-deep)', color: 'var(--text)', minHeight: '100vh' }}>

      {/* ═══ 1. HEADER GNB ═══ */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(46,35,25,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)' }}>
        <div style={wrap()}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '18px 0', gap: 20 }}>
            <Link href="/sophia" style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 26, fontWeight: 700, color: 'var(--gold-light)', textDecoration: 'none', letterSpacing: '-.01em' }}>
              장미지 <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, letterSpacing: '.24em', color: 'var(--gold)', fontWeight: 500, marginLeft: 8, textTransform: 'uppercase' }}>ARTBROWS</span>
            </Link>
            <nav style={{ display: 'flex', gap: 22, marginLeft: 'auto' }}>
              <a href="#about" style={gnbLink()}>소개</a>
              <a href="#location" style={gnbLink()}>선릉·삼성 본원</a>
              <a href="#portfolio" style={gnbLink()}>포트폴리오</a>
              <a href="#academy" style={gnbLink()}>교육</a>
              <a href="#consult" style={gnbLink()}>상담</a>
            </nav>
            <a href={KAKAO_K1} target="_blank" rel="noopener noreferrer"
              style={{ marginLeft: 14, padding: '11px 22px', background: 'var(--gold)', color: 'var(--bg-deep)', fontWeight: 700, fontSize: 13, letterSpacing: '.08em', textDecoration: 'none', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
              카톡 상담
            </a>
          </div>
        </div>
      </header>

      {/* ═══ 2. HERO — ACADEMY 대헤드 ═══ */}
      <section style={{ padding: '90px 0 100px', background: 'linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-card) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={wrap()}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={eyebrow()}>Since 2005 · Seonleung × Samseong</div>
            <h1 className="serif" style={{ fontSize: 88, fontWeight: 300, color: 'var(--text)', lineHeight: 1.05, letterSpacing: '-.02em', marginBottom: 24 }}>
              Academy
            </h1>
            <p style={{ fontSize: 20, color: 'var(--text-soft)', maxWidth: 780, margin: '0 auto', lineHeight: 1.75 }}>
              장미지 아카데미 · 극사실눈썹 마스터 과정을 수료한 모든 졸업생에게 · 매출로 이어질 수밖에 없는 <b style={{ color: 'var(--gold-light)' }}>창업 브랜딩 · 카톡 마케팅 · 인스타 자동화</b>까지 제공합니다.
            </p>
            <div style={{ marginTop: 34, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#academy" style={ctaPrimary()}>더 알아보기 →</a>
              <a href={KAKAO_K1} target="_blank" rel="noopener noreferrer" style={ctaGhost()}>카톡 상담</a>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, aspectRatio: '2/1', maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ overflow: 'hidden', border: '1px solid var(--line)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_MAIN} alt="원장님 강의 시연" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 62%' }} />
            </div>
            <div style={{ overflow: 'hidden', border: '1px solid var(--line)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={FOUNDER} alt="장미지 원장 페르소나" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. RESERVATION STRIP ═══ */}
      <div style={{ background: 'var(--bg-card2)', borderTop: '1px solid var(--gold-deep)', borderBottom: '1px solid var(--gold-deep)', padding: '22px 0' }}>
        <div style={{ ...wrap(), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, letterSpacing: '.4em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600 }}>강의 캘린더</span>
          <span className="serif" style={{ fontSize: 22, color: 'var(--text)', fontWeight: 300 }}>
            8월 15기 창업반 · 이지반 · 소묘 3일 집중 <b style={{ color: 'var(--gold-light)' }}>모집 중</b>
          </span>
          <a href={KAKAO_K1} target="_blank" rel="noopener noreferrer" style={ctaGhost()}>예약 상황 보러가기 →</a>
        </div>
      </div>

      {/* ═══ 4. ABOUT — 원장 브랜드 인트로 ═══ */}
      <section id="about" style={{ padding: '100px 0', background: 'var(--bg-deep)' }}>
        <div style={wrap()}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'center' }}>
            <div style={{ overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '3/4' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={FOUNDER_KV} alt="장미지 원장" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={eyebrow()}>ABOUT · 창시자</div>
              <h2 className="serif" style={{ fontSize: 56, fontWeight: 300, color: 'var(--text)', lineHeight: 1.15, marginBottom: 24, letterSpacing: '-.015em' }}>
                Miji Jang
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-soft)', lineHeight: 1.85, marginBottom: 18 }}>
                최근 잘못된 패턴 스탬프 반영구로 붉고 어색한 눈썹이 남은 경우가 많습니다. 저희를 찾는 분들 중 <b style={{ color: 'var(--gold-light)' }}>10명 중 6명 이상</b>이 「극사실로 자연스럽게 다시 그려주세요」라며 방문하십니다.
              </p>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.85 }}>
                20년+ 시술 · 8,000건+ 케이스 · 900여명 수강생 배출. 국내 유일 <b style={{ color: 'var(--gold)' }}>극사실눈썹 특허 3장</b> (기법·상표·머신 특허 10-2863985) 보유. 경력 5~10년차 원장님들도 스킬업 재교육을 받으러 오는 <b style={{ color: 'var(--gold-light)' }}>정본 방법론의 원본</b>입니다.
              </p>
              <div style={{ marginTop: 26, display: 'flex', gap: 22, flexWrap: 'wrap' }}>
                {[
                  { n: '20', u: '년+', l: '창시자 경력' },
                  { n: '8,000', u: '+', l: '누적 시술' },
                  { n: '900', u: '+', l: '누적 수강생' },
                  { n: '3', u: '장', l: '특허 · 상표 · 기법' },
                ].map((s, i) => (
                  <div key={i} style={{ minWidth: 88 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                      <span className="serif" style={{ fontSize: 34, color: 'var(--gold-light)', fontWeight: 300, lineHeight: 1 }}>{s.n}</span>
                      <span className="serif" style={{ fontSize: 16, color: 'var(--gold)' }}>{s.u}</span>
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.28em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: 6 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. 4대 카테고리 (PMU) ═══ */}
      <section id="portfolio" style={{ padding: '100px 0', background: 'var(--bg-card)' }}>
        <div style={wrap()}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={eyebrow()}>HYPERREAL · 4대 카테고리</div>
            <h2 className="serif" style={{ fontSize: 56, fontWeight: 300, color: 'var(--text)', lineHeight: 1.15, letterSpacing: '-.015em' }}>Hyperreal</h2>
            <p style={{ fontSize: 17, color: 'var(--text-soft)', maxWidth: 720, margin: '18px auto 0', lineHeight: 1.75 }}>
              장미지 아카데미는 <b style={{ color: 'var(--gold-light)' }}>선릉·삼성 본원</b>에서 모든 카테고리에 동일한 극사실 방법론을 적용합니다. 「진짜 머리카락·진짜 눈썹·그 사람 원래 입술」의 결을 그대로 재현합니다.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {PILLARS.map((p, i) => (
              <div key={i} style={{ background: 'var(--bg-deep)', border: '1px solid var(--line)', overflow: 'hidden', transition: 'transform .25s' }}>
                <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.05)' }} />
                </div>
                <div style={{ padding: '20px 20px 22px' }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.28em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>{p.en}</div>
                  <h3 className="serif" style={{ fontSize: 24, color: 'var(--gold-light)', fontWeight: 700, marginBottom: 6, letterSpacing: '-.005em' }}>{p.title}</h3>
                  <p style={{ fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.6 }}>{p.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. BEFORE/AFTER — 인스타 정본 6장 ═══ */}
      <section style={{ padding: '80px 0', background: 'var(--bg-deep)' }}>
        <div style={wrap()}>
          <div style={{ marginBottom: 30 }}>
            <div style={eyebrow()}>@artbrows_academy · Instagram</div>
            <h2 className="serif" style={{ fontSize: 40, color: 'var(--text)', fontWeight: 300, letterSpacing: '-.005em' }}>
              Correction · 잘못된 반영구, 극사실로 다시.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {INSTA_CARDS.map((src, i) => (
              <div key={i} style={{ aspectRatio: '1/1', overflow: 'hidden', border: '1px solid var(--line-soft)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`인스타 정본 ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.03)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. 브랜드 도발 훅 ═══ */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-card2) 100%)', textAlign: 'center' }}>
        <div style={wrap()}>
          <h2 className="serif" style={{ fontSize: 64, fontWeight: 300, color: 'var(--gold-light)', lineHeight: 1.2, letterSpacing: '-.015em', maxWidth: 1000, margin: '0 auto' }}>
            극사실눈썹 창시자를 모른다면 <br /><b style={{ color: 'var(--text)', fontWeight: 700 }}>반영구를 배우지 마세요.</b>
          </h2>
          <div style={{ marginTop: 34 }}>
            <a href={INSTA} target="_blank" rel="noopener noreferrer" style={{ ...ctaGhost(), fontSize: 12, padding: '14px 30px' }}>
              @artbrows_academy 팔로우 →
            </a>
          </div>
        </div>
      </section>

      {/* ═══ 8. LOCATION & 카톡 CTA ═══ */}
      <section id="location" style={{ padding: '100px 0', background: 'var(--bg-card)' }}>
        <div style={wrap()}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={eyebrow()}>LOCATION · 오시는 길</div>
            <h2 className="serif" style={{ fontSize: 44, color: 'var(--text)', fontWeight: 300 }}>선릉 본원 <span style={{ color: 'var(--muted)' }}>|</span> 삼성 본원</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {[
              { name: '선릉 본원', addr: '서울 강남구 · 선릉 · 봉은사 인근', kk1: '선릉 수강 문의', kk2: '선릉 시술 문의' },
              { name: '삼성 본원', addr: '서울 강남구 · 삼성 · 대치 사이', kk1: '삼성 수강 문의', kk2: '삼성 시술 문의' },
            ].map((loc, i) => (
              <div key={i} style={{ padding: '36px 32px', background: 'var(--bg-deep)', border: '1px solid var(--line)' }}>
                <h3 className="serif" style={{ fontSize: 28, color: 'var(--gold-light)', fontWeight: 700, marginBottom: 8, letterSpacing: '-.005em' }}>{loc.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-soft)', marginBottom: 24 }}>{loc.addr}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a href={KAKAO_K1} target="_blank" rel="noopener noreferrer" style={{ ...ctaPrimary(), fontSize: 12, padding: '11px 20px', flex: '1 1 45%', textAlign: 'center' }}>{loc.kk1}</a>
                  <a href={KAKAO_K1} target="_blank" rel="noopener noreferrer" style={{ ...ctaGhost(), fontSize: 12, padding: '11px 20px', flex: '1 1 45%', textAlign: 'center' }}>{loc.kk2}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. FOUNDER PROFILE ═══ */}
      <section style={{ padding: '100px 0', background: 'var(--bg-deep)' }}>
        <div style={wrap()}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'center' }}>
            <div style={{ overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '3/4' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={FOUNDER} alt="장미지 원장" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.08)' }} />
            </div>
            <div>
              <div style={eyebrow()}>Founder · 대표원장</div>
              <h2 className="serif" style={{ fontSize: 42, color: 'var(--text)', fontWeight: 300, letterSpacing: '-.01em', lineHeight: 1.25, marginBottom: 20 }}>
                「눈썹여왕」이라 불리는 <br /><b style={{ color: 'var(--gold-light)', fontWeight: 700 }}>장미지 대표원장</b>
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-soft)', lineHeight: 1.85, marginBottom: 26 }}>
                국내 반영구 시장을 <b style={{ color: 'var(--gold-light)' }}>「극사실눈썹」이라는 새 표준</b>으로 재정의한 창시자. 5~10년차 원장님들도 스킬업 재교육을 받으러 오는 <b style={{ color: 'var(--gold)' }}>정본 방법론의 원본</b>입니다.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 30 }}>
                {[
                  '장미지 ARTbrows 아카데미 총괄 대표원장',
                  '「극사실눈썹」 기법 · 상표 · 머신 특허 3장 (특허 10-2863985)',
                  '누적 시술 8,000+ 케이스 · 900+ 수강생 · 창업 수백여명 배출',
                  '2027-10 반영구 준합법화 대비 국내 유일 표준 방법론',
                ].map((c, i) => (
                  <li key={i} style={{ padding: '10px 0', borderBottom: '1px dashed var(--line)', color: 'var(--text)', fontSize: 14, display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 12 }}>0{i + 1}</span>{c}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 16 }}>
                <a href={INSTA} target="_blank" rel="noopener noreferrer" style={socialLink()}>Instagram → @artbrows_academy</a>
                <a href={KAKAO_K1} target="_blank" rel="noopener noreferrer" style={socialLink()}>Kakao K1 → 무료 강의방</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 10. ACADEMY OVERVIEW ═══ */}
      <section id="academy" style={{ padding: '100px 0', background: 'var(--bg-card)' }}>
        <div style={wrap()}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={eyebrow()}>ACADEMY · 프로그램</div>
            <h2 className="serif" style={{ fontSize: 44, color: 'var(--text)', fontWeight: 300, letterSpacing: '-.01em', lineHeight: 1.25 }}>
              경력직 원장님들도 다시 찾는 <br /><b style={{ color: 'var(--gold-light)', fontWeight: 700 }}>장미지 아카데미</b>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-soft)', maxWidth: 720, margin: '18px auto 0', lineHeight: 1.75 }}>
              극사실을 배운 후 <b style={{ color: 'var(--gold-light)' }}>월 수천만 원~억대 매출</b>도 가능합니다. 교육만 제공하지 않고 <b style={{ color: 'var(--gold-light)' }}>「제2의 장미지」</b>를 만드는 창업·브랜딩·마케팅까지 함께합니다.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { tag: '창업반 15기 · 890만', title: '반영구 창업 마스터', desc: '소묘 3회 + 눈썹 5회 + 창업 브랜딩 · 8월 개강' },
              { tag: '이지반 15기 · 69만', title: '이지클래스 · 입문 3주', desc: '토·일·월 3반 · 재직자 프리미엄 입문' },
              { tag: '극사실 169만', title: '극사실눈썹 특화', desc: '원장 직강 · 결의 재현 원리 · 실전 케이스' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '30px 26px 32px', background: 'var(--bg-deep)', border: '1px solid var(--line)' }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '.24em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 14 }}>{p.tag}</div>
                <h3 className="serif" style={{ fontSize: 24, color: 'var(--gold-light)', fontWeight: 700, letterSpacing: '-.005em', lineHeight: 1.35, marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-soft)', lineHeight: 1.75 }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <span style={{ display: 'inline-block', padding: '14px 26px', background: 'rgba(224,192,136,.10)', border: '1px solid var(--gold-deep)', fontFamily: 'Inter, sans-serif', fontSize: 12, letterSpacing: '.28em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 700 }}>
              올해 500+ 경력직 원장 재교육 신청
            </span>
          </div>
        </div>
      </section>

      {/* ═══ 11. WHY ARTbrows · 대기 이유 ═══ */}
      <section style={{ padding: '100px 0', background: 'var(--bg-deep)' }}>
        <div style={{ ...wrap(), maxWidth: 900, textAlign: 'center' }}>
          <div style={eyebrow()}>WHY · 왜 대기하면서까지 찾는가</div>
          <h2 className="serif" style={{ fontSize: 44, fontWeight: 300, color: 'var(--text)', lineHeight: 1.3, letterSpacing: '-.01em', marginBottom: 26 }}>
            <b style={{ color: 'var(--gold-light)', fontWeight: 700 }}>1~2개월 대기</b>하면서까지 <br />왜 장미지 원장님을 찾을까요?
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-soft)', lineHeight: 1.9 }}>
            머신으로 <b style={{ color: 'var(--gold-light)' }}>한 올 한 올 그려내는 극사실 기법</b>은, 일반 자연눈썹 기법과 자연스러움에서 <b style={{ color: 'var(--gold-light)' }}>결정적 차이</b>가 있습니다. 진짜 눈썹과 구별되지 않는 이유는, 「털의 결」 자체를 관찰해 재현하기 때문입니다.
          </p>
          <a href="#academy" style={{ ...ctaGhost(), display: 'inline-block', marginTop: 30 }}>
            다른 곳보다 결이 얇을 수밖에 없는 이유? →
          </a>
        </div>
      </section>

      {/* ═══ 12. WORK QUALITY ═══ */}
      <section style={{ padding: '100px 0', background: 'var(--bg-card)' }}>
        <div style={wrap()}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div style={eyebrow()}>QUALITY · 기술력</div>
              <h2 className="serif" style={{ fontSize: 44, color: 'var(--text)', fontWeight: 300, letterSpacing: '-.01em', lineHeight: 1.3, marginBottom: 20 }}>
                작업 직후에도 <br /><b style={{ color: 'var(--gold-light)', fontWeight: 700 }}>진하지 않은 자연스러움</b>
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-soft)', lineHeight: 1.85 }}>
                지난 1·2월에만 <b style={{ color: 'var(--gold-light)' }}>168명의 경력직 원장</b>께 스킬업 교육을 제공했습니다. 20년+ 경력이 오래되었다고 저절로 가능한 기법이 아닙니다. <b style={{ color: 'var(--gold)' }}>매일 스케치를 반복하고 결의 흐름을 다시 관찰</b>해야 도달합니다.
              </p>
              <a href="#academy" style={{ ...ctaGhost(), display: 'inline-block', marginTop: 24 }}>
                원장님은 매일 이렇게 연습합니다 →
              </a>
            </div>
            <div style={{ overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '4/5' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CLASS_DOCS[2]} alt="원장 강의 · 자세 교정" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.06)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 13. ADVANCED TECHNIQUE ═══ */}
      <section style={{ padding: '100px 0', background: 'var(--bg-deep)' }}>
        <div style={{ ...wrap(), maxWidth: 900, textAlign: 'center' }}>
          <div style={eyebrow()}>TECHNIQUE · 상위 1%</div>
          <h2 className="serif" style={{ fontSize: 44, color: 'var(--text)', fontWeight: 300, letterSpacing: '-.01em', lineHeight: 1.3, marginBottom: 22 }}>
            상위 <b style={{ color: 'var(--gold-light)', fontWeight: 700 }}>1% 작업자</b>만 가능하다는 <br />극사실 헤어스트록 기법
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-soft)', lineHeight: 1.85 }}>
            장미지 원장님을 찾는 방문자 중 <b style={{ color: 'var(--gold-light)' }}>50% 이상이 잘못된 반영구 복구</b>를 위해 내원하십니다. 올해 <b style={{ color: 'var(--gold-light)' }}>500명 이상의 현직 원장</b>이 잔흔 제거·극사실 재교육을 신청하셨습니다.
          </p>
          <a href={KAKAO_K1} target="_blank" rel="noopener noreferrer" style={{ ...ctaGhost(), display: 'inline-block', marginTop: 30 }}>
            역대 최고 잔흔 개선 사례 보러 가기 →
          </a>
        </div>
      </section>

      {/* ═══ 14. CORRECTION · 8장 다큐 갤러리 ═══ */}
      <section style={{ padding: '80px 0', background: 'var(--bg-card)' }}>
        <div style={wrap()}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={eyebrow()}>Live Class · 선릉 본원</div>
            <h2 className="serif" style={{ fontSize: 40, color: 'var(--text)', fontWeight: 300, letterSpacing: '-.005em' }}>
              현장 다큐멘터리
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '230px', gap: 10 }}>
            {CLASS_DOCS.map((src, i) => (
              <div key={i} style={{
                overflow: 'hidden',
                background: 'var(--bg-deep)',
                border: '1px solid var(--line-soft)',
                gridColumn: i === 0 ? 'span 2' : 'span 1',
                gridRow: i === 0 ? 'span 2' : 'span 1',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`강의 현장 ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.04)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 15. FINAL CTA ═══ */}
      <section id="consult" style={{ padding: '110px 0', background: 'linear-gradient(180deg, var(--bg-deep) 0%, #0F0C0A 100%)', textAlign: 'center' }}>
        <div style={wrap()}>
          <h2 className="serif" style={{ fontSize: 60, fontWeight: 300, color: 'var(--gold-light)', lineHeight: 1.2, letterSpacing: '-.015em', maxWidth: 1000, margin: '0 auto 30px' }}>
            장미지 아카데미에서 배우면 <br /><b style={{ color: 'var(--text)', fontWeight: 700 }}>평생의 기술이 됩니다.</b>
          </h2>
          <div style={{ marginTop: 30, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={KAKAO_K1} target="_blank" rel="noopener noreferrer" style={{ ...ctaPrimary(), fontSize: 14, padding: '16px 34px' }}>카톡 K1 · 무료 강의방 →</a>
            <a href="#academy" style={{ ...ctaGhost(), fontSize: 14, padding: '16px 34px' }}>커리큘럼 보러 가기</a>
          </div>
        </div>
      </section>

      {/* ═══ 16. FOOTER ═══ */}
      <footer style={{ padding: '46px 0 60px', background: '#0A0806', borderTop: '1px solid var(--line-soft)' }}>
        <div style={{ ...wrap(), display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 260px' }}>
            <div style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 22, fontWeight: 700, color: 'var(--gold-light)', letterSpacing: '-.01em' }}>
              장미지 <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, letterSpacing: '.24em', color: 'var(--gold)', fontWeight: 500, marginLeft: 8, textTransform: 'uppercase' }}>ARTBROWS</span>
            </div>
            <p style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
              극사실눈썹 창시자 장미지 · 선릉·삼성 본원 · 2005~ · 극사실은 상표·기법·머신 3장 특허 등록
            </p>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ ...eyebrow(), fontSize: 10, marginBottom: 12 }}>Locations</div>
            <p style={{ fontSize: 13, color: 'var(--text-soft)', margin: '4px 0' }}>선릉 본원 · 강남구 선릉</p>
            <p style={{ fontSize: 13, color: 'var(--text-soft)', margin: '4px 0' }}>삼성 본원 · 강남구 삼성</p>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ ...eyebrow(), fontSize: 10, marginBottom: 12 }}>Social</div>
            <a href={INSTA} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: 13, color: 'var(--text-soft)', textDecoration: 'none', margin: '4px 0' }}>@artbrows_academy</a>
            <a href={KAKAO_K1} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: 13, color: 'var(--text-soft)', textDecoration: 'none', margin: '4px 0' }}>Kakao K1 무료 강의방</a>
          </div>
        </div>
      </footer>

    </main>
  );
}

// ─── style helpers ───
function wrap(): React.CSSProperties {
  return { maxWidth: 1280, margin: '0 auto', padding: '0 28px' };
}
function eyebrow(): React.CSSProperties {
  return { fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '.45em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 };
}
function gnbLink(): React.CSSProperties {
  return { fontFamily: '"Nanum Myeongjo", serif', fontSize: 15, color: 'var(--text-soft)', textDecoration: 'none', letterSpacing: '.02em', transition: 'color .15s' };
}
function ctaPrimary(): React.CSSProperties {
  return { display: 'inline-block', padding: '14px 30px', background: 'var(--gold)', color: 'var(--bg-deep)', fontFamily: 'Inter, sans-serif', fontSize: 12, letterSpacing: '.16em', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase' };
}
function ctaGhost(): React.CSSProperties {
  return { display: 'inline-block', padding: '14px 30px', background: 'transparent', border: '1px solid var(--gold-deep)', color: 'var(--gold-light)', fontFamily: 'Inter, sans-serif', fontSize: 12, letterSpacing: '.16em', fontWeight: 600, textDecoration: 'none', textTransform: 'uppercase' };
}
function socialLink(): React.CSSProperties {
  return { fontFamily: 'Inter, sans-serif', fontSize: 12, letterSpacing: '.12em', color: 'var(--text-soft)', textDecoration: 'none', padding: '10px 16px', border: '1px solid var(--line)', transition: 'all .15s' };
}
