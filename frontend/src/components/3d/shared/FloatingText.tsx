'use client';

import { Text3D, Center } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingTextProps {
  text: string;
  position?: [number, number, number];
  size?: number;
  color?: string;
  emissiveIntensity?: number;
  floating?: boolean;
}

export default function FloatingText({
  text,
  position = [0, 0, 0],
  size = 0.5,
  color = '#00E5FF',
  emissiveIntensity = 0.5,
  floating = true,
}: FloatingTextProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !floating) return;
    groupRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      <Center>
        <Text3D
          font="/fonts/inter_bold.json"
          size={size}
          height={0.05}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.005}
          bevelOffset={0}
          bevelSegments={3}
        >
          {text}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
}
