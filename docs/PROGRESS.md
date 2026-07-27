# ARTbrows Platform — 진행 상황

> 매 작업 자동 갱신 · 최신본 우선

## 🌐 라이브 도메인 (영원히 안 바뀜)

**https://lab.staris.cloud** · **https://eyebrows.staris.cloud** (외부 홈피 · Vercel `eyebrows-main`)

가비아 staris.cloud DNS + Vercel SSL · sosodamda 가족 도메인

## 🆕 2026-07-27 (일) · 카드뉴스 시연 대개편 + 홈페이지 유미 벤치 대대적 업데이트 ★★★★

**9시 시연 (회장·대표·본부장·원장) 대비 4~5시간+ 작업 · 대표님 「완료」 트리거로 기획서 v1.2 → v1.3 자동 반영**

### A. 카드뉴스 완전 개편 (2 큰 축 중 1)
- **스타일 시스템 17종 → 5+Custom** — 시각 차별화 명확 것만: 정본 `artbrows-real` (원장 07-24 배포본) + 트렌드 4 (Rebellion · Grain Frame · Vertical Column · Silhouette) + Custom. 폐기 11종은 `LEGACY_ALIAS` 매핑
- **편집기 3열 상시 인스펙터** (모비딕 `pages/mobydick-detail-agent` 벤치 · CLAUDE.md §7.1 참조 원칙 신설) — `OverlayInspector.tsx` 신설 · QuickEditModal 제거 · 스타일 프리셋 6 + 오버레이 인스펙터 + AI 카피 팔레트 + 오버레이 목록 상시 노출
- **🎯 문장 교체 (스타일 카피)** — 미리보기 위 마우스 드래그 → **Gemini Vision 3.1 Pro** 로 폰트·색·크기·배경 감지 → 원본 스타일 그대로 · 문장만 대체. `analyze-region` API 신설
- **리뉴얼 = 팔레트 배치** — OCR 감지 텍스트를 편집 가능한 팔레트로만 저장 · 원장님이 「원본 스타일」 or 「기본 위치」 선택 배치. 원본 이미지는 그대로 유지
- **4안 양산** (Gemini 2 + OpenAI 2 · temperature 0.55/1.05 · STABLE/BOLD 톤) → 2×2 그리드 나란히 미리보기 → 원장님 확정
- **모델 최신화** — Gemini `3.1-pro → 3.0 → 3 Flash → 2.5` · OpenAI `gpt-5.1 → 5-pro → 5 → 5-mini → 4.1` 폴백 체인 3곳 통일

### B. 홈페이지 유미(youme-beauty.com) 벤치 하이브리드 · 4 Phase 완료
- **정본 벤치**: `https://youme-beauty.com/` (대표님 확정)
- **AI 8인 회의 만장일치 C안 (하이브리드)** — Maison Noir 톤 유지 + 유미 5 요소 훔침
- **Phase 1**: 데스크톱/모바일 완전 분리 (반응형 X · 유미처럼 진짜 2 컴포넌트) — `page.tsx` UA SSR 분기 · `HomePage.tsx` → `HomePageDesktop.tsx` 리네임 · `HomePageMobile.tsx` 신설 · `FloatingCTA.tsx` (데스크톱 6 + 모바일 3 + K1 실시간 카운터)
- **Phase 2**: `BeforeAfterCarousel.tsx` (VOGUE BEAUTY 톤 3장) · `AtelierTour.tsx` (아틀리에 4장 크로스페이드) · CONCERN 4 페르소나 카드 (완전 초보 · 재교육 · 창업 · 심화)
- **Phase 3**: `TrustAssets.tsx` (특허·상표 3장 라이트박스 + 창업 수백여명 + 26년 강의노트 117p PDF 다운로드) · 4 섹션 압축 폐기 (AI STUDIO · CONSULT · STARTUP · INSTRUCTOR → CONCERN + CURRICULUM + TrustAssets 3중 노출 흡수)
- **Phase 4**: 모바일 히어로 얼굴 안전 크롭 · 하단 CTA `safe-area-inset` 대응
- **결과**: 데스크톱 14,920 → 15,560px (신규 3섹션 임팩트 반영) · 모바일 **25,133 → 4,963px (80% 압축)**

### C. 재발명 방지 · CLAUDE.md §7.1 신설
- **원칙**: 카드뉴스·편집 UI 만들기 전 `C:\Users\dobi\pages\mobydick-detail-agent` 먼저 참조. 재발명 금지
- 메모리 `pages-folder-reference-rule.md` (다른 세션에도 자동 적용)

### 시연 대비 정본 3 문서 (완비)
- `docs/DEMO-SCRIPT-2026-07-27-v2.md` — 30분 시연 시나리오 (오프닝 + Pattern A + 편집기 + Pattern B + Q&A)
- `docs/TUTORIAL-CARDNEWS-2026-07-27.md` — 원장님 실사용 튜토리얼
- `docs/HOMEPAGE-BENCHMARK-YOUME-2026-07-27.md` — 유미 vs 우리 비교표 + AI 8인 회의 + 3안 도출

### 산출 파일 (신설/수정/폐기)
- **신설 컴포넌트 7**: `OverlayInspector` · `FloatingCTA` · `HomePageMobile` · `BeforeAfterCarousel` · `AtelierTour` · `TrustAssets` · `analyze-region` API
- **자산 3**: `public/brand/patents/patent-01~03.jpeg` 복사
- **수정 주요**: `HomePageDesktop.tsx` (구 HomePage 리네임 + 4섹션 삭제 + 3섹션 신규) · `Editor.tsx` (3열 재구성 + 문장 교체) · `ImageWithOverlay.tsx` (dragCapture prop) · `style-presets.ts` (17→5) · `models.ts` (최신 폴백) · `FromImagesWizard.tsx` (4안 양산) · `reimport route.ts` (팔레트 hint) · `types.ts` (TextOverlay + CopyPaletteItem)
- **CLAUDE.md**: §7.1 pages 참조 원칙 신설
- **메모리 2**: `pages-folder-reference-rule.md` · `homepage-update-plan-2026-07-27.md`

---

## 🆕 2026-07-23 (수) · 카드뉴스 신규 5 스타일 승격 + 시안 5세트 · 원장 승인 대기 ★★★

전직원 관점 정리 세션 → **원장님 「Top 5 승격」 결정** → 코드+시안 병행 실행 완료. 이제 원장님이 편집기에서 5 스타일 즉시 선택·자동 생성 가능.

### 원장님 결정 (07-23)
- **Top 5 승격 확정** — Blur Reveal(17) 제외
  - 🥇 12 Rebellion Serif · 🥈 13 Grain Frame Editorial · 🥉 14 Vertical Column Story · 15 Broken Grid Editorial · 16 Silhouette Reveal
- **실행 순서 = 병행** (코드 + 시안 동시)
- **Silhouette 임시 이미지 = Gemini 2.5+ 로 즉시 생성** (원장 실 촬영 후 교체)

