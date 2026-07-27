# External API Integration Spec v1.0

> 작성: 박서윤 (SaaS B PM) · 한승철 (백엔드) · 클로드 통합
> 확정: 2026-07-02 D+2 오후 · 개발 기획서 § 9 상세본
> 목적: Phase 1 (07-03~) 착수 전 계약 확정 · 발급 대기 항목 최종 정리

## 0. 통합 원칙

1. **비밀 관리:** `~/.artbrows-secrets/` 폴더 + env var 로드 (git ignore 확정)
2. **재시도:** 지수 백오프 (2·4·8s) · 최대 3회 · 실패 시 폴백 지정
3. **레이트 리밋:** 각 API 자체 한도 안에서 `APScheduler` 로 큐잉
4. **비용 트래킹:** 매 호출 `daily_logs` 에 usage 기록 (모델·토큰·크레딧)
5. **컴플라이언스:** 개인정보 포함 요청은 `pii_consent=1` 사용자만 처리

---

## 1. AI APIs (Gemini 계열 · Claude · Higgsfield)

### 1.1 Gemini (메인)

| 용도 | 모델 | 호출 방식 | 예상 비용 |
|------|------|-----------|----------|
| 텍스트 reasoning | `gemini-3.1-pro-preview` | `google-generativeai` 파이썬 SDK | $1.25/M input · $5/M output |
| 빠른 분류·번역 | `gemini-3.5-flash` | 동일 SDK | 거의 무료 (백만 토큰당 몇 센트) |
| 고품질 2D 이미지 | `gemini-3-pro-image` (= Nano Banana Pro 원본) | 동일 SDK · `generateContent` | 장당 소액 (Higgsfield 통하는 것보다 저렴) |
| 빠른 저가 이미지 | `gemini-3.1-flash-image` | 동일 SDK | 더 저렴 |
| 최고 품질 (예외) | `imagen-4.0-ultra-generate-001` | Vertex AI | 장당 상대적 고가 |
| TTS (장미지 분신) | `gemini-3.1-flash-tts-preview` | 동일 SDK | 문자당 소액 |
| 유튜브 영상 분석 | `gemini-3.1-pro-preview` (URL 직접 입력) | multimodal | 영상 길이 기반 |
| Computer Use (자동화) | `gemini-2.5-computer-use-preview-10-2025` | 별도 endpoint | preview 무료 (제한적) |
| Deep Research | `deep-research` | Agent API | preview 무료 (제한적) |

**Key 위치:** `~/.artbrows-secrets/gemini_api_key` → env var `GEMINI_API_KEY`
**클라이언트 초기화:** `agents/clients/gemini_client.py` (신규 · 07-03 T35 시점)

### 1.2 Claude (코드 · Claude Code 자체)

| 용도 | 모델 | 호출 방식 |
|------|------|-----------|
| 코드·페이지 생성 | `claude-opus-4-7` (Claude Code 세션) | 별도 API 호출 없음 (사용자 세션 내) |
| 백업 reasoning | `claude-opus-4-8` (필요 시) | `anthropic` SDK | 

**Plan:** Max $100/월 (Claude Code 사용 중)

### 1.3 OpenAI (백업)

| 용도 | 모델 | 언제 |
|------|------|------|
| Gemini fallback | `gpt-4o` | Gemini 503 5회 연속 실패 시 |
| 이미지 백업 | `dall-e-3` | Gemini image 실패 시 |

**Key 위치:** `~/.artbrows-secrets/openai_api_key` → env var `OPENAI_API_KEY`
**상태:** 대기 · 실제 fallback 필요 시점까지 호출 없음

### 1.4 Higgsfield (3D · 영상)

| 용도 | 도구 | 비용 |
|------|------|------|
| 3D GLB 생성 (Face Lab) | `image_to_3d` (PBR + quad + symmetry) | 30 크레딧/회 |
| STORY 영상 (24초 릴스) | `generate_video` (Veo 3.1) | 크레딧 상당 |
| 광고 영상 | 동일 | 동일 |

**Plan:** Plus (2026-06-03 결제 · 잔여 크레딧 매주 확인)
**금지:** 2D 이미지 생성 (`nano_banana_pro` 등) — Gemini 직접 호출로 대체 (2026-06-29 정책)

---

## 2. 광고 APIs (SaaS B 핵심)

### 2.1 Meta Marketing (Instagram + Facebook)

