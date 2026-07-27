import type { CardnewsSet } from './types';

// 14기 이지클래스 모집 캐러셀 6장 (샘플 · 12종 중 6종 사용)
// 목적: 원장님 정본 6톤 팔레트 순환 + 각 슬라이드 다른 레이아웃 (본부장 지시)
// 카테고리 순서: founder → review → founder → classroom → detail → treatment
export const sampleFourteenthEasy: CardnewsSet = {
  id: '14th-easy-class',
  title: '14기 이지클래스 모집',
  createdAt: '2026-07-17',
  slides: [
    {
      kind: 'cover-founder',
      category: 'founder',
      eyebrow: '14TH ENROLLMENT · 극사실 아카데미',
      headline: '14기 이지클래스\n모집 시작',
      highlight: '모집 시작',
      quote: '눈썹은 기술이 아닌 예술이며, 철학입니다.',
      quoteBy: '장미지',
      imageSrc: '/brand/founder-key-visual-2026-07-17.png',
      imageAlt: '장미지 원장 · 극사실눈썹 창시자',
    },
    {
      kind: 'quote-bold',
      category: 'review',
      eyebrow: 'PHILOSOPHY',
      quote: '반영구 하고 싶은데\n어디서 제대로 배우지?',
      by: '학원은 많은데 「펜슬 가이드」를 직접 가르치는 곳은 거의 없어요.',
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
      headline: '5회 완성\n실습 포함 실무 특화 과정',
      rows: [
        { num: '01', title: '디자인 실무', time: '3시간', teacher: '장미지 원장 직강' },
        { num: '02', title: '머신 테크닉', time: '3시간', teacher: '장미지 원장 직강' },
        { num: '03', title: '실전 테크닉', time: '3시간', teacher: '장미지 원장 직강' },
        { num: '04', title: '실전 스킬 강화', time: '3시간', teacher: '장미지 원장 직강' },
        { num: '05', title: '모델 실습', time: '3시간', teacher: '실전 모델 시술' },
      ],
    },
    {
      kind: 'price-table',
      category: 'detail',
      eyebrow: 'ENROLLMENT',
      headline: '한 번의 결정,\n평생의 자산',
      items: [
        {
          name: '14기 이지클래스 (일요일반)',
          price: '69만원',
          conditions: ['평생 수강 가능', '5회 완성 · 실습 포함', 'K1 수강생 전용 카톡방'],
        },
      ],
      footnote: '개강일 · 소수 정예 정원 · 상세는 상담으로 안내',
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
  ],
};
