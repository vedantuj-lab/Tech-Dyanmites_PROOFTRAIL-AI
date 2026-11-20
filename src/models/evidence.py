"""Evidence, conflict detection, citation validation, and report models."""
from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from src.models.claim import Claim, VerificationStatus
from src.models.source import Source


class EvidenceRelationship(str, Enum):
    SUPPORTS = "SUPPORTS"
    CONTRADICTS = "CONTRADICTS"
    CONTEXTUALISES = "CONTEXTUALISES"


class EvidenceRecord(BaseModel):
    evidence_id: str
    claim_id: str
    source_id: str
    session_id: str
    exact_passage: str
    relationship: EvidenceRelationship = EvidenceRelationship.SUPPORTS
    relevance_explanation: str
    source_location: Optional[str] = None


class ConflictRecord(BaseModel):
    conflict_id: str
    session_id: str
    claim_id: Optional[str] = None
    source_a_id: str
    source_b_id: str
    passage_a: str
    passage_b: str
    conflict_type: str  # e.g., "STATISTICAL_DISCREPANCY", "METHODOLOGY_DIFFERENCE", "POLICY_TIMELINE"
    explanation: str
    resolved: bool = False
    resolution_note: Optional[str] = None


class CitationValidationResult(BaseModel):
    is_valid: bool = True
    total_citations: int = 0
    valid_citations: int = 0
    missing_sources: List[str] = Field(default_factory=list)
    unsupported_claims: List[str] = Field(default_factory=list)
    invalid_citation_ids: List[str] = Field(default_factory=list)
    details: Dict[str, Any] = Field(default_factory=dict)


class ResearchReport(BaseModel):
    report_id: str
    session_id: str
    question: str
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    executive_summary: str
    research_scope: str
    methodology: str
    key_findings: List[str] = Field(default_factory=list)
    claim_verifications: List[Claim] = Field(default_factory=list)
    supporting_evidence: List[EvidenceRecord] = Field(default_factory=list)
    conflicting_information: List[ConflictRecord] = Field(default_factory=list)
    source_quality_assessment: List[Dict[str, Any]] = Field(default_factory=list)
    research_gaps: List[str] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)
    conclusion: str
    references: List[Source] = Field(default_factory=list)
    citation_validation: CitationValidationResult = Field(default_factory=CitationValidationResult)
