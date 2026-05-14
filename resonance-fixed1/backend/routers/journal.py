from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.encryption import encrypt, decrypt  
from firebase_admin import firestore
from datetime import datetime
import os

router = APIRouter()

class JournalEntry(BaseModel):
    content: str
    mood: Optional[int] = 3
    user_email: Optional[str] = None
    user_name: Optional[str] = None

@router.post("/vent")
async def vent_to_vault(entry: JournalEntry):
    if not entry.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    uid = entry.user_email.replace("@", "_").replace(".", "_") if entry.user_email else "demo_user"
    sentiment_score = (5 - (entry.mood or 3)) / 4.0
    try:
        db = firestore.client()
        db.collection("journals").add({
            "uid": uid,
            "user_email": entry.user_email or "",
            "content": encrypt(entry.content),  # ← encrypted
            "mood": entry.mood or 3,
            "created_at": datetime.now(),
            "sentiment_score": round(sentiment_score, 2),
        })
    except Exception as e:
        print(f"Firestore error: {e}")
    return {"status": "Released", "message": "Your thoughts have been safely stored.", "perceived_stress": sentiment_score}

@router.get("/stats")
async def get_journal_stats(user_email: str = ""):
    uid = ...  # same as before
    try:
        db = firestore.client()
        docs = db.collection("journals").where("uid", "==", uid).order_by("created_at", direction=firestore.Query.DESCENDING).limit(7).stream()
        entries = []
        for d in docs:
            data = d.to_dict()
            try:
                data["content"] = decrypt(data["content"])  # ← decrypted on read
            except Exception:
                data["content"] = "[unreadable]"  # handles legacy unencrypted entries
            entries.append(data)
    except Exception as e:
        print(f"Stats error: {e}")
        entries = []

    mood_trend = [{"time": str(e.get("created_at", "")), "stress": e.get("sentiment_score", 0.5)} for e in entries]
    return {"mood_trend": mood_trend, "count": len(entries)}

@router.get("/entries")
async def get_entries(user_email: str = ""):
    uid = user_email.replace("@", "_").replace(".", "_") if user_email else "demo_user"
    try:
        db = firestore.client()
        docs = db.collection("journals").where("uid", "==", uid).order_by("created_at", direction=firestore.Query.DESCENDING).limit(20).stream()
        entries = []
        for d in docs:
            data = d.to_dict()
            try:
                data["content"] = decrypt(data["content"])
            except Exception:
                data["content"] = "[unreadable]"
            entries.append({
                "text": data["content"],
                "mood": data.get("mood", 3),
                "moodLabel": next((m["label"] for m in [
                    {"score": 1, "label": "Overwhelmed"}, {"score": 2, "label": "Heavy"},
                    {"score": 3, "label": "Okay"}, {"score": 4, "label": "Lighter"},
                    {"score": 5, "label": "Grateful"}
                ] if m["score"] == data.get("mood")), "Okay"),
                "date": data.get("created_at", "").strftime("%a, %d %b") if hasattr(data.get("created_at", ""), "strftime") else "",
                "ts": data.get("created_at", "").timestamp() * 1000 if hasattr(data.get("created_at", ""), "timestamp") else 0,
            })
        return {"entries": entries}
    except Exception as e:
        print(f"Entries error: {e}")
        return {"entries": []}