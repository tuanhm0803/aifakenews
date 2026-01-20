# AI Fake News - Docker Quick Start Script
# Run this script to start the entire application with Docker

Write-Host "🐳 Starting AI Fake News Website with Docker..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-Not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.docker" ".env"
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Please edit .env file and add your GEMINI_API_KEY" -ForegroundColor Red
    Write-Host "Get your free API key from: https://makersuite.google.com/app/apikey" -ForegroundColor Cyan
    Write-Host ""
    $continue = Read-Host "Have you added your API key? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Please add your API key to .env file and run this script again" -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "🚀 Building and starting all containers..." -ForegroundColor Cyan
Write-Host ""

# Stop any existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Build and start containers
Write-Host ""
Write-Host "Building images and starting services..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run..." -ForegroundColor Gray
Write-Host ""

docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ All services started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Application URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend:   http://localhost:8000" -ForegroundColor White
    Write-Host "   API Docs:  http://localhost:8000/docs" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 View logs with:" -ForegroundColor Yellow
    Write-Host "   docker-compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 Stop services with:" -ForegroundColor Yellow
    Write-Host "   docker-compose down" -ForegroundColor White
    Write-Host ""
    Write-Host "⏳ Please wait ~30 seconds for all services to fully start..." -ForegroundColor Gray
    Write-Host ""
    
    # Wait a bit and show status
    Start-Sleep -Seconds 5
    Write-Host "Container Status:" -ForegroundColor Cyan
    docker-compose ps
    
} else {
    Write-Host ""
    Write-Host "❌ Failed to start services!" -ForegroundColor Red
    Write-Host "Check logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}
