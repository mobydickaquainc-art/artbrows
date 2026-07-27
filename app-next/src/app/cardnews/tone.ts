import type { PaletteKey } from '@/lib/artbrows/tokens';

/**
 * 6톤 카테고리 → 텍스트 대비용 tone (light | dark)
 * 밝은 배경 (founder 베이지 · detail 아이보리) → light (검정 텍스트)
 * 어두운 배경 (treatment · review · classroom · reels) → dark (아이보리 텍스트)
 */
const LIGHT_CATEGORIES: readonly PaletteKey[] = ['founder', 'detail'];

export type Tone = 'light' | 'dark';

export function toneOf(category: PaletteKey): Tone {
  return LIGHT_CATEGORIES.includes(category) ? 'light' : 'dark';
}

/** 슬라이드 프레임 공통 className · data-tone 부여 */
export function slideFrameProps(category: PaletteKey, extra?: string) {
  return {
    className: `slide-frame ab-cat-${category}${extra ? ' ' + extra : ''}`,
    'data-tone': toneOf(category),
  };
}
