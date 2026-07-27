/**
 * AI 응답 후처리 · 마크업 태그 제거 + highlight 자동 추출
 * (Gemini/OpenAI 가 프롬프트 무시하고 <gold>xxx</gold> 같은 태그를 넣는 경우 방어)
 */

import type { Slide } from '@/app/cardnews/types';

const TAG_NAMES = ['gold', 'highlight', 'b', 'em', 'strong', 'span', 'mark', 'i', 'u'];

// 첫 번째 감지된 강조 단어 (highlight 필드 자동 추출용)
export function extractFirstHighlight(text: string): string | undefined {
  const re = new RegExp(`<(?:${TAG_NAMES.join('|')})[^>]*>([^<]+)</(?:${TAG_NAMES.join('|')})>`, 'i');
  const m = text.match(re);
  return m?.[1]?.trim();
}

// 모든 태그·마크다운 강조 제거
export function stripMarkup(text: string): string {
  if (!text) return text;
  let s = text;
  // <gold>xxx</gold> · <b>xxx</b> 등
  const openClose = new RegExp(`</?(?:${TAG_NAMES.join('|')})[^>]*>`, 'gi');
  s = s.replace(openClose, '');
  // 마크다운 **xxx** / __xxx__ / *xxx* / _xxx_ (강조만 제거 · 내용은 유지)
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/__([^_]+)__/g, '$1');
  s = s.replace(/\*([^*]+)\*/g, '$1').replace(/_([^_]+)_/g, '$1');
  // 남은 태그 안전망 (알 수 없는 <xxx>)
  s = s.replace(/<[^>]{1,40}>/g, '');
  return s.trim();
}

/**
 * Slide 전체를 sanitize:
 * - 모든 string 필드에서 태그·마크다운 제거
 * - highlight 가 비어있으면 headline 에서 자동 추출
 */
export function sanitizeSlide(slide: Slide): Slide {
  const out: Record<string, unknown> = { ...slide };

  // headline 처리 · highlight 자동 추출
  if (typeof slide.headline === 'string' && slide.headline) {
    const detected = extractFirstHighlight(slide.headline);
    out.headline = stripMarkup(slide.headline);
    if (detected && !slide.highlight) out.highlight = detected;
  }

  // 나머지 문자열 필드 순회
  const textFields = ['eyebrow', 'highlight', 'quote', 'quoteBy', 'body', 'caption', 'overlayLabel', 'signature', 'cta', 'footnote', 'by', 'title', 'desc'] as const;
  for (const k of textFields) {
    const v = (slide as Record<string, unknown>)[k];
    if (typeof v === 'string' && v) {
      out[k] = stripMarkup(v);
    }
  }

  // 배열/객체 재귀 처리 (items, rows, formula, concept, style 등)
  if ('items' in slide && Array.isArray((slide as Record<string, unknown>).items)) {
    out.items = (slide as { items: unknown[] }).items.map((it) => sanitizeAny(it));
  }
  if ('rows' in slide && Array.isArray((slide as Record<string, unknown>).rows)) {
    out.rows = (slide as { rows: unknown[] }).rows.map((r) => sanitizeAny(r));
  }
  if ('concept' in slide && slide.concept) {
    out.concept = sanitizeAny(slide.concept);
  }
  if ('style' in slide && slide.style) {
    out.style = sanitizeAny(slide.style);
  }

  return out as Slide;
}

function sanitizeAny(v: unknown): unknown {
  if (typeof v === 'string') return stripMarkup(v);
  if (Array.isArray(v)) return v.map((x) => sanitizeAny(x));
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      out[k] = sanitizeAny(val);
    }
    return out;
  }
  return v;
}
