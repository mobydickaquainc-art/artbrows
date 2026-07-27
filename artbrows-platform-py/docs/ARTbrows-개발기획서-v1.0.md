# ARTbrows Platform — 전체 개발 기획서 v1.3

| 항목 | 내용 |
|------|------|
| **문서명** | ARTbrows Platform 전체 개발 기획서 |
| **버전** | **v1.3** (2026-07-27 갱신) · v1.2 = 07-13 오후 카페24 확정 · v1.1 = 07-13 오전 회의 · v1.0 = 2026-06-30 초안 |
| **최종 갱신** | 2026-07-27 · 카드뉴스 시연 대개편 + 홈페이지 유미 벤치 하이브리드 4 Phase (대표님 「완료」) |
| **작성** | 클로드 (총괄) · 8 직원 통합 |
| **승인 대기** | 박정주 대표님 · 장미지 원장님 |
| **분류** | 공식 PRD (Product Requirements Document) |
| **언어** | 한국어 (영문 보조) |
| **상위 비전** | 「극사실 아트 눈썹 디지털 플랫폼」 — 미용 업계 3 SaaS 통합 |

## 📌 v1.3 변경 요약 (2026-07-27 · 9시 시연 대응)

**2 대 축 대개편** — 회장·대표·본부장·원장 참석 9시 시연 대비 4~5시간+ 작업. 대표님 「완료」 트리거로 자동 반영.

### A. 카드뉴스 생성기 완전 개편 (§ 5.2 확장)
- **스타일 시스템 17종 → 5+Custom** — 시각적으로 명확히 다른 것만 유지. 정본 `artbrows-real` (원장 07-24 배포본) + 트렌드 4 (Rebellion Serif · Grain Frame · Vertical Column · Silhouette Reveal) + Custom. 폐기 11종 → `LEGACY_ALIAS` 하위호환 매핑
- **편집기 3열 상시 인스펙터** (모비딕 pages 벤치 · CLAUDE.md §7.1 참조) — 좌 슬라이드 목록 · 중 큰 미리보기 · 우 상시 편집 패널 (스타일 프리셋 6 + 오버레이 인스펙터 + AI 카피 팔레트 + 오버레이 목록). `OverlayInspector.tsx` 신설. QuickEditModal 제거
- **문장 교체 (스타일 카피)** — 미리보기 위 마우스 드래그로 영역 선택 → **Gemini Vision 3.1 Pro** 가 폰트·색·크기·정렬·배경 분석 → 원본 스타일 그대로 카피, 문장만 원장님 입력으로 대체. `analyze-region` API 신설
- **리뉴얼 = 팔레트 배치** — OCR 로 원본 텍스트 감지하되 자동 덮기 X · 편집 가능한 팔레트로만 저장 · 원장님이 「원본 스타일 배치」 or 「기본 위치 배치」 선택
- **4안 양산** (원장님 선택 폭 극대화) — Gemini 안정 + Gemini 실험 + OpenAI 안정 + OpenAI 실험 병렬 생성 (temperature 0.55/1.05 · toneNote STABLE/BOLD) → 2×2 그리드 나란히 미리보기 → 원장님 확정
- **모델 최신화** — Gemini 3.1 Pro → 3.0 → 3 Flash → 2.5 폴백 · OpenAI GPT-5.1 → 5-pro → 5 → 5-mini → 4.1 폴백 (`models.ts` 3곳 통일)
- **정본 튜토리얼 + 시연 시나리오** — `docs/TUTORIAL-CARDNEWS-2026-07-27.md` · `docs/DEMO-SCRIPT-2026-07-27-v2.md`

### B. 홈페이지 대대적 업데이트 (§ 5.6·§ 7 신설)
벤치마크: **https://youme-beauty.com/** (유미 최신) · AI 8인 회의 만장일치 C안 (하이브리드) 확정. 4 Phase 완료:
- **Phase 1**: 데스크톱/모바일 완전 분리 (반응형 X · 유미처럼 진짜 2 컴포넌트). `page.tsx` UA SSR 분기 · `HomePage.tsx` → `HomePageDesktop.tsx` 리네임 · `HomePageMobile.tsx` 신설 · `FloatingCTA.tsx` 신설 (데스크톱 우측 6개 · 모바일 하단 3개 · K1 실시간 카운터)
- **Phase 2**: `BeforeAfterCarousel.tsx` (ba-01~03 매크로 VOGUE BEAUTY 톤) · `AtelierTour.tsx` (아틀리에 4장 크로스페이드 + 썸네일 + 통계) · CONCERN 4 페르소나 카드 (완전 초보 · 재교육 · 창업 · 심화 · 유미 CONCERN 카피 · 콘텐츠 완전 치환)
- **Phase 3**: `TrustAssets.tsx` (특허·상표 3장 라이트박스 + 창업 수백여명 + 26년 강의노트 117p PDF 다운로드) · 4 섹션 압축 폐기 (AI STUDIO · CONSULT-flow · STARTUP PACKAGE · INSTRUCTOR TRACK → CONCERN + CURRICULUM + TrustAssets 3중 노출로 흡수)
- **Phase 4**: 모바일 히어로 얼굴 안전 크롭 (`object-position: 50% 30%`) · 하단 CTA 여백 확대 (`calc(110px + env(safe-area-inset-bottom))` iPhone Home Indicator 대응)
- **결과**: 데스크톱 14,920 → 15,560px (신규 3섹션 반영 + 4섹션 압축 net +640) · 모바일 25,133 → **4,963px** (80% 압축 · 모바일 전용 최적화)
- 유지 결정: `HomePage.tsx` 원본 (en/zh/manager 서브 페이지 재사용)
- 정본 문서: `docs/HOMEPAGE-BENCHMARK-YOUME-2026-07-27.md` (유미 vs 우리 비교표 · AI 8인 회의 · 3안 도출)

### C. 재발명 방지 규칙 (CLAUDE.md §7.1 신설)
- **원칙**: 카드뉴스·편집 UI 만들기 전 `C:\Users\dobi\pages\mobydick-detail-agent` 를 먼저 grep/read. 재발명 금지
- 정본: `editor_prototype.html` (783줄 3열 편집기) · `상세페이지.md` · `agents/` · `templates/components/`
- 메모리: `pages-folder-reference-rule.md` (다른 세션에도 자동 적용)

---

## 📌 v1.2 변경 요약 (2026-07-13 오후)

대표님 결정: **쇼핑몰 = 카페24 확정** (v1.1의 「기성 솔루션(카페24 등) 검토」 → 벤더 확정으로 승격)

- § 16.1 「07-13 회의 결정」 카페24 확정 명시 추가
- § 16.2 이번 주 마감 「쇼핑몰 완성 범위」 → 「카페24 계정 개설 + 상품 등록 범위」로 재정의
- § 16.3 「기성 솔루션(카페24 등)」 → 「카페24 확정」
- PG 결정 = 카페24 지원 목록(토스페이먼트·나이스페이·KG이니시스 등)에서 선택 → 07-18 마감 유지

---

## 📌 v1.1 변경 요약 (2026-07-13 오전)

07-13 (월) 09:23 전체 회의 (66분 10초) · 회장님·대표님·원장님 참석 · 확정 결정 10건 반영:

- **도메인 확정** `artbrow.co.kr` (가비아 · 법인 결제)
- **1차 오픈일 이동** 08-10 → **8월 말** (회장님 미국 출국 전)
- **개발 순서 3단계 정립** ①홍보 홈페이지+상담 → ②간단 LMS → ③쇼핑몰 결제
- **결제 범위 축소** 이지 클래스 **69만원만** (온라인 강의 판매 X · 235만/660만 세트는 상담 유입만)
- **결제 방식** 홈페이지 자체 결제 (인스타 결제 X · DB 확보 목적)
- **쇼핑몰 방식** 기성 솔루션(카페24 등) 활용 · 자체 개발 X
- **웹 기획 담당** 대표님 쪽 (본부장 이서연 상시 옆에서 픽스)
- **백엔드 인력** 박정주 대표의 백엔드 전문가 활용 (별도 비용 X)
- **싱가폴 진출** 브로우 하우스 3안 프로포즈 (팝업·정기방문·아카데미)
- **외국인 마케팅 방향** B2B 에이전시 우선 · 인스타 글로벌 계정은 보조

