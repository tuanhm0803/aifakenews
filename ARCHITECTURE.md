# AI Fake News Website - Architecture

## Docker Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                          DOCKER HOST                                │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              aifakenews-network (Bridge)                    │   │
│  │                                                              │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  Container: aifakenews-frontend                       │  │   │
│  │  │  Image: nginx:alpine                                  │  │   │
│  │  │  ┌────────────────────────────────────────────────┐  │  │   │
│  │  │  │  Nginx (Port 80)                                │  │  │   │
│  │  │  │  - Serves React build                           │  │  │   │
│  │  │  │  - Proxies /api → backend:8000                  │  │  │   │
│  │  │  └────────────────────────────────────────────────┘  │  │   │
│  │  │  Exposed: 3000:80                                     │  │   │
│  │  └──────────────────────────┬───────────────────────────┘  │   │
│  │                              │                               │   │
│  │                              │ HTTP proxy                    │   │
│  │                              ▼                               │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  Container: aifakenews-backend                        │  │   │
│  │  │  Image: python:3.11-slim                              │  │   │
│  │  │  ┌────────────────────────────────────────────────┐  │  │   │
│  │  │  │  FastAPI (Port 8000)                            │  │  │   │
│  │  │  │  - REST API endpoints                           │  │  │   │
│  │  │  │  - AI news generation                           │  │  │   │
│  │  │  │  - Daily scheduler (APScheduler)                │  │  │   │
│  │  │  │  - SQLAlchemy ORM                               │  │  │   │
│  │  │  └────────────────────────────────────────────────┘  │  │   │
│  │  │  Exposed: 8000:8000                                   │  │   │
│  │  │  Environment:                                          │  │   │
│  │  │  - GEMINI_API_KEY                                     │  │   │
│  │  │  - DATABASE_URL                                       │  │   │
│  │  └──────────────────────────┬───────────────────────────┘  │   │
│  │                              │                               │   │
│  │                              │ PostgreSQL protocol           │   │
│  │                              ▼                               │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  Container: aifakenews-postgres                       │  │   │
│  │  │  Image: postgres:15-alpine                            │  │   │
│  │  │  ┌────────────────────────────────────────────────┐  │  │   │
│  │  │  │  PostgreSQL (Port 5432)                         │  │  │   │
│  │  │  │  - Database: aifakenews                         │  │  │   │
│  │  │  │  - Tables: news_articles                        │  │  │   │
│  │  │  │  - Persistent volume                            │  │  │   │
│  │  │  └────────────────────────────────────────────────┘  │  │   │
│  │  │  Exposed: 5432:5432                                   │  │   │
│  │  │  Volume: postgres_data → /var/lib/postgresql/data    │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Volume: postgres_data                                        │  │
│  │  (Persistent database storage)                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
         │                      │                      │
         │ localhost:3000       │ localhost:8000       │ localhost:5432
         ▼                      ▼                      ▼
     [Browser]              [API Client]         [DB Client]
```

## Data Flow

### 1. User Visits Website
```
Browser → localhost:3000 → Nginx → React App (served as static files)
```

### 2. User Requests News Articles
```
Browser → GET /api/news
    → Nginx (proxy)
    → Backend (localhost:8000/api/news)
    → PostgreSQL (query news_articles table)
    → Returns JSON
    → Browser displays news cards
```

### 3. User Generates New Article
```
Browser → POST /api/news/generate
    → Backend
    → AI Service (Gemini/OpenAI API)
    → Generates fake news
    → Saves to PostgreSQL
    → Returns new article
    → Browser updates display
```

### 4. Daily Scheduler (Automatic)
```
APScheduler (every day at 6 AM)
    → Triggers generate_daily_news()
    → Calls AI Service 5-8 times
    → Creates articles in database
    → No user interaction needed
```

## Technology Stack by Layer

### Frontend Container
```
┌─────────────────────────────────┐
│ Static Files (Built)             │
│  ├── index.html                  │
│  ├── assets/                     │
│  │   ├── index.js (bundled)      │
│  │   └── index.css (bundled)     │
│  └── ...                         │
├─────────────────────────────────┤
│ Nginx Web Server                 │
│  ├── Serves static files         │
│  ├── Proxies API requests        │
│  └── Handles routing             │
└─────────────────────────────────┘

