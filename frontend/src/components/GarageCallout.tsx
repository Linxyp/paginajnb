'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Car, ArrowRight, Sparkles } from 'lucide-react';
import { useGarageStore, formatVehicle } from '@/store/useGarageStore';
import { useGarageHydrated } from '@/store/useGarageHydrated';
import VehicleSelectorModal from './VehicleSelectorModal';
import Reveal from './motion/Reveal';

/** Non-blocking "shop by vehicle" invitation — never gates browsing, just always available. */
export default function GarageCallout() {
    const [open, setOpen] = useState(false);
    const vehicle = useGarageStore((s) => s.vehicle);
    const hydrated = useGarageHydrated();

    if (!hydrated) return <div className="h-[104px]" />;

    return (
        <Reveal>
            <section className="max-w-[1400px] mx-auto px-6 md:px-8 py-6">
                {vehicle ? (
                    <div className="jnb-glass rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#C1121F]/15 border border-[#C1121F]/30 flex items-center justify-center shrink-0">
                                <Car size={18} className="text-[#ff2d42]" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Tu garaje</p>
                                <p className="text-sm font-bold text-white">{formatVehicle(vehicle)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/compatibilidad"
                                className="text-xs font-bold text-[#ff2d42] uppercase tracking-wide flex items-center gap-1.5 hover:opacity-75 transition-opacity"
                            >
                                Ver piezas compatibles <ArrowRight size={14} />
                            </Link>
                            <button onClick={() => setOpen(true)} className="text-xs text-gray-500 hover:text-white transition-colors underline underline-offset-2">
                                Cambiar
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setOpen(true)}
                        className="w-full jnb-glass rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-left hover:border-[#ff2d42]/40 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#C1121F]/15 border border-[#C1121F]/30 flex items-center justify-center shrink-0">
                                <Sparkles size={18} className="text-[#ff2d42]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">¿Cuál es tu vehículo?</p>
                                <p className="text-xs text-gray-500">Guárdalo y te mostramos solo las piezas compatibles con tu carro.</p>
                            </div>
                        </div>
                        <span className="shrink-0 bg-white/10 group-hover:bg-[#C1121F] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5">
                            <Car size={14} /> Seleccionar
                        </span>
                    </button>
                )}
            </section>
            <VehicleSelectorModal open={open} onClose={() => setOpen(false)} />
        </Reveal>
    );
}
