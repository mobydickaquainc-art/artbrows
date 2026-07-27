/**
 * POST /api/cardnews/analyze-region
 * body: { imagePath: string, bbox: { x, y, w, h } (% 좌표 · 0~100) }
 *
 * 원장님이 미리보기에서 마우스 드래그로 선택한 영역의 원본 텍스트·스타일·배경색을
 * Gemini Vision 이 정확히 detect 해서 반환 → 편집기가 「스타일 그대로 문장만 교체」 오버레이 생성.
 *
 * 2026-07-27 · 대표님 지시 「문장 교체 · 스타일 카피 · 배경 조화」
 */

import { NextResponse } from 'next/server';
import { geminiVision } from '@/lib/cardnews-agents/models';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface Bbox { x: number; y: number; w: number; h: number; }

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const imagePath = typeof body?.imagePath === 'string' ? body.imagePath : '';
    const bbox = normalizeBbox(body?.bbox);
    if (!imagePath) return NextResponse.json({ ok: false, error: 'imagePath required' }, { status: 400 });
    if (!bbox) return NextResponse.json({ ok: false, error: 'bbox required (x, y, w, h in %)' }, { status: 400 });
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ ok: false, error: 'GEMINI_API_KEY not set' }, { status: 500 });

    const prompt = `이 카드뉴스 이미지에서 **지정 영역** (좌상단 x=${bbox.x.toFixed(1)}%, y=${bbox.y.toFixed(1)}%, 폭 w=${bbox.w.toFixed(1)}%, 높이 h=${bbox.h.toFixed(1)}%) 을 자세히 관찰해 그 영역 안의 텍스트와 시각 특성을 JSON 으로만 반환하세요.

측정:
- text: 그 영역의 원본 문장 (한글·영문·숫자 정확히 · 여러 줄은 \\n 유지 · 없으면 빈 문자열)
- fontSizePct: 그 영역 텍스트 높이가 이미지 전체 높이의 몇 % (큰 헤드=8~15, 본문=3~5, 라벨=1.5~2.5)
- color: 텍스트 색 (HEX · 예: "#FFFFFF" · "#0A0806")
- bgColor: 텍스트가 놓인 배경의 대표색 (HEX 또는 rgba · 원본 텍스트를 자연스럽게 덮을 마스크 색 · 반투명이면 rgba(R,G,B,0.72) 형태)
- weight: 'normal'|'medium'|'bold'|'black'
- align: 'left'|'center'|'right'
- fontFamily: 'serif'(명조·세리프) | 'sans'(고딕·산세리프) | 'display'(장식체) | 'brush'(필기)
- surroundingDominantColor: 지정 영역 주변 배경 픽셀의 지배 색 (HEX · 마스크 배경 자동 매칭용)

순수 JSON 만 응답 (마크다운·설명 X):
{ "text": "...", "fontSizePct": 5, "color": "#FFFFFF", "bgColor": "rgba(60,45,35,.72)", "weight": "bold", "align": "left", "fontFamily": "sans", "surroundingDominantColor": "#3A2E26" }`;

    const raw = await geminiVision([imagePath], prompt, { temperature: 0.15, maxTokens: 1024 });
    const parsed = parseAnalysis(raw);
    return NextResponse.json({ ok: true, analysis: parsed, bbox });
  } catch (e) {
    console.error('[analyze-region]', e);
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : 'analyze failed' }, { status: 500 });
  }
}

function normalizeBbox(b: unknown): Bbox | null {
  if (!b || typeof b !== 'object') return null;
  const o = b as Record<string, unknown>;
  const num = (v: unknown): number | null => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const x = num(o.x), y = num(o.y), w = num(o.w), h = num(o.h);
  if (x === null || y === null || w === null || h === null) return null;
  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
    w: Math.max(0.5, Math.min(100, w)),
    h: Math.max(0.5, Math.min(100, h)),
  };
}

interface Analysis {
  text: string;
  fontSizePct: number;
  color: string;
  bgColor: string;
  weight: 'normal' | 'medium' | 'bold' | 'black';
  align: 'left' | 'center' | 'right';
  fontFamily: 'sans' | 'serif' | 'display' | 'brush' | 'heavy' | 'serif-latin';
  surroundingDominantColor?: string;
}

function parseAnalysis(raw: string): Analysis {
  let s = raw.trim().replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim();
  const first = s.indexOf('{');
  const last = s.lastIndexOf('}');
  if (first !== -1 && last !== -1) s = s.slice(first, last + 1);
  let j: Record<string, unknown> = {};
  try { j = JSON.parse(s); } catch { j = {}; }
  const str = (v: unknown, fb: string) => (typeof v === 'string' && v.trim() ? v.trim() : fb);
  const num = (v: unknown, fb: number, mn: number, mx: number) => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? Math.max(mn, Math.min(mx, n)) : fb;
  };
  const align = ((): Analysis['align'] => {
    const a = String(j.align || '').toLowerCase();
    return a === 'center' || a === 'right' ? a : 'left';
  })();
  const weight = ((): Analysis['weight'] => {
    const w = String(j.weight || '').toLowerCase();
    if (w === 'medium' || w === 'bold' || w === 'black') return w;
    return 'normal';
  })();
  const family = ((): Analysis['fontFamily'] => {
    const f = String(j.fontFamily || '').toLowerCase();
    if (f === 'serif' || f === 'display' || f === 'brush' || f === 'heavy' || f === 'serif-latin') return f;
    return 'sans';
  })();
  return {
    text: str(j.text, ''),
    fontSizePct: num(j.fontSizePct, 5, 0.5, 30),
    color: str(j.color, '#FFFFFF'),
    bgColor: str(j.bgColor, 'rgba(0,0,0,.55)'),
    weight,
    align,
    fontFamily: family,
    surroundingDominantColor: str(j.surroundingDominantColor, ''),
  };
}
