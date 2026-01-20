# Prepare Deployment Package for Hostinger VPS
# Run this script to create a deployment package

Write-Host "📦 Creating deployment package for Hostinger VPS..." -ForegroundColor Cyan
Write-Host ""

# Files and folders to include
$items = @(
    "docker-compose.prod.yml",
    ".env.production",
    "deploy-production.sh",
    "backend",
    "frontend",
    "nginx"
)

# Check if all items exist
$missing = @()
foreach ($item in $items) {
    if (-not (Test-Path $item)) {
        $missing += $item
    }
}

if ($missing.Count -gt 0) {
    Write-Host "❌ Missing required files/folders:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
}

# Create package
$packageName = "aifakenews-deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
Write-Host "Creating package: $packageName" -ForegroundColor Yellow

# Compress files
Compress-Archive -Path $items -DestinationPath $packageName -Force

if (Test-Path $packageName) {
    $size = (Get-Item $packageName).Length / 1MB
    Write-Host ""
    Write-Host "✅ Package created successfully!" -ForegroundColor Green
    Write-Host "   File: $packageName" -ForegroundColor White
    Write-Host "   Size: $([math]::Round($size, 2)) MB" -ForegroundColor White
    Write-Host ""
    Write-Host "📤 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Get your VPS IP from Hostinger panel" -ForegroundColor White
    Write-Host "   2. Upload this file to your VPS:" -ForegroundColor White
    Write-Host "      scp $packageName root@YOUR_VPS_IP:/root/" -ForegroundColor Gray
    Write-Host "   3. SSH to VPS:" -ForegroundColor White
    Write-Host "      ssh root@YOUR_VPS_IP" -ForegroundColor Gray
    Write-Host "   4. Extract and deploy:" -ForegroundColor White
    Write-Host "      cd /opt && unzip /root/$packageName -d aifakenews" -ForegroundColor Gray
    Write-Host "      cd aifakenews && chmod +x deploy-production.sh" -ForegroundColor Gray
    Write-Host "      sudo ./deploy-production.sh" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📖 Full guide: DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
    Write-Host "⚡ Quick guide: DEPLOY_QUICK.md" -ForegroundColor Yellow
} else {
    Write-Host "Failed to create package!" -ForegroundColor Red
    exit 1
}
