"""Unit tests for Conflict Detector."""
import pytest
from src.services.nebius import NebiusService
from src.services.source_manager import SourceManager
from src.services.conflict_detector import ConflictDetector


def test_conflict_detection():
    nebius = NebiusService()
    sm = SourceManager()
    sm.add_raw_search_results(
        "ses_cnf",
        [
            {"url": "https://source1.com", "title": "Report A", "content": "India requires at least 100,000 fast chargers by 2027."},
            {"url": "https://source2.com", "title": "Report B", "content": "India requires at least 400,000 charging points by 2027."},
        ],
        search_round=1,
        search_query="charger requirement",
    )
    sources = sm.get_all_sources()

    cd = ConflictDetector(nebius)
    conflicts = cd.detect_conflicts("ses_cnf", [], sources)

    assert isinstance(conflicts, list)
