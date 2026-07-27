import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2026-07-22 검토 패키지 · ARTbrows',
  description: '오늘 하루 산출물 통합 검토 페이지 · 영상 4편 · 카드뉴스 3세트 · 신규 페르소나 · 홈피 stats 업데이트',
};

const PALETTE = {
  bg: '#0A0806', card: '#141110', line: '#2A231D',
  gold: '#C9A66B', goldSft: '#E8C9AE', cream: '#F4E5D2',
  text: '#E6DCCE', muted: '#8A7F73',
};

const BASE = 'https://ant-football-assume-lauderdale.trycloudflare.com';

const VIDEOS = [
  { key: 'process',    title: '시술 과정 매크로',       desc: '카메라 slow push-in · 펜 진입 · 눈썹결 형성 (5초)',    file: 'treatment-process-01.mp4',   theme: '기본' },
  { key: 'founder',    title: '창업반 · 원장 마스터',    desc: '아틀리에 · 원장 페르소나 · 펜슬 설계 시그니처 (5초)',  file: 'changupbaan-founder-01.mp4', theme: '창업반 890' },
  { key: 'easy',       title: '이지 · 완성 후 웃음',    desc: '수강생 미소 · 완성된 눈썹 자연스러운 감동 (5초)',      file: 'easy-class-01.mp4',          theme: '이지 69' },
  { key: 'hyperreal',  title: '극사실 · 결의 형성',     desc: '얼굴 X · 눈썹결 하나씩 razor sharp 형성 (5초)',        file: 'hyperreal-macro-01.mp4',     theme: '극사실 169' },
];

const CARDNEWS = [
  { id: '2026-07-20-changupbaan-15th', title: '창업반 890 · 마스터 시그니처', slides: 8 },
  { id: '2026-07-20-easy-class-15th',  title: '이지 69 · 웰컴 톤',           slides: 6 },
  { id: '2026-07-20-hyperreal-brow-15th', title: '극사실 169 · 기술 톤',      slides: 9 },
];

const PERSONAS = [
  { key: 'founder-01', label: '원장 페르소나 01 · 마스터 아우라' },
  { key: 'founder-02', label: '원장 페르소나 02 · 프로필' },
  { key: 'founder-03', label: '원장 페르소나 03 · 아틀리에' },
  { key: 'client-01',  label: '수강생 01 · 20s 클로즈업' },
  { key: 'client-02',  label: '수강생 02 · 시술 순간' },
  { key: 'client-03',  label: '수강생 03 · 신뢰' },
  { key: 'client-04',  label: '수강생 04 · 완성' },
];

const CHANGES = [
  { title: '홈피 stats 정본 정확화', detail: '「누적 시술 5,000+」 → 「8,000+」 (2026-06 정본 PDF 기준)', tag: 'FACT' },
  { title: '「In-the-softness」 이미지 제거', detail: '다른 학원 원장 이미지 · SAFE POOL 및 카드뉴스 참조 완전 제거 · 격리 폴더 이동', tag: 'SAFETY' },
  { title: '창업반 첫 페이지 → 원장 페르소나', detail: 'founder-01 배치 · 마스터 아우라 · 얼굴 부분 그림자 (안전)', tag: 'BRAND' },
  { title: '이지 첫 페이지 → 수강생 페르소나', detail: 'client-01 배치 · 웰컴 톤 · 친근', tag: 'BRAND' },
  { title: '극사실 첫 페이지 → 매크로 macro-02', detail: '기술 톤 · 첫 임팩트', tag: 'BRAND' },
  { title: '3세트 완전 차별화', detail: '더 이상 「3개 모두 같은 이미지」 아님 · 테마별 정체성', tag: 'BRAND' },
  { title: 'Higgsfield 영상 4편 신규', detail: '9:16 인스타 릴스 규격 · 720p · 5초 × 4편 · 총 55 크레딧', tag: 'ASSET' },
  { title: 'AI 재가공 기능 · 편집기 A', detail: '「🎨 AI 재가공」 버튼 · 6 프리셋 (익명화 · 실루엣 · 뒷모습 · 일러스트 · 아트 · 자유)', tag: 'FEATURE' },
];

function Section({ title, children, kicker }: { title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 80 }}>
      {kicker ? (
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.4em', color: PALETTE.gold, textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>
          {kicker}
        </div>
      ) : null}
      <h2 style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 32, fontWeight: 300, marginBottom: 30, color: PALETTE.cream, letterSpacing: '-.01em' }}>{title}</h2>
      {children}
    </section>
  );
}

