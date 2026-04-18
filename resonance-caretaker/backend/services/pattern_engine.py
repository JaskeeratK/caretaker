"""
pattern_engine.py — The Unsaid Layer

Detects what caretakers don't say outright:
  - suppressed_emotion: positive tone + low mood score
  - repetition_loop:    same themes recurring across entries
  - emotional_drop:     mood declining while language stays neutral
"""

SOFTENING_WORDS = {"fine", "okay", "alright", "managing", "coping", "not bad", "getting by"}
DISTRESS_THEMES = {"tired", "exhausted", "alone", "invisible", "guilty", "resentful", "overwhelmed", "can't", "difficult"}

def _tokenize(text: str) -> set:
    return set(text.lower().replace(",", "").replace(".", "").split())

def analyze_unsaid_patterns(entries: list) -> list:
    """
    Takes a list of Firestore journal dicts (already anonymised, no raw text needed).
    Each dict should have: sentiment_score (float), mood (int 1-5), created_at.

    Returns a list of detected pattern dicts.
    """
    patterns = []

    if len(entries) < 2:
        return patterns

    scores = [e.get("sentiment_score", 0.5) for e in entries]
    moods = [e.get("mood") for e in entries if e.get("mood") is not None]

    # 1. Suppressed emotion: high stress score but mood reported as 3+
    suppressed = sum(
        1 for e in entries
        if e.get("sentiment_score", 0.5) > 0.6 and (e.get("mood") or 3) >= 3
    )
    if suppressed >= 2:
        patterns.append({
            "type": "suppressed_emotion",
            "label": "Suppressed emotion",
            "insight": (
                "You often describe things as 'fine' or 'okay' on days where your stress "
                "indicators were highest. It looks like you might be holding more than you're letting yourself say."
            ),
            "evidence": f"Detected in {suppressed} of your last {len(entries)} entries",
        })

    # 2. Repetition loop: mood stays consistently low (<=2) across 3+ entries
    low_mood_streak = sum(1 for m in moods if m <= 2)
    if low_mood_streak >= 3:
        patterns.append({
            "type": "repetition_loop",
            "label": "Repetition loop",
            "insight": (
                "The theme of feeling overwhelmed keeps surfacing — across different days, in different words. "
                "This isn't just venting. It's a signal that something persistent needs attention."
            ),
            "evidence": f"Low mood reported {low_mood_streak} times in recent entries",
        })

    # 3. Emotional drop: mood declining while stress stays moderate
    if len(moods) >= 3:
        recent_trend = moods[:3]
        is_declining = recent_trend[0] < recent_trend[-1]   # most recent < oldest
        avg_stress = sum(scores[:3]) / 3
        if is_declining and 0.3 < avg_stress < 0.7:
            patterns.append({
                "type": "emotional_drop",
                "label": "Emotional drop",
                "insight": (
                    "Your mood has been declining while your language stays neutral or reassuring. "
                    "That gap — between how things sound and how they actually feel — is worth paying attention to."
                ),
                "evidence": "Declining mood trend vs. moderate stress language detected",
            })

    return patterns
