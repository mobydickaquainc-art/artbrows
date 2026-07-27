'use client';

/**
 * OverlayInspector — image-with-overlay 슬라이드 전용 편집 인스펙터
 * 우측 패널 상시 노출 (모달 X). Fable 5 UX 안 정본 (2026-07-27).
 *
 * 구조 (위→아래 · 사용 빈도순):
 *   1. 스타일 프리셋 바 (한 클릭 = 폰트+색+배경+굵기+정렬 세팅)
 *   2. 선택된 오버레이 인스펙터 (텍스트·위치·크기·폰트·색·배경)
 *   3. AI 카피 팔레트 (접이식 아코디언)
 *   4. 오버레이 목록 칩 (개수·선택 이동·삭제·빈 추가)
 */

import { useState } from 'react';
import type { ImageWithOverlaySlide, TextOverlay, CopyPaletteItem } from '../types';

interface Props {
  slide: ImageWithOverlaySlide;
  selectedOverlayIdx: number | null;
  onSelectOverlay: (idx: number | null) => void;
  onChange: (next: ImageWithOverlaySlide) => void;
}

// ─── 스타일 조합 프리셋 6종 (원 클릭 = 폰트+색+배경+굵기+정렬 세팅) ───
type StyleCombo = {
  key: string;
  label: string;
  desc: string;
  fontFamily: NonNullable<TextOverlay['fontFamily']>;
  weight: NonNullable<TextOverlay['weight']>;
  color: string;
  bgColor: string;
  align: NonNullable<TextOverlay['align']>;
  previewFont: string;
};
const STYLE_COMBOS: StyleCombo[] = [
  { key: 'jangmiji-real', label: '원장 실톤 볼드', desc: '07-24 원장 정본 (갈색 박스+프리텐다드)',
    fontFamily: 'sans', weight: 'black', color: '#FFFFFF', bgColor: 'rgba(60,45,35,.72)', align: 'left',
    previewFont: "'Noto Sans KR',sans-serif" },
  { key: 'vogue-headline', label: 'Vogue 대헤드', desc: 'Cormorant 세리프 대문자 임팩트',
    fontFamily: 'serif-latin', weight: 'bold', color: '#F5EDE3', bgColor: 'rgba(0,0,0,.55)', align: 'center',
    previewFont: "'Cormorant Garamond',serif" },
  { key: 'gold-signature', label: '골드 시그니처', desc: '나눔펜 필기 · 골드 · 배경 없음',
    fontFamily: 'brush', weight: 'normal', color: '#E0C088', bgColor: 'transparent', align: 'right',
    previewFont: "'Nanum Pen Script',cursive" },
  { key: 'myeongjo-quote', label: '명조 인용', desc: '나눔명조 · 아이보리 · 투명 검정 배경',
    fontFamily: 'serif', weight: 'medium', color: '#F5EDE3', bgColor: 'rgba(0,0,0,.55)', align: 'center',
    previewFont: "'Nanum Myeongjo',serif" },
  { key: 'impact-declaration', label: '임팩트 선언', desc: 'Black Han Sans · 검정 pill 배경',
    fontFamily: 'heavy', weight: 'black', color: '#FFFFFF', bgColor: 'rgba(11,9,7,.92)', align: 'center',
    previewFont: "'Black Han Sans',sans-serif" },
  { key: 'white-label', label: '화이트 라벨', desc: '고딕 · 블랙 텍스트 · 화이트 박스',
    fontFamily: 'sans', weight: 'medium', color: '#0B0907', bgColor: 'rgba(255,255,255,.92)', align: 'left',
    previewFont: "'Noto Sans KR',sans-serif" },
];

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
const FONT_PRESETS: Array<[NonNullable<TextOverlay['fontFamily']>, string, string]> = [
  ['sans',        '고딕',      "'Noto Sans KR',sans-serif"],
  ['serif',       '명조',      "'Nanum Myeongjo',serif"],
  ['serif-latin', 'Cormorant', "'Cormorant Garamond',serif"],
  ['display',     'Playfair',  "'Playfair Display',serif"],
  ['heavy',       '임팩트',    "'Black Han Sans',sans-serif"],
  ['brush',       '필기',      "'Nanum Pen Script',cursive"],
];
const WEIGHT_PRESETS: Array<[NonNullable<TextOverlay['weight']>, string, number]> = [
  ['normal', 'L', 400], ['medium', 'M', 600], ['bold', 'B', 800], ['black', 'Bl', 900],
];
const ALIGN_PRESETS: Array<[NonNullable<TextOverlay['align']>, string]> = [
  ['left', '⇤'], ['center', '⇔'], ['right', '⇥'],
];

// ─── 팔레트 → 오버레이 변환 ───
function makeOverlayFromPalette(item: CopyPaletteItem, mode: 'original' | 'preset' = 'original'): TextOverlay {
  const role = item.role || 'body';
  const family = item.hintFontFamily || 'sans';
  const weight = item.hintWeight || 'bold';
  const align = item.hintAlign || 'left';
  const hintColor = item.hintColor || '#FFFFFF';
  const hintBg = item.hintBgColor || 'rgba(0,0,0,.55)';
  const hasOrig =
    typeof item.hintX === 'number' && typeof item.hintY === 'number' &&
    typeof item.hintW === 'number' && typeof item.hintH === 'number';
  const preset: Record<string, { x: number; y: number; w: number; h: number; fs: number; align: 'left'|'center'|'right'; bg: string }> = {
    headline:    { x: 6,  y: 8,  w: 88, h: 18, fs: 10, align: 'left',   bg: 'rgba(0,0,0,.55)' },
    subheadline: { x: 6,  y: 28, w: 88, h: 9,  fs: 5,  align: 'left',   bg: 'rgba(0,0,0,.5)' },
    body:        { x: 6,  y: 45, w: 88, h: 30, fs: 3.5, align: 'left',  bg: 'rgba(0,0,0,.5)' },
    quote:       { x: 8,  y: 35, w: 84, h: 25, fs: 6,  align: 'center', bg: 'rgba(0,0,0,.55)' },
    cta:         { x: 20, y: 82, w: 60, h: 8,  fs: 4,  align: 'center', bg: 'rgba(60,45,35,.85)' },
    label:       { x: 6,  y: 90, w: 40, h: 5,  fs: 2,  align: 'left',   bg: 'rgba(0,0,0,.5)' },
  };
  const p = preset[role] || preset.body;
  if (mode === 'original' && hasOrig) {
    return {
      text: item.text, original: item.text,
      x: Number(item.hintX), y: Number(item.hintY),
      w: Number(item.hintW), h: Number(item.hintH),
      fontSizePct: typeof item.hintFontSizePct === 'number' ? item.hintFontSizePct : p.fs,
      color: hintColor, bgColor: hintBg,
      weight, align, fontFamily: family, padding: 6,
    };
  }
  return {
    text: item.text, original: item.text,
    x: p.x, y: p.y, w: p.w, h: p.h,
    fontSizePct: typeof item.hintFontSizePct === 'number' ? item.hintFontSizePct : p.fs,
    color: hintColor, bgColor: p.bg,
    weight, align: p.align, fontFamily: family, padding: 8,
  };
}
function makeBlank(role: 'headline' | 'body' = 'headline'): TextOverlay {
  const isHead = role === 'headline';
  return {
    text: isHead ? '새 문장' : '내용',
    x: 6, y: isHead ? 8 : 45, w: 88, h: isHead ? 18 : 30,
    fontSizePct: isHead ? 10 : 3.5,
    color: '#FFFFFF',
    bgColor: 'rgba(0,0,0,.55)',
    weight: 'bold', align: 'left', fontFamily: 'sans', padding: 8,
  };
}

