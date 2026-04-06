from typing import List, Dict
from ..db.firebase import FirebaseDB
from ..utils.helpers import calculate_distance, score_worker

class MatchingService:
    @staticmethod
    async def match_workers(service_type: str, location: Dict, max_distance: float = 15) -> List[Dict]:
        """Match and score workers - simple algorithm, no ML"""
        workers = await FirebaseDB.query_collection("workers", "availability", "==", True)
        
        matched = []
        user_lat = location.get("lat", 0)
        user_lng = location.get("lng", 0)

        for worker in workers:
            # Check skill match
            skills = [s.lower() for s in worker.get("skills", [])]
            if service_type.lower() not in skills and service_type.lower() not in " ".join(skills):
                continue

            # Calculate distance
            worker_lat = worker.get("lat", user_lat)
            worker_lng = worker.get("lng", user_lng)
            dist = calculate_distance(user_lat, user_lng, worker_lat, worker_lng)

            if dist <= max_distance:
                worker["distance"] = round(dist, 2)
                worker["match_score"] = score_worker(worker, max_distance)
                matched.append(worker)

        matched.sort(key=lambda w: w["match_score"], reverse=True)
        return matched[:5]

    @staticmethod
    async def recommend_jobs(user_skills: List[str], user_location: str) -> List[Dict]:
        """Simple job recommendation based on skill overlap"""
        jobs = await FirebaseDB.query_collection("jobs", "is_active", "==", True)
        scored = []
        for job in jobs:
            job_skills = [s.lower() for s in job.get("skills_required", [])]
            user_skills_lower = [s.lower() for s in user_skills]
            overlap = len(set(job_skills) & set(user_skills_lower))
            score = overlap / max(len(job_skills), 1) * 100
            location_bonus = 10 if job.get("location", "").lower() == user_location.lower() else 0
            job["recommendation_score"] = round(score + location_bonus, 2)
            scored.append(job)
        scored.sort(key=lambda j: j["recommendation_score"], reverse=True)
        return scored[:10]
