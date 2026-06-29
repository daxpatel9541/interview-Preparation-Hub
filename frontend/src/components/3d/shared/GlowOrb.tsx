'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface GlowOrbProps {
  position?: [number, number, number];
  color?: string;
  size?: number;
  intensity?: number;
  speed?: number;
  distort?: number;
  onClick?: () => void;
}

export default function GlowOrb({
  position = [0, 0, 0],
  color = '#00E5FF',
  size = 0.5,
  intensity = 2,
  speed = 2,
  distort = 0.3,
  onClick,
}: GlowOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.15;
    
    if (lightRef.current) {
      lightRef.current.intensity = intensity + Math.sin(time * 2) * 0.5;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[size, 32, 32]} onClick={onClick}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.8}
          distort={distort}
          speed={speed}
        />
      </Sphere>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        distance={8}
        decay={2}
      />
    </group>
  );
}
