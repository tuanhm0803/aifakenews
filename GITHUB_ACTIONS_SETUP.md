# GitHub Actions CI/CD Setup Guide

## Overview
Automatically deploy your code to VPS when you push to the `main` branch on GitHub.

## Setup Steps

### 1. Setup Git Repository on VPS

SSH into your VPS and initialize git:

```bash
cd /opt/aifakenews

# Initialize git if not already done
git init
git remote add origin https://github.com/tuanhm0803/aifakenews.git
git branch -M main
git pull origin main

# Make deploy script executable
chmod +x deploy-update.sh
```

### 2. Generate SSH Key for GitHub Actions

On your VPS, generate an SSH key for GitHub Actions to use:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key -N ""
```

This creates:
- Private key: `~/.ssh/github_actions_key`
- Public key: `~/.ssh/github_actions_key.pub`

Add the public key to authorized_keys:

```bash
cat ~/.ssh/github_actions_key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

View your private key (you'll need this for GitHub Secrets):

```bash
cat ~/.ssh/github_actions_key
```

Copy the entire output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`).

### 3. Configure GitHub Secrets

Go to your GitHub repository:
1. Click **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `VPS_HOST` | Your VPS IP address | `203.0.113.50` |
| `VPS_USERNAME` | VPS username (usually `root`) | `root` |
| `VPS_SSH_KEY` | Private key from step 2 | (entire key content) |
| `VPS_PORT` | SSH port (usually `22`) | `22` |

### 4. Test the Deployment

Commit and push a small change:

```bash
# On your local machine
git add .
git commit -m "Test GitHub Actions deployment"
git push origin main
```

Watch the deployment:
1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see your workflow running
4. Click on it to see real-time logs

### 5. Verify Deployment on VPS

SSH into your VPS and check:

```bash
cd /opt/aifakenews
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs --tail=50
```

Visit your website: `https://aifakenews.cloud`

## Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`):
- **Triggers**: Automatically on every push to `main` branch
- **Manual trigger**: Can also run manually from GitHub Actions tab
- **Actions performed**:
  1. SSH into your VPS
  2. Pull latest code from GitHub
  3. Rebuild Docker containers
  4. Clean up old Docker images
  5. Show container status

## Troubleshooting

### SSH Connection Failed
- Verify VPS_HOST is the correct IP address
- Verify VPS_PORT (usually 22)
- Check that the SSH key is added to `~/.ssh/authorized_keys` on VPS
- Ensure firewall allows SSH connections

### Permission Denied
- Make sure the VPS_USERNAME is correct (usually `root`)
- Verify the private key in VPS_SSH_KEY secret is complete

### Container Build Failed
- Check the Actions log for specific errors
- SSH into VPS manually and try running:
  ```bash
  cd /opt/aifakenews
  docker-compose -f docker-compose.prod.yml up -d --build
  ```

### .env Not Found
- SSH into VPS and create/verify `.env` file:
  ```bash
  cd /opt/aifakenews
  nano .env
  ```
- Make sure it contains all required variables

## Manual Deployment

If you need to deploy manually without GitHub Actions:

```bash
# SSH into VPS
cd /opt/aifakenews
bash deploy-update.sh
```

## Security Notes

- Never commit `.env` files to GitHub
- Rotate SSH keys regularly
- Keep GitHub secrets secure
- Use strong passwords for all services
- Enable 2FA on GitHub account

## Next Steps

Once working, you can:
- Add automated tests before deployment
- Set up staging environment
- Add deployment notifications (Slack, Email)
- Implement blue-green deployment
- Add health checks after deployment
