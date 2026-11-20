"""Factual claim models and verification statuses."""
from enum import Enum
from typing import Optional
from pydantic import BaseModel


class ClaimCategory(str, Enum):
    FACTUAL = "FACTUAL"
    STATISTICAL = "STATISTICAL"
    POLICY = "POLICY"
    PROJECTION = "PROJECTION"
    OPINION = "OPINION"
    MARKET_DATA = "MARKET_DATA"


class VerificationStatus(str, Enum):
    SUPPORTED = "SUPPORTED"
    PARTIALLY_SUPPORTED = "PARTIALLY_SUPPORTED"
    CONFLICTING = "CONFLICTING"
    UNVERIFIED = "UNVERIFIED"


class Claim(BaseModel):
    claim_id: str
    session_id: str
    claim_text: str
    claim_category: ClaimCategory = ClaimCategory.FACTUAL
    importance: str = "HIGH"  # HIGH, MEDIUM, LOW
    verification_status: VerificationStatus = VerificationStatus.UNVERIFIED
    explanation: Optional[str] = None
