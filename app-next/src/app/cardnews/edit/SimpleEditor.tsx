'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CardnewsProject } from '@/lib/cardnews-storage';
import type { Slide, Lang, LangContent, LayoutKind } from '../types';
import { LANGS, LANG_LABEL, LANG_FULL } from '../types';
import { SlideRender } from '../SlideRender';
import { ImagePicker } from './ImagePicker';

/**
 * SimpleEditor (편집기 A · Card-by-Card · 2026-07-21 회의 확정)
 * - 1분할 슬라이드 하나씩 크게
 * - 4개 통합 필드 (위쪽 라벨 · 제목 · 강조어 · 하단 라벨) + 이미지 갤러리
 * - 자동 저장 (2초 debounce)
 * - kind 5개 기본 + 「고급」 접힘
 * - 언어 3개 → KO 기본 · 번역 편집 별도 진입
 */

const emptyLang = (title = ''): LangContent => ({ title, slides: [] });

// 기본 5 kind (원장님 자주 쓸 것)
const KIND_PRIMARY: { kind: LayoutKind; label: string; desc: string }[] = [
  { kind: 'magazine-cover',      label: '커버',        desc: 'Vogue 커버 · 대형 제목 + 배경 인물' },
  { kind: 'hero-portrait',       label: '인물 전면',    desc: '화보 인물 통짜 + 하단 라벨' },
  { kind: 'pullquote-editorial', label: '인용',        desc: '큰 인용문 + 필기체 서명' },
  { kind: 'case-study-detail',   label: '커리큘럼',    desc: '좌 상세 리스트 + 우 가격' },
  { kind: 'cta-editorial',       label: '상담 유도',    desc: '얇은 CTA + 필기체 서명' },
];

// 고급 kind (접힘 · 필요 시)
const KIND_ADVANCED: { kind: LayoutKind; label: string }[] = [
  { kind: 'macro-close-up',      label: '매크로 클로즈업' },
  { kind: 'before-after-split',  label: 'Before/After' },
  { kind: 'atelier-scene',       label: '아틀리에 씬 (3열 정보)' },
  { kind: 'signature-style',     label: '시그니처 스타일' },
  { kind: 'umbrella-4cats',      label: '4대 카테고리' },
  { kind: 'cover-founder',       label: 'Legacy · 커버 (Founder)' },
  { kind: 'quote-bold',          label: 'Legacy · 큰 인용' },
  { kind: 'portrait-frame',      label: 'Legacy · 인물 프레임' },
  { kind: 'product-hero',        label: 'Legacy · 상단 이미지 카드' },
  { kind: 'price-table',         label: 'Legacy · 가격표' },
  { kind: 'curriculum-row',      label: 'Legacy · 커리큘럼 회차' },
  { kind: 'checklist',           label: 'Legacy · 체크리스트' },
  { kind: 'number-big',          label: 'Legacy · 큰 넘버' },
  { kind: 'closing-cta',         label: 'Legacy · 마무리 CTA' },
  { kind: 'icon-duo',            label: 'Legacy · 아이콘 2분할' },
  { kind: 'icon-trio',           label: 'Legacy · 아이콘 3분할' },
];

const KIND_LABEL_ALL: Record<LayoutKind, string> = Object.fromEntries(
  [...KIND_PRIMARY, ...KIND_ADVANCED].map((k) => [k.kind, k.label]),
) as Record<LayoutKind, string>;

// ═══════════════ 4개 통합 필드 ↔ kind별 실제 필드 매핑 ═══════════════

type UnifiedFields = {
  topLabel: string;
  headline: string;
  highlight: string;
  bottomLabel: string;
  imageSrc: string;
  imageAlt: string;
};

function readUnified(s: Slide): UnifiedFields {
  const anySlide = s as unknown as Record<string, unknown>;
  const str = (k: string) => (typeof anySlide[k] === 'string' ? (anySlide[k] as string) : '');

  switch (s.kind) {
    case 'magazine-cover':
      return { topLabel: str('volume'), headline: str('headline'), highlight: '', bottomLabel: str('signatureLabel'), imageSrc: str('imageSrc'), imageAlt: str('imageAlt') };
    case 'hero-portrait':
      return { topLabel: str('cornerBadge'), headline: '', highlight: '', bottomLabel: str('bottomLabel'), imageSrc: str('imageSrc'), imageAlt: str('imageAlt') };
    case 'macro-close-up':
      return { topLabel: str('overlayLabel'), headline: str('quote'), highlight: '', bottomLabel: str('by'), imageSrc: str('imageSrc'), imageAlt: str('imageAlt') };
    case 'pullquote-editorial':
      return { topLabel: '', headline: str('quote'), highlight: '', bottomLabel: str('signatureRole'), imageSrc: '', imageAlt: '' };
    case 'case-study-detail':
      return { topLabel: str('eyebrow'), headline: str('rightHeadline'), highlight: str('rightPrice'), bottomLabel: str('rightFootnote'), imageSrc: '', imageAlt: '' };
    case 'atelier-scene':
      return { topLabel: str('eyebrow'), headline: str('headline'), highlight: '', bottomLabel: '', imageSrc: str('imageSrc'), imageAlt: str('imageAlt') };
    case 'cta-editorial':
      return { topLabel: '', headline: str('headline'), highlight: str('highlight'), bottomLabel: str('subline'), imageSrc: '', imageAlt: '' };
    case 'before-after-split':
      return { topLabel: str('beforeLabel'), headline: '', highlight: '', bottomLabel: str('bottomStrip'), imageSrc: str('beforeSrc'), imageAlt: str('beforeAlt') };
    case 'cover-founder':
      return { topLabel: str('eyebrow'), headline: str('headline'), highlight: str('highlight'), bottomLabel: str('quote'), imageSrc: str('imageSrc'), imageAlt: str('imageAlt') };
    case 'quote-bold':
      return { topLabel: str('eyebrow'), headline: str('quote'), highlight: '', bottomLabel: str('by'), imageSrc: '', imageAlt: '' };
    case 'portrait-frame':
      return { topLabel: str('eyebrow'), headline: str('headline'), highlight: '', bottomLabel: str('caption'), imageSrc: str('imageSrc'), imageAlt: str('imageAlt') };
    case 'product-hero':
      return { topLabel: str('eyebrow'), headline: str('headline'), highlight: str('overlayLabel'), bottomLabel: str('caption'), imageSrc: str('imageSrc'), imageAlt: str('imageAlt') };
    case 'closing-cta':
      return { topLabel: '', headline: str('headline'), highlight: str('highlight'), bottomLabel: str('body'), imageSrc: '', imageAlt: '' };
    case 'umbrella-4cats':
      return { topLabel: str('eyebrow'), headline: str('headline'), highlight: '', bottomLabel: str('footnote'), imageSrc: '', imageAlt: '' };
    default:
      return { topLabel: str('eyebrow'), headline: str('headline'), highlight: str('highlight'), bottomLabel: str('body'), imageSrc: str('imageSrc'), imageAlt: str('imageAlt') };
  }
}

function writeUnified(s: Slide, u: UnifiedFields): Slide {
  const clone = { ...s } as Slide & Record<string, unknown>;
  switch (s.kind) {
    case 'magazine-cover':
      clone.volume = u.topLabel; clone.headline = u.headline; clone.signatureLabel = u.bottomLabel; clone.imageSrc = u.imageSrc; clone.imageAlt = u.imageAlt; break;
    case 'hero-portrait':
      clone.cornerBadge = u.topLabel; clone.bottomLabel = u.bottomLabel; clone.imageSrc = u.imageSrc; clone.imageAlt = u.imageAlt; break;
    case 'macro-close-up':
      clone.overlayLabel = u.topLabel; clone.quote = u.headline; clone.by = u.bottomLabel; clone.imageSrc = u.imageSrc; clone.imageAlt = u.imageAlt; break;
    case 'pullquote-editorial':
      clone.quote = u.headline; clone.signatureRole = u.bottomLabel; break;
    case 'case-study-detail':
      clone.eyebrow = u.topLabel; clone.rightHeadline = u.headline; clone.rightPrice = u.highlight; clone.rightFootnote = u.bottomLabel; break;
    case 'atelier-scene':
      clone.eyebrow = u.topLabel; clone.headline = u.headline; clone.imageSrc = u.imageSrc; clone.imageAlt = u.imageAlt; break;
    case 'cta-editorial':
      clone.headline = u.headline; clone.highlight = u.highlight; clone.subline = u.bottomLabel; break;
    case 'before-after-split':
      clone.beforeLabel = u.topLabel; clone.bottomStrip = u.bottomLabel; clone.beforeSrc = u.imageSrc; clone.beforeAlt = u.imageAlt; break;
    case 'cover-founder':
      clone.eyebrow = u.topLabel; clone.headline = u.headline; clone.highlight = u.highlight; clone.quote = u.bottomLabel; clone.imageSrc = u.imageSrc; clone.imageAlt = u.imageAlt; break;
    case 'quote-bold':
      clone.eyebrow = u.topLabel; clone.quote = u.headline; clone.by = u.bottomLabel; break;
    case 'portrait-frame':
      clone.eyebrow = u.topLabel; clone.headline = u.headline; clone.caption = u.bottomLabel; clone.imageSrc = u.imageSrc; clone.imageAlt = u.imageAlt; break;
    case 'product-hero':
      clone.eyebrow = u.topLabel; clone.headline = u.headline; clone.overlayLabel = u.highlight; clone.caption = u.bottomLabel; clone.imageSrc = u.imageSrc; clone.imageAlt = u.imageAlt; break;
    case 'closing-cta':
      clone.headline = u.headline; clone.highlight = u.highlight; clone.body = u.bottomLabel; break;
    case 'umbrella-4cats':
      clone.eyebrow = u.topLabel; clone.headline = u.headline; clone.footnote = u.bottomLabel; break;
    default:
      clone.eyebrow = u.topLabel; clone.headline = u.headline; clone.highlight = u.highlight; clone.body = u.bottomLabel; clone.imageSrc = u.imageSrc; clone.imageAlt = u.imageAlt;
  }
  return clone as Slide;
}

// kind별 4개 필드 라벨·힌트
function fieldLabels(kind: LayoutKind): { topLabel: string; headline: string; highlight: string; bottomLabel: string; imageEnabled: boolean; showHighlight: boolean } {
  switch (kind) {
    case 'magazine-cover':
      return { topLabel: '상단 볼륨/이슈 (예: VOL 15)', headline: '대형 제목 (Vogue 커버)', highlight: '', bottomLabel: '하단 서명 라벨', imageEnabled: true, showHighlight: false };
    case 'hero-portrait':
      return { topLabel: '우상단 배지 (선택)', headline: '', highlight: '', bottomLabel: '하단 골드 라벨', imageEnabled: true, showHighlight: false };
    case 'pullquote-editorial':
      return { topLabel: '', headline: '큰 인용문 (원장님 어록)', highlight: '', bottomLabel: '서명 직함 (예: ARTBROWS FOUNDER)', imageEnabled: false, showHighlight: false };
    case 'case-study-detail':
      return { topLabel: '위 라벨 (예: CURRICULUM)', headline: '우측 대형 요약 (예: 창업반)', highlight: '가격 (예: 890만원)', bottomLabel: '하단 부기 (기간·조건)', imageEnabled: false, showHighlight: true };
    case 'cta-editorial':
      return { topLabel: '', headline: '대형 CTA 헤드', highlight: '골드 강조 단어', bottomLabel: '얇은 서브 (선릉 본원 등)', imageEnabled: false, showHighlight: true };
    case 'macro-close-up':
      return { topLabel: '좌상단 라벨 (예: HYPER REAL)', headline: '우측 미니 인용', highlight: '', bottomLabel: '서명', imageEnabled: true, showHighlight: false };
    case 'atelier-scene':
      return { topLabel: '위 라벨', headline: '이미지 하단 헤드 (선택)', highlight: '', bottomLabel: '', imageEnabled: true, showHighlight: false };
    case 'before-after-split':
      return { topLabel: 'BEFORE 라벨', headline: '', highlight: '', bottomLabel: '하단 정보 스트립', imageEnabled: true, showHighlight: false };
    default:
      return { topLabel: '위 라벨', headline: '제목', highlight: '강조어', bottomLabel: '하단 라벨', imageEnabled: true, showHighlight: true };
  }
}

// case-study-detail 좌측 리스트 · pullquote 서명 · cta href 등 kind별 특수 필드
function AdvancedFields({ slide, onChange }: { slide: Slide; onChange: (s: Slide) => void }) {
  const set = (patch: Record<string, unknown>) => onChange({ ...(slide as unknown as Record<string, unknown>), ...patch } as unknown as Slide);
  const anySlide = slide as unknown as Record<string, unknown>;

  if (slide.kind === 'case-study-detail') {
    const items = (anySlide.leftItems as { num?: string; text: string; sub?: string }[]) || [];
    return (
      <div style={f.grp}>
        <div style={f.grpLabel}>좌측 커리큘럼 항목</div>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 30px', gap: 6, marginBottom: 6 }}>
            <input value={it.num || ''} onChange={(e) => { const next = [...items]; next[i] = { ...it, num: e.target.value }; set({ leftItems: next }); }} placeholder="01" style={f.input} />
            <input value={it.text} onChange={(e) => { const next = [...items]; next[i] = { ...it, text: e.target.value }; set({ leftItems: next }); }} placeholder="이지클래스 × 1회" style={f.input} />
            <input value={it.sub || ''} onChange={(e) => { const next = [...items]; next[i] = { ...it, sub: e.target.value }; set({ leftItems: next }); }} placeholder="설명 (선택)" style={f.input} />
            <button type="button" onClick={() => set({ leftItems: items.filter((_, k) => k !== i) })} style={f.tinyDelBtn}>×</button>
          </div>
        ))}
        <button type="button" onClick={() => set({ leftItems: [...items, { num: String(items.length + 1).padStart(2, '0'), text: '', sub: '' }] })} style={f.smallBtn}>+ 항목 추가</button>
        <div style={{ marginTop: 12 }}>
          <div style={f.grpLabel}>좌측 섹션 제목</div>
          <input value={(anySlide.leftTitle as string) || ''} onChange={(e) => set({ leftTitle: e.target.value })} placeholder="CURRICULUM" style={f.input} />
        </div>
      </div>
    );
  }

  if (slide.kind === 'pullquote-editorial') {
    return (
      <div style={f.grp}>
        <div style={f.grpLabel}>서명 (필기체 · 예: Miji Jang)</div>
        <input value={(anySlide.signature as string) || ''} onChange={(e) => set({ signature: e.target.value })} placeholder="Miji Jang" style={f.input} />
      </div>
    );
  }

  if (slide.kind === 'cta-editorial') {
    return (
      <div style={f.grp}>
        <div style={f.grpLabel}>CTA 텍스트</div>
        <input value={(anySlide.cta as string) || ''} onChange={(e) => set({ cta: e.target.value })} placeholder="교육 상담 신청 →" style={f.input} />
        <div style={{ ...f.grpLabel, marginTop: 10 }}>CTA 링크 (선택)</div>
        <input value={(anySlide.ctaHref as string) || ''} onChange={(e) => set({ ctaHref: e.target.value })} placeholder="/enroll" style={f.input} />
        <div style={{ ...f.grpLabel, marginTop: 10 }}>서명 (필기체)</div>
        <input value={(anySlide.signature as string) || ''} onChange={(e) => set({ signature: e.target.value })} placeholder="Miji Jang" style={f.input} />
      </div>
    );
  }

  if (slide.kind === 'magazine-cover') {
    return (
      <div style={f.grp}>
        <div style={f.grpLabel}>브랜드 (기본 ARTBROWS)</div>
        <input value={(anySlide.brand as string) || ''} onChange={(e) => set({ brand: e.target.value })} placeholder="ARTBROWS" style={f.input} />
        <div style={{ ...f.grpLabel, marginTop: 10 }}>부제 (선택 · 하위 세리프)</div>
        <input value={(anySlide.subheadline as string) || ''} onChange={(e) => set({ subheadline: e.target.value })} placeholder="THE ORIGINAL SINCE 2005" style={f.input} />
      </div>
    );
  }

  if (slide.kind === 'atelier-scene') {
    const cols = (anySlide.bottomColumns as { label: string; value: string }[]) || [];
    return (
      <div style={f.grp}>
        <div style={f.grpLabel}>하단 3열 정보</div>
        {cols.map((c, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 30px', gap: 6, marginBottom: 6 }}>
            <input value={c.label} onChange={(e) => { const next = [...cols]; next[i] = { ...c, label: e.target.value }; set({ bottomColumns: next }); }} placeholder="본원" style={f.input} />
            <input value={c.value} onChange={(e) => { const next = [...cols]; next[i] = { ...c, value: e.target.value }; set({ bottomColumns: next }); }} placeholder="선릉·삼성" style={f.input} />
            <button type="button" onClick={() => set({ bottomColumns: cols.filter((_, k) => k !== i) })} style={f.tinyDelBtn}>×</button>
          </div>
        ))}
        <button type="button" onClick={() => set({ bottomColumns: [...cols, { label: '', value: '' }] })} style={f.smallBtn}>+ 열 추가</button>
      </div>
    );
  }

  if (slide.kind === 'before-after-split') {
    return (
      <div style={f.grp}>
        <div style={f.grpLabel}>AFTER 이미지 · 라벨</div>
        <input value={(anySlide.afterLabel as string) || 'AFTER'} onChange={(e) => set({ afterLabel: e.target.value })} placeholder="AFTER" style={f.input} />
        <div style={{ marginTop: 8 }}>
          <ImagePicker value={(anySlide.afterSrc as string) || ''} onChange={(v) => set({ afterSrc: v })} label="AFTER 이미지" />
        </div>
      </div>
    );
  }

  return null;
}

// ═══════════════ 컴포넌트 본체 ═══════════════

export default function SimpleEditor({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<CardnewsProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [lang, setLang] = useState<Lang>('ko');
  const [selected, setSelected] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [showKindPicker, setShowKindPicker] = useState(false);
  const [showLangs, setShowLangs] = useState(false);
  const [showDanger, setShowDanger] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipSaveRef = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/cardnews/${id}`, { cache: 'no-store' });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || 'failed');
        setProject(j.project);
        setLang(j.project?.defaultLang ?? 'ko');
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'failed');
      } finally { setLoading(false); }
    })();
  }, [id]);

  // 자동 저장 (2초 debounce)
  const scheduleSave = useCallback((next: CardnewsProject) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        const r = await fetch(`/api/cardnews/${id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project: next }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || 'save failed');
        setSavedAt(new Date());
        setErr(null);
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'save failed');
      } finally { setSaving(false); }
    }, 2000);
  }, [id]);

  useEffect(() => {
    if (!project) return;
    if (skipSaveRef.current) { skipSaveRef.current = false; return; }
    scheduleSave(project);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [project, scheduleSave]);

  function patch(next: Partial<CardnewsProject>) {
    if (!project) return;
    setProject({ ...project, ...next });
  }
  function ensureLang(l: Lang) {
    if (!project) return;
    if (!project.translations[l]) {
      patch({ translations: { ...project.translations, [l]: emptyLang() } });
    }
  }
  function setLangTab(l: Lang) { ensureLang(l); setLang(l); setSelected(0); setShowLangs(false); }

  const currentLangContent: LangContent = project?.translations?.[lang] ?? emptyLang();
  const slides = currentLangContent.slides;

  function updateLangContent(next: LangContent) {
    if (!project) return;
    patch({ translations: { ...project.translations, [lang]: next } });
  }
  function updateSlide(i: number, s: Slide) {
    const newSlides = [...slides]; newSlides[i] = s;
    updateLangContent({ ...currentLangContent, slides: newSlides });
  }
  function addSlide(kind: LayoutKind = 'magazine-cover') {
    const newSlide: Slide = { kind, category: 'founder' } as Slide;
    const newSlides = [...slides, newSlide];
    updateLangContent({ ...currentLangContent, slides: newSlides });
    setSelected(newSlides.length - 1);
    setShowKindPicker(false);
  }
  function changeKind(kind: LayoutKind) {
    if (!current) return;
    const u = readUnified(current);
    const newSlide: Slide = { kind, category: current.category } as Slide;
    updateSlide(selected, writeUnified(newSlide, u));
    setShowKindPicker(false);
  }
  function removeSlide(i: number) {
    if (!confirm(`${i + 1}번 슬라이드 삭제?`)) return;
    const newSlides = slides.filter((_, k) => k !== i);
    updateLangContent({ ...currentLangContent, slides: newSlides });
    setSelected(Math.max(0, Math.min(selected, newSlides.length - 1)));
  }
  async function deleteProject() {
    if (!project) return;
    const msg = `「${project.title}」 프로젝트 완전 삭제할까요? (되돌릴 수 없음)`;
    if (!confirm(msg)) return;
    try {
      const r = await fetch(`/api/cardnews/${id}?mode=hard`, { method: 'DELETE' });
      if (!r.ok) throw new Error('delete failed');
      router.push('/cardnews');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'delete failed');
    }
  }

  if (loading) return <main style={s.wrap}><div style={{ color: 'var(--ab-text-muted)', padding: 40 }}>불러오는 중…</div></main>;
  if (err && !project) return <main style={s.wrap}><div style={{ color: '#E8B0B0', padding: 40 }}>⚠ {err}</div></main>;
  if (!project) return null;

  const current = slides[selected];
  const unified = current ? readUnified(current) : null;
  const labels = current ? fieldLabels(current.kind) : null;

  function updateUnified(patch: Partial<UnifiedFields>) {
    if (!current || !unified) return;
    updateSlide(selected, writeUnified(current, { ...unified, ...patch }));
  }

  return (
    <main style={s.wrap}>
      {/* 상단 슬림 툴바 */}
      <div style={s.topbar}>
        <Link href="/cardnews" style={s.crumb}>← 목록</Link>
        <input
          value={project.title}
          onChange={(e) => patch({ title: e.target.value })}
          style={s.titleInput}
          placeholder="카드뉴스 제목"
        />
        <div style={s.savingBadge}>
          {saving ? '● 저장 중…' : savedAt ? `✓ ${savedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : '· 대기'}
        </div>
        <Link href={`/cardnews/view/${project.id}?lang=${lang}`} target="_blank" style={s.btnGhost}>미리보기 ↗</Link>
        <Link href={`/cardnews/edit/${id}/pro`} style={s.btnGhostSmall} title="기존 3분할 편집기 (고급 사용자)">⚙ Pro</Link>
        <button onClick={() => setShowLangs(!showLangs)} style={s.btnGhostSmall} title="번역 편집 열기">
          🌐 {LANG_LABEL[lang]}
        </button>
      </div>

      {/* 언어 선택 드롭 (접힘) */}
      {showLangs ? (
        <div style={s.langDrop}>
          <div style={{ fontSize: 11, color: 'var(--ab-text-muted)', marginBottom: 8, letterSpacing: '0.15em' }}>번역 편집 · 편집 언어 선택</div>
          {LANGS.map((l) => {
            const count = project.translations[l]?.slides?.length ?? 0;
            const active = l === lang;
            return (
              <button key={l} onClick={() => setLangTab(l)}
                style={{ ...s.langBtn, ...(active ? s.langBtnActive : {}) }}>
                {LANG_LABEL[l]} · {LANG_FULL[l]} · {count > 0 ? `${count}장` : '—'}
                {l === project.defaultLang ? ' · 기본' : ''}
              </button>
            );
          })}
        </div>
      ) : null}

      {err ? <div style={s.errBar}>⚠ {err}</div> : null}

      {slides.length === 0 ? (
        <div style={s.emptyCard}>
          <div style={{ fontSize: 15, color: 'var(--ab-text-muted)', marginBottom: 20 }}>
            {LANG_FULL[lang]} 슬라이드가 아직 없어요.
          </div>
          <button onClick={() => addSlide('magazine-cover')} style={s.bigBtn}>
            + 첫 슬라이드 시작 (매거진 커버)
          </button>
        </div>
      ) : (
        <>
          {/* 도트 페이지네이션 + 카운터 */}
          <div style={s.pager}>
            <div style={s.dots}>
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSelected(i)}
                  style={{ ...s.dot, ...(i === selected ? s.dotActive : {}) }}
                  title={`${i + 1}번`} />
              ))}
            </div>
            <div style={s.pageCounter}>
              <span style={{ color: 'var(--ab-gold)', fontWeight: 700 }}>{selected + 1}</span>
              <span style={{ color: 'var(--ab-text-muted)', margin: '0 6px' }}>/</span>
              <span style={{ color: 'var(--ab-text-muted)' }}>{slides.length}</span>
            </div>
          </div>

          {/* 큰 프리뷰 */}
          {current ? (
            <div style={s.previewWrap}>
              <div style={{ maxWidth: 420, width: '100%' }}>
                <SlideRender slide={current} />
              </div>
            </div>
          ) : null}

          {/* 이전 · 다음 */}
          <div style={s.navRow}>
            <button onClick={() => setSelected(Math.max(0, selected - 1))} disabled={selected === 0} style={s.navBtn}>◀ 이전</button>
            <button onClick={() => setSelected(Math.min(slides.length - 1, selected + 1))} disabled={selected === slides.length - 1} style={s.navBtn}>다음 ▶</button>
          </div>

          {/* 편집 필드 */}
          {current && unified && labels ? (
            <div style={s.editCard}>
              <div style={s.editHead}>
                <div style={s.editTitle}>✏️ 편집 · {selected + 1}번</div>
                <button onClick={() => setShowKindPicker(!showKindPicker)} style={s.kindBtn}>
                  종류: <b>{KIND_LABEL_ALL[current.kind]}</b> ▽
                </button>
              </div>

              {showKindPicker ? (
                <div style={s.kindPicker}>
                  <div style={s.kindGroupLabel}>기본 5종 (원장님 자주 쓸 것)</div>
                  <div style={s.kindGrid}>
                    {KIND_PRIMARY.map((k) => (
                      <button key={k.kind} onClick={() => changeKind(k.kind)}
                        style={{ ...s.kindItem, ...(k.kind === current.kind ? s.kindItemActive : {}) }}>
                        <b>{k.label}</b>
                        <span style={{ fontSize: 10, color: 'var(--ab-text-muted)', marginTop: 2 }}>{k.desc}</span>
                      </button>
                    ))}
                  </div>
                  <details style={{ marginTop: 12 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 11, color: 'var(--ab-text-muted)', letterSpacing: '0.1em' }}>▽ 고급 (16종 · Legacy 포함)</summary>
                    <div style={{ ...s.kindGrid, marginTop: 8 }}>
                      {KIND_ADVANCED.map((k) => (
                        <button key={k.kind} onClick={() => changeKind(k.kind)}
                          style={{ ...s.kindItem, ...(k.kind === current.kind ? s.kindItemActive : {}) }}>
                          <b>{k.label}</b>
                        </button>
                      ))}
                    </div>
                  </details>
                </div>
              ) : null}

              {labels.topLabel ? (
                <div style={f.row}>
                  <label style={f.label}>위 라벨</label>
                  <input value={unified.topLabel} onChange={(e) => updateUnified({ topLabel: e.target.value })}
                    placeholder={labels.topLabel} style={f.input} />
                </div>
              ) : null}

              {labels.headline ? (
                <div style={f.row}>
                  <label style={f.label}>제목</label>
                  <textarea value={unified.headline} onChange={(e) => updateUnified({ headline: e.target.value })}
                    placeholder={labels.headline} style={{ ...f.input, minHeight: 60, resize: 'vertical', fontFamily: '"Nanum Myeongjo", serif' }} />
                </div>
              ) : null}

              {labels.showHighlight && labels.highlight ? (
                <div style={f.row}>
                  <label style={f.label}>강조어 (골드)</label>
                  <input value={unified.highlight} onChange={(e) => updateUnified({ highlight: e.target.value })}
                    placeholder={labels.highlight} style={f.input} />
                </div>
              ) : null}

              {labels.bottomLabel ? (
                <div style={f.row}>
                  <label style={f.label}>하단 라벨</label>
                  <input value={unified.bottomLabel} onChange={(e) => updateUnified({ bottomLabel: e.target.value })}
                    placeholder={labels.bottomLabel} style={f.input} />
                </div>
              ) : null}

              {labels.imageEnabled ? (
                <div style={f.row}>
                  <label style={f.label}>이미지</label>
                  <div style={{ flex: 1 }}>
                    <ImagePicker value={unified.imageSrc} onChange={(v) => updateUnified({ imageSrc: v })} />
                  </div>
                </div>
              ) : null}

              <details style={{ marginTop: 20, borderTop: '1px solid var(--ab-line)', paddingTop: 16 }}>
                <summary style={{ cursor: 'pointer', fontSize: 12, color: 'var(--ab-gold-light)', letterSpacing: '0.1em', fontFamily: 'var(--ab-font-body-latin)', fontWeight: 600 }}>
                  ▽ 고급 · 이 종류만의 추가 필드
                </summary>
                <div style={{ marginTop: 12 }}>
                  <AdvancedFields slide={current} onChange={(next) => updateSlide(selected, next)} />
                </div>
              </details>

              <div style={{ marginTop: 20, display: 'flex', gap: 10, borderTop: '1px solid var(--ab-line)', paddingTop: 16 }}>
                <button onClick={() => setShowKindPicker(true)} style={{ ...s.btnGhost, flex: 1 }}>+ 새 슬라이드 추가</button>
                <button onClick={() => removeSlide(selected)} style={{ ...s.btnGhost, color: '#E8B0B0', borderColor: '#3A2A2A' }}>× 이 슬라이드 삭제</button>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* 하단 위험 존 */}
      <div style={s.dangerZone}>
        <button onClick={() => setShowDanger(!showDanger)} style={s.dangerToggle}>
          {showDanger ? '△' : '▽'} 위험 존
        </button>
        {showDanger ? (
          <div style={{ marginTop: 10, padding: 14, background: '#1A0F0F', border: '1px solid #3A2A2A', borderRadius: 3 }}>
            <div style={{ fontSize: 12, color: '#E8B0B0', marginBottom: 10 }}>
              프로젝트를 완전 삭제합니다. 되돌릴 수 없습니다.
            </div>
            <button onClick={deleteProject} style={s.dangerBtn}>🗑 프로젝트 완전 삭제</button>
          </div>
        ) : null}
      </div>
    </main>
  );
}

const s = {
  wrap: { minHeight: '100vh', background: 'var(--ab-black)', color: 'var(--ab-ivory)', padding: '16px 20px 60px', fontFamily: 'var(--ab-font-body)', maxWidth: 720, margin: '0 auto' } as React.CSSProperties,
  topbar: { display: 'flex', gap: 10, alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--ab-line)', marginBottom: 16, flexWrap: 'wrap' } as React.CSSProperties,
  crumb: { fontSize: 11.5, color: 'var(--ab-gold-light)', textDecoration: 'none', letterSpacing: '0.06em' } as React.CSSProperties,
  titleInput: { flex: 1, background: 'transparent', border: 'none', color: 'var(--ab-ivory)', fontFamily: 'var(--ab-font-headline)', fontSize: 18, fontWeight: 700, padding: '4px 0', outline: 'none', minWidth: 200 } as React.CSSProperties,
  savingBadge: { fontSize: 11, color: 'var(--ab-text-muted)', fontFamily: 'var(--ab-font-body-latin)', letterSpacing: '0.06em', minWidth: 90, textAlign: 'right' } as React.CSSProperties,
  btnGhost: { padding: '8px 14px', background: 'transparent', color: 'var(--ab-text-soft)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--ab-line)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, cursor: 'pointer', borderRadius: 3, textDecoration: 'none', letterSpacing: '0.05em' } as React.CSSProperties,
  btnGhostSmall: { padding: '6px 10px', background: 'transparent', color: 'var(--ab-text-soft)', border: '1px solid var(--ab-line)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, cursor: 'pointer', borderRadius: 3, textDecoration: 'none' } as React.CSSProperties,
  langDrop: { padding: 12, marginBottom: 14, background: '#0F0D0B', border: '1px solid var(--ab-line)', borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 6 } as React.CSSProperties,
  langBtn: { padding: '8px 12px', background: 'transparent', color: 'var(--ab-text-soft)', border: '1px solid var(--ab-line)', fontSize: 12, cursor: 'pointer', borderRadius: 3, textAlign: 'left' } as React.CSSProperties,
  langBtnActive: { background: 'var(--ab-gold)', color: 'var(--ab-black)', fontWeight: 700 } as React.CSSProperties,
  errBar: { padding: 10, background: '#3A1A1A', color: '#E8B0B0', borderRadius: 3, marginBottom: 14, fontSize: 12 } as React.CSSProperties,
  emptyCard: { padding: 40, textAlign: 'center', border: '1px dashed var(--ab-line)', borderRadius: 6, marginTop: 20 } as React.CSSProperties,
  bigBtn: { padding: '14px 24px', background: 'var(--ab-gold)', color: 'var(--ab-black)', border: 'none', fontFamily: 'var(--ab-font-body-latin)', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', cursor: 'pointer', borderRadius: 3 } as React.CSSProperties,
  pager: { display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', margin: '10px 0 4px' } as React.CSSProperties,
  dots: { display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' } as React.CSSProperties,
  dot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--ab-line)', border: 'none', cursor: 'pointer', padding: 0, transition: 'background 0.15s' } as React.CSSProperties,
  dotActive: { background: 'var(--ab-gold)', transform: 'scale(1.35)' } as React.CSSProperties,
  pageCounter: { fontFamily: 'var(--ab-font-body-latin)', fontSize: 14, letterSpacing: '0.1em' } as React.CSSProperties,
  previewWrap: { display: 'flex', justifyContent: 'center', padding: '14px 0 8px' } as React.CSSProperties,
  navRow: { display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 } as React.CSSProperties,
  navBtn: { padding: '10px 22px', background: 'transparent', color: 'var(--ab-gold-light)', border: '1px solid var(--ab-gold-line)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, cursor: 'pointer', borderRadius: 3, letterSpacing: '0.1em', fontWeight: 600 } as React.CSSProperties,
  editCard: { padding: 20, background: '#0F0D0B', border: '1px solid var(--ab-line)', borderRadius: 4, marginBottom: 20 } as React.CSSProperties,
  editHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 10 } as React.CSSProperties,
  editTitle: { fontFamily: 'var(--ab-font-headline)', fontSize: 15, fontWeight: 700 } as React.CSSProperties,
  kindBtn: { padding: '6px 12px', background: 'transparent', color: 'var(--ab-gold-light)', border: '1px solid var(--ab-gold-line)', fontSize: 11, cursor: 'pointer', borderRadius: 3, fontFamily: 'var(--ab-font-body)' } as React.CSSProperties,
  kindPicker: { padding: 12, marginBottom: 16, background: '#0B0907', border: '1px solid var(--ab-gold-line)', borderRadius: 4 } as React.CSSProperties,
  kindGroupLabel: { fontFamily: 'var(--ab-font-body-latin)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ab-gold)', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 } as React.CSSProperties,
  kindGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 6 } as React.CSSProperties,
  kindItem: { padding: 10, background: 'transparent', color: 'var(--ab-text-soft)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--ab-line)', fontSize: 11, cursor: 'pointer', borderRadius: 3, textAlign: 'left', display: 'flex', flexDirection: 'column' } as React.CSSProperties,
  kindItemActive: { background: 'rgba(201, 166, 107, 0.08)', borderColor: 'var(--ab-gold)', color: 'var(--ab-ivory)' } as React.CSSProperties,
  dangerZone: { marginTop: 40, textAlign: 'center' } as React.CSSProperties,
  dangerToggle: { padding: '6px 14px', background: 'transparent', color: '#8A6A6A', border: '1px solid #2A1F1F', fontSize: 10, cursor: 'pointer', borderRadius: 3, letterSpacing: '0.15em', fontFamily: 'var(--ab-font-body-latin)' } as React.CSSProperties,
  dangerBtn: { padding: '10px 16px', background: '#3A1A1A', color: '#E8B0B0', border: '1px solid #5A2A2A', fontSize: 12, cursor: 'pointer', borderRadius: 3, fontFamily: 'var(--ab-font-body)' } as React.CSSProperties,
};

const f = {
  row: { marginBottom: 14, display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' } as React.CSSProperties,
  label: { minWidth: 90, paddingTop: 10, fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, color: 'var(--ab-gold)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 } as React.CSSProperties,
  input: { flex: 1, minWidth: 180, padding: '10px 12px', background: '#0F0D0B', border: '1px solid var(--ab-line)', color: 'var(--ab-ivory)', fontFamily: 'var(--ab-font-body)', fontSize: 13, borderRadius: 3, boxSizing: 'border-box', outline: 'none' } as React.CSSProperties,
  grp: { marginTop: 10 } as React.CSSProperties,
  grpLabel: { fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.15em', color: 'var(--ab-gold)', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 } as React.CSSProperties,
  smallBtn: { padding: '6px 12px', background: 'transparent', color: 'var(--ab-gold-light)', border: '1px dashed var(--ab-gold-line)', fontSize: 11, cursor: 'pointer', borderRadius: 3, fontFamily: 'var(--ab-font-body)' } as React.CSSProperties,
  tinyDelBtn: { background: 'transparent', color: '#E8B0B0', border: '1px solid var(--ab-line)', cursor: 'pointer', borderRadius: 3, fontSize: 12 } as React.CSSProperties,
};
