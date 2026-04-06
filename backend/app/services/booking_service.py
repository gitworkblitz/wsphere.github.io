from datetime import datetime
from typing import List
from ..db.firebase import FirebaseDB

FIXED_TIME_SLOTS = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "2:00 PM - 4:00 PM",
]

class BookingService:
    @staticmethod
    def generate_time_slots() -> List[str]:
        return FIXED_TIME_SLOTS

    @staticmethod
    async def get_booked_slots(worker_id: str, date: str) -> List[str]:
        bookings = await FirebaseDB.query_multiple("bookings", [
            ("worker_id", "==", worker_id),
            ("booking_date", "==", date),
        ])
        return [b.get("time_slot") for b in bookings
                if b.get("status") in ("requested", "accepted", "on_the_way")]

    @staticmethod
    async def create_booking(data: dict) -> dict:
        data["created_at"] = datetime.utcnow().isoformat()
        data["updated_at"] = datetime.utcnow().isoformat()
        data["status"] = "requested"
        data["payment_status"] = "pending"
        booking_id = await FirebaseDB.create_document("bookings", data)
        data["id"] = booking_id
        return data

    @staticmethod
    async def update_status(booking_id: str, status: str) -> bool:
        valid_statuses = ["requested", "accepted", "on_the_way", "completed", "cancelled"]
        if status not in valid_statuses:
            return False
        return await FirebaseDB.update_document("bookings", booking_id, {
            "status": status,
            "updated_at": datetime.utcnow().isoformat()
        })
