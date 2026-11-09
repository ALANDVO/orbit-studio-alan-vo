from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from contextlib import asynccontextmanager

from app.database import init_db, get_session
from app.models import IssuePhase
from app.schemas import IssueCreate, IssueUpdate, IssueResponse, IssueListResponse
from app.crud import create_issue, get_issue, get_issues, update_issue, delete_issue

class Settings(BaseModel):
    app_name: str = "orbit-studio"
    environment: str = "development"
    demo_mode: bool = False

settings = Settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Orbit Studio - AI Engineering Issue Tracker",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    demo_mode: bool

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        version="1.0.0",
        environment=settings.environment,
        demo_mode=settings.demo_mode
    )

@app.get("/")
async def root():
    return {"message": "Orbit Studio API", "version": "1.0.0", "docs": "/docs"}

@app.post("/api/issues", response_model=IssueResponse, status_code=201)
async def create_issue_endpoint(issue: IssueCreate, session: AsyncSession = Depends(get_session)):
    db_issue = await create_issue(session, issue)
    return db_issue

@app.get("/api/issues", response_model=IssueListResponse)
async def list_issues(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    phase: Optional[IssuePhase] = None,
    search: Optional[str] = None,
    session: AsyncSession = Depends(get_session)
):
    items, total = await get_issues(session, page, page_size, phase, search)
    total_pages = (total + page_size - 1) // page_size
    return IssueListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@app.get("/api/issues/{issue_id}", response_model=IssueResponse)
async def get_issue_endpoint(issue_id: int, session: AsyncSession = Depends(get_session)):
    db_issue = await get_issue(session, issue_id)
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return db_issue

@app.put("/api/issues/{issue_id}", response_model=IssueResponse)
async def update_issue_endpoint(issue_id: int, issue_update: IssueUpdate, session: AsyncSession = Depends(get_session)):
    db_issue = await update_issue(session, issue_id, issue_update)
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return db_issue

@app.delete("/api/issues/{issue_id}", status_code=204)
async def delete_issue_endpoint(issue_id: int, session: AsyncSession = Depends(get_session)):
    success = await delete_issue(session, issue_id)
    if not success:
        raise HTTPException(status_code=404, detail="Issue not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