**정본 회의록**: `docs/MEETING-2026-07-13-MINUTES.md`
**참조**: `docs/MEETING-2026-07-06-MINUTES.md` (지난주 원장님 콘텐츠·광고 자동화 요청)

---

## 목차

0. Executive Summary
1. 사업 배경 · 비전
2. 시장 분석 · 경쟁사 · 벤치마크
3. 타겟 · 페르소나
4. 제품 정의 (3 SaaS)
5. 기능 명세 (메뉴별 상세)
6. 기술 아키텍처
7. 디자인 시스템 (Luxury Dark)
8. 데이터 모델 (DB schema)
9. 외부 API 통합
10. 보안 · 컴플라이언스
11. 개발 일정 · 56 Task
12. 수익 모델 · KPI
13. 리스크 매트릭스
14. 8 직원 조직 · 역할
15. 자율 발전 시스템
16. 결정 사항 · 대기 항목
17. 부록

---

## 0. Executive Summary

**한 줄 정의:**
ARTbrows Platform은 「극사실 아트 눈썹 창시자 장미지 원장의 30년 노하우」를 디지털 트윈화한 **미용 업계 3 SaaS 통합 플랫폼**이다.

**3 SaaS:**
- **A · 학원·강의·홈페이지 운영** (김다은 PM)
- **B · 수강생·시술자 광고 마케팅** (박서윤 PM, DIY 모델)
- **C · Face Lab v7 시술 전·후 시뮬** (최예진 PM, Unreal MetaHuman)

**핵심 차별점:**
1. **원장님 30년 펜슬 패턴 DB** — 경쟁사 못 따라하는 해자
2. **「내 계정」 자기 패턴 학습** — 사용자 자기 인스타 90일 분석 → 자기만의 광고
3. **시술→수강 전환 funnel** — 만족한 시술자를 수강생으로 자연 전환
4. **Luxury Dark + 명조** — Vogue Korea Dark Beauty Editorial 톤

**3개월 KPI 목표 (베타 후):**
- 시뮬 사용자 1만 명 · 상담 신청 1,500건 · 시술 전환 450건 · SaaS B 구독 50명
- **3개월 총 매출 추정 약 3.2억원**

**개발 일정 (v1.1 · 2026-07-13 갱신):**
- 06-30 · v1.0 초안 작성 · 8 직원 통합 가동 시작
- 07-01·02 · 검증·통합 데이 (Phase 0 90% 승인)
- 07-03~07-08 · Phase 1 본격 개발 (SaaS A MVP)
- 07-06 · 원장님 회의 · 캘린더 UI 4건 피드백 즉시 반영
- 07-09 · SaaS A (`lab.staris.cloud`) 정식 가동 ✅
- 07-13 · **홈페이지·쇼핑몰 스펙 회의 · 결정 10건 확정**
- 07-14~18 · 메뉴·PG·프로포즈 확정 (이번 주 미션)
- 07-21~25 · 콘텐츠·이미지 전달 (원장님) → 개발 시작
- **08월 말 · 1차 오픈** (홍보 홈페이지 + 상담 + 이지 클래스 69만 결제)
- 09월 이후 · LMS · 쇼핑몰 · SaaS B 광고 · SaaS C Face Lab 단계별 확장

---

## 1. 사업 배경 · 비전

### 1.1 배경

ARTbrows / 장미지눈썹연구소는 한국 반영구 1위 아카데미이자 「극사실눈썹 창시자」 장미지 원장의 학원·시술 공간이다. 30년 노하우의 핵심은 **시술 전 펜슬로 결과를 미리 그려주는 정확성**이며, 이로 인해 클레임이 거의 발생하지 않고 고객 만족도가 압도적이다 (회의 2026-06-29 원장님 확인).

이 노하우를 **디지털 SaaS 플랫폼**으로 재구성하면 다음 3가지를 동시에 달성 가능하다:

1. **학원 운영 자동화** — 원장님이 매월 손작업하는 강의 일정·게시·관리 부담 0
2. **외부 사용자 진입** — 「시술 전 시뮬」로 신규 손님 funnel 자동
3. **수강생·살롱 SaaS 제공** — 「광고 자동 제작」으로 정기 구독 매출

이 세 가지를 묶은 통합 플랫폼이 ARTbrows Platform이다.

### 1.2 비전

> **「미용 업계의 모비딕 상세페이지 플랫폼」**
> 모비딕(아쿠아리움)이 제품 → 상세페이지 자동 생성으로 셀러 시장을 점유했듯,
> ARTbrows는 사진·강의 → 멀티 채널 자동 콘텐츠로 미용 업계를 점유한다.

(메모리 [[artbrows-platform-vision-2026-06-29]] 정합)

### 1.3 핵심 메시지

- 한국어: **「극사실 아트 눈썹」**
- 영문: **「Hyperreal Art Brows」**
- 중국: 시장 트렌드 = 「超写实野生眉」 (벤치마크용) / 우리 = 「极写实艺术眉」

(메모리 [[artbrows-main-keyword-art-brow]] 정합 · 「야생」 폐기)

---

## 2. 시장 분석 · 경쟁사 · 벤치마크

### 2.1 한국 시장

| 경쟁사 | 강점 | 약점 |
|--------|------|------|
| 유미코리아 | 인지도 · 강의 인프라 | 디지털 부재 · 일반 톤 |
| 강남 살롱 다수 | 위치 · 단발 매출 | 학원·플랫폼 X |
| 기타 학원 | 가격 | 노하우 부족 |

**ARTbrows 우위:**
- 「극사실눈썹 창시자」 단일 권위
- 30년 패턴 DB · 모비딕 검증된 자동화 패턴
- 직접 운영 학원 (오프라인 fallback)

### 2.2 중국 시장 (벤치마크)

원장님 자료 12 계정 분석 (메모리 [[artbrows-china-market-keywords-2026-06-29]]):

| 계정 | 인기 | 패턴 |
|------|------|------|
| 化妆师王崇 | 2,600 좋아요 | **LIVE 스트리밍** |
| Rubyyy_ | 1,400 좋아요 | 메이크업 분석 캐러셀 |
| 九朽美学教育总部-青岚 | 35 좋아요 | 「超写实野生眉」 학원 (직접 경쟁) |
| 眉匠美學 DR.EYEBR | 67 좋아요 | After/Before + LIVE |
| WANMEI 玩美秀美学 | 38 좋아요 | 港风 + 野生眉 |

**시사점:**
- LIVE 스트리밍이 정적 게시물 대비 40배 인기 → SaaS B 신규 모듈 (LIVE 카드)
- 메이크업 분석이 시술 분석보다 10배 인기 → 융합 콘텐츠 전략

### 2.3 인물 톤 reference (원장님 직접 지시)

원장님이 직접 보여주신 다크 럭셔리 인물 reference 2장 (`persona-ref-01·02`) =
ARTbrows 모든 인물 (홈페이지·MetaHuman·광고) 표준 톤.

(메모리 [[artbrows-persona-tone-standard]] 정합)

- 20~25세 청순·도시적
- 어두운 갈색 머리 · 어깨 길이
- 모공 보이는 리얼 피부 · 부드러운 입술
- 검정 탱크탑 · 큐빅 한 알 귀걸이
- 다크 배경 · warm rim light

---

## 3. 타겟 · 페르소나

### 3.1 2 타겟 분류 (회의 합의)

| 타겟 | 설명 | 메인 SaaS |
|------|------|----------|
| **① 시술 받는 사람** (B2C 손님) | 결과 미리 보고 싶다 · 클레임 무서움 · 자연스러움 원함 | C → A |
| **② 배우는 사람** (수강생·살롱 강사) | 기술 부족 · 클레임 두려움 · 수강료 부담 | A → B |

### 3.2 페르소나 v2.0 — 9 단계 결정 흐름 (이서연 작성)

#### 시술자 흐름 (B2C 9 단계)

