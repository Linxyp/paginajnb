'use client';
import { useState } from 'react';
import { Car, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useGarageStore, formatVehicle } from '@/store/useGarageStore';
import { useGarageHydrated } from '@/store/useGarageHydrated';
import { isCompatible } from '@/lib/compatibility';
import VehicleSelectorModal from './VehicleSelectorModal';
import type { Product } from '@/lib/api';

export default function CompatibilityBanner({ product }: { product: Product }) {
    const [modalOpen, setModalOpen] = useState(false);
    const vehicle = useGarageStore((s) => s.vehicle);
    const hydrated = useGarageHydrated();

    if (!hydrated) return <div className="h-[54px] mt-4" />;

    if (!vehicle) {
        return (
            <>
                <button
                    onClick={() => setModalOpen(true)}
                    className="w-full mt-4 flex items-center gap-3 jnb-glass rounded-lg px-4 py-3 text-left hover:border-[#ff2d42]/40 transition-colors"
                >
                    <Car size={18} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-400">
                        <span className="text-white font-bold">¿Cuál es tu vehículo?</span> Guárdalo y verifica si esta pieza es compatible.
                    </span>
                </button>
                <VehicleSelectorModal open={modalOpen} onClose={() => setModalOpen(false)} />
            </>
        );
    }

    const compatible = isCompatible(product, vehicle);

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className={`w-full mt-4 flex items-center gap-3 rounded-lg px-4 py-3 text-left border transition-colors ${
                    compatible ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50' : 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50'
                }`}
            >
                {compatible ? (
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                ) : (
                    <AlertTriangle size={18} className="text-orange-400 shrink-0" />
                )}
                <span className="text-xs">
                    {compatible ? (
                        <span className="text-emerald-300 font-bold">Compatible con tu {formatVehicle(vehicle)}</span>
                    ) : (
                        <span className="text-orange-300 font-bold">Puede no ser compatible con tu {formatVehicle(vehicle)} — toca para cambiar tu vehículo</span>
                    )}
                </span>
            </button>
            <VehicleSelectorModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}
