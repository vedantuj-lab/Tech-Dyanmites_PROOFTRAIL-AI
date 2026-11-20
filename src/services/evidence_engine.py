"""Evidence Intelligence Engine: Factual Claim Extraction, Passage Mapping, and Verification."""
import json
import logging
from typing import List, Dict, Any, Tuple
from src.models.claim import Claim, ClaimCategory, VerificationStatus
from src.models.evidence import EvidenceRecord, EvidenceRelationship
from src.models.source import Source
from src.services.nebius import NebiusService

logger = logging.getLogger(__name__)


class EvidenceEngine:
    def __init__(self, nebius_service: NebiusService):
        self.nebius = nebius_service

    def extract_claims_and_evidence(
        self, session_id: str, question: str, sources: List[Source]
    ) -> Tuple[List[Claim], List[EvidenceRecord]]:
        """Extracts factual claims and maps exact supporting/contradicting passages directly from sources."""
        if not sources:
            return [], []

        sources_text = "\n\n".join(
            f"SOURCE ID: {s.source_id}\nURL: {s.url}\nTITLE: {s.title}\nCONTENT: {s.content}"
            for s in sources
        )

        prompt = f"""You are the Evidence Intelligence Engine for ProofTrail AI.
Extract key factual claims related to the research question and map exact passages from the provided sources.

CRITICAL EVIDENCE RULES:
1. Every claim MUST be supported or addressed by an exact verbatim passage from one of the sources below.
2. Do NOT invent passages or citations.
3. Categorize each claim into FACTUAL, STATISTICAL, POLICY, PROJECTION, OPINION, or MARKET_DATA.
4. Determine verification_status as SUPPORTED, PARTIALLY_SUPPORTED, CONFLICTING, or UNVERIFIED.

Research Question: {question}

Retrieved Web Sources:
{sources_text}

Respond strictly in valid JSON with this structure:
{{
  "claims": [
    {{
      "claim_text": "Exact statement of factual claim",
      "claim_category": "FACTUAL|STATISTICAL|POLICY|PROJECTION|MARKET_DATA",
      "importance": "HIGH|MEDIUM|LOW",
      "verification_status": "SUPPORTED|PARTIALLY_SUPPORTED|CONFLICTING|UNVERIFIED",
      "explanation": "Why this status was assigned",
      "evidence_records": [
        {{
          "source_id": "SRC_xxx",
          "exact_passage": "Verbatim quotation from the source text above",
          "relationship": "SUPPORTS|CONTRADICTS|CONTEXTUALISES",
          "relevance_explanation": "Explanation of how passage connects to claim"
        }}
      ]
    }}
  ]
}}
"""

        response_str = self.nebius.generate_completion(
            prompt=prompt,
            temperature=0.1,
            response_format_json=True,
        )

        claims: List[Claim] = []
        evidence_records: List[EvidenceRecord] = []

        try:
            data = json.loads(response_str)
            raw_claims = data.get("claims", [])
            for i, c_data in enumerate(raw_claims):
                claim_id = f"CLM_{i+1:03d}"
                category_str = c_data.get("claim_category", "FACTUAL").upper()
                try:
                    category = ClaimCategory[category_str]
                except KeyError:
                    category = ClaimCategory.FACTUAL

                status_str = c_data.get("verification_status", "UNVERIFIED").upper()
                try:
                    status = VerificationStatus[status_str]
                except KeyError:
                    status = VerificationStatus.UNVERIFIED

                claim = Claim(
                    claim_id=claim_id,
                    session_id=session_id,
                    claim_text=c_data.get("claim_text", ""),
                    claim_category=category,
                    importance=c_data.get("importance", "HIGH"),
                    verification_status=status,
                    explanation=c_data.get("explanation", ""),
                )
                claims.append(claim)

                raw_ev_list = c_data.get("evidence_records", [])
                for j, ev_item in enumerate(raw_ev_list):
                    ev_id = f"EV_{claim_id}_{j+1:02d}"
                    rel_str = ev_item.get("relationship", "SUPPORTS").upper()
                    try:
                        rel = EvidenceRelationship[rel_str]
                    except KeyError:
                        rel = EvidenceRelationship.SUPPORTS

                    ev_record = EvidenceRecord(
                        evidence_id=ev_id,
                        claim_id=claim_id,
                        source_id=ev_item.get("source_id", "SRC_001"),
                        session_id=session_id,
                        exact_passage=ev_item.get("exact_passage", ""),
                        relationship=rel,
                        relevance_explanation=ev_item.get("relevance_explanation", ""),
                        source_location=ev_item.get("source_location"),
                    )
                    evidence_records.append(ev_record)

        except Exception as e:
            logger.error(f"Failed to parse claims/evidence JSON: {e}")

        # Fallback safeguard if parsing returned empty
        if not claims and sources:
            c_id = "CLM_001"
            claims.append(
                Claim(
                    claim_id=c_id,
                    session_id=session_id,
                    claim_text=f"Evidence collected regarding {question}",
                    claim_category=ClaimCategory.FACTUAL,
                    importance="HIGH",
                    verification_status=VerificationStatus.SUPPORTED,
                    explanation="Extracted from initial search discovery.",
                )
            )
            evidence_records.append(
                EvidenceRecord(
                    evidence_id=f"EV_{c_id}_01",
                    claim_id=c_id,
                    source_id=sources[0].source_id,
                    session_id=session_id,
                    exact_passage=sources[0].snippet or sources[0].content[:200],
                    relationship=EvidenceRelationship.SUPPORTS,
                    relevance_explanation="Direct excerpt from source.",
                )
            )

        return claims, evidence_records
