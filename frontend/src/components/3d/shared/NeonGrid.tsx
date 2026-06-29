'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NeonGridProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: number;
  divisions?: number;
  color?: string;
  fadeDistance?: number;
}

export default function NeonGrid({
  position = [0, 0, 0],
  rotation = [-Math.PI / 2, 0, 0],
  size = 40,
  divisions = 40,
  color = '#00E5FF',
  fadeDistance = 20,
}: NeonGridProps) {
  const gridRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const half = size / 2;
    const step = size / divisions;

    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step;
      // Horizontal lines
      vertices.push(-half, 0, pos, half, 0, pos);
      // Vertical lines
      vertices.push(pos, 0, -half, pos, 0, half);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }, [size, divisions]);

  useFrame((state) => {
    if (!gridRef.current) return;
    const material = gridRef.current.children[0] as any;
    if (material?.material) {
      material.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={gridRef} position={position}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
