import type { PortraitFrameSlide } from '../types';
import { slideFrameProps } from '../tone';

/** 06. Portrait-Frame — 전면 인물 사진 + 하단 오버레이 텍스트 (founder/treatment/reels 권장) */
export function PortraitFrame({ slide }: { slide: PortraitFrameSlide }) {
  const { imageSrc, imageAlt, eyebrow, headline, caption, category } = slide;
  return (
    <div {...slideFrameProps(category)}>
      <div className="l-portrait">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pf-img" src={imageSrc} alt={imageAlt ?? ''} />
        {(eyebrow || headline || caption) ? (
          <div className="pf-overlay">
            {eyebrow ? <div className="cn-eyebrow">{eyebrow}</div> : null}
            {headline ? <h3 className="cn-headline">{headline}</h3> : null}
            {caption ? <div className="pf-caption">{caption}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
