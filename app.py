"""ProofTrail AI Streamlit Web Application."""
import sys
from pathlib import Path
import streamlit as st

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from src.components import (
    render_home_page,
    render_workspace_page,
    render_evidence_explorer_page,
    render_report_page,
    render_history_page,
)
from src.utils.settings import settings

# Page Configuration
st.set_page_config(
    page_title="ProofTrail AI - The Evidence Intelligence Engine",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Styling
st.markdown(
    """
    <style>
    .stApp {
        background-color: #FAFAFA;
    }
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 3rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Session State Initialization
if "current_screen" not in st.session_state:
    st.session_state["current_screen"] = "Home"

# Sidebar Navigation
with st.sidebar:
    st.title("🔬 ProofTrail AI")
    st.caption("The Evidence Intelligence Engine")
    st.divider()

    nav_options = [
        "Home",
        "Workspace",
        "Evidence Explorer",
        "Final Report",
        "Research History",
    ]

    selected_screen = st.radio(
        "Navigation",
        nav_options,
        index=nav_options.index(st.session_state["current_screen"])
        if st.session_state["current_screen"] in nav_options
        else 0,
    )
    st.session_state["current_screen"] = selected_screen

    st.divider()
    st.markdown("### System Mode")
    if settings.is_mock_mode():
        st.warning("⚡ **Local Mock Mode**\nRunning with deterministic fallback evidence.")
    else:
        st.success("🟢 **Live API Mode**\nConnected to Nebius & Tavily.")

    st.caption("ProofTrail AI v1.0.0")

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
