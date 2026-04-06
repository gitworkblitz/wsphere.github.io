from pydantic import BaseModel
from typing import Optional, List, Dict

class WorkerCreate(BaseModel):
    user_id: str
    name: str
    skills: List[str]
    experience_years: float
    location: str
    bio: Optional[str] = ""
    hourly_rate: float
    availability: bool = True

class Worker(BaseModel):
    id: Optional[str] = None
    user_id: str
    name: str
    skills: List[str]
    experience_years: float
    location: str
    bio: Optional[str] = ""
    hourly_rate: float
    availability: bool = True
    rating: float = 0.0
    total_jobs: int = 0
    completion_rate: float = 100.0
    lat: Optional[float] = None
    lng: Optional[float] = None
