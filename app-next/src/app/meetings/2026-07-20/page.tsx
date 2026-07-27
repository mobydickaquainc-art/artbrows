import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2026-07-20 회의록 · ARTbrows · 장미지눈썹연구소',
  description: '2026년 7월 20일 하루 회의 6건 + 정본 산출물 4건 통합 index',
};

type Status = 'FINAL' | 'DEPRECATED' | 'REFERENCE';
const STATUS_COLOR: Record<Status, string> = {
  FINAL:      '#C9A66B',
  DEPRECATED: '#6B6560',
  REFERENCE:  '#B08862',
};

const MEETINGS: {
  time: string;
  no: string;
  title: string;
  status: Status;
  attendees: string;
  keyPoints: string[];
  file: string;
}[] = [
  {
    time: '오전 · 회의 1',
    no: '01',
    title: '홈페이지 방향성 12항 확정',
    status: 'FINAL',
    attendees: '대표님 · 원장님 · 본부장',
    keyPoints: [
      '아카데미 : 시술 = 70 : 30 비중',
      '프리미엄 명품 톤 · 극사실 4대 카테고리',
      '30대+ 타깃 · 시술가 X 표기',
      '2027-10 합법화 대비 · 소수정예 프라이빗',
    ],
    file: '/docs/MEETING-2026-07-20-HOMEPAGE.md',
  },
  {
    time: '오전 · 회의 2',
    no: '02',
    title: '커리큘럼 3차 (창업반 660 · 재수강 990)',
    status: 'DEPRECATED',
    attendees: '대표님 · 원장님 · 본부장',
    keyPoints: [
      '창업반 660만 (오전안) → 저녁 890으로 폐기',
      '재수강 990 → 완전 폐기 (없음)',
      '이지 69 · 소묘 66 · 극사실 169 · 제거 55 유지',
      '정본은 CURRICULUM-FINAL 로 대체',
    ],
    file: '/docs/MEETING-2026-07-20-CURRICULUM.md',
  },
  {
    time: '저녁 · 회의 1',
    no: '03',
    title: '커리큘럼 저녁 2차 (창업반 990)',
    status: 'DEPRECATED',
    attendees: '대표님 · 원장님',
    keyPoints: [
      '창업반 990만 (중간안) → 최종 890으로 폐기',
      '소묘 4 + 눈썹 4 구성 → 소묘 3 + 눈썹 5 로 조정',
      '패키지 199만 신설',
      '정본은 CURRICULUM-FINAL 로 대체',
    ],
    file: '/docs/MEETING-2026-07-20-CURRICULUM-EVENING2.md',
  },
  {
    time: '저녁 · 회의 2 (최종)',
    no: '04',
    title: '★★★★ 커리큘럼 최종 확정 · 창업반 890',
    status: 'FINAL',
    attendees: '대표님 · 원장님 · 본부장',
    keyPoints: [
      '창업반 890만 최종 (660→990→890 최종 확정)',
      '이지×1 + 소묘×3 + 극사실×5 + 제거×1 + 창업컨설팅 + 강사반 자격',
      '기간: 6개월 + 추가 6개월 무제한 실습 · 베드 무료',
      '패키지 199 · 강사반 시간강사 시간당 2만 · 이지 토·일·월 3반',
      '3세트 카드뉴스 · 홈피 · FAQ 즉시 갱신 완료',
    ],
    file: '/docs/MEETING-2026-07-20-CURRICULUM-FINAL.md',
  },
  {
    time: '저녁 · 종합',
    no: '05',
    title: '마스터 통합 회의록 (하루 총결)',
    status: 'FINAL',
    attendees: '대표님 · 원장님 · 본부장',
    keyPoints: [
      '하루 3연회의 + 홈피 5차 개편 + Supabase 제거',
      '광고 영상 v2 색감·크기 통일 (ffmpeg 후보정)',
      '임원진 공유용 정본 · 오늘 전체 흐름 한 장',
      '「완료」 트리거 규칙 첫 적용 대상',
    ],
    file: '/docs/MEETING-2026-07-20-MASTER.md',
  },
  {
    time: '저녁 · 검토',
    no: '06',
    title: 'AI 직원 6인 저녁 하루 검토 회의',
    status: 'REFERENCE',
    attendees: '이서연·유나·한승철·김다은·박서윤·최예진',
    keyPoints: [
      '리스크 top 10 정리 · 오늘 미해결 항목 리스트',
      '다음 우선순위 5축: 원장님 노하우 수집 · 아카데미 하위 · 15기 광고 · 촬영 · LMS Phase 1',
      '내일 (07-21) 착수 대상 정리',
      '자유 발언 형식 · 각 직원 시각 기록',
    ],
    file: '/docs/MEETING-2026-07-20-REVIEW-EVENING.md',
  },
];

