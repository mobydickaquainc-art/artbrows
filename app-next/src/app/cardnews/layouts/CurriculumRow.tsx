import type { CurriculumRowSlide } from '../types';
import { slideFrameProps } from '../tone';

/**
 * 10. Curriculum-Row
 * 회차별 커리큘럼 세로 리스트 (넘버 · 제목 · 시간·강사)
 * 사용례: 교육 커리큘럼 (classroom 카테고리 권장)
 */
export function CurriculumRow({ slide }: { slide: CurriculumRowSlide }) {
  const { eyebrow, headline, rows, category } = slide;
  return (
    <div {...slideFrameProps(category)}>
      <div className="l-curriculum">
        {eyebrow ? <div className="cn-eyebrow">{eyebrow}</div> : null}
        <h2 className="cn-headline">{headline}</h2>
        <div className="cr-rows">
          {rows.map((r) => (
            <div className="cr-row" key={r.num}>
              <div className="cr-num">{r.num}</div>
              <div className="cr-title">{r.title}</div>
              <div className="cr-meta">
                {r.time ? <>{r.time}<br /></> : null}
                {r.teacher ?? ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
