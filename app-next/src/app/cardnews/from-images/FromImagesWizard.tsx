'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import type { Slide, LayoutKind, LangContent, InstagramAspect } from '../types';
import { ASPECT_META } from '../types';
import {
  FOUNDER_IMAGE_POOL,
  PORTRAIT_IMAGE_POOL,
  PRODUCT_IMAGE_POOL,
} from '@/lib/cardnews-agents/agents';
import { SlideRender } from '../SlideRender';
// 2026-07-27 · 대표님 지시 「최신 유행 카드뉴스 스타일 5개 중 선택」
import { STYLE_PRESET_LIST, type StylePresetKey } from '@/lib/cardnews-agents/style-presets';

/**
 * Image-First 3-step Wizard (2026-07-21 회의 · 대표님 요구)
 * Step 1: 이미지 다중 업로드 or 자산 인벤토리 선택 + 컨텍스트 힌트
 * Step 2: Gemini Vision 분석 → 방향 옵션 3~4개 대화형 제안
 * Step 3: 방향 선택 → 초안 프로젝트 자동 생성 → 편집기 리다이렉트
 */

type Uploaded = { path: string; name: string; size?: number };

type ImageAnalysis = {
  index: number;
  path: string;
  subject: string;
  tone: string;
  notes: string;
};
type DirectionOption = {
  key: string;
  label: string;
  desc: string;
  fitScore: number;
  suggestedKinds: string[];
};
type AnalyzeResponse = {
  ok: true;
  count: number;
  analyses: ImageAnalysis[];
  directions: DirectionOption[];
  rationale: string;
};

const PURPOSE_HINTS = [
  { key: 'recruit',      label: '모집',       hint: '학생 모집 · 창업반/이지/극사실' },
  { key: 'review',       label: '리뷰',       hint: '시술 리얼 · 신뢰도' },
  { key: 'methodology',  label: '방법론',     hint: '원장 결의 법칙 · 노하우' },
  { key: 'atelier',      label: '아틀리에',   hint: '공간 · 브랜드 무드' },
  { key: 'free',         label: '자유',       hint: '방향 없음 · AI가 판단' },
];

