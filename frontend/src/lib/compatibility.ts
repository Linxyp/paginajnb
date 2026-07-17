import type { Product } from './api';
import type { GarageVehicle } from '@/store/useGarageStore';

export const VEHICLE_BRANDS = [
    'Toyota', 'Lexus', 'Mazda', 'Ford', 'Chevrolet', 'Nissan',
    'Renault', 'Kia', 'Hyundai', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Otra marca',
];

/** Whether a product fits the vehicle saved in the user's garage. "Universal" products always match. */
export function isCompatible(product: Product, vehicle: GarageVehicle | null): boolean {
    if (product.vehicleBrand === 'Universal') return true;
    if (!vehicle) return false;
    if (product.vehicleBrand.toLowerCase() !== vehicle.brand.toLowerCase()) return false;
    if (!vehicle.model.trim()) return true;
    if (!product.vehicleModel) return true;
    const a = product.vehicleModel.toLowerCase();
    const b = vehicle.model.trim().toLowerCase();
    return a.includes(b) || b.includes(a);
}
