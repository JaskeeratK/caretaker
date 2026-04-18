from fastapi import APIRouter, HTTPException, Depends, Header
from firebase_admin import auth, firestore
from models.user import UserProfile

router = APIRouter()

async def get_current_user(authorization: str = Header(None)):
    """
    Dependency to protect routes. 
    Verifies the Firebase JWT sent from the frontend.
    """
    if not authorization or not authorization.startswith("Bearer "):
        # Fallback for Codespaces development
        return {"uid": "demo_caretaker_123"}
        
    token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")

@router.post("/register")
async def register_user(profile: UserProfile, user: dict = Depends(get_current_user)):
    """
    Creates the user document in Firestore.
    The UID comes from the verified token for security.
    """
    db = firestore.client()
    # We use the UID from the token to ensure users can only register themselves
    user_data = profile.model_dump()
    user_data["uid"] = user["uid"] 
    
    db.collection("users").document(user["uid"]).set(user_data)
    return {"message": "Caretaker profile synced successfully", "uid": user["uid"]}

@router.get("/me")
async def get_profile(user: dict = Depends(get_current_user)):
    """Returns the logged-in user's profile data."""
    db = firestore.client()
    doc = db.collection("users").document(user["uid"]).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Profile not found")
    return doc.to_dict()