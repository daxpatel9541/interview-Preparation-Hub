'use client';

import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/ui/LoadingScreen';
import HUD from '@/components/ui/HUD';
import NavigationDots from '@/components/ui/NavigationDots';
import LobbyOverlay from '@/components/ui/LobbyOverlay';
import SkyDeckOverlay from '@/components/ui/SkyDeckOverlay';
import QuizModal from '@/components/ui/QuizModal';
import ExperienceModal from '@/components/ui/ExperienceModal';
import { useAppStore } from '@/store/appStore';

// Dynamically import Three.js canvas (no SSR)
const SceneCanvas = dynamic(() => import('@/components/3d/SceneCanvas'), {
  ssr: false,
});

export default function AppShell() {
  const { isLoading } = useAppStore();

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen />

      {/* 3D Background Canvas */}
      {!isLoading && <SceneCanvas />}

      {/* HUD Navigation */}
      {!isLoading && <HUD />}

      {/* Section Navigation Dots */}
      {!isLoading && <NavigationDots />}

      {/* Section Overlays */}
      {!isLoading && <LobbyOverlay />}
      {!isLoading && <SkyDeckOverlay />}

      {/* Modals */}
      <QuizModal />
      <ExperienceModal />
    </>
  );
}