### 신규 5 스타일 프리셋 추가 (`app-next/src/lib/cardnews-agents/style-presets.ts`)
- 기존 11개 (1~10 트렌드 + 11 Custom) → **17개**로 확장 (1~10 유지 + 12~16 신규 + 17 Custom 재번호)
- 각 스타일 별 `recommendedKinds` · `copyToneHints` · `layoutHints` · `useCase` 정의 완성
- **자동 인식**: `STYLE_PRESET_LIST` (order 정렬) 를 통해 `GenerateModal` UI · API 3종 (prepare/slide/finalize) · agents `presetToPromptHint()` · orchestrator 전부 별도 수정 없이 신규 5종 인식

### Silhouette 임시 이미지 (Gemini 3 Pro Image Preview · 첫 시도 성공)
- 스크립트: `app-next/scripts/generate-silhouette-2026-07-23.mjs`
- 입력: `founder-persona/founder-01.png` (AI 페르소나)
- 출력: `founder-persona/silhouette-01.png` (575 KB · 다크 배경 + 골드 rim light + 프로필 실루엣 + 좌측 여백)
- 사용 모델: `gemini-3-pro-image-preview` (폴백 체인 6개 정의 · 첫 시도 성공)
- ⚠️ 원장님 실 촬영 후 교체 예정

### 시안 5세트 JSON (`app-next/content/cardnews/2026-07-23-style*`)
- `2026-07-23-style12-rebellion-serif.json` — 6장 · 「HYPER REAL」 대문자 훅
- `2026-07-23-style13-grain-frame.json` — 6장 · 「선릉 · 오후 3시」 아틀리에 저널
- `2026-07-23-style14-vertical-column.json` — 6장 · 「털 같은 눈썹 3원칙」 Ⅰ.Ⅱ.Ⅲ.
- `2026-07-23-style15-broken-grid.json` — 6장 · 「결.」 룩북 극사실 169
- `2026-07-23-style16-silhouette-reveal.json` — 6장 · 「20년 · 한 사람의 손끝」 미스터리
- 각 JSON = 이미 존재하는 SAFE POOL 이미지만 사용 · 크레딧 0원 (Silhouette 1장만 신규 Gemini)
- 각 JSON 에 `stylePreset` 필드 명시 · 편집기·미리보기에서 스타일 톤 검증 가능

### 관련 문서
- 정본: [`docs/CARDNEWS-STATUS-AND-NEW-STYLES-2026-07-23.md`](CARDNEWS-STATUS-AND-NEW-STYLES-2026-07-23.md) — 전직원 10명 관점 진단 + 신 스타일 6종 제안 + 원장 결정 5건

### 남은 결정 (원장님 → 다음 세션)
- **각 시안 5세트** 원장님 눈으로 확인 후 「살릴 것 / 톤 조정 / 폐기」 표시
- **원장 실루엣 실 촬영 스케줄** (Silhouette 실 이미지 교체용)
- **15기 모집 발송 최종 스타일** (09 Announcement / 12 Rebellion Serif / 16 Silhouette 중 택 1)
- **인스타 실 게시 API 통합 여부**
- **카톡 오픈채팅 자동 배포 재개 시점** (송하은 · kakaoschedule)

### 🔀 07-23 저녁 · Track A 완결 + Track B 리부트 착수 ★★★★

**대표님 피드백**: 「카드뉴스가 아직 맘에 안 든다 · 원장님 artbrows_style 말고도 요즘 트렌디·센서티브한 것들 재조사 · 기획부터 다시 · 지금까지 한 것은 아트브로우즈 스타일로 잘 정리하자」

**결정 (하네스 공법 · 개발 STOP · 기획 회귀)**:
- 이 세션의 17 스타일 · 시안 5세트 = **Track A · ARTbrows Style System v1.0** 으로 정본화
- 앵커 = **12 Rebellion Serif** 유지 (원장 승인 확정)
- 시안 4세트 (13·14·15·16) status → `archived` · 폐기 X · 사고 흔적 보존
- 신 트렌드 재조사 = **Track B** · 다음 Fable 5 세션에서 진행

**신규 정본 문서 2건**:
- [`docs/ARTBROWS-STYLE-SYSTEM-v1.md`](ARTBROWS-STYLE-SYSTEM-v1.md) — Track A 정본 (17 스타일 · 12 kind · 앵커 · SAFE POOL · 통찰)
- [`docs/CARDNEWS-REBOOT-BRIEFING-2026-07-23.md`](CARDNEWS-REBOOT-BRIEFING-2026-07-23.md) — Track B Fable 5 세션 인계 브리핑 (미션 · 리서치 축 · 시퀀스 · 주의사항)

**Fable 5 세션 진입 시 대표님이 해야 할 것**:
1. `/model fable-5` 실행
2. `docs/CARDNEWS-REBOOT-BRIEFING-2026-07-23.md` 열기
3. 참고 계정·자료 공유 (있으면)
4. 리서치 축 확정 → 실행

### 🆕 07-23 저녁 v2 · 대표님 방향 재확정 「모비딕 자동화 + 전문가 영역」

**대표님 지시 (오후 늦게)**: 「모비딕 상세페이지 자동화와 전문가 영역처럼 제대로 된 카드뉴스 생성기가 필요하다」

**갭 분석 완료** (`D:\work\danzi\pages\mobydick-detail-agent` · 141 파일 · 1,880줄 조사):
| # | 축 | 모비딕 | ARTbrows | 갭 |
|---|---|---|---|---|
| 1 | 산출물 스펙 YAML 정본 | ✅ 13장 필수요소 | ⚠️ TS 프리셋만 | 🔴 |
| 2 | 6 에이전트 파이프 | ✅ collector·researcher·copywriter·prompter·designer·orchestrator | ⚠️ 4 (designer·collector 없음) | 🟡 |
| 3 | 파일 구조 (input·intermediate·output) | ✅ | ⚠️ 프로젝트별 단일 JSON | 🟡 |
| 4 | 품질 게이트 (7/10 재생성) | ✅ | ❌ | 🔴 |
| 5 | HTML→PNG 자동 (Playwright) | ✅ | ❌ 원장님 수동 | 🔴 |
| 6 | CLI 표준 진입점·배치 | ✅ | ❌ | 🔴 |
| 7 | 브랜드 스타일 YAML | ✅ | ⚠️ TS | 🟢 |

**리팩토링 로드맵** (Fable 5 세션에서 확정 · 4 Phase 5~7주):
- Phase 1 (1주): 기획·설계 · YAML 스펙 정본화 · 6 에이전트 재설계
- Phase 2 (2~3주): 코어 파이프 구현 · designer 신설 · quality 신설 · CLI orchestrator
- Phase 3 (1~2주): Meta Graph API 자동 게시 + 카톡 5방 배포 결합
- Phase 4 (1주): 광고 A/B 5 밸리언트 자동화

**신규 정본 문서**:
- [`docs/MOBYDICK-DETAIL-AGENT-BENCHMARK-2026-07-23.md`](MOBYDICK-DETAIL-AGENT-BENCHMARK-2026-07-23.md) — 모비딕 구조 · 갭 7축 · 「전문가 영역」 A/B/C 3 해석 · 리팩토링 로드맵
- [`docs/MEETING-2026-07-23-CARDNEWS-REBOOT-FULLSTAFF.md`](MEETING-2026-07-23-CARDNEWS-REBOOT-FULLSTAFF.md) — 10명 개선안 · 통합 축 8 · 리스크 Top 7 · 결정 대기 8건

