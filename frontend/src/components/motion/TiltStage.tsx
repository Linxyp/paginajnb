'use client';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

interface TiltStageProps {
    children: ReactNode;
    className?: string;
    /** Max rotation in degrees */
    strength?: number;
    glow?: boolean;
}

/**
 * Wraps product artwork in a mouse-tracked 3D tilt + specular glow, so a flat
 * product photo reads as a "floating" object without needing a real 3D model.
 */
export default function TiltStage({ children, className = '', strength = 10, glow = true }: TiltStageProps) {
    const ref = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);

    const springCfg = { stiffness: 150, damping: 18, mass: 0.6 };
    const rotateX = useSpring(useTransform(my, [0, 1], [strength, -strength]), springCfg);
    const rotateY = useSpring(useTransform(mx, [0, 1], [-strength, strength]), springCfg);
    const glowX = useTransform(mx, [0, 1], ['20%', '80%']);
    const glowY = useTransform(my, [0, 1], ['20%', '80%']);
    const glowBackground = useTransform(
        [glowX, glowY],
        ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.18), transparent 45%)`
    );

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width);
        my.set((e.clientY - rect.top) / rect.height);
    };

    const handleLeave = () => {
        mx.set(0.5);
        my.set(0.5);
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className={`relative [perspective:1200px] ${className}`}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                animate={{ y: [0, -14, 0] }}
                transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
                className="relative w-full h-full"
            >
                {children}

                {glow && (
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-300"
                        style={{ background: glowBackground }}
                    />
                )}
            </motion.div>
        </div>
    );
}
