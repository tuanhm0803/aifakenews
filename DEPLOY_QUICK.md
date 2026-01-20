# 🚀 Quick Deployment to Hostinger VPS

## What You Need

1. ✅ Your VPS IP address (from Hostinger panel)
2. ✅ SSH access (root password from Hostinger)
3. ✅ Gemini API key (get free at: https://makersuite.google.com/app/apikey)

## 3-Step Deployment

### Step 1: Upload Files to VPS

**Option A - Using PowerShell (Windows):**

```powershell
# Create deployment package
Compress-Archive -Path docker-compose.prod.yml,.env.production,deploy-production.sh,backend,frontend,nginx -DestinationPath aifakenews.zip

# Upload to VPS (replace YOUR_VPS_IP)
scp aifakenews.zip root@YOUR_VPS_IP:/root/

# Connect to VPS
ssh root@YOUR_VPS_IP

# Extract files
cd /opt
unzip /root/aifakenews.zip -d aifakenews
cd aifakenews
```

**Option B - Using Hostinger File Manager:**

1. Compress: backend, frontend, nginx folders + docker-compose.prod.yml, .env.production, deploy-production.sh
2. Login to Hostinger → File Manager
3. Upload zip to `/opt/aifakenews/`
4. Extract files
5. Use Browser Terminal in Hostinger

### Step 2: Configure & Deploy

In VPS terminal (SSH or Hostinger Browser Terminal):

```bash
cd /opt/aifakenews

# Setup environment
cp .env.production .env
nano .env
# Update: POSTGRES_PASSWORD, GEMINI_API_KEY
# Save: Ctrl+O, Enter, Exit: Ctrl+X

# Run deployment
chmod +x deploy-production.sh
sudo ./deploy-production.sh
```

### Step 3: Configure Domain DNS

In Hostinger panel (Domains → aifakenews.cloud → DNS):

```
Type    Name    Content         
A       @       YOUR_VPS_IP     
A       www     YOUR_VPS_IP     
```

Wait 5-15 minutes for DNS propagation.

## Verify Deployment

```bash
# Check services
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

Visit: **https://aifakenews.cloud** 🎉

## Need Help?

See full guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## Quick Commands

```bash
# Restart
docker-compose -f docker-compose.prod.yml restart

# View logs
docker-compose -f docker-compose.prod.yml logs backend -f

# Stop
docker-compose -f docker-compose.prod.yml down
```
