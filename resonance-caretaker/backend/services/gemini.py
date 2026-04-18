import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

CARETAKER_SYSTEM_PROMPT = """
You are Resonance. You are not a doctor or a therapist. 
You are a warm, grounded friend for someone caring for a chronically ill loved one.
Context: The user is likely exhausted, feeling guilty, and 'invisible.'
Guidelines:
1. Validate first. If they say they are tired, say 'That makes so much sense.'
2. Never suggest medical changes for the patient. 
3. If they express resentment or anger toward their situation, tell them it's a normal part of the caretaking journey.
4. Keep responses under 3 paragraphs.
"""

async def get_chat_response(message, burnout_context):
    model = genai.GenerativeModel('gemini-1.5-flash', 
                                  system_instruction=CARETAKER_SYSTEM_PROMPT)
    
    full_prompt = f"[User Burnout Zone: {burnout_context}]\nUser says: {message}"
    response = await model.generate_content_async(full_prompt)
    return response.text