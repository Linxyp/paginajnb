'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 3.0;
    float t = uTime * 0.04;

    float n1 = fbm(p + vec2(t, -t * 0.6));
    float n2 = fbm(p * 1.6 - vec2(t * 0.5, t * 0.3));

    vec3 base = vec3(0.02, 0.02, 0.035);
    vec3 red = vec3(0.68, 0.05, 0.09);
    vec3 crimson = vec3(1.0, 0.15, 0.2);

    float glow = smoothstep(0.35, 0.95, n1) * 0.5;
    float streak = smoothstep(0.55, 0.98, n2) * 0.35;

    vec3 color = base;
    color += red * glow;
    color += crimson * streak * 0.6;

    float vig = smoothstep(1.05, 0.15, length(uv - 0.5));
    color *= mix(0.35, 1.0, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function ShaderPlane() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size } = useThree();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(size.width, size.height) },
        }),
        [size.width, size.height]
    );

    useFrame((_, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta;
        }
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

/** Full-bleed animated shader gradient — purely decorative, GPU-light (single fullscreen triangle, no geometry). */
export default function AmbientShaderBg({ className = '' }: { className?: string }) {
    return (
        <div className={`absolute inset-0 ${className}`} aria-hidden="true">
            <Canvas
                orthographic
                camera={{ position: [0, 0, 1] }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
            >
                <ShaderPlane />
            </Canvas>
        </div>
    );
}
