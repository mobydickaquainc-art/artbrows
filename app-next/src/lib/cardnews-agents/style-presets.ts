/**
 * 인스타그램 카드뉴스 스타일 프리셋 — 정본 1 + 트렌드 4 + Custom (2026-07-27 대표님 재정리)
 *
 * 정본: artbrows-real (원장님 07-24 직접 배포본)
 * 트렌드 4: Rebellion Serif · Grain Frame Editorial · Vertical Column Story · Silhouette Reveal
 * Custom: 원장님 자유 서술
 *
 * 폐기 (11): vogue-magazine · minimal-editorial · bold-question · numbered-steps · quote-focus
 *          · before-after · data-card · poem-verse · announcement · polaroid-analog · broken-grid-editorial
 * 폐기 이유: 시각적 차별화 부족 (텍스트 톤만 다르고 레이아웃은 사실상 동일) → 상세페이지 패턴처럼 명확 5개로.
 *
 * 하위호환: LEGACY_ALIAS 로 폐기 key → 정본(artbrows-real) 자동 매핑.
 *
 * 관련: docs/CARDNEWS-STYLE-REFERENCE-2026-07-20.md (구 17종 · 폐기 이력 참조)
 */

import type { LayoutKind } from '@/app/cardnews/types';

export interface StylePreset {
  key: string;
  order: number;
  label: string;
  tag: string;
  description: string;
  isDefault?: boolean;
  isCustom?: boolean;
  recommendedKinds: LayoutKind[];
  copyToneHints: string[];
  layoutHints: string[];
  useCase: string;
  showInstaChrome?: boolean;
}

