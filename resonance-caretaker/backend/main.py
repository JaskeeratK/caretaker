from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials
import os
from dotenv import load_dotenv

load_dotenv()

from routers import auth, chat, journal, burnout

app = FastAPI(title="Resonance Caretaker API")

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For Codespaces, allow all or set your specific URL
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(chat.router, prefix="/chat")
app.include_router(journal.router, prefix="/journal")
app.include_router(burnout.router, prefix="/burnout")

@app.get("/")
def read_root():
    return {"status": "Resonance API Active"}