export default function OverlayInspector({ slide, selectedOverlayIdx, onSelectOverlay, onChange }: Props) {
  const overlays = Array.isArray(slide.overlays) ? slide.overlays : [];
  const palette = Array.isArray(slide.copyPalette) ? slide.copyPalette : [];
  const [paletteOpen, setPaletteOpen] = useState(overlays.length === 0);
  const sel = selectedOverlayIdx != null && overlays[selectedOverlayIdx] ? overlays[selectedOverlayIdx] : null;

  function updateOverlay(idx: number, patch: Partial<TextOverlay>) {
    const next = overlays.map((o, i) => (i === idx ? { ...o, ...patch } : o));
    onChange({ ...slide, overlays: next });
  }
  function updatePalette(idx: number, patch: Partial<CopyPaletteItem>) {
    const next = palette.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    onChange({ ...slide, copyPalette: next });
  }
  function removeOverlay(idx: number) {
    const next = overlays.filter((_, i) => i !== idx);
    onChange({ ...slide, overlays: next });
    if (selectedOverlayIdx === idx) onSelectOverlay(null);
    else if (selectedOverlayIdx != null && selectedOverlayIdx > idx) onSelectOverlay(selectedOverlayIdx - 1);
  }
  function addFromPalette(idx: number, mode: 'original' | 'preset' = 'original') {
    const item = palette[idx];
    if (!item) return;
    const next = [...overlays, makeOverlayFromPalette(item, mode)];
    onChange({ ...slide, overlays: next });
    onSelectOverlay(next.length - 1);
  }
  function addBlank(role: 'headline' | 'body') {
    const next = [...overlays, makeBlank(role)];
    onChange({ ...slide, overlays: next });
    onSelectOverlay(next.length - 1);
  }
  function applyCombo(combo: StyleCombo) {
    if (selectedOverlayIdx == null) return;
    updateOverlay(selectedOverlayIdx, {
      fontFamily: combo.fontFamily,
      weight: combo.weight,
      color: combo.color,
      bgColor: combo.bgColor,
      align: combo.align,
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ═══ 1. 스타일 프리셋 바 (최상단) ═══ */}
      <div style={box()}>
        <div style={sectionLabel()}>
          🎨 스타일 프리셋 · 한 클릭 세팅
          {sel == null ? <span style={{ color: '#6B5A48', fontSize: 10.5, marginLeft: 8, textTransform: 'none', letterSpacing: 0 }}>· 오버레이 선택 후</span> : null}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
          {STYLE_COMBOS.map((c) => (
            <button key={c.key} type="button" onClick={() => applyCombo(c)} disabled={sel == null}
              title={c.desc}
              style={{ padding: '8px 10px', background: sel == null ? '#0F0C0A' : '#14100C', color: sel == null ? '#4a3f36' : '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 4, cursor: sel == null ? 'not-allowed' : 'pointer', textAlign: 'left', fontFamily: c.previewFont }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.01em' }}>{c.label}</div>
              <div style={{ fontSize: 10, color: '#8A7B6C', fontFamily: 'inherit', marginTop: 2 }}>{c.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ 2. 선택된 오버레이 인스펙터 ═══ */}
      {sel && selectedOverlayIdx != null ? (
        <div style={box('#A8854E')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ ...sectionLabel(), marginBottom: 0, color: '#E0C088' }}>
              ✏️ 선택 오버레이 #{selectedOverlayIdx + 1}
            </span>
            <button type="button" onClick={() => removeOverlay(selectedOverlayIdx)}
              style={{ marginLeft: 'auto', padding: '3px 10px', background: 'rgba(200,60,60,.12)', color: '#FFB0B0', border: '1px solid rgba(200,60,60,.35)', borderRadius: 3, cursor: 'pointer', fontSize: 11 }}>× 삭제</button>
          </div>

          {/* 텍스트 */}
          <textarea value={String(sel.text || '')}
            rows={String(sel.text || '').length > 40 || String(sel.text || '').includes('\n') ? 3 : 1}
            onChange={(e) => updateOverlay(selectedOverlayIdx, { text: e.target.value })}
            style={{ width: '100%', background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 4, padding: '8px 10px', fontFamily: 'inherit', fontSize: 13.5, lineHeight: 1.45, resize: 'vertical', marginBottom: 10 }} />

          {/* 위치·크기 슬라이더 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 4, alignItems: 'center', fontSize: 10.5, color: '#8A7B6C', marginBottom: 8 }}>
            {(['x','y','fontSizePct'] as const).map((k) => {
              const label = k === 'fontSizePct' ? '크기' : k.toUpperCase();
              const max = k === 'fontSizePct' ? 20 : 100;
              const step = k === 'fontSizePct' ? 0.5 : 1;
              const val = Number(sel[k] ?? 0);
              return (
                <>
                  <span key={`${k}-l`} style={{ minWidth: 30 }}>{label}</span>
                  <input key={`${k}-r`} type="range" min={0} max={max} step={step} value={val}
                    onChange={(e) => updateOverlay(selectedOverlayIdx, { [k]: Number(e.target.value) } as Partial<TextOverlay>)}
                    style={{ accentColor: '#E0C088' }} />
                  <span key={`${k}-v`} style={{ minWidth: 34, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{val.toFixed(k === 'fontSizePct' ? 1 : 0)}{k === 'fontSizePct' ? '' : '%'}</span>
                </>
              );
            })}
          </div>

          {/* 폰트 */}
          <div style={row()}>
            <span style={rowLabel()}>폰트</span>
            {FONT_PRESETS.map(([key, label, css]) => {
              const active = String(sel.fontFamily || 'sans') === key;
              return (
                <button key={key} type="button" onClick={() => updateOverlay(selectedOverlayIdx, { fontFamily: key })}
                  style={chip(active, { fontFamily: css })}>{label}</button>
              );
            })}
          </div>

          {/* 굵기·정렬 */}
          <div style={row()}>
            <span style={rowLabel()}>굵기</span>
            {WEIGHT_PRESETS.map(([key, label, w]) => {
              const active = String(sel.weight || 'normal') === key;
              return (
                <button key={key} type="button" onClick={() => updateOverlay(selectedOverlayIdx, { weight: key })}
                  style={chip(active, { fontWeight: w, minWidth: 26 })}>{label}</button>
              );
            })}
            <span style={{ ...rowLabel(), marginLeft: 10 }}>정렬</span>
            {ALIGN_PRESETS.map(([key, sym]) => {
              const active = String(sel.align || 'left') === key;
              return (
                <button key={key} type="button" onClick={() => updateOverlay(selectedOverlayIdx, { align: key })}
                  style={chip(active, { fontSize: 13 })}>{sym}</button>
              );
            })}
          </div>

          {/* 글자색 */}
          <div style={row()}>
            <span style={rowLabel()}>글자색</span>
            {COLOR_SWATCHES.map(([hex, name]) => {
              const active = String(sel.color || '#FFFFFF').toLowerCase() === hex.toLowerCase();
              return (
                <button key={hex} type="button" onClick={() => updateOverlay(selectedOverlayIdx, { color: hex })} title={name}
                  style={{ width: 22, height: 22, borderRadius: '50%', background: hex, border: `2px solid ${active ? '#E0C088' : '#3A2E26'}`, cursor: 'pointer', padding: 0 }} />
              );
            })}
            <input type="color" value={String(sel.color || '#FFFFFF').startsWith('#') ? String(sel.color) : '#FFFFFF'}
              onChange={(e) => updateOverlay(selectedOverlayIdx, { color: e.target.value })}
              style={{ width: 26, height: 22, background: 'transparent', border: '1px solid #3A2E26', borderRadius: 3, cursor: 'pointer' }} title="직접 색" />
          </div>

          {/* 배경 */}
          <div style={row()}>
            <span style={rowLabel()}>배경</span>
            {BG_SWATCHES.map(([bg, name]) => {
              const active = String(sel.bgColor || '') === bg;
              const isLight = /white|(255,255,255)|224,192/.test(bg + name);
              return (
                <button key={bg} type="button" onClick={() => updateOverlay(selectedOverlayIdx, { bgColor: bg })} title={name}
                  style={{ padding: '3px 8px', fontSize: 10.5, background: bg === 'transparent' ? 'repeating-linear-gradient(45deg,#1a1613,#1a1613 3px,#0f0c0a 3px,#0f0c0a 6px)' : bg, color: isLight ? '#0B0907' : '#F5EDE3', border: `1px solid ${active ? '#E0C088' : '#3A2E26'}`, borderRadius: 3, cursor: 'pointer', textShadow: bg.includes('rgba(0,0,0') ? '0 1px 2px rgba(0,0,0,.5)' : 'none' }}>{name}</button>
              );
            })}
          </div>

          {/* 2026-07-27 · 대표님 지시 「뒤에를 없애고 스타일 카피」 · 덮개(cover) = bbox 뒤 원본 픽셀을 opaque 로 가림 */}
          <div style={row()}>
            <span style={rowLabel()} title="이 오버레이 뒤의 원본 이미지 픽셀 (베이크된 텍스트) 을 지정 색으로 가림">덮개</span>
            <button type="button" onClick={() => updateOverlay(selectedOverlayIdx, { cover: undefined })}
              style={{ padding: '3px 8px', fontSize: 10.5, background: '#0F0C0A', color: !sel.cover ? '#E0C088' : '#8A7B6C', border: `1px solid ${!sel.cover ? '#E0C088' : '#3A2E26'}`, borderRadius: 3, cursor: 'pointer' }}
              title="원본 그대로 (덮개 없음)">OFF</button>
            <button type="button" onClick={() => {
              const bg = String(sel.bgColor || '');
              const m = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
              const auto = m
                ? '#' + [1, 2, 3].map((k) => parseInt(m[k], 10).toString(16).padStart(2, '0')).join('')
                : /^#[0-9a-f]{6}/i.test(bg) ? bg.slice(0, 7) : '#241812';
              updateOverlay(selectedOverlayIdx, { cover: auto });
            }}
              style={{ padding: '3px 8px', fontSize: 10.5, background: '#0F0C0A', color: '#E0C088', border: '1px solid #3A2E26', borderRadius: 3, cursor: 'pointer' }}
              title="배경색을 불투명화 (원본 텍스트 완전 가림)">🎯 자동</button>
            <input type="color"
              value={sel.cover && /^#[0-9a-f]{6}$/i.test(sel.cover) ? sel.cover : '#241812'}
              onChange={(e) => updateOverlay(selectedOverlayIdx, { cover: e.target.value })}
              style={{ width: 26, height: 22, background: 'transparent', border: `1px solid ${sel.cover ? '#E0C088' : '#3A2E26'}`, borderRadius: 3, cursor: 'pointer' }}
              title="덮개 색 직접 지정" />
            {sel.cover ? <span style={{ fontSize: 10, color: '#8A7B6C', fontFamily: 'monospace' }}>{sel.cover}</span> : <span style={{ fontSize: 10, color: '#6B5A48' }}>OFF · 원본 노출</span>}
          </div>
        </div>
      ) : (
        <div style={{ padding: 20, background: '#0F0C0A', border: '1px dashed #3A2E26', borderRadius: 6, color: '#6B5A48', fontSize: 12, textAlign: 'center', lineHeight: 1.6 }}>
          ← 중앙 미리보기에서 <b style={{ color: '#8A7B6C' }}>오버레이를 클릭</b> 하거나<br/>
          아래 <b style={{ color: '#8A7B6C' }}>오버레이 목록</b> 에서 선택
        </div>
      )}

      {/* ═══ 3. AI 카피 팔레트 (접이식) ═══ */}
      <div style={box()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: paletteOpen ? 8 : 0, cursor: 'pointer' }} onClick={() => setPaletteOpen((v) => !v)}>
          <span style={{ ...sectionLabel(), marginBottom: 0 }}>🎨 AI 카피 팔레트 · {palette.length}개</span>
          <span style={{ marginLeft: 'auto', color: '#8A7B6C', fontSize: 12 }}>{paletteOpen ? '▼' : '▶'}</span>
        </div>
        {paletteOpen ? (
          palette.length === 0 ? (
            <div style={{ fontSize: 11.5, color: '#6B5A48', padding: '8px 4px' }}>팔레트가 비어있음 (OCR 실패이거나 원본 텍스트 없음)</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
              {palette.map((p, i) => {
                const cur = String(p.text || '');
                const orig = String(p.original || '');
                const isLong = cur.length > 40;
                return (
                  <div key={i} style={{ padding: 8, background: '#14100C', border: '1px solid #3A2E26', borderRadius: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: 10, color: '#8A7B6C' }}>
                      <span style={{ padding: '1px 6px', background: 'rgba(224,192,136,.15)', color: '#E0C088', borderRadius: 3, fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 700 }}>{p.role || 'body'}</span>
                      {orig && orig !== cur ? <span style={{ color: '#6B5A48' }}>원본: <i>&ldquo;{orig.slice(0, 22)}{orig.length > 22 ? '…' : ''}&rdquo;</i></span> : null}
                    </div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'stretch' }}>
                      {isLong ? (
                        <textarea value={cur} rows={2}
                          onChange={(e) => updatePalette(i, { text: e.target.value })}
                          style={{ flex: 1, background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 3, padding: '5px 7px', fontFamily: 'inherit', fontSize: 12.5, resize: 'vertical' }} />
                      ) : (
                        <input type="text" value={cur}
                          onChange={(e) => updatePalette(i, { text: e.target.value })}
                          style={{ flex: 1, background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 3, padding: '5px 7px', fontFamily: 'inherit', fontSize: 12.5 }} />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <button type="button" onClick={() => addFromPalette(i, 'original')} title="원본 위치·색·폰트 그대로 · 문장만 대체"
                          style={{ padding: '2px 8px', background: 'linear-gradient(135deg,#E0C088,#B08862)', color: '#0B0907', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 800, fontSize: 10.5, whiteSpace: 'nowrap' }}>원본</button>
                        <button type="button" onClick={() => addFromPalette(i, 'preset')} title="기본 프리셋 위치·크기"
                          style={{ padding: '2px 8px', background: 'transparent', color: '#E0C088', border: '1px solid #A8854E', borderRadius: 3, cursor: 'pointer', fontSize: 10.5, whiteSpace: 'nowrap' }}>기본</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : null}
      </div>

      {/* ═══ 4. 오버레이 목록 칩 (하단) ═══ */}
      <div style={box()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ ...sectionLabel(), marginBottom: 0 }}>📌 오버레이 · {overlays.length}개</span>
          <button type="button" onClick={() => addBlank('headline')}
            style={{ marginLeft: 'auto', padding: '3px 8px', background: 'transparent', color: '#E0C088', border: '1px dashed #A8854E', borderRadius: 3, cursor: 'pointer', fontSize: 10.5, fontWeight: 700 }}>+ 헤드라인</button>
          <button type="button" onClick={() => addBlank('body')}
            style={{ padding: '3px 8px', background: 'transparent', color: '#E0C088', border: '1px dashed #A8854E', borderRadius: 3, cursor: 'pointer', fontSize: 10.5, fontWeight: 700 }}>+ 본문</button>
        </div>
        {overlays.length === 0 ? (
          <div style={{ fontSize: 11.5, color: '#6B5A48', padding: '8px 4px' }}>배치된 오버레이 없음</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {overlays.map((o, i) => {
              const active = i === selectedOverlayIdx;
              const label = String(o.text || '').slice(0, 12) || `#${i + 1}`;
              return (
                <button key={i} type="button" onClick={() => onSelectOverlay(active ? null : i)}
                  title={String(o.text || '')}
                  style={{ padding: '4px 10px', background: active ? 'rgba(224,192,136,.2)' : '#14100C', color: active ? '#E0C088' : '#B8A897', border: `1px solid ${active ? '#E0C088' : '#3A2E26'}`, borderRadius: 99, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                  #{i + 1} · {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 스타일 helper ───
function box(borderColor: string = '#3A2E26'): React.CSSProperties {
  return { padding: 12, background: '#0B0907', border: `1px solid ${borderColor}`, borderRadius: 6 };
}
function sectionLabel(): React.CSSProperties {
  return { fontSize: 11, color: '#C9A66B', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 800, marginBottom: 8, display: 'inline-block' };
}
function row(): React.CSSProperties {
  return { marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' };
}
function rowLabel(): React.CSSProperties {
  return { fontSize: 10, color: '#6B5A48', minWidth: 32 };
}
function chip(active: boolean, extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    padding: '3px 8px', fontSize: 11,
    background: active ? 'rgba(224,192,136,.2)' : 'transparent',
    color: active ? '#E0C088' : '#B8A897',
    border: `1px solid ${active ? '#E0C088' : '#3A2E26'}`,
    borderRadius: 3, cursor: 'pointer',
    ...extra,
  };
}
