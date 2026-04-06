from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    location: str
    salary_min: float
    salary_max: float
    employment_type: str  # full_time|part_time|contract|internship|remote
    experience_required: float
    skills_required: List[str]
    posted_by: str
    poster_name: str
    deadline: str

class JobApplication(BaseModel):
    job_id: str
    applicant_id: str
    applicant_name: str
    applicant_email: str
    cover_letter: Optional[str] = ""
    expected_salary: Optional[float] = None

class Job(BaseModel):
    id: Optional[str] = None
    title: str
    company: str
    description: str
    location: str
    salary_min: float
    salary_max: float
    employment_type: str
    experience_required: float
    skills_required: List[str]
    posted_by: str
    poster_name: str
    deadline: str
    is_active: bool = True
    applications_count: int = 0
    posted_date: Optional[str] = None
