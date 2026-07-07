import { create } from 'zustand';

export interface Toast {
    id: number;
    message: string;
    variant: 'success' | 'error' | 'info';
}

interface ToastStore {
    toasts: Toast[];
    show: (message: string, variant?: Toast['variant']) => void;
    dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    show: (message, variant = 'info') => {
        const id = nextId++;
        set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }));
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 3500);
    },
    dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