const OUTPUTS: {
  no: string;
  title: string;
  desc: string;
  file: string;
  status: Status;
}[] = [
  {
    no: 'A',
    title: '원장 극사실 방법론 정본 (26년 강의자료 117p 분석)',
    desc: '결의 법칙 1234321 · 디자인 4단계 · 단선 3구간 · 특허 3장 · 머신 10-2863985 · 색소 A0~A3 · 표피 3층·5층 · 8스타일 진단',
    file: '/docs/KEYNOTE-ANALYSIS-26artbrows-2026-07-20.md',
    status: 'FINAL',
  },
  {
    no: 'B',
    title: '카드뉴스 자산 인벤토리 (SAFE POOL 카탈로그)',
    desc: '힉스필드 4장 + 세로 4장 + 시술 4장 + 원장 3장 · Kind 매핑 · 원장 원문 인용',
    file: '/docs/ASSETS-INVENTORY-2026-07-20.md',
    status: 'FINAL',
  },
  {
    no: 'C',
    title: '카드뉴스 11 스타일 레퍼런스 (원장 선택 UI)',
    desc: 'Vogue · Minimal · Bold · Numbered · Quote · B/A · Data · Poem · Announcement · Polaroid + Custom',
    file: '/docs/CARDNEWS-STYLE-REFERENCE-2026-07-20.md',
    status: 'FINAL',
  },
  {
    no: 'D',
    title: '카드뉴스 매거진 대개편 계획서',
    desc: '9 신규 레이아웃 (magazine-cover · hero-portrait · macro-close-up · b/a-split · pullquote · case-study · atelier · cta · umbrella-4cats)',
    file: '/docs/PLAN-CARDNEWS-MAGAZINE-RESET-2026-07-20.md',
    status: 'FINAL',
  },
];

const DECISIONS: string[] = [
  '창업반 = 890만원 · 6개월 + 추가 6개월 무제한 실습 (원장님·본부장·대표님 3자 최종)',
  '이지 = 69만 (5주 15h · 토·일·월 3반) · 소묘 = 66만 · 극사실 = 169만 · 패키지 = 199만',
  '재수강 990 완전 폐기 · 「추가 6개월 무제한 실습」 프레이밍으로 대체',
  '강사반 = 창업반 수료자 중 소수 · 원장 1:N · 시간강사 시간당 2만',
  '홈피 = 프리미엄 명품 톤 유지 · 아카데미 70 : 시술 30',
  '카드뉴스 = Maison Noir 팔레트 확정 + 매거진 9 kind + 11 스타일 프리셋',
  '원장 방법론 정본 = 「결의 법칙 1234321」 · 26artbrows-FINAL PDF v2.1',
  'Hero 이미지 = 힉스필드 K-idol 극사실 눈썹 3장 매거진 트립틱 (E · F · G)',
];

const PALETTE = {
  bg:      '#0A0806',
  card:    '#141110',
  line:    '#2A231D',
  gold:    '#C9A66B',
  goldSft: '#E8C9AE',
  cream:   '#F4E5D2',
  text:    '#E6DCCE',
  muted:   '#8A7F73',
};

