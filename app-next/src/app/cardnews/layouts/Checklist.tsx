import type { ChecklistSlide } from '../types';
import { slideFrameProps } from '../tone';

/** 05. Checklist — 골드 체크 리스트 (조건·혜택·수강 조건) */
export function Checklist({ slide }: { slide: ChecklistSlide }) {
  const { eyebrow, headline, items, category } = slide;
  return (
    <div {...slideFrameProps(category)}>
      <div className="l-checklist">
        {eyebrow ? <div className="cn-eyebrow">{eyebrow}</div> : null}
        <h2 className="cn-headline">{headline}</h2>
        <ul className="cl-list">
          {items.map((it, i) => (
            <li className="cl-item" key={i}>{it}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
