import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    slug: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    maxStock: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item, quantity = 1) => set((state) => {
                const existing = state.items.find(i => i.id === item.id);
                if (existing) {
                    const newQuantity = Math.min(existing.quantity + quantity, existing.maxStock);
                    return {
                        items: state.items.map(i => i.id === item.id ? { ...i, quantity: newQuantity, maxStock: item.maxStock } : i)
                    };
                }
                return { items: [...state.items, { ...item, quantity: Math.min(quantity, item.maxStock) }] };
            }),
            removeItem: (id) => set((state) => ({
                items: state.items.filter(i => i.id !== id)
            })),
            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map(i => i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) } : i)
            })),
            clearCart: () => set({ items: [] }),
            getTotal: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        }),
        { name: 'jnb-shopping-cart' }
    )
);
