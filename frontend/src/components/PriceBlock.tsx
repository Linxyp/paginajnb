import { getAnchorPrice, getDiscountPercent } from '@/lib/urgency';

const fmt = (n: number) => new Intl.NumberFormat('es-CO').format(n);

interface PriceBlockProps {
    id: string;
    price: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const SIZE_CLASSES: Record<NonNullable<PriceBlockProps['size']>, string> = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl sm:text-5xl',
};

/** Current price + a stable "before" anchor and discount badge — shared everywhere a price appears. */
export default function PriceBlock({ id, price, size = 'md', className = '' }: PriceBlockProps) {
    const anchor = getAnchorPrice(price, id);
    const pct = getDiscountPercent(id);

    return (
        <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
            <span className={`${SIZE_CLASSES[size]} font-black text-white jnb-glow-text`}>${fmt(price)}</span>
            <span className="text-xs text-gray-500 line-through">${fmt(anchor)}</span>
            <span className="bg-[#C1121F] text-white text-[10px] font-extrabold px-2 py-0.5 rounded">-{pct}%</span>
        </div>
    );
}
