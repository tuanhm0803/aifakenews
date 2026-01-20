# 🎯 Docker Setup Checklist

Use this checklist to ensure your Docker setup is working correctly.

## Prerequisites ✅

- [ ] Docker Desktop installed
- [ ] Docker Desktop is running (check system tray)
- [ ] Got Gemini API key from https://makersuite.google.com/app/apikey

## Setup Steps ✅

- [ ] Copied `.env.docker` to `.env`
- [ ] Added `GEMINI_API_KEY` to `.env` file
- [ ] Saved the `.env` file

## Start Application ✅

- [ ] Ran `.\start-docker.ps1` or `docker-compose up --build -d`
- [ ] No error messages appeared
- [ ] Waited 30-60 seconds for services to start

## Verify Services ✅

Run: `docker-compose ps`

You should see:
- [ ] `aifakenews-postgres` - Running (healthy)
- [ ] `aifakenews-backend` - Running
- [ ] `aifakenews-frontend` - Running

## Test URLs ✅

- [ ] Frontend works: http://localhost:3000
- [ ] Backend works: http://localhost:8000
- [ ] API docs work: http://localhost:8000/docs

## Test Functionality ✅

- [ ] Homepage loads with Manteiv branding
- [ ] Click "Generate Random News" - creates article
- [ ] Click "Generate Billionaire Story" - creates special article
- [ ] Click on any article - opens full article page
- [ ] Can navigate between pages
- [ ] No 502 or connection errors

## Check Logs ✅

Run: `docker-compose logs backend`

Should NOT see:
- [ ] Database connection errors
- [ ] API key errors
- [ ] Python exceptions

Should see:
- [ ] "Application started"
- [ ] "News generation scheduler started"
- [ ] HTTP requests with 200 status codes

## Database Check ✅

Run: `docker-compose exec postgres psql -U postgres -d aifakenews -c "SELECT COUNT(*) FROM news_articles;"`

- [ ] Command works without errors
- [ ] Shows count of articles (may be 0 initially)

## Performance Check ✅

Run: `docker stats --no-stream`

Verify reasonable resource usage:
- [ ] Backend: < 500 MB RAM
- [ ] Frontend: < 50 MB RAM
- [ ] Postgres: < 100 MB RAM

## Development Mode (Optional) ✅

If testing development mode:

- [ ] Run `docker-compose -f docker-compose.dev.yml up`
- [ ] Edit a backend Python file
- [ ] Backend automatically reloads
- [ ] Edit a frontend JSX file
- [ ] Frontend automatically updates in browser

## Troubleshooting ✅

If something doesn't work:

### Port Conflicts
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :5432
# Kill any conflicting processes
```

### Service Not Starting
```powershell
# Check logs for specific service
docker-compose logs [postgres|backend|frontend]

# Restart specific service
docker-compose restart [service-name]
```

### Database Connection Issues
```powershell
# Wait longer (up to 60 seconds)
# Check postgres logs
docker-compose logs postgres

# Look for: "database system is ready to accept connections"
```

### Clean Restart
```powershell
# Stop everything
docker-compose down -v

# Start fresh
docker-compose up --build
```

## Common Issues & Solutions ✅

### ❌ "Cannot connect to Docker daemon"
**Solution**: Start Docker Desktop, wait for it to fully load

### ❌ "Port 3000 is already in use"
**Solution**: 
```powershell
netstat -ano | findstr :3000
taskkill /PID [pid] /F
```

### ❌ Frontend shows "502 Bad Gateway"
**Solution**: Backend not ready yet, wait 30 more seconds

### ❌ No news articles generated
**Solution**: 
1. Check `GEMINI_API_KEY` in `.env`
2. Check backend logs: `docker-compose logs backend`
3. Manually trigger: Click "Generate Random News" button

### ❌ "Failed to generate news"
**Solution**: 
1. Verify API key is correct
2. Check you have internet connection
3. Verify Gemini API quota (free tier limits)

## Stop Application ✅

When done:
- [ ] Run `.\stop-docker.ps1` or `docker-compose down`
- [ ] All containers stopped successfully
- [ ] Docker Desktop can be closed (optional)

## Cleanup (Optional) ✅

To completely remove everything:
```powershell
# Remove containers, networks, and volumes
docker-compose down -v

# Remove images too
docker-compose down -v --rmi all

# Clean Docker system
docker system prune -a
```

## Success Criteria ✅

Your setup is successful if:
- ✅ All 3 services are running
- ✅ Frontend loads at localhost:3000
- ✅ Can generate news articles
- ✅ Articles display correctly
- ✅ Can view individual articles
- ✅ No error messages in logs
- ✅ Database persists after restart

## Next Steps 📚

After confirming everything works:

1. **Explore the application**
   - Generate multiple articles
   - Try different categories
   - Read billionaire stories

2. **Read documentation**
   - [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md) - Quick reference
   - [DOCKER.md](DOCKER.md) - Comprehensive guide
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System design

3. **Customize**
   - Edit billionaire prompts in `backend/ai_service.py`
   - Modify colors in `frontend/tailwind.config.js`
   - Add more categories or features

4. **Development**
   - Use `docker-compose.dev.yml` for development
   - Make changes and see them live
   - Experiment with the codebase

## Getting Help 🆘

If you're stuck:

1. **Check logs**: `docker-compose logs -f`
2. **Check status**: `docker-compose ps`
3. **Read docs**: See DOCKER_QUICKSTART.md
4. **Clean restart**: `docker-compose down -v && docker-compose up --build`

---

## Quick Command Reference

```powershell
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs (all)
docker-compose logs -f

# Logs (specific)
docker-compose logs -f backend

# Status
docker-compose ps

# Restart service
docker-compose restart backend

# Rebuild
docker-compose up --build

# Clean everything
docker-compose down -v --rmi all
```

---

**Once you check all items above, your Docker setup is complete! 🎉**