export const STYLE_PRESETS: Record<string, StylePreset> = {
  // ═══════════ [1] ARTbrows Real — 정본 (원장 07-24 직접 배포본) ═══════════
  'artbrows-real': {
    key: 'artbrows-real',
    order: 1,
    label: '01 ARTbrows Style ★',
    tag: '★ 정본 · 원장 직접 배포본',
    description: '원장님이 07-24 인스타에 직접 올리신 실전 카드뉴스 톤. 실 강의 사진 배경 + 하단 반투명 갈색 박스 오버레이 + 프리텐다드 볼드 산세리프 + 「QUESTION N」 베이지 pill + `@artbrows_academy` 우상단. 「원장님이 직접 만드시는 톤」 그대로.',
    isDefault: true,
    recommendedKinds: ['hero-portrait', 'hero-portrait', 'hero-portrait', 'hero-portrait', 'hero-portrait', 'hero-portrait'],
    copyToneHints: [
      '헤드라인 = 프리텐다드 볼드 대형 산세리프 (세리프 X · 명조 X)',
      '「QUESTION 1~4」 베이지 pill 라벨 + 큰 질문 헤드 + 3~4줄 답변',
      '카피 어휘 = 「같은 손, 같은 시간」 · 「진짜 같은 눈썹」 · 「몸값을 올리는」 · 「본인이 직접 가르칩니다」',
      'CTA = 「수강문의 010-3239-5453」 갈색 pill',
      '문어체 X · 대화체 · 원장님 실 어투 그대로',
    ],
    layoutHints: [
      '모든 슬라이드 = 실 강의 사진 배경 통짜 + 하단 반투명 갈색 박스 (rgba(60,45,35,0.72))',
      '@artbrows_academy = 우상단 흰색 소문자 (모든 슬라이드)',
      '스와이프 화살표 «»» 우하단 흰색 (마지막 제외)',
      '「ARTBROWS」 워드마크 pill = 아이보리 아웃라인',
      'AI 이미지 X · 실 강의·시술·수강생·매크로 눈썹 사진만',
    ],
    useCase: '★ 원장 배포 정본 톤 · 실전 인스타 캐러셀 · 창업반·소묘·이지 클래스 모집 광고 · 상시 콘텐츠 디폴트',
    showInstaChrome: false,
  },

  // ═══════════ [2] Rebellion Serif — 트렌드 · 임팩트 ═══════════
  'rebellion-serif': {
    key: 'rebellion-serif',
    order: 2,
    label: '02 Rebellion Serif',
    tag: '트렌드 · 임팩트',
    description: 'Vogue Italia · Harper\'s Bazaar 2026 커버 진화형. 대형 세리프 대문자가 사진 프레임을 「깨고 나옴」. 200~280pt 헤드로 스와이프 강제 유도. 브랜드 임팩트 최상.',
    recommendedKinds: ['magazine-cover', 'hero-portrait', 'pullquote-editorial', 'magazine-cover', 'atelier-scene', 'cta-editorial'],
    copyToneHints: [
      '헤드라인 = 200pt 급 대형 세리프 대문자 (ARTBROW · HYPERREAL · MASTER · ORIGINAL)',
      '단어 하나가 카드 전체를 지배 (부제·설명 최소)',
      '「SINCE 1세대」 「THE ORIGINAL」 「20YR CRAFT」 대문자 라틴 강조',
      '「털 같은 눈썹」 원장 원문 재사용 (한글은 얇은 명조 하위 라인)',
    ],
    layoutHints: [
      '커버 = magazine-cover · 대문자 헤드가 사진 프레임 침범',
      '중간 hero-portrait 는 headline 이 이미지 위로 겹쳐지도록',
      '얇은 골드 hairline (bottomLabel · signatureLabel) 유지',
      'closing = cta-editorial (highlight = 골드 강조 단어 필수)',
    ],
    useCase: '브랜드 파워 상시 콘텐츠 · 창업반 890 프리미엄 훅 · 신규 캠페인 오프닝',
  },

  // ═══════════ [3] Grain Frame Editorial — 트렌드 · 감성 ═══════════
  'grain-frame-editorial': {
    key: 'grain-frame-editorial',
    order: 3,
    label: '03 Grain Frame Editorial',
    tag: '트렌드 · 감성',
    description: 'Kinfolk · Cereal Magazine · Loewe Craft 2026 톤. 다크 카드 안에 크림 톤 프레임 하나 더 (프레임 안 프레임). 세로 필름 그레인. 30대+ 감성 정조준.',
    recommendedKinds: ['magazine-cover', 'atelier-scene', 'macro-close-up', 'pullquote-editorial', 'atelier-scene', 'cta-editorial'],
    copyToneHints: [
      '「선릉 · 오후 3시」 「이 결은 어디서 시작되는가」 시간·공간 서술',
      '광고체 X · 저널·에세이 톤 (원장 시점 1인칭)',
      '「손끝」 「결」 「무게」 「여운」 정본 어휘 밀도 있게',
      '숫자·CTA 는 마지막 슬라이드에만',
    ],
    layoutHints: [
      '커버 = magazine-cover · 원장 배경 페이드 극대화',
      'atelier-scene 을 2회 이상 (다른 각도)',
      'macro-close-up 은 우측 미니 인용 활용',
      'pullquote-editorial 은 큰 여백 + 필기체 서명',
    ],
    useCase: '원장 브랜드 스토리 · 아틀리에 방문 유도 · 창업반 890 프리미엄 톤',
    showInstaChrome: false,
  },

  // ═══════════ [4] Vertical Column Story — 트렌드 · 정보 ═══════════
  'vertical-column-story': {
    key: 'vertical-column-story',
    order: 4,
    label: '04 Vertical Column Story',
    tag: '트렌드 · 정보 밀도',
    description: 'NYT T Magazine · Assouline Books 조판. 세로 3~4단 세리프 컬럼. 짧은 카피가 세로로 흘러내림. 「긴 글 읽게 만드는 인스타 카드」 = 저장률 2배.',
    recommendedKinds: ['magazine-cover', 'pullquote-editorial', 'case-study-detail', 'pullquote-editorial', 'case-study-detail', 'cta-editorial'],
    copyToneHints: [
      '한 슬라이드 = 3연/3항/3논거 구조 (I. II. III.)',
      '각 항은 짧은 표제 + 3~4줄 세리프 본문',
      '원장 어록 3연 · 후기 3연 · 커리큘럼 3단 · 논거 3단',
      '「털 같은 눈썹」의 3가지 이유 형식 최적',
    ],
    layoutHints: [
      'pullquote-editorial 재구성 (3단 컬럼 배치 · signature 는 하단 중앙)',
      'case-study-detail 은 leftItems 3~4개로 신문형',
      '상단 얇은 골드 라인 + 하단 얇은 챕터 번호',
      '이미지 최소 (텍스트 밀도 우선)',
    ],
    useCase: '원장 철학 스토리텔링 · 「털 같은 눈썹」 3단 논거 · 저장 유도 · 후기 3연 · 커리큘럼 상세',
  },

  // ═══════════ [5] Silhouette Reveal — 트렌드 · 미스터리 훅 ═══════════
  'silhouette-reveal': {
    key: 'silhouette-reveal',
    order: 5,
    label: '05 Silhouette Reveal',
    tag: '트렌드 · 스와이프 훅',
    description: 'Dior · Chanel Beauty · YSL 2026 톤. 원장 실루엣 컷아웃 + 골드 rim light + 뒤에 큰 세리프 워드마크. 「누구지?」 궁금증 유발 → 스와이프 유도.',
    recommendedKinds: ['magazine-cover', 'hero-portrait', 'pullquote-editorial', 'hero-portrait', 'atelier-scene', 'cta-editorial'],
    copyToneHints: [
      '헤드 = 미스터리 문장 (「20년 · 한 사람의 손끝」 · 「SINCE THE ORIGINAL」)',
      '설명 없이 워드마크만 · 정체는 마지막 슬라이드에서 공개',
      '원장 이름 · 얼굴 정면은 뒤에서 (반전 구조)',
      '「극사실눈썹 창시자 · 장미지」 는 closing 에만',
    ],
    layoutHints: [
      '커버 = magazine-cover · 큰 세리프 워드마크 배경 · 인물 실루엣',
      'hero-portrait 는 다크 실루엣 + 골드 rim light · bottomLabel 최소',
      'pullquote-editorial 는 화자 밝히지 않음 (「— 20년 뒤에」)',
      'closing = cta-editorial · 정체 공개 + 「원장 시그니처」',
    ],
    useCase: '원장 브랜드 미스터리 · 창업반 프리미엄 훅 · 신규 캠페인 오프너',
    showInstaChrome: false,
  },

  // ═══════════ [6] Custom — 원장 자유 서술 ═══════════
  custom: {
    key: 'custom',
    order: 6,
    label: '06 Custom (원장 자유 서술)',
    tag: '자유 서술',
    description: '위 5 스타일에 없는 목적·톤 · 원장님이 자유 텍스트로 서술 → AI 자동 설계',
    isCustom: true,
    recommendedKinds: [],
    copyToneHints: [],
    layoutHints: [],
    useCase: '1주년 · 신년 · 부산 오픈 · 채용 공고 · 그 외 원장 지시',
  },
};

/**
 * 폐기된 프리셋 key → 대체 매핑 (2026-07-27 축소 이후 하위호환).
 * 기존 프로젝트나 UI 링크가 폐기 key 를 참조해도 오류 없이 정본으로 자동 매핑.
 */
export const LEGACY_ALIAS: Record<string, string> = {
  'vogue-magazine': 'artbrows-real',
  'minimal-editorial': 'grain-frame-editorial',
  'bold-question': 'artbrows-real',
  'numbered-steps': 'vertical-column-story',
  'quote-focus': 'vertical-column-story',
  'before-after': 'artbrows-real',
  'data-card': 'vertical-column-story',
  'poem-verse': 'grain-frame-editorial',
  'announcement': 'artbrows-real',
  'polaroid-analog': 'grain-frame-editorial',
  'broken-grid-editorial': 'silhouette-reveal',
};

export type StylePresetKey = string;
export const DEFAULT_STYLE_PRESET: StylePresetKey = 'artbrows-real';
export const CUSTOM_STYLE_PRESET: StylePresetKey = 'custom';

/** UI 표시용 정렬 배열 (5 활성 + custom = 6). LEGACY_ALIAS 는 노출 X. */
export const STYLE_PRESET_LIST = Object.values(STYLE_PRESETS).sort((a, b) => a.order - b.order);

/** 폐기 key 는 자동으로 정본 매핑 · 미정의 key 도 안전 fallback */
export function resolvePresetKey(key: string | undefined | null): StylePresetKey {
  if (!key) return DEFAULT_STYLE_PRESET;
  if (STYLE_PRESETS[key]) return key;
  if (LEGACY_ALIAS[key]) return LEGACY_ALIAS[key];
  return DEFAULT_STYLE_PRESET;
}

/** 안전 lookup · 항상 유효 프리셋 반환 */
export function getPreset(key: string | undefined | null): StylePreset {
  return STYLE_PRESETS[resolvePresetKey(key)];
}

export function presetToPromptHint(key: StylePresetKey | undefined, customBrief?: string): string {
  const p = getPreset(key);
  if (p.isCustom) {
    return [
      `📐 선택 스타일: ${p.label} (원장님 자유 서술)`,
      `원장 서술: ${customBrief ?? '(서술 없음 · 기본 톤 사용)'}`,
      '통일성 유지: Maison Noir 팔레트 · Cormorant Garamond 폰트 강제',
    ].join('\n');
  }
  return [
    `📐 선택 스타일: ${p.label} (${p.tag})`,
    `설명: ${p.description}`,
    `대표 사용: ${p.useCase}`,
    p.recommendedKinds.length ? `추천 kind 시퀀스: ${p.recommendedKinds.join(' → ')}` : '',
    p.copyToneHints.length ? `카피 톤:\n- ${p.copyToneHints.join('\n- ')}` : '',
    p.layoutHints.length ? `레이아웃 힌트:\n- ${p.layoutHints.join('\n- ')}` : '',
    '통일성 유지: Maison Noir 팔레트 · Cormorant Garamond 폰트 강제',
  ].filter(Boolean).join('\n');
}

export function shouldShowInstaChrome(key: StylePresetKey | undefined): boolean {
  return getPreset(key).showInstaChrome !== false;
}

/** 자동 모드 슬라이드 시퀀스 (fallback = 정본 artbrows-real) */
export function getRecommendedKinds(key: StylePresetKey | undefined, slideCount: number): LayoutKind[] {
  const p = getPreset(key);
  const seq = p.recommendedKinds.length > 0 ? [...p.recommendedKinds] : [...STYLE_PRESETS[DEFAULT_STYLE_PRESET].recommendedKinds];
  while (seq.length < slideCount) seq.push('hero-portrait');
  return seq.slice(0, slideCount);
}
