# CARDNEWS REBOOT · Fable 5 세션 인계 브리핑 (2026-07-23)
> **Track B · 인스타 카드뉴스 재조사 + 기획 재부팅**
> 다음 세션 (Fable 5) 에서 이 문서 읽고 즉시 착수 가능
> 정본 위치: `docs/CARDNEWS-REBOOT-BRIEFING-2026-07-23.md`

---

## 🆕 v4 · 2026-07-23 저녁 · Track B 리서치 착수 완료 (Opus 세션 진행)

**대표님 재지시**: 「중국이나 한국 눈썹 관련 트렌디한것들을 잘 모아 봐라」 → 3 Agent 병렬 리서치 실행 · **완료**

**리서치 3축 결과 정본**: [`docs/TRENDS-CHINA-KOREA-EYEBROWS-2026-07-23.md`](TRENDS-CHINA-KOREA-EYEBROWS-2026-07-23.md)
- 축 1 · 중국 샤오홍슈 (小红书) — Top 10 인플루언서 · 시각 요소 · 흡수 5
- 축 2 · 중국 도우인/티엔마오 상업 광고 — Top 10 브랜드 · 회피 표현 목록 · 흡수 5
- 축 3 · 한국 인스타 뷰티 아카데미 — Top 10 계정 · 「털 같은 눈썹」 선점 확정 · 흡수 5

**3축 공통 문법 6가지**:
1. 매크로 브로우 클로즈업 + 세리프 세로 헤드라인 2단
2. 결정 트리 캐러셀 (3~4종 비교)
3. 숫자 앵커 신뢰 카드
4. 정면+측면 90° 스택 + 골드 그리드 오버레이
5. 개인 IP 스토리텔링 (원장 다큐형)
6. 60초 세로 릴스 첫 3초 클로즈업 + 페이스 스캔

**신 스타일 후보 5개 스케치**: [`docs/NEW-STYLE-CANDIDATES-2026-07-23.md`](NEW-STYLE-CANDIDATES-2026-07-23.md)
- 🥇 A · 一人一眉 (일인일미) · 결정 트리 캐러셀
- 🥈 B · Numbered Trust · 대형 세리프 숫자 스택
- 🥉 C · Golden Grid Portrait · 정면+측면 스택 + 골드 격자
- D · Quiet Luxury × 극사실 · 청담리 톤 흡수
- E · Founder Documentary · 원장 20년 다큐 (실 촬영 필요)

**팀 추천 Top 3**: B · A · E (시각 임팩트·원장 승인·저장률 상위)

**Fable 5 세션에서 즉시 할 것**:
1. `/model fable-5` 실행
2. `docs/NEW-STYLE-CANDIDATES-2026-07-23.md` 정독 · 5 후보 검토
3. 대표님·원장 5 후보 중 승격 결정 (2~5개)
4. 승격 후보 = 스타일 프리셋 등록 + 시안 JSON 생성
5. 병행 : 모비딕 detail-agent 리팩토링 Phase 1 (기획·설계) 착수

---

## 🆕 v3 · 2026-07-23 저녁 대표님 3 결정 확정

**Fable 5 세션 진입 시 바로 이 결정에 따라 착수**:

| # | 결정 항목 | 확정 |
|---|---|---|
| 1 | **「전문가 영역」 정의** | **B. 디자인 완성도** (에이전시 수준 시각 퀄리티) — 프로덕션 자동화(A)나 프로세스 표준화(C) 아님 |
| 2 | **리팩토링 시점** | **병렬** · 오늘부터 Fable 5 세션 착수 · 8월 말 오픈과 병행 |
| 3 | **리드 담당** | **김다은 리드** (모비딕 상세페이지 패턴 6개월 학습) · **한승철 CTO 지원** (백엔드 파이프 · 시스템 안정성) |

