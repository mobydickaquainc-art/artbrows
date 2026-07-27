/**
 * 4 agent: trend-researcher · vision-analyzer · stylist · copywriter
 * 각 함수 = 1 stage · orchestrator 에서 순서대로 호출.
 */

import type { Slide, LayoutKind } from '@/app/cardnews/types';
import type { PaletteKey } from '@/lib/artbrows/tokens';
import { chatText, chatJson, geminiVision } from './models';
import { ARTBROWS_BRAND_SYSTEM, CATEGORY_PROMPT_HINTS, LANG_TONE_HINTS } from './prompts';
import { sanitizeSlide } from './sanitize';
import { presetToPromptHint, DEFAULT_STYLE_PRESET, getRecommendedKinds, getPreset } from './style-presets';
import { COPY_TONE_META } from './types';
import type { ModelId, TrendReport, VisionReport, SlideSkeleton, SlideCopyVariant, GenerateInput } from './types';

// ─────────────────── 1. trend-researcher ───────────────────
export async function runTrendResearch(input: GenerateInput, model: ModelId): Promise<TrendReport> {
  const prompt = `
목적: "${input.purpose}"
언어: ${input.lang}
슬라이드 수: ${input.slideCount}장

이 목적에 맞는 최근 인스타·핀터레스트 카드뉴스 트렌드를 조사·요약.
${LANG_TONE_HINTS[input.lang]}

JSON 스키마:
{
  "summary": "3~5 문장의 트렌드 요약",
  "layoutPatterns": ["큰 넘버 + 짧은 카피", "인용문 강조 + 필기체" 등 최근 자주 쓰는 패턴 5개"],
  "copyToneHints": ["질문형 헤드", "숫자 반복" 등 카피 톤 힌트 5개"],
  "keywords": ["최신 키워드·해시태그 8개"]
}
`.trim();

  const json = await chatJson<Omit<TrendReport, 'source'>>(model, prompt, { system: ARTBROWS_BRAND_SYSTEM, temperature: 0.6 });
  return { source: model, ...json };
}

// ─────────────────── 2. vision-analyzer (Gemini 전용) ───────────────────
export async function runVisionAnalysis(refPaths: string[]): Promise<VisionReport[]> {
  // 파일 하나씩 개별 분석 (스타일 특징 명확)
  const reports: VisionReport[] = [];
  for (const refPath of refPaths) {
    try {
      const prompt = `
이 이미지는 카드뉴스·인스타 콘텐츠 벤치마크입니다.
아래 JSON 스키마로만 응답:
{
  "paletteDescription": "색·톤 요약 (2문장)",
  "layoutDescription": "레이아웃 패턴 요약 (2문장)",
  "moodKeywords": ["무드 키워드 5개"]
}
`.trim();
      const raw = await geminiVision([refPath], prompt, { system: ARTBROWS_BRAND_SYSTEM, temperature: 0.4 });
      const s = raw.trim().replace(/^```(?:json)?\s*/, '').replace(/```$/, '');
      const first = s.indexOf('{'); const last = s.lastIndexOf('}');
      const j = JSON.parse(s.slice(first, last + 1)) as Omit<VisionReport, 'refPath'>;
      reports.push({ refPath, ...j });
    } catch (e) {
      reports.push({
        refPath,
        paletteDescription: `분석 실패: ${e instanceof Error ? e.message : 'unknown'}`,
        layoutDescription: '',
        moodKeywords: [],
      });
    }
  }
  return reports;
}

// ─────────────────── 3. stylist (12종 × 6톤 매트릭스 결정) ───────────────────
const LAYOUT_KINDS: LayoutKind[] = [
  'cover-founder', 'number-big', 'icon-duo', 'icon-trio', 'checklist',
  'portrait-frame', 'product-hero', 'quote-bold', 'signature-style',
  'curriculum-row', 'price-table', 'closing-cta',
];
const PALETTE_KEYS: PaletteKey[] = ['treatment', 'founder', 'review', 'classroom', 'detail', 'reels'];

