from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ServiceCreate(BaseModel):
    title: str
    description: str
    category: str
    price: float
    duration: int  # minutes
    location: str
    worker_id: str
    worker_name: str

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[int] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None

class Service(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    category: str
    price: float
    duration: int
    location: str
    worker_id: str
    worker_name: str
    rating: float = 0.0
    total_reviews: int = 0
    is_active: bool = True
    created_at: Optional[str] = None
