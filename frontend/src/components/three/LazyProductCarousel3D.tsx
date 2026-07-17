'use client';
import dynamic from 'next/dynamic';
import type { CarouselProduct } from './ProductCarousel3D';

const ProductCarousel3D = dynamic(() => import('./ProductCarousel3D'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-white/20 border-t-[#ff2d42] rounded-full animate-spin" />
        </div>
    ),
});

export default function LazyProductCarousel3D({ products }: { products: CarouselProduct[] }) {
    return <ProductCarousel3D products={products} />;
}
