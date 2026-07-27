import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'brand', 'uploads');
const MAX_BYTES = 15 * 1024 * 1024;   // 15MB
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']);

function safeName(name: string): string {
  const base = name.replace(/[^\w.\-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return base || 'upload';
}

// POST /api/cardnews/upload
// multipart/form-data · field name: "file"
// returns: { path: "/brand/uploads/{filename}", size, type }
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file field required' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `too large (max ${MAX_BYTES / 1024 / 1024}MB)` }, { status: 413 });
    }
    if (file.type && !ALLOWED.has(file.type)) {
      return NextResponse.json({ error: `unsupported type: ${file.type}` }, { status: 415 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // 파일명 = 원본명 앞부분 + 타임스탬프 + 확장자 (중복 방지)
    const orig = safeName(file.name || 'upload');
    const dot = orig.lastIndexOf('.');
    const stem = dot > 0 ? orig.slice(0, dot) : orig;
    const ext = dot > 0 ? orig.slice(dot) : '';
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `${stem}-${ts}${ext}`;

    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buf);

    return NextResponse.json({
      path: `/brand/uploads/${filename}`,
      size: file.size,
      type: file.type,
      name: filename,
    }, { status: 201 });
  } catch (err) {
    console.error('[upload POST]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'upload failed' }, { status: 500 });
  }
}
