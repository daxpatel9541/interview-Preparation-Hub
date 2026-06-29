from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ── Auth Schemas ──
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    display_name: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    display_name: Optional[str]
    coins: int
    total_score: int
    streak_days: int
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ── Question Schemas ──
class QuestionResponse(BaseModel):
    id: int
    category: str
    difficulty: str
    text: str
    options: List[str]
    time_limit_seconds: int

    class Config:
        from_attributes = True


class QuestionWithAnswer(QuestionResponse):
    correct_answer: int
    explanation: Optional[str]


class AnswerSubmit(BaseModel):
    selected_answer: int
    time_taken_seconds: float


class AnswerResult(BaseModel):
    is_correct: bool
    correct_answer: int
    explanation: Optional[str]
    coins_earned: int


# ── Interview Experience Schemas ──
class ExperienceResponse(BaseModel):
    id: int
    company: str
    role: str
    year: int
    round_type: str
    content: str
    difficulty_rating: int
    result: Optional[str]
    tags: Optional[List[str]]
    created_at: datetime

    class Config:
        from_attributes = True


class ExperienceListResponse(BaseModel):
    experiences: List[ExperienceResponse]
    total: int
