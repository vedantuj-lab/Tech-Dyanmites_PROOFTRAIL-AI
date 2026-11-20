"""SQLite Database Access Layer with Multi-Role RBAC & Audit Logging."""
import sqlite3
import json
import uuid
import os
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from src.utils.settings import settings
from src.utils.security import hash_password
from src.models.research import ResearchSession, ResearchPlan, ResearchEvent, ResearchStatus
from src.models.source import Source
from src.models.claim import Claim
from src.models.evidence import EvidenceRecord, ConflictRecord, ResearchReport


class Database:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or settings.database_path
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        self._init_tables()
        self._seed_bootstrap_users()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def _init_tables(self):
        with self.get_connection() as conn:
            conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                role TEXT NOT NULL, -- RESEARCHER, REVIEWER, ADMIN
                organization TEXT,
                created_at TEXT NOT NULL,
                status TEXT DEFAULT 'ACTIVE' -- ACTIVE, SUSPENDED, INACTIVE
            );

            CREATE TABLE IF NOT EXISTS user_sessions (
                session_token TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS research_sessions (
                session_id TEXT PRIMARY KEY,
                user_id TEXT,
                question TEXT NOT NULL,
                created_at TEXT NOT NULL,
                status TEXT NOT NULL,
                plan_json TEXT,
                report_id TEXT,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
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

            CREATE TABLE IF NOT EXISTS report_shares (
                share_id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                shared_by_user_id TEXT NOT NULL,
                shared_with_user_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE,
                FOREIGN KEY (shared_by_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (shared_with_user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS review_assignments (
                assignment_id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                assigned_reviewer_id TEXT NOT NULL,
                assigned_by_admin_id TEXT NOT NULL,
                deadline TEXT,
                status TEXT DEFAULT 'PENDING', -- PENDING, IN_REVIEW, COMPLETED, REVISION_REQUESTED
                created_at TEXT NOT NULL,
                FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE,
                FOREIGN KEY (assigned_reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS review_comments (
                comment_id TEXT PRIMARY KEY,
                assignment_id TEXT NOT NULL,
                reviewer_id TEXT NOT NULL,
                claim_id TEXT,
                source_id TEXT,
                comment_text TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (assignment_id) REFERENCES review_assignments(assignment_id) ON DELETE CASCADE,
                FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS review_decisions (
                decision_id TEXT PRIMARY KEY,
                assignment_id TEXT NOT NULL,
                reviewer_id TEXT NOT NULL,
                decision TEXT NOT NULL, -- APPROVED, APPROVED_WITH_OBSERVATIONS, REVISION_REQUIRED, REJECTED
                decision_note TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (assignment_id) REFERENCES review_assignments(assignment_id) ON DELETE CASCADE,
                FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS research_collections (
                collection_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS collection_items (
                item_id TEXT PRIMARY KEY,
                collection_id TEXT NOT NULL,
                session_id TEXT NOT NULL,
                added_at TEXT NOT NULL,
                FOREIGN KEY (collection_id) REFERENCES research_collections(collection_id) ON DELETE CASCADE,
                FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS notifications (
                notification_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                read INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                type TEXT DEFAULT 'INFO',
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS audit_logs (
                log_id TEXT PRIMARY KEY,
                actor_user_id TEXT,
                action TEXT NOT NULL,
                target_resource TEXT NOT NULL,
                details_json TEXT,
                timestamp TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS app_settings (
                setting_key TEXT PRIMARY KEY,
                setting_value TEXT NOT NULL
            );
            """)

    def _seed_bootstrap_users(self):
        """Seeds initial default accounts for Admin, Reviewer, and Researcher."""
        bootstrap_users = [
            ("USR_ADMIN_01", "admin@prooftrail.ai", "Admin@123", "ProofTrail Administrator", "ADMIN", "ProofTrail AI Core"),
            ("USR_REVIEWER_01", "reviewer@prooftrail.ai", "Reviewer@123", "Senior Research Analyst", "REVIEWER", "Global Evidence Review"),
            ("USR_RESEARCHER_01", "researcher@prooftrail.ai", "Researcher@123", "Lead Researcher", "RESEARCHER", "Market Labs"),
        ]

        with self.get_connection() as conn:
            for uid, email, password, name, role, org in bootstrap_users:
                existing = conn.execute("SELECT user_id FROM users WHERE email = ?;", (email,)).fetchone()
                if not existing:
                    pass_hash = hash_password(password)
                    now_str = datetime.utcnow().isoformat()
                    conn.execute(
                        """
                        INSERT INTO users (user_id, email, password_hash, full_name, role, organization, created_at, status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE');
                        """,
                        (uid, email, pass_hash, name, role, org, now_str),
                    )

    # --- USER & AUTHENTICATION OPERATIONS ---
    def create_user(
        self, email: str, password_hash: str, full_name: str, role: str = "RESEARCHER", organization: Optional[str] = None
    ) -> Dict[str, Any]:
        user_id = f"USR_{uuid.uuid4().hex[:8]}"
        now_str = datetime.utcnow().isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO users (user_id, email, password_hash, full_name, role, organization, created_at, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE');
                """,
                (user_id, email.lower(), password_hash, full_name, role, organization, now_str),
            )
        return self.get_user_by_id(user_id)

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM users WHERE email = ?;", (email.lower(),)).fetchone()
            return dict(row) if row else None

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM users WHERE user_id = ?;", (user_id,)).fetchone()
            return dict(row) if row else None

    def list_users(self, role_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            if role_filter:
                rows = conn.execute("SELECT user_id, email, full_name, role, organization, created_at, status FROM users WHERE role = ? ORDER BY created_at DESC;", (role_filter,)).fetchall()
            else:
                rows = conn.execute("SELECT user_id, email, full_name, role, organization, created_at, status FROM users ORDER BY created_at DESC;").fetchall()
            return [dict(r) for r in rows]

    def update_user_status(self, user_id: str, new_status: str, new_role: Optional[str] = None) -> Dict[str, Any]:
        with self.get_connection() as conn:
            if new_role:
                conn.execute("UPDATE users SET status = ?, role = ? WHERE user_id = ?;", (new_status, new_role, user_id))
            else:
                conn.execute("UPDATE users SET status = ? WHERE user_id = ?;", (new_status, user_id))
        return self.get_user_by_id(user_id)

    def create_session_token(self, user_id: str, expires_hours: int = 24) -> str:
        token = uuid.uuid4().hex
        now = datetime.utcnow()
        expires = now + timedelta(hours=expires_hours)
        with self.get_connection() as conn:
            conn.execute(
                "INSERT INTO user_sessions (session_token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?);",
                (token, user_id, now.isoformat(), expires.isoformat()),
            )
        return token

    def get_user_by_session_token(self, token: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute(
                """
                SELECT u.user_id, u.email, u.full_name, u.role, u.organization, u.status
                FROM user_sessions s
                JOIN users u ON s.user_id = u.user_id
                WHERE s.session_token = ? AND datetime(s.expires_at) > datetime('now');
                """,
                (token,),
            ).fetchone()
            return dict(row) if row else None

    def delete_session_token(self, token: str):
        with self.get_connection() as conn:
            conn.execute("DELETE FROM user_sessions WHERE session_token = ?;", (token,))

    # --- AUDIT LOGGING ---
    def log_audit(self, actor_user_id: Optional[str], action: str, target_resource: str, details: Optional[Dict[str, Any]] = None):
        log_id = f"LOG_{uuid.uuid4().hex[:8]}"
        now_str = datetime.utcnow().isoformat()
        with self.get_connection() as conn:
            conn.execute(
                "INSERT INTO audit_logs (log_id, actor_user_id, action, target_resource, details_json, timestamp) VALUES (?, ?, ?, ?, ?, ?);",
                (log_id, actor_user_id, action, target_resource, json.dumps(details or {}), now_str),
            )

    def get_audit_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?;", (limit,)).fetchall()
            logs = []
            for r in rows:
                item = dict(r)
                item["details"] = json.loads(item["details_json"]) if item["details_json"] else {}
                logs.append(item)
            return logs

    # --- REVIEW ASSIGNMENTS & DECISIONS ---
    def create_review_assignment(self, session_id: str, reviewer_id: str, admin_id: str, deadline_days: int = 7) -> Dict[str, Any]:
        assignment_id = f"ASN_{uuid.uuid4().hex[:8]}"
        now_str = datetime.utcnow().isoformat()
        deadline = (datetime.utcnow() + timedelta(days=deadline_days)).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO review_assignments (assignment_id, session_id, assigned_reviewer_id, assigned_by_admin_id, deadline, status, created_at)
                VALUES (?, ?, ?, ?, ?, 'PENDING', ?);
                """,
                (assignment_id, session_id, reviewer_id, admin_id, deadline, now_str),
            )
        return self.get_review_assignment(assignment_id)

    def get_review_assignment(self, assignment_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM review_assignments WHERE assignment_id = ?;", (assignment_id,)).fetchone()
            return dict(row) if row else None

    def list_reviewer_assignments(self, reviewer_id: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            rows = conn.execute(
                """
                SELECT a.*, r.question, u.full_name as researcher_name
                FROM review_assignments a
                JOIN research_sessions r ON a.session_id = r.session_id
                LEFT JOIN users u ON r.user_id = u.user_id
                WHERE a.assigned_reviewer_id = ?
                ORDER BY a.created_at DESC;
                """,
                (reviewer_id,),
            ).fetchall()
            return [dict(row) for row in rows]

    def list_all_assignments(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            rows = conn.execute(
                """
                SELECT a.*, r.question, u1.full_name as reviewer_name, u2.full_name as admin_name
                FROM review_assignments a
                JOIN research_sessions r ON a.session_id = r.session_id
                JOIN users u1 ON a.assigned_reviewer_id = u1.user_id
                JOIN users u2 ON a.assigned_by_admin_id = u2.user_id
                ORDER BY a.created_at DESC;
                """
            ).fetchall()
            return [dict(row) for row in rows]

    def record_review_decision(self, assignment_id: str, reviewer_id: str, decision: str, decision_note: str):
        decision_id = f"DEC_{uuid.uuid4().hex[:8]}"
        now_str = datetime.utcnow().isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO review_decisions (decision_id, assignment_id, reviewer_id, decision, decision_note, created_at)
                VALUES (?, ?, ?, ?, ?, ?);
                """,
                (decision_id, assignment_id, reviewer_id, decision, decision_note, now_str),
            )
            # Update assignment status
            status_map = {
                "APPROVED": "COMPLETED",
                "APPROVED_WITH_OBSERVATIONS": "COMPLETED",
                "REVISION_REQUIRED": "REVISION_REQUESTED",
                "REJECTED": "REJECTED",
            }
            new_status = status_map.get(decision, "COMPLETED")
            conn.execute("UPDATE review_assignments SET status = ? WHERE assignment_id = ?;", (new_status, assignment_id))

    def add_review_comment(self, assignment_id: str, reviewer_id: str, comment_text: str, claim_id: Optional[str] = None, source_id: Optional[str] = None):
        comment_id = f"CMT_{uuid.uuid4().hex[:8]}"
        now_str = datetime.utcnow().isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO review_comments (comment_id, assignment_id, reviewer_id, claim_id, source_id, comment_text, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?);
                """,
                (comment_id, assignment_id, reviewer_id, claim_id, source_id, comment_text, now_str),
            )

    def get_assignment_comments(self, assignment_id: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM review_comments WHERE assignment_id = ? ORDER BY created_at ASC;", (assignment_id,)).fetchall()
            return [dict(row) for row in rows]

    def get_assignment_decisions(self, assignment_id: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM review_decisions WHERE assignment_id = ? ORDER BY created_at DESC;", (assignment_id,)).fetchall()
            return [dict(row) for row in rows]

    # --- RESEARCH SESSIONS & REPORT PERSISTENCE ---
    def save_session(self, session: ResearchSession, user_id: Optional[str] = None):
        plan_json = session.plan.model_dump_json() if session.plan else None
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO research_sessions (session_id, user_id, question, created_at, status, plan_json, report_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    user_id=coalesce(excluded.user_id, research_sessions.user_id),
                    status=excluded.status,
                    plan_json=excluded.plan_json,
                    report_id=excluded.report_id;
                """,
                (session.session_id, user_id, session.question, session.created_at, session.status.value, plan_json, session.report_id),
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

    def list_sessions(self, user_id: Optional[str] = None) -> List[ResearchSession]:
        with self.get_connection() as conn:
            if user_id:
                rows = conn.execute("SELECT * FROM research_sessions WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC;", (user_id,)).fetchall()
            else:
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
