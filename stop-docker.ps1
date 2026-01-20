# AI Fake News - Docker Stop Script
# Run this script to stop all Docker containers

Write-Host "🛑 Stopping AI Fake News Website containers..." -ForegroundColor Cyan
Write-Host ""

docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ All services stopped successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To start again, run: .\start-docker.ps1" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Failed to stop services!" -ForegroundColor Red
}
