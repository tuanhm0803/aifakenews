# 🐳 Docker Setup - AI Fake News Website

## What You'll Get

Running this with Docker gives you:
- ✅ PostgreSQL database (automatic setup)
- ✅ FastAPI backend (automatic setup)
- ✅ React frontend (automatic setup)
- ✅ All services networked together
- ✅ Data persistence with Docker volumes
- ✅ No manual dependency installation needed!

## Prerequisites

1. **Docker Desktop for Windows**
   - Download: https://www.docker.com/products/docker-desktop/
   - Install and start Docker Desktop
   - Verify: Open PowerShell and run `docker --version`

2. **Gemini API Key (Free)**
   - Get yours: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"

## Quick Start (3 Easy Steps)

### Step 1: Configure API Key

```powershell
# Copy the environment template
copy .env.docker .env

# Edit with your API key
notepad .env
```

Add your actual Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
AI_PROVIDER=gemini
```

### Step 2: Start Everything

**Option A - Using Script (Easiest):**
```powershell
.\start-docker.ps1
```

**Option B - Manual Command:**
```powershell
docker-compose up --build -d
```

### Step 3: Open Your Browser

- **Website**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

**Wait ~30 seconds** for all services to start completely.

## What's Running?

```
┌─────────────────────────────────────────┐
│         http://localhost:3000           │
│         (React Frontend)                │
└─────────────────┬───────────────────────┘
                  │
                  │ Nginx serves frontend
                  │ Proxies /api to backend
                  ▼
┌─────────────────────────────────────────┐
│         http://localhost:8000           │
│         (FastAPI Backend)               │
└─────────────────┬───────────────────────┘
                  │
                  │ SQLAlchemy ORM
                  │ AI News Generation
                  ▼
┌─────────────────────────────────────────┐
│         PostgreSQL Database             │
│         Port: 5432                      │
│         Database: aifakenews            │
└─────────────────────────────────────────┘
```

## Common Commands

### View Running Containers
```powershell
docker-compose ps
```

### View Logs (All Services)
```powershell
docker-compose logs -f
```

### View Specific Service Logs
```powershell
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop All Services
```powershell
# Using script
.\stop-docker.ps1

# Or manual
docker-compose down
```

### Restart a Service
```powershell
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild Everything
```powershell
docker-compose up --build --force-recreate
```

## Development Mode

For development with hot-reload:

```powershell
# Start in development mode
docker-compose -f docker-compose.dev.yml up --build

# Your code changes will automatically reload!
```

Features:
- ✅ Frontend hot-reload (Vite)
- ✅ Backend hot-reload (Uvicorn --reload)
- ✅ Source code mounted as volumes

## Troubleshooting

### "Port already in use"

If ports 3000, 8000, or 5432 are in use:

```powershell
# Find what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :5432

# Kill the process (replace PID with actual number)
taskkill /PID 1234 /F
```

### "Cannot connect to Docker daemon"

1. Make sure Docker Desktop is running
2. Check system tray for Docker icon
3. Right-click and ensure it says "Docker is running"

### Database Connection Failed

```powershell
# Check if PostgreSQL is ready
docker-compose logs postgres

# Should see: "database system is ready to accept connections"

# If not, wait a bit longer or restart
docker-compose restart postgres
```

### Backend Shows Errors

```powershell
# Check backend logs
docker-compose logs backend

# Common issues:
# - Missing API key in .env
# - Database not ready (wait 30 seconds)
# - Port 8000 already in use
```

### Frontend Shows 502 Error

This means backend isn't responding:

```powershell
# Check if backend is running
docker-compose ps

# Restart backend
docker-compose restart backend

# Check logs
docker-compose logs backend
```

### Clear Everything and Start Fresh

```powershell
# Stop and remove everything
docker-compose down -v

# Remove all Docker images for this project
docker-compose down --rmi all

# Start fresh
docker-compose up --build
```

## Database Management

### Access Database Directly
```powershell
docker-compose exec postgres psql -U postgres -d aifakenews

