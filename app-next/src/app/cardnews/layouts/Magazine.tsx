import type {
  MagazineCoverSlide,
  HeroPortraitSlide,
  MacroCloseUpSlide,
  BeforeAfterSplitSlide,
  PullquoteEditorialSlide,
  CaseStudyDetailSlide,
  AtelierSceneSlide,
  CTAEditorialSlide,
  Umbrella4CatsSlide,
} from '../types';
import type { PaletteKey } from '@/lib/artbrows/tokens';

// 매거진 kind 공통: 카테고리 배경은 무시 · 항상 Maison Noir 다크 (.mag)
function magFrameProps(category: PaletteKey, layoutClass: string, extra?: string) {
  return {
    className: `slide-frame mag ab-cat-${category} ${layoutClass}${extra ? ' ' + extra : ''}`,
    'data-tone': 'dark' as const,
  };
}

/** M1. Magazine-Cover — Vogue 커버 · 대형 세리프 + 원장 배경 이미지 */
export function MagazineCover({ slide }: { slide: MagazineCoverSlide }) {
  const { headline, subheadline, imageSrc, volume, brand, signatureLabel, category } = slide;
  return (
    <div {...magFrameProps(category, 'l-magazine-cover')}>
      {imageSrc ? <div className="mc-image-bg" style={{ backgroundImage: `url(${imageSrc})` }} /> : null}
      <div className="mc-fade" />
      <div className="mc-top">
        <div className="mc-brand">{brand ?? 'ARTBROWS'}</div>
        {volume ? <div className="mc-vol">{volume}</div> : null}
      </div>
      <div className="mc-head">{headline}</div>
      {subheadline ? <div className="mc-sub">{subheadline}</div> : null}
      <div className="mc-sig">
        <div className="mag-hairline solid" />
        <div className="mc-sig-label">{signatureLabel ?? 'MIJI JANG · SEONLEUNG ATELIER'}</div>
      </div>
    </div>
  );
}

/** M2. Hero-Portrait — 화보 인물 전면 · 오버레이 최소 텍스트 */
export function HeroPortrait({ slide }: { slide: HeroPortraitSlide }) {
  const { imageSrc, imageAlt, bottomLabel, cornerBadge, category } = slide;
  return (
    <div {...magFrameProps(category, 'l-hero-portrait')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hp-img" src={imageSrc} alt={imageAlt ?? ''} />
      {cornerBadge ? <div className="hp-corner mag-label">{cornerBadge}</div> : null}
      {bottomLabel ? (
        <div className="hp-bottom">
          <div className="mag-hairline solid" />
          <div className="mag-label">{bottomLabel}</div>
          <div className="mag-hairline solid" />
        </div>
      ) : null}
    </div>
  );
}

/** M3. Macro-Close-Up — 매크로 이미지 + 우측 미니 인용 */
export function MacroCloseUp({ slide }: { slide: MacroCloseUpSlide }) {
  const { imageSrc, imageAlt, quote, by, overlayLabel, category } = slide;
  return (
    <div {...magFrameProps(category, 'l-macro-close-up')}>
      <div className="mcu-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mcu-img" src={imageSrc} alt={imageAlt ?? ''} />
        {overlayLabel ? <div className="mcu-overlay-label">{overlayLabel}</div> : null}
      </div>
      <div className="mcu-text">
        {quote ? <div className="mcu-quote">{quote}</div> : null}
        {by ? <div className="mcu-by">— {by}</div> : null}
      </div>
    </div>
  );
}

/** M4. Before-After-Split — 좌우/상하 분할 */
export function BeforeAfterSplit({ slide }: { slide: BeforeAfterSplitSlide }) {
  const { orientation, beforeSrc, afterSrc, beforeAlt, afterAlt, beforeLabel, afterLabel, bottomStrip, category } = slide;
  const orient = orientation ?? 'horizontal';
  return (
    <div {...magFrameProps(category, 'l-before-after-split', orient === 'vertical' ? 'vertical' : undefined)}>
      <div className="ba-panels">
        <div className="ba-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeSrc} alt={beforeAlt ?? 'before'} />
          <div className="ba-label">{beforeLabel ?? 'BEFORE'}</div>
        </div>
        <div className="ba-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={afterSrc} alt={afterAlt ?? 'after'} />
          <div className="ba-label">{afterLabel ?? 'AFTER'}</div>
        </div>
      </div>
      {bottomStrip ? <div className="ba-strip">{bottomStrip}</div> : null}
    </div>
  );
}

/** M5. Pullquote-Editorial — 매거진 pullquote */
export function PullquoteEditorial({ slide }: { slide: PullquoteEditorialSlide }) {
  const { quote, signature, signatureRole, category } = slide;
  return (
    <div {...magFrameProps(category, 'l-pullquote-editorial')}>
      <div className="pq-mark">&ldquo;</div>
      <div className="pq-quote">{quote}</div>
      {signature ? (
        <div className="pq-sig">
          <div className="mag-signature">{signature}</div>
          {signatureRole ? <div className="pq-role">{signatureRole}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

/** M6. Case-Study-Detail — 좌 정보 리스트 + 우 대형 세리프 요약 */
// AI가 leftItems를 string 배열로 반환하는 케이스 방어 (2026-07-21 · OpenAI 응답 변이 대응)
// "1. 자연스러운 눈썹 결" → { num: "01", text: "자연스러운 눈썹 결", sub: undefined }
function normalizeCaseItems(raw: unknown[]): { num?: string; text: string; sub?: string }[] {
  return (raw ?? []).map((it, i) => {
    if (typeof it === 'string') {
      // "01. text" 또는 "1. text" 형식 파싱
      const m = it.match(/^\s*(\d{1,2})[.\s)]+\s*(.+)$/);
      if (m) return { num: m[1].padStart(2, '0'), text: m[2].trim() };
      return { text: it, num: String(i + 1).padStart(2, '0') };
    }
    if (it && typeof it === 'object') {
      const o = it as Record<string, unknown>;
      const num  = typeof o.num  === 'string' ? o.num  : (typeof o.num  === 'number' ? String(o.num) : undefined);
      const text = typeof o.text === 'string' ? o.text : typeof o.title === 'string' ? o.title as string : String(o.text ?? '');
      // ★ String.prototype.sub 회피: 반드시 문자열만 sub로 받음
      const sub  = typeof o.sub  === 'string' ? o.sub  : typeof o.description === 'string' ? o.description as string : undefined;
      return { num, text, sub };
    }
    return { text: String(it ?? ''), num: String(i + 1).padStart(2, '0') };
  });
}

export function CaseStudyDetail({ slide }: { slide: CaseStudyDetailSlide }) {
  const { eyebrow, leftTitle, leftItems, rightHeadline, rightPrice, rightFootnote, category } = slide;
  const items = normalizeCaseItems(leftItems as unknown[]);
  return (
    <div {...magFrameProps(category, 'l-case-study-detail')}>
      <div className="cs-left">
        {eyebrow ? <div className="mag-label cs-eyebrow">{eyebrow}</div> : null}
        {leftTitle ? <div className="cs-left-title">{leftTitle}</div> : null}
        {items.map((it, i) => (
          <div className="cs-item" key={i}>
            <div className="cs-num">{it.num ?? String(i + 1).padStart(2, '0')}</div>
            <div>
              <div className="cs-text">{it.text}</div>
              {it.sub ? <div className="cs-sub">{it.sub}</div> : null}
            </div>
          </div>
        ))}
      </div>
      <div className="cs-right">
        <div className="cs-head">{rightHeadline}</div>
        {rightPrice ? <div className="cs-price">{rightPrice}</div> : null}
        {rightFootnote ? <div className="cs-foot">{rightFootnote}</div> : null}
      </div>
    </div>
  );
}

// bottomColumns를 { label, value } 형태로 정규화 (AI 변이 대응)
function normalizeColumns(raw: unknown[]): { label: string; value: string }[] {
  return (raw ?? []).map((c) => {
    if (typeof c === 'string') {
      // "본원: 선릉·삼성" 또는 "본원=선릉·삼성" 파싱
      const m = c.match(/^([^:=]+)[:=]\s*(.+)$/);
      if (m) return { label: m[1].trim(), value: m[2].trim() };
      return { label: '', value: c };
    }
    if (c && typeof c === 'object') {
      const o = c as Record<string, unknown>;
      return {
        label: typeof o.label === 'string' ? o.label : String(o.label ?? ''),
        value: typeof o.value === 'string' ? o.value : String(o.value ?? ''),
      };
    }
    return { label: '', value: String(c ?? '') };
  });
}

/** M7. Atelier-Scene — 시네마틱 씬 + 하단 3열 정보 */
export function AtelierScene({ slide }: { slide: AtelierSceneSlide }) {
  const { imageSrc, imageAlt, eyebrow, headline, bottomColumns, category } = slide;
  const cols = normalizeColumns(bottomColumns as unknown[]);
  return (
    <div {...magFrameProps(category, 'l-atelier-scene')}>
      <div className="as-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="as-img" src={imageSrc} alt={imageAlt ?? ''} />
        {(eyebrow || headline) ? (
          <div className="as-overlay">
            {eyebrow ? <div className="mag-label as-eyebrow">{eyebrow}</div> : null}
            {headline ? <div className="as-head">{headline}</div> : null}
          </div>
        ) : null}
      </div>
      <div className="as-strip">
        {cols.slice(0, 3).map((c, i) => (
          <div className="as-col" key={i}>
            <div className="as-col-label">{c.label}</div>
            <div className="as-col-value">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** M8. CTA-Editorial — 얇은 골드 라인 + 세리프 헤드 + 필기체 서명 */
export function CTAEditorial({ slide }: { slide: CTAEditorialSlide }) {
  const { headline, highlight, signature, cta, ctaHref, subline, category } = slide;
  // highlight 부분에 gold-word 클래스
  const parts = highlight ? headline.split(highlight) : [headline];
  return (
    <div {...magFrameProps(category, 'l-cta-editorial')}>
      <hr className="mag-hairline solid cta-hair-top" />
      <div className="cta-head">
        {parts.map((p, i) => (
          <span key={i}>
            {p}
            {i < parts.length - 1 && highlight ? <span className="gold-word">{highlight}</span> : null}
          </span>
        ))}
      </div>
      {subline ? <div className="cta-sub">{subline}</div> : null}
      {signature ? <div className="cta-sig mag-signature">{signature}</div> : null}
      {cta ? (ctaHref ? <a className="cta-btn" href={ctaHref}>{cta}</a> : <div className="cta-btn">{cta}</div>) : null}
      <hr className="mag-hairline solid cta-hair-bot" />
    </div>
  );
}

/** M9. Umbrella-4Cats — 극사실 4대 카테고리 우산 그리드 */
export function Umbrella4Cats({ slide }: { slide: Umbrella4CatsSlide }) {
  const { eyebrow, headline, killer, cats, footnote, category } = slide;
  return (
    <div {...magFrameProps(category, 'l-umbrella-4cats')}>
      {eyebrow ? <div className="mag-label u4-eyebrow">{eyebrow}</div> : null}
      <div className="u4-head">{headline}</div>
      {killer ? <div className="u4-killer">&ldquo;{killer}&rdquo;</div> : null}
      <div className="u4-grid">
        {cats.map((c, i) => (
          <div key={i} className={`u4-cat${c.active ? ' active' : ''}`}>
            <div className="u4-cat-label">{c.label}</div>
            <div className="u4-cat-badge">{c.badge}</div>
          </div>
        ))}
      </div>
      {footnote ? <div className="u4-foot">{footnote}</div> : null}
    </div>
  );
}
