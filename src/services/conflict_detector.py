"""Conflict Detector: Identify Discrepancies and Contradictory Evidence."""
import json
import logging
from typing import List, Tuple
from src.models.evidence import ConflictRecord
from src.models.source import Source
from src.models.claim import Claim
from src.services.nebius import NebiusService

logger = logging.getLogger(__name__)


class ConflictDetector:
    def __init__(self, nebius_service: NebiusService):
        self.nebius = nebius_service

    def detect_conflicts(
        self, session_id: str, claims: List[Claim], sources: List[Source]
    ) -> List[ConflictRecord]:
        """Analyzes sources and claims to identify statistical, policy, or methodological conflicts."""
        if len(sources) < 2:
            return []

        sources_summary = "\n\n".join(
            f"SOURCE ID: {s.source_id}\nTITLE: {s.title}\nCONTENT: {s.content}"
            for s in sources
        )

        prompt = f"""You are an Evidence Conflict Detector.
Analyze the following sources and identify any conflicting information, opposing statistics, timeline discrepancies, or methodology differences between them.

Sources:
{sources_summary}

Respond strictly in valid JSON with this format:
{{
  "conflicts": [
    {{
      "source_a_id": "SRC_xxx",
      "source_b_id": "SRC_yyy",
      "passage_a": "Passage from Source A showing one viewpoint/figure",
      "passage_b": "Passage from Source B showing contradictory viewpoint/figure",
      "conflict_type": "STATISTICAL_DISCREPANCY|METHODOLOGY_DIFFERENCE|POLICY_TIMELINE|SCOPE_VARIATION",
      "explanation": "Clear explanation of the disagreement and whether it stems from different definitions or periods."
    }}
  ]
}}
"""

        response_str = self.nebius.generate_completion(
            prompt=prompt,
            temperature=0.1,
            response_format_json=True,
        )

        conflicts: List[ConflictRecord] = []
        try:
            data = json.loads(response_str)
            raw_conflicts = data.get("conflicts", [])
            for i, item in enumerate(raw_conflicts):
                conflicts.append(
                    ConflictRecord(
                        conflict_id=f"CNF_{i+1:03d}",
                        session_id=session_id,
                        source_a_id=item.get("source_a_id", "SRC_001"),
                        source_b_id=item.get("source_b_id", "SRC_002"),
                        passage_a=item.get("passage_a", ""),
                        passage_b=item.get("passage_b", ""),
                        conflict_type=item.get("conflict_type", "STATISTICAL_DISCREPANCY"),
                        explanation=item.get("explanation", ""),
                        resolved=False,
                    )
                )
        except Exception as e:
            logger.error(f"Failed to parse conflict detection JSON: {e}")

        return conflicts
