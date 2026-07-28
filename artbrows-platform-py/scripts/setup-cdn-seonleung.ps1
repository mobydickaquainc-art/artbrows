# ==============================================================
# Seonleung Server CDN Auto Setup Script (2026-07-28)
# Run: Administrator PowerShell -> .\setup-cdn-seonleung.ps1
# ==============================================================
# Goal: Serve artbrows.co.kr images/videos from Seonleung server
#   External -> Cloudflare Proxy -> KT Router Port Forward -> Seonleung Nginx :80 -> D:\media\*
#
# This script does:
#   1. Create D:\media folder (asset root)
#   2. Download + install Nginx 1.25.4 (D:\nginx)
#   3. Configure Nginx (CORS, cache 30d, gzip, /health)
#   4. Windows Firewall inbound port 80 allow
#   5. Download + install cloudflared (C:\Program Files\cloudflared)
#   6. Start Nginx immediately
#
# Manual steps after script (5 min):
#   - cloudflared tunnel login
#   - cloudflared tunnel create artbrows-cdn
#   - cloudflared tunnel route dns artbrows-cdn cdn.artbrows.co.kr
#   - Write config.yml
#   - cloudflared service install
# ==============================================================

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  Seonleung CDN Setup v0.2" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# --- Check Administrator ---
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "[ERROR] Must run as Administrator. Right-click -> Run as Administrator" -ForegroundColor Red
    exit 1
}

# --- 1. D:\media folder ---
Write-Host "[Step 1] Create D:\media" -ForegroundColor Yellow
$mediaDir = "D:\media"
if (-not (Test-Path $mediaDir)) {
    New-Item -ItemType Directory -Path $mediaDir -Force | Out-Null
    Write-Host "  OK created: $mediaDir"
} else {
    Write-Host "  OK exists"
}
foreach ($sub in @("brand", "brand\ai-generated", "brand\class-documentary", "brand\patents", "brand\reference-cards-2026-07-24", "hero-mood", "uploads")) {
    $p = Join-Path $mediaDir $sub
    if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
}
Write-Host ""

# --- 2. Nginx install ---
Write-Host "[Step 2] Install Nginx" -ForegroundColor Yellow
$nginxDir = "D:\nginx"
$nginxVersion = "1.25.4"
$nginxUrl = "https://nginx.org/download/nginx-$nginxVersion.zip"
$nginxZip = "$env:TEMP\nginx-$nginxVersion.zip"

if (-not (Test-Path "$nginxDir\nginx.exe")) {
    Write-Host "  Downloading Nginx $nginxVersion ..."
    Invoke-WebRequest -Uri $nginxUrl -OutFile $nginxZip -UseBasicParsing
    Write-Host "  Extracting ..."
    Expand-Archive -Path $nginxZip -DestinationPath "D:\" -Force
    if (Test-Path "D:\nginx-$nginxVersion") {
        if (Test-Path $nginxDir) { Remove-Item $nginxDir -Recurse -Force }
        Rename-Item -Path "D:\nginx-$nginxVersion" -NewName "nginx"
    }
    Remove-Item $nginxZip
    Write-Host "  OK installed: $nginxDir"
} else {
    Write-Host "  OK already installed: $nginxDir"
}
Write-Host ""

# --- 3. Nginx config (CORS, cache, gzip) ---
Write-Host "[Step 3] Write nginx.conf" -ForegroundColor Yellow
$confPath = Join-Path $nginxDir "conf\nginx.conf"
$nginxConf = @'
worker_processes auto;
events { worker_connections 1024; }

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    keepalive_timeout 65;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1024;

    access_log logs/access.log;
    error_log  logs/error.log warn;

    server {
        listen       80;
        server_name  cdn.artbrows.co.kr localhost;

        root D:/media;

        location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|mp4|webm|woff|woff2|ttf|otf|css|js)$ {
            add_header Cache-Control "public, max-age=2592000, immutable";
            add_header Access-Control-Allow-Origin "*";
            add_header X-Content-Type-Options "nosniff";
            try_files $uri =404;
        }

        location / {
            add_header Cache-Control "public, max-age=3600";
            add_header Access-Control-Allow-Origin "*";
            try_files $uri $uri/ =404;
        }

        location /health {
            access_log off;
            add_header Content-Type text/plain;
            return 200 "ok\n";
        }
    }
}
'@
# IMPORTANT: Nginx does not accept BOM. Use .NET WriteAllText with UTF8 no BOM.
[System.IO.File]::WriteAllText($confPath, $nginxConf, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "  OK written (no BOM): $confPath"
Write-Host ""

# --- Nginx logs folder ---
$logsDir = Join-Path $nginxDir "logs"
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir -Force | Out-Null }

