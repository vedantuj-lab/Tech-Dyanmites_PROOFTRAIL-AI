"""Unit tests for Citation Integrity Validator."""
import pytest
from src.models.evidence import ResearchReport, CitationValidationResult, EvidenceRecord, EvidenceRelationship
from src.models.claim import Claim, VerificationStatus, ClaimCategory
from src.models.source import Source, SourceQuality
from src.services.citation_validator import CitationValidator


def test_citation_validator_flags_invalid_citation():
    source = Source(
        source_id="SRC_001",
        session_id="ses_cit",
        url="https://valid.com",
        canonical_url="https://valid.com",
        title="Valid Source",
        domain="valid.com",
        snippet="Snippet",
        content="Content",
    )

    claim = Claim(
        claim_id="CLM_001",
        session_id="ses_cit",
        claim_text="Unsupported assertion",
        claim_category=ClaimCategory.FACTUAL,
        importance="HIGH",
        verification_status=VerificationStatus.SUPPORTED,
    )

    report = ResearchReport(
        report_id="REP_001",
        session_id="ses_cit",
        question="Test Question",
        executive_summary="Summary citing invalid source [SRC_999].",
        research_scope="Scope",
        methodology="Method",
        key_findings=["Finding citing valid [SRC_001]"],
        claim_verifications=[claim],
        conclusion="Conclusion",
        references=[source],
    )

    # Note: no evidence record provided for CLM_001
    val_res = CitationValidator.validate_report(report, [source], [])

    assert not val_res.is_valid
    assert "SRC_999" in val_res.invalid_citation_ids
    assert "CLM_001" in val_res.unsupported_claims
    assert claim.verification_status == VerificationStatus.UNVERIFIED
