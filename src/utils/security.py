"""Security utilities: Prompt injection defense and credential masking."""
import re


def sanitize_web_content(text: str) -> str:
    """Sanitizes raw retrieved webpage text to mitigate prompt injection risks.

    Ensures system instructions, prompt override attempts, and hidden command instructions
    inside retrieved external webpages are neutralized before passing to the model.
    """
    if not text:
        return ""

    # Neutralize common prompt injection / instruction override patterns in web text
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

    # Truncate extremely long raw blocks if needed to prevent token exhaustion attacks
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
