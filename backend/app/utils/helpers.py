from datetime import datetime
import random
import string
import math

def generate_invoice_number() -> str:
    ts = datetime.now().strftime('%Y%m%d%H%M%S')
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"INV-{ts}-{suffix}"

def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Haversine distance in km"""
    R = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lng2 - lng1)
    a = (math.sin(d_lat/2)**2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon/2)**2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def format_currency_inr(amount: float) -> str:
    return f"₹{amount:,.2f}"

def calculate_gst(amount: float, rate: float = 0.18) -> dict:
    tax = round(amount * rate, 2)
    return {"subtotal": amount, "tax": tax, "total": round(amount + tax, 2)}

def score_worker(worker: dict, max_distance: float = 10.0) -> float:
    """Simple worker scoring (0-100) - no ML required"""
    score = 0.0
    rating = worker.get("rating", 0)
    experience = worker.get("experience_years", 0)
    distance = worker.get("distance", max_distance)
    completion_rate = worker.get("completion_rate", 100)

    score += (rating / 5.0) * 35
    score += min(experience / 10.0, 1.0) * 25
    score += (1 - min(distance / max_distance, 1.0)) * 20
    score += (completion_rate / 100.0) * 20
    return round(score, 2)
