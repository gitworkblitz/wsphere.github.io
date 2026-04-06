from fastapi import APIRouter, HTTPException, Depends
from ..models.booking_model import BookingCreate, BookingStatusUpdate
from ..db.firebase import FirebaseDB
from ..services.booking_service import BookingService
from ..services.invoice_service import InvoiceService
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

@router.get("/slots/{worker_id}/{date}")
async def get_available_slots(worker_id: str, date: str):
    all_slots = BookingService.generate_time_slots()
    booked = await BookingService.get_booked_slots(worker_id, date)
    available = [s for s in all_slots if s not in booked]
    return {"slots": available, "booked": booked}

@router.post("/")
async def create_booking(booking: BookingCreate, user=Depends(get_current_user)):
    data = booking.dict()
    data["customer_id"] = user["uid"]
    result = await BookingService.create_booking(data)
    return result

@router.get("/my")
async def get_my_bookings(user=Depends(get_current_user)):
    as_customer = await FirebaseDB.query_collection("bookings", "customer_id", "==", user["uid"])
    as_worker = await FirebaseDB.query_collection("bookings", "worker_id", "==", user["uid"])
    # Merge and deduplicate
    seen = set()
    all_bookings = []
    for b in as_customer + as_worker:
        if b["id"] not in seen:
            seen.add(b["id"])
            all_bookings.append(b)
    return sorted(all_bookings, key=lambda x: x.get("created_at", ""), reverse=True)

@router.get("/{booking_id}")
async def get_booking(booking_id: str, user=Depends(get_current_user)):
    booking = await FirebaseDB.get_document("bookings", booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.put("/{booking_id}/status")
async def update_booking_status(booking_id: str, update: BookingStatusUpdate, user=Depends(get_current_user)):
    booking = await FirebaseDB.get_document("bookings", booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    allowed = booking.get("customer_id") == user["uid"] or booking.get("worker_id") == user["uid"]
    if not allowed:
        raise HTTPException(status_code=403, detail="Not authorized")
    await BookingService.update_status(booking_id, update.status)
    return {"message": f"Status updated to {update.status}"}

@router.get("/{booking_id}/invoice")
async def get_booking_invoice(booking_id: str, user=Depends(get_current_user)):
    invoices = await FirebaseDB.query_collection("invoices", "booking_id", "==", booking_id)
    if invoices:
        return invoices[0]
    # Generate if not exists
    invoice = await InvoiceService.generate_invoice(booking_id)
    return invoice
