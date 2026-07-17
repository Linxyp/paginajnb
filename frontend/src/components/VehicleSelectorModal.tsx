'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Check } from 'lucide-react';
import { useGarageStore } from '@/store/useGarageStore';
import { VEHICLE_BRANDS } from '@/lib/compatibility';

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function VehicleSelectorModal({ open, onClose }: Props) {
    const vehicle = useGarageStore((s) => s.vehicle);
    const setVehicle = useGarageStore((s) => s.setVehicle);
    const clearVehicle = useGarageStore((s) => s.clearVehicle);

    const [brand, setBrand] = useState(vehicle?.brand || '');
    const [model, setModel] = useState(vehicle?.model || '');
    const [year, setYear] = useState(vehicle?.year || '');

    useEffect(() => {
        if (open) {
            setBrand(vehicle?.brand || '');
            setModel(vehicle?.model || '');
            setYear(vehicle?.year || '');
        }
    }, [open, vehicle]);

    const canSave = brand.trim().length > 0 && model.trim().length > 0;

    const handleSave = () => {
        if (!canSave) return;
        setVehicle({ brand: brand.trim(), model: model.trim(), year: year.trim() });
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div
                        className="relative w-full max-w-md jnb-glass rounded-2xl p-6 sm:p-8"
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors" aria-label="Cerrar">
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-9 h-9 rounded-full bg-[#C1121F]/15 border border-[#C1121F]/30 flex items-center justify-center">
                                <Car size={16} className="text-[#ff2d42]" />
                            </div>
                            <h2 className="font-black text-white text-lg">Mi Garaje</h2>
                        </div>
                        <p className="text-xs text-gray-500 mb-6">Guarda tu vehículo y te mostramos qué piezas son compatibles.</p>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Marca</label>
                                <select
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full bg-white/5 border-2 border-white/10 focus:border-[#ff2d42] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors mt-1"
                                >
                                    <option value="" disabled className="bg-[#0e0e15]">Selecciona una marca</option>
                                    {VEHICLE_BRANDS.map((b) => (
                                        <option key={b} value={b} className="bg-[#0e0e15]">{b}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Modelo</label>
                                    <input
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        placeholder="Fortuner"
                                        className="w-full bg-white/5 border-2 border-white/10 focus:border-[#ff2d42] rounded-lg px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 transition-colors mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Año</label>
                                    <input
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        placeholder="2018"
                                        inputMode="numeric"
                                        className="w-full bg-white/5 border-2 border-white/10 focus:border-[#ff2d42] rounded-lg px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 transition-colors mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!canSave}
                            className="w-full mt-6 bg-gradient-to-r from-[#C1121F] to-[#ff2d42] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-transform hover:scale-[1.02] text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,45,66,0.3)]"
                        >
                            <Check size={16} />
                            Guardar mi vehículo
                        </button>

                        {vehicle && (
                            <button
                                onClick={() => { clearVehicle(); onClose(); }}
                                className="w-full mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                Quitar vehículo guardado
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
