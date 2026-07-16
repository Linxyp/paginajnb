import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import MobileBuyBar from "@/components/MobileBuyBar";
import TrustBadges from "@/components/TrustBadges";
import Reveal from "@/components/motion/Reveal";
import TiltStage from "@/components/motion/TiltStage";
import GlowOrbs from "@/components/motion/GlowOrbs";
import Link from "next/link";
import { MessageCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { getProductBySlug } from "@/lib/api";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const fmt = (n: number) => new Intl.NumberFormat('es-CO').format(n);

export default async function ProductPage({ params }: PageProps) {
    // RESOLVER LA PROMESA DE PARAMS (Requisito estricto de Next.js 15)
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) notFound();

    const wspMessage = `Hola JNB Importaciones, estoy interesado en este producto: ${product.name} (Ref: ${product.id})`;
    const wspLink = `https://wa.me/573000000000?text=${encodeURIComponent(wspMessage)}`;
    const lowStock = product.stock > 0 && product.stock <= 5;

    return (
        <div className="w-full bg-[#07070b] min-h-screen pb-24 lg:pb-0">
            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden jnb-grid-bg border-b border-white/5">
                <div className="absolute inset-0 jnb-radial-red" />
                <GlowOrbs />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-16">
                    <Link href="/catalogo" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white font-bold mb-8 transition-colors uppercase tracking-widest">
                        <ArrowLeft size={14} /> Volver al catálogo
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* Product stage */}
                        <div className="relative order-1">
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[70%] h-10 bg-[#C1121F]/30 blur-2xl rounded-full" />
                            <TiltStage className="w-full aspect-square max-w-[440px] mx-auto">
                                <div className="relative w-full h-full jnb-glass rounded-3xl p-10 [transform:translateZ(40px)]">
                                    {product.images[0] && (
                                        <Image
                                            src={`/productos/${product.images[0]}`}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-6 drop-shadow-[0_25px_40px_rgba(0,0,0,0.6)]"
                                            priority
                                        />
                                    )}
                                </div>
                            </TiltStage>
                        </div>

                        {/* Info */}
                        <Reveal className="order-2" y={16}>
                            <span className="inline-block text-[10px] font-extrabold text-[#ff2d42] bg-[#C1121F]/10 border border-[#C1121F]/30 px-3 py-1.5 rounded-full uppercase tracking-[.2em]">
                                {product.category}
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight leading-[1.05]">
                                {product.name}
                            </h1>
                            <p className="text-xs text-gray-500 mt-2 tracking-wide">
                                Ref. {product.id} · {product.brand}
                            </p>

                            <div className="flex items-baseline gap-3 mt-6">
                                <span className="text-4xl font-black text-white jnb-glow-text">${fmt(product.price)}</span>
                                <span className="text-xs text-gray-500 font-semibold">COP</span>
                            </div>

                            <div className="mt-2">
                                {product.stock <= 0 ? (
                                    <span className="text-xs font-bold text-gray-500">Agotado momentáneamente</span>
                                ) : lowStock ? (
                                    <span className="text-xs font-bold text-orange-400">⚡ Quedan solo {product.stock} unidades</span>
                                ) : (
                                    <span className="text-xs font-bold text-emerald-400">✓ Disponible para envío inmediato</span>
                                )}
                            </div>

                            <p className="text-gray-400 text-sm mt-5 leading-relaxed max-w-lg">
                                {product.description}
                            </p>

                            <div className="mt-7 hidden lg:block">
                                <AddToCartButton product={product} />
                            </div>

                            <Link
                                href={wspLink}
                                target="_blank"
                                className="hidden lg:flex mt-3 w-full items-center justify-center gap-2 border border-[#25D366]/40 text-[#25D366] font-bold py-3 rounded-lg transition-colors hover:bg-[#25D366]/10 text-sm"
                            >
                                <MessageCircle size={18} />
                                Asesoría directa por WhatsApp
                            </Link>

                            <TrustBadges className="mt-8" />
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── DETAILS ──────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Reveal className="lg:col-span-2 jnb-glass rounded-2xl p-6 sm:p-8" delay={0.05}>
                    <h2 className="text-xs uppercase font-extrabold text-white tracking-[.2em] mb-4">Descripción general</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
                </Reveal>

                <Reveal className="jnb-glass rounded-2xl p-6 sm:p-8" delay={0.1}>
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck size={18} className="text-[#ff2d42]" />
                        <h2 className="text-xs uppercase font-extrabold text-white tracking-[.2em]">Compatibilidad</h2>
                    </div>
                    <p className="text-sm text-gray-300 font-semibold leading-relaxed">{product.compatibility}</p>
                </Reveal>
            </section>

            {/* ── MOBILE STICKY BUY BAR ───────────────────────────── */}
            <MobileBuyBar product={product} />
        </div>
    );
}
