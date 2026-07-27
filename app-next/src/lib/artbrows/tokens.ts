/**
 * artbrows style · 브랜드 디자인 토큰 (원장님 지시사항 정형화)
 *
 * 최종 결정권자: 장미지 원장님
 * 정본 일자: 2026-07-17 (원장님 GPT 브랜드 이미지 · 카톡 11:42 피드백 「원색계열 피함」)
 *
 * 이 파일의 값은 원장님 지시가 있을 때만 변경한다.
 * 어떤 UI 도 이 토큰 밖의 색상/폰트를 임의로 쓰지 않는다.
 */

export const artbrowsColors = {
  // ── 배경 (딥 블랙 계열) ──
  black: '#0B0907',          // 캔버스 배경 정본 (원장님 브랜드 이미지 배경)
  blackSoft: '#161311',      // 카드 배경
  blackWarm: '#1E1A17',      // 서브 카드 · 대비 완화용
  charcoal: '#2A211C',       // 라디얼 그라디언트 하이라이트

  // ── 골드 (액센트 정본) ──
  gold: '#C9A66B',           // 시그니처 로고 · 라벨 · 얇은 라인 · 강조 텍스트
  goldLight: '#E0C088',      // 호버 · 하이라이트
  goldDeep: '#A8854E',       // 아이보리 배경 위 대비용
  goldLine: 'rgba(201, 166, 107, 0.35)', // 구분선

  // ── 아이보리 크림 (대비 블록) ──
  ivory: '#F5EEE0',          // Signature Style 블록 배경 · 텍스트 (딥 배경 위)
  ivorySoft: '#E8DCC5',      // 서브 아이보리
  ink: '#1F1817',            // 아이보리 배경 위 본문
  inkMuted: '#5A4F42',       // 서브 텍스트

  // ── 뮤티드 (본문·서브 텍스트) ──
  textSoft: '#C7B9A6',       // 딥 배경 위 본문
  textMuted: '#8A7E72',      // 딥 배경 위 서브
  line: '#2A211C',           // 딥 배경 위 얇은 구분선
  lineSoft: '#1E1816',       // 매우 옅은 구분선
} as const;

export const artbrowsFonts = {
  headline: '"Nanum Myeongjo", serif',           // 한글 헤드
  headlineLatin: '"Cormorant Garamond", "Playfair Display", serif', // 라틴 세리프
  body: '"Pretendard", "Noto Sans KR", sans-serif',
  bodyLatin: '"Inter", "Pretendard", sans-serif',
  signature: '"Caveat", cursive',                // 원장님 완성본 필기체 시그니처
} as const;

export const artbrowsSpacing = {
  cardRatio: '4 / 5',        // 인스타 캐러셀 표준
  cardRadius: '8px',
  gutter: '24px',
} as const;

/**
 * 원장님 통합 브랜드 가이드 「artbrow-integrated-guide 2026」 6톤 팔레트
 * (2026-07-17 원장님 GPT 인스타 피드 그리드 정본)
 *
 * 인스타 피드 3열 반복 패턴 — 이 6개 카테고리 컬러를 반복하면 브랜드 룩 유지.
 * 각 카테고리는 콘텐츠 성격에 대응 (Before/After · 원장 컷 · 후기 · 클래스 · 디테일 · 릴스).
 */
export const artbrowsPalette = {
  // 시술 결과 Before/After — 다크 챠콜
  treatment: { key: 'treatment', label: '시술 결과 (Before/After)', bg: '#3A3838', text: '#F5EEE0' },
  // 원장 컷 · 브랜드 무드 — 뉴트럴 베이지
  founder: { key: 'founder', label: '원장 컷 · 브랜드 무드', bg: '#B8AFA2', text: '#1F1817' },
  // 고객 후기 텍스트카드 — 딥 버건디 / 와인
  review: { key: 'review', label: '고객 후기 (텍스트카드)', bg: '#7A3538', text: '#F5EEE0' },
  // 교육 현장 클래스컷 — 딥 세이지 그린
  classroom: { key: 'classroom', label: '교육 현장 (클래스컷)', bg: '#4E5A3E', text: '#F5EEE0' },
  // 디테일 클로즈업 눈썹 — 밝은 아이보리
  detail: { key: 'detail', label: '디테일 (클로즈업 눈썹)', bg: '#E8E1D5', text: '#1F1817' },
  // 릴스 썸네일 — 미디엄 챠콜
  reels: { key: 'reels', label: '릴스 (썸네일)', bg: '#5A5652', text: '#F5EEE0' },
} as const;

export type PaletteKey = keyof typeof artbrowsPalette;

/**
 * 원장님 정본 · 콘텐츠 필러 주간 배분 (합 100%)
 * (2026-07-17 원장님 통합 브랜드 가이드)
 * 인스타·릴스 콘텐츠 계획 시 이 배분 유지.
 */
export const artbrowsContentPillars = {
  treatment: 40,   // Before/After
  classroom: 20,   // 교육·강의
  founder: 15,     // 브랜드 무드 (원장 컷)
  review: 15,      // 고객 후기
  reels: 10,       // 릴스·트렌드
  // detail 은 별도 배분 없음 · 위 5개 사이에 삽입 사용
} as const;

/**
 * 원장님 정본 · 비주얼 통일 규칙
 * (2026-07-17 원장님 통합 브랜드 가이드)
 * - 모든 사진 보정 프리셋 통일: 웜톤 · 세미매트 · 동일 채도
 * - 텍스트 카드 = 폰트·컬러 고정 템플릿 (Canva 브랜드킷 저장)
 * - 릴스 커버도 피드와 동일 톤 → 피드 이탈감 최소화
 */
export const artbrowsVisualRules = {
  photoPreset: '웜톤 · 세미매트 · 동일 채도',
  textCard: '폰트·컬러 고정 템플릿 (Canva 브랜드킷)',
  reelsCover: '피드와 동일 톤 (이탈감 최소화)',
} as const;

/**
 * 금지 목록 (원장님 지시사항 정형화)
 * - 원색 계열 (`#ff0000`, 형광 옐로우/그린, `#00ffff`, 네온 등) — 원장님 2026-07-17 11:42 "너무 원색계열은 피하구요"
 * - 살구핑크 (`#FF4D7E`, `#FAD7C7`) — 어제 「아트브로우 (달력톤)」 폐기
 * - 발랄한 파스텔 — 원장님 "발랄 X · 젊음 X"
 * - 임의 스타일 override — 모든 UI 는 위 tokens 만 사용
 */
export const artbrowsForbidden = [
  '#ff0000', '#ff4d7e', '#fad7c7',
  '#ffff00', '#00ff00', '#00ffff', '#ff00ff',
  '#460479', '#92174d',
] as const;
