import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
    label: string;
    href?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jnbimportaciones.com';

/** Breadcrumb trail with BreadcrumbList schema.org markup for rich results. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.label,
            item: item.href ? `${SITE_URL}${item.href}` : undefined,
        })),
    };

    return (
        <nav aria-label="Ruta de navegación" className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-1">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ol className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li key={i} className="flex items-center gap-1.5">
                            {item.href && !isLast ? (
                                <Link href={item.href} className="hover:text-[#ff2d42] transition-colors uppercase tracking-wide font-semibold">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={`uppercase tracking-wide ${isLast ? 'text-gray-300 font-bold' : 'font-semibold'}`} aria-current={isLast ? 'page' : undefined}>
                                    {item.label}
                                </span>
                            )}
                            {!isLast && <ChevronRight size={11} className="text-gray-700" />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
