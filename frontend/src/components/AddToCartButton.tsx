'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { ShoppingCart, Minus, Plus } from 'lucide-react';

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
    const [quantity, setQuantity] = useState(1);

    const outOfStock = product.stock <= 0;

    const handleAdd = () => {
        if (outOfStock) return;
        addItem({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0] || '',
            maxStock: product.stock,
        }, quantity);
        showToast(`${quantity} × "${product.name}" añadido al carrito.`, 'success');
        setQuantity(1);
    };

    return (
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
            {!outOfStock && (
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-3 py-4 text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Disminuir cantidad"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-[#2B2D42]">{quantity}</span>
                    <button
                        type="button"
                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                        className="px-3 py-4 text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Aumentar cantidad"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            )}
            <button
                onClick={handleAdd}
                disabled={outOfStock}
                className="flex-1 bg-[#C1121F] hover:bg-[#E63946] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
            >
                <ShoppingCart size={20} />
                {outOfStock ? 'Sin stock disponible' : 'Añadir al Carrito'}
            </button>
        </div>
    );
}
