/**
 * 카드뉴스 프로젝트 저장 · 모비딕 방식 (로컬 JSON + 파일 시스템)
 *
 * 저장 위치: app-next/content/cardnews/{id}.json
 * 참고 패턴: mobydick-hub/server/index.js · mobydick-detail-agent/agents/base.py
 *
 * 서버 사이드 전용 (Node runtime · fs 접근). Route Handler 에서만 import.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Slide, Lang, LangContent } from '@/app/cardnews/types';
import { LANGS } from '@/app/cardnews/types';

// SlideCopySet 형태 저장용 (auto-generated variants) · runtime 의존 X
export interface AutoVariant {
  source: string;                // 'gemini' | 'openai' | 'claude'
  slide: Slide;
}
export interface AutoSlideVariants {
  index: number;
  skeleton: { kind: string; category: string; rationale?: string };
  variants: AutoVariant[];
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'cardnews');

// ── 다국어 프로젝트 (2026-07-17 확장) ──
// 한 프로젝트 = 3 언어 (ko·en·zh) 각각 별도 title + slides
// 기존 `slides` / `title` 최상위 필드는 마이그레이션되어 translations.ko 로 자동 이동
export interface CardnewsProject {
  id: string;
  title: string;                              // 프로젝트 대표 제목 (관리용 · 언어 무관)
  slug: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  defaultLang: Lang;                          // 기본 언어 (미리보기 default)
  translations: Partial<Record<Lang, LangContent>>;  // 언어별 title + slides
  cover?: {
    imageSrc?: string;
    thumbHint?: string;
  };
  /**
   * 자동 생성 시 각 슬라이드 index 의 모든 모델 안 (사용자가 편집기에서 「대안 안 → 교체」)
   * 자동 생성 프로젝트만 있음. 수동 편집은 없어도 됨.
   */
  autoVariants?: AutoSlideVariants[];
  /** 인스타그램 aspect (2026-07-21 Phase C · Image-First wizard 저장) */
  aspect?: 'square' | 'portrait' | 'story';
  /**
   * 스타일 프리셋 key (2026-07-23 · 원장님 신 5종 승격)
   * · 뷰어/편집기 wrapper 에 해당 프리셋 클래스 반영 → chrome 자동 표시 여부 결정
   * · agents 자동 생성 시 프리셋 이름 기록용
   */
  stylePreset?: string;
  /** @deprecated 마이그레이션 완료 후 translations 만 사용 */
  slides?: Slide[];
}

// 목록용 요약 (translations 전체 제외 · slideCount 만)
export interface CardnewsProjectSummary {
  id: string;
  title: string;
  slug: string;
  status: CardnewsProject['status'];
  createdAt: string;
  updatedAt: string;
  cover?: CardnewsProject['cover'];
  defaultLang: Lang;
  langs: Partial<Record<Lang, number>>;       // { ko: 6, en: 0, zh: 0 } — 언어별 슬라이드 수
}

/** 마이그레이션 — 최상위 `slides` 만 있으면 translations.ko 로 이동 */
function migrate(raw: unknown): CardnewsProject {
  const p = raw as Partial<CardnewsProject> & { slides?: Slide[]; title?: string };
  const translations: Partial<Record<Lang, LangContent>> = p.translations ?? {};
  const defaultLang: Lang = p.defaultLang ?? 'ko';
  // 기존 최상위 slides 있으면 defaultLang(=ko) 로 이관
  if (p.slides && !translations[defaultLang]) {
    translations[defaultLang] = { title: p.title ?? '', slides: p.slides };
  }
  // 3 언어 모두 자리 확보 (없으면 빈 배열)
  for (const l of LANGS) {
    if (!translations[l]) translations[l] = { title: '', slides: [] };
  }
  return {
    id: p.id ?? '',
    title: p.title ?? translations[defaultLang]?.title ?? '',
    slug: p.slug ?? p.id ?? '',
    status: p.status ?? 'draft',
    createdAt: p.createdAt ?? new Date().toISOString(),
    updatedAt: p.updatedAt ?? new Date().toISOString(),
    defaultLang,
    translations,
    cover: p.cover,
    autoVariants: p.autoVariants,
    aspect: p.aspect,
    stylePreset: p.stylePreset,
  };
}

