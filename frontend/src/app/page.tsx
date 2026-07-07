'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, PackageSearch } from 'lucide-react';
import { getAllProducts, Product } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';

// ─── DATA ────────────────────────────────────────────────────────────────────

const heroSlides = [
  {
    tag: '🔥 Oferta de la Semana',
    title: 'Radio Android\n9" Mazda 3',
    sub: 'Pantalla táctil Full HD · GPS · Bluetooth 5.0 · WiFi integrado. Instalación profesional incluida.',
    price: 1250000,
    oldPrice: 1500000,
    discount: 15,
    accent: 'from-[#0b0c10] to-[#1a0408]',
    watermark: 'RADIO',
  },
  {
    tag: '⚡ Nuevo Ingreso',
    title: 'Bombillos\nLED K1 PRO',
    sub: 'Tecnología JNB-IHK de última generación. 3× más luminosidad que el halógeno. Plug & play.',
    price: 180000,
    oldPrice: 220000,
    discount: 18,
    accent: 'from-[#0b0c10] to-[#080d1a]',
    watermark: 'LED',
  },
  {
    tag: '🔊 Car Audio Premium',
    title: 'Subwoofer\nCaja Turbo',
    sub: 'Graves profundos y precisos. Diseño compacto de alto rendimiento para todo tipo de vehículo.',
    price: 450000,
    oldPrice: 520000,
    discount: 13,
    accent: 'from-[#0b0c10] to-[#0d1a0e]',
    watermark: 'BASS',
  },
  {
    tag: '🎯 Personalización Interior',
    title: 'Tapetes\na tu Medida',
    sub: 'Termoformados con tecnología de precisión. Ajuste perfecto, materiales premium resistentes al agua.',
    price: 249000,
    oldPrice: 300000,
    discount: 17,
    accent: 'from-[#0b0c10] to-[#1a1008]',
    watermark: 'MAT',
  },
];

const tickerItems = [
  '🔥 Hasta 20% OFF en Radios Android',
  '⚡ Instalación Profesional Incluida',
  '🚚 Envío Nacional a Todo Colombia',
  '🔊 Car Audio Premium — Stock Limitado',
  '💡 LED K1 PRO — El Más Vendido',
  '🎯 Tapetes Termoformados a Medida',
];

const brands = ['Pioneer', 'JVC', 'Sony', 'Kenwood', 'Alpine', 'Focal', 'Hertz', 'Rockford', 'JBL', 'Clarion'];

const categories = ['Todos', 'Radios Android', 'Car Audio', 'Iluminación LED', 'Interior', 'Cámaras', 'Alarmas', 'Accesorios'];