**해석 = Track B 리부트의 무게중심은 「시각 퀄리티」**:
- 프로덕션 파이프라인·CLI 는 부차적 (원장님 승인·인스타 첫 컷 임팩트가 최우선)
- 리서치 축 = 인스타 뷰티·매거진·글로벌 브랜드 톱 계정 시각 요소 (컬러·폰트·컷·크롭·움직임) 정량 수집
- 6 에이전트 파이프 (모비딕) 는 그대로 이식 · 다만 **designer 에이전트가 핵심** (시각 품질을 결정하는 최종 렌더러)
- 품질 게이트 = 「자동 재생성 3회」 뿐 아니라 「원장님 톤 매칭 스코어」 도 추가

## 🆕 v2 · 2026-07-23 저녁 대표님 방향 재확정
> 「모비딕 상세페이지 자동화와 전문가 영역처럼 제대로 된 카드뉴스 생성기가 필요하다」

Track B 리부트 = 단순 「신 스타일 리서치」 가 아님. **모비딕 detail-agent 수준의 프로덕션 파이프라인** 이식 필요.
- **필수 참고 정본**: [`docs/MOBYDICK-DETAIL-AGENT-BENCHMARK-2026-07-23.md`](MOBYDICK-DETAIL-AGENT-BENCHMARK-2026-07-23.md) (모비딕 구조·갭 7축·리팩토링 로드맵 4 Phase)
- **필수 참고 정본**: [`docs/MEETING-2026-07-23-CARDNEWS-REBOOT-FULLSTAFF.md`](MEETING-2026-07-23-CARDNEWS-REBOOT-FULLSTAFF.md) (10명 개선안 · 통합 축 8 · 리스크 Top 7 · 결정 대기 8건)
- **김다은 페르소나** = 「모비딕 상세페이지 패턴 6개월 학습」 · 리팩토링 리드 후보

**Track B 목표 재정의** (v1 = 「신 스타일 리서치」 → v2 = 「프로덕션 파이프 + 신 스타일 리서치」 병행):
1. 모비딕 detail-agent 6 에이전트 파이프 + YAML 스펙 + 품질 게이트 + HTML→PNG + CLI 이식
2. Track B 인스타 트렌드 리서치 결과 → 새 스타일 프리셋 등록 (Track A 옆에 나란히)
3. Meta Graph API 자동 게시 + 카톡 5방 자동 배포 + 광고 A/B 5 밸리언트 통합

---

## 0. 왜 리부트 하는가

**대표님 지시 (2026-07-23 오후)**:
> 「카드뉴스가 아직 맘에 안 든다」
> 「원장님 artbrows_style 말고도 요즘 트렌디하고 센스티브한 것들을 많이 연구해서 가져오자」
> 「인스타그램 카드뉴스 다시 재조사해서 기획부터 다시 해 보자」
> 「지금까지 한 것은 아트브로우즈 스타일로 잘 정리하자」

**진단 (Track A 세션 결론)**:
- 문제 축 4개 다 걸림 (카피·이미지·레이아웃·전체 톤)
- Maison Noir 다크 톤은 프리미엄에는 강하나 「인스타 알고리즘 자극·킬러 훅」에는 무거움
- 대문자 세리프 (Rebellion Serif) 만 원장님 앵커로 지정 · 다른 4종은 archived
- **부분 수정이 아닌 근본 재기획** 필요

---

## 1. 두 트랙 구조 (이번 리부트의 골격)

### Track A · ARTbrows Style System v1.0 (완결 · 유지)
- 정본: [`docs/ARTBROWS-STYLE-SYSTEM-v1.md`](ARTBROWS-STYLE-SYSTEM-v1.md)
- 17 스타일 프리셋 + 12 kind + Maison Noir + Cormorant Garamond + 「털 같은 눈썹」 어휘
- 앵커 = **12 Rebellion Serif** (원장 승인)
- 시안 4세트 archived (13·14·15·16) · 폐기 X · 사고 흔적 보존
- ARTbrows 자체 브랜드 정체성 라인 = 이 트랙에서 계속 유지

