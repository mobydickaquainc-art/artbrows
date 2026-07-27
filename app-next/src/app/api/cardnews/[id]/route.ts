import { NextResponse } from 'next/server';
import { getProject, saveProject, deleteProject, duplicateProject, type CardnewsProject } from '@/lib/cardnews-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Next.js 15+ App Router: params is a Promise
type Ctx = { params: Promise<{ id: string }> };

// GET /api/cardnews/[id] — 단건
export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const project = await getProject(id);
    if (!project) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ project });
  } catch (err) {
    console.error('[api/cardnews/[id] GET]', err);
    return NextResponse.json({ error: 'failed to fetch' }, { status: 500 });
  }
}

// PUT /api/cardnews/[id] — 수정 (전체 페이로드 교체)
export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const incoming = (body?.project ?? body) as Partial<CardnewsProject>;
    if (!incoming || typeof incoming !== 'object') {
      return NextResponse.json({ error: 'invalid body' }, { status: 400 });
    }
    const existing = await getProject(id);
    if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });
    const merged: CardnewsProject = {
      ...existing,
      ...incoming,
      id: existing.id,   // id 변경 금지
      createdAt: existing.createdAt,
    };
    const saved = await saveProject(merged);
    return NextResponse.json({ project: saved });
  } catch (err) {
    console.error('[api/cardnews/[id] PUT]', err);
    return NextResponse.json({ error: 'failed to update' }, { status: 500 });
  }
}

// DELETE /api/cardnews/[id]?mode=hard  → 물리 삭제
// DELETE /api/cardnews/[id]            → soft archive (권장)
export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode');
    if (mode === 'hard') {
      const ok = await deleteProject(id);
      if (!ok) return NextResponse.json({ error: 'not found' }, { status: 404 });
      return NextResponse.json({ ok: true, mode: 'hard' });
    }
    const existing = await getProject(id);
    if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });
    const archived = await saveProject({ ...existing, status: 'archived' });
    return NextResponse.json({ project: archived, mode: 'archive' });
  } catch (err) {
    console.error('[api/cardnews/[id] DELETE]', err);
    return NextResponse.json({ error: 'failed to delete' }, { status: 500 });
  }
}

// POST /api/cardnews/[id]?action=duplicate — 복제 (편의)
export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    if (action !== 'duplicate') {
      return NextResponse.json({ error: 'unknown action' }, { status: 400 });
    }
    const body = await req.json().catch(() => ({}));
    const duplicated = await duplicateProject(id, body?.title);
    if (!duplicated) return NextResponse.json({ error: 'source not found' }, { status: 404 });
    return NextResponse.json({ project: duplicated }, { status: 201 });
  } catch (err) {
    console.error('[api/cardnews/[id] POST]', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
