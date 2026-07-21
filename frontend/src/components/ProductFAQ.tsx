'use client';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Reveal from './motion/Reveal';

interface FAQItem {
    q: string;
    a: string;
}

/** Generic-but-true FAQ content — shipping, warranty, install and payment facts that hold for the whole catalog. */
function buildFaqs(productName: string): FAQItem[] {
    return [
        {
            q: '¿Cuánto tarda el envío?',
            a: 'Hacemos envíos a toda Colombia. Los tiempos varían según la ciudad de destino; te confirmamos el tiempo exacto por WhatsApp apenas coordinamos tu pedido.',
        },
        {
            q: `¿"${productName}" tiene garantía?`,
            a: 'Sí, todos nuestros productos incluyen garantía. Si algo falla por defecto de fábrica, te acompañamos en el proceso de cambio o reparación.',
        },
        {
            q: '¿Necesito instalación profesional?',
            a: 'Recomendamos instalación profesional para garantizar el resultado. Contamos con red de técnicos aliados y podemos orientarte sobre el proceso al coordinar tu compra.',
        },
        {
            q: '¿Cómo pago?',
            a: 'Puedes elegir pago contra entrega o coordinar la transferencia directamente con un asesor por WhatsApp — sin pasos complicados ni datos de tarjeta en el sitio.',
        },
        {
            q: '¿Puedo verificar que sea compatible con mi vehículo antes de comprar?',
            a: 'Sí. Guarda tu vehículo en "Mi Garaje" (arriba en el menú) y el sitio te muestra automáticamente si esta pieza es compatible, o puedes preguntarle directamente a un asesor por WhatsApp.',
        },
    ];
}

export default function ProductFAQ({ productName }: { productName: string }) {
    const faqs = buildFaqs(productName);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Reveal>
                <div className="flex items-center gap-2 mb-6">
                    <HelpCircle size={18} className="text-[#ff2d42]" />
                    <h2 className="text-xs uppercase font-extrabold text-white tracking-[.2em]">Preguntas frecuentes</h2>
                </div>
                <div className="jnb-glass rounded-2xl divide-y divide-white/5 overflow-hidden">
                    {faqs.map((f, i) => {
                        const open = openIndex === i;
                        return (
                            <div key={i}>
                                <button
                                    onClick={() => setOpenIndex(open ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 hover:bg-white/[0.03] transition-colors"
                                    aria-expanded={open}
                                >
                                    <span className="text-sm font-bold text-white">{f.q}</span>
                                    <ChevronDown size={16} className={`shrink-0 text-gray-500 transition-transform duration-300 ${open ? 'rotate-180 text-[#ff2d42]' : ''}`} />
                                </button>
                                <div
                                    className="grid transition-all duration-300 ease-out"
                                    style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                                >
                                    <div className="overflow-hidden">
                                        <p className="text-sm text-gray-400 leading-relaxed px-5 sm:px-6 pb-4">{f.a}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Reveal>
        </section>
    );
}