### Track B · 리부트 (이번 Fable 5 세션에서 진행)
- **미션**: 「요즘 트렌디하고 센서티브한」 인스타 카드뉴스 트렌드 재조사 → 새 스타일군 발굴
- Track A 폐기 X · Track A 옆에 새 라인 (예: `trend-a` `trend-b` …)
- 최종 원장님/대표님이 두 트랙 위에서 선택

---

## 2. Fable 5 세션 시작 시 즉시 할 것 (Sequence)

### Step 1 — 컨텍스트 이해 (10분)
1. 이 문서 정독
2. [`docs/ARTBROWS-STYLE-SYSTEM-v1.md`](ARTBROWS-STYLE-SYSTEM-v1.md) 읽어 Track A 현황 파악
3. 앵커 12 Rebellion Serif JSON 열어보기: [`app-next/content/cardnews/2026-07-23-style12-rebellion-serif.json`](../app-next/content/cardnews/2026-07-23-style12-rebellion-serif.json)
4. archived 4세트 훑어보기 (Track A 이 지점까지의 사고 흔적)

### Step 2 — 대표님과 리서치 축 확정 (기획 회의 20~30분)
아래 축은 스케치. Fable 5 세션 시작 시 대표님과 확정 후 진행.

**리서치 축 후보**:
- **A. 국내 뷰티·아카데미 인스타 톱** — 유미코리아 · 뷰티계 톱 원장 계정 · 국내 럭셔리 뷰티 스토어
- **B. 해외 뷰티 브랜드 인스타** — Dior Beauty · Chanel Beauty · Sulwhasoo · Aesop · Le Labo · Byredo · Glossier
- **C. 럭셔리 매거진 인스타** — Vogue · Harper's Bazaar · Elle · Kinfolk · Cereal · The Gentlewoman
- **D. 중국·일본 뷰티 인플루언서** — 소홍서 초하실 야생 눈썹 트렌드 · 일본 미용사 인플루언서
- **E. 인스타 크리에이터 카드뉴스 전문가** — Canva 트렌드 리포트 · 인스타 크리에이터 마켓 톱
- **F. 뷰티 아닌 럭셔리 브랜드** — 명품 시계 · 향수 · 주얼리 (매거진 카드뉴스 톤)
- **G. 2026 하반기 카드뉴스 디자인 트렌드** — Awwwards · Designspiration · Behance 카드뉴스 카테고리
- **H. Reels-first 브랜드** — 정지 이미지가 아닌 움직이는 카드뉴스 · 인스타 릴스 커버 톱

**대표님이 참고하고 계신 계정·자료** 있으면 최우선 (없으면 위 축에서 확정)

### Step 3 — 리서치 실행 (Fable 5 · WebSearch · Agent 병렬)
- 축별 1 Agent 병렬 실행 (Fable 5 + WebSearch · WebFetch)
- 각 Agent → 「이 축에서 「센서티브·트렌디」 인 브랜드 5~10 계정 · 대표 카드뉴스 6~10개 스크린샷 · 왜 눈길이 갈지 300~500자 분석」 형식
- 결과 = `docs/TRENDS-{axis}-2026-07-23.md` 6~8 문서

### Step 4 — 인사이트 합성 (Fable 5)
- 축별 리서치 → **공통 트렌드 요소 추출** (컬러·폰트·레이아웃·움직임·톤)
- ARTbrows 앵커 (12 Rebellion Serif) 와 대비 · 어디를 흡수/거절할지
- 신 스타일 후보 3~5개 스케치 (「trend-a」 `trend-b` `trend-c` …)

### Step 5 — 원장님·대표님 검토 → 시안 1~2 개 착수
- 신 스타일 3~5개 중 원장님 승인 1~2개
- 시안 JSON 생성 (SAFE POOL 재사용 · 필요 시 신규 힉스필드/Gemini)
- Track A 와 나란히 프리셋 등록

---

## 3. 세션 인계 시 유용한 파일 링크

