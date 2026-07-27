/**
 * POST /api/cardnews/analyze-images
 * body: { imagePaths: string[], purposeHint?: string }
 * → Gemini 2.5 Pro Vision 이미지 분석 · 방향 추천 3~4개 반환
 *
 * 2026-07-21 · Image-First 3-step wizard Step 2 백엔드
 */

import { NextResponse } from 'next/server';
import { geminiVision } from '@/lib/cardnews-agents/models';

type ImageAnalysis = {
  index: number;
  path: string;
  subject: string;     // "시술 클로즈업" · "원장 정면 초상" · "아틀리에 무드"
  tone: string;        // "매크로" · "인물" · "무드"
  notes: string;       // 세부 관찰
};

type DirectionOption = {
  key: string;         // "recruit" · "founder-methodology" · "hyper-real-review" · "custom"
  label: string;       // "창업반 15기 모집"
  desc: string;        // "6장 카드뉴스 · 인물+상세 구조"
  fitScore: number;    // 0-100 이미지 적합도
  suggestedKinds: string[];  // Magazine kind sequence
};

type AnalyzeResponse = {
  ok: true;
  count: number;
  analyses: ImageAnalysis[];
  directions: DirectionOption[];
  rationale: string;
};

const SYSTEM_PROMPT = `당신은 ARTbrows (장미지눈썹연구소) 카드뉴스 기획 어시스턴트입니다.
브랜드 톤: Maison Noir (딥 블랙 + 챔피언 골드) · 극사실 눈썹 · 프리미엄 명품
사용자가 업로드한 이미지를 분석하고, 각 이미지가 무엇을 담고 있는지 판단한 뒤, 카드뉴스 방향 3~4개를 추천하세요.
반드시 지정된 JSON 스키마로만 응답하고, 마크다운 코드 블록으로 감싸지 마세요.`;

function buildPrompt(paths: string[], purposeHint?: string): string {
  const purpose = purposeHint
    ? `\n사용자 힌트: 「${purposeHint}」`
    : '\n사용자 힌트: (없음 · 이미지만 보고 판단)';
  return `${paths.length}장의 이미지가 업로드되었습니다.${purpose}

각 이미지를 1~2문장으로 분석하고 (subject·tone·notes), 이 조합으로 만들 수 있는 카드뉴스 방향 3~4개를 추천하세요.
방향 후보 (참고 · 자유롭게 조합):
- "recruit-changupbaan": 창업반 15기 모집 (890만원)
- "recruit-easy": 이지 클래스 15기 모집 (69만원)
- "recruit-hyperreal": 극사실눈썹 강의 모집 (169만원)
- "founder-methodology": 원장 극사실 방법론 소개 (「결의 법칙 1234321」)
- "hyper-real-review": 시술 리얼 신뢰도 (Before/After)
- "atelier-mood": 아틀리에 · 브랜드 무드
- "custom": 자유 서술 (사용자가 직접 입력)

각 방향은 이미지 개수 대비 적합한 매거진 kind 시퀀스도 추천하세요:
kind 옵션: magazine-cover, hero-portrait, pullquote-editorial, macro-close-up,
before-after-split, case-study-detail, atelier-scene, cta-editorial

응답 JSON 스키마:
{
  "analyses": [
    { "index": 0, "path": "경로", "subject": "짧은 주제", "tone": "톤 태그", "notes": "1~2문장 관찰" }
  ],
  "directions": [
    {
      "key": "recruit-changupbaan",
      "label": "창업반 15기 모집 (6장)",
      "desc": "인물+커리큘럼+CTA 조합에 적합",
      "fitScore": 92,
      "suggestedKinds": ["magazine-cover", "hero-portrait", "pullquote-editorial", "case-study-detail", "hero-portrait", "cta-editorial"]
    }
  ],
  "rationale": "이 이미지 조합의 특징 1~2문장"
}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as { imagePaths?: string[]; purposeHint?: string };
    const paths = Array.isArray(body.imagePaths) ? body.imagePaths.filter((p) => typeof p === 'string' && p.length > 0) : [];
    if (paths.length === 0) return NextResponse.json({ ok: false, error: 'imagePaths required (min 1)' }, { status: 400 });
    if (paths.length > 12) return NextResponse.json({ ok: false, error: '최대 12장까지 (지금: ' + paths.length + ')' }, { status: 400 });

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ ok: false, error: 'GEMINI_API_KEY not set on server' }, { status: 500 });
    }

    const raw = await geminiVision(paths, buildPrompt(paths, body.purposeHint), {
      system: SYSTEM_PROMPT,
      temperature: 0.4,
      maxTokens: 3000,
    });

    // JSON 정제
    let clean = raw.trim();
    if (clean.startsWith('```')) clean = clean.replace(/^```(?:json)?\s*/, '').replace(/```$/, '').trim();
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace > 0) clean = clean.slice(firstBrace, lastBrace + 1);

    let parsed: {
      analyses?: ImageAnalysis[];
      directions?: DirectionOption[];
      rationale?: string;
    };
    try {
      parsed = JSON.parse(clean);
    } catch (e) {
      return NextResponse.json({
        ok: false,
        error: 'AI 응답 JSON 파싱 실패',
        raw: clean.slice(0, 500),
        detail: e instanceof Error ? e.message : 'parse error',
      }, { status: 502 });
    }

    // custom 옵션 강제 추가
    const directions = parsed.directions ?? [];
    if (!directions.find((d) => d.key === 'custom')) {
      directions.push({
        key: 'custom',
        label: '자유 서술 (직접 입력)',
        desc: '방향을 직접 정하고 초안 없이 편집기에서 시작',
        fitScore: 0,
        suggestedKinds: ['magazine-cover', 'hero-portrait'],
      });
    }

    const resp: AnalyzeResponse = {
      ok: true,
      count: paths.length,
      analyses: parsed.analyses ?? [],
      directions,
      rationale: parsed.rationale ?? '',
    };
    return NextResponse.json(resp);
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : 'analyze failed',
    }, { status: 500 });
  }
}
