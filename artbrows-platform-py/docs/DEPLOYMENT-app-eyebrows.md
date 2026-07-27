# Deployment — `app.eyebrows.staris.cloud` 신규 도메인

> 대표님 결정 (2026-06-29 18:00) · 5 결정 대기 중 ① 확정
> 모비딕 표준 정합 (맥미니 + Tailscale + launchd + Caddy)

## 도메인 구조 최종

| 도메인 | 용도 | 호스팅 | 상태 |
|---|---|---|---|
| `eyebrows.staris.cloud` | 메인 (Next.js) | Vercel | ✅ 라이브 |
| `jangmiji.staris.cloud` | 자료 갤러리 (정적) | Netlify | ✅ 라이브 |
| **`app.eyebrows.staris.cloud`** ★ NEW | **Python SaaS 백엔드 (FastAPI)** | 맥미니 self-host | ⏳ 차주 셋업 |

## 가비아 DNS 추가 (대표님 5분 작업)

1. **가비아 로그인** → My가비아 → 도메인 관리
2. **`staris.cloud`** 선택 → DNS 관리
3. **레코드 추가**:
   ```
   타입:    A (또는 CNAME)
   호스트:  app.eyebrows
   값:      [맥미니 Tailscale IP] 또는 [Cloudflare Tunnel CNAME]
   TTL:     600 (10분)
   ```
4. 저장 → DNS 전파 ~10~30분

### Cloudflare Tunnel 권장 (포트 개방 불필요·HTTPS 무료)
```
호스트: app.eyebrows
타입:   CNAME
값:     <tunnel-id>.cfargotunnel.com
```

## Python FastAPI 셋업 (한승철 차주 D+1)

### 1. `web/app.py` (이미 골격)
- 포트 8001
- 라우터 3개 (saas_a · saas_b · saas_c)
- Jinja2 템플릿 (Luxury Dark)

### 2. systemd / launchd 등록 (맥미니)
```bash
# 모비딕 표준 패턴 정합
~/Library/LaunchAgents/com.artbrows.platform.plist

<plist>
  <key>Label</key><string>com.artbrows.platform</string>
  <key>ProgramArguments</key>
  <array>
    <string>/Users/admin/artbrows-platform-py/.venv/bin/python</string>
    <string>main.py</string>
    <string>server</string>
  </array>
  <key>WorkingDirectory</key><string>/Users/admin/artbrows-platform-py</string>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
</plist>
```

### 3. Caddy 자동 HTTPS (또는 Cloudflare Tunnel)
```
app.eyebrows.staris.cloud {
    reverse_proxy localhost:8001
}
```

### 4. Tailscale 내부 SSH (모비딕 표준)
이미 맥미니에 Tailscale 설치됨. 같은 net에서 SSH·관리.

## 배포 순서 (차주 07-01 한승철)

| Day | 작업 | 결과 |
|---|---|---|
| 07-01 (월) | 가비아 DNS 추가 (대표님 5분) | `app.eyebrows.staris.cloud` DNS 활성 |
| 07-01 (월) | 맥미니에 Python 3.12 + .venv | 환경 준비 |
| 07-01 (월) | git pull `artbrows-platform-py` | 코드 배포 |
| 07-02 (화) | `pip install -r requirements.txt` | 패키지 |
| 07-02 (화) | `.env` 환경 변수 셋업 (API 키 3종) | 시크릿 |
| 07-02 (화) | `python main.py server` 수동 테스트 | port 8001 |
| 07-03 (수) | Cloudflare Tunnel 또는 Caddy + Let's Encrypt | HTTPS 자동 |
| 07-03 (수) | launchd 자동 시작 등록 | 영구 가동 |
| 07-04 (목) | end-to-end 테스트 (외부에서 https://app.eyebrows.staris.cloud) | ✅ 라이브 |

## SaaS B 광고 OAuth 콜백 URL (필수)

도메인 활성 후 등록:
- Meta Marketing: `https://app.eyebrows.staris.cloud/oauth/meta/callback`
- 네이버 검색광고: `https://app.eyebrows.staris.cloud/oauth/naver/callback`
- Google Ads: `https://app.eyebrows.staris.cloud/oauth/google/callback`
- Kakao SSO: `https://app.eyebrows.staris.cloud/oauth/kakao/callback`

## 비용
- 가비아 DNS 추가: 0원 (기존 도메인)
- Cloudflare Tunnel: 0원
- 맥미니: 기존 (운영비만)
- SSL: 자동·무료
- **합계 추가 비용: 0원**

## 관련 메모리
- [[domain-eyebrows-staris]] — 기존 도메인 구조
- [[mobydick-standard]] — 맥미니 + Tailscale + launchd 표준
- [[artbrows-3saas-formal-planning-2026-06-29]] — 본격 가동
- [[artbrows-master-plan-2026-06-29]] — 마스터 플랜 (결정 ① 확정 표시)