Built from:
- React 18
- Vite (bundler)
- Tailwind CSS
- React Router
- Axios
```

### Backend Container
```
┌─────────────────────────────────┐
│ Python Application               │
│  ├── FastAPI (web framework)     │
│  ├── Uvicorn (ASGI server)       │
│  ├── SQLAlchemy (ORM)            │
│  ├── Pydantic (validation)       │
│  ├── APScheduler (cron jobs)     │
│  └── AI Libraries                │
│      ├── google-generativeai     │
│      └── openai                  │
└─────────────────────────────────┘
```

### Database Container
```
┌─────────────────────────────────┐
│ PostgreSQL 15                    │
│  ├── Database: aifakenews        │
│  ├── Table: news_articles        │
│  │   ├── id (PK)                 │
│  │   ├── title                   │
│  │   ├── content                 │
│  │   ├── category                │
│  │   ├── author                  │
│  │   ├── location                │
│  │   ├── published_date          │
│  │   ├── is_featured             │
│  │   └── views                   │
│  └── Extensions: (none)          │
└─────────────────────────────────┘
```

## API Endpoints

### News Endpoints
```
GET    /api/news              → List all news articles
GET    /api/news/featured     → Get featured articles
GET    /api/news/{id}         → Get specific article (increments views)
POST   /api/news/generate     → Generate new AI article
POST   /api/news              → Create article manually
DELETE /api/news/{id}         → Delete article
```

### Utility Endpoints
```
GET    /api/categories        → List all categories
GET    /api/stats             → Website statistics
GET    /                      → API info
GET    /docs                  → Swagger documentation
```

## Environment Configuration

### Production (.env)
```env
GEMINI_API_KEY=sk-...           # Required for AI generation
AI_PROVIDER=gemini              # or "openai"
DATABASE_URL=postgresql://...   # Auto-configured in Docker
```

### Docker Compose Sets
```yaml
Backend:
  DATABASE_URL: postgresql://postgres:postgres123@postgres:5432/aifakenews
  GEMINI_API_KEY: ${GEMINI_API_KEY}
  
Postgres:
  POSTGRES_DB: aifakenews
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres123
```

## Networking

### Internal Network (aifakenews-network)
```
Service Name     → Resolves To
─────────────────────────────────
postgres         → Container IP (e.g., 172.18.0.2)
backend          → Container IP (e.g., 172.18.0.3)
frontend         → Container IP (e.g., 172.18.0.4)
```

### External Access (Port Mapping)
```
Host Port → Container Port → Service
──────────────────────────────────────
3000      → 80            → Frontend (Nginx)
8000      → 8000          → Backend (FastAPI)
5432      → 5432          → Database (PostgreSQL)
```

## Storage & Persistence

### Named Volume
```
postgres_data
  └── /var/lib/postgresql/data (in container)
      ├── base/
      ├── global/
      ├── pg_wal/
      └── ... (PostgreSQL data files)
```

Data persists even when containers are removed!

### Development Volumes (dev mode)
```
./backend → /app (backend container)
./frontend → /app (frontend container)

Changes to source code reflect immediately!
```

## Build Process

### Frontend Build
```
Stage 1 (Build):
  node:18-alpine
  → npm ci (install)
  → npm run build (Vite build)
  → Output: /app/dist

Stage 2 (Production):
  nginx:alpine
  → Copy /app/dist → /usr/share/nginx/html
  → Copy nginx.conf
  → Final image size: ~25 MB
```

### Backend Build
```
Single Stage:
  python:3.11-slim
  → pip install requirements.txt
  → Copy source code
  → Final image size: ~400 MB
```

## Security Considerations

### Frontend
- ✅ Runs as non-root (nginx default)
- ✅ Static files only (no execution)
- ✅ HTTPS ready (configure in nginx.conf)

### Backend
- ⚠️ Runs as root (can be improved)
- ✅ No sensitive data in image
- ✅ Environment variables for secrets
- ✅ CORS configured

### Database
- ⚠️ Default password (change in production!)
- ✅ Internal network only
- ✅ Data encrypted at rest (volume)

## Monitoring & Logging

### View Logs
```bash
docker-compose logs -f [service]
```

### Health Checks
```yaml
postgres:
  healthcheck:
    test: pg_isready -U postgres
    interval: 10s
    timeout: 5s
    retries: 5
```

### Resource Monitoring
```bash
docker stats
```

## Scaling Considerations

### Current Setup (Single Instance)
```
1 Frontend   → Can handle ~1000 concurrent users
1 Backend    → Can handle ~100 requests/sec
1 Database   → Can handle ~1000 connections
```

### Scale Up (Multiple Instances)
```yaml
# In docker-compose.yml
backend:
  deploy:
    replicas: 3

# Add load balancer (nginx)
# Add connection pooler (PgBouncer)
```

## Backup Strategy

### Database Backup
```bash
# Automated backup
docker-compose exec postgres pg_dump -U postgres aifakenews > backup_$(date +%Y%m%d).sql

# Schedule with cron (Windows Task Scheduler)
```

### Volume Backup
```bash
# Stop containers
docker-compose down

# Backup volume
docker run --rm -v aifakenews_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_data_backup.tar.gz /data

# Restart
docker-compose up -d
```

---

This architecture provides:
- ✅ Easy development
- ✅ Easy deployment
- ✅ Consistent environments
- ✅ Scalable design
- ✅ Production-ready containers
