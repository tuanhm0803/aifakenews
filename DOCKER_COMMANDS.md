# 🐳 Docker Quick Reference - AI Fake News

## Local Development Commands

### Start/Stop Services
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres

# Stop and remove all (including volumes - WARNING: deletes data)
docker-compose down -v
```

### Build & Update
```bash
# Rebuild after code changes
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend

# Force rebuild (no cache)
docker-compose build --no-cache
docker-compose up -d
```

### Logs & Monitoring
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f frontend

# View last 100 lines
docker-compose logs --tail=100 backend

# Check service status
docker-compose ps
```

### Database Operations
```bash
# Connect to PostgreSQL
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews

# Run SQL query
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews -c "SELECT * FROM users;"

# Backup database
docker exec aifakenews-postgres pg_dump -U postgres aifakenews > backup_$(date +%Y%m%d).sql

# Restore database
docker exec -i aifakenews-postgres psql -U postgres aifakenews < backup.sql

# View user list
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews -c "SELECT username, role, email FROM users;"
```

### Backend Operations
```bash
# Access backend shell
docker exec -it aifakenews-backend bash

# Run Python command
docker exec -it aifakenews-backend python seed_users.py

# Create database tables
docker exec -it aifakenews-backend python -c "from database import engine; import models; models.Base.metadata.create_all(bind=engine)"

# Check Python packages
docker exec -it aifakenews-backend pip list
```

---

## Production Commands

### Start/Stop Services
```bash
# Start production
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Stop production
docker-compose -f docker-compose.prod.yml down

# Restart service
docker-compose -f docker-compose.prod.yml restart backend
```

### Update & Deploy
```bash
# Pull latest code and rebuild
git pull
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# Zero-downtime update (build first, then switch)
docker-compose -f docker-compose.prod.yml --env-file .env.prod build
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Logs & Monitoring
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# View backend logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Check status
docker-compose -f docker-compose.prod.yml ps

# Resource usage
docker stats
```

### Database Operations
```bash
# Connect to production database
docker exec -it aifakenews-postgres-prod psql -U postgres -d aifakenews

# Backup production database
docker exec aifakenews-postgres-prod pg_dump -U postgres aifakenews > prod_backup_$(date +%Y%m%d_%H%M%S).sql

# Restore production database (CAREFUL!)
docker exec -i aifakenews-postgres-prod psql -U postgres aifakenews < backup.sql
```

---

## Troubleshooting Commands

### Service Not Starting
```bash
# Check logs for errors
docker-compose logs backend

# Check if port is already in use
netstat -tulpn | grep 8000
netstat -tulpn | grep 3000

# Remove and recreate
docker-compose down
docker-compose up -d --build
```

### Database Issues
```bash
# Check PostgreSQL status
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Verify database connection
docker exec -it aifakenews-backend python -c "from database import engine; engine.connect()"
```

### Permission Issues
```bash
# Fix entrypoint permission
chmod +x backend/entrypoint.sh

# Rebuild
docker-compose up -d --build
```

### Clean Start (WARNING: Deletes all data)
```bash
# Stop everything
docker-compose down -v

# Remove all containers
docker-compose rm -f

# Rebuild from scratch
docker-compose up -d --build
```

---

## Useful Docker Commands

### Container Management
```bash
# List all containers
docker ps -a

# Remove stopped containers
docker container prune

# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)
```

### Image Management
```bash
# List images
docker images

# Remove unused images
docker image prune

# Remove all unused images
docker image prune -a

# Remove specific image
docker rmi aifakenews-backend:latest
```

### Volume Management
```bash
# List volumes
docker volume ls

# Remove unused volumes
docker volume prune

# Inspect volume
docker volume inspect aifakenews_postgres_data
```

### Network Management
```bash
# List networks
docker network ls

# Inspect network
docker network inspect aifakenews_aifakenews-network

# Remove unused networks
docker network prune
```

---

## Authentication Testing Commands

### Test Login
```bash
# Test admin login
curl -X POST http://localhost:8000/api/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test author login
curl -X POST http://localhost:8000/api/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"username":"author","password":"author123"}'
```

### Test Protected Endpoints
```bash
# Get token first
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.access_token')

# Test protected endpoint
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Try to generate news
curl -X POST http://localhost:8000/api/news/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category":"general","include_billionaire":false}'
```

---

## Health Checks

### Check All Services
```bash
# Local
docker-compose ps

# Production
docker-compose -f docker-compose.prod.yml ps
```

### Test Endpoints
```bash
# Backend health
curl http://localhost:8000/

# API docs
curl http://localhost:8000/docs

# Frontend
curl http://localhost:3000/
```

### Check Users
```bash
# List all users
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews -c \
  "SELECT id, username, role, email, is_active FROM users;"

# Count users by role
docker exec -it aifakenews-postgres psql -U postgres -d aifakenews -c \
  "SELECT role, COUNT(*) FROM users GROUP BY role;"
```

---

## Performance & Resource Management

### Monitor Resources
```bash
# Real-time resource usage
docker stats

# Specific container
docker stats aifakenews-backend

# Memory usage
docker stats --format "table {{.Name}}\t{{.MemUsage}}"
```

### Cleanup
```bash
# Clean everything (CAREFUL!)
docker system prune -a

# Clean specific resources
docker container prune  # Remove stopped containers
docker image prune -a   # Remove unused images
docker volume prune     # Remove unused volumes
docker network prune    # Remove unused networks
```

---

## Quick Access URLs

### Local Development
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5433

### Production
- Frontend: https://yourdomain.com
- Backend API: https://yourdomain.com/api
- API Docs: https://yourdomain.com/docs

---

## Demo Accounts

| Username | Password   | Role   | Can Generate News |
|----------|------------|--------|------------------|
| admin    | admin123   | Admin  | ✅ Yes           |
| author   | author123  | Author | ✅ Yes           |
| viewer   | viewer123  | Viewer | ❌ No            |

---

## Emergency Procedures

### Complete System Reset (LOCAL ONLY)
```bash
# Stop and remove everything
docker-compose down -v

# Clean Docker system
docker system prune -a -f

# Restart from scratch
docker-compose up -d --build
```

### Rollback to Previous Version
```bash
# Git rollback
git log --oneline  # Find commit hash
git checkout <commit-hash>

# Rebuild
docker-compose -f docker-compose.prod.yml up -d --build
```

### Database Recovery
```bash
# Stop backend
docker-compose stop backend

# Restore database
docker exec -i aifakenews-postgres psql -U postgres aifakenews < backup.sql

# Restart backend
docker-compose start backend
```
