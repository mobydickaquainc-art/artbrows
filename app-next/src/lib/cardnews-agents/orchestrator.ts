/**
 * Orchestrator · 파이프라인 3-stage 분리
 *   prepare() = trend + vision + stylist         → skeletons + trendHints
 *   generateSlide() = 한 슬라이드 copywriter (병렬 2안)
 *   finalize() = 저장                             → CardnewsProject
 *
 * 기존 orchestrate() = 3-stage 를 순차 실행하는 편의 함수 (backward compat).
 */

import type { CardnewsProject } from '@/lib/cardnews-storage';
import { saveProject } from '@/lib/cardnews-storage';
import type { GenerateInput, GenerateResult, SlideCopySet, TrendReport, VisionReport, SlideSkeleton } from './types';
import { runTrendResearch, runVisionAnalysis, runStylist, runCopywriter } from './agents';
import { DEFAULT_STYLE_PRESET, STYLE_PRESETS, type StylePresetKey } from './style-presets';

const REF_IMAGES = [
  '/brand/ref/01.jpg', '/brand/ref/02.jpg', '/brand/ref/03.jpg',
  '/brand/ref/04.jpg', '/brand/ref/05.jpg',
];

// 프리셋 자동 순환 (사용자가 default 'vogue-magazine' 만 선택 시 · 매번 다른 스타일 유도 · 2026-07-20)
// custom 은 제외 (자유 서술 · 별도)
const AUTO_ROTATE_PRESETS: StylePresetKey[] = [
  'vogue-magazine', 'minimal-editorial', 'bold-question', 'numbered-steps',
  'quote-focus', 'data-card', 'poem-verse', 'announcement', 'polaroid-analog',
];

function rotatePreset(purpose: string): StylePresetKey {
  let h = 5381;
  for (let i = 0; i < purpose.length; i++) h = ((h << 5) + h + purpose.charCodeAt(i)) & 0x7fffffff;
  return AUTO_ROTATE_PRESETS[h % AUTO_ROTATE_PRESETS.length];
}

// ─────────────────── Stage 1: prepare ───────────────────
export interface PrepareResult {
  input: GenerateInput;
  trendReports: TrendReport[];
  visionReports: VisionReport[];
  skeletons: SlideSkeleton[];
  trendHints: string;           // copywriter 로 넘길 힌트 요약
  errors: { stage: string; message: string }[];
  timings: { stage: string; ms: number }[];
}

export async function prepare(input: GenerateInput): Promise<PrepareResult> {
  const errors: PrepareResult['errors'] = [];
  const timings: PrepareResult['timings'] = [];

  // 프리셋 자동 순환: 사용자가 명시 안 했으면 (undefined) OR default 'artbrows' 그대로면 → purpose 해시로 rotation
  if (!input.stylePreset || input.stylePreset === DEFAULT_STYLE_PRESET) {
    const rotated = rotatePreset(input.purpose);
    if (rotated !== input.stylePreset) {
      input = { ...input, stylePreset: rotated };
    }
  }

  const tick = async <T>(stage: string, fn: () => Promise<T>): Promise<T | null> => {
    const t0 = Date.now();
    try {
      const r = await fn();
      timings.push({ stage, ms: Date.now() - t0 });
      return r;
    } catch (e) {
      errors.push({ stage, message: e instanceof Error ? e.message : String(e) });
      timings.push({ stage, ms: Date.now() - t0 });
      return null;
    }
  };

  // Trend research (useTrendResearch 옵션 true 일 때만 · 2026-07-20 · live-trend 프리셋 폐기)
  const doTrend = input.options.useTrendResearch && input.models.length > 0;
  let trendReports: TrendReport[] = [];
  if (doTrend) {
    const results = await Promise.all(
      input.models.map((m) => tick(`trend:${m}`, () => runTrendResearch(input, m))),
    );
    trendReports = results.filter((x): x is NonNullable<typeof x> => x !== null);
  }

  // Vision (옵션)
  let visionReports: VisionReport[] = [];
  if (input.options.useVisionAnalysis) {
    const v = await tick('vision', () => runVisionAnalysis(REF_IMAGES.slice(0, 3)));
    visionReports = v ?? [];
  }

  // Stylist (첫 번째 모델)
  const trendSummary = trendReports.map((t) => t.summary).join('\n\n') || '(트렌드 조사 스킵)';
  const skeletons = (await tick('stylist', () => runStylist(input, trendSummary, input.models[0]))) ?? [];

  // Trend hints (copywriter 로 넘길 요약)
  const trendHints = [
    ...trendReports.flatMap((t) => t.copyToneHints),
    ...visionReports.flatMap((v) => v.moodKeywords),
  ].slice(0, 12).join(' · ');

  return { input, trendReports, visionReports, skeletons, trendHints, errors, timings };
}