// ─────────────── 이미지 pool (2026-07-20 v4 · 텍스트 겹침 방지 재분류) ───────────────
// IG-69만원 이미지 = 자체 텍스트 포함 완성 카드 → hero-portrait 통짜 표시만 (오버레이 X)
// 순수 사진 (텍스트 없음) = magazine-cover 배경 · macro-close-up 등 오버레이 안전
// 2026-07-21 · Higgsfield AI 15장 대량 생성 (매크로4·손펜슬4·아틀리에4·B/A3) · 「In-the-softness」 다른 학원 원장 이미지 완전 제외
export const FOUNDER_IMAGE_POOL = [
  // ★ Higgsfield 원장 페르소나 (2026-07-22 · 마스터 아티스트 톤 · 대표님 지시)
  '/brand/ai-generated/founder-persona/founder-01.png',
  '/brand/ai-generated/founder-persona/founder-02.png',
  '/brand/ai-generated/founder-persona/founder-03.png',
  // 원장 실사 및 승인된 무드컷
  '/brand/founder-key-visual-2026-07-17.png',
  '/brand/founder/2026-07-17-integrated-guide-1.png',
  '/brand/founder/2026-07-17-integrated-guide-2.png',
  '/brand/ads/mood/mood-2.png',
  '/brand/ads/mood/recruit-key.png',
  // K-idol Higgsfield (2026-07-20 · 홈피 히어로)
  '/hero-mood/hero-portrait-E.png',
  '/hero-mood/hero-portrait-F.png',
  '/hero-mood/hero-portrait-G.png',
  // Higgsfield 아틀리에 씬 (2026-07-21 · 인물 X · 공간 무드)
  '/brand/ai-generated/atelier/atelier-01.png',
  '/brand/ai-generated/atelier/atelier-02.png',
  '/brand/ai-generated/atelier/atelier-03.png',
  '/brand/ai-generated/atelier/atelier-04.png',
];
export const PORTRAIT_IMAGE_POOL = [
  // ★ Higgsfield 원장 페르소나 (마스터 · hero용)
  '/brand/ai-generated/founder-persona/founder-01.png',
  '/brand/ai-generated/founder-persona/founder-02.png',
  '/brand/ai-generated/founder-persona/founder-03.png',
  // ★ Higgsfield 수강생 페르소나 (시술 받는 순간 · 얼굴 익명 요소 포함)
  '/brand/ai-generated/client/client-01.png',
  '/brand/ai-generated/client/client-02.png',
  '/brand/ai-generated/client/client-03.png',
  '/brand/ai-generated/client/client-04.png',
  // K-idol Higgsfield (2026-07-20 · 홈피 히어로 3장)
  '/hero-mood/hero-portrait-E.png',
  '/hero-mood/hero-portrait-F.png',
  '/hero-mood/hero-portrait-G.png',
  // Higgsfield 매크로 클로즈업 (2026-07-21 · 극사실눈썹 매크로 4장)
  '/brand/ai-generated/macro/macro-01.png',
  '/brand/ai-generated/macro/macro-02.png',
  '/brand/ai-generated/macro/macro-03.png',
  '/brand/ai-generated/macro/macro-04.png',
  // 완성 카드 (IG-69 · 자체 텍스트)
  '/brand/ads/ig-69/01-hero-portrait.png',
  '/brand/ads/ig-69/03-curriculum.png',
  '/brand/ads/ig-69/04-cta-typo.png',
  // 원장 실사 시술 사진 (텍스트 X)
  '/brand/uploads/IMG_4668-2026-07-18T11-23-14.JPG',
  '/brand/uploads/IMG_4672-2026-07-18T11-25-22.JPG',
  '/brand/uploads/IMG_0517-2026-07-20T05-55-09.jpg',
];
export const PRODUCT_IMAGE_POOL = [
  // Higgsfield 매크로 클로즈업 (2026-07-21 · 매크로·product 우선)
  '/brand/ai-generated/macro/macro-01.png',
  '/brand/ai-generated/macro/macro-02.png',
  '/brand/ai-generated/macro/macro-03.png',
  '/brand/ai-generated/macro/macro-04.png',
  // Higgsfield 시술 손·펜슬 (2026-07-21 · 「시술 전 펜슬 설계」 시그니처)
  '/brand/ai-generated/hand-pencil/hand-01.png',
  '/brand/ai-generated/hand-pencil/hand-02.png',
  '/brand/ai-generated/hand-pencil/hand-03.png',
  '/brand/ai-generated/hand-pencil/hand-04.png',
  // Higgsfield Before/After (2026-07-21 · 변화 신뢰도)
  '/brand/ai-generated/before-after/ba-01.png',
  '/brand/ai-generated/before-after/ba-02.png',
  '/brand/ai-generated/before-after/ba-03.png',
  // 원장 실사 (fallback)
  '/brand/uploads/IMG_4668-2026-07-18T11-23-14.JPG',
  '/brand/uploads/IMG_4672-2026-07-18T11-25-22.JPG',
  '/brand/uploads/IMG_0517-2026-07-20T05-55-09.jpg',
];

