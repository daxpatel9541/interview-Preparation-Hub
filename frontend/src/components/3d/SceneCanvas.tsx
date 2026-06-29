'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useAppStore } from '@/store/appStore';
import LobbyScene from '@/components/3d/scenes/LobbyScene';
import SkyDeckScene from '@/components/3d/scenes/SkyDeckScene';

export default function SceneCanvas() {
  const { currentSection } = useAppStore();

  return (
    <div className="canvas-container" id="scene-canvas">
      <Canvas
        camera={{ position: [0, 1, 8], fov: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ background: '#0a0a0a' }}
      >
        <Suspense fallback={null}>
          {/* Always render scenes but control visibility via position */}
          <group visible={currentSection === 'lobby'}>
            <LobbyScene />
          </group>
          <group
            visible={currentSection === 'skydeck'}
            position={currentSection === 'skydeck' ? [0, 0, 0] : [0, -100, 0]}
          >
            <SkyDeckScene />
          </group>

          {/* Global fog for depth */}
          <fog attach="fog" args={['#0a0a0a', 15, 40]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
