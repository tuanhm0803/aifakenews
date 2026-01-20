# 🚀 Production Deployment Guide for Hostinger VPS

## Prerequisites

✅ Domain: aifakenews.cloud (purchased)  
✅ Hostinger VPS with Docker support  
✅ SSH access to your VPS  
✅ Gemini API key (free from https://makersuite.google.com/app/apikey)

## Step-by-Step Deployment

### 1. Connect to Your VPS

Open your terminal/PowerShell and connect via SSH:

```bash
ssh root@your-vps-ip-address
# Or use the credentials provided by Hostinger
```

### 2. Configure Domain DNS (Hostinger Panel)

1. Log into your Hostinger account
2. Go to **Domains** → **aifakenews.cloud** → **DNS/Nameservers**
3. Add these DNS records:

```
Type    Name    Content                 TTL
A       @       your-vps-ip-address     3600
A       www     your-vps-ip-address     3600
```

**Wait 5-15 minutes** for DNS propagation.

### 3. Prepare Files on Your Local Machine

On your Windows machine (current directory):

```powershell
# Create a deployment package
Compress-Archive -Path * -DestinationPath aifakenews-deploy.zip
```

### 4. Upload Files to VPS

**Option A: Using SCP (from PowerShell):**
```powershell
scp aifakenews-deploy.zip root@your-vps-ip:/root/
```

**Option B: Using Hostinger File Manager:**
1. Log into Hostinger panel
2. Go to File Manager
3. Upload the zip file
4. Extract it in `/opt/aifakenews`

**Option C: Using Git (Recommended for updates):**

First, push your code to GitHub:
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/aifakenews.git
git push -u origin main
```

Then on VPS:
```bash
cd /opt
git clone https://github.com/yourusername/aifakenews.git aifakenews
cd aifakenews
```

### 5. Configure Environment Variables (On VPS)

```bash
cd /opt/aifakenews

# Copy production template
cp .env.production .env

# Edit with your values
nano .env
```

Update these values:
```env
POSTGRES_PASSWORD=YourStrong_Database_Password_123!
GEMINI_API_KEY=your_actual_gemini_api_key
DOMAIN=aifakenews.cloud
```

Save: `Ctrl+O`, Enter, Exit: `Ctrl+X`

### 6. Run Deployment Script (On VPS)

```bash
# Make script executable
chmod +x deploy-production.sh

# Run deployment
./deploy-production.sh
```

The script will:
- ✅ Install Docker & Docker Compose
- ✅ Setup SSL certificates (Let's Encrypt)
- ✅ Build Docker images
- ✅ Start all services
- ✅ Configure auto-renewal for SSL

### 7. Verify Deployment

Check services are running:
```bash
docker-compose -f docker-compose.prod.yml ps
```

Should show:
```
aifakenews-postgres-prod   Up (healthy)
aifakenews-backend-prod    Up
aifakenews-frontend-prod   Up
```

Check logs:
```bash
# All logs
docker-compose -f docker-compose.prod.yml logs -f

# Backend only
docker-compose -f docker-compose.prod.yml logs backend -f
```

### 8. Test Your Website

Open in browser:
- **https://aifakenews.cloud** (should work with SSL ✅)
- **http://aifakenews.cloud** (should redirect to HTTPS)

## Alternative: Manual Deployment

If the script doesn't work, follow these manual steps:

### Step 1: Install Docker (On VPS)

```bash
# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Setup SSL Certificate

```bash
# Install Certbot
apt-get install -y certbot

# Stop any service on port 80
docker-compose down 2>/dev/null || true

# Get certificate
certbot certonly --standalone \
  -d aifakenews.cloud \
  -d www.aifakenews.cloud \
  --non-interactive --agree-tos \
  --email your-email@example.com

# Copy certificates
mkdir -p /opt/aifakenews/nginx/ssl
cp /etc/letsencrypt/live/aifakenews.cloud/fullchain.pem /opt/aifakenews/nginx/ssl/
cp /etc/letsencrypt/live/aifakenews.cloud/privkey.pem /opt/aifakenews/nginx/ssl/

# Setup auto-renewal
echo "0 0 * * * certbot renew --quiet && cp /etc/letsencrypt/live/aifakenews.cloud/*.pem /opt/aifakenews/nginx/ssl/ && docker-compose -f /opt/aifakenews/docker-compose.prod.yml restart frontend" | crontab -
```

### Step 3: Deploy Application

```bash
cd /opt/aifakenews

# Copy production nginx config
cp nginx/nginx-prod.conf nginx/nginx.conf

# Build and start
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## Hostinger-Specific Instructions

### Access Your VPS

1. Log into Hostinger panel
2. Go to **VPS** → Your VPS
3. Click **Access Details** to get:
   - IP Address
   - Root password
   - SSH port (usually 22)

### Using Hostinger's VPS Browser Terminal

1. In Hostinger panel, go to your VPS
2. Click **Browser Terminal**
3. Run commands directly without SSH client

### Firewall Configuration (Hostinger)

Ensure these ports are open:
- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 22 (SSH)

In Hostinger panel:
1. Go to **VPS** → **Firewall**
2. Add rules for ports 80 and 443

## Post-Deployment Tasks

### 1. Setup Automatic Backups

```bash
# Create backup script
cat > /opt/backup-aifakenews.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# Backup database
docker exec aifakenews-postgres-prod pg_dump -U postgres aifakenews > $BACKUP_DIR/db_backup_$DATE.sql

# Backup environment
cp /opt/aifakenews/.env $BACKUP_DIR/env_backup_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /opt/backup-aifakenews.sh

# Schedule daily backup at 2 AM
echo "0 2 * * * /opt/backup-aifakenews.sh" | crontab -
```

### 2. Setup Monitoring

```bash
# Install monitoring script
cat > /opt/monitor-aifakenews.sh << 'EOF'
#!/bin/bash
cd /opt/aifakenews

# Check if containers are running
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "Services are down! Restarting..."
    docker-compose -f docker-compose.prod.yml up -d
    echo "Services restarted at $(date)" >> /var/log/aifakenews-monitor.log
fi
EOF

chmod +x /opt/monitor-aifakenews.sh

# Check every 5 minutes
echo "*/5 * * * * /opt/monitor-aifakenews.sh" | crontab -
```

### 3. Update Application

When you make changes:

```bash
cd /opt/aifakenews

# If using Git
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## Useful Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check resource usage
docker stats

# Clean up old images
docker system prune -a

# Database backup
docker exec aifakenews-postgres-prod pg_dump -U postgres aifakenews > backup.sql

# Database restore
docker exec -i aifakenews-postgres-prod psql -U postgres aifakenews < backup.sql
```

## Troubleshooting

### SSL Certificate Issues

```bash
# Test SSL
curl -I https://aifakenews.cloud

# Renew certificate manually
certbot renew
cp /etc/letsencrypt/live/aifakenews.cloud/*.pem /opt/aifakenews/nginx/ssl/
docker-compose -f docker-compose.prod.yml restart frontend
```

### Services Not Starting

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check system resources
df -h  # Disk space
free -m  # Memory
```

### DNS Not Resolving

```bash
# Check DNS propagation
nslookup aifakenews.cloud

# Check from different location
dig aifakenews.cloud
```

### Database Connection Issues

```bash
# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Connect to database
docker exec -it aifakenews-postgres-prod psql -U postgres -d aifakenews
```

## Security Checklist

✅ Strong database password in `.env`  
✅ SSL certificate installed  
✅ Firewall configured (ports 80, 443, 22 only)  
✅ SSH key authentication enabled (disable password auth)  
✅ Regular backups scheduled  
✅ Monitoring script active  
✅ Keep system updated: `apt-get update && apt-get upgrade`

## Performance Optimization

### 1. Enable Nginx Caching

Already configured in `nginx-prod.conf`:
- Static assets cached for 1 year
- Gzip compression enabled

### 2. Database Optimization

Add to PostgreSQL config if needed:
```bash
docker exec -it aifakenews-postgres-prod psql -U postgres -d aifakenews
# Run: VACUUM ANALYZE;
```

### 3. Monitor Resources

```bash
# Check container stats
docker stats --no-stream

# If VPS is slow, upgrade plan in Hostinger panel
```

## Cost Estimate (Hostinger)

- **VPS Hosting**: ~$4-8/month (KVM 1 or 2)
- **Domain**: ~$10/year (already purchased)
- **SSL Certificate**: FREE (Let's Encrypt)
- **Total**: ~$5-10/month

## Support

If you encounter issues:
1. Check logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Verify DNS: `nslookup aifakenews.cloud`
3. Check SSL: `curl -I https://aifakenews.cloud`
4. Contact Hostinger support for VPS-specific issues

---

**Your AI Fake News website will be live at https://aifakenews.cloud! 🎉**
