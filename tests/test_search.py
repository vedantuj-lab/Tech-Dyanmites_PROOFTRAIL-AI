"""Unit tests for Tavily Web Search Service."""
import pytest
from src.services.tavily import TavilyService


def test_tavily_search_returns_results():
    service = TavilyService()
    results = service.execute_search("India EV charging market size 2027", max_results=3)

    assert isinstance(results, list)
    assert len(results) > 0
    assert "url" in results[0]
    assert "domain" in results[0]
    assert "content" in results[0]
