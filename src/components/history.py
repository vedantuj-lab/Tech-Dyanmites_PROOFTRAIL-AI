"""Streamlit Research History Component (Redesigned)."""
import streamlit as st
from src.database.db import get_db


def render_history_page():
    st.markdown(
        """
        <div style="margin-bottom: 1.5rem;">
            <h1 style="font-size: 2rem; color: #F9FAFB; margin: 0;">📚 Research History</h1>
            <p style="color: #9CA3AF; font-size: 0.95rem; margin-top: 0.25rem;">
                Manage and revisit past evidence investigations stored in SQLite database.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    db = get_db()
    sessions = db.list_sessions()

    if not sessions:
        st.markdown(
            """
            <div class='pt-card' style='text-align: center; padding: 3rem 1.5rem;'>
                <h3 style='color: #9CA3AF;'>No Past Research Sessions Recorded</h3>
                <p style='color: #6B7280;'>Start a new research investigation in the Workspace!</p>
            </div>
            """,
            unsafe_allow_html=True,
        )
        return

    st.markdown(f"<div style='font-size: 0.9rem; color: #9CA3AF; margin-bottom: 1rem;'>Total Recorded Investigations: <b>{len(sessions)}</b></div>", unsafe_allow_html=True)

    for s in sessions:
        st.markdown(
            f"""
            <div class='pt-card' style='margin-bottom: 1rem;'>
                <div style='display: flex; justify-content: space-between; align-items: flex-start;'>
                    <div>
                        <span style='color: #F59E0B; font-size: 0.8rem; font-weight: 700;'>SESSION ID: {s.session_id}</span>
                        <h3 style='font-size: 1.15rem; color: #F9FAFB; margin: 0.25rem 0 0.5rem 0;'>{s.question}</h3>
                        <div style='font-size: 0.8rem; color: #9CA3AF;'>Date: <b>{s.created_at[:10]}</b></div>
                    </div>
                    <span class='badge' style='background-color: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid #10B981;'>{s.status.value}</span>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        col1, col2, col_space = st.columns([2, 2, 4])
        with col1:
            if st.button("📖 Open Report", key=f"view_{s.session_id}", use_container_width=True):
                report = db.get_report_by_session(s.session_id)
                st.session_state["active_report"] = report
                st.session_state["active_session_id"] = s.session_id
                st.session_state["current_screen"] = "Final Report"
                st.rerun()
        with col2:
            if st.button("🗑️ Delete Session", key=f"del_{s.session_id}", use_container_width=True):
                db.delete_session(s.session_id)
                st.success(f"Deleted session {s.session_id}")
                st.rerun()

        st.markdown("<div style='margin-bottom: 1.25rem;'></div>", unsafe_allow_html=True)
