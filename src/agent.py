"""CLI Entry Point for ProofTrail AI."""
import sys
import os
import argparse
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.agent_core.orchestrator import ResearchOrchestrator
from src.utils.settings import settings
from src.utils.pdf_export import generate_pdf_report


def print_banner():
    banner = """
===================================================================
                   PROOFTRAIL AI
             The Evidence Intelligence Engine
    "Don't Just Trust the Answer. Trace the Evidence."
===================================================================
"""
    print(banner)


def cli_event_handler(event_type: str, description: str):
    prefix_map = {
        "QUESTION_RECEIVED": "[QUESTION]",
        "PLANNING_START": "[PLANNING]",
        "PLAN_GENERATED": "[PLAN]",
        "SEARCH_ROUND_START": "[SEARCH]",
        "EXECUTE_QUERY": "[QUERY]",
        "SOURCES_COLLECTED": "[SOURCES]",
        "QUALITY_ASSESSMENT": "[QUALITY]",
        "EVIDENCE_EXTRACTION": "[EVIDENCE]",
        "CONFLICT_DETECTION": "[CONFLICTS]",
        "REPORT_SYNTHESIS": "[SYNTHESIS]",
        "CITATION_VALIDATION": "[INTEGRITY]",
        "RESEARCH_COMPLETED": "[DONE]",
    }
    prefix = prefix_map.get(event_type, f"[{event_type}]")
    print(f" {prefix:<12} {description}")


def main():
    print_banner()

    parser = argparse.ArgumentParser(description="ProofTrail AI Research Engine CLI")
    parser.add_argument(
        "question",
        nargs="*",
        help="Research question to investigate",
    )
    parser.add_argument(
        "--pdf",
        action="store_true",
        help="Export report as a PDF file upon completion",
    )
    args = parser.parse_args()

    question_text = " ".join(args.question).strip()
    if not question_text:
        question_text = "Should a startup enter India's EV charging market in 2027?"

    print(f"Target Question: {question_text}\n")
    print("-------------------------------------------------------------------")
    print(f" Mode: {'MOCK MODE' if settings.is_mock_mode() else 'LIVE API MODE'}")
    print(f" Nebius Model: {settings.nebius_model}")
    print("-------------------------------------------------------------------\n")

    try:
        orchestrator = ResearchOrchestrator()
        report = orchestrator.run_research_pipeline(
            question=question_text,
            event_callback=cli_event_handler,
        )

        print("\n===================================================================")
        print("                     EXECUTIVE SUMMARY                             ")
        print("===================================================================")
        print(report.executive_summary)

        print("\n===================================================================")
        print("                     KEY FINDINGS                                  ")
        print("===================================================================")
        for i, f in enumerate(report.key_findings, 1):
            print(f" {i}. {f}")

        print("\n===================================================================")
        print("                     CLAIM VERIFICATION SUMMARY                    ")
        print("===================================================================")
        for c in report.claim_verifications:
            print(f" • [{c.verification_status.value}] {c.claim_text}")

        print("\n===================================================================")
        print("                     VERIFIED REFERENCES                           ")
        print("===================================================================")
        for ref in report.references:
            print(f" [{ref.source_id}] {ref.title} ({ref.domain})")
            print(f"       URL: {ref.url}")

        cv = report.citation_validation
        print(f"\n[CITATION INTEGRITY]: Valid={cv.is_valid} ({cv.valid_citations}/{cv.total_citations} cited sources verified)")

        if args.pdf or True:  # Auto generate PDF for CLI output convenience
            pdf_path = generate_pdf_report(report)
            print(f"\n📄 Generated PDF Report: {pdf_path}")

        print("\nResearch session completed successfully.")
        sys.exit(0)

    except Exception as e:
        print(f"\n❌ Research Engine Execution Failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
