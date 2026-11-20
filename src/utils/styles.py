"""Centralized Design System and CSS Injection for ProofTrail AI."""
import streamlit as st


def inject_custom_css():
    st.markdown(
        """
        <style>
        /* Modern Dark Slate / Graphite Palette */
        :root {
            --bg-dark: #0B0F17;
            --surface-dark: #1E293B;
            --surface-hover: #334155;
            --border-color: #334155;
            --text-primary: #F9FAFB;
            --text-secondary: #9CA3AF;
            --text-muted: #6B7280;
            --accent-amber: #F59E0B;
            --accent-emerald: #10B981;
            --accent-red: #EF4444;
            --accent-blue: #3B82F6;
        }

        /* Global App Styling & High-Contrast Typography */
        .stApp {
            background-color: var(--bg-dark) !important;
            color: var(--text-primary) !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Ensure all standard markdown elements have high contrast */
        .stApp p, .stApp span, .stApp div, .stApp label, .stApp li {
            color: var(--text-primary) !important;
        }

        .stApp h1, .stApp h2, .stApp h3, .stApp h4, .stApp h5, .stApp h6 {
            color: var(--text-primary) !important;
            font-weight: 700 !important;
            letter-spacing: -0.02em;
        }

        /* Sidebar Styling */
        section[data-testid="stSidebar"] {
            background-color: #0F172A !important;
            border-right: 1px solid var(--border-color) !important;
        }

        section[data-testid="stSidebar"] .stMarkdown p {
            color: var(--text-secondary) !important;
        }

        /* Top Bar Header */
        .pt-header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            background-color: var(--surface-dark);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        /* Card Container Base */
        .pt-card {
            background-color: var(--surface-dark);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .pt-card:hover {
            border-color: #475569;
        }

        /* Primary Input Box Card */
        .pt-input-hero {
            background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
            border: 1px solid #475569;
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        }

        /* Streamlit Text Area & Text Inputs Overrides */
        .stTextArea textarea, .stTextInput input {
            background-color: #0F172A !important;
            color: #F9FAFB !important;
            border: 1px solid #475569 !important;
            border-radius: 10px !important;
            font-size: 1rem !important;
            padding: 0.75rem 1rem !important;
        }

        .stTextArea textarea:focus, .stTextInput input:focus {
            border-color: var(--accent-amber) !important;
            box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2) !important;
        }

        /* Metric Cards Grid */
        .pt-metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .pt-metric-card {
            background-color: #1E293B;
            border: 1px solid #334155;
            border-radius: 10px;
            padding: 1rem 1.25rem;
            text-align: center;
        }

        .pt-metric-value {
            font-size: 1.6rem;
            font-weight: 800;
            color: var(--accent-amber);
            margin-top: 0.25rem;
        }

        .pt-metric-label {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
        }

        /* Workflow Step Tracker */
        .pt-step-container {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin: 1.5rem 0;
        }

        .pt-step-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            background-color: #1E293B;
            border: 1px solid #334155;
            padding: 0.75rem 1.25rem;
            border-radius: 8px;
        }

        .pt-step-number {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: #334155;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.85rem;
        }

        .pt-step-active .pt-step-number {
            background-color: var(--accent-amber);
            color: #000;
        }

        .pt-step-completed .pt-step-number {
            background-color: var(--accent-emerald);
            color: #000;
        }

        /* Custom Status Badges */
        .badge {
            display: inline-block;
            padding: 0.25rem 0.65rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        .badge-supported {
            background-color: #064E3B;
            color: #34D399;
            border: 1px solid #059669;
        }

        .badge-partial {
            background-color: #78350F;
            color: #FBBF24;
            border: 1px solid #D97706;
        }

        .badge-conflicting {
            background-color: #7F1D1D;
            color: #F87171;
            border: 1px solid #DC2626;
        }

        .badge-unverified {
            background-color: #374151;
            color: #9CA3AF;
            border: 1px solid #4B5563;
        }

        /* Primary Action Buttons Override */
        .stButton button[kind="primary"] {
            background: linear-gradient(135deg, #D97706 0%, #B45309 100%) !important;
            color: #FFFFFF !important;
            font-weight: 700 !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 0.6rem 1.5rem !important;
            box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3) !important;
            transition: all 0.2s ease !important;
        }

        .stButton button[kind="primary"]:hover {
            background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%) !important;
            box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4) !important;
            transform: translateY(-1px);
        }

        /* Secondary Buttons Override */
        .stButton button[kind="secondary"], .stButton button:not([kind="primary"]) {
            background-color: #1E293B !important;
            color: #F9FAFB !important;
            border: 1px solid #475569 !important;
            border-radius: 8px !important;
            transition: all 0.2s ease !important;
        }

        .stButton button[kind="secondary"]:hover, .stButton button:not([kind="primary"]):hover {
            background-color: #334155 !important;
            border-color: #64748B !important;
        }

        /* Hide Streamlit Header / Deploy Bar */
        header[data-testid="stHeader"] {
            background: transparent !important;
        }

        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        </style>
        """,
        unsafe_allow_html=True,
    )
