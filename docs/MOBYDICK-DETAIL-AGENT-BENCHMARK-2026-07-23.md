# 모비딕 상세페이지 자동화 벤치마크 · 카드뉴스 리팩토링 계획 (2026-07-23)

> **대표님 지시 (2026-07-23 저녁)**: 「모비딕 상세페이지 자동화와 전문가 영역처럼 제대로 된 카드뉴스 생성기가 필요하다」
> **정본 위치**: `docs/MOBYDICK-DETAIL-AGENT-BENCHMARK-2026-07-23.md`
> **인계**: Fable 5 세션에서 리팩토링 착수 재료

---

## 0. 요약 (한 문단)

지금 ARTbrows 카드뉴스는 **「편집기 + 생성기」** 수준입니다.
모비딕 상세페이지 자동화 (`D:\work\danzi\pages\mobydick-detail-agent`) 는 **「production pipeline」** 수준입니다.
**갭 = 7가지** (스펙 정본화 · 6 에이전트 파이프 · 파일 구조 표준화 · 품질 게이트 · HTML→PNG 자동 · CLI 진입점 · 배치). 이걸 이식하면 카드뉴스도 「전문가 영역」이 됩니다.

---

## 1. 모비딕 상세페이지 자동화 구조 (프로덕션급)

**위치**: `D:\work\danzi\pages\mobydick-detail-agent` · **파일 수**: 141개 · **코드**: 약 1,880줄

### 1.1 산출물 스펙 · YAML 정본
`config/png_sections.yaml` 에 **PNG 13장 각각 스펙 확정** (예):
```yaml
sections:
  - number: 1
    id: "hero"
    filename: "01_hero.png"
    name: "메인 히어로"
    height: 1080
    description: "제품 대표 이미지 + 핵심 카피. 첫인상 결정."
    layout: "제품 이미지 중앙, 상단 메인카피, 하단 서브카피 + 특징 배지"
    style: "밝은 배경(화이트/그라데이션), 프리미엄 느낌, 깔끔한 타이포"
    required_elements:
      - "제품 이미지 (정면 또는 45도)"
      - "메인 카피 (1줄, 굵은 글씨)"
      - "서브 카피 (모델명)"
      - "특징 배지 3개"
      - "MOBYDICK 로고"
```

**13장 구성** (쿠팡 표준):
1. 메인 히어로 · 2. 후킹 배너 · 3~5. 핵심 혜택 ①②③ · 6. 제품 스펙 표 · 7. 사용 장면 · 8. Before/After · 9. 경쟁 비교 · 10. 패키지 구성 · 11. 신뢰 요소 · 12. CTA · 13. 브랜드

**규격**: 너비 860px 고정 · 높이 가변 · PNG · 쿠팡 모바일 최적

### 1.2 6 에이전트 파이프라인 (JSON 릴레이)

```
input → collector → researcher → copywriter → prompter → designer → output
                                    ↑                                    │
                                    └──── quality_check (7/10) ─── 재생성 ┘
```

| 에이전트 | 역할 | 입력 | 출력 |
|---|---|---|---|
| **collector** | 제품 이미지·PDF 스펙 OCR (Gemini Vision) | 원본 이미지·PDF | `product_data.json` |
| **researcher** | 시장 분석·키워드 전략 | product_data.json | `keyword_strategy.json` |
| **copywriter** | 13장 섹션별 카피 생성 (Gemini) | product_data + keyword | `section_copies.json` |
| **prompter** | Gemini 이미지 생성 프롬프트 | copies + brand_style | `image_prompts.json` |
| **designer** | PNG 13장 생성 + 품질 검증 | prompts | `01_hero.png ~ 13_brand.png` |
| **orchestrator** | 파이프라인 총 관리 | 제품 ID | 실행 로그 |

**중간 데이터 = JSON 파일** (`data/intermediate/{product_id}/`) → 각 에이전트 독립 실행 가능 · 재시작 가능

### 1.3 파일 구조 표준화

```
mobydick-detail-agent/
├── data/
│   ├── input/{product_id}/       # 원본 자료
│   ├── intermediate/{product_id}/ # JSON 중간 결과
│   └── output/{product_id}/       # PNG 13장
├── agents/                        # 6 에이전트 Python
├── scripts/                       # gemini_imagegen · gemini_vision · html_to_png · quality_check
├── config/
│   ├── agents.yaml
│   ├── brand_style.yaml
│   ├── png_sections.yaml         # ★ 13장 스펙 정본
│   └── prompts/
└── templates/components/          # 재사용 컴포넌트
```

### 1.4 품질 게이트 (재생성 로직)

