import type { NumberBigSlide } from '../types';
import { slideFrameProps } from '../tone';

/** 02. Number-Big — 큰 넘버 + 헤드 + 서브 (스텝/회차 소개 · classroom 권장) */
export function NumberBig({ slide }: { slide: NumberBigSlide }) {
  const { number, eyebrow, headline, body, category } = slide;
  return (
    <div {...slideFrameProps(category)}>
      <div className="l-number-big">
        {eyebrow ? <div className="cn-eyebrow">{eyebrow}</div> : null}
        <div className="nb-num">{number}</div>
        <h2 className="cn-headline">{headline}</h2>
        {body ? <p className="cn-body">{body}</p> : null}
      </div>
    </div>
  );
}