const stats = [
  { target: 1200, suffix: '+', label: 'Instalaciones Realizadas' },
  { target: 350,  suffix: '+', label: 'Productos en Catálogo' },
  { target: 8,    suffix: '',  label: 'Años de Experiencia' },
  { target: 4.9,  suffix: '★', label: 'Calificación Promedio', isFloat: true },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat('es-CO').format(n);

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

/** Infinite ticker tape */
function Ticker() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div className="bg-[#C1121F] overflow-hidden h-10 flex items-center">
      <div className="flex animate-[ticker_28s_linear_infinite] whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-[11px] font-bold text-white tracking-[.18em] uppercase px-12 border-r border-white/25 shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Auto-rotating hero carousel */
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setCurrent((i + heroSlides.length) % heroSlides.length);
  }, []);

  const startAuto = useCallback(() => {
    timerRef.current = setInterval(() => goTo(current + 1), 5000);
  }, [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % heroSlides.length), 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const pauseAuto = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const resumeAuto = () => startAuto();

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full min-h-[480px] py-14 md:py-0 md:h-[580px] overflow-hidden"
      onMouseEnter={pauseAuto}
      onMouseLeave={resumeAuto}
    >
      {/* Slide background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} transition-all duration-700`} />

      {/* Watermark */}
      <div className="absolute right-0 top-0 h-full flex items-center justify-center w-1/2 pointer-events-none select-none">
        <span className="text-[200px] font-black text-white/[0.04] leading-none tracking-tighter uppercase">
          {slide.watermark}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-6 sm:px-10 md:px-20 max-w-[1400px] mx-auto">
        <div className="max-w-[560px]">
          {/* Tag */}
          <span className="inline-block bg-[#C1121F] text-white text-[10px] font-extrabold tracking-[.2em] uppercase px-3.5 py-1.5 mb-5">
            {slide.tag}
          </span>

          {/* Title */}
          <h1 className="text-[clamp(40px,6vw,72px)] font-black text-white leading-[.93] uppercase tracking-tighter whitespace-pre-line">
            {slide.title}
          </h1>

          {/* Sub */}
          <p className="text-[#aaa] text-sm mt-4 leading-relaxed max-w-[400px]">
            {slide.sub}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-black text-white">${fmt(slide.price)}</span>
            <span className="text-base text-[#666] line-through">${fmt(slide.oldPrice)}</span>
            <span className="bg-[#C1121F] text-white text-[11px] font-extrabold px-2.5 py-1">
              -{slide.discount}%
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-7">
            <Link
              href="/catalogo"
              className="bg-[#C1121F] text-white text-[11px] font-bold tracking-[.18em] uppercase px-7 py-3.5 transition-colors hover:bg-[#a00e18]"
            >
              Ver Producto
            </Link>
            <Link
              href="/catalogo"
              className="border border-[#444] text-white text-[11px] font-bold tracking-[.18em] uppercase px-7 py-3.5 transition-all hover:border-white"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* Arrow controls (desktop only — on mobile the stacked content runs the full height, so side arrows would overlap the text) */}
      <button
        onClick={() => goTo(current - 1)}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-[#333] text-white items-center justify-center hover:bg-[#C1121F] hover:border-[#C1121F] transition-all"
        aria-label="Anterior"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-[#333] text-white items-center justify-center hover:bg-[#C1121F] hover:border-[#C1121F] transition-all"
        aria-label="Siguiente"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-[3px] transition-all duration-300 ${i === current ? 'w-12 bg-[#C1121F]' : 'w-7 bg-[#444]'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/** Product card */
function ProductCard({ p }: { p: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.show);
  const lowStock = p.stock > 0 && p.stock <= 5;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      image: p.images[0] || '',
      maxStock: p.stock,
    }, 1);
    showToast(`"${p.name}" añadido al carrito.`, 'success');
  };

  return (
    <div className="relative bg-white border-[1.5px] border-[#f0f0f0] group transition-all duration-250 hover:border-[#C1121F] hover:-translate-y-1">
      {lowStock && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[9px] font-extrabold tracking-[.15em] uppercase px-2 py-1 bg-orange-500 text-white">
            Pocas unidades
          </span>
        </div>
      )}

      <Link href={`/producto/${p.slug}`} className="block">
        {/* Image area */}
        <div className="relative w-full h-52 bg-[#f8f9fa] border-b border-[#f0f0f0] transition-colors group-hover:bg-[#f0f0f0] overflow-hidden">
          {p.images[0] && (
            <Image src={`/productos/${p.images[0]}`} alt={p.name} fill className="object-contain p-6 transition-transform duration-500 group-hover:scale-105" />
          )}
        </div>

        {/* Body */}
        <div className="p-4 relative">
          <div className="text-[9px] font-bold tracking-[.18em] uppercase text-[#C1121F] mb-1.5">{p.category}</div>
          <h3 className="text-[13px] font-bold text-[#2B2D42] uppercase tracking-wide leading-snug group-hover:text-[#C1121F] transition-colors h-9 line-clamp-2">
            {p.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[20px] font-black text-[#2B2D42]">${fmt(p.price)}</span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 bg-[#2B2D42] text-white text-[10px] font-bold tracking-[.18em] uppercase py-2.5 transition-colors hover:bg-[#C1121F]"
        >
          <ShoppingBag size={14} />
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

/** Animated count-up stat */
function StatItem({ target, suffix, label, isFloat }: { target: number; suffix: string; label: string; isFloat?: boolean }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const interval = duration / steps;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(parseFloat((target * eased).toFixed(isFloat ? 1 : 0)));
            if (step >= steps) clearInterval(timer);
          }, interval);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, isFloat]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-black text-white tracking-tighter">
        {isFloat ? value.toFixed(1) : value.toLocaleString('es-CO')}
        <span className="text-[#C1121F]">{suffix}</span>
      </div>
      <div className="text-[10px] font-bold tracking-[.2em] uppercase text-[#777] mt-1">{label}</div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoadingProducts(false));
  }, []);

  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="w-full bg-[#f4f5f7] min-h-screen font-sans">

      {/* ── TOPBAR ─────────────────────────────────────────────── */}
      <div className="bg-[#1a1a1f] text-[#aaa] text-[12px] tracking-wide px-6 md:px-8 py-2 flex justify-between items-center">
        <span>
          🚗 Envío <span className="text-[#C1121F] font-bold">GRATIS</span> en compras superiores a $500.000 COP
        </span>
        <span className="hidden md:block">
          Asesoría: <span className="text-white font-bold">+57 310 000 0000</span>
        </span>
      </div>

      {/* ── TICKER ─────────────────────────────────────────────── */}
      <Ticker />

      {/* ── HERO CAROUSEL ──────────────────────────────────────── */}
      <HeroCarousel />

      {/* ── CATEGORY PILLS ─────────────────────────────────────── */}
      <div className="bg-white border-b border-[#eee] px-6 md:px-10 py-4 flex gap-2.5 overflow-x-auto scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 text-[11px] font-bold tracking-[.14em] uppercase px-4 py-2 border-[1.5px] transition-all ${
              activeCategory === cat
                ? 'border-[#C1121F] text-[#C1121F] bg-red-50'
                : 'border-[#e5e5e5] text-[#555] hover:border-[#C1121F] hover:text-[#C1121F]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── PROMO BANNERS ──────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Banner 1 */}
        <div className="relative h-44 bg-gradient-to-r from-[#0b0c10] to-[#1a0408] overflow-hidden flex items-center px-8 cursor-pointer group">
          <div className="relative z-10">
            <div className="text-[10px] font-extrabold text-[#C1121F] tracking-[.2em] uppercase mb-2">Oferta Especial</div>
            <div className="text-3xl font-black text-white uppercase leading-none tracking-tight">Radios<br/>Android</div>
            <div className="text-[13px] text-[#999] mt-2">Compatible con todas las marcas</div>
            <div className="text-[10px] font-extrabold text-white tracking-[.18em] uppercase mt-3 flex items-center gap-1.5 group-hover:gap-3 transition-all">
              Ver Colección →
            </div>
          </div>
          <div className="absolute right-6 top-5 bg-[#C1121F] text-white font-black text-2xl px-4 py-2.5 leading-none">
            –20%<br/><span className="text-[10px] font-bold tracking-wider">OFF</span>
          </div>
          <div className="absolute right-0 bottom-0 text-[120px] font-black text-white/[0.03] leading-none select-none">
            📻
          </div>
        </div>

        {/* Banner 2 */}
        <div className="relative h-44 bg-gradient-to-r from-[#2B2D42] to-[#1a1a2e] overflow-hidden flex items-center px-8 cursor-pointer group">
          <div className="relative z-10">
            <div className="text-[10px] font-extrabold text-[#C1121F] tracking-[.2em] uppercase mb-2">Car Audio Pro</div>
            <div className="text-3xl font-black text-white uppercase leading-none tracking-tight">Sonido<br/>Premium</div>
            <div className="text-[13px] text-[#999] mt-2">Amplificadores · Subwoofers · Tweeters</div>
            <div className="text-[10px] font-extrabold text-white tracking-[.18em] uppercase mt-3 flex items-center gap-1.5 group-hover:gap-3 transition-all">
              Explorar Audio →
            </div>
          </div>
          <div className="absolute right-6 top-5 bg-[#2B2D42] border border-[#444] text-white font-black text-2xl px-4 py-2.5 leading-none">
            NEW<br/><span className="text-[10px] font-bold tracking-wider">2025</span>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS GRID ──────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-8 py-14">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#2B2D42] uppercase tracking-widest">Productos Destacados</h2>
            <div className="w-10 h-[3px] bg-[#C1121F] mt-2" />
          </div>
          <Link href="/catalogo" className="text-[11px] font-bold tracking-[.15em] uppercase text-[#C1121F] border-b border-[#C1121F] pb-0.5 hover:opacity-75 transition-opacity">
            Ver Todo el Catálogo →
          </Link>
        </div>

        {/* Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-white border-[1.5px] border-[#f0f0f0] animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-[#f0f0f0]">
            <PackageSearch size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No hay productos disponibles en esta categoría por ahora.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {filteredProducts.slice(0, 8).map(p => (
              <div key={p.id} className="relative">
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/catalogo"
            className="inline-block bg-[#2B2D42] text-white font-bold px-10 py-4 text-xs tracking-[.2em] uppercase transition-colors hover:bg-black"
          >
            Ver Todo El Catálogo
          </Link>
        </div>
      </section>

      {/* ── BRANDS MARQUEE ─────────────────────────────────────── */}
      <div className="bg-white border-y border-[#eee] py-6 overflow-hidden">
        <div className="flex animate-[ticker_22s_linear_infinite] whitespace-nowrap">
          {[...brands, ...brands].map((b, i) => (
            <span key={i} className="text-[13px] font-extrabold text-[#ddd] tracking-[.2em] uppercase px-10 hover:text-[#2B2D42] transition-colors cursor-default shrink-0">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <div className="bg-[#2B2D42] py-14 px-6">
        <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map(s => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* ── FOOTER CTA ─────────────────────────────────────────── */}
      <div className="bg-[#0b0c10] py-16 px-6 text-center">
        <h2 className="text-[clamp(28px,4vw,54px)] font-black text-white uppercase tracking-tight leading-tight">
          ¿Listo para transformar<br/>tu <span className="text-[#C1121F]">vehículo</span>?
        </h2>
        <p className="text-[#666] text-sm mt-3">
          Asesoría personalizada · Garantía en todos los productos · Instalación profesional
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <Link href="/catalogo" className="bg-[#C1121F] text-white font-bold text-xs tracking-[.18em] uppercase px-9 py-4 transition-colors hover:bg-[#a00e18]">
            Ver Catálogo Completo
          </Link>
          <Link href="/nosotros" className="border border-[#444] text-white font-bold text-xs tracking-[.18em] uppercase px-9 py-4 transition-all hover:border-white">
            Contactar Asesor
          </Link>
        </div>
      </div>

    </div>
  );
}