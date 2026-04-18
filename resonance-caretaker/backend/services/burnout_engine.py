from datetime import datetime, timedelta

def calculate_burnout_index(checkins: list, journal_sentiments: list):
    """
    Calculates the 'Second Patient' Index (0-100).
    Logic: High vigilance (poor sleep + patient crisis) drives the score up.
    """
    score = 20.0  # Baseline stress
    
    if not checkins:
        return {"score": score, "zone": "Stable", "narrative": "Need more data to assess."}

    # Weighting recent signals
    recent_checkins = checkins[-3:] # Last 3 days
    
    for c in recent_checkins:
        if c['sleep_quality'] < 3: score += 10
        if c['physical_exhaustion'] > 3: score += 10
        if c['patient_status'] == "crisis": score += 15
        if c['was_invisible']: score += 5
        if not c['had_me_time']: score += 5

    # Cap at 100
    final_score = min(score, 100)
    
    if final_score > 75:
        zone = "Critical Burnout"
        narrative = "You're running on empty. It's time to call in backup if possible."
    elif final_score > 40:
        zone = "Warning"
        narrative = "The weight is getting heavy. Try to find 10 minutes for yourself today."
    else:
        zone = "Stable"
        narrative = "You are maintaining a steady pace, but don't forget to breathe."

    return {
        "score": final_score,
        "zone": zone,
        "narrative": narrative
    }