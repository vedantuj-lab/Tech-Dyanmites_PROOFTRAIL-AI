"""Research state and planning models."""
from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ResearchStatus(str, Enum):
    PENDING = "PENDING"
    PLANNING = "PLANNING"
    SEARCHING = "SEARCHING"
    ANALYZING = "ANALYZING"
    VERIFYING = "VERIFYING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"


class ResearchDimension(BaseModel):
    dimension_name: str
    description: str
    target_queries: List[str] = Field(default_factory=list)


class ResearchPlan(BaseModel):
    session_id: str
    objective: str
    geography: Optional[str] = "Global / Unspecified"
    time_period: Optional[str] = "Current / Unspecified"
    subject_scope: str
    subquestions: List[str] = Field(default_factory=list)
    dimensions: List[ResearchDimension] = Field(default_factory=list)
    max_rounds: int = 3
    max_sources: int = 20


class ResearchEvent(BaseModel):
    event_id: str
    session_id: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    event_type: str
    description: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ResearchSession(BaseModel):
    session_id: str
    question: str
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    status: ResearchStatus = ResearchStatus.PENDING
    plan: Optional[ResearchPlan] = None
    report_id: Optional[str] = None