# --- 4. Windows Firewall port 80 ---
Write-Host "[Step 4] Firewall rule: HTTP 80" -ForegroundColor Yellow
$fwRule = Get-NetFirewallRule -DisplayName "ARTbrows CDN HTTP 80" -ErrorAction SilentlyContinue
if ($null -eq $fwRule) {
    New-NetFirewallRule -DisplayName "ARTbrows CDN HTTP 80" `
        -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow -Profile Any | Out-Null
    Write-Host "  OK rule created"
} else {
    Write-Host "  OK already exists"
}
Write-Host ""

# --- 5. cloudflared install ---
Write-Host "[Step 5] Install cloudflared" -ForegroundColor Yellow
$cloudflaredPath = "C:\Program Files\cloudflared\cloudflared.exe"
if (-not (Test-Path $cloudflaredPath)) {
    $cfDir = "C:\Program Files\cloudflared"
    if (-not (Test-Path $cfDir)) { New-Item -ItemType Directory -Path $cfDir -Force | Out-Null }
    Write-Host "  Downloading cloudflared ..."
    Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" `
        -OutFile $cloudflaredPath -UseBasicParsing
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($currentPath -notlike "*$cfDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$cfDir", "Machine")
        Write-Host "  OK added to PATH"
    }
    Write-Host "  OK installed"
} else {
    Write-Host "  OK already installed"
}
Write-Host ""

# --- 6. Start Nginx ---
Write-Host "[Step 6] Start Nginx" -ForegroundColor Yellow
Push-Location $nginxDir
try {
    Get-Process nginx -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 1
    $test = & ".\nginx.exe" -t 2>&1
    Write-Host "  nginx -t: $test"
    Start-Process -FilePath ".\nginx.exe" -WindowStyle Hidden
    Start-Sleep -Seconds 2
    $running = Get-Process nginx -ErrorAction SilentlyContinue
    if ($running) {
        Write-Host "  OK Nginx running (PID: $($running[0].Id))"
    } else {
        Write-Host "  ERROR Nginx failed to start. Check logs\error.log" -ForegroundColor Red
    }
} finally {
    Pop-Location
}
Write-Host ""

# --- 7. Health check ---
Write-Host "[Step 7] Health check (localhost:80)" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "  OK response: $($r.Content.Trim()) (HTTP $($r.StatusCode))"
} catch {
    Write-Host "  ERROR health check failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# --- Done ---
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  Setup complete" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "NEXT STEPS (manual):" -ForegroundColor Yellow
Write-Host "  1. cloudflared tunnel login" -ForegroundColor White
Write-Host "     -> Browser opens, login to Cloudflare, authorize artbrows.co.kr"
Write-Host ""
Write-Host "  2. cloudflared tunnel create artbrows-cdn" -ForegroundColor White
Write-Host "     -> Note the tunnel ID"
Write-Host ""
Write-Host "  3. cloudflared tunnel route dns artbrows-cdn cdn.artbrows.co.kr" -ForegroundColor White
Write-Host "     -> Auto CNAME on Cloudflare DNS"
Write-Host ""
Write-Host "  4. Create config.yml at %USERPROFILE%\.cloudflared\config.yml" -ForegroundColor White
Write-Host "     tunnel: <tunnel-id>"
Write-Host "     credentials-file: %USERPROFILE%\.cloudflared\<tunnel-id>.json"
Write-Host "     ingress:"
Write-Host "       - hostname: cdn.artbrows.co.kr"
Write-Host "         service: http://localhost:80"
Write-Host "       - service: http_status:404"
Write-Host ""
Write-Host "  5. cloudflared service install (Windows auto-start)" -ForegroundColor White
Write-Host ""
Write-Host "  6. Copy assets from your PC to D:\media (via AnyDesk / robocopy / USB)" -ForegroundColor White
Write-Host ""
Write-Host "  7. Test: https://cdn.artbrows.co.kr/health should return 'ok'" -ForegroundColor White
Write-Host ""
