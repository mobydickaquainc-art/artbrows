# ==============================================================
# Seonleung Server DEV Environment Setup Script (2026-07-29)
# Goal: Set up Seonleung PC as primary dev machine
#       (Mac -> Remote -> Seonleung PC -> Claude Code + git + node)
# Run: Administrator PowerShell -> .\setup-dev-seonleung.ps1
# ==============================================================
#
# Installs:
#   1. Node.js 20 LTS (via winget)
#   2. Git for Windows (via winget)
#   3. GitHub CLI (via winget)
#   4. VS Code (via winget · Claude Code extension host)
#   5. Cursor (optional · via winget)
#   6. Windows Terminal (better than default PowerShell console)
#   7. Chrome (if not already)
#
# Creates:
#   D:\projects\  (main dev root)
#   Clones jmjartbrows-maker/artbrows into D:\projects\artbrows
#
# Manual next steps after script:
#   - gh auth login   (GitHub CLI · web browser)
#   - git config --global user.name/user.email
#   - Copy .env.local files from source PC (secrets · not in git)
#   - Copy large assets (assets/, _brief/, docs/*.pdf) via AnyDesk
#   - Install Claude Code (via VS Code marketplace or terminal npm)
# ==============================================================

$ErrorActionPreference = 'Continue'    # Keep going even if one install fails
$ProgressPreference = 'SilentlyContinue'

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  Seonleung DEV Environment Setup v0.1" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# --- Check Administrator ---
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "[ERROR] Must run as Administrator." -ForegroundColor Red
    exit 1
}

# --- Check winget ---
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] winget not found. Install from Microsoft Store: App Installer" -ForegroundColor Red
    exit 1
}

$installs = @(
    @{ id = "OpenJS.NodeJS.LTS";      name = "Node.js 20 LTS" }
    @{ id = "Git.Git";                name = "Git for Windows" }
    @{ id = "GitHub.cli";             name = "GitHub CLI" }
    @{ id = "Microsoft.VisualStudioCode"; name = "VS Code" }
    @{ id = "Microsoft.WindowsTerminal"; name = "Windows Terminal" }
    @{ id = "Google.Chrome";          name = "Chrome" }
    # Cursor is optional · comment out if not wanted
    @{ id = "Anysphere.Cursor";       name = "Cursor (AI IDE · optional)" }
)

foreach ($pkg in $installs) {
    Write-Host "[Install] $($pkg.name)" -ForegroundColor Yellow
    winget install --id $pkg.id --accept-source-agreements --accept-package-agreements --silent 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: $($pkg.name)" -ForegroundColor Green
    } elseif ($LASTEXITCODE -eq -1978335189) {
        Write-Host "  OK: already installed" -ForegroundColor Green
    } else {
        Write-Host "  WARN: winget exit $LASTEXITCODE (check manually)" -ForegroundColor Yellow
    }
    Write-Host ""
}

# --- Create D:\projects ---
Write-Host "[Setup] D:\projects dev root" -ForegroundColor Yellow
$devRoot = "D:\projects"
if (-not (Test-Path $devRoot)) {
    New-Item -ItemType Directory -Path $devRoot -Force | Out-Null
    Write-Host "  OK created: $devRoot"
} else {
    Write-Host "  OK exists"
}
Write-Host ""

# --- Note about clone ---
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  Base install complete" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS (manual · new PowerShell window · PATH refresh needed):" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Close this window · open new admin PowerShell (PATH refresh)" -ForegroundColor White
Write-Host ""
Write-Host "  2. GitHub CLI login:" -ForegroundColor White
Write-Host "     gh auth login" -ForegroundColor Gray
Write-Host "     -> GitHub.com -> HTTPS -> Yes -> Login with a web browser" -ForegroundColor Gray
Write-Host "     -> jmjartbrows-maker account" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Git config:" -ForegroundColor White
Write-Host '     git config --global user.name "장미지 ARTbrows"' -ForegroundColor Gray
Write-Host '     git config --global user.email "jmjartbrows@gmail.com"' -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Clone project:" -ForegroundColor White
Write-Host "     cd D:\projects" -ForegroundColor Gray
Write-Host "     git clone https://github.com/jmjartbrows-maker/artbrows.git" -ForegroundColor Gray
Write-Host ""
Write-Host "  5. Install project deps:" -ForegroundColor White
Write-Host "     cd D:\projects\artbrows\app-next" -ForegroundColor Gray
Write-Host "     npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "  6. Copy .env.local from source PC (secrets · NOT in git):" -ForegroundColor White
Write-Host "     - app-next\.env.local     (Gemini/OpenAI keys · Supabase etc)" -ForegroundColor Gray
Write-Host "     - Any other .env files in the project" -ForegroundColor Gray
Write-Host "     Method: AnyDesk file transfer or clipboard paste" -ForegroundColor Gray
Write-Host ""
Write-Host "  7. Copy large assets from source PC (via AnyDesk file transfer):" -ForegroundColor White
Write-Host "     Source PC: d:\work\jangmi\artbrows-project\" -ForegroundColor Gray
Write-Host "     Target here: D:\projects\artbrows\" -ForegroundColor Gray
Write-Host "     Priority folders (largest first · run parallel):" -ForegroundColor Gray
Write-Host "       - assets\        (~500MB · 원장님 자료)" -ForegroundColor Gray
Write-Host "       - _brief\        (~200MB · PDF 브리핑)" -ForegroundColor Gray
Write-Host "       - _incoming\     (~100MB · pptx 등)" -ForegroundColor Gray
Write-Host "       - docs\*.pdf     (~수백 MB · 대용량 슬라이드)" -ForegroundColor Gray
Write-Host ""
Write-Host "  8. Install Claude Code (via terminal or VS Code):" -ForegroundColor White
Write-Host "     Option A · npm CLI:  npm install -g @anthropic-ai/claude-code" -ForegroundColor Gray
Write-Host "     Option B · VS Code:  extension marketplace -> 'Claude Code' -> Install" -ForegroundColor Gray
Write-Host ""
Write-Host "  9. Verify dev server:" -ForegroundColor White
Write-Host "     cd D:\projects\artbrows\app-next" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host "     -> http://localhost:3000 open in browser" -ForegroundColor Gray
Write-Host ""
Write-Host "  10. First commit (verify git works):" -ForegroundColor White
Write-Host "      cd D:\projects\artbrows" -ForegroundColor Gray
Write-Host "      git status  # should be clean" -ForegroundColor Gray
Write-Host "      # any change -> git add · commit · push -> Vercel auto redeploy" -ForegroundColor Gray
Write-Host ""
