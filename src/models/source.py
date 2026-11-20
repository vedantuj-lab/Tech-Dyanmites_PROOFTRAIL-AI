"""Source management and passage models."""
from enum import Enum
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class SourceQuality(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    NOT_ASSESSED = "NOT_ASSESSED"


class Source(BaseModel):
    source_id: str
    session_id: str
    url: str
    canonical_url: str
    title: str
    domain: str
    snippet: str
    content: str
    publication_date: Optional[str] = None
    retrieved_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    search_round: int = 1
    search_query: str = ""
    quality_assessment: SourceQuality = SourceQuality.NOT_ASSESSED
    quality_explanation: Optional[str] = None


class SourcePassage(BaseModel):
    passage_id: str
    source_id: str
    session_id: str
    exact_passage: str
    location_context: Optional[str] = None
