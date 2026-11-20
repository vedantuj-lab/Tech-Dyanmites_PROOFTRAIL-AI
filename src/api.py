"""FastAPI REST API Server for ProofTrail AI."""
import os
import uuid
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from src.agent_core.orchestrator import ResearchOrchestrator
from src.database.db import get_db
from src.services.nebius import NebiusService
from src.services.tavily import TavilyService
from src.utils.settings import settings
from src.utils.pdf_export import generate_pdf_report

app = FastAPI(
    title="ProofTrail AI API",
    description="The Evidence Intelligence Engine REST API",
    version="1.0.0",
)

# CORS configuration for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchRequest(BaseModel):
    question: str = Field(..., description="Research question to investigate")
    session_id: Optional[str] = None


class FollowupRequest(BaseModel):
    followup_question: str = Field(..., description="Follow-up question")


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


def execute_pipeline_task(session_id: str, question: str):
    orchestrator = ResearchOrchestrator()
    orchestrator.run_research_pipeline(question=question, session_id=session_id)


@app.post("/api/research")
def start_research(req: ResearchRequest, background_tasks: BackgroundTasks):
    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Research question cannot be empty.")

    session_id = req.session_id or f"SES_{uuid.uuid4().hex[:8]}"

    # Execute pipeline in background or synchronously if requested
    orchestrator = ResearchOrchestrator()
    # Run synchronously for fast REST completion or mock mode
    report = orchestrator.run_research_pipeline(question=question, session_id=session_id)

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


@app.post("/api/research/{session_id}/follow-up")
def follow_up_research(session_id: str, req: FollowupRequest):
    orchestrator = ResearchOrchestrator()
    try:
        report = orchestrator.continue_research(
            session_id=session_id, followup_question=req.followup_question
        )
        return report.model_dump()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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
def get_history():
    db = get_db()
    sessions = db.list_sessions()
    return [s.model_dump() for s in sessions]


@app.delete("/api/history/{session_id}")
def delete_history_session(session_id: str):
    db = get_db()
    db.delete_session(session_id)
    return {"status": "DELETED", "session_id": session_id}


# Mount Vite static build if available
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
