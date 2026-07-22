'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PackageSearch, CheckCircle2, Car, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/api';
import { useGarageStore, formatVehicle } from '@/store/useGarageStore';
import { useGarageHydrated } from '@/store/useGarageHydrated';
import { isCompatible } from '@/lib/compatibility';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import PriceBlock from '@/components/PriceBlock';
import { NEW_PRODUCT_SLUGS } from '@/lib/urgency';

export default function CatalogGrid({ products }: { products: Product[] }) {
    const [onlyCompatible, setOnlyCompatible] = useState(false);
    const vehicle = useGarageStore((s) => s.vehicle);
    const hydrated = useGarageHydrated();

    const sorted = useMemo(() => {
        if (!hydrated || !vehicle) return products;
        const withFlag = products.map((p) => ({ p, ok: isCompatible(p, vehicle) }));
        withFlag.sort((a, b) => Number(b.ok) - Number(a.ok));
        return (onlyCompatible ? withFlag.filter((x) => x.ok) : withFlag).map((x) => x.p);
    }, [products, vehicle, hydrated, onlyCompatible]);

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center jnb-glass rounded-2xl">
                <PackageSearch size={40} className="text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm">No se encontraron artículos disponibles en el inventario.</p>
            </div>
        );
    }

    return (
        <>
            {hydrated && vehicle && (
                <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Car size={14} className="text-[#ff2d42]" /> Mostrando primero lo compatible con tu {formatVehicle(vehicle)}
                    </p>
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={onlyCompatible}
                            onChange={(e) => setOnlyCompatible(e.target.checked)}
                            className="accent-[#C1121F]"
                        />
                        Solo compatibles
                    </label>
                </div>
            )}

            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {sorted.map((p) => {
                    const compatible = hydrated && vehicle ? isCompatible(p, vehicle) : false;
                    return (
                        <StaggerItem key={p.id}>
                            <Link
                                href={`/producto/${p.slug}`}
                                className="group jnb-glass rounded-2xl overflow-hidden flex flex-col h-full transition-all hover:border-[#C1121F]/50 hover:-translate-y-1 relative"
                            >
                                {compatible && (
                                    <span className="absolute top-3 left-3 z-10 bg-emerald-500/90 text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1">
                                        <CheckCircle2 size={10} /> Compatible
                                    </span>
                                )}
                                {NEW_PRODUCT_SLUGS.includes(p.slug) && (
                                    <span className="absolute top-3 right-3 z-10 bg-gradient-to-r from-[#C1121F] to-[#ff2d42] text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1">
                                        <Sparkles size={10} /> Nuevo
                                    </span>
                                )}
                                <div className="relative w-full h-48 bg-black/20 border-b border-white/5">
                                    {p.images[0] && (
                                        <Image src={`/productos/${p.images[0]}`} alt={p.name} fill className="object-contain p-5 transition-transform duration-500 group-hover:scale-105" />
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <span className="text-[10px] font-extrabold uppercase text-[#ff2d42] tracking-widest">{p.category}</span>
                                    <h2 className="font-bold text-sm text-white mt-1.5 line-clamp-2 h-10 group-hover:text-[#ff2d42] transition-colors">{p.name}</h2>
                                    <p className="text-xs text-gray-500 mt-2">Línea: {p.brand}</p>
                                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                                        <PriceBlock id={p.id} price={p.price} size="sm" />
                                        <span className="shrink-0 bg-white/10 group-hover:bg-[#C1121F] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                                            Ver Más
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </StaggerItem>
                    );
                })}
            </StaggerGroup>
        </>
    );
}
