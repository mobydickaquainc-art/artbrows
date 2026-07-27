import { NextResponse } from 'next/server';
import { availableModels } from '@/lib/cardnews-agents/models';
import type { ModelId, GenerateInput } from '@/lib/cardnews-agents/types';
import { prepare } from '@/lib/cardnews-agents/orchestrator';
import { STYLE_PRESETS, DEFAULT_STYLE_PRESET, type StylePresetKey } from '@/lib/cardnews-agents/style-presets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// POST /api/cardnews/generate/prepare — trend + vision + stylist (스켈레톤까지)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawPreset = String(body.stylePreset ?? DEFAULT_STYLE_PRESET);
    const stylePreset: StylePresetKey = (rawPreset in STYLE_PRESETS ? rawPreset : DEFAULT_STYLE_PRESET) as StylePresetKey;
    const input: GenerateInput = {
      purpose: String(body.purpose ?? '').slice(0, 200),
      lang: (['ko', 'en', 'zh'] as const).includes(body.lang) ? body.lang : 'ko',
      slideCount: Math.max(3, Math.min(12, Number(body.slideCount ?? 6))),
      models: Array.isArray(body.models) ? body.models.filter((m: string) => (['gemini', 'openai', 'claude'] as const).includes(m as ModelId)).slice(0, 2) : [],
      stylePreset,
      customBrief: typeof body.customBrief === 'string' ? String(body.customBrief).slice(0, 500) : undefined,
      options: {
        useTrendResearch: Boolean(body.options?.useTrendResearch ?? false),
        useVisionAnalysis: Boolean(body.options?.useVisionAnalysis ?? false),
        useImageGeneration: false,
      },
    };
    if (!input.purpose) return NextResponse.json({ error: 'purpose required' }, { status: 400 });
    const usable = availableModels();
    input.models = input.models.filter((m) => usable.includes(m));
    if (input.models.length === 0) return NextResponse.json({ error: 'no usable model' }, { status: 400 });

    const result = await prepare(input);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[api/cardnews/generate/prepare]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'prepare failed' }, { status: 500 });
  }
}
