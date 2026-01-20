from sqlalchemy.orm import Session
from sqlalchemy import desc
import models
import schemas

def get_news_articles(db: Session, skip: int = 0, limit: int = 20, category: str = None):
    query = db.query(models.NewsArticle)
    if category:
        query = query.filter(models.NewsArticle.category == category)
    return query.order_by(desc(models.NewsArticle.published_date)).offset(skip).limit(limit).all()

def get_news_article(db: Session, article_id: int):
    article = db.query(models.NewsArticle).filter(models.NewsArticle.id == article_id).first()
    if article:
        article.views += 1
        db.commit()
    return article

def get_featured_news(db: Session, limit: int = 5):
    return db.query(models.NewsArticle).filter(
        models.NewsArticle.is_featured == True
    ).order_by(desc(models.NewsArticle.published_date)).limit(limit).all()

def create_news_article(db: Session, article: schemas.NewsArticleCreate):
    db_article = models.NewsArticle(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def delete_news_article(db: Session, article_id: int):
    article = db.query(models.NewsArticle).filter(models.NewsArticle.id == article_id).first()
    if article:
        db.delete(article)
        db.commit()
        return True
    return False

def get_article_count(db: Session):
    return db.query(models.NewsArticle).count()
