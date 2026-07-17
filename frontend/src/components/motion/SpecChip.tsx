'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SpecChipProps {
    icon: ReactNode;
    label: string;
    value: string;
    className?: string;
    delay?: number;
}

/** Small frosted-glass pill that floats gently, used to surface a key spec beside a hero product image. */
export default function SpecChip({ icon, label, value, className = '', delay = 0 }: SpecChipProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{
                opacity: { duration: 0.6, delay },
                y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay },
            }}
            className={`jnb-glass rounded-2xl px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] ${className}`}
        >
            <div className="flex items-center gap-2">
                <span className="text-[#ff2d42] shrink-0">{icon}</span>
                <div className="leading-tight">
                    <div className="text-[9px] text-gray-400 uppercase tracking-wider">{label}</div>
                    <div className="text-xs font-bold text-white whitespace-nowrap">{value}</div>
                </div>
            </div>
        </motion.div>
    );
}

export function SpecChipLayer({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`absolute inset-0 pointer-events-none ${className}`}>{children}</div>;
}
