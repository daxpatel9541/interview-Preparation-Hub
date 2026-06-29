import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, Enum, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class QuestionCategory(str, enum.Enum):
    QUANTITATIVE = "QUANTITATIVE"
    LOGICAL = "LOGICAL"
    VERBAL = "VERBAL"


class Difficulty(str, enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class Company(str, enum.Enum):
    TCS = "TCS"
    INFOSYS = "INFOSYS"
    WIPRO = "WIPRO"
    ACCENTURE = "ACCENTURE"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=True)
    coins = Column(Integer, default=0)
    total_score = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    quiz_attempts = relationship("QuizAttempt", back_populates="user")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(Enum(QuestionCategory), nullable=False, index=True)
    difficulty = Column(Enum(Difficulty), nullable=False, index=True)
    text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # List of option strings
    correct_answer = Column(Integer, nullable=False)  # Index of correct option
    explanation = Column(Text, nullable=True)
    time_limit_seconds = Column(Integer, default=60)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    selected_answer = Column(Integer, nullable=True)
    is_correct = Column(Boolean, nullable=False)
    time_taken_seconds = Column(Float, nullable=True)
    coins_earned = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="quiz_attempts")
    question = relationship("Question")


class InterviewExperience(Base):
    __tablename__ = "interview_experiences"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(Enum(Company), nullable=False, index=True)
    role = Column(String(200), nullable=False)
    year = Column(Integer, nullable=False)
    round_type = Column(String(100), nullable=False)  # e.g., "Technical Round 1", "HR Round"
    content = Column(Text, nullable=False)
    difficulty_rating = Column(Integer, nullable=False)  # 1-5
    result = Column(String(50), nullable=True)  # "Selected", "Rejected", "Pending"
    tags = Column(JSON, nullable=True)  # List of relevant tags
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
