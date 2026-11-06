from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum
from sqlalchemy.orm import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class IssuePhase(str, enum.Enum):
    BACKLOG = "backlog"
    TRIAGE = "triage"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"

class Issue(Base):
    __tablename__ = "issues"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(String, nullable=True)
    phase = Column(SQLEnum(IssuePhase), default=IssuePhase.BACKLOG, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
