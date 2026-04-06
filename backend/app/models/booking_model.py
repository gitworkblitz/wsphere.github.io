from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class BookingCreate(BaseModel):
    service_id: str
    service_title: str
    worker_id: str
    worker_name: str
    customer_id: str
    customer_name: str
    booking_date: str
    time_slot: str
    amount: float
    address: str
    notes: Optional[str] = ""

class BookingStatusUpdate(BaseModel):
    status: str
    note: Optional[str] = ""

class Booking(BaseModel):
    id: Optional[str] = None
    service_id: str
    service_title: str
    worker_id: str
    worker_name: str
    customer_id: str
    customer_name: str
    booking_date: str
    time_slot: str
    amount: float
    address: str
    notes: Optional[str] = ""
    status: str = "pending"  # pending|confirmed|in_progress|completed|cancelled
    payment_status: str = "pending"  # pending|paid|refunded
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
