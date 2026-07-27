/**
 * POST /api/cardnews/generate-copy
 * body: {
 *   direction: { key, label, desc, suggestedKinds },
 *   analyses: [{index, path, subject, tone, notes}],
 *   purposeHint?: string,
 *   count?: number  // 슬라이드 개수 target (default: suggestedKinds.length)
 * }
 * → 각 슬라이드 kind별 문안 자동 생성 (Gemini 우선 · 실패 시 OpenAI 폴백)
 * → { slides: [{kind, ...unified fields}] }
 *
 * Phase A · 2026-07-21 · 문안 하드코딩 → AI 생성으로 전환
 */

import { NextResponse } from 'next/server';
import { chatJson, availableModels } from '@/lib/cardnews-agents/models';

const SYSTEM_PROMPT = `당신은 ARTbrows (장미지눈썹연구소) 카드뉴스 카피라이터입니다.
브랜드: 극사실눈썹 창시자 · 20년+ 경력 · 5,000+ 시술 · 900여명 수강 배출 · 선릉/삼성 본원
톤: Maison Noir (딥 블랙 + 챔피언 골드) · 프리미엄 명품 · 프라이빗 · 조용한 럭셔리
어록: 「고객이 원하는 것은 그린 눈썹이 아니라 털 같은 눈썹이다」 · 「진짜 머리카락이야」 · 「결의 법칙 1234321」
가격: 이지 69만 · 소묘 66만 · 극사실 169만 · 패키지 199만 · 창업반 890만 (6+6 무제한)
슬로건 예시: 「털 같은 눈썹」 · 「소수에게만 직접 가르칩니다」 · 「손끝의 무게, 30년 경력」 · 「사람과 똑같은 결」

각 슬라이드 kind별 카피를 생성하세요. 문안은 짧고 임팩트있게. 대명사 최소화. 명사·형용사 중심.
반드시 지정 JSON만 응답 (마크다운 X).`;

type SlidePlan = {
  index: number;
  kind: string;
  copy: {
    topLabel?: string;
    headline?: string;
    highlight?: string;
    bottomLabel?: string;
    // kind별 특수 (있으면):
    volume?: string;
    subheadline?: string;
    quote?: string;
    signature?: string;
    signatureRole?: string;
    eyebrow?: string;
    leftTitle?: string;
    leftItems?: { num?: string; text: string; sub?: string }[];
    rightHeadline?: string;
    rightPrice?: string;
    rightFootnote?: string;
    bottomColumns?: { label: string; value: string }[];
    cta?: string;
    ctaHref?: string;
    subline?: string;
    overlayLabel?: string;
    by?: string;
    bottomStrip?: string;
    beforeLabel?: string;
    afterLabel?: string;
  };
};

