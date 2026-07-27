import { NextResponse } from 'next/server';
import { listProjects, createProject, saveProject, type CardnewsProject } from '@/lib/cardnews-storage';

export const runtime = 'nodejs';           // 파일 시스템 접근 필요
export const dynamic = 'force-dynamic';    // 캐시 X

// GET /api/cardnews — 프로젝트 목록 (요약 · slides 제외)
export async function GET() {
  try {
    const items = await listProjects();
    return NextResponse.json({ items });
  } catch (err) {
    console.error('[api/cardnews GET]', err);
    return NextResponse.json({ error: 'failed to list' }, { status: 500 });
  }
}

// POST /api/cardnews
// body: { title, id? }                   → 빈 프로젝트 신규 생성 (createProject)
// body: { project: CardnewsProject }     → 전체 페이로드 저장 (JSON import 시)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // JSON import (전체 프로젝트 페이로드)
    if (body?.project && typeof body.project === 'object') {
      const project = body.project as CardnewsProject;
      if (!project.id || !project.title) {
        return NextResponse.json({ error: 'project.id / project.title required' }, { status: 400 });
      }
      const saved = await saveProject(project);
      return NextResponse.json({ project: saved }, { status: 201 });
    }

    // 신규 생성 (제목 + 선택 ID)
    const { title, id } = body ?? {};
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'title required' }, { status: 400 });
    }
    const project = await createProject({ title, id });
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error('[api/cardnews POST]', err);
    const msg = err instanceof Error ? err.message : 'failed to create';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