1. **인지** — 인스타·페이스북 스토리에서 「극사실 아트 눈썹 BEFORE/AFTER」 영상 노출
2. **관심** — 영상 클릭 → 프로필 → 「Face Lab 무료 체험」 링크
3. **체험** — `app.eyebrows.staris.cloud/lab` 진입 → 카카오 SSO (선택) → 정면+측면 업로드
4. **결과 확인** — 2D 펜슬 가이드 + 3D 360° (「체험용」 워터마크)
5. **공유** — 결과 카톡·인스타 스토리 1탭 공유
6. **상담 신청** — 1탭 「실제 시술 받기」 → 카카오 채널
7. **결제** — 예약금 19,000원 (Toss)
8. **시술** — 오프라인 (선릉·봉은사)
9. ★ **수강생 전환** — 「같은 기술 배우고 싶으세요?」 → SaaS A 학원 funnel (김다은 발견)

#### 수강생 흐름 (9 단계)

1. **인지** — 네이버 블로그 「반영구 학원 추천」 검색
2. **관심** — ARTbrows 학원 페이지 진입
3. **확인** — 강의 일정 + 마스터 작품 6점 + 원장님 30년 권위
4. **체험** — A1 강의 일정 자동 게시 캘린더 보기
5. **신청** — 수강 신청 폼 작성
6. **결제** — 8월말 1차 오픈 = **이지 클래스 69만원만** (한 페이지 상품 + PG) · 235만/660만 세트는 상담 유입 → 오프라인 별도 결제 (v1.1 · 07-13 회의)
7. **수강** — 오프라인 클래스 (이지·소묘·눈썹 3일)
8. **인증** — 수료 + 「ARTbrows 인증 시술자」 라이센스
9. **운영** — 자기 살롱 광고 → SaaS B 구독 (월 5~15만원)

### 3.3 회원 등급 (운영 시스템)

| 등급 | 권한 | 게시판·콘텐츠 차별화 |
|------|------|---------------------|
| 일반회원 | 무료 시뮬·기본 정보 | 공개 게시판 |
| 정회원 | 결제 후 (시술 또는 수강) | 정회원 게시판 + 마스터 작품 일부 |
| VIP 회원 | 평생수강 + 다회 시술 | 1:1 코칭 + 전체 자료 |

가입 모드 2가지: **대표가입** (대표님 초대) · **소속가입** (자가)

(메모리 [[artbrows-internal-system-2026-06-29]] 정합)

---

## 4. 제품 정의 (3 SaaS)

### 4.1 SaaS A · 학원·강의·홈페이지 운영

**PM:** 김다은 (32세 · 운영 매니저)

**핵심 가치:**
원장님 매월 손작업하는 강의 일정·게시·관리를 디지털 트윈화.

**메뉴 7개:**
| # | 메뉴 | 상태 |
|---|------|------|
| A1 | 다음달 강의 일정 + 일정 등록 달력 ★ MVP | 코드 완성 |
| A2 | 강의 내용 자동 스타일링 ★ MVP | 코드 완성 |
| A3 | 마스터 작품집 + 패턴 DB 연결 | Phase 2 |
| A4 | 회원 3등급 + 가입 2모드 | Phase 2 |
| A5 | 공모전 시스템 (응모·심사·시상) | Phase 3 |
| A6 | ARTbrows 자체 홈페이지 자동 갤러리 | Phase 3 |
| A7 | 장미지 디지털 분신 (24/7 가상 원장님) | Phase 2 |

### 4.2 SaaS B · 수강생·시술자 광고 마케팅

**PM:** 박서윤 (29세 · 광고 디렉터)

**모델:** DIY (사용자가 자기 광고 계정 OAuth 연동 · ARTbrows는 도구만 제공 · 월 구독 5~15만원)

**메뉴 9개:**
| # | 메뉴 | 상태 |
|---|------|------|
| B1 | 사진 → 광고 카피 자동 (인스타·블로그·유튜브) ★ MVP | PoC 완료 |
| B2 | 자동 이미지·영상 (nano_banana_pro·Veo·ffmpeg) | Phase 2 |
| B3 | 광고 직접 집행 (네이버·Meta·Google Ads OAuth) | Phase 2 |
| B4 | 광고 효과 측정 + 자동 최적화 | Phase 3 |
| B5 | 예산 초과 텔레그램·카카오 알림 | Phase 3 |
| B6 | 「내 계정」 자기 패턴 학습 (Meta Graph API) | Phase 3 |
| B7 | AEO/GEO (GPT·Gemini·Claude·Perplexity) | Phase 4 |
| B8 | 다국어 번역 (한·중·영) | Phase 4 |
| B9 | 연관 키워드 분석 엔진 | Phase 3 |

### 4.3 SaaS C · 시술 전·후 시뮬 (Face Lab v7)

**PM:** 최예진 (31세 · 시술 R&D)

**핵심:** 펜슬 디지털 트윈 — Unreal MetaHuman + MediaPipe + 원장님 30년 패턴 DB

**메뉴 7개:**
| # | 메뉴 | 상태 |
|---|------|------|
| C1 | 정면+측면 사진 업로드 + MediaPipe 478 분석 ★ MVP | 골격 |
| C2 | 원장님 30년 패턴 DB 매칭 | 100 케이스 분류 완료 |
| C3 | 2D 펜슬 가이드 PNG 출력 | Phase 2 |
| C4 | 3D 360° MetaHuman 모델 (Unreal 5.8) | 「수아」 첫 4컷 완료 |
| C5 | 카카오 1탭 상담 신청 → 결제 | Phase 2 |
| C6 | 시술 사진 자동 분류 (Gemini Flash) | Phase 3 |
| C7 | 클레임 예방 가드 (워터마크·의료광고법) | Phase 3 |

---

## 5. 기능 명세 (메뉴별 상세)

### 5.1 SaaS A1 · 강의 일정 자동 (★ MVP)

**입력:**
- 기존 달력 이미지 1장 (원장님 「artbrows_academy」 인스타 게시물)
- 또는 단일 월 + 수동 입력

**처리:**
1. Gemini 2.5 Flash Vision으로 이미지 분석 → 패턴 JSON 추출
2. 14기 → 15기, 12기 → 13기, 73기 → 74기 자동 증분
3. 매주 일요일 = 이지클래스 (5-1·5-2·5-3·5-4 회전)
4. 매월 중순 화·수·목 = 극사실 소묘수업
5. 매월 말 월·화·수 = 73기 극사실 눈썹 3일
6. 나머지 평일 = 「휴무」 자동 표시

**출력:**
- `data/output/saas_a/calendar/2026-07.json` (영구 저장)
- 원장님 인스타 카드 PNG (1080×1350)
- 네이버 블로그 SEO 글 자동
- ARTbrows 자체 홈페이지 갤러리 자동 등록

**UX 흐름 (3 클릭 원칙):**
1. 클릭 → 「이미지 업로드」
2. 클릭 → 「분석」 (Gemini 5~10초)
3. 클릭 → 「7~12월 자동 생성」

**원장님 친화:**
- 본문 16px, 버튼 18px, 캘린더 날짜 24px
- WCAG AAA 대비
- 1회 OAuth 후 매월 「자동 생성」 클릭 1번

### 5.2 SaaS A2 · 강의 내용 자동 스타일링

**입력:** 기존 강의 페이지 HTML 1개 + 스타일 프리셋 (`luxury_dark` 메인)

**처리:**
- 글·구조 추출 (변경 없음)
- 색감·폰트·레이아웃만 새 스타일로
- 이미지 재생성 옵션 (`--with-images` · Gemini 3 Pro Image)

**출력:** `data/output/saas_a/restyled/{원본}_luxury_dark.html`

### 5.3 SaaS B1 · 광고 카피 자동 (★ MVP)

**입력:** 사진 1장 ~ 여러 장 + 타겟 (treatment / academy) + 플랫폼 (instagram / naver / youtube)

**처리:**
- Gemini 2.5 Flash → JSON 광고 카피 5종
- 키워드 시드 9개 + 「극사실 아트 눈썹」 강제 주입
- 「~ 같다는 말 들어요」 친근 화법

**출력:** `data/output/saas_b/광고카피-{date}.json`

### 5.4 SaaS C1 · Face Lab v7 시뮬 (★ MVP)

**입력:** 정면 사진 + 측면 사진 (사용자)

