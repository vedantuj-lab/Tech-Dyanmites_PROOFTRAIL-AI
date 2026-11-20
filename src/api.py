"""FastAPI REST API Server with Multi-Role RBAC, Website/Document Import, & Decision Intelligence."""
import os
import uuid
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Header, Depends, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from src.agent_core.orchestrator import ResearchOrchestrator
from src.database.db import get_db, Database
from src.services.nebius import NebiusService
from src.services.tavily import TavilyService
from src.services.website_importer import WebsiteImporter
from src.services.document_parser import DocumentParser
from src.services.decision_intelligence import DecisionIntelligenceEngine
from src.utils.settings import settings
from src.utils.security import (
    hash_password,
    verify_password,
    generate_token,
    create_auth_token,
    decode_auth_token,
)
from src.utils.pdf_export import generate_pdf_report

app = FastAPI(
    title="ProofTrail AI API",
    description="Multi-Role Evidence & Decision Intelligence Engine REST API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- REQUEST & RESPONSE SCHEMAS ---
class RegisterRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="Password")
    full_name: str = Field(..., description="Full name")
    organization: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class ResearchRequest(BaseModel):
    question: str = Field(..., description="Research question to investigate")
    session_id: Optional[str] = None


class WebsiteImportRequest(BaseModel):
    session_id: str
    url: str


class AssignReviewerRequest(BaseModel):
    session_id: str
    reviewer_id: str
    deadline_days: int = 7


class ReviewDecisionRequest(BaseModel):
    decision: str
    decision_note: str


class ReviewCommentRequest(BaseModel):
    comment_text: str
    claim_id: Optional[str] = None
    source_id: Optional[str] = None


class UserUpdateStatusRequest(BaseModel):
    status: str
    role: Optional[str] = None


# --- DEPENDENCIES ---
def get_current_user(authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    if not authorization:
        return None
    token = authorization.replace("Bearer ", "").strip()
    db = get_db()
    user = db.get_user_by_session_token(token)
    if user:
        return user
    payload = decode_auth_token(token)
    if payload and "user_id" in payload:
        return db.get_user_by_id(payload["user_id"])
    return None


def require_auth(user: Optional[Dict[str, Any]] = Depends(get_current_user)) -> Dict[str, Any]:
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required. Please sign in.")
    if user.get("status") != "ACTIVE":
        raise HTTPException(status_code=403, detail="Account is deactivated or suspended.")
    return user


def require_role(permitted_roles: List[str]):
    def role_checker(user: Dict[str, Any] = Depends(require_auth)) -> Dict[str, Any]:
        if user["role"] not in permitted_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required role: {', '.join(permitted_roles)}.",
            )
        return user
    return role_checker


# --- PUBLIC & HEALTH ENDPOINTS ---
@app.get("/api/health")
def get_health_status():
    n_service = NebiusService()
    t_service = TavilyService()
    n_health = n_service.check_health()
    t_health = t_service.check_health()

    return {
        "status": "ONLINE",
        "app_env": settings.app_env,
        "mock_mode": settings.is_mock_mode(),
        "version": "1.0.0",
        "nebius": n_health,
        "tavily": t_health,
        "database": {"status": "READY", "path": settings.database_path},
    }


# --- AUTHENTICATION ENDPOINTS ---
@app.post("/api/auth/register")
def register_user(req: RegisterRequest):
    db = get_db()
    existing = db.get_user_by_email(req.email)
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    pass_hash = hash_password(req.password)
    user = db.create_user(
        email=req.email,
        password_hash=pass_hash,
        full_name=req.full_name,
        role="RESEARCHER",
        organization=req.organization,
    )

    db.log_audit(user["user_id"], "USER_REGISTERED", f"user:{user['user_id']}", {"email": req.email})
    token = db.create_session_token(user["user_id"])
    return {"token": token, "user": user}


@app.post("/api/auth/login")
def login_user(req: LoginRequest):
    db = get_db()
    user = db.get_user_by_email(req.email)
    if not user or not verify_password(req.password, user["password_hash"]):
        db.log_audit(None, "LOGIN_FAILED", f"email:{req.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if user.get("status") != "ACTIVE":
        raise HTTPException(status_code=403, detail="Account is suspended or inactive.")

    token = db.create_session_token(user["user_id"])
    db.log_audit(user["user_id"], "USER_LOGGED_IN", f"user:{user['user_id']}")
    return {
        "token": token,
        "user": {
            "user_id": user["user_id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "organization": user.get("organization"),
        },
    }


@app.get("/api/auth/me")
def get_current_user_profile(user: Dict[str, Any] = Depends(require_auth)):
    return user


@app.post("/api/auth/logout")
def logout_user(authorization: Optional[str] = Header(None)):
    if authorization:
        token = authorization.replace("Bearer ", "").strip()
        db = get_db()
        db.delete_session_token(token)
    return {"status": "LOGGED_OUT"}


# --- WEBSITE IMPORTER & DOCUMENT INTELLIGENCE ---
@app.post("/api/import/website")
def import_website(req: WebsiteImportRequest, user: Optional[Dict[str, Any]] = Depends(get_current_user)):
    db = get_db()
    importer = WebsiteImporter()
    user_id = user["user_id"] if user else None

    try:
        result = importer.import_single_page(req.session_id, req.url)
        source = result["source"]
        db.save_sources([source])
        db.save_imported_website(
            session_id=req.session_id,
            user_id=user_id,
            url=source.url,
            canonical_url=source.canonical_url,
            title=source.title,
            domain=source.domain,
            content=source.content,
        )
        if user_id:
            db.log_audit(user_id, "WEBSITE_IMPORTED", f"url:{req.url}", {"session_id": req.session_id})
        return {"status": "SUCCESS", "source": source.model_dump()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/documents")
async def upload_document(
    session_id: str = Form(...),
    file: UploadFile = File(...),
    user: Optional[Dict[str, Any]] = Depends(get_current_user),
):
    db = get_db()
    parser = DocumentParser()
    user_id = user["user_id"] if user else None

    file_bytes = await file.read()
    result = parser.parse_document(session_id, file.filename, file_bytes, file.content_type or "")
    source = result["source"]

    db.save_sources([source])
    db.save_uploaded_document(
        session_id=session_id,
        user_id=user_id,
        filename=file.filename,
        file_type=file.content_type or "unknown",
        file_size=len(file_bytes),
        extracted_text=result["extracted_text"],
    )

    if user_id:
        db.log_audit(user_id, "DOCUMENT_UPLOADED", f"file:{file.filename}", {"session_id": session_id})

    return {"status": "SUCCESS", "source": source.model_dump()}


# --- DECISION INTELLIGENCE & EVIDENCE MAP ---
@app.post("/api/decision-briefs/{session_id}")
def generate_decision_brief(session_id: str):
    db = get_db()
    report = db.get_report_by_session(session_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found for session.")

    nebius = NebiusService()
    engine = DecisionIntelligenceEngine(nebius)
    brief_dict = engine.generate_decision_brief(report)
    saved = db.save_decision_brief(session_id, report.question, brief_dict)
    return saved


@app.get("/api/decision-briefs/{session_id}")
def get_decision_brief(session_id: str):
    db = get_db()
    brief = db.get_decision_brief(session_id)
    if not brief:
        # Generate on the fly if report exists
        report = db.get_report_by_session(session_id)
        if not report:
            raise HTTPException(status_code=404, detail="Decision brief or report not found.")
        nebius = NebiusService()
        engine = DecisionIntelligenceEngine(nebius)
        brief_dict = engine.generate_decision_brief(report)
        return db.save_decision_brief(session_id, report.question, brief_dict)
    return brief


@app.get("/api/evidence-map/{session_id}")
def get_evidence_map(session_id: str):
    db = get_db()
    session = db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    claims = db.get_claims(session_id)
    evidence = db.get_evidence_records(session_id)
    sources = db.get_sources(session_id)

    tree = {
        "question": session.question,
        "subquestions": session.plan.subquestions if session.plan else [],
        "claims": [
            {
                "claim_id": c.claim_id,
                "claim_text": c.claim_text,
                "verification_status": c.verification_status.value,
                "evidence_passages": [
                    {
                        "source_id": ev.source_id,
                        "passage": ev.exact_passage,
                        "relationship": ev.relationship.value,
                    }
                    for ev in evidence
                    if ev.claim_id == c.claim_id
                ],
            }
            for c in claims
        ],
        "sources": [
            {
                "source_id": s.source_id,
                "title": s.title,
                "domain": s.domain,
                "quality": s.quality_assessment.value,
            }
            for s in sources
        ],
    }
    return tree


# --- RESEARCHER ENDPOINTS ---
@app.get("/api/researcher/dashboard")
def get_researcher_dashboard(user: Dict[str, Any] = Depends(require_role(["RESEARCHER", "ADMIN"]))):
    db = get_db()
    sessions = db.list_sessions(user_id=user["user_id"])
    total_sources = 0
    total_claims = 0
    for s in sessions:
        total_sources += len(db.get_sources(s.session_id))
        total_claims += len(db.get_claims(s.session_id))

    return {
        "user": user,
        "metrics": {
            "total_investigations": len(sessions),
            "completed_investigations": len([s for s in sessions if s.status.value == "COMPLETED"]),
            "total_sources_collected": total_sources,
            "claims_verified": total_claims,
        },
        "recent_sessions": [s.model_dump() for s in sessions[:5]],
    }


@app.post("/api/research")
def start_research(req: ResearchRequest, user: Optional[Dict[str, Any]] = Depends(get_current_user)):
    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Research question cannot be empty.")

    session_id = req.session_id or f"SES_{uuid.uuid4().hex[:8]}"
    user_id = user["user_id"] if user else None

    orchestrator = ResearchOrchestrator()
    report = orchestrator.run_research_pipeline(question=question, session_id=session_id)
    if user_id:
        orchestrator.db.save_session(orchestrator.db.get_session(session_id), user_id=user_id)

    return {
        "session_id": session_id,
        "status": "COMPLETED",
        "report_id": report.report_id,
    }


@app.get("/api/research/{session_id}")
def get_research_session(session_id: str):
    db = get_db()
    session = db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return session.model_dump()


@app.get("/api/research/{session_id}/events")
def get_research_events(session_id: str):
    db = get_db()
    events = db.get_events(session_id)
    return [e.model_dump() for e in events]


@app.get("/api/research/{session_id}/sources")
def get_research_sources(session_id: str):
    db = get_db()
    sources = db.get_sources(session_id)
    return [s.model_dump() for s in sources]


@app.get("/api/research/{session_id}/claims")
def get_research_claims(session_id: str):
    db = get_db()
    claims = db.get_claims(session_id)
    evidence = db.get_evidence_records(session_id)
    conflicts = db.get_conflicts(session_id)
    return {
        "claims": [c.model_dump() for c in claims],
        "evidence_records": [e.model_dump() for e in evidence],
        "conflicts": [cnf.model_dump() for cnf in conflicts],
    }


@app.get("/api/research/{session_id}/report")
def get_research_report(session_id: str):
    db = get_db()
    report = db.get_report_by_session(session_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not generated for this session.")
    return report.model_dump()


@app.get("/api/research/{session_id}/export/pdf")
def export_pdf(session_id: str):
    db = get_db()
    report = db.get_report_by_session(session_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    pdf_path = generate_pdf_report(report)
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=500, detail="Failed to generate PDF file.")

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=os.path.basename(pdf_path),
    )


@app.get("/api/history")
def get_history(user: Optional[Dict[str, Any]] = Depends(get_current_user)):
    db = get_db()
    user_id = user["user_id"] if user else None
    sessions = db.list_sessions(user_id=user_id)
    return [s.model_dump() for s in sessions]


@app.delete("/api/history/{session_id}")
def delete_history_session(session_id: str):
    db = get_db()
    db.delete_session(session_id)
    return {"status": "DELETED", "session_id": session_id}


# --- REVIEWER ENDPOINTS ---
@app.get("/api/reviewer/dashboard")
def get_reviewer_dashboard(user: Dict[str, Any] = Depends(require_role(["REVIEWER", "ADMIN"]))):
    db = get_db()
    assignments = db.list_reviewer_assignments(user["user_id"])
    return {
        "user": user,
        "metrics": {
            "assigned_reviews": len(assignments),
            "pending_reviews": len([a for a in assignments if a["status"] == "PENDING"]),
            "completed_reviews": len([a for a in assignments if a["status"] == "COMPLETED"]),
        },
        "assignments": assignments,
    }


@app.get("/api/reviewer/assignments")
def get_reviewer_assignments(user: Dict[str, Any] = Depends(require_role(["REVIEWER", "ADMIN"]))):
    db = get_db()
    return db.list_reviewer_assignments(user["user_id"])


@app.get("/api/reviewer/assignments/{assignment_id}")
def get_assignment_detail(assignment_id: str, user: Dict[str, Any] = Depends(require_role(["REVIEWER", "ADMIN"]))):
    db = get_db()
    assignment = db.get_review_assignment(assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found.")

    session = db.get_session(assignment["session_id"])
    claims = db.get_claims(assignment["session_id"])
    sources = db.get_sources(assignment["session_id"])
    report = db.get_report_by_session(assignment["session_id"])
    comments = db.get_assignment_comments(assignment_id)
    decisions = db.get_assignment_decisions(assignment_id)

    return {
        "assignment": assignment,
        "session": session.model_dump() if session else None,
        "report": report.model_dump() if report else None,
        "claims": [c.model_dump() for c in claims],
        "sources": [s.model_dump() for s in sources],
        "comments": comments,
        "decisions": decisions,
    }


@app.post("/api/reviewer/assignments/{assignment_id}/comments")
def add_reviewer_comment(
    assignment_id: str, req: ReviewCommentRequest, user: Dict[str, Any] = Depends(require_role(["REVIEWER", "ADMIN"]))
):
    db = get_db()
    db.add_review_comment(
        assignment_id=assignment_id,
        reviewer_id=user["user_id"],
        comment_text=req.comment_text,
        claim_id=req.claim_id,
        source_id=req.source_id,
    )
    return {"status": "COMMENT_ADDED"}


@app.post("/api/reviewer/assignments/{assignment_id}/decision")
def submit_reviewer_decision(
    assignment_id: str, req: ReviewDecisionRequest, user: Dict[str, Any] = Depends(require_role(["REVIEWER", "ADMIN"]))
):
    db = get_db()
    db.record_review_decision(
        assignment_id=assignment_id,
        reviewer_id=user["user_id"],
        decision=req.decision,
        decision_note=req.decision_note,
    )
    db.log_audit(user["user_id"], "REVIEW_DECISION_RECORDED", f"assignment:{assignment_id}", {"decision": req.decision})
    return {"status": "DECISION_SAVED", "decision": req.decision}


# --- ADMIN ENDPOINTS ---
@app.get("/api/admin/dashboard")
def get_admin_dashboard(user: Dict[str, Any] = Depends(require_role(["ADMIN"]))):
    db = get_db()
    users = db.list_users()
    sessions = db.list_sessions()
    assignments = db.list_all_assignments()

    return {
        "user": user,
        "metrics": {
            "total_users": len(users),
            "researchers": len([u for u in users if u["role"] == "RESEARCHER"]),
            "reviewers": len([u for u in users if u["role"] == "REVIEWER"]),
            "admins": len([u for u in users if u["role"] == "ADMIN"]),
            "total_investigations": len(sessions),
            "total_review_assignments": len(assignments),
        },
        "recent_users": users[:5],
        "recent_audit_logs": db.get_audit_logs(limit=10),
    }


@app.get("/api/admin/users")
def get_admin_users(role_filter: Optional[str] = None, user: Dict[str, Any] = Depends(require_role(["ADMIN"]))):
    db = get_db()
    return db.list_users(role_filter=role_filter)


@app.patch("/api/admin/users/{user_id}")
def update_user_status(user_id: str, req: UserUpdateStatusRequest, user: Dict[str, Any] = Depends(require_role(["ADMIN"]))):
    db = get_db()
    updated = db.update_user_status(user_id=user_id, new_status=req.status, new_role=req.role)
    db.log_audit(user["user_id"], "USER_STATUS_UPDATED", f"user:{user_id}", {"status": req.status, "role": req.role})
    return updated


@app.get("/api/admin/assignments")
def get_admin_assignments(user: Dict[str, Any] = Depends(require_role(["ADMIN"]))):
    db = get_db()
    return db.list_all_assignments()


@app.post("/api/admin/assignments")
def create_review_assignment(req: AssignReviewerRequest, user: Dict[str, Any] = Depends(require_role(["ADMIN"]))):
    db = get_db()
    assignment = db.create_review_assignment(
        session_id=req.session_id,
        reviewer_id=req.reviewer_id,
        admin_id=user["user_id"],
        deadline_days=req.deadline_days,
    )
    db.log_audit(user["user_id"], "REVIEW_ASSIGNMENT_CREATED", f"session:{req.session_id}", {"reviewer_id": req.reviewer_id})
    return assignment


@app.get("/api/admin/audit-logs")
def get_admin_audit_logs(user: Dict[str, Any] = Depends(require_role(["ADMIN"]))):
    db = get_db()
    return db.get_audit_logs(limit=50)


# Serve Vite Static Build if present
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