| 항목 | 값 |
|------|-----|
| 앱 등록 | Meta Business Manager (사업자등록증 필요 · 결정 대기 C) |
| 인증 대기 | 5~7일 (Business Verification) |
| 콜백 URL | `https://lab.staris.cloud/oauth/meta/callback` (Vercel 라이브) |
| Scope | `ads_management`, `pages_read_engagement`, `instagram_content_publish` |
| 라이브러리 | `facebook-business>=20.0.0` |
| 레이트 | 시간당 200 호출 (표준) |
| 폴백 | Mock 응답 셋 (`agents/mocks/meta_mock.py`) — Phase 1 개발용 |

**Mock 우선 개발:** 인증 대기 5~7일 리스크 → OAuth Mock 으로 UI·라우터 먼저 완성 (D+1 T11 · D+2 T21)

### 2.2 네이버 검색광고

| 항목 | 값 |
|------|-----|
| 신청 | 네이버 광고주 센터 (영업일 3~5일) |
| 인증 방식 | API Key + Secret Key + Customer ID |
| 콜백 URL | `https://lab.staris.cloud/oauth/naver/callback` |
| 라이브러리 | REST API 직접 호출 (`requests`) |
| 레이트 | 초당 60 호출 |
| 폴백 | Mock 응답 |

### 2.3 Google Ads

| 항목 | 값 |
|------|-----|
| 신청 | 즉시 (Google Cloud Console) |
| 인증 방식 | OAuth 2.0 + Developer Token |
| 콜백 URL | `https://lab.staris.cloud/oauth/google/callback` |
| 라이브러리 | `google-ads>=24.0.0` |
| 레이트 | 일 15,000 호출 |
| Developer Token | 등급 승격 대기 (Basic → Standard 5~10일) |

### 2.4 카카오 채널 광고

| 항목 | 값 |
|------|-----|
| 신청 | 카카오 비즈니스 (즉시) |
| 콜백 URL | `https://lab.staris.cloud/oauth/kakao/callback` |
| 라이브러리 | REST API 직접 |
| 특이사항 | 카카오 SSO 와 별개 앱 등록 |

---

## 3. 메시징 APIs

### 3.1 카카오 알림톡

| 항목 | 값 |
|------|-----|
| 발신 프로필 | 예비 신청 (사업자등록증 필요 · 결정 C 와 동일) |
| 템플릿 등록 | 15종 (A × 5 · B × 5 · SaaS B × 5) 사전 승인 대기 |
| 라이브러리 | REST API 직접 (Aligo 또는 Solapi 게이트웨이) |
| 발송 원가 | 건당 8~15원 |
| 폴백 | LMS (30~40원/건) 자동 전환 |

**우선순위:** 예약 알림·상담 접수 확인 · 결제 완료 3종 최우선

### 3.2 텔레그램 봇 (예산 알림 · 대표님 개인)

| 항목 | 값 |
|------|-----|
| 봇 등록 | @BotFather (즉시) |
| 라이브러리 | `python-telegram-bot` 또는 REST 직접 |
| 용도 | 광고 예산 임계값 초과 알림 (5초 이내 도달) |
| 채널 | 대표님 개인 채팅 |

---

## 4. 결제 API — Toss Payments

| 항목 | 값 |
|------|-----|
| 계약 | 사업자등록증 필요 (결정 C 와 묶음) |
| 결제 종류 | 카드 · 계좌이체 · 카카오페이 · 네이버페이 |
| 콜백 URL | `https://lab.staris.cloud/api/toss/webhook` |
| 라이브러리 | REST API (SDK 는 JS 만 있음 · Python 은 직접 호출) |
| 수수료 | 2.9~3.5% (등급별) |
| 분할 결제 | 3개월 무이자 (Toss 제공) |

**결제 시나리오:**
- 예약금 19,000원 (Face Lab v7 → 상담 예약)
- 수강료 69만원 (이지클래스) · 200만원 (극사실 3일반)
- SaaS B 구독 (Phase 3 이후 도입 검토)

---

## 5. 인증 · SSO

### 5.1 카카오 SSO (메인 소셜 로그인)

| 항목 | 값 |
|------|-----|
| 앱 등록 | Kakao Developers (즉시) |
| Scope | `profile_nickname`, `account_email`, `talk_message` (알림톡 발송용) |
| 콜백 URL | `https://lab.staris.cloud/oauth/kakao/callback` |
| 라이브러리 | REST 직접 (파이썬 공식 SDK 없음) |
| 토큰 저장 | `users.kakao_oauth` (Fernet 암호화 후 저장) |

