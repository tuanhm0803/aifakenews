from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from database import SessionLocal
from ai_service import ai_generator, CATEGORIES
import crud
import schemas
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_daily_news():
    """Generate multiple fake news articles daily"""
    db = SessionLocal()
    try:
        # Generate 5-8 random news articles
        num_articles = random.randint(5, 8)
        
        for i in range(num_articles):
            # Every 3rd article features the billionaire
            include_billionaire = (i % 3 == 0)
            category = random.choice(CATEGORIES)
            
            logger.info(f"Generating news article {i+1}/{num_articles} - Category: {category}, Billionaire: {include_billionaire}")
            
            # Generate news using AI
            news_data = ai_generator.generate_news(
                category=category,
                include_billionaire=include_billionaire
            )
            
            # Make some articles featured randomly
            news_data['is_featured'] = random.random() < 0.3
            
            # Create article in database
            article = schemas.NewsArticleCreate(**news_data)
            crud.create_news_article(db, article)
            
            logger.info(f"Created article: {news_data['title']}")
        
        logger.info(f"Successfully generated {num_articles} news articles")
    except Exception as e:
        logger.error(f"Error generating daily news: {str(e)}")
    finally:
        db.close()

def start_scheduler():
    """Start the background scheduler for daily news generation"""
    scheduler = BackgroundScheduler()
    
    # Run daily at 6 AM
    scheduler.add_job(
        generate_daily_news,
        trigger=CronTrigger(hour=6, minute=0),
        id='daily_news_generation',
        name='Generate daily fake news articles',
        replace_existing=True
    )
    
    # Also generate news immediately on startup if database is empty
    db = SessionLocal()
    if crud.get_article_count(db) == 0:
        logger.info("Database is empty, generating initial news articles...")
        db.close()
        generate_daily_news()
    else:
        db.close()
    
    scheduler.start()
    logger.info("News generation scheduler started")
    return scheduler
