from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from ..models.payment_model import PaymentCreate, PaymentVerify
from ..db.firebase import FirebaseDB
from ..services.payment_service import PaymentService
from ..utils.security import get_current_user
import os

router = APIRouter(prefix="/api/payments", tags=["payments"])

@router.post("/create-order")
async def create_payment_order(data: PaymentCreate, user=Depends(get_current_user)):
    """Create Razorpay order (returns mock in dev mode)"""
    # Mock order for development (replace with real Razorpay in production)
    import time, random
    order_id = f"order_{int(time.time())}_{random.randint(1000, 9999)}"
    
    payment = await PaymentService.create_payment_record(
        booking_id=data.booking_id,
        user_id=user["uid"],
        amount=data.amount,
        order_id=order_id
    )
    
    return {
        "order_id": order_id,
        "amount": data.amount,
        "currency": "INR",
        "key_id": os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholder"),
        "payment_id": payment["id"]
    }

@router.post("/verify")
async def verify_payment(data: PaymentVerify, user=Depends(get_current_user)):
    """Verify and complete payment"""
    success = await PaymentService.mark_paid(
        order_id=data.razorpay_order_id,
        payment_id=data.razorpay_payment_id,
        booking_id=data.booking_id
    )
    if not success:
        raise HTTPException(status_code=400, detail="Payment verification failed")
    return {"success": True, "message": "Payment verified and invoice generated"}

@router.get("/my")
async def get_my_payments(user=Depends(get_current_user)):
    payments = await PaymentService.get_user_payments(user["uid"])
    return sorted(payments, key=lambda x: x.get("created_at", ""), reverse=True)
