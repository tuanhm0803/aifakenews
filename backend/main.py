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

# About page endpoints
@app.get("/api/about")
def get_about(db: Session = Depends(get_db)):
    """Get about page content"""
    about = crud.get_about_content(db)
    if not about:
        return {"content": "", "updated_at": None, "updated_by": None}
    return {
        "content": about.content,
        "updated_at": about.updated_at,
        "updated_by": about.updated_by
    }

@app.put("/api/about")
def update_about(
    request: schemas.AboutContentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    """Update about page content (Admin only)"""
    about = crud.update_about_content(db, request.content, current_user.username)
    return {
        "content": about.content,
        "updated_at": about.updated_at,
        "updated_by": about.updated_by
    }

# Feature endpoints - Characters
@app.get("/api/features/characters", response_model=List[schemas.Feature])
def get_characters(db: Session = Depends(get_db)):
    """Get all characters"""
    return crud.get_all_features(db, models.Character)

@app.post("/api/features/characters", response_model=schemas.Feature)
def create_character(
    feature: schemas.FeatureCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Create a new character (Admin/Author only)"""
    return crud.create_feature(db, models.Character, feature.name, feature.description, current_user.username)

@app.put("/api/features/characters/{feature_id}", response_model=schemas.Feature)
def update_character(
    feature_id: int,
    feature: schemas.FeatureUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Update a character (Admin/Author only)"""
    updated = crud.update_feature(db, models.Character, feature_id, feature.name, feature.description)
    if not updated:
        raise HTTPException(status_code=404, detail="Character not found")
    return updated

@app.delete("/api/features/characters/{feature_id}")
def delete_character(
    feature_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Delete a character (Admin/Author only)"""
    success = crud.delete_feature(db, models.Character, feature_id)
    if not success:
        raise HTTPException(status_code=404, detail="Character not found")
    return {"message": "Character deleted successfully"}

# Feature endpoints - Places
@app.get("/api/features/places", response_model=List[schemas.Feature])
def get_places(db: Session = Depends(get_db)):
    """Get all places"""
    return crud.get_all_features(db, models.Place)

@app.post("/api/features/places", response_model=schemas.Feature)
def create_place(
    feature: schemas.FeatureCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Create a new place (Admin/Author only)"""
    return crud.create_feature(db, models.Place, feature.name, feature.description, current_user.username)

@app.put("/api/features/places/{feature_id}", response_model=schemas.Feature)
def update_place(
    feature_id: int,
    feature: schemas.FeatureUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Update a place (Admin/Author only)"""
    updated = crud.update_feature(db, models.Place, feature_id, feature.name, feature.description)
    if not updated:
        raise HTTPException(status_code=404, detail="Place not found")
    return updated

@app.delete("/api/features/places/{feature_id}")
def delete_place(
    feature_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Delete a place (Admin/Author only)"""
    success = crud.delete_feature(db, models.Place, feature_id)
    if not success:
        raise HTTPException(status_code=404, detail="Place not found")
    return {"message": "Place deleted successfully"}

# Feature endpoints - Weather
@app.get("/api/features/weather", response_model=List[schemas.Feature])
def get_weather(db: Session = Depends(get_db)):
    """Get all weather conditions"""
    return crud.get_all_features(db, models.Weather)

@app.post("/api/features/weather", response_model=schemas.Feature)
def create_weather(
    feature: schemas.FeatureCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Create a new weather condition (Admin/Author only)"""
    return crud.create_feature(db, models.Weather, feature.name, feature.description, current_user.username)

@app.put("/api/features/weather/{feature_id}", response_model=schemas.Feature)
def update_weather(
    feature_id: int,
    feature: schemas.FeatureUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Update a weather condition (Admin/Author only)"""
    updated = crud.update_feature(db, models.Weather, feature_id, feature.name, feature.description)
    if not updated:
        raise HTTPException(status_code=404, detail="Weather not found")
    return updated

@app.delete("/api/features/weather/{feature_id}")
def delete_weather(
    feature_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Delete a weather condition (Admin/Author only)"""
    success = crud.delete_feature(db, models.Weather, feature_id)
    if not success:
        raise HTTPException(status_code=404, detail="Weather not found")
    return {"message": "Weather deleted successfully"}

# Feature endpoints - Events
@app.get("/api/features/events", response_model=List[schemas.Feature])
def get_events(db: Session = Depends(get_db)):
    """Get all events"""
    return crud.get_all_features(db, models.Event)

@app.post("/api/features/events", response_model=schemas.Feature)
def create_event(
    feature: schemas.FeatureCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Create a new event (Admin/Author only)"""
    return crud.create_feature(db, models.Event, feature.name, feature.description, current_user.username)

@app.put("/api/features/events/{feature_id}", response_model=schemas.Feature)
def update_event(
    feature_id: int,
    feature: schemas.FeatureUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Update an event (Admin/Author only)"""
    updated = crud.update_feature(db, models.Event, feature_id, feature.name, feature.description)
    if not updated:
        raise HTTPException(status_code=404, detail="Event not found")
    return updated

@app.delete("/api/features/events/{feature_id}")
def delete_event(
    feature_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_author_or_admin)
):
    """Delete an event (Admin/Author only)"""
    success = crud.delete_feature(db, models.Event, feature_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}
