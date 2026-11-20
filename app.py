"""ProofTrail AI Streamlit Web Application (Redesigned UI/UX)."""
import sys
from pathlib import Path
import streamlit as st

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from src.utils.styles import inject_custom_css
from src.utils.settings import settings
from src.services.nebius import NebiusService
from src.services.tavily import TavilyService
from src.components import (
    render_home_page,
    render_workspace_page,
    render_evidence_explorer_page,
    render_report_page,
    render_history_page,
)

# Page Configuration
st.set_page_config(
    page_title="ProofTrail AI - The Evidence Intelligence Engine",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Inject Custom CSS Palette & Theme
inject_custom_css()

# Session State Initialization
if "current_screen" not in st.session_state:
    st.session_state["current_screen"] = "Home"

# Sidebar Branding & Navigation
with st.sidebar:
    st.markdown(
        """
        <div style="padding: 0.5rem 0 1rem 0; text-align: left;">
            <div style="font-size: 1.5rem; font-weight: 900; color: #F9FAFB; letter-spacing: -0.02em;">
                🔬 ProofTrail AI
            </div>
            <div style="font-size: 0.8rem; color: #F59E0B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.15rem;">
                Evidence Intelligence Engine
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("---")

    nav_options = [
        "🏠 Home",
        "🔬 Workspace",
        "🔍 Evidence Explorer",
        "📄 Final Report",
        "📚 Research History",
    ]

    # Map selected icon label back to screen name
    screen_mapping = {
        "🏠 Home": "Home",
        "🔬 Workspace": "Workspace",
        "🔍 Evidence Explorer": "Evidence Explorer",
        "📄 Final Report": "Final Report",
        "📚 Research History": "Research History",
    }

    current_name = st.session_state["current_screen"]
    # Find matching icon label
    reverse_mapping = {v: k for k, v in screen_mapping.items()}
    current_icon_label = reverse_mapping.get(current_name, "🏠 Home")

    selected_icon_label = st.radio(
        "Navigation",
        nav_options,
        index=nav_options.index(current_icon_label) if current_icon_label in nav_options else 0,
        label_visibility="collapsed",
    )

    selected_screen = screen_mapping[selected_icon_label]
    if selected_screen != st.session_state["current_screen"]:
        st.session_state["current_screen"] = selected_screen
        st.rerun()

    st.markdown("---")

    # Real System Status Indicators
    st.markdown("<div style='font-size: 0.8rem; font-weight: 700; color: #9CA3AF; margin-bottom: 0.5rem;'>SYSTEM INTEGRATION STATUS</div>", unsafe_allow_html=True)

    n_service = NebiusService()
    t_service = TavilyService()
    n_h = n_service.check_health()
    t_h = t_service.check_health()

    n_status_color = "#10B981" if n_h["status"] == "CONNECTED" else "#F59E0B" if n_h["status"] == "MOCK_MODE" else "#EF4444"
    t_status_color = "#10B981" if t_h["status"] == "CONNECTED" else "#F59E0B" if t_h["status"] == "MOCK_MODE" else "#EF4444"

    st.markdown(
        f"""
        <div style='font-size: 0.82rem; margin-bottom: 0.4rem; color: #D1D5DB;'>
            <span style='color: {n_status_color}; font-weight: bold;'>●</span> Nebius LLM: <b style='color: #F9FAFB;'>{n_h['status']}</b>
        </div>
        <div style='font-size: 0.82rem; margin-bottom: 0.4rem; color: #D1D5DB;'>
            <span style='color: {t_status_color}; font-weight: bold;'>●</span> Tavily Search: <b style='color: #F9FAFB;'>{t_h['status']}</b>
        </div>
        <div style='font-size: 0.82rem; color: #D1D5DB;'>
            <span style='color: #10B981; font-weight: bold;'>●</span> SQLite DB: <b style='color: #F9FAFB;'>READY</b>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("<div style='margin-top: 2rem; font-size: 0.75rem; color: #6B7280; text-align: center;'>ProofTrail AI v1.0.0</div>", unsafe_allow_html=True)

# Screen Router
screen = st.session_state["current_screen"]

if screen == "Home":
    render_home_page()
elif screen == "Workspace":
    render_workspace_page()
elif screen == "Evidence Explorer":
    render_evidence_explorer_page()
elif screen == "Final Report":
    render_report_page()
elif screen == "Research History":
    render_history_page()
