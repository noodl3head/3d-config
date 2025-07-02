import { ContactShadows } from '@react-three/drei';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import React from 'react';

// Custom grid shader
const GridFadeMaterial = shaderMaterial(
  {
    uColor: new THREE.Color('#b0b0b0'),
    uGridColor: new THREE.Color('#c7c7c7'),
    uFadeDist: 200.0,
    uGridSize: 2.0,
    uOpacity: 0.25,
  },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform vec3 uColor;
    uniform vec3 uGridColor;
    uniform float uFadeDist;
    uniform float uGridSize;
    uniform float uOpacity;
    varying vec2 vUv;

    void main() {
      // World position from UV
      vec2 pos = (vUv - 0.5) * 500.0;

      // Grid lines
      float grid = 0.0;
      float line = 0.03;
      grid += smoothstep(line, 0.0, abs(fract(pos.x / uGridSize - 0.5) - 0.5));
      grid += smoothstep(line, 0.0, abs(fract(pos.y / uGridSize - 0.5) - 0.5));

      // Fade out with distance from center
      float dist = length(pos);
      float fade = 1.0 - smoothstep(uFadeDist * 0.5, uFadeDist, dist);

      // Mix grid and base color
      vec3 color = mix(uColor, uGridColor, grid * fade);

      gl_FragColor = vec4(color, uOpacity * fade);
      if (gl_FragColor.a < 0.01) discard;
    }
  `
);
extend({ GridFadeMaterial });

export default function ShadowPlane() {
  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow={false}
      >
        <planeGeometry args={[500, 500]} />
        <gridFadeMaterial
          uColor="#f0f0f0"
          uGridColor="#c7c7c7"
          uFadeDist={200}
          uGridSize={2}
          uOpacity={0.25}
          transparent
        />
      </mesh>
      <ContactShadows
        position={[0, 0, 0]}
        scale={[24, 36]}
        blur={0.1}
        opacity={0.6}
        far={200}
        resolution={1024}
        color="#000000"
      />
    </>
  );
} 