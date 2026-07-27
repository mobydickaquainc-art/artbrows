# capture-for-review-2026-07-18.ps1
# 원장님·본부장이 서버 없이 훑을 수 있게 PNG 캡처 8종 생성
# 사용: app-next 폴더에서 `npm run dev` 실행 중일 때 이 스크립트 실행
# 결과: ../../_brief/review-captures-2026-07-18/*.png

$ErrorActionPreference = 'Stop'

$msedge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $msedge)) {
  $msedge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
}
if (-not (Test-Path $msedge)) {
  Write-Error "msedge.exe not found. Install Microsoft Edge or edit the path."
  exit 1
}

# 서버 대기 확인
Write-Host "[1/3] localhost:3000 서버 대기 중..." -ForegroundColor Cyan
$ok = $false
for ($i = 0; $i -lt 30; $i++) {
  try {
    $r = Invoke-WebRequest -Uri 'http://localhost:3000/' -UseBasicParsing -TimeoutSec 2
    if ($r.StatusCode -eq 200) { $ok = $true; break }
  } catch { Start-Sleep -Seconds 1 }
}
if (-not $ok) {
  Write-Error "localhost:3000 에 접속 못 함. 먼저 app-next 폴더에서 `npm run dev` 로 서버 켜세요."
  exit 1
}
Write-Host "  ✓ 서버 응답 확인" -ForegroundColor Green

# 결과 폴더 (부모 프로젝트 _brief/)
$outDir = Join-Path $PSScriptRoot '..\..\_brief\review-captures-2026-07-18'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
Write-Host "[2/3] 출력 폴더: $outDir" -ForegroundColor Cyan

# 캡처 대상 URL 8종
$targets = @(
  @{ name = '01-home-ko';           url = 'http://localhost:3000/';                width = 1440; height = 3600 },
  @{ name = '02-home-en';           url = 'http://localhost:3000/en';              width = 1440; height = 3600 },
  @{ name = '03-home-zh';           url = 'http://localhost:3000/zh';              width = 1440; height = 3600 },
  @{ name = '04-cardnews-list';     url = 'http://localhost:3000/cardnews';        width = 1440; height = 1600 },
  @{ name = '05-layouts-demo';      url = 'http://localhost:3000/cardnews/layouts'; width = 1440; height = 6000 },
  @{ name = '06-tutorial';          url = 'http://localhost:3000/cardnews/tutorial'; width = 1440; height = 2400 },
  @{ name = '07-consult';           url = 'http://localhost:3000/consult';         width = 1440; height = 1600 },
  @{ name = '08-contact';           url = 'http://localhost:3000/contact';         width = 1440; height = 1600 }
)

Write-Host "[3/3] 8종 캡처 시작..." -ForegroundColor Cyan
foreach ($t in $targets) {
  $out = Join-Path $outDir "$($t.name).png"
  $size = "$($t.width),$($t.height)"
  Write-Host "  → $($t.name) ..." -NoNewline
  & $msedge `
    --headless=new `
    --disable-gpu `
    --hide-scrollbars `
    --no-sandbox `
    --window-size=$size `
    --screenshot=$out `
    $t.url 2>$null | Out-Null
  if (Test-Path $out) {
    $kb = [math]::Round((Get-Item $out).Length / 1KB, 1)
    Write-Host " ✓ ${kb}KB" -ForegroundColor Green
  } else {
    Write-Host " ✗ FAIL" -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "완료. 폴더 열기:" -ForegroundColor Green
Write-Host "  explorer `"$outDir`""
