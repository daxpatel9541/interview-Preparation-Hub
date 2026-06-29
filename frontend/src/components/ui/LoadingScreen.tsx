'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';

const LOADING_MESSAGES = [
  'Initializing Quantum Core...',
  'Loading Neural Pathways...',
  'Compiling Question Matrix...',
  'Syncing Experience Vault...',
  'Calibrating Skill Engines...',
  'Establishing Data Links...',
  'Rendering Holographic UI...',
  'System Ready.',
];

export default function LoadingScreen() {
  const { isLoading, setIsLoading, loadingProgress, setLoadingProgress } = useAppStore();
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const progressInterval = setInterval(() => {
      setLoadingProgress(Math.min(loadingProgress + Math.random() * 8 + 2, 100));
    }, 200);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => Math.min(prev + 1, LOADING_MESSAGES.length - 1));
    }, 400);

    if (loadingProgress >= 100) {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      setMessageIndex(LOADING_MESSAGES.length - 1);
      setTimeout(() => setFadeOut(true), 500);
      setTimeout(() => setIsLoading(false), 1200);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading, loadingProgress, setIsLoading, setLoadingProgress]);

  if (!isLoading) return null;

  return (
    <div
      className="loading-screen"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 700ms ease-out',
      }}
    >
      {/* Animated logo */}
      <div className="loading-logo">
        <div className="loading-ring" />
        <div className="loading-ring loading-ring-2" />
        <div className="loading-core" />
      </div>

      {/* Title */}
      <h1 className="loading-title">
        INTERVIEW
        <span className="loading-title-accent"> PREPARATION HUB</span>
      </h1>

      {/* Loading message */}
      <p className="loading-message">{LOADING_MESSAGES[messageIndex]}</p>

      {/* Progress bar */}
      <div className="loading-bar-track">
        <div
          className="loading-bar-fill"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>

      {/* Percentage */}
      <span className="loading-percent">{Math.round(loadingProgress)}%</span>
    </div>
  );
}
