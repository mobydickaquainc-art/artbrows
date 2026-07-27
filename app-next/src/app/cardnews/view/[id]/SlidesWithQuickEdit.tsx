'use client';

/**
 * SlidesWithQuickEdit · 2026-07-27
 * 뷰어 슬라이드 그리드 + hover 「✏️ 편집」 · 클릭 시 QuickEditModal
 */

import { useState } from 'react';
import Link from 'next/link';
import { SlideRender } from '../../SlideRender';
import { artbrowsPalette } from '@/lib/artbrows/tokens';
import type { Slide } from '../../types';
import QuickEditModal from './QuickEditModal';

interface Props {
  projectId: string;
  lang: string;
  slides: Slide[];
  translations: Record<string, unknown>;
  gridClassName: string;
  stylePreset?: string;
}

export default function SlidesWithQuickEdit({ projectId, lang, slides, translations, gridClassName, stylePreset }: Props) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  return (
    <>
      <style>{`
        .cn-slide-wrap { position: relative; }
        .cn-slide-actions {
          position: absolute; top: 8px; right: 8px; z-index: 10;
          display: flex; gap: 6px; opacity: 0; transition: opacity .18s;
        }
        .cn-slide-wrap:hover .cn-slide-actions { opacity: 1; }
        .cn-slide-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 6px 10px; background: rgba(10,8,6,.88);
          color: #F5EDE3; border: 1px solid rgba(224,192,136,.4);
          border-radius: 99px; font-size: 11.5px; font-weight: 700;
          text-decoration: none; letter-spacing: .02em;
          transition: all .15s; cursor: pointer;
        }
        .cn-slide-btn:hover { background: rgba(224,192,136,.9); color: #0B0907; border-color: #E0C088; }
        .cn-slide-btn.danger:hover { background: rgba(200,60,60,.9); color: #fff; border-color: rgba(255,120,120,.6); }
      `}</style>
      <div className={gridClassName} data-style-preset={stylePreset ?? ''}>
        {slides.map((s, i) => (
          <div className="cn-slide-wrap" key={i}>
            <div className="slide-index">{i + 1}/{slides.length}</div>
            <div className="cn-slide-actions">
              <button type="button" onClick={() => setEditingIdx(i)} className="cn-slide-btn" title="텍스트 즉시 편집 (모달)">✏️ 텍스트</button>
              <Link href={`/cardnews/edit/${projectId}?slide=${i}`} className="cn-slide-btn" title="편집기 (이미지·레이아웃)">🎨</Link>
              <Link href={`/cardnews/edit/${projectId}?slide=${i}&action=duplicate`} className="cn-slide-btn" title="복제">📋</Link>
              <Link href={`/cardnews/edit/${projectId}?slide=${i}&action=delete`} className="cn-slide-btn danger" title="삭제">🗑</Link>
            </div>
            <SlideRender slide={s} />
            <div className="cn-slide-label">
              {s.kind}
              <span className="cat-chip">{artbrowsPalette[s.category].label}</span>
            </div>
          </div>
        ))}
      </div>

      {editingIdx !== null ? (
        <QuickEditModal
          projectId={projectId}
          slideIndex={editingIdx}
          lang={lang}
          slide={slides[editingIdx] as unknown as Record<string, unknown>}
          translations={translations}
          onClose={() => setEditingIdx(null)}
        />
      ) : null}
    </>
  );
}
