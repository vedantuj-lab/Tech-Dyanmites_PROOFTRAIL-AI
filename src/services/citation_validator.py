"""Deterministic Citation & Evidence Integrity Validator."""
import re
from typing import List, Set
from src.models.claim import Claim, VerificationStatus
from src.models.source import Source
from src.models.evidence import EvidenceRecord, CitationValidationResult, ResearchReport


class CitationValidator:
    """Validates every citation reference in a Research Report against actual sources and evidence records."""

    @staticmethod
    def validate_report(
        report: ResearchReport, sources: List[Source], evidence_records: List[EvidenceRecord]
    ) -> CitationValidationResult:
        valid_source_ids: Set[str] = {s.source_id for s in sources}
        supported_claim_ids: Set[str] = {ev.claim_id for ev in evidence_records}

        missing_sources = []
        unsupported_claims = []
        invalid_citation_ids = []

        # 1. Extract all SRC_xxx patterns from report text fields
        text_to_scan = f"{report.executive_summary} {report.conclusion} {' '.join(report.key_findings)}"
        cited_ids = set(re.findall(r"\bSRC_\d{3}\b", text_to_scan))

        # Check references list in report
        for ref in report.references:
            if ref.source_id not in valid_source_ids:
                missing_sources.append(ref.source_id)

        # Check citations found in report text
        for cid in cited_ids:
            if cid not in valid_source_ids:
                invalid_citation_ids.append(cid)

        # Check claim verifications
        for claim in report.claim_verifications:
            if claim.claim_id not in supported_claim_ids and claim.verification_status == VerificationStatus.SUPPORTED:
                unsupported_claims.append(claim.claim_id)
                # Reclassifying unsupported claim for integrity
                claim.verification_status = VerificationStatus.UNVERIFIED
                claim.explanation = (claim.explanation or "") + " [FLAGGED: Missing direct supporting evidence passage]"

        total_citations = len(cited_ids) + len(report.references)
        invalid_count = len(missing_sources) + len(invalid_citation_ids)
        valid_citations = max(0, total_citations - invalid_count)
        is_valid = invalid_count == 0 and len(unsupported_claims) == 0

        return CitationValidationResult(
            is_valid=is_valid,
            total_citations=total_citations,
            valid_citations=valid_citations,
            missing_sources=missing_sources,
            unsupported_claims=unsupported_claims,
            invalid_citation_ids=invalid_citation_ids,
            details={
                "scanned_source_count": len(valid_source_ids),
                "evidence_record_count": len(evidence_records),
            },
        )
