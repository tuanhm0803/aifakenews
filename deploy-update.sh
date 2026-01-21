#!/bin/bash

# Quick deployment script for VPS
# This is called by GitHub Actions

set -e

echo "📍 Current directory: $(pwd)"
echo "🔄 Pulling latest changes..."

# Pull latest code
git pull origin main

# Check if .env exists, if not create from .env.production
if [ ! -f ".env" ]; then
    echo "⚠️  .env not found, please configure it manually"
    exit 1
fi

# Rebuild and restart containers
echo "🐳 Rebuilding containers..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Show status
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

echo "✅ Deployment complete!"
