'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { questionsAPI } from '@/lib/api';

interface Question {
  id: number;
  category: string;
  difficulty: string;
  text: string;
  options: string[];
  time_limit_seconds: number;
}

interface AnswerResult {
  is_correct: boolean;
  correct_answer: number;
  explanation: string | null;
  coins_earned: number;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: '#39FF14',
  MEDIUM: '#FFD700',
  HARD: '#FF1493',
};

const CATEGORY_COLORS: Record<string, string> = {
  QUANTITATIVE: '#00E5FF',
  LOGICAL: '#BC13FE',
  VERBAL: '#39FF14',
};

export default function QuizModal() {
  const { activeModal, setActiveModal, addCoins, addScore } = useAppStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0, coinsEarned: 0 });
  const [showSummary, setShowSummary] = useState(false);

  const isOpen = activeModal?.startsWith('quiz-') || false;
  const category = activeModal?.replace('quiz-', '').toUpperCase();

  // Fetch questions when modal opens
  useEffect(() => {
    if (!isOpen || !category) return;

    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await questionsAPI.list({ category, limit: 10 });
        setQuestions(res.data);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setResult(null);
        setStats({ correct: 0, total: 0, coinsEarned: 0 });
        setShowSummary(false);
        if (res.data.length > 0) {
          setTimeLeft(res.data[0].time_limit_seconds);
          setStartTime(Date.now());
        }
      } catch {
        setError('Failed to load questions. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [isOpen, category]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || result || timeLeft <= 0 || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(-1); // Time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, result, timeLeft, loading, currentIndex]);

  const handleSubmit = useCallback(
    async (answer: number) => {
      if (result || questions.length === 0) return;

      const question = questions[currentIndex];
      const timeTaken = (Date.now() - startTime) / 1000;

      try {
        const res = await questionsAPI.submit(question.id, {
          selected_answer: answer,
          time_taken_seconds: timeTaken,
        });
        setResult(res.data);

        if (res.data.is_correct) {
          addCoins(res.data.coins_earned);
          addScore(10);
        }

        setStats((prev) => ({
          correct: prev.correct + (res.data.is_correct ? 1 : 0),
          total: prev.total + 1,
          coinsEarned: prev.coinsEarned + res.data.coins_earned,
        }));
      } catch {
        // Fallback: local check
        const isCorrect = answer === question.id; // Can't determine without backend
        setResult({
          is_correct: false,
          correct_answer: 0,
          explanation: 'Could not connect to server.',
          coins_earned: 0,
        });
      }
    },
    [result, questions, currentIndex, startTime, addCoins, addScore]
  );

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setResult(null);
      setTimeLeft(questions[currentIndex + 1].time_limit_seconds);
      setStartTime(Date.now());
    } else {
      setShowSummary(true);
    }
  };

  const handleClose = () => {
    setActiveModal(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setResult(null);
    setShowSummary(false);
  };

  if (!isOpen) return null;

  const question = questions[currentIndex];
  const accentColor = CATEGORY_COLORS[category || 'QUANTITATIVE'] || '#00E5FF';
  const timerPercent = question ? (timeLeft / question.time_limit_seconds) * 100 : 100;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="quiz-card glass"
          initial={{ scale: 0.85, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
          id="quiz-modal"
        >
          {/* Header */}
          <div className="quiz-header">
            <div className="quiz-header-left">
              <span className="quiz-category-badge" style={{ borderColor: accentColor, color: accentColor }}>
                {category}
              </span>
              {question && (
                <span
                  className="quiz-difficulty-badge"
                  style={{
                    borderColor: DIFFICULTY_COLORS[question.difficulty],
                    color: DIFFICULTY_COLORS[question.difficulty],
                  }}
                >
                  {question.difficulty}
                </span>
              )}
            </div>
            <button className="quiz-close-btn" onClick={handleClose} id="quiz-close">
              ✕
            </button>
          </div>

          {/* Loading / Error / Content */}
          {loading ? (
            <div className="quiz-loading">
              <div className="quiz-loading-spinner" />
              <p>Loading questions...</p>
            </div>
          ) : error ? (
            <div className="quiz-error">
              <p>{error}</p>
              <button className="btn-cyber" onClick={handleClose}>
                Close
              </button>
            </div>
          ) : showSummary ? (
            /* Summary Screen */
            <div className="quiz-summary">
              <div className="quiz-summary-icon">🏆</div>
              <h2 className="quiz-summary-title">Quiz Complete!</h2>
              <div className="quiz-summary-stats">
                <div className="quiz-summary-stat">
                  <span className="quiz-summary-stat-value" style={{ color: '#39FF14' }}>
                    {stats.correct}
                  </span>
                  <span className="quiz-summary-stat-label">Correct</span>
                </div>
                <div className="quiz-summary-stat">
                  <span className="quiz-summary-stat-value" style={{ color: '#FF1493' }}>
                    {stats.total - stats.correct}
                  </span>
                  <span className="quiz-summary-stat-label">Wrong</span>
                </div>
                <div className="quiz-summary-stat">
                  <span className="quiz-summary-stat-value" style={{ color: '#FFD700' }}>
                    {stats.coinsEarned}
                  </span>
                  <span className="quiz-summary-stat-label">Coins</span>
                </div>
              </div>
              <div className="quiz-summary-accuracy">
                <span>Accuracy</span>
                <div className="quiz-accuracy-bar-track">
                  <div
                    className="quiz-accuracy-bar-fill"
                    style={{
                      width: `${stats.total > 0 ? (stats.correct / stats.total) * 100 : 0}%`,
                      background: `linear-gradient(90deg, ${accentColor}, #39FF14)`,
                    }}
                  />
                </div>
                <span>{stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</span>
              </div>
              <button className="btn-cyber" onClick={handleClose} id="quiz-done">
                Done
              </button>
            </div>
          ) : question ? (
            /* Question Card */
            <>
              {/* Timer bar */}
              <div className="quiz-timer-track">
                <div
                  className="quiz-timer-fill"
                  style={{
                    width: `${timerPercent}%`,
                    background:
                      timerPercent > 50
                        ? accentColor
                        : timerPercent > 20
                          ? '#FFD700'
                          : '#FF1493',
                  }}
                />
              </div>
              <div className="quiz-timer-info">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="quiz-timer-seconds" style={{ color: timerPercent <= 20 ? '#FF1493' : '#F0F0F0' }}>
                  {timeLeft}s
                </span>
              </div>

              {/* Question text */}
              <p className="quiz-question-text">{question.text}</p>

              {/* Options */}
              <div className="quiz-options">
                {question.options.map((option, index) => {
                  let optionClass = 'quiz-option';
                  if (result) {
                    if (index === result.correct_answer) optionClass += ' correct';
                    else if (index === selectedAnswer && !result.is_correct)
                      optionClass += ' wrong';
                  } else if (selectedAnswer === index) {
                    optionClass += ' selected';
                  }

                  return (
                    <motion.button
                      key={index}
                      className={optionClass}
                      onClick={() => {
                        if (!result) {
                          setSelectedAnswer(index);
                          handleSubmit(index);
                        }
                      }}
                      whileHover={!result ? { scale: 1.02 } : {}}
                      whileTap={!result ? { scale: 0.98 } : {}}
                      id={`quiz-option-${index}`}
                    >
                      <span className="quiz-option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="quiz-option-text">{option}</span>
                      {result && index === result.correct_answer && (
                        <span className="quiz-option-icon">✓</span>
                      )}
                      {result && index === selectedAnswer && !result.is_correct && index !== result.correct_answer && (
                        <span className="quiz-option-icon wrong-icon">✗</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Result / Explanation */}
              {result && (
                <motion.div
                  className="quiz-result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`quiz-result-badge ${result.is_correct ? 'correct' : 'wrong'}`}>
                    {result.is_correct ? '🎉 Correct!' : '❌ Incorrect'}
                    {result.coins_earned > 0 && (
                      <span className="quiz-coins-earned">+{result.coins_earned} coins</span>
                    )}
                  </div>
                  {result.explanation && (
                    <p className="quiz-explanation">{result.explanation}</p>
                  )}
                  <button className="btn-cyber" onClick={handleNext} id="quiz-next">
                    {currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results'}
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <div className="quiz-error">
              <p>No questions found for this category.</p>
              <button className="btn-cyber" onClick={handleClose}>
                Close
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