**Fable 5 세션 인계 브리핑 v2**: [`docs/CARDNEWS-REBOOT-BRIEFING-2026-07-23.md`](CARDNEWS-REBOOT-BRIEFING-2026-07-23.md) 상단에 v2 섹션 추가 (「단순 신 스타일 리서치」 → 「프로덕션 파이프 + 신 스타일 리서치」 병행)

**대표님 결정 대기 (긴급 · 우선순위)**:
1. **「전문가 영역」 정의** — A (프로덕션 자동화) / B (디자인 완성도) / C (프로세스 표준화) / 통합
2. **리팩토링 리드 담당** — 김다은 페르소나 「모비딕 패턴 6개월 학습」 · 리드 확정할지
3. **8월 말 오픈 vs 리팩토링** — 오픈 이후 시작할지 · 병렬 진행할지

**✅ 대표님 3 결정 확정 (2026-07-23 저녁)**:
1. 「전문가 영역」 = **B. 디자인 완성도** (에이전시 수준 시각 퀄리티) — 프로덕션 자동화(A)·프로세스 표준화(C)는 부차
2. 리팩토링 시점 = **병렬** (오늘부터 Fable 5 세션 · 8월 말 오픈과 동시)
3. 리드 = **김다은** · CTO 지원 = **한승철**

**Track B 무게중심 재조정**: 「신 스타일 리서치 = 시각 퀄리티 중심」 · 인스타 뷰티·매거진·글로벌 브랜드 톱 계정 시각 요소 정량 수집이 최우선 · designer 에이전트 시각 품질 극대화가 파이프 핵심

### 🌏 07-23 저녁 · Track B 리서치 3축 병렬 실행 완료 (Opus 세션) ★★★★

**대표님 재지시**: 「중국이나 한국 눈썹 관련 트렌디한것들을 잘 모아 봐라」 → 3 Agent 병렬 실행 · 총 ~200,000 토큰 · 3 리서치 완료

**결과**:
- **축 1 · 중국 샤오홍슈**: Top 10 인플루언서 (久匠·四七美学·梨丸儿 등) · 「一人一眉」·「小清新」 톤·思源宋体·캐러셀 우세
- **축 2 · 중국 도우인/티엔마오**: Top 10 브랜드 (久匠·妮丽雅·清华眉毛师 등) · 숫자 앵커·정면+측면 스택·황금비율 오버레이·60초 릴스·의료광고법 회피 표현 목록
- **축 3 · 한국 인스타 아카데미**: Top 10 계정 (유미코리아·눈그림·**청담리**·AMORJ 등) · **Quiet Luxury 진영 발견** · **「털 같은 눈썹」 시장 선점 확정** (경쟁 히트 0) · 명조 세리프 = 럭셔리 시그널

**3축 공통 문법 6개** 도출 → 신 스타일 후보 5개 스케치 완료:
- 🥇 A · 一人一眉 · 결정 트리 캐러셀 (中·韓 통합)
- 🥈 B · Numbered Trust · 대형 세리프 숫자 스택 (팀 최우선 추천)
- 🥉 C · Golden Grid Portrait · 골드 격자 오버레이 (도우인 리스킨)
- D · Quiet Luxury × 극사실 · 청담리 톤 흡수
- E · Founder Documentary · 원장 20년 다큐 (실 촬영 필요)

**신규 정본 문서 2건**:
- [`docs/TRENDS-CHINA-KOREA-EYEBROWS-2026-07-23.md`](TRENDS-CHINA-KOREA-EYEBROWS-2026-07-23.md) — 3축 리서치 통합·공통 문법 6·톤 결론
- [`docs/NEW-STYLE-CANDIDATES-2026-07-23.md`](NEW-STYLE-CANDIDATES-2026-07-23.md) — 5 후보 상세 (컨셉·슬라이드 시퀀스·시각·리스크·선호도 매트릭스)

**Fable 5 세션 인계 브리핑 v4 갱신**: [`docs/CARDNEWS-REBOOT-BRIEFING-2026-07-23.md`](CARDNEWS-REBOOT-BRIEFING-2026-07-23.md) 상단에 v4 추가 (Track B 리서치 완료 · 5 후보 등재)

**대표님·원장 결정 대기 5건 (긴급)**:
1. 5 후보 중 몇 개 승격? (팀 추천 = Top 3 : B·A·E)
2. 각 후보 시안 JSON 생성 착수?
3. 원장 20년 스토리 실 사진 확보 가능? (E 착수 조건)
4. Reels 커버·Story 세트 병행 개발?
5. Fable 5 세션 진입 시점 (승격 후 리팩토링 Phase 1 착수)

### 🌐 공개 URL · 원장님·본부장 카톡 공유용
**https://deploy-briefing-ten.vercel.app** — 브리핑 페이지 (5 신 스타일 후보 · 3축 리서치 · 톤 결론 · 결정 대기 5건). 로그인 불필요. Maison Noir 매거진 톤 정본. Netlify numjou 크레딧 소진 우회 · Vercel 배포. 파일 재배포 절차 = [[vercel-deploy-briefing-2026-07-23]] 메모리 참조.

**https://deploy-translate.vercel.app** — 원장님 중국어 번역 사이트 (2026-07-26 재구축). OpenAI/Gemini 병행 + 모래시계 대기 UX + 서버 영상 라이브러리 + 재업로드 방지 + 자동 미리 번역. 백엔드 = 로컬 5099 + Cloudflare quick tunnel. 상세 = [[translate-zh-recovery-2026-07-26]] 메모리.

---

## 🆕 2026-07-25 (토) · 원장 실 톤 편입 + 스타일 11번 신설 + Silhouette 폐기 ★★★★★

**대표님 지시 3건**:
1. 「Silhouette 임시 이미지는 완전 없애라」 → silhouette-01.png + generate 스크립트 삭제 · 시안 16 archive
2. 「`assets/20260725` 사람이 직접 만든 것 참조하자」 → 원장 07-24 카톡 배포 자료 14 파일 + mp4 SAFE POOL 편입
3. 「여러 스타일 필요 · 계속 방향성 틀 필요 X」 → 기존 17 스타일 유지 + 원장 실 톤 하나 추가 병존 (Track A/B/원장 정본 3 라인)

**원장 실 톤 정본 (2026-07-24 카톡 배포본)** — 프리텐다드 볼드 산세리프 + 반투명 갈색 박스 + 실 강의 사진 + 「QUESTION 1~4」 pill · Maison Noir 세리프 매거진과 완전 다른 톤 · Track A/B 위에 3라인으로 병존

**새 SAFE POOL 자산 (public/brand/)**:
- `founder-real-2026-07-24/` — 실 강의 사진 8장 + 강의 영상 1 (원장·수강생·시술 손 · AI 이미지 아님)
- `reference-cards-2026-07-24/` — 원장 완성 카드뉴스 6장 (참고 정본)

**신규 스타일 프리셋** — `style-presets.ts` order=11 `artbrows-real` (★★★★★ 원장 실 톤 정본) · showInstaChrome:false · hero-portrait × 6 통짜

**신규 시안** — `2026-07-24-founder-real-somyo3day.json` (극사실소묘 3일 집중수업 · 원장 배포본 6장 그대로) · 뷰어 http://localhost:3000/cardnews/view/2026-07-24-founder-real-somyo3day

