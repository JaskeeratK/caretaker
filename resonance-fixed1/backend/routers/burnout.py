from fastapi import APIRouter
from services.burnout_engine import calculate_burnout_index

router = APIRouter()

@router.get("/score")
async def get_score(user_email: str = ""):
    uid = user_email.replace("@", "_").replace(".", "_") if user_email else "demo_user"
    checkins = []
    sentiments = []
    try:
        from firebase_admin import firestore
        db = firestore.client()
        checkin_docs = (
            db.collection("checkins")
            .where("uid", "==", uid)
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
            .limit(7)
            .stream()
        )
        journal_docs = (
            db.collection("journals")
            .where("uid", "==", uid)
            .order_by("created_at", direction=firestore.Query.DESCENDING)
            .limit(7)
            .stream()
        )
        checkins = [d.to_dict() for d in checkin_docs]
        sentiments = [d.to_dict().get("sentiment_score", 0.5) for d in journal_docs]
    except Exception as e:
        print(f"Burnout fetch error: {e}")

    return calculate_burnout_index(checkins, sentiments)

@router.post("/checkin")
async def save_checkin(data: dict, user_email: str = ""):
    uid = user_email.replace("@", "_").replace(".", "_") if user_email else "demo_user"
    try:
        from firebase_admin import firestore
        db = firestore.client()
        db.collection("checkins").add({
            **data,
            "uid": uid,
            "timestamp": firestore.SERVER_TIMESTAMP,
        })
    except Exception as e:
        print(f"Checkin error: {e}")
    return {"status": "success"}