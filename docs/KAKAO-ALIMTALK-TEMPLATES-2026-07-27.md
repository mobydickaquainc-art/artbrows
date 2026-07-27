# 카카오 알림톡 · 템플릿 사전 승인용 문구
> 2026-07-27 · 대표님이 알리고 콘솔에서 카카오에 심사 신청할 문구
> 심사 승인 기간 1~3 영업일

---

## 심사 규칙 (반드시 지킬 것)

1. **정보성 메시지만** — 광고·마케팅 문구 X (「지금 등록하면 20% 할인!」 X)
2. **변수는 `#{변수명}` 형식** — 심사 시 예시 값 제출 (예: `#{name}` → 「홍길동」)
3. **제목·본문 반드시 브랜드 명시** — `[장미지 ARTbrows]` 로 시작
4. **URL 이면 사전 등록 · https:// 필수**
5. **1,000자 이내 · 이미지/버튼 카테고리는 별도 심사**

---

## 템플릿 #1 · 「신규 상담 접수」 (관리자용 · 대표님/원장님 카톡)

**카테고리**: 회원가입/서비스이용
**환경변수 매핑**: `ALIGO_TPL_LEAD_ADMIN`
**수신자**: 관리자 (대표님/원장님 등 · `ADMIN_PHONE_LIST` 에 등록된 번호)

### 문구

```
[장미지 ARTbrows] 신규 상담 접수

구분: #{track}
이름: #{name}
연락처: #{phone}
관심: #{interest}
방문 가능: #{visit}
메모: #{note}

상세: #{url}
```

### 심사 예시값

- `#{track}` → `수강`
- `#{name}` → `홍길동`
- `#{phone}` → `010-1234-5678`
- `#{interest}` → `창업반 890`
- `#{visit}` → `평일 오후`
- `#{note}` → `재직자입니다`
- `#{url}` → `https://artbrow.co.kr/admin/leads?id=2026-07-27T04-00-00-abc`

---

## 템플릿 #2 · 「상담 접수 확인」 (고객용 · 상담 신청자 카톡)

**카테고리**: 서비스이용
**환경변수 매핑**: `ALIGO_TPL_LEAD_CONFIRM`
**수신자**: 상담 신청 고객
**용도**: 챗봇에서 접수 완료 시 · 카톡 채널 밖 SMS 대체용

### 문구

```
[장미지 ARTbrows] 상담 신청 감사합니다.

#{name}님, 신청 접수되었습니다.
원장님 또는 담당자가 영업일 기준 24시간 안에 연락드립니다.

문의 내용
- 구분: #{track}
- 관심: #{interest}
- 방문 가능: #{visit}

무료 강의방(K1) 참여
https://open.kakao.com/o/gWeAkSzi
```

### 심사 예시값

- `#{name}` → `홍길동`
- `#{track}` → `수강 상담`
- `#{interest}` → `창업반 15기 890만`
- `#{visit}` → `평일 오후`

---

## 템플릿 #3 · 「강의 일정 안내」 (고객용 · 상담 진행 후 확정 안내)

**카테고리**: 예약·주문
**환경변수 매핑**: `ALIGO_TPL_CLASS_SCHEDULE`
**수신자**: 수강 확정 고객

### 문구

```
[장미지 ARTbrows] 강의 일정 안내

#{name}님, #{class_name} 등록이 확정되었습니다.

일정
- 개강일: #{start_date}
- 시간: #{time}
- 장소: #{location} 본원

준비물·복장은 개강 3일 전 별도 안내드립니다.
문의: 카카오 채널 상담

수강생 전용 방
https://open.kakao.com/o/gWeAkSzi
```

### 심사 예시값

- `#{name}` → `홍길동`
- `#{class_name}` → `창업반 15기`
- `#{start_date}` → `2026년 8월 5일`
- `#{time}` → `오전 10시 ~ 오후 6시`
- `#{location}` → `선릉`

---

## 알리고 콘솔 등록 방법 (대표님 15분)

1. https://smartsms.aligo.in 로그인
2. 상단 「알림톡」 → 「템플릿 관리」
3. 「새 템플릿 등록」 클릭
4. **채널 선택**: 위 「1. 카카오톡 비즈니스 채널」 단계에서 만든 채널 (「장미지 ARTbrows」)
5. **템플릿 코드**: 임의로 지정 가능 (예: `lead_admin_v1`, `lead_confirm_v1`, `class_schedule_v1`)
6. **본문**: 위 문구 그대로 복사·붙여넣기
7. **예시값**: 위 「심사 예시값」 그대로 입력
8. **강조 표시 (선택)**: 첫 줄 「[장미지 ARTbrows] xxx」 를 강조 처리 (알림 미리보기 굵게)
9. 「심사 신청」 → 카카오 심사 대기 (1~3 영업일)
10. **승인 완료 후** → 알리고가 부여한 「템플릿 코드」 를 우리에게 전달 → 우리 서버 env 등록

---

## 환경변수 최종 목록 (알리고 승인 완료 후)

```bash
# 알리고 계정
ALIGO_API_KEY=alg_xxxxxxxxxxxxx
ALIGO_USER_ID=jangmiartbrows
ALIGO_SENDER=02-1234-5678         # 승인받은 발신번호
ALIGO_SENDER_KEY=xxxxxxxxxx       # 카카오 채널 senderkey (알리고 콘솔에서 채널 연결 후 발급)

# 템플릿 코드 (카카오 심사 승인 후)
ALIGO_TPL_LEAD_ADMIN=lead_admin_v1
ALIGO_TPL_LEAD_CONFIRM=lead_confirm_v1
ALIGO_TPL_CLASS_SCHEDULE=class_schedule_v1

# 관리자 알림 수신 폰번호 (콤마 구분 · 최대 5명 권장)
ADMIN_PHONE_LIST=010-대표님번호,010-원장님번호
```

---

## 비용 (재확인)

- **알림톡 발송**: 8~10원/건
- **알림톡 실패 시 SMS 자동 대체**: 20원/건 (LMS 이상은 30~50원)
- **월 예상**:
  - 하루 10건 상담 접수 · 관리자 2명에게 알림 = 20건/일
  - 월 600건 = **약 5,000~6,000원**
- **초기 충전**: 1만원이면 알림톡 약 1,000건 (=한 달 반 여유)

---

## 이 문서 활용 순서

**Day 1 (대표님)**
1. 알리고 회원가입 · 발신번호 등록 · 잔액 1만원 충전
2. 이 문서의 템플릿 #1·#2·#3 을 알리고 콘솔에 복사·붙여넣기 · 심사 신청
3. 우리에게 알림 : 「심사 신청 완료」

**Day 2~4 (카카오 심사 대기)**
- 우리는 다른 작업 · 대표님 대기

**Day 4~5 (승인 완료 후)**
- 대표님이 우리에게 API 키·템플릿 코드 전달
- 우리 서버 env 등록 · 실 테스트 → 파일럿

---

**문서 관련 코드**:
- 알림톡 클라이언트: [src/lib/aligo.ts](../app-next/src/lib/aligo.ts)
- webhook 호출부: [src/app/api/webhook/kakao-channel/skill/route.ts](../app-next/src/app/api/webhook/kakao-channel/skill/route.ts)
- 외부 준비 종합: [KAKAO-CHATBOT-EXTERNAL-SETUP-2026-07-27.md](./KAKAO-CHATBOT-EXTERNAL-SETUP-2026-07-27.md)
- 챗봇 시나리오 원본: [KAKAO-CHATBOT-SCENARIO-2026-07-27.md](./KAKAO-CHATBOT-SCENARIO-2026-07-27.md)