**Silhouette Reveal (16번)** — 임시 이미지·생성 스크립트 삭제 · 시안 archive · 프리셋만 유지 (원장 실 촬영 후 재활성)

**신규 정본 문서 2건**:
- [`docs/JANGMIJI-REAL-TONE-2026-07-24.md`](JANGMIJI-REAL-TONE-2026-07-24.md) — 원장 실 톤 정본 분석 · 스타일 다양성 라인업 17종 · 월요일 시연 재조정
- [`docs/CARDNEWS-TEST-FEEDBACK-2026-07-25.md`](CARDNEWS-TEST-FEEDBACK-2026-07-25.md) — 대표님 실 테스트 트래킹 (07-25~26)

**월요일(07-27) 시연 재조정** (재조정 아님·확장) — 기존 15분 대본 + 1분 스텝 3 삽입 「원장 정본 시안 (07-24 배포본 그대로 재현)」

**대표님·원장 결정 대기 (오늘 신규)**:
1. 원장 정본 6장 참조 시안 = 월요일 시연에 포함 확정?
2. mp4 강의 영상 = Reels 커버 소재로 활용?
3. `artbrows-real` 스타일용 다음 시안 (창업반 890·이지 69·15기 모집 각 1세트) 착수?
4. Track B 5 후보 실 렌더 육안 검증 (07-24 유나 지적) 여전히 남음
5. Silhouette 실 촬영 스케줄 (16번 재활성 조건)

---

## 🆕 2026-07-18 (토) · 07-20 회의 검수 대비 문서 3종 완성

07-17 저녁 폭발적으로 만든 카드뉴스 시스템 + 3언어 홈피를 원장님·본부장이 검수할 수 있는 형태로 정리. 07-20 (월) 09:00 회의에서 이 3종 위에 수정 표시.

### 신규 문서 3종 (`app-next/docs/` · `app-next/scripts/`)

1. **[I18N-REVIEW-2026-07-18.md](../app-next/docs/I18N-REVIEW-2026-07-18.md)** — EN/ZH 번역 검수표
   - 10 섹션 KO/EN/ZH 3열 대조표 (meta·utility·hero·philosophy·signature·tracks·axes·global·CTA·footer)
   - 원장님·본부장이 셀 단위 「검수」 열에 수정 표시 → 확정 후 `src/lib/i18n/messages.ts` 반영
   - 검수 포인트 5개 (Hyper Realistic vs Hyperreal · 「操作」/「治疗」 · Lock-in 뉘앙스 · 「精英」 강도 · 「进军」 어감)

2. **[CARDNEWS-CHECKUP-2026-07-18.md](../app-next/docs/CARDNEWS-CHECKUP-2026-07-18.md)** — 카드뉴스 시스템 검수·사용법 시트
   - 접속 URL 8개 한눈에 (대시보드·편집기·뷰어·12종 데모·튜토리얼·홈 3언어)
   - 12종 슬라이드 레이아웃 × 6톤 카테고리 매트릭스 + 원장님·본부장 체크리스트
   - 자동 생성 4-스텝 위저드 흐름 (Setup → Preparing → Slide 팝업 20초 카운트다운 → Saving)
   - 10 스타일 프리셋 표 (artbrows 정본 = 디폴트 + 8종 트렌드 + live-trend)
   - 권장 검수 워크플로 6단계 · 알려진 이슈 4건 · 07-20 회의 준비물 4건

3. **[capture-for-review-2026-07-18.ps1](../app-next/scripts/capture-for-review-2026-07-18.ps1)** — Edge headless 캡처 스크립트
   - 서버 실행 중일 때 8종 URL 자동 PNG (홈 3언어·카드뉴스 대시보드·12종 데모·튜토리얼·상담·연락)
   - 결과: `_brief/review-captures-2026-07-18/*.png`
   - 원장님·본부장이 서버 없이 훑을 수 있도록 (검증된 msedge --headless=new 방식)

### 다음 (07-19 ~ 07-20 오전)

- 원장님·본부장 3종 문서 배포 → 검수 표시
- 07-18 마감이었던 **PG사 확정** (원장님·박대표) — 별건, 아직 결정 안 됨
- 07-16 지난 마감 **카페24 계정 개설** — 별건, 아직 진행 안 됨
- 07-20 (월) 09:00 회의 : 위 3건 + 신규 결정 대기 D 카페24 상품 등록 범위

---

## 🆕 2026-07-17 (금) · 브랜드 방향 대전환 + 카드뉴스 시스템 + 3언어 홈피 ★★★

### 아침 카톡 회의 (원장님·본부장·박대표)
- **11:11 원장님**: "고급 시술이고 해외까지 생각하면 발랄·젊은 느낌 X. 홈피도 브랜드 이미지 고려해 모노톤·고급으로."
- **11:14 본부장**: "발랄 X 젊음 X → 프로페셔널·커리어·오피스. 블랙·골드·오렌지·퍼플."
- **11:42 원장님**: "브랜드 색상 컨셉이랑 맞추고, 너무 원색계열은 피해요." → **원색 계열 전면 금지 확정**
- **본부장 스토리보드 PDF**: GNB 2단 (톡·인스타·워드마크·5메뉴·CTA / 딥 블랙+골드) + Hero + 컬러 팔레트 결정 요청 + IA 결정 요청
- **본부장 카드뉴스 벤치마크 5장**: "각 슬라이드 다른 레이아웃" 지시 (동일 템플릿 폐기)
- **원장님 통합 브랜드 가이드 2장** (`public/brand/founder/2026-07-17-integrated-guide-1·2.png`): **6톤 팔레트 정본** (treatment/founder/review/classroom/detail/reels) + 콘텐츠 필러 40/20/15/15/10 + 비주얼 통일 규칙 (웜톤·세미매트·Canva 브랜드킷)

### artbrows style 모듈 정형화 (`app-next/src/lib/artbrows/`)
- **tokens.ts** — `artbrowsColors`·`artbrowsFonts`·`artbrowsPalette` 6톤·`artbrowsContentPillars`·`artbrowsVisualRules`·`artbrowsForbidden` 금지 목록
- **tokens.css** — `--ab-black/gold/ivory/*` + `--ab-cat-*-bg/fg` 6쌍 + `.ab-cat-*` 유틸리티 클래스
- **README** — 원장님 지시 원문·6톤 팔레트·콘텐츠 필러·비주얼 규칙·금지 목록·갱신 이력

### 카드뉴스 12종 레이아웃 (원장님 정본 톤 · 각 슬라이드 다른 레이아웃)
- CoverFounder · NumberBig · IconDuo/Trio · Checklist · PortraitFrame · ProductHero · QuoteBold · SignatureStyle · CurriculumRow · PriceTable · ClosingCTA
- 모든 컴포넌트 `slideFrameProps(category)` → `.slide-frame.ab-cat-{cat}` + `data-tone` 자동 · 색·폰트 리터럴 0건 (`--ab-*` 토큰만)