// ID 정규화 (slug-safe · 파일명 안전)
export function normalizeId(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  const safe = trimmed.replace(/[^a-z0-9\-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return safe || `project-${Date.now()}`;
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
}

function filePath(id: string): string {
  return path.join(CONTENT_DIR, `${id}.json`);
}

// ── 목록 ──
export async function listProjects(): Promise<CardnewsProjectSummary[]> {
  await ensureDir();
  const entries = await fs.readdir(CONTENT_DIR);
  const jsons = entries.filter((e) => e.endsWith('.json'));
  const summaries: CardnewsProjectSummary[] = [];
  for (const name of jsons) {
    try {
      const raw = await fs.readFile(path.join(CONTENT_DIR, name), 'utf-8');
      const p = migrate(JSON.parse(raw));
      const langs: Partial<Record<Lang, number>> = {};
      for (const l of LANGS) langs[l] = p.translations[l]?.slides?.length ?? 0;
      summaries.push({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        cover: p.cover,
        defaultLang: p.defaultLang,
        langs,
      });
    } catch (err) {
      console.error(`[cardnews-storage] failed to parse ${name}`, err);
    }
  }
  summaries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return summaries;
}

// ── 단건 조회 (마이그레이션 자동 적용) ──
export async function getProject(id: string): Promise<CardnewsProject | null> {
  const safeId = normalizeId(id);
  try {
    const raw = await fs.readFile(filePath(safeId), 'utf-8');
    return migrate(JSON.parse(raw));
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === 'ENOENT') return null;
    throw err;
  }
}

// ── 저장 (신규/수정 통합) — deprecated `slides` 는 제거 후 저장 ──
export async function saveProject(project: CardnewsProject): Promise<CardnewsProject> {
  await ensureDir();
  const safeId = normalizeId(project.id);
  const now = new Date().toISOString();
  const existing = await getProject(safeId);
  // 마이그레이션 적용 (혹시 legacy 페이로드가 들어와도 정리)
  const migrated = migrate(project);
  const merged: CardnewsProject = {
    ...migrated,
    id: safeId,
    slug: project.slug || safeId,
    createdAt: existing?.createdAt ?? project.createdAt ?? now,
    updatedAt: now,
  };
  // legacy 최상위 slides 는 저장에서 배제
  delete (merged as { slides?: Slide[] }).slides;
  await fs.writeFile(filePath(safeId), JSON.stringify(merged, null, 2), 'utf-8');
  return merged;
}

// ── 신규 생성 (defaultLang=ko · 3 언어 자리 확보 · ko 에 커버 1장) ──
export async function createProject(input: { title: string; id?: string; defaultLang?: Lang }): Promise<CardnewsProject> {
  const now = new Date().toISOString();
  const id = normalizeId(input.id || input.title || `project-${Date.now()}`);
  const existing = await getProject(id);
  if (existing) {
    throw new Error(`Project id already exists: ${id}`);
  }
  const defaultLang: Lang = input.defaultLang ?? 'ko';
  const title = input.title || '새 프로젝트';
  const seedSlide: Slide = {
    kind: 'cover-founder',
    category: 'founder',
    eyebrow: 'NEW PROJECT',
    headline: title,
    highlight: '',
  };
  const translations: Partial<Record<Lang, LangContent>> = {};
  for (const l of LANGS) {
    translations[l] = l === defaultLang
      ? { title, slides: [seedSlide] }
      : { title: '', slides: [] };
  }
  const project: CardnewsProject = {
    id,
    title,
    slug: id,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    defaultLang,
    translations,
  };
  return saveProject(project);
}

// ── 삭제 (soft — status=archived · 물리 삭제는 별도) ──
export async function archiveProject(id: string): Promise<CardnewsProject | null> {
  const p = await getProject(id);
  if (!p) return null;
  return saveProject({ ...p, status: 'archived' });
}

// ── 완전 삭제 ──
export async function deleteProject(id: string): Promise<boolean> {
  const safeId = normalizeId(id);
  try {
    await fs.unlink(filePath(safeId));
    return true;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === 'ENOENT') return false;
    throw err;
  }
}

// ── 복제 ──
export async function duplicateProject(id: string, newTitle?: string): Promise<CardnewsProject | null> {
  const src = await getProject(id);
  if (!src) return null;
  const now = new Date().toISOString();
  const newId = normalizeId(`${src.id}-copy-${Date.now()}`);
  const copy: CardnewsProject = {
    ...src,
    id: newId,
    slug: newId,
    title: newTitle || `${src.title} (복사본)`,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
  return saveProject(copy);
}
