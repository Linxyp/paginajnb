import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AddToCartButton from "@/components/AddToCartButton";
import MobileBuyBar from "@/components/MobileBuyBar";
import TrustBadges from "@/components/TrustBadges";
import Reveal from "@/components/motion/Reveal";
import TiltStage from "@/components/motion/TiltStage";
import SpecChip from "@/components/motion/SpecChip";
import ScrollStory from "@/components/motion/ScrollStory";
import CompatibilityBanner from "@/components/CompatibilityBanner";
import Link from "next/link";
import { MessageCircle, ArrowLeft, ShieldCheck, Tag, Award } from "lucide-react";
import { getProductBySlug } from "@/lib/api";
import { productStories } from "@/lib/productStories";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const fmt = (n: number) => new Intl.NumberFormat('es-CO').format(n);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jnbimportaciones.com';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: 'Producto no encontrado | JNB Importaciones' };

    const title = `${product.name} | JNB Importaciones`;
    const description = product.description.slice(0, 155);
    const imageUrl = product.images[0] ? `${SITE_URL}/productos/${product.images[0]}` : undefined;

    return {
        title,
        description,
        alternates: { canonical: `${SITE_URL}/producto/${product.slug}` },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/producto/${product.slug}`,
            type: 'website',
            images: imageUrl ? [{ url: imageUrl, width: 1024, height: 1024, alt: product.name }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : undefined,
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    // RESOLVER LA PROMESA DE PARAMS (Requisito estricto de Next.js 15)
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) notFound();

    const wspMessage = `Hola JNB Importaciones, estoy interesado en este producto: ${product.name} (Ref: ${product.id})`;
    const wspLink = `https://wa.me/573132602527?text=${encodeURIComponent(wspMessage)}`;
    const lowStock = product.stock > 0 && product.stock <= 5;
    const story = productStories[product.slug];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        sku: product.id,
        brand: { '@type': 'Brand', name: product.brand },
        category: product.category,
        image: product.images[0] ? [`${SITE_URL}/productos/${product.images[0]}`] : undefined,
        offers: {
            '@type': 'Offer',
            url: `${SITE_URL}/producto/${product.slug}`,
            priceCurrency: 'COP',
            price: product.price,
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
    };

    return (
        <div className="w-full bg-[#07070b] min-h-screen pb-24 lg:pb-0">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {/* ── HERO ─────────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden border-b border-white/5 jnb-photo-hero"
                style={{ backgroundImage: "url(/fondos/carbon-fiber.jpg)" }}
            >
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

                            {/* Floating spec chips */}
                            <div className="hidden sm:block absolute -left-6 top-6 z-10">
                                <SpecChip icon={<Tag size={14} />} label="Categoría" value={product.category} delay={0.2} />
                            </div>
                            <div className="hidden sm:block absolute -right-4 top-1/3 z-10">
                                <SpecChip icon={<Award size={14} />} label="Línea" value={product.brand} delay={0.6} />
                            </div>
                            <div className="hidden sm:block absolute left-2 bottom-2 z-10">
                                <SpecChip icon={<ShieldCheck size={14} />} label="Garantía" value="Incluida" delay={1} />
                            </div>
                        </div>

                        {/* Info */}
                        <Reveal className="order-2" y={16}>
                            <span className="inline-block text-[10px] font-extrabold text-[#ff2d42] bg-[#C1121F]/10 border border-[#C1121F]/30 px-3 py-1.5 rounded-full uppercase tracking-[.2em]">
                                {product.category}
                            </span>
                            <p className="jnb-accent text-2xl text-gray-300 mt-4">Instalado hoy, sentido cada kilómetro.</p>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2 tracking-tight leading-[1.05]">
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

                            <CompatibilityBanner product={product} />

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

            {/* ── SCROLL STORY ─────────────────────────────────────── */}
            {story && product.images[0] && (
                <ScrollStory image={product.images[0]} alt={product.name} callouts={story} />
            )}

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
