# PLAN · 카드뉴스 매거진 급 완전 리셋 (2026-07-20)

> 결정: 대표님 「너무 예전 참고용 그대로」 지적 → C 옵션 (완전 리셋) 확정
> 원장님 프롬프트 정본 (`PROMPTS-JANGMIJI-HYPERREAL.md`) + Maison Noir 명품 톤 + 「털 같은 눈썹」 정본 완전 흡수
> 정본: `docs/PLAN-CARDNEWS-MAGAZINE-RESET-2026-07-20.md`

---

## 0. 원칙

**"Vogue Beauty · Harper's Bazaar · Numero 급 매거진 톤."**

- **예전 12종 (2026-07-17 참고용)** → **archive · legacy 지원** (기존 프로젝트 계속 렌더)
- **신규 9종 (2026-07-20 매거진 정본)** → 신규 프로젝트 기본
- 「털 같은 눈썹 · 극사실 창시자 · 30대+ 프리미엄 마니아」 원장님 정체성 완전 반영
- 색·폰트·여백 = Maison Noir 로즈 브론즈 다크
- 인물·이미지 = 원장님 프롬프트 정본 5시나리오

---

## 1. 신규 9종 매거진 Layout

| # | Kind | 컨셉 | 사용처 | 원장 프롬프트 정본 매핑 |
|---|---|---|---|---|
| 1 | **magazine-cover** | Vogue 커버 · 대형 명조 + 원장 인물 배경 | 시리즈 커버 | 히어로 A |
| 2 | **hero-portrait** | 화보 인물 전면 · 오버레이 최소 텍스트 | 브랜드 인물 화보 | 히어로 A |
| 3 | **macro-close-up** | 매크로 (모공·털 결) + 미니 명조 캡션 | 극사실 시그니처 | 클로즈업 B |
| 4 | **before-after-split** | 좌우/상하 분할 · 세리프 「BEFORE·AFTER」 | 시술 결과 · 신뢰 | B&A C |
| 5 | **pullquote-editorial** | 대형 세리프 이탤릭 인용 + 필기체 서명 | 원장 어록 | (신규) |
| 6 | **signature-style** *(재활용)* | Brand Concept + Signature Style | 브랜드 매트릭스 | (기존 좋음) |
| 7 | **case-study-detail** | 좌 정보 리스트 + 우 대형 세리프 요약 | 커리큘럼·가격·조건 통합 | (신규 · 기존 price+curriculum+checklist 통합) |
| 8 | **atelier-scene** | 씬 사진 + 하단 3열 정보 | 선릉 본원·시술 장면 | 아틀리에 D |
| 9 | **cta-editorial** | 얇은 골드 라인 + 세리프 헤드 + 필기체 서명 | 마무리·상담 유도 | (신규 · 기존 closing 리뉴얼) |

**추가 옵션 (Phase 2)**:
- `umbrella-4cats` — 극사실 4대 카테고리 그리드 (눈썹·아이라인·입술·헤어라인)
- `interview-qa` — Q&A 카드
- `handwritten-note` — 원장 손글씨

---

## 2. Legacy 12종 처리

**Archive 원칙**:
- 기존 12종 (`cover-founder`, `number-big`, `icon-duo`, `icon-trio`, `checklist`, `portrait-frame`, `product-hero`, `quote-bold`, `signature-style`, `curriculum-row`, `price-table`, `closing-cta`) → **types.ts 유지** · **컴포넌트 유지**
- 기존 프로젝트 (auto-* 등) → **자동 렌더 계속**
- **design UI에서 「Legacy (참고용)」 그룹으로 표시** · 신규 프로젝트는 매거진 9종 default

**매핑 (신규 자동 마이그레이션 X · 콘텐츠는 legacy 그대로)**:
- cover-founder → magazine-cover (수동 변환)
- portrait-frame → hero-portrait
- product-hero → macro-close-up 또는 hero-portrait
- quote-bold → pullquote-editorial
- price-table + curriculum-row + checklist → case-study-detail (통합)
- closing-cta → cta-editorial
- signature-style → 그대로 재활용
- number-big / icon-duo / icon-trio → Legacy (매거진 감성 X)

