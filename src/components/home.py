"""Streamlit Home Component / Landing Page."""
import streamlit as st


def render_home_page():
    st.markdown(
        """
        <div style="text-align: center; padding: 2rem 0;">
            <h1 style="color: #1A2B4C; font-size: 2.8rem; margin-bottom: 0.2rem;">PROOFTRAIL AI</h1>
            <h3 style="color: #D97706; font-weight: 400; font-size: 1.4rem;">The Evidence Intelligence Engine</h3>
            <p style="font-size: 1.2rem; color: #4B5563; max-width: 800px; margin: 1rem auto;">
                "Don't Just Trust the Answer. Trace the Evidence."
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    col1, col2 = st.columns([3, 2])

    with col1:
        st.markdown("### Research Beyond Answers. Discover the Evidence.")
        st.write(
            "ProofTrail AI transforms research questions into structured, sourced, verifiable research reports. "
            "Using live web search, open-model AI reasoning via Nebius Token Factory, claim verification, and transparent citations, "
            "it prioritizes evidence integrity over unverified claims."
        )

        st.markdown("#### How It Works")
        st.markdown(
            """
            1. **Intelligent Planning:** Decomposes complex questions into targeted subquestions and research dimensions.
            2. **Multi-Round Web Search:** Executes multi-stage Tavily live web queries across discovery and verification rounds.
            3. **Evidence Intelligence Engine:** Extracts factual claims and connects each claim to exact, verbatim source passages.
            4. **Claim & Conflict Verification:** Identifies supporting vs. contradictory evidence and detects statistical discrepancies.
            5. **Deterministic Citation Validation:** Guarantees that every reference maps to a real, verified source.
            """
        )

        if st.button("🚀 Start Research Now", type="primary", use_container_width=True):
            st.session_state["current_screen"] = "Workspace"
            st.rerun()

    with col2:
        st.info("💡 **Try these Example Research Questions:**")
        sample_questions = [
            "Should a startup enter India's EV charging market in 2027?",
            "What is the current impact of EU Carbon Border Adjustment Mechanism (CBAM) on global steel exports?",
            "Evaluate commercial viability of small modular nuclear reactors (SMRs) for datacenter power supply by 2030.",
        ]

        for q in sample_questions:
            if st.button(q, key=f"btn_{q}"):
                st.session_state["preset_question"] = q
                st.session_state["current_screen"] = "Workspace"
                st.rerun()

    st.markdown("---")
    st.markdown("### Engine Architecture")
    st.markdown(
        """
        - **Model Inference:** Nebius Token Factory (`MiniMaxAI/MiniMax-M3`)
        - **Live Search:** Tavily Live Web Search API
        - **Storage:** SQLite Database with full session history
        - **Export:** ReportLab Professional PDF Generation
        """
    )
