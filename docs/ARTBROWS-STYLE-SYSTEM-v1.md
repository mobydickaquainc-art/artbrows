# ARTbrows Style System v1.0 — 카드뉴스 브랜드 스타일 정본
> **Track A · ARTbrows 자체 스타일 라인** (2026-07-23 정본화)
> 대표님 지시 (2026-07-23): 「지금까지 한 것은 아트브로우즈 스타일로 잘 정리하자」
> 정본 위치: `docs/ARTBROWS-STYLE-SYSTEM-v1.md`
> 관계: **Track B (Fable 5 세션에서 인스타 트렌디·센서티브 재조사)** 와 병행 · 상충 X · 각자 자기 자리

---

## 0. 원칙

- **ARTbrows Style = 원장님 20년 크래프트 · 「털 같은 눈썹」 · 럭셔리 매거진** 톤을 카드뉴스로 옮긴 정본 시스템
- **Maison Noir 팔레트** + **Cormorant Garamond** + **Nanum Myeongjo** 강제
- 원장 승인 톤 (2026-06-29 Luxury Dark 최종 · [`artbrows-luxury-dark-tone-final`](../CLAUDE.md) 계승)
- Track B (요즘 트렌디·센서티브 재조사) 결과가 나와도 **이 시스템은 폐기 X** · Track B 는 나란히 하나의 라벨 (예: `trend-a` `trend-b` …) 로 스타일 프리셋에 추가

---

## 1. 시스템 컴포넌트 (완성)

| 컴포넌트 | 파일 | 상태 |
|---|---|---|
| **17 스타일 프리셋** | [`app-next/src/lib/cardnews-agents/style-presets.ts`](../app-next/src/lib/cardnews-agents/style-presets.ts) | ✅ 완성 |
| **12 kind 레이아웃** | [`app-next/src/app/cardnews/types.ts`](../app-next/src/app/cardnews/types.ts) | ✅ 완성 |
| **6톤 팔레트 (Maison Noir)** | [`app-next/src/lib/artbrows/tokens.css`](../app-next/src/lib/artbrows/tokens.css) | ✅ 완성 |
| **AI 자동 생성 파이프라인** | [`app-next/src/lib/cardnews-agents/`](../app-next/src/lib/cardnews-agents/) | ✅ 완성 (Gemini + OpenAI 병렬) |
| **Progressive 4-스텝 위저드** | [`app-next/src/app/cardnews/GenerateModal.tsx`](../app-next/src/app/cardnews/GenerateModal.tsx) | ✅ 완성 |
| **3언어 지원 (KO/EN/ZH)** | [`app-next/src/app/cardnews/types.ts`](../app-next/src/app/cardnews/types.ts) | ✅ 완성 |
| **인스타 chrome 스타일별 opt-out** | [`app-next/src/app/cardnews/cardnews.css`](../app-next/src/app/cardnews/cardnews.css) L825~ | ✅ 완성 (2026-07-23) |

---

## 2. 스타일 카탈로그 · 17종

### 그룹 A — 원장 승인 톤 (초기 10종 · 2026-07-20)

| # | Key | 이름 | 대표 사용 목적 |
|---|---|---|---|
| 01 | `vogue-magazine` | Vogue Magazine ★★★★★ | 상시 · 브랜드 이미지 (default) |
| 02 | `minimal-editorial` | Minimal Editorial | 원장 스토리 · 아틀리에 무드 |
| 03 | `bold-question` | Bold Question ★★★★ | 스와이프 유도 · 인스타 리치 |
| 04 | `numbered-steps` | Numbered Steps | 커리큘럼 · 프로세스 |
| 05 | `quote-focus` | Quote Focus ★★★ | 원장 어록 · 후기 |
| 06 | `before-after` | Before / After ⚠ | 시술 결과 (페어 사진 필요) |
| 07 | `data-card` | Data Card ★★★★ | 신뢰 자산 (20년+ · 8,000+) |
| 08 | `poem-verse` | Poem / Verse | 브랜드 감성 |
| 09 | `announcement` | Announcement ★★★★★ | 15기 모집 광고 |
| 10 | `polaroid-analog` | Polaroid Analog | 원장 일상 · 친밀 브랜딩 |

### 그룹 B — 원장 Top 5 승격 (신규 · 2026-07-23)

| # | Key | 이름 | 대표 사용 목적 |
|---|---|---|---|
| 12 | `rebellion-serif` | **Rebellion Serif ★★★★★** 🎯 **앵커** | 브랜드 파워 상시 · 창업반 890 훅 |
| 13 | `grain-frame-editorial` | Grain Frame Editorial | 아틀리에 스토리 · 30대+ 감성 |
| 14 | `vertical-column-story` | Vertical Column Story | 「털 같은 눈썹 3원칙」 · 저장 유도 |
| 15 | `broken-grid-editorial` | Broken Grid Editorial | 럭셔리 · 극사실 169 룩북 |
| 16 | `silhouette-reveal` | Silhouette Reveal | 원장 브랜드 미스터리 훅 |

