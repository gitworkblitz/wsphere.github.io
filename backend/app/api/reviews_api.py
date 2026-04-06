from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from ..db.firebase import FirebaseDB
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

class ReviewCreate(BaseModel):
    booking_id: str
    service_id: str
    worker_id: str
    rating: int
    comment: str = ""
    tags: List[str] = []

@router.post("/")
async def create_review(review: ReviewCreate, user=Depends(get_current_user)):
    """Create a review — only if booking is completed, no duplicates"""
    # Check booking exists and is completed
    booking = await FirebaseDB.get_document("bookings", review.booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.get("status") != "completed":
        raise HTTPException(status_code=400, detail="Can only review completed bookings")
    if booking.get("customer_id") != user["uid"]:
        raise HTTPException(status_code=403, detail="Only the customer can review")

    # Check for duplicate
    existing = await FirebaseDB.query_collection("reviews", "booking_id", "==", review.booking_id)
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this booking")

    # Validate rating
    if not (1 <= review.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # Get user profile for name
    user_profile = await FirebaseDB.get_document("users", user["uid"])

    review_data = {
        "booking_id": review.booking_id,
        "service_id": review.service_id,
        "worker_id": review.worker_id,
        "customer_id": user["uid"],
        "customer_name": user_profile.get("name", "") if user_profile else "",
        "rating": review.rating,
        "comment": review.comment,
        "tags": review.tags,
        "service_title": booking.get("service_title", ""),
        "service_type": booking.get("category", booking.get("service_title", "")),
        "created_at": datetime.utcnow().isoformat(),
    }

    review_id = await FirebaseDB.create_document("reviews", review_data)
    review_data["id"] = review_id

    # Update service rating average
    if review.service_id:
        service_reviews = await FirebaseDB.query_collection("reviews", "service_id", "==", review.service_id)
        if service_reviews:
            avg_rating = sum(r.get("rating", 0) for r in service_reviews) / len(service_reviews)
            await FirebaseDB.update_document("services", review.service_id, {
                "rating": round(avg_rating, 1),
                "total_reviews": len(service_reviews),
            })

    return review_data

@router.get("/service/{service_id}")
async def get_service_reviews(service_id: str):
    """Get all reviews for a service"""
    reviews = await FirebaseDB.query_collection("reviews", "service_id", "==", service_id)
    return sorted(reviews, key=lambda r: r.get("created_at", ""), reverse=True)

@router.get("/public")
async def get_public_testimonials():
    """Get reviews with rating >= 4 for homepage testimonials"""
    all_reviews = await FirebaseDB.get_all("reviews")
    testimonials = [r for r in all_reviews if r.get("rating", 0) >= 4]
    testimonials.sort(key=lambda r: r.get("rating", 0), reverse=True)
    return testimonials[:6]

@router.get("/worker/{worker_id}")
async def get_worker_reviews(worker_id: str):
    """Get all reviews for a worker"""
    reviews = await FirebaseDB.query_collection("reviews", "worker_id", "==", worker_id)
    return sorted(reviews, key=lambda r: r.get("created_at", ""), reverse=True)

@router.get("/all")
async def get_all_reviews(user=Depends(get_current_user)):
    """Get all reviews — admin only"""
    user_profile = await FirebaseDB.get_document("users", user["uid"])
    if not user_profile or user_profile.get("user_type") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    all_reviews = await FirebaseDB.get_all("reviews")
    return sorted(all_reviews, key=lambda r: r.get("created_at", ""), reverse=True)

@router.delete("/{review_id}")
async def delete_review(review_id: str, user=Depends(get_current_user)):
    """Delete a review — admin only"""
    user_profile = await FirebaseDB.get_document("users", user["uid"])
    if not user_profile or user_profile.get("user_type") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    review = await FirebaseDB.get_document("reviews", review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    await FirebaseDB.delete_document("reviews", review_id)

    # Recalculate service rating after deletion
    service_id = review.get("service_id")
    if service_id:
        remaining = await FirebaseDB.query_collection("reviews", "service_id", "==", service_id)
        if remaining:
            avg_rating = sum(r.get("rating", 0) for r in remaining) / len(remaining)
            await FirebaseDB.update_document("services", service_id, {
                "rating": round(avg_rating, 1),
                "total_reviews": len(remaining),
            })
        else:
            await FirebaseDB.update_document("services", service_id, {
                "rating": 0,
                "total_reviews": 0,
            })

    return {"message": "Review deleted", "id": review_id}
