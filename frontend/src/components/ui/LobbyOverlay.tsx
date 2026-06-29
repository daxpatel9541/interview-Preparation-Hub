'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';

export default function LobbyOverlay() {
  const { currentSection, setCurrentSection, setActiveModal } = useAppStore();

  if (currentSection !== 'lobby') return null;

  return (
    <motion.div
      className="section-overlay lobby-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      id="lobby-overlay"
    >
      <div className="lobby-content">
        {/* Action buttons at bottom */}
        <div className="lobby-actions">
          <motion.button
            className="lobby-action-card glass"
            onClick={() => setCurrentSection('skydeck')}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            id="enter-skydeck"
          >
            <div className="action-icon" style={{ color: '#00E5FF' }}>🧮</div>
            <h3 className="action-title neon-text-blue">Aptitude Sky-Deck</h3>
            <p className="action-desc">Practice quantitative, logical & verbal reasoning</p>
          </motion.button>

          <motion.button
            className="lobby-action-card glass"
            onClick={() => setActiveModal('experiences')}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            id="enter-experiences"
          >
            <div className="action-icon" style={{ color: '#BC13FE' }}>📋</div>
            <h3 className="action-title neon-text-purple">Experience Vault</h3>
            <p className="action-desc">Read real interview experiences from TCS, Infosys & more</p>
          </motion.button>

          <motion.button
            className="lobby-action-card glass"
            onClick={() => setCurrentSection('engine')}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            id="enter-engine"
          >
            <div className="action-icon" style={{ color: '#39FF14' }}>⚡</div>
            <h3 className="action-title" style={{ color: '#39FF14' }}>Quiz Engine</h3>
            <p className="action-desc">Take timed quizzes and earn coins</p>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