// ─────────────────── Stage 2: generateSlide (한 장) ───────────────────
export async function generateSlide(
  input: GenerateInput,
  skeleton: SlideSkeleton,
  index: number,
  totalSlides: number,
  trendHints: string,
): Promise<SlideCopySet> {
  const variants = await Promise.all(
    input.models.map(async (m) => {
      try {
        return await runCopywriter(input, skeleton, index, totalSlides, trendHints, m);
      } catch (e) {
        console.error(`[generateSlide model=${m} idx=${index}]`, e);
        return null;
      }
    }),
  );
  return {
    index,
    skeleton,
    variants: variants.filter((x): x is NonNullable<typeof x> => x !== null),
  };
}

// ─────────────────── Stage 3: finalize (저장) ───────────────────
export interface FinalizeInput {
  input: GenerateInput;
  slides: import('@/app/cardnews/types').Slide[];   // 사용자가 선택한 최종 슬라이드 배열
  copySets?: SlideCopySet[];                         // 대안 안 (편집기에서 「대안 안 → 교체」 용)
  runId?: string;                                    // 이어쓰기 · 없으면 신규
}

export async function finalize(fi: FinalizeInput): Promise<CardnewsProject> {
  const now = new Date().toISOString();
  const runId = fi.runId ?? `auto-${now.replace(/[:.]/g, '-').slice(0, 19)}`;
  const project: CardnewsProject = {
    id: runId,
    title: `[AUTO] ${fi.input.purpose}`,
    slug: runId,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    defaultLang: fi.input.lang,
    translations: {
      ko: fi.input.lang === 'ko' ? { title: fi.input.purpose, slides: fi.slides } : { title: '', slides: [] },
      en: fi.input.lang === 'en' ? { title: fi.input.purpose, slides: fi.slides } : { title: '', slides: [] },
      zh: fi.input.lang === 'zh' ? { title: fi.input.purpose, slides: fi.slides } : { title: '', slides: [] },
    },
    autoVariants: fi.copySets?.map((c) => ({
      index: c.index,
      skeleton: { kind: c.skeleton.kind, category: c.skeleton.category, rationale: c.skeleton.rationale },
      variants: c.variants.map((v) => ({ source: v.source, slide: v.slide })),
    })),
  };
  return saveProject(project);
}

// ─────────────────── Wrapper: 기존 orchestrate (backward compat) ───────────────────
export async function orchestrate(input: GenerateInput): Promise<GenerateResult> {
  const p = await prepare(input);
  const copySets: SlideCopySet[] = [];
  for (let i = 0; i < p.skeletons.length; i++) {
    const cs = await generateSlide(input, p.skeletons[i], i, p.skeletons.length, p.trendHints);
    copySets.push(cs);
  }
  const primary = copySets.map((c) => c.variants[0]?.slide).filter(Boolean);
  const project = await finalize({ input, slides: primary, copySets });
  return {
    input,
    runId: project.id,
    trendReports: p.trendReports,
    visionReports: p.visionReports,
    skeletons: p.skeletons,
    copySets,
    savedTo: `content/cardnews/${project.id}.json`,
    errors: p.errors,
    timings: p.timings,
  };
}
