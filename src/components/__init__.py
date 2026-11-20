"""Streamlit components package."""
from src.components.home import render_home_page
from src.components.workspace import render_workspace_page
from src.components.evidence_explorer import render_evidence_explorer_page
from src.components.report import render_report_page
from src.components.history import render_history_page

__all__ = [
    "render_home_page",
    "render_workspace_page",
    "render_evidence_explorer_page",
    "render_report_page",
    "render_history_page",
]