---

## 3. 디자인 톤 (Maison Noir 반영)

### 색 팔레트 (기존 `--ab-*` 토큰 활용 + 추가)
```
--ab-black:        #0A0806  (기존 · 배경)
--ab-charcoal:     #1A100B  (기존 · 카드 배경 2)
--ab-rose-bronze:  #B08862  (2026-07-20 신규 · Maison Noir 메인)
--ab-champagne:    #E8C9AE  (2026-07-20 신규 · 서브 · 강조)
--ab-gold-deep:    #6B4530  (기존 유지)
--ab-ivory:        #F0DBC3  (기존 · 텍스트)
--ab-text-soft:    #C8A88C  (기존)
```

### 폰트
- **헤드**: Cormorant Garamond (기존) · Cinzel (신규 · 매거진 커버)
- **본문**: Noto Serif KR (기존)
- **라벨**: Inter · 대문자 letter-spacing 0.2em+
- **필기체**: 기존 시그니처 폰트 유지

### 여백 · 리듬
- 인스타 4:5 기준 여백 상하 각 60~90px · 좌우 40~60px
- 매거진 감각 = 여백이 콘텐츠만큼 중요

---

## 4. 신규 layout 시각 스케치

### 1. magazine-cover
```
┌─────────────────────────────┐
│  ARTBROWS · VOL 15  ───     │  ← 얇은 골드 라벨 상단
│                             │
│                             │
│  ARTIST  OF  THE            │  ← 대형 세리프 (Cinzel)
│  HYPER  REAL  BROW          │
│                             │
│                             │
│    [원장 인물 이미지 배경]      │  ← 하단 절반 페이드
│                             │
│  ─── MIJI JANG · 2026       │  ← 얇은 골드 라인 + 서명
└─────────────────────────────┘
```

### 2. hero-portrait
```
┌─────────────────────────────┐
│                             │
│                             │
│                             │
│     [인물 이미지 화면 100%]    │
│                             │
│                             │
│                             │
│  ─── 털 같은 눈썹            │  ← 얇은 골드 라벨 하단
└─────────────────────────────┘
```

### 3. macro-close-up
```
┌────────────────┬────────────┐
│                │            │
│                │  「그린 눈  │
│  [눈썹 매크로]  │  썹이 아닌 │
│    이미지      │  털 같은」  │
│                │            │
│                │  ─ 장미지  │
└────────────────┴────────────┘
```

### 4. before-after-split
```
┌──────────────┬──────────────┐
│              │              │
│   BEFORE     │    AFTER     │
│              │              │
│  [원본 사진] │  [시술 후]   │
│              │              │
│              │              │
├──────────────┴──────────────┤
│  ─── 클레임 거의 0 · 30년    │  ← 하단 정보 스트립
└─────────────────────────────┘
```

### 5. pullquote-editorial
```
┌─────────────────────────────┐
│                             │
│                             │
│       "                     │  ← 큰 세리프 인용 부호
│  고객이 원하는 것은          │
│  그린 눈썹이 아니라          │  ← 대형 세리프 이탤릭
│  털 같은 눈썹이다.           │
│                             │
│                             │
│       Miji Jang             │  ← 필기체 서명
│  ─── ARTBROWS FOUNDER        │
└─────────────────────────────┘
```

### 6. signature-style (재활용)
- 기존 그대로 유지 (2열 Concept + Style)

### 7. case-study-detail
```
┌──────────────┬──────────────┐
│              │              │
│  CURRICULUM  │              │
│  01 이지     │  4개월       │  ← 우측 대형 세리프
│  02 소묘 ×2  │  통합        │
│  03 극사실×3 │  660만원     │
│  04 제거     │              │
│  05 컨설팅   │  ─ 재수강 990│
│              │              │
└──────────────┴──────────────┘
```

### 8. atelier-scene
```
┌─────────────────────────────┐
│                             │
│                             │
│   [아틀리에 씬 이미지]       │
│                             │
│                             │
├────────┬────────┬───────────┤
│ 선릉    │ 20년+  │  900여명  │  ← 하단 3열 정보 스트립
│ 본원    │ 경력   │  수강 배출│
└────────┴────────┴───────────┘
```

