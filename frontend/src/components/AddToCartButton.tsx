'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { ShoppingCart, Minus, Plus, Zap } from 'lucide-react';

interface ProductProps {
    product: {
        id: string;
        slug: string;
        name: string;
        price: number;
        images: string[];
        stock: number;
    };
}

export default function AddToCartButton({ product }: ProductProps) {
    const addItem = useCartStore((state) => state.addItem);
    const showToast = useToastStore((state) => state.show);
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const outOfStock = product.stock <= 0;

    const commit = () => {
        if (outOfStock) return false;
        addItem({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0] || '',
            maxStock: product.stock,
        }, quantity);
        return true;
    };

    const handleAdd = () => {
        if (!commit()) return;
        showToast(`${quantity} × "${product.name}" añadido al carrito.`, 'success');
        setQuantity(1);
    };

    const handleBuyNow = () => {
        if (!commit()) return;
        router.push('/checkout');
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-3">
                {!outOfStock && (
                    <div className="flex items-center border border-white/15 bg-white/5 rounded-lg overflow-hidden shrink-0">
                        <button
                            type="button"
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="px-3 py-4 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                            aria-label="Disminuir cantidad"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-bold text-white">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                            className="px-3 py-4 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                            aria-label="Aumentar cantidad"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                )}
                <button
                    onClick={handleAdd}
                    disabled={outOfStock}
                    className="flex-1 border border-white/20 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm tracking-wide"
                >
                    <ShoppingCart size={18} />
                    {outOfStock ? 'Sin stock' : 'Añadir al carrito'}
                </button>
            </div>

            <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className="w-full relative overflow-hidden bg-gradient-to-r from-[#C1121F] to-[#ff2d42] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-lg transition-transform hover:scale-[1.015] active:scale-[0.99] flex items-center justify-center gap-2 text-sm tracking-widest uppercase shadow-[0_0_35px_rgba(255,45,66,0.35)]"
            >
                <Zap size={18} className="fill-white" />
                Comprar ahora
            </button>
        </div>
    );
}
