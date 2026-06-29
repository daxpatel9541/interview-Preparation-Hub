'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';

const CATEGORIES = [
  {
    id: 'quantitative',
    label: 'QUANTITATIVE',
    sublabel: 'Numbers, Algebra & Arithmetic',
    icon: '🔢',
    color: '#00E5FF',
    description: 'Profit & Loss, Time & Distance, Percentages, Averages, Compound Interest',
  },
  {
    id: 'logical',
    label: 'LOGICAL',
    sublabel: 'Reasoning & Patterns',
    icon: '🧩',
    color: '#BC13FE',
    description: 'Series, Coding-Decoding, Blood Relations, Seating Arrangements, Syllogisms',
  },
  {
    id: 'verbal',
    label: 'VERBAL',
    sublabel: 'Language & Comprehension',
    icon: '📝',
    color: '#39FF14',
    description: 'Synonyms, Antonyms, Reading Comprehension, Grammar, Analogies',
  },
];

export default function SkyDeckOverlay() {
  const { currentSection, setActiveModal, setCurrentSection } = useAppStore();

  if (currentSection !== 'skydeck') return null;

  return (
    <motion.div
      className="section-overlay skydeck-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      id="skydeck-overlay"
    >
      <div className="skydeck-content">
        {/* Back button */}
        <motion.button
          className="section-back-btn"
          onClick={() => setCurrentSection('lobby')}
          whileHover={{ x: -4 }}
          id="back-to-lobby"
        >
          ← Back to Lobby
        </motion.button>

        <h2 className="skydeck-heading neon-text-blue">Choose Your Challenge</h2>
        <p className="skydeck-subheading">Select an aptitude category to begin practicing</p>

        <div className="skydeck-categories">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              className="category-card glass"
              onClick={() => setActiveModal(`quiz-${cat.id}`)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.04, y: -6 }}
              whileTap={{ scale: 0.97 }}
              style={{ '--cat-color': cat.color } as React.CSSProperties}
              id={`category-${cat.id}`}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3 className="category-label" style={{ color: cat.color }}>
                {cat.label}
              </h3>
              <p className="category-sublabel">{cat.sublabel}</p>
              <p className="category-description">{cat.description}</p>
              <div className="category-start-btn" style={{ borderColor: cat.color, color: cat.color }}>
                Start Practice →
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
