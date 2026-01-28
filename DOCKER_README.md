# 🚀 Docker Deployment - Complete Guide

## 📦 What's New

Your AI Fake News application now has **full authentication** support in Docker deployments:
- ✅ Role-based access control (Admin, Author, Viewer)
- ✅ Auto-seeded demo users
- ✅ Secure JWT authentication
- ✅ Zero-config local development
- ✅ Production-ready deployment

---

## 🏃 Quick Start - Local Development

### 1. Start Services
```bash
# Make sure you have your API key in backend/.env
docker-compose up -d
```

### 2. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 3. Login with Demo Accounts
| Username | Password   | Role   | Can Generate News |
|----------|------------|--------|------------------|
| admin    | admin123   | Admin  | ✅ Yes           |
| author   | author123  | Author | ✅ Yes           |
| viewer   | viewer123  | Viewer | ❌ No            |

**That's it!** Everything is configured automatically. 🎉

---

## 🌐 Production Deployment on VPS

### Prerequisites
- VPS server (Ubuntu/Debian)
- Domain name pointed to your VPS
- Root/sudo access

### Step 1: Prepare Environment File

```bash
# Create production environment file
cp .env.prod.example .env.prod
nano .env.prod
```

**Required changes:**
```bash
# Database - Use a STRONG password!
POSTGRES_PASSWORD=your_super_secure_password_12345

# AI API Key
GEMINI_API_KEY=your_actual_gemini_api_key

# JWT Secret - Will be auto-generated, or generate manually:
# openssl rand -hex 32
JWT_SECRET_KEY=auto_generated_by_deploy_script
```

### Step 2: Deploy

```bash
# Run deployment script
sudo bash deploy-production.sh
```

The script will:
1. ✅ Install Docker & Docker Compose
2. ✅ Auto-generate secure JWT secret key
3. ✅ Setup SSL certificates (if domain configured)
4. ✅ Build and start all services
5. ✅ Create demo user accounts
6. ✅ Start your application

### Step 3: Verify

```bash
# Check services are running
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Test login
curl -X POST https://yourdomain.com/api/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🔐 Security Checklist

### Before Going Live

- [ ] **Change Database Password** - Strong, unique password in .env.prod
- [ ] **Add API Key** - Your actual Gemini/OpenAI key
- [ ] **JWT Secret Generated** - Auto-done by deploy script or `openssl rand -hex 32`
- [ ] **Setup SSL** - Use Let's Encrypt (auto-done by deploy script)
- [ ] **Configure Firewall** - Only allow ports 80, 443, and SSH
- [ ] **Update CORS** - Edit `backend/main.py` to restrict origins
- [ ] **Change Demo Passwords** - Create new admin user, disable defaults

### Update CORS for Production

Edit `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Your domain only!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📋 Common Commands

### Local Development
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild
docker-compose up -d --build

# Access database
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews
```

### Production
```bash
# Start
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Stop
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Update app
git pull
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

---

## 🧪 Testing Authentication

### Test Login API
```bash
# Test admin login
curl -X POST http://localhost:8000/api/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Should return: {"access_token":"...", "token_type":"bearer", "user":{...}}
```

### Test Protected Endpoint
```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.access_token')

# Test news generation (admin/author only)
curl -X POST http://localhost:8000/api/news/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category":"general","include_billionaire":false}'
```

### Verify Users Were Created
```bash
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews -c \
  "SELECT username, role, email FROM users;"
```

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Database not ready → Wait 10-20 seconds, check again
# 2. Missing API key → Add GEMINI_API_KEY to backend/.env
# 3. Port conflict → Change port in docker-compose.yml
```

### Demo Users Not Created
```bash
# Check logs for error
docker-compose logs backend | grep "Demo users"

# Manually create users
docker exec -it aifakenews-backend python seed_users.py

# Verify
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews -c "SELECT * FROM users;"
```

### Can't Login / Token Invalid
```bash
# Check JWT secret is set
docker exec -it aifakenews-backend python -c "from config import get_settings; print(get_settings().jwt_secret_key)"

