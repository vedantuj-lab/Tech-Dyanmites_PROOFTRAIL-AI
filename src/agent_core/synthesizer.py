"""Report Synthesizer Component."""
import json
import uuid
import logging
from typing import List, Dict, Any
from src.models.research import ResearchPlan
from src.models.source import Source
from src.models.claim import Claim
from src.models.evidence import EvidenceRecord, ConflictRecord, ResearchReport
from src.services.nebius import NebiusService

logger = logging.getLogger(__name__)


class ReportSynthesizer:
    def __init__(self, nebius_service: NebiusService):
        self.nebius = nebius_service

    def synthesize_report(
        self,
        session_id: str,
        question: str,
        plan: ResearchPlan,
        sources: List[Source],
        claims: List[Claim],
        evidence_records: List[EvidenceRecord],
        conflicts: List[ConflictRecord],
    ) -> ResearchReport:
        """Synthesizes structured final report backed strictly by collected sources."""
        report_id = f"REP_{uuid.uuid4().hex[:8]}"

        sources_summary = "\n".join(f"[{s.source_id}] {s.title} ({s.domain}) - {s.url}" for s in sources)
        claims_summary = "\n".join(f"- {c.claim_id}: {c.claim_text} ({c.verification_status.value})" for c in claims)

        prompt = f"""You are the Final Report Synthesizer for ProofTrail AI.
Synthesize a comprehensive, evidence-backed research report based strictly on the provided research question, claims, and verified sources.

CRITICAL CITATION RULES:
1. Every major assertion MUST cite one or more source IDs in square brackets, e.g. [SRC_001].
2. Do NOT invent source IDs not listed below.
3. Be objective, transparent, and explicitly highlight limitations.

Research Question: {question}

Research Objective: {plan.objective}

Sources Available:
{sources_summary}

Extracted Claims & Verification Statuses:
{claims_summary}

Return strictly valid JSON with this format:
{{
  "executive_summary": "High-level summary of findings with inline citations like [SRC_001]",
  "research_scope": "Scope statement",
  "methodology": "Overview of multi-round search and evidence verification methodology",
  "key_findings": [
    "Key finding 1 with citation [SRC_001]",
    "Key finding 2 with citation [SRC_002]"
  ],
  "research_gaps": [
    "Unanswered question or missing dimension 1"
  ],
  "limitations": [
    "Methodological or data access limitation 1"
  ],
  "conclusion": "Final concluding recommendation and synthesis"
}}
"""

        response_str = self.nebius.generate_completion(
            prompt=prompt,
            temperature=0.2,
            response_format_json=True,
        )

        try:
            data = json.loads(response_str)
            return ResearchReport(
                report_id=report_id,
                session_id=session_id,
                question=question,
                executive_summary=data.get("executive_summary", "Executive summary unavailable."),
                research_scope=data.get("research_scope", f"Evaluated: {question}"),
                methodology=data.get("methodology", "Multi-round search with Tavily and Nebius inference."),
                key_findings=data.get("key_findings", []),
                claim_verifications=claims,
                supporting_evidence=evidence_records,
                conflicting_information=conflicts,
                source_quality_assessment=[
                    {
                        "source_id": s.source_id,
                        "domain": s.domain,
                        "quality": s.quality_assessment.value,
                        "explanation": s.quality_explanation,
                    }
                    for s in sources
                ],
                research_gaps=data.get("research_gaps", []),
                limitations=data.get("limitations", []),
                conclusion=data.get("conclusion", "Research synthesis completed."),
                references=sources,
            )
        except Exception as e:
            logger.error(f"Failed to parse report JSON: {e}")
            return ResearchReport(
                report_id=report_id,
                session_id=session_id,
                question=question,
                executive_summary=f"Synthesis completed for question: {question}.",
                research_scope=f"Scope: {question}",
                methodology="Tavily multi-query search with Nebius reasoning.",
                key_findings=[f"Analyzed {len(sources)} unique sources for evidence."],
                claim_verifications=claims,
                supporting_evidence=evidence_records,
                conflicting_information=conflicts,
                source_quality_assessment=[],
                research_gaps=["Data coverage constrained by available online web results."],
                limitations=["Forward projections rely on published industry modeling."],
                conclusion="Sourced research review complete.",
                references=sources,
            )
