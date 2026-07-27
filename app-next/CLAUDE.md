@AGENTS.md

---

# CLAUDE.md — app-next (eyebrows-main 새 메인 사이트 · Next.js)

> 이 폴더는 ARTbrows / 장미지눈썹연구소의 **새 메인 사이트** (`eyebrows-main.staris.cloud`) Next.js 코드베이스.
> 기존 ARTbrows 자산(살구핑크 시리즈 6편·갤러리·모집 페이지)은 부모 디렉토리에 그대로 보존.

## 컨텍스트 (핵심)

- **부모 프로젝트:** `D:\work\jangmi\artbrows-project\` (ARTbrows · 기존 정적 HTML 자산 보존)
- **이 폴더:** Next.js 14+ 신규 메인 사이트 R1 시작 (2026-06-15)
- **담당 AI 직원:** 한승철 (풀스택 시니어 · 20년차) — `../personas/한승철-풀스택개발.md`
- **개발 원칙:** 하네스 공법 5단계 루프 — `../docs/개발-루프-원칙.md`
- **사용자 정체성:** 장미지 AI 연구소장 (공개 표시 한정. 내부 정보는 메모리 참조)

## 톤·디자인 (반드시 준수)

- **컬러:** 딥 블랙(#0B0907) + 챠콜 + **골드(#C9A66B)** + 누드 베이지 / 청담 톤(럭셔리 메타포)
- **실제 위치 표기:** **선릉·봉은사** (강남구 삼성·대치 사이 · 봉은사 인근)
- **공개 카피에 "청담" 직접 노출 금지** (위치 오해 방지 — 메타포로만 내부 사용)
- **폰트:** 나눔명조(헤딩) + Noto Sans KR(본문) + Inter(라벨·라틴)
- **이미지:** 모든 이미지 hyperreal · 사진급 극사실. 일러스트·만화체 금지.
- **AI 캐릭터:** 사람과 똑같이. 그러나 *실제 시술 비포&애프터·원장 얼굴*은 AI 생성 금지.

## 라운드 상태 (현재)

- **R1 (진행 중)** — Next.js 14 scaffold + 메인홈 마이그레이션 + Supabase client stub
- **R2 (대기)** — 도메인 연결 + Supabase 프로젝트 발급 + 실 콘텐츠 데이터 연동
- **R3+** — 5축 메뉴 본격 구현 (자동포스팅·AI응답·중·미·통합웹앱)

## 스택

- Next.js 16.x (App Router + TypeScript + Tailwind v4 + ESLint)
- React 19
- @supabase/supabase-js (DB·인증·스토리지)
- 호스팅: 현재 dev / 추후 Vercel → 맥미니+Tailscale+launchd (모비딕 표준)
- 결제 PG: 토스페이먼츠 + 카카오페이 (R3+ 구현)

## 디렉토리

```
app-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # 폰트·메타데이터
│   │   ├── page.tsx         # 메인홈 (선릉 톤 + 5축 + 글로벌 카드)
│   │   ├── globals.css      # 청담 톤 CSS 토큰
│   │   └── (future)/        # /shop, /translate-zh, /about, ...
│   └── lib/
│       └── supabase.ts      # Supabase 클라이언트 stub
├── public/
│   └── 메인홈무드/           # Higgsfield 4컷 (hero·eyebrow·hand·cheongdam)
└── .env.local.example       # 환경변수 템플릿
```

## R1 → R2 인계 전 결정 대기 (대표님 수동 필요)

1. **가비아 staris.cloud → eyebrows-main CNAME 추가**
   - 가비아 콘솔 로그인
   - DNS 관리 → staris.cloud → 레코드 추가
   - 호스트 `eyebrows-main` · 타입 `CNAME` · 값 (Vercel 배포 시 Vercel URL / 맥미니 시 Tailscale 도메인)

2. **Supabase 프로젝트 생성**
   - https://supabase.com 로그인 (대표님 계정)
   - "New project" → 이름 `eyebrows-main` · 리전 `Northeast Asia (Seoul)` · 비번 강력
   - Settings → API 에서 `URL`, `anon key`, `service_role key` 복사
   - `app-next/.env.local` 파일 만들고 채움 (`.env.local.example` 참고)

3. **Vercel 배포** (선택 — 로컬 dev 만으로도 OK)
   - https://vercel.com 로그인
   - "Add New Project" → GitHub 리포 또는 직접 업로드
   - 환경변수 그대로 복사 → 자동 배포

## 작업 규칙

1. **하네스 공법 루프** — 기획 → 설계 → UI·UX → 스케줄 → 개발 → 측정. 단계 건너뛰기 X.
2. **개발 결정은 대표님께 먼저 확인.** 임의 결정 X.
3. **모비딕 표준 준수** — `~/.claude/docs/mobydick-standard.md` (Tailscale + launchd, Docker 안 씀)
4. **단순함 우선** — 신기술 도입은 명백한 이유가 있을 때만
5. **AI 생성 캐릭터** — 사람과 똑같이. 실제 인물 얼굴 AI 생성 금지.

## 자동 갱신 규칙 (부모 프로젝트 §8)

- 작업 완료 시 부모 디렉토리의 `docs/PROGRESS.md` 자동 갱신
- 부모 디렉토리 `_site/` 동기화는 본 폴더와 별개 (Next.js 빌드 산출물은 R3+ 에서)
