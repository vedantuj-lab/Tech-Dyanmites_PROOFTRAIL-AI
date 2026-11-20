"""Unit tests for Research Planner."""
import pytest
from src.services.nebius import NebiusService
from src.agent_core.planner import ResearchPlanner


def test_planner_creates_valid_plan():
    nebius = NebiusService()
    planner = ResearchPlanner(nebius)
    plan = planner.create_plan("test_session_01", "Should a startup enter India's EV charging market in 2027?")

    assert plan.session_id == "test_session_01"
    assert len(plan.subquestions) > 0
    assert len(plan.dimensions) > 0
    assert plan.max_rounds >= 1
