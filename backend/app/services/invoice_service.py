from datetime import datetime
from ..db.firebase import FirebaseDB
from ..utils.helpers import generate_invoice_number, calculate_gst

class InvoiceService:
    @staticmethod
    async def generate_invoice(booking_id: str) -> dict:
        booking = await FirebaseDB.get_document("bookings", booking_id)
        if not booking:
            return None

        amounts = calculate_gst(booking.get("amount", 0))
        inv_num = generate_invoice_number()

        invoice_data = {
            "invoice_number": inv_num,
            "booking_id": booking_id,
            "user_id": booking.get("customer_id", ""),
            "worker_id": booking.get("worker_id", ""),
            "customer_details": {
                "name": booking.get("customer_name", ""),
                "address": booking.get("address", ""),
            },
            "worker_details": {
                "name": booking.get("worker_name", ""),
            },
            "service_details": {
                "title": booking.get("service_title", ""),
                "date": booking.get("booking_date", ""),
                "time_slot": booking.get("time_slot", ""),
            },
            "amount": amounts,
            "status": "generated",
            "created_at": datetime.utcnow().isoformat(),
        }
        inv_id = await FirebaseDB.create_document("invoices", invoice_data)
        invoice_data["id"] = inv_id
        return invoice_data

    @staticmethod
    async def get_user_invoices(user_id: str) -> list:
        return await FirebaseDB.query_collection("invoices", "user_id", "==", user_id)