### 카드뉴스 프로젝트 관리 시스템 (모비딕 방식 · 로컬 JSON)
- 8인 AI 직원 회의 → **Supabase 대신 모비딕 방식 최종 채택** (원장님 「파일로 저장」 요구 매치 · mobydick-hub `fs.readFile/writeFile` + mobydick-detail-agent `{id}/*` 패턴 · 07-13 연구소 PC 이관 계획과 정합)
- **저장**: `app-next/content/cardnews/{id}.json` (git 관리)
- **API**: `/api/cardnews` (GET 목록·POST 신규/import) · `/api/cardnews/[id]` (GET·PUT·DELETE·복제) · `/api/cardnews/upload` (파일 업로드 · multipart · `public/brand/uploads/`)
- **화면**: `/cardnews` 대시보드 · `/cardnews/edit/[id]` 3분할 편집기 (좌 슬라이드 리스트 + 중 kind별 폼 + 우 실시간 미리보기) · `/cardnews/view/[id]` 미리보기 · `/cardnews/layouts` 12종 데모
- **파일 업로드**: `ImageInput` 컴포넌트 (📁 업로드 버튼 · 미리보기 · × 지우기) — cover-founder·portrait-frame·product-hero 의 `imageSrc` 필드에 적용 · 15MB 제한 · png/jpeg/webp/gif/svg 허용

### 카드뉴스 다국어 (Phase 1 · KO/EN/中 통합)
- 데이터 모델: `translations: { ko, en, zh }` 각각 `{ title, slides }` · 기존 최상위 `slides` 자동 마이그레이션 (`migrate()`)
- 편집기: 상단 언어 탭 (KO/EN/中) · 「기본 언어에서 복사」 버튼 · 언어별 title
- 미리보기: `?lang=ko|en|zh` 파라미터 + 언어 스위처 UI · 빈 언어는 "만들기" 안내
- 대시보드: 각 프로젝트 행에 3언어 pill (`KO 6 · EN — · 中 —`) · 기본 언어 골드 테두리

### 홈페이지 3언어 (Phase 2 · i18n)
- `src/lib/i18n/messages.ts` — 홈피 전체 텍스트 딕셔너리 KO/EN/ZH (Hero·Philosophy·Pillars·Tracks·Axes·Global·CTA·Footer 전부)
- `src/app/HomePage.tsx` — `lang` prop · messages 참조 공통 렌더 (기존 253줄 → 리팩터)
- `/` (한국어) · `/en` (English) · `/zh` (中文 간체) 각 페이지 신설
- GNB 언어 스위처 alert → 실 링크 (`/`, `/en`, `/zh`)
- 폰트: Noto Serif SC + Noto Sans SC 로드 (중국어 세리프 fallback) · `.serif` 에 fallback 추가
- ⚠️ EN/ZH 번역은 초안 · 원장님·본부장 검수 대기

### 홈페이지 500 복구
- `/` 500 원인: `/메인홈무드/` (한글 폴더) URL 이 Next.js 16 preload 헤더에서 ByteString 실패
- 해결: 폴더 `public/메인홈무드/` → `public/hero-mood/` rename · page.tsx 5곳 URL 갱신 → 200 복구

### 상단 GNB 유틸리티 바 (본부장 스토리보드 첫 페이지 반영)
- `page.tsx` 상단 유틸리티 바 신설: 톡·인스타·`ARTBROWS & ACADEMY` + 5메인메뉴 + [교육문의][시술상담] 골드 CTA
- 기존 하단 GNB (딥 블랙+골드)는 `top: 48px` 로 이동 · Hero padding-top 218px

### 저장 문서 (`app-next/docs/` 신규 4건)
- **BRAND-DIRECTION-2026-07-17.md** — 원장님 정본 톤 정본 (색·폰트·카피·레이아웃·6톤 팔레트·콘텐츠 필러·비주얼 규칙 통합)
- **MEETING-2026-07-17-KATALK.md** — 07-17 오전 카톡 회의록 (시간순·확정 사항·결정 대기)
- **HOMEPAGE-STORYBOARD-2026-07-17.md** — 본부장 스토리보드 3페이지 텍스트 정리
- **CARD-NEWS-LAYOUT-LIBRARY-2026-07-17.md** — 12종 × 6카테고리 매트릭스 + 본부장 벤치마크 5장 분석
- `app-next/public/brand/README.md` + `founder/` (원장님 자료) · `ref/` (본부장 벤치마크) 분리 구조

### 폐기 대상
- 어제 (07-16) enrollment 「아트브로우 (달력톤)」 스타일 · 크림 살구 계열 → 홈피 방향과 상충 · 폐기 확정 (참조 코드만 남김)

### 🪄 카드뉴스 AI 자동 생성 파이프라인 (오후 후반) ★★★
- **모비딕 detail-agent 패턴 이식** → 카드뉴스 자동 생성 (트렌드 조사 → 스타일 결정 → 카피 생성 → 저장)
- **멀티 모델 스택**: **Gemini 2.5 Flash + OpenAI GPT-4o** 병렬 (Anthropic 키 있으면 자동 확장 · 지금은 2 모델)
- **4 Agent**: trend-researcher · vision-analyzer (Gemini Vision) · stylist · copywriter
- **파이프라인**: `src/lib/cardnews-agents/{types,models,prompts,agents,orchestrator}.ts`
- **API**: `GET /api/cardnews/generate` (사용 가능 모델) + `POST` (실행 · maxDuration 300s)
- **UI**: 대시보드 「🪄 자동 생성」 버튼 → 모달 (목적·언어·슬라이드수·모델 선택 최대 2개·트렌드 조사·Vision 옵션)
- **검증**: Gemini 단독 4장 55초 · Gemini+OpenAI 병렬 4장 58초 · 원장님 정본 톤 (「결」 「손끝」 「무게」 「본질」) 재사용 · 각 슬라이드 2안 뚜렷한 다양성 확인
- **환경**: `npm install @google/genai openai` · `.env.local` 에 GEMINI/OPENAI 키 자동 추가 (secrets 폴더 참조)

### 🗑 삭제 버튼 추가
- 대시보드: draft 행에 「보관」 옆 **「🗑 삭제」** (즉시 완전삭제) · archived 는 그대로 「완전삭제」
- 편집기 상단 툴바: **「🗑 삭제」** 버튼 → confirm → 대시보드 자동 이동

### 🧹 태그 렌더 버그 수정 (AI 응답 정제)
- **원인**: Gemini/OpenAI 가 headline 안에 `<gold>`·`<highlight>` 태그를 그대로 삽입 → 텍스트로 렌더됨
- **해결 2축**:
  1. `prompts.ts` — 시스템 프롬프트에 **마크업 태그 절대 금지** 섹션 명시 (개념만 · 예시 없음 · backtick escape 이슈 회피)
  2. `sanitize.ts` 신규 — `stripMarkup()` + `extractFirstHighlight()` + `sanitizeSlide()` (재귀 문자열 필드 정제 + highlight 자동 추출)
  3. `agents.ts runCopywriter()` — 응답 → sanitizer 강제 통과 후 반환
- 검증: 재생성 3장 · tag/markdown issues **0건** · highlight 필드 자동 채움

### 🎨 10 스타일 프리셋 (원장님 요구 · artbrows 기본)
- **10개 프리셋**: [1] **artbrows** (기본 · 원장님 정본) + [2~9] 트렌드 8종 (minimal-editorial · bold-question · numbered-steps · quote-focus · before-after · data-card · poem-verse · announcement) + [10] **live-trend** (실시간 조사)
- **디폴트 = artbrows** (원장님 지시 "artbrows style 은 무조건 하나 있어야 됨 · 그게 디폴트")
- 프리셋별 `copyToneHints` + `layoutHints` 정의 · stylist/copywriter 프롬프트에 삽입
- 프리셋 = `isLive` 아닐 때 트렌드 조사 스킵 → **~10~15초 단축** (대량 생성 시 유리)
- UI: `GenerateModal` 스타일 선택 2열 그리드 · artbrows 기본 선택 · live-trend 는 초록 배지
- 기존 「트렌드 조사」 체크박스 제거 (live-trend 프리셋으로 대체)
- 파일: `src/lib/cardnews-agents/style-presets.ts` (10 프리셋 + `presetToPromptHint()`)
- 검증: artbrows(14s · 조사 스킵) · bold-question(9s · quote-bold 자연 배치) · live-trend(20s · 트렌드 조사 실행)

### 🔀 편집기 대안 안 교체 UI (자동 생성 후속)
- **CardnewsProject 확장**: `autoVariants?: AutoSlideVariants[]` 필드 · 자동 생성 시 모든 모델 안 함께 저장
- `finalize()` 확장 → `copySets` 받아 `autoVariants` 로 저장 · `orchestrate()` wrapper 함께 전달
- `GenerateModal` — 진행 중 `allCopySets[]` 누적 · finalize 호출 시 전송
- **편집기 우측 미리보기 하단** = 🪄 **AI 대안 안 카드** (자동 생성 프로젝트만 표시)
  - 각 안 = `● GEMINI · 현재` or `○ OPENAI` 라벨 + headline 미리 · 현재 안 골드 테두리
  - 클릭 → confirm → 슬라이드 즉시 교체 · dirty 표시
  - 하단에 skeleton.rationale (「왜 이 조합」) 이탤릭 표시
- 검증: Gemini+OpenAI 3장 자동 생성 → autoVariants 3세트×2안=6안 저장 · 편집기 UI 렌더 확인

### 🎬 Progressive 자동 생성 (슬라이드별 팝업 + 20초 타이머)
- **원장님 요구**: "한 장 한 장 나오면 미리보기 팝업으로 · 답 없으면 20초 후 자동 진행"
- **백엔드 3 API 분리** (기존 `/generate` 는 wrapper 로 유지):
  - `POST /api/cardnews/generate/prepare` — trend + vision + stylist → skeletons + trendHints
  - `POST /api/cardnews/generate/slide` — 한 슬라이드 copywriter (병렬 N안)
  - `POST /api/cardnews/generate/finalize` — 프로젝트 저장 → runId 반환
- **orchestrator.ts** 재구조: `prepare()` · `generateSlide()` · `finalize()` 함수 export · `orchestrate()` wrapper 유지
- **프론트 GenerateModal 4-스텝 위저드**: setup → preparing → slide (팝업 반복) → saving
- **슬라이드 팝업 UI**: 2 모델 안 나란히 · 클릭 선택 (골드 테두리) · 3 버튼 (여기까지 저장 · 다음 → (Xs) · 닫기)
- **20초 카운트다운**: `setInterval` · 답 없으면 자동 `onNext()` 호출 → 다음 슬라이드 API 자동 요청
- **부분 저장**: 「여기까지 저장」 언제든 · 지금까지 확정된 슬라이드만 저장 후 편집기 이동
- 검증: prepare 200 · slide 200 (6.4s) · dashboard 200 · 태그 정제 통과

## 🆕 2026-07-16 (목) · 캘린더 PNG 렌더 + enrollment 캐러셀 원장님 완성본 톤 매칭 ★★

원장님이 카톡으로 「8월 수업 일정 안내」 완성본 이미지 (`d:\work\jangmi\8월달력스케줄_원장버전.jpg`) 를 정본으로 지정 → 라이브 두 화면을 완성본 톤으로 통일.

### calendar.html — PNG 렌더 재구성

- **폰트**: 세리프 `Playfair Display` → **`Pretendard/Noto Sans KR` sans-serif** 로 교체 (원장님 완성본 매칭)
- **원 배지 규칙**: 이벤트 있음=타입색(beginner=핑크·consult=그린·custom=베이지·라벨에 OT=파랑) · 이벤트 없음=주말만(일=핑크·토=베이지) · 평일=원 없음 검정 숫자
- **pill**: 얇은 색 스트립이 검정 숫자를 감싸고 셀 사이 자연스레 이어짐 (grid gap:0 + 좌우 rounded)
- **pill 아래 라벨**: `position:absolute` 로 첫 mid 셀에만 표시 → 3일 이상 그룹의 좌우 셀 침범 겹침 완전 해소
- **격자**: 요일 헤더에만 세로 구분선 · 날짜 셀은 수평 격자만
- **pickEventLabel 수정**: 이벤트 `title`/`name` 우선 반환 (기존은 type 이름만)
- 검증: Playwright 로 8월 (원장님 완성본 재현) · 7월 (실 서버 데이터) PNG 프리뷰 캡처 · 대표님 육안 컨펌 ✅

### enrollment.html — 카드 6장 캐러셀

- **「아트브로우 (달력톤)」 스타일 신규 추가** — 크림 배경 #F5EED8 + Pretendard Black 검정 헤드라인 + 핑크 액센트 #F09FBB + 검정 CTA
- **로고 원본 유지 (전 스타일 통일)** — `.slide-brand` 를 **Caveat Bold 24px 필기체** 로 통일 · 스타일별 `font-family` override 전부 제거 (색만 배경 대비용 유지)
- **프리뷰 카드 이미지 렌더 로직 추가** — 편집 화면과 동일 (`s.imgUrl` 있으면 카드 상단 이미지 · 배지에 🖼️ 아이콘)
- **겹침 해소**:
  - 이미지 wrap 을 flex 흐름 첫 아이템으로 (`height:32%` + 카드 padding 상쇄 margin)
  - `.slide-preview.has-img` = `justify-content:flex-start` + `overflow:hidden`
  - CTA·brand `flex-shrink:0` · headline·body `flex-shrink:1;overflow:hidden` (넘치면 자연 잘림)
  - 카드 padding 24→16px · headline 22→17px · body 12.5→11px · brand `margin-top:auto` 하단 고정

## 🆕 2026-07-13 (월) 09:23 회의 — 홈페이지·쇼핑몰 스펙 확정 ★★★

**참석**: 회장님 · 대표님 · 원장님 · 개발 박정주 대표 · 임원 1인 (66분 10초)
**정본 회의록**: [`artbrows-platform-py/docs/MEETING-2026-07-13-MINUTES.md`](../artbrows-platform-py/docs/MEETING-2026-07-13-MINUTES.md)
**07-06 회의록**: [`artbrows-platform-py/docs/MEETING-2026-07-06-MINUTES.md`](../artbrows-platform-py/docs/MEETING-2026-07-06-MINUTES.md)

### ✅ 확정 결정 10건

