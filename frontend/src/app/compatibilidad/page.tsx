'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Car, PackageSearch, ArrowRight } from 'lucide-react';
import { getAllProducts, Product } from '@/lib/api';
import { useGarageStore, formatVehicle } from '@/store/useGarageStore';
import { useGarageHydrated } from '@/store/useGarageHydrated';
import { isCompatible } from '@/lib/compatibility';
import VehicleSelectorModal from '@/components/VehicleSelectorModal';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import Reveal from '@/components/motion/Reveal';

const fmt = (n: number) => new Intl.NumberFormat('es-CO').format(n);

export default function CompatibilityPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const vehicle = useGarageStore((s) => s.vehicle);
    const hydrated = useGarageHydrated();

    useEffect(() => {
        getAllProducts().then(setProducts).finally(() => setLoading(false));
    }, []);

    const compatible = products.filter((p) => isCompatible(p, vehicle));
    const universal = products.filter((p) => p.vehicleBrand === 'Universal');

    return (
        <div className="w-full bg-[#07070b] min-h-screen">
            <div className="relative overflow-hidden jnb-grid-bg border-b border-white/5 py-14 px-4">
                <div className="absolute inset-0 jnb-radial-red opacity-70" />
                <div className="relative max-w-3xl mx-auto text-center">
                    <div className="w-14 h-14 rounded-full bg-[#C1121F]/15 border border-[#C1121F]/30 flex items-center justify-center mx-auto mb-4">
                        <Car size={24} className="text-[#ff2d42]" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Mi Garaje</h1>
                    <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">
                        Guarda tu vehículo una vez y te mostramos exactamente qué piezas son compatibles, sin adivinar.
                    </p>

                    {!hydrated ? (
                        <div className="h-14 mt-8" />
                    ) : vehicle ? (
                        <div className="mt-8 inline-flex items-center gap-4 jnb-glass rounded-full pl-5 pr-2 py-2">
                            <span className="text-sm font-bold text-white flex items-center gap-2">
                                <Car size={16} className="text-[#ff2d42]" /> {formatVehicle(vehicle)}
                            </span>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="bg-white/10 hover:bg-[#C1121F] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
                            >
                                Cambiar
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="mt-8 bg-gradient-to-r from-[#C1121F] to-[#ff2d42] text-white font-bold px-8 py-4 rounded-lg text-sm tracking-wide uppercase transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,45,66,0.35)] inline-flex items-center gap-2"
                        >
                            <Car size={18} /> Selecciona tu vehículo
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-72 jnb-glass rounded-2xl animate-pulse" />)}
                    </div>
                ) : !hydrated ? null : vehicle ? (
                    <>
                        <Reveal>
                            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-1">
                                Compatible con tu {formatVehicle(vehicle)}
                            </h2>
                            <p className="text-gray-500 text-xs mb-6">{compatible.length} producto{compatible.length !== 1 ? 's' : ''} encontrado{compatible.length !== 1 ? 's' : ''}</p>
                        </Reveal>

                        {compatible.length === 0 ? (
                            <div className="jnb-glass rounded-2xl p-10 text-center">
                                <PackageSearch size={36} className="text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">Todavía no tenemos piezas específicas para tu vehículo en el catálogo.</p>
                                <Link href="/catalogo" className="inline-flex items-center gap-1.5 text-[#ff2d42] text-xs font-bold uppercase tracking-wide mt-4 hover:opacity-75 transition-opacity">
                                    Ver catálogo completo <ArrowRight size={14} />
                                </Link>
                            </div>
                        ) : (
                            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {compatible.map((p) => (
                                    <StaggerItem key={p.id}>
                                        <ProductCard p={p} />
                                    </StaggerItem>
                                ))}
                            </StaggerGroup>
                        )}
                    </>
                ) : (
                    <>
                        <Reveal>
                            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-1">Piezas universales</h2>
                            <p className="text-gray-500 text-xs mb-6">Compatibles con cualquier vehículo — selecciona el tuyo arriba para ver el resto del catálogo compatible.</p>
                        </Reveal>
                        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {universal.map((p) => (
                                <StaggerItem key={p.id}>
                                    <ProductCard p={p} />
                                </StaggerItem>
                            ))}
                        </StaggerGroup>
                    </>
                )}
            </div>

            <VehicleSelectorModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}

function ProductCard({ p }: { p: Product }) {
    return (
        <Link
            href={`/producto/${p.slug}`}
            className="group jnb-glass rounded-2xl overflow-hidden flex flex-col h-full transition-all hover:border-[#C1121F]/50 hover:-translate-y-1"
        >
            <div className="relative w-full h-44 bg-black/20 border-b border-white/5">
                {p.images[0] && (
                    <Image src={`/productos/${p.images[0]}`} alt={p.name} fill className="object-contain p-5 transition-transform duration-500 group-hover:scale-105" />
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-[9px] font-extrabold uppercase text-[#ff2d42] tracking-widest">{p.category}</span>
                <h3 className="font-bold text-sm text-white mt-1 line-clamp-2 h-10">{p.name}</h3>
                <span className="font-black text-base text-white mt-auto pt-3">${fmt(p.price)}</span>
            </div>
        </Link>
    );
}
