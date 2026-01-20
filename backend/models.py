from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    author = Column(String(200), default="AI News Generator")
    location = Column(String(200), default="Manteiv")
    image_url = Column(String(500), nullable=True)
    published_date = Column(DateTime(timezone=True), server_default=func.now())
    is_featured = Column(Boolean, default=False)
    views = Column(Integer, default=0)
    
    def __repr__(self):
        return f"<NewsArticle {self.title}>"