| # | 카테고리 | 결정 |
|---|---------|------|
| 1 | **도메인** | `artbrow.co.kr` · 가비아 · **법인** 결제 · 1년 14,000원 |
| 2 | **개발 순서** | ①홍보 홈페이지+상담 → ②간단 LMS → ③쇼핑몰 결제 |
| 3 | **🎯 1차 오픈** | **2026년 8월 말** ← 이전 08-10에서 변경 (회장님 미국 출국 전) |
| 4 | **결제 대상** | 이지 클래스 69만원만 (온라인 강의 판매 X) |
| 5 | **결제 방식** | 홈페이지 자체 결제 (인스타 결제 X · DB 확보) |
| 6 | **쇼핑몰 방식** | **카페24 확정** (07-13 오후) · 자체 개발 X |
| 7 | **웹 기획 담당** | 대표님 쪽 (본부장 상시 옆에서 픽스) |
| 8 | **백엔드 인력** | 박대표 백엔드 전문가 활용 (별도 비용 X) |
| 9 | **싱가폴 대응** | 브로우 하우스 팝업/정기방문/아카데미 3안 프로포즈 |
| 10 | **외국인 마케팅** | B2B 에이전시 우선 · 인스타 글로벌 계정은 보조 |

### 🟡 미결정·주중 확정 필요

- **A**. PG사 선택 (토스/네이버/카카오/유니시스/KCP) — 원장님 · 박대표 · **07-18 마감**
- **B**. 상표권 「극사실 아트 브로우」 조합 재출원 — 변리사 · 별도 회의
- **C**. 로고·CI·BI — 대표님 · 원장님 · 별도 회의
- **D**. 카페24 계정 개설 + 상품 등록 범위 (이지 클래스 69만 우선) — 이서연 · 박대표 · **07-16**
- **E**. 문신사 국가자격증 정보 — 회장님

### 📅 Action Items — 이번 주 (07-14 ~ 07-18)

- **회장님**: 문신사 자격증 위원회 문의 · 상표권 변리사 연결
- **대표님(이서연)**: 메뉴·카테고리 정리 · 벤치마크 확정 리스트 · 싱가폴 3안 프로포즈 · 경쟁사 분석 완성 · 모델 요청 사양 발송
- **원장님**: 도메인 결제(가비아) · PG사 알아보기 · 콘텐츠 자료 정리(담주) · 모델 조건 검증
- **박대표**: 백엔드 전문가 준비 · 도메인 서버 매핑 · 홈페이지 구현 · PG사 알아보기

### 07-06 회의 반영 이력 (참고)

07-06 원장님 회의에서 협업 사이클 확정 + 캘린더 UI 피드백 → 07-06 저녁~07-07 새벽 즉시 반영 완료 (아래 07-06 섹션 참조).
추가 확정: **모델 사전 촬영 방식** (AI 얼굴 대체 X, 실물 촬영·부분 보정으로 전환)

---

## 🆕 2026-07-10 · 원장님 요청 · 홍보 홈페이지 + 쇼핑몰 스펙 — 회의 준비 완료 *(→ 07-13 회의에서 결정 반영됨)*

**원장님 카톡 (07-10 오후 2:38~2:40)**:
> "홈페이지(홍보용/쇼핑몰기능) 병행 구축. 벤치마킹 https://youme-beauty.com/"
> "어드민·LMS 제외. 홍보/예약/오프라인 강의 구매/상담 4가지. 러프 견적을 담주 월요일에"

**대표님**: 담주 월요일 **2026-07-13 (월) 09:00 전체 회의** 준비 필요 → 오늘 4종 준비 완료.

### 준비물 4종 (오늘 완성)
1. **스펙표 정본** — `artbrows-platform-py/docs/MEETING-2026-07-13-SPEC.md` (4개 기능 상세 · 견적 · 담당 배정 · 결정 대기 10개)
2. **유미코리아 벤치마크 비교** — `artbrows-platform-py/docs/MEETING-2026-07-13-BENCHMARK.md` (차용 5 · 버릴 3 · 변형 2)
3. **와이어프레임 4장** — `MEETING-2026-07-13-와이어프레임.html` (탭 UI · Luxury Dark · 홍보·예약·구매·상담 각 1)
4. ~~**회의용 원페이지 자료** — `MEETING-2026-07-13-회의자료.html`~~ → **07-13 회의 종료 · v1.1 흡수 · `_archive/`로 이동** (2026-07-13)

### 견적 결론 (07-11 대표님 확정 → 07-13 회의에서 변경)
- 실개발: 병렬 진행 시 **10~13영업일 (약 2~3주)**
- PG 심사 3~7일 병행
- ~~🎯 목표 오픈일: 2026-08-10 (월)~~ → **8월 말로 이동** (회장님 미국 출국 전) · 07-13 회의 확정
- 배정: 07-14~08-말 · 안전마진 확대

### 회의에서 결정받을 것 10개
- **사업**: 도메인 / PG (토스 추천) / SMS 채널 / 환불 정책 / 오픈일
- **브랜드**: 톤 (Luxury Dark 유지?) / 히어로 CTA / 비포&애프터 저작권
- **운영**: 상담 알림 채널 / 지점 노출

### 담당 배정 (기존 8 직원 재사용)
- 유나 (홍보 무드) + 이서연 (카피) + 김다은 (총괄) → 1주차
- 한승철 (개발 · 예약·결제) → 2·3주차
- 이서연 + 한승철 → 상담 폼

**다음**: 07-11~12 대표님 검토 → 07-13 09:00 회의 → 결정 후 착수

---

## 🆕 2026-07-06 · 카카오 오픈채팅 정기 발송 자동화 — 기획 완료

대표님 신규 미션: 오픈채팅방 5개에 월간 일정 기반으로 뉴스처럼 텍스트·자료 정기 발송 자동화.

- **리서치 결과**: 오픈채팅 발송 공식 API 없음. 옵션 4개 비교 (A 방장봇 / B PC 자동화 / C 프로토콜 봇 / D 반자동) → C는 영구정지 위험으로 탈락
- **대표님 결정 (07-06)**:
  1. 발송 방식 = **D→B 하이브리드** (1단계: 콘텐츠 전자동 + 1클릭 반자동 발송(리스크 0) → 한 달 후 PC 카카오톡 완전자동 승격 검토)
  2. 신규 AI 직원 채용 = **송하은 (채널 커뮤니케이션 매니저)** — `personas/송하은-채널커뮤니케이션.md`
  3. 방 5개 목록 = 설계 단계에서 대표님 제공
- **파이프라인 설계 골격**: 발송 캘린더(등록된 날만) → 발송 큐 → 발송 → 로그 + Goal 검증
- **2차 구체화**: 개인 지인 커뮤니티 방 · 매일 발송 가능(등록된 날만) · 텍스트/그래픽/영상 · 운영자(불특정)가 웹 화면에서 방·콘텐츠 직접 등록

### 🚚 07-06 · 독립 프로젝트로 이관 (대표님 지시)
시스템 전체를 **`D:\work\kakaoschedule`** 독립 프로젝트로 이동 (개인 커뮤니티 용도 → 프로젝트 격리). ARTbrows 플랫폼에 넣었던 kakao 라우터·화면·DB 테이블은 **제거·원상복구 완료** (서버 재시작, calendar API 정상 확인). 이후 진행 상황은 `D:\work\kakaoschedule\README.md` 참조.
**D+2 실발송 테스트 성공 (07-06 16:15)** — 테스트 방 「카톡자동뉴스테스트방」에 즉시 발송 + 캘린더 등록→큐→엔진 자동 발송 모두 ✅

