'use client';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { Zap, ShoppingCart } from 'lucide-react';

const fmt = (n: number) => new Intl.NumberFormat('es-CO').format(n);

interface Props {
    product: { id: string; slug: string; name: string; price: number; images: string[]; stock: number };
}

/** Fixed bottom buy bar shown only on mobile, where the full buy box scrolls out of view. */
export default function MobileBuyBar({ product }: Props) {
    const addItem = useCartStore((state) => state.addItem);
    const showToast = useToastStore((state) => state.show);
    const router = useRouter();
    const outOfStock = product.stock <= 0;

    const handleBuyNow = () => {
        if (outOfStock) return;
        addItem({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0] || '',
            maxStock: product.stock,
        }, 1);
        router.push('/checkout');
    };

    const handleAdd = () => {
        if (outOfStock) return;
        addItem({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0] || '',
            maxStock: product.stock,
        }, 1);
        showToast(`"${product.name}" añadido al carrito.`, 'success');
    };

    return (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0b0b12]/95 backdrop-blur-lg border-t border-white/10 px-3 py-2.5 flex items-center gap-2 safe-area-bottom">
            <div className="min-w-0 shrink-0">
                <div className="text-[8px] text-gray-500 uppercase tracking-widest">Precio</div>
                <div className="font-black text-white text-base leading-none whitespace-nowrap">${fmt(product.price)}</div>
            </div>
            <button
                onClick={handleAdd}
                disabled={outOfStock}
                aria-label="Añadir al carrito"
                className="shrink-0 border border-white/20 text-white p-2.5 rounded-lg disabled:opacity-30"
            >
                <ShoppingCart size={16} />
            </button>
            <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className="flex-1 min-w-0 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#C1121F] to-[#ff2d42] disabled:from-gray-700 disabled:to-gray-700 text-white text-[11px] font-black uppercase tracking-wide px-3 py-2.5 rounded-lg shadow-[0_0_25px_rgba(255,45,66,0.4)]"
            >
                <Zap size={13} className="fill-white shrink-0" />
                <span className="truncate">Comprar ahora</span>
            </button>
        </div>
    );
}
