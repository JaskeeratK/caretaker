from fastapi import APIRouter, Depends
from services.burnout_engine import calculate_burnout_index
from firebase_admin import firestore
from models.checkin import DailyCheckIn

router = APIRouter()

@router.post("/checkin")
async def save_checkin(data: DailyCheckIn, uid: str = "demo_user"):
    db = firestore.client()
    db.collection("checkins").add({**data.model_dump(), "uid": uid, "timestamp": firestore.SERVER_TIMESTAMP})
    return {"status": "success"}

@router.get("/score")
async def get_score(uid: str = "demo_user"):
    db = firestore.client()
    # In a real app, query last 7 days. For MVP, just get all.
    docs = db.collection("checkins").where("uid", "==", uid).stream()
    checkins = [d.to_dict() for d in docs]
    return calculate_burnout_index(checkins, [])