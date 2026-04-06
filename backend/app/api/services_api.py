from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from ..models.service_model import ServiceCreate, ServiceUpdate
from ..db.firebase import FirebaseDB
from ..utils.security import get_current_user, get_optional_user

router = APIRouter(prefix="/api/services", tags=["services"])

@router.get("/")
async def get_services(category: str = None, location: str = None):
    services = await FirebaseDB.get_all("services")
    active = [s for s in services if s.get("is_active", True)]
    if category:
        active = [s for s in active if s.get("category", "").lower() == category.lower()]
    if location:
        active = [s for s in active if location.lower() in s.get("location", "").lower()]
    return sorted(active, key=lambda x: x.get("created_at", ""), reverse=True)

@router.get("/{service_id}")
async def get_service(service_id: str):
    service = await FirebaseDB.get_document("services", service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/")
async def create_service(service: ServiceCreate, user=Depends(get_current_user)):
    data = service.dict()
    data["worker_id"] = user["uid"]
    data["rating"] = 0.0
    data["total_reviews"] = 0
    data["is_active"] = True
    data["created_at"] = datetime.utcnow().isoformat()
    service_id = await FirebaseDB.create_document("services", data)
    return {"id": service_id, "message": "Service created successfully"}

@router.put("/{service_id}")
async def update_service(service_id: str, update: ServiceUpdate, user=Depends(get_current_user)):
    service = await FirebaseDB.get_document("services", service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    if service.get("worker_id") != user["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    data = {k: v for k, v in update.dict().items() if v is not None}
    await FirebaseDB.update_document("services", service_id, data)
    return {"message": "Service updated"}

@router.delete("/{service_id}")
async def delete_service(service_id: str, user=Depends(get_current_user)):
    service = await FirebaseDB.get_document("services", service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    if service.get("worker_id") != user["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await FirebaseDB.update_document("services", service_id, {"is_active": False})
    return {"message": "Service deleted"}

@router.get("/worker/{worker_id}")
async def get_worker_services(worker_id: str):
    services = await FirebaseDB.query_collection("services", "worker_id", "==", worker_id)
    return services
