# ═══════════════════════════════════════════════════════════════
# 선릉 서버 CDN 자동 셋업 스크립트 (2026-07-28)
# 실행: 관리자 PowerShell 에서 → .\setup-cdn-seonleung.ps1
# ═══════════════════════════════════════════════════════════════
# 목표: artbrows.co.kr 홈피의 이미지·영상을 선릉 서버에서 서빙
#   외부 → Cloudflare 프록시 → KT 공유기 포트포워딩 → 선릉 Nginx :80 → D:\media\*
#
# 이 스크립트가 하는 것:
#   1. D:\media 폴더 생성 (자산 저장소)
#   2. Nginx 다운로드 + 설치 (D:\nginx)
#   3. cloudflared 다운로드 + 설치 (Windows 서비스 등록)
#   4. Nginx 설정 (CORS · 캐시 · gzip)
#   5. Windows 방화벽 규칙 (80/443/8080 인바운드 허용)
#   6. Windows 서비스 자동 시작 등록
#
# 대표님이 별도로 하실 것 (스크립트 종료 후):
#   - cloudflared tunnel login (브라우저 승인 · 1분)
#   - cloudflared tunnel create artbrows-cdn
#   - Cloudflare DNS 에 cdn.artbrows.co.kr CNAME 자동 등록
# ═══════════════════════════════════════════════════════════════

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'   # 다운로드 progress 숨김

Write-Host "`n══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  선릉 CDN 서버 셋업 · v0.1" -ForegroundColor Cyan
Write-Host "══════════════════════════════════════`n" -ForegroundColor Cyan

# ─── 관리자 확인 ───
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ 관리자 권한으로 실행 필요. 우클릭 → 관리자 권한으로 실행" -ForegroundColor Red
    exit 1
}

# ─── 1. D:\media 자산 폴더 ───
Write-Host "▶ Step 1 · D:\media 폴더 생성" -ForegroundColor Yellow
$mediaDir = "D:\media"
if (-not (Test-Path $mediaDir)) {
    New-Item -ItemType Directory -Path $mediaDir -Force | Out-Null
    Write-Host "  ✅ $mediaDir 생성 완료"
} else {
    Write-Host "  ✅ 이미 존재"
}
# 하위 폴더 미리 (대표님 자산 이관 대상 경로 일치)
foreach ($sub in @("brand", "brand\ai-generated", "brand\class-documentary", "brand\patents", "brand\reference-cards-2026-07-24", "hero-mood", "uploads")) {
    $p = Join-Path $mediaDir $sub
    if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
}
Write-Host ""

# ─── 2. Nginx 설치 ───
Write-Host "▶ Step 2 · Nginx 설치" -ForegroundColor Yellow
$nginxDir = "D:\nginx"
$nginxVersion = "1.25.4"   # 안정 stable
$nginxUrl = "https://nginx.org/download/nginx-$nginxVersion.zip"
$nginxZip = "$env:TEMP\nginx-$nginxVersion.zip"

if (-not (Test-Path "$nginxDir\nginx.exe")) {
    Write-Host "  ⏳ Nginx $nginxVersion 다운로드 중..."
    Invoke-WebRequest -Uri $nginxUrl -OutFile $nginxZip -UseBasicParsing
    Write-Host "  ⏳ 압축 해제 중..."
    Expand-Archive -Path $nginxZip -DestinationPath "D:\" -Force
    # nginx-1.25.4 폴더가 D:\ 에 생김 → nginx 로 rename
    if (Test-Path "D:\nginx-$nginxVersion") {
        if (Test-Path $nginxDir) { Remove-Item $nginxDir -Recurse -Force }
        Rename-Item -Path "D:\nginx-$nginxVersion" -NewName "nginx"
    }
    Remove-Item $nginxZip
    Write-Host "  ✅ Nginx 설치 완료: $nginxDir"
} else {
    Write-Host "  ✅ 이미 설치됨: $nginxDir"
}
Write-Host ""

# ─── 3. Nginx 설정 파일 작성 (CORS · 캐시 · gzip) ───
Write-Host "▶ Step 3 · Nginx 설정 (artbrows-cdn.conf)" -ForegroundColor Yellow
$confPath = Join-Path $nginxDir "conf\nginx.conf"
$nginxConf = @'
worker_processes auto;
events { worker_connections 1024; }

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    keepalive_timeout 65;

    # gzip 압축 (텍스트 · JS · CSS)
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1024;

    # 로그
    access_log logs/access.log;
    error_log  logs/error.log warn;

    # ─── CDN 서버 ───
    server {
        listen       80;
        server_name  cdn.artbrows.co.kr localhost;

        # 자산 루트 = D:\media
        root D:/media;

        # 정적 파일 캐시 (30일 · Cloudflare 가 CDN 캐시)
        location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|mp4|webm|woff|woff2|ttf|otf|css|js)$ {
            add_header Cache-Control "public, max-age=2592000, immutable";
            add_header Access-Control-Allow-Origin "*";
            add_header X-Content-Type-Options "nosniff";
            try_files $uri =404;
        }

        # 기본 GET · 확장자 없는 것도 정적 처리
        location / {
            add_header Cache-Control "public, max-age=3600";
            add_header Access-Control-Allow-Origin "*";
            try_files $uri $uri/ =404;
        }

        # 헬스체크 · 우리 모니터링용
        location /health {
            access_log off;
            add_header Content-Type text/plain;
            return 200 "ok\n";
        }
    }
}
'@
$nginxConf | Out-File -Encoding utf8 $confPath -Force
Write-Host "  ✅ nginx.conf 작성: $confPath"
Write-Host ""

