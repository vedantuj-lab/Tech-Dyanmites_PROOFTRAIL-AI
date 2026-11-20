"""Unit tests for SQLite Database persistence."""
import pytest
import os
import tempfile
from src.database.db import Database
from src.models.research import ResearchSession, ResearchStatus, ResearchEvent


def test_database_session_crud():
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        db_path = tmp.name
        tmp.close()

    try:
        db = Database(db_path=db_path)
        session = ResearchSession(
            session_id="ses_db_test",
            question="Database test question",
            status=ResearchStatus.PLANNING,
        )
        db.save_session(session)

        retrieved = db.get_session("ses_db_test")
        assert retrieved is not None
        assert retrieved.question == "Database test question"
        assert retrieved.status == ResearchStatus.PLANNING

        event = ResearchEvent(
            event_id="evt_1",
            session_id="ses_db_test",
            event_type="TEST_EVENT",
            description="Testing DB events",
        )
        db.save_event(event)

        events = db.get_events("ses_db_test")
        assert len(events) == 1
        assert events[0].event_type == "TEST_EVENT"

        db.delete_session("ses_db_test")
        assert db.get_session("ses_db_test") is None

    finally:
        try:
            if os.path.exists(db_path):
                os.remove(db_path)
        except PermissionError:
            pass
