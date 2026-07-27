/**
 * 카드뉴스 자동 생성 · Agent 공통 타입 (2026-07-17)
 * 모비딕 detail-agent 패턴을 카드뉴스에 이식.
 * 원장님 정본 톤 (블랙+골드+아이보리 + 6톤 카테고리) 준수.
 */

import type { Slide, Lang, LayoutKind } from '@/app/cardnews/types';
import type { PaletteKey } from '@/lib/artbrows/tokens';
import type { StylePresetKey } from './style-presets';

export type ModelId = 'gemini' | 'openai' | 'claude';

export const MODEL_META: Record<ModelId, { label: string; provider: string; strength: string; envKey: string }> = {
  gemini: { label: 'Gemini 2.5 Pro', provider: 'Google', strength: 'Search Grounding · Vision · 중국어', envKey: 'GEMINI_API_KEY' },
  openai: { label: 'GPT-4/5 (o1)', provider: 'OpenAI', strength: '창의성 · 다양성 · 영어', envKey: 'OPENAI_API_KEY' },
  claude: { label: 'Claude Sonnet 4.5', provider: 'Anthropic', strength: '브랜드 톤 · 컨텍스트 · 한국어 뉘앙스', envKey: 'ANTHROPIC_API_KEY' },
};

// 사용자 입력
export interface GenerateInput {
  purpose: string;              // "14기 이지클래스 모집" 등
  lang: Lang;                   // ko | en | zh
  slideCount: number;           // 4 ~ 12
  models: ModelId[];            // 최대 2개 (병렬 실행)
  stylePreset?: StylePresetKey; // 스타일 프리셋 (default: 'vogue-magazine' · 'custom' = 자유 서술)
  customBrief?: string;         // stylePreset = 'custom' 일 때 원장 서술 (2026-07-20)
  options: {
    useTrendResearch: boolean;  // Gemini Grounding · 최신 인스타 트렌드 조사
    useVisionAnalysis: boolean; // Gemini Vision 으로 벤치마크 5장 분석
    useImageGeneration: boolean; // Higgsfield (R4+ · 지금은 false)
  };
  categoryHint?: PaletteKey[];  // 원하는 카테고리 순환 힌트
}

// trend-researcher 결과
export interface TrendReport {
  source: ModelId;
  summary: string;                       // 3~5 문장
  layoutPatterns: string[];              // "큰 넘버 + 짧은 카피" 등
  copyToneHints: string[];               // "질문형 헤드" 등
  keywords: string[];                    // 최신 키워드 · 해시태그
  raw?: string;                          // 원본 응답 (디버그)
}

// vision-analyzer 결과
export interface VisionReport {
  refPath: string;                       // /brand/ref/01.jpg 등
  paletteDescription: string;            // 색·톤 요약
  layoutDescription: string;             // 레이아웃 패턴
  moodKeywords: string[];                // "모던 세리프 강조" 등
}

// 카피 톤 (설계 모드 · 사용자가 슬라이드별로 지정 · 2026-07-20)
export type CopyTone = 'auto' | 'question' | 'statement' | 'poetic' | 'number' | 'quote' | 'compare';
export const COPY_TONE_META: Record<CopyTone, { label: string; hint: string }> = {
  auto:      { label: 'Auto · 자동',          hint: '프리셋·스켈레톤 기본 방향' },
  question:  { label: 'Question · 질문형',    hint: '물음표 · 궁금증 유도 · 스와이프 유발' },
  statement: { label: 'Statement · 선언형',    hint: '확신·임팩트·마침표로 끝' },
  poetic:    { label: 'Poetic · 시적',         hint: '리듬·여운·짧은 연 · 형용사 절제' },
  number:    { label: 'Number · 숫자 강조',    hint: '데이터·통계·연차·경험치 강조' },
  quote:     { label: 'Quote · 인용형',        hint: '격언·회고·인물 목소리 (원장·수강생)' },
  compare:   { label: 'Compare · 대비형',      hint: 'Before/After·전/후·대조 강조' },
};

// stylist 결과 (슬라이드 스켈레톤)
export interface SlideSkeleton {
  kind: LayoutKind;
  category: PaletteKey;
  rationale: string;                     // 왜 이 조합인지 (디버그·투명성)
  copyTone?: CopyTone;                   // 설계 모드 · 사용자 지정 카피 톤
  imageSrcHint?: string;                 // 설계 모드 · 사용자 pick 이미지
}

// copywriter 결과 (2안)
export interface SlideCopyVariant {
  source: ModelId;
  slide: Slide;                          // 완성된 슬라이드 (kind·category·필드 다 채움)
}
export interface SlideCopySet {
  index: number;                         // 몇 번째 슬라이드
  skeleton: SlideSkeleton;
  variants: SlideCopyVariant[];          // 2개 모델의 각각 안
}

// orchestrator 최종 결과
export interface GenerateResult {
  input: GenerateInput;
  runId: string;                         // 저장 프로젝트 id
  trendReports: TrendReport[];           // 각 모델별 (options.useTrendResearch)
  visionReports: VisionReport[];         // 벤치마크 5장별 (options.useVisionAnalysis)
  skeletons: SlideSkeleton[];            // stylist 결정 (슬라이드 순서 그대로)
  copySets: SlideCopySet[];              // copywriter 결과 (모델별 2안)
  savedTo: string;                       // 저장 파일 경로
  errors: { stage: string; message: string }[];
  timings: { stage: string; ms: number }[];
}
