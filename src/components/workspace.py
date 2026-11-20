"""Streamlit Research Workspace Component (Redesigned)."""
import streamlit as st
import time
from src.agent_core.orchestrator import ResearchOrchestrator
from src.database.db import get_db
from src.services.nebius import NebiusService
from src.services.tavily import TavilyService


def render_workspace_page():
    st.markdown(
        """
        <div style="margin-bottom: 1.5rem;">
            <h1 style="font-size: 2rem; color: #F9FAFB; margin: 0;">🔬 Research Workspace</h1>
            <p style="color: #9CA3AF; font-size: 0.95rem; margin-top: 0.25rem;">
                Execute multi-round search, claim extraction, evidence mapping, and report synthesis.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    db = get_db()

    # Check if a question was submitted from Home or existing active question
    default_q = st.session_state.get(
        "active_question_input",
        st.session_state.get(
            "preset_question", "Should a startup enter India's EV charging market in 2027?"
        ),
    )

    # Question Input Container
    st.markdown("<div class='pt-card'>", unsafe_allow_html=True)
    st.markdown("<h3 style='font-size: 1.1rem; margin-bottom: 0.5rem;'>Investigate Question</h3>", unsafe_allow_html=True)

    question_input = st.text_area(
        "Question",
        value=default_q,
        height=80,
        label_visibility="collapsed",
    )

    col_run, col_status = st.columns([2, 3])
    with col_run:
        run_clicked = st.button("🚀 Start Evidence Pipeline", type="primary", use_container_width=True)

    with col_status:
        n_service = NebiusService()
        t_service = TavilyService()
        n_h = n_service.check_health()
        t_h = t_service.check_health()
        st.caption(f"Mode: **{'Mock Fallback' if 'MOCK' in n_h['status'] else 'Live API'}** | Model: `{n_service.model}`")

    st.markdown("</div>", unsafe_allow_html=True)

    # Execute pipeline if triggered
    if run_clicked or ("auto_trigger" in st.session_state and st.session_state["auto_trigger"]):
        st.session_state["auto_trigger"] = False
        if not question_input.strip():
            st.warning("Please enter a valid research question.")
            return

        st.session_state["trace_logs"] = []

        progress_placeholder = st.empty()
        log_placeholder = st.empty()

        def ui_event_callback(event_type: str, description: str):
            if "trace_logs" not in st.session_state:
                st.session_state["trace_logs"] = []
            st.session_state["trace_logs"].append(f"[{event_type}] {description}")

        orchestrator = ResearchOrchestrator()
        with st.spinner("ProofTrail AI Engine is investigating the web & evaluating evidence..."):
            report = orchestrator.run_research_pipeline(
                question=question_input,
                event_callback=ui_event_callback,
            )

        st.session_state["active_report"] = report
        st.session_state["active_session_id"] = report.session_id
        st.success("✓ Research Investigation Completed!")
        time.sleep(0.5)
        st.session_state["current_screen"] = "Final Report"
        st.rerun()

    # Display active session details if present
    session_id = st.session_state.get("active_session_id")
    if session_id:
        session = db.get_session(session_id)
        report = st.session_state.get("active_report") or db.get_report_by_session(session_id)
        sources = db.get_sources(session_id)
        claims = db.get_claims(session_id)

        if session:
            # Metrics Row
            st.markdown(
                f"""
                <div class='pt-metric-grid'>
                    <div class='pt-metric-card'>
                        <div class='pt-metric-label'>Status</div>
                        <div class='pt-metric-value' style='color: #10B981;'>{session.status.value}</div>
                    </div>
                    <div class='pt-metric-card'>
                        <div class='pt-metric-label'>Sources Retained</div>
                        <div class='pt-metric-value'>{len(sources)}</div>
                    </div>
                    <div class='pt-metric-card'>
                        <div class='pt-metric-label'>Claims Mapped</div>
                        <div class='pt-metric-value'>{len(claims)}</div>
                    </div>
                    <div class='pt-metric-card'>
                        <div class='pt-metric-label'>Citation Check</div>
                        <div class='pt-metric-value' style='color: {"#10B981" if report and report.citation_validation.is_valid else "#F59E0B"};'>
                            {"PASSED" if report and report.citation_validation.is_valid else "FLAGS"}
                        </div>
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )

            # Workflow Steps Status Card
            st.markdown("<div class='pt-card'>", unsafe_allow_html=True)
            st.markdown("<h3 style='font-size: 1.1rem; margin-bottom: 0.75rem;'>⚡ Research Execution Trace</h3>", unsafe_allow_html=True)

            steps_data = [
                ("1", "Question Understanding & Objective Decomposition", "COMPLETED"),
                ("2", "Multi-Stage Tavily Web Query Execution", "COMPLETED"),
                ("3", "Source Quality & Domain Authority Check", "COMPLETED"),
                ("4", "Verbatim Evidence Passage Extraction", "COMPLETED"),
                ("5", "Statistical Discrepancy & Conflict Analysis", "COMPLETED"),
                ("6", "Report Synthesis & Deterministic Citation Integrity Check", "COMPLETED"),
            ]

            for num, label, status in steps_data:
                st.markdown(
                    f"""
                    <div style='display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background-color: #0F172A; border-radius: 6px; margin-bottom: 0.4rem; border: 1px solid #334155;'>
                        <div style='display: flex; align-items: center; gap: 0.75rem;'>
                            <div style='width: 24px; height: 24px; border-radius: 50%; background-color: #10B981; color: #000; font-weight: bold; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;'>✓</div>
                            <span style='font-size: 0.9rem; color: #F9FAFB;'>{label}</span>
                        </div>
                        <span style='font-size: 0.75rem; color: #34D399; font-weight: 700;'>{status}</span>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
            st.markdown("</div>", unsafe_allow_html=True)

            # Research Plan & Retained Sources
            c1, c2 = st.columns(2)

            with c1:
                st.markdown("<div class='pt-card'>", unsafe_allow_html=True)
                st.markdown("<h3 style='font-size: 1.1rem;'>📋 Research Plan Breakdown</h3>", unsafe_allow_html=True)
                if session.plan:
                    st.markdown(f"**Objective:** {session.plan.objective}")
                    st.markdown(f"**Scope:** {session.plan.subject_scope} | **Geography:** {session.plan.geography}")
                    st.markdown("**Subquestions:**")
                    for sq in session.plan.subquestions:
                        st.markdown(f"- {sq}")
                st.markdown("</div>", unsafe_allow_html=True)

            with c2:
                st.markdown("<div class='pt-card'>", unsafe_allow_html=True)
                st.markdown("<h3 style='font-size: 1.1rem;'>📚 Retained Sources</h3>", unsafe_allow_html=True)
                for s in sources[:4]:
                    st.markdown(
                        f"""
                        <div style='padding: 0.5rem; background-color: #0F172A; border-radius: 6px; margin-bottom: 0.4rem; border: 1px solid #334155;'>
                            <div style='font-size: 0.85rem; font-weight: bold; color: #F9FAFB;'>[{s.source_id}] {s.title}</div>
                            <div style='font-size: 0.75rem; color: #9CA3AF;'>{s.domain} | Quality: <span style='color: #10B981;'>{s.quality_assessment.value}</span></div>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )
                st.markdown("</div>", unsafe_allow_html=True)

    # Live Trace Output if active
    if "trace_logs" in st.session_state and st.session_state["trace_logs"]:
        with st.expander("Console Event Trace Logs", expanded=False):
            for log in st.session_state["trace_logs"]:
                st.code(log, language="text")
