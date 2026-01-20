# ✅ Deployment Checklist for aifakenews.cloud

## Before You Start

- [ ] I have my VPS IP address from Hostinger
- [ ] I have SSH root password from Hostinger
- [ ] I have my Gemini API key (from https://makersuite.google.com/app/apikey)
- [ ] File `aifakenews-deploy.zip` is created ✅

## Step 1: Upload Files (Choose ONE method)

### Method A: Using SCP (PowerShell)
```powershell
scp aifakenews-deploy.zip root@72.60.43.33:/root/
```
- [ ] File uploaded successfully

### Method B: Hostinger File Manager
1. [ ] Login to Hostinger panel
2. [ ] Go to File Manager
3. [ ] Upload `aifakenews-deploy.zip` to `/root/`
4. [ ] Extract to `/opt/aifakenews/`

## Step 2: Connect to VPS (Choose ONE method)

### Method A: SSH from PowerShell
```powershell
ssh root@YOUR_VPS_IP
```

### Method B: Hostinger Browser Terminal
1. [ ] Go to Hostinger panel → Your VPS
2. [ ] Click "Browser Terminal"

- [ ] Successfully connected to VPS

## Step 3: Extract and Prepare

```bash
cd /opt
unzip /root/aifakenews-deploy.zip -d aifakenews
cd aifakenews
```

- [ ] Files extracted to `/opt/aifakenews/`

## Step 4: Configure Environment

```bash
cp .env.production .env
nano .env
```

Update these lines:
```env
POSTGRES_PASSWORD=YourStrong_Password_123!
GEMINI_API_KEY=your_actual_gemini_api_key_here
DOMAIN=aifakenews.cloud
```

Save: `Ctrl+O`, Enter, Exit: `Ctrl+X`

- [ ] `.env` file updated with real values

## Step 5: Run Deployment Script

```bash
chmod +x deploy-production.sh
sudo bash deploy-production.sh
```

Wait 5-10 minutes for completion.

- [ ] Script completed without errors
- [ ] All services show "Up" status

## Step 6: Configure DNS (Hostinger Panel)

1. [ ] Login to Hostinger
2. [ ] Go to Domains → aifakenews.cloud → DNS/Nameservers
3. [ ] Add these records:

```
Type    Name    Content (your VPS IP)
A       @       123.456.789.10
A       www     123.456.789.10
```

4. [ ] Save DNS records
5. [ ] Wait 5-15 minutes for propagation

## Step 7: Verify Deployment

### Check Services
```bash
docker-compose -f docker-compose.prod.yml ps
```

Expected output:
```
aifakenews-postgres-prod   Up (healthy)
aifakenews-backend-prod    Up
aifakenews-frontend-prod   Up
```

- [ ] All 3 services are "Up"

### Check Logs
```bash
docker-compose -f docker-compose.prod.yml logs backend --tail=20
```

- [ ] No error messages in logs

### Test Website
1. [ ] Open https://aifakenews.cloud in browser
2. [ ] Website loads correctly
3. [ ] SSL certificate shows as secure (🔒)
4. [ ] Can generate news articles
5. [ ] Navigation works

## Step 8: Security Checklist

- [ ] Strong database password set in `.env`
- [ ] SSL certificate active (HTTPS works)
- [ ] Firewall allows only ports 80, 443, 22
- [ ] Default passwords changed

## Troubleshooting

### If services won't start:
```bash
docker-compose -f docker-compose.prod.yml logs
```

### If DNS not resolving:
```bash
nslookup aifakenews.cloud
# Wait 15-30 minutes if just configured
```

### If SSL not working:
```bash
certbot renew
cp /etc/letsencrypt/live/aifakenews.cloud/*.pem /opt/aifakenews/nginx/ssl/
docker-compose -f docker-compose.prod.yml restart frontend
```

## Common Commands (Save These!)

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop services
docker-compose -f docker-compose.prod.yml down

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Backup database
docker exec aifakenews-postgres-prod pg_dump -U postgres aifakenews > backup.sql
```

## Success Criteria

✅ All services running  
✅ https://aifakenews.cloud loads  
✅ SSL certificate valid  
✅ Can generate news articles  
✅ No errors in logs  

---

**If all items are checked, your deployment is complete! 🎉**

Your website is now live at: **https://aifakenews.cloud**