### 9. cta-editorial
```
┌─────────────────────────────┐
│  ───────────────────         │  ← 얇은 골드 라인 상단
│                             │
│                             │
│  털 같은 커리어,              │  ← 대형 세리프 헤드
│  지금 시작하세요.             │
│                             │
│                             │
│      Miji Jang               │  ← 필기체 서명
│                             │
│  ───────────────────         │  ← 얇은 골드 라인 하단
│  교육 상담 신청  →           │  ← 얇은 CTA
└─────────────────────────────┘
```

---

## 5. 실행 단계

### Phase 1 (지금 세션 · 2~3h)
1. ✅ 기획서 저장 (본 문서)
2. `types.ts` 신규 9종 kind 추가 (legacy 12종 유지)
3. 각 layout React 컴포넌트 신설 (9개 파일)
4. `cardnews.css` 매거진 정본 CSS 추가 (Maison Noir 팔레트)
5. `SlideRender.tsx` 신규 9종 switch case 추가
6. **3세트 (창업반·이지·극사실) 신규 layout으로 재작성**
7. Tunnel 즉시 확인

### Phase 2 (다음 세션 · 2h)
8. `agents.ts` `orchestrator.ts` 신규 9종 지원 (자동 생성)
9. `GenerateModal.tsx` design UI 신규 9종 + Legacy 그룹
10. `style-presets.ts` 매거진 프리셋 신규
11. 원장님 프롬프트 정본 5시나리오 → skeleton 템플릿 자동 매핑

### Phase 3 (필요 시)
12. 추가 layout (umbrella-4cats, interview-qa, handwritten-note)
13. 인스타 aspect UI (1:1 · 4:5 · 9:16 · 오늘 부분 완성)
14. PNG export 자동화

---

## 6. Phase 1 착수 순서

**A. Foundation (30분)**
- types.ts 신규 kind + 인터페이스
- cardnews.css 매거진 정본 CSS

**B. 컴포넌트 신설 (1~1.5h)**
- 9개 layout React 컴포넌트 (`layouts/Magazine*.tsx`)
- SlideRender.tsx switch 추가

**C. 3세트 재작성 (30분)**
- 창업반 15기 → 매거진 8~9장
- 이지 클래스 → 매거진 6~7장
- 극사실눈썹 → 매거진 7~8장

**D. 검증 (10분)**
- Tunnel URL 3개 재확인
- 컴파일 에러 0

---

## 7. 리스크

- **시간**: 반나절 예상 · 회의 중 · 완성도 vs 속도 tradeoff
- **콘텐츠 손실 X**: 기존 3세트 문구·이미지 재활용 · layout만 변환
- **Legacy 유지**: 기존 프로젝트 자동 렌더 유지 (하위호환)
- **자동 생성 미지원 (Phase 1)**: 신규 layout은 수동 편집만 · Phase 2에 자동화

---

## 8. 성공 기준

- [ ] 신규 9종 layout 즉시 렌더 (컴파일 에러 0)
- [ ] 3세트 매거진 톤 (Maison Noir 로즈 브론즈) 반영
- [ ] 원장님 「털 같은 눈썹」 어휘 매거진 감성으로 재구성
- [ ] 각 슬라이드 시각 확연히 다름 (반복 없음)
- [ ] Legacy 프로젝트 자동 렌더 유지
- [ ] 원장님·본부장 「예전 참고용 X · 진짜 매거진 O」 컨펌

---

## 9. 관련 문서

- `docs/PROMPTS-JANGMIJI-HYPERREAL.md` — 원장 프롬프트 정본 (5시나리오)
- `docs/MEETING-2026-07-20-HOMEPAGE.md` — Maison Noir 명품 톤 확정
- `docs/MEETING-2026-07-20-CURRICULUM.md` — 커리큘럼 정본
- `docs/MEETING-2026-07-20-MASTER.md` — 마스터 통합
- 메모리: `artbrows-prompts-jangmiji-hyperreal.md`, `artbrows-official-facts-2026-07-19.md`, `artbrows-luxury-dark-tone-final.md`
