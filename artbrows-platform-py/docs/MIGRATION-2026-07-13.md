# ARTbrows 서버 이관 가이드 — 대표님 PC → 장미지 연구소

- **작성**: 2026-07-13
- **배경**: 대표님 PC(다른 프로젝트 섞임) → 장미지 연구소 전용 서버로 완전 이관
- **새 서버**: Windows PC · KT 회선 · IP `14.52.141.172` (유동)
- **최종 목표**:
  1. 서버가 연구소에서 24/7 돌아감
  2. 대표님이 사무실에서 **원격 데스크톱(RDP)** 으로 접속해서 개발·운영
  3. 대표님 PC는 ARTbrows 흔적 없이 정리
- **대상 독자**: 대표님(원격 총괄) · 원장님(물리 확인) · 박대표(설치 진행)

---

## 🗺 전체 그림

```
[대표님 사무실 PC]                     [장미지 연구소 새 Windows PC]
     │                                        │
     │  ①원격 데스크톱 (RDP)                    │  ARTbrows 서버 (:8001)
     │  ─────────────────►                    │  ├─ Python + FastAPI
     │                                        │  ├─ DB (SQLite)
     │                                        │  └─ 이미지·상품·강의 데이터
     │                                        │
     │  ②Cloudflare Tunnel                    │  cloudflared (서비스)
     │  ─────────────────►                    │  ├─ https://xxx.artbrow.co.kr (웹)
     │     (외부 인터넷 공유용)                    │  └─ RDP 라우팅 (대표님 원격 접속)
     │                                        │
     └─ 외부 사용자·원장님도 여기 접근 ─────────►
```

**핵심 아이디어**: **Cloudflare Tunnel 하나로 웹 접속 + RDP 원격 접속 둘 다 해결** → KT 유동 IP·공유기 방화벽 뚫을 필요 없음

---

## 📅 단계별 실행 순서 (총 4단계 · 약 90분)

### 0단계 · 새 서버 정보 확인 (5분 · 원장님 or 박대표)

새 Windows PC에서 확인:

| 확인 항목 | 방법 | 필요값 |
|---------|------|-------|
| Windows 에디션 | 설정 → 시스템 → 정보 | **Windows 10/11 Pro 이상** 필수 (Home은 RDP 안 됨) |
| 로그인 계정명 | 아무 폴더에서 `%USERNAME%` 확인 | 예: `artbrows` 등 |
| 관리자 권한 여부 | `net session` 명령 → 오류 없음 | 관리자 필수 |
| Python 설치 여부 | `python --version` | 3.10 이상 · 없으면 설치 필요 |

**Home 에디션이면**: Windows Pro 업그레이드 필요 (설정 → 시스템 → 정품 인증 → 스토어 열기 · 19,900원 · 10분)

---

### 1단계 · 원격 데스크톱(RDP) 활성화 (10분 · 원장님·박대표)

**새 서버에서**:

1. **RDP 활성화**
   - 설정 → 시스템 → **원격 데스크톱** → **켜기**
   - "네트워크 수준 인증(NLA)" 유지 (보안)

2. **RDP 접속용 계정 확인**
   - 관리자 계정 또는 별도 계정 (계정에 반드시 **비밀번호** 있어야 함)
   - 비밀번호 없으면 → 설정 → 계정 → 로그인 옵션 → 비밀번호 추가

3. **방화벽 확인**
   - Windows Defender 방화벽 → 앱 허용 → "원격 데스크톱" 체크 (기본으로 됨)

4. **PC 스크린 절대 꺼지지 않게**
   - 설정 → 시스템 → 전원 → 화면·절전 = **"안 함"**
   - 뚜껑 닫아도 안 꺼짐 (노트북이면): 설정 → 시스템 → 전원 → 추가 설정 → "덮개 닫힘 → 아무 것도 안 함"

5. **자동 로그인 설정** (재부팅해도 사용자 세션 유지되게)
   - `Win+R` → `netplwiz` → "사용자 이름과 암호를 입력해야 이 PC 사용" 체크 해제
   - 계정 비밀번호 입력

---

### 2단계 · Cloudflare Tunnel + RDP 라우팅 (30분 · 대표님 or 박대표)

이 단계는 **Cloudflare 계정 필요** (없으면 무료 가입).

#### 2-1. 도메인 준비

- **필수**: 대표님이 오전에 결정한 `artbrow.co.kr` 도메인이 **Cloudflare에 등록되어 있어야** 함
- 아직 가비아에서만 결제하고 Cloudflare 연결 안 된 상태면 → 아래 순서로 진행

##### 가비아 → Cloudflare 이관 절차

1. Cloudflare 로그인 → "Add site" → `artbrow.co.kr` 입력
2. Cloudflare가 이 도메인의 현재 DNS 스캔
3. Cloudflare가 알려주는 **네임서버 2개** 복사 (예: `xxx.ns.cloudflare.com`)
4. 가비아 로그인 → 도메인 관리 → 네임서버 변경 → Cloudflare 네임서버 입력
5. 24시간 이내 반영 (보통 1시간)

#### 2-2. 새 서버에 cloudflared 설치·인증

```powershell
# 관리자 PowerShell에서
winget install --id Cloudflare.cloudflared

# Cloudflare 인증 (브라우저 열려서 로그인)
cloudflared tunnel login

# 이름 붙인 tunnel 생성
cloudflared tunnel create artbrows-lab

# tunnel ID 나옴 (예: abc123-...). 이걸 메모.
```

#### 2-3. Tunnel 설정 파일

`C:\Users\<계정>\.cloudflared\config.yml` 생성:

```yaml
tunnel: artbrows-lab
credentials-file: C:\Users\<계정>\.cloudflared\<tunnel-id>.json

ingress:
  # 1) ARTbrows 웹 (FastAPI :8001)
  - hostname: app.artbrow.co.kr
    service: http://localhost:8001

  # 2) 원격 데스크톱 (RDP :3389)
  - hostname: rdp.artbrow.co.kr
    service: rdp://localhost:3389

  # catch-all
  - service: http_status:404
```

#### 2-4. DNS 라우팅 등록

```powershell
cloudflared tunnel route dns artbrows-lab app.artbrow.co.kr
cloudflared tunnel route dns artbrows-lab rdp.artbrow.co.kr
```

#### 2-5. 서비스로 등록 (재부팅해도 자동 시작)

```powershell
cloudflared service install
Start-Service cloudflared
```

---

### 3단계 · 코드·데이터 이관 + 서버 기동 (30분 · 원장님·박대표 물리 + 대표님 원격)

#### 3-1. 대표님 PC에서 파일 준비

**대표님 PC PowerShell**:

```powershell
cd d:\work\jangmi
# 지저분한 파일 뺀 압축
Compress-Archive -Path "artbrows-project\*" -DestinationPath "artbrows-project-2026-07-13.zip" `
  -Exclude "*\.venv","*\node_modules","*\.playwright-mcp","*\_site\.git","*\*.log","*\server.stdout.log","*\server.stderr.log"

# API 키 폴더 별도 압축 (민감정보)
Compress-Archive -Path "$env:USERPROFILE\.artbrows-secrets" -DestinationPath "artbrows-secrets.zip"

# 두 파일 = USB or Google Drive 로 새 서버에 옮기기
```

두 ZIP 파일 옮기는 방식:
- **A. USB 메모리** (16GB+) — 물리 이동 확실
- **B. Google Drive** — 대표님 gmail 계정 · 업로드 후 새 서버에서 다운로드
- **C. OneDrive** — Windows 기본 · 계정 로그인만 하면 됨

#### 3-2. 새 서버에서 복원

**새 Windows PC에서** (대표님이 RDP 원격 접속 or 현장):

```powershell
# 폴더 만들기
mkdir D:\work\jangmi 2>$null
cd D:\work\jangmi

# ZIP 압축 풀기
Expand-Archive -Path "$env:USERPROFILE\Downloads\artbrows-project-2026-07-13.zip" -DestinationPath "artbrows-project" -Force

# API 키 복원
Expand-Archive -Path "$env:USERPROFILE\Downloads\artbrows-secrets.zip" -DestinationPath "$env:USERPROFILE" -Force
# 결과: $env:USERPROFILE\.artbrows-secrets\gemini-api-key.txt 등 복원됨
```

#### 3-3. 자동 셋업 스크립트 실행

```powershell
cd D:\work\jangmi\artbrows-project\artbrows-platform-py
.\scripts\setup-new-server.ps1
```

이 스크립트가 자동으로 하는 것:
- Python 3.12+ 설치 여부 확인 (없으면 winget으로 설치)
- `.venv` 가상환경 생성
- `requirements.txt` 의존성 설치
- 환경변수 `PYTHONIOENCODING=utf-8` 설정
- API 키 파일 존재 확인
- DB 파일 확인 (`data/artbrows.db`)
- uvicorn 첫 기동 → :8001 응답 확인
- 결과 리포트

#### 3-4. 자동 시작 설정 (재부팅해도 자동 가동)

```powershell
.\scripts\install-autostart.ps1
```

Windows 작업 스케줄러에 다음 작업 등록:
- **artbrows-server** — 시스템 시작 시 uvicorn 자동 실행
- 관리자 권한 · 사용자 로그아웃 후에도 실행

---

### 4단계 · 대표님 원격 접속 시연 (5분)

**대표님 사무실 PC에서**:

1. **원격 데스크톱 실행** — `Win+R` → `mstsc`
2. **컴퓨터**: `rdp.artbrow.co.kr` 입력
3. **연결** → Cloudflare Access 인증 (이메일 or Google 로그인)
4. **Windows 자격증명** — 새 서버 계정명·비밀번호 입력
5. → 새 서버 데스크톱 표시됨 ✅

**이후 대표님이 새 서버에서 하실 일**:
- 브라우저 열어 `http://localhost:8001` → ARTbrows 확인
- Claude Code 설치 (같은 계정으로 로그인)
- 코드 편집·서버 재시작 등 모든 개발 작업 여기서

---

## 🧹 5단계 (나중) · 대표님 PC 정리

이관 검증 완료 후 (일주일 정도 새 서버 안정 확인 후):

```powershell
# 대표님 PC 에서
# 백업 먼저 (안전)
Move-Item d:\work\jangmi\artbrows-project d:\_backup\artbrows-project-대표님PC-백업-2026-07-13

# cloudflared 프로세스 종료
Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force

# uvicorn 프로세스 종료
Get-Process python -ErrorAction SilentlyContinue |
  Where-Object { $_.MainWindowTitle -match "8001" -or (Get-CimInstance Win32_Process -Filter "ProcessId=$($_.Id)").CommandLine -match "artbrows-platform-py" } |
  Stop-Process -Force
```

---

## 🔧 검증 체크리스트

### 웹 접속 (외부 사용자·원장님)

- [ ] `https://app.artbrow.co.kr` 접속 → ARTbrows 홈 200 OK
- [ ] `https://app.artbrow.co.kr/static/enrollment.html` → 수강 안내 카드 6장
- [ ] `https://app.artbrow.co.kr/static/calendar.html` → 강의 캘린더
- [ ] `https://app.artbrow.co.kr/api/docs` → Swagger UI

### 원격 데스크톱 (대표님)

- [ ] `mstsc` → `rdp.artbrow.co.kr` 접속 성공
- [ ] Windows 데스크톱 표시
- [ ] `python --version` 실행 (venv 활성화 후) → 3.12+
- [ ] `curl http://localhost:8001/api/enrollment/library` 200 OK

### 자동 시작 확인 (재부팅 테스트)

- [ ] 새 서버 재부팅
- [ ] 재부팅 후 자동으로:
  - [ ] uvicorn `:8001` 살아남
  - [ ] cloudflared 서비스 살아남
  - [ ] `https://app.artbrow.co.kr` 접속 성공

---

## 🚨 트러블슈팅

### 문제 1: "cloudflared tunnel login" 브라우저 안 열림

**해결**: 명령어 출력에 URL 나옴 → 대표님이 그 URL을 다른 브라우저에서 열어서 로그인

### 문제 2: RDP 연결 시 "인증서 오류"

**해결**: mstsc 옵션 → "고급" → "서버 인증 확인 방법" → "경고 후 연결"

### 문제 3: `app.artbrow.co.kr` 접속 시 502 Bad Gateway

**원인**: uvicorn이 아직 안 뜸 · 또는 방화벽 차단
**해결**:
```powershell
# 서비스 상태 확인
Get-Service cloudflared

# uvicorn 프로세스 확인
Get-NetTCPConnection -LocalPort 8001 -State Listen

# 없으면 수동 실행
cd D:\work\jangmi\artbrows-project\artbrows-platform-py
$env:PYTHONIOENCODING="utf-8"; .\.venv\Scripts\python.exe -m uvicorn web.app:app --host 0.0.0.0 --port 8001
```

### 문제 4: KT 인터넷 끊김

**Cloudflare Tunnel은 아웃바운드 커넥션**이라 KT 재접속되면 자동 복구. 만약 안 되면:

```powershell
Restart-Service cloudflared
```

---

## 📋 요약 · 오늘 대표님이 결정할 것

| # | 결정 | 옵션 |
|---|-----|------|
| A | 이관 파일 전달 방식 | USB / Google Drive / OneDrive |
| B | Cloudflare 계정 | 대표님 이메일로 신규 가입 or 기존 계정 사용? |
| C | 가비아 도메인 → Cloudflare 이관 | 지금 진행 / 나중 (그동안 Quick Tunnel 임시 사용) |
| D | 새 서버 관리자 계정명·비밀번호 | 대표님이 정하기 · 안전한 비밀번호 |
| E | 자동 시작 서비스 등록 | 예 / 아니오 |

---

## 📌 참고

- **관련 문서**: [`ARTbrows-개발기획서-v1.0.md`](ARTbrows-개발기획서-v1.0.md) (v1.2) · [`PG-COMPARISON-2026-07-13.md`](PG-COMPARISON-2026-07-13.md)
- **자동 스크립트**: `scripts/setup-new-server.ps1` · `scripts/install-autostart.ps1`
- **메모리**: `artbrows-dev-mode-only-no-mac-mini.md` (이관 완료 후 갱신 예정)

---

**⚠️ 주의**: RDP 3389 포트는 외부에 직접 노출하면 안 됩니다 (봇 공격 대상). **반드시 Cloudflare Tunnel 통해서만** 원격 접속하세요. Cloudflare Access 로그인 계층이 무료 방화벽 역할.
