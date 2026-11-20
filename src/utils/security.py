"""Security utilities: Password hashing, Token generation, Prompt injection defense, and Credential masking."""
import re
import os
import secrets
import hashlib
import hmac
import json
import base64
from typing import Dict, Any, Optional

SECRET_KEY = os.getenv("AUTH_SECRET", "prooftrail_secret_key_change_in_production_2026")


def hash_password(password: str) -> str:
    """Hashes password securely using PBKDF2-HMAC-SHA256 with random salt."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}${key.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    """Verifies a password against a stored PBKDF2 hash string."""
    if not stored_hash or "$" not in stored_hash:
        return False
    try:
        salt, key_hex = stored_hash.split("$", 1)
        expected_key = bytes.fromhex(key_hex)
        key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
        return hmac.compare_digest(key, expected_key)
    except Exception:
        return False


def generate_token() -> str:
    """Generates a secure random session token."""
    return secrets.token_hex(32)


def create_auth_token(payload: Dict[str, Any]) -> str:
    """Creates a lightweight signed JWT-style token string."""
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
    body = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    to_sign = f"{header}.{body}"
    sig = hmac.new(SECRET_KEY.encode(), to_sign.encode(), hashlib.sha256).digest()
    sig_str = base64.urlsafe_b64encode(sig).decode().rstrip("=")
    return f"{to_sign}.{sig_str}"


def decode_auth_token(token: str) -> Optional[Dict[str, Any]]:
    """Verifies and decodes a signed token string."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header, body, sig_str = parts
        to_sign = f"{header}.{body}"
        expected_sig = hmac.new(SECRET_KEY.encode(), to_sign.encode(), hashlib.sha256).digest()
        actual_sig = base64.urlsafe_b64decode(sig_str + "==")
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
        payload_bytes = base64.urlsafe_b64decode(body + "==")
        return json.loads(payload_bytes.decode())
    except Exception:
        return None


def sanitize_web_content(text: str) -> str:
    """Sanitizes raw retrieved webpage text to mitigate prompt injection risks."""
    if not text:
        return ""

    patterns = [
        r"(?i)ignore\s+(all\s+)?previous\s+instructions",
        r"(?i)system\s+prompt:",
        r"(?i)you\s+are\s+now\s+a",
        r"(?i)override\s+prior\s+directives",
        r"(?i)reveal\s+(your|the)\s+(system\s+prompt|api\s+key|secret)",
    ]

    sanitized = text
    for pattern in patterns:
        sanitized = re.sub(pattern, "[UNTRUSTED INSTRUCTION FILTERED]", sanitized)

    max_len = 12000
    if len(sanitized) > max_len:
        sanitized = sanitized[:max_len] + "\n...[Content truncated for length]..."

    return sanitized


def mask_secret(secret: str) -> str:
    """Masks a secret string for safe logging."""
    if not secret:
        return "<NOT_SET>"
    if len(secret) <= 8:
        return "****"
    return f"{secret[:4]}...{secret[-4:]}"
