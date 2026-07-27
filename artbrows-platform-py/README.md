# ARTbrows Platform — 3 SaaS Python 백엔드

> 2026-06-29 본격 가동 · 모비딕 `mobydick-detail-agent` 패턴 응용

## 구조 (모비딕 패턴 1:1 응용)

```
artbrows-platform-py/
├── main.py                  # CLI 엔트리 (python main.py menu)
├── requirements.txt
├── .env                     # API 키 (gitignore)
├── .env.example             # placeholder
│
├── agents/                  # 멀티 에이전트
│   ├── base.py              # BaseAgent 추상 클래스
│   ├── orchestrator.py      # 총괄 오케스트레이터
│   ├── orchestrator_a.py    # SaaS A (김다은)
│   ├── orchestrator_b.py    # SaaS B (박서윤)
│   ├── orchestrator_c.py    # SaaS C (최예진)
│   ├── collector.py         # 수집 (이서연)
│   ├── researcher.py        # 리서치 (이서연)
│   ├── copywriter.py        # 카피 (이서연)
│   ├── designer.py          # 디자인 (유나·반복은 Claude Code)
│   ├── prompter.py          # 프롬프트 엔지니어 (클로드)
│   └── deployer.py          # 배포 (한승철)
│
├── utils/
│   ├── gemini_client.py     # Gemini API (50 모델)
│   ├── claude_client.py     # Anthropic API
│   ├── openai_client.py     # OpenAI API (118 모델)
│   ├── higgsfield_client.py # nano_banana_pro · Veo
│   └── pattern_db.py        # 원장님 30년 패턴 DB
│
├── config/
│   ├── saas_a.yaml          # SaaS A 에이전트 설정
│   ├── saas_b.yaml
│   ├── saas_c.yaml
│   └── common.yaml          # 공통 (살구핑크·명조·키워드 시드)
│
├── data/
│   ├── input/               # 사용자 입력 (사진 등)
│   │   ├── saas_a/
│   │   ├── saas_b/
│   │   └── saas_c/
│   ├── intermediate/        # 중간 산출 (캐시)
│   └── output/              # 최종 출력 (PNG·MP4·JSON)
│
├── scripts/
│   ├── html_to_png.py       # HTML → 인스타 PNG (Edge headless)
│   ├── ffmpeg_compose.py    # 영상 합성 (24초 쇼츠)
│   ├── pattern_classify.py  # Gemini Flash 시술 사진 분류
│   └── auto_post.py         # 인스타·블로그·유튜브 자동 게시
│
├── templates/
│   └── components/          # Jinja2 재사용 컴포넌트
│       ├── eyebrow_card.html        # 살구핑크 + 명조
│       ├── schedule_calendar.html   # 원장님 6월 패턴 1:1
│       ├── insta_carousel_8.html    # 8장 캐러셀
│       └── pencil_guide.html        # Face Lab v7 결과
│
├── web/                     # FastAPI 웹 (port 8001)
│   ├── app.py
│   ├── routers/
│   │   ├── saas_a.py
│   │   ├── saas_b.py
│   │   └── saas_c.py
│   └── static/
│
├── docs/
│   ├── menu-tree.md         # 전체 메뉴 트리
│   ├── api-spec.md
│   └── deployment.md
│
└── tests/
    └── test_*.py
```

## 빠른 시작

```bash
# 1. 가상 환경
python -m venv .venv
.venv\Scripts\activate

# 2. 패키지
pip install -r requirements.txt

# 3. 환경 변수 (이미 시스템 환경 변수에 있음)
# GEMINI_API_KEY · OPENAI_API_KEY · ANTHROPIC_API_KEY

# 4. 메뉴 확인
python main.py menu

# 5. 첫 실행 (예: SaaS B 광고 카피 생성)
python main.py saas-b ad-copy JM-MASTER-004

# 6. 웹 서버 (UI · port 8001)
python main.py server
```

## 8 직원 = 8 에이전트 (멀티 에이전트 시스템)

| # | 직원 | 에이전트 | 책임 |
|---|------|---------|------|
| ① | 이서연 | researcher + copywriter | 리서치·카피·키워드 |
| ② | 유나 | designer (상위) | 브랜드·키비주얼 |
| ③ | 한승철 | deployer + api-integrator | 배포·OAuth·API |
| ④ | 김민서 | ui-builder | 모바일 UI·UX |
| ⑤ | 김다은 | orchestrator_a | SaaS A 책임 |
| ⑥ | 박서윤 | orchestrator_b | SaaS B 책임 |
| ⑦ | 최예진 | orchestrator_c | SaaS C 책임 |
| ⑧ | 클로드 | master-orchestrator + prompter | 8명 통합·자동화 |

## 자율 발전 시스템 (24/7)

- 🎯 **Goal 패턴** — 매일 09:00 각 PM Goal 선언, 16:00 달성 보고
- 🔄 **Loop 패턴** — 매주 토 16:00 통합 보고, 매월 1일 KPI
- 🛡️ **하네스 공법** — 중요 결정 = 대표님 직접 / 그 외 = 자율
- 🧠 **메모리** — `~/.claude/.../memory/` 영구 보관

## 모비딕 패턴 1:1 매핑

| 모비딕 | ARTbrows |
|--------|----------|
| `python main.py run MO-350F` | `python main.py saas-a schedule 2026-07` |
| 5 에이전트 (collect·research·copy·prompt·design) | + 3 PM orchestrator (a·b·c) + master |
| 제품 1개 → PNG 13장 | SaaS A: 강의 1회 → 인스타 8장 + 블로그 1편 + 유튜브 1편 |
| `data/input/MO-350F/` | `data/input/saas_a/2026-07/` |
| `data/output/MO-350F/` | `data/output/saas_a/2026-07/calendar.png` |

## 차주 일정 (07-01~07-07)

| Day | SaaS A · 김다은 | SaaS B · 박서윤 | SaaS C · 최예진 |
|-----|-----------------|-----------------|-----------------|
| 07-01 | A1 MVP 시작 | B1 MVP + API 신청 | Unreal MCP 셋업 |
| 07-02 | 달력 자동 | 카피 자동 (5→50) | 「수아」 MetaHuman |
| 07-03 | 인스타 카드 | 이미지 자동 (nano_banana_pro) | Blender import |
| 07-04 | 자동 게시 | 영상 자동 (Veo + ffmpeg) | v6 PoC 16컷 |
| 07-05 | 원장님 시범 | 1편 end-to-end | BEFORE/AFTER 8컷 |
| 07-06 | 피드백 | A/B 테스트 | v5.8 vs v6 비교 |
| 07-07 | ★ 정식 가동 | ★ 광고 1편 자동 | ★ v6.0 PoC 24컷 |
