from pydantic import BaseModel
from datetime import datetime

class JournalEntry(BaseModel):
    content: str # Raw text from frontend

class JournalStored(BaseModel):
    uid: str
    encrypted_content: str
    sentiment_score: float
    created_at: datetime = datetime.utcnow()