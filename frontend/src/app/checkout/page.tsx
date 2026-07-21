'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useCartHydrated } from '@/store/useCartHydrated';
import { useToastStore } from '@/store/useToastStore';
import { createOrder, ApiError } from '@/lib/api';
import { useGarageStore, formatVehicle } from '@/store/useGarageStore';
import { trackEvent } from '@/lib/analytics';
import { ArrowLeft, Truck, MessageCircle, Lock, Car } from 'lucide-react';

const fmt = (n: number) => new Intl.NumberFormat('es-CO').format(n);

interface FormState {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address: string;
    city: string;
    vehicle: string;
    notes: string;
    paymentMethod: 'contraentrega' | 'whatsapp';
}

const initialForm: FormState = {
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    city: '',
    vehicle: '',
    notes: '',
    paymentMethod: 'contraentrega',
};

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (form.customerName.trim().length < 3) errors.customerName = 'Ingresa tu nombre completo.';
    if (!/^[0-9+()\s-]{7,20}$/.test(form.customerPhone.trim())) errors.customerPhone = 'Ingresa un teléfono válido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) errors.customerEmail = 'Ingresa un email válido.';
    if (form.address.trim().length < 5) errors.address = 'Ingresa una dirección completa.';
    if (form.city.trim().length < 2) errors.city = 'Ingresa tu ciudad.';
    if (form.vehicle.trim().length < 3) errors.vehicle = 'Indica marca, modelo y año de tu vehículo.';
    return errors;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const showToast = useToastStore((state) => state.show);

    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const hydrated = useCartHydrated();
    const garageVehicle = useGarageStore((s) => s.vehicle);
    const trackedCheckoutStart = useRef(false);

    useEffect(() => {
        if (hydrated && !orderPlaced && items.length === 0) router.replace('/carrito');
    }, [hydrated, orderPlaced, items.length, router]);

    useEffect(() => {
        if (hydrated && items.length > 0 && !trackedCheckoutStart.current) {
            trackedCheckoutStart.current = true;
            trackEvent({ name: 'begin_checkout', value: getTotal(), itemCount: items.reduce((n, i) => n + i.quantity, 0) });
        }
    }, [hydrated, items, getTotal]);

    // Prefill from "Mi Garaje" if the customer already saved a vehicle, without overwriting anything they've typed.
    useEffect(() => {
        if (garageVehicle) {
            setForm((f) => (f.vehicle ? f : { ...f, vehicle: formatVehicle(garageVehicle) }));
        }
    }, [garageVehicle]);

    if (!hydrated || (items.length === 0 && !orderPlaced)) return null;

    const subtotal = getTotal();
    const shippingCost = subtotal >= 500000 ? 0 : 15000;
    const total = subtotal + shippingCost;

    const handleChange = (field: keyof FormState, value: string) => {
        setForm((f) => ({ ...f, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(form);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            showToast('Revisa los campos marcados en rojo.', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const result = await createOrder({
                ...form,
                items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
            });
            setOrderPlaced(true);
            clearCart();
            router.push(`/pedido/${result.accessToken}`);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'No se pudo procesar el pedido. Intenta nuevamente.';
            showToast(message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = (field: keyof FormState) =>
        `w-full bg-white/5 border-2 rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 ${
            errors[field] ? 'border-[#C1121F]' : 'border-white/10 focus:border-[#ff2d42]'
        }`;

    return (
        <div className="w-full bg-[#07070b] min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <Link href="/carrito" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#ff2d42] font-bold mb-6 transition-colors">
                    <ArrowLeft size={16} /> Volver al carrito
                </Link>

                <h1 className="text-3xl font-black text-white tracking-tight mb-8">Finalizar Compra</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="jnb-glass rounded-xl p-6">
                            <h2 className="font-black text-white mb-4">Datos de contacto y envío</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nombre completo</label>
                                    <input
                                        value={form.customerName}
                                        onChange={(e) => handleChange('customerName', e.target.value)}
                                        className={inputClass('customerName')}
                                        placeholder="Juan Pérez"
                                    />
                                    {errors.customerName && <p className="text-xs text-[#ff2d42] mt-1">{errors.customerName}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Teléfono</label>
                                    <input
                                        value={form.customerPhone}
                                        onChange={(e) => handleChange('customerPhone', e.target.value)}
                                        className={inputClass('customerPhone')}
                                        placeholder="+57 300 000 0000"
                                    />
                                    {errors.customerPhone && <p className="text-xs text-[#ff2d42] mt-1">{errors.customerPhone}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email</label>
                                    <input
                                        type="email"
                                        value={form.customerEmail}
                                        onChange={(e) => handleChange('customerEmail', e.target.value)}
                                        className={inputClass('customerEmail')}
                                        placeholder="juan@correo.com"
                                    />
                                    {errors.customerEmail && <p className="text-xs text-[#ff2d42] mt-1">{errors.customerEmail}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Dirección de entrega</label>
                                    <input
                                        value={form.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        className={inputClass('address')}
                                        placeholder="Calle 123 #45-67, Apto 101"
                                    />
                                    {errors.address && <p className="text-xs text-[#ff2d42] mt-1">{errors.address}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ciudad</label>
                                    <input
                                        value={form.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                        className={inputClass('city')}
                                        placeholder="Bogotá"
                                    />
                                    {errors.city && <p className="text-xs text-[#ff2d42] mt-1">{errors.city}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                        <Car size={13} className="text-[#ff2d42]" /> Vehículo (marca, modelo y año)
                                    </label>
                                    <input
                                        value={form.vehicle}
                                        onChange={(e) => handleChange('vehicle', e.target.value)}
                                        className={inputClass('vehicle')}
                                        placeholder="Toyota Fortuner 2018"
                                    />
                                    {errors.vehicle && <p className="text-xs text-[#ff2d42] mt-1">{errors.vehicle}</p>}
                                    <p className="text-[11px] text-gray-600 mt-1">Nos ayuda a confirmar que la pieza es 100% compatible antes de despachar.</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Notas adicionales (opcional)</label>
                                    <textarea
                                        value={form.notes}
                                        onChange={(e) => handleChange('notes', e.target.value)}
                                        className={inputClass('notes')}
                                        rows={2}
                                        placeholder="Referencia de la dirección, horario preferido, etc."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="jnb-glass rounded-xl p-6">
                            <h2 className="font-black text-white mb-4">Método de pago</h2>
                            <div className="flex flex-col gap-3">
                                <label className={`flex items-center gap-3 border-2 rounded-lg p-4 cursor-pointer transition-colors ${form.paymentMethod === 'contraentrega' ? 'border-[#C1121F] bg-[#C1121F]/10' : 'border-white/10'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={form.paymentMethod === 'contraentrega'}
                                        onChange={() => handleChange('paymentMethod', 'contraentrega')}
                                    />
                                    <Truck size={20} className="text-white" />
                                    <div>
                                        <p className="font-bold text-sm text-white">Pago contra entrega</p>
                                        <p className="text-xs text-gray-500">Paga en efectivo o datáfono cuando recibas tu pedido.</p>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-3 border-2 rounded-lg p-4 cursor-pointer transition-colors ${form.paymentMethod === 'whatsapp' ? 'border-[#C1121F] bg-[#C1121F]/10' : 'border-white/10'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={form.paymentMethod === 'whatsapp'}
                                        onChange={() => handleChange('paymentMethod', 'whatsapp')}
                                    />
                                    <MessageCircle size={20} className="text-[#25D366]" />
                                    <div>
                                        <p className="font-bold text-sm text-white">Coordinar transferencia por WhatsApp</p>
                                        <p className="text-xs text-gray-500">Un asesor te contactará para coordinar el pago y el envío.</p>
                                    </div>
                                </label>
                                <div className="flex items-center gap-3 border-2 border-dashed border-white/10 rounded-lg p-4 opacity-50">
                                    <Lock size={20} className="text-gray-500" />
                                    <div>
                                        <p className="font-bold text-sm text-gray-400">Pago en línea con tarjeta / PSE</p>
                                        <p className="text-xs text-gray-600">Próximamente disponible.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="jnb-glass rounded-xl p-6 sticky top-24">
                            <h2 className="font-black text-lg text-white mb-4">Resumen del pedido</h2>
                            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mb-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-xs text-gray-400">
                                        <span className="line-clamp-1 flex-1">{item.quantity}× {item.name}</span>
                                        <span className="font-bold text-white shrink-0 ml-2">${fmt(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-sm text-gray-400 py-2 border-t border-white/10">
                                <span>Subtotal</span>
                                <span className="font-bold text-white">${fmt(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400 py-2 border-b border-white/10">
                                <span>Envío</span>
                                <span className="font-semibold">{shippingCost === 0 ? <span className="text-emerald-400 font-bold">Gratis</span> : `$${fmt(shippingCost)}`}</span>
                            </div>
                            <div className="flex justify-between items-baseline py-4">
                                <span className="font-bold text-white">Total</span>
                                <span className="font-black text-2xl text-white jnb-glow-text">${fmt(total)}</span>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-[#C1121F] to-[#ff2d42] disabled:opacity-60 text-white font-bold py-4 rounded-lg transition-transform hover:scale-[1.02] text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,45,66,0.35)]"
                            >
                                <Lock size={16} />
                                {submitting ? 'Procesando...' : 'Confirmar pedido'}
                            </button>
                            <p className="text-[11px] text-gray-500 mt-3 text-center">Tus datos se transmiten de forma cifrada (HTTPS) y solo se usan para procesar tu pedido.</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
