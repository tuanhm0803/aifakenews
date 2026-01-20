# Prepare Deployment Package for Hostinger VPS
Write-Host 'Creating deployment package...' -ForegroundColor Cyan

$items = @(
    'docker-compose.prod.yml',
    '.env.production',
    'deploy-production.sh',
    'backend',
    'frontend',
    'nginx'
)

$packageName = 'aifakenews-deploy.zip'
Compress-Archive -Path $items -DestinationPath $packageName -Force

if (Test-Path $packageName) {
    $size = (Get-Item $packageName).Length / 1MB
    Write-Host ''
    Write-Host 'Package created successfully!' -ForegroundColor Green
    Write-Host 'File: '$packageName -ForegroundColor White
    Write-Host 'Size: '[math]::Round($size, 2) 'MB' -ForegroundColor White
    Write-Host ''
    Write-Host 'Next: Upload to your VPS and run deploy-production.sh' -ForegroundColor Yellow
} else {
    Write-Host 'Failed to create package' -ForegroundColor Red
}
