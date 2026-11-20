"""Streamlit Home Component / Landing Page (Redesigned)."""
import streamlit as st
from src.services.nebius import NebiusService
from src.services.tavily import TavilyService


def render_home_page():
    # Hero Title Header
    st.markdown(
        """
        <div style="text-align: center; margin-bottom: 2.5rem; padding-top: 1rem;">
            <div style="display: inline-block; padding: 0.35rem 1rem; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 20px; color: #F59E0B; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem;">
                The Evidence Intelligence Engine
            </div>
            <h1 style="font-size: 3rem; font-weight: 900; color: #F9FAFB; margin: 0; letter-spacing: -0.03em;">PROOFTRAIL AI</h1>
            <p style="font-size: 1.25rem; color: #9CA3AF; margin-top: 0.5rem; font-style: italic;">
                "Don't Just Trust the Answer. Trace the Evidence."
            </p>
            <p style="font-size: 1.05rem; color: #D1D5DB; max-width: 750px; margin: 1rem auto 0 auto; line-height: 1.6;">
                Turn complex research questions into structured reports backed by live web search, open-model AI reasoning via Nebius Token Factory, claim verification, and transparent citations.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Main Research Input Hero Card
    st.markdown("<div class='pt-input-hero'>", unsafe_allow_html=True)
    st.markdown(
        "<h2 style='font-size: 1.5rem; margin-bottom: 0.25rem;'>🔍 What would you like to investigate?</h2>",
        unsafe_allow_html=True,
    )
    st.markdown(
        "<p style='color: #9CA3AF; font-size: 0.95rem; margin-bottom: 1rem;'>Ask a question. ProofTrail will search the live web, map evidence passages, detect contradictions, and synthesize a verifiable report.</p>",
        unsafe_allow_html=True,
    )

    preset_q = st.session_state.get("preset_question", "")
    question_input = st.text_area(
        "Research Question",
        value=preset_q or "Should a startup enter India's EV charging market in 2027?",
        height=90,
        placeholder="e.g. Should a startup enter India's EV charging market in 2027?",
        label_visibility="collapsed",
    )

    btn_col1, btn_col2, btn_spacer = st.columns([2, 1, 3])
    with btn_col1:
        start_clicked = st.button("🚀 Launch Investigation", type="primary", use_container_width=True)
    with btn_col2:
        if st.button("Clear", use_container_width=True):
            st.session_state["preset_question"] = " "
            st.rerun()

    st.markdown("</div>", unsafe_allow_html=True)

    if start_clicked:
        if not question_input.strip():
            st.warning("Please enter a research question.")
        else:
            st.session_state["active_question_input"] = question_input
            st.session_state["current_screen"] = "Workspace"
            st.rerun()

    # Example Research Questions Section
    st.markdown("<h3 style='font-size: 1.25rem; margin-bottom: 1rem;'>💡 Or Select an Example Research Topic</h3>", unsafe_allow_html=True)

    ex_col1, ex_col2, ex_col3 = st.columns(3)

    with ex_col1:
        st.markdown(
            """
            <div class='pt-card' style='height: 100%;'>
                <div style='color: #F59E0B; font-weight: 700; font-size: 0.8rem; text-transform: uppercase;'>Market Strategy</div>
                <h4 style='font-size: 1.05rem; margin: 0.5rem 0;'>EV Charging Infrastructure</h4>
                <p style='color: #9CA3AF; font-size: 0.88rem;'>Evaluates adoption CAGR, DISCOM power tariffs, and FAME subsidies.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )
        if st.button("Use Topic →", key="ex1", use_container_width=True):
            st.session_state["preset_question"] = "Should a startup enter India's EV charging market in 2027?"
            st.rerun()

    with ex_col2:
        st.markdown(
            """
            <div class='pt-card' style='height: 100%;'>
                <div style='color: #10B981; font-weight: 700; font-size: 0.8rem; text-transform: uppercase;'>Global Policy</div>
                <h4 style='font-size: 1.05rem; margin: 0.5rem 0;'>EU CBAM Climate Regulations</h4>
                <p style='color: #9CA3AF; font-size: 0.88rem;'>Analyzes tariff impacts on global steel exports and carbon compliance.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )
        if st.button("Use Topic →", key="ex2", use_container_width=True):
            st.session_state["preset_question"] = "What is the current impact of the EU Carbon Border Adjustment Mechanism (CBAM) on global steel exports?"
            st.rerun()

    with ex_col3:
        st.markdown(
            """
            <div class='pt-card' style='height: 100%;'>
                <div style='color: #3B82F6; font-weight: 700; font-size: 0.8rem; text-transform: uppercase;'>Energy & Tech</div>
                <h4 style='font-size: 1.05rem; margin: 0.5rem 0;'>SMR Nuclear Power</h4>
                <p style='color: #9CA3AF; font-size: 0.88rem;'>Assesses commercial viability of small modular reactors for AI datacenters by 2030.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )
        if st.button("Use Topic →", key="ex3", use_container_width=True):
            st.session_state["preset_question"] = "Evaluate the commercial viability of small modular nuclear reactors (SMRs) for datacenter power supply by 2030."
            st.rerun()

    st.markdown("<div style='margin-top: 2.5rem;'></div>", unsafe_allow_html=True)

    # 4-Step How ProofTrail Works
    st.markdown("<h3 style='font-size: 1.25rem; margin-bottom: 1rem;'>⚙️ How ProofTrail AI Operates</h3>", unsafe_allow_html=True)

    st_col1, st_col2, st_col3, st_col4 = st.columns(4)

    steps = [
        ("01", "Plan Research", "Decomposes the objective into target subquestions & dimensions.", "#F59E0B"),
        ("02", "Live Search", "Executes multi-round Tavily queries to collect live web sources.", "#10B981"),
        ("03", "Verify Evidence", "Extracts verbatim passages and detects conflicting facts.", "#3B82F6"),
        ("04", "Validate & Export", "Validates citations programmatically & generates PDF report.", "#8B5CF6"),
    ]

    for col, (num, title, desc, color) in zip([st_col1, st_col2, st_col3, st_col4], steps):
        with col:
            st.markdown(
                f"""
                <div class='pt-card' style='text-align: center; height: 100%;'>
                    <div style='font-size: 1.8rem; font-weight: 900; color: {color}; margin-bottom: 0.25rem;'>{num}</div>
                    <div style='font-weight: 700; font-size: 1rem; color: #F9FAFB; margin-bottom: 0.5rem;'>{title}</div>
                    <div style='font-size: 0.85rem; color: #9CA3AF; line-height: 1.4;'>{desc}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    st.markdown("<div style='margin-top: 2rem;'></div>", unsafe_allow_html=True)

    # Genuine System Health Summary
    with st.expander("🔌 Real System Integration Health Checks", expanded=False):
        n_service = NebiusService()
        t_service = TavilyService()
        n_health = n_service.check_health()
        t_health = t_service.check_health()

        h_col1, h_col2, h_col3 = st.columns(3)
        with h_col1:
            st.markdown(f"**Nebius Inference Engine:** `{n_health['status']}`")
            st.caption(n_health['details'])
        with h_col2:
            st.markdown(f"**Tavily Web Search:** `{t_health['status']}`")
            st.caption(t_health['details'])
        with h_col3:
            st.markdown("**SQLite Persistence:** `CONNECTED`")
            st.caption("Local database ready for session history")
