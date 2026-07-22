'use client';
import { Flame } from 'lucide-react';
import { useFlashTimer } from '@/lib/useFlashTimer';

/** Real per-session countdown (see useFlashTimer) rendered as an eye-catching pulsing badge. */
export default function FlashTimerBadge({ id, compact = false }: { id: string; compact?: boolean }) {
    const { label, expired } = useFlashTimer(id);

    return (
        <div
            className={`inline-flex items-center gap-1.5 rounded-full border border-[#ff2d42]/40 bg-[#C1121F]/15 font-bold text-[#ff2d42] ${
                compact ? 'text-[10px] px-2.5 py-1' : 'text-xs px-3 py-1.5'
            }`}
            style={{ animation: 'pulseGlow 1.6s ease-in-out infinite' }}
        >
            <Flame size={compact ? 11 : 14} className="fill-[#ff2d42] shrink-0" />
            {expired ? (
                <span>¡Últimos minutos de esta oferta!</span>
            ) : (
                <span>
                    Oferta termina en <span className="tabular-nums text-white">{label}</span>
                </span>
            )}
        </div>
    );
}
