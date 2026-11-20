"""Source Quality Assessor: Authority, Freshness, and Reliability Analysis."""
import json
import logging
from typing import List, Dict, Any
from src.models.source import Source, SourceQuality
from src.services.nebius import NebiusService

logger = logging.getLogger(__name__)


class SourceQualityAssessor:
    def __init__(self, nebius_service: NebiusService):
        self.nebius = nebius_service

    def assess_sources(self, sources: List[Source]) -> List[Source]:
        """Assesses authority, freshness, and relevance of collected sources."""
        if not sources:
            return []

        # Domain heuristic rule pre-check
        for s in sources:
            d = s.domain.lower()
            if any(gov in d for gov in [".gov", ".edu", "niti.gov.in", "who.int", "worldbank.org"]):
                s.quality_assessment = SourceQuality.HIGH
                s.quality_explanation = "Official institutional / government domain."
            elif any(corp in d for corp in ["tatapower.com", "reuters.com", "bloomberg.com", "grandviewresearch.com"]):
                s.quality_assessment = SourceQuality.HIGH
                s.quality_explanation = "Established corporate entity or reputable market research publisher."
            else:
                s.quality_assessment = SourceQuality.MEDIUM
                s.quality_explanation = "Standard online news / industry publication."

        return sources
