# PRD · 카카오 통합 상담 시스템 v0.1
> 2026-07-27 · 담당 한승철 (풀스택) · 회의록 [MEETING-2026-07-27-KAKAO-INTEGRATION-STAFF.md](./MEETING-2026-07-27-KAKAO-INTEGRATION-STAFF.md) 기반
> 승인: 박정주 대표 · 시나리오 v0.1 승인 완료 · 이 PRD 는 실행 계획

---

## 1. 배경

- **문제**: 상담 창구 5개 분산 (K1 오픈채팅 · 카톡 채널 · 인스타 DM · 홈피 폼 · 전화) → 리드 누락 · SLA 불가
- **원인**: 자동화 없음 · 원장님/스태프 수동 대응 · 특히 야간·주말 이탈률 큼
- **기회**: 카카오 채널 챗봇 + 통합 DB 로 접수·저장·알림 자동화 · 원장님은 대응에만 집중

## 2. 목표 (성공 지표)

| 지표 | 현재 | MVP 목표 | 확장 목표 |
|---|---|---|---|
| 리드 자동 저장률 | 20% (홈피만) | 80% (챗봇+홈피) | 95% (5채널 전부) |
| 관리자 알림 지연 | 반나절~1일 | 실시간 (알림톡 3분 이내) | 즉시 (알림톡+푸시) |
| 상담 응대 SLA | 「24시간」 (실제 12h~2d) | 평일 4시간 이내 | 평일 1시간 이내 |
| 이탈률 (접수→응대) | ~40% | ~15% | ~5% |
| 사람 손 태우는 작업 | 대부분 | 응대만 | 응대 + 예외 처리만 |

## 3. 스코프

### 3-1. 1차 MVP (10일 · 8항목 · 회의록 §8 확정)

| # | 항목 | 담당 | 상태 |
|---|---|---|---|
| 1 | 챗봇 접수 자동화 (6트랙 · Kakao i Open Builder + 우리 skill webhook) | 한승철 | 코드 ✅ · 승인 대기 |
| 2 | Notion 단방향 미러 (leads → Notion append · 읽기 전용) | 한승철 | 코드 ✅ · env 대기 |
| 3 | admin/leads 소스 필터 UI (5채널 뱃지 + 관심/방문/지점 컬럼) | 한승철 | ✅ 완료 |
| 4 | 알림톡 관리자 (대표님·원장님 · 알리고 API) | 한승철 | 코드 ✅ · 계약 대기 |
| 5 | 챗봇 브랜드 톤 v0.2 (원장님 페르소나 반영) | 이서연 | Day 0~1 |
| 6 | 카톡 채널 프로필 이미지·배경 3안 | 유나 | Day 1~2 |
| 7 | 개인정보 마스킹 (서버 로그·admin UI) | 한승철 | Day 2 |
| 8 | rate limit + Vercel 배포 + Cloudflare 프록시 | 한승철 | Day 6~7 |

### 3-2. 2차 확장 (+2주 · 5항목)

| # | 항목 | 담당 | 시점 |
|---|---|---|---|
| 1 | 알림톡 고객 (접수 확인 · 강의 안내) | 한승철 | MVP 오픈 후 1주 |
| 2 | 개인정보 90일 자동 삭제 (cron) | 한승철 | MVP 오픈 후 1주 |
| 3 | funnel 지표 5개 대시보드 (analytics) | 김다은 | MVP 오픈 후 2주 |
| 4 | 알림톡 이미지형 (커리큘럼 미리보기) | 유나 + 한승철 | MVP 오픈 후 2주 |
| 5 | 아웃바운드 친구톡 발송 (「무료 강의 안내」 대량) | 이서연 + 한승철 | MVP 오픈 후 3주 |

### 3-3. 명시적 제외 (Out of Scope · v0.1)

- 봇 AI 자유 대화 (Fine-tuning · LLM) — 시나리오 기반만
- 다국어 챗봇 (한국어만 · 영중은 홈피 폼으로)
- CRM 통합 (Salesforce · HubSpot) — 자체 admin/leads 만
- 결제 챗봇 안내 (수강료 결제) — 지금은 상담만
- 전화 STT 자동 전사 (전화 상담은 여전히 수동 입력)

## 4. 아키텍처

