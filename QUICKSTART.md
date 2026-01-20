# Quick Start Guide

## Step-by-Step Setup (Windows)

### 1. Install Prerequisites

**PostgreSQL:**
```powershell
# Download and install from: https://www.postgresql.org/download/windows/
# During installation, remember the password you set for postgres user
```

**Python:**
```powershell
# Check if installed
python --version

# If not installed, download from: https://www.python.org/downloads/
```

**Node.js:**
```powershell
# Check if installed
node --version

# If not installed, download from: https://nodejs.org/
```

### 2. Setup Database

```powershell
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE aifakenews;

# Exit
\q
```

### 3. Setup Backend

```powershell
# Open PowerShell in project directory
cd backend

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# If you get an error about execution policy, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try activating again
.\venv\Scripts\Activate.ps1

# Install packages
pip install -r requirements.txt

# Create .env file
Copy-Item .env.example .env

# Edit .env file (use notepad or VS Code)
notepad .env

# Update these values:
# DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/aifakenews
# GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 4. Get Free Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in your `.env` file

### 5. Setup Frontend

```powershell
# Open new PowerShell window
cd frontend

# Install packages
npm install
```

### 6. Run the Application

**Terminal 1 (Backend):**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm run dev
```

### 7. Open Browser

Go to: http://localhost:3000

You should see the Manteiv Daily News website!

## First Time Use

1. Click "Generate Random News" to create your first article
2. Click "Generate Billionaire Story" to create a story featuring you
3. Browse different categories
4. Click on any article to read the full story

## Troubleshooting

**"No module named 'fastapi'"**
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`

**"Database connection failed"**
- Check PostgreSQL is running
- Verify password in DATABASE_URL
- Ensure database 'aifakenews' exists

**"Cannot find module"**
- In frontend directory, run: `npm install`

**Frontend shows blank page**
- Check backend is running (http://localhost:8000/docs should work)
- Check browser console for errors

## Daily News Generation

The app automatically generates 5-8 news articles every day at 6 AM. You can also generate articles manually using the buttons on the homepage.

Enjoy your fake news empire! 📰✨