`scripts/quality_check.py` (144줄) — 이미지 품질 자동 검증
- 품질 **7/10 미만 → 자동 재생성** (최대 3회)
- 재생성 후에도 미달 시 로그 기록 + 사람 개입 요청

### 1.5 HTML → PNG 자동 렌더링

`scripts/html_to_png.py` (219줄) — Playwright Chromium
- HTML 템플릿 → 브라우저 렌더 → PNG 저장
- 정확한 픽셀 사이즈 (860 × 가변) 보장
- 폰트 임베드 · CSS 완전 반영

### 1.6 CLI 표준 진입점

```bash
# 단일 제품
claude --agent orchestrator "MO-350F 상세페이지 생성"

# 배치
claude --agent orchestrator "전체 제품 상세페이지 생성"

# 특정 섹션만
python scripts/generate_all_png.py --product MO-800F --start 3 --end 5
```

### 1.7 브랜드 스타일 YAML 정본

`config/brand_style.yaml`
- 메인 컬러 `#1a1a2e` · 강조 `#e94560` · 악센트 `#0f3460`
- 이미지 너비 860px · 폰트 · 텍스트 규칙 · 과장 광고 금지 표현 리스트

---

## 2. ARTbrows 카드뉴스 현재 상태 (편집기 + 생성기)

**위치**: `d:/work/jangmi/artbrows-project/app-next/src/`

| 구성 요소 | 현재 상태 |
|---|---|
| 스타일 프리셋 | 17종 (Track A 정본화 완료) |
| kind 레이아웃 | 12종 (React 컴포넌트) |
| 자동 생성 에이전트 | 4개 (trend-researcher · vision-analyzer · stylist · copywriter) |
| 저장 방식 | 프로젝트별 JSON (`content/cardnews/{id}.json`) · 언어별 · 스타일별 |
| 편집기 | 3분할 (슬라이드 리스트 · kind 폼 · 실시간 미리보기) |
| 미리보기 | 웹 렌더 (React) |
| **PNG export** | ❌ 없음 · 원장님 브라우저 캡처 or 인스타 직접 |
| **품질 게이트** | ❌ 없음 (태그 sanitize 만) |
| **CLI 진입점** | ❌ 없음 (웹 UI 만) |
| **배치** | ⚠️ 부분 (개별 프로젝트만) |
| **산출물 스펙 YAML** | ⚠️ 스타일 프리셋 TS 파일 · YAML 정본 없음 |

---

## 3. 갭 분석 · 7축

| # | 축 | 모비딕 | ARTbrows | 갭 크기 |
|---|---|---|---|---|
| 1 | **산출물 스펙 정본 (YAML)** | ✅ 13장 각 필수요소 명시 | ⚠️ TS 프리셋만 | 🔴 큼 |
| 2 | **에이전트 6단 파이프** (input→collector→researcher→copywriter→prompter→**designer**→output) | ✅ 6 에이전트 | ⚠️ 4 에이전트 (designer·collector 없음) | 🟡 중 |
| 3 | **파일 구조 표준화** (input/intermediate/output) | ✅ 세분화 | ⚠️ 프로젝트별 단일 JSON | 🟡 중 |
| 4 | **품질 게이트 (재생성 로직)** | ✅ 7/10 자동 재생성 (3회) | ❌ 없음 | 🔴 큼 |
| 5 | **HTML → PNG 자동 렌더** (Playwright) | ✅ 정확 픽셀 | ❌ 없음 (원장님 수동) | 🔴 큼 |
| 6 | **CLI 표준 진입점** (배치 지원) | ✅ `claude --agent orchestrator ...` | ❌ 웹 UI 만 | 🔴 큼 |
| 7 | **브랜드 스타일 YAML 정본** | ✅ config/brand_style.yaml | ⚠️ TS 토큰 · YAML 없음 | 🟢 작음 |

---

## 4. 🎯 「전문가 영역」 = B. 디자인 완성도 (2026-07-23 대표님 확정)

**대표님 결정**: 3 해석 축 중 **B. 디자인 완성도** 확정.
- 뜻: 브랜드 에이전시가 만든 것 같은 시각 퀄리티
- **의미 재조정**: 프로덕션 자동화(A)·프로세스 표준화(C) 는 부차 · **시각 퀄리티**가 핵심
- Track B 리부트 무게중심 = 인스타 뷰티·매거진·글로벌 브랜드 톱 계정 **시각 요소 정량 수집** + **designer 에이전트 시각 품질 극대화**
- 리팩토링 시점 = **병렬** (오늘부터 Fable 5 세션 · 8월 말 오픈과 동시)
- 리드 = **김다은** (모비딕 패턴 학습자) · CTO 지원 = **한승철**

## 4-old. 「전문가 영역」 = 3 해석 축 (참고용 · 폐기 아닌 기록)

