"""Unit tests for End-to-End Research Orchestrator."""
import pytest
import tempfile
import os
from src.database.db import Database
from src.agent_core.orchestrator import ResearchOrchestrator


def test_orchestrator_runs_end_to_end():
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        db_path = tmp.name
        tmp.close()

    try:
        db = Database(db_path=db_path)
        orchestrator = ResearchOrchestrator(db=db)

        report = orchestrator.run_research_pipeline(
            question="Should a startup enter India's EV charging market in 2027?"
        )

        assert report is not None
        assert len(report.references) > 0
        assert report.citation_validation is not None

        session = db.get_session(report.session_id)
        assert session is not None
        assert session.status.value == "COMPLETED"

    finally:
        try:
            if os.path.exists(db_path):
                os.remove(db_path)
        except PermissionError:
            pass
