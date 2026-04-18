from pydantic import BaseModel
from typing import Optional

class UserProfile(BaseModel):
    uid: str
    nickname: str
    care_context: str # e.g., "Parent", "Spouse", "Professional"
    years_caregiving: int