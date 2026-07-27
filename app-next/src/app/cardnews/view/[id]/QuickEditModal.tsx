'use client';

/**
 * QuickEditModal · 2026-07-27
 * 뷰어에서 슬라이드 하나의 텍스트 필드만 즉시 편집 (편집기 안 열고 · 모달로)
 * 대표님 지시: 「상세페이지 텍스트 수정하듯이 · 폰트·스타일 유지하며 문장만 교체」
 * MVP: 모든 문자열 필드 노출 · 저장 시 PUT /api/cardnews/{id}
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  projectId: string;
  slideIndex: number;
  lang: string;
  slide: Record<string, unknown>;
  translations: Record<string, unknown>;
  onClose: () => void;
  // Editor 통합용 · 있으면 fetch 대신 이 handler 호출 (로컬 state 갱신)
  onLocalSave?: (updated: Record<string, string>) => void;
}

const FIELD_LABELS: Record<string, string> = {
  headline: '헤드라인',
  subheadline: '서브 헤드라인',
  eyebrow: '위 라벨 (eyebrow)',
  volume: '볼륨',
  brand: '브랜드',
  signatureLabel: '시그니처 라벨',
  bottomLabel: '하단 라벨',
  cornerBadge: '코너 뱃지',
  quote: '인용문',
  by: '인용 서명',
  signature: '서명 (필기체)',
  signatureRole: '서명 직함',
  overlayLabel: '오버레이 라벨',
  leftTitle: '좌측 제목',
  rightHeadline: '우측 헤드라인',
  rightPrice: '우측 가격',
  rightFootnote: '우측 각주',
  highlight: '강조 단어',
  cta: 'CTA 버튼 텍스트',
  ctaHref: 'CTA 링크',
  subline: '서브라인',
  killer: '킬러 카피',
  imageAlt: '이미지 대체 텍스트',
  imageSrc: '이미지 경로 (변경 시 편집기)',
  beforeLabel: 'BEFORE 라벨',
  afterLabel: 'AFTER 라벨',
  bottomStrip: '하단 스트립',
};

// 순서 · 자주 편집하는 필드 우선
const FIELD_ORDER = [
  'headline', 'subheadline', 'quote', 'by',
  'eyebrow', 'volume', 'brand',
  'bottomLabel', 'cornerBadge', 'overlayLabel', 'signature', 'signatureRole', 'signatureLabel',
  'leftTitle', 'rightHeadline', 'rightPrice', 'rightFootnote',
  'highlight', 'cta', 'ctaHref', 'subline',
  'killer', 'beforeLabel', 'afterLabel', 'bottomStrip',
  'imageAlt',
];

export default function QuickEditModal({ projectId, slideIndex, lang, slide, translations, onClose, onLocalSave }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 편집 대상 = 문자열 필드만 (배열·객체는 편집기로 안내)
  const stringFields = Object.entries(slide)
    .filter(([k, v]) => typeof v === 'string' && k !== 'kind' && k !== 'category')
    .sort(([a], [b]) => {
      const ai = FIELD_ORDER.indexOf(a);
      const bi = FIELD_ORDER.indexOf(b);
      if (ai < 0 && bi < 0) return a.localeCompare(b);
      if (ai < 0) return 1;
      if (bi < 0) return -1;
      return ai - bi;
    });

  const [values, setValues] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    for (const [k, v] of stringFields) m[k] = String(v ?? '');
    return m;
  });

  // ── image-with-overlay 슬라이드 · 원장이 배치한 오버레이 배열 + AI 카피 팔레트 편집 ──
  const rawOverlays = Array.isArray(slide.overlays) ? slide.overlays : [];
  const [overlays, setOverlays] = useState<Array<Record<string, unknown>>>(() =>
    rawOverlays.map((o) => (o && typeof o === 'object' ? { ...(o as Record<string, unknown>) } : {}))
  );
  const rawPalette = Array.isArray(slide.copyPalette) ? slide.copyPalette : [];
  const [palette, setPalette] = useState<Array<Record<string, unknown>>>(() =>
    rawPalette.map((o) => (o && typeof o === 'object' ? { ...(o as Record<string, unknown>) } : {}))
  );
  const isOverlaySlide = String(slide.kind) === 'image-with-overlay';

  // 배치 모드: 'original' = 원본 좌표·색·배경 그대로 · 'preset' = role 프리셋 위치·크기
  function makeOverlayFromPalette(item: Record<string, unknown>, mode: 'original' | 'preset' = 'original'): Record<string, unknown> {
    const role = String(item.role || 'body');
    const text = String(item.text || '');
    const family = String(item.hintFontFamily || 'sans');
    const weight = String(item.hintWeight || 'bold');
    const align = String(item.hintAlign || 'left') as 'left' | 'center' | 'right';
    const hintColor = String(item.hintColor || '#FFFFFF');
    const hintBg = String(item.hintBgColor || 'rgba(0,0,0,.55)');
    const hasOriginalCoords =
      typeof item.hintX === 'number' && typeof item.hintY === 'number' &&
      typeof item.hintW === 'number' && typeof item.hintH === 'number';
    const preset: Record<string, { x: number; y: number; w: number; h: number; fs: number; align: 'left'|'center'|'right'; bg: string }> = {
      headline:    { x: 6,  y: 8,  w: 88, h: 18, fs: 10, align: 'left',   bg: 'rgba(0,0,0,.55)' },
      subheadline: { x: 6,  y: 28, w: 88, h: 9,  fs: 5,  align: 'left',   bg: 'rgba(0,0,0,.5)'  },
      body:        { x: 6,  y: 45, w: 88, h: 30, fs: 3.5, align: 'left',  bg: 'rgba(0,0,0,.5)'  },
      quote:       { x: 8,  y: 35, w: 84, h: 25, fs: 6,  align: 'center', bg: 'rgba(0,0,0,.55)' },
      cta:         { x: 20, y: 82, w: 60, h: 8,  fs: 4,  align: 'center', bg: 'rgba(60,45,35,.85)' },
      label:       { x: 6,  y: 90, w: 40, h: 5,  fs: 2,  align: 'left',   bg: 'rgba(0,0,0,.5)'  },
    };
    const p = preset[role] || preset.body;
    if (mode === 'original' && hasOriginalCoords) {
      // 원본 스타일 그대로 · 문장만 대체
      return {
        text, original: text,
        x: Number(item.hintX), y: Number(item.hintY),
        w: Number(item.hintW), h: Number(item.hintH),
        fontSizePct: typeof item.hintFontSizePct === 'number' ? item.hintFontSizePct : p.fs,
        color: hintColor,
        bgColor: hintBg,
        weight, align, fontFamily: family, padding: 6,
      };
    }
    // 프리셋 배치 (role 기반 · 원본 좌표 무시)
    return {
      text, original: text,
      x: p.x, y: p.y, w: p.w, h: p.h,
      fontSizePct: typeof item.hintFontSizePct === 'number' ? item.hintFontSizePct : p.fs,
      color: hintColor,
      bgColor: p.bg,
      weight, align: p.align, fontFamily: family, padding: 8,
    };
  }

  function addFromPalette(idx: number, mode: 'original' | 'preset' = 'original') {
    const item = palette[idx];
    if (!item) return;
    setOverlays((prev) => [...prev, makeOverlayFromPalette(item, mode)]);
  }
  function removeOverlay(idx: number) {
    setOverlays((prev) => prev.filter((_, i) => i !== idx));
  }
  function nudgeOverlay(idx: number, patch: Record<string, unknown>) {
    setOverlays((prev) => prev.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  }
  function addBlankHeadline() {
    setOverlays((prev) => [...prev, makeOverlayFromPalette({ text: '새 문장', role: 'headline', hintColor: '#FFFFFF', hintFontFamily: 'sans', hintWeight: 'bold' })]);
  }

  // ── 스타일 프리셋 (배치된 오버레이 원클릭 컨트롤용) ──
  const COLOR_SWATCHES: Array<[string, string]> = [
    ['#FFFFFF', '화이트'], ['#F5EDE3', '아이보리'], ['#E0C088', '골드'], ['#B08862', '다크골드'],
    ['#3A2E26', '딥브라운'], ['#0B0907', '블랙'], ['#E85A9E', '핫핑크'], ['#FFCFB8', '살구핑크'],
  ];
  const BG_SWATCHES: Array<[string, string]> = [
    ['transparent', '없음'],
    ['rgba(0,0,0,.55)', '투명검정'],
    ['rgba(60,45,35,.72)', '투명갈색'],
    ['rgba(224,192,136,.72)', '투명골드'],
    ['rgba(11,9,7,.92)', '검정pill'],
    ['rgba(255,255,255,.92)', '화이트박스'],
  ];
  const FONT_PRESETS: Array<[string, string, string]> = [
    ['sans',        '고딕',    "'Noto Sans KR',sans-serif"],
    ['serif',       '명조',    "'Nanum Myeongjo',serif"],
    ['serif-latin', 'Cormorant', "'Cormorant Garamond',serif"],
    ['display',     'Playfair',  "'Playfair Display',serif"],
    ['heavy',       '임팩트',  "'Black Han Sans',sans-serif"],
    ['brush',       '필기',    "'Nanum Pen Script',cursive"],
  ];
  const WEIGHT_PRESETS: Array<['normal' | 'medium' | 'bold' | 'black', string, number]> = [
    ['normal', 'L', 400], ['medium', 'M', 600], ['bold', 'B', 800], ['black', 'Bl', 900],
  ];
  const ALIGN_PRESETS: Array<['left' | 'center' | 'right', string]> = [
    ['left', '⇤'], ['center', '⇔'], ['right', '⇥'],
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  async function save() {
    setBusy(true); setErr(null);
    try {
      const merge: Record<string, unknown> = { ...values };
      if (isOverlaySlide) {
        merge.overlays = overlays;
        merge.copyPalette = palette;
      }
      // Editor 통합 모드 = 로컬 state 갱신만 · fetch X
      if (onLocalSave) {
        onLocalSave(merge as Record<string, string>);
        onClose();
        return;
      }
      // 뷰어 모드 = 서버에 PUT 저장
      const langContent = translations[lang] as { title: string; slides: Record<string, unknown>[] };
      const newSlides = langContent.slides.map((s, i) => {
        if (i !== slideIndex) return s;
        return { ...s, ...merge };
      });
      const newTranslations = { ...translations, [lang]: { ...langContent, slides: newSlides } };
      const r = await fetch(`/api/cardnews/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translations: newTranslations, updatedAt: new Date().toISOString() }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error || `HTTP ${r.status}`);
      }
      onClose();
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : '저장 실패');
    } finally {
      setBusy(false);
    }
  }

  const kindLabel = String(slide.kind || 'unknown');
  const preview = String(slide.headline || slide.quote || slide.eyebrow || '') || `[슬라이드 ${slideIndex + 1}]`;

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(5,3,2,.82)', zIndex: 9999, overflowY: 'auto', padding: '40px 20px', backdropFilter: 'blur(4px)' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', background: 'linear-gradient(180deg,#1E1A17,#0B0907)', border: '1px solid #A8854E', borderRadius: 14, padding: '28px 32px', color: '#F5EDE3', position: 'relative' }}>
        <button onClick={onClose} aria-label="닫기" style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,.6)', color: '#F5EDE3', border: '1px solid rgba(224,192,136,.35)', borderRadius: 99, width: 32, height: 32, fontSize: 18, cursor: 'pointer', lineHeight: 1, fontWeight: 700 }}>×</button>

        <div style={{ letterSpacing: '.32em', fontSize: 10.5, color: '#C9A66B', fontWeight: 800, marginBottom: 6 }}>QUICK EDIT · 슬라이드 {slideIndex + 1}</div>
        <h3 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 22, fontWeight: 500, margin: '0 0 4px', lineHeight: 1.35 }}>{preview.split('\n')[0].slice(0, 40)}</h3>
        <div style={{ fontSize: 11.5, color: '#8A7B6C', marginBottom: 20 }}>Kind: <b style={{ color: '#C9A66B' }}>{kindLabel}</b> · 텍스트만 편집. 이미지·레이아웃은 <a href={`/cardnews/edit/${projectId}?slide=${slideIndex}`} style={{ color: '#E0C088', textDecoration: 'underline' }}>편집기</a>에서.</div>

        {/* ── image-with-overlay · AI 카피 팔레트 (원본 위에 자동 X · 클릭해서 배치) ── */}
        {isOverlaySlide ? (
          <>
            {palette.length > 0 ? (
              <div style={{ marginBottom: 16, padding: 14, background: 'rgba(224,192,136,.06)', border: '1px solid #A8854E', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#E0C088', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  🎨 AI 카피 팔레트 · {palette.length}개
                  <span style={{ fontSize: 10, color: '#6B5A48', letterSpacing: '.06em', textTransform: 'none', fontWeight: 400 }}>· 문장 다듬어서 &laquo;+ 슬라이드에 추가&raquo; 로 배치</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '28vh', overflowY: 'auto', paddingRight: 4 }}>
                  {palette.map((p, i) => {
                    const cur = String(p.text ?? '');
                    const orig = String(p.original ?? '');
                    const role = String(p.role || 'body');
                    const isLong = cur.length > 40;
                    return (
                      <div key={i} style={{ padding: 8, background: '#14100C', border: '1px solid #3A2E26', borderRadius: 6 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, fontSize: 10, color: '#8A7B6C', flexWrap: 'wrap' }}>
                          <span style={{ padding: '1px 6px', background: 'rgba(224,192,136,.15)', color: '#E0C088', borderRadius: 3, fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 700 }}>{role}</span>
                          {orig && orig !== cur ? <span style={{ color: '#6B5A48' }}>원본: <i style={{ color: '#8A7B6C' }}>&ldquo;{orig.slice(0, 24)}{orig.length > 24 ? '…' : ''}&rdquo;</i></span> : null}
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
                          {isLong ? (
                            <textarea value={cur} rows={2}
                              onChange={(e) => setPalette((prev) => prev.map((q, k) => k === i ? { ...q, text: e.target.value } : q))}
                              style={{ flex: 1, background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 4, padding: '6px 8px', fontFamily: 'inherit', fontSize: 13, lineHeight: 1.4, resize: 'vertical' }} />
                          ) : (
                            <input type="text" value={cur}
                              onChange={(e) => setPalette((prev) => prev.map((q, k) => k === i ? { ...q, text: e.target.value } : q))}
                              style={{ flex: 1, background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 4, padding: '6px 8px', fontFamily: 'inherit', fontSize: 13 }} />
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <button type="button" onClick={() => addFromPalette(i, 'original')}
                              title="원본 위치·색·폰트 그대로 · 문장만 대체"
                              style={{ padding: '3px 10px', background: 'linear-gradient(135deg,#E0C088,#B08862)', color: '#0B0907', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 800, fontSize: 11, whiteSpace: 'nowrap' }}>원본 스타일</button>
                            <button type="button" onClick={() => addFromPalette(i, 'preset')}
                              title="기본 프리셋 위치·크기로 배치"
                              style={{ padding: '3px 10px', background: 'transparent', color: '#E0C088', border: '1px solid #A8854E', borderRadius: 4, cursor: 'pointer', fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap' }}>기본 위치</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* 배치된 오버레이 리스트 (원장이 슬라이드에 얹은 것) */}
            <div style={{ marginBottom: 16, padding: 14, background: 'rgba(11,9,7,.6)', border: '1px solid #3A2E26', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#C9A66B', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                📌 배치된 오버레이 · {overlays.length}개
                <button type="button" onClick={addBlankHeadline}
                  style={{ marginLeft: 'auto', padding: '4px 10px', background: 'transparent', color: '#E0C088', border: '1px dashed #A8854E', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>+ 빈 헤드라인</button>
              </div>
              {overlays.length === 0 ? (
                <div style={{ fontSize: 12, color: '#6B5A48', textAlign: 'center', padding: '14px 8px' }}>아직 배치된 오버레이가 없습니다. 위 팔레트에서 &laquo;+ 슬라이드&raquo; 로 추가하세요.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '32vh', overflowY: 'auto', paddingRight: 4 }}>
                  {overlays.map((o, i) => {
                    const cur = String(o.text ?? '');
                    const isLong = cur.length > 40;
                    const x = Number(o.x ?? 0), y = Number(o.y ?? 0);
                    const fs = Number(o.fontSizePct ?? 4);
                    return (
                      <div key={i} style={{ padding: 8, background: '#14100C', border: '1px solid #3A2E26', borderRadius: 6 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 5, fontSize: 10.5, color: '#8A7B6C' }}>
                          <b style={{ color: '#E0C088' }}>#{i + 1}</b>
                          <span style={{ color: '#6B5A48' }}>x{x.toFixed(0)}·y{y.toFixed(0)}·크기{fs.toFixed(1)}%</span>
                          <button type="button" onClick={() => removeOverlay(i)}
                            style={{ marginLeft: 'auto', padding: '2px 8px', background: 'rgba(200,60,60,.12)', color: '#FFB0B0', border: '1px solid rgba(200,60,60,.35)', borderRadius: 3, cursor: 'pointer', fontSize: 11 }}>× 삭제</button>
                        </div>
                        {isLong ? (
                          <textarea value={cur} rows={cur.split('\n').length + 1}
                            onChange={(e) => nudgeOverlay(i, { text: e.target.value })}
                            style={{ width: '100%', background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 4, padding: '6px 8px', fontFamily: 'inherit', fontSize: 13, lineHeight: 1.4, resize: 'vertical' }} />
                        ) : (
                          <input type="text" value={cur}
                            onChange={(e) => nudgeOverlay(i, { text: e.target.value })}
                            style={{ width: '100%', background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 4, padding: '6px 8px', fontFamily: 'inherit', fontSize: 13 }} />
                        )}
                        {/* 위치·크기 슬라이더 (간소) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 6, alignItems: 'center', marginTop: 6, fontSize: 10.5, color: '#8A7B6C' }}>
                          <span style={{ minWidth: 22 }}>X</span>
                          <input type="range" min={0} max={100} step={1} value={x} onChange={(e) => nudgeOverlay(i, { x: Number(e.target.value) })} style={{ accentColor: '#E0C088' }} />
                          <span style={{ minWidth: 30, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{x.toFixed(0)}%</span>
                          <span style={{ minWidth: 22 }}>Y</span>
                          <input type="range" min={0} max={100} step={1} value={y} onChange={(e) => nudgeOverlay(i, { y: Number(e.target.value) })} style={{ accentColor: '#E0C088' }} />
                          <span style={{ minWidth: 30, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{y.toFixed(0)}%</span>
                          <span style={{ minWidth: 22 }}>크기</span>
                          <input type="range" min={1} max={20} step={0.5} value={fs} onChange={(e) => nudgeOverlay(i, { fontSizePct: Number(e.target.value) })} style={{ accentColor: '#E0C088' }} />
                          <span style={{ minWidth: 30, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fs.toFixed(1)}</span>
                        </div>

                        {/* ── 폰트 프리셋 (6종) ── */}
                        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                          <span style={{ fontSize: 10, color: '#6B5A48', minWidth: 30 }}>폰트</span>
                          {FONT_PRESETS.map(([key, label, css]) => {
                            const active = String(o.fontFamily || 'sans') === key;
                            return (
                              <button key={key} type="button" onClick={() => nudgeOverlay(i, { fontFamily: key })}
                                style={{ padding: '3px 8px', fontSize: 11, fontFamily: css, background: active ? 'rgba(224,192,136,.2)' : 'transparent', color: active ? '#E0C088' : '#B8A897', border: `1px solid ${active ? '#E0C088' : '#3A2E26'}`, borderRadius: 3, cursor: 'pointer' }}>{label}</button>
                            );
                          })}
                        </div>

                        {/* ── 굵기·정렬 ── */}
                        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                          <span style={{ fontSize: 10, color: '#6B5A48', minWidth: 30 }}>굵기</span>
                          {WEIGHT_PRESETS.map(([key, label, w]) => {
                            const active = String(o.weight || 'normal') === key;
                            return (
                              <button key={key} type="button" onClick={() => nudgeOverlay(i, { weight: key })}
                                style={{ padding: '3px 8px', fontSize: 11, fontWeight: w, background: active ? 'rgba(224,192,136,.2)' : 'transparent', color: active ? '#E0C088' : '#B8A897', border: `1px solid ${active ? '#E0C088' : '#3A2E26'}`, borderRadius: 3, cursor: 'pointer', minWidth: 24 }}>{label}</button>
                            );
                          })}
                          <span style={{ fontSize: 10, color: '#6B5A48', marginLeft: 8 }}>정렬</span>
                          {ALIGN_PRESETS.map(([key, sym]) => {
                            const active = String(o.align || 'left') === key;
                            return (
                              <button key={key} type="button" onClick={() => nudgeOverlay(i, { align: key })}
                                style={{ padding: '3px 8px', fontSize: 12, background: active ? 'rgba(224,192,136,.2)' : 'transparent', color: active ? '#E0C088' : '#B8A897', border: `1px solid ${active ? '#E0C088' : '#3A2E26'}`, borderRadius: 3, cursor: 'pointer' }}>{sym}</button>
                            );
                          })}
                        </div>

                        {/* ── 텍스트 색 프리셋 + 직접 입력 ── */}
                        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                          <span style={{ fontSize: 10, color: '#6B5A48', minWidth: 30 }}>글자색</span>
                          {COLOR_SWATCHES.map(([hex, name]) => {
                            const active = String(o.color || '#FFFFFF').toLowerCase() === hex.toLowerCase();
                            return (
                              <button key={hex} type="button" onClick={() => nudgeOverlay(i, { color: hex })} title={name}
                                style={{ width: 20, height: 20, borderRadius: '50%', background: hex, border: `2px solid ${active ? '#E0C088' : '#3A2E26'}`, cursor: 'pointer', padding: 0 }} />
                            );
                          })}
                          <input type="color" value={String(o.color || '#FFFFFF').startsWith('#') ? String(o.color) : '#FFFFFF'} onChange={(e) => nudgeOverlay(i, { color: e.target.value })}
                            style={{ width: 24, height: 20, background: 'transparent', border: '1px solid #3A2E26', borderRadius: 3, cursor: 'pointer' }} title="직접 색 선택" />
                        </div>

                        {/* ── 배경 프리셋 ── */}
                        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                          <span style={{ fontSize: 10, color: '#6B5A48', minWidth: 30 }}>배경</span>
                          {BG_SWATCHES.map(([bg, name]) => {
                            const active = String(o.bgColor || '') === bg;
                            return (
                              <button key={bg} type="button" onClick={() => nudgeOverlay(i, { bgColor: bg })} title={name}
                                style={{ padding: '3px 8px', fontSize: 10.5, background: bg === 'transparent' ? 'repeating-linear-gradient(45deg,#1a1613,#1a1613 3px,#0f0c0a 3px,#0f0c0a 6px)' : bg, color: /white|golden|(255,255,255)|224,192/.test(bg + name) ? '#0B0907' : '#F5EDE3', border: `1px solid ${active ? '#E0C088' : '#3A2E26'}`, borderRadius: 3, cursor: 'pointer', textShadow: bg.includes('rgba(0,0,0') ? '0 1px 2px rgba(0,0,0,.5)' : 'none' }}>{name}</button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : null}

        {stringFields.length === 0 && !isOverlaySlide ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#8A7B6C', fontSize: 13 }}>이 슬라이드에는 편집 가능한 텍스트 필드가 없습니다.</div>
        ) : stringFields.length === 0 ? null : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '55vh', overflowY: 'auto', paddingRight: 8 }}>
            {stringFields.map(([k, v]) => {
              const label = FIELD_LABELS[k] || k;
              const isLong = String(v ?? '').length > 40 || String(v ?? '').includes('\n');
              return (
                <div key={k}>
                  <div style={{ fontSize: 11, color: '#C9A66B', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>{label}</div>
                  {isLong ? (
                    <textarea
                      value={values[k] ?? ''}
                      onChange={(e) => setValues((prev) => ({ ...prev, [k]: e.target.value }))}
                      rows={String(v ?? '').split('\n').length + 1}
                      style={{ width: '100%', background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 6, padding: '10px 12px', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.5, resize: 'vertical' }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[k] ?? ''}
                      onChange={(e) => setValues((prev) => ({ ...prev, [k]: e.target.value }))}
                      style={{ width: '100%', background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 6, padding: '10px 12px', fontFamily: 'inherit', fontSize: 14 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {err ? (
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(200,60,60,.15)', border: '1px solid rgba(200,60,60,.4)', color: '#FFC8C8', borderRadius: 6, fontSize: 13 }}>⚠ {err}</div>
        ) : null}

        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#6B5A48', marginRight: 'auto' }}>ESC · 배경 클릭 = 닫기</span>
          <button onClick={onClose} disabled={busy} style={{ padding: '10px 20px', background: 'transparent', color: '#8A7B6C', border: '1px solid #3A2E26', borderRadius: 99, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>취소</button>
          <button onClick={save} disabled={busy || (stringFields.length === 0 && !isOverlaySlide)} style={{ padding: '10px 26px', background: busy ? '#3A2E26' : 'linear-gradient(135deg,#E0C088,#B08862)', color: '#0B0907', border: 'none', borderRadius: 99, cursor: busy ? 'wait' : 'pointer', fontWeight: 800, fontSize: 14, letterSpacing: '.02em', boxShadow: '0 4px 12px rgba(224,192,136,.3)' }}>{busy ? '저장 중…' : '💾 저장'}</button>
        </div>
      </div>
    </div>
  );
}
