'use client';

import { useAppStore, Section } from '@/store/appStore';

const SECTIONS: { id: Section; label: string; color: string }[] = [
  { id: 'lobby', label: 'Lobby', color: '#00E5FF' },
  { id: 'skydeck', label: 'Sky-Deck', color: '#BC13FE' },
  { id: 'engine', label: 'Engine', color: '#39FF14' },
  { id: 'forge', label: 'Forge', color: '#FF6B35' },
  { id: 'portals', label: 'Portals', color: '#FF1493' },
];

export default function HUD() {
  const { currentSection, setCurrentSection, coins, totalScore } = useAppStore();

  return (
    <div className="hud-container">
      <nav className="hud-panel" id="main-hud">
        <div className="hud-inner">
          {/* Logo / Brand */}
          <div className="hud-brand">
            <div className="hud-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#00E5FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="hud-brand-text">IPH</span>
          </div>

          {/* Navigation */}
          <div className="hud-nav">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                id={`nav-${section.id}`}
                className={`hud-nav-btn ${currentSection === section.id ? 'active' : ''}`}
                onClick={() => setCurrentSection(section.id)}
                style={{
                  '--nav-color': section.color,
                } as React.CSSProperties}
              >
                <span className="hud-nav-dot" />
                <span className="hud-nav-label">{section.label}</span>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="hud-stats">
            <div className="hud-stat" id="hud-coins">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#FFD700" strokeWidth="2" />
                <text x="12" y="16" textAnchor="middle" fill="#FFD700" fontSize="12" fontWeight="bold">$</text>
              </svg>
              <span className="hud-stat-value" style={{ color: '#FFD700' }}>{coins}</span>
            </div>
            <div className="hud-stat" id="hud-score">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" stroke="#00E5FF" strokeWidth="2" fill="none" />
              </svg>
              <span className="hud-stat-value" style={{ color: '#00E5FF' }}>{totalScore}</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