```
                       [사용자]
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
   카톡 채널          홈피 폼            인스타 DM
   (챗봇)              /consult          (수동)
       │                  │                  │
       │ skill webhook    │ POST /api/leads  │ 수동 입력
       ↓                  ↓                  ↓
   ┌────────────────────────────────────────────┐
   │        Next.js API (Vercel · 선릉 하이브리드)   │
   │                                              │
   │  /api/webhook/kakao-channel/skill  (신규)   │
   │  /api/leads                        (기존)   │
   │                                              │
   │  saveLead() → 파일 JSON (정본)              │
   │       ↓                                      │
   │  ├─ notionAppendLead() → Notion DB (미러)   │
   │  └─ alimtalkToAdmins() → 대표님·원장님 알림 │
   └──────────┬─────────────────────────┬───────┘
              │                          │
              ↓                          ↓
        Notion Workspace          알리고 (알림톡 벤더)
        「ARTbrows 상담 리드」      → 대표님·원장님 카톡
        (원장님·대표님 조회)        (실시간 알림)
              │
              ↓
        /admin/leads (Next.js 관리 UI)
```

## 5. 데이터 스키마

### 5-1. Lead (JSON 정본 · [src/lib/leads.ts](../app-next/src/lib/leads.ts))

이미 확장 완료 (2026-07-27 · source · kakao_user_id · track · interest · visit_time · location · notion_page_id 추가). 별도 마이그레이션 불필요 (기존 필드 유지 · 신규는 optional).

### 5-2. Notion DB (「ARTbrows 상담 리드」)

컬럼 13개 · 상세는 [KAKAO-CHATBOT-SCENARIO-2026-07-27.md §8](./KAKAO-CHATBOT-SCENARIO-2026-07-27.md) 참조

### 5-3. Alimtalk Log (신규 · MVP 3-4번 자동화 검증용)

`content/notification-log/{yyyy-mm-dd}.jsonl` 형식
```json
{"ts":"2026-07-27T04:30:12Z","type":"alimtalk","tpl":"lead_admin_v1","to":"010-xxxx","lead_id":"...","result":"ok","info_id":"..."}
```

## 6. API 엔드포인트

| 메소드 | 경로 | 용도 | 상태 |
|---|---|---|---|
| POST | `/api/webhook/kakao-channel/skill` | Kakao 챗봇 skill 콜백 (leads 저장 + Notion + 알림톡) | ✅ 구현 |
| GET | `/api/webhook/kakao-channel/skill` | Health check | ✅ 구현 |
| POST | `/api/leads` | 홈피 폼 · 수동 입력용 | ✅ 기존 |
| GET | `/api/leads?limit=N` | admin 조회 | ✅ 기존 |
| POST | `/api/leads/{id}/status` | 상태 변경 (신규 → 답변완료 등) | ❌ 신규 필요 |
| GET | `/api/notification-log?date=YYYY-MM-DD` | 알림톡 발송 이력 조회 | ❌ 신규 필요 |

## 7. 개인정보 처리 방침 (회의록 §2-③)

### 7-1. 저장 데이터

- 이름 (평문 · 필수 · 실명 or 닉네임 허용)
- 폰번호 (평문 · 필수 · 대응 채널)
- 카카오 유저 ID (평문 · optional · 재접속 매칭)
- 메시지·메모 (평문 · optional)

### 7-2. 마스킹 규칙 (서버 로그 · admin UI)

- 서버 로그: `010-xxxx-5678` → `010-****-5678` (뒷 4자리만)
- admin UI: 이름 첫 글자 · 폰번호 뒷 4자리만 · 상세 페이지에서만 전체 표시
- 이력 URL: 짧은 ID (`2026-07-27T04-30-12-abc`) · 이름·폰 URL 노출 X

### 7-3. 삭제 정책 (2차 확장)

- 90일 후 자동 삭제 (cron 일 1회)
- 「등록완료」 상태 = 별도 보관 (수강생 이력 유지)
- 대표님 수동 삭제 UI 제공 (즉시)

### 7-4. 개인정보 처리 방침 페이지 (홈피)

- URL: `/privacy` (신규)
- 수집 항목·목적·기간·제3자 제공(카카오·Notion·알리고) 명시
- 챗봇 진입 시 「동의」 버튼 (2차 확장)

## 8. Rate Limit 설계

| 엔드포인트 | 제한 | 방식 |
|---|---|---|
| `/api/webhook/kakao-channel/skill` | 초당 10건 · 유저별 분당 5건 | IP + kakao_user_id 기반 |
| `/api/leads` (POST) | IP당 분당 3건 | 봇 스팸 방지 |
| `/api/leads` (GET · admin) | 인증된 세션만 | 미들웨어 |

라이브러리: `@upstash/ratelimit` (Redis 없으면 in-memory · 배포 시 Upstash Free)

## 9. 일정 · 마일스톤

