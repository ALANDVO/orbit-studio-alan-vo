from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class IssuePhase(str, Enum):
    BACKLOG = "backlog"
    TRIAGE = "triage"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"

class IssueBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    phase: IssuePhase = IssuePhase.BACKLOG

class IssueCreate(IssueBase):
    pass

class IssueUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    phase: Optional[IssuePhase] = None

class IssueResponse(IssueBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class IssueListResponse(BaseModel):
    items: list[IssueResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
