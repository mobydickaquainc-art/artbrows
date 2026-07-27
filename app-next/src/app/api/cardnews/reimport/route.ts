/**
 * POST /api/cardnews/reimport
 * body: multipart form
 *   - images[]        각 이미지 (여러 장 · 순서대로)
 *   - title           프로젝트 제목 (선택)
 *   - stylePreset     적용 스타일 프리셋 key
 *   - aiCopy          '1' 이면 OCR 로 detect 한 각 텍스트를 스타일에 맞게 재작성 (선택)
 * → 각 이미지 → 자동 OCR (Gemini Vision) → 편집 가능한 오버레이 배열 → image-with-overlay 슬라이드
 *   → 새 프로젝트 생성 → viewUrl 반환
 *
 * 2026-07-27 · 대표님 A안 확정 「OCR + 새 텍스트 오버레이」
 */

import { NextResponse } from 'next/server';
import { saveProject, normalizeId } from '@/lib/cardnews-storage';
import type { CardnewsProject } from '@/lib/cardnews-storage';
import type { Slide, TextOverlay, ImageWithOverlaySlide, CopyPaletteItem } from '@/app/cardnews/types';
import { getPreset, resolvePresetKey } from '@/lib/cardnews-agents/style-presets';
import { geminiVision } from '@/lib/cardnews-agents/models';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
export const maxDuration = 240;   // OCR 20장 넉넉히

