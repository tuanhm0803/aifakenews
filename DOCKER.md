# Docker Setup Guide for AI Fake News Website

This guide explains how to run the entire application using Docker.

## Prerequisites

- Docker Desktop for Windows
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Install Docker Desktop

Download and install from: https://www.docker.com/products/docker-desktop/

### 2. Configure Environment Variables

```powershell
# Copy the environment template
copy .env.docker .env

# Edit .env file and add your Gemini API key
notepad .env
```

Update the file with your actual API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
AI_PROVIDER=gemini
```

### 3. Build and Run with Docker Compose

```powershell
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

## Docker Services

The application consists of 3 services:

### 1. PostgreSQL Database
- **Container**: `aifakenews-postgres`
- **Port**: 5432
- **Database**: aifakenews
- **User**: postgres
- **Password**: postgres123

### 2. FastAPI Backend
- **Container**: `aifakenews-backend`
- **Port**: 8000
- **Auto-reload**: Enabled in development

### 3. React Frontend
- **Container**: `aifakenews-frontend`
- **Port**: 3000 (mapped to 80 in container)
- **Server**: Nginx

## Docker Commands

### Start Services
```powershell
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Start specific service
docker-compose up backend
```

### Stop Services
```powershell
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

### View Logs
```powershell
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Rebuild Services
```powershell
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and restart
docker-compose up --build
```

### Execute Commands in Containers
```powershell
# Access backend container
docker-compose exec backend bash

# Access database
docker-compose exec postgres psql -U postgres -d aifakenews

# Run backend commands
docker-compose exec backend python -c "print('Hello from container')"
```

### Check Status
```powershell
# List running containers
docker-compose ps

# View resource usage
docker stats
```

## Development vs Production

### Development Mode (with hot reload)

```powershell
# Use development compose file
docker-compose -f docker-compose.dev.yml up --build
```

Features:
- Hot reload for both frontend and backend
- Source code mounted as volumes
- Development servers (Vite, Uvicorn with --reload)

### Production Mode

```powershell
# Use production compose file (default)
docker-compose up --build
```

Features:
- Optimized builds
- Nginx for frontend serving
- No source code mounting
- Better performance

## Troubleshooting

### Container Won't Start
```powershell
# Check logs
docker-compose logs [service-name]

# Restart specific service
docker-compose restart [service-name]
```

### Database Connection Issues
```powershell
# Check if postgres is healthy
docker-compose ps

# Access database directly
docker-compose exec postgres psql -U postgres -d aifakenews

# View database logs
docker-compose logs postgres
```

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :5432

# Kill process
taskkill /PID [process_id] /F

# Or change ports in docker-compose.yml
```

### Clear Everything and Start Fresh
```powershell
# Stop all containers
docker-compose down

# Remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose up --build
```

### Backend Can't Connect to Database
```powershell
# Wait for postgres to be ready
docker-compose up postgres
# Wait for "database system is ready to accept connections"
# Then start other services
docker-compose up backend frontend
```

### Frontend Shows 502 Bad Gateway
- Backend might not be running
- Check backend logs: `docker-compose logs backend`
- Ensure backend is healthy: `docker-compose ps`

## Database Management

### Backup Database
```powershell
# Create backup
docker-compose exec postgres pg_dump -U postgres aifakenews > backup.sql

# Or using Docker command
docker exec aifakenews-postgres pg_dump -U postgres aifakenews > backup.sql
```

### Restore Database
```powershell
# Restore from backup
docker-compose exec -T postgres psql -U postgres aifakenews < backup.sql

# Or using Docker command
docker exec -i aifakenews-postgres psql -U postgres aifakenews < backup.sql
```

### Reset Database
```powershell
# Stop services
docker-compose down

# Remove volume
docker volume rm aifakenews_postgres_data

# Restart services (creates fresh database)
docker-compose up
```

## Environment Variables

The following environment variables can be configured in `.env` file:

```env
# AI Configuration
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
AI_PROVIDER=gemini

# Database (automatically configured in docker-compose.yml)
POSTGRES_DB=aifakenews
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
```

## Docker Compose File Structure

```yaml
services:
  postgres:    # PostgreSQL database
  backend:     # FastAPI application
  frontend:    # React + Nginx application

networks:
  aifakenews-network:  # Internal network for services

volumes:
  postgres_data:       # Persistent database storage
```

## Deployment

### Deploy to Cloud

**Docker Hub:**
```powershell
# Tag images
docker tag aifakenews-backend:latest yourusername/aifakenews-backend:latest
docker tag aifakenews-frontend:latest yourusername/aifakenews-frontend:latest

# Push to Docker Hub
docker push yourusername/aifakenews-backend:latest
docker push yourusername/aifakenews-frontend:latest
```

**AWS ECS / Azure Container Instances / Google Cloud Run:**
- Use the Docker images
- Set environment variables
- Configure PostgreSQL (or use managed database)

## Performance Tips

1. **Use .dockerignore**: Already configured to exclude unnecessary files
2. **Multi-stage builds**: Frontend uses multi-stage build for smaller image
3. **Volume caching**: node_modules and Python packages are cached
4. **Health checks**: PostgreSQL has health checks for reliable startup

## Additional Commands

```powershell
# View image sizes
docker images | findstr aifakenews

# Clean up unused resources
docker system prune -a

# View container resource usage
docker stats aifakenews-backend aifakenews-frontend aifakenews-postgres

# Export container as image
docker commit aifakenews-backend aifakenews-backend-snapshot

# Save image to file
docker save aifakenews-backend > backend-image.tar

# Load image from file
docker load < backend-image.tar
```

## Support

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify all services are running: `docker-compose ps`
3. Ensure ports 3000, 8000, and 5432 are available
4. Check environment variables in `.env` file

---

Happy containerizing! 🐳📰
