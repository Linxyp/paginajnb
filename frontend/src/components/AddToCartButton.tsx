'use client';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';

interface ProductProps {
    product: {
        id: string;
        slug: string;
        name: string;
        price: number;
        images: string[];
    };
}

export default function AddToCartButton({ product }: ProductProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = () => {
        addItem({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0] || ''
        });
        alert('Producto añadido al carrito correctamente.');
    };

    return (
        <button 
            onClick={handleAdd}
            className="flex-1 bg-[#C1121F] hover:bg-[#E63946] text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
        >
            <ShoppingCart size={20} />
            Añadir al Carrito
        </button>
    );
}