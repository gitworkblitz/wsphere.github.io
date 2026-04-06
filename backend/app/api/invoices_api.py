from fastapi import APIRouter, HTTPException, Depends
from ..db.firebase import FirebaseDB
from ..services.invoice_service import InvoiceService
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/invoices", tags=["invoices"])

@router.get("/my")
async def get_my_invoices(user=Depends(get_current_user)):
    invoices = await InvoiceService.get_user_invoices(user["uid"])
    return sorted(invoices, key=lambda x: x.get("created_at", ""), reverse=True)

@router.get("/{invoice_id}")
async def get_invoice(invoice_id: str, user=Depends(get_current_user)):
    invoice = await FirebaseDB.get_document("invoices", invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice
