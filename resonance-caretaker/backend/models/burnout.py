from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class BurnoutScoreResponse(BaseModel):
    score: float
    zone: str
    narrative: str
    last_updated: datetime = datetime.utcnow()

class BurnoutHistory(BaseModel):
    history: List[BurnoutScoreResponse]