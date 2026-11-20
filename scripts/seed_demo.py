"""Idempotent Demo Data Seed Script for ProofTrail AI."""
import sys
import os
import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.database.db import get_db
from src.utils.security import hash_password
from src.models.research import ResearchSession, ResearchStatus, ResearchPlan, ResearchDimension
from src.models.source import Source, SourceQuality
from src.models.claim import Claim, ClaimCategory, VerificationStatus
from src.models.evidence import EvidenceRecord, EvidenceRelationship, ConflictRecord, ResearchReport, CitationValidationResult


def seed_demo_data():
    print("🌱 Seeding ProofTrail AI Demo Environment...")
    db = get_db()
    conn = db.get_connection()

    # 1. Seed Demo Accounts
    demo_accounts = [
        ("USR_RESEARCHER_DEMO", "researcher@prooftrail.demo", "Research@123", "Aarav Mehta", "RESEARCHER", "Market Labs India"),
        ("USR_REVIEWER_DEMO", "reviewer@prooftrail.demo", "Review@123", "Ananya Sharma", "REVIEWER", "Global Evidence Review"),
        ("USR_ADMIN_DEMO", "admin@prooftrail.demo", "Admin@123", "Rohan Kapoor", "ADMIN", "ProofTrail AI Core"),
    ]

    for uid, email, password, name, role, org in demo_accounts:
        existing = conn.execute("SELECT user_id FROM users WHERE email = ?;", (email,)).fetchone()
        if not existing:
            pass_hash = hash_password(password)
            now_str = datetime.utcnow().isoformat()
            conn.execute(
                """
                INSERT INTO users (user_id, email, password_hash, full_name, role, organization, created_at, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE');
                """,
                (uid, email, pass_hash, name, role, org, now_str),
            )

    # 2. Seed Additional Users to reach 28 Total Demo Users
    for i in range(1, 26):
        role = "RESEARCHER" if i <= 17 else "REVIEWER" if i <= 24 else "ADMIN"
        u_email = f"user_{i:02d}@prooftrail.demo"
        existing = conn.execute("SELECT user_id FROM users WHERE email = ?;", (u_email,)).fetchone()
        if not existing:
            pass_hash = hash_password("DemoUser@123")
            now_str = (datetime.utcnow() - timedelta(days=i)).isoformat()
            conn.execute(
                """
                INSERT INTO users (user_id, email, password_hash, full_name, role, organization, created_at, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE');
                """,
                (f"USR_SEED_{i:02d}", u_email, pass_hash, f"Demo User {i}", role, "Research Corp", now_str),
            )

    conn.commit()

    # 3. Primary Demo Project 1: India's EV Charging Market Outlook 2027
    ev_session_id = "SES_EV_2027"
    existing_ev = db.get_session(ev_session_id)
    if not existing_ev:
        plan_ev = ResearchPlan(
            session_id=ev_session_id,
            objective="Evaluate entry strategy into India's EV charging market for 2027",
            geography="India",
            time_period="2027",
            subject_scope="EV Charging Infrastructure & DISCOM Policy",
            subquestions=[
                "What is the projected size and growth rate of India's EV charging market by 2027?",
                "What government policies and FAME capital subsidies govern EV charging?",
                "Who are the leading competitive operators in India?",
                "What are the grid tariff bottlenecks and demand charge risks?"
            ],
            dimensions=[
                ResearchDimension(dimension_name="Market CAGR", description="Projections through 2030", target_queries=["India EV charging market size 2027"]),
                ResearchDimension(dimension_name="Policy Incentives", description="FAME & DISCOM guidelines", target_queries=["NITI Aayog EV charging guidelines"]),
            ],
            max_rounds=3,
            max_sources=20,
        )
        session_ev = ResearchSession(
            session_id=ev_session_id,
            question="Should a startup enter India's EV charging market in 2027?",
            created_at=datetime.utcnow().isoformat(),
            status=ResearchStatus.COMPLETED,
            plan=plan_ev,
            report_id="REP_EV_2027",
        )
        db.save_session(session_ev, user_id="USR_RESEARCHER_DEMO")

        # Seed Sources for EV Project
        sources_ev = [
            Source(
                source_id="SRC_001",
                session_id=ev_session_id,
                url="https://www.grandviewresearch.com/industry-analysis/india-ev-charging-infrastructure-market",
                canonical_url="https://www.grandviewresearch.com/industry-analysis/india-ev-charging-infrastructure-market",
                title="[DEMO SOURCE] India EV Charging Infrastructure Market Size Report 2024-2030",
                domain="grandviewresearch.com",
                snippet="The Indian electric vehicle charging infrastructure market size was valued at USD 1.2 Billion in 2024 and is projected to expand at a CAGR of 32.5% through 2030.",
                content="The Indian electric vehicle charging infrastructure market size is expected to grow from $1.2B in 2024 to $4.1B by 2030 at a CAGR of 32.5%. Rapid adoption of 2W and 4W EVs along major interstate corridors drives charging hub demand across Tier 1 and Tier 2 cities in India.",
                publication_date="2024-09-15",
                quality_assessment=SourceQuality.HIGH,
                quality_explanation="Reputable market research publisher.",
            ),
            Source(
                source_id="SRC_002",
                session_id=ev_session_id,
                url="https://niti.gov.in/reports/ev-charging-infrastructure-guidelines-2026",
                canonical_url="https://niti.gov.in/reports/ev-charging-infrastructure-guidelines-2026",
                title="[DEMO SOURCE] NITI Aayog National EV Charging Guidelines & Incentives",
                domain="niti.gov.in",
                snippet="Under the national scheme, state DISCOMs and public operators receive capital subsidies up to 70% for setting up DC fast chargers along highways.",
                content="Under the national scheme, state DISCOMs and public operators receive capital subsidies up to 70% for setting up DC fast chargers along highways. Delicensing charging infrastructure creation enables any individual or entity to set up stations without heavy utility licensing barriers.",
                publication_date="2025-01-10",
                quality_assessment=SourceQuality.HIGH,
                quality_explanation="Official Indian government policy portal.",
            ),
            Source(
                source_id="SRC_003",
                session_id=ev_session_id,
                url="https://www.tatapower.com/news/ev-charging-network-milestone-2026",
                canonical_url="https://www.tatapower.com/news/ev-charging-network-milestone-2026",
                title="[DEMO SOURCE] Tata Power EZ Charge Operational Network Expansion",
                domain="tatapower.com",
                snippet="Tata Power leads India's EV charging segment with over 5,000 public chargers and 100,000 home charging setups operational.",
                content="Tata Power EZ Charge has established over 5,000 public and semi-public charging points across 550+ cities in India. Commercial EV charging operators face high fixed demand charges per kVA from state electricity boards, stretching profitability payback to 4-5 years.",
                publication_date="2026-02-01",
                quality_assessment=SourceQuality.HIGH,
                quality_explanation="Corporate operational data.",
            ),
        ]
        db.save_sources(sources_ev)

        # Seed Claims for EV Project
        claims_ev = [
            Claim(
                claim_id="CLM_001",
                session_id=ev_session_id,
                claim_text="India's EV charging market is projected to reach $4.1 Billion by 2030 with a CAGR exceeding 32%.",
                claim_category=ClaimCategory.STATISTICAL,
                importance="HIGH",
                verification_status=VerificationStatus.SUPPORTED,
                explanation="Verified by GrandView Research market report dataset.",
            ),
            Claim(
                claim_id="CLM_002",
                session_id=ev_session_id,
                claim_text="National guidelines provide up to 70% capital subsidies for fast-charging station deployment along highways.",
                claim_category=ClaimCategory.POLICY,
                importance="HIGH",
                verification_status=VerificationStatus.SUPPORTED,
                explanation="Confirmed by official NITI Aayog policy gazette document.",
            ),
            Claim(
                claim_id="CLM_003",
                session_id=ev_session_id,
                claim_text="State electricity DISCOM fixed demand charges stretch payback periods to 4-5 years for public charger operators.",
                claim_category=ClaimCategory.MARKET_DATA,
                importance="MEDIUM",
                verification_status=VerificationStatus.PARTIALLY_SUPPORTED,
                explanation="Supported in commercial hub operator financial reports.",
            ),
        ]
        db.save_claims(claims_ev)

        # Seed Evidence Records for EV Project
        evidence_ev = [
            EvidenceRecord(
                evidence_id="EV_CLM_001_01",
                claim_id="CLM_001",
                source_id="SRC_001",
                session_id=ev_session_id,
                exact_passage="The Indian electric vehicle charging infrastructure market size is expected to grow from $1.2B in 2024 to $4.1B by 2030 at a CAGR of 32.5%.",
                relationship=EvidenceRelationship.SUPPORTS,
                relevance_explanation="Verbatim market sizing CAGR excerpt.",
            ),
            EvidenceRecord(
                evidence_id="EV_CLM_002_01",
                claim_id="CLM_002",
                source_id="SRC_002",
                session_id=ev_session_id,
                exact_passage="Under the national scheme, state DISCOMs and public operators receive capital subsidies up to 70% for setting up DC fast chargers along highways.",
                relationship=EvidenceRelationship.SUPPORTS,
                relevance_explanation="Direct government subsidy policy excerpt.",
            ),
            EvidenceRecord(
                evidence_id="EV_CLM_003_01",
                claim_id="CLM_003",
                source_id="SRC_003",
                session_id=ev_session_id,
                exact_passage="Commercial EV charging operators face high fixed demand charges per kVA from state electricity boards, stretching profitability payback to 4-5 years.",
                relationship=EvidenceRelationship.SUPPORTS,
                relevance_explanation="Operational payback friction excerpt.",
            ),
        ]
        db.save_evidence_records(evidence_ev)

        # Seed Conflicts for EV Project
        conflicts_ev = [
            ConflictRecord(
                conflict_id="CNF_001",
                session_id=ev_session_id,
                claim_id="CLM_001",
                source_a_id="SRC_001",
                source_b_id="SRC_003",
                passage_a="India requires at least 100,000 fast chargers by 2027 to prevent charger congestion.",
                passage_b="Accounting for 2W and 3W battery swapping, India needs 400,000 total charging points by 2027.",
                conflict_type="STATISTICAL_DISCREPANCY",
                explanation="Source A models public 4W fast chargers only, whereas Source B includes 2W/3W battery swapping hubs.",
                resolved=False,
            )
        ]
        db.save_conflicts(conflicts_ev)

        # Seed Report for EV Project
        report_ev = ResearchReport(
            report_id="REP_EV_2027",
            session_id=ev_session_id,
            question="Should a startup enter India's EV charging market in 2027?",
            executive_summary="Entering India's EV charging market in 2027 presents high strategic potential driven by a projected 32.5% market CAGR through 2030 [SRC_001]. FAME capital subsidies up to 70% lower initial hardware setup costs [SRC_002], but success requires navigating high DISCOM demand charges and grid connection delays [SRC_003].",
            research_scope="Evaluated Indian EV market dynamics, government policy incentives, charging hardware technology, and competitive positioning for 2027.",
            methodology="Conducted 3 rounds of targeted search across government policy releases, market research reports, and corporate filings.",
            key_findings=[
                "India's EV charging market is accelerating toward a $4.1B valuation by 2030 [SRC_001].",
                "National schemes provide up to 70% capital support for public fast charger deployment [SRC_002].",
                "Public-Private Partnerships (PPP) and fleet hub charging offer the highest early ROI [SRC_003]."
            ],
            claim_verifications=claims_ev,
            supporting_evidence=evidence_ev,
            conflicting_information=conflicts_ev,
            source_quality_assessment=[
                {"source_id": "SRC_001", "domain": "grandviewresearch.com", "quality": "HIGH", "explanation": "Reputable publisher"},
                {"source_id": "SRC_002", "domain": "niti.gov.in", "quality": "HIGH", "explanation": "Official policy portal"}
            ],
            research_gaps=["Local battery chemistry cost shifts for 2027 remain uncertain."],
            limitations=["Analysis relies on published 2024-2026 forward projections for 2027 state policies."],
            conclusion="Market entry in 2027 is strongly recommended for startups focusing on B2B fleet hub charging or software management platforms.",
            references=sources_ev,
            citation_validation=CitationValidationResult(is_valid=True, total_citations=3, valid_citations=3),
        )
        db.save_report(report_ev)

        # Seed Decision Brief for EV Project
        brief_ev = {
            "decision_question": "Should a startup enter India's EV charging market in 2027?",
            "decision_options": [
                {
                    "option_title": "Option 1: Full CAPEX Entry (Highway Fast-Charging Hubs)",
                    "description": "Acquire land, install 120kW DC fast chargers, and leverage 70% capital subsidies.",
                    "supporting_evidence_summary": "Backed by NITI Aayog 70% subsidy guidelines and 32.5% market CAGR.",
                    "risk_factors": ["High fixed kVA demand charges from state DISCOMs", "4-5 year payback stretch"]
                },
                {
                    "option_title": "Option 2: Asset-Light B2B Fleet Hub & Software Platform",
                    "description": "Partner with commercial delivery fleets (Amazon, Zomato) for dedicated hub charging and SaaS management.",
                    "supporting_evidence_summary": "Lowers initial capital risk while securing predictable utilization.",
                    "risk_factors": ["Fleet operator contract renegotiation risk"]
                }
            ],
            "opportunities": [
                "India EV charging infrastructure market expanding toward $4.1B by 2030.",
                "National delicensing allows flexible station creation without utility licensing barriers."
            ],
            "key_assumptions": [
                "FAME subsidy schemes remain funded through 2027.",
                "EV 2W and 4W adoption rates maintain 30%+ annual growth trajectory."
            ],
            "unknowns": [
                "State-by-state demand tariff restructuring for 2027."
            ],
            "recommendation": "Adopt Option 2 (B2B Fleet Hub & Software Platform) for initial 2027 entry to guarantee immediate charger utilization, scaling into Option 1 as grid tariffs normalize.",
            "confidence_rating": "HIGH",
            "conditions_to_change_recommendation": [
                "State DISCOMs eliminate fixed kVA demand charges for public EV stations."
            ]
        }
        db.save_decision_brief(ev_session_id, session_ev.question, brief_ev)

        # Seed Review Assignment & Decision for EV Project
        asn = db.create_review_assignment(
            session_id=ev_session_id,
            reviewer_id="USR_REVIEWER_DEMO",
            admin_id="USR_ADMIN_DEMO",
            deadline_days=7,
        )
        db.add_review_comment(asn["assignment_id"], "USR_REVIEWER_DEMO", "Verified source citations against NITI Aayog gazette. Evidence is robust.", claim_id="CLM_002")
        db.record_review_decision(asn["assignment_id"], "USR_REVIEWER_DEMO", "APPROVED", "Thorough evidence extraction and reliable citation validation.")

    # 4. Seed Additional 11 Sessions to reach 12 Total Projects
    additional_projects = [
        ("SES_CBAM_01", "What is the current impact of the EU Carbon Border Adjustment Mechanism (CBAM) on global steel exports?", ResearchStatus.COMPLETED),
        ("SES_SMR_02", "Evaluate the commercial viability of small modular nuclear reactors (SMRs) for datacenter power supply by 2030.", ResearchStatus.SEARCHING),
        ("SES_RENEW_03", "India's Renewable Energy Investment Opportunities 2026-2030", ResearchStatus.COMPLETED),
        ("SES_HEALTH_04", "AI Adoption in Healthcare: Clinical Outcomes & Regulatory Compliance", ResearchStatus.PENDING),
        ("SES_CYBER_05", "Cybersecurity Risks and Mitigation Strategies for Small Businesses", ResearchStatus.ANALYZING),
        ("SES_PROJ_06", "Commercial Real Estate Outlook post-Hybrid Work Adoption", ResearchStatus.COMPLETED),
        ("SES_PROJ_07", "Quantum Computing Applications in Financial Risk Modeling", ResearchStatus.COMPLETED),
        ("SES_PROJ_08", "Global Semiconductor Supply Chain Resilience Assessment", ResearchStatus.COMPLETED),
        ("SES_PROJ_09", "Desalination Technology Viability in Arid Agricultural Regions", ResearchStatus.FAILED),
        ("SES_PROJ_10", "Autonomous Fleet Delivery Logistics for Urban Logistics", ResearchStatus.COMPLETED),
        ("SES_PROJ_11", "Battery Energy Storage Systems (BESS) Grid Integration Economics", ResearchStatus.SEARCHING),
    ]

    for sid, q, st in additional_projects:
        if not db.get_session(sid):
            sess = ResearchSession(
                session_id=sid,
                question=q,
                created_at=(datetime.utcnow() - timedelta(days=len(sid))).isoformat(),
                status=st,
                plan=ResearchPlan(session_id=sid, objective=q, subject_scope=q, subquestions=[q]),
                report_id=f"REP_{sid}" if st == ResearchStatus.COMPLETED else None,
            )
            db.save_session(sess, user_id="USR_RESEARCHER_DEMO")

    # 5. Seed Audit Logs
    db.log_audit("USR_ADMIN_DEMO", "SYSTEM_BOOTSTRAP_SEEDED", "data/prooftrail.db", {"user_count": 28, "sessions_count": 12})
    db.log_audit("USR_REVIEWER_DEMO", "REVIEW_COMPLETED", "session:SES_EV_2027", {"decision": "APPROVED"})

    print("✅ ProofTrail AI Demo Data Seeding Completed Successfully!")


if __name__ == "__main__":
    seed_demo_data()
