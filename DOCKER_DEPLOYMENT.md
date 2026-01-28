# Docker Deployment Guide with Authentication

## 🐳 Local Development with Docker

### Prerequisites
- Docker and Docker Compose installed
- API keys (Gemini or OpenAI)

### Quick Start

1. **Create environment file:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your API keys
```

2. **Start all services:**
```bash
docker-compose up -d
```

3. **Check logs:**
```bash
docker-compose logs -f backend
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

5. **Demo users are automatically created:**
- Admin: `admin` / `admin123`
- Author: `author` / `author123`
- Viewer: `viewer` / `viewer123`

### Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# View logs
docker-compose logs -f

# Access backend shell
docker exec -it aifakenews-backend bash

# Run database migrations manually
docker exec -it aifakenews-backend python -c "from database import engine; import models; models.Base.metadata.create_all(bind=engine)"

# Seed users manually
docker exec -it aifakenews-backend python seed_users.py
```

---

## 🚀 Production Deployment (VPS)

### Prerequisites on VPS
- Docker and Docker Compose installed
- Domain name pointed to your VPS IP
- SSL certificate (Let's Encrypt recommended)

### Step 1: Prepare Environment

1. **Clone repository on VPS:**
```bash
git clone https://github.com/yourusername/AIFakenews.git
cd AIFakenews
```

2. **Create production environment file:**
```bash
cp .env.prod.example .env.prod
```

3. **Edit .env.prod with secure values:**
```bash
nano .env.prod
```

Required changes:
```bash
# Strong PostgreSQL password
POSTGRES_PASSWORD=your_super_secure_password_here

# Your AI API key
GEMINI_API_KEY=your_actual_api_key

# CRITICAL: Generate a secure JWT secret
# Generate with: openssl rand -hex 32
JWT_SECRET_KEY=your_32_char_random_hex_string_here
```

### Step 2: Generate JWT Secret Key

**Important**: Generate a secure random key:
```bash
openssl rand -hex 32
```
Copy this value to `JWT_SECRET_KEY` in `.env.prod`

### Step 3: Setup SSL (Optional but Recommended)

1. **Install Certbot:**
```bash
sudo apt install certbot
```

2. **Get SSL certificate:**
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

3. **Copy certificates:**
```bash
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/
```

### Step 4: Deploy

1. **Start production services:**
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

2. **Check logs:**
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

3. **Verify services:**
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Step 5: Verify Deployment

1. **Check backend health:**
```bash
curl http://localhost:8000/
```

2. **Check if demo users were created:**
```bash
docker-compose -f docker-compose.prod.yml logs backend | grep "Demo users"
```

3. **Access your site:**
- Frontend: https://yourdomain.com
- Backend API: https://yourdomain.com/api
- API Docs: https://yourdomain.com/docs

### Production Commands

```bash
# Start production
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Stop production
docker-compose -f docker-compose.prod.yml down

# Update and rebuild
git pull
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Backup database
docker exec aifakenews-postgres-prod pg_dump -U postgres aifakenews > backup.sql

# Restore database
docker exec -i aifakenews-postgres-prod psql -U postgres aifakenews < backup.sql
```

---

## 🔐 Security Checklist for Production

### Critical Security Items

- [ ] **Change JWT Secret Key** - Use `openssl rand -hex 32`
- [ ] **Change Database Password** - Use strong password
- [ ] **Setup SSL/TLS** - Use Let's Encrypt
- [ ] **Configure Firewall** - Only expose ports 80 and 443
- [ ] **Update CORS Origins** - Restrict to your domain in `backend/main.py`
- [ ] **Environment Variables** - Never commit `.env.prod` to git
- [ ] **Regular Backups** - Setup automated database backups
- [ ] **Update Dependencies** - Keep Docker images and packages updated

### Update CORS in Production

Edit `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Your production domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🔄 Update Procedure (Zero Downtime)

1. **Pull latest code:**
```bash
cd AIFakenews
git pull
```

2. **Rebuild and restart:**
```bash
# Local
docker-compose up -d --build

# Production
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

The entrypoint script will:
- ✅ Wait for PostgreSQL to be ready
- ✅ Create/update database tables
- ✅ Seed demo users (if not exists)
- ✅ Start the application

---

## 🧪 Testing Authentication

### Local Testing
```bash
# Test login
curl -X POST http://localhost:8000/api/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test protected endpoint (replace TOKEN with actual token)
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Production Testing
```bash
# Test login
curl -X POST https://yourdomain.com/api/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📊 Monitoring

### Check Service Status
```bash
docker-compose ps
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f frontend
```

### Database Access
```bash
# Connect to PostgreSQL
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews

# List users
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews -c "SELECT username, role, email FROM users;"
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Database not ready - Wait a bit longer
# 2. Missing dependencies - Rebuild: docker-compose up -d --build
# 3. Port conflict - Change port in docker-compose.yml
```

### Database connection errors
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Users not created
```bash
# Run seed script manually
docker exec -it aifakenews-backend python seed_users.py

# Check if users exist
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews -c "SELECT * FROM users;"
```

### Permission denied on entrypoint.sh
```bash
# Make script executable
chmod +x backend/entrypoint.sh

# Rebuild
docker-compose up -d --build
```

---

## 📝 Environment Variables Reference

### Local (.env)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| GEMINI_API_KEY | Yes | - | Google Gemini API key |
| OPENAI_API_KEY | No | - | OpenAI API key |
| AI_PROVIDER | No | gemini | AI provider (gemini/openai) |
| JWT_SECRET_KEY | No | dev-secret-* | JWT signing key (auto-generated for dev) |

### Production (.env.prod)
| Variable | Required | Description |
|----------|----------|-------------|
| POSTGRES_DB | Yes | Database name |
| POSTGRES_USER | Yes | Database user |
| POSTGRES_PASSWORD | **Yes** | Strong database password |
| GEMINI_API_KEY | Yes | Google Gemini API key |
| JWT_SECRET_KEY | **Yes** | Secure random JWT secret |
| JWT_ALGORITHM | No | JWT algorithm (default: HS256) |
| ACCESS_TOKEN_EXPIRE_MINUTES | No | Token expiry (default: 10080 = 7 days) |

---

## 🎯 Quick Reference

### Local Development
```bash
docker-compose up -d           # Start
docker-compose down            # Stop
docker-compose logs -f backend # Logs
```

### Production
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d    # Start
docker-compose -f docker-compose.prod.yml down                          # Stop
docker-compose -f docker-compose.prod.yml logs -f backend              # Logs
```

### Demo Accounts (Auto-created)
- Admin: `admin` / `admin123` - Can generate news
- Author: `author` / `author123` - Can generate news
- Viewer: `viewer` / `viewer123` - View only

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Let's Encrypt](https://letsencrypt.org/)