const OCR_PROMPT = `이 카드뉴스 이미지에서 눈에 보이는 **모든 텍스트 (제목·본문·라벨·핸들·해시태그·서명 등)** 를 찾아 JSON 배열로만 응답.

각 텍스트마다 측정:
- text: 원본 문장 (한글·영문·숫자 정확히)
- x, y: 텍스트 블록 좌상단 좌표 (이미지 폭·높이 대비 % · 0~100)
- w, h: 텍스트 블록 폭·높이 (%)
- fontSizePct: 텍스트 높이가 이미지 높이의 몇 % (큰 헤드=8~15, 본문=3~5, 라벨=1.5~2.5)
- color: 텍스트 색 (HEX)
- bgColor: 텍스트 뒤 배경 대표색 (HEX · 마스크 용)
- weight: 'normal'|'medium'|'bold'|'black'
- align: 'left'|'center'|'right'
- fontFamily: 'serif'|'sans'|'display'

순수 JSON 배열만 (마크다운·설명 X). 텍스트 없으면 []. 여러 줄은 한 블록.`;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll('images').filter((f): f is File => f instanceof File);
    const rawTitle = String(form.get('title') || '').trim();
    const rawStyle = String(form.get('stylePreset') || 'artbrows-real');
    const stylePreset = resolvePresetKey(rawStyle);   // 폐기 key → 정본 자동 매핑
    const aiCopy = String(form.get('aiCopy') || '') === '1';
    if (!files.length) return NextResponse.json({ ok: false, error: 'images required' }, { status: 400 });
    if (files.length > 20) return NextResponse.json({ ok: false, error: '최대 20장 (지금: ' + files.length + ')' }, { status: 400 });
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ ok: false, error: 'GEMINI_API_KEY not set · OCR 불가' }, { status: 500 });

    const preset = getPreset(stylePreset);

    // 저장 폴더
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const projRoot = process.cwd();
    const dirName = `reimport-${ts}`;
    const uploadDir = path.join(projRoot, 'public', 'brand', dirName);
    await fs.mkdir(uploadDir, { recursive: true });

    // 각 이미지 저장
    const savedPaths: string[] = [];
    const savedWebPaths: string[] = [];
    const savedNames: string[] = [];
    let index = 1;
    for (const f of files) {
      const ext = (f.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
      const safeName = `${String(index).padStart(2, '0')}-${Date.now()}.${ext}`;
      const buf = Buffer.from(await f.arrayBuffer());
      await fs.writeFile(path.join(uploadDir, safeName), buf);
      savedPaths.push(path.join(uploadDir, safeName));
      savedWebPaths.push(`/brand/${dirName}/${safeName}`);
      savedNames.push(f.name || `slide-${index}`);
      index++;
    }

    // 각 이미지 OCR → 원본 텍스트를 감지해 palette 후보로 저장 (원본에 덮지 X)
    // 2026-07-27 대표님 지시: 「카피는 그냥 제시만 · 편집기에서 사각 박스로 배치」
    const ocrPerImage: TextOverlay[][] = [];
    for (let i = 0; i < savedPaths.length; i++) {
      try {
        const raw = await geminiVision([savedPaths[i]], OCR_PROMPT, { temperature: 0.15, maxTokens: 3072 });
        ocrPerImage.push(parseOverlays(raw));
      } catch (e) {
        console.warn(`[reimport ocr #${i}] fail:`, e);
        ocrPerImage.push([]);
      }
    }

    // palettePerImage · 각 이미지의 「카피 후보 상자」 (편집에서 클릭해 배치)
    // 원본 좌표·색·배경·정렬·폰트·굵기 전부 hint 로 보존 → 「원본 스타일 그대로 문장만 대체」 가능
    const palettePerImage: CopyPaletteItem[][] = ocrPerImage.map((list) =>
      list.map((o) => ({
        text: o.text,
        original: o.original ?? o.text,
        role: guessRole(o),
        hintX: o.x, hintY: o.y, hintW: o.w, hintH: o.h,
        hintFontSizePct: o.fontSizePct,
        hintColor: o.color,
        hintBgColor: o.bgColor,
        hintAlign: o.align,
        hintFontFamily: o.fontFamily,
        hintWeight: o.weight,
      }))
    );

    // (선택) aiCopy=true → 각 palette 항목 text 를 스타일 톤에 맞게 재작성 (original 은 보존)
    if (aiCopy) {
      const toneHints = (preset?.copyToneHints || []).join(' · ') || '원장 정본 톤';
      for (let i = 0; i < palettePerImage.length; i++) {
        const list = palettePerImage[i];
        if (list.length === 0) continue;
        try {
          const original = list.map((o, k) => `${k + 1}. "${o.original ?? o.text}"`).join('\n');
          const rewritePrompt = `다음 카드뉴스 이미지의 각 텍스트를 스타일 톤에 맞게 재작성하세요.
스타일 톤: ${toneHints}
브랜드: ARTbrows · 장미지 원장 · 극사실눈썹 창시자 · 「털 같은 눈썹」 어휘 유지.
원본 길이·역할을 유지하고 문장만 톤에 맞게 재작성. 원본이 좋으면 그대로.
숫자·핸들(@xxx)·해시태그·가격은 그대로.

원본:
${original}

JSON 배열로만 응답 (같은 개수·순서):
["재작성 1", "재작성 2", ...]`;
          const raw = await geminiVision([savedPaths[i]], rewritePrompt, { temperature: 0.55, maxTokens: 2048 });
          const arr = parseStringArray(raw);
          if (arr.length === list.length) {
            for (let k = 0; k < list.length; k++) {
              if (typeof arr[k] === 'string' && arr[k].trim()) {
                list[k].text = arr[k].trim();
              }
            }
          }
        } catch (e) {
          console.warn(`[reimport rewrite #${i}] fail:`, e);
        }
      }
    }

    // 슬라이드 조립 · 원본 이미지 그대로 (overlays = 빈 배열) + copyPalette 만 채움
    const slides: Slide[] = savedWebPaths.map((webPath, i) => {
      const slide: ImageWithOverlaySlide = {
        kind: 'image-with-overlay',
        category: 'founder',
        imageSrc: webPath,
        imageAlt: savedNames[i] || `slide-${i + 1}`,
        overlays: [],
        copyPalette: palettePerImage[i] || [],
        ocrProcessed: true,
      };
      return slide;
    });

    // 프로젝트 생성
    const projId = normalizeId(`reimport-${ts.slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`);
    const title = rawTitle || `[리뉴얼] 기존 카드뉴스 ${files.length}장 · ${ts.slice(0, 10)}`;
    const now = new Date().toISOString();
    const project: CardnewsProject = {
      id: projId,
      title,
      slug: projId,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      defaultLang: 'ko',
      translations: {
        ko: { title, slides },
        en: { title: '', slides: [] },
        zh: { title: '', slides: [] },
      },
      stylePreset,
    };
    await saveProject(project);

    const totalPalette = palettePerImage.reduce((s, arr) => s + arr.length, 0);
    return NextResponse.json({
      ok: true,
      projectId: projId,
      slideCount: slides.length,
      totalPaletteItems: totalPalette,
      dirName,
      viewUrl: `/cardnews/view/${projId}`,
      editUrl: `/cardnews/edit/${projId}`,
    });
  } catch (e) {
    console.error('[reimport]', e);
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : 'reimport failed' }, { status: 500 });
  }
}

