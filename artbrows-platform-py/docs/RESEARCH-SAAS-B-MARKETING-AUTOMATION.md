# SaaS B 시장 조사 — 마케팅 자동화 플랫폼

> 작성: 클로드 · 박서윤 (B PM) · 이서연 (마케팅) 감수
> 조사일: 2026-07-03 D+3
> 목적: SaaS B 상세 기획 v2.0 착수 전, 「마케팅 자동화 플랫폼이 무엇이며 어떻게 만들어야 하는가」 시장 사실 정리

## 0. 조사 요약 (한 페이지)

| 축 | 결론 |
|---|---|
| **정의** | 고객 행동 기반으로 이메일·SMS·SNS·광고를 사람 개입 없이 자동 실행하는 소프트웨어 |
| **필수 5 기능** | ① 세그먼트 ② 워크플로우 빌더 ③ 다채널 발송 ④ A/B 테스트·분석 ⑤ AI 개인화 |
| **글로벌 벤치마크** | HubSpot (올인원 CRM) · ActiveCampaign (중견 시장 표준) · Klaviyo (이커머스 특화) |
| **한국 시장** | 스티비 (이메일) · 채널톡 (메신저) · 메타플라이어 (통합) · **뷰티 살롱 특화는 공백** |
| **뷰티 광고 매체 순위** | ① 메타 (인스타·페북) ② 카카오 ③ 유튜브 ④ 네이버 |
| **Meta Graph API** | v22.0 · 2단계 (container → publish) · 앱 심사 2~4주 · Business 계정 필수 |
| **2026 AI 트렌드** | 도입 후 효율 +37% · 세일즈 사이클 -22% · 초개인화가 표준 |
| **★ 우리 기회** | **한국·미용업·반영구 특화** 자동화는 사실상 무주공산 — 니치 SaaS 성립 가능 |

---

## 1. 마케팅 자동화 플랫폼 = 무엇인가

### 1.1 정의

**고객 행동(가입·이탈·방문·클릭 등)을 트리거로, 이메일·SMS·SNS·광고를 사람 개입 없이 실행·측정·최적화하는 소프트웨어.**

- 「자동 이메일」 이상이 아니라 조건·분기·지연을 포함한 **워크플로우 자동화**
- 세그먼트 (고객 그룹) 관리 · A/B 테스트 · 성과 측정 통합
- 2020년 이후 「마테크(MarTech)」 시장으로 급성장 (한국 B2B SaaS 시장 확대)

### 1.2 필수 5 기능 (Salesforce · HubSpot · ActiveCampaign 공통)

| # | 기능 | 설명 |
|---|---|---|
| ① | **세그먼트 관리** | 나이·지역·행동·태그 조합으로 고객 그룹 생성 |
| ② | **워크플로우 빌더** | 트리거 → 조건 → 액션 (이메일·SMS·광고) → 지연 → 다음 액션 (드래그앤드롭 UI) |
| ③ | **다채널 발송** | 이메일·SMS·카카오·SNS·광고 통합 (Send-Only Layer) |
| ④ | **A/B 테스트·분석** | 카피 2안·발송 시간·이미지 분기 실험 · ROI 대시보드 |
| ⑤ | **AI 개인화** | 최적 발송 시간·전환 확률·카피 자동 생성 (2026 표준) |

### 1.3 2026 트렌드

- **AI 통합:** 도입 후 마케팅 효율 +37% · 세일즈 사이클 -22%
- **초개인화(Hyper-personalization):** CDP + 퍼스트파티 데이터로 개인별 메시지
- **자동화 워크플로우:** 900+ 사전 템플릿 (ActiveCampaign) · 드래그앤드롭이 표준
- **ROAS·매출 attribution:** 광고→매출 직접 매칭 (Klaviyo 강점)

---

## 2. 글로벌 벤치마크 3

### 2.1 HubSpot — 올인원 CRM 리더

| 항목 | 값 |
|---|---|
| Starter | $20/월 (1,000 contacts · 워크플로우 X) |
| Professional | $890/월 + **온보딩 $3,000** + 연간 약정 |
| 강점 | CRM · 세일즈 · 마케팅 단일 플랫폼 · B2B SaaS 표준 |
| 약점 | 진입 장벽 (Professional 요금 · 온보딩) |

**시사점:** 「스몰 사업자에게는 너무 비싸다」 = 한국 소상공인 대상 저가 SaaS 기회