function Chip({ text, color = PALETTE.gold }: { text: string; color?: string }) {
  return (
    <span style={{ padding: '3px 10px', fontSize: 9.5, letterSpacing: '.24em', color, borderWidth: 1, borderStyle: 'solid', borderColor: color, borderRadius: 3, fontFamily: 'Inter, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>{text}</span>
  );
}

export default function Review20260722() {
  return (
    <div style={{ background: PALETTE.bg, minHeight: '100vh', color: PALETTE.text, fontFamily: '"Noto Sans KR", sans-serif' }}>
      <header style={{ borderBottom: `1px solid ${PALETTE.line}`, padding: '80px 40px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '.4em', color: PALETTE.gold, textTransform: 'uppercase', marginBottom: 22, fontWeight: 700 }}>
              ARTbrows · Executive Review · 2026-07-22
            </div>
            <h1 style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 56, fontWeight: 300, lineHeight: 1.15, marginBottom: 20 }}>
              오늘의 <span style={{ color: PALETTE.gold, fontWeight: 700 }}>산출물</span>
            </h1>
            <p style={{ color: PALETTE.muted, fontSize: 14, lineHeight: 1.85, maxWidth: 680 }}>
              대표님·원장님·본부장 검토용 · 2026-07-22 하루 산출물 통합.<br />
              <b style={{ color: PALETTE.goldSft }}>Higgsfield 영상 4편</b> · <b style={{ color: PALETTE.goldSft }}>신규 페르소나 7장</b> · <b style={{ color: PALETTE.goldSft }}>카드뉴스 3세트 완전 차별화</b> · <b style={{ color: PALETTE.goldSft }}>PDF 정본 반영 (8,000+ 시술)</b>
            </p>
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.28em', color: PALETTE.muted, textTransform: 'uppercase' }}>
            <div>DATE · 2026-07-22</div>
            <div style={{ marginTop: 4 }}>ASSETS · 4 VIDEOS + 22 IMAGES</div>
            <div style={{ marginTop: 4 }}>CREDITS · 65 USED · 585 LEFT</div>
            <Link href="/" style={{ display: 'inline-block', marginTop: 20, padding: '8px 18px', borderWidth: 1, borderStyle: 'solid', borderColor: PALETTE.gold, color: PALETTE.gold, textDecoration: 'none', fontSize: 10, letterSpacing: '.3em' }}>
              ← HOME
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 40px 100px' }}>
        {/* 영상 4편 */}
        <Section kicker="Higgsfield Video · 4 films · 9:16 · 720p" title="🎬 시술 스토리 영상 4편">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {VIDEOS.map((v) => (
              <div key={v.key} style={{ padding: 16, background: PALETTE.card, borderWidth: 1, borderStyle: 'solid', borderColor: PALETTE.line, borderRadius: 4 }}>
                <video src={`/brand/ai-generated/video/${v.file}`} controls preload="metadata" playsInline
                  style={{ width: '100%', aspectRatio: '9/16', background: '#000', borderRadius: 3 }} />
                <div style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Chip text={v.theme} />
                </div>
                <div style={{ marginTop: 8, fontFamily: '"Nanum Myeongjo", serif', fontSize: 15, fontWeight: 500, color: PALETTE.cream }}>{v.title}</div>
                <div style={{ fontSize: 11.5, color: PALETTE.muted, marginTop: 5, lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 카드뉴스 3세트 */}
        <Section kicker="Cardnews · 3 sets · fully differentiated" title="📰 카드뉴스 3세트 · 테마별 정체성">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {CARDNEWS.map((c) => (
              <a key={c.id} href={`/cardnews/view/${c.id}`} target="_blank" rel="noreferrer"
                style={{ padding: 22, background: PALETTE.card, borderTop: `2px solid ${PALETTE.gold}`, borderWidth: 1, borderStyle: 'solid', borderColor: PALETTE.line, borderRadius: 3, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10.5, letterSpacing: '.28em', color: PALETTE.muted, textTransform: 'uppercase', marginBottom: 8 }}>
                  {c.slides} SLIDES
                </div>
                <div style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 18, fontWeight: 500, color: PALETTE.cream, lineHeight: 1.4 }}>{c.title}</div>
                <div style={{ marginTop: 14, fontSize: 10, letterSpacing: '.28em', color: PALETTE.gold, fontFamily: 'Inter, sans-serif' }}>미리보기 →</div>
              </a>
            ))}
          </div>
        </Section>

        {/* 신규 페르소나 */}
        <Section kicker="Higgsfield · new personas · face-safe" title="👤 신규 인물 페르소나 7장">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
            {PERSONAS.map((p) => {
              const cat = p.key.startsWith('founder') ? 'founder-persona' : 'client';
              return (
                <a key={p.key} href={`/brand/ai-generated/${cat}/${p.key}.png`} target="_blank" rel="noreferrer"
                  style={{ display: 'block', textDecoration: 'none' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/brand/ai-generated/${cat}/${p.key}.png`} alt={p.label}
                    style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', background: '#000', borderRadius: 2, borderWidth: 1, borderStyle: 'solid', borderColor: PALETTE.line }} />
                  <div style={{ marginTop: 6, fontSize: 10.5, color: PALETTE.text, lineHeight: 1.4 }}>{p.label}</div>
                </a>
              );
            })}
          </div>
        </Section>

        {/* 변경/추가 목록 */}
        <Section kicker="Change Log" title="📋 오늘의 변경·추가 8건">
          <div style={{ display: 'grid', gap: 12 }}>
            {CHANGES.map((c, i) => (
              <div key={i} style={{ padding: 16, background: PALETTE.card, borderLeft: `3px solid ${c.tag === 'SAFETY' ? '#B08862' : c.tag === 'FACT' ? PALETTE.gold : c.tag === 'BRAND' ? PALETTE.goldSft : c.tag === 'ASSET' ? '#C9A66B' : '#6A8F6C'}`, borderWidth: 1, borderStyle: 'solid', borderColor: PALETTE.line, borderRadius: 3 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                  <Chip text={c.tag} color={c.tag === 'SAFETY' ? '#B08862' : PALETTE.gold} />
                  <div style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 16, fontWeight: 500, color: PALETTE.cream }}>{c.title}</div>
                </div>
                <div style={{ fontSize: 12.5, color: PALETTE.text, lineHeight: 1.7, paddingLeft: 2 }}>{c.detail}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* PDF 정본 발견 */}
        <Section kicker="Verified from PDF" title="📄 아트브로우아카데미소개.pdf · 정본 팩트">
          <div style={{ padding: 24, background: PALETTE.card, borderWidth: 1, borderStyle: 'solid', borderColor: PALETTE.line, borderRadius: 4 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              <div><div style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 36, color: PALETTE.gold, fontWeight: 300 }}>8,000<span style={{ fontSize: 22 }}>+</span></div><div style={{ fontSize: 11.5, color: PALETTE.muted, marginTop: 4 }}>누적 시술 (2026-06 정본)</div></div>
              <div><div style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 36, color: PALETTE.gold, fontWeight: 300 }}>4.5<span style={{ fontSize: 22 }}>★</span></div><div style={{ fontSize: 11.5, color: PALETTE.muted, marginTop: 4 }}>수강 만족도 (2026-05)</div></div>
              <div><div style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 36, color: PALETTE.gold, fontWeight: 300 }}>890<span style={{ fontSize: 22 }}>만</span></div><div style={{ fontSize: 11.5, color: PALETTE.muted, marginTop: 4 }}>창업반 · 6+6 무제한 실습</div></div>
              <div><div style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 36, color: PALETTE.gold, fontWeight: 300 }}>199<span style={{ fontSize: 22 }}>만</span></div><div style={{ fontSize: 11.5, color: PALETTE.muted, marginTop: 4 }}>패키지 (소묘 + 눈썹)</div></div>
            </div>
            <div style={{ marginTop: 24, fontSize: 12, color: PALETTE.muted, lineHeight: 1.75, borderTop: `1px solid ${PALETTE.line}`, paddingTop: 16 }}>
              PDF 정본 발견 후 홈피 stats <s style={{ color: PALETTE.muted }}>5,000+</s> → <b style={{ color: PALETTE.goldSft }}>8,000+</b> 즉시 반영.
            </div>
          </div>
        </Section>

        {/* 관련 링크 */}
        <Section kicker="Live URLs" title="🔗 관련 라이브 링크">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { t: '🏠 홈피 (8,000+ 반영)', u: '/' },
              { t: '📸 카드뉴스 Wizard', u: '/cardnews/from-images' },
              { t: '✏️ 편집기 A (AI 재가공 포함)', u: '/cardnews/edit/2026-07-20-changupbaan-15th' },
              { t: '📋 어제 회의록 (07-20)', u: '/meetings/2026-07-20' },
              { t: '📚 원장 방법론', u: '/academy/methodology' },
            ].map((l) => (
              <a key={l.u} href={l.u} target="_blank" rel="noreferrer"
                style={{ padding: '10px 18px', borderWidth: 1, borderStyle: 'solid', borderColor: PALETTE.line, color: PALETTE.text, textDecoration: 'none', fontSize: 12, fontFamily: 'Inter, sans-serif', letterSpacing: '.14em', borderRadius: 3 }}>
                {l.t} →
              </a>
            ))}
          </div>
        </Section>
      </main>

      <footer style={{ borderTop: `1px solid ${PALETTE.line}`, padding: '30px 40px', maxWidth: 1200, margin: '0 auto', fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.28em', color: PALETTE.muted, textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>ARTbrows · 장미지눈썹연구소 · 2026-07-22</div>
        <div>MAISON NOIR · EXECUTIVE REVIEW v1</div>
      </footer>
    </div>
  );
}
