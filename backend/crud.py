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

def get_about_content(db: Session):
    return db.query(models.AboutContent).first()

def update_about_content(db: Session, content: str, username: str = None):
    about = db.query(models.AboutContent).first()
    if about:
        about.content = content
        about.updated_by = username
    else:
        about = models.AboutContent(content=content, updated_by=username)
        db.add(about)
    db.commit()
    db.refresh(about)
    return about

# Feature CRUD operations
def get_all_features(db: Session, model):
    return db.query(model).order_by(model.created_at.desc()).all()

def get_feature(db: Session, model, feature_id: int):
    return db.query(model).filter(model.id == feature_id).first()

def create_feature(db: Session, model, name: str, description: str = None, username: str = None):
    feature = model(name=name, description=description, created_by=username)
    db.add(feature)
    db.commit()
    db.refresh(feature)
    return feature

def update_feature(db: Session, model, feature_id: int, name: str, description: str = None):
    feature = db.query(model).filter(model.id == feature_id).first()
    if feature:
        feature.name = name
        feature.description = description
        db.commit()
        db.refresh(feature)
    return feature

def delete_feature(db: Session, model, feature_id: int):
    feature = db.query(model).filter(model.id == feature_id).first()
    if feature:
        db.delete(feature)
        db.commit()
        return True
    return False

def get_random_feature(db: Session, model):
    from sqlalchemy.sql.expression import func
    return db.query(model).order_by(func.random()).first()
