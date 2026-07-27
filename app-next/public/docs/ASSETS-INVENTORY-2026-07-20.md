# ASSETS INVENTORY · ARTBROWS 카드뉴스 재사용 카탈로그 (2026-07-20)

> 목적: 원장님·눈썹·시술·아카데미 자산을 카테고리·태그로 정리 → 카드뉴스 자동 생성 시 즉시 재사용
> 사용자 지시: 「자료 엄청 많이 있다 · 잘 정리해서 바로바로 쓸 수 있게」
> 정본: `docs/ASSETS-INVENTORY-2026-07-20.md`
> Graphify 대형 그래프는 별도 세션 (Windows 환경 이슈로 지연)

---

## 🖼 이미지 자산 (SAFE POOL · 원장·눈썹만)

### A. 힉스필드 완성 카드 (원장님 승인 ★★★★★)
**특성**: 자체 텍스트 포함 · 통짜 표시만 (`hero-portrait` kind) · 매거진 오버레이 금지
**톤**: Maison Noir 다크 · 골드 명조 · Higgsfield nano_banana_pro 산출물

| 파일 | 크기 | 용도 | 카피 | Kind 적합 |
|---|---|---|---|---|
| `ads/ig-69/01-hero-portrait.png` | 4:5 | 원장 아틀리에 · 30대 여성 | "극사실눈썹 창시자 · 장미지 원장의 단 하나의 아틀리에 · 평생 수강 69만원" | `hero-portrait` |
| `ads/ig-69/02-eyebrow-macro.png` | 4:5 | 눈썹 매크로 | "사람과 똑같은 결 · 선릉 · SINCE 1세대" | `hero-portrait` |
| `ads/ig-69/03-curriculum.png` | 4:5 | 원장 시술 (골드 머신) | "4주 클래스 · 1:1 직접 지도 · 극사실 시그니처 · 소수 정예 마스터클래스 · 69만원 / 평생 수강" | `hero-portrait` |
| `ads/ig-69/04-cta-typo.png` | 4:5 | CTA 타이포 | "SINCE THE ORIGINAL · 소수에게만 직접 가르칩니다 · 장미지 원장 · 12년 연구 · 선릉 아틀리에 · 상담 신청" | `hero-portrait` · `cta-editorial` 대체 |

### B. 힉스필드 세로 스토리 (9:16 · 인스타 스토리·릴스용)
`ads/ig-69-story/01·02·03·04-vertical.png` — 4장 · 위 4장의 9:16 버전

### C. 실제 시술 사진 (순수 · 오버레이 안전 ★★★★)
**특성**: 텍스트 없음 · 원장 시술 실물 · `macro-close-up`·`hero-portrait`·`atelier-scene` 오버레이 안전

| 파일 | 대상 | 특징 | Kind 적합 |
|---|---|---|---|
| `uploads/IMG_4668-*.JPG` | 여성 | 시술 후 · 눈썹 진함 자연 결 · 아이보리 시술실 배경 | `macro-close-up` · `hero-portrait` |
| `uploads/IMG_4672-*.JPG` | 남성 | 시술 후 · 눈썹 자연 결 · 하얀 배경 | `macro-close-up` · `hero-portrait` |
| `uploads/IMG_0517-*.jpg` | 여성 | 시술 후 · 눈썹 진함 · 파란 시술실 배경 | `macro-close-up` · `hero-portrait` |
| `uploads/In-the-softness-*.jpg` | 원장 | 원장 시술 장면 · 펜슬 설계 · 크림 톤 | `atelier-scene` ★ |

### D. 원장 얼굴·가이드 (기본 ★★★)
| 파일 | 용도 |
|---|---|
| `founder-key-visual-2026-07-17.png` | 원장 얼굴 정면 · `magazine-cover` 배경 · `hero-portrait` |
| `founder/2026-07-17-integrated-guide-1.png` | 원장 통합 가이드 1 |
| `founder/2026-07-17-integrated-guide-2.png` | 원장 통합 가이드 2 |

