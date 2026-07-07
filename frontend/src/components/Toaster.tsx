'use client';
import { useToastStore } from '@/store/useToastStore';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const styles = {
    success: { bg: 'bg-[#2B2D42]', icon: CheckCircle2, iconColor: 'text-green-400' },
    error: { bg: 'bg-[#2B2D42]', icon: XCircle, iconColor: 'text-[#E63946]' },
    info: { bg: 'bg-[#2B2D42]', icon: Info, iconColor: 'text-blue-400' },
};

export default function Toaster() {
    const { toasts, dismiss } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[100] flex flex-col gap-2.5 max-w-sm w-[calc(100%-2rem)] sm:w-full">
            {toasts.map((t) => {
                const s = styles[t.variant];
                const Icon = s.icon;
                return (
                    <div
                        key={t.id}
                        className={`${s.bg} text-white rounded-lg shadow-2xl px-4 py-3.5 flex items-start gap-3 animate-[fadeIn_0.2s_ease-out]`}
                    >
                        <Icon size={20} className={`${s.iconColor} shrink-0 mt-0.5`} />
                        <p className="text-sm font-semibold leading-snug flex-1">{t.message}</p>
                        <button onClick={() => dismiss(t.id)} className="text-gray-400 hover:text-white shrink-0">
                            <X size={16} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
