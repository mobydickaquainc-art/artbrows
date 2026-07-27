// 카드뉴스 슬라이드 레이아웃 타입 정의 (2026-07-17 · 본부장 피드백 반영)
// 각 슬라이드는 개별 레이아웃 · 톤은 원장님 정본 유지

export type LayoutKind =
  // ── Legacy 12종 (2026-07-17 참고용 · 하위호환 · 자동 렌더 계속) ──
  | 'cover-founder'
  | 'number-big'
  | 'icon-duo'
  | 'icon-trio'
  | 'checklist'
  | 'portrait-frame'
  | 'product-hero'
  | 'quote-bold'
  | 'signature-style'
  | 'curriculum-row'
  | 'price-table'
  | 'closing-cta'
  // ── Magazine 9종 (2026-07-20 정본 · Vogue Beauty 톤 · Maison Noir) ──
  | 'magazine-cover'
  | 'hero-portrait'
  | 'macro-close-up'
  | 'before-after-split'
  | 'pullquote-editorial'
  | 'case-study-detail'
  | 'atelier-scene'
  | 'cta-editorial'
  | 'umbrella-4cats'
  // ── Reimport OCR overlay (2026-07-27 · 대표님 지시 A안) ──
  | 'image-with-overlay';

import type { PaletteKey } from '@/lib/artbrows/tokens';

export interface SlideBase {
  kind: LayoutKind;
  /**
   * 원장님 통합 브랜드 가이드 6톤 팔레트 카테고리
   * treatment · founder · review · classroom · detail · reels
   * 인스타 피드 3열 반복 시 이 카테고리를 순환하면 브랜드 룩 유지
   */
  category: PaletteKey;
}

// 01. Cover-Founder — 시리즈 커버 · 큰 인물 + 대형 명조 헤드 + 인용문
export interface CoverFounderSlide extends SlideBase {
  kind: 'cover-founder';
  eyebrow: string;              // 골드 얇은 대문자 라벨 (예: "14TH ENROLLMENT")
  headline: string;             // 큰 명조 헤드 (예: "14기 이지클래스 모집")
  highlight?: string;           // headline 중 골드 강조할 부분
  quote?: string;               // 인용 (예: "눈썹은 기술이 아닌 예술이며, 철학입니다.")
  quoteBy?: string;             // 예: "장미지"
  imageSrc?: string;            // 인물 사진 (원장님·연구원)
  imageAlt?: string;
}

// 02. Number-Big — 스텝/회차 소개
export interface NumberBigSlide extends SlideBase {
  kind: 'number-big';
  number: string;               // 예: "01" · "STEP 1"
  eyebrow?: string;             // 예: "CURRICULUM"
  headline: string;             // 명조 헤드
  body?: string;                // 서브 본문
}

// 03. Icon-Duo — 2가지 특징 비교
export interface IconDuoSlide extends SlideBase {
  kind: 'icon-duo';
  eyebrow?: string;
  headline: string;
  items: [IconItem, IconItem];
}

// 04. Icon-Trio — 3가지 원칙
export interface IconTrioSlide extends SlideBase {
  kind: 'icon-trio';
  eyebrow?: string;
  headline: string;
  items: [IconItem, IconItem, IconItem];
}

export interface IconItem {
  icon?: string;                // 이모지 or SVG path key
  imageSrc?: string;            // 아이콘 대신 사진 가능
  title: string;
  caption?: string;
}

// 05. Checklist — 조건·혜택·체크리스트
export interface ChecklistSlide extends SlideBase {
  kind: 'checklist';
  eyebrow?: string;
  headline: string;
  items: string[];              // 5~10개 항목
}

// 06. Portrait-Frame — 인물 강조
export interface PortraitFrameSlide extends SlideBase {
  kind: 'portrait-frame';
  imageSrc: string;
  imageAlt?: string;
  eyebrow?: string;             // 오버레이 골드 라벨
  headline?: string;            // 오버레이 헤드
  caption?: string;             // 하단 캡션
}

// 07. Product-Hero — 시술 결과 · 눈썹 클로즈업
export interface ProductHeroSlide extends SlideBase {
  kind: 'product-hero';
  imageSrc: string;
  imageAlt?: string;
  overlayLabel?: string;        // 예: "HYPER REALISTIC EYEBROW"
  eyebrow?: string;             // 골드 라벨
  headline?: string;
  caption?: string;
}

// 08. Quote-Bold — 원장님 어록 · 인용
export interface QuoteBoldSlide extends SlideBase {
  kind: 'quote-bold';
  quote: string;                // 큰 세리프 이탤릭
  by?: string;                  // "— 장미지"
  eyebrow?: string;
}

// 09. Signature-Style — Brand Concept · Signature Style
export interface SignatureStyleSlide extends SlideBase {
  kind: 'signature-style';
  concept: {                    // 좌 딥 블랙 블록
    title: string;              // "BRAND CONCEPT"
    formula: string[];          // ["예술 Art", "기술 Technique", "철학 Philosophy"]
    result: string;             // "= 극사실눈썹"
    caption?: string;
  };
  style: {                      // 우 아이보리 블록
    title: string;              // "SIGNATURE STYLE"
    items: { label: string; desc: string }[];  // HAIR/OUTFIT/MAKEUP/ACCESSORY
  };
}

// 10. Curriculum-Row — 커리큘럼 회차별
export interface CurriculumRowSlide extends SlideBase {
  kind: 'curriculum-row';
  eyebrow?: string;
  headline: string;
  rows: {
    num: string;                // "01" · "1회차"
    title: string;
    time?: string;              // "3시간"
    teacher?: string;           // "장미지 원장 직강"
  }[];
}

// 11. Price-Table — 시술가격·수강료
export interface PriceTableSlide extends SlideBase {
  kind: 'price-table';
  eyebrow?: string;
  headline: string;
  items: {
    name: string;
    price: string;              // "69만원"
    conditions?: string[];      // ["평생 수강", "일요일반"]
  }[];
  footnote?: string;
}

// 12. Closing-CTA — 마무리 · 상담 유도
export interface ClosingCTASlide extends SlideBase {
  kind: 'closing-cta';
  headline: string;             // 큰 헤드
  highlight?: string;           // 골드 강조 부분
  body?: string;
  signature?: string;           // 필기체 시그니처 (예: "Miji Jang")
  cta?: string;                 // 버튼 텍스트 (예: "상담 신청")
  ctaHref?: string;
}

// ═══════════════════════ Magazine 9종 (2026-07-20 정본) ═══════════════════════

// M1. Magazine-Cover — Vogue Beauty 커버 · 대형 세리프 + 원장 배경 이미지
export interface MagazineCoverSlide extends SlideBase {
  kind: 'magazine-cover';
  volume?: string;             // "VOL 15" · "ISSUE 26.07"
  brand?: string;              // "ARTBROWS" (default)
  headline: string;            // 대형 세리프 (예: "ARTIST OF THE HYPER REAL BROW")
  subheadline?: string;        // 하위 세리프 부제
  imageSrc?: string;           // 배경 인물 (하단 그라디언트 페이드)
  imageAlt?: string;
  signatureLabel?: string;     // 하단 얇은 골드 라벨 (예: "MIJI JANG · 2026")
}

// M2. Hero-Portrait — 화보 인물 전면 · 오버레이 최소 텍스트
export interface HeroPortraitSlide extends SlideBase {
  kind: 'hero-portrait';
  imageSrc: string;
  imageAlt?: string;
  bottomLabel?: string;        // 하단 얇은 골드 라벨 (예: "털 같은 눈썹")
  cornerBadge?: string;        // 우상단 배지 (선택 · 예: "MIJI JANG")
}

// M3. Macro-Close-Up — 매크로 클로즈업 + 우측 미니 인용
export interface MacroCloseUpSlide extends SlideBase {
  kind: 'macro-close-up';
  imageSrc: string;            // 매크로 이미지
  imageAlt?: string;
  quote?: string;              // 우측 미니 세리프 인용
  by?: string;                 // 서명
  overlayLabel?: string;       // 좌상단 얇은 라벨 (예: "HYPER REAL")
}

// M4. Before-After-Split — 좌우 or 상하 분할
export interface BeforeAfterSplitSlide extends SlideBase {
  kind: 'before-after-split';
  orientation?: 'horizontal' | 'vertical';  // default horizontal (좌우)
  beforeSrc: string;
  beforeAlt?: string;
  afterSrc: string;
  afterAlt?: string;
  beforeLabel?: string;        // "BEFORE"
  afterLabel?: string;         // "AFTER"
  bottomStrip?: string;        // 하단 얇은 정보 스트립 (예: "클레임 거의 0 · 30년 노하우")
}

// M5. Pullquote-Editorial — 매거진 pullquote (대형 세리프 이탤릭 + 필기체)
export interface PullquoteEditorialSlide extends SlideBase {
  kind: 'pullquote-editorial';
  quote: string;               // 대형 세리프 이탤릭
  signature?: string;          // 필기체 서명 (예: "Miji Jang")
  signatureRole?: string;      // 하단 라벨 (예: "ARTBROWS FOUNDER")
}

// M6. Case-Study-Detail — 커리큘럼·가격·조건 통합 케이스 스터디
export interface CaseStudyDetailSlide extends SlideBase {
  kind: 'case-study-detail';
  eyebrow?: string;
  leftTitle?: string;          // 좌측 섹션 제목 (예: "CURRICULUM")
  leftItems: { num?: string; text: string; sub?: string }[];  // 좌측 정보 리스트
  rightHeadline: string;       // 우측 대형 세리프 요약
  rightPrice?: string;         // 우측 가격 (예: "660만원")
  rightFootnote?: string;      // 우측 하단 얇은 부기 (예: "재수강 990")
}

// M7. Atelier-Scene — 아틀리에 씬 + 하단 3열 정보 스트립
export interface AtelierSceneSlide extends SlideBase {
  kind: 'atelier-scene';
  imageSrc: string;
  imageAlt?: string;
  eyebrow?: string;
  headline?: string;           // 이미지 하단 오버레이 헤드 (선택)
  bottomColumns: { label: string; value: string }[];  // 하단 3열 (선릉·경력·수강)
}

// M8. CTA-Editorial — 매거진 CTA (얇은 골드 라인 + 세리프 + 필기체)
export interface CTAEditorialSlide extends SlideBase {
  kind: 'cta-editorial';
  headline: string;            // 대형 세리프 헤드
  highlight?: string;          // 골드 강조 단어
  signature?: string;          // 필기체 서명
  cta: string;                 // 얇은 CTA 텍스트 (예: "교육 상담 신청 →")
  ctaHref?: string;
  subline?: string;            // 얇은 서브 (예: "선릉 본원 · 1:1 코칭")
}

// M9. Umbrella-4Cats — 극사실 4대 카테고리 우산 브랜드 (Coming Soon)
export interface Umbrella4CatsSlide extends SlideBase {
  kind: 'umbrella-4cats';
  eyebrow?: string;            // 예: "極写実 · THE HYPERREAL UNIVERSE"
  headline: string;            // 예: "극사실 · 4대 카테고리"
  killer?: string;             // 원장 원문 (예: "진짜 머리카락이야 · 진짜 눈썹이야...")
  cats: [
    { key: string; label: string; badge: string; active: boolean },
    { key: string; label: string; badge: string; active: boolean },
    { key: string; label: string; badge: string; active: boolean },
    { key: string; label: string; badge: string; active: boolean }
  ];
  footnote?: string;
}

// M10. Image-With-Overlay — 기존 카드뉴스 이미지 원본 + OCR 로 detect 한 텍스트를
// 편집 가능한 오버레이 (반투명 마스크 + 새 텍스트) 로 덮어 재편집 (2026-07-27)
export interface TextOverlay {
  text: string;                 // 편집 가능한 문장 (원장님이 수정)
  original?: string;            // 원본 문장 (참고용 · OCR 결과)
  x: number; y: number;         // 원본 이미지 기준 % (0~100)
  w: number; h: number;         // % (0~100)
  fontSizePct?: number;         // 원본 이미지 height 대비 % (예: 6 = 이미지 6% 높이)
  color?: string;               // 원본에 근접한 텍스트 색 (예: "#FFFFFF")
  bgColor?: string;             // 원본 텍스트 지우기용 마스크 배경 (예: "rgba(0,0,0,.6)")
  // 2026-07-27 · 대표님 지시 「뒤에를 없애고 스타일을 그대로 카피」
  // cover = 오버레이 뒤 원본 픽셀을 덮는 solid 색 (Gemini 감지 surroundingDominantColor 기반)
  // 없으면 원본 텍스트가 반투명 bgColor 뒤로 비침. 있으면 완전 가림.
  cover?: string;               // 예: "#3A2E26" (opaque HEX · bbox 전체를 solid 로 먼저 채움)
  weight?: 'normal' | 'medium' | 'bold' | 'black';
  align?: 'left' | 'center' | 'right';
  // 폰트 프리셋 · sans=한글고딕(Noto) · serif=나눔명조 · display=Playfair(라틴)
  // · brush=나눔펜(필기) · heavy=Black Han Sans(한글 임팩트) · serif-latin=Cormorant(라틴 세리프)
  fontFamily?: 'serif' | 'sans' | 'display' | 'brush' | 'heavy' | 'serif-latin';
  padding?: number;             // 마스크 패딩 (px)
}
export interface ImageWithOverlaySlide extends SlideBase {
  kind: 'image-with-overlay';
  imageSrc: string;
  imageAlt?: string;
  overlays: TextOverlay[];      // 원장님이 직접 배치한 오버레이 배열 (초기 = 빈 배열)
  copyPalette?: CopyPaletteItem[];  // AI 제안 카피 후보 (배치 대기 · 편집에서 클릭해 사용)
  ocrProcessed?: boolean;       // OCR 처리 완료 여부
  bottomLabel?: string;         // 하단 얇은 골드 라벨 (선택)
}

/** AI 제안 카피 팔레트 항목 — 원본 위에 자동 덮지 않음. 편집기에서 사용자가 클릭해 배치.
 * 「원본 스타일 그대로 배치」 를 위해 OCR 이 detect 한 원본의 위치·크기·색·배경·정렬을 hint 로 보존한다.
 */
export interface CopyPaletteItem {
  text: string;                 // 제안 카피 (편집 가능 · 재작성됨)
  original?: string;            // OCR 원본 문장 (참고용)
  role?: 'headline' | 'subheadline' | 'label' | 'quote' | 'cta' | 'body';
  // 「원본 스타일 그대로 배치」 hint (있으면 makeOverlayFromPalette 가 그대로 사용)
  hintX?: number;               // 0~100 %
  hintY?: number;
  hintW?: number;
  hintH?: number;
  hintFontSizePct?: number;
  hintColor?: string;
  hintBgColor?: string;
  hintAlign?: 'left' | 'center' | 'right';
  hintFontFamily?: 'serif' | 'sans' | 'display' | 'brush' | 'heavy' | 'serif-latin';
  hintWeight?: 'normal' | 'medium' | 'bold' | 'black';
}

export type Slide =
  // Legacy 12종
  | CoverFounderSlide
  | NumberBigSlide
  | IconDuoSlide
  | IconTrioSlide
  | ChecklistSlide
  | PortraitFrameSlide
  | ProductHeroSlide
  | QuoteBoldSlide
  | SignatureStyleSlide
  | CurriculumRowSlide
  | PriceTableSlide
  | ClosingCTASlide
  // Magazine 9종
  | MagazineCoverSlide
  | HeroPortraitSlide
  | MacroCloseUpSlide
  | BeforeAfterSplitSlide
  | PullquoteEditorialSlide
  | CaseStudyDetailSlide
  | AtelierSceneSlide
  | CTAEditorialSlide
  | Umbrella4CatsSlide
  // Reimport OCR overlay
  | ImageWithOverlaySlide;

export interface CardnewsSet {
  id: string;                   // 예: "14th-easy-class"
  title: string;                // 예: "14기 이지클래스 모집"
  createdAt: string;            // ISO date
  slides: Slide[];              // 원하는 개수 · 순서 · 조합 자유
}

// ── 다국어 지원 (2026-07-17 · 원장님 지시 「영문/중문 추가」) ──
// 한 프로젝트 = 3 언어 (한국어·영어·중국어) 각각 별도 슬라이드 세트

export const LANGS = ['ko', 'en', 'zh'] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_LABEL: Record<Lang, string> = {
  ko: 'KO',
  en: 'EN',
  zh: '中',
};
export const LANG_FULL: Record<Lang, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
};

// 언어별 콘텐츠 (제목·슬라이드 각각 언어별)
export interface LangContent {
  title: string;
  slides: Slide[];
}

// ── 인스타 aspect ratio 프리셋 (2026-07-20 · 원장님 「인스타 카드뉴스 플랫폼」 요구) ──
export type InstagramAspect = 'square' | 'portrait' | 'story';
export const ASPECT_META: Record<InstagramAspect, {
  label: string;
  ratio: string;        // CSS aspect-ratio
  cssClass: string;     // .aspect-<key>
  size: string;         // 실제 픽셀
  use: string;
}> = {
  square:   { label: '정사각 · 1:1',       ratio: '1 / 1',  cssClass: 'aspect-square',   size: '1080×1080', use: '피드 · 기본 캐러셀' },
  portrait: { label: '세로 · 4:5 (권장)',  ratio: '4 / 5',  cssClass: 'aspect-portrait', size: '1080×1350', use: '피드 · 몰입 캐러셀 · 인스타 최적' },
  story:    { label: '스토리·릴스 · 9:16', ratio: '9 / 16', cssClass: 'aspect-story',    size: '1080×1920', use: '스토리 · 릴스 커버 · 세로 광고' },
};
export const DEFAULT_ASPECT: InstagramAspect = 'portrait';
