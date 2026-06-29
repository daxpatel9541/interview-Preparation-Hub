'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { experiencesAPI } from '@/lib/api';

interface Experience {
  id: number;
  company: string;
  role: string;
  year: number;
  round_type: string;
  content: string;
  difficulty_rating: number;
  result: string | null;
  tags: string[] | null;
  created_at: string;
}

const COMPANY_COLORS: Record<string, string> = {
  TCS: '#00E5FF',
  INFOSYS: '#BC13FE',
  WIPRO: '#39FF14',
  ACCENTURE: '#FF6B35',
};

const COMPANY_LOGOS: Record<string, string> = {
  TCS: '🏢',
  INFOSYS: '🏛️',
  WIPRO: '🏗️',
  ACCENTURE: '🔷',
};

export default function ExperienceModal() {
  const { activeModal, setActiveModal } = useAppStore();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOpen = activeModal === 'experiences';

  useEffect(() => {
    if (!isOpen) return;

    const fetchExperiences = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: { company?: string } = {};
        if (selectedCompany) params.company = selectedCompany;
        const res = await experiencesAPI.list(params);
        setExperiences(res.data.experiences);
      } catch {
        setError('Failed to load experiences. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [isOpen, selectedCompany]);

  const handleClose = () => {
    setActiveModal(null);
    setSelectedExperience(null);
    setSelectedCompany(null);
  };

  if (!isOpen) return null;

  const companies = ['TCS', 'INFOSYS', 'WIPRO', 'ACCENTURE'];

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
          className="experience-panel glass"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          id="experience-modal"
        >
          {/* Header */}
          <div className="exp-header">
            <h2 className="exp-title neon-text-blue">Interview Experiences</h2>
            <button className="quiz-close-btn" onClick={handleClose} id="exp-close">
              ✕
            </button>
          </div>

          {/* Company Filter */}
          <div className="exp-company-filter">
            <button
              className={`exp-company-btn ${!selectedCompany ? 'active' : ''}`}
              onClick={() => setSelectedCompany(null)}
              style={{ '--company-color': '#00E5FF' } as React.CSSProperties}
            >
              All
            </button>
            {companies.map((company) => (
              <button
                key={company}
                className={`exp-company-btn ${selectedCompany === company ? 'active' : ''}`}
                onClick={() => setSelectedCompany(company)}
                style={{ '--company-color': COMPANY_COLORS[company] } as React.CSSProperties}
                id={`filter-${company.toLowerCase()}`}
              >
                {COMPANY_LOGOS[company]} {company}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="exp-content">
            {loading ? (
              <div className="quiz-loading">
                <div className="quiz-loading-spinner" />
                <p>Loading experiences...</p>
              </div>
            ) : error ? (
              <div className="quiz-error">
                <p>{error}</p>
              </div>
            ) : selectedExperience ? (
              /* Detail View */
              <motion.div
                className="exp-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <button
                  className="exp-back-btn"
                  onClick={() => setSelectedExperience(null)}
                >
                  ← Back to list
                </button>
                <div
                  className="exp-detail-header"
                  style={{ borderColor: COMPANY_COLORS[selectedExperience.company] }}
                >
                  <span className="exp-detail-company" style={{ color: COMPANY_COLORS[selectedExperience.company] }}>
                    {COMPANY_LOGOS[selectedExperience.company]} {selectedExperience.company}
                  </span>
                  <h3 className="exp-detail-role">{selectedExperience.role}</h3>
                  <span className="exp-detail-round">{selectedExperience.round_type}</span>
                </div>
                <div className="exp-detail-meta">
                  <span>📅 {selectedExperience.year}</span>
                  <span>
                    {'⭐'.repeat(selectedExperience.difficulty_rating)}
                    {'☆'.repeat(5 - selectedExperience.difficulty_rating)}
                  </span>
                  {selectedExperience.result && (
                    <span
                      className="exp-result-badge"
                      style={{
                        color: selectedExperience.result === 'Selected' ? '#39FF14' : '#FF1493',
                        borderColor: selectedExperience.result === 'Selected' ? '#39FF14' : '#FF1493',
                      }}
                    >
                      {selectedExperience.result}
                    </span>
                  )}
                </div>
                <p className="exp-detail-content">{selectedExperience.content}</p>
                {selectedExperience.tags && (
                  <div className="exp-tags">
                    {selectedExperience.tags.map((tag) => (
                      <span key={tag} className="exp-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              /* List View */
              <div className="exp-list">
                {experiences.length === 0 ? (
                  <p className="exp-empty">No experiences found.</p>
                ) : (
                  experiences.map((exp, i) => (
                    <motion.div
                      key={exp.id}
                      className="exp-card glass"
                      onClick={() => setSelectedExperience(exp)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      style={{ '--company-color': COMPANY_COLORS[exp.company] } as React.CSSProperties}
                      id={`exp-card-${exp.id}`}
                    >
                      <div className="exp-card-top">
                        <span className="exp-card-company" style={{ color: COMPANY_COLORS[exp.company] }}>
                          {COMPANY_LOGOS[exp.company]} {exp.company}
                        </span>
                        <span className="exp-card-year">{exp.year}</span>
                      </div>
                      <h4 className="exp-card-role">{exp.role}</h4>
                      <span className="exp-card-round">{exp.round_type}</span>
                      <div className="exp-card-bottom">
                        <span className="exp-card-difficulty">
                          {'⭐'.repeat(exp.difficulty_rating)}
                        </span>
                        {exp.result && (
                          <span
                            className="exp-card-result"
                            style={{
                              color: exp.result === 'Selected' ? '#39FF14' : '#FF1493',
                            }}
                          >
                            {exp.result}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
