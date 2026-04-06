from fastapi import APIRouter, HTTPException, Depends
from ..models.worker_model import WorkerCreate, Worker
from ..db.firebase import FirebaseDB
from ..services.matching_service import MatchingService
from ..utils.security import get_current_user, get_optional_user

router = APIRouter(prefix="/api/workers", tags=["workers"])

@router.get("/")
async def get_workers(skill: str = None):
    workers = await FirebaseDB.get_all("workers")
    if skill:
        workers = [w for w in workers if skill.lower() in [s.lower() for s in w.get("skills", [])]]
    return workers

@router.get("/{worker_id}")
async def get_worker(worker_id: str):
    worker = await FirebaseDB.get_document("workers", worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker

@router.post("/")
async def create_worker(worker: WorkerCreate, user=Depends(get_current_user)):
    data = worker.dict()
    data["user_id"] = user["uid"]
    data["rating"] = 0.0
    data["total_jobs"] = 0
    data["completion_rate"] = 100.0
    worker_id = await FirebaseDB.create_document("workers", data, user["uid"])
    return {"id": worker_id, "message": "Worker profile created"}

@router.post("/match")
async def match_workers(service_type: str, lat: float = 28.6139, lng: float = 77.2090):
    matched = await MatchingService.match_workers(service_type, {"lat": lat, "lng": lng})
    return {"workers": matched}

@router.put("/{worker_id}/availability")
async def toggle_availability(worker_id: str, available: bool, user=Depends(get_current_user)):
    await FirebaseDB.update_document("workers", worker_id, {"availability": available})
    return {"message": "Availability updated"}
