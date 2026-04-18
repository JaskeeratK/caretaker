from fastapi import APIRouter, Depends, HTTPException
from models.journal import JournalEntry
from routers.auth import get_current_user
from services.encryption import encrypt_content
from services.gemini import get_chat_response # Or use a specific analysis function
from firebase_admin import firestore
import google.generativeai as genai
import os

router = APIRouter()

@router.post("/vent")
async def vent_to_vault(entry: JournalEntry, user: dict = Depends(get_current_user)):
    uid = user["uid"]
    db = firestore.client()

    if not entry.content.strip():
        raise HTTPException(status_code=400, detail="Venting content cannot be empty")

    # 1. Encryption (Privacy first)
    encrypted_text = encrypt_content(entry.content, uid)

    # 2. Extract Sentiment Score for the Burnout Index
    # We ask Gemini to return a simple float so we don't store the raw text
    model = genai.GenerativeModel('gemini-1.5-flash')
    analysis_prompt = (
        f"Analyze the following caretaker journal entry for emotional exhaustion. "
        f"Return ONLY a numerical score between 0.0 (peaceful) and 1.0 (total burnout/crisis). "
        f"Content: {entry.content}"
    )
    
    try:
        response = model.generate_content(analysis_prompt)
        # Clean the response to ensure it's just a number
        score = float(response.text.strip())
    except:
        score = 0.5 # Neutral fallback

    # 3. Save to Firestore
    journal_data = {
        "uid": uid,
        "encrypted_note": encrypted_text,
        "sentiment_score": score,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    
    db.collection("journals").add(journal_data)
    
    return {
        "status": "Released", 
        "message": "Your thoughts have been safely encrypted and released.",
        "perceived_stress": score
    }

@router.get("/stats")
async def get_journal_history(user: dict = Depends(get_current_user)):
    """Returns only the stress trends, never the raw text."""
    db = firestore.client()
    docs = db.collection("journals") \
             .where("uid", "==", user["uid"]) \
             .order_by("created_at", direction=firestore.Query.DESCENDING) \
             .limit(7) \
             .stream()
             
    return [{"time": d.to_dict()["created_at"], "stress": d.to_dict()["sentiment_score"]} for d in docs]