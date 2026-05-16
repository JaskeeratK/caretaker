from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.gemini import get_chat_response

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # 'user' or 'ai'
    text: str

class ChatMsg(BaseModel):
    message: str
    burnout_zone: str = "Unknown"
    journal_context: str = ""
    history: List[ChatMessage] = []

@router.post("/send")
async def chat_with_resonance(data: ChatMsg):
    print(f">>> chat received: {data.message}")
    reply = await get_chat_response(
        message=data.message,
        burnout_context=data.burnout_zone,
        journal_context=data.journal_context,
        history=data.history,
    )
    print(f">>> reply: {reply}")
    return {"reply": reply}