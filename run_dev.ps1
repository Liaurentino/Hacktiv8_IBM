param(
    [switch]$Restart,
    [switch]$KillExisting
)

Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host " Memulai Server LUNA (Backend & Frontend)..." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Yellow

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

if ($Restart -or $KillExisting) {
    Write-Host "[RESTART] Membersihkan proses lama pada port 3001, 3002, dan 5173..." -ForegroundColor Cyan
    $ports = @(3001, 3002, 5173)
    foreach ($p in $ports) {
        $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($pidToKill in $conns) {
            try {
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
                Write-Host "   - Menghentikan proses PID $pidToKill di port $p" -ForegroundColor DarkGray
            } catch {}
        }
    }
}

# 1. Jalankan Backend Node.js
$backendPath = Join-Path $scriptDir "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; Write-Host 'Menjalankan Backend Node.js (LUNA API)...' -ForegroundColor Cyan; node server.js"

# 2. Jalankan Frontend Vite
$frontendPath = Join-Path $scriptDir "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; Write-Host 'Menjalankan Frontend React (Vite)...' -ForegroundColor Green; npm run dev"

Write-Host "`nKedua server telah dijalankan di jendela terpisah!" -ForegroundColor Green
Write-Host "-> Frontend React (Vite): http://localhost:5173" -ForegroundColor Cyan
Write-Host "-> Backend Node.js API:   http://localhost:3001" -ForegroundColor Yellow
Write-Host "`nBuka browser Anda di: http://localhost:5173" -ForegroundColor White
