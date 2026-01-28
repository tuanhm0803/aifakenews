from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta
import models
import schemas
import crud
from database import engine, get_db
from ai_service import ai_generator
from scheduler import start_scheduler
import auth
import logging

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Fake News Generator",
    description="A fake news website powered by AI",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Start the scheduler
scheduler = None

@app.on_event("startup")
async def startup_event():
    global scheduler
    scheduler = start_scheduler()
    logging.info("Application started")

@app.on_event("shutdown")
async def shutdown_event():
    if scheduler:
        scheduler.shutdown()
    logging.info("Application shutdown")

@app.get("/")
def read_root():
    return {
        "message": "Welcome to AI Fake News Generator API",
        "docs": "/docs"
    }

@app.get("/api/news", response_model=List[schemas.NewsArticle])
def get_news(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all news articles with optional filtering"""
    articles = crud.get_news_articles(db, skip=skip, limit=limit, category=category)
    return articles

@app.get("/api/news/featured", response_model=List[schemas.NewsArticle])
def get_featured_news(limit: int = 5, db: Session = Depends(get_db)):
    """Get featured news articles"""
    return crud.get_featured_news(db, limit=limit)

@app.get("/api/news/{article_id}", response_model=schemas.NewsArticle)
def get_news_article(article_id: int, db: Session = Depends(get_db)):
    """Get a specific news article by ID"""
    article = crud.get_news_article(db, article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@app.post("/api/news/generate", response_model=schemas.NewsArticle)
def generate_news(
    request: schemas.NewsGenerationRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Generate a new fake news article using AI (Admin/Author only)"""
    try:
        news_data = ai_generator.generate_news(
            topic=request.topic,
            category=request.category,
            include_billionaire=request.include_billionaire
        )
        
        article = schemas.NewsArticleCreate(**news_data)
        db_article = crud.create_news_article(db, article)
        return db_article
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating news: {str(e)}")

@app.post("/api/news", response_model=schemas.NewsArticle)
def create_news(article: schemas.NewsArticleCreate, db: Session = Depends(get_db)):
    """Create a new news article manually"""
    return crud.create_news_article(db, article)

@app.delete("/api/news/{article_id}")
def delete_news(article_id: int, db: Session = Depends(get_db)):
    """Delete a news article"""
    success = crud.delete_news_article(db, article_id)
    if not success:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted successfully"}

@app.get("/api/categories")
def get_categories():
    """Get all available news categories"""
    from ai_service import CATEGORIES
    return {"categories": CATEGORIES}

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    """Get website statistics"""
    total_articles = crud.get_article_count(db)
    return {
        "total_articles": total_articles,
        "country": "Manteiv"
    }

# Authentication endpoints
@app.post("/api/auth/register", response_model=schemas.User)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    # Check if username exists
    db_user = auth.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email exists
    db_user = auth.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    return auth.create_user(db, user)

@app.post("/api/auth/login", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get access token"""
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.post("/api/auth/login/json", response_model=schemas.Token)
async def login_json(
    credentials: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    """Login with JSON body and get access token"""
    user = auth.authenticate_user(db, credentials.username, credentials.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password"
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/api/auth/me", response_model=schemas.User)
async def get_me(
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Get current user info"""
    return current_user

@app.get("/api/users", response_model=List[schemas.User])
async def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    """List all users (Admin only)"""
    return db.query(models.User).all()