### 2.2 ActiveCampaign — 중견 시장 기본 선택

| 항목 | 값 |
|---|---|
| Plus (1,000 contacts) | $49/월 (연간 결제) |
| Plus (10,000 contacts) | $189/월 |
| 강점 | **비주얼 워크플로우 빌더 + CRM + 900+ 템플릿** · 유연성 · 저렴 |
| 약점 | 한국어 지원 부족 · 카카오 알림톡 미지원 |

**시사점:** UI 표준으로 삼을 만함 (드래그앤드롭 워크플로우) · 900+ 템플릿 발상은 「반영구 특화 팩」 3~5개로 축소해 재현 가능

### 2.3 Klaviyo — 이커머스 특화

| 항목 | 값 |
|---|---|
| Email 1,000 profiles | $45/월 |
| 10,000 profiles | $150/월 |
| 강점 | **매출 attribution 내장** · 이커머스 flow (이탈·리마인더) · 매출 직접 측정 |
| 약점 | 이커머스 외 사용성 낮음 · 「모든 프로필」 과금 정책 논란 |

**시사점:** **매출→광고 attribution** = 우리도 필수 (「이 광고가 얼마 벌었나」 뷰티 원장에게 결정적 지표)

---

## 3. 한국 시장 — 무엇이 있고 무엇이 없나

### 3.1 있는 것

| 도구 | 카테고리 | 강점 |
|---|---|---|
| **스티비 (Stibee)** | 이메일 뉴스레터 | 국내 이메일 발송 · 채널톡 연동 |
| **채널톡** | 메신저 CRM · 상담 | 국내 표준 · 메시지 · 세일즈 챗 |
| **메타플라이어** | 통합 자동화 | 이메일·문자·카톡 통합 발송 · SME 대상 |
| **HubSpots.io** | HubSpot 한국 총판 | 리드 · 전환 SaaS |
| **SK플래닛 · SBS SmartAds** | 소상공인 광고 | 위치 기반 광고 · 지자체 협력 |

### 3.2 없는 것 (= 우리 기회)

- **뷰티 살롱·반영구 특화** 자동화 = 사실상 공백
- **의료광고법 §5.3 자동 검열** = 없음 (수동 검토)
- **인스타 릴스 자동 게시 + 자동 카피 생성** 국내 SaaS = 소수
- **카카오 알림톡 + Meta 광고 + 네이버 검색 통합 워크플로우** = 뷰티 특화 없음
- **원장님이 30초 안 캠페인 발송** UX = 없음

**결론:** 한국 뷰티·반영구 원장은 「HubSpot 은 너무 어렵고, 인스타 광고는 직접 해야 하고, 매출 매칭은 불가능」 상태.

---

## 4. 뷰티 업계 광고 매체 우선순위 (한국)

메조미디어 · 오픈애즈 조사 종합:

| 순위 | 매체 | 뷰티 업종 사용 특징 |
|---|---|---|
| 1 | **메타 (인스타·페북)** | 시각 소재 강점 · 릴스 · 스토리 · 카탈로그 광고 |
| 2 | **카카오** | 채널톡·톡비즈보드 · 재구매 리마인더 |
| 3 | **유튜브** | 튜토리얼·리뷰 콘텐츠 · 쇼츠 |
| 4 | **네이버** | 검색 광고 · 블로그 SEO |

### 성공 케이스 유형 (한국 뷰티)

| 브랜드 | 방식 | 시사점 |
|---|---|---|
| **프롬메디** (콜라겐팩) | 릴스 인터랙션 광고 (전화 컨셉) | 인터랙션 = CTR 상승 |
| **쏘내추럴** | 한 이미지 · 한 문구 · 한 가격 | 미니멀 = 반영구도 적합 |
| **아토뮤** | AI 캐릭터 (햄스터) 스토리 | 캐릭터 = 인지 상승 |

**우리 적용:**
- SaaS B 프리셋 팩에 「릴스 인터랙션」 · 「미니멀 카드」 · 「AI 캐릭터 스토리」 3 유형 내장

---

## 5. Meta Marketing API (Instagram 자동 게시)

### 5.1 기술 요구사항

