import type { Slide } from './types';

/**
 * 12종 레이아웃 데모 슬라이드 (갤러리 페이지용)
 * 각 레이아웃 × 카테고리 매칭 예시 (원장님 통합 브랜드 가이드 매트릭스 반영)
 */
export const demoAllLayouts: Slide[] = [
  {
    kind: 'cover-founder',
    category: 'founder',
    eyebrow: 'BRAND · MOOD',
    headline: 'Cover-Founder\n원장 컷 브랜드 무드',
    highlight: '원장 컷',
    quote: '한 올 한 올, 사람의 결을 이해하고\n그리는 기술로 자신감을 디자인합니다.',
    quoteBy: '장미지',
    imageSrc: '/brand/founder-key-visual-2026-07-17.png',
    imageAlt: '장미지 원장',
  },
  {
    kind: 'number-big',
    category: 'classroom',
    eyebrow: 'STEP',
    number: '01',
    headline: '디자인 실무',
    body: '이지클래스 5회 완성 중 첫 회차. 황금비율 디자인 그리기.',
  },
  {
    kind: 'icon-duo',
    category: 'detail',
    eyebrow: 'PENCIL FIRST',
    headline: '펜슬 가이드로\n먼저 그린다',
    items: [
      { icon: '✎', title: '펜슬 가이드', caption: '30년 노하우로\n미리 그려 시뮬레이션' },
      { icon: '🖤', title: '고객 확인', caption: '컨펌 후에만\n실제 시술 진행' },
    ],
  },
  {
    kind: 'icon-trio',
    category: 'detail',
    eyebrow: 'THREE PILLARS',
    headline: '세 축의 완성',
    items: [
      { icon: '◆', title: '예술', caption: 'Art' },
      { icon: '◈', title: '기술', caption: 'Technique' },
      { icon: '◇', title: '철학', caption: 'Philosophy' },
    ],
  },
  {
    kind: 'checklist',
    category: 'review',
    eyebrow: '수강 혜택',
    headline: '이런 분들이\n지원하면 좋습니다',
    items: [
      '반영구 시작하려는 미용업 종사자',
      '펜슬 가이드까지 배우고 싶은 분',
      '평생 수강·업데이트 원하는 분',
      '실습 위주 실무 특화 원하는 분',
      'K1 수강생 커뮤니티 참여 원하는 분',
    ],
  },
  {
    kind: 'portrait-frame',
    category: 'reels',
    imageSrc: '/brand/founder-key-visual-2026-07-17.png',
    imageAlt: '릴스 썸네일',
    eyebrow: 'REEL · 03',
    headline: '오늘의 시술 현장',
    caption: '자연스러운 결을 그리는 순간 · 15초',
  },
  {
    kind: 'product-hero',
    category: 'treatment',
    imageSrc: '/brand/founder-key-visual-2026-07-17.png',
    imageAlt: '시술 결과 클로즈업',
    overlayLabel: 'HYPER REALISTIC EYEBROW',
    eyebrow: 'BEFORE / AFTER',
    headline: '결의 방향까지 그대로',
    caption: '자연 눈썹에 녹아드는 극사실 시술 결과',
  },
  {
    kind: 'quote-bold',
    category: 'review',
    eyebrow: 'FROM STUDENT',
    quote: '펜슬 가이드가\n진짜 차별점이었어요.',
    by: '13기 수강생 이○○',
  },
  {
    kind: 'signature-style',
    category: 'founder',
    concept: {
      title: 'BRAND CONCEPT',
      formula: ['예술 Art', '기술 Technique', '철학 Philosophy'],
      result: '= 극사실눈썹',
      caption: '한 올 한 올, 사람의 결을 이해하고\n그리는 기술로 고객의 자신감을 디자인합니다.',
    },
    style: {
      title: 'SIGNATURE STYLE',
      items: [
        { label: 'HAIR', desc: '자연스럽게 흐르는 볼륨,\n정돈된 우아함' },
        { label: 'OUTFIT', desc: '블랙 & 아이보리 중심의\n미니멀 시크' },
        { label: 'MAKEUP', desc: '깨끗한 피부, 또렷한 눈매,\n자연스러운 립' },
        { label: 'ACCESSORY', desc: '절제된 고급 주얼리와 시계' },
      ],
    },
  },
  {
    kind: 'curriculum-row',
    category: 'classroom',
    eyebrow: 'CURRICULUM',
    headline: '5회 완성',
    rows: [
      { num: '01', title: '디자인 실무', time: '3시간', teacher: '원장 직강' },
      { num: '02', title: '머신 테크닉', time: '3시간', teacher: '원장 직강' },
      { num: '03', title: '실전 테크닉', time: '3시간', teacher: '원장 직강' },
      { num: '04', title: '실전 스킬 강화', time: '3시간', teacher: '원장 직강' },
      { num: '05', title: '모델 실습', time: '3시간', teacher: '실전 모델' },
    ],
  },
  {
    kind: 'price-table',
    category: 'detail',
    eyebrow: 'ENROLLMENT',
    headline: '한 번의 결정,\n평생의 자산',
    items: [{
      name: '14기 이지클래스 · 일요일반',
      price: '69만원',
      conditions: ['평생 수강', '5회 완성', '실습 포함', 'K1 카톡방'],
    }],
    footnote: '개강일 · 소수 정예 · 상세는 상담 안내',
  },
  {
    kind: 'closing-cta',
    category: 'treatment',
    headline: '극사실눈썹,\n그 원본의 손에서.',
    highlight: '원본',
    body: '같은 기수에 소수만 — 무게 있는 시작을 원하시면 상담을 신청하세요.',
    signature: 'Miji Jang',
    cta: '상담 신청 →',
    ctaHref: '/enroll',
  },
];