**정본 문서**
- [`docs/ARTBROWS-STYLE-SYSTEM-v1.md`](ARTBROWS-STYLE-SYSTEM-v1.md) — Track A 정본
- [`docs/CARDNEWS-STATUS-AND-NEW-STYLES-2026-07-23.md`](CARDNEWS-STATUS-AND-NEW-STYLES-2026-07-23.md) — Track A 세션 진행 기록 (직원 진단 + 신 5종 제안 · 원본)
- [`docs/CARDNEWS-STYLE-REFERENCE-2026-07-20.md`](CARDNEWS-STYLE-REFERENCE-2026-07-20.md) — 스타일 카탈로그 (17종 · 원본)
- [`docs/ASSETS-INVENTORY-2026-07-20.md`](ASSETS-INVENTORY-2026-07-20.md) — SAFE POOL 자산 카탈로그

**코드**
- [`app-next/src/lib/cardnews-agents/style-presets.ts`](../app-next/src/lib/cardnews-agents/style-presets.ts) — 17 스타일 프리셋
- [`app-next/src/app/cardnews/cardnews.css`](../app-next/src/app/cardnews/cardnews.css) — 매거진 CSS + chrome opt-out
- [`app-next/src/app/cardnews/types.ts`](../app-next/src/app/cardnews/types.ts) — 12 kind 정의

**시안**
- draft (앵커 유지): `app-next/content/cardnews/2026-07-23-style12-rebellion-serif.json`
- archived (참고): `2026-07-23-style13/14/15/16-*.json`
- 이전 산출물 (참고): `2026-07-20-*.json` · `2026-07-21-*.json` · `2026-07-22-*.json`

**메모리 (중요 원칙)**
- [`artbrows-luxury-dark-tone-final`](../CLAUDE.md) — 2026-06-29 Luxury Dark 최종 확정
- [`artbrows-maison-noir-reference-2026-07-20`](../CLAUDE.md) — Maison Noir 팔레트 정본
- [`artbrows-persona-tone-standard`](../CLAUDE.md) — 인물 톤 표준 (2026-06-29)
- [`artbrows-cardnews-styles-11-2026-07-20`](../CLAUDE.md) — 최초 11 스타일 결정
- [`artbrows-cardnews-new-5-styles-2026-07-23`](../CLAUDE.md) — Top 5 승격 (Track A)
- [`model-fable5-for-planning`](../CLAUDE.md) — 기획·리브랜딩 = Fable 5 사용

---

## 4. 리부트 시 주의 사항 (Track A 통찰에서)

1. **「털 같은 눈썹」 어휘는 모든 트랙 유지 필수** · 원장님 25년 브랜드 정체성
2. **원장님 실제 얼굴 AI 생성 금지** · Silhouette 은 실 촬영 후 교체 예정 (임시 Gemini 있음)
3. **실 시술 비포&애프터 AI 생성 금지** · 허위광고 리스크
4. **인스타 chrome (@handle · 해시태그)** = 스타일별 opt-out 완료 · Fable 세션에서 새 스타일 만들 때도 이 규칙 유지
5. **Maison Noir 폐기 여부** = 대표님/원장님 결정 · Track A 는 유지 · Track B 결과가 「살구핑크로 돌아가야」 나 「완전 다른 팔레트」 나올 수 있음 · 그때 결정

---

## 5. Fable 5 세션 진입 시 대표님이 해야 할 것

1. **/model fable-5** 실행 (모델 전환)
2. **이 파일 열기**: `docs/CARDNEWS-REBOOT-BRIEFING-2026-07-23.md`
3. **참고 계정·자료 공유** (있으면) — 원장님·대표님이 「이런 톤 좋아요」 인 인스타 계정 URL
4. **리서치 축 확정** (2 절 축 후보에서)
5. → 리서치 실행

---

**최종 업데이트**: 2026-07-23 · Track A 세션 마지막에 인계 준비
**정본 담당**: Fable 5 세션 시작 시 이 문서 읽고 즉시 반영
