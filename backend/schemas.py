from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NewsArticleBase(BaseModel):
    title: str
    content: str
    category: str
    author: str = "AI News Generator"
    location: str = "Manteiv"
    image_url: Optional[str] = None
    is_featured: bool = False

class NewsArticleCreate(NewsArticleBase):
    pass

class NewsArticle(NewsArticleBase):
    id: int
    published_date: datetime
    views: int
    
    class Config:
        from_attributes = True

class NewsGenerationRequest(BaseModel):
    topic: Optional[str] = None
    category: str = "general"
    include_billionaire: bool = False