# Should not be empty or placeholder value

# Restart backend if needed
docker-compose restart backend
```

### Database Connection Errors
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Test connection
docker exec -it aifakenews-backend python -c "from database import engine; engine.connect(); print('Connected!')"
```

---

## 🔄 How It Works

### Automatic Setup Process

When you run `docker-compose up -d`, the backend container:

1. **Waits for PostgreSQL** - Ensures database is ready
2. **Creates Tables** - Auto-creates User and NewsArticle tables
3. **Seeds Demo Users** - Creates admin, author, viewer accounts
4. **Starts FastAPI** - Launches the application

All done via `backend/entrypoint.sh` script.

### Environment Configuration

**Local (`docker-compose.yml`):**
- Uses hardcoded database credentials
- Auto-generates JWT secret for dev
- Mounts code for hot-reload

**Production (`docker-compose.prod.yml`):**
- Reads all values from `.env.prod`
- Requires secure JWT secret
- No code mounting (uses built image)

---

## 📚 Documentation

- **[DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)** - Complete deployment guide with SSL setup
- **[DOCKER_COMMANDS.md](./DOCKER_COMMANDS.md)** - All Docker commands reference
- **[DOCKER_UPDATES.md](./DOCKER_UPDATES.md)** - Summary of what was changed
- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Authentication system details
- **[SETUP_AUTH.md](./SETUP_AUTH.md)** - Manual setup without Docker

---

## 🎯 Key Features

### For Developers
- ✅ One command to start: `docker-compose up -d`
- ✅ Hot-reload enabled in dev mode
- ✅ No manual database setup needed
- ✅ Demo users pre-created
- ✅ All dependencies in containers

### For Production
- ✅ Secure JWT with auto-generation
- ✅ Environment-based configuration
- ✅ SSL/TLS support
- ✅ Database persistence
- ✅ Easy updates via git pull

### Authentication Features
- ✅ Role-based access control
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ 7-day token expiry (configurable)
- ✅ Protected API endpoints

---

## 💡 Tips

### Development
- Use `docker-compose logs -f` to watch logs in real-time
- Code changes are reflected immediately (hot-reload)
- Database data persists in Docker volume
- Access API docs at http://localhost:8000/docs

### Production
- Always use SSL/HTTPS
- Generate strong JWT secret: `openssl rand -hex 32`
- Setup automated backups for PostgreSQL
- Monitor logs: `docker-compose -f docker-compose.prod.yml logs -f`
- Use environment variables for sensitive data

### Security
- Change demo user passwords after deployment
- Restrict CORS origins to your domain only
- Use strong database password
- Keep JWT secret secure (never commit to git)
- Regular security updates: `docker-compose pull && docker-compose up -d`

---

## 🆘 Need Help?

### Check Logs
```bash
# All services
docker-compose logs

# Specific service with tail
docker-compose logs --tail=50 backend
```

### Get Service Status
```bash
docker-compose ps
```

### Access Container Shell
```bash
docker exec -it aifakenews-backend bash
```

### Reset Everything (CAREFUL - Deletes data!)
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## 📈 Monitoring

### Check Resource Usage
```bash
docker stats
```

### Database Size
```bash
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews -c \
  "SELECT pg_size_pretty(pg_database_size('aifakenews'));"
```

### User Statistics
```bash
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews -c \
  "SELECT role, COUNT(*) FROM users GROUP BY role;"
```

---

## 🎉 You're All Set!

Your Docker deployment now includes:
- ✅ Complete authentication system
- ✅ Role-based access control
- ✅ Auto-configured demo users
- ✅ Production-ready security
- ✅ Zero-config local development

Just run `docker-compose up -d` and start building! 🚀

**Demo Accounts:**
- **Admin**: admin / admin123 → Can generate news
- **Author**: author / author123 → Can generate news  
- **Viewer**: viewer / viewer123 → View only

**Access URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