export default function FromImagesWizard() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [uploads, setUploads] = useState<Uploaded[]>([]);
  const [uploadedGallery, setUploadedGallery] = useState<string[]>([]);  // 방금 업로드한 이미지 (SAFE POOL 자동 등록용)
  const [purpose, setPurpose] = useState<string>('free');
  const [aspect, setAspect] = useState<InstagramAspect>('portrait');   // Phase C · 인스타 aspect
  const [slideCount, setSlideCount] = useState<number>(0);              // 0 = AI 자동 결정
  // 2026-07-27 · 대표님 지시 「최신 유행 카드뉴스 스타일 5개 선택」 · 기본 = 01 ARTbrows Style (원장 정본)
  const [stylePreset, setStylePreset] = useState<StylePresetKey>('artbrows-real');
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [pickPool, setPickPool] = useState<'all' | 'uploaded' | 'founder' | 'portrait' | 'product'>('all');
  // 2026-07-27 · 다중안 (Gemini 안정·실험 + OpenAI 안정·실험 = 4안) · 원장님이 선택 폭 극대화
  // pages/mobydick-detail-agent 이중안 → 4안 확장 (대표님 「많이 양산」 지시)
  type VariantKey = 'gemini-stable' | 'gemini-bold' | 'openai-stable' | 'openai-bold' | 'fallback';
  type Variant = { key: VariantKey; label: string; emoji: string; slides: Slide[] | null };
  const [dualDraft, setDualDraft] = useState<{
    dir: DirectionOption;
    kinds: LayoutKind[];
    variants: Variant[];
    fallback: Slide[];
  } | null>(null);
  const [chosenModel, setChosenModel] = useState<VariantKey | null>(null);

  const gallery = useMemo(() => {
    const uniq = (arr: string[]) => Array.from(new Set(arr));
    switch (pickPool) {
      case 'uploaded': return uniq(uploadedGallery);
      case 'founder':  return uniq(FOUNDER_IMAGE_POOL);
      case 'portrait': return uniq(PORTRAIT_IMAGE_POOL);
      case 'product':  return uniq(PRODUCT_IMAGE_POOL);
      default:         return uniq([...uploadedGallery, ...FOUNDER_IMAGE_POOL, ...PORTRAIT_IMAGE_POOL, ...PRODUCT_IMAGE_POOL]);
    }
  }, [pickPool, uploadedGallery]);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    setBusy(true); setErr(null);
    setUploadProgress({ done: 0, total: arr.length });
    try {
      // 병렬 업로드 · 완료 즉시 state 반영 (썸네일 바로 뜸)
      let done = 0;
      const jobs = arr.map(async (f) => {
        try {
          const fd = new FormData();
          fd.append('file', f);
          const r = await fetch('/api/cardnews/upload', { method: 'POST', body: fd });
          const j = await r.json();
          if (!r.ok) throw new Error(j?.error || 'upload failed');
          const item: Uploaded = { path: j.path, name: f.name, size: j.size };
          // 완료 즉시 반영 (uploads · uploadedGallery 둘 다)
          setUploads((prev) => [...prev, item]);
          setUploadedGallery((prev) => prev.includes(item.path) ? prev : [item.path, ...prev]);
          setPickPool('uploaded');  // 방금 올린 것으로 갤러리 시야 이동
          return item;
        } finally {
          done += 1;
          setUploadProgress({ done, total: arr.length });
        }
      });
      const results = await Promise.allSettled(jobs);
      const failures = results.filter((r) => r.status === 'rejected').length;
      if (failures > 0) setErr(`${arr.length - failures}장 성공 · ${failures}장 실패`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'upload failed');
    } finally {
      setBusy(false);
      setTimeout(() => setUploadProgress(null), 2000);
    }
  }
  function pickFromGallery(path: string) {
    if (uploads.find((u) => u.path === path)) {
      setUploads((prev) => prev.filter((u) => u.path !== path));
    } else if (uploads.length < 12) {
      setUploads((prev) => [...prev, { path, name: path.split('/').pop() ?? path }]);
    }
  }
  function removeUpload(path: string) {
    setUploads((prev) => prev.filter((u) => u.path !== path));
  }

  async function safeJson<T>(r: Response): Promise<T> {
    const text = await r.text();
    const ct = r.headers.get('content-type') || '';
    if (!ct.includes('json')) {
      // HTML 에러 페이지 (터널 502 · Gemini 과부하 · 서버 재시작 등)
      if (r.status === 502 || r.status === 503 || r.status === 504) {
        throw new Error(`서버가 잠깐 불안정합니다 (${r.status}). 20~30초 후 「다시 분석」 눌러주세요.`);
      }
      throw new Error(`서버 응답이 JSON이 아닙니다 (HTTP ${r.status}). 잠시 후 다시 시도해주세요.`);
    }
    try { return JSON.parse(text) as T; }
    catch { throw new Error(`AI 응답 파싱 실패 · 앞부분: ${text.slice(0, 200)}`); }
  }

  async function goToAnalyze() {
    if (uploads.length === 0) { setErr('이미지를 최소 1장 선택해주세요.'); return; }
    setStep(2); setBusy(true); setErr(null); setAnalysis(null);
    try {
      const hint = purpose === 'free' ? undefined : PURPOSE_HINTS.find((h) => h.key === purpose)?.hint;
      const r = await fetch('/api/cardnews/analyze-images', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagePaths: uploads.map((u) => u.path),
          purposeHint: hint,
        }),
      });
      const j = await safeJson<AnalyzeResponse | { ok: false; error: string }>(r);
      if (!('ok' in j) || !j.ok) throw new Error(('error' in j ? j.error : 'AI 분석 실패 (원인 미상)'));
      setAnalysis(j);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'analyze failed');
    } finally { setBusy(false); }
  }

  // 다중안 (Gemini 안정 · Gemini 실험 · OpenAI 안정 · OpenAI 실험 = 최대 4안) 병렬 생성
  // → 원장님이 4개 중 선택. 대표님 지시 「많이 양산해서 선택할 수 있게」 (2026-07-27)
  async function generateDual(dir: DirectionOption) {
    setBusy(true); setErr(null); setDualDraft(null); setChosenModel(null);
    try {
      let kinds = (dir.suggestedKinds ?? []).length > 0 ? dir.suggestedKinds : ['magazine-cover', 'hero-portrait'];
      const targetCount = slideCount > 0 ? slideCount : Math.min(kinds.length, 10);
      if (kinds.length > targetCount) kinds = kinds.slice(0, targetCount);
      while (kinds.length < targetCount) {
        const filler = kinds.includes('cta-editorial') ? 'hero-portrait' : 'cta-editorial';
        kinds.push(filler);
      }
      const kindArr = kinds as LayoutKind[];

      const baseBody = {
        direction: dir,
        analyses: analysis?.analyses ?? [],
        purposeHint: purpose === 'free' ? undefined : PURPOSE_HINTS.find((h) => h.key === purpose)?.hint,
        count: kindArr.length,
        // 2026-07-27 · 대표님 지시 「스타일 5개 중 선택」 → 카피 톤·레이아웃에 힌트 반영
        stylePreset,
      };
      async function fetchCopy(model: 'gemini' | 'openai', temperature: number, toneNote: string) {
        try {
          const r = await fetch('/api/cardnews/generate-copy', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...baseBody, model, temperature, toneNote }),
          });
          const j = await safeJson<{ ok: boolean; slides?: Array<{ index: number; kind: string; copy: Record<string, unknown> }>; error?: string }>(r);
          if (!j.ok || !Array.isArray(j.slides)) return null;
          return j.slides;
        } catch { return null; }
      }
      function assemble(aiCopies: Array<{ index: number; kind: string; copy: Record<string, unknown> }> | null): Slide[] {
        return kindArr.map((kind, i) => {
          const imagePath = uploads[i]?.path ?? pickPoolByKind(kind, i);
          const base = buildInitialSlide(kind, imagePath, i, dir);
          if (!aiCopies) return base;
          const c = aiCopies.find((c) => c.index === i && c.kind === kind)?.copy ?? aiCopies[i]?.copy;
          return c ? (mergeAICopy(base, c) as Slide) : base;
        });
      }

      const STABLE_TONE = '안정·정본 · 원장 어록·「털 같은 눈썹」 정중앙 · 매거진 정본 톤';
      const BOLD_TONE = '실험·대담 · 새로운 표현 · 리듬감 있는 짧은 문장 · 후크 강한 헤드라인 시도';
      const [g1, g2, o1, o2] = await Promise.all([
        fetchCopy('gemini', 0.55, STABLE_TONE),
        fetchCopy('gemini', 1.05, BOLD_TONE),
        fetchCopy('openai', 0.55, STABLE_TONE),
        fetchCopy('openai', 1.05, BOLD_TONE),
      ]);
      const fallback = assemble(null);
      const variants: Variant[] = [
        { key: 'gemini-stable', label: 'Gemini · 안정', emoji: '💎', slides: g1 ? assemble(g1) : null },
        { key: 'gemini-bold',   label: 'Gemini · 실험', emoji: '💠', slides: g2 ? assemble(g2) : null },
        { key: 'openai-stable', label: 'OpenAI · 안정', emoji: '🎯', slides: o1 ? assemble(o1) : null },
        { key: 'openai-bold',   label: 'OpenAI · 실험', emoji: '🎨', slides: o2 ? assemble(o2) : null },
      ];
      const anyOk = variants.some((v) => v.slides);
      if (!anyOk) {
        await confirmChoiceInternal(dir, kindArr, fallback, 'hardcoded');
        return;
      }
      setDualDraft({ dir, kinds: kindArr, variants, fallback });
      setStep(3);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'create failed');
      setStep(2);
    } finally {
      setBusy(false);
    }
  }

  async function confirmChoiceInternal(dir: DirectionOption, kinds: LayoutKind[], slides: Slide[], sourceLabel: string) {
    const now = new Date().toISOString();
    const slug = `${now.slice(0, 10)}-${dir.key}-${Math.floor(Math.random() * 9000 + 1000)}`;
    // 2026-07-27 · 대표님 지시 「스타일 5개 중 선택」 → 각 슬라이드에 stylePreset 주입
    const slidesWithStyle = slides.map((sl) => ({ ...sl, stylePreset } as Slide));
    const langContent: LangContent = { title: dir.label, slides: slidesWithStyle };
    const project = {
      id: slug,
      title: `${dir.label} (${sourceLabel})`,
      slug,
      status: 'draft' as const,
      createdAt: now,
      updatedAt: now,
      defaultLang: 'ko' as const,
      aspect,
      stylePreset,  // 프로젝트 레벨에도 저장 (편집기 기본값)
      translations: { ko: langContent, en: { title: '', slides: [] }, zh: { title: '', slides: [] } },
    };
    const r = await fetch('/api/cardnews', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project }),
    });
    const j = await safeJson<{ project?: { id: string }; error?: string }>(r);
    if (!r.ok) throw new Error(j?.error || 'create failed');
    if (!j.project?.id) throw new Error('프로젝트 저장 성공했지만 ID를 못 받았습니다.');
    router.push(`/cardnews/edit/${j.project.id}`);
  }

  async function confirmChoice(vkey: VariantKey) {
    if (!dualDraft) return;
    const { dir, kinds, variants, fallback } = dualDraft;
    let slides: Slide[]; let label: string;
    if (vkey === 'fallback') { slides = fallback; label = '하드코딩'; }
    else {
      const v = variants.find((x) => x.key === vkey);
      slides = v?.slides ?? fallback;
      label = v?.label ?? '하드코딩';
    }
    setChosenModel(vkey); setBusy(true); setErr(null);
    try {
      await confirmChoiceInternal(dir, kinds, slides, label);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'create failed');
      setBusy(false); setChosenModel(null);
    }
  }

  // ═══════════════ 렌더 ═══════════════
  return (
    <main style={s.wrap}>
      <div style={s.topbar}>
        <Link href="/cardnews" style={s.crumb}>← 목록</Link>
        <div style={s.title}>이미지로 시작 · 대화형 3-step</div>
        <div style={{ flex: 1 }} />
        <div style={s.stepPill}>Step {step} / 3</div>
      </div>

      <div style={s.stepBar}>
        <div style={{ ...s.stepDot, ...(step >= 1 ? s.stepDotActive : {}) }}>1</div>
        <div style={s.stepLine} />
        <div style={{ ...s.stepDot, ...(step >= 2 ? s.stepDotActive : {}) }}>2</div>
        <div style={s.stepLine} />
        <div style={{ ...s.stepDot, ...(step >= 3 ? s.stepDotActive : {}) }}>3</div>
      </div>

      {err ? <div style={s.errBar}>⚠ {err}</div> : null}

      {step === 1 ? (
        <section style={s.card}>
          <h2 style={s.h2}>1. 이미지 던져주세요 (최대 12장)</h2>
          <p style={s.pMuted}>AI가 이미지를 이해한 뒤 어떤 카드뉴스로 만들지 대화형으로 안내합니다.</p>

          {/* 업로드 · 드래그 드롭 · 진행률 표시 */}
          <div
            onClick={() => busy ? null : fileRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); if (!busy) uploadFiles(e.dataTransfer.files); }}
            onDragOver={(e) => e.preventDefault()}
            style={{ ...s.dropZone, cursor: busy ? 'wait' : 'pointer' }}>
            <div className={busy ? 'ab-spin' : undefined} style={{ fontSize: 30, marginBottom: 10, display: 'inline-block' }}>
              {busy ? '⏳' : '📁'}
            </div>
            <div style={{ fontSize: 14, color: 'var(--ab-gold-light)', fontFamily: 'var(--ab-font-body-latin)', letterSpacing: '0.12em', fontWeight: 700 }}>
              {busy && uploadProgress
                ? `업로드 중… ${uploadProgress.done} / ${uploadProgress.total}`
                : busy ? '업로드 중…' : '클릭 or 파일 드래그'}
            </div>
            {/* 진행률 바 */}
            {busy && uploadProgress ? (
              <div style={{ marginTop: 14, width: '100%', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto', height: 6, background: '#1A1512', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.round((uploadProgress.done / uploadProgress.total) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--ab-gold-deep), var(--ab-gold))',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            ) : null}
            <div style={{ fontSize: 11.5, color: 'var(--ab-text-muted)', marginTop: 8 }}>
              여러 파일 동시 선택 가능 · PNG · JPG · WEBP
            </div>
            {/* 최근 업로드 성공 미리 알림 */}
            {uploadedGallery.length > 0 && !busy ? (
              <div style={{ marginTop: 12, padding: '6px 12px', display: 'inline-block', background: 'rgba(201, 166, 107, 0.1)', border: '1px solid var(--ab-gold-line)', borderRadius: 3, fontSize: 11, color: 'var(--ab-gold-light)' }}>
                ✓ 최근 {uploadedGallery.length}장 업로드 완료 · 아래 「업로드 (신규)」에서 확인
              </div>
            ) : null}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => { uploadFiles(e.target.files); e.target.value = ''; }}
          />

          {/* 자산 인벤토리 (SAFE POOL + 방금 업로드) */}
          <div style={{ marginTop: 24 }}>
            <div style={s.sectionLabel}>또는 · 자산 인벤토리에서 선택 (업로드한 이미지도 여기 자동 등록)</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {(['all', 'uploaded', 'founder', 'portrait', 'product'] as const).map((k) => {
                const disabled = k === 'uploaded' && uploadedGallery.length === 0;
                const count = k === 'uploaded' ? uploadedGallery.length
                  : k === 'founder' ? FOUNDER_IMAGE_POOL.length
                  : k === 'portrait' ? PORTRAIT_IMAGE_POOL.length
                  : k === 'product' ? PRODUCT_IMAGE_POOL.length
                  : uploadedGallery.length + FOUNDER_IMAGE_POOL.length + PORTRAIT_IMAGE_POOL.length + PRODUCT_IMAGE_POOL.length;
                return (
                  <button key={k} type="button" onClick={() => setPickPool(k)} disabled={disabled}
                    title={disabled ? '아직 업로드한 이미지가 없어요' : undefined}
                    style={{ ...s.chip, ...(k === pickPool ? s.chipActive : {}), opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
                    {k === 'all' ? '전체' : k === 'uploaded' ? '★ 업로드 (신규)' : k === 'founder' ? '원장·아틀리에' : k === 'portrait' ? '인물·시술' : '매크로'} <span style={{ opacity: 0.6, marginLeft: 4 }}>{count}</span>
                  </button>
                );
              })}
            </div>
            <div style={s.gallery}>
              {gallery.map((src) => {
                const selected = !!uploads.find((u) => u.path === src);
                return (
                  <button key={src} type="button" onClick={() => pickFromGallery(src)}
                    style={{ ...s.thumb, borderColor: selected ? 'var(--ab-gold)' : 'transparent' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }} />
                    {selected ? <div style={s.thumbSelected}>●</div> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 선택된 이미지 목록 */}
          {uploads.length > 0 ? (
            <div style={{ marginTop: 24 }}>
              <div style={s.sectionLabel}>선택된 이미지 · {uploads.length}장</div>
              <div style={s.pickList}>
                {uploads.map((u, i) => (
                  <div key={u.path + i} style={s.pickItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.path} alt="" style={{ width: 60, height: 75, objectFit: 'cover' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }} />
                    <div style={{ flex: 1, fontSize: 11, color: 'var(--ab-text-soft)', overflowWrap: 'anywhere' }}>
                      <div style={{ opacity: 0.7 }}>#{i + 1}</div>
                      <div style={{ marginTop: 2 }}>{u.name}</div>
                    </div>
                    <button onClick={() => removeUpload(u.path)}
                      style={{ background: 'transparent', color: '#E8B0B0', border: '1px solid var(--ab-line)', padding: '4px 8px', cursor: 'pointer', borderRadius: 3, fontSize: 12 }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* 컨텍스트 힌트 */}
          <div style={{ marginTop: 28 }}>
            <div style={s.sectionLabel}>어떤 용도인가요? (선택 · AI가 방향 판단에 참고)</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PURPOSE_HINTS.map((p) => (
                <button key={p.key} onClick={() => setPurpose(p.key)}
                  style={{ ...s.chip, ...(p.key === purpose ? s.chipActive : {}) }}>
                  {p.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ab-text-muted)' }}>
              선택: {PURPOSE_HINTS.find((p) => p.key === purpose)?.hint}
            </div>
          </div>

          {/* 2026-07-27 · 대표님 지시 「최신 유행 카드뉴스 스타일 5개 선택」 · Custom 포함 6종 */}
          <div style={{ marginTop: 28 }}>
            <div style={s.sectionLabel}>🎨 카드뉴스 스타일 (인스타 최신 유행 5종 + Custom)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {STYLE_PRESET_LIST.map((p) => {
                const active = p.key === stylePreset;
                return (
                  <button key={p.key} onClick={() => setStylePreset(p.key as StylePresetKey)} type="button"
                    style={{
                      textAlign: 'left', padding: '14px 14px 12px', cursor: 'pointer',
                      background: active ? 'rgba(224,192,136,0.10)' : 'var(--ab-black-2)',
                      border: `1px solid ${active ? 'var(--ab-gold)' : 'var(--ab-line)'}`,
                      borderRadius: 4, transition: 'all .15s',
                      boxShadow: active ? '0 0 0 3px rgba(224,192,136,0.15)' : 'none',
                    }}
                    title={p.useCase}>
                    <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10, letterSpacing: '.2em', color: active ? 'var(--ab-gold)' : 'var(--ab-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                      {active ? '★ SELECTED' : `#${p.order}`}
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: active ? 'var(--ab-gold-light)' : 'var(--ab-text)', marginBottom: 4, lineHeight: 1.3 }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ab-text-muted)', lineHeight: 1.5 }}>
                      {p.useCase.slice(0, 60)}{p.useCase.length > 60 ? '…' : ''}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ab-text-muted)' }}>
              선택된 스타일이 4안 양산 시 카피 톤·레이아웃 힌트에 반영됩니다.
            </div>
          </div>

          {/* Phase C · 인스타 aspect + 슬라이드 개수 */}
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            <div>
              <div style={s.sectionLabel}>인스타 규격</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(Object.keys(ASPECT_META) as InstagramAspect[]).map((k) => (
                  <button key={k} onClick={() => setAspect(k)}
                    style={{ ...s.chip, ...(k === aspect ? s.chipActive : {}) }}
                    title={ASPECT_META[k].use}>
                    {ASPECT_META[k].label.split('·')[0].trim()}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ab-text-muted)' }}>
                {ASPECT_META[aspect].size} · {ASPECT_META[aspect].use}
              </div>
            </div>
            <div>
              <div style={s.sectionLabel}>슬라이드 개수 (인스타 캐러셀 상한 10)</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[0, 4, 5, 6, 7, 8, 10].map((n) => (
                  <button key={n} onClick={() => setSlideCount(n)}
                    style={{ ...s.chip, ...(n === slideCount ? s.chipActive : {}) }}>
                    {n === 0 ? 'AI 자동' : `${n}장`}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ab-text-muted)' }}>
                {slideCount === 0 ? 'AI가 방향에 맞춰 결정' : `고정: ${slideCount}장`}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Link href="/cardnews" style={s.btnGhost}>취소</Link>
            <button onClick={goToAnalyze} disabled={uploads.length === 0 || busy} style={s.btnPrimary}>
              {busy ? '⏳ 진행 중…' : `다음 → AI 분석 (${uploads.length}장)`}
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section style={s.card}>
          <h2 style={s.h2}>2. AI 분석 + 방향 추천</h2>
          <p style={s.pMuted}>Gemini Vision (<b style={{ color: 'var(--ab-gold)' }}>3.1 Pro</b> 최신 · 실패 시 3.0 Pro → 3 Flash 자동 폴백) 이 각 이미지를 이해한 뒤, 이 조합으로 만들 수 있는 카드뉴스 방향을 추천합니다.</p>

          {/* 에러 발생 시 재시도 강조 */}
          {err && !busy && !analysis ? (
            <div style={{ padding: 20, textAlign: 'center' }}>
              <button onClick={goToAnalyze} style={{ ...s.btnPrimary, marginRight: 8 }}>🔄 다시 분석</button>
              <button onClick={() => { setStep(1); setErr(null); }} style={s.btnGhost}>← 이미지 다시</button>
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ab-text-muted)' }}>
                이미지·설정은 그대로 유지됩니다.
              </div>
            </div>
          ) : null}

          {busy ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ab-text-muted)' }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>🤖</div>
              <div>{uploads.length}장 이미지 분석 중…</div>
              <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>보통 10~20초 소요</div>
            </div>
          ) : analysis ? (
            <>
              {/* 이미지별 분석 */}
              <div style={{ marginBottom: 24 }}>
                <div style={s.sectionLabel}>이미지별 인식 결과</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                  {analysis.analyses.map((a, i) => (
                    <div key={i} style={s.analysisCard}>
                      {uploads[a.index]?.path ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={uploads[a.index].path} alt="" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: 2, marginBottom: 6 }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }} />
                      ) : null}
                      <div style={{ fontSize: 10.5, color: 'var(--ab-gold)', letterSpacing: '0.15em', fontFamily: 'var(--ab-font-body-latin)', textTransform: 'uppercase', fontWeight: 700 }}>
                        #{a.index + 1} · {a.tone}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--ab-ivory)', marginTop: 3, fontWeight: 600 }}>{a.subject}</div>
                      <div style={{ fontSize: 11, color: 'var(--ab-text-muted)', marginTop: 4, lineHeight: 1.5 }}>{a.notes}</div>
                    </div>
                  ))}
                </div>
              </div>

              {analysis.rationale ? (
                <div style={s.rationale}>💡 {analysis.rationale}</div>
              ) : null}

              {/* 방향 옵션 */}
              <div>
                <div style={s.sectionLabel}>💡 이 조합으로 만들 수 있는 방향 · {analysis.directions.length}가지</div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {analysis.directions.map((d) => (
                    <button key={d.key} onClick={() => generateDual(d)}
                      disabled={busy}
                      style={s.dirCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                        <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 15, fontWeight: 700, color: 'var(--ab-ivory)' }}>{d.label}</div>
                        {d.fitScore > 0 ? (
                          <div style={{ fontSize: 10.5, color: 'var(--ab-gold)', fontFamily: 'var(--ab-font-body-latin)', letterSpacing: '0.15em' }}>FIT {d.fitScore}</div>
                        ) : null}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ab-text-muted)', lineHeight: 1.5 }}>{d.desc}</div>
                      <div style={{ marginTop: 6, fontSize: 10, color: 'var(--ab-gold-light)', opacity: 0.7, fontFamily: 'monospace', letterSpacing: '0.03em' }}>
                        {d.suggestedKinds.slice(0, 6).join(' → ')}{d.suggestedKinds.length > 6 ? ' …' : ''}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'space-between' }}>
                <button onClick={() => { setStep(1); setAnalysis(null); }} style={s.btnGhost}>← 이미지 다시</button>
                <button onClick={goToAnalyze} style={s.btnGhost}>다시 분석</button>
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      {step === 3 ? (
        <section style={s.card}>
          {!dualDraft && busy ? (
            <>
              <h2 style={s.h2}>3. 4가지 안 동시 양산 중… (Gemini 2 + OpenAI 2)</h2>
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--ab-text-muted)' }}>
                <div className="ab-spin" style={{ fontSize: 32, marginBottom: 12, display: 'inline-block' }}>✨</div>
                <div style={{ fontSize: 14, marginBottom: 4 }}>Gemini 안정·실험 + OpenAI 안정·실험 = 4안 각 {slideCount || 6}장</div>
                <div style={{ fontSize: 11.5, opacity: 0.7 }}>보통 20~40초 · 완료되면 4안 나란히 미리보고 선택</div>
              </div>
            </>
          ) : dualDraft ? (
            <>
              <h2 style={s.h2}>3. 4가지 안 중 마음에 드는 것을 선택하세요</h2>
              <p style={s.pMuted}>Gemini 안정·실험 + OpenAI 안정·실험 = <b style={{ color: 'var(--ab-gold)' }}>4안 각 {dualDraft.kinds.length}장</b> · 원장님이 선택 → 편집기에서 자유롭게 수정</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 16 }}>
                {dualDraft.variants.map((v) => {
                  const isChosen = chosenModel === v.key;
                  const disabled = !v.slides || (chosenModel !== null && chosenModel !== v.key);
                  return (
                    <div key={v.key} style={{
                      padding: 14, background: '#0B0907', border: `2px solid ${isChosen ? 'var(--ab-gold)' : 'var(--ab-line)'}`,
                      borderRadius: 6, opacity: disabled && !isChosen ? 0.5 : 1, transition: 'all .2s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>{v.emoji}</span>
                        <span style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 15, fontWeight: 700, color: 'var(--ab-ivory)' }}>{v.label}</span>
                        {!v.slides ? <span style={{ marginLeft: 'auto', fontSize: 10, color: '#E8B0B0' }}>실패</span> : null}
                      </div>

                      {v.slides ? (
                        <div style={{ maxHeight: 380, overflowY: 'auto', paddingRight: 4, marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {v.slides.map((slide, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                              <div style={{ position: 'absolute', top: 3, left: 3, background: 'rgba(0,0,0,.6)', color: 'var(--ab-gold-light)', fontSize: 9, letterSpacing: '.1em', padding: '1px 5px', borderRadius: 2, zIndex: 5, fontFamily: 'var(--ab-font-body-latin)' }}>
                                {String(i + 1).padStart(2, '0')}
                              </div>
                              <SlideRender slide={slide} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding: 16, background: '#0F0D0B', border: '1px dashed var(--ab-line)', borderRadius: 4, textAlign: 'center', color: '#8A7B6C', fontSize: 11, marginBottom: 10 }}>
                          API 오류로 실패 · 다른 안 선택
                        </div>
                      )}

                      <button
                        onClick={() => confirmChoice(v.key)}
                        disabled={!v.slides || busy || (chosenModel !== null && chosenModel !== v.key)}
                        style={{
                          width: '100%', padding: '10px', border: 'none', borderRadius: 4,
                          background: !v.slides || (chosenModel !== null && chosenModel !== v.key) ? '#3A2E26' : 'linear-gradient(135deg,#E0C088,#B08862)',
                          color: '#0B0907', fontWeight: 800, fontSize: 12.5, letterSpacing: '.02em',
                          cursor: !v.slides || busy || (chosenModel !== null && chosenModel !== v.key) ? 'not-allowed' : 'pointer',
                        }}>
                        {isChosen && busy ? '⏳ 저장 중…' : `✅ 이 안으로 확정`}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <button onClick={() => { setStep(2); setDualDraft(null); setChosenModel(null); }} style={s.btnGhost}>← 방향 다시</button>
                <button onClick={() => dualDraft && generateDual(dualDraft.dir)} disabled={busy} style={s.btnGhost}>
                  🔄 4안 다시 양산
                </button>
                {dualDraft.variants.every((v) => !v.slides) ? (
                  <button onClick={() => confirmChoice('fallback')} disabled={busy} style={s.btnGhost}>
                    안전망 안 (하드코딩) 으로 진행
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ab-text-muted)' }}>대기 중…</div>
          )}
        </section>
      ) : null}
    </main>
  );
}

// ═══════════ Phase B · kind별 SAFE POOL 매핑 ═══════════
function pickPoolByKind(kind: LayoutKind, index: number): string {
  const portraitKinds = new Set(['magazine-cover', 'hero-portrait', 'atelier-scene', 'portrait-frame', 'cover-founder']);
  const productKinds  = new Set(['macro-close-up', 'before-after-split', 'product-hero']);
  const pool = portraitKinds.has(kind) ? PORTRAIT_IMAGE_POOL
             : productKinds.has(kind)  ? PRODUCT_IMAGE_POOL
             : FOUNDER_IMAGE_POOL;
  return pool[index % pool.length] ?? '';
}

// ═══════════ AI 카피 병합 헬퍼 (Phase A) ═══════════
// AI가 반환한 copy 객체의 유효한 필드만 슬라이드에 덮어씀 · 이미지 필드는 보존
function mergeAICopy(base: Slide, copy: Record<string, unknown>): Slide {
  const merged = { ...(base as unknown as Record<string, unknown>) };
  const IMAGE_FIELDS = new Set(['imageSrc', 'imageAlt', 'beforeSrc', 'afterSrc', 'beforeAlt', 'afterAlt']);
  for (const [k, v] of Object.entries(copy)) {
    if (IMAGE_FIELDS.has(k)) continue;  // 이미지 경로는 buildInitialSlide 것 유지
    if (v === null || v === undefined) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    merged[k] = v;
  }
  return merged as unknown as Slide;
}

// ═══════════ 초안 슬라이드 생성 헬퍼 ═══════════

function buildInitialSlide(kind: LayoutKind, imagePath: string, index: number, dir: DirectionOption): Slide {
  const base = { kind, category: 'founder' as const };
  const label = dir.label;
  switch (kind) {
    case 'magazine-cover':
      return { ...base, volume: `ISSUE ${new Date().toISOString().slice(0, 7).replace('-', '.')}`, brand: 'ARTBROWS', headline: label, subheadline: '', imageSrc: imagePath, signatureLabel: 'MIJI JANG · 2026' } as Slide;
    case 'hero-portrait':
      return { ...base, imageSrc: imagePath, bottomLabel: '털 같은 눈썹' } as Slide;
    case 'macro-close-up':
      return { ...base, imageSrc: imagePath, overlayLabel: 'HYPER REAL', quote: '결이 살아있는 눈썹', by: 'Miji Jang' } as Slide;
    case 'pullquote-editorial':
      return { ...base, quote: '고객이 원하는 것은\n그린 눈썹이 아니라\n털 같은 눈썹이다.', signature: 'Miji Jang', signatureRole: 'ARTBROWS FOUNDER · 20 YEARS' } as Slide;
    case 'case-study-detail':
      return { ...base, eyebrow: `CURRICULUM · ${label}`, leftTitle: '통합 커리큘럼', leftItems: [
        { num: '01', text: '이지클래스 × 1회', sub: '5주 15h · 반영구 입문 정석' },
        { num: '02', text: '소묘 × 3회', sub: '눈썹결의 원리' },
        { num: '03', text: '극사실눈썹 × 5회', sub: '원장 시연 관찰 + 실습' },
      ], rightHeadline: label, rightPrice: '890만원', rightFootnote: '6개월 + 추가 6개월 무제한 실습' } as Slide;
    case 'atelier-scene':
      return { ...base, imageSrc: imagePath, eyebrow: 'SEONLEUNG · 원장 1:1 지도', headline: '손끝의 무게,\n30년 경력.', bottomColumns: [
        { label: '본원', value: '선릉·삼성' },
        { label: '경력', value: '20년+' },
        { label: '수강 배출', value: '900여명' },
      ] } as Slide;
    case 'cta-editorial':
      return { ...base, headline: '지금, 원장님과\n소수 정예로 시작하세요.', highlight: '소수 정예', signature: 'Miji Jang', cta: '교육 상담 신청 →', ctaHref: '/enroll', subline: '선릉 본원 · 1:1 코칭' } as Slide;
    case 'before-after-split':
      return { ...base, beforeSrc: imagePath, afterSrc: imagePath, beforeLabel: 'BEFORE', afterLabel: 'AFTER', bottomStrip: '클레임 거의 0 · 30년 노하우' } as Slide;
    default:
      return { ...base, headline: `${label} · ${index + 1}`, imageSrc: imagePath } as unknown as Slide;
  }
}

const s = {
  wrap: { minHeight: '100vh', background: 'var(--ab-black)', color: 'var(--ab-ivory)', padding: '20px 24px 60px', fontFamily: 'var(--ab-font-body)', maxWidth: 900, margin: '0 auto' } as React.CSSProperties,
  topbar: { display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--ab-line)', marginBottom: 16, flexWrap: 'wrap' } as React.CSSProperties,
  crumb: { fontSize: 11.5, color: 'var(--ab-gold-light)', textDecoration: 'none', letterSpacing: '0.06em' } as React.CSSProperties,
  title: { fontFamily: 'var(--ab-font-headline)', fontSize: 18, fontWeight: 700 } as React.CSSProperties,
  stepPill: { padding: '4px 10px', border: '1px solid var(--ab-gold-line)', color: 'var(--ab-gold-light)', fontSize: 10.5, letterSpacing: '0.15em', fontFamily: 'var(--ab-font-body-latin)', fontWeight: 700, borderRadius: 3 } as React.CSSProperties,
  stepBar: { display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20, justifyContent: 'center' } as React.CSSProperties,
  stepDot: { width: 32, height: 32, borderRadius: '50%', background: 'transparent', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--ab-line)', color: 'var(--ab-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ab-font-body-latin)', fontSize: 13, fontWeight: 700 } as React.CSSProperties,
  stepDotActive: { background: 'var(--ab-gold)', color: 'var(--ab-black)', borderColor: 'var(--ab-gold)' } as React.CSSProperties,
  stepLine: { width: 60, height: 1, background: 'var(--ab-line)' } as React.CSSProperties,
  card: { padding: 24, background: '#0F0D0B', border: '1px solid var(--ab-line)', borderRadius: 6 } as React.CSSProperties,
  h2: { fontFamily: 'var(--ab-font-headline)', fontSize: 20, fontWeight: 700, marginBottom: 6 } as React.CSSProperties,
  pMuted: { color: 'var(--ab-text-muted)', fontSize: 13, marginBottom: 24, lineHeight: 1.7 } as React.CSSProperties,
  sectionLabel: { fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.2em', color: 'var(--ab-gold)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 } as React.CSSProperties,
  dropZone: { padding: 40, border: '2px dashed var(--ab-gold-line)', borderRadius: 4, textAlign: 'center', cursor: 'pointer', background: '#0B0907' } as React.CSSProperties,
  gallery: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 6, maxHeight: 260, overflowY: 'auto', padding: 8, background: '#0B0907', border: '1px solid var(--ab-line)', borderRadius: 3 } as React.CSSProperties,
  thumb: { padding: 0, borderWidth: 2, borderStyle: 'solid', borderColor: 'transparent', aspectRatio: '4/5', background: '#000', cursor: 'pointer', overflow: 'hidden', position: 'relative', borderRadius: 2 } as React.CSSProperties,
  thumbSelected: { position: 'absolute', top: 4, right: 4, background: 'var(--ab-gold)', color: 'var(--ab-black)', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 2 } as React.CSSProperties,
  pickList: { display: 'flex', gap: 8, flexWrap: 'wrap' } as React.CSSProperties,
  pickItem: { display: 'flex', gap: 10, alignItems: 'center', padding: 8, background: '#0B0907', border: '1px solid var(--ab-line)', borderRadius: 3, minWidth: 240 } as React.CSSProperties,
  chip: { padding: '6px 14px', background: 'transparent', color: 'var(--ab-text-soft)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--ab-line)', fontSize: 12, fontFamily: 'var(--ab-font-body)', cursor: 'pointer', borderRadius: 3 } as React.CSSProperties,
  chipActive: { background: 'var(--ab-gold)', color: 'var(--ab-black)', borderColor: 'var(--ab-gold)', fontWeight: 700 } as React.CSSProperties,
  btnGhost: { padding: '10px 18px', background: 'transparent', color: 'var(--ab-text-soft)', border: '1px solid var(--ab-line)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, cursor: 'pointer', borderRadius: 3, textDecoration: 'none', letterSpacing: '0.05em' } as React.CSSProperties,
  btnPrimary: { padding: '12px 22px', background: 'var(--ab-gold)', color: 'var(--ab-black)', border: 'none', fontFamily: 'var(--ab-font-body-latin)', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer', borderRadius: 3 } as React.CSSProperties,
  errBar: { padding: 10, background: '#3A1A1A', color: '#E8B0B0', borderRadius: 3, marginBottom: 14, fontSize: 12 } as React.CSSProperties,
  analysisCard: { padding: 10, background: '#0B0907', border: '1px solid var(--ab-line)', borderRadius: 3 } as React.CSSProperties,
  rationale: { padding: 12, background: 'rgba(201, 166, 107, 0.06)', border: '1px solid var(--ab-gold-line)', color: 'var(--ab-gold-light)', fontSize: 12.5, lineHeight: 1.7, borderRadius: 3, marginBottom: 20, fontStyle: 'italic' } as React.CSSProperties,
  dirCard: { padding: 14, background: '#0B0907', border: '1px solid var(--ab-line)', color: 'var(--ab-ivory)', cursor: 'pointer', borderRadius: 3, textAlign: 'left', fontFamily: 'inherit', transition: 'border-color .15s' } as React.CSSProperties,
};
