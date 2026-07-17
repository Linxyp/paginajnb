'use client';
import { useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ParallaxHeroProps {
    backgroundImage: string;
    children: ReactNode;
    className?: string;
}

/**
 * Full-bleed hero wrapper: the background photo drifts opposite the cursor while
 * children (rendered above it, unaffected) stay put — that separation between
 * layers is what reads as "depth" rather than a flat backdrop.
 */
export default function ParallaxHero({ backgroundImage, children, className = '' }: ParallaxHeroProps) {
    const ref = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const springCfg = { stiffness: 60, damping: 20, mass: 0.8 };
    const bgX = useSpring(useTransform(mx, [0, 1], ['3%', '-3%']), springCfg);
    const bgY = useSpring(useTransform(my, [0, 1], ['2%', '-2%']), springCfg);

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width);
        my.set((e.clientY - rect.top) / rect.height);
    };
    const handleLeave = () => { mx.set(0.5); my.set(0.5); };

    return (
        <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`relative overflow-hidden ${className}`}>
            <motion.div
                aria-hidden
                className="absolute jnb-photo-hero"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    left: '-5%', right: '-5%', top: '-5%', bottom: '-5%',
                    x: bgX,
                    y: bgY,
                }}
            />
            <div className="relative z-10 w-full h-full">{children}</div>
        </div>
    );
}