### D+1 개발 완료 (07-06) — 화면 + 데이터 구조 *(→ kakaoschedule 로 이관됨)*
- **DB**: `kakao_rooms` + `kakao_queue` 테이블 (web/db.py) · 시드 방 「지인 모임방」
- **API**: `web/routers/kakao.py` — 방 CRUD / 발송 큐 등록(파일 업로드 포함) / `GET /api/kakao/due` (발송 엔진용) / 결과 보고 / 로그·통계
- **화면**: `web/static/kakao-sender.html` — 발송 캘린더 + 방 관리 + 발송 로그 3탭 (Luxury Dark) · lab.html 전체 메뉴 등록
- **검증**: API 사이클(등록→due→sent→로그) curl 테스트 PASS · Edge headless 캡처 3장 (달력·등록 모달·방 관리) 육안 확인
- **다음 (D+2)**: 발송 엔진 (대표님 PC · 반자동 D 모드) + 테스트 방 시험 발송 — **대표님 UX 컨펌 + 테스트 방 생성 대기**

## 🆕 2026-07-06 · 원장님 UI 피드백 4건 반영

원장님 카톡 피드백 (7/6 22:28~22:40) 즉시 반영:

| 원장님 요청 | 대응 |
|---|---|
| ① 하루뿐 아니라 「화·수·목」 요일 반복 선택 원함 | 모달에 **[하루/연속 N일/요일 반복]** 3-토글 + 요일 체크박스 UI 추가 |
| ② "아직 일정 없음" 자리에 특강 등 자유 일정 못 씀 | 수업 종류에 **「✎ 커스텀 특강」** 옵션 추가 · 제목 직접 입력 필드 |
| ③ 달력 이미지 요일·일자를 더 크게, 심플하게 | PNG 렌더 재설계 — 날짜 20→52px, 요일 헤더 13→32px, 통계·범례 제거 |
| ④ "프로그램 사용법 설명 필요" · 전체 메뉴화만인지 | 신규 페이지 **`calendar-usage-guide.html`** — 3분 5스텝 가이드 + FAQ + 「지금 어디까지 되어있나」 솔직 상태표 |

- 신규 파일: `web/static/calendar-usage-guide.html`
- 수정: `web/static/calendar.html` (모달 UX + PNG 재렌더 + URL fragment QA 훅 `#openday=21&mode=weekly`)
- 검증: Edge headless 3장 (메인·모달-요일반복·모달-연속N일) 육안 확인 완료

### 이어서 반영: 수업 종류 직접 편집 (대표님 결정 「2」)

원장님이 코드 수정 없이 이름·시간·가격을 매년/매기수 마다 직접 편집 가능:

- **TYPES localStorage 리팩터**: 하드코딩 상수 → `artbrows-types` 저장·읽기. 기본 5종(초·중·마스터·상담·특강) seed + 신규 종류 자동 병합.
- **dropdown 동적 생성**: `renderTypeOptions()` — 수업 종류 옵션 라벨(시간·가격) 자동 반영.
- **⚙ 종류 관리 모달**: 「수업 종류」 label 오른쪽 진입. 각 행에 이름·시간(H)·수강료(원)·기본 시작/종료 인라인 편집 + 「기본/신규」 태그 + 「N개 일정 사용 중」 뱃지 + × 삭제. 기본 5종은 편집만 가능(삭제 불가), 신규 종류만 완전 삭제.
- **드롭다운 선택 시 기본 시간 자동 입력**: 「초급반」 고르면 10:00~13:00 자동 채움 (`onTypeChanged`).
- **삭제된 종류 안전 처리**: `getType(id)` 헬퍼 도입 — 참조 실패 시 "(삭제된 종류)" fallback 으로 crash 방지.
- **범례 동적 생성**: 신규 종류도 범례에 자동 등장.
- 검증: Edge headless 로 관리 모달 자체 캡처 (기본 5종 · 신규 추가 버튼 · 취소·저장 액션).

### 이어서 반영: 반복 규칙 그룹 삭제 (대표님 결정 「1」)

원장님이 요일 반복으로 12개 넣었다가 취소하고 싶을 때 한 개씩 지우던 불편 해결:

- **groupId 자동 부여**: 연속 N일·요일 반복 모드로 만든 이벤트는 서로 같은 `groupId` + `groupLabel`(예: "매주 화·수·목 × 4주") 저장
- **× 삭제 버튼 확장**: 그룹 이벤트 삭제 시 대화상자 (`1=이 하루만 / 2=반복 규칙 전체 N개 / 취소`) — 그룹이 아니면 즉시 삭제 (기존 UX 유지)
- **이벤트 목록에 그룹 배지**: 「테스트 특강 ↺ 매주 화·수·목 × 4주」 오렌지 pill 로 그룹 소속 시각화
- **사용법 페이지 FAQ 갱신** + 상태표에 「반복 규칙 전체 삭제」 작동 행 추가
- 검증: Edge headless — 21일(화) 요일반복 자동 추가 → 22일(수) 열면 같은 그룹 배지로 표시됨 확인

## 📊 진척 (2026-07-06 기준)

| SaaS | 상태 | 진척 |
|---|---|---|
| **A · 학원·강의·홈페이지** | ✅ LIVE | 5/5 (100%) |
| B · 광고 마케팅 | ⏳ | 0/4 |
| C · Face Lab v7 | ⏳ | 0/3 |
| **전체** | | **5/12 (42%)** |

## ✅ SaaS A — 5/5 LIVE

| # | 메뉴 | URL |
|---|---|---|
| 1 | 📅 강의 일정 달력 | /static/calendar.html |
| 2 | 📝 수강 안내 6장 캐러셀 | /static/enrollment.html |
| 3 | 📚 마스터 작품집 | /static/master-works.html |
| 4 | 👥 회원 관리 | /static/members.html |
| 5 | 🏆 공모전 | /static/contest.html |

## 🛠 운영 메뉴

- 📔 개발 일지 = /static/journal.html
- 🏠 메인 = /static/lab.html

## ⚠️ 결정 대기

1. 🏆 공모전 = 삭제 / 이벤트 / 갤러리 / 유지
2. PNG 저장 진짜 작동 시점
3. 인스타 게시 API 통합 여부
4. 회원 DB SQLite 통합 시점
5. 다음 SaaS = B 광고 / C Face Lab
6. 🆕 오픈채팅 발송 대상 방 5개 목록 + 방별 콘텐츠 성격·발송 주기 (설계 단계 입력값)

## 🎨 디자인 톤

- **Luxury Dark** = 메인 (#0B0907 + Champagne Gold #E0C088 + Nanum Myeongjo)
- **살구핑크** = SaaS A 강의·수강 안내 (원장님 기존 톤 호환)
- **모비딕 base.html 패턴** = 상단 네비 + 대시보드 + 단계별 자동 모드

## 📅 다음 세션

대표님 술 깬 후:
1. 위 「결정 대기」 5개 항목 중 우선순위 선택
2. SaaS B 시작 또는 SaaS A 보강
3. 진짜 백엔드 통합 (FastAPI + SQLite)

