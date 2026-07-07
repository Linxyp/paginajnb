// In the browser, calls go through Next.js's own /api/* rewrite proxy (see next.config.ts)
// so they always hit the same origin the visitor loaded the page from — this is what makes
// the app work from a phone or a tunnel URL, where the visitor's device can't reach the
// backend's "localhost" directly. Server-side (SSR) fetches run on the Next.js host itself,
// so they talk to the backend directly via its real URL.
const isBrowser = typeof window !== 'undefined';
export const API_URL = isBrowser ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

export interface Product {
    id: string;
    slug: string;
    name: string;
    category: string;
    brand: string;
    compatibility: string;
    description: string;
    price: number;
    stock: number;
    status: string;
    images: string[];
}

export async function getAllProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(slug)}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export interface OrderItemInput {
    productId: string;
    quantity: number;
}

export interface CreateOrderInput {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address: string;
    city: string;
    notes: string;
    paymentMethod: 'contraentrega' | 'whatsapp';
    items: OrderItemInput[];
}

export interface CreateOrderResult {
    orderNumber: string;
    accessToken: string;
    subtotal: number;
    shippingCost: number;
    total: number;
}

export class ApiError extends Error {
    details?: { path: string; message: string }[];
    constructor(message: string, details?: { path: string; message: string }[]) {
        super(message);
        this.details = details;
    }
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new ApiError(data.error || 'No se pudo crear el pedido', data.details);
    }
    return data;
}

export interface OrderItemRecord {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}

export interface OrderRecord {
    orderNumber: string;
    accessToken: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address: string;
    city: string;
    notes: string;
    paymentMethod: string;
    status: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    createdAt: string;
    items: OrderItemRecord[];
}

export async function getOrderByToken(token: string): Promise<OrderRecord | null> {
    try {
        const res = await fetch(`${API_URL}/api/orders/${encodeURIComponent(token)}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}
