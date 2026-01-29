from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: str = "viewer"  # admin, author, viewer

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    username: Optional[str] = None

# News schemas
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

# About page schemas
class AboutContentUpdate(BaseModel):
    content: str

class AboutContent(BaseModel):
    content: str
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None
    
    class Config:
        from_attributes = True

# Feature schemas
class FeatureBase(BaseModel):
    name: str
    description: Optional[str] = None

class FeatureCreate(FeatureBase):
    pass

class FeatureUpdate(FeatureBase):
    pass

class Feature(FeatureBase):
    id: int
    created_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True
