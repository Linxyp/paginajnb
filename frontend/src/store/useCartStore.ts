import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    slug: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => set((state) => {
                const existing = state.items.find(i => i.id === item.id);
                if (existing) {
                    return {
                        items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
                    };
                }
                return { items: [...state.items, item] };
            }),
            removeItem: (id) => set((state) => ({
                items: state.items.filter(i => i.id !== id)
            })),
            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
            })),
            clearCart: () => set({ items: [] }),
            getTotal: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        }),
        { name: 'jnb-shopping-cart' }
    )
);