"""Source Manager: Normalization, Deduplication, and Metadata Storage."""
import urllib.parse
from typing import List, Dict, Any, Tuple, Optional
from src.models.source import Source, SourceQuality


class SourceManager:
    def __init__(self):
        self.sources: Dict[str, Source] = {}
        self.canonical_url_map: Dict[str, str] = {}  # canonical_url -> source_id

    @staticmethod
    def normalize_url(raw_url: str) -> str:
        """Normalizes URLs for strict deduplication while preserving functional parameters.

        Strips tracking parameters (utm_*, ref, fbclid), removes trailing slashes,
        lowercases domain, and drops fragments.
        """
        if not raw_url:
            return ""

        parsed = urllib.parse.urlparse(raw_url.strip())
        domain = parsed.netloc.lower()

        # Filter query params
        query_params = urllib.parse.parse_qs(parsed.query, keep_blank_values=False)
        filtered_params = {
            k: v for k, v in query_params.items()
            if not k.startswith("utm_") and k not in ("ref", "fbclid", "gclid", "source")
        }

        new_query = urllib.parse.urlencode(filtered_params, doseq=True)
        path = parsed.path.rstrip("/")

        canonical = urllib.parse.urlunparse((
            parsed.scheme.lower() or "https",
            domain,
            path or "/",
            "",
            new_query,
            ""  # drop fragment #anchor
        ))
        return canonical

    def add_raw_search_results(
        self, session_id: str, results: List[Dict[str, Any]], search_round: int, search_query: str
    ) -> List[Source]:
        """Adds search results, deduplicates by canonical URL, and returns new Source objects."""
        added_sources = []
        for item in results:
            raw_url = item.get("url", "")
            if not raw_url:
                continue

            canonical = self.normalize_url(raw_url)
            if canonical in self.canonical_url_map:
                # Existing source - skip duplicate
                continue

            source_id = f"SRC_{len(self.sources) + 1:03d}"
            domain = item.get("domain") or urllib.parse.urlparse(canonical).netloc

            source = Source(
                source_id=source_id,
                session_id=session_id,
                url=raw_url,
                canonical_url=canonical,
                title=item.get("title", "Untitled Source"),
                domain=domain,
                snippet=item.get("snippet", ""),
                content=item.get("content", item.get("snippet", "")),
                publication_date=item.get("publication_date"),
                search_round=search_round,
                search_query=search_query,
                quality_assessment=SourceQuality.NOT_ASSESSED,
            )

            self.sources[source_id] = source
            self.canonical_url_map[canonical] = source_id
            added_sources.append(source)

        return added_sources

    def get_all_sources(self) -> List[Source]:
        return list(self.sources.values())

    def get_source_by_id(self, source_id: str) -> Optional[Source]:
        return self.sources.get(source_id)
