import type { PriceTableSlide } from '../types';
import { slideFrameProps } from '../tone';

/**
 * 11. Price-Table
 * 상품·수강료 큰 명조 + 조건 pill 리스트
 * 사용례: 이지클래스 69만원 · 소묘·눈썹 세트 등 (detail 카테고리 권장 · 정보 카드)
 */
export function PriceTable({ slide }: { slide: PriceTableSlide }) {
  const { eyebrow, headline, items, footnote, category } = slide;
  return (
    <div {...slideFrameProps(category)}>
      <div className="l-price-table">
        {eyebrow ? <div className="cn-eyebrow">{eyebrow}</div> : null}
        <h2 className="cn-headline">{headline}</h2>
        {items.map((it) => (
          <div className="pt-item" key={it.name}>
            <div className="pt-name">{it.name}</div>
            <div className="pt-price">{it.price}</div>
            {it.conditions?.length ? (
              <div className="pt-conditions">
                {it.conditions.map((c) => (
                  <span className="pt-cond" key={c}>{c}</span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {footnote ? <div className="pt-foot">{footnote}</div> : null}
      </div>
    </div>
  );
}
