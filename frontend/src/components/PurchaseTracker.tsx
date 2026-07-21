'use client';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/** Fires the purchase event once when the order confirmation page mounts. */
export default function PurchaseTracker({ orderId, value }: { orderId: string; value: number }) {
    useEffect(() => {
        trackEvent({ name: 'purchase', orderId, value });
    }, [orderId, value]);

    return null;
}
