# import os
# import asyncio
# from pathlib import Path
# from dotenv import load_dotenv

# load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

# CARETAKER_SYSTEM_PROMPT = """
# You are Resonance. You are not a doctor or a therapist.
# You are a warm, grounded companion for someone caring for a chronically ill loved one.
# The user is likely exhausted, feeling guilty, and invisible to everyone around them.

# Guidelines:
# 1. Validate first, always. If they say they are tired, say "That makes so much sense."
# 2. Never suggest medical changes for the patient.
# 3. If they express resentment or anger, normalize it as part of the caretaking journey.
# 4. Keep responses under 3 short paragraphs.
# 5. If journal context is provided, reference it subtly — never quote it verbatim.
# 6. Be warm and human, not clinical.
# 7. Respond directly to what the user actually said — never give a generic response.
# """

# FALLBACK_RESPONSES = [
#     "That makes so much sense. What you're carrying is invisible to most people, but it's very real.",
#     "You don't have to explain yourself here. What you're feeling is completely normal.",
#     "It's okay to feel angry, or resentful, or just completely done. Those feelings don't make you a bad caretaker.",
#     "Take a slow breath. You are doing something incredibly hard, and you deserve care too.",
#     "I hear you. Is there one small thing — even tiny — you could do for yourself today?",
# ]
# import google.generativeai as genai
# def _call_gemini(prompt: str) -> str:
#     api_key = os.getenv("GEMINI_API_KEY")
#     if not api_key:
#         raise Exception("No API key")
#     genai.configure(api_key=api_key)
#     model = genai.GenerativeModel(
#         model_name="gemini-2.5-flash",
#         system_instruction=CARETAKER_SYSTEM_PROMPT
#     )
#     response = model.generate_content(prompt)
#     return response.text

# async def get_chat_response(message: str, burnout_context: str, journal_context: str = "") -> str:
#     context_block = f"\n[Recent journal context:\n{journal_context}]" if journal_context else ""
#     full_prompt = f"[User burnout zone: {burnout_context}]{context_block}\nUser says: {message}"
#     try:
#         result = await asyncio.to_thread(_call_gemini, full_prompt)
#         return result
#     except Exception as e:
#         print(f"Gemini error: {e}")
#         import random
#         return FALLBACK_RESPONSES[random.randint(0, len(FALLBACK_RESPONSES) - 1)]
import os
import asyncio
from typing import List
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

CARETAKER_SYSTEM_PROMPT = """
You are Resonance. You are not a doctor or a therapist.
You are a warm, grounded companion for someone caring for a chronically ill loved one.

Guidelines:
1. Validate first, but vary how you do it — never repeat the same phrase twice.
2. Never say "Oh, my dear", "my heart goes out to you", or other dramatic phrases.
3. Never suggest medical changes for the patient.
4. Keep responses to 2-3 SHORT sentences max. Less is more.
5. If journal context is provided, reference it subtly — never quote it verbatim.
6. Sound like a calm, warm friend — not a therapist or a chatbot.
7. Respond directly to what the user said. Never be generic.
8. Remember details shared earlier — names, situations, conditions. Check in subtly.
9. Never end with "I'll be here whenever you need me" type phrases. Just be present.
"""

FALLBACK_RESPONSES = [
    "That makes so much sense. What you're carrying is invisible to most people, but it's very real.",
    "You don't have to explain yourself here. What you're feeling is completely normal.",
    "It's okay to feel angry, or resentful, or just completely done. Those feelings don't make you a bad caretaker.",
    "Take a slow breath. You are doing something incredibly hard, and you deserve care too.",
    "I hear you. Is there one small thing — even tiny — you could do for yourself today?",
]

def _call_gemini_with_history(history_contents: list, system_prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("No API key")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=system_prompt
    )
    chat = model.start_chat(history=history_contents[:-1])  # all but last
    response = chat.send_message(history_contents[-1]["parts"][0])
    return response.text

async def get_chat_response(message: str, burnout_context: str, journal_context: str = "", history: list = []) -> str:
    context_block = f"\n[Recent journal context:\n{journal_context}]" if journal_context else ""
    system = CARETAKER_SYSTEM_PROMPT + f"\n[User burnout zone: {burnout_context}]{context_block}"

    # Build Gemini-format history
    gemini_history = []
    for msg in history:
        role = "user" if msg.role == "user" else "model"
        gemini_history.append({"role": role, "parts": [msg.text]})

    # Add current message at end
    gemini_history.append({"role": "user", "parts": [message]})

    try:
        result = await asyncio.to_thread(_call_gemini_with_history, gemini_history, system)
        return result
    except Exception as e:
        print(f"Gemini error: {e}")
        import random
        return FALLBACK_RESPONSES[random.randint(0, len(FALLBACK_RESPONSES) - 1)]