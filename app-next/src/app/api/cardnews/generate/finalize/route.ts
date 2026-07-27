import { NextResponse } from 'next/server';
import type { ModelId, GenerateInput, SlideCopySet } from '@/lib/cardnews-agents/types';
import type { Slide } from '@/app/cardnews/types';
import { finalize } from '@/lib/cardnews-agents/orchestrator';
import { STYLE_PRESETS, DEFAULT_STYLE_PRESET, type StylePresetKey } from '@/lib/cardnews-agents/style-presets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// POST /api/cardnews/generate/finalize
// body: { input, slides, runId? }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inputRaw = body.input;
    if (!inputRaw?.purpose) return NextResponse.json({ error: 'input.purpose required' }, { status: 400 });
    const rawPreset = String(inputRaw.stylePreset ?? DEFAULT_STYLE_PRESET);
    const stylePreset: StylePresetKey = (rawPreset in STYLE_PRESETS ? rawPreset : DEFAULT_STYLE_PRESET) as StylePresetKey;
    const input: GenerateInput = {
      purpose: String(inputRaw.purpose).slice(0, 200),
      lang: (['ko', 'en', 'zh'] as const).includes(inputRaw.lang) ? inputRaw.lang : 'ko',
      slideCount: Math.max(3, Math.min(12, Number(inputRaw.slideCount ?? 6))),
      models: (inputRaw.models as string[] ?? []).filter((m) => (['gemini', 'openai', 'claude'] as const).includes(m as ModelId)).slice(0, 2) as ModelId[],
      stylePreset,
      options: {
        useTrendResearch: !!inputRaw.options?.useTrendResearch,
        useVisionAnalysis: !!inputRaw.options?.useVisionAnalysis,
        useImageGeneration: false,
      },
    };
    const slides = Array.isArray(body.slides) ? (body.slides as Slide[]) : [];
    if (slides.length === 0) return NextResponse.json({ error: 'slides required (empty)' }, { status: 400 });
    const copySets = Array.isArray(body.copySets) ? (body.copySets as SlideCopySet[]) : undefined;

    const project = await finalize({ input, slides, copySets, runId: body.runId });
    return NextResponse.json({ project, savedTo: `content/cardnews/${project.id}.json` });
  } catch (err) {
    console.error('[api/cardnews/generate/finalize]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'finalize failed' }, { status: 500 });
  }
}
