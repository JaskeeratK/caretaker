def calculate_burnout_index(checkins: list, journal_sentiments: list) -> dict:
    """
    Calculates the Resonance Burnout Index (0–100).
    Weighs recent check-in signals and journal sentiment scores.
    """
    score = 20.0  # Baseline

    if not checkins and not journal_sentiments:
        return {
            "score": score,
            "zone": "Stable",
            "narrative": "Complete a daily check-in to see your burnout index.",
        }

    # Check-in signals (last 3 days)
    for c in checkins[-3:]:
        if c.get("sleep_quality", 3) < 3:
            score += 10
        if c.get("physical_exhaustion", 3) > 3:
            score += 10
        if c.get("patient_status") == "crisis":
            score += 15
        elif c.get("patient_status") == "needs-extra":
            score += 7
        if c.get("was_invisible"):
            score += 5
        if not c.get("had_me_time"):
            score += 5

    # Journal sentiment signals (last 7 days)
    if journal_sentiments:
        avg_sentiment = sum(journal_sentiments) / len(journal_sentiments)
        score += avg_sentiment * 20  # Max +20 from journal

    final_score = round(min(score, 100))

    if final_score > 75:
        zone = "Critical Burnout"
        narrative = "You're running on empty. It's time to call in backup if at all possible. You matter too."
    elif final_score > 40:
        zone = "Warning"
        narrative = "The weight is getting heavy. Try to find even 10 minutes for yourself today."
    else:
        zone = "Stable"
        narrative = "You are maintaining a steady pace. Don't forget to breathe. You're doing more than you know."

    return {"score": final_score, "zone": zone, "narrative": narrative}
