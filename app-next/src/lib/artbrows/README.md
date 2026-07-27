# artbrows style · 브랜드 디자인 시스템

> **최종 결정권자: 장미지 원장님**
> 이 모듈은 원장님이 지시한 브랜드 방향을 코드로 **정형화**한 것이다.
> 이 폴더의 값을 임의로 변경하지 않는다. 원장님 승인 후 갱신.

## 정본 (2026-07-17 확정)

### 톤 원칙 (원장님 지시)
1. **모노톤 · 고급** — 딥 블랙 + 골드 + 아이보리 3톤 (원장님 GPT 브랜드 이미지 · 07-17 오전 10:53)
2. **원색 계열 금지** — "너무 원색계열은 피하구요" (원장님 카톡 07-17 오전 11:42)
3. **발랄 X · 젊음 X** → 프로페셔널 · 커리어 · 오피스 톤 (원장님 카톡 07-17 오전 11:11)
4. **해외 고려** — 한·중·미 통용될 수 있는 톤 (원장님 카톡 07-17 오전 11:11)
5. **살구핑크 계열 폐기** — 2026-07-16 이전 「크림 살구 / 아트브로우 달력톤」은 폐기 대상 (외부 홈피 방향과 상충)

### 색 정본 → `tokens.ts` · `tokens.css` 참조

**베이스 (홈페이지 UI · 대부분의 화면)**
- 배경: `--ab-black #0B0907`
- 액센트: `--ab-gold #C9A66B`
- 대비 블록: `--ab-ivory #F5EEE0`
- 텍스트: `--ab-text-soft` · `--ab-ink` · `--ab-ink-muted`

**6톤 카테고리 팔레트 · 원장님 통합 브랜드 가이드 정본 (2026-07-17)**

원장님이 GPT 로 만든 「artbrow-integrated-guide 2026」 → 인스타 피드 3열 반복 그리드:
| 카테고리 | 컬러 (bg / fg) | 용도 |
|----------|----------------|------|
| **treatment** (`--ab-cat-treatment-*`) | `#3A3838` / `#F5EEE0` | 시술 결과 Before/After |
| **founder** (`--ab-cat-founder-*`) | `#B8AFA2` / `#1F1817` | 원장 컷 · 브랜드 무드 |
| **review** (`--ab-cat-review-*`) | `#7A3538` / `#F5EEE0` | 고객 후기 텍스트카드 |
| **classroom** (`--ab-cat-classroom-*`) | `#4E5A3E` / `#F5EEE0` | 교육 현장 클래스컷 |
| **detail** (`--ab-cat-detail-*`) | `#E8E1D5` / `#1F1817` | 디테일 클로즈업 눈썹 |
| **reels** (`--ab-cat-reels-*`) | `#5A5652` / `#F5EEE0` | 릴스 썸네일 |

유틸리티 클래스: `.ab-cat-treatment`, `.ab-cat-founder`, `.ab-cat-review`, `.ab-cat-classroom`, `.ab-cat-detail`, `.ab-cat-reels` (bg+fg 쌍 자동 적용)

TS 참조: `import { artbrowsPalette, PaletteKey } from '@/lib/artbrows/tokens';`

원장님 원문: **"이 6컷 패턴을 반복하면 톤이 흔들리지 않고 '브랜드 룩'이 유지됩니다."**

### 콘텐츠 필러 · 주간 배분 정본 (원장님 통합 브랜드 가이드)

TS: `artbrowsContentPillars`

- Before/After **40%**
- 교육/강의 **20%**
- 브랜드 무드 (원장 컷) **15%**
- 고객 후기 **15%**
- 릴스/트렌드 **10%**

### 비주얼 통일 규칙 (원장님 통합 브랜드 가이드)

TS: `artbrowsVisualRules`

- 모든 사진 보정 프리셋 통일 = **웜톤 · 세미매트 · 동일 채도**
- 텍스트 카드 = **폰트·컬러 고정 템플릿** (Canva 브랜드킷 저장)
- 릴스 커버도 피드와 동일 톤 → 피드 이탈감 최소화

원본 자료: [`public/brand/founder/2026-07-17-integrated-guide-1.png`](../../../public/brand/founder/2026-07-17-integrated-guide-1.png) · [`2.png`](../../../public/brand/founder/2026-07-17-integrated-guide-2.png)

### 폰트 정본
- 헤드라인 한글: **Nanum Myeongjo** (명조)
- 헤드라인 라틴: **Cormorant Garamond** / **Playfair Display** (세리프)
- 본문: **Pretendard**
- 시그니처: **Caveat Bold** (원장님 완성본 하단 "Miji Jang" 필기체 톤)

### 금지 목록 (`artbrowsForbidden`)
- 살구핑크 계열
- 원색 (빨강·형광 옐로우·형광 그린·시안·마젠타·순색 퍼플)
- 파스텔 발랄톤

---

## 사용법

### CSS 변수 (컴포넌트에서)
```tsx
// layout.tsx or 최상위에서 한 번만 import
import '@/lib/artbrows/tokens.css';

// 이후 어디서든 var(--ab-gold) · var(--ab-black) 등 사용
```

### TypeScript 상수 (인라인 style 이나 로직에서)
```tsx
import { artbrowsColors, artbrowsFonts } from '@/lib/artbrows/tokens';

<div style={{ background: artbrowsColors.black, color: artbrowsColors.ivory }}>
  ...
</div>
```

### 금지 규칙 (린트·리뷰)
- 컴포넌트 안에서 `#XXXXXX` 리터럴 색을 쓰지 않는다. 반드시 `var(--ab-*)` 또는 `artbrowsColors.*` 참조.
- `artbrowsForbidden` 목록의 색은 어디에서도 사용 금지.
- 폰트 이름을 인라인으로 쓰지 않는다. 반드시 `var(--ab-font-*)` 또는 `artbrowsFonts.*` 참조.

---

## 사용 중인 곳

- `src/app/cardnews/cardnews.css` — 카드뉴스 12종 레이아웃 (원장님 정본 톤 이미 반영)
- `src/app/page.tsx` · `src/app/globals.css` — 외부 홈페이지 첫 페이지 (기존 --gold-* 변수 → 이 모듈로 통합 이관 대상)

## 관련 문서 (프로젝트 루트 방향으로)

- [브랜드 방향 정본](../../../docs/BRAND-DIRECTION-2026-07-17.md)
- [원장님 카톡 회의록 07-17](../../../docs/MEETING-2026-07-17-KATALK.md)
- [카드뉴스 레이아웃 라이브러리](../../../docs/CARD-NEWS-LAYOUT-LIBRARY-2026-07-17.md)
- [원장님 브랜드 자료](../../../public/brand/README.md)

## 갱신 이력

| 일자 | 항목 | 근거 |
|------|------|------|
| 2026-07-17 | 초기 정형화 · 색·폰트·금지 목록 (3톤 블랙+골드+아이보리) | 원장님 GPT 브랜드 이미지 + 카톡 11:11 · 11:42 |
| 2026-07-17 (오후) | **6톤 카테고리 팔레트 확장** · 콘텐츠 필러 40/20/15/15/10 · 비주얼 통일 규칙 (웜톤·세미매트·동일 채도 · Canva 브랜드킷) | 원장님 통합 브랜드 가이드 「artbrow-integrated-guide 2026」 (public/brand/founder/2026-07-17-integrated-guide-1.png · 2.png) |
