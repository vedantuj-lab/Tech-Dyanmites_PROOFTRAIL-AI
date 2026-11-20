"""Unit tests for Source Manager normalization & deduplication."""
import pytest
from src.services.source_manager import SourceManager


def test_url_normalization_and_deduplication():
    sm = SourceManager()
    url1 = "https://WWW.Example.com/article/?utm_source=twitter&ref=123#section"
    url2 = "https://www.example.com/article"

    norm1 = sm.normalize_url(url1)
    norm2 = sm.normalize_url(url2)

    assert norm1 == norm2
    assert "utm_source" not in norm1
    assert "section" not in norm1

    raw_results = [
        {"url": url1, "title": "Article 1", "content": "Content 1"},
        {"url": url2, "title": "Article 1 Dup", "content": "Content 1 Dup"},
    ]
    added = sm.add_raw_search_results("ses_1", raw_results, search_round=1, search_query="test")

    assert len(added) == 1
    assert len(sm.get_all_sources()) == 1
