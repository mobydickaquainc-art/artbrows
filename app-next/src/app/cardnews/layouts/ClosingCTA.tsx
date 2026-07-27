import type { ClosingCTASlide } from '../types';
import { slideFrameProps } from '../tone';

/**
 * 12. Closing-CTA
 * 큰 헤드 + 서브 + 필기체 시그니처 + 골드 CTA 버튼
 * 사용례: 캐러셀 마무리 · 상담 유도
 */
export function ClosingCTA({ slide }: { slide: ClosingCTASlide }) {
  const { headline, highlight, body, signature, cta, ctaHref, category } = slide;
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
      <div className="l-closing">
        <h2 className="cn-headline">{renderHead()}</h2>
        {body ? <div className="cl-body">{body}</div> : null}
        {signature ? <div className="cl-signature">{signature}</div> : null}
        {cta ? (
          <a href={ctaHref ?? '#'} className="cn-cta" target={ctaHref?.startsWith('http') ? '_blank' : undefined} rel={ctaHref?.startsWith('http') ? 'noopener noreferrer' : undefined}>
            {cta}
          </a>
        ) : null}
      </div>
    </div>
  );
}
