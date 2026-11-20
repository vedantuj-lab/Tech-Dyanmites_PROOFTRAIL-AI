"""SQLite Database Access Layer."""
import sqlite3
import json
import os
from pathlib import Path
from typing import List, Optional, Dict, Any
from src.utils.settings import settings
from src.models.research import ResearchSession, ResearchPlan, ResearchEvent, ResearchStatus
from src.models.source import Source, SourcePassage
from src.models.claim import Claim
from src.models.evidence import EvidenceRecord, ConflictRecord, ResearchReport


class Database:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or settings.database_path
        # Ensure parent directory exists
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        self._init_tables()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def _init_tables(self):
        with self.get_connection() as conn:
            conn.executescript("""
            CREATE TABLE IF NOT EXISTS research_sessions (
                session_id TEXT PRIMARY KEY,
                question TEXT NOT NULL,
                created_at TEXT NOT NULL,
                status TEXT NOT NULL,
                plan_json TEXT,
                report_id TEXT
            );

            CREATE TABLE IF NOT EXISTS research_plans (
                session_id TEXT PRIMARY KEY,
                objective TEXT NOT NULL,
                geography TEXT,
                time_period TEXT,
                subject_scope TEXT,
                subquestions_json TEXT,
                dimensions_json TEXT,
                max_rounds INTEGER,
                max_sources INTEGER,
                FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS sources (
                source_id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                url TEXT NOT NULL,
                canonical_url TEXT NOT NULL,
                title TEXT,
                domain TEXT,
                snippet TEXT,
                content TEXT,
                publication_date TEXT,
                retrieved_at TEXT NOT NULL,
                search_round INTEGER DEFAULT 1,
                search_query TEXT,
                quality_assessment TEXT,
                quality_explanation TEXT,
                FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS source_passages (
                passage_id TEXT PRIMARY KEY,
                source_id TEXT NOT NULL,
                session_id TEXT NOT NULL,
                exact_passage TEXT NOT NULL,
                location_context TEXT,
                FOREIGN KEY (source_id) REFERENCES sources(source_id) ON DELETE CASCADE,
                FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS claims (
                claim_id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                claim_text TEXT NOT NULL,
                claim_category TEXT NOT NULL,
                importance TEXT NOT NULL,
                verification_status TEXT NOT NULL,
                explanation TEXT,
                FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS evidence_records (
                evidence_id TEXT PRIMARY KEY,
                claim_id TEXT NOT NULL,
                source_id TEXT NOT NULL,
                session_id TEXT NOT NULL,
                exact_passage TEXT NOT NULL,
                relationship TEXT NOT NULL,
                relevance_explanation TEXT NOT NULL,
                source_location TEXT,
                FOREIGN KEY (claim_id) REFERENCES claims(claim_id) ON DELETE CASCADE,
                FOREIGN KEY (source_id) REFERENCES sources(source_id) ON DELETE CASCADE,
                FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS conflicts (
                conflict_id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                claim_id TEXT,
                source_a_id TEXT NOT NULL,
                source_b_id TEXT NOT NULL,
                passage_a TEXT NOT NULL,
                passage_b TEXT NOT NULL,
                conflict_type TEXT NOT NULL,
                explanation TEXT NOT NULL,
                resolved INTEGER DEFAULT 0,
                resolution_note TEXT,
                FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS research_events (
                event_id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                event_type TEXT NOT NULL,
                description TEXT NOT NULL,
                metadata_json TEXT,
                FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS reports (
                report_id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                report_json TEXT NOT NULL,
                FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS app_settings (
                setting_key TEXT PRIMARY KEY,
                setting_value TEXT NOT NULL
            );
            """)

    def save_session(self, session: ResearchSession):
        plan_json = session.plan.model_dump_json() if session.plan else None
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO research_sessions (session_id, question, created_at, status, plan_json, report_id)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    status=excluded.status,
                    plan_json=excluded.plan_json,
                    report_id=excluded.report_id;
                """,
                (session.session_id, session.question, session.created_at, session.status.value, plan_json, session.report_id),
            )

    def get_session(self, session_id: str) -> Optional[ResearchSession]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM research_sessions WHERE session_id = ?;", (session_id,)).fetchone()
            if not row:
                return None
            plan = ResearchPlan.model_validate_json(row["plan_json"]) if row["plan_json"] else None
            return ResearchSession(
                session_id=row["session_id"],
                question=row["question"],
                created_at=row["created_at"],
                status=ResearchStatus(row["status"]),
                plan=plan,
                report_id=row["report_id"],
            )

    def list_sessions(self) -> List[ResearchSession]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM research_sessions ORDER BY created_at DESC;").fetchall()
            sessions = []
            for row in rows:
                plan = ResearchPlan.model_validate_json(row["plan_json"]) if row["plan_json"] else None
                sessions.append(ResearchSession(
                    session_id=row["session_id"],
                    question=row["question"],
                    created_at=row["created_at"],
                    status=ResearchStatus(row["status"]),
                    plan=plan,
                    report_id=row["report_id"],
                ))
            return sessions

    def delete_session(self, session_id: str):
        with self.get_connection() as conn:
            conn.execute("DELETE FROM research_sessions WHERE session_id = ?;", (session_id,))

    def save_event(self, event: ResearchEvent):
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO research_events (event_id, session_id, timestamp, event_type, description, metadata_json)
                VALUES (?, ?, ?, ?, ?, ?);
                """,
                (event.event_id, event.session_id, event.timestamp, event.event_type, event.description, json.dumps(event.metadata)),
            )

    def get_events(self, session_id: str) -> List[ResearchEvent]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM research_events WHERE session_id = ? ORDER BY timestamp ASC;", (session_id,)).fetchall()
            events = []
            for row in rows:
                meta = json.loads(row["metadata_json"]) if row["metadata_json"] else {}
                events.append(ResearchEvent(
                    event_id=row["event_id"],
                    session_id=row["session_id"],
                    timestamp=row["timestamp"],
                    event_type=row["event_type"],
                    description=row["description"],
                    metadata=meta,
                ))
            return events

    def save_sources(self, sources: List[Source]):
        with self.get_connection() as conn:
            for s in sources:
                conn.execute(
                    """
                    INSERT INTO sources (
                        source_id, session_id, url, canonical_url, title, domain, snippet, content,
                        publication_date, retrieved_at, search_round, search_query, quality_assessment, quality_explanation
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(source_id) DO UPDATE SET
                        quality_assessment=excluded.quality_assessment,
                        quality_explanation=excluded.quality_explanation;
                    """,
                    (
                        s.source_id, s.session_id, s.url, s.canonical_url, s.title, s.domain,
                        s.snippet, s.content, s.publication_date, s.retrieved_at, s.search_round,
                        s.search_query, s.quality_assessment.value, s.quality_explanation
                    ),
                )

    def get_sources(self, session_id: str) -> List[Source]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM sources WHERE session_id = ?;", (session_id,)).fetchall()
            return [
                Source(
                    source_id=r["source_id"],
                    session_id=r["session_id"],
                    url=r["url"],
                    canonical_url=r["canonical_url"],
                    title=r["title"] or "",
                    domain=r["domain"] or "",
                    snippet=r["snippet"] or "",
                    content=r["content"] or "",
                    publication_date=r["publication_date"],
                    retrieved_at=r["retrieved_at"],
                    search_round=r["search_round"],
                    search_query=r["search_query"] or "",
                    quality_assessment=r["quality_assessment"] or "NOT_ASSESSED",
                    quality_explanation=r["quality_explanation"],
                )
                for r in rows
            ]

    def save_claims(self, claims: List[Claim]):
        with self.get_connection() as conn:
            for c in claims:
                conn.execute(
                    """
                    INSERT INTO claims (claim_id, session_id, claim_text, claim_category, importance, verification_status, explanation)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(claim_id) DO UPDATE SET
                        verification_status=excluded.verification_status,
                        explanation=excluded.explanation;
                    """,
                    (c.claim_id, c.session_id, c.claim_text, c.claim_category.value, c.importance, c.verification_status.value, c.explanation),
                )

    def get_claims(self, session_id: str) -> List[Claim]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM claims WHERE session_id = ?;", (session_id,)).fetchall()
            return [
                Claim(
                    claim_id=r["claim_id"],
                    session_id=r["session_id"],
                    claim_text=r["claim_text"],
                    claim_category=r["claim_category"],
                    importance=r["importance"],
                    verification_status=r["verification_status"],
                    explanation=r["explanation"],
                )
                for r in rows
            ]

    def save_evidence_records(self, records: List[EvidenceRecord]):
        with self.get_connection() as conn:
            for ev in records:
                conn.execute(
                    """
                    INSERT INTO evidence_records (evidence_id, claim_id, source_id, session_id, exact_passage, relationship, relevance_explanation, source_location)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(evidence_id) DO NOTHING;
                    """,
                    (ev.evidence_id, ev.claim_id, ev.source_id, ev.session_id, ev.exact_passage, ev.relationship.value, ev.relevance_explanation, ev.source_location),
                )

    def get_evidence_records(self, session_id: str) -> List[EvidenceRecord]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM evidence_records WHERE session_id = ?;", (session_id,)).fetchall()
            return [
                EvidenceRecord(
                    evidence_id=r["evidence_id"],
                    claim_id=r["claim_id"],
                    source_id=r["source_id"],
                    session_id=r["session_id"],
                    exact_passage=r["exact_passage"],
                    relationship=r["relationship"],
                    relevance_explanation=r["relevance_explanation"],
                    source_location=r["source_location"],
                )
                for r in rows
            ]

    def save_conflicts(self, conflicts: List[ConflictRecord]):
        with self.get_connection() as conn:
            for conf in conflicts:
                conn.execute(
                    """
                    INSERT INTO conflicts (conflict_id, session_id, claim_id, source_a_id, source_b_id, passage_a, passage_b, conflict_type, explanation, resolved, resolution_note)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(conflict_id) DO NOTHING;
                    """,
                    (conf.conflict_id, conf.session_id, conf.claim_id, conf.source_a_id, conf.source_b_id, conf.passage_a, conf.passage_b, conf.conflict_type, conf.explanation, 1 if conf.resolved else 0, conf.resolution_note),
                )

    def get_conflicts(self, session_id: str) -> List[ConflictRecord]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM conflicts WHERE session_id = ?;", (session_id,)).fetchall()
            return [
                ConflictRecord(
                    conflict_id=r["conflict_id"],
                    session_id=r["session_id"],
                    claim_id=r["claim_id"],
                    source_a_id=r["source_a_id"],
                    source_b_id=r["source_b_id"],
                    passage_a=r["passage_a"],
                    passage_b=r["passage_b"],
                    conflict_type=r["conflict_type"],
                    explanation=r["explanation"],
                    resolved=bool(r["resolved"]),
                    resolution_note=r["resolution_note"],
                )
                for r in rows
            ]

    def save_report(self, report: ResearchReport):
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO reports (report_id, session_id, created_at, report_json)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(report_id) DO UPDATE SET report_json=excluded.report_json;
                """,
                (report.report_id, report.session_id, report.created_at, report.model_dump_json()),
            )

    def get_report(self, report_id: str) -> Optional[ResearchReport]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT report_json FROM reports WHERE report_id = ?;", (report_id,)).fetchone()
            if not row:
                return None
            return ResearchReport.model_validate_json(row["report_json"])

    def get_report_by_session(self, session_id: str) -> Optional[ResearchReport]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT report_json FROM reports WHERE session_id = ? ORDER BY created_at DESC LIMIT 1;", (session_id,)).fetchone()
            if not row:
                return None
            return ResearchReport.model_validate_json(row["report_json"])


_db_instance = None


def get_db() -> Database:
    global _db_instance
    if _db_instance is None:
        _db_instance = Database()
    return _db_instance
