from fastapi import APIRouter
from services.gemini import get_chat_response
from pydantic import BaseModel

router = APIRouter()

class ChatMsg(BaseModel):
    message: str
    burnout_zone: str = "Unknown"

@router.post("/send")
async def chat_with_resonance(data: ChatMsg):
    reply = await get_chat_response(data.message, data.burnout_zone)
    return {"reply": reply}