/**
 * POST /api/cardnews/reimagine-image
 * body: { originalPath: string, preset: 'anonymize'|'silhouette'|'back-view'|'illustration'|'artistic'|'custom', customPrompt?: string }
 * → Gemini 3.0+ Image Edit (폴백 체인)로 원본 재가공 → public/brand/uploads/reimagined/ 저장 → 새 경로 반환
 *
 * 2026-07-21 · 대표님 요구: 수강생·손님 얼굴 노출 방지 (익명화 4 프리셋 + 아트 리터치 + 자유 프롬프트)
 * 참고: [[artbrows-latest-model-principle-2026-07-21]] · 항상 최신 모델
 */

import { NextResponse } from 'next/server';
import { geminiImageEdit } from '@/lib/cardnews-agents/models';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Preset = 'anonymize' | 'silhouette' | 'back-view' | 'illustration' | 'artistic' | 'custom';

const PRESET_PROMPTS: Record<Exclude<Preset, 'custom'>, string> = {
  anonymize:
    'Same composition, lighting, atmosphere, and hairstyle as the original photo, but replace the subject\'s face with a completely different unrecognizable person (Korean woman, similar age range). Preserve the clothing, pose, background, ARTbrows Maison Noir mood (deep black + champagne gold). The face must not resemble the original person at all. Do not blur or mask — generate a fresh, natural face. Keep hyperrealistic beauty editorial quality.',
  silhouette:
    'Convert the photo to a moody silhouette portrait: the subject appears as a dark elegant silhouette against a softly lit deep black background with warm champagne gold rim light. Keep the hair and clothing outline recognizable but no facial features visible. Editorial Vogue Beauty silhouette aesthetic. Maison Noir palette.',
  'back-view':
    'Reframe as if the subject is turned away from the camera (back-of-head view), showing beautiful hair with warm rim light and the back of the neck, wearing the same clothing. Maintain the deep black background, warm bronze rim, Maison Noir prestige mood. Hyperrealistic beauty editorial.',
  illustration:
    'Transform into a minimal fine-line editorial illustration: elegant hand-drawn feel, warm sepia and champagne gold tones on soft cream background. Preserve the composition and pose. Vogue Beauty magazine illustration style. Not a photo — an illustration.',
  artistic:
    'Apply a subtle color-graded retouch: enhanced warm rim light on cheekbone, deeper black in the background, refined skin texture with hyperreal pore detail. Preserve identity fully. Maison Noir editorial polish. Kodak Portra 400 grain feel.',
};

async function ensureDir(p: string) { await fs.mkdir(p, { recursive: true }); }

export async function POST(req: Request) {
  try {
    const body = await req.json() as { originalPath?: string; preset?: Preset; customPrompt?: string };
    const { originalPath, preset, customPrompt } = body;
    if (!originalPath || typeof originalPath !== 'string') {
      return NextResponse.json({ ok: false, error: 'originalPath required' }, { status: 400 });
    }
    if (!preset) {
      return NextResponse.json({ ok: false, error: 'preset required' }, { status: 400 });
    }
    if (preset === 'custom' && (!customPrompt || customPrompt.length < 10)) {
      return NextResponse.json({ ok: false, error: 'customPrompt required (min 10 chars)' }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ ok: false, error: 'GEMINI_API_KEY not set on server' }, { status: 500 });
    }

    const prompt = preset === 'custom' ? (customPrompt as string) : PRESET_PROMPTS[preset];

    // Gemini 3.0+ 이미지 편집 · 폴백 체인
    const result = await geminiImageEdit(originalPath, prompt);

    // 결과 저장: /brand/uploads/reimagined/{basename}-{preset}-{ts}.png
    const outDir = path.join(process.cwd(), 'public', 'brand', 'uploads', 'reimagined');
    await ensureDir(outDir);
    const origBase = path.basename(originalPath).replace(/\.[^.]+$/, '');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const ext = result.mimeType.includes('jpeg') ? 'jpg' : result.mimeType.includes('webp') ? 'webp' : 'png';
    const filename = `${origBase.slice(0, 40)}-${preset}-${ts}.${ext}`.replace(/[^a-zA-Z0-9._-]/g, '_');
    const abs = path.join(outDir, filename);
    await fs.writeFile(abs, Buffer.from(result.base64, 'base64'));
    const webPath = `/brand/uploads/reimagined/${filename}`;

    return NextResponse.json({
      ok: true,
      path: webPath,
      preset,
      originalPath,
      size: Buffer.byteLength(result.base64, 'base64'),
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : 'reimagine failed',
    }, { status: 500 });
  }
}