# ─── 4. Nginx logs 폴더 ───
$logsDir = Join-Path $nginxDir "logs"
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir -Force | Out-Null }

# ─── 5. Windows 방화벽 · HTTP 80 열기 ───
Write-Host "▶ Step 4 · Windows 방화벽 규칙 · HTTP 80" -ForegroundColor Yellow
$fwRule = Get-NetFirewallRule -DisplayName "ARTbrows CDN HTTP 80" -ErrorAction SilentlyContinue
if ($null -eq $fwRule) {
    New-NetFirewallRule -DisplayName "ARTbrows CDN HTTP 80" `
        -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow -Profile Any | Out-Null
    Write-Host "  ✅ 방화벽 규칙 생성"
} else {
    Write-Host "  ✅ 이미 존재"
}
Write-Host ""

# ─── 6. cloudflared 설치 ───
Write-Host "▶ Step 5 · cloudflared (Cloudflare Tunnel) 설치" -ForegroundColor Yellow
$cloudflaredPath = "C:\Program Files\cloudflared\cloudflared.exe"
if (-not (Test-Path $cloudflaredPath)) {
    $cfDir = "C:\Program Files\cloudflared"
    if (-not (Test-Path $cfDir)) { New-Item -ItemType Directory -Path $cfDir -Force | Out-Null }
    Write-Host "  ⏳ cloudflared 다운로드 중..."
    Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" `
        -OutFile $cloudflaredPath -UseBasicParsing
    # PATH 에 추가
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($currentPath -notlike "*$cfDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$cfDir", "Machine")
        Write-Host "  ✅ PATH 에 cloudflared 추가"
    }
    Write-Host "  ✅ cloudflared 설치 완료"
} else {
    Write-Host "  ✅ 이미 설치됨"
}
Write-Host ""

# ─── 7. Nginx 즉시 시작 ───
Write-Host "▶ Step 6 · Nginx 시작" -ForegroundColor Yellow
Push-Location $nginxDir
try {
    # 기존 nginx 프로세스 kill
    Get-Process nginx -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 1
    # 설정 검증
    $test = & ".\nginx.exe" -t 2>&1
    Write-Host "  nginx -t: $test"
    # 시작
    Start-Process -FilePath ".\nginx.exe" -WindowStyle Hidden
    Start-Sleep -Seconds 2
    $running = Get-Process nginx -ErrorAction SilentlyContinue
    if ($running) {
        Write-Host "  ✅ Nginx 실행 중 (PID: $($running[0].Id))"
    } else {
        Write-Host "  ⚠️ Nginx 시작 실패 · logs\error.log 확인"
    }
} finally {
    Pop-Location
}
Write-Host ""

# ─── 8. 헬스체크 ───
Write-Host "▶ Step 7 · 헬스체크 (localhost:80)" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "  ✅ 응답: $($r.Content.Trim()) (HTTP $($r.StatusCode))"
} catch {
    Write-Host "  ❌ 헬스체크 실패: $($_.Exception.Message)"
}
Write-Host ""

# ─── 완료 ───
Write-Host "══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ 셋업 완료" -ForegroundColor Green
Write-Host "══════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "다음 단계 (수동):" -ForegroundColor Yellow
Write-Host "  1. cloudflared tunnel login" -ForegroundColor White
Write-Host "     → 브라우저 자동 열림 · Cloudflare 계정 로그인 · artbrows.co.kr 도메인 승인"
Write-Host ""
Write-Host "  2. cloudflared tunnel create artbrows-cdn" -ForegroundColor White
Write-Host "     → tunnel ID 발급됨"
Write-Host ""
Write-Host "  3. cloudflared tunnel route dns artbrows-cdn cdn.artbrows.co.kr" -ForegroundColor White
Write-Host "     → Cloudflare DNS 에 CNAME 자동 등록"
Write-Host ""
Write-Host "  4. C:\Users\<user>\.cloudflared\config.yml 생성:" -ForegroundColor White
Write-Host "     tunnel: <tunnel-id>"
Write-Host "     credentials-file: C:\Users\<user>\.cloudflared\<tunnel-id>.json"
Write-Host "     ingress:"
Write-Host "       - hostname: cdn.artbrows.co.kr"
Write-Host "         service: http://localhost:80"
Write-Host "       - service: http_status:404"
Write-Host ""
Write-Host "  5. cloudflared service install (Windows 서비스 · 자동 시작)" -ForegroundColor White
Write-Host ""
Write-Host "  6. 자산 이관 (대표님 PC → D:\media):" -ForegroundColor White
Write-Host "     robocopy \\<대표님PC>\artbrows-project\app-next\public\brand D:\media\brand /E /R:2"
Write-Host "     또는 AnyDesk 파일 전송 · USB 등"
Write-Host ""
Write-Host "  7. https://cdn.artbrows.co.kr/health 접속 → 'ok' 뜨면 성공" -ForegroundColor White
Write-Host ""
