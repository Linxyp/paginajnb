import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderByToken } from '@/lib/api';
import { CheckCircle2, MessageCircle, Home } from 'lucide-react';
import GlowOrbs from '@/components/motion/GlowOrbs';

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

    const wspMessage = `Hola JNB Importaciones, quiero confirmar mi pedido ${order.orderNumber} por un total de $${fmt(order.total)}.`;
    const wspLink = `https://wa.me/573000000000?text=${encodeURIComponent(wspMessage)}`;

    return (
        <div className="w-full bg-[#07070b] min-h-screen">
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
                    <p className="text-sm text-gray-400 mt-2 font-semibold">Método: {paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
                    <p className="text-sm mt-2">
                        Estado: <span className="font-bold text-orange-400 uppercase">{order.status}</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href={wspLink}
                        target="_blank"
                        className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                        <MessageCircle size={20} />
                        Confirmar por WhatsApp
                    </Link>
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