function buildPrompt(dir: { key: string; label: string; desc: string; suggestedKinds: string[] }, analyses: { index: number; subject: string; tone: string; notes: string }[], purposeHint?: string, count?: number): string {
  const kinds = dir.suggestedKinds.slice(0, count ?? dir.suggestedKinds.length);
  const analysisText = analyses.map((a) => `#${a.index + 1}. ${a.subject} (${a.tone}) — ${a.notes}`).join('\n');
  return `방향: 「${dir.label}」 (${dir.desc})
용도 힌트: ${purposeHint ?? '(없음)'}

업로드된 이미지 분석:
${analysisText}

이 방향으로 ${kinds.length}장 카드뉴스를 만듭니다. 각 슬라이드에 채울 문안을 생성하세요.
슬라이드 kind 순서 (index=slide index, kind=매거진 kind):
${kinds.map((k, i) => `  ${i}: ${k}`).join('\n')}

각 kind별 지침:
- magazine-cover: volume(예: "VOL 15"), headline(대형 세리프 · 2줄), subheadline(선택), bottomLabel(서명 라벨)
- hero-portrait: bottomLabel(하단 골드 라벨 · 짧게), topLabel(우상단 배지 선택)
- macro-close-up: overlayLabel(예: "HYPER REAL"), quote(우측 미니 인용), by(서명)
- pullquote-editorial: quote(대형 어록 · 3~4줄), signature(필기체 예: "Miji Jang"), signatureRole(직함)
- case-study-detail: eyebrow(위 라벨), leftTitle, leftItems(5~6개 num+text+sub), rightHeadline, rightPrice, rightFootnote
- atelier-scene: eyebrow, headline(선택 · 이미지 하단), bottomColumns(3개 label+value 예: "본원=선릉·삼성")
- cta-editorial: headline(대형 CTA), highlight(골드 강조), signature, cta(예: "교육 상담 신청 →"), ctaHref(예: "/enroll"), subline
- before-after-split: beforeLabel="BEFORE", afterLabel="AFTER", bottomStrip(하단 정보)
- umbrella-4cats: eyebrow, headline, quote(원장 원문)

응답 스키마:
{
  "slides": [
    {
      "index": 0,
      "kind": "magazine-cover",
      "copy": { "volume": "VOL 15", "headline": "...", "bottomLabel": "MIJI JANG · 2026" }
    }
  ]
}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      direction?: { key: string; label: string; desc: string; suggestedKinds: string[] };
      analyses?: { index: number; subject: string; tone: string; notes: string }[];
      purposeHint?: string;
      count?: number;
      model?: 'gemini' | 'openai';
      temperature?: number;   // 다양성 · 안정 0.55 / 실험 1.05 (2026-07-27 다중안 양산)
      toneNote?: string;      // 추가 톤 지시 (예: "안정적·정본에 충실" / "실험적·대담한 새 표현")
    };
    const { direction, analyses, purposeHint, count, model: forcedModel, temperature, toneNote } = body;
    if (!direction || !Array.isArray(direction.suggestedKinds) || direction.suggestedKinds.length === 0) {
      return NextResponse.json({ ok: false, error: 'direction.suggestedKinds required' }, { status: 400 });
    }
    if (!Array.isArray(analyses)) {
      return NextResponse.json({ ok: false, error: 'analyses[] required' }, { status: 400 });
    }

    const basePrompt = buildPrompt(direction, analyses, purposeHint, count);
    const prompt = toneNote ? `${basePrompt}\n\n★ 이번 안의 특별 톤 지시: ${toneNote}` : basePrompt;
    const available = availableModels();

    // Gemini 우선 · 실패 시 OpenAI 폴백 · forcedModel 있으면 그것만
    let modelOrder: ('gemini' | 'openai')[];
    if (forcedModel) {
      if (!available.includes(forcedModel)) {
        return NextResponse.json({ ok: false, error: `Forced model ${forcedModel} not available` }, { status: 400 });
      }
      modelOrder = [forcedModel];
    } else {
      modelOrder = ['gemini', 'openai'].filter((m) => available.includes(m as 'gemini' | 'openai')) as ('gemini' | 'openai')[];
    }
    if (modelOrder.length === 0) {
      return NextResponse.json({ ok: false, error: 'No API keys available (GEMINI_API_KEY or OPENAI_API_KEY)' }, { status: 500 });
    }

    let lastErr: unknown = null;
    let usedModel: string | null = null;
    let parsed: { slides?: SlidePlan[] } | null = null;

    for (const model of modelOrder) {
      try {
        parsed = await chatJson<{ slides?: SlidePlan[] }>(model, prompt, {
          system: SYSTEM_PROMPT,
          temperature: typeof temperature === 'number' && temperature >= 0 && temperature <= 2 ? temperature : 0.7,
          maxTokens: 3500,
        });
        usedModel = model;
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (!parsed || !Array.isArray(parsed.slides)) {
      return NextResponse.json({
        ok: false,
        error: '문안 생성 실패 (모든 모델)',
        detail: lastErr instanceof Error ? lastErr.message : String(lastErr),
      }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      usedModel,
      slides: parsed.slides,
      count: parsed.slides.length,
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : 'generate-copy failed',
    }, { status: 500 });
  }
}
