# AI Fake News Website - Manteiv Daily News

A full-stack web application that generates fake news articles using AI (Google Gemini or ChatGPT). Built with FastAPI, React, Tailwind CSS, and PostgreSQL.

## 🐳 Docker Setup (Recommended)

**Get started in 3 steps:**

```powershell
# 1. Setup environment
copy .env.docker .env
notepad .env  # Add your GEMINI_API_KEY

# 2. Start everything
.\start-docker.ps1

# 3. Open browser → http://localhost:3000
```

See [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md) for detailed Docker instructions.

## Features

- 🤖 **AI-Powered News Generation**: Uses Google Gemini or ChatGPT to generate fake news articles
- 📰 **Daily Auto-Generation**: Automatically generates 5-8 new articles daily at 6 AM
- 💎 **Billionaire Stories**: Special stories featuring you as a famous billionaire from Manteiv
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- 📱 **Category Filtering**: Browse news by categories (Politics, Technology, Sports, etc.)
- ⭐ **Featured Articles**: Highlight important fake news stories
- 📊 **View Tracking**: Track article views

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Database for storing articles
- **SQLAlchemy**: ORM for database operations
- **Google Gemini API**: AI text generation
- **APScheduler**: Automated daily news generation

### Frontend
- **React 18**: UI library
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client

## Project Structure

```
AIFakenews/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database configuration
│   ├── config.py            # App configuration
│   ├── crud.py              # Database operations
│   ├── ai_service.py        # AI news generation
│   ├── scheduler.py         # Daily news scheduler
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── api/             # API client
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    ├── package.json         # Node dependencies
    └── index.html           # HTML template
```

## Setup Instructions

### Option 1: Docker (Recommended ⭐)

**Prerequisites:**
- Docker Desktop for Windows

**Quick Start:**
```powershell
# 1. Get your free Gemini API key from: https://makersuite.google.com/app/apikey

# 2. Copy environment template
copy .env.docker .env

# 3. Edit .env and add your API key
notepad .env

# 4. Run the startup script
.\start-docker.ps1

# 5. Open browser to http://localhost:3000
```

That's it! All services (PostgreSQL, Backend, Frontend) will run in Docker containers.

See [DOCKER.md](DOCKER.md) for detailed Docker documentation.

### Option 2: Manual Setup

**Prerequisites:**
- Python 3.9+
- Node.js 18+
- PostgreSQL 14+
- Google Gemini API key (free tier available)

### 1. Database Setup

Install PostgreSQL and create a database:

```bash
# Install PostgreSQL (Windows)
# Download from: https://www.postgresql.org/download/windows/

# Create database
psql -U postgres
CREATE DATABASE aifakenews;
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env file with your settings:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/aifakenews
# GEMINI_API_KEY=your_gemini_api_key_here
# AI_PROVIDER=gemini
```

### 3. Get Gemini API Key (FREE)

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key to your `.env` file

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000

## Usage

### Generate News Manually
- Click "Generate Random News" on the homepage
- Click "Generate Billionaire Story" for special stories about you

### Automatic Generation
- News is automatically generated daily at 6 AM
- Generates 5-8 articles per day
- Every 3rd article features the billionaire

### API Endpoints

- `GET /api/news` - Get all news articles
- `GET /api/news/{id}` - Get specific article
- `GET /api/news/featured` - Get featured articles
- `POST /api/news/generate` - Generate new article
- `GET /api/categories` - Get all categories
- `GET /api/stats` - Get website statistics

### API Documentation

Visit http://localhost:8000/docs for interactive API documentation.

## Configuration

### Environment Variables (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/aifakenews
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # Optional
AI_PROVIDER=gemini  # or "openai"
```

### News Categories

- Politics
- Economy
- Technology
- Sports
- Entertainment
- Science
- Health
- Business

## Customization

### Change Billionaire Stories

Edit [backend/ai_service.py](backend/ai_service.py), modify the `BILLIONAIRE_PROMPTS` list.

### Change Schedule

Edit [backend/scheduler.py](backend/scheduler.py), modify the `CronTrigger` parameters.

### Change Styling

Edit [frontend/tailwind.config.js](frontend/tailwind.config.js) and [frontend/src/index.css](frontend/src/index.css).

## Deployment

### Backend (Render/Heroku)
1. Add `Procfile`: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
2. Set environment variables
3. Deploy

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder

### Database (Neon/Supabase)
1. Create PostgreSQL database
2. Update `DATABASE_URL` in environment variables

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### AI Generation Fails
- Verify API key is correct
- Check API quota limits
- Falls back to template if AI fails

### Frontend Can't Connect to Backend
- Ensure backend is running on port 8000
- Check CORS settings in [backend/main.py](backend/main.py)

## License

This is a satirical project for entertainment purposes. All news articles are completely fictional and AI-generated.

## Disclaimer

⚠️ **IMPORTANT**: This website generates completely FAKE news for entertainment and educational purposes only. All articles, names, places, and events are fictional. Do not share these articles as real news.

---

Built with ❤️ and AI in Manteiv (the backward version of Vietnam)

test