function pickPoolImage(pool: readonly string[], seedStr: string, offset: number): string {
  let h = 5381;
  for (let i = 0; i < seedStr.length; i++) h = ((h << 5) + h + seedStr.charCodeAt(i)) & 0x7fffffff;
  return pool[(h + offset) % pool.length];
}

// AI 응답 or 기존 하드코딩 이미지를 pool 로테이션으로 대체
function assignImageIfNeeded(slide: Slide, purpose: string, index: number): Slide {
  const HARDCODED_FALLBACKS = ['/brand/founder-key-visual-2026-07-17.png'];
  const s = slide as Slide & { imageSrc?: string; imageAlt?: string };
  switch (s.kind) {
    case 'cover-founder': {
      if (!s.imageSrc || HARDCODED_FALLBACKS.includes(s.imageSrc)) {
        s.imageSrc = pickPoolImage(FOUNDER_IMAGE_POOL, purpose, index);
        s.imageAlt = s.imageAlt || 'ARTbrows 원장 장미지';
      }
      break;
    }
    case 'portrait-frame': {
      if (!s.imageSrc) {
        s.imageSrc = pickPoolImage(PORTRAIT_IMAGE_POOL, purpose, index);
        s.imageAlt = s.imageAlt || '극사실눈썹 시술 결과';
      }
      break;
    }
    case 'product-hero': {
      if (!s.imageSrc) {
        s.imageSrc = pickPoolImage(PRODUCT_IMAGE_POOL, purpose, index);
        s.imageAlt = s.imageAlt || 'ARTbrows 시술 결과 · 극사실눈썹';
      }
      break;
    }
  }
  return s;
}

// 커버 kind 옵션 (첫 슬라이드용 · cover-founder 강제 폐지 · 2026-07-20)
const COVER_KIND_OPTIONS: LayoutKind[] = [
  'cover-founder', 'product-hero', 'quote-bold', 'portrait-frame', 'number-big',
];
// 마무리 kind 옵션 (마지막 슬라이드용 · closing-cta 강제 폐지)
const CLOSING_KIND_OPTIONS: LayoutKind[] = [
  'closing-cta', 'signature-style', 'quote-bold', 'price-table',
];
// 이미지 필수 kind (다양한 이미지 슬라이드 삽입 유도)
const IMAGE_KINDS: LayoutKind[] = ['cover-founder', 'portrait-frame', 'product-hero'];

// purpose 해시로 시퀀스 시작점 · 커버·마무리 kind 선택 (프로젝트마다 달라지도록)
function purposeHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) & 0x7fffffff;
  return h;
}

export async function runStylist(input: GenerateInput, trendSummary: string, model: ModelId): Promise<SlideSkeleton[]> {
  const presetHint = presetToPromptHint(input.stylePreset ?? DEFAULT_STYLE_PRESET, input.customBrief);
  const seed = purposeHash(input.purpose);
  const preferredCover = COVER_KIND_OPTIONS[seed % COVER_KIND_OPTIONS.length];
  const preferredClosing = CLOSING_KIND_OPTIONS[(seed >> 3) % CLOSING_KIND_OPTIONS.length];

  // 2026-07-20 · Custom 아닌 프리셋이면 recommendedKinds 우선 사용 (AI 호출 skip)
  // 2026-07-27 · getPreset() 로 폐기 key → 정본 fallback 자동
  const preset = getPreset(input.stylePreset);
  if (preset && !preset.isCustom && preset.recommendedKinds.length > 0) {
    const kinds = getRecommendedKinds(input.stylePreset, input.slideCount);
    return kinds.map((kind, i) => ({
      kind,
      category: PALETTE_KEYS[i % PALETTE_KEYS.length],
      rationale: `${preset.label} 스타일 · 추천 시퀀스 ${i + 1}/${kinds.length}`,
    }));
  }

  const prompt = `
목적: "${input.purpose}"
슬라이드 수: ${input.slideCount}장

${presetHint}

트렌드 요약: ${trendSummary}

가능한 레이아웃 (${LAYOUT_KINDS.length}종): ${LAYOUT_KINDS.join(', ')}
가능한 카테고리 (6톤): ${PALETTE_KEYS.join(', ')}
카테고리 힌트: ${JSON.stringify(CATEGORY_PROMPT_HINTS)}

★★★ 다양성 필수 규칙 (2026-07-20 대표님·본부장 지시):
1. **각 슬라이드 kind 는 반드시 다르게** — 동일 kind 반복 금지
2. **12종 kind 골고루 사용** — 매번 같은 조합 X · 특히 이미지 kind (cover-founder · portrait-frame · product-hero) 중 **최소 2개 포함**
3. **커버 kind 다양화** — 이번 프로젝트 커버 권장 = "${preferredCover}" (또는 다른 후보: ${COVER_KIND_OPTIONS.filter(k => k !== preferredCover).join(', ')})
4. **마무리 kind 다양화** — 이번 프로젝트 마무리 권장 = "${preferredClosing}" (또는: ${CLOSING_KIND_OPTIONS.filter(k => k !== preferredClosing).join(', ')})
5. **자주 안 쓰이는 kind 활용** — icon-duo · icon-trio · portrait-frame · product-hero 를 적극 넣어 다양성 확보
6. **카테고리 6톤 순환** — 편중 X · 팔레트 다양성
7. 각 결정에 rationale (왜) 1문장 첨부

JSON 스키마 (배열, 길이 = ${input.slideCount}):
[
  { "kind": "${preferredCover}", "category": "founder", "rationale": "..." },
  { "kind": "...", "category": "...", "rationale": "..." },
  ...
  { "kind": "${preferredClosing}", "category": "...", "rationale": "..." }
]
`.trim();

  const arr = await chatJson<SlideSkeleton[]>(model, prompt, { system: ARTBROWS_BRAND_SYSTEM, temperature: 0.85 });
  // 안전장치: 스키마 검증 + 잘림·중복 보정
  const cleaned: SlideSkeleton[] = [];
  const usedKinds = new Set<LayoutKind>();
  for (const s of arr.slice(0, input.slideCount)) {
    const kind = LAYOUT_KINDS.includes(s.kind) ? s.kind : 'number-big';
    const category = PALETTE_KEYS.includes(s.category) ? s.category : 'founder';
    // 중복 kind 발견 시 남은 것 중에서 선택
    let finalKind = kind;
    if (usedKinds.has(finalKind)) {
      finalKind = LAYOUT_KINDS.find((k) => !usedKinds.has(k)) ?? kind;
    }
    usedKinds.add(finalKind);
    cleaned.push({ kind: finalKind, category, rationale: s.rationale ?? '' });
  }
  // 부족하면 채움
  while (cleaned.length < input.slideCount) {
    const nextKind = LAYOUT_KINDS.find((k) => !usedKinds.has(k)) ?? 'number-big';
    usedKinds.add(nextKind);
    cleaned.push({ kind: nextKind, category: PALETTE_KEYS[cleaned.length % 6], rationale: 'auto-fill' });
  }
  // 이미지 kind 최소 2개 강제 (없거나 부족하면 non-이미지 kind 를 이미지 kind 로 교체)
  const imageCount = cleaned.filter((s) => IMAGE_KINDS.includes(s.kind)).length;
  if (imageCount < 2 && input.slideCount >= 4) {
    const needMore = 2 - imageCount;
    const missingImgKinds = IMAGE_KINDS.filter((k) => !usedKinds.has(k));
    const replaceableIdx = cleaned
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => !IMAGE_KINDS.includes(s.kind) && s.kind !== 'closing-cta' && s.kind !== 'cover-founder')
      .slice(0, needMore);
    for (let j = 0; j < replaceableIdx.length && j < missingImgKinds.length; j++) {
      const target = replaceableIdx[j];
      const newKind = missingImgKinds[j];
      usedKinds.delete(target.s.kind);
      usedKinds.add(newKind);
      cleaned[target.i] = { ...target.s, kind: newKind, rationale: (target.s.rationale || '') + ' [이미지 다양성 auto-inject]' };
    }
  }
  return cleaned;
}

// ─────────────────── 4. copywriter (선택된 모델별 슬라이드 카피) ───────────────────
export async function runCopywriter(
  input: GenerateInput,
  skeleton: SlideSkeleton,
  index: number,
  totalSlides: number,
  trendHints: string,
  model: ModelId,
): Promise<SlideCopyVariant> {
  const kindSchema = getKindSchema(skeleton.kind);
  const presetHint = presetToPromptHint(input.stylePreset ?? DEFAULT_STYLE_PRESET, input.customBrief);
  const copyToneHint = skeleton.copyTone && skeleton.copyTone !== 'auto'
    ? `\n🎯 카피 톤 (사용자 지정): ${COPY_TONE_META[skeleton.copyTone].label} — ${COPY_TONE_META[skeleton.copyTone].hint}`
    : '';
  const imageHintNote = skeleton.imageSrcHint
    ? `\n🖼 이미지 (사용자 지정): ${skeleton.imageSrcHint} — imageSrc 필드에 이 경로 그대로 사용`
    : '';
  const prompt = `
목적: "${input.purpose}"
언어: ${input.lang} (${LANG_TONE_HINTS[input.lang]})
전체 슬라이드: ${totalSlides}장 중 ${index + 1}번째
이 슬라이드 kind: ${skeleton.kind}
이 슬라이드 category: ${skeleton.category} (${CATEGORY_PROMPT_HINTS[skeleton.category]})
왜 이 조합: ${skeleton.rationale}${copyToneHint}${imageHintNote}

${presetHint}

트렌드 힌트: ${trendHints}

원장님 정본 톤 준수 · 필드 스키마:
${JSON.stringify(kindSchema, null, 2)}

응답은 kind·category 필드 포함한 완전한 Slide JSON 오브젝트 하나만.
`.trim();

  const raw = await chatJson<Slide>(model, prompt, { system: ARTBROWS_BRAND_SYSTEM, temperature: 0.85 });
  // 1. kind·category 강제 (AI 가 바꿔치는 경우 방어)
  const forced: Slide = { ...raw, kind: skeleton.kind, category: skeleton.category } as Slide;
  // 2. sanitize (AI 가 <gold>xxx</gold> 같은 태그 삽입 시 제거 · highlight 자동 추출)
  const safe = sanitizeSlide(forced);
  // 3. 이미지 우선순위: 사용자 지정 > AI 응답 > pool 로테이션
  let withImage = assignImageIfNeeded(safe, input.purpose, index);
  if (skeleton.imageSrcHint && 'imageSrc' in (withImage as unknown as Record<string, unknown>)) {
    (withImage as Slide & { imageSrc?: string; imageAlt?: string }).imageSrc = skeleton.imageSrcHint;
  }
  return { source: model, slide: withImage };
}

// 각 kind 별 필요 필드 스키마 (Slide 타입 참조 · 프롬프트에 삽입)
function getKindSchema(kind: LayoutKind): Record<string, string> {
  const base = { kind: `"${kind}"`, category: '"treatment|founder|review|classroom|detail|reels"' };
  switch (kind) {
    case 'cover-founder':   return { ...base, eyebrow: 'string (골드 라벨)', headline: 'string (명조 헤드 · \\n 줄바꿈)', highlight: 'string (골드 강조)', quote: 'string (인용 · optional)', quoteBy: 'string (예: 장미지)', imageSrc: 'string · 비워두세요 (서버가 pool 에서 자동 rotate)', imageAlt: 'string' };
    case 'number-big':      return { ...base, number: 'string (예: 01)', eyebrow: 'string', headline: 'string', body: 'string' };
    case 'icon-duo':        return { ...base, eyebrow: 'string', headline: 'string', items: '[{icon, title, caption} x 2]' };
    case 'icon-trio':       return { ...base, eyebrow: 'string', headline: 'string', items: '[{icon, title, caption} x 3]' };
    case 'checklist':       return { ...base, eyebrow: 'string', headline: 'string', items: '[string x 5~10]' };
    case 'portrait-frame':  return { ...base, imageSrc: 'string · 비워두세요 (서버가 pool 에서 자동 rotate)', imageAlt: 'string', eyebrow: 'string (optional)', headline: 'string (optional)', caption: 'string (optional)' };
    case 'product-hero':    return { ...base, imageSrc: 'string · 비워두세요 (서버가 pool 에서 자동 rotate)', imageAlt: 'string', overlayLabel: 'string (예: HYPER REALISTIC EYEBROW)', eyebrow: 'string', headline: 'string', caption: 'string' };
    case 'quote-bold':      return { ...base, eyebrow: 'string', quote: 'string (\\n 줄바꿈 가능)', by: 'string (선택)' };
    case 'signature-style': return { ...base, concept: '{title, formula: string[], result, caption?}', style: '{title, items: [{label, desc}]}' };
    case 'curriculum-row':  return { ...base, eyebrow: 'string', headline: 'string', rows: '[{num, title, time?, teacher?} x 3~6]' };
    case 'price-table':     return { ...base, eyebrow: 'string', headline: 'string', items: '[{name, price, conditions?: string[]}]', footnote: 'string' };
    case 'closing-cta':     return { ...base, headline: 'string', highlight: 'string', body: 'string', signature: 'string (예: Miji Jang)', cta: 'string', ctaHref: 'string (예: /enroll)' };
    // Magazine 9종 (2026-07-20 정본)
    case 'magazine-cover':      return { ...base, brand: 'string (예: ARTBROWS)', volume: 'string (예: VOL 15 · 2026.07)', headline: 'string · 대형 세리프 대문자 · \\n 줄바꿈', subheadline: 'string · 이탤릭 서브', imageSrc: 'string · 비워두세요 (pool auto)', imageAlt: 'string', signatureLabel: 'string (예: MIJI JANG · SEONLEUNG ATELIER)' };
    case 'hero-portrait':       return { ...base, imageSrc: 'string · 비워두세요 (IG-69 완성 카드는 통짜 표시)', imageAlt: 'string', bottomLabel: 'string · 얇은 골드 라벨', cornerBadge: 'string (optional · 우상단)' };
    case 'macro-close-up':      return { ...base, imageSrc: 'string · 순수 시술 사진', imageAlt: 'string', overlayLabel: 'string (예: HYPER REAL)', quote: 'string · 우측 미니 인용', by: 'string · 서명 (예: 장미지)' };
    case 'before-after-split':  return { ...base, orientation: '"horizontal" | "vertical"', beforeSrc: 'string · 동일 인물 시술 전', beforeAlt: 'string', afterSrc: 'string · 동일 인물 시술 후', afterAlt: 'string', beforeLabel: 'string (BEFORE)', afterLabel: 'string (AFTER)', bottomStrip: 'string · 하단 얇은 스트립' };
    case 'pullquote-editorial': return { ...base, quote: 'string · 대형 세리프 이탤릭 · \\n 가능', signature: 'string (예: Miji Jang)', signatureRole: 'string (예: ARTBROWS FOUNDER · 20 YEARS)' };
    case 'case-study-detail':   return { ...base, eyebrow: 'string', leftTitle: 'string (예: CURRICULUM)', leftItems: '[{num, text, sub}]', rightHeadline: 'string · 대형 세리프 · \\n', rightPrice: 'string (예: 660만원)', rightFootnote: 'string · 얇은 부기' };
    case 'atelier-scene':       return { ...base, imageSrc: 'string · 씬 사진', imageAlt: 'string', eyebrow: 'string (선택)', headline: 'string (선택)', bottomColumns: '[{label, value} x 3]' };
    case 'cta-editorial':       return { ...base, headline: 'string · 대형 세리프 · \\n', highlight: 'string · 골드 강조 단어', signature: 'string (Miji Jang)', cta: 'string (상담 신청)', ctaHref: 'string (/enroll)', subline: 'string · 이탤릭 서브' };
    case 'umbrella-4cats':      return { ...base, eyebrow: 'string', headline: 'string (극사실 · 4대 카테고리)', killer: 'string · 원장 원문', cats: '[{key, label, badge, active} x 4]', footnote: 'string (선택)' };
  }
}