# Then you can run SQL:
# \dt              -- List tables
# SELECT * FROM news_articles LIMIT 5;
# \q               -- Exit
```

### Backup Database
```powershell
docker-compose exec postgres pg_dump -U postgres aifakenews > backup.sql
```

### Restore Database
```powershell
docker-compose exec -T postgres psql -U postgres aifakenews < backup.sql
```

### Reset Database
```powershell
# Stop services
docker-compose down

# Remove volume
docker volume rm aifakenews_postgres_data

# Start again (creates fresh database)
docker-compose up -d
```

## Advanced

### Run Commands in Containers

**Backend:**
```powershell
# Open bash shell
docker-compose exec backend bash

# Run Python command
docker-compose exec backend python -c "print('Hello')"

# Install additional package
docker-compose exec backend pip install some-package
```

**Frontend:**
```powershell
# Install npm package
docker-compose exec frontend npm install some-package

# Run npm command
docker-compose exec frontend npm run build
```

**Database:**
```powershell
# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d aifakenews

# List databases
docker-compose exec postgres psql -U postgres -c "\l"
```

### Check Resource Usage
```powershell
docker stats
```

### View Image Sizes
```powershell
docker images | findstr aifakenews
```

## Production Deployment

### Build Production Images

```powershell
# Build images
docker-compose build

# Tag for registry
docker tag aifakenews-backend yourusername/aifakenews-backend:v1
docker tag aifakenews-frontend yourusername/aifakenews-frontend:v1

# Push to Docker Hub
docker push yourusername/aifakenews-backend:v1
docker push yourusername/aifakenews-frontend:v1
```

### Deploy to Cloud

**Option 1: AWS ECS**
- Upload images to ECR
- Create ECS task definitions
- Deploy services

**Option 2: Azure Container Instances**
- Push images to ACR
- Deploy container groups

**Option 3: Google Cloud Run**
- Push images to GCR
- Deploy services

**Option 4: DigitalOcean App Platform**
- Connect GitHub repo
- Configure with docker-compose.yml

## Environment Variables

All configurable in `.env` file:

```env
# Required
GEMINI_API_KEY=your_key_here

# Optional
OPENAI_API_KEY=your_openai_key
AI_PROVIDER=gemini

# Database (auto-configured)
POSTGRES_DB=aifakenews
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
```

## File Structure

```
AIFakenews/
├── docker-compose.yml          # Production config
├── docker-compose.dev.yml      # Development config
├── .env                        # Your environment variables
├── start-docker.ps1            # Easy start script
├── stop-docker.ps1             # Easy stop script
├── backend/
│   ├── Dockerfile             # Backend container
│   └── .dockerignore          # Excluded files
└── frontend/
    ├── Dockerfile             # Frontend container
    ├── .dockerignore          # Excluded files
    └── nginx.conf             # Nginx configuration
```

## Tips

1. **First run takes longer** - Docker downloads images and builds containers
2. **Subsequent runs are fast** - Docker uses cached layers
3. **Use -d flag** - Run in background: `docker-compose up -d`
4. **Always check logs** - If something fails: `docker-compose logs`
5. **Clean up regularly** - Remove unused images: `docker system prune`

## Why Docker?

✅ **No manual setup** - No PostgreSQL, Python, or Node.js installation needed  
✅ **Consistent environment** - Works the same on any machine  
✅ **Easy cleanup** - Remove everything with one command  
✅ **Isolated** - Doesn't affect your system  
✅ **Production-ready** - Same containers work in production  

## Need Help?

Check the logs first:
```powershell
docker-compose logs -f
```

Common patterns:
- **Backend crashes**: Check `GEMINI_API_KEY` in `.env`
- **Frontend 502**: Backend not ready, wait 30 seconds
- **Database errors**: PostgreSQL still starting, wait a bit
- **Port conflicts**: Another service using the port

Still stuck? Check [DOCKER.md](DOCKER.md) for comprehensive documentation.

---

**Happy Dockerizing! 🐳📰**
