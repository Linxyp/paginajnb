export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        fbq?: (...args: unknown[]) => void;
    }
}

export type AnalyticsEvent =
    | { name: 'view_item'; productId: string; productName: string; price: number; category: string }
    | { name: 'add_to_cart'; productId: string; productName: string; price: number; quantity: number }
    | { name: 'begin_checkout'; value: number; itemCount: number }
    | { name: 'purchase'; orderId: string; value: number }
    | { name: 'contact'; method: 'whatsapp' | 'phone' };

/**
 * Fires the same commercial event to both GA4 and Meta Pixel using each platform's own
 * standard event names, so ad campaigns can optimize/retarget on real store activity.
 * Silently no-ops when a script isn't loaded (no ID configured, or blocked) — never throws.
 */
export function trackEvent(event: AnalyticsEvent): void {
    if (typeof window === 'undefined') return;

    try {
        switch (event.name) {
            case 'view_item':
                window.gtag?.('event', 'view_item', {
                    currency: 'COP',
                    value: event.price,
                    items: [{ item_id: event.productId, item_name: event.productName, item_category: event.category }],
                });
                window.fbq?.('track', 'ViewContent', {
                    content_ids: [event.productId],
                    content_name: event.productName,
                    content_category: event.category,
                    value: event.price,
                    currency: 'COP',
                });
                break;
            case 'add_to_cart':
                window.gtag?.('event', 'add_to_cart', {
                    currency: 'COP',
                    value: event.price * event.quantity,
                    items: [{ item_id: event.productId, item_name: event.productName, price: event.price, quantity: event.quantity }],
                });
                window.fbq?.('track', 'AddToCart', {
                    content_ids: [event.productId],
                    content_name: event.productName,
                    value: event.price * event.quantity,
                    currency: 'COP',
                });
                break;
            case 'begin_checkout':
                window.gtag?.('event', 'begin_checkout', { currency: 'COP', value: event.value });
                window.fbq?.('track', 'InitiateCheckout', { value: event.value, currency: 'COP', num_items: event.itemCount });
                break;
            case 'purchase':
                window.gtag?.('event', 'purchase', { transaction_id: event.orderId, currency: 'COP', value: event.value });
                window.fbq?.('track', 'Purchase', { value: event.value, currency: 'COP' });
                break;
            case 'contact':
                window.gtag?.('event', 'contact', { method: event.method });
                window.fbq?.('track', 'Contact');
                break;
        }
    } catch {
        // Analytics must never break the shopping experience.
    }
}
