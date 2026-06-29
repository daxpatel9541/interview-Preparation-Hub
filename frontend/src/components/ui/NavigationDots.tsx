'use client';

import { useAppStore, Section } from '@/store/appStore';

const SECTIONS: { id: Section; color: string }[] = [
  { id: 'lobby', color: '#00E5FF' },
  { id: 'skydeck', color: '#BC13FE' },
  { id: 'engine', color: '#39FF14' },
  { id: 'forge', color: '#FF6B35' },
  { id: 'portals', color: '#FF1493' },
];

export default function NavigationDots() {
  const { currentSection, setCurrentSection } = useAppStore();

  return (
    <div className="nav-dots" id="section-nav-dots">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          className={`nav-dot ${currentSection === section.id ? 'active' : ''}`}
          onClick={() => setCurrentSection(section.id)}
          title={section.id.charAt(0).toUpperCase() + section.id.slice(1)}
          style={
            currentSection === section.id
              ? {
                  background: section.color,
                  borderColor: section.color,
                  boxShadow: `0 0 16px ${section.color}66`,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
