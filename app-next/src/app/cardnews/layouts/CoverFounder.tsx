import type { CoverFounderSlide } from '../types';
import { slideFrameProps } from '../tone';

/**
 * 01. Cover-Founder
 * 좌측 큰 인물(원장님) + 우측 골드 라벨 + 대형 명조 헤드 + 인용
 * 사용례: 시리즈 커버 · 브랜드 무드 (founder 카테고리 권장)
 */
export function CoverFounder({ slide }: { slide: CoverFounderSlide }) {
  const { eyebrow, headline, highlight, quote, quoteBy, imageSrc, imageAlt, category } = slide;
  const renderHead = () => {
    if (!highlight || !headline.includes(highlight)) return headline;
    const [before, after] = headline.split(highlight);
    return (
      <>
        {before}
        <span className="gold">{highlight}</span>
        {after}
      </>
    );
  };
  return (
    <div {...slideFrameProps(category)}>
      <div className="l-cover-founder">
        <div className="cf-image">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc} alt={imageAlt ?? ''} />
          ) : null}
        </div>
        <div className="cf-text">
          <div className="cn-eyebrow">{eyebrow}</div>
          <h1 className="cn-headline">{renderHead()}</h1>
          {quote ? (
            <blockquote className="cn-quote">
              {quote}
              {quoteBy ? <span className="by">— {quoteBy}</span> : null}
            </blockquote>
          ) : null}
        </div>
      </div>
    </div>
  );
}
