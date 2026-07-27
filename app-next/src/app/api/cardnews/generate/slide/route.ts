import { NextResponse } from 'next/server';
import { availableModels } from '@/lib/cardnews-agents/models';
import type { ModelId, GenerateInput, SlideSkeleton } from '@/lib/cardnews-agents/types';
import { generateSlide } from '@/lib/cardnews-agents/orchestrator';
import { STYLE_PRESETS, DEFAULT_STYLE_PRESET, type StylePresetKey } from '@/lib/cardnews-agents/style-presets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// POST /api/cardnews/generate/slide
// body: { input, skeleton, index, totalSlides, trendHints }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inputRaw = body.input;
    if (!inputRaw?.purpose || !Array.isArray(inputRaw?.models)) {
      return NextResponse.json({ error: 'input.purpose and input.models required' }, { status: 400 });
    }
    const rawPreset = String(inputRaw.stylePreset ?? DEFAULT_STYLE_PRESET);
    const stylePreset: StylePresetKey = (rawPreset in STYLE_PRESETS ? rawPreset : DEFAULT_STYLE_PRESET) as StylePresetKey;
    const input: GenerateInput = {
      purpose: String(inputRaw.purpose).slice(0, 200),
      lang: (['ko', 'en', 'zh'] as const).includes(inputRaw.lang) ? inputRaw.lang : 'ko',
      slideCount: Math.max(3, Math.min(12, Number(inputRaw.slideCount ?? 6))),
      models: (inputRaw.models as string[]).filter((m) => (['gemini', 'openai', 'claude'] as const).includes(m as ModelId)).slice(0, 2) as ModelId[],
      stylePreset,
      customBrief: typeof inputRaw.customBrief === 'string' ? String(inputRaw.customBrief).slice(0, 500) : undefined,
      options: {
        useTrendResearch: !!inputRaw.options?.useTrendResearch,
        useVisionAnalysis: !!inputRaw.options?.useVisionAnalysis,
        useImageGeneration: false,
      },
    };
    const usable = availableModels();
    input.models = input.models.filter((m) => usable.includes(m));
    if (input.models.length === 0) return NextResponse.json({ error: 'no usable model' }, { status: 400 });

    const skeleton = body.skeleton as SlideSkeleton;
    const index = Number(body.index ?? 0);
    const totalSlides = Number(body.totalSlides ?? input.slideCount);
    const trendHints = String(body.trendHints ?? '');
    if (!skeleton?.kind || !skeleton?.category) return NextResponse.json({ error: 'skeleton {kind,category} required' }, { status: 400 });

    const t0 = Date.now();
    const copySet = await generateSlide(input, skeleton, index, totalSlides, trendHints);
    return NextResponse.json({ copySet, elapsedMs: Date.now() - t0 });
  } catch (err) {
    console.error('[api/cardnews/generate/slide]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'slide failed' }, { status: 500 });
  }
}
