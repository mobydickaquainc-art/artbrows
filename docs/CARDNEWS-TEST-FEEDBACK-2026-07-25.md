# 카드뉴스 툴 실 테스트 · 개선점 트래킹 (2026-07-25~26)

> **대표님 지시 (2026-07-25)**: 「하나 하나 내가 테스트 하면서 개선점 파악해 볼게」 + 「월요일 제대로 보여줘야 한다」 + 「AI 를 무시하는 경향이 있으니 우리가 제대로 보여주자」
> **목표**: 07-27 (월) 원장님·본부장 시연에서 「AI 대충 만든 것」이 아니라 「진짜 도구」로 인정받기
> **정본 위치**: `docs/CARDNEWS-TEST-FEEDBACK-2026-07-25.md`

---

## 시연 상태 목표 (Definition of Done)

- ✅ 대시보드 진입 → 5 신 스타일 후보가 상단에 눈에 띄게 · 이전 auto-* 잔재 없이 정리
- ✅ 각 후보 뷰어 URL 200 · 6~8장 캐러셀 시각 임팩트 정상
- ✅ 편집기 진입 → 슬라이드 클릭 · 실시간 미리보기 정상
- ✅ 자동 생성 위저드 → 스타일 선택 → 20초 타이머 팝업 정상
- ✅ Chrome opt-out 정상 (Silhouette · Grain Frame · Broken Grid = OFF · Rebellion · Vertical Column = ON)
- ✅ 원장님·본부장이 폰에서도 정상 (반응형)
- ✅ 「이거 진짜 만들었네」 하고 놀랄만한 첫 컷 임팩트

---

## 테스트 대상 URL

**대시보드**: http://localhost:3000/cardnews
**튜토리얼**: http://localhost:3000/cardnews/tutorial
**12 kind 데모**: http://localhost:3000/cardnews/layouts

**5 신 스타일 후보 뷰어**:
- 🥇 12 Rebellion Serif (앵커): http://localhost:3000/cardnews/view/2026-07-23-style12-rebellion-serif
- 13 Grain Frame Editorial: http://localhost:3000/cardnews/view/2026-07-23-style13-grain-frame
- 14 Vertical Column Story: http://localhost:3000/cardnews/view/2026-07-23-style14-vertical-column
- 15 Broken Grid Editorial: http://localhost:3000/cardnews/view/2026-07-23-style15-broken-grid
- 16 Silhouette Reveal: http://localhost:3000/cardnews/view/2026-07-23-style16-silhouette-reveal

**편집기 진입** (id 만 바꾸면 됨):
- http://localhost:3000/cardnews/edit/2026-07-23-style12-rebellion-serif

---

## 발견 사항 · 트래킹

### [T-01] (대기)
> _대표님 테스트 발견 시 여기에 기록 · 즉시 대응 후 상태 표시_

---

## 반영 완료

- ✅ 2026-07-23 · 인스타 chrome 스타일별 opt-out (Silhouette·Broken Grid·Grain Frame = OFF)
- ✅ 2026-07-25 · 5 시안 archived → draft 복구 + title prefix `[archived · 참고자료]` 제거

---

## 월요일 시연 대본 (초안 · 대표님 확인 대기)

**시연 순서 (15분)**:
1. **오프닝 (2분)**: 「이건 그냥 편집기가 아니라 원장님 브랜드 톤 자체를 알고 있는 툴입니다」
2. **대시보드 훑기 (2분)**: 프로젝트 목록 · 스타일 프리셋 17종 · 신 5 후보 강조
3. **앵커 시안 12 Rebellion Serif 열기 (3분)**: 6~7장 캐러셀 · 「HYPER REAL · CRAFT OVER HYPE」
4. **자동 생성 위저드 실연 (5분)**: 원장님이 목적 입력 → 20초 팝업 → 6장 완성. 「이건 원장님이 직접 만드시는 겁니다」
5. **다음 스텝 (3분)**: 리팩토링 로드맵 · 8월 말 오픈 이후 자동 게시 파이프 · 김다은·한승철 리드

**「AI 무시」 대응 카피 3개**:
- 「이건 감이 아니라 데이터입니다」 (3축 리서치 근거)
- 「이건 브랜드 훼손 없이 스타일만 늘어난 겁니다」 (Track A/B 분리)
- 「원장님이 직접 만드시는 도구지 · AI 가 대신 만드는 도구 아닙니다」

---

## 시연 실패 리스크 · 사전 방지

| 리스크 | 방지 |
|---|---|
| 렌더링 안 됨 (500 에러) | 시연 전 모든 URL 200 확인 |
| 이미지 깨짐 | SAFE POOL 자산 경로 검증 |
| 텍스트 오버플로우 | 각 시안 브라우저 육안 확인 (오늘·내일) |
| 폰에서 안 보임 | 반응형 검증 (원장님 폰 사이즈 375·414px) |
| 「AI 흔한 톤」 인식 | 시연 시 「Maison Noir 원장 정본 톤」 강조 |
| 자동 생성 시연 실패 | 사전 3회 리허설 · API 응답 시간 안정성 확인 |

---

**최종 업데이트**: 2026-07-25 · 대표님 실 테스트 세션 시작
**정본 담당**: 발견 사항 즉시 반영 · 07-27 월요일 시연 전까지
