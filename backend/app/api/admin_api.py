from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from ..db.firebase import FirebaseDB
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])

async def require_admin(user=Depends(get_current_user)):
    profile = await FirebaseDB.get_document("users", user["uid"])
    if not profile or profile.get("user_type") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/stats")
async def get_admin_stats(user=Depends(require_admin)):
    users = await FirebaseDB.get_all("users")
    services = await FirebaseDB.get_all("services")
    jobs = await FirebaseDB.query_collection("jobs", "is_active", "==", True)
    gigs = await FirebaseDB.query_collection("gigs", "status", "==", "active")
    bookings = await FirebaseDB.get_all("bookings")
    payments = await FirebaseDB.query_collection("payments", "status", "==", "paid")
    total_revenue = sum(p.get("amount", 0) for p in payments)
    return {
        "total_users": len(users),
        "total_services": len(services),
        "total_jobs": len(jobs),
        "total_gigs": len(gigs),
        "total_bookings": len(bookings),
        "total_payments": len(payments),
        "total_revenue": total_revenue,
        "monthly_data": [
            {"month": "Jan", "bookings": 12, "revenue": 45000},
            {"month": "Feb", "bookings": 18, "revenue": 67000},
            {"month": "Mar", "bookings": 25, "revenue": 89000},
            {"month": "Apr", "bookings": 31, "revenue": 112000},
            {"month": "May", "bookings": 38, "revenue": 138000},
            {"month": "Jun", "bookings": 45, "revenue": 165000},
        ]
    }

@router.get("/users")
async def get_all_users(user=Depends(require_admin)):
    return await FirebaseDB.get_all("users")

@router.put("/users/{user_id}/suspend")
async def toggle_user_suspension(user_id: str, suspend: bool = True, user=Depends(require_admin)):
    await FirebaseDB.update_document("users", user_id, {"suspended": suspend})
    action = "suspended" if suspend else "unsuspended"
    return {"message": f"User {action}"}

@router.put("/users/{user_id}/type")
async def change_user_type(user_id: str, user_type: str, user=Depends(require_admin)):
    await FirebaseDB.update_document("users", user_id, {"user_type": user_type})
    return {"message": f"User type changed to {user_type}"}

@router.delete("/services/{service_id}")
async def admin_delete_service(service_id: str, user=Depends(require_admin)):
    await FirebaseDB.update_document("services", service_id, {"is_active": False})
    return {"message": "Service removed"}
