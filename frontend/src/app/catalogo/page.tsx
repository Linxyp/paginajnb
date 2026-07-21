import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/api';
import CatalogGrid from '@/components/CatalogGrid';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
    title: 'Catálogo de Productos | JNB Importaciones',
    description: 'Radios Android, car audio, iluminación LED y accesorios de interior para tu vehículo. Piezas originales y de alto desempeño con envío a toda Colombia.',
    alternates: { canonical: '/catalogo' },
};

export default async function CatalogPage() {
    const products = await getAllProducts();

    return (
        <div className="w-full bg-[#07070b] min-h-screen">
            <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Catálogo' }]} />
            <div className="relative overflow-hidden jnb-grid-bg border-b border-white/5 py-14 px-4">
                <div className="absolute inset-0 jnb-radial-red opacity-70" />
                <div className="relative max-w-7xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Catálogo de Productos</h1>
                    <p className="text-gray-400 text-sm mt-2">Explora nuestra línea de infoentretenimiento y seguridad de vanguardia.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <CatalogGrid products={products} />
            </div>
        </div>
    );
}
