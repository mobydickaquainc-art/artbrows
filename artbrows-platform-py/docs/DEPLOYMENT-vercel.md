# Deployment — Vercel 단일 (맥미니 제외 · 2026-06-29 18:15)

> 대표님 결정 (2026-06-29 18:15) — Vercel 단일 클라우드. 맥미니 X.
> 이유: 가비아 DNS 즉시·HTTPS 자동·운영 부담 0·Next.js 메인과 통합

## 무거운 워크로드 = 모두 외부 API 위임

| 작업 | 처리 위치 |
|---|---|
| 이미지 생성 | Gemini 3 Pro Image |
| 영상 생성 | Higgsfield Veo 3.1 (1~5분 → 콜백) |
| 3D 모델 | Higgsfield image_to_3d |
| 대량 이미지 분류 | Vercel Cron 분할 + Gemini Flash |
| MetaHuman 렌더 | 대표님 로컬 PC (Unreal 5.8) → 결과 GLB만 Vercel 업로드 |
| TTS 음성 | Gemini TTS / OpenAI TTS |

## 하이브리드 아키텍처

```
        ┌─────────────────────────────────────────────┐
        │   사용자                                     │
        └──────────────┬──────────────────────────────┘
                       ↓ HTTPS
        ┌──────────────────────────────────────────────┐
        │   Vercel · app.eyebrows.staris.cloud         │
        │   - FastAPI (Serverless Function)            │
        │   - Jinja2 템플릿 (Luxury Dark)              │
        │   - 가벼운 API (~5초)                         │
        │   - SaaS A·B 메인 UI                         │
        │   - Gemini·Claude API 호출 (5~30초)          │
        └──────────┬───────────────────────────────────┘
                   ↓ Tailscale Private Net (필요 시)
        ┌──────────────────────────────────────────────┐
        │   맥미니 · mac.tail-net.ts.net (Tailscale)   │
        │   - Unreal MetaHuman 렌더                     │
        │   - Blender 자동 렌더                         │
        │   - Veo 영상 생성 (~분)                        │
        │   - 대용량 이미지 일괄 처리                     │
        │   - Higgsfield MCP (3D)                       │
        │   - Edge headless / ffmpeg                    │
        └──────────────────────────────────────────────┘
                   ↑
        ┌──────────┴───────────────────────────────────┐
        │   External APIs                              │
        │   - Meta Marketing · 네이버 광고 · Google Ads │
        │   - 카카오 SSO · 알림톡 · 텔레그램 봇          │
        └──────────────────────────────────────────────┘
```

## 가비아 DNS 추가 (대표님 5초)

```
타입:    CNAME
호스트:  app.eyebrows
값:      cname.vercel-dns.com.       ← 마지막 점 (.) 필수
TTL:     600
```

→ 가비아 이미 다른 CNAME 들에서 `vercel-dns.com.` 사용 중. 형식 동일.

## Vercel 프로젝트 셋업 (한승철 차주 D+1)

### 1. CLI 설치 + 로그인
```bash
npm i -g vercel
vercel login    # snow park (numjou@gmail.com) 계정
```

### 2. 프로젝트 link + 첫 배포
```bash
cd D:\work\jangmi\artbrows-project\artbrows-platform-py
vercel link
# 새 프로젝트: artbrows-platform
vercel deploy --prod
```

### 3. 환경 변수 등록 (Vercel Dashboard)
```
GEMINI_API_KEY  = (Gemini 키)
OPENAI_API_KEY  = (OpenAI 키)
ANTHROPIC_API_KEY = (Claude 키, 필요시)
DATABASE_URL    = (Neon Postgres URL · 무료 tier)
```

### 4. 커스텀 도메인 연결 (Vercel Dashboard)
- Settings → Domains → `app.eyebrows.staris.cloud` 추가
- 자동 SSL · 자동 검증 (가비아 DNS 추가 후 10~30분)

### 5. 맥미니 internal API (무거운 워크로드용)
- Tailscale 활성 (이미 설치됨 — 모비딕 표준)
- 맥미니 내부 IP로 Vercel에서 호출 (예: `http://mac-mini.tail-xxxxx.ts.net:8001/render`)
- Vercel은 Outbound 네트워크 가능 — 다만 IP 화이트리스트 검토 (Tailscale OK)

## 의존성 분리

### Vercel용 (`requirements-vercel.txt`) — 50MB 제한
- fastapi · jinja2 · gemini · openai · anthropic · Pillow · PyYAML
- = 가벼운 API + 이미지 처리만

### 맥미니용 (`requirements.txt`) — 전체
- + opencv-python · mediapipe · facebook-business · google-ads
- + Blender / Unreal MCP / Higgsfield MCP 클라이언트

## 매월 비용

| 항목 | Hobby (무료) | Pro ($20/월) |
|---|---|---|
| Vercel | 60초 함수 timeout · 100GB 대역폭 | 90초 · 1TB |
| Neon Postgres | 3GB DB | 무제한 |
| **합계** | **0원** | **₩28,000/월** |

→ **Hobby로 시작**, 트래픽 늘면 Pro 업그레이드.

## OAuth 콜백 URL (SaaS B 광고)
- Meta: `https://app.eyebrows.staris.cloud/oauth/meta/callback`
- Naver: `https://app.eyebrows.staris.cloud/oauth/naver/callback`
- Google: `https://app.eyebrows.staris.cloud/oauth/google/callback`
- Kakao: `https://app.eyebrows.staris.cloud/oauth/kakao/callback`

## 한승철 7월 배포 시퀀스

| Day | 작업 | 결과 |
|---|---|---|
| 07-01 | 가비아 CNAME 추가 (대표님) + Vercel 프로젝트 생성 | DNS 활성 |
| 07-01 | `vercel deploy --prod` 첫 배포 | 임시 vercel.app URL 라이브 |
| 07-02 | Vercel Dashboard 환경 변수 + 커스텀 도메인 | HTTPS 활성 |
| 07-02 | end-to-end 테스트 (https://app.eyebrows.staris.cloud) | ✅ 라이브 |
| 07-03 | 맥미니 internal API 셋업 (Tailscale) | 무거운 워크로드 |
| 07-04 | OAuth 4종 콜백 URL Vercel에 등록 | 광고 API 준비 |
| 07-07 | ★ SaaS A 정식 가동 | 원장님 7월 일정 |

## 관련 메모리
- [[domain-eyebrows-staris]] — 기존 Vercel 사용
- [[artbrows-3saas-formal-planning-2026-06-29]] — 본격 가동
- [[artbrows-master-plan-2026-06-29]] — 마스터 플랜
- [[mobydick-standard]] — 맥미니 + Tailscale 표준
