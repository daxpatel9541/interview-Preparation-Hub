'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import ParticleField from '../shared/ParticleField';
import GlowOrb from '../shared/GlowOrb';
import NeonGrid from '../shared/NeonGrid';

export default function LobbyScene() {
  const groupRef = useRef<THREE.Group>(null);
  const titleRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.3;
      ringRef.current.rotation.z = time * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = time * 0.4;
      ring2Ref.current.rotation.x = time * 0.1;
    }
    if (titleRef.current) {
      titleRef.current.position.y = Math.sin(time * 0.5) * 0.1 + 1.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Ambient atmosphere */}
      <ParticleField count={800} color="#00E5FF" spread={30} opacity={0.4} />
      <ParticleField count={300} color="#BC13FE" spread={25} opacity={0.3} />

      {/* Neon floor grid */}
      <NeonGrid position={[0, -3, 0]} size={60} divisions={60} />

      {/* Main title group */}
      <group ref={titleRef} position={[0, 1.5, 0]}>
        <Text
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZ9hjp-Ek-_y.woff"
          fontSize={0.8}
          color="#00E5FF"
          anchorX="center"
          anchorY="middle"
          maxWidth={10}
        >
          INTERVIEW
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={0.6}
            toneMapped={false}
          />
        </Text>
        <Text
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZ9hjp-Ek-_y.woff"
          fontSize={0.8}
          color="#BC13FE"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.9, 0]}
        >
          PREPARATION HUB
          <meshStandardMaterial
            color="#BC13FE"
            emissive="#BC13FE"
            emissiveIntensity={0.6}
            toneMapped={false}
          />
        </Text>
        <Text
          fontSize={0.18}
          color="#F0F0F0"
          anchorX="center"
          anchorY="middle"
          position={[0, -1.6, 0]}
          maxWidth={8}
        >
          Navigate the Digital Skyscraper • Master Your Career
          <meshStandardMaterial color="#F0F0F0" transparent opacity={0.6} />
        </Text>
      </group>

      {/* Holographic rings */}
      <mesh ref={ringRef} position={[0, 0.5, 0]}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={1}
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ring2Ref} position={[0, 0.5, 0]}>
        <torusGeometry args={[3, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#BC13FE"
          emissive="#BC13FE"
          emissiveIntensity={1}
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Floating orbs as scene decorations */}
      <GlowOrb position={[-4, 2, -3]} color="#00E5FF" size={0.3} intensity={1.5} />
      <GlowOrb position={[4, 1, -2]} color="#BC13FE" size={0.25} intensity={1.5} />
      <GlowOrb position={[-3, -1, -4]} color="#39FF14" size={0.15} intensity={1} />
      <GlowOrb position={[5, 3, -5]} color="#FF6B35" size={0.2} intensity={1} />

      {/* Decorative floating blocks */}
      <FloatingBlock position={[-6, 0, -8]} color="#1a1a2e" emissive="#00E5FF" />
      <FloatingBlock position={[6, 2, -6]} color="#1a1a2e" emissive="#BC13FE" />
      <FloatingBlock position={[-3, 3, -10]} color="#1a1a2e" emissive="#39FF14" />
      <FloatingBlock position={[4, -1, -7]} color="#1a1a2e" emissive="#FF6B35" />

      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 5]} color="#00E5FF" intensity={2} distance={20} />
      <pointLight position={[-5, 3, -3]} color="#BC13FE" intensity={1.5} distance={15} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={0.8}
        color="#00E5FF"
        intensity={1}
        castShadow
      />
    </group>
  );
}

function FloatingBlock({
  position,
  color,
  emissive,
}: {
  position: [number, number, number];
  color: string;
  emissive: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.rotation.x = time * 0.2 + position[0];
    ref.current.rotation.y = time * 0.3 + position[1];
    ref.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.3;
  });

  return (
    <RoundedBox ref={ref} position={position} args={[0.8, 0.8, 0.8]} radius={0.1} smoothness={4}>
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.15}
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.6}
      />
    </RoundedBox>
  );
}
