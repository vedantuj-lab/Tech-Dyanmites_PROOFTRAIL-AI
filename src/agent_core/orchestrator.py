"""Research Orchestrator: Central Control Engine."""
import uuid
import logging
from typing import Optional, Callable, Dict, Any, List
from src.models.research import ResearchSession, ResearchStatus, ResearchEvent, ResearchPlan
from src.models.evidence import ResearchReport
from src.database.db import get_db, Database
from src.services.nebius import NebiusService
from src.services.tavily import TavilyService
from src.services.source_manager import SourceManager
from src.services.evidence_engine import EvidenceEngine
from src.services.conflict_detector import ConflictDetector
from src.services.source_quality import SourceQualityAssessor
from src.services.citation_validator import CitationValidator
from src.agent_core.planner import ResearchPlanner
from src.agent_core.researcher import MultiRoundResearcher
from src.agent_core.synthesizer import ReportSynthesizer

logger = logging.getLogger(__name__)


class ResearchOrchestrator:
    def __init__(self, db: Optional[Database] = None):
        self.db = db or get_db()
        self.nebius = NebiusService()
        self.tavily = TavilyService()

        self.planner = ResearchPlanner(self.nebius)
        self.evidence_engine = EvidenceEngine(self.nebius)
        self.conflict_detector = ConflictDetector(self.nebius)
        self.quality_assessor = SourceQualityAssessor(self.nebius)
        self.synthesizer = ReportSynthesizer(self.nebius)

    def log_event(
        self,
        session_id: str,
        event_type: str,
        description: str,
        metadata: Optional[Dict[str, Any]] = None,
        callback: Optional[Callable[[str, str], None]] = None,
    ):
        event_id = f"EVT_{uuid.uuid4().hex[:8]}"
        event = ResearchEvent(
            event_id=event_id,
            session_id=session_id,
            event_type=event_type,
            description=description,
            metadata=metadata or {},
        )
        self.db.save_event(event)
        if callback:
            callback(event_type, description)

    def run_research_pipeline(
        self,
        question: str,
        session_id: Optional[str] = None,
        event_callback: Optional[Callable[[str, str], None]] = None,
    ) -> ResearchReport:
        """Executes the complete evidence-first research pipeline."""
        if not session_id:
            session_id = f"SES_{uuid.uuid4().hex[:8]}"

        session = ResearchSession(
            session_id=session_id,
            question=question,
            status=ResearchStatus.PLANNING,
        )
        self.db.save_session(session)

        self.log_event(session_id, "QUESTION_RECEIVED", f"Received question: '{question}'", callback=event_callback)

        # 1. Research Planning
        self.log_event(session_id, "PLANNING_START", "Generating research plan and subquestion decomposition...", callback=event_callback)
        plan = self.planner.create_plan(session_id, question)
        session.plan = plan
        session.status = ResearchStatus.SEARCHING
        self.db.save_session(session)
        self.log_event(session_id, "PLAN_GENERATED", f"Created plan with {len(plan.subquestions)} subquestions and {len(plan.dimensions)} dimensions.", callback=event_callback)

        # 2. Multi-Round Live Search
        source_manager = SourceManager()
        researcher = MultiRoundResearcher(self.tavily, source_manager)
        sources = researcher.execute_multi_round_search(
            session_id=session_id,
            plan=plan,
            event_callback=lambda et, desc: self.log_event(session_id, et, desc, callback=event_callback),
        )

        if not sources:
            session.status = ResearchStatus.INSUFFICIENT_EVIDENCE
            self.db.save_session(session)
            self.log_event(session_id, "INSUFFICIENT_EVIDENCE", "Search returned no accessible web sources.", callback=event_callback)

        self.db.save_sources(sources)

        # 3. Source Quality Assessment
        session.status = ResearchStatus.ANALYZING
        self.db.save_session(session)
        self.log_event(session_id, "QUALITY_ASSESSMENT", "Assessing source authority, freshness, and domain relevance...", callback=event_callback)
        sources = self.quality_assessor.assess_sources(sources)
        self.db.save_sources(sources)

        # 4. Evidence Extraction & Claim Mapping
        self.log_event(session_id, "EVIDENCE_EXTRACTION", "Extracting factual claims and verbatim supporting passages...", callback=event_callback)
        claims, evidence_records = self.evidence_engine.extract_claims_and_evidence(session_id, question, sources)
        self.db.save_claims(claims)
        self.db.save_evidence_records(evidence_records)

        # 5. Conflict Detection
        self.log_event(session_id, "CONFLICT_DETECTION", "Scanning sources for statistical discrepancies and conflicting claims...", callback=event_callback)
        conflicts = self.conflict_detector.detect_conflicts(session_id, claims, sources)
        self.db.save_conflicts(conflicts)

        # 6. Final Report Synthesis
        session.status = ResearchStatus.VERIFYING
        self.db.save_session(session)
        self.log_event(session_id, "REPORT_SYNTHESIS", "Synthesizing structured report backed by citations...", callback=event_callback)
        report = self.synthesizer.synthesize_report(
            session_id=session_id,
            question=question,
            plan=plan,
            sources=sources,
            claims=claims,
            evidence_records=evidence_records,
            conflicts=conflicts,
        )

        # 7. Deterministic Citation Validation
        self.log_event(session_id, "CITATION_VALIDATION", "Running deterministic citation & evidence integrity check...", callback=event_callback)
        validation_result = CitationValidator.validate_report(report, sources, evidence_records)
        report.citation_validation = validation_result

        # Save Report & Complete Session
        self.db.save_report(report)
        session.status = ResearchStatus.COMPLETED
        session.report_id = report.report_id
        self.db.save_session(session)

        self.log_event(session_id, "RESEARCH_COMPLETED", f"Research completed successfully. Report ID: {report.report_id}", callback=event_callback)
        return report

    def continue_research(
        self,
        session_id: str,
        followup_question: str,
        event_callback: Optional[Callable[[str, str], None]] = None,
    ) -> ResearchReport:
        """Continues existing research session with a follow-up prompt, preserving past context."""
        existing_session = self.db.get_session(session_id)
        if not existing_session:
            raise ValueError(f"Session {session_id} not found.")

        combined_question = f"{existing_session.question} (Follow-up: {followup_question})"
        return self.run_research_pipeline(
            question=combined_question,
            session_id=session_id,
            event_callback=event_callback,
        )
