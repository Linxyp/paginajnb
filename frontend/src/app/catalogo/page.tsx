import Link from 'next/link';
import Image from 'next/image';
import { PackageSearch } from 'lucide-react';
import { getAllProducts, Product } from '@/lib/api';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';

const fmt = (n: number) => new Intl.NumberFormat('es-CO').format(n);

export default async function CatalogPage() {
    const products = await getAllProducts();

    return (
        <div className="w-full bg-[#07070b] min-h-screen">
            <div className="relative overflow-hidden jnb-grid-bg border-b border-white/5 py-14 px-4">
                <div className="absolute inset-0 jnb-radial-red opacity-70" />
                <div className="relative max-w-7xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Catálogo de Productos</h1>
                    <p className="text-gray-400 text-sm mt-2">Explora nuestra línea de infoentretenimiento y seguridad de vanguardia.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center jnb-glass rounded-2xl">
                        <PackageSearch size={40} className="text-gray-600 mb-3" />
                        <p className="text-gray-400 text-sm">No se encontraron artículos disponibles en el inventario.</p>
                    </div>
                ) : (
                    <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {products.map((p: Product) => (
                            <StaggerItem key={p.id}>
                                <Link
                                    href={`/producto/${p.slug}`}
                                    className="group jnb-glass rounded-2xl overflow-hidden flex flex-col h-full transition-all hover:border-[#C1121F]/50 hover:-translate-y-1"
                                >
                                    <div className="relative w-full h-48 bg-black/20 border-b border-white/5">
                                        {p.images[0] && (
                                            <Image src={`/productos/${p.images[0]}`} alt={p.name} fill className="object-contain p-5 transition-transform duration-500 group-hover:scale-105" />
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <span className="text-[10px] font-extrabold uppercase text-[#ff2d42] tracking-widest">{p.category}</span>
                                        <h2 className="font-bold text-sm text-white mt-1.5 line-clamp-2 h-10 group-hover:text-[#ff2d42] transition-colors">{p.name}</h2>
                                        <p className="text-xs text-gray-500 mt-2">Línea: {p.brand}</p>
                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                            <span className="font-black text-base text-white">${fmt(p.price)}</span>
                                            <span className="bg-white/10 group-hover:bg-[#C1121F] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                                                Ver Más
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </StaggerItem>
                        ))}
                    </StaggerGroup>
                )}
            </div>
        </div>
    );
}
