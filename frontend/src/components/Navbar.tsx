'use client';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { Search, ShoppingCart, Menu, User, X, ChevronDown, Phone, MapPin } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import GarageBadge from './GarageBadge';

const navCategories = [
    {
        label: 'Tienda',
        href: '/catalogo',
        sub: [
            { label: 'Radios Android', href: '/catalogo?cat=radios' },
            { label: 'Car Audio', href: '/catalogo?cat=audio' },
            { label: 'Iluminación LED', href: '/catalogo?cat=led' },
            { label: 'Interior', href: '/catalogo?cat=interior' },
        ],
    },
];

const suggestions = [
    'Radio Android Toyota 4Runner',
    'Tweeter JNB PRO',
    'Tercer Stop LED Fortuner',
    'Timón Lexus Carbono',
    'Timón Corolla Cross GR',
    'Timón Palo Rosa Toyota',
];

export default function Navbar() {
    const items = useCartStore((state) => state.items);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalValue = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [filtered, setFiltered] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Shadow on scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close search on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
                setQuery('');
                setFiltered([]);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Focus input when search opens
    useEffect(() => {
        if (searchOpen) inputRef.current?.focus();
    }, [searchOpen]);

    const handleQuery = (val: string) => {
        setQuery(val);
        setFiltered(
            val.trim().length > 1
                ? suggestions.filter(s => s.toLowerCase().includes(val.toLowerCase()))
                : []
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            window.location.href = `/catalogo?q=${encodeURIComponent(query.trim())}`;
        }
    };

    return (
        <header className={`w-full bg-surface text-ink sticky top-0 z-50 font-sans border-b border-line transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>

            {/* ── TOPBAR ── */}
            <div className="bg-brand text-white text-[10px] font-bold py-1.5 px-6 flex items-center justify-between tracking-widest uppercase">
                <span className="flex items-center gap-1.5">
                    <Phone size={10} /> +57 313 260 2527
                </span>
                <span>Envíos a nivel nacional · Instalación profesional garantizada</span>
                <span className="hidden md:flex items-center gap-1.5">
                    <MapPin size={10} /> CC Taiwan, Local 101, Bogotá
                </span>
            </div>

            {/* ── MAIN BAR ── */}
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="h-20 flex items-center justify-between gap-6">

                    {/* LEFT — Search trigger + nav */}
                    <div className="flex-1 flex items-center gap-8">
                        {/* Search button / expanded input */}
                        <div ref={searchRef} className="relative">
                            {searchOpen ? (
                                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                                    <div className="relative">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={query}
                                            onChange={e => handleQuery(e.target.value)}
                                            placeholder="Buscar producto..."
                                            className="w-64 bg-surface-alt border border-line focus:border-brand text-ink text-sm px-4 py-2 outline-none placeholder-ink-muted transition-colors rounded-none"
                                        />
                                        {/* Suggestions dropdown */}
                                        {filtered.length > 0 && (
                                            <div className="absolute top-full left-0 w-full bg-surface border border-line border-t-0 shadow-lg z-50">
                                                {filtered.map(s => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => {
                                                            setQuery(s);
                                                            setFiltered([]);
                                                            window.location.href = `/catalogo?q=${encodeURIComponent(s)}`;
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-ink-muted hover:bg-brand hover:text-white transition-colors flex items-center gap-2"
                                                    >
                                                        <Search size={13} className="text-ink-muted" />
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button type="submit" className="bg-brand px-3 py-2 hover:bg-[#a00e18] text-white transition-colors">
                                        <Search size={18} />
                                    </button>
                                    <button type="button" onClick={() => { setSearchOpen(false); setQuery(''); setFiltered([]); }}>
                                        <X size={18} className="text-ink-muted hover:text-ink transition-colors" />
                                    </button>
                                </form>
                            ) : (
                                <button onClick={() => setSearchOpen(true)} className="hover:text-brand transition-colors">
                                    <Search size={22} strokeWidth={2} />
                                </button>
                            )}
                        </div>

                        {/* Desktop nav left */}
                        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.15em] uppercase text-ink-muted">
                            <Link href="/" className="hover:text-ink transition-colors relative group">
                                Inicio
                                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-brand scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </Link>

                            {/* Tienda with dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <button className="flex items-center gap-1 hover:text-ink transition-colors">
                                    Tienda <ChevronDown size={13} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute top-full left-0 mt-3 w-52 bg-surface border border-line shadow-lg z-50">
                                        {navCategories[0].sub.map(s => (
                                            <Link
                                                key={s.href}
                                                href={s.href}
                                                className="block px-5 py-3 text-[11px] text-ink-muted hover:bg-brand hover:text-white transition-colors tracking-widest uppercase font-bold border-b border-line last:border-0"
                                            >
                                                {s.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>

                    {/* CENTER — Logo */}
                    <Link href="/" className="flex-shrink-0 flex flex-col items-center group">
                        <span className="text-3xl lg:text-4xl font-black tracking-tighter text-ink transition-transform group-hover:scale-105 italic">
                            JNB<span className="text-brand">IMPO</span>
                        </span>
                        <span className="text-[9px] text-ink-muted tracking-[0.3em] uppercase mt-0.5 font-semibold">
                            Tecnología Vehicular
                        </span>
                    </Link>

                    {/* RIGHT — Nav + icons */}
                    <div className="flex-1 flex items-center justify-end gap-8">
                        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.15em] uppercase text-ink-muted">
                            <Link href="/compatibilidad" className="hover:text-ink transition-colors relative group">
                                Vehículos
                                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-brand scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </Link>
                            <Link href="/contacto" className="hover:text-ink transition-colors relative group">
                                Servicio al Cliente
                                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-brand scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </Link>
                        </nav>

                        <div className="flex items-center gap-5">
                            <GarageBadge className="hidden md:flex hover:text-brand-bright" />

                            <button className="hidden sm:block hover:text-brand transition-colors">
                                <User size={22} strokeWidth={2} />
                            </button>

                            {/* Cart */}
                            <Link href="/carrito" className="flex items-center gap-2.5 hover:text-brand transition-colors group relative">
                                <div className="relative">
                                    <ShoppingCart size={22} strokeWidth={2} />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-brand text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </div>
                                <div className="hidden sm:flex flex-col leading-none">
                                    <span className="text-[9px] text-ink-muted uppercase tracking-wider font-bold">Carrito</span>
                                    <span className="text-sm font-black text-ink group-hover:text-brand transition-colors">
                                        ${totalValue.toLocaleString('es-CO')}
                                    </span>
                                </div>
                            </Link>

                            {/* Mobile menu toggle */}
                            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-ink hover:text-brand transition-colors">
                                {mobileOpen ? <X size={26} /> : <Menu size={26} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE MENU ── */}
            {mobileOpen && (
                <div className="lg:hidden bg-surface border-t border-line">
                    {/* Mobile garage badge */}
                    <div className="px-6 pt-5">
                        <GarageBadge className="bg-surface-alt border border-line rounded-lg px-4 py-3 w-full justify-center" />
                    </div>
                    {/* Mobile search */}
                    <div className="px-6 pt-4 pb-3">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={query}
                                onChange={e => handleQuery(e.target.value)}
                                placeholder="Buscar producto..."
                                className="flex-1 bg-surface-alt border border-line focus:border-brand text-ink text-sm px-4 py-2.5 outline-none placeholder-ink-muted transition-colors"
                            />
                            <button type="submit" className="bg-brand px-4 py-2.5 hover:bg-[#a00e18] text-white transition-colors">
                                <Search size={18} />
                            </button>
                        </form>
                    </div>

                    <nav className="flex flex-col px-6 pb-6 font-bold text-sm tracking-widest uppercase divide-y divide-line">
                        <Link href="/" onClick={() => setMobileOpen(false)} className="py-4 hover:text-brand transition-colors">Inicio</Link>
                        <Link href="/catalogo" onClick={() => setMobileOpen(false)} className="py-4 hover:text-brand transition-colors">Tienda</Link>
                        {navCategories[0].sub.map(s => (
                            <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)} className="py-3 pl-4 text-[11px] text-ink-muted hover:text-brand transition-colors">
                                → {s.label}
                            </Link>
                        ))}
                        <Link href="/compatibilidad" onClick={() => setMobileOpen(false)} className="py-4 hover:text-brand transition-colors">Vehículos</Link>
                        <Link href="/contacto" onClick={() => setMobileOpen(false)} className="py-4 hover:text-brand transition-colors">Servicio al Cliente</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}