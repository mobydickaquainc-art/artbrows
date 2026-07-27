/**
 * POST /api/cardnews/ocr
 * body: { imagePath: string } (public/ 하위 웹 경로 · 예: "/brand/reimport-.../01.png")
 * → Gemini Vision 으로 이미지 내 모든 텍스트의 위치·크기·색상 detect
 * → { overlays: TextOverlay[] } 반환
 *
 * 2026-07-27 · 대표님 지시 「A안 · OCR + 오버레이 편집」
 */

import { NextResponse } from 'next/server';
import { geminiVision } from '@/lib/cardnews-agents/models';
import type { TextOverlay } from '@/app/cardnews/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const OCR_PROMPT = `이 카드뉴스 이미지에서 눈에 보이는 **모든 텍스트 (제목·본문·라벨·핸들·해시태그·서명 등)** 를 찾아 JSON 배열로 반환하세요.

각 텍스트마다 다음을 측정:
- text: 원본 문장 (한글·영문·숫자 정확히)
- x, y: 텍스트 블록의 좌상단 좌표 (이미지 전체 폭·높이 대비 % · 0~100)
- w, h: 텍스트 블록의 폭·높이 (% · 0~100)
- fontSizePct: 텍스트 높이가 이미지 전체 높이의 몇 % (예: 큰 헤드라인 = 8~15, 본문 = 3~5, 작은 라벨 = 1.5~2.5)
- color: 텍스트 색 (HEX · 예: "#FFFFFF" · "#0A0806" · "#E0C088")
- bgColor: 텍스트가 놓인 배경의 대표색 (HEX · 예: "#000000" · "#F5EDE3") — 이건 원본 지우기용 마스크 색
- weight: 'normal' | 'medium' | 'bold' | 'black' (굵기 판단)
- align: 'left' | 'center' | 'right'
- fontFamily: 'serif' (명조·세리프) | 'sans' (고딕·산세리프) | 'display' (장식체)

반드시 순수 JSON 배열만 응답 (마크다운·설명 X):
[
  { "text": "...", "x": 5.2, "y": 3.1, "w": 40, "h": 6, "fontSizePct": 5, "color": "#FFFFFF", "bgColor": "#000000", "weight": "bold", "align": "left", "fontFamily": "sans" },
  ...
]

주의:
- 텍스트가 없거나 안 보이면 빈 배열 [] 반환
- 위치 좌표는 이미지 좌상단이 (0,0), 우하단이 (100,100)
- 여러 줄 텍스트는 한 블록으로 (h 는 전체 높이)
- 로고·엠블럼은 텍스트로 취급하지 마시오 (아이콘성 그래픽 제외)
- 워터마크·핸들 (@xxx) 도 포함`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const imagePath = typeof body?.imagePath === 'string' ? body.imagePath : '';
    if (!imagePath) return NextResponse.json({ ok: false, error: 'imagePath required' }, { status: 400 });
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ ok: false, error: 'GEMINI_API_KEY not set' }, { status: 500 });

    const raw = await geminiVision([imagePath], OCR_PROMPT, { temperature: 0.15, maxTokens: 3072 });
    const parsed = parseOverlays(raw);
    return NextResponse.json({ ok: true, overlays: parsed, count: parsed.length });
  } catch (e) {
    console.error('[ocr]', e);
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : 'ocr failed' }, { status: 500 });
  }
}

function parseOverlays(raw: string): TextOverlay[] {
  let s = raw.trim();
  s = s.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim();
  const first = s.indexOf('[');
  const last = s.lastIndexOf(']');
  if (first === -1 || last === -1) return [];
  try {
    const arr = JSON.parse(s.slice(first, last + 1));
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((o): o is Record<string, unknown> => o && typeof o === 'object')
      .map((o) => normalizeOverlay(o))
      .filter((o): o is TextOverlay => o !== null);
  } catch {
    return [];
  }
}

function normalizeOverlay(o: Record<string, unknown>): TextOverlay | null {
  const text = typeof o.text === 'string' ? o.text.trim() : '';
  if (!text) return null;
  const num = (v: unknown, fallback: number, min: number, max: number): number => {
    const n = typeof v === 'number' ? v : Number(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  };
  const str = (v: unknown, fallback: string): string => (typeof v === 'string' && v.trim() ? v.trim() : fallback);
  const align = ((): 'left' | 'center' | 'right' => {
    const a = String(o.align || '').toLowerCase();
    return a === 'center' || a === 'right' ? a : 'left';
  })();
  const weight = ((): 'normal' | 'medium' | 'bold' | 'black' => {
    const w = String(o.weight || '').toLowerCase();
    if (w === 'medium' || w === 'bold' || w === 'black') return w;
    return 'normal';
  })();
  const family = ((): 'serif' | 'sans' | 'display' => {
    const f = String(o.fontFamily || '').toLowerCase();
    if (f === 'serif' || f === 'display') return f;
    return 'sans';
  })();
  return {
    text,
    original: text,
    x: num(o.x, 5, 0, 100),
    y: num(o.y, 5, 0, 100),
    w: num(o.w, 40, 1, 100),
    h: num(o.h, 8, 1, 100),
    fontSizePct: num(o.fontSizePct, 4, 0.5, 30),
    color: normalizeColor(str(o.color, '#FFFFFF')),
    bgColor: normalizeColor(str(o.bgColor, 'rgba(0,0,0,.55)')),
    weight,
    align,
    fontFamily: family,
    padding: 8,
  };
}

function normalizeColor(c: string): string {
  const s = c.trim();
  if (/^#[0-9a-f]{3,8}$/i.test(s)) return s;
  if (/^rgba?\(/i.test(s)) return s;
  // 색 이름은 그대로 통과 (브라우저가 해석)
  return s;
}
