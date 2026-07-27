import { NextResponse } from 'next/server';
import { availableModels } from '@/lib/cardnews-agents/models';
import { MODEL_META, type ModelId, type GenerateInput } from '@/lib/cardnews-agents/types';
import { orchestrate } from '@/lib/cardnews-agents/orchestrator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;   // 5 min (Vercel 프로 · 로컬 무제한)

// GET /api/cardnews/generate — 사용 가능 모델 목록 (UI 모달용)
export async function GET() {
  const models = availableModels();
  return NextResponse.json({
    available: models,
    meta: Object.fromEntries(models.map((m) => [m, MODEL_META[m]])),
  });
}

// POST /api/cardnews/generate — 자동 생성 파이프라인 실행
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input: GenerateInput = {
      purpose: String(body.purpose ?? '').slice(0, 200),
      lang: (['ko', 'en', 'zh'] as const).includes(body.lang) ? body.lang : 'ko',
      slideCount: Math.max(3, Math.min(12, Number(body.slideCount ?? 6))),
      models: Array.isArray(body.models) ? body.models.filter((m: string) => (['gemini', 'openai', 'claude'] as const).includes(m as ModelId)).slice(0, 2) : [],
      options: {
        useTrendResearch: Boolean(body.options?.useTrendResearch ?? true),
        useVisionAnalysis: Boolean(body.options?.useVisionAnalysis ?? false),
        useImageGeneration: false,   // R4+ · 지금은 강제 false
      },
      categoryHint: Array.isArray(body.categoryHint) ? body.categoryHint : undefined,
    };

    if (!input.purpose) return NextResponse.json({ error: 'purpose required' }, { status: 400 });
    if (input.models.length === 0) return NextResponse.json({ error: 'select at least 1 model' }, { status: 400 });

    // 실제 사용 가능한 모델만 필터
    const usable = availableModels();
    input.models = input.models.filter((m) => usable.includes(m));
    if (input.models.length === 0) return NextResponse.json({ error: 'selected models have no API keys' }, { status: 400 });

    const result = await orchestrate(input);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[api/cardnews/generate POST]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'generate failed' }, { status: 500 });
  }
}
