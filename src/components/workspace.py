"""Streamlit Research Workspace Component."""
import streamlit as st
from src.agent_core.orchestrator import ResearchOrchestrator
from src.services.nebius import NebiusService
from src.services.tavily import TavilyService
from src.utils.settings import settings


def render_workspace_page():
    st.header("🔬 Research Workspace")
    st.caption("Submit your question to launch multi-round search, claim extraction, and evidence verification.")

    # Backend Integration Health Status
    with st.expander("🔌 Backend API Integration Status", expanded=False):
        c1, c2 = st.columns(2)
        nebius_service = NebiusService()
        tavily_service = TavilyService()

        n_health = nebius_service.check_health()
        t_health = tavily_service.check_health()

        with c1:
            st.markdown(f"**Nebius Token Factory:** `{n_health['status']}`")
            st.caption(n_health['details'])
        with c2:
            st.markdown(f"**Tavily Search API:** `{t_health['status']}`")
            st.caption(t_health['details'])

    preset_q = st.session_state.get("preset_question", "")
    question_input = st.text_area(
        "Enter Research Question:",
        value=preset_q or "Should a startup enter India's EV charging market in 2027?",
        height=100,
        help="Be specific about subject, geography, timeframe, and business objective.",
    )

    if st.button("Start Evidence Gathering", type="primary", use_container_width=True):
        if not question_input.strip():
            st.warning("Please enter a research question.")
            return

        st.session_state["preset_question"] = ""
        st.session_state["trace_logs"] = []

        trace_container = st.container()
        progress_bar = st.progress(0, text="Initializing Research Orchestrator...")

        def ui_event_callback(event_type: str, description: str):
            if "trace_logs" not in st.session_state:
                st.session_state["trace_logs"] = []
            st.session_state["trace_logs"].append(f"[{event_type}] {description}")

        orchestrator = ResearchOrchestrator()
        with st.spinner("Gathering live web evidence and reasoning..."):
            report = orchestrator.run_research_pipeline(
                question=question_input,
                event_callback=ui_event_callback,
            )

        st.session_state["active_report"] = report
        st.session_state["active_session_id"] = report.session_id
        st.success("Research investigation completed!")
        st.session_state["current_screen"] = "Final Report"
        st.rerun()

    # Show live trace log if active
    if "trace_logs" in st.session_state and st.session_state["trace_logs"]:
        st.markdown("### 📋 Live Research Trace")
        with st.container(height=300):
            for log in st.session_state["trace_logs"]:
                st.code(log, language="text")