### 5.2 네이버 로그인

| 항목 | 값 |
|------|-----|
| 앱 등록 | Naver Developers (즉시) |
| 콜백 URL | `https://lab.staris.cloud/oauth/naver/callback` |
| 토큰 저장 | `users.naver_oauth` |

### 5.3 Google · Meta (백업 · Phase 3+)

Phase 1·2 우선순위 아님. 카카오 · 네이버 안정화 후 추가.

---

## 6. 발급 대기 매트릭스 (2026-07-02 기준)

| # | API | 발급 · 인증 | 예상 소요 | 블로킹 대상 | 폴백 |
|---|-----|-------------|-----------|-------------|------|
| 1 | Meta Business Verification | 대표님 사업자등록증 제출 | 5~7일 | SaaS B 실 광고 게시 | Mock (D+1~D+8) |
| 2 | Google Ads Developer Token | 앱 등록 후 승격 신청 | 5~10일 | Google 광고 | Mock |
| 3 | 네이버 검색광고 광고주 | 광고주 센터 신청 | 3~5일 | 네이버 광고 | Mock |
| 4 | 카카오 알림톡 발신 프로필 | 사업자등록증 (Meta 와 묶음) | 3~5일 | 자동 알림 | LMS 폴백 |
| 5 | Toss Payments 계약 | 사업자등록증 | 3~5일 | 결제 전체 | Sandbox 모드 |
| 6 | 카카오 SSO (자체 앱) | Kakao Developers | 즉시 | 소셜 로그인 | 이메일 로그인 |
| 7 | Gemini API | Google Cloud (완료) | ✅ | - | - |
| 8 | Higgsfield Plus | 결제 (완료) | ✅ | - | - |

**★ 크리티컬:** 대표님 사업자등록증 제출 (B1 블로커) → 1·4·5 동시 시작 가능

---

## 7. Rate Limit · 비용 예산 (월간 예상)

| API | 예상 월 호출 | 예상 월 비용 |
|-----|--------------|--------------|
| Gemini 3.1 Pro (텍스트) | 500만 토큰 | ~$25 |
| Gemini 3 Pro Image | 500장 | ~$25 |
| Gemini 3.5 Flash | 대량 | ~$5 |
| Higgsfield 3D | 30회 | ~900 크레딧 (Plus 잔여로 커버) |
| Higgsfield 영상 | 15편 | ~4500 크레딧 (Plus 잔여로 커버) |
| Meta·Google·Naver 광고 | 광고비 별도 | 광고비 = 대표님 결정 (② 결제 한도) |
| 카카오 알림톡 | 2,000건 | ~₩20,000 |
| Toss 수수료 | 매출의 3% | 매출 기반 |

**월 API 원가 (광고비 제외):** ~$60 + Higgsfield 크레딧 잔여로 커버 · 알림톡 2만원 = **~₩10만/월**
**대표님 결정 대기:** 광고 예산 한도 (모마스터플랜 ②)

---

## 8. Phase 1 (07-03~) 착수 순서

1. **D+1·D+2 (완료):** DB · Alembic · OAuth Mock 셋업
2. **D+3 T35 (한승철):** Gemini 클라이언트 (`agents/clients/gemini_client.py`) + 텍스트 · 이미지 호출 wrapper
3. **D+3 T38 (박서윤):** Meta Marketing 1차 테스트 (Mock → 발급 후 실 호출)
4. **D+4 T43:** 카카오 SSO 실 연동 + 알림톡 발신 프로필 신청 결과 반영
5. **D+5 T51:** 예산 알림 시스템 (텔레그램 우선 · 카카오 알림톡 병행)

## 9. 문서 이력

| 버전 | 날짜 | 변경 |
|------|------|------|
| v1.0 | 2026-07-02 | 초기 확정 (D+2 오후) |

## 관련 문서
- [[artbrows-prd-v1-2026-06-30]] § 9 개요
- [[artbrows-api-keys-storage]] 비밀 관리
- [[artbrows-ai-tools-stack]] 도구 조합
- `docs/TASK-BREAKDOWN-56.md` T35·T38·T43·T51
- `alembic/versions/0001_initial_schema.py` DB 테이블 (users.kakao_oauth 등)
