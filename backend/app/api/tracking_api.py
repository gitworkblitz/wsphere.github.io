from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends
from ..db.firebase import FirebaseDB
from ..utils.security import get_current_user
from datetime import datetime
import json

router = APIRouter(prefix="/api/tracking", tags=["tracking"])

# In-memory tracking sessions
tracking_sessions: dict = {}

@router.get("/{booking_id}")
async def get_tracking_info(booking_id: str, user=Depends(get_current_user)):
    booking = await FirebaseDB.get_document("bookings", booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    session = tracking_sessions.get(booking_id, {})
    return {
        "booking_id": booking_id,
        "status": booking.get("status"),
        "worker_location": session.get("location"),
        "last_update": session.get("last_update"),
        "estimated_arrival": session.get("estimated_arrival", "Calculating...")
    }

@router.post("/{booking_id}/location")
async def update_worker_location(booking_id: str, lat: float, lng: float, user=Depends(get_current_user)):
    tracking_sessions[booking_id] = {
        "location": {"lat": lat, "lng": lng},
        "worker_id": user["uid"],
        "last_update": datetime.utcnow().isoformat()
    }
    await FirebaseDB.update_document("bookings", booking_id, {
        "worker_location": {"lat": lat, "lng": lng}
    })
    return {"message": "Location updated"}