export default function MeetingLog20260720() {
  return (
    <div style={{ background: PALETTE.bg, minHeight: '100vh', color: PALETTE.text, fontFamily: '"Noto Sans KR", sans-serif' }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${PALETTE.line}`,
        padding: '80px 40px 48px',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '.4em', color: PALETTE.gold, textTransform: 'uppercase', marginBottom: 22 }}>
              ARTbrows · Meeting Log · 2026-07-20
            </div>
            <h1 style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 56, fontWeight: 300, lineHeight: 1.15, marginBottom: 20 }}>
              오늘의 <span style={{ color: PALETTE.gold, fontWeight: 700 }}>회의록</span>
            </h1>
            <p style={{ color: PALETTE.muted, fontSize: 14, lineHeight: 1.85, maxWidth: 620 }}>
              2026년 7월 20일 · 하루 회의 6건 + 정본 산출물 4건 통합 index.<br />
              커리큘럼 660 → 990 → <b style={{ color: PALETTE.goldSft }}>890 최종</b> · 홈피 · 카드뉴스 대개편 · 원장 방법론 정본 확정.
            </p>
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.28em', color: PALETTE.muted, textTransform: 'uppercase' }}>
            <div>SESSION · 2026-07-20</div>
            <div style={{ marginTop: 4 }}>ATTENDEES · 3 + AI ×6</div>
            <div style={{ marginTop: 4 }}>DURATION · ALL DAY</div>
            <Link href="/" style={{ display: 'inline-block', marginTop: 20, padding: '8px 18px', border: `1px solid ${PALETTE.gold}`, color: PALETTE.gold, textDecoration: 'none', fontSize: 10, letterSpacing: '.3em' }}>
              ← HOME
            </Link>
          </div>
        </div>
      </header>

      {/* 확정 결정 8선 */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 40px 20px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.4em', color: PALETTE.gold, textTransform: 'uppercase', marginBottom: 20 }}>
          ★ FINAL DECISIONS · 8
        </div>
        <ol style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 40px',
          fontFamily: '"Noto Serif KR", serif', fontSize: 14.5, lineHeight: 1.75,
          color: PALETTE.cream, paddingLeft: 22, listStyle: 'decimal',
        }}>
          {DECISIONS.map((d, i) => <li key={i} style={{ color: PALETTE.text }}>{d}</li>)}
        </ol>
      </section>

      {/* 회의록 6건 */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px 40px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.4em', color: PALETTE.gold, textTransform: 'uppercase', marginBottom: 30 }}>
          Meeting Minutes · 6
        </div>
        <div style={{ display: 'grid', gap: 20 }}>
          {MEETINGS.map((m) => (
            <a
              key={m.no}
              href={m.file}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: 30,
                padding: '30px 34px',
                background: PALETTE.card,
                border: `1px solid ${PALETTE.line}`,
                textDecoration: 'none',
                color: 'inherit',
                borderLeft: `3px solid ${STATUS_COLOR[m.status]}`,
                transition: 'border-color .2s',
              }}
            >
              <div>
                <div style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 44, fontWeight: 300, color: PALETTE.gold, lineHeight: 1 }}>
                  {m.no}
                </div>
                <div style={{ marginTop: 8, fontFamily: 'Inter, sans-serif', fontSize: 8.5, letterSpacing: '.28em', color: STATUS_COLOR[m.status] }}>
                  {m.status}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.32em', color: PALETTE.muted, textTransform: 'uppercase', marginBottom: 10 }}>
                  {m.time} · {m.attendees}
                </div>
                <h3 style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 24, fontWeight: 400, marginBottom: 14, color: PALETTE.cream, lineHeight: 1.35 }}>
                  {m.title}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {m.keyPoints.map((k, i) => (
                    <li key={i} style={{
                      fontSize: 13.5, lineHeight: 1.9, color: PALETTE.text,
                      paddingLeft: 18, position: 'relative',
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: PALETTE.gold }}>·</span>
                      {k}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 16, fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.24em', color: PALETTE.gold, textTransform: 'uppercase' }}>
                  정본 md 원문 열기 →
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 산출물 4건 */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 80px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.4em', color: PALETTE.gold, textTransform: 'uppercase', marginBottom: 30 }}>
          Deliverables · 4
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {OUTPUTS.map((o) => (
            <a
              key={o.no}
              href={o.file}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '24px 26px',
                background: PALETTE.card,
                border: `1px solid ${PALETTE.line}`,
                textDecoration: 'none',
                color: 'inherit',
                borderTop: `2px solid ${PALETTE.gold}`,
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 10 }}>
                <div style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 28, color: PALETTE.gold, lineHeight: 1 }}>
                  {o.no}
                </div>
                <h4 style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: 17, fontWeight: 500, color: PALETTE.cream, lineHeight: 1.4 }}>
                  {o.title}
                </h4>
              </div>
              <p style={{ fontSize: 12.5, color: PALETTE.muted, lineHeight: 1.75, marginTop: 12 }}>
                {o.desc}
              </p>
              <div style={{ marginTop: 14, fontFamily: 'Inter, sans-serif', fontSize: 9.5, letterSpacing: '.28em', color: PALETTE.gold, textTransform: 'uppercase' }}>
                열기 →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 부가 정본 문서 (PDF · 프롬프트) */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 40px 100px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.4em', color: PALETTE.gold, textTransform: 'uppercase', marginBottom: 20 }}>
          Related · 정본 자산
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { t: '원장 방법론 페이지 (라이브)', u: '/academy/methodology' },
            { t: '홈페이지 (오늘 최종 반영)',    u: '/' },
            { t: '카드뉴스 · 창업반 15기 (890)', u: '/cardnews/view/2026-07-20-changupbaan-15th' },
            { t: '카드뉴스 · 이지 15기 (69)',    u: '/cardnews/view/2026-07-20-easy-class-15th' },
            { t: '카드뉴스 · 극사실눈썹 (169)',   u: '/cardnews/view/2026-07-20-hyperreal-brow-15th' },
          ].map((l) => (
            <a key={l.u} href={l.u} target="_blank" rel="noopener noreferrer"
               style={{
                 padding: '10px 18px', border: `1px solid ${PALETTE.line}`,
                 color: PALETTE.text, textDecoration: 'none', fontSize: 12,
                 fontFamily: 'Inter, sans-serif', letterSpacing: '.14em',
               }}>
              {l.t} →
            </a>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${PALETTE.line}`, padding: '30px 40px', maxWidth: 1200, margin: '0 auto', fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '.28em', color: PALETTE.muted, textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>ARTbrows · 장미지눈썹연구소 · 2026-07-20</div>
        <div>MAISON NOIR PALETTE · MEETING LOG v1</div>
      </footer>
    </div>
  );
}
