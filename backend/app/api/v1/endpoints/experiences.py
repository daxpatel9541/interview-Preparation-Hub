from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from app.core.database import get_db
from app.models.models import InterviewExperience, Company
from app.schemas.schemas import ExperienceResponse, ExperienceListResponse

router = APIRouter(prefix="/experiences", tags=["Interview Experiences"])


@router.get("/", response_model=ExperienceListResponse)
async def list_experiences(
    company: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
):
    query = select(InterviewExperience)
    count_query = select(func.count(InterviewExperience.id))

    if company:
        query = query.where(InterviewExperience.company == company)
        count_query = count_query.where(InterviewExperience.company == company)
    if year:
        query = query.where(InterviewExperience.year == year)
        count_query = count_query.where(InterviewExperience.year == year)

    query = query.order_by(InterviewExperience.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    experiences = result.scalars().all()

    total_result = await db.execute(count_query)
    total = total_result.scalar()

    return ExperienceListResponse(
        experiences=[ExperienceResponse.model_validate(e) for e in experiences],
        total=total,
    )


@router.get("/{experience_id}", response_model=ExperienceResponse)
async def get_experience(experience_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(InterviewExperience).where(InterviewExperience.id == experience_id)
    )
    experience = result.scalar_one_or_none()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    return ExperienceResponse.model_validate(experience)


@router.get("/companies/stats")
async def company_stats(db: AsyncSession = Depends(get_db)):
    """Get count of experiences per company."""
    result = await db.execute(
        select(InterviewExperience.company, func.count(InterviewExperience.id))
        .group_by(InterviewExperience.company)
    )
    stats = {row[0]: row[1] for row in result.all()}
    return stats