**처리:**
1. MediaPipe 478 랜드마크 분석
2. 측면 깊이 → 입체 reconstruction
3. 원장님 패턴 DB (`pattern_db_cases`) 매칭 (face_shape · treatment_type)
4. 2D 펜슬 가이드 PNG 생성 (Gemini 3 Pro Image)
5. 3D MetaHuman 모델 (Unreal · pre-rendered)
6. 「체험용」 워터마크 자동

**출력:** `data/output/saas_c/sim_{user_id}_{date}.png` + `.glb`

---

## 6. 기술 아키텍처

### 6.1 전체 구조

```
┌────────────────────────────────────────────────────────┐
│  사용자 (브라우저 · 모바일 우선)                          │
└─────────────────────┬──────────────────────────────────┘
                      ↓ HTTPS
┌──────────────────────────────────────────────────────────┐
│  Cloudflare Quick Tunnel (개발) / 영구 Tunnel (베타)      │
│  app.eyebrows.staris.cloud (베타 직전)                   │
└─────────────────────┬────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────────┐
│  대표님 PC Windows · FastAPI :8001 (uvicorn)             │
│  - Jinja2 템플릿 (Luxury Dark)                           │
│  - 3 SaaS 라우터 (saas_a · saas_b · saas_c)              │
│  - OAuth 콜백 4종 (kakao · meta · naver · google)        │
└──────┬──────────┬──────────┬──────────┬──────────────────┘
       ↓          ↓          ↓          ↓
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐
│ Gemini   │ │ OpenAI   │ │ Higgsfd  │ │ SQLite (개발)    │
│ - 3 Pro  │ │ - GPT-4o │ │ - Veo    │ │ → PostgreSQL     │
│ - 3.1Pro │ │ - DALL·E │ │ - 3D     │ │   (베타 후)       │
│ - Flash  │ │ - TTS    │ │          │ │                  │
└──────────┘ └──────────┘ └──────────┘ └──────────────────┘
       ↑                                ↑
┌──────┴────────────────────────────────┴──────────────────┐
│  Meta Marketing · 네이버 검색광고 · Google Ads           │
│  카카오 SSO · 알림톡 · 텔레그램 봇                        │
└──────────────────────────────────────────────────────────┘
```

### 6.2 디렉토리 구조 (모비딕 패턴 1:1)

```
artbrows-platform-py/
├── main.py · requirements.txt · .env
├── agents/        # 11 에이전트 (8 직원 + 3 PM)
│   ├── base.py
│   ├── saas_a_calendar.py
│   ├── saas_a_calendar_analyzer.py
│   ├── saas_a_content_restyle.py
│   ├── orchestrator_a/b/c.py (TBD)
│   ├── collector / researcher / copywriter / designer / prompter (TBD)
│   └── deployer.py
├── utils/         # API 클라이언트 (TBD)
├── config/        # YAML 설정
│   └── common.yaml
├── data/
│   ├── input/{saas_a,b,c}/
│   ├── intermediate/
│   ├── output/{saas_a,b,c}/
│   └── logs/{saas_a,b,c,team}_YYYY-MM-DD.jsonl
├── db/
│   ├── init_v1.sql      # ★ 한승철 작성 완료
│   └── migrations/      # Alembic (D+1)
├── scripts/
│   ├── generate_daily_briefing.py  # ★ 모비딕 패턴
│   └── (TBD)
├── templates/components/   # Jinja2 컴포넌트
├── web/                    # FastAPI
│   ├── app.py
│   ├── routers/
│   └── templates/home.html
├── reports/                # ★ 일일 브리핑 PDF·HTML·PNG
├── docs/                   # 본 문서 + 회의록
├── tests/
└── 실행가이드.md
```

### 6.3 호스팅

**개발 모드 (현재 ~ 베타 직전):**
- 대표님 PC Windows + FastAPI 8001
- Cloudflare Quick Tunnel (`*.trycloudflare.com`)
- 비용 0원

**베타 직전 (07-15~):**
- Cloudflare Tunnel 영구화
- 가비아 DNS `app.eyebrows.staris.cloud` 정식 등록
- HTTPS 자동

**맥미니 X** (모비딕 회사 자산 분리)

(메모리 [[artbrows-dev-mode-only-no-mac-mini]] 정합)

---

## 7. 디자인 시스템 (Luxury Dark)

### 7.1 컬러 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--bg` | `#0B0907` | 메인 배경 (다크 + 따뜻한 undertone) |
| `--surface` | `#161617` | 카드·표면 |
| `--primary` | `#E0C088` | Champagne Gold (럭셔리 강조) |
| `--secondary` | `#FFB78A` | 살구톤 (눈썹 색 액센트만) |
| `--text-primary` | `#F5EDE3` | Cream |
| `--text-secondary` | `#CBC8C1` | Light Beige |
| `--border` | `#2A2A2A` | 보더 |

### 7.2 폰트

- **Serif (헤딩):** Nanum Myeongjo (한글) + Cormorant Garamond (영문)
- **Sans (본문):** Pretendard

### 7.3 컴포넌트 라이브러리 v2.0 (유나 작성)

24 컴포넌트:
- 버튼 8 종 (Primary·Secondary·Tertiary·Ghost × hover·disabled)
- 카드 5 종 (강의 카드·광고 카드·결과 카드·통계 카드·라이브 카드)
- 입력 폼 6 종 (텍스트·날짜·시간·파일 업로드·라디오·체크)
- 모달·토스트·캐러셀·캘린더·라이트박스

(메모리 [[artbrows-luxury-dark-tone-final]] 정합)

### 7.4 인물 톤 (이미지 생성 시)

```
ULTRA PHOTOREALISTIC close-up portrait, Korean Asian woman 20-25 yo.
DARK MOODY STUDIO BACKGROUND (#0B0907 warm undertone).
LOW-KEY LIGHTING with warm rim light from upper-side.
HYPERREAL eyebrow extreme detail (each hair individually visible).
Pore-level skin · peach fuzz · subsurface scattering.
Hair: dark brown shoulder-length naturally falling.
Outfit: simple black tank top.
Accessory: single small cubic earring.
Vogue Korea Dark Beauty Editorial cover aesthetic.
Canon EOS R5 85mm f/1.4 shallow depth of field.
NO bright pink · NO airbrushed plastic · NO flat lighting.
```

---

## 8. 데이터 모델 (DB schema)

**상태:** ✅ v1.0 확정 (2026-07-02 D+2) · 8 테이블 + 12 인덱스 + 시드 6점 검증 통과

**파일:**
- 스키마 정본: `db/init_v1.sql` (한승철 06-30 초안 → 07-02 v1.0 확정)
- 마이그레이션: `alembic/versions/0001_initial_schema.py`
- 초기 생성 스크립트: `scripts/init_db.py --reset`
- 개발 DB: `data/artbrows.db` (SQLite · 환경변수 `ARTBROWS_DB_URL` 로 오버라이드)

### 8.1 핵심 테이블 (8)

| 테이블 | 용도 | 인덱스 |
|--------|------|--------|
| `users` | 회원 3등급 + 가입 2모드 + OAuth 4종 (kakao·meta·naver·google) | email · (tier, role) |
| `class_schedules` | SaaS A 강의 일정 (6 class_type · 인스타 게시 상태) | (year, month) · (class_type, series_no) |
| `class_enrollments` | 수강 신청·결제 (Toss Payments 연동 지점) | (user_id, status) |
| `pattern_db_cases` | SaaS C 원장님 30년 패턴 DB (MediaPipe 랜드마크 JSON 포함) | face_shape · (case_type, treatment_type) |
| `ad_campaigns` | SaaS B 광고 캠페인 (8 플랫폼 · ROAS 트래킹) | (user_id, status) · (platform, status) |
| `ad_budget_alerts` | 예산 초과 알림 로그 (50·80·100·120% 임계값) | - |
| `face_lab_simulations` | SaaS C 시뮬 결과 (front·side 필수 · 워터마크 자동) | user_id |
| `daily_logs` | 8 직원 작업 로그 · 일일 브리핑 데이터 소스 | (log_date, track) · (staff, log_date) |

### 8.2 시드 데이터

