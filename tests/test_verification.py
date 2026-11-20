"""Unit tests for Claim Verification Statuses."""
import pytest
from src.models.claim import Claim, ClaimCategory, VerificationStatus


def test_claim_verification_enum_values():
    claim = Claim(
        claim_id="CLM_001",
        session_id="ses_1",
        claim_text="India EV market is expanding rapidly.",
        claim_category=ClaimCategory.MARKET_DATA,
        importance="HIGH",
        verification_status=VerificationStatus.SUPPORTED,
        explanation="Directly confirmed by market research.",
    )

    assert claim.verification_status.value == "SUPPORTED"
    assert claim.claim_category.value == "MARKET_DATA"
