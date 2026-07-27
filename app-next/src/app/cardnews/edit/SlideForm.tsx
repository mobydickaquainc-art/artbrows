'use client';

import type { Slide, LayoutKind } from '../types';
import type { PaletteKey } from '@/lib/artbrows/tokens';
import { artbrowsPalette } from '@/lib/artbrows/tokens';
import { ImageInput } from './ImageInput';

// 텍스트 입력 · 원장님 정본 톤 필드에만 집중 · 복잡한 편집은 이후 라운드
type Props = {
  slide: Slide;
  onChange: (next: Slide) => void;
};

const KIND_LABEL: Record<LayoutKind, string> = {
  // ── Magazine 9종 (2026-07-20 정본 · Maison Noir) ──
  'magazine-cover':       '★ M1 매거진 커버 (Vogue 스타일)',
  'hero-portrait':        '★ M2 화보 인물 (오버레이 최소)',
  'macro-close-up':       '★ M3 매크로 클로즈업 (우측 인용)',
  'before-after-split':   '★ M4 Before/After 분할',
  'pullquote-editorial':  '★ M5 매거진 인용 (Pullquote)',
  'signature-style':      '★ M6 브랜드 컨셉 · 시그니처',
  'case-study-detail':    '★ M7 케이스 스터디 (커리큘럼+가격)',
  'atelier-scene':        '★ M8 아틀리에 씬 (3열 정보)',
  'cta-editorial':        '★ M9 매거진 CTA',
  'umbrella-4cats':       '★ M10 극사실 4대 카테고리',
  // ── Reimport OCR 오버레이 (2026-07-27) ──
  'image-with-overlay':   '★ RE 리뉴얼 (원본 이미지 + 편집 텍스트 오버레이)',
  // ── Legacy 12종 (2026-07-17 참고용 · 하위호환) ──
  'cover-founder': 'L01 커버 (Founder)',
  'number-big': 'L02 큰 넘버',
  'icon-duo': 'L03 아이콘 2분할',
  'icon-trio': 'L04 아이콘 3분할',
  'checklist': 'L05 체크리스트',
  'portrait-frame': 'L06 인물 프레임',
  'product-hero': 'L07 상단 이미지 카드',
  'quote-bold': 'L08 인용문',
  'curriculum-row': 'L10 커리큘럼 (회차 리스트)',
  'price-table': 'L11 가격표',
  'closing-cta': 'L12 마무리 · CTA',
};

const KIND_ORDER: LayoutKind[] = [
  // Magazine 9종 먼저 (권장)
  'magazine-cover','hero-portrait','macro-close-up','before-after-split','pullquote-editorial',
  'signature-style','case-study-detail','atelier-scene','cta-editorial','umbrella-4cats',
  // Reimport OCR
  'image-with-overlay',
  // Legacy 12종 하단
  'cover-founder','number-big','icon-duo','icon-trio','checklist','portrait-frame',
  'product-hero','quote-bold','curriculum-row','price-table','closing-cta',
];

export function SlideForm({ slide, onChange }: Props) {
  const set = <K extends keyof Slide>(patch: Partial<Slide>) => onChange({ ...slide, ...patch } as Slide);

  const changeKind = (kind: LayoutKind) => {
    // kind 바뀌면 기본값 shape 로 초기화 (category 는 유지)
    const base = { category: slide.category } as { category: PaletteKey };
    switch (kind) {
      case 'cover-founder':   return onChange({ kind, ...base, eyebrow: '', headline: '', highlight: '', quote: '', quoteBy: '', imageSrc: '', imageAlt: '' });
      case 'number-big':      return onChange({ kind, ...base, number: '01', eyebrow: '', headline: '', body: '' });
      case 'icon-duo':        return onChange({ kind, ...base, eyebrow: '', headline: '', items: [{ icon: '', title: '' }, { icon: '', title: '' }] });
      case 'icon-trio':       return onChange({ kind, ...base, eyebrow: '', headline: '', items: [{ icon: '', title: '' }, { icon: '', title: '' }, { icon: '', title: '' }] });
      case 'checklist':       return onChange({ kind, ...base, eyebrow: '', headline: '', items: [''] });
      case 'portrait-frame':  return onChange({ kind, ...base, imageSrc: '', imageAlt: '', eyebrow: '', headline: '', caption: '' });
      case 'product-hero':    return onChange({ kind, ...base, imageSrc: '', imageAlt: '', overlayLabel: '', eyebrow: '', headline: '', caption: '' });
      case 'quote-bold':      return onChange({ kind, ...base, eyebrow: '', quote: '', by: '' });
      case 'signature-style': return onChange({ kind, ...base, concept: { title: 'BRAND CONCEPT', formula: ['예술 Art','기술 Technique','철학 Philosophy'], result: '= 극사실눈썹', caption: '' }, style: { title: 'SIGNATURE STYLE', items: [{ label: 'HAIR', desc: '' }, { label: 'OUTFIT', desc: '' }, { label: 'MAKEUP', desc: '' }, { label: 'ACCESSORY', desc: '' }] } });
      case 'curriculum-row':  return onChange({ kind, ...base, eyebrow: '', headline: '', rows: [{ num: '01', title: '', time: '', teacher: '' }] });
      case 'price-table':     return onChange({ kind, ...base, eyebrow: '', headline: '', items: [{ name: '', price: '', conditions: [] }], footnote: '' });
      case 'closing-cta':     return onChange({ kind, ...base, headline: '', highlight: '', body: '', signature: '', cta: '', ctaHref: '' });
      // ── Magazine 9종 초기값 (2026-07-20) ──
      case 'magazine-cover':      return onChange({ kind, ...base, brand: 'ARTBROWS', volume: 'VOL 15 · 2026.07', headline: '', subheadline: '', imageSrc: '', imageAlt: '', signatureLabel: 'MIJI JANG · SEONLEUNG ATELIER' });
      case 'hero-portrait':       return onChange({ kind, ...base, imageSrc: '', imageAlt: '', bottomLabel: '', cornerBadge: '' });
      case 'macro-close-up':      return onChange({ kind, ...base, imageSrc: '', imageAlt: '', overlayLabel: 'HYPER REAL', quote: '', by: '장미지' });
      case 'before-after-split':  return onChange({ kind, ...base, orientation: 'horizontal', beforeSrc: '', beforeAlt: '', afterSrc: '', afterAlt: '', beforeLabel: 'BEFORE', afterLabel: 'AFTER', bottomStrip: '' });
      case 'pullquote-editorial': return onChange({ kind, ...base, quote: '', signature: 'Miji Jang', signatureRole: 'ARTBROWS FOUNDER' });
      case 'case-study-detail':   return onChange({ kind, ...base, eyebrow: '', leftTitle: 'CURRICULUM', leftItems: [{ num: '01', text: '', sub: '' }], rightHeadline: '', rightPrice: '', rightFootnote: '' });
      case 'atelier-scene':       return onChange({ kind, ...base, imageSrc: '', imageAlt: '', eyebrow: '', headline: '', bottomColumns: [{ label: '본원', value: '선릉' }, { label: '경력', value: '20년+' }, { label: '수강', value: '900여명' }] });
      case 'cta-editorial':       return onChange({ kind, ...base, headline: '', highlight: '', signature: 'Miji Jang', cta: '상담 신청', ctaHref: '/enroll', subline: '' });
      case 'umbrella-4cats':      return onChange({ kind, ...base, eyebrow: '極写実 · THE HYPERREAL UNIVERSE', headline: '극사실 · 4대 카테고리', killer: '', cats: [
        { key: 'brow', label: '눈썹', badge: '진행 중', active: true },
        { key: 'eyeline', label: '아이라인', badge: '준비 중', active: false },
        { key: 'lip', label: '입술', badge: '준비 중', active: false },
        { key: 'hairline', label: '헤어라인', badge: '준비 중', active: false },
      ], footnote: '' });
    }
  };

  return (
    <div style={fs.wrap}>
      <div style={fs.row}>
        <label style={fs.label}>레이아웃 kind</label>
        <select value={slide.kind} onChange={(e) => changeKind(e.target.value as LayoutKind)} style={fs.input}>
          {KIND_ORDER.map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
        </select>
      </div>
      <div style={fs.row}>
        <label style={fs.label}>카테고리 (6톤)</label>
        <select value={slide.category} onChange={(e) => set({ category: e.target.value as PaletteKey } as Partial<Slide>)} style={fs.input}>
          {Object.values(artbrowsPalette).map((p) => (
            <option key={p.key} value={p.key}>{p.label} · {p.bg}</option>
          ))}
        </select>
      </div>
      <div style={fs.divider} />
      {renderKindFields(slide, onChange)}
    </div>
  );
}

function renderKindFields(slide: Slide, onChange: (s: Slide) => void) {
  const patch = (p: Partial<Slide>) => onChange({ ...slide, ...p } as Slide);

  const T = (label: string, key: string, value: string | undefined, opts?: { multi?: boolean; placeholder?: string }) => (
    <div style={fs.row}>
      <label style={fs.label}>{label}</label>
      {opts?.multi ? (
        <textarea rows={3} value={value ?? ''} placeholder={opts.placeholder} onChange={(e) => patch({ [key]: e.target.value } as Partial<Slide>)} style={{ ...fs.input, minHeight: 78, resize: 'vertical' }} />
      ) : (
        <input value={value ?? ''} placeholder={opts?.placeholder} onChange={(e) => patch({ [key]: e.target.value } as Partial<Slide>)} style={fs.input} />
      )}
    </div>
  );

  switch (slide.kind) {
    case 'cover-founder':
      return (<>
        {T('eyebrow (골드 라벨)', 'eyebrow', slide.eyebrow)}
        {T('headline (명조 큰 헤드 · \\n 줄바꿈)', 'headline', slide.headline, { multi: true })}
        {T('highlight (골드 강조 부분)', 'highlight', slide.highlight)}
        {T('quote (인용)', 'quote', slide.quote, { multi: true })}
        {T('quoteBy (— 이후 이름)', 'quoteBy', slide.quoteBy, { placeholder: '장미지' })}
        <div style={fs.row}>
          <label style={fs.label}>imageSrc (좌측 인물 사진)</label>
          <ImageInput value={slide.imageSrc ?? ''} onChange={(v) => patch({ imageSrc: v } as Partial<Slide>)} placeholder="/brand/founder-key-visual-2026-07-17.png" />
        </div>
        {T('imageAlt', 'imageAlt', slide.imageAlt)}
      </>);
    case 'number-big':
      return (<>
        {T('number (큰 넘버)', 'number', slide.number, { placeholder: '01' })}
        {T('eyebrow', 'eyebrow', slide.eyebrow)}
        {T('headline', 'headline', slide.headline, { multi: true })}
        {T('body', 'body', slide.body, { multi: true })}
      </>);
    case 'checklist':
      return (<>
        {T('eyebrow', 'eyebrow', slide.eyebrow)}
        {T('headline', 'headline', slide.headline, { multi: true })}
        <ListEditor label="items (체크리스트 · 한 줄에 하나)" items={slide.items} onChange={(v) => onChange({ ...slide, items: v })} />
      </>);
    case 'quote-bold':
      return (<>
        {T('eyebrow', 'eyebrow', slide.eyebrow)}
        {T('quote (큰 이탤릭 인용 · \\n 줄바꿈)', 'quote', slide.quote, { multi: true })}
        {T('by (아래 서브)', 'by', slide.by, { multi: true })}
      </>);
    case 'closing-cta':
      return (<>
        {T('headline', 'headline', slide.headline, { multi: true })}
        {T('highlight (골드 강조)', 'highlight', slide.highlight)}
        {T('body', 'body', slide.body, { multi: true })}
        {T('signature (필기체 · Miji Jang 등)', 'signature', slide.signature)}
        {T('cta (버튼 텍스트)', 'cta', slide.cta)}
        {T('ctaHref (링크)', 'ctaHref', slide.ctaHref, { placeholder: '/enroll' })}
      </>);
    case 'portrait-frame':
      return (<>
        <div style={fs.row}>
          <label style={fs.label}>imageSrc (전면 인물 사진)</label>
          <ImageInput value={slide.imageSrc ?? ''} onChange={(v) => patch({ imageSrc: v } as Partial<Slide>)} />
        </div>
        {T('imageAlt', 'imageAlt', slide.imageAlt)}
        {T('eyebrow (오버레이 라벨)', 'eyebrow', slide.eyebrow)}
        {T('headline (오버레이 헤드)', 'headline', slide.headline)}
        {T('caption (하단 캡션)', 'caption', slide.caption)}
      </>);
    case 'product-hero':
      return (<>
        <div style={fs.row}>
          <label style={fs.label}>imageSrc (상단 큰 이미지)</label>
          <ImageInput value={slide.imageSrc ?? ''} onChange={(v) => patch({ imageSrc: v } as Partial<Slide>)} />
        </div>
        {T('imageAlt', 'imageAlt', slide.imageAlt)}
        {T('overlayLabel (이미지 위 골드 라벨)', 'overlayLabel', slide.overlayLabel, { placeholder: 'HYPER REALISTIC EYEBROW' })}
        {T('eyebrow', 'eyebrow', slide.eyebrow)}
        {T('headline', 'headline', slide.headline)}
        {T('caption', 'caption', slide.caption)}
      </>);
    case 'icon-duo':
    case 'icon-trio': {
      const count = slide.kind === 'icon-duo' ? 2 : 3;
      return (<>
        {T('eyebrow', 'eyebrow', slide.eyebrow)}
        {T('headline', 'headline', slide.headline, { multi: true })}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ marginBottom: 8, padding: 10, border: '1px solid var(--ab-line)', borderRadius: 4 }}>
            <div style={{ ...fs.label, marginBottom: 6 }}>Item {i + 1}</div>
            <input value={slide.items[i]?.icon ?? ''} placeholder="icon (이모지 · 예: ✎)"
              onChange={(e) => {
                const items = [...slide.items];
                items[i] = { ...items[i], icon: e.target.value };
                onChange({ ...slide, items: items as typeof slide.items });
              }}
              style={fs.input} />
            <input value={slide.items[i]?.title ?? ''} placeholder="title"
              onChange={(e) => {
                const items = [...slide.items];
                items[i] = { ...items[i], title: e.target.value };
                onChange({ ...slide, items: items as typeof slide.items });
              }}
              style={{ ...fs.input, marginTop: 6 }} />
            <input value={slide.items[i]?.caption ?? ''} placeholder="caption"
              onChange={(e) => {
                const items = [...slide.items];
                items[i] = { ...items[i], caption: e.target.value };
                onChange({ ...slide, items: items as typeof slide.items });
              }}
              style={{ ...fs.input, marginTop: 6 }} />
          </div>
        ))}
      </>);
    }
    case 'curriculum-row':
      return (<>
        {T('eyebrow', 'eyebrow', slide.eyebrow)}
        {T('headline', 'headline', slide.headline, { multi: true })}
        <div style={fs.label}>rows (회차)</div>
        {slide.rows.map((row, i) => (
          <div key={i} style={{ marginBottom: 8, padding: 10, border: '1px solid var(--ab-line)', borderRadius: 4, display: 'grid', gridTemplateColumns: '60px 1fr', gap: 6 }}>
            <input value={row.num} placeholder="01" onChange={(e) => { const rows = [...slide.rows]; rows[i] = { ...row, num: e.target.value }; onChange({ ...slide, rows }); }} style={fs.input} />
            <input value={row.title} placeholder="제목" onChange={(e) => { const rows = [...slide.rows]; rows[i] = { ...row, title: e.target.value }; onChange({ ...slide, rows }); }} style={fs.input} />
            <input value={row.time ?? ''} placeholder="시간 (3시간)" onChange={(e) => { const rows = [...slide.rows]; rows[i] = { ...row, time: e.target.value }; onChange({ ...slide, rows }); }} style={fs.input} />
            <input value={row.teacher ?? ''} placeholder="강사" onChange={(e) => { const rows = [...slide.rows]; rows[i] = { ...row, teacher: e.target.value }; onChange({ ...slide, rows }); }} style={fs.input} />
            <button style={{ ...fs.btnGhost, gridColumn: '1 / -1' }} onClick={() => { const rows = slide.rows.filter((_, j) => j !== i); onChange({ ...slide, rows }); }}>이 회차 삭제</button>
          </div>
        ))}
        <button style={fs.btnGhost} onClick={() => onChange({ ...slide, rows: [...slide.rows, { num: String(slide.rows.length + 1).padStart(2, '0'), title: '', time: '', teacher: '' }] })}>+ 회차 추가</button>
      </>);
    case 'price-table':
      return (<>
        {T('eyebrow', 'eyebrow', slide.eyebrow)}
        {T('headline', 'headline', slide.headline, { multi: true })}
        <div style={fs.label}>items (상품)</div>
        {slide.items.map((it, i) => (
          <div key={i} style={{ marginBottom: 8, padding: 10, border: '1px solid var(--ab-line)', borderRadius: 4 }}>
            <input value={it.name} placeholder="상품명" onChange={(e) => { const items = [...slide.items]; items[i] = { ...it, name: e.target.value }; onChange({ ...slide, items }); }} style={fs.input} />
            <input value={it.price} placeholder="가격 (69만원)" onChange={(e) => { const items = [...slide.items]; items[i] = { ...it, price: e.target.value }; onChange({ ...slide, items }); }} style={{ ...fs.input, marginTop: 6 }} />
            <textarea rows={2} value={(it.conditions ?? []).join('\n')} placeholder="조건 (한 줄에 하나)" onChange={(e) => { const items = [...slide.items]; items[i] = { ...it, conditions: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) }; onChange({ ...slide, items }); }} style={{ ...fs.input, marginTop: 6, minHeight: 56, resize: 'vertical' }} />
            <button style={{ ...fs.btnGhost, marginTop: 6, width: '100%' }} onClick={() => { const items = slide.items.filter((_, j) => j !== i); onChange({ ...slide, items }); }}>이 상품 삭제</button>
          </div>
        ))}
        <button style={fs.btnGhost} onClick={() => onChange({ ...slide, items: [...slide.items, { name: '', price: '', conditions: [] }] })}>+ 상품 추가</button>
        {T('footnote', 'footnote', slide.footnote, { multi: true })}
      </>);
    case 'signature-style':
      return (<>
        <div style={fs.label}>BRAND CONCEPT (좌 · 딥 블랙)</div>
        <input value={slide.concept.title} onChange={(e) => onChange({ ...slide, concept: { ...slide.concept, title: e.target.value } })} placeholder="BRAND CONCEPT" style={fs.input} />
        <textarea rows={3} value={slide.concept.formula.join('\n')} placeholder="예술 Art\n기술 Technique\n철학 Philosophy" onChange={(e) => onChange({ ...slide, concept: { ...slide.concept, formula: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) } })} style={{ ...fs.input, marginTop: 6, minHeight: 74 }} />
        <input value={slide.concept.result} onChange={(e) => onChange({ ...slide, concept: { ...slide.concept, result: e.target.value } })} placeholder="= 극사실눈썹" style={{ ...fs.input, marginTop: 6 }} />
        <textarea rows={2} value={slide.concept.caption ?? ''} onChange={(e) => onChange({ ...slide, concept: { ...slide.concept, caption: e.target.value } })} placeholder="caption" style={{ ...fs.input, marginTop: 6, minHeight: 56 }} />
        <div style={{ ...fs.label, marginTop: 12 }}>SIGNATURE STYLE (우 · 아이보리)</div>
        <input value={slide.style.title} onChange={(e) => onChange({ ...slide, style: { ...slide.style, title: e.target.value } })} placeholder="SIGNATURE STYLE" style={fs.input} />
        {slide.style.items.map((it, i) => (
          <div key={i} style={{ marginTop: 6, padding: 10, border: '1px solid var(--ab-line)', borderRadius: 4 }}>
            <input value={it.label} placeholder="LABEL" onChange={(e) => { const items = [...slide.style.items]; items[i] = { ...it, label: e.target.value }; onChange({ ...slide, style: { ...slide.style, items } }); }} style={fs.input} />
            <textarea rows={2} value={it.desc} placeholder="desc" onChange={(e) => { const items = [...slide.style.items]; items[i] = { ...it, desc: e.target.value }; onChange({ ...slide, style: { ...slide.style, items } }); }} style={{ ...fs.input, marginTop: 6, minHeight: 56 }} />
            <button style={{ ...fs.btnGhost, marginTop: 6, width: '100%' }} onClick={() => { const items = slide.style.items.filter((_, j) => j !== i); onChange({ ...slide, style: { ...slide.style, items } }); }}>이 항목 삭제</button>
          </div>
        ))}
        <button style={{ ...fs.btnGhost, marginTop: 6 }} onClick={() => onChange({ ...slide, style: { ...slide.style, items: [...slide.style.items, { label: 'NEW', desc: '' }] } })}>+ 항목 추가</button>
      </>);
    // ═══════════ Magazine 9종 (2026-07-20 정본) ═══════════
    case 'magazine-cover':
      return (<>
        {T('brand (상단 좌 브랜드명)', 'brand', slide.brand, { placeholder: 'ARTBROWS' })}
        {T('volume (상단 우 · VOL 15 · 2026.07)', 'volume', slide.volume)}
        {T('headline (대형 세리프 · \\n 줄바꿈)', 'headline', slide.headline, { multi: true })}
        {T('subheadline (이탤릭 서브)', 'subheadline', slide.subheadline)}
        <div style={fs.row}>
          <label style={fs.label}>imageSrc (배경 인물 · 페이드)</label>
          <ImageInput value={slide.imageSrc ?? ''} onChange={(v) => patch({ imageSrc: v } as Partial<Slide>)} placeholder="/brand/founder-key-visual-2026-07-17.png" />
        </div>
        {T('imageAlt', 'imageAlt', slide.imageAlt)}
        {T('signatureLabel (하단 라벨)', 'signatureLabel', slide.signatureLabel, { placeholder: 'MIJI JANG · SEONLEUNG ATELIER' })}
      </>);
    case 'hero-portrait':
      return (<>
        <div style={fs.row}>
          <label style={fs.label}>imageSrc (전면 화보 · 텍스트 있는 완성 카드 OK)</label>
          <ImageInput value={slide.imageSrc ?? ''} onChange={(v) => patch({ imageSrc: v } as Partial<Slide>)} placeholder="/brand/ads/ig-69/01-hero-portrait.png" />
        </div>
        {T('imageAlt', 'imageAlt', slide.imageAlt)}
        {T('cornerBadge (우상단 배지)', 'cornerBadge', slide.cornerBadge, { placeholder: 'REAL RESULT' })}
        {T('bottomLabel (하단 골드 라벨)', 'bottomLabel', slide.bottomLabel)}
      </>);
    case 'macro-close-up':
      return (<>
        <div style={fs.row}>
          <label style={fs.label}>imageSrc (좌측 매크로 이미지 · 순수 사진)</label>
          <ImageInput value={slide.imageSrc ?? ''} onChange={(v) => patch({ imageSrc: v } as Partial<Slide>)} />
        </div>
        {T('imageAlt', 'imageAlt', slide.imageAlt)}
        {T('overlayLabel (이미지 좌상단 라벨)', 'overlayLabel', slide.overlayLabel, { placeholder: 'HYPER REAL' })}
        {T('quote (우측 미니 인용 · \\n 가능)', 'quote', slide.quote, { multi: true })}
        {T('by (우측 서명)', 'by', slide.by, { placeholder: '장미지' })}
      </>);
    case 'before-after-split':
      return (<>
        <div style={fs.row}>
          <label style={fs.label}>orientation</label>
          <select value={slide.orientation ?? 'horizontal'} onChange={(e) => patch({ orientation: e.target.value as 'horizontal' | 'vertical' } as Partial<Slide>)} style={fs.input}>
            <option value="horizontal">horizontal (좌우 분할)</option>
            <option value="vertical">vertical (상하 분할)</option>
          </select>
        </div>
        <div style={fs.row}>
          <label style={fs.label}>beforeSrc (동일 인물 시술 전)</label>
          <ImageInput value={slide.beforeSrc ?? ''} onChange={(v) => patch({ beforeSrc: v } as Partial<Slide>)} />
        </div>
        {T('beforeAlt', 'beforeAlt', slide.beforeAlt)}
        <div style={fs.row}>
          <label style={fs.label}>afterSrc (동일 인물 시술 후)</label>
          <ImageInput value={slide.afterSrc ?? ''} onChange={(v) => patch({ afterSrc: v } as Partial<Slide>)} />
        </div>
        {T('afterAlt', 'afterAlt', slide.afterAlt)}
        {T('beforeLabel', 'beforeLabel', slide.beforeLabel, { placeholder: 'BEFORE' })}
        {T('afterLabel', 'afterLabel', slide.afterLabel, { placeholder: 'AFTER' })}
        {T('bottomStrip (하단 얇은 정보 스트립)', 'bottomStrip', slide.bottomStrip)}
      </>);
    case 'pullquote-editorial':
      return (<>
        {T('quote (대형 세리프 이탤릭 · \\n 줄바꿈)', 'quote', slide.quote, { multi: true, placeholder: '고객이 원하는 것은\\n그린 눈썹이 아니라\\n털 같은 눈썹이다.' })}
        {T('signature (필기체 서명)', 'signature', slide.signature, { placeholder: 'Miji Jang' })}
        {T('signatureRole (하단 라벨)', 'signatureRole', slide.signatureRole, { placeholder: 'ARTBROWS FOUNDER · 20 YEARS' })}
      </>);
    case 'case-study-detail':
      return (<>
        {T('eyebrow', 'eyebrow', slide.eyebrow)}
        {T('leftTitle (좌측 섹션 제목)', 'leftTitle', slide.leftTitle, { placeholder: 'CURRICULUM' })}
        <div style={fs.label}>leftItems (좌측 정보 리스트)</div>
        {slide.leftItems.map((it, i) => (
          <div key={i} style={{ marginBottom: 8, padding: 10, border: '1px solid var(--ab-line)', borderRadius: 4 }}>
            <input value={it.num ?? ''} placeholder="num (01)" onChange={(e) => { const arr = [...slide.leftItems]; arr[i] = { ...it, num: e.target.value }; onChange({ ...slide, leftItems: arr }); }} style={fs.input} />
            <input value={it.text} placeholder="text (본문)" onChange={(e) => { const arr = [...slide.leftItems]; arr[i] = { ...it, text: e.target.value }; onChange({ ...slide, leftItems: arr }); }} style={{ ...fs.input, marginTop: 6 }} />
            <input value={it.sub ?? ''} placeholder="sub (부기)" onChange={(e) => { const arr = [...slide.leftItems]; arr[i] = { ...it, sub: e.target.value }; onChange({ ...slide, leftItems: arr }); }} style={{ ...fs.input, marginTop: 6 }} />
            <button style={{ ...fs.btnGhost, marginTop: 6, width: '100%' }} onClick={() => { const arr = slide.leftItems.filter((_, j) => j !== i); onChange({ ...slide, leftItems: arr }); }}>이 항목 삭제</button>
          </div>
        ))}
        <button style={fs.btnGhost} onClick={() => onChange({ ...slide, leftItems: [...slide.leftItems, { num: String(slide.leftItems.length + 1).padStart(2, '0'), text: '', sub: '' }] })}>+ 항목 추가</button>
        {T('rightHeadline (우측 대형 세리프 · \\n 줄바꿈)', 'rightHeadline', slide.rightHeadline, { multi: true })}
        {T('rightPrice (우측 가격)', 'rightPrice', slide.rightPrice, { placeholder: '660만원' })}
        {T('rightFootnote (우측 하단 얇은 부기)', 'rightFootnote', slide.rightFootnote)}
      </>);
    case 'atelier-scene':
      return (<>
        <div style={fs.row}>
          <label style={fs.label}>imageSrc (씬 사진 · 순수)</label>
          <ImageInput value={slide.imageSrc ?? ''} onChange={(v) => patch({ imageSrc: v } as Partial<Slide>)} placeholder="/hero-mood/hero-portrait-*.png" />
        </div>
        {T('imageAlt', 'imageAlt', slide.imageAlt)}
        {T('eyebrow (이미지 하단 오버레이 라벨)', 'eyebrow', slide.eyebrow)}
        {T('headline (이미지 하단 오버레이 헤드)', 'headline', slide.headline)}
        <div style={fs.label}>bottomColumns (하단 3열)</div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ marginBottom: 8, padding: 10, border: '1px solid var(--ab-line)', borderRadius: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <input value={slide.bottomColumns[i]?.label ?? ''} placeholder="label (본원)" onChange={(e) => { const arr = [...slide.bottomColumns]; arr[i] = { ...(arr[i] ?? { label: '', value: '' }), label: e.target.value }; onChange({ ...slide, bottomColumns: arr }); }} style={fs.input} />
            <input value={slide.bottomColumns[i]?.value ?? ''} placeholder="value (선릉)" onChange={(e) => { const arr = [...slide.bottomColumns]; arr[i] = { ...(arr[i] ?? { label: '', value: '' }), value: e.target.value }; onChange({ ...slide, bottomColumns: arr }); }} style={fs.input} />
          </div>
        ))}
      </>);
    case 'cta-editorial':
      return (<>
        {T('headline (대형 세리프 · \\n 줄바꿈)', 'headline', slide.headline, { multi: true })}
        {T('highlight (headline 중 골드 강조 단어)', 'highlight', slide.highlight)}
        {T('subline (이탤릭 서브 · \\n 가능)', 'subline', slide.subline, { multi: true })}
        {T('signature (필기체 · Miji Jang)', 'signature', slide.signature)}
        {T('cta (버튼 텍스트)', 'cta', slide.cta, { placeholder: '상담 신청' })}
        {T('ctaHref (링크)', 'ctaHref', slide.ctaHref, { placeholder: '/enroll' })}
      </>);
    case 'umbrella-4cats':
      return (<>
        {T('eyebrow', 'eyebrow', slide.eyebrow, { placeholder: '極写実 · THE HYPERREAL UNIVERSE' })}
        {T('headline', 'headline', slide.headline, { placeholder: '극사실 · 4대 카테고리' })}
        {T('killer (원장 원문 인용)', 'killer', slide.killer, { multi: true, placeholder: '진짜 머리카락이야 · 진짜 눈썹이야 · 원래 입술 색깔 아니었어?' })}
        <div style={fs.label}>cats (4대 카테고리)</div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ marginBottom: 8, padding: 10, border: '1px solid var(--ab-line)', borderRadius: 4, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 6, alignItems: 'center' }}>
            <input value={slide.cats[i]?.label ?? ''} placeholder="label (눈썹)" onChange={(e) => { const arr = [...slide.cats] as typeof slide.cats; arr[i] = { ...(arr[i] ?? { key: '', label: '', badge: '', active: false }), label: e.target.value }; onChange({ ...slide, cats: arr }); }} style={fs.input} />
            <input value={slide.cats[i]?.key ?? ''} placeholder="key (brow)" onChange={(e) => { const arr = [...slide.cats] as typeof slide.cats; arr[i] = { ...(arr[i] ?? { key: '', label: '', badge: '', active: false }), key: e.target.value }; onChange({ ...slide, cats: arr }); }} style={fs.input} />
            <input value={slide.cats[i]?.badge ?? ''} placeholder="badge (진행 중)" onChange={(e) => { const arr = [...slide.cats] as typeof slide.cats; arr[i] = { ...(arr[i] ?? { key: '', label: '', badge: '', active: false }), badge: e.target.value }; onChange({ ...slide, cats: arr }); }} style={fs.input} />
            <label style={{ ...fs.label, fontSize: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={slide.cats[i]?.active ?? false} onChange={(e) => { const arr = [...slide.cats] as typeof slide.cats; arr[i] = { ...(arr[i] ?? { key: '', label: '', badge: '', active: false }), active: e.target.checked }; onChange({ ...slide, cats: arr }); }} /> active
            </label>
          </div>
        ))}
        {T('footnote (하단 부기)', 'footnote', slide.footnote)}
      </>);
    default:
      return <div>미지원 kind: {(slide as { kind?: string }).kind}</div>;
  }
}

function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div style={fs.row}>
      <label style={fs.label}>{label}</label>
      <textarea
        rows={Math.max(4, items.length + 1)}
        value={items.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
        style={{ ...fs.input, minHeight: 110, resize: 'vertical' }}
      />
    </div>
  );
}

const fs = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 12 } as React.CSSProperties,
  row: { display: 'flex', flexDirection: 'column', gap: 4 } as React.CSSProperties,
  label: { fontSize: 11, letterSpacing: '0.1em', color: 'var(--ab-gold-light)', fontFamily: 'var(--ab-font-body-latin)', textTransform: 'uppercase', fontWeight: 600 } as React.CSSProperties,
  input: { width: '100%', padding: '10px 12px', background: '#0F0D0B', border: '1px solid var(--ab-line)', color: 'var(--ab-ivory)', fontFamily: 'var(--ab-font-body)', fontSize: 13, borderRadius: 3, boxSizing: 'border-box' } as React.CSSProperties,
  divider: { height: 1, background: 'var(--ab-gold-line)', margin: '8px 0' } as React.CSSProperties,
  btnGhost: { padding: '8px 12px', background: 'transparent', color: 'var(--ab-gold-light)', border: '1px solid var(--ab-gold-line)', fontSize: 11.5, fontFamily: 'var(--ab-font-body-latin)', letterSpacing: '0.05em', cursor: 'pointer', borderRadius: 3, fontWeight: 700 } as React.CSSProperties,
};
