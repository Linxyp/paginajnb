import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/api';
import Reveal from './motion/Reveal';
import { StaggerGroup, StaggerItem } from './motion/StaggerGroup';
import PriceBlock from './PriceBlock';

/** Picks up to `limit` other products, prioritizing shared category then shared vehicle brand. */
function pickRelated(current: Product, all: Product[], limit = 3): Product[] {
    const others = all.filter((p) => p.id !== current.id);
    const scored = others.map((p) => {
        let score = 0;
        if (p.category === current.category) score += 2;
        if (p.vehicleBrand !== 'Universal' && p.vehicleBrand === current.vehicleBrand) score += 1;
        return { p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.p);
}

export default function RelatedProducts({ current, all }: { current: Product; all: Product[] }) {
    const related = pickRelated(current, all);
    if (related.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
            <Reveal>
                <h2 className="text-xs uppercase font-extrabold text-white tracking-[.2em] mb-6">También te puede interesar</h2>
                <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {related.map((p) => (
                        <StaggerItem key={p.id}>
                            <Link
                                href={`/producto/${p.slug}`}
                                className="group jnb-glass rounded-2xl overflow-hidden flex items-center gap-4 p-4 transition-all hover:border-[#C1121F]/50"
                            >
                                <div className="relative w-20 h-20 shrink-0 bg-black/20 rounded-xl overflow-hidden border border-white/5">
                                    {p.images[0] && (
                                        <Image src={`/productos/${p.images[0]}`} alt={p.name} fill className="object-contain p-2.5 transition-transform duration-500 group-hover:scale-105" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[9px] font-extrabold uppercase text-[#ff2d42] tracking-widest">{p.category}</div>
                                    <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-1 group-hover:text-[#ff2d42] transition-colors">{p.name}</h3>
                                    <div className="flex items-center justify-between mt-1.5 gap-2">
                                        <PriceBlock id={p.id} price={p.price} size="sm" />
                                        <ArrowRight size={14} className="shrink-0 text-gray-600 group-hover:text-[#ff2d42] group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerGroup>
            </Reveal>
        </section>
    );
}
