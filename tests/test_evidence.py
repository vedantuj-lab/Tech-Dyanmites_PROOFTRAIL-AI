"""Unit tests for Evidence Extraction Engine."""
import pytest
from src.services.nebius import NebiusService
from src.services.source_manager import SourceManager
from src.services.evidence_engine import EvidenceEngine


def test_evidence_extraction():
    nebius = NebiusService()
    sm = SourceManager()
    sm.add_raw_search_results(
        "ses_ev",
        [{
            "url": "https://niti.gov.in/ev-policy",
            "title": "NITI Aayog Policy",
            "content": "Under the national scheme, state DISCOMs receive capital subsidies up to 70% for setting up DC fast chargers.",
            "snippet": "Capital subsidies up to 70% for EV chargers."
        }],
        search_round=1,
        search_query="ev policy",
    )
    sources = sm.get_all_sources()

    engine = EvidenceEngine(nebius)
    claims, evidence_records = engine.extract_claims_and_evidence("ses_ev", "What subsidies exist for EV charging?", sources)

    assert len(claims) > 0
    assert len(evidence_records) > 0
    assert evidence_records[0].source_id == sources[0].source_id
