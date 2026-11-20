"""Streamlit Evidence Explorer Component (Redesigned)."""
import streamlit as st
from src.database.db import get_db
from src.models.claim import VerificationStatus
from src.models.evidence import EvidenceRelationship


def render_evidence_explorer_page():
    st.markdown(
        """
        <div style="margin-bottom: 1.5rem;">
            <h1 style="font-size: 2rem; color: #F9FAFB; margin: 0;">🔍 Evidence Explorer</h1>
            <p style="color: #9CA3AF; font-size: 0.95rem; margin-top: 0.25rem;">
                Trace every extracted claim directly to verbatim web source passages and contradictory evidence.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    db = get_db()
    session_id = st.session_state.get("active_session_id")

    if not session_id:
        sessions = db.list_sessions()
        if not sessions:
            st.markdown(
                """
                <div class='pt-card' style='text-align: center; padding: 3rem 1.5rem;'>
                    <h3 style='color: #9CA3AF;'>No Active Session Found</h3>
                    <p style='color: #6B7280;'>Launch a research investigation in the Workspace to explore extracted claims.</p>
                </div>
                """,
                unsafe_allow_html=True,
            )
            return
        session_id = sessions[0].session_id
        st.session_state["active_session_id"] = session_id

    # Session Selector Header Card
    st.markdown(
        f"""
        <div class='pt-card' style='padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;'>
            <div>
                <span style='color: #9CA3AF; font-size: 0.85rem;'>ACTIVE SESSION ID:</span>
                <span style='color: #F59E0B; font-weight: 700; font-size: 1rem; margin-left: 0.5rem;'>{session_id}</span>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    claims = db.get_claims(session_id)
    evidence_records = db.get_evidence_records(session_id)
    conflicts = db.get_conflicts(session_id)
    sources = db.get_sources(session_id)

    if not claims:
        st.info("No extracted claims recorded for this session.")
        return

    tab1, tab2, tab3 = st.tabs([
        "📋 Claim Verification Matrix",
        "⚔️ Conflicting Evidence",
        "🌐 Source Quality & Metadata",
    ])

    with tab1:
        st.markdown("<h3 style='font-size: 1.15rem; margin-bottom: 1rem;'>Extracted Factual Claims & Verbatim Passages</h3>", unsafe_allow_html=True)

        for claim in claims:
            status_val = claim.verification_status.value
            badge_class = "badge-supported" if status_val == "SUPPORTED" else "badge-partial" if status_val == "PARTIALLY_SUPPORTED" else "badge-conflicting" if status_val == "CONFLICTING" else "badge-unverified"

            with st.expander(f"[{status_val}] {claim.claim_text}", expanded=True):
                st.markdown(
                    f"""
                    <div style='margin-bottom: 0.75rem;'>
                        <span class='badge {badge_class}'>{status_val}</span>
                        <span style='margin-left: 0.5rem; font-size: 0.8rem; color: #9CA3AF;'>Category: <b>{claim.claim_category.value}</b> | Importance: <b>{claim.importance}</b></span>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
                st.markdown(f"**Verification Reason:** {claim.explanation}")

                # Matching evidence passages
                matching_ev = [ev for ev in evidence_records if ev.claim_id == claim.claim_id]
                if matching_ev:
                    st.markdown("<div style='margin-top: 0.75rem; font-weight: 700; font-size: 0.9rem; color: #F59E0B;'>Verbatim Source Passages:</div>", unsafe_allow_html=True)
                    for ev in matching_ev:
                        rel_color = "#10B981" if ev.relationship == EvidenceRelationship.SUPPORTS else "#EF4444"
                        st.markdown(
                            f"""
                            <div style='background-color: #0F172A; border-left: 4px solid {rel_color}; border-radius: 6px; padding: 0.75rem 1rem; margin-top: 0.5rem; border-top: 1px solid #334155; border-right: 1px solid #334155; border-bottom: 1px solid #334155;'>
                                <div style='font-size: 0.78rem; color: #9CA3AF; margin-bottom: 0.25rem;'>
                                    Source ID: <b style='color: #F9FAFB;'>{ev.source_id}</b> | Relationship: <b style='color: {rel_color};'>[{ev.relationship.value}]</b>
                                </div>
                                <div style='font-style: italic; color: #F3F4F6; font-size: 0.92rem;'>"{ev.exact_passage}"</div>
                                <div style='font-size: 0.82rem; color: #D1D5DB; margin-top: 0.4rem;'>{ev.relevance_explanation}</div>
                            </div>
                            """,
                            unsafe_allow_html=True,
                        )
                else:
                    st.warning("No direct verbatim passage mapped to this claim.")

    with tab2:
        st.markdown("<h3 style='font-size: 1.15rem; margin-bottom: 1rem;'>Detected Discrepancies & Conflicting Information</h3>", unsafe_allow_html=True)
        if conflicts:
            for conf in conflicts:
                st.markdown(
                    f"""
                    <div class='pt-card' style='border-left: 4px solid #EF4444;'>
                        <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;'>
                            <span style='font-weight: 700; color: #EF4444; font-size: 0.9rem;'>⚠️ {conf.conflict_type}</span>
                            <span style='font-size: 0.8rem; color: #9CA3AF;'>Sources: {conf.source_a_id} vs {conf.source_b_id}</span>
                        </div>
                        <p style='color: #F9FAFB; font-size: 0.95rem; margin-bottom: 0.75rem;'>{conf.explanation}</p>

                        <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;'>
                            <div style='background-color: #0F172A; padding: 0.75rem; border-radius: 6px; border: 1px solid #334155;'>
                                <div style='font-size: 0.78rem; color: #9CA3AF;'>Source A ({conf.source_a_id}):</div>
                                <div style='font-style: italic; color: #F3F4F6; font-size: 0.88rem; margin-top: 0.25rem;'>"{conf.passage_a}"</div>
                            </div>
                            <div style='background-color: #0F172A; padding: 0.75rem; border-radius: 6px; border: 1px solid #334155;'>
                                <div style='font-size: 0.78rem; color: #9CA3AF;'>Source B ({conf.source_b_id}):</div>
                                <div style='font-style: italic; color: #F3F4F6; font-size: 0.88rem; margin-top: 0.25rem;'>"{conf.passage_b}"</div>
                            </div>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
        else:
            st.markdown(
                """
                <div class='pt-card' style='text-align: center; border-left: 4px solid #10B981;'>
                    <h4 style='color: #34D399; margin: 0;'>✓ No Direct Contradictions Flagged</h4>
                    <p style='color: #9CA3AF; margin-top: 0.5rem; font-size: 0.9rem;'>Collected sources exhibit consistent statistical and policy assumptions.</p>
                </div>
                """,
                unsafe_allow_html=True,
            )

    with tab3:
        st.markdown("<h3 style='font-size: 1.15rem; margin-bottom: 1rem;'>Collected Web Sources & Domain Authority</h3>", unsafe_allow_html=True)
        for s in sources:
            q_color = "#10B981" if s.quality_assessment.value == "HIGH" else "#F59E0B"
            st.markdown(
                f"""
                <div class='pt-card'>
                    <div style='display: flex; justify-content: space-between; align-items: flex-start;'>
                        <div>
                            <span style='color: #F59E0B; font-weight: 700; font-size: 0.85rem;'>[{s.source_id}]</span>
                            <a href='{s.url}' target='_blank' style='color: #F9FAFB; font-weight: 700; font-size: 1.05rem; text-decoration: none; margin-left: 0.4rem;'>{s.title}</a>
                            <div style='color: #9CA3AF; font-size: 0.82rem; margin-top: 0.2rem;'>Domain: <b>{s.domain}</b> | Published: {s.publication_date or 'N/A'}</div>
                        </div>
                        <span class='badge' style='background-color: rgba(16, 185, 129, 0.15); color: {q_color}; border: 1px solid {q_color};'>{s.quality_assessment.value}</span>
                    </div>
                    <div style='background-color: #0F172A; padding: 0.75rem; border-radius: 6px; margin-top: 0.75rem; font-size: 0.88rem; color: #D1D5DB; border: 1px solid #334155;'>
                        {s.snippet}
                    </div>
                    <div style='font-size: 0.8rem; color: #9CA3AF; margin-top: 0.5rem;'>Quality Assessment: {s.quality_explanation}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
