import type { Slide } from './types';
// Legacy 12종
import { CoverFounder } from './layouts/CoverFounder';
import { NumberBig } from './layouts/NumberBig';
import { IconDuo, IconTrio } from './layouts/IconDuo';
import { Checklist } from './layouts/Checklist';
import { PortraitFrame } from './layouts/PortraitFrame';
import { ProductHero } from './layouts/ProductHero';
import { QuoteBold } from './layouts/QuoteBold';
import { SignatureStyle } from './layouts/SignatureStyle';
import { CurriculumRow } from './layouts/CurriculumRow';
import { PriceTable } from './layouts/PriceTable';
import { ClosingCTA } from './layouts/ClosingCTA';
// Magazine 9종 (2026-07-20 정본)
import {
  MagazineCover, HeroPortrait, MacroCloseUp, BeforeAfterSplit,
  PullquoteEditorial, CaseStudyDetail, AtelierScene, CTAEditorial, Umbrella4Cats,
} from './layouts/Magazine';
// Reimport OCR overlay (2026-07-27)
import { ImageWithOverlay } from './layouts/ImageWithOverlay';

/**
 * kind → 컴포넌트 매핑
 * Legacy 12종 (2026-07-17 참고용) + Magazine 9종 (2026-07-20 정본)
 */
export function SlideRender({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    // Legacy 12종
    case 'cover-founder':   return <CoverFounder slide={slide} />;
    case 'number-big':      return <NumberBig slide={slide} />;
    case 'icon-duo':        return <IconDuo slide={slide} />;
    case 'icon-trio':       return <IconTrio slide={slide} />;
    case 'checklist':       return <Checklist slide={slide} />;
    case 'portrait-frame':  return <PortraitFrame slide={slide} />;
    case 'product-hero':    return <ProductHero slide={slide} />;
    case 'quote-bold':      return <QuoteBold slide={slide} />;
    case 'signature-style': return <SignatureStyle slide={slide} />;
    case 'curriculum-row':  return <CurriculumRow slide={slide} />;
    case 'price-table':     return <PriceTable slide={slide} />;
    case 'closing-cta':     return <ClosingCTA slide={slide} />;
    // Magazine 9종
    case 'magazine-cover':      return <MagazineCover slide={slide} />;
    case 'hero-portrait':       return <HeroPortrait slide={slide} />;
    case 'macro-close-up':      return <MacroCloseUp slide={slide} />;
    case 'before-after-split':  return <BeforeAfterSplit slide={slide} />;
    case 'pullquote-editorial': return <PullquoteEditorial slide={slide} />;
    case 'case-study-detail':   return <CaseStudyDetail slide={slide} />;
    case 'atelier-scene':       return <AtelierScene slide={slide} />;
    case 'cta-editorial':       return <CTAEditorial slide={slide} />;
    case 'umbrella-4cats':      return <Umbrella4Cats slide={slide} />;
    // Reimport OCR overlay
    case 'image-with-overlay':  return <ImageWithOverlay slide={slide} />;
    default: {
      // exhaustiveness check
      const _never: never = slide;
      return <div>{JSON.stringify(_never)}</div>;
    }
  }
}
