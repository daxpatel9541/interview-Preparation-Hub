'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import ParticleField from '../shared/ParticleField';
import GlowOrb from '../shared/GlowOrb';

export default function SkyDeckScene() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={[0, -15, 0]}>
      {/* Star field background */}
      <ParticleField count={600} color="#ffffff" spread={50} opacity={0.5} size={0.015} />
      <ParticleField count={200} color="#00E5FF" spread={30} opacity={0.3} />

      {/* Observatory title */}
      <Text
        fontSize={0.5}
        color="#00E5FF"
        anchorX="center"
        anchorY="middle"
        position={[0, 3, -2]}
      >
        APTITUDE SKY-DECK
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </Text>
      <Text
        fontSize={0.15}
        color="#F0F0F0"
        anchorX="center"
        anchorY="middle"
        position={[0, 2.4, -2]}
      >
        The Futuristic Observatory • Test Your Aptitude
        <meshStandardMaterial color="#F0F0F0" transparent opacity={0.5} />
      </Text>

      {/* Three category portals */}
      <CategoryPortal
        position={[-4, 0, -5]}
        label="QUANTITATIVE"
        sublabel="Numbers & Logic"
        color="#00E5FF"
      />
      <CategoryPortal
        position={[0, 0, -7]}
        label="LOGICAL"
        sublabel="Reasoning & Patterns"
        color="#BC13FE"
      />
      <CategoryPortal
        position={[4, 0, -5]}
        label="VERBAL"
        sublabel="Language & Comprehension"
        color="#39FF14"
      />

      {/* Floating question orbs (decorative) */}
      <QuestionOrb position={[-2, 2, -4]} color="#00E5FF" />
      <QuestionOrb position={[3, 1.5, -3]} color="#BC13FE" />
      <QuestionOrb position={[-1, 3, -6]} color="#39FF14" />
      <QuestionOrb position={[2, 2.5, -5]} color="#FF6B35" />

      {/* Glass floor effect */}
      <mesh position={[0, -2, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#0a0a1a"
          transparent
          opacity={0.3}
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      {/* Lighting for observatory */}
      <ambientLight intensity={0.1} />
      <pointLight position={[-4, 3, -5]} color="#00E5FF" intensity={2} distance={10} />
      <pointLight position={[0, 3, -7]} color="#BC13FE" intensity={2} distance={10} />
      <pointLight position={[4, 3, -5]} color="#39FF14" intensity={2} distance={10} />
    </group>
  );
}

function CategoryPortal({
  position,
  label,
  sublabel,
  color,
}: {
  position: [number, number, number];
  label: string;
  sublabel: string;
  color: string;
}) {
  const portalRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
    if (portalRef.current) {
      portalRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.15;
    }
  });

  return (
    <group ref={portalRef} position={position}>
      {/* Portal ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.04, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>

      {/* Portal fill */}
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Label */}
      <Text
        fontSize={0.18}
        color={color}
        anchorX="center"
        anchorY="middle"
        position={[0, -1.8, 0]}
      >
        {label}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          toneMapped={false}
        />
      </Text>
      <Text
        fontSize={0.1}
        color="#F0F0F0"
        anchorX="center"
        anchorY="middle"
        position={[0, -2.1, 0]}
      >
        {sublabel}
        <meshStandardMaterial color="#F0F0F0" transparent opacity={0.4} />
      </Text>

      <pointLight color={color} intensity={1.5} distance={6} />
    </group>
  );
}

function QuestionOrb({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(time * 0.7 + position[0]) * 0.2;
    ref.current.rotation.y = time * 0.3;
  });

  return (
    <group position={position}>
      <Sphere ref={ref} args={[0.35, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </Sphere>
      <Text
        fontSize={0.08}
        color={color}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0.4]}
      >
        ?
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </Text>
    </group>
  );
}