function parseOverlays(raw: string): TextOverlay[] {
  let s = raw.trim().replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim();
  const first = s.indexOf('[');
  const last = s.lastIndexOf(']');
  if (first === -1 || last === -1) return [];
  try {
    const arr = JSON.parse(s.slice(first, last + 1));
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((o): o is Record<string, unknown> => o && typeof o === 'object')
      .map(normalizeOverlay)
      .filter((o): o is TextOverlay => o !== null);
  } catch { return []; }
}
function parseStringArray(raw: string): string[] {
  let s = raw.trim().replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim();
  const first = s.indexOf('['); const last = s.lastIndexOf(']');
  if (first === -1 || last === -1) return [];
  try {
    const arr = JSON.parse(s.slice(first, last + 1));
    return Array.isArray(arr) ? arr.map((v) => String(v ?? '').trim()).filter(Boolean) : [];
  } catch { return []; }
}
/** OCR 원본 텍스트의 역할을 크기·내용 heuristic 으로 추정 */
function guessRole(o: TextOverlay): CopyPaletteItem['role'] {
  const t = (o.text || '').trim();
  if (/^@/.test(t) || /^#/.test(t)) return 'label';
  if (/(신청|문의|바로가기|→|call|Call|Buy|카톡|kakao)/i.test(t)) return 'cta';
  if (/^"/.test(t) || /^「/.test(t) || /—\s*/.test(t)) return 'quote';
  const fs = o.fontSizePct ?? 4;
  if (fs >= 8) return 'headline';
  if (fs >= 5) return 'subheadline';
  if (fs >= 3.5) return 'body';
  return 'label';
}

function normalizeOverlay(o: Record<string, unknown>): TextOverlay | null {
  const text = typeof o.text === 'string' ? o.text.trim() : '';
  if (!text) return null;
  const num = (v: unknown, fb: number, mn: number, mx: number) => {
    const n = typeof v === 'number' ? v : Number(v);
    if (!Number.isFinite(n)) return fb;
    return Math.max(mn, Math.min(mx, n));
  };
  const str = (v: unknown, fb: string) => (typeof v === 'string' && v.trim() ? v.trim() : fb);
  const align = (() => {
    const a = String(o.align || '').toLowerCase();
    return a === 'center' || a === 'right' ? a as 'center' | 'right' : 'left' as const;
  })();
  const weight = (() => {
    const w = String(o.weight || '').toLowerCase();
    if (w === 'medium' || w === 'bold' || w === 'black') return w as 'medium' | 'bold' | 'black';
    return 'normal' as const;
  })();
  const family = (() => {
    const f = String(o.fontFamily || '').toLowerCase();
    if (f === 'serif' || f === 'display') return f as 'serif' | 'display';
    return 'sans' as const;
  })();
  return {
    text, original: text,
    x: num(o.x, 5, 0, 100), y: num(o.y, 5, 0, 100),
    w: num(o.w, 40, 1, 100), h: num(o.h, 8, 1, 100),
    fontSizePct: num(o.fontSizePct, 4, 0.5, 30),
    color: str(o.color, '#FFFFFF'),
    bgColor: str(o.bgColor, 'rgba(0,0,0,.55)'),
    weight, align, fontFamily: family, padding: 8,
  };
}
