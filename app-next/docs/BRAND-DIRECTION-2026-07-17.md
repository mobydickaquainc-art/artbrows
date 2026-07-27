# ARTbrows 외부 홈페이지 브랜드 방향 정본 (2026-07-17)

> **최종 결정권자 = 장미지 원장님**
> 본 문서는 원장님이 07-17 오전 GPT 로 직접 만든 브랜드 이미지를 정본으로 삼아 정리한 것이다.
> 도메인: **https://eyebrows.staris.cloud** (Vercel 프로젝트 `eyebrows-main` · Next.js)
> 프로젝트 루트: `app-next/`

---

## 1. 색상 팔레트 (정본)

| 역할 | 컬러 | 사용 |
|------|------|------|
| **캔버스 배경 (primary)** | `#0B0907` 딥 블랙 | 페이지 전체 배경 · Hero · BRAND CONCEPT 블록 |
| **골드 액센트** | `#C9A96E ~ #B08D57` | 시그니처 로고 · 부제 라벨 · 얇은 구분선 · Hero "원본" 강조 |
| **아이보리 크림 블록** | `#F5EEE0 ~ #E8DCC5` | SIGNATURE STYLE · BRAND CONCEPT 대비 블록 |
| **텍스트 (딥 배경)** | `#F5EEE0` 아이보리 · `#B8AC98` 뮤티드 | 본문 · 서브카피 |
| **텍스트 (아이보리 배경)** | `#1F1817` 잉크 · `#5A4F42` 뮤티드 | BRAND CONCEPT 블록 본문 |
| **CTA 버튼** | 딥 블랙 배경 + 골드 텍스트 · 또는 아이보리 배경 + 잉크 텍스트 | 상담 신청 · 철학 읽기 |

**금지 색상**:
- 살구핑크 (`#FF4D7E`, `#FAD7C7` 등) — 어제 「크림 살구/아트브로우 달력톤」 폐기
- **원색 계열 전면 금지** — 원장님 카톡 07-17 오전 11:42: **"브랜드 색상컨셉이랑 맞추면 더 좋을거 같습니다. 너무 원색계열은 피하구요"**
- 형광 · 발랄한 파스텔 톤 — 원장님 지시 "발랄 X · 젊음 X"

**본부장 안 「블랙·골드·오렌지·퍼플」** 은 원장님 정본에 없음 · 원장님 11:42 "원색계열 피함" 지시로 **오렌지·퍼플 사용 금지 확정** (재도입은 원장님 별도 승인 시에만)

## 정형화된 코드 모듈

**원장님 지시사항은 `app-next/src/lib/artbrows/` 에 코드로 정형화** (대표님 지시 07-17). 어떤 UI 도 이 모듈 밖 색·폰트 임의 사용 금지.

- [`src/lib/artbrows/tokens.ts`](../src/lib/artbrows/tokens.ts) — TypeScript 상수 (`artbrowsColors`, `artbrowsFonts`, `artbrowsForbidden`)
- [`src/lib/artbrows/tokens.css`](../src/lib/artbrows/tokens.css) — CSS 변수 (`--ab-black`, `--ab-gold`, `--ab-ivory` 등)
- [`src/lib/artbrows/README.md`](../src/lib/artbrows/README.md) — 사용 가이드 + 원장님 지시사항 원문 + 금지 목록

---

## 2. 폰트 시스템 (정본)

| 요소 | 폰트 | 웨이트 |
|------|------|--------|
| **한글 헤드라인** | Nanum Myeongjo (명조) | 700~900 |
| **영문 헤드 대문자** | 세리프 (Cormorant Garamond · Playfair Display) letter-spacing 넓게 | 400~600 |
| **본문 한글** | Pretendard | 400~500 |
| **본문 영문** | Inter / Pretendard 영문 | 400 |
| **시그니처 로고** | **Caveat Bold** (필기체 · 골드) — 원장님 완성본 하단 "Miji Jang" 톤 | 700 |

---

## 3. 정본 카피 (재사용 가능)

- **Brand tagline**: `FOUNDER OF HYPER REALISTIC EYEBROW / 극사실눈썹 창시자`
- **Quote (원장님)**: `"눈썹은 기술이 아닌 예술이며, 철학입니다. — 장미지"`
- **Brand Concept**: `예술 Art + 기술 Technique + 철학 Philosophy = 극사실눈썹`
- **Concept 서브 카피**: `한 올 한 올, 사람의 결을 이해하고 그리는 기술로 고객의 자신감을 디자인합니다.`
- **Hero (본부장 스토리보드)**: `SINCE THE ORIGINAL · SEONLEUNG-BONGEUNSA ATELIER` → `극사실눈썹, 그 원본의 손에서.` (「원본」 골드)
- **Hero 본문**: `사람의 얼굴을 가장 사람답게 — 그것이 우리가 매일 찾는 한 줄의 결입니다. 선릉의 무게로, 손끝의 깊이로, 다시 정의합니다.`
- **SIGNATURE STYLE 4항목**: HAIR · OUTFIT · MAKEUP · ACCESSORY
- **사이트 브랜드**: `미지아카데미 대표 · 아트브로우스 CEO`

---

## 4. 레이아웃 원칙

- **각 섹션/각 카드는 다른 레이아웃** (본부장 지시 「6장 카드뉴스는 각 페이지 레이아웃이 달라야」)
- **큰 인물 사진 좌 + 텍스트 오버레이 우** (원장님 이미지 좌측 대형 패턴)
- **세로 3분할 세컨더리 사진 컬럼** (원장님 이미지 우측 패턴)
- **딥 블랙 블록 ↔ 아이보리 블록 대비** (BRAND CONCEPT vs SIGNATURE STYLE)
- **하단 필기체 시그니처** (딥 블랙 + 골드 "Miji Jang")
- **눈썹 클로즈업 사진** 사용 (하단 좌 · HYPER REALISTIC EYEBROW 세리프 오버레이)

---

## 5. GNB (본부장 스토리보드 반영 · 07-17 오전)

### 상단 (검정 배경)
- 좌: 톡 · 인스타 아이콘 · `ARTBROWS & ACADEMY`
- 중: `대표원장 · 극사실눈썹이란 · 아카데미 · 커리큘럼 · 시술가격`
- 우: **[교육문의]** **[시술상담]** CTA 버튼 (색은 원장님 톤 결정 대기)

### 하단 (딥 브라운 + 골드)
- 좌: `장미지 EYEBROWS MAIN` 하이라이트
- 중: `철학 · 시그니처 · 메뉴 · 새 트랙 · 글로벌 · 운영진↗`
- 우: **[KO][EN][中]** 언어 스위처 · **[상담 신청]** 골드 CTA

---

## 6. 결정 대기 (원장님 컨펌 필요)

1. **CTA 버튼 색** — 원장님 정본에는 [교육문의][시술상담] 같은 눈에 띄는 강한 CTA 미표시. 스토리보드는 핫핑크. 원장님 톤 유지하려면 → **골드 배경 + 검정 텍스트** 또는 **딥 블랙 + 골드 outline** 제안.
2. **네비 IA** — 모바일 원페이지 vs PC 서브페이지. 반응형 제안 (데스크탑=서브페이지, 모바일=원페이지 스크롤).
3. **6장 카드뉴스** (`enrollment.html`) 방향 — 원장님 언급 없음. 본부장 지시로는 폐기 or 각 장 다른 레이아웃 재구성. 홈피 첫 페이지 이후 진행 제안.
4. **오렌지·퍼플 서브 액센트** — 본부장 안. 원장님 이미지에 없음. 보류 or 원장님 최종 승인 후 반영.
5. **원장님 GPT 브랜드 이미지 원본** — 아직 파일 저장 안 됨. 대표님이 `app-next/public/brand/` 폴더에 넣어주시면 정본 참조 가능.

---

## 7. 관련 문서

- 이 문서 = 브랜드 방향 정본
- [`MEETING-2026-07-17-KATALK.md`](./MEETING-2026-07-17-KATALK.md) — 07-17 오전 카톡 회의록
- [`HOMEPAGE-STORYBOARD-2026-07-17.md`](./HOMEPAGE-STORYBOARD-2026-07-17.md) — 본부장 스토리보드 3페이지 내용

## 8. 어제 (07-16) 작업 정리

- `artbrows-platform-py/web/static/enrollment.html` 의 「아트브로우 (달력톤)」 스타일은 **외부 홈피 방향과 상충** → **폐기 대상**
- `artbrows-platform-py/web/static/calendar.html` PNG 렌더의 원장님 완성본 톤은 **유지** (학원 강의 일정 배포용 · 별개 용도 · 원장님이 정본으로 지정)
- 어제 반영은 내부 운영진 페이지 (`lab.staris.cloud`) 였고, **외부 홈피 (`eyebrows.staris.cloud`) 는 별개 프로젝트** (`app-next/`)
