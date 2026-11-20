"""Streamlit Research History Component."""
import streamlit as st
from src.database.db import get_db


def render_history_page():
    st.header("📚 Research History")
    st.caption("Access previous research sessions, review reports, or continue investigations.")

    db = get_db()
    sessions = db.list_sessions()

    if not sessions:
        st.info("No past research sessions recorded.")
        return

    for s in sessions:
        with st.expander(f"[{s.created_at[:10]}] {s.question} ({s.status.value})", expanded=False):
            st.markdown(f"**Session ID:** `{s.session_id}` | **Status:** `{s.status.value}`")
            col1, col2 = st.columns(2)
            with col1:
                if st.button("📖 View Report", key=f"view_{s.session_id}"):
                    report = db.get_report_by_session(s.session_id)
                    st.session_state["active_report"] = report
                    st.session_state["active_session_id"] = s.session_id
                    st.session_state["current_screen"] = "Final Report"
                    st.rerun()
            with col2:
                if st.button("🗑️ Delete Session", key=f"del_{s.session_id}"):
                    db.delete_session(s.session_id)
                    st.success(f"Deleted session {s.session_id}")
                    st.rerun()