대표님이 「전문가 영역처럼」이라 하실 때 3가지 관점 가능. 어느 축인지 확인해서 우선순위 결정:

### A. 프로덕션 자동화 (백엔드 파이프라인)
- 뜻: 사람 손 안 대고 「제품 ID → PNG 6장」 CLI 배치
- 필요 작업: designer 에이전트 신설 + HTML→PNG 자동 + 품질 게이트 + CLI 진입점
- 소요: 2~3주
- 이득: 원장님 발송 부담 0 · 매주 수십 세트 자동 · 게시 자동화와 결합

### B. 디자인 완성도 (에이전시 수준 시안)
- 뜻: 브랜드 에이전시가 만든 것 같은 시각 퀄리티
- 필요 작업: 산출물 스펙 YAML + 각 슬라이드 필수요소 표준화 + 품질 게이트 + 디자인 시스템 강화
- 소요: 3~4주
- 이득: 원장님 승인률 상승 · 인스타 첫 컷 시각 임팩트

### C. 프로세스 표준화 (실무자 협업 툴)
- 뜻: 여러 사람이 「같은 규칙」 으로 만드는 툴 (스펙 명시 + 워크플로 표준)
- 필요 작업: 산출물 스펙 YAML + 파일 구조 표준화 + JSON 릴레이 파이프
- 소요: 1~2주
- 이득: 다음 직원 채용 시 즉시 온보딩 가능 · 유나·이서연 협업 명확화

**팀 추정**: A+C 통합이 대표님 의도에 가장 가까울 것 (프로덕션 파이프 + 표준화) · B 는 그 위에서 자동 상승

---

## 5. 리팩토링 로드맵 (Fable 5 세션에서 확정)

### Phase 1 · 기획·설계 (Fable 5 세션 · 1주)
1. 대표님 「전문가 영역」 정의 확정 (A/B/C 중)
2. 카드뉴스 산출물 스펙 YAML 정본 작성 (6장 스탠다드 · Reels 커버 · Story 5장 각 필수요소)
3. 6 에이전트 파이프라인 재설계 (기존 4 + designer + collector 추가)
4. 파일 구조 표준화 방안 (`content/cardnews/{campaign_id}/` 하위 input·intermediate·output)
5. 품질 게이트 기준 (원장 승인 룰 + 시각 품질 자동 점수)

### Phase 2 · 코어 파이프 구현 (2~3주)
1. YAML 스펙 파서 (Python or TS)
2. **designer 에이전트 신설** — HTML 템플릿 → Playwright → PNG export
3. **quality 에이전트 신설** — Gemini Vision 으로 시각 품질 자동 채점
4. CLI orchestrator 진입점 (`npm run cardnews:generate -- --campaign=15gi --style=rebellion-serif`)
5. 배치 모드 (`--batch` 로 여러 campaign 순차)

### Phase 3 · 게시 자동화 결합 (1~2주)
1. Meta Graph API 통합 (김다은·한승철)
2. 카톡 오픈채팅 배포 (송하은)
3. PNG 6장 → 인스타 예약 게시 1클릭

### Phase 4 · 광고 A/B 자동화 (1주)
1. 1 카드뉴스 = 5 카피 밸리언트 자동 (박서윤 제안)
2. 인스타 인사이트 데이터 수집 (김민서 제안 · A/B/C 프로토콜)

**총 소요**: 5~7주 · 팀 4~6명 병렬 · 8월 말 오픈 이후 정식 가동

---

## 6. 즉시 착수 가능 (지금 세션에서 하네스 공법 위반 X · 준비 작업)

- ✅ 이 문서 정본화
- ✅ Fable 5 세션 인계 브리핑 v2 에 이 벤치마크 추가
- ✅ 대표님 「전문가 영역」 A/B/C 확인 요청
- ❌ 코드 작성 (Fable 5 세션에서 · 하네스 공법)

---

## 7. Fable 5 세션 진입 시 우선 확인 사항

1. 대표님 「전문가 영역」 = A/B/C 중 (또는 조합)?
2. 리팩토링 vs 신 스타일 리서치 (Track B) — 어느 것 먼저?
3. 8월 말 오픈에 무엇이 필수 · 무엇이 오픈 이후?
4. 6 에이전트 파이프 이식 시 기존 17 스타일 유지 (Track A) · 폐기 · 통합?
5. 김다은 페르소나가 「모비딕 패턴 6개월 학습」이라 되어 있음 · 이 리팩토링 리드 담당 확정할지?

---

**최종 업데이트**: 2026-07-23 저녁 · Track A 세션 마지막
**정본 담당**: Fable 5 세션에서 리팩토링 착수 시 이 문서 갱신