### E. 광고 무드 배경 (부수 ★★)
| 파일 | 톤 | 사용 |
|---|---|---|
| `ads/mood/mood-1.png` | 살구핑크 · **Maison Noir 부적합** | ⚠️ Pool 제외 |
| `ads/mood/mood-2.png` | 검토 필요 | 조건부 |
| `ads/mood/recruit-key.png` | 검토 필요 | 조건부 |

### F. 원본 자산 (app-next 미복사)
`assets/광고/`:
- `광고무드1.png` `광고무드2.png` — 무드 원본
- `광고쇼츠-무드.mp4` `광고쇼츠-완성.mp4` — 쇼츠 영상
- `광고이미지-모집.png` — 모집 광고 키비주얼
- `광고카드.html` — HTML 카드

**결정 대기**: app-next public으로 이동 or 별도 스크립트 mount

---

## ❌ EXCLUDED (참고용·무관 · 카드뉴스 사용 금지)

### 완전 제거 · `_reference/` 이동
- `_reference/01.jpg` — 서울쇼룸 서포터즈
- `_reference/02.jpg` — OLIVIA (다른 아티스트)
- `_reference/03.jpg` — Plastic Waste 캠페인
- `_reference/04.jpg` — 밀크T 광고
- `_reference/05.jpg` — Kalima Arabic 광고
- `_reference/5-2026-07-18T11-27-13.jpg` — SOPHIA ACADEMY (다른 학원)

### 완전 삭제
- `samples/ai-openai-*.png` (5장) — AI 생성 견본 (원장 자산 X)
- `samples/ai-gemini-*.png` (5장) — 동일

---

## 📄 문서·회의록·프롬프트 (오늘 2026-07-20 산출)

### 회의록 (docs/)
- `MEETING-2026-07-20-HOMEPAGE.md` — 홈피 방향성 12항
- `MEETING-2026-07-20-CURRICULUM.md` — 커리큘럼 재구조화
- `MEETING-2026-07-20-MASTER.md` — 하루 통합
- `MEETING-2026-07-20-REVIEW-EVENING.md` — AI 6인 자유 발언 검토
- `PLAN-CARDNEWS-MAGAZINE-RESET-2026-07-20.md` — 매거진 리셋 기획
- `PROMPTS-JANGMIJI-HYPERREAL.md` — 원장 극사실 프롬프트 정본 (5 시나리오)

### 페르소나 (personas/)
이서연 · 유나 · 김다은 · 박서윤 · 최예진 · 이한별 · 송하은 · 한승철 · 정하늘 · 김민서 (10명)

---

## 📋 카드뉴스 JSON 상태 (app-next/content/cardnews/)

### ✅ 오늘 2026-07-20 완성 (매거진 톤 · SAFE 이미지)
- `2026-07-20-changupbaan-15th.json` — 창업반 15기 660 · 8장
- `2026-07-20-easy-class-15th.json` — 이지 15기 69 · 6장
- `2026-07-20-hyperreal-brow-15th.json` — 극사실 169 · 9장

### 📦 Legacy (auto 생성 · 참고용 이미지 마이그레이션됨)
- `14th-easy-class.json` (마이그레이션 완료 · SAFE pool 사용)
- `auto-2026-07-17*.json` · `auto-2026-07-18*.json` · `auto-2026-07-20*.json`

---

## 🎯 카드뉴스 자동 생성 Pool 매핑 (재사용용)