마스터 작품 6점 자동 등록 (`JM-MASTER-001` ~ `JM-MASTER-006-SIGNED` · SIGNED 3점 = 원장님 서명본)

(메모리 [[artbrows-class-content-master-works]] 정합)

### 8.3 검증 절차

```bash
cd artbrows-platform-py
python scripts/init_db.py --reset
# 기대: [PASS] schema v1.0 verified. (8 tables · 12 indexes · 6/3 seed)
```

### 8.4 SQLite → PostgreSQL 전환 계획

- Phase 3 (07-15~) 베타 직전 전환 검토
- `ARTBROWS_DB_URL=postgresql+psycopg://...` 설정만 교체
- AUTOINCREMENT → SERIAL, TEXT CHECK → ENUM 자동 대응은 별도 revision 으로 커버

---

## 9. 외부 API 통합

### 9.1 AI APIs

| API | 모델 | 용도 | 비용 |
|-----|------|------|------|
| **Gemini 3.1 Pro Preview** | text·이미지·영상 분석 | 메인 reasoning | $1.25/M input |
| **Gemini 3 Pro Image** | Nano Banana Pro | ★ 고품질 2D 이미지 | 저렴 |
| **Gemini 3.5 Flash** | 빠른·대량 | 분류·번역·간단 | 거의 0 |
| **Gemini 3.1 Flash TTS** | 음성 | 장미지 디지털 분신 | 저렴 |
| **OpenAI GPT-4o** | 백업 | Gemini 실패 시 | $2.5/M |
| **OpenAI DALL-E-3** | 백업 | 백업 이미지 | $0.04/장 |
| **Anthropic Claude** | 코드 | Claude Code 자체 | Max $100/월 |
| **Higgsfield Veo 3.1** | 영상 | STORY 시리즈 | 크레딧 |
| **Higgsfield image_to_3d** | 3D | Face Lab GLB | 30크/회 |

(메모리 [[artbrows-ai-tools-stack]] · [[artbrows-image-quality-policy]] · [[artbrows-higgsfield-policy-revised]] 정합)

### 9.2 광고 APIs

| API | 권한 신청 | 콜백 URL |
|-----|-----------|----------|
| Meta Marketing | Business Verification 5~7일 | `/oauth/meta/callback` |
| 네이버 검색광고 | 영업일 3~5일 | `/oauth/naver/callback` |
| Google Ads | 즉시 | `/oauth/google/callback` |

### 9.3 메시징

- **카카오 SSO + 알림톡** — 회원·상담·예산 알림
- **텔레그램 봇** — 예산 알림 · 가장 빠름 (5초)

### 9.4 결제

- **Toss Payments** — 예약금 19,000원 · 수강료 69~200만원 · SaaS B 구독

---

## 10. 보안 · 컴플라이언스

### 10.1 의료광고법 §5.3

**필수 적용:**
- 모든 시뮬 결과에 **「체험용 · ARTbrows Face Lab」** 워터마크 자동 박힘
- **「실제 시술 결과의 90% 재현 보장」** 카피 필수 (시뮬 결과 옆)
- 실제 시술 사진의 AI 합성 절대 금지 (CLAUDE.md §4)

**외부 자문:** 미용 의료 광고 전문 변호사 ~30만원 (대표님 결정 대기)

### 10.2 PIPA (개인정보보호법)

- 사용자 얼굴 매칭 시 동의 체크박스 필수 (`users.pii_consent`)
- 사진 데이터 암호화 저장
- 24시간 후 자동 삭제 옵션

### 10.3 OAuth 토큰

- DB 저장 시 **AES-256 암호화** (`cryptography.fernet`) — 한승철 표준
- DB 노출돼도 안전

### 10.4 비밀 키

- 환경 변수 + `~/.artbrows-secrets/` 폴더 (사용자만 접근)
- `.gitignore` 9 패턴 등록
- API 키 절대 git commit X

(메모리 [[artbrows-api-keys-storage]] 정합)

---

## 11. 개발 일정 · 56 Task

### 11.1 Phase 일정 (v1.1 · 2026-07-13 재정렬)

| Phase | 기간 | 마일스톤 | 상태 |
|-------|------|----------|------|
| **Phase 0 · 검증·통합 (보강 데이)** | 07-01·07-02 | DB·OAuth·와이어·시나리오·API·AEO 통합 | ✅ **완료 90%** (2026-07-02 대표님 승인) |
| **Phase 1 · 본격 개발** | 07-03~07-08 | SaaS A MVP 코드 완성 | ✅ 완료 |
| **Phase 2 · SaaS A 정식 가동** | 07-09 | `lab.staris.cloud` 라이브 · 원장님 사용 | ✅ 완료 |
| **Phase 3 · 원장님 피드백 반영** | 07-06~07-08 | 캘린더 UI 4건 즉시 반영 + 마스터 6종 seed · 파트너 계약 | ✅ 완료 |
| **Phase 4 · 홈페이지·쇼핑몰 스펙 회의** | **07-13** | 확정 결정 10건 · v1.1 승격 | ✅ **완료** |
| **Phase 5 · 이번 주 확정 미션** | 07-14~07-18 | 메뉴·카테고리 · PG사 · 싱가폴 3안 · 모델 사양 | ⏳ **진행 중** |
| **Phase 6 · 콘텐츠 준비** | 07-21~07-25 | 원장님 콘텐츠·이미지 전달 | ⏳ |
| **Phase 7 · 홈페이지 개발** | 07-28~08-22 | 홍보 홈페이지 + 상담 + 이지 클래스 69만 결제 | ⏳ |
| **Phase 8 · 1차 오픈** ★ | **2026-08월 말** | 홍보 홈페이지 + 상담 + 69만 결제 라이브 (회장님 미국 출국 전) | ⏳ |
| **Phase 9 · 간단 LMS** | 09월 | 수강생 히스토리 관리 (전면 LMS X) | ⏳ |
| **Phase 10 · 쇼핑몰 결제단** | 09~10월 | 기성 솔루션(카페24 등) 활용 | ⏳ |
| **Phase 11 · SaaS B·C + 해외** | 10월 이후 | 광고 자동화 · Face Lab v7 · 싱가폴 B2B | ⏳ |

> **v1.0 → v1.1 변경 근거** (2026-07-13 회의):
> - Phase 4·5·6 = SaaS 베타 오픈 → **홈페이지 우선** 로 순서 재정의
> - 1차 오픈일: 07-21 (베타) / 08-10 (v1.0 견적) → **08월 말** (회장님 미국 출국 전)
> - 결제 범위 축소: 이지 클래스 69만원만 (온라인 강의 판매 보류)
> - 쇼핑몰 자체 개발 폐기 → 기성 솔루션 채택

### 11.2 D+1·D+2 검증·통합 데이 진척 (2026-07-02 D+2 오후 15:00)

| 항목 | 담당 | 상태 | 산출물 |
|------|------|------|--------|
| DB schema v1.0 확정 | 한승철 | ✅ | `db/init_v1.sql` · `data/artbrows.db` |
| Alembic 초기 세팅 | 한승철·클로드 | ✅ | `alembic.ini` · `alembic/env.py` · `versions/0001_initial_schema.py` |
| 56 Task Breakdown v1.0 확정 | 클로드 | ✅ | `docs/TASK-BREAKDOWN-56.md` |
| 사용자 시나리오 PRD (2 타겟 × 9 단계) | 이서연·PM | ✅ | `docs/USER-SCENARIOS-v1.md` |
| 외부 API 통합 명세 | 박서윤·한승철 | ✅ | `docs/API-INTEGRATION-SPEC-v1.md` |
| OAuth 시퀀스 다이어그램 (4 provider) | 박서윤 | ✅ | `docs/OAUTH-SEQUENCE-v1.md` (Mermaid) |
| Face Lab v7 사용자 플로우 | 최예진 | ✅ | `docs/FACELAB-USER-FLOW-v1.md` |
| 모바일 와이어프레임 8 화면 | 김민서 | ✅ | `docs/WIREFRAMES-v1.md` (Figma 대체 · ASCII 텍스트) |
| 키워드 60 롱테일 | 이서연·박서윤 | ✅ | `docs/KEYWORDS-LONGTAIL-v1.md` (60개 · 인텐트 4분류 · 해시태그 40+) |
| AEO 12 노드 | 이서연·클로드 | ✅ | `docs/AEO-NODES-v1.md` (Q&A 12 · JSON-LD · llms.txt 초안) |
| Luxury Dark 컴포넌트 라이브러리 | 유나 | ⏳ | 유나 외주 (D+3 이후) |

