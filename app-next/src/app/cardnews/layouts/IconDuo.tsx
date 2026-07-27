import type { IconDuoSlide, IconTrioSlide, IconItem } from '../types';
import { slideFrameProps } from '../tone';

/**
 * 03. Icon-Duo · 04. Icon-Trio 공용
 * 헤드 + N개 아이콘 카드 · 아이콘은 이모지 or imageSrc
 */
function IconSet({ items, cols }: { items: readonly IconItem[]; cols: 'duo' | 'trio' }) {
  return (
    <div className="is-items">
      {items.map((it, i) => (
        <div className="is-item" key={i}>
          {it.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={it.imageSrc} alt={it.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%' }} />
          ) : it.icon ? (
            <div className="is-icon">{it.icon}</div>
          ) : null}
          <div className="is-title">{it.title}</div>
          {it.caption ? <div className="is-caption">{it.caption}</div> : null}
        </div>
      ))}
    </div>
  );
}

export function IconDuo({ slide }: { slide: IconDuoSlide }) {
  const { eyebrow, headline, items, category } = slide;
  return (
    <div {...slideFrameProps(category)}>
      <div className="l-icon-set duo">
        {eyebrow ? <div className="cn-eyebrow">{eyebrow}</div> : null}
        <h2 className="cn-headline">{headline}</h2>
        <IconSet items={items} cols="duo" />
      </div>
    </div>
  );
}

export function IconTrio({ slide }: { slide: IconTrioSlide }) {
  const { eyebrow, headline, items, category } = slide;
  return (
    <div {...slideFrameProps(category)}>
      <div className="l-icon-set trio">
        {eyebrow ? <div className="cn-eyebrow">{eyebrow}</div> : null}
        <h2 className="cn-headline">{headline}</h2>
        <IconSet items={items} cols="trio" />
      </div>
    </div>
  );
}