### 그룹 C — Custom

| # | Key | 이름 | 대표 사용 목적 |
|---|---|---|---|
| 17 | `custom` | Custom (원장님 자유 서술) | 위 16종에 없는 목적 · AI 자동 설계 |

---

## 3. 🎯 앵커 = 12 Rebellion Serif (2026-07-23 원장님 지정)

원장님/대표님이 5종 시안 중 「맘에 든다」고 확정한 스타일.
**향후 ARTbrows 자체 스타일 라인의 대표 정본**으로 취급 · 신 트렌드가 나와도 이 스타일은 유지.

**시안 파일**: [`app-next/content/cardnews/2026-07-23-style12-rebellion-serif.json`](../app-next/content/cardnews/2026-07-23-style12-rebellion-serif.json)

**특성**:
- 200~280pt 대형 세리프 대문자 · 사진 프레임 침범
- HYPER · REAL · MASTER · ORIGINAL 대문자 라틴 강조
- 「털 같은 눈썹」 원장 원문 재사용 (얇은 명조 하위 라인)
- 매거진 kind = magazine-cover → hero-portrait → pullquote-editorial → magazine-cover → atelier-scene → cta-editorial

**인스타 chrome**: ON (Vogue 톤 · 브랜드 강화)

---

## 4. 시안 5세트 상태 (2026-07-23)

| 시안 파일 | 스타일 | 앞으로의 위상 |
|---|---|---|
| `2026-07-23-style12-rebellion-serif.json` | 12 Rebellion Serif | **앵커 유지** · 활용 대상 |
| `2026-07-23-style13-grain-frame.json` | 13 Grain Frame Editorial | 참고자료 · archived |
| `2026-07-23-style14-vertical-column.json` | 14 Vertical Column Story | 참고자료 · archived |
| `2026-07-23-style15-broken-grid.json` | 15 Broken Grid Editorial | 참고자료 · archived |
| `2026-07-23-style16-silhouette-reveal.json` | 16 Silhouette Reveal | 참고자료 · archived (Silhouette 컨셉 자체는 유지) |

**의미**: 4세트는 「폐기」가 아닌 「Track A 이 지점까지의 사고 흔적」 · Track B 결과와 합쳐 재사용 가능.

---

## 5. SAFE POOL 자산 (Track A 정본 이미지 라이브러리)

| 폴더 | 내용 | 오늘 (07-23) 신규 |
|---|---|---|
| `public/brand/ai-generated/founder-persona/` | 원장 얼굴 정면 3장 + **실루엣 1장 (신규)** | ✅ silhouette-01.png (Gemini 3 Pro Image · 임시) |
| `public/brand/ai-generated/atelier/` | 아틀리에 씬 4장 | — |
| `public/brand/ai-generated/macro/` | 눈썹 매크로 4장 | — |
| `public/brand/ai-generated/client/` | 수강생·시술 후 4장 | — |
| `public/brand/ads/ig-69/` | 힉스필드 완성 4장 (자체 텍스트) | — |
| `public/brand/ads/ig-69-story/` | 세로 스토리 4장 (9:16) | — |
| `public/uploads/` | 실 시술 사진 3장 (IMG_4668 · 4672 · 0517) | — |

---

## 6. Track A · 지금까지의 통찰 (인수 인계용)

- Maison Noir 다크 톤 = 원장 승인 · 프리미엄에는 강함 · 다만 **인스타 알고리즘 자극·킬러 훅**에는 무거울 수 있음 (2026-07-23 대표님 피드백)
- 대문자 세리프 (Rebellion Serif) = 앵커로 확정 · 다만 「너무 명품 척하는 느낌」 리스크 있음 (Track B 재검증 대상)
- Silhouette Reveal 아이디어 자체는 좋음 · 원장 실 촬영 필요 · Gemini 임시 이미지로 컨셉 검증 성공
- 인스타 chrome (@artbrows_academy 배지 + 해시태그 푸터) = 자동 오버레이 스타일별 opt-out 처리 완료 · 미니멀 톤엔 방해가 될 수 있음
- 「털 같은 눈썹」 어휘 = **모든 트랙에서 유지 필수** · 원장 25년 브랜드 정체성

---

## 7. Track B 인계 (다음 세션 · Fable 5)

**인계 브리핑 정본**: [`docs/CARDNEWS-REBOOT-BRIEFING-2026-07-23.md`](CARDNEWS-REBOOT-BRIEFING-2026-07-23.md)

Track B 는 이 문서 (Track A 정본) 를 폐기하지 않고 **병행 라인**으로 새 스타일 발굴 · 최종적으로 원장님이 두 트랙 위에서 스타일 선택.

---

**최종 업데이트**: 2026-07-23 · Track A 정본화 세션
**정본 담당**: ARTbrows Style 시스템 변경 시 이 문서 즉시 갱신
