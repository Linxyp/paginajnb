'use client';
import { useState } from 'react';
import { Car, ChevronDown } from 'lucide-react';
import { useGarageStore, formatVehicle } from '@/store/useGarageStore';
import { useGarageHydrated } from '@/store/useGarageHydrated';
import VehicleSelectorModal from './VehicleSelectorModal';

/** Persistent, non-blocking "shop by vehicle" indicator — never gates browsing, just always available. */
export default function GarageBadge({ className = '' }: { className?: string }) {
    const [open, setOpen] = useState(false);
    const vehicle = useGarageStore((s) => s.vehicle);
    const hydrated = useGarageHydrated();

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={`flex items-center gap-1.5 text-[11px] font-bold tracking-wide transition-colors ${className}`}
            >
                <Car size={14} className={vehicle ? 'text-[#ff2d42]' : 'text-gray-400'} />
                {!hydrated ? (
                    <span className="opacity-0">.</span>
                ) : vehicle ? (
                    <span className="text-white">{formatVehicle(vehicle)}</span>
                ) : (
                    <span className="text-gray-400">Mi vehículo</span>
                )}
                <ChevronDown size={12} className="text-gray-500" />
            </button>
            <VehicleSelectorModal open={open} onClose={() => setOpen(false)} />
        </>
    );
}
