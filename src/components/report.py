"""Streamlit Final Report Component (Redesigned)."""
import streamlit as st
import os
from src.database.db import get_db
from src.utils.pdf_export import generate_pdf_report


def render_report_page():
    st.markdown(
        """
        <div style="margin-bottom: 1.5rem;">
            <h1 style="font-size: 2rem; color: #F9FAFB; margin: 0;">📄 Final Research Report</h1>
            <p style="color: #9CA3AF; font-size: 0.95rem; margin-top: 0.25rem;">
                Evidence-backed research report synthesized with verified web citations.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    report = st.session_state.get("active_report")
    db = get_db()

    if not report and st.session_state.get("active_session_id"):
        report = db.get_report_by_session(st.session_state["active_session_id"])

    if not report:
        st.markdown(
            """
            <div class='pt-card' style='text-align: center; padding: 3rem 1.5rem;'>
                <h3 style='color: #9CA3AF;'>No Active Report Found</h3>
                <p style='color: #6B7280;'>Run a research investigation in the Workspace to generate a report.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )
        return

    # Top Status & PDF Download Action Bar
    cv = report.citation_validation
    cv_color = "#10B981" if cv.is_valid else "#F59E0B"
    cv_status_text = "PASSED" if cv.is_valid else "FLAGS DETECTED"

    bar_col1, bar_col2 = st.columns([3, 2])

    with bar_col1:
        st.markdown(
            f"""
            <div class='pt-card' style='padding: 0.75rem 1.25rem; margin-bottom: 0; display: flex; align-items: center; gap: 0.75rem;'>
                <div style='width: 12px; height: 12px; border-radius: 50%; background-color: {cv_color};'></div>
                <div>
                    <span style='font-size: 0.85rem; font-weight: 700; color: #F9FAFB;'>Citation Integrity: </span>
                    <span style='font-size: 0.85rem; color: {cv_color}; font-weight: 700;'>{cv_status_text}</span>
                    <span style='font-size: 0.8rem; color: #9CA3AF; margin-left: 0.5rem;'>({cv.valid_citations}/{cv.total_citations} Verified References)</span>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    with bar_col2:
        pdf_path = generate_pdf_report(report)
        if os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                st.download_button(
                    label="📥 Download Professional PDF Report",
                    data=f.read(),
                    file_name=os.path.basename(pdf_path),
                    mime="application/pdf",
                    type="primary",
                    use_container_width=True,
                )

    st.markdown("<div style='margin-top: 1.5rem;'></div>", unsafe_allow_html=True)

    # Question Title Header Card
    st.markdown(
        f"""
        <div class='pt-card' style='border-left: 4px solid #F59E0B;'>
            <div style='font-size: 0.8rem; color: #F59E0B; font-weight: 700; text-transform: uppercase;'>Research Subject</div>
            <h2 style='font-size: 1.4rem; color: #F9FAFB; margin: 0.25rem 0 0.5rem 0;'>{report.question}</h2>
            <div style='font-size: 0.8rem; color: #9CA3AF;'>Session ID: <b>{report.session_id}</b> | Generated: <b>{report.created_at[:10]}</b></div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # 1. Executive Summary
    st.markdown("<div class='pt-card'>", unsafe_allow_html=True)
    st.markdown("<h3 style='font-size: 1.15rem; color: #F59E0B;'>1. Executive Summary</h3>", unsafe_allow_html=True)
    st.markdown(f"<p style='font-size: 1rem; line-height: 1.7; color: #F3F4F6;'>{report.executive_summary}</p>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

    # 2. Scope & Methodology
    st.markdown("<div class='pt-card'>", unsafe_allow_html=True)
    st.markdown("<h3 style='font-size: 1.15rem; color: #F59E0B;'>2. Scope & Methodology</h3>", unsafe_allow_html=True)
    st.markdown(f"**Research Scope:** {report.research_scope}")
    st.markdown(f"**Methodology:** {report.methodology}")
    st.markdown("</div>", unsafe_allow_html=True)

    # 3. Key Findings
    st.markdown("<div class='pt-card'>", unsafe_allow_html=True)
    st.markdown("<h3 style='font-size: 1.15rem; color: #F59E0B;'>3. Key Findings</h3>", unsafe_allow_html=True)
    for i, finding in enumerate(report.key_findings, 1):
        st.markdown(
            f"""
            <div style='display: flex; gap: 0.75rem; margin-bottom: 0.75rem;'>
                <span style='font-weight: 800; color: #F59E0B; font-size: 1.05rem;'>{i}.</span>
                <span style='font-size: 0.95rem; color: #F9FAFB; line-height: 1.6;'>{finding}</span>
            </div>
            """,
            unsafe_allow_html=True,
        )
    st.markdown("</div>", unsafe_allow_html=True)

    # 4. Claim Verification Summary
    st.markdown("<div class='pt-card'>", unsafe_allow_html=True)
    st.markdown("<h3 style='font-size: 1.15rem; color: #F59E0B;'>4. Claim Verification Summary</h3>", unsafe_allow_html=True)
    for claim in report.claim_verifications:
        status_val = claim.verification_status.value
        badge_class = "badge-supported" if status_val == "SUPPORTED" else "badge-partial" if status_val == "PARTIALLY_SUPPORTED" else "badge-conflicting" if status_val == "CONFLICTING" else "badge-unverified"
        st.markdown(
            f"""
            <div style='display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background-color: #0F172A; border-radius: 6px; margin-bottom: 0.5rem; border: 1px solid #334155;'>
                <span style='font-size: 0.9rem; color: #F9FAFB;'>{claim.claim_text}</span>
                <span class='badge {badge_class}'>{status_val}</span>
            </div>
            """,
            unsafe_allow_html=True,
        )
    st.markdown("</div>", unsafe_allow_html=True)

    # 5. Research Gaps & Limitations
    c1, c2 = st.columns(2)
    with c1:
        st.markdown("<div class='pt-card' style='height: 100%;'>", unsafe_allow_html=True)
        st.markdown("<h3 style='font-size: 1.1rem; color: #F59E0B;'>5. Identified Research Gaps</h3>", unsafe_allow_html=True)
        for g in report.research_gaps:
            st.markdown(f"- {g}")
        st.markdown("</div>", unsafe_allow_html=True)
    with c2:
        st.markdown("<div class='pt-card' style='height: 100%;'>", unsafe_allow_html=True)
        st.markdown("<h3 style='font-size: 1.1rem; color: #F59E0B;'>6. Methodological Limitations</h3>", unsafe_allow_html=True)
        for lim in report.limitations:
            st.markdown(f"- {lim}")
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("<div style='margin-top: 1rem;'></div>", unsafe_allow_html=True)

    # 7. Conclusion
    st.markdown("<div class='pt-card'>", unsafe_allow_html=True)
    st.markdown("<h3 style='font-size: 1.15rem; color: #F59E0B;'>7. Conclusion</h3>", unsafe_allow_html=True)
    st.markdown(f"<p style='font-size: 0.98rem; line-height: 1.7; color: #F3F4F6;'>{report.conclusion}</p>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

    # 8. Verified References Table
    st.markdown("<div class='pt-card'>", unsafe_allow_html=True)
    st.markdown("<h3 style='font-size: 1.15rem; color: #F59E0B;'>8. Verified References Index</h3>", unsafe_allow_html=True)
    for ref in report.references:
        st.markdown(
            f"""
            <div style='padding: 0.6rem 0.75rem; background-color: #0F172A; border-radius: 6px; margin-bottom: 0.5rem; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;'>
                <div>
                    <span style='color: #F59E0B; font-weight: 700; font-size: 0.85rem;'>[{ref.source_id}]</span>
                    <a href='{ref.url}' target='_blank' style='color: #F9FAFB; font-weight: 700; font-size: 0.95rem; text-decoration: none; margin-left: 0.5rem;'>{ref.title}</a>
                    <span style='color: #9CA3AF; font-size: 0.8rem; margin-left: 0.5rem;'>({ref.domain})</span>
                </div>
                <span style='color: #10B981; font-size: 0.8rem; font-weight: 700;'>{ref.quality_assessment.value}</span>
            </div>
            """,
            unsafe_allow_html=True,
        )
    st.markdown("</div>", unsafe_allow_html=True)
