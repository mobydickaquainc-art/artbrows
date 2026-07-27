'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SlideRender } from './SlideRender';
import type { Slide } from './types';
import { STYLE_PRESET_LIST, DEFAULT_STYLE_PRESET, type StylePresetKey } from '@/lib/cardnews-agents/style-presets';
import { COPY_TONE_META, type CopyTone } from '@/lib/cardnews-agents/types';

type ModelId = 'gemini' | 'openai' | 'claude';
type Lang = 'ko' | 'en' | 'zh';
type ModelMeta = { label: string; provider: string; strength: string; envKey: string };
type Skeleton = { kind: string; category: string; rationale?: string; copyTone?: CopyTone; imageSrcHint?: string };
type Variant = { source: ModelId; slide: Slide };
type CopySet = { index: number; skeleton: Skeleton; variants: Variant[] };

// 12종 kind · 6톤 category · 이미지 pool (design 스텝용)
const KIND_OPTIONS = [
  'cover-founder', 'number-big', 'icon-duo', 'icon-trio', 'checklist',
  'portrait-frame', 'product-hero', 'quote-bold', 'signature-style',
  'curriculum-row', 'price-table', 'closing-cta',
] as const;
const CATEGORY_OPTIONS = ['treatment', 'founder', 'review', 'classroom', 'detail', 'reels'] as const;
const IMAGE_POOL = {
  founder: [
    { path: '/brand/founder-key-visual-2026-07-17.png', label: 'Founder Key' },
    { path: '/brand/founder/2026-07-17-integrated-guide-1.png', label: 'Guide 1' },
    { path: '/brand/founder/2026-07-17-integrated-guide-2.png', label: 'Guide 2' },
  ],
  ref: [
    { path: '/brand/ref/01.jpg', label: 'Ref 01' },
    { path: '/brand/ref/02.jpg', label: 'Ref 02' },
    { path: '/brand/ref/03.jpg', label: 'Ref 03' },
    { path: '/brand/ref/04.jpg', label: 'Ref 04' },
    { path: '/brand/ref/05.jpg', label: 'Ref 05' },
  ],
  upload: [
    { path: '/brand/uploads/5-2026-07-18T11-27-13.jpg', label: 'Upload A' },
    { path: '/brand/uploads/IMG_4668-2026-07-18T11-23-14.JPG', label: 'Upload B' },
    { path: '/brand/uploads/IMG_4672-2026-07-18T11-25-22.JPG', label: 'Upload C' },
  ],
};
const IMAGE_KINDS = new Set(['cover-founder', 'portrait-frame', 'product-hero']);

const AUTO_ADVANCE_SEC = 20;

export function GenerateModal({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const router = useRouter();
  // 스텝: 'setup' → 'preparing' → 'design' (설계 편집) → 'slide' (각 슬라이드마다 팝업) → 'saving' → done
  const [step, setStep] = useState<'setup' | 'preparing' | 'design' | 'slide' | 'saving'>('setup');

  // 설정
  const [available, setAvailable] = useState<ModelId[]>([]);
  const [meta, setMeta] = useState<Record<string, ModelMeta>>({});
  const [purpose, setPurpose] = useState('');
  const [lang, setLang] = useState<Lang>('ko');
  const [slideCount, setSlideCount] = useState(6);
  const [selectedModels, setSelectedModels] = useState<ModelId[]>([]);
  const [stylePreset, setStylePreset] = useState<StylePresetKey>(DEFAULT_STYLE_PRESET);
  const [customBrief, setCustomBrief] = useState('');  // 11 Custom 자유 서술 (2026-07-20)
  const [useTrend, setUseTrend] = useState(false);
  const [useVision, setUseVision] = useState(false);
  const [useDesign, setUseDesign] = useState(false);  // ★ 2026-07-20 · default OFF = 자동 추천 (원장 확인 없이 빠르게) · ON = 수동 (추천 표시 · 원장 override)
  const [err, setErr] = useState<string | null>(null);

  // 진행 상태
  const [input, setInput] = useState<{ purpose: string; lang: Lang; slideCount: number; models: ModelId[]; stylePreset: StylePresetKey; options: { useTrendResearch: boolean; useVisionAnalysis: boolean } } | null>(null);
  const [skeletons, setSkeletons] = useState<Skeleton[]>([]);
  const [trendHints, setTrendHints] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chosenSlides, setChosenSlides] = useState<Slide[]>([]);         // 확정된 슬라이드 배열
  const [allCopySets, setAllCopySets] = useState<CopySet[]>([]);          // 모든 슬라이드의 모든 안 (편집기 대안 교체용)
  const [currentSet, setCurrentSet] = useState<CopySet | null>(null);
  const [pickedVariantIdx, setPickedVariantIdx] = useState(0);
  const [countdown, setCountdown] = useState(AUTO_ADVANCE_SEC);
  const [slideBusy, setSlideBusy] = useState(false);
  const [prepStage, setPrepStage] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) return;
    setStep('setup');
    setErr(null);
    (async () => {
      try {
        const r = await fetch('/api/cardnews/generate');
        const j = await r.json();
        setAvailable(j.available ?? []);
        setMeta(j.meta ?? {});
        setSelectedModels((j.available as ModelId[])?.slice(0, 2) ?? []);
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'failed');
      }
    })();
  }, [open]);

  // 카운트다운
  useEffect(() => {
    if (step !== 'slide' || !currentSet || slideBusy) return;
    setCountdown(AUTO_ADVANCE_SEC);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onNext();  // 자동 진행
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, currentSet, slideBusy]);

  function toggleModel(m: ModelId) {
    setSelectedModels((prev) => {
      if (prev.includes(m)) return prev.filter((x) => x !== m);
      if (prev.length >= 2) return [prev[1], m];
      return [...prev, m];
    });
  }

  async function onStart() {
    if (!purpose.trim()) { setErr('목적을 입력하세요'); return; }
    if (selectedModels.length === 0) { setErr('모델을 최소 1개 선택하세요'); return; }
    if (stylePreset === 'custom' && !customBrief.trim()) { setErr('Custom 스타일은 원장님 서술을 입력하세요'); return; }
    setErr(null);
    const _input = { purpose: purpose.trim(), lang, slideCount, models: selectedModels, stylePreset, customBrief: customBrief.trim() || undefined, options: { useTrendResearch: useTrend, useVisionAnalysis: useVision } };
    setInput(_input);
    setStep('preparing');
    setPrepStage('트렌드 조사 + 스타일리스트 실행 중…');
    try {
      const r = await fetch('/api/cardnews/generate/prepare', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(_input),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'prepare failed');
      setSkeletons(j.skeletons ?? []);
      setTrendHints(j.trendHints ?? '');
      setChosenSlides([]);
      setAllCopySets([]);
      setCurrentIdx(0);
      setPrepStage('');
      // 설계 편집 모드 → design 스텝 · 아니면 바로 slide
      if (useDesign) {
        setStep('design');
      } else {
        await fetchSlide(0, _input, j.skeletons ?? [], j.trendHints ?? '');
        setStep('slide');
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'prepare failed');
      setStep('setup');
    }
  }

  async function fetchSlide(idx: number, _input: typeof input, _skeletons: Skeleton[], _hints: string) {
    if (!_input || idx >= _skeletons.length) return;
    setSlideBusy(true);
    try {
      const r = await fetch('/api/cardnews/generate/slide', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: _input, skeleton: _skeletons[idx], index: idx, totalSlides: _skeletons.length, trendHints: _hints }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'slide failed');
      setCurrentSet(j.copySet);
      setPickedVariantIdx(0);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'slide failed');
    } finally { setSlideBusy(false); }
  }

  async function onNext() {
    if (!currentSet || !input) return;
    if (timerRef.current) clearInterval(timerRef.current);
    // 현재 슬라이드 확정 (+ copySet 도 누적 저장 → 편집기 대안 안 교체용)
    const chosen = currentSet.variants[pickedVariantIdx]?.slide;
    const nextChosen = chosen ? [...chosenSlides, chosen] : chosenSlides;
    const nextSets = [...allCopySets, currentSet];
    setChosenSlides(nextChosen);
    setAllCopySets(nextSets);
    const nextIdx = currentIdx + 1;
    if (nextIdx >= skeletons.length) {
      await onFinalize(nextChosen, nextSets);
      return;
    }
    setCurrentIdx(nextIdx);
    setCurrentSet(null);
    await fetchSlide(nextIdx, input, skeletons, trendHints);
  }

  async function onStop() {
    if (!input) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const chosen = currentSet?.variants[pickedVariantIdx]?.slide;
    const finalSlides = chosen ? [...chosenSlides, chosen] : chosenSlides;
    const finalSets = currentSet ? [...allCopySets, currentSet] : allCopySets;
    if (finalSlides.length === 0) { onClose(); return; }
    await onFinalize(finalSlides, finalSets);
  }

  async function onFinalize(slides: Slide[], copySets: CopySet[]) {
    setStep('saving');
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      const r = await fetch('/api/cardnews/generate/finalize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, slides, copySets }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'finalize failed');
      onDone();
      router.push(`/cardnews/edit/${j.project.id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'finalize failed');
      setStep('slide');
    }
  }

  if (!open) return null;

  // ── SETUP ──
  if (step === 'setup') return (
    <div onClick={onClose} style={styles.backdrop}>
      <div onClick={(e) => e.stopPropagation()} style={styles.modal}>
        <div style={styles.head}>
          <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 22, fontWeight: 800, color: 'var(--ab-ivory)' }}>🪄 카드뉴스 자동 생성</div>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>
        <div style={styles.subtitle}>슬라이드 한 장씩 · 팝업으로 확인 · 20초 후 자동 진행</div>

        <div style={styles.field}>
          <label style={styles.label}>목적 · 시리즈명</label>
          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="예: 15기 이지클래스 모집" style={styles.input} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={styles.field}>
            <label style={styles.label}>언어</label>
            <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} style={styles.input}>
              <option value="ko">한국어 · KO</option>
              <option value="en">English · EN</option>
              <option value="zh">中文 · 中</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>슬라이드 수</label>
            <select value={slideCount} onChange={(e) => setSlideCount(Number(e.target.value))} style={styles.input}>
              {[4, 5, 6, 7, 8, 10, 12].map((n) => <option key={n} value={n}>{n}장</option>)}
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>1️⃣ 첫 시작 스타일 (원장님) · 11번 Custom = 자유 서술</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}>
            {STYLE_PRESET_LIST.map((p) => {
              const active = p.key === stylePreset;
              const isCustom = p.isCustom;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setStylePreset(p.key as StylePresetKey)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    border: `1px solid ${active ? 'var(--ab-gold)' : isCustom ? 'var(--ab-gold-line)' : 'var(--ab-line)'}`,
                    background: active ? 'rgba(201, 166, 107, 0.12)' : isCustom ? 'rgba(201, 166, 107, 0.05)' : '#161311',
                    color: 'var(--ab-ivory)',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    gridColumn: isCustom ? '1 / -1' : 'auto',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 13, fontWeight: 700 }}>{p.label}</span>
                    {p.isDefault ? <span style={{ fontSize: 9, color: 'var(--ab-gold)', letterSpacing: '0.1em' }}>· 기본</span> : null}
                    {isCustom ? <span style={{ fontSize: 9, color: 'var(--ab-gold-light)', letterSpacing: '0.1em' }}>· 원장 직접</span> : null}
                    <span style={{ marginLeft: 'auto', fontSize: 9.5, color: 'var(--ab-gold)', opacity: 0.85 }}>{p.tag}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--ab-text-muted)', lineHeight: 1.5 }}>{p.description}</div>
                </button>
              );
            })}
          </div>
          {stylePreset === 'custom' ? (
            <textarea
              value={customBrief}
              onChange={(e) => setCustomBrief(e.target.value)}
              placeholder="원장님 자유 서술 (예: 「1주년 감사 카드뉴스 · 감동 · 원장 편지 톤」 · 「부산 지점 오픈 축하」 · 「직원 채용 공고 · 프로페셔널」)"
              rows={3}
              style={{ ...styles.input, marginTop: 10, minHeight: 78, resize: 'vertical' as const }}
            />
          ) : null}
          <div style={{ marginTop: 8, fontSize: 10, color: 'var(--ab-text-muted)', lineHeight: 1.6 }}>
            ※ 컨셉·폰트 통일성 유지 (Maison Noir · Cormorant Garamond) · SAFE 이미지만 사용
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>모델 선택 (최대 2개 · 병렬)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(['gemini', 'openai', 'claude'] as ModelId[]).map((m) => {
              const isAvail = available.includes(m);
              const isSel = selectedModels.includes(m);
              const info = meta[m];
              return (
                <label key={m} style={{ ...styles.modelRow, ...(isSel ? styles.modelRowActive : {}), opacity: isAvail ? 1 : 0.4, cursor: isAvail ? 'pointer' : 'not-allowed' }}>
                  <input type="checkbox" checked={isSel} disabled={!isAvail} onChange={() => isAvail && toggleModel(m)} style={{ marginRight: 8 }} />
                  <span style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 13, fontWeight: 700 }}>{info?.label ?? m.toUpperCase()}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--ab-text-muted)' }}>· {info?.strength ?? ''}</span>
                  {!isAvail ? <span style={{ marginLeft: 'auto', fontSize: 10.5, color: '#E8B0B0' }}>API 키 없음</span> : null}
                </label>
              );
            })}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>2️⃣ 슬라이드 kind 결정 모드</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => setUseDesign(false)}
              style={{ padding: '12px 14px', border: `1px solid ${!useDesign ? 'var(--ab-gold)' : 'var(--ab-line)'}`, background: !useDesign ? 'rgba(201, 166, 107, 0.12)' : 'transparent', color: 'var(--ab-ivory)', borderRadius: 4, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
            >
              <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                🤖 자동 (추천)
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ab-text-muted)', lineHeight: 1.5 }}>
                스타일 기반 kind 자동 추천 · 원장 확인 없이 즉시 생성
              </div>
            </button>
            <button
              type="button"
              onClick={() => setUseDesign(true)}
              style={{ padding: '12px 14px', border: `1px solid ${useDesign ? 'var(--ab-gold)' : 'var(--ab-line)'}`, background: useDesign ? 'rgba(201, 166, 107, 0.12)' : 'transparent', color: 'var(--ab-ivory)', borderRadius: 4, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
            >
              <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                📐 수동 (원장 지시)
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ab-text-muted)', lineHeight: 1.5 }}>
                각 슬라이드 「추천 kind ★」 표시 · 원장이 유지·override
              </div>
            </button>
          </div>
          <label style={{ ...styles.checkbox, marginTop: 10 }}>
            <input type="checkbox" checked={useVision} onChange={(e) => setUseVision(e.target.checked)} disabled={!available.includes('gemini')} />
            <span>벤치마크 자동 분석 (Gemini Vision · 선택)</span>
          </label>
        </div>

        {err ? <div style={styles.errBar}>⚠ {err}</div> : null}

        <div style={styles.actions}>
          <button onClick={onClose} style={styles.btnGhost}>취소</button>
          <button onClick={onStart} disabled={selectedModels.length === 0} style={styles.btnPrimary}>🪄 생성 시작</button>
        </div>
      </div>
    </div>
  );

  // ── PREPARING · SAVING ──
  if (step === 'preparing' || step === 'saving') return (
    <div style={styles.backdrop}>
      <div style={{ ...styles.modal, textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
        <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 18, color: 'var(--ab-ivory)', marginBottom: 8 }}>
          {step === 'preparing' ? '준비 중…' : '저장 중…'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ab-gold-light)' }}>{prepStage || '잠시만 기다려주세요 (10~30초)'}</div>
      </div>
    </div>
  );

  // ── DESIGN (신규 · 최초 설계 편집) ──
  if (step === 'design') {
    const updateSkeleton = (idx: number, patch: Partial<Skeleton>) => {
      setSkeletons((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
    };
    const moveSkeleton = (idx: number, dir: -1 | 1) => {
      setSkeletons((prev) => {
        const next = [...prev];
        const target = idx + dir;
        if (target < 0 || target >= next.length) return prev;
        [next[idx], next[target]] = [next[target], next[idx]];
        return next;
      });
    };
    const removeSkeleton = (idx: number) => {
      if (!confirm(`${idx + 1}번 슬라이드 제거?`)) return;
      setSkeletons((prev) => prev.filter((_, i) => i !== idx));
    };
    const addSkeleton = () => {
      setSkeletons((prev) => [...prev, { kind: 'quote-bold', category: 'founder', rationale: '(수동 추가)', copyTone: 'auto' }]);
    };
    const onStartGeneration = async () => {
      if (!input) return;
      if (skeletons.length === 0) { setErr('슬라이드 최소 1장 필요'); return; }
      setErr(null);
      await fetchSlide(0, input, skeletons, trendHints);
      setStep('slide');
    };

    const currentImgPool = [
      ...IMAGE_POOL.founder, ...IMAGE_POOL.ref, ...IMAGE_POOL.upload,
    ];

    return (
      <div style={styles.backdrop}>
        <div onClick={(e) => e.stopPropagation()} style={{ ...styles.modal, maxWidth: 960 }}>
          <div style={styles.head}>
            <div>
              <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 22, fontWeight: 800, color: 'var(--ab-ivory)' }}>📐 최초 설계 편집</div>
              <div style={{ fontSize: 11.5, color: 'var(--ab-gold)', letterSpacing: '0.1em', marginTop: 4, fontFamily: 'var(--ab-font-body-latin)' }}>
                AI 초안 {skeletons.length}장 · kind·톤·이미지 조정 후 생성 시작
              </div>
            </div>
            <button onClick={onClose} style={styles.closeBtn}>×</button>
          </div>

          <div style={{ maxHeight: '65vh', overflowY: 'auto', margin: '18px 0', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {skeletons.map((s, i) => {
              const isImgKind = IMAGE_KINDS.has(s.kind);
              return (
                <div key={i} style={{ border: '1px solid var(--ab-line)', borderRadius: 6, padding: 12, background: '#141210', display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 18, fontWeight: 800, color: 'var(--ab-gold)', textAlign: 'center', paddingTop: 4 }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 9.5, color: 'var(--ab-gold-light)', letterSpacing: '0.15em', marginBottom: 3, textTransform: 'uppercase' }}>Kind (12종)</div>
                      <select value={s.kind} onChange={(e) => updateSkeleton(i, { kind: e.target.value })} style={{ ...styles.input, padding: '6px 8px', fontSize: 12 }}>
                        {KIND_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={{ fontSize: 9.5, color: 'var(--ab-gold-light)', letterSpacing: '0.15em', marginBottom: 3, textTransform: 'uppercase' }}>Category (6톤)</div>
                      <select value={s.category} onChange={(e) => updateSkeleton(i, { category: e.target.value })} style={{ ...styles.input, padding: '6px 8px', fontSize: 12 }}>
                        {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={{ fontSize: 9.5, color: 'var(--ab-gold-light)', letterSpacing: '0.15em', marginBottom: 3, textTransform: 'uppercase' }}>카피 톤</div>
                      <select value={s.copyTone ?? 'auto'} onChange={(e) => updateSkeleton(i, { copyTone: e.target.value as CopyTone })} style={{ ...styles.input, padding: '6px 8px', fontSize: 12 }}>
                        {(Object.keys(COPY_TONE_META) as CopyTone[]).map((t) => (
                          <option key={t} value={t}>{COPY_TONE_META[t].label}</option>
                        ))}
                      </select>
                    </div>
                    {isImgKind ? (
                      <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                        <div style={{ fontSize: 9.5, color: 'var(--ab-gold-light)', letterSpacing: '0.15em', marginBottom: 3, textTransform: 'uppercase' }}>이미지 (없으면 자동 rotate)</div>
                        <select value={s.imageSrcHint ?? ''} onChange={(e) => updateSkeleton(i, { imageSrcHint: e.target.value || undefined })} style={{ ...styles.input, padding: '6px 8px', fontSize: 12 }}>
                          <option value="">— 자동 rotate (pool) —</option>
                          {currentImgPool.map((img) => (
                            <option key={img.path} value={img.path}>{img.label} · {img.path.split('/').pop()}</option>
                          ))}
                        </select>
                      </div>
                    ) : null}
                    <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                      <div style={{ fontSize: 9.5, color: 'var(--ab-gold-light)', letterSpacing: '0.15em', marginBottom: 3, textTransform: 'uppercase' }}>Rationale (왜 · AI 참고)</div>
                      <input value={s.rationale ?? ''} onChange={(e) => updateSkeleton(i, { rationale: e.target.value })} style={{ ...styles.input, padding: '6px 8px', fontSize: 12, width: '100%' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button onClick={() => moveSkeleton(i, -1)} disabled={i === 0} style={{ ...styles.btnGhost, padding: '4px 8px', fontSize: 11 }}>↑</button>
                    <button onClick={() => moveSkeleton(i, 1)} disabled={i === skeletons.length - 1} style={{ ...styles.btnGhost, padding: '4px 8px', fontSize: 11 }}>↓</button>
                    <button onClick={() => removeSkeleton(i)} style={{ ...styles.btnGhost, padding: '4px 8px', fontSize: 11, color: '#E8B0B0', borderColor: 'rgba(232, 176, 176, 0.4)' }}>×</button>
                  </div>
                </div>
              );
            })}
            <button onClick={addSkeleton} style={{ ...styles.btnGhost, padding: '10px', width: '100%', borderStyle: 'dashed', fontSize: 12 }}>+ 슬라이드 추가</button>
          </div>

          {err ? <div style={styles.errBar}>⚠ {err}</div> : null}
          <div style={styles.actions}>
            <button onClick={() => setStep('setup')} style={styles.btnGhost}>← 설정으로</button>
            <button onClick={onStartGeneration} style={styles.btnPrimary}>🪄 이 설계로 생성 시작</button>
          </div>
        </div>
      </div>
    );
  }

  // ── SLIDE (팝업) ──
  return (
    <div style={styles.backdrop}>
      <div style={{ ...styles.modal, maxWidth: 900 }}>
        <div style={styles.head}>
          <div>
            <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, color: 'var(--ab-gold)', letterSpacing: '0.2em' }}>SLIDE {currentIdx + 1} / {skeletons.length}</div>
            <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 18, color: 'var(--ab-ivory)', marginTop: 4 }}>
              {currentSet?.skeleton.kind} · {currentSet?.skeleton.category}
            </div>
            {currentSet?.skeleton.rationale ? <div style={{ fontSize: 11, color: 'var(--ab-text-muted)', marginTop: 4 }}>“{currentSet.skeleton.rationale}”</div> : null}
          </div>
          <button onClick={onStop} style={styles.closeBtn} title="여기까지만 저장하고 종료">×</button>
        </div>

        {slideBusy || !currentSet ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--ab-gold-light)' }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>⏳</div>
            이 슬라이드 생성 중… (10~20초)
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: currentSet.variants.length > 1 ? '1fr 1fr' : '1fr', gap: 12, margin: '16px 0' }}>
              {currentSet.variants.map((v, i) => (
                <div key={i} onClick={() => setPickedVariantIdx(i)} style={{ cursor: 'pointer', border: `2px solid ${i === pickedVariantIdx ? 'var(--ab-gold)' : 'var(--ab-line)'}`, borderRadius: 6, padding: 8, background: i === pickedVariantIdx ? 'rgba(201, 166, 107, 0.06)' : 'transparent' }}>
                  <div style={{ fontSize: 10.5, color: 'var(--ab-gold)', letterSpacing: '0.15em', marginBottom: 6, fontFamily: 'var(--ab-font-body-latin)' }}>
                    {i === pickedVariantIdx ? '● ' : '○ '}{v.source.toUpperCase()}
                  </div>
                  <SlideRender slide={v.slide} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--ab-text-muted)' }}>
                {countdown}초 후 자동 진행 · 확정된 슬라이드 {chosenSlides.length}장
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={onStop} style={styles.btnGhost}>여기까지 저장</button>
                <button onClick={onNext} style={styles.btnPrimary}>
                  {currentIdx + 1 >= skeletons.length ? '완료 · 저장' : `다음 슬라이드 → (${countdown}s)`}
                </button>
              </div>
            </div>
          </>
        )}

        {err ? <div style={styles.errBar}>⚠ {err}</div> : null}
      </div>
    </div>
  );
}

const styles = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(11, 9, 7, 0.85)', backdropFilter: 'blur(6px)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px', overflowY: 'auto' } as React.CSSProperties,
  modal: { background: '#0F0D0B', border: '1px solid var(--ab-gold-line)', borderRadius: 8, padding: 24, width: '100%', maxWidth: 560, boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)', fontFamily: 'var(--ab-font-body)' } as React.CSSProperties,
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 } as React.CSSProperties,
  closeBtn: { background: 'transparent', border: 'none', color: 'var(--ab-text-muted)', fontSize: 26, cursor: 'pointer', padding: 0, lineHeight: 1 } as React.CSSProperties,
  subtitle: { fontSize: 11.5, color: 'var(--ab-gold)', letterSpacing: '0.1em', marginTop: 4, marginBottom: 22, fontFamily: 'var(--ab-font-body-latin)' } as React.CSSProperties,
  field: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 } as React.CSSProperties,
  label: { fontSize: 10.5, letterSpacing: '0.15em', color: 'var(--ab-gold-light)', fontFamily: 'var(--ab-font-body-latin)', textTransform: 'uppercase', fontWeight: 700 } as React.CSSProperties,
  input: { padding: '10px 12px', background: '#161311', border: '1px solid var(--ab-line)', color: 'var(--ab-ivory)', fontFamily: 'var(--ab-font-body)', fontSize: 13, borderRadius: 3, boxSizing: 'border-box' } as React.CSSProperties,
  modelRow: { display: 'flex', alignItems: 'center', padding: '10px 12px', border: '1px solid var(--ab-line)', borderRadius: 4, color: 'var(--ab-ivory)' } as React.CSSProperties,
  modelRowActive: { border: '1px solid var(--ab-gold)', background: 'rgba(201, 166, 107, 0.08)' } as React.CSSProperties,
  checkbox: { display: 'flex', gap: 8, fontSize: 12, color: 'var(--ab-text-soft)', alignItems: 'center', cursor: 'pointer', padding: '4px 0' } as React.CSSProperties,
  errBar: { padding: '10px 14px', background: 'rgba(122, 53, 56, 0.15)', border: '1px solid rgba(122, 53, 56, 0.4)', color: '#F5EEE0', fontSize: 12.5, borderRadius: 4, marginTop: 12 } as React.CSSProperties,
  actions: { display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' } as React.CSSProperties,
  btnGhost: { padding: '10px 20px', background: 'transparent', color: 'var(--ab-gold-light)', border: '1px solid var(--ab-gold-line)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 3 } as React.CSSProperties,
  btnPrimary: { padding: '10px 22px', background: 'var(--ab-gold)', color: 'var(--ab-black)', border: 'none', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 3 } as React.CSSProperties,
};
