"""Intelligent Research Planner Component."""
import json
import logging
from typing import Dict, Any, List
from src.models.research import ResearchPlan, ResearchDimension
from src.services.nebius import NebiusService
from src.utils.settings import settings

logger = logging.getLogger(__name__)


class ResearchPlanner:
    def __init__(self, nebius_service: NebiusService):
        self.nebius = nebius_service

    def create_plan(self, session_id: str, question: str) -> ResearchPlan:
        """Decomposes a research question into targeted dimensions and search queries."""
        prompt = f"""You are the Intelligent Research Planner for ProofTrail AI.
Decompose the following research question into subquestions and targeted search dimensions.

Research Question: {question}

Return strictly valid JSON with this structure:
{{
  "objective": "Clear statement of research objective",
  "geography": "Geographical scope (e.g., India, Global, US)",
  "time_period": "Target timeframe (e.g., 2027, 2024-2030)",
  "subject_scope": "Core domain summary",
  "subquestions": [
    "Subquestion 1",
    "Subquestion 2",
    "Subquestion 3",
    "Subquestion 4"
  ],
  "dimensions": [
    {{
      "dimension_name": "Dimension 1 Name",
      "description": "Short overview of dimension 1",
      "target_queries": ["query 1", "query 2"]
    }},
    {{
      "dimension_name": "Dimension 2 Name",
      "description": "Short overview of dimension 2",
      "target_queries": ["query 3", "query 4"]
    }}
  ]
}}
"""

        response_str = self.nebius.generate_completion(
            prompt=prompt,
            temperature=0.1,
            response_format_json=True,
        )

        try:
            data = json.loads(response_str)
            dimensions = [
                ResearchDimension(
                    dimension_name=d.get("dimension_name", "Dimension"),
                    description=d.get("description", ""),
                    target_queries=d.get("target_queries", []),
                )
                for d in data.get("dimensions", [])
            ]

            return ResearchPlan(
                session_id=session_id,
                objective=data.get("objective", f"Analyze: {question}"),
                geography=data.get("geography", "Global / Unspecified"),
                time_period=data.get("time_period", "Current"),
                subject_scope=data.get("subject_scope", question),
                subquestions=data.get("subquestions", [question]),
                dimensions=dimensions,
                max_rounds=settings.max_research_rounds,
                max_sources=settings.max_sources,
            )
        except Exception as e:
            logger.error(f"Failed to parse research plan JSON: {e}")
            # Robust fallback plan
            return ResearchPlan(
                session_id=session_id,
                objective=f"Investigate {question}",
                geography="Global / Unspecified",
                time_period="2027",
                subject_scope=question,
                subquestions=[question, f"Market dynamics for {question}", f"Regulatory factors for {question}"],
                dimensions=[
                    ResearchDimension(
                        dimension_name="Core Overview",
                        description="General landscape analysis",
                        target_queries=[question, f"{question} market overview"],
                    ),
                    ResearchDimension(
                        dimension_name="Policy & Risks",
                        description="Regulatory policies and operational risks",
                        target_queries=[f"{question} government policy subsidies", f"{question} risks barriers"],
                    ),
                ],
                max_rounds=settings.max_research_rounds,
                max_sources=settings.max_sources,
            )
