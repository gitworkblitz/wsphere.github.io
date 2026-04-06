from datetime import datetime
from ..db.firebase import FirebaseDB
from ..services.invoice_service import InvoiceService

class PaymentService:
    @staticmethod
    async def create_payment_record(booking_id: str, user_id: str, amount: float, order_id: str) -> dict:
        data = {
            "booking_id": booking_id,
            "user_id": user_id,
            "amount": amount,
            "order_id": order_id,
            "status": "created",
            "created_at": datetime.utcnow().isoformat(),
        }
        pay_id = await FirebaseDB.create_document("payments", data)
        data["id"] = pay_id
        return data

    @staticmethod
    async def mark_paid(order_id: str, payment_id: str, booking_id: str) -> bool:
        # Update payment
        payments = await FirebaseDB.query_collection("payments", "order_id", "==", order_id)
        for p in payments:
            await FirebaseDB.update_document("payments", p["id"], {
                "status": "paid",
                "payment_id": payment_id,
                "paid_at": datetime.utcnow().isoformat()
            })
        # Update booking
        await FirebaseDB.update_document("bookings", booking_id, {
            "payment_status": "paid",
            "updated_at": datetime.utcnow().isoformat()
        })
        # Generate invoice
        await InvoiceService.generate_invoice(booking_id)
        return True

    @staticmethod
    async def get_user_payments(user_id: str) -> list:
        return await FirebaseDB.query_collection("payments", "user_id", "==", user_id)