### 매거진 kind → 사용 가능 이미지
| Kind | 안전 이미지 | 주의 |
|---|---|---|
| `magazine-cover` | founder-key · founder/guide-1·2 · uploads/IMG_* · In-the-softness | IG-69 X (자체 텍스트 겹침) |
| `hero-portrait` | **IG-69/01~04 (통짜 · 오버레이 X)** · uploads/IMG_* · founder-key | 완성 카드는 오버레이 넣지 말 것 |
| `macro-close-up` | uploads/IMG_4668·4672·0517 | 순수 사진만 (IG-69 매크로 X · 자체 텍스트) |
| `atelier-scene` | **In-the-softness ★** · founder-key | 원장 시술 장면 순수 사진 |
| `before-after-split` | **⚠️ 동일 인물 페어 없음 · 사용 금지** | 원장님 실 페어 촬영 대기 |
| `pullquote-editorial` | (이미지 X · 텍스트만) | 원장 원문 「털 같은 눈썹」 활용 |
| `signature-style` | (이미지 X · 텍스트 매트릭스) | Brand Concept + 4항 |
| `case-study-detail` | (이미지 X · 좌 정보 + 우 헤드/가격) | 커리큘럼·수강료·조건 |
| `cta-editorial` | (이미지 X · 텍스트 CTA) | IG-69/04로 대체 가능 |
| `umbrella-4cats` | (이미지 X · 4대 카테고리 그리드) | 극사실 4대 |

### 원장님 원문 재사용 인용 (pullquote)
- **"고객이 원하는 것은 그린 눈썹이 아니라 털 같은 눈썹이다."** (핵심)
- "이지 클래스는 극사실눈썹이 아닙니다. 하지만 그 세계를 여는 문입니다."
- "3일이면 됩니다. 단 · 이지 클래스 미수강자에게는 권하지 않습니다."
- "성형에는 쓰지만 수업엔 어려워하는 금액. 30대 중후반 · 결정권 있는 나이."
- "진짜 머리카락이야 · 진짜 눈썹이야 · 원래 입술 색깔 아니었어?"
- "소수에게만 직접 가르칩니다." (SINCE THE ORIGINAL)
- "사람과 똑같은 결" (SINCE 1세대)

---

## 🚨 부족 자산 (촬영·힉스필드 필요)

### 즉시 필요 (원장님 결재 대기)
- **동일 인물 Before/After 페어 사진** — `before-after-split` kind 활성화용
- **원장님 명품 톤 신규 촬영** (2026-07-20 저녁 리스크 top 2)
- **원장님 아틀리에 다른 각도** — atelier-scene 다양화

### 힉스필드로 신규 생성 가능 (원장 프롬프트 정본 활용)
- **극사실 4대 나머지 3개**: 아이라인·입술·헤어라인 각 매크로 (30 크레딧)
- **아틀리에 다양한 씬**: 마스터 클래스·수강생 실습 (10 크레딧/장)
- **매크로 클로즈업 신규 각도** (10 크레딧/장)

---

## 📐 카드뉴스 kind 매핑 요약 (10초 참조)

**IG-69 완성 카드 4장** → `hero-portrait` (통짜)
**실 시술 3장 + In-the-softness** → `macro-close-up` · `atelier-scene` · `hero-portrait` (오버레이 OK)
**원장 얼굴 + 가이드 3장** → `magazine-cover` 배경 · `hero-portrait`
**세로 스토리 4장** → `hero-portrait` 9:16 (인스타 스토리 · 릴스)

---

## 다음 액션 (재사용 시스템 강화)

- [ ] `agents.ts` IMAGE_POOL 이 문서와 정합 확인 (v4 완료)
- [ ] Graphify 별도 세션 실행 (Windows Bash 이슈 해결 후 · 큰 파이프라인)
- [ ] 힉스필드 극사실 4대 신규 생성 (원장님 결재 후)
- [ ] 원장님 명품 톤 촬영 세션 (다음 주)
- [ ] 이 인벤토리 문서를 매 자산 추가 시 즉시 갱신 (「완료」 트리거)

---

**최종 업데이트**: 2026-07-20 저녁 · 카드뉴스 세션 마무리
**정본 담당**: 자산 추가/제거 시 이 파일 즉시 갱신
