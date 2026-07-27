'use client';
import { useRef, useState } from 'react';
import type { ImageWithOverlaySlide } from '../types';

/**
 * ImageWithOverlay — 원본 이미지 위에 편집 가능한 텍스트 오버레이
 * 2026-07-27 A안. editableSelection prop 넘기면 편집기 모드 (선택 표시·클릭 이벤트).
 * dragCapture prop 이 활성이면 오버레이 클릭·hover 를 죽이고 · 마우스 드래그로 bbox 캡처.
 */
interface Props {
  slide: ImageWithOverlaySlide;
  editableSelection?: {
    selectedIdx: number | null;
    onSelect: (idx: number | null) => void;
  };
  dragCapture?: {
    active: boolean;
    onComplete: (bbox: { x: number; y: number; w: number; h: number }) => void;
  };
}
export function ImageWithOverlay({ slide, editableSelection, dragCapture }: Props) {
  const isEditor = !!editableSelection;
  const isDragMode = !!(dragCapture && dragCapture.active);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragBox, setDragBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  function pct(e: React.MouseEvent, el: HTMLDivElement): { x: number; y: number } {
    const r = el.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)),
    };
  }
  function onMouseDown(e: React.MouseEvent) {
    if (!isDragMode || !containerRef.current) return;
    e.preventDefault();
    const p = pct(e, containerRef.current);
    dragStart.current = p;
    setDragBox({ x: p.x, y: p.y, w: 0, h: 0 });
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragMode || !dragStart.current || !containerRef.current) return;
    const p = pct(e, containerRef.current);
    const x = Math.min(p.x, dragStart.current.x);
    const y = Math.min(p.y, dragStart.current.y);
    const w = Math.abs(p.x - dragStart.current.x);
    const h = Math.abs(p.y - dragStart.current.y);
    setDragBox({ x, y, w, h });
  }
  function onMouseUp() {
    if (!isDragMode || !dragBox) return;
    if (dragBox.w < 2 || dragBox.h < 2) { setDragBox(null); dragStart.current = null; return; }
    dragCapture!.onComplete(dragBox);
    setDragBox(null);
    dragStart.current = null;
  }
  return (
    <div ref={containerRef} style={{
      position: 'relative', width: '100%', aspectRatio: '4/5',
      background: '#000', overflow: 'hidden', borderRadius: 2,
      containerType: 'size' as const,
      cursor: isDragMode ? 'crosshair' : undefined,
      userSelect: isDragMode ? 'none' : undefined,
    }}
    onClick={isEditor && !isDragMode ? (e) => { if (e.target === e.currentTarget) editableSelection!.onSelect(null); } : undefined}
    onMouseDown={onMouseDown}
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseUp}>
      {slide.imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={slide.imageSrc} alt={slide.imageAlt || ''}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : null}

      {isEditor ? (
        // 배경 이미지 클릭 캐치용 (오버레이가 그 위에 있음)
        <div style={{ position: 'absolute', inset: 0, cursor: 'default' }}
          onClick={() => editableSelection!.onSelect(null)} />
      ) : null}
      {(slide.overlays || []).map((o, i) => {
        const family =
          o.fontFamily === 'serif'       ? "'Nanum Myeongjo','Noto Serif KR',serif" :
          o.fontFamily === 'serif-latin' ? "'Cormorant Garamond','Nanum Myeongjo',serif" :
          o.fontFamily === 'display'     ? "'Playfair Display','Nanum Myeongjo',serif" :
          o.fontFamily === 'brush'       ? "'Nanum Pen Script','Nanum Myeongjo',cursive" :
          o.fontFamily === 'heavy'       ? "'Black Han Sans','Noto Sans KR',sans-serif" :
                                           "'Noto Sans KR','Pretendard',sans-serif";
        const weight = o.weight === 'black' ? 900 : o.weight === 'bold' ? 800 : o.weight === 'medium' ? 600 : 400;
        const isSelected = isEditor && editableSelection!.selectedIdx === i;
        return (
          <div key={i}>
            {/* 2026-07-27 · cover · bbox 를 opaque 색으로 먼저 채워 원본 텍스트 픽셀 가림 (padding 없이 정확히 bbox 크기) */}
            {o.cover ? (
              <div style={{
                position: 'absolute',
                left: `${o.x}%`, top: `${o.y}%`,
                width: `${o.w}%`, height: `${o.h}%`,
                background: o.cover,
                pointerEvents: 'none',
                borderRadius: 2,
              }} />
            ) : null}
            <div
              onClick={isEditor ? (e) => { e.stopPropagation(); editableSelection!.onSelect(i); } : undefined}
              style={{
                position: 'absolute',
                left: `${o.x}%`, top: `${o.y}%`,
                width: `${o.w}%`, minHeight: `${o.h}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: o.align === 'center' ? 'center' : o.align === 'right' ? 'flex-end' : 'flex-start',
                padding: `${o.padding ?? 6}px`,
                background: o.bgColor || 'rgba(0,0,0,.55)',
                borderRadius: 3,
                boxShadow: isSelected ? '0 0 0 2px #E0C088, 0 0 24px 6px rgba(224,192,136,.5)' : '0 0 20px 4px ' + (o.bgColor || 'rgba(0,0,0,.35)'),
                outline: isEditor && !isSelected ? '1px dashed rgba(224,192,136,.4)' : undefined,
                pointerEvents: isEditor ? 'auto' : 'none',
                cursor: isEditor ? 'pointer' : undefined,
                transition: 'box-shadow .15s, outline .15s',
              }}>
              <span style={{
                color: o.color || '#FFFFFF',
                fontFamily: family,
                fontWeight: weight,
                fontSize: `${o.fontSizePct ?? 4}cqh`,
                lineHeight: 1.2,
                letterSpacing: o.fontFamily === 'sans' ? '-.01em' : '.005em',
                textAlign: o.align || 'left',
                whiteSpace: 'pre-wrap',
                wordBreak: 'keep-all',
                textShadow: (o.bgColor || '').includes('rgba(0,0,0') ? '0 1px 2px rgba(0,0,0,.4)' : 'none',
              }}>{o.text}</span>
            </div>
          </div>
        );
      })}

      {/* 드래그 캡처 모드 · 사각 박스 시각 표시 + 안내 배너 */}
      {isDragMode ? (
        <>
          {dragBox ? (
            <div style={{
              position: 'absolute',
              left: `${dragBox.x}%`, top: `${dragBox.y}%`,
              width: `${dragBox.w}%`, height: `${dragBox.h}%`,
              border: '2px dashed #E0C088',
              background: 'rgba(224,192,136,.15)',
              pointerEvents: 'none',
              boxShadow: '0 0 0 9999px rgba(0,0,0,.35)',
              zIndex: 100,
            }} />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(11,9,7,.35)',
              pointerEvents: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 99,
            }}>
              <div style={{
                padding: '10px 18px', background: 'rgba(224,192,136,.95)', color: '#0B0907',
                borderRadius: 99, fontWeight: 800, fontSize: 13, letterSpacing: '.02em',
                boxShadow: '0 4px 16px rgba(0,0,0,.5)',
              }}>🎯 교체할 문장 영역을 마우스로 드래그</div>
            </div>
          )}
        </>
      ) : null}

      {slide.bottomLabel ? (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center',
          fontFamily: "'Inter','Pretendard',sans-serif",
          fontSize: 'clamp(10px, 1.5cqh, 14px)', letterSpacing: '.28em',
          color: '#E0C088', textTransform: 'uppercase', pointerEvents: 'none',
          textShadow: '0 1px 3px rgba(0,0,0,.6)',
        }}>{slide.bottomLabel}</div>
      ) : null}

    </div>
  );
}
