from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini import get_chat_response

router = APIRouter()

class ChatMsg(BaseModel):
    message: str
    burnout_zone: str = "Unknown"
    journal_context: str = ""   # Recent journal entries passed from frontend

@router.post("/send")
async def chat_with_resonance(data: ChatMsg):
    reply = await get_chat_response(
        message=data.message,
        burnout_context=data.burnout_zone,
        journal_context=data.journal_context,
    )
    return {"reply": reply}
