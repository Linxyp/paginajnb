'use client';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useRef, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

export interface CarouselProduct {
    slug: string;
    name: string;
    image: string;
}

function Card({ product, angle, radius, onHover }: { product: CarouselProduct; angle: number; radius: number; onHover: (slug: string | null) => void }) {
    const texture = useTexture(`/productos/${product.image}`);
    const router = useRouter();
    const meshRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame(() => {
        if (!meshRef.current) return;
        const targetScale = hovered ? 1.12 : 1;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    });

    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    return (
        <group
            ref={meshRef}
            position={[x, 0, z]}
            rotation={[0, angle, 0]}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); onHover(product.slug); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
            onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); router.push(`/producto/${product.slug}`); }}
        >
            <mesh position={[0, 0, -0.02]}>
                <planeGeometry args={[1.96, 1.96]} />
                <meshBasicMaterial color={hovered ? '#ff2d42' : '#151519'} />
            </mesh>
            <mesh>
                <planeGeometry args={[1.8, 1.8]} />
                <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>
        </group>
    );
}

function Ring({ products, onHover }: { products: CarouselProduct[]; onHover: (slug: string | null) => void }) {
    const groupRef = useRef<THREE.Group>(null);
    const rotationVel = useRef(0.0025);
    const dragging = useRef(false);
    const lastX = useRef(0);

    const radius = Math.max(2.4, products.length * 0.5);

    useFrame(() => {
        if (!groupRef.current) return;
        if (!dragging.current) {
            groupRef.current.rotation.y += rotationVel.current;
        }
    });

    return (
        <group
            ref={groupRef}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => { dragging.current = true; lastX.current = e.clientX; }}
            onPointerUp={() => { dragging.current = false; }}
            onPointerLeave={() => { dragging.current = false; }}
            onPointerMove={(e: ThreeEvent<PointerEvent>) => {
                if (!dragging.current || !groupRef.current) return;
                const delta = e.clientX - lastX.current;
                groupRef.current.rotation.y += delta * 0.005;
                lastX.current = e.clientX;
            }}
        >
            {products.map((p, i) => (
                <Card key={p.slug} product={p} angle={(i / products.length) * Math.PI * 2} radius={radius} onHover={onHover} />
            ))}
        </group>
    );
}

/** Real 3D carousel: product photos as textures on planes arranged in a ring, drag or auto-rotate. */
export default function ProductCarousel3D({ products }: { products: CarouselProduct[] }) {
    const [, setHoveredSlug] = useState<string | null>(null);

    return (
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas
                camera={{ position: [0, 0.2, 6.4], fov: 40 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
            >
                <Suspense fallback={null}>
                    <Ring products={products} onHover={setHoveredSlug} />
                </Suspense>
            </Canvas>
        </div>
    );
}
