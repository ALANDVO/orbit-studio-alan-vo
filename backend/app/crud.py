from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models import Issue, IssuePhase
from app.schemas import IssueCreate, IssueUpdate
from typing import Optional, List, Tuple

async def create_issue(session: AsyncSession, issue: IssueCreate) -> Issue:
    db_issue = Issue(
        title=issue.title,
        description=issue.description,
        phase=issue.phase
    )
    session.add(db_issue)
    await session.commit()
    await session.refresh(db_issue)
    return db_issue

async def get_issue(session: AsyncSession, issue_id: int) -> Optional[Issue]:
    result = await session.execute(select(Issue).where(Issue.id == issue_id))
    return result.scalar_one_or_none()

async def get_issues(
    session: AsyncSession,
    page: int = 1,
    page_size: int = 20,
    phase: Optional[IssuePhase] = None,
    search: Optional[str] = None
) -> Tuple[List[Issue], int]:
    query = select(Issue)
    
    if phase:
        query = query.where(Issue.phase == phase)
    if search:
        query = query.where(Issue.title.ilike(f"%{search}%"))
    
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await session.execute(count_query)
    total = total_result.scalar()
    
    query = query.order_by(Issue.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)
    
    result = await session.execute(query)
    items = result.scalars().all()
    
    return items, total

async def update_issue(session: AsyncSession, issue_id: int, issue_update: IssueUpdate) -> Optional[Issue]:
    db_issue = await get_issue(session, issue_id)
    if not db_issue:
        return None
    
    update_data = issue_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_issue, field, value)
    
    await session.commit()
    await session.refresh(db_issue)
    return db_issue

async def delete_issue(session: AsyncSession, issue_id: int) -> bool:
    db_issue = await get_issue(session, issue_id)
    if not db_issue:
        return False
    
    await session.delete(db_issue)
    await session.commit()
    return True
</arg_key>
<arg_key=i>
Creating CRUD operations for issues
