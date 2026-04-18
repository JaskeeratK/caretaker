from pydantic import BaseModel

class DailyCheckIn(BaseModel):
    sleep_quality: int  # 1-5
    physical_exhaustion: int # 1-5
    patient_status: str # stable, challenging, crisis
    was_invisible: bool
    had_me_time: bool