'use client';
import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    once?: boolean;
}

const makeVariants = (y: number): Variants => ({
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0 },
});

/** Fades + slides content in once it scrolls into view. */
export default function Reveal({ children, className, delay = 0, y = 28, once = true }: RevealProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once, margin: '-10% 0px -10% 0px' }}
            variants={makeVariants(y)}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    );
}
