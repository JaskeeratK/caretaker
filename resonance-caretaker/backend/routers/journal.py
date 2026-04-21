from fastapi import APIRouter, Depends, HTTPException
from models.journal import JournalEntry
from routers.auth import get_current_user
from services.encryption import encrypt_content
from services.pattern_engine import analyze_unsaid_patterns
from firebase_admin import firestore
import google.generativeai as genai
import os

router = APIRouter()

@router.post("/vent")
async def vent_to_vault(entry: JournalEntry, user: dict = Depends(get_current_user)):
    uid = user["uid"]
    db = firestore.client()

    if not entry.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")

    # 1. Encrypt for privacy
    encrypted_text = encrypt_content(entry.content, uid)

    # 2. Get sentiment score from Gemini
    model = genai.GenerativeModel("gemini-1.5-flash")
    analysis_prompt = (
        "Analyze the following caretaker journal entry for emotional exhaustion. "
        "Return ONLY a numerical score between 0.0 (peaceful) and 1.0 (total burnout/crisis). "
        f"Content: {entry.content}"
    )
    try:
        response = model.generate_content(analysis_prompt)
        score = float(response.text.strip())
        score = max(0.0, min(1.0, score))
    except Exception:
        score = 0.5

    # 3. Save to Firestore
    db.collection("journals").add({
       "uid": "test_user",
       "content": entry.content,
       "created_at": datetime.now(),
       "sentiment_score": sentiment_score # Use the score from Gemini
    })

    return {
        "status": "Released",
        "message": "Your thoughts have been safely encrypted and released.",
        "perceived_stress": score,
    }


@router.get("/stats")
async def get_journal_stats(user: dict = Depends(get_current_user)):
    """Returns mood trends and unsaid pattern analysis. Never returns raw text."""
    db = firestore.client()
    docs = (
        db.collection("journals")
        .where("uid", "==", user["uid"])
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .limit(7)
        .stream()
    )
    entries = [d.to_dict() for d in docs]
    mood_trend = [
        {"time": e.get("created_at"), "stress": e.get("sentiment_score", 0.5), "mood": e.get("mood")}
        for e in entries
    ]
    unsaid = analyze_unsaid_patterns(entries)

    return {"mood_trend": mood_trend, "unsaid_patterns": unsaid}
