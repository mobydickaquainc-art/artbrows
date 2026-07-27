# Deployment — 대표님 PC 호스팅 + 포트 포워딩 (2026-06-29 18:20 확정)

> 맥미니 X (모비딕 자산) · Vercel 보류 · **대표님 PC에서 FastAPI 직접 호스팅**
> 외부 접속 = 포트 포워딩 또는 Cloudflare Tunnel

## 🎯 핵심 결정
- 운영 모드: **개발 모드** (베타 직전까지)
- 호스팅: **대표님 PC (Windows)** 에서 직접
- 외부 접속: **포트 포워딩 (또는 Cloudflare Tunnel)**
- 도메인: `app.eyebrows.staris.cloud` 또는 베타 직전 결정

## 🔧 옵션 A: 포트 포워딩 (대표님 명시)

### 1. Windows에서 FastAPI 가동
```bash
cd D:\work\jangmi\artbrows-project\artbrows-platform-py
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python main.py server          # → 0.0.0.0:8001
```

### 2. Windows 방화벽 허용
```powershell
# 관리자 PowerShell
New-NetFirewallRule -DisplayName "ARTbrows Platform" -Direction Inbound `
  -LocalPort 8001 -Protocol TCP -Action Allow
```

### 3. 공유기 포트 포워딩
공유기 관리자 페이지 (보통 `192.168.0.1` 또는 `192.168.1.1`):
- 외부 포트: **80 (HTTP)** + **443 (HTTPS)**
- 내부 IP: 대표님 PC IP (예: `192.168.0.10`)
- 내부 포트: **8001**

대표님 PC 고정 내부 IP 설정 권장 (DHCP 예약).

### 4. 공인 IP 확인
```powershell
curl https://api.ipify.org
# 또는 https://whatismyipaddress.com
```

### 5. 가비아 DNS 추가
```
타입:    A
호스트:  app.eyebrows
값:      [공인 IP, 예: 123.45.67.89]   ← 점 없음 (A 레코드는 IP)
TTL:     600
```

### 6. HTTPS = Caddy for Windows (자동 SSL)
```bash
# Chocolatey로 설치
choco install caddy

# Caddyfile 생성
echo "app.eyebrows.staris.cloud {
    reverse_proxy localhost:8001
}" > Caddyfile

caddy run
```

Let's Encrypt 자동. HTTPS 즉시 활성.

### ⚠️ 동적 IP 대응 (가정 인터넷)
공인 IP가 자주 바뀌면:
- **KT/SKT 고정 IP 신청** (월 1~3만원)
- 또는 **DDNS** (no-ip.com·duckdns.org 무료) → CNAME으로 도메인 연결

---

## 🌐 옵션 B: Cloudflare Tunnel (★ 더 안전·편리)

### 1. Cloudflare 가입 (1회 · 5분)
https://dash.cloudflare.com — 구글 계정으로 가입

### 2. cloudflared 설치 (Windows)
```powershell
winget install --id Cloudflare.cloudflared
```

### 3. Tunnel 생성·연결
```bash
cloudflared tunnel login          # 브라우저로 로그인
cloudflared tunnel create artbrows
cloudflared tunnel route dns artbrows app.eyebrows.staris.cloud
```

가비아 DNS는 **cloudflared가 자동 추가** (대표님 수동 입력 X)

### 4. 백그라운드 실행 (Windows Service)
```bash
cloudflared service install
# = 부팅 시 자동 시작 (영구)
```

### Tunnel 구성 (`~/.cloudflared/config.yml`)
```yaml
tunnel: artbrows
credentials-file: C:\Users\dobi\.cloudflared\artbrows.json
ingress:
  - hostname: app.eyebrows.staris.cloud
    service: http://localhost:8001
  - service: http_status:404
```

### 장점 (Tunnel)
- ✅ **포트 안 열어도 됨** (외부 → 내부 차단 유지)
- ✅ **HTTPS 자동** (Let's Encrypt 불필요)
- ✅ **DDoS 보호**
- ✅ **공인 IP 변경 무관** (가정 인터넷 OK)
- ✅ **무료**

---

## 📊 두 옵션 비교

| 항목 | 포트 포워딩 (A) | Cloudflare Tunnel (B) |
|---|---|---|
| 셋업 시간 | 30분 (공유기·방화벽·SSL) | 10분 |
| 보안 | ⚠️ 포트 노출 (방화벽 강화 필요) | ✅ 포트 안 열음 |
| SSL | Caddy 설치 필요 | 자동 |
| 동적 IP | DDNS 필요 | ✅ 무관 |
| 비용 | 0원 (KT 고정 IP 시 ₩1~3만/월) | 0원 |
| DDoS 보호 | ❌ | ✅ |
| 모비딕 표준 정합 | △ | ★★ 정합 |

## 🚀 차주 한승철 셋업 시퀀스

### 옵션 A (포트 포워딩)
| Day | 작업 |
|---|---|
| 07-01 | 공인 IP 확인 + 가비아 A 레코드 추가 |
| 07-01 | 공유기 포트 포워딩 80/443 → 8001 |
| 07-01 | Windows 방화벽 허용 |
| 07-02 | Caddy 설치 + Caddyfile + HTTPS 자동 |
| 07-02 | Python 서버 영구 가동 (NSSM 또는 Task Scheduler) |
| 07-03 | end-to-end 테스트 |

### 옵션 B (Cloudflare Tunnel)
| Day | 작업 |
|---|---|
| 07-01 | Cloudflare 가입 (대표님 5분) |
| 07-01 | cloudflared 설치 + tunnel 생성 |
| 07-01 | DNS 자동 등록 |
| 07-02 | tunnel service install (영구 가동) |
| 07-02 | end-to-end 테스트 (https://app.eyebrows.staris.cloud) |

## 💰 매월 비용
- 옵션 A: 0원 (또는 KT 고정 IP ₩1~3만)
- 옵션 B: **0원**

## 🔐 보안 가이드 (둘 다 공통)
1. **`.env` 파일 절대 외부 노출 X** (이미 `.gitignore`)
2. **API 키 = 시크릿 폴더** (이미 `~/.artbrows-secrets/`)
3. **관리자 페이지 (`/admin`)** = Basic Auth + IP 화이트리스트
4. **OAuth 콜백** = 도메인 검증 정합
5. **CORS** = `app.eyebrows.staris.cloud` 만 허용

## 관련 메모리
- [[artbrows-dev-mode-only-no-mac-mini]] — 맥미니 X 결정
- [[domain-eyebrows-staris]] — 기존 도메인
- [[artbrows-master-plan-2026-06-29]] — 마스터 플랜
