from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    user_type: str = "customer"  # customer | worker | admin

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    profile_image: Optional[str] = None
    user_type: Optional[str] = None

class UserProfile(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = ""
    skills: Optional[List[str]] = []
    rating: Optional[float] = 0.0
    total_reviews: Optional[int] = 0
    user_type: str = "customer"
    suspended: bool = False
    created_at: Optional[str] = None
