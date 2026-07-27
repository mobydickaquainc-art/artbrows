import type { ProductHeroSlide } from '../types';
import { slideFrameProps } from '../tone';

/** 07. Product-Hero — 상단 큰 이미지 + 하단 골드 라벨 카피 (시술 결과·눈썹 클로즈업 · treatment/detail 권장) */
export function ProductHero({ slide }: { slide: ProductHeroSlide }) {
  const { imageSrc, imageAlt, overlayLabel, eyebrow, headline, caption, category } = slide;
  return (
    <div {...slideFrameProps(category)}>
      <div className="l-product">
        <div className="ph-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ph-img" src={imageSrc} alt={imageAlt ?? ''} />
          {overlayLabel ? <div className="ph-label">{overlayLabel}</div> : null}
        </div>
        <div className="ph-body">
          {eyebrow ? <div className="cn-eyebrow">{eyebrow}</div> : null}
          {headline ? <h3 className="cn-headline">{headline}</h3> : null}
          {caption ? <p className="ph-caption">{caption}</p> : null}
        </div>
      </div>
    </div>
  );
}
