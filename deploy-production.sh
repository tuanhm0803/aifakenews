#!/bin/bash

# Production Deployment Script for Hostinger VPS
# Run this script on your VPS server

set -e

echo "🚀 Starting AI Fake News deployment to production..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root or with sudo${NC}"
    exit 1
fi

# 1. Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt-get update
apt-get upgrade -y

# 2. Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# 3. Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}🐳 Installing Docker Compose...${NC}"
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
fi

# 4. Create application directory
APP_DIR="/opt/aifakenews"
echo -e "${YELLOW}📁 Creating application directory at ${APP_DIR}...${NC}"
mkdir -p ${APP_DIR}
cd ${APP_DIR}

# 5. Clone or update repository
if [ -d ".git" ]; then
    echo -e "${YELLOW}🔄 Updating existing repository...${NC}"
    git pull
else
    echo -e "${YELLOW}📥 Cloning repository...${NC}"
    echo -e "${RED}⚠️  Please upload your code manually or set up git repository${NC}"
    echo "For now, please upload these files to ${APP_DIR}:"
    echo "  - docker-compose.prod.yml"
    echo "  - .env.production (rename to .env)"
    echo "  - backend/ directory"
    echo "  - frontend/ directory"
    echo ""
    read -p "Press Enter after uploading files..."
fi

# 6. Check if .env exists
if [ ! -f ".env" ]; then
    if [ -f ".env.production" ]; then
        echo -e "${YELLOW}📝 Creating .env from .env.production...${NC}"
        cp .env.production .env
    else
        echo -e "${RED}❌ .env file not found! Please create it with your configuration.${NC}"
        exit 1
    fi
fi

# 7. Verify .env has required values
echo -e "${YELLOW}🔍 Verifying .env configuration...${NC}"
if grep -q "CHANGE_THIS" .env || grep -q "your_gemini_api_key_here" .env; then
    echo -e "${RED}❌ Please update .env file with actual values:${NC}"
    echo "  - POSTGRES_PASSWORD"
    echo "  - GEMINI_API_KEY"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# 8. Create nginx SSL directory
echo -e "${YELLOW}📁 Creating SSL directory...${NC}"
mkdir -p nginx/ssl

# 9. Setup SSL with Let's Encrypt (Certbot)
echo -e "${YELLOW}🔒 Setting up SSL certificate...${NC}"
if [ ! -f "nginx/ssl/fullchain.pem" ]; then
    # Install certbot
    apt-get install -y certbot
    
    # Get domain and email from .env (trim whitespace and quotes)
    DOMAIN=$(grep "^DOMAIN=" .env | cut -d '=' -f2 | tr -d ' \r\n"'"'"'')
    SSL_EMAIL=$(grep "^SSL_EMAIL=" .env | cut -d '=' -f2 | tr -d ' \r\n"'"'"'')
    
    if [ -z "$DOMAIN" ]; then
        echo -e "${RED}❌ DOMAIN not set in .env file${NC}"
        exit 1
    fi
    
    if [ -z "$SSL_EMAIL" ] || [ "$SSL_EMAIL" == "your-email@example.com" ]; then
        echo -e "${YELLOW}⚠️  SSL_EMAIL not properly set in .env file${NC}"
        echo "Please enter your email address for SSL certificate registration:"
        read -p "Email: " SSL_EMAIL
        SSL_EMAIL=$(echo "$SSL_EMAIL" | tr -d ' \r\n"'"'"'')
    fi
    
    echo -e "${GREEN}📧 Using email: ${SSL_EMAIL}${NC}"
    echo -e "${GREEN}🌐 Using domain: ${DOMAIN}${NC}"
    
    echo -e "${YELLOW}🌐 Obtaining SSL certificate for ${DOMAIN}...${NC}"
    certbot certonly --standalone --preferred-challenges http \
        -d ${DOMAIN} -d www.${DOMAIN} \
        --non-interactive --agree-tos \
        --email ${SSL_EMAIL}
    
    # Copy certificates to nginx directory
    cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem nginx/ssl/
    cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem nginx/ssl/
    
    # Setup auto-renewal
    echo "0 0 * * * certbot renew --quiet && cp /etc/letsencrypt/live/${DOMAIN}/*.pem ${APP_DIR}/nginx/ssl/ && docker-compose -f ${APP_DIR}/docker-compose.prod.yml restart frontend" | crontab -
else
    echo -e "${GREEN}✅ SSL certificates already exist${NC}"
fi

# 10. Copy production nginx config
if [ -f "nginx/nginx-prod.conf" ]; then
    cp nginx/nginx-prod.conf nginx/nginx.conf
fi

# 11. Build Docker images
echo -e "${YELLOW}🏗️  Building Docker images...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache

# 12. Stop existing containers if running
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# 13. Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# 14. Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# 15. Check services status
echo -e "${YELLOW}📊 Checking services status...${NC}"
docker-compose -f docker-compose.prod.yml ps

# 16. Show logs
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${GREEN}🎉 Your website should now be accessible at:${NC}"
echo -e "${GREEN}   https://aifakenews.cloud${NC}"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo "  View logs:        docker-compose -f docker-compose.prod.yml logs -f"
echo "  Restart services: docker-compose -f docker-compose.prod.yml restart"
echo "  Stop services:    docker-compose -f docker-compose.prod.yml down"
echo "  Update & restart: cd ${APP_DIR} && git pull && docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
echo -e "${YELLOW}🔍 Check backend logs for any errors:${NC}"
docker-compose -f docker-compose.prod.yml logs backend --tail=20