**D+2 완료율:** 9 / 10 (90%) · 남은 1건 = 유나 외주 (D+2 범위 밖)

`docs/TASK-BREAKDOWN-56.md` 56 task 상세 표 참조.

### 11.3 의존성 그래프

```
이서연 PRD ──┐
            ├─→ 김민서 와이어 ──┐
유나 톤    ──┘                 ├─→ 한승철 백엔드 ──┐
                                                 ├─→ 클로드 통합 ──→ 정식 가동
박서윤 OAuth ─→ 한승철 라우터 ──┘                 │
                                                 │
최예진 Unreal ─→ MetaHuman ──→ Face Lab v7 ─────┘
```

---

## 12. 수익 모델 · KPI

### 12.1 수익 매트릭스

| 출처 | 가격 | 비고 |
|------|------|------|
| 시술 (오프라인) | 수십~수백만원 | 학원 매출 |
| 수강 (오프라인) | 69~200만원 | 학원 매출 |
| SaaS B 광고툴 (DIY) | 월 5~15만원 | 살롱·강사 구독 |
| SaaS C Face Lab 상담 예약금 | 19,000원 | 시술 시 차감 |
| **SaaS A2 B2B 라이센스** ★ NEW | 월 10~30만원 | 다른 학원 (김다은 발견) |
| SaaS A5 공모전 응모비 | 5,000원/회 | 수강생 |

### 12.2 3개월 KPI 추정

| 단계 | 수치 | 매출 |
|------|------|------|
| SaaS C 시뮬 사용자 | 10,000명 | - |
| 상담 신청 (15%) | 1,500건 × 19,000원 | **2,850만원** |
| 시술 전환 (30%) | 450건 × 50만원 평균 | **2.25억원** |
| 수강 전환 (시술 후 5%) | 22.5명 × 200만원 | **4,500만원** |
| SaaS B 구독 | 50명 × 10만원/월 | **1,500만원** (3개월) |
| A2 B2B 라이센스 | 5 학원 × 20만원/월 | **300만원** (3개월) |
| **3개월 총 매출 추정** | | **약 3.2억원** |

### 12.3 비용

- API 비용 약 ₩20만/월
- 인프라 0원 (개발 모드), 베타 후 ~5만/월
- **순이익률 추정 80%+**

(메모리 [[artbrows-revenue-model-v2-2026-06-30]] 정합)

### 12.4 차별점 ROI

| 차별점 | 가치 |
|--------|------|
| 30년 패턴 DB | 경쟁사 따라할 수 없음 (해자) |
| 모비딕 자동화 | 검증된 패턴 (안정성) |
| 시술→수강 funnel | 단일 사용자 매출 5~10배 (전환) |
| Luxury Dark 톤 | 럭셔리 포지셔닝 (가격 결정력) |
| LIVE 스트리밍 (중국 벤치마크) | 40배 인기 (콘텐츠 ROI) |

---

## 13. 리스크 매트릭스

| # | 리스크 | 영향 | 완화 |
|---|--------|------|------|
| R1 | Meta Business Verification 5~7일 지연 | SaaS B 본격 지연 | OAuth Mock 우선 · 카피·이미지 사전 생성 |
| R2 | 의료광고법 §5.3 자문 미확정 | 워터마크·카피 정확도 | 보수적 「체험용」 + 「90% 재현 보장」 우선 적용 |
| R3 | 원장님 시범 사용 피드백 폭주 | D+6 일정 압박 | D+5 17:00 1차 / D+6 종일 반영 |
| R4 | MetaHuman 5+1체 일정 지연 | C 베타 6체 미달 | 「수아·민지」 2체부터 시작 |
| R5 | Quick Tunnel URL 변경 | 원장님 접속 끊김 | 영구 Tunnel D+2 셋업 |
| R6 | 광고 API 결제 한도 미정 | 광고 본격 운영 지연 | 대표님 결정 대기 |
| R7 | 첫 100명 무료 채널 미정 | 베타 사용자 모집 지연 | K1 카톡방 우선 검토 |
| R8 | 동의 미흡 (PIPA) | 법적 위험 | 명시 체크박스 + 변호사 검수 |

---

## 14. 8 직원 조직 · 역할

| # | 직원 | 역할 | 상세 |
|---|------|------|------|
| ① | 이서연 | 기획·마케팅 | 키워드·페르소나·카피·AEO |
| ② | 유나 | 그래픽·비주얼 | 키비주얼·디자인 시스템 (반복은 Claude Code) |
| ③ | 한승철 | 인프라·풀스택 | DB·OAuth·API 통합·배포 |
| ④ | 김민서 | 시각·UI | 모바일 우선 UX·Figma·인터랙션 |
| ⑤ | 김다은 | **SaaS A PM** | 학원·강의·홈페이지 책임 |
| ⑥ | 박서윤 | **SaaS B PM** | 광고·ROAS·DIY 모델 책임 |
| ⑦ | 최예진 | **SaaS C PM** | Face Lab·MetaHuman·시술 R&D 책임 |
| ⑧ | 클로드 | 총괄·자동화 | 8명 오케스트레이션·메모리·일일 브리핑 |

페르소나 상세: `personas/` 폴더 (3 PM 신규 충원 완료)

---

## 15. 자율 발전 시스템

### 15.1 매일 17:00 자동 일일 브리핑

- `scripts/generate_daily_briefing.py` (모비딕 패턴 응용)
- 산출: `reports/briefing_YYYY-MM-DD.{pdf,p1.png,p2.png}`
- 매일 18:00 SMTP 자동 이메일 (대표님·원장님)

### 15.2 작업 로그 입력 (8 직원)

```bash
echo '{"staff":"김다은","task":"...","status":"done","time":"14:30"}' >> data/logs/saas_a_2026-07-01.jsonl
```

### 15.3 Goal 패턴

- 매일 09:00 각 PM Goal 1줄 선언 (카카오 채널)
- 매일 17:00 달성·미달 보고
- 매주 토 16:00 통합 보고서

### 15.4 하네스 공법 준수

- 중요 결정 = 대표님 직접 (개발 단계 절대 규칙)
- 그 외 = 자율 진행
- 대기 항목 = `[[pending-decisions]]` 메모리 자동 누적

(메모리 [[artbrows-mobydick-pattern-adoption]] 정합)

---

## 16. 결정 사항 · 대기 항목

### 16.1 확정 (누적 · 회의 합의)

**v1.0 초안 (2026-06-30)**:
✅ 3 SaaS 구조 (A·B·C) · 8 직원 체제 · Luxury Dark 단일 톤
✅ Python 백엔드 (모비딕 패턴) · DIY 광고 모델 (위탁 X)
✅ Unreal 5.8 · 장미지 디지털 분신 동의 · A1·A2 코드 골격
✅ Cloudflare Quick Tunnel · Gemini·OpenAI API 검증
✅ DB schema v1.0 (한승철) · OAuth 시퀀스 v2 (박서윤) · 페르소나 v2.0 (이서연)
✅ 와이어프레임 8장 (김민서) · 컴포넌트 24개 (유나) · 「수아」 MetaHuman (최예진)
✅ 「극사실 아트 눈썹」 키워드 · 인물 톤 표준

**07-06 원장님 회의**:
✅ 협업 사이클 확정 (원장님 → 본부장 구조화 → 박대표 구현 → 카톡방 실시간 피드백)
✅ 캘린더 UI 4건 (요일 반복 · 커스텀 특강 · PNG 크게 · 사용법 페이지)
✅ 수업 종류 4종 (이지 클래스 · 소묘 · 극사실 눈썹 · 제거)
✅ 마스터 6종 seed · 파트너 계약 (이지 클래스 위임)
✅ 비포·애프터 촬영 방식 = 모델 사전 촬영 (AI 얼굴 대체 X)

**07-13 홈페이지·쇼핑몰 스펙 회의 (v1.1 신규)**:
✅ **도메인 = `artbrow.co.kr`** (가비아 · 법인 결제 · 14,000원/년)
✅ **개발 순서 3단계** = ①홍보 홈페이지+상담 → ②간단 LMS → ③쇼핑몰 결제
✅ **1차 오픈 = 2026-08월 말** (기존 08-10 → 이동 · 회장님 미국 출국 전)
✅ **결제 대상 = 이지 클래스 69만원만** (온라인 강의 판매 X)
✅ **결제 방식 = 홈페이지 자체 결제** (인스타 결제 X · DB 확보)
✅ **쇼핑몰 방식 = 카페24 확정** (v1.2 · 2026-07-13 오후 대표님 결정) · 자체 개발 X
✅ **웹 기획 담당 = 대표님 쪽** (본부장 이서연 상시 옆에서 픽스)
✅ **백엔드 인력 = 박대표 백엔드 전문가 활용** (별도 비용 X)
✅ **싱가폴 진출 = 브로우 하우스 3안 프로포즈** (팝업/정기방문/아카데미)
✅ **외국인 마케팅 = B2B 에이전시 우선** · 인스타 글로벌 계정 보조

### 16.2 대표님 결정 대기 (v1.1 재정렬 · 2026-07-13 기준)

#### 이번 주 (07-14 ~ 07-18)

| # | 결정 | 담당 | 마감 |
|---|------|------|------|
| ⏳ A | **PG사 선택** (카페24 지원 목록에서) · [비교표 정본](PG-COMPARISON-2026-07-13.md) | 원장님·박대표 | 07-18 |
| ⏳ B | **카페24 계정 개설 + 상품 등록 범위** (이지 클래스 69만 우선) · [체크리스트+상품 시트 정본](CAFE24-SETUP-2026-07-13.md) | 이서연·박대표 | 07-16 |
| ⏳ C | **메뉴·카테고리 확정** (유미코리아 벤치마크 기반) | 이서연·원장님 | 07-18 |
| ⏳ D | **모델 요청 사양 발송** (PT 셀럽 남성 컨택) | 이서연 | 07-16 |

#### 별도 회의·중장기

| # | 결정 | 담당 |
|---|------|------|
| ⏳ E | 상표권 「극사실 아트 브로우」 조합 재출원 | 원장님 · 변리사 |
| ⏳ F | 로고·CI·BI 디자인 방향 | 대표님·원장님 |
| ⏳ G | 문신사 국가자격증 정보 (수강생용) | 회장님 |
| ⏳ H | 브랜드명 확장 (「아트페이스」 등) | 회장님·대표님 |

#### 오래된 대기 (v1.0 → v1.1에서 상태 갱신)

| # | 항목 | v1.0 상태 | v1.1 상태 |
|---|-----|----------|----------|
| Meta Business Verification (사업자등록증) | ⏳ 대기 (07-01) | ⏳ 여전히 대기 → SaaS B 착수 전 필요 |
| 의료광고법 외부 자문 30만원 | ⏳ 대기 (3일) | ⏳ 여전히 대기 → 광고 카피 작성 전 필요 |
| 「장미지」 표준 SVG 서명 | ⏳ 대기 (07-02) | ⏳ 여전히 대기 → 홈페이지 브랜드 표현 전 필요 |
| 광고 API 결제 한도 | ⏳ 대기 | ⏳ 여전히 대기 → PG 결정과 함께 |
| 베타 오픈 시점 (07-21 vs 07-28) | ⏳ 대기 | ✅ **재정의** = 08월 말 홈페이지 1차 오픈 (베타 개념 폐기) |
| 첫 100명 무료 채널 | ⏳ 대기 | ⏳ 여전히 대기 → 오픈 시점에 결정 |
| ngrok Pro $8/월 | ⏳ 대기 | ⏳ 여전히 대기 (OAuth 콜백 개발용) |

### 16.3 즉결 (회의 중 OK)

❌ ~~Figma 라이선스 $15/월~~ — **2026-07-02 취소** · `WIREFRAMES-v1.md` 텍스트 대체 성공 (월 $15 절약)
❌ ~~쇼핑몰 자체 개발~~ — **2026-07-13 폐기** · **카페24 확정** (v1.2)
❌ ~~인스타 결제 붙이기~~ — **2026-07-13 폐기** · 홈페이지 자체 결제로 통일 (DB 확보)
❌ ~~인스타 글로벌 계정 신설 (외국인 대상)~~ — **2026-07-13 보류** · B2B 에이전시 우선

---

## 17. 부록

### 17.1 회의록·문서 인덱스

| # | 문서 | 일자 | 비고 |
|---|------|------|------|
| 1 | `docs/MASTER-PLAN-2026-06-29.md` | 06-29 | 마스터 플랜 v1.0 |
| 2 | `docs/REVIEW-2026-06-30.md` | 06-30 | 점검 회의 v1 |
| 3 | `docs/REVIEW-2026-06-30-v2-dialogue.md` | 06-30 | 점검 회의 v2 (자유 대화) |
| 4 | `docs/KATALK-2026-06-30-after-meeting.md` | 06-30 | 단톡방 (보강 진척) |
| 5 | `docs/TASK-BREAKDOWN-56.md` | 07-02 | 56 task + 의존성 · **v1.0 확정** |
| 6 | `docs/USER-SCENARIOS-v1.md` | 07-02 | **★ 2 타겟 × 9 단계 시나리오** |
| 7 | `docs/API-INTEGRATION-SPEC-v1.md` | 07-02 | **★ AI · 광고 · 메시징 · 결제 명세** |
| 8 | `docs/OAUTH-SEQUENCE-v1.md` | 07-02 | **★ Kakao · Meta · Naver · Google 시퀀스 (Mermaid)** |
| 9 | `docs/FACELAB-USER-FLOW-v1.md` | 07-02 | **★ 사진 업로드 → 2D + 3D 결과 흐름** |
| 9b | `docs/WIREFRAMES-v1.md` | 07-02 | **★ 모바일 8 화면 텍스트 와이어 (Figma 대체)** |
| 9c | `docs/KEYWORDS-LONGTAIL-v1.md` | 07-02 | **★ 60 롱테일 키워드 · 인텐트 분류 · 해시태그** |
| 9d | `docs/AEO-NODES-v1.md` | 07-02 | **★ AEO 12 Q&A 노드 · JSON-LD · `/llms.txt` 초안** |
| 10a | `docs/MEETING-2026-07-03-productization.md` | 07-03 | **★★ 8 직원 3 SaaS 상품화 회의 (40+ 아이디어)** |
| 10b | `docs/RESEARCH-SAAS-B-MARKETING-AUTOMATION.md` | 07-03 | **★★★ SaaS B 시장 조사 (5개 검색 종합)** |
| 10c | `docs/SAAS-B-PLAN-v2.md` | 07-03 | **★★★ SaaS B 상세 기획 v2.0 · 하이브리드 요금 · 3 팩 · Phase GTM** |
| 11a | `docs/MEETING-2026-07-06-MINUTES.md` | 07-06 | **★★ 지난주 원장님 회의 정본 (39:47) · 콘텐츠·광고 자동화 요청 + 캘린더 UI 피드백** |
| 11b | `docs/MEETING-2026-07-13-SPEC.md` | 07-10 | 스펙 준비 문서 (07-13 회의 사전) |
| 11c | `docs/MEETING-2026-07-13-BENCHMARK.md` | 07-10 | 유미코리아 벤치마크 (07-13 회의 사전) |
| 11d | `docs/MEETING-2026-07-13-MINUTES.md` | 07-13 | **★★★ 07-13 회의 정본 (66:10) · 확정 결정 10건 · v1.1 근거** |
| 12 | `docs/DEPLOYMENT-port-forwarding.md` | 06-29 | 배포 옵션 |
| 13 | `docs/DEPLOYMENT-vercel.md` | 06-29 | Vercel 옵션 (보류) |
| 14 | `docs/DEPLOYMENT-app-eyebrows.md` | 06-29 | 도메인 셋업 |
| 15 | `실행가이드.md` | 06-30 | 5분 시작 가이드 |
| 16 | `README.md` | 06-29 | 프로젝트 개요 |
| 17 | `alembic/README.md` | 07-02 | Alembic 마이그레이션 |

### 17.2 메모리 인덱스

핵심 메모리 30+ 영구 보관 (`~/.claude/projects/.../memory/`):

| 분류 | 메모리 |
|------|--------|
| **사업** | `artbrows-platform-vision-2026-06-29` · `artbrows-3saas-formal-planning-2026-06-29` · `artbrows-revenue-model-v2-2026-06-30` |
| **기술** | `artbrows-no-more-html-files-python-platform` · `artbrows-mobydick-pattern-adoption` · `artbrows-dev-mode-only-no-mac-mini` |
| **디자인** | `artbrows-luxury-dark-tone-final` · `artbrows-persona-tone-standard` · `artbrows-design-division-of-labor` |
| **AI 도구** | `artbrows-ai-tools-stack` · `artbrows-image-quality-policy` · `artbrows-higgsfield-policy-revised` · `artbrows-api-keys-storage` |
| **콘텐츠** | `artbrows-main-keyword-art-brow` · `artbrows-china-market-keywords-2026-06-29` · `artbrows-class-content-master-works` |
| **시술** | `artbrows-pre-treatment-pencil` · `artbrows-jangmiji-pattern-library` · `artbrows-business-model-class-automation` |
| **회의** | `meeting-photos-2026-06-29` · `artbrows-master-plan-2026-06-29` · `artbrows-review-2026-06-30` · `meeting-2026-07-13-decisions` (v1.1) |
| **격리** | `project-isolation-rule` · `mobydick-standard` (참고만) |

### 17.3 라이브 URL (개발)

**Quick Tunnel (서버 재시작 시 변경):**
`https://tub-toolkit-bachelor-living.trycloudflare.com` (2026-07-13 재발급)

**베타 직전 영구:**
`https://app.eyebrows.staris.cloud`

### 17.4 코드 베이스

```
D:\work\jangmi\artbrows-project\
├── artbrows-platform-py/          # ★ 본 PRD 대상 (Python 백엔드)
├── app-next/                      # 기존 Next.js 메인 (eyebrows-main.staris.cloud)
├── _site/                         # 정적 자료 갤러리 (jangmiji.netlify.app)
├── personas/                      # 8 직원 페르소나
├── 회의-자료/                       # 회의 사진 19장 (영구 보관)
├── docs/PROGRESS.md               # 부모 디렉토리 진척
└── CLAUDE.md                      # 운영 원칙
```

### 17.5 참고 자료

- 모비딕 본진: `D:\work\danzi\pages\mobydick-detail-agent\`
- 모비딕 docs: `D:\work\danzi\pages\mobydick-docs\`
- 모비딕 reports: `D:\work\danzi\pages\reports\`
- 원장님 자료실: `회의-자료/원장님-신규자료-20260629-1740/`
- 마스터 작품 6점: `회의-자료/장미지-원장-마스터작품집/`

---

## 18. 승인 · 변경 이력

이 문서는 ARTbrows Platform의 **공식 PRD**이다. 변경 시 버전 증분 + 변경 이력 명시.

### 18.1 승인

| 역할 | 이름 | v1.0 승인 | v1.1 승인 |
|------|------|-----------|-----------|
| 대표 | 박정주 | ⏳ 대기 | ⏳ 대기 (07-13 결정 10건 반영 확인) |
| 원장 | 장미지 | ⏳ 대기 | ⏳ 대기 |
| 총괄 | 클로드 | ✅ 2026-06-30 | ✅ 2026-07-13 |
| SaaS A PM | 김다은 | ✅ | ✅ |
| SaaS B PM | 박서윤 | ✅ | ✅ |
| SaaS C PM | 최예진 | ✅ | ✅ |
| 기획 | 이서연 | ✅ | ✅ |
| 비주얼 | 유나 | ✅ | ✅ |
| 인프라 | 한승철 | ✅ | ✅ |
| UI | 김민서 | ✅ | ✅ |

### 18.2 변경 이력

| 버전 | 일자 | 변경 요지 | 근거 |
|------|------|----------|------|
| **v1.0** | 2026-06-30 | 초안 · 17 섹션 · 8 직원 통합 PRD | `MASTER-PLAN-2026-06-29.md` · `REVIEW-2026-06-30.md` |
| **v1.1** | 2026-07-13 오전 | **07-13 회의 확정 10건 반영** · Phase 재정렬 · 결정 대기 재편성 · 오픈일 08-10 → 08월 말 · 결제 범위 축소 · 쇼핑몰 방식 전환 | `MEETING-2026-07-13-MINUTES.md` |
| **v1.2** | 2026-07-13 오후 | **카페24 확정** · 「기성 솔루션 검토」 → 벤더 확정으로 승격 · 07-16 마감 태스크 재정의 (카페24 계정·상품 등록) | 대표님 「a」 결정 |

**v1.1 반영 항목 (12건)**:
- 헤더 v1.0 → v1.1 + 변경 요약 블록 신설
- § 0 개발 일정 = 07-13 회의 반영 스케줄로 재작성
- § 3.2 수강생 흐름 결제 = 이지 클래스 69만원만 (한 페이지 + PG)
- § 11.1 Phase 일정 = 12개 Phase로 재정렬 · 08-말 오픈 확정
- § 16.1 확정 = 07-06·07-13 회의 결정 30+ 항목 통합
- § 16.2 결정 대기 = 이번 주 4건 + 별도 회의 4건 + 오래된 대기 상태 갱신
- § 16.3 즉결 = 폐기 3건 추가 (쇼핑몰 자체 개발 · 인스타 결제 · 인스타 글로벌 계정)
- § 17.1 부록 = MINUTES 4건 · SPEC · BENCHMARK 추가
- § 17.2 메모리 = `meeting-2026-07-13-decisions` 신설 반영
- § 17.3 라이브 URL = Quick Tunnel URL 재발급 (2026-07-13)
- § 18 승인 = v1.1 컬럼 추가
- § 18.2 변경 이력 블록 신설

---

### v1.3 변경 이력 (2026-07-27 · 대표님 「완료」 트리거)
- § 헤더 = v1.2 → v1.3 · 최종 갱신일 2026-07-27
- **§ v1.3 변경 요약 신설** — 카드뉴스 대개편 + 홈페이지 유미 벤치 4 Phase + 재발명 방지 규칙 CLAUDE.md §7.1
- § 5·§ 7 관련: 카드뉴스 5 스타일 + 3열 편집기 + 문장 교체 + 4안 양산 · 홈페이지 데스크톱/모바일 분리 + FloatingCTA + BeforeAfterCarousel + AtelierTour + TrustAssets
- § 17.1 부록 = `DEMO-SCRIPT-2026-07-27-v2.md` · `TUTORIAL-CARDNEWS-2026-07-27.md` · `HOMEPAGE-BENCHMARK-YOUME-2026-07-27.md` 추가
- § 17.2 메모리 = `pages-folder-reference-rule` · `homepage-update-plan-2026-07-27` 신설 반영
- 신설 컴포넌트 (7): `OverlayInspector.tsx` · `FloatingCTA.tsx` · `HomePageMobile.tsx` · `BeforeAfterCarousel.tsx` · `AtelierTour.tsx` · `TrustAssets.tsx` · `AnalyzeRegion API`
- 신설 자산: `public/brand/patents/patent-01~03.jpeg`
- 폐기 (홈페이지 4 섹션): AI STUDIO · CONSULT-flow · STARTUP PACKAGE · INSTRUCTOR TRACK (3중 노출 흡수)
- 폐기 (카드뉴스 스타일 11): vogue-magazine · minimal-editorial · bold-question · numbered-steps · quote-focus · before-after · data-card · poem-verse · announcement · polaroid-analog · broken-grid-editorial (LEGACY_ALIAS fallback 유지)

---

> **문서 끝. 다음 단계**:
> - 대표님·원장님 v1.3 승인 대기
> - Phase 4 (모바일 정밀 튜닝) 완료 · 남은 것: HomePage.tsx 원본 정리 (en/zh/manager 3 서브 페이지 이관 조건부)
> - 다음 v1.4 트리거 = 08월 말 1차 오픈 후 실제 사용자 피드백 반영
