import os
import base64
import hashlib
from cryptography.fernet import Fernet

def _get_key(uid: str):
    # Deterministic key based on UID so we don't need to store keys
    hash_val = hashlib.sha256(uid.encode()).digest()
    return base64.urlsafe_b64encode(hash_val)

def encrypt_content(content: str, uid: str) -> str:
    f = Fernet(_get_key(uid))
    return f.encrypt(content.encode()).decode()

def decrypt_content(encrypted_data: str, uid: str) -> str:
    f = Fernet(_get_key(uid))
    return f.decrypt(encrypted_data.encode()).decode()