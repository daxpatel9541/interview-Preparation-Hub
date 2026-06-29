from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from app.core.database import get_db
from app.models.models import Question, QuizAttempt, QuestionCategory, Difficulty
from app.schemas.schemas import QuestionResponse, QuestionWithAnswer, AnswerSubmit, AnswerResult

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.get("/", response_model=list[QuestionResponse])
async def list_questions(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
):
    query = select(Question)
    if category:
        query = query.where(Question.category == category)
    if difficulty:
        query = query.where(Question.difficulty == difficulty)
    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    questions = result.scalars().all()
    return [QuestionResponse.model_validate(q) for q in questions]


@router.get("/count")
async def count_questions(
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(func.count(Question.id))
    if category:
        query = query.where(Question.category == category)
    result = await db.execute(query)
    return {"count": result.scalar()}


@router.get("/{question_id}", response_model=QuestionResponse)
async def get_question(question_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Question).where(Question.id == question_id))
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return QuestionResponse.model_validate(question)


@router.post("/{question_id}/submit", response_model=AnswerResult)
async def submit_answer(
    question_id: int,
    answer: AnswerSubmit,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Question).where(Question.id == question_id))
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = answer.selected_answer == question.correct_answer

    # Coin reward: base 10 for correct, bonus for speed
    coins_earned = 0
    if is_correct:
        coins_earned = 10
        if answer.time_taken_seconds < question.time_limit_seconds * 0.5:
            coins_earned += 5  # Speed bonus

    return AnswerResult(
        is_correct=is_correct,
        correct_answer=question.correct_answer,
        explanation=question.explanation,
        coins_earned=coins_earned,
    )
