from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class GigCreate(BaseModel):
    title: str
    description: str
    category: str
    price: float
    delivery_time: int  # days
    freelancer_id: str
    freelancer_name: str
    skills: List[str]
    requirements: Optional[str] = ""

class GigProposal(BaseModel):
    gig_id: str
    worker_id: str
    worker_name: str
    proposed_price: float
    delivery_days: int
    cover_letter: str

class Gig(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    category: str
    price: float
    delivery_time: int
    freelancer_id: str
    freelancer_name: str
    skills: List[str]
    requirements: Optional[str] = ""
    rating: float = 0.0
    status: str = "active"  # active|paused|closed
    orders_count: int = 0
    posted_date: Optional[str] = None
