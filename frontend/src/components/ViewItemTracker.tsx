'use client';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/** Fires the view_item / ViewContent event once when a product landing page mounts. */
export default function ViewItemTracker({ productId, productName, price, category }: { productId: string; productName: string; price: number; category: string }) {
    useEffect(() => {
        trackEvent({ name: 'view_item', productId, productName, price, category });
    }, [productId, productName, price, category]);

    return null;
}