| 항목 | 값 |
|---|---|
| API 버전 | v22.0 (2026 stable) |
| 계정 | Instagram Business or Creator (Personal 불가) |
| 필수 연결 | Facebook Page 연결 필수 |
| 권한 | `instagram_basic` · `instagram_content_publish` |
| 앱 심사 | **2~4주** (App Review · Business Verification 완료 후) |
| Test 사용자 | 25명 이내 심사 없이 가능 |

### 5.2 게시 프로세스 (2 단계)

```
1. POST /{ig-user-id}/media
   → media container 생성 (image_url · caption)
2. POST /{ig-user-id}/media_publish
   → container_id 로 실제 게시
```

**게시 가능 형식:** 사진 · 영상 · **릴스** · **캐러셀**

### 5.3 우리 리스크

- App Review 2~4주 → **7-9 정식 가동에 못 맞출 가능성 큼**
- 대응: Test 사용자 25명 안에서 원장님 · 대표님 · 김다은 계정만 우선 · 정식 가동 이후 심사 신청

---

## 6. 「우리는 어떻게 만들어야 하는가」 초록 (기획 문서 예고)

조사에서 도출한 「반드시 있어야 할 것」 8:

1. **세그먼트** — 시술 vs 학원 vs 재방문 3 그룹 최소
2. **워크플로우 빌더** — 드래그앤드롭 필요 없음 · **프리셋 팩 3종** 으로 대체 (원장님 UX 단순화)
3. **다채널** — Meta (인스타 릴스·페북) · 카카오 알림톡 · 네이버 검색 · 유튜브 쇼츠 (4채널)
4. **AI 카피** — Gemini 3.1 Pro 로 카피 10안 자동 · A/B 자동
5. **매출 attribution** — 광고 클릭 → 상담 신청 → 시술 결제 3자 매칭 (Klaviyo 모방)
6. **의료광고법 자동 검열** — Gemini 로 §5.3 위반 감지 (한국 뷰티 특화 방어선)
7. **예산 안전선** — 이미 존재 (`ad_budget_alerts`) · 120% 초과 시 강제 정지
8. **30초 온보딩** — 살롱 정보 5필드 · 팩 선택 · 게시 = 원장님 UX

## 7. 다음 문서

- `docs/SAAS-B-PLAN-v2.md` — 위 8 요건 기반 SaaS B 상세 기획 v2.0

## 관련 문서
- `docs/MEETING-2026-07-03-productization.md` § 2 SaaS B 상품화 발언 (B1~B12)
- `docs/API-INTEGRATION-SPEC-v1.md` § 2 광고 API · § 3 메시징
- `docs/OAUTH-SEQUENCE-v1.md` § 2 Meta OAuth
- [[artbrows-revenue-model-v2-2026-06-30]] 3개월 3.2억 추정

## Sources
- [마케팅 자동화 완벽 가이드 — Salesforce](https://www.salesforce.com/kr/marketing/automation/guide/)
- [2026 마케팅 자동화 솔루션 추천 — 임팩트플로우](https://impactflow.kr/products/marketing/marketing-automation-software)
- [ActiveCampaign vs HubSpot 상세 비교 2026](https://www.emailtooltester.com/en/blog/activecampaign-vs-hubspot/)
- [Best Marketing Automation Software 2026 — Brevo](https://www.brevo.com/blog/best-marketing-automation-software/)
- [Marketing Automation Platform Comparison Guide 2026 — Digital Applied](https://www.digitalapplied.com/blog/marketing-automation-platform-comparison-2026)
- [스티비·채널톡 통합 케이스](https://channel.io/ko/blog/articles/cx-case-stibee-17849d2f)
- [메타플라이어 — CRM & 마케팅 자동화 SaaS](https://www.metaflyer.io/)
- [뷰티 마케팅 사례 모음집 2탄 — 오픈애즈](https://openads.co.kr/content/contentDetail?contsId=17118)
- [Mezzomedia Beauty Marketing Guide](https://www.slideshare.net/slideshow/mezzomedia-beauty-marketing-guide/277470067)
- [Instagram Graph API 사용법 2026 — DEV](https://dev.to/rihpig/2026nyeon-inseutageuraem-geuraepeu-api-sayongbeob-1chn)
- [Publish Content using the Instagram Platform — Meta Developer](https://developers.facebook.com/docs/instagram-platform/content-publishing/)
- [Meta Expands Instagram Management APIs — ALM Corp](https://almcorp.com/blog/meta-expands-instagram-management-apis/)
