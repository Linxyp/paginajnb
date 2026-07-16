'use client';
import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export function StaggerGroup({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
            variants={container}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div className={className} variants={item}>
            {children}
        </motion.div>
    );
}
