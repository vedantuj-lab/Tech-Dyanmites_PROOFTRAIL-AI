"""Streamlit Evidence Explorer Component."""
import streamlit as st
from src.database.db import get_db
from src.models.claim import VerificationStatus
from src.models.evidence import EvidenceRelationship


def render_evidence_explorer_page():
    st.header("🔍 Evidence Explorer")
    st.caption("Inspect extracted factual claims, verbatim source passages, and contradictory evidence.")

    db = get_db()
    session_id = st.session_state.get("active_session_id")

    if not session_id:
        sessions = db.list_sessions()
        if not sessions:
            st.info("No active or past research sessions found. Start research in the Workspace!")
            return
        session_id = sessions[0].session_id
        st.session_state["active_session_id"] = session_id

    st.subheader(f"Session: `{session_id}`")

    claims = db.get_claims(session_id)
    evidence_records = db.get_evidence_records(session_id)
    conflicts = db.get_conflicts(session_id)
    sources = db.get_sources(session_id)

    if not claims:
        st.info("No extracted claims recorded for this session.")
        return

    tab1, tab2, tab3 = st.tabs(["Claim Verification Matrix", "Conflicting Evidence", "Source Quality & Metadata"])

    with tab1:
        st.markdown("### Extracted Factual Claims & Verbatim Passages")
        for claim in claims:
            status_color = "#059669" if claim.verification_status == VerificationStatus.SUPPORTED else "#D97706" if claim.verification_status == VerificationStatus.PARTIALLY_SUPPORTED else "#DC2626"
            with st.expander(f"[{claim.verification_status.value}] {claim.claim_text}", expanded=True):
                st.markdown(f"**Category:** `{claim.claim_category.value}` | **Importance:** `{claim.importance}`")
                st.markdown(f"**Verification Explanation:** {claim.explanation}")

                # Matching evidence passages
                matching_ev = [ev for ev in evidence_records if ev.claim_id == claim.claim_id]
                if matching_ev:
                    st.markdown("**Verbatim Supporting Passages:**")
                    for ev in matching_ev:
                        rel_badge = f":green[[{ev.relationship.value}]]" if ev.relationship == EvidenceRelationship.SUPPORTS else f":red[[{ev.relationship.value}]]"
                        st.info(f"Source ID: **{ev.source_id}** {rel_badge}\n\n> *\"{ev.exact_passage}\"*\n\n{ev.relevance_explanation}")
                else:
                    st.warning("No direct verbatim passage mapped to this claim.")

    with tab2:
        st.markdown("### Detected Discrepancies & Conflicting Information")
        if conflicts:
            for conf in conflicts:
                st.error(
                    f"**Conflict Type:** `{conf.conflict_type}`\n\n"
                    f"{conf.explanation}\n\n"
                    f"• **Source A ({conf.source_a_id}):** *\"{conf.passage_a}\"*\n\n"
                    f"• **Source B ({conf.source_b_id}):** *\"{conf.passage_b}\"*"
                )
        else:
            st.success("No direct contradictions detected between collected sources.")

    with tab3:
        st.markdown("### Collected Sources & Quality Assessment")
        for s in sources:
            st.markdown(f"**[{s.source_id}] [{s.title}]({s.url})**")
            st.markdown(f"Domain: `{s.domain}` | Quality: `{s.quality_assessment.value}`")
            st.caption(s.quality_explanation)
            st.divider()
