from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class Invoice(BaseModel):
    id: Optional[str] = None
    invoice_number: str
    booking_id: str
    user_id: str
    worker_id: str
    customer_details: Dict
    worker_details: Dict
    service_details: Dict
    booking_details: Dict
    amount: Dict  # {subtotal, tax, total}
    status: str = "generated"
    created_at: Optional[str] = None
