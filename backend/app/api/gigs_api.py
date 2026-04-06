from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from ..models.gig_model import GigCreate, GigProposal
from ..db.firebase import FirebaseDB
from ..utils.security import get_current_user, get_optional_user

router = APIRouter(prefix="/api/gigs", tags=["gigs"])

@router.get("/")
async def get_gigs(category: str = None):
    gigs = await FirebaseDB.query_collection("gigs", "status", "==", "active")
    if category:
        gigs = [g for g in gigs if g.get("category", "").lower() == category.lower()]
    return sorted(gigs, key=lambda x: x.get("posted_date", ""), reverse=True)

@router.get("/{gig_id}")
async def get_gig(gig_id: str):
    gig = await FirebaseDB.get_document("gigs", gig_id)
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")
    return gig

@router.post("/")
async def create_gig(gig: GigCreate, user=Depends(get_current_user)):
    data = gig.dict()
    data["freelancer_id"] = user["uid"]
    data["status"] = "active"
    data["orders_count"] = 0
    data["rating"] = 0.0
    data["posted_date"] = datetime.utcnow().isoformat()
    gig_id = await FirebaseDB.create_document("gigs", data)
    return {"id": gig_id, "message": "Gig created successfully"}

@router.post("/{gig_id}/propose")
async def propose_for_gig(gig_id: str, proposal: GigProposal, user=Depends(get_current_user)):
    gig = await FirebaseDB.get_document("gigs", gig_id)
    if not gig or gig.get("status") != "active":
        raise HTTPException(status_code=400, detail="Gig not available")
    data = proposal.dict()
    data["worker_id"] = user["uid"]
    data["status"] = "pending"
    data["submitted_at"] = datetime.utcnow().isoformat()
    prop_id = await FirebaseDB.create_document("gig_proposals", data)
    return {"id": prop_id, "message": "Proposal submitted"}

@router.get("/my/gigs")
async def get_my_gigs(user=Depends(get_current_user)):
    return await FirebaseDB.query_collection("gigs", "freelancer_id", "==", user["uid"])

@router.put("/{gig_id}")
async def update_gig(gig_id: str, data: dict, user=Depends(get_current_user)):
    gig = await FirebaseDB.get_document("gigs", gig_id)
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")
    if gig.get("freelancer_id") != user["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await FirebaseDB.update_document("gigs", gig_id, data)
    return {"message": "Gig updated"}
