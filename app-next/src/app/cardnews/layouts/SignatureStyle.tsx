import type { SignatureStyleSlide } from '../types';
import { slideFrameProps } from '../tone';

/**
 * 09. Signature-Style
 * 좌 딥 블랙 (Brand Concept 공식) + 우 아이보리 (Signature Style 4항목)
 * 원장님 통합 브랜드 가이드 하단 정본 재현
 */
export function SignatureStyle({ slide }: { slide: SignatureStyleSlide }) {
  const { concept, style, category } = slide;
  return (
    <div {...slideFrameProps(category)}>
      <div className="l-signature-style">
        <div className="ss-concept">
          <div className="ss-title">{concept.title}</div>
          <div className="ss-formula">
            {concept.formula.map((f, i) => (
              <span key={f}>
                {f}
                {i < concept.formula.length - 1 ? <span className="plus"> + </span> : null}
                {i < concept.formula.length - 1 ? <br /> : null}
              </span>
            ))}
          </div>
          <div className="ss-result">{concept.result}</div>
          {concept.caption ? <div className="ss-caption">{concept.caption}</div> : null}
        </div>
        <div className="ss-style">
          <div className="ss-title">{style.title}</div>
          <div className="ss-items">
            {style.items.map((it) => (
              <div className="ss-row" key={it.label}>
                <div className="ss-label">{it.label}</div>
                <div className="ss-desc">{it.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
