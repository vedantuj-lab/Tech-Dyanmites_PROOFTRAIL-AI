"""Multi-Round Live Web Researcher Component."""
import logging
from typing import List, Callable, Optional
from src.models.research import ResearchPlan
from src.models.source import Source
from src.services.tavily import TavilyService
from src.services.source_manager import SourceManager

logger = logging.getLogger(__name__)


class MultiRoundResearcher:
    def __init__(self, tavily_service: TavilyService, source_manager: SourceManager):
        self.tavily = tavily_service
        self.source_manager = source_manager

    def execute_multi_round_search(
        self,
        session_id: str,
        plan: ResearchPlan,
        event_callback: Optional[Callable[[str, str], None]] = None,
    ) -> List[Source]:
        """Executes controlled multi-round web search across discovery, investigation, and verification rounds."""
        max_rounds = plan.max_rounds

        # Collect queries grouped by dimension
        all_queries = []
        for dim in plan.dimensions:
            for q in dim.target_queries:
                if q not in all_queries:
                    all_queries.append(q)

        if not all_queries:
            all_queries = [plan.subject_scope]

        round_names = {1: "Discovery", 2: "Investigation", 3: "Verification"}

        for current_round in range(1, max_rounds + 1):
            r_name = round_names.get(current_round, f"Round {current_round}")
            if event_callback:
                event_callback("SEARCH_ROUND_START", f"Starting Stage {current_round}: {r_name}")

            # Pick query batch for current round
            queries_for_round = all_queries[(current_round - 1) * 2 : current_round * 2]
            if not queries_for_round and current_round > 1:
                # Reuse/refine query if batch exhausted
                queries_for_round = [f"{plan.subject_scope} verification data round {current_round}"]

            for query in queries_for_round:
                if event_callback:
                    event_callback("EXECUTE_QUERY", f"Searching web: '{query}'")

                results = self.tavily.execute_search(
                    query=query, max_results=plan.max_sources // (max_rounds * 2) + 2
                )
                new_added = self.source_manager.add_raw_search_results(
                    session_id=session_id,
                    results=results,
                    search_round=current_round,
                    search_query=query,
                )

                if event_callback:
                    event_callback(
                        "SOURCES_COLLECTED",
                        f"Retrieved {len(results)} results ({len(new_added)} unique new sources retained)",
                    )

            # Check evidence sufficiency to stop early if budget reached
            current_sources = self.source_manager.get_all_sources()
            if len(current_sources) >= plan.max_sources:
                if event_callback:
                    event_callback("SEARCH_COMPLETE", f"Reached maximum configured source capacity ({len(current_sources)} sources).")
                break

        return self.source_manager.get_all_sources()
