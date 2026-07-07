'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useCartHydrated } from '@/store/useCartHydrated';
import { useToastStore } from '@/store/useToastStore';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const fmt = (n: number) => new Intl.NumberFormat('es-CO').format(n);

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
    const showToast = useToastStore((state) => state.show);
    const hydrated = useCartHydrated();

    const handleRemove = (id: string, name: string) => {
        removeItem(id);
        showToast(`"${name}" se eliminó del carrito.`, 'info');
    };

    if (!hydrated) return null;

    if (items.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-24 text-center">
                <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
                <h1 className="text-2xl font-black text-[#2B2D42]">Tu carrito está vacío</h1>
                <p className="text-gray-500 text-sm mt-2">Explora nuestro catálogo y encuentra la tecnología perfecta para tu vehículo.</p>
                <Link
                    href="/catalogo"
                    className="inline-block mt-8 bg-[#C1121F] hover:bg-[#E63946] text-white font-bold px-8 py-3.5 rounded-lg transition-colors text-sm tracking-wide uppercase"
                >
                    Ir al catálogo
                </Link>
            </div>
        );
    }

    const total = getTotal();

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C1121F] font-bold mb-6 transition-colors">
                <ArrowLeft size={16} /> Seguir comprando
            </Link>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black text-[#2B2D42] tracking-tight">Tu Carrito</h1>
                <button
                    onClick={() => { clearCart(); showToast('Carrito vaciado.', 'info'); }}
                    className="text-xs font-bold text-gray-400 hover:text-[#C1121F] transition-colors uppercase tracking-wide"
                >
                    Vaciar carrito
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center gap-4">
                            <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border">
                                {item.image ? (
                                    <Image src={`/productos/${item.image}`} alt={item.name} fill className="object-contain p-1" />
                                ) : null}
                            </div>
                            <div className="flex-1 min-w-[160px]">
                                <Link href={`/producto/${item.slug}`} className="font-bold text-sm text-[#2B2D42] hover:text-[#C1121F] transition-colors line-clamp-2">
                                    {item.name}
                                </Link>
                                <p className="text-sm text-gray-500 mt-1">${fmt(item.price)} c/u</p>
                                {item.quantity >= item.maxStock && (
                                    <p className="text-[11px] text-orange-500 font-semibold mt-1">Máximo disponible: {item.maxStock}</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-4 w-full sm:w-auto">
                                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden shrink-0">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-2.5 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                                        aria-label="Disminuir cantidad"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-8 text-center font-bold text-sm text-[#2B2D42]">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={item.quantity >= item.maxStock}
                                        className="px-2.5 py-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Aumentar cantidad"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <span className="font-black text-sm text-[#2B2D42] sm:w-24 text-right shrink-0">
                                    ${fmt(item.price * item.quantity)}
                                </span>
                                <button
                                    onClick={() => handleRemove(item.id, item.name)}
                                    className="text-gray-300 hover:text-[#C1121F] transition-colors shrink-0"
                                    aria-label="Eliminar producto"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
                        <h2 className="font-black text-lg text-[#2B2D42] mb-4">Resumen del pedido</h2>
                        <div className="flex justify-between text-sm text-gray-600 py-2 border-b">
                            <span>Subtotal</span>
                            <span className="font-bold text-[#2B2D42]">${fmt(total)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 py-2 border-b">
                            <span>Envío</span>
                            <span className="font-semibold">
                                {total >= 500000 ? <span className="text-green-600 font-bold">Gratis</span> : 'Se calcula en el pago'}
                            </span>
                        </div>
                        <div className="flex justify-between items-baseline py-4">
                            <span className="font-bold text-[#2B2D42]">Total estimado</span>
                            <span className="font-black text-2xl text-[#2B2D42]">${fmt(total)}</span>
                        </div>
                        <Link
                            href="/checkout"
                            className="block text-center bg-[#C1121F] hover:bg-[#E63946] text-white font-bold py-4 rounded-lg transition-colors text-sm tracking-wide uppercase"
                        >
                            Proceder al pago
                        </Link>
                        <p className="text-[11px] text-gray-400 mt-3 text-center">Envío gratis en compras superiores a $500.000 COP</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
