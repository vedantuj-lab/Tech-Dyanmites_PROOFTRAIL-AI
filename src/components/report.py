"""Streamlit Final Report Component."""
import streamlit as st
import os
from src.database.db import get_db
from src.utils.pdf_export import generate_pdf_report


def render_report_page():
    st.header("📄 Final Evidence-Backed Research Report")

    report = st.session_state.get("active_report")
    db = get_db()

    if not report and st.session_state.get("active_session_id"):
        report = db.get_report_by_session(st.session_state["active_session_id"])

    if not report:
        st.info("No report generated yet. Run research in the Workspace first.")
        return

    # Citation Validation Badge
    cv = report.citation_validation
    if cv.is_valid:
        st.success(f"✓ Citation Validation Integrity Passed ({cv.valid_citations}/{cv.total_citations} Verified References)")
    else:
        st.warning(f"⚠️ Citation Validation Flagged Issues (Valid: {cv.valid_citations}/{cv.total_citations})")

    # PDF Download Button
    pdf_path = generate_pdf_report(report)
    if os.path.exists(pdf_path):
        with open(pdf_path, "rb") as f:
            st.download_button(
                label="📥 Download Professional PDF Report",
                data=f.read(),
                file_name=os.path.basename(pdf_path),
                mime="application/pdf",
                type="primary",
            )

    st.markdown("---")

    st.subheader(report.question)

    st.markdown("### 1. Executive Summary")
    st.write(report.executive_summary)

    st.markdown("### 2. Scope & Methodology")
    st.markdown(f"**Research Scope:** {report.research_scope}")
    st.markdown(f"**Methodology:** {report.methodology}")

    st.markdown("### 3. Key Findings")
    for finding in report.key_findings:
        st.markdown(f"- {finding}")

    st.markdown("### 4. Claim Verification Summary")
    for claim in report.claim_verifications:
        st.markdown(f"- **[{claim.verification_status.value}]** {claim.claim_text}")

    st.markdown("### 5. Research Gaps & Limitations")
    c1, c2 = st.columns(2)
    with c1:
        st.markdown("**Identified Research Gaps:**")
        for g in report.research_gaps:
            st.markdown(f"- {g}")
    with c2:
        st.markdown("**Methodological Limitations:**")
        for lim in report.limitations:
            st.markdown(f"- {lim}")

    st.markdown("### 6. Conclusion")
    st.write(report.conclusion)

    st.markdown("### 7. References")
    for ref in report.references:
        st.markdown(f"- **[{ref.source_id}] [{ref.title}]({ref.url})** ({ref.domain})")
