from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from ..models.user_model import UserUpdate, UserProfile
from ..db.firebase import FirebaseDB
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me")
async def get_my_profile(user=Depends(get_current_user)):
    profile = await FirebaseDB.get_document("users", user["uid"])
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.post("/me")
async def create_or_update_profile(profile: UserProfile, user=Depends(get_current_user)):
    data = profile.dict()
    data["uid"] = user["uid"]
    data["updated_at"] = datetime.utcnow().isoformat()
    await FirebaseDB.create_document("users", data, user["uid"])
    return {"message": "Profile saved"}

@router.put("/me")
async def update_my_profile(update: UserUpdate, user=Depends(get_current_user)):
    data = {k: v for k, v in update.dict().items() if v is not None}
    data["updated_at"] = datetime.utcnow().isoformat()
    await FirebaseDB.update_document("users", user["uid"], data)
    return {"message": "Profile updated"}

@router.get("/{user_id}")
async def get_user(user_id: str):
    profile = await FirebaseDB.get_document("users", user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    return profile
