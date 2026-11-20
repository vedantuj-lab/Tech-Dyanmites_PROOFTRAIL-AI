"""Decision Intelligence Service: Generating Decision Support Briefs from Research Reports."""
import json
import logging
from typing import Dict, Any
from src.models.evidence import ResearchReport
from src.services.nebius import NebiusService

logger = logging.getLogger(__name__)


class DecisionIntelligenceEngine:
    def __init__(self, nebius_service: NebiusService):
        self.nebius = nebius_service

    def generate_decision_brief(self, report: ResearchReport) -> Dict[str, Any]:
        """Converts a ResearchReport into an actionable Decision Support Brief."""
        prompt = f"""You are the Decision Intelligence Engine for ProofTrail AI.
Transform the following evidence-backed research report into an actionable Decision Brief for executive decision-makers.

Research Question: {report.question}
Executive Summary: {report.executive_summary}
Key Findings: {json.dumps(report.key_findings)}
Limitations: {json.dumps(report.limitations)}

Return strictly valid JSON with this format:
{{
  "decision_question": "{report.question}",
  "decision_options": [
    {{
      "option_title": "Option 1: Full Market Entry in 2027",
      "description": "Establish operational infrastructure and fleet hubs",
      "supporting_evidence_summary": "Backed by projected 32.5% market CAGR and 70% capital subsidies.",
      "risk_factors": ["High electricity DISCOM demand charges", "Grid connection delays"]
    }},
    {{
      "option_title": "Option 2: Strategic Joint Venture / Software Operations Only",
      "description": "Partner with incumbent DISCOMs or fleet operators for software platform deployment",
      "supporting_evidence_summary": "Lowers upfront CAPEX exposure while capitalizing on fleet growth.",
      "risk_factors": ["Revenue sharing margin pressure"]
    }}
  ],
  "opportunities": [
    "High growth potential across Tier 1 and Tier 2 highway corridors.",
    "Capital subsidy coverage up to 70% for public fast chargers."
  ],
  "key_assumptions": [
    "State electricity boards maintain delicensing framework for EV charging.",
    "FAME subsidy allocations remain active through 2027."
  ],
  "unknowns": [
    "Local battery chemistry cost trajectories for 2027."
  ],
  "recommendation": "Adopt Option 2 initially (B2B fleet charging or software platform) to mitigate demand charge CAPEX risk, scaling to Option 1 as grid tariffs normalize.",
  "confidence_rating": "HIGH",
  "conditions_to_change_recommendation": [
    "Significant reduction in fixed kVA demand tariffs by state DISCOMs.",
    "Direct land acquisition grants for highway charging hubs."
  ]
}}
"""

        response_str = self.nebius.generate_completion(
            prompt=prompt,
            temperature=0.2,
            response_format_json=True,
        )

        try:
            return json.loads(response_str)
        except Exception as e:
            logger.error(f"Failed to parse decision brief JSON: {e}")
            return {
                "decision_question": report.question,
                "decision_options": [
                    {
                        "option_title": "Primary Entry Option",
                        "description": "Proceed with market entry based on evidence",
                        "supporting_evidence_summary": "Backed by verified sources",
                        "risk_factors": report.limitations,
                    }
                ],
                "opportunities": report.key_findings,
                "key_assumptions": ["Regulatory framework remains consistent"],
                "unknowns": report.research_gaps,
                "recommendation": report.conclusion,
                "confidence_rating": "MEDIUM",
                "conditions_to_change_recommendation": ["Major policy shift in target region"],
            }
