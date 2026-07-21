import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderByToken } from '@/lib/api';
import { CheckCircle2, MessageCircle, Home, Car } from 'lucide-react';
import GlowOrbs from '@/components/motion/GlowOrbs';
import PurchaseTracker from '@/components/PurchaseTracker';
import WhatsAppLink from '@/components/WhatsAppLink';

interface PageProps {
    params: Promise<{ token: string }>;
}

const fmt = (n: number) => new Intl.NumberFormat('es-CO').format(n);

const paymentLabels: Record<string, string> = {
    contraentrega: 'Pago contra entrega',
    whatsapp: 'Transferencia coordinada por WhatsApp',
};

export default async function OrderConfirmationPage({ params }: PageProps) {
    const { token } = await params;
    const order = await getOrderByToken(token);

    if (!order) notFound();

    const orderDate = new Date(order.createdAt + 'Z').toLocaleString('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    const wspMessage = [
        `Hola JNB Importaciones, quiero confirmar mi pedido:`,
        ``,
        `📦 Pedido: ${order.orderNumber}`,
        `👤 Nombre: ${order.customerName}`,
        `📱 Teléfono: ${order.customerPhone}`,
        `🚗 Vehículo: ${order.vehicle}`,
        ``,
        `🛒 Productos:`,
        ...order.items.map((i) => `• ${i.quantity}x ${i.productName} — $${fmt(i.subtotal)}`),
        ``,
        `📍 Dirección: ${order.address}, ${order.city}`,
        order.notes ? `📝 Observaciones: ${order.notes}` : null,
        `💰 Total: $${fmt(order.total)}`,
        `🕐 Fecha: ${orderDate}`,
    ].filter(Boolean).join('\n');
    const wspLink = `https://wa.me/573132602527?text=${encodeURIComponent(wspMessage)}`;

    return (
        <div className="w-full bg-[#07070b] min-h-screen">
            <PurchaseTracker orderId={order.orderNumber} value={order.total} />
            <div className="relative overflow-hidden jnb-grid-bg border-b border-white/5 py-16 px-4">
                <div className="absolute inset-0 jnb-radial-red opacity-60" />
                <GlowOrbs />
                <div className="relative text-center max-w-3xl mx-auto">
                    <CheckCircle2 size={56} className="mx-auto text-emerald-400 mb-4" />
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">¡Pedido recibido!</h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Tu número de pedido es <span className="font-black text-white jnb-glow-text">{order.orderNumber}</span>
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="jnb-glass rounded-xl p-6 mb-6">
                    <h2 className="font-black text-white mb-4">Detalle del pedido</h2>
                    <div className="flex flex-col gap-2 mb-4">
                        {order.items.map((item) => (
                            <div key={item.productId} className="flex justify-between text-sm text-gray-400">
                                <span>{item.quantity}× {item.productName}</span>
                                <span className="font-bold text-white">${fmt(item.subtotal)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-white/10 pt-4 flex flex-col gap-1">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Subtotal</span>
                            <span>${fmt(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Envío</span>
                            <span>{order.shippingCost === 0 ? 'Gratis' : `$${fmt(order.shippingCost)}`}</span>
                        </div>
                        <div className="flex justify-between font-black text-lg text-white mt-2">
                            <span>Total</span>
                            <span>${fmt(order.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="jnb-glass rounded-xl p-6 mb-6">
                    <h2 className="font-black text-white mb-3">Datos de entrega</h2>
                    <p className="text-sm text-gray-400">{order.customerName} · {order.customerPhone}</p>
                    <p className="text-sm text-gray-400">{order.address}, {order.city}</p>
                    {order.vehicle && (
                        <p className="text-sm text-gray-300 mt-2 flex items-center gap-1.5 font-semibold">
                            <Car size={14} className="text-[#ff2d42]" /> {order.vehicle}
                        </p>
                    )}
                    <p className="text-sm text-gray-400 mt-2 font-semibold">Método: {paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
                    <p className="text-sm mt-2">
                        Estado: <span className="font-bold text-orange-400 uppercase">{order.status}</span>
                    </p>
                </div>

                <div className="jnb-glass rounded-xl p-6 mb-6 border-[#25D366]/30">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageCircle size={18} className="text-[#25D366]" />
                        <h2 className="font-black text-white">Último paso: confirma por WhatsApp</h2>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Tu pedido ya quedó registrado. Toca el botón para enviarnos los datos por WhatsApp —
                        un asesor te contactará personalmente para confirmar disponibilidad, coordinar el pago y el envío.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <WhatsAppLink
                        href={wspLink}
                        className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 px-6 rounded-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(37,211,102,0.35)]"
                    >
                        <MessageCircle size={20} />
                        Confirmar por WhatsApp
                    </WhatsAppLink>
                    <Link
                        href="/"
                        className="flex-1 border border-white/15 hover:border-white/40 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Volver al inicio
                    </Link>
                </div>

                <p className="text-xs text-gray-600 text-center mt-8">
                    Guarda esta página o el enlace de tu navegador: es tu comprobante de pedido.
                </p>
            </div>
        </div>
    );
}
