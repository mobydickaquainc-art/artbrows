# 카카오톡 채널 챗봇 · 외부 준비 체크리스트
> 2026-07-27 · 대표님이 사무실에서 직접 준비해주실 항목
> 우리 개발팀 (Claude Code) 이 이미 완성한 것 vs 대표님이 준비하실 것 분리

---

## ✅ 우리(개발팀)가 이미 완성한 것 (2026-07-27)

| 항목 | 상태 | 파일 |
|---|---|---|
| leads 스키마 확장 (source·track·interest·visit_time·location·kakao_user_id·notion_page_id) | ✅ | [src/lib/leads.ts](../app-next/src/lib/leads.ts) |
| Kakao Skill webhook API 라우트 | ✅ | [src/app/api/webhook/kakao-channel/skill/route.ts](../app-next/src/app/api/webhook/kakao-channel/skill/route.ts) |
| Notion API append 클라이언트 (env-based · 미설정 시 조용히 skip) | ✅ | [src/lib/notion.ts](../app-next/src/lib/notion.ts) |
| admin/leads 페이지 · 소스 필터 5개 채널 + 관심/방문 컬럼 신설 | ✅ | [src/app/admin/leads/page.tsx](../app-next/src/app/admin/leads/page.tsx) |
| 시나리오 문서 v0.1 (승인 완료) | ✅ | [KAKAO-CHATBOT-SCENARIO-2026-07-27.md](./KAKAO-CHATBOT-SCENARIO-2026-07-27.md) |

**즉시 테스트 가능**:
- 헬스체크: `GET http://localhost:3000/api/webhook/kakao-channel/skill` → 200
- 관리 UI: `http://localhost:3000/admin/leads`
- POST 테스트 예시 (곧 카카오가 이런 형식으로 보낼 것):
  ```json
  POST /api/webhook/kakao-channel/skill
  Content-Type: application/json; charset=UTF-8

  {
    "userRequest": { "user": { "id": "kakao_user_xxxx" } },
    "action": {
      "params": {
        "name": "홍길동", "phone": "010-1234-5678",
        "track": "academy", "interest": "startup_890",
        "visitTime": "weekday_pm", "note": "재직자입니다"
      }
    }
  }
  ```

---

## 🟡 대표님이 준비해주실 것 (5개)

### 1. 카카오톡 비즈니스 채널 · 필수 · 반나절

**목적**: 챗봇을 붙일 채널 · 상담 유입 대문

**절차**:
1. https://center-pf.kakao.com/ 접속 → 카카오 계정 로그인
2. 「새 채널 만들기」 → 채널 이름: `장미지 ARTbrows` (or 원장님이 원하시는 표기)
3. 카테고리: 뷰티·미용 → 반영구/문신
4. 채널 프로필 사진 · 배경 · 인사말 등록 (기존 K1 이미지 재사용 가능)
5. **비즈니스 채널 인증** — 「채널관리 → 비즈니스 채널 신청」 → 사업자등록증 업로드 → 심사 1~2 영업일

**필요한 것**: 사업자등록증 파일 · 대표자 정보

**우리에게 전달**: 완성 채널 URL (`https://pf.kakao.com/_xXXX` 형식) → 홈페이지 CTA · 챗봇 skill 등록 시 사용

---

### 2. Kakao i Open Builder · 필수 · 승인 3일

**목적**: 챗봇 시나리오 (블록·발화·엔티티) 등록 · 우리 webhook 연결

**절차**:
1. https://i.kakao.com/openbuilder 접속 → 카카오 계정 로그인
2. 「봇 만들기」 → 이름: `장미지 ARTbrows 상담봇`
3. 「채널 연결」 → 위 1단계에서 만든 비즈니스 채널 선택
4. 「카카오 i 오픈빌더 신청서」 작성 → 심사 대기 (평균 3일)
5. 승인 후 → 우리에게 알려주시면 우리가 시나리오 블록 등록 (docs/KAKAO-CHATBOT-SCENARIO-2026-07-27.md §1~§6 순서 그대로)

**우리에게 전달**: 승인 완료 알림 → 오픈빌더 봇 이름/URL

---

### 3. Notion 워크스페이스 + 통합 · 필수 · 30분

**목적**: 상담 리드 자동 저장 · 원장님·대표님 실시간 확인

**절차**:
1. 노션에서 새 페이지 or 기존 페이지에 「인라인 데이터베이스」 하나 만들기
2. 이름: `ARTbrows 상담 리드`
3. 아래 컬럼 만들기 (docs §8 스키마):
   - 이름 (Title · 기본)
   - 연락처 (Phone)
   - 트랙 (Select: 수강 · 시술 · 정보 · 라이브)
   - 관심 (Select: 창업반 890 · 이지반 69 · 극사실 169 · 눈썹 · 아이라인 · 입술 · 헤어라인 · 잔흔 복구 · 미정)
   - 방문 가능 (Select: 평일 오전 · 평일 오후 · 평일 저녁 · 주말 · 무관)
   - 지점 (Select: 선릉 · 삼성 · 무관)
   - 메모 (Text)
   - 소스 (Select: 카톡 채널 · K1 오픈채팅 · 인스타 · 홈페이지 · 전화 · 직접)
   - 카카오 유저 ID (Text)
   - 상담 상태 (Select: 신규 · 답변완료 · 방문예약 · 등록완료 · 취소)
   - 접수일시 (Date)
   - 이력 링크 (URL)
4. Notion 통합 (Integration) 생성: https://www.notion.so/my-integrations
   - 이름: `ARTbrows Webhook`
   - Type: Internal
   - 워크스페이스: 대표님 워크스페이스 선택
   - 저장 → **Internal Integration Secret** 복사 (`secret_xxxx...` 형식)
5. 위 DB 페이지 우상단 「···」 → 「Connect to」 → 방금 만든 `ARTbrows Webhook` 선택
6. DB 페이지 URL 복사 (`https://www.notion.so/xxxxx?v=...` 형식) → 우리에게 전달

**우리에게 전달**:
- Internal Integration Secret (`secret_xxxxxxxx`)
- DB URL (여기서 database ID 추출 · 32자 hex)

---

### 4. 우리 서버 환경변수 등록 · 필수 · 5분 (위 3번 완료 후)

**설정 파일**: `d:\work\jangmi\artbrows-project\app-next\.env.local`

**추가할 것**:
```bash
# 카톡 스킬 webhook 시크릿 (임의 문자열 32자 이상 · 우리가 만들어서 카카오에도 등록)
KAKAO_WEBHOOK_SECRET=랜덤_32자_이상_문자열

# Notion 연동 (위 3번 완료 후)
NOTION_API_KEY=secret_xxxxxxxx
NOTION_LEADS_DB_ID=abcd1234efgh5678...

# 공개 앱 URL (Notion 「이력 링크」 컬럼용)
NEXT_PUBLIC_APP_URL=https://artbrow.co.kr    # 배포 후 · 지금은 http://localhost:3000
```

**우리에게 전달**: 위 값 저장 후 알려주기 (내용은 커밋 X · 로컬 .env.local 에만)

---

### 5. 알림톡 · 친구톡 발송 계약 · 선택 · 1일

**목적**: 접수 즉시 대표님/원장님 카톡으로 자동 알림 (「신규 상담 · 홍길동 · 010-xxxx」)

**옵션 (한국 벤더)**:
- **알리고 (aligo.in)** — 건당 10~15원 · 계약·심사 하루
- **비즈고 (bizgo.io)** — 건당 15~20원 · 계약·심사 하루
- **채널톡 (channel.io)** — 옴니채널 통합 · 월 ₩8만~ · 즉시 도입
- **네이버 클라우드 CLOVA MessengerBot** — 종량제

**절차 (알리고 예시)**:
1. https://smartsms.aligo.in 회원가입 (사업자 계정)
2. 발신번호 등록 (사업자등록증 · 통신서비스 이용증명원)
3. 잔액 충전 (최소 5,000원)
4. API 키 발급 → 우리 서버 `.env.local` 에 등록 (`ALIGO_API_KEY`, `ALIGO_USER_ID`)

**우리에게 전달**: API 키 · 발신번호 · 알림톡 템플릿 승인 코드 (선택)

**미도입 시 우회**: admin/leads 페이지에서 실시간 표시 · 대표님이 주기적으로 확인 (덜 실시간)

---

## 🔵 착수 순서 (승인된 오늘부터)

| 일자 | 작업 | 담당 |
|---|---|---|
| **Day 0 (오늘)** | 시나리오 승인 ✅ · 개발 착수 ✅ · 문서 배포 ✅ | 완료 |
| Day 1 | 대표님: 카톡 채널 만들기 + 비즈니스 인증 신청 (사업자등록증) | 대표님 |
| Day 1 | 대표님: Kakao i Open Builder 봇 신청서 제출 | 대표님 |
| Day 1 | 대표님: Notion DB + 통합 생성 → 값 전달 | 대표님 |
| Day 1~3 | 카카오 심사 대기 (병렬) | 대기 |
| Day 3~4 | 승인 나면 → 우리가 오픈빌더에 시나리오 등록 · env 값 넣고 실 테스트 | 우리 |
| Day 4~5 | 알림톡 벤더 계약 (선택 · 알리고 or 채널톡) | 대표님 |
| Day 5~6 | 홈페이지 CTA 교체 (K1 옆에 카톡 채널 딥링크 병렬 배치) | 우리 |
| Day 6~7 | 실전 파일럿 · 원장님에게 실시간 알림 확인 | 공동 |

**결정**: 대표님이 Day 1 작업 착수하실 시점 알려주시면 우리는 대기.

---

## 📞 대표님에게 지금 물어봐야 할 최소 정보

시연/회의 종료 후 시간 되시면 아래 4개만 답 주시면 즉시 다음 단계 착수:

1. **채널명 확정** — 「장미지 ARTbrows」 로 갈까요? 다른 이름?
2. **알림톡 도입 시점** — Day 1 즉시 계약? 나중에? (미도입 시 대표님이 admin/leads 페이지 주기 확인)
3. **채널 담당자** — 챗봇 「직접 상담」 트랙 = 대표님이 받으실지 vs 원장님이 받으실지 vs 스태프
4. **접수 확인 SLA 문구** — 지금 「24시간 안 답 드립니다」 인데 실제 응답 속도에 맞게 조정 필요? (예: 「영업일 기준 24시간」)

승인/조정 사항 오시면 자동으로 반영합니다.