### Day 0 (오늘)
- ✅ 시나리오 v0.1 승인
- ✅ 코드 완성 (skill webhook · Notion · Aligo)
- ✅ 회의록 · PRD v0.1 작성
- 대기: 대표님 5항목 결정 (§12)

### Day 1
- 대표님: 카톡 채널 개설 · Kakao i Open Builder 신청 · Notion DB 생성 · 알리고 회원가입
- 이서연: 챗봇 대화 톤 v0.2
- 유나: 채널 프로필 3안 시작

### Day 2~4 (카카오 심사 대기 · 병렬)
- 한승철: 개인정보 마스킹 · rate limit · notification-log · API `/api/leads/{id}/status`
- 유나: 프로필 3안 완성
- 김다은: funnel 지표 스펙 (2차 확장 준비)

### Day 4~5 (승인 완료)
- 카카오 오픈빌더에 시나리오 등록
- env 채우고 실 테스트 (내부 3~5명)

### Day 5~7
- 파일럿 (K1 방 5~10명 유도)
- 홈피 CTA 교체 (K1 옆에 채널 딥링크)
- 알림톡 심사 완료 → 관리자 알림 활성

### Day 8~10
- 정식 오픈
- admin/leads 실시간 모니터링
- 인스타·오프라인 광고에 채널 QR 심음

## 10. 리스크 매트릭스

| 리스크 | 확률 | 영향 | 대응 |
|---|---|---|---|
| 카카오 심사 지연 (>3일) | 중 | 중 | 다른 담당 병렬 진행 · 파일럿 지연만 |
| 알림톡 템플릿 반려 | 중 | 소 | 재신청 (수정 · 1~2일 추가) |
| 초기 상담 폭주 → 원장님 응대 병목 | 소 | 대 | 파일럿 5명 → 단계별 확장 |
| 개인정보 유출 (평문 저장) | 소 | 대 | 마스킹 (§7-2) · 서버 접근 최소화 · 백업 암호화 |
| Kakao i Open Builder 정책 변경 | 소 | 중 | 우리 API 서버에 웹챗 대체 로직 준비 |
| 봇 오작동 (엉뚱한 응답) | 중 | 소 | 폴백 3회 → 「원장님 직접 상담」 트랙 자동 진입 |
| 이관 후 데이터 손실 | 소 | 대 | 파일 정본 · 매일 백업 · Git 커밋 |

## 11. 비용 (월 예상)

| 항목 | 비용 |
|---|---|
| Vercel Hobby (Next.js 호스팅) | 무료 |
| Cloudflare (프록시) | 무료 |
| Notion (Personal · 기존 사용) | 무료 |
| Kakao i Open Builder | 무료 |
| 알리고 알림톡 (월 600건 예상) | 5,000~6,000원 |
| 알리고 SMS 대체 (10% 실패 가정) | 500~1,000원 |
| Upstash Redis (rate limit · 무료 티어 초과 시) | 무료 or ~$10 |
| **합계 (MVP)** | **월 6,000~8,000원** |

## 12. 결정 대기 항목 (대표님 승인)

1. **Notion 방향**: 단방향 (권장) or 양방향
2. **개인정보 정책**: 마스킹만 or 필드 암호화 or 자동 삭제까지
3. **1차 MVP 8항목 스코프**: 그대로 or 조정
4. **파일럿 규모**: 5명 · 20명 · 즉시 오픈
5. **2차 확장 시점**: MVP 오픈 즉시 · 2주 대기 · 반응 보고

## 13. 관련 문서

- [MEETING-2026-07-27-KAKAO-INTEGRATION-STAFF.md](./MEETING-2026-07-27-KAKAO-INTEGRATION-STAFF.md) — 회의록
- [KAKAO-CHATBOT-SCENARIO-2026-07-27.md](./KAKAO-CHATBOT-SCENARIO-2026-07-27.md) — 시나리오 v0.1
- [KAKAO-CHATBOT-EXTERNAL-SETUP-2026-07-27.md](./KAKAO-CHATBOT-EXTERNAL-SETUP-2026-07-27.md) — 대표님 준비 절차
- [KAKAO-ALIMTALK-TEMPLATES-2026-07-27.md](./KAKAO-ALIMTALK-TEMPLATES-2026-07-27.md) — 알림톡 템플릿 3종
- [PRD-INFRA-MIGRATION-v0.1.md](./PRD-INFRA-MIGRATION-v0.1.md) — 병행 진행 (도메인·서버 이관)

---

**승인 요청**: 대표님 §12 5항목 답 주시면 PRD v0.2 최종 확정 · Day 1 착수.
