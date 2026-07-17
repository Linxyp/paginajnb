import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jnbimportaciones.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
        { url: `${SITE_URL}/catalogo`, changeFrequency: 'daily', priority: 0.9 },
        { url: `${SITE_URL}/compatibilidad`, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${SITE_URL}/contacto`, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${SITE_URL}/nosotros`, changeFrequency: 'monthly', priority: 0.5 },
    ];

    const products = await getAllProducts();
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
        url: `${SITE_URL}/producto/${p.slug}`,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
}
