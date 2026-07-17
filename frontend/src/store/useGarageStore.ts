import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GarageVehicle {
    brand: string;
    model: string;
    year: string;
}

interface GarageStore {
    vehicle: GarageVehicle | null;
    setVehicle: (vehicle: GarageVehicle) => void;
    clearVehicle: () => void;
}

export const useGarageStore = create<GarageStore>()(
    persist(
        (set) => ({
            vehicle: null,
            setVehicle: (vehicle) => set({ vehicle }),
            clearVehicle: () => set({ vehicle: null }),
        }),
        { name: 'jnb-garage-vehicle' }
    )
);

/** Formats a garage vehicle as "Toyota Fortuner 2018" (skips empty parts). */
export const formatVehicle = (v: GarageVehicle): string =>
    [v.brand, v.model, v.year].filter(Boolean).join(' ');
