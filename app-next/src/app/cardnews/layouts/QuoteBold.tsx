import type { QuoteBoldSlide } from '../types';
import { slideFrameProps } from '../tone';

/**
 * 08. Quote-Bold
 * 큰 세리프 이탤릭 인용 + 하단 by
 * 사용례: 원장님 어록 · 고객 후기 강조 (review 카테고리 권장)
 */
export function QuoteBold({ slide }: { slide: QuoteBoldSlide }) {
  const { eyebrow, quote, by, category } = slide;
  return (
    <div {...slideFrameProps(category)}>
      <div className="l-quote-bold">
        {eyebrow ? <div className="cn-eyebrow">{eyebrow}</div> : null}
        <div className="qb-quote">{quote}</div>
        {by ? <div className="qb-by">{by}</div> : null}
      </div>
    </div>
  );
}
