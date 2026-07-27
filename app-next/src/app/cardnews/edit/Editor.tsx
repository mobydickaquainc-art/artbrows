'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CardnewsProject } from '@/lib/cardnews-storage';
import type { Slide, Lang, LangContent } from '../types';
import { LANGS, LANG_LABEL, LANG_FULL } from '../types';
import { SlideRender } from '../SlideRender';
import { SlideForm } from './SlideForm';
import { artbrowsPalette } from '@/lib/artbrows/tokens';
import { shouldShowInstaChrome } from '@/lib/cardnews-agents/style-presets';
import OverlayInspector from './OverlayInspector';
import { ImageWithOverlay } from '../layouts/ImageWithOverlay';
import type { ImageWithOverlaySlide, TextOverlay } from '../types';

const NEW_SLIDE = (): Slide => ({ kind: 'cover-founder', category: 'founder', eyebrow: '', headline: '새 슬라이드', highlight: '' });

const emptyLang = (title = ''): LangContent => ({ title, slides: [] });

function ensureLang(project: CardnewsProject, lang: Lang): CardnewsProject {
  if (project.translations[lang]) return project;
  return { ...project, translations: { ...project.translations, [lang]: emptyLang() } };
}

export default function Editor({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<CardnewsProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [lang, setLang] = useState<Lang>('ko');
  const [selected, setSelected] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [selectedOverlayIdx, setSelectedOverlayIdx] = useState<number | null>(null);
  // 문장 교체 모드 (드래그로 영역 선택 → 새 문장 입력 → 스타일 카피 오버레이 추가)
  const [replaceMode, setReplaceMode] = useState(false);
  const [replaceBusy, setReplaceBusy] = useState(false);
  const [replaceDraft, setReplaceDraft] = useState<{
    bbox: { x: number; y: number; w: number; h: number };
    analysis: {
      text: string; fontSizePct: number; color: string; bgColor: string;
      weight: 'normal' | 'medium' | 'bold' | 'black';
      align: 'left' | 'center' | 'right';
      fontFamily: 'sans' | 'serif' | 'display' | 'brush' | 'heavy' | 'serif-latin';
      surroundingDominantColor?: string;
    };
    newText: string;
  } | null>(null);

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

  function patch(next: Partial<CardnewsProject>) {
    if (!project) return;
    setProject({ ...project, ...next });
    setDirty(true);
  }

  // 현재 언어의 slides 접근
  const currentLangContent: LangContent = project?.translations?.[lang] ?? emptyLang();
  const slides = currentLangContent.slides;

  function updateLangContent(next: LangContent) {
    if (!project) return;
    patch({ translations: { ...project.translations, [lang]: next } });
  }

  function updateSlide(i: number, s: Slide) {
    const newSlides = [...slides];
    newSlides[i] = s;
    updateLangContent({ ...currentLangContent, slides: newSlides });
  }

  function addSlide() {
    const newSlides = [...slides, NEW_SLIDE()];
    updateLangContent({ ...currentLangContent, slides: newSlides });
    setSelected(newSlides.length - 1);
  }

  function moveSlide(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const newSlides = [...slides];
    [newSlides[i], newSlides[j]] = [newSlides[j], newSlides[i]];
    updateLangContent({ ...currentLangContent, slides: newSlides });
    setSelected(j);
  }

  function removeSlide(i: number) {
    if (!confirm(`${i + 1}번 슬라이드 삭제?`)) return;
    const newSlides = slides.filter((_, k) => k !== i);
    updateLangContent({ ...currentLangContent, slides: newSlides });
    setSelected(Math.max(0, Math.min(selected, newSlides.length - 1)));
  }

  function copyFromDefault() {
    if (!project) return;
    if (lang === project.defaultLang) { alert('기본 언어에서 다른 언어로만 복사 가능'); return; }
    const source = project.translations[project.defaultLang];
    if (!source || source.slides.length === 0) { alert('기본 언어에 슬라이드가 없어요'); return; }
    const currentCount = slides.length;
    const msg = currentCount > 0
      ? `현재 ${LANG_FULL[lang]}에 슬라이드 ${currentCount}개 있음. 기본 언어(${LANG_FULL[project.defaultLang]})에서 ${source.slides.length}개 복사해서 덮어쓸까요?`
      : `기본 언어(${LANG_FULL[project.defaultLang]})의 슬라이드 ${source.slides.length}개를 이 언어로 복사할까요?`;
    if (!confirm(msg)) return;
    updateLangContent({
      title: currentLangContent.title || source.title,
      slides: JSON.parse(JSON.stringify(source.slides)) as Slide[],
    });
    setSelected(0);
  }

  function setLangTab(l: Lang) {
    if (project && !project.translations[l]) {
      setProject(ensureLang(project, l));
    }
    setLang(l);
    setSelected(0);
  }

  async function save() {
    if (!project) return;
    setSaving(true); setErr(null);
    try {
      const r = await fetch(`/api/cardnews/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'failed');
      setProject(j.project);
      setDirty(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'failed');
    } finally { setSaving(false); }
  }

  async function deleteProject() {
    if (!project) return;
    const msg = `「${project.title}」\n(${project.id})\n\n프로젝트 파일을 완전 삭제할까요? 되돌릴 수 없습니다.`;
    if (!confirm(msg)) return;
    setDeleting(true); setErr(null);
    try {
      const r = await fetch(`/api/cardnews/${id}?mode=hard`, { method: 'DELETE' });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j?.error || 'delete failed');
      }
      router.push('/cardnews');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'delete failed');
      setDeleting(false);
    }
  }

  async function onDragComplete(bbox: { x: number; y: number; w: number; h: number }) {
    if (!current || current.kind !== 'image-with-overlay') return;
    const imgSrc = (current as ImageWithOverlaySlide).imageSrc;
    if (!imgSrc) return;
    setReplaceBusy(true);
    try {
      const r = await fetch('/api/cardnews/analyze-region', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: imgSrc, bbox }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j?.error || `HTTP ${r.status}`);
      setReplaceDraft({ bbox, analysis: j.analysis, newText: j.analysis.text || '' });
    } catch (e) {
      alert('영역 분석 실패: ' + (e instanceof Error ? e.message : e));
      setReplaceMode(false);
    } finally {
      setReplaceBusy(false);
    }
  }
  function confirmReplace() {
    if (!current || current.kind !== 'image-with-overlay' || !replaceDraft) return;
    const s = current as ImageWithOverlaySlide;
    const a = replaceDraft.analysis;
    // 2026-07-27 · 대표님 지시 「뒤에를 없애고 스타일을 그대로 카피해서 새로 나와야 한다」
    // cover = bbox 를 opaque 색으로 먼저 채워 원본 텍스트 픽셀 완전 가림
    // 우선순위: surroundingDominantColor (Gemini 감지) → bgColor 를 opaque 로 승격 → 안전값 #241812
    const cover = a.surroundingDominantColor && /^#[0-9a-f]{6}$/i.test(a.surroundingDominantColor)
      ? a.surroundingDominantColor
      : opacifyBg(a.bgColor);
    const newOverlay: TextOverlay = {
      text: replaceDraft.newText || a.text,
      original: a.text,
      x: replaceDraft.bbox.x, y: replaceDraft.bbox.y,
      w: replaceDraft.bbox.w, h: replaceDraft.bbox.h,
      fontSizePct: a.fontSizePct,
      color: a.color,
      // 배경은 감지한 반투명 색 우선 · 없으면 주변 dominant 로 반투명 매칭
      bgColor: a.bgColor || (a.surroundingDominantColor ? `${a.surroundingDominantColor}CC` : 'rgba(0,0,0,.55)'),
      cover,
      weight: a.weight, align: a.align, fontFamily: a.fontFamily, padding: 6,
    };
    const next: ImageWithOverlaySlide = { ...s, overlays: [...(s.overlays || []), newOverlay] };
    updateSlide(selected, next as Slide);
    setSelectedOverlayIdx(next.overlays.length - 1);
    setReplaceDraft(null);
    setReplaceMode(false);
  }
  // rgba(R,G,B,a) or #RRGGBB[AA] → opaque #RRGGBB (a 무시)
  function opacifyBg(bg: string | undefined): string {
    if (!bg) return '#241812';
    const s = bg.trim();
    const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (m) {
      const [r, g, b] = [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
      const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    if (/^#[0-9a-f]{6}[0-9a-f]{2}$/i.test(s)) return s.slice(0, 7);
    if (/^#[0-9a-f]{6}$/i.test(s)) return s;
    return '#241812';
  }
  function cancelReplace() {
    setReplaceDraft(null);
    setReplaceMode(false);
  }

  if (loading) return <main style={styles.wrap}><div style={{ color: 'var(--ab-text-muted)', padding: 40 }}>불러오는 중…</div></main>;
  if (err && !project) return <main style={styles.wrap}><div style={{ color: '#E8B0B0', padding: 40 }}>⚠ {err}</div></main>;
  if (!project) return null;

  const current = slides[selected];

  return (
    <main style={styles.wrap}>
      {/* 상단 툴바 */}
      <div style={styles.topbar}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Link href="/cardnews" style={styles.crumb}>← 프로젝트 목록</Link>
          <input
            value={project.title}
            onChange={(e) => patch({ title: e.target.value })}
            style={styles.titleInput}
          />
          <div style={styles.subInfo}>
            {project.id} · {project.status} · 기본 언어 {LANG_FULL[project.defaultLang]}
            {dirty ? <span style={{ color: 'var(--ab-gold)', marginLeft: 10 }}>● 저장 안 됨</span> : <span style={{ color: 'var(--ab-text-muted)', marginLeft: 10 }}>✓ 저장됨</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ fontSize: 10.5, color: 'var(--ab-text-muted)', letterSpacing: '0.15em' }}>DEFAULT</label>
          <select value={project.defaultLang} onChange={(e) => patch({ defaultLang: e.target.value as Lang })} style={styles.select}>
            {LANGS.map((l) => <option key={l} value={l}>{LANG_LABEL[l]} · {LANG_FULL[l]}</option>)}
          </select>
          <select value={project.status} onChange={(e) => patch({ status: e.target.value as CardnewsProject['status'] })} style={styles.select}>
            <option value="draft">작성 중</option>
            <option value="published">게시</option>
            <option value="archived">보관</option>
          </select>
          <Link href={`/cardnews/view/${project.id}?lang=${lang}`} style={styles.btnGhost}>미리보기 ↗</Link>
          {current?.kind === 'image-with-overlay' ? (
            <button
              onClick={() => { setReplaceMode((v) => !v); setSelectedOverlayIdx(null); }}
              disabled={replaceBusy}
              title="드래그로 이미지 위 문장 영역을 선택하면 · Gemini Vision 이 스타일 분석 · 새 문장으로 대체"
              style={{ padding: '8px 16px', background: replaceMode ? 'linear-gradient(135deg,#E85A9E,#B04070)' : 'linear-gradient(135deg,#E0C088,#B08862)', color: '#0B0907', border: 'none', borderRadius: 99, fontSize: 12, fontWeight: 800, cursor: 'pointer', letterSpacing: '.02em', boxShadow: '0 2px 8px rgba(224,192,136,.3)' }}
            >
              {replaceBusy ? '⏳ 분석 중…' : replaceMode ? '✕ 교체 취소' : '🎯 문장 교체'}
            </button>
          ) : null}
          <button onClick={save} disabled={saving || deleting} style={styles.btnPrimary}>{saving ? '저장 중…' : '저장'}</button>
          <button onClick={deleteProject} disabled={saving || deleting} title="프로젝트 파일 완전 삭제 · 되돌릴 수 없음" style={styles.btnDanger}>{deleting ? '삭제 중…' : '🗑 삭제'}</button>
        </div>
      </div>

      {/* 언어 탭 */}
      <div style={styles.langTabs}>
        {LANGS.map((l) => {
          const count = project.translations[l]?.slides?.length ?? 0;
          const active = l === lang;
          return (
            <button
              key={l}
              onClick={() => setLangTab(l)}
              style={{ ...styles.langTab, ...(active ? styles.langTabActive : {}) }}
            >
              <span style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 13, letterSpacing: '0.15em', fontWeight: 700 }}>{LANG_LABEL[l]}</span>
              <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.8 }}>{LANG_FULL[l]}</span>
              <span style={{ marginLeft: 10, fontSize: 11, opacity: 0.7 }}>
                {count > 0 ? `${count}장` : '—'}
                {l === project.defaultLang ? ' · 기본' : ''}
              </span>
            </button>
          );
        })}
        {lang !== project.defaultLang ? (
          <button onClick={copyFromDefault} style={{ ...styles.btnGhost, marginLeft: 'auto' }}>
            ⇥ {LANG_FULL[project.defaultLang]}에서 복사
          </button>
        ) : null}
      </div>

      {/* 언어별 제목 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
        <label style={{ fontSize: 10.5, color: 'var(--ab-gold)', letterSpacing: '0.2em', fontFamily: 'var(--ab-font-body-latin)' }}>{LANG_LABEL[lang]} TITLE</label>
        <input
          value={currentLangContent.title}
          placeholder={`${LANG_FULL[lang]} 제목 (선택 · 미리보기 상단 표시용)`}
          onChange={(e) => updateLangContent({ ...currentLangContent, title: e.target.value })}
          style={{ ...styles.select, flex: 1, fontSize: 13 }}
        />
      </div>

      {err ? <div style={styles.errBar}>⚠ {err}</div> : null}

      {/* 3분할 · 좌 목록 · 중 미리보기 · 우 편집 패널 (모비딕 editor_prototype 방식) */}
      <div style={styles.grid}>
        {/* Left · 슬라이드 리스트 */}
        <aside style={styles.pane}>
          <div style={styles.paneHead}>{LANG_LABEL[lang]} 슬라이드 ({slides.length})</div>
          {slides.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--ab-text-muted)', padding: '20px 8px', textAlign: 'center', border: '1px dashed var(--ab-line)', borderRadius: 4 }}>
              {LANG_FULL[lang]} 슬라이드가 없어요.<br />
              「+ 슬라이드 추가」로 시작하거나<br />
              「{LANG_FULL[project.defaultLang]}에서 복사」로 시드.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {slides.map((s, i) => (
                <div
                  key={i}
                  onClick={() => { setSelected(i); setSelectedOverlayIdx(null); }}
                  style={{ ...styles.slideItem, ...(i === selected ? styles.slideItemActive : {}) }}
                >
                  <div style={{ fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--ab-gold)', fontFamily: 'var(--ab-font-body-latin)' }}>
                    {String(i + 1).padStart(2, '0')} · {s.kind}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ab-text-soft)', marginTop: 4, opacity: 0.85 }}>
                    {artbrowsPalette[s.category].label}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    <button onClick={(e) => { e.stopPropagation(); moveSlide(i, -1); }} style={styles.tinyBtn} disabled={i === 0}>↑</button>
                    <button onClick={(e) => { e.stopPropagation(); moveSlide(i, 1); }} style={styles.tinyBtn} disabled={i === slides.length - 1}>↓</button>
                    <button onClick={(e) => { e.stopPropagation(); removeSlide(i); }} style={{ ...styles.tinyBtn, marginLeft: 'auto', color: '#E8B0B0' }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={addSlide} style={{ ...styles.btnGhost, marginTop: 12, width: '100%' }}>+ 슬라이드 추가</button>
        </aside>

        {/* Middle · 큰 미리보기 (오버레이 클릭으로 우측 인스펙터 연동) */}
        <section style={styles.pane}>
          <div style={styles.paneHead}>
            미리보기 · {LANG_LABEL[lang]} {selected + 1}번
            {current?.kind === 'image-with-overlay' ? (
              <span style={{ marginLeft: 10, fontSize: 10, color: '#8A7B6C', letterSpacing: 0, textTransform: 'none' }}>· 오버레이 클릭 = 우측 편집</span>
            ) : null}
          </div>
          {current ? (
            <div style={{ maxWidth: 460, margin: '0 auto', position: 'relative' }} className={shouldShowInstaChrome(project.stylePreset) ? undefined : 'no-insta-chrome'} data-style-preset={project.stylePreset ?? ''}>
              {current.kind === 'image-with-overlay' ? (
                <ImageWithOverlay
                  slide={current as ImageWithOverlaySlide}
                  editableSelection={{
                    selectedIdx: selectedOverlayIdx,
                    onSelect: setSelectedOverlayIdx,
                  }}
                  dragCapture={{ active: replaceMode && !replaceDraft, onComplete: onDragComplete }}
                />
              ) : (
                <SlideRender slide={current} />
              )}
              <div style={{ marginTop: 10, fontSize: 10.5, color: 'var(--ab-text-muted)', fontFamily: 'var(--ab-font-body-latin)', letterSpacing: '0.08em' }}>
                {LANG_LABEL[lang]} · {current.kind.toUpperCase()} · {artbrowsPalette[current.category].label}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--ab-text-muted)', textAlign: 'center', padding: 40 }}>슬라이드를 선택하거나 추가하세요.</div>
          )}
        </section>

        {/* Right · 편집 패널 (image-with-overlay 면 인스펙터 · 그 외 SlideForm) */}
        <section style={styles.pane}>
          <div style={styles.paneHead}>편집 · {LANG_LABEL[lang]} {selected + 1}번</div>
          {current ? (
            current.kind === 'image-with-overlay' ? (
              <OverlayInspector
                slide={current as ImageWithOverlaySlide}
                selectedOverlayIdx={selectedOverlayIdx}
                onSelectOverlay={setSelectedOverlayIdx}
                onChange={(next) => updateSlide(selected, next as Slide)}
              />
            ) : (
              <SlideForm slide={current} onChange={(s) => updateSlide(selected, s)} />
            )
          ) : (
            <div style={{ color: 'var(--ab-text-muted)' }}>슬라이드를 선택하거나 추가하세요.</div>
          )}

          {/* AI 대안 안 (자동 생성 시) — kind 무관 · 편집 패널 하단에 붙임 */}
          {(() => {
            if (!current) return null;
            const variantSet = project.autoVariants?.find((v) => v.index === selected);
            if (!variantSet || variantSet.variants.length === 0) return null;
            return (
              <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--ab-gold-line)' }}>
                <div style={{ fontSize: 10.5, letterSpacing: '0.2em', color: 'var(--ab-gold)', fontFamily: 'var(--ab-font-body-latin)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
                  🪄 AI 대안 안 · {variantSet.variants.length}개
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {variantSet.variants.map((v, i) => {
                    const isSame = JSON.stringify(v.slide) === JSON.stringify(current);
                    const head = v.slide.kind === 'quote-bold'
                      ? (v.slide as { quote?: string }).quote
                      : (v.slide as { headline?: string }).headline;
                    return (
                      <button
                        key={i}
                        disabled={isSame}
                        onClick={() => {
                          if (confirm(`이 슬라이드를 「${v.source.toUpperCase()}」 안으로 교체할까요?`)) {
                            updateSlide(selected, v.slide);
                          }
                        }}
                        style={{
                          textAlign: 'left', padding: 10,
                          border: `1px solid ${isSame ? 'var(--ab-gold)' : 'var(--ab-line)'}`,
                          background: isSame ? 'rgba(201, 166, 107, 0.06)' : 'transparent',
                          color: 'var(--ab-ivory)', borderRadius: 4,
                          cursor: isSame ? 'default' : 'pointer',
                          fontFamily: 'inherit', opacity: isSame ? 0.75 : 1,
                        }}
                      >
                        <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.15em', color: 'var(--ab-gold)', marginBottom: 4, fontWeight: 700 }}>
                          {isSame ? '● ' : '○ '}{v.source.toUpperCase()}{isSame ? ' · 현재' : ''}
                        </div>
                        <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 13, color: 'var(--ab-text-soft)', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                          {String(head || '').slice(0, 100)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </section>
      </div>

      {/* 문장 교체 · 확정 모달 (드래그 완료 · Gemini 분석 결과 · 새 문장 입력) */}
      {replaceDraft ? (
        <div onClick={(e) => { if (e.target === e.currentTarget) cancelReplace(); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(5,3,2,.82)', zIndex: 9999, overflowY: 'auto', padding: '40px 20px', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: 560, width: '100%', background: 'linear-gradient(180deg,#1E1A17,#0B0907)', border: '1px solid #A8854E', borderRadius: 14, padding: '28px 32px', color: '#F5EDE3', position: 'relative' }}>
            <div style={{ letterSpacing: '.28em', fontSize: 10.5, color: '#C9A66B', fontWeight: 800, marginBottom: 6 }}>🎯 문장 교체 · Gemini Vision 분석 완료</div>
            <h3 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 20, fontWeight: 500, margin: '0 0 14px', lineHeight: 1.4 }}>새 문장을 입력하면 · 원본 스타일 그대로 그 자리에 배치</h3>

            <div style={{ padding: 10, background: '#14100C', border: '1px solid #3A2E26', borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 10.5, color: '#8A7B6C', marginBottom: 4, letterSpacing: '.08em' }}>📷 원본 (드래그 영역 감지 결과)</div>
              <div style={{ fontSize: 13.5, color: '#B8A897', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>&ldquo;{replaceDraft.analysis.text || '(텍스트 없음)'}&rdquo;</div>
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 10, color: '#6B5A48' }}>
                <span>폰트: <b style={{ color: '#E0C088' }}>{replaceDraft.analysis.fontFamily}</b></span>
                <span>굵기: <b style={{ color: '#E0C088' }}>{replaceDraft.analysis.weight}</b></span>
                <span>크기: <b style={{ color: '#E0C088' }}>{replaceDraft.analysis.fontSizePct.toFixed(1)}%</b></span>
                <span>정렬: <b style={{ color: '#E0C088' }}>{replaceDraft.analysis.align}</b></span>
                <span>글자색: <b style={{ color: replaceDraft.analysis.color }}>{replaceDraft.analysis.color}</b></span>
                <span>배경: <span style={{ padding: '1px 6px', background: replaceDraft.analysis.bgColor, color: replaceDraft.analysis.color, borderRadius: 3, fontSize: 10 }}>{replaceDraft.analysis.bgColor.slice(0, 24)}</span></span>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#C9A66B', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 800, marginBottom: 6 }}>✏️ 새 문장</div>
              <textarea
                value={replaceDraft.newText}
                onChange={(e) => setReplaceDraft((d) => d ? { ...d, newText: e.target.value } : d)}
                rows={Math.max(2, (replaceDraft.newText.match(/\n/g)?.length ?? 0) + 2)}
                autoFocus
                placeholder="이 자리에 들어갈 새 문장을 입력하세요"
                style={{ width: '100%', background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 6, padding: '10px 12px', fontFamily: 'inherit', fontSize: 15, lineHeight: 1.5, resize: 'vertical' }}
              />
              <div style={{ fontSize: 10.5, color: '#6B5A48', marginTop: 4 }}>* 원본 스타일 (폰트·색·배경) 그대로 카피되고, 배치 후 우측 인스펙터에서 미세 조정 가능</div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={cancelReplace} style={{ padding: '10px 20px', background: 'transparent', color: '#8A7B6C', border: '1px solid #3A2E26', borderRadius: 99, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>취소</button>
              <button onClick={confirmReplace} disabled={!replaceDraft.newText.trim()}
                style={{ padding: '10px 26px', background: replaceDraft.newText.trim() ? 'linear-gradient(135deg,#E0C088,#B08862)' : '#3A2E26', color: '#0B0907', border: 'none', borderRadius: 99, cursor: replaceDraft.newText.trim() ? 'pointer' : 'not-allowed', fontWeight: 800, fontSize: 14, letterSpacing: '.02em', boxShadow: '0 4px 12px rgba(224,192,136,.3)' }}>✅ 이 자리에 배치</button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

const styles = {
  wrap: { minHeight: '100vh', background: 'var(--ab-black)', color: 'var(--ab-ivory)', padding: '20px 24px 60px', fontFamily: 'var(--ab-font-body)' } as React.CSSProperties,
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, paddingBottom: 16, borderBottom: '1px solid var(--ab-line)', marginBottom: 16 } as React.CSSProperties,
  crumb: { fontSize: 11.5, color: 'var(--ab-gold-light)', textDecoration: 'none', letterSpacing: '0.06em' } as React.CSSProperties,
  titleInput: { display: 'block', marginTop: 8, background: 'transparent', border: 'none', color: 'var(--ab-ivory)', fontFamily: 'var(--ab-font-headline)', fontSize: 24, fontWeight: 800, padding: 0, outline: 'none', width: '100%', minWidth: 300 } as React.CSSProperties,
  subInfo: { marginTop: 4, fontSize: 11.5, color: 'var(--ab-text-muted)', fontFamily: 'var(--ab-font-body-latin)', letterSpacing: '0.05em' } as React.CSSProperties,
  select: { padding: '8px 12px', background: '#0F0D0B', border: '1px solid var(--ab-line)', color: 'var(--ab-ivory)', fontSize: 12, borderRadius: 3, fontFamily: 'inherit' } as React.CSSProperties,
  btnGhost: { padding: '8px 14px', background: 'transparent', color: 'var(--ab-gold-light)', border: '1px solid var(--ab-gold-line)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, letterSpacing: '0.06em', fontWeight: 700, cursor: 'pointer', borderRadius: 3, textDecoration: 'none', display: 'inline-block' } as React.CSSProperties,
  btnPrimary: { padding: '8px 18px', background: 'var(--ab-gold)', color: 'var(--ab-black)', border: 'none', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, letterSpacing: '0.06em', fontWeight: 700, cursor: 'pointer', borderRadius: 3 } as React.CSSProperties,
  btnDanger: { padding: '8px 14px', background: 'transparent', color: '#E8B0B0', border: '1px solid rgba(232, 120, 120, 0.4)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, letterSpacing: '0.06em', fontWeight: 700, cursor: 'pointer', borderRadius: 3 } as React.CSSProperties,
  errBar: { padding: '10px 14px', background: 'rgba(122, 53, 56, 0.15)', border: '1px solid rgba(122, 53, 56, 0.4)', color: '#F5EEE0', fontSize: 12.5, borderRadius: 4, marginBottom: 16 } as React.CSSProperties,
  langTabs: { display: 'flex', gap: 6, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid var(--ab-line-soft)', alignItems: 'center', flexWrap: 'wrap' } as React.CSSProperties,
  langTab: { padding: '10px 16px', background: 'transparent', color: 'var(--ab-text-soft)', border: '1px solid var(--ab-line)', borderRadius: 3, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'baseline' } as React.CSSProperties,
  langTabActive: { border: '1px solid var(--ab-gold)', background: 'rgba(201, 166, 107, 0.08)', color: 'var(--ab-ivory)' } as React.CSSProperties,
  grid: { display: 'grid', gridTemplateColumns: '240px 1fr 380px', gap: 16, alignItems: 'flex-start' } as React.CSSProperties,
  pane: { background: '#0F0D0B', border: '1px solid var(--ab-line)', borderRadius: 6, padding: 16, maxHeight: 'calc(100vh - 220px)', overflow: 'auto' } as React.CSSProperties,
  paneHead: { fontSize: 11, letterSpacing: '0.2em', color: 'var(--ab-gold)', textTransform: 'uppercase', marginBottom: 14, fontFamily: 'var(--ab-font-body-latin)', fontWeight: 600 } as React.CSSProperties,
  slideItem: { padding: 10, border: '1px solid var(--ab-line)', borderRadius: 4, cursor: 'pointer', background: 'transparent', transition: 'all .12s' } as React.CSSProperties,
  slideItemActive: { border: '1px solid var(--ab-gold)', background: 'rgba(201, 166, 107, 0.06)' } as React.CSSProperties,
  tinyBtn: { padding: '3px 8px', background: 'transparent', color: 'var(--ab-text-soft)', border: '1px solid var(--ab-line)', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' } as React.CSSProperties,
};
