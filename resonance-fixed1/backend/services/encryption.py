import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def get_key() -> bytes:
    key_b64 = os.environ.get("JOURNAL_ENCRYPTION_KEY")
    if not key_b64:
        raise RuntimeError("JOURNAL_ENCRYPTION_KEY not set in environment")
    key = base64.b64decode(key_b64)
    if len(key) != 32:
        raise RuntimeError("JOURNAL_ENCRYPTION_KEY must be 32 bytes (256-bit)")
    return key

def encrypt(plaintext: str) -> str:
    """Returns a base64-encoded string: nonce(12) + ciphertext"""
    key = get_key()
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)  # 96-bit nonce, unique per entry
    ct = aesgcm.encrypt(nonce, plaintext.encode(), None)
    return base64.b64encode(nonce + ct).decode()

def decrypt(token: str) -> str:
    """Decrypts a base64-encoded nonce+ciphertext string"""
    key = get_key()
    aesgcm = AESGCM(key)
    raw = base64.b64decode(token)
    nonce, ct = raw[:12], raw[12:]
    return aesgcm.decrypt(nonce, ct, None).decode()