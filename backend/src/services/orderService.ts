import crypto from 'node:crypto';
import { db, withTransaction } from '../db';
import { getProductById, decrementStock } from './productService';

export class OrderValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'OrderValidationError';
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

const FREE_SHIPPING_THRESHOLD = 500_000;
const STANDARD_SHIPPING_COST = 15_000;

const generateOrderNumber = (sequentialId: number): string => `JNB-${String(sequentialId).padStart(6, '0')}`;
const generateAccessToken = (): string => crypto.randomBytes(20).toString('hex');

export const createOrder = (input: CreateOrderInput): OrderRecord => {
    if (input.items.length === 0) {
        throw new OrderValidationError('El pedido no contiene productos.');
    }

    return withTransaction(() => {
        const lineItems: OrderItemRecord[] = [];
        let subtotal = 0;

        for (const item of input.items) {
            const product = getProductById(item.productId);
            if (!product || product.status !== 'Activo') {
                throw new OrderValidationError(`El producto ${item.productId} ya no está disponible.`);
            }
            if (product.stock < item.quantity) {
                throw new OrderValidationError(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}.`);
            }

            decrementStock(product.id, item.quantity);

            const lineSubtotal = product.price * item.quantity;
            subtotal += lineSubtotal;
            lineItems.push({
                productId: product.id,
                productName: product.name,
                unitPrice: product.price,
                quantity: item.quantity,
                subtotal: lineSubtotal,
            });
        }

        const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
        const total = subtotal + shippingCost;
        const accessToken = generateAccessToken();

        const insertOrder = db.prepare(`
            INSERT INTO orders (
                order_number, access_token, customer_name, customer_phone, customer_email,
                address, city, notes, payment_method, status, subtotal, shipping_cost, total
            ) VALUES (
                @order_number, @access_token, @customer_name, @customer_phone, @customer_email,
                @address, @city, @notes, @payment_method, 'pendiente', @subtotal, @shipping_cost, @total
            )
        `);

        // Reserve the row first with a temporary order_number to obtain the autoincrement id.
        const result = insertOrder.run({
            order_number: `TMP-${accessToken}`,
            access_token: accessToken,
            customer_name: input.customerName,
            customer_phone: input.customerPhone,
            customer_email: input.customerEmail,
            address: input.address,
            city: input.city,
            notes: input.notes,
            payment_method: input.paymentMethod,
            subtotal,
            shipping_cost: shippingCost,
            total,
        });

        const orderId = Number(result.lastInsertRowid);
        const orderNumber = generateOrderNumber(orderId);
        db.prepare('UPDATE orders SET order_number = ? WHERE id = ?').run(orderNumber, orderId);

        const insertItem = db.prepare(`
            INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
            VALUES (@order_id, @product_id, @product_name, @unit_price, @quantity, @subtotal)
        `);
        for (const item of lineItems) {
            insertItem.run({
                order_id: orderId,
                product_id: item.productId,
                product_name: item.productName,
                unit_price: item.unitPrice,
                quantity: item.quantity,
                subtotal: item.subtotal,
            });
        }

        const createdAtRow = db.prepare('SELECT created_at FROM orders WHERE id = ?').get(orderId) as { created_at: string };

        return {
            orderNumber,
            accessToken,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            customerEmail: input.customerEmail,
            address: input.address,
            city: input.city,
            notes: input.notes,
            paymentMethod: input.paymentMethod,
            status: 'pendiente',
            subtotal,
            shippingCost,
            total,
            createdAt: createdAtRow.created_at,
            items: lineItems,
        };
    });
};

interface OrderRow {
    order_number: string;
    access_token: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    address: string;
    city: string;
    notes: string;
    payment_method: string;
    status: string;
    subtotal: number;
    shipping_cost: number;
    total: number;
    created_at: string;
    id: number;
}

interface OrderItemRow {
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
}

export const getOrderByAccessToken = (token: string): OrderRecord | undefined => {
    const row = db.prepare('SELECT * FROM orders WHERE access_token = ?').get(token) as OrderRow | undefined;
    if (!row) return undefined;

    const itemRows = db.prepare('SELECT product_id, product_name, unit_price, quantity, subtotal FROM order_items WHERE order_id = ?')
        .all(row.id) as unknown as OrderItemRow[];

    return {
        orderNumber: row.order_number,
        accessToken: row.access_token,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        customerEmail: row.customer_email,
        address: row.address,
        city: row.city,
        notes: row.notes,
        paymentMethod: row.payment_method,
        status: row.status,
        subtotal: row.subtotal,
        shippingCost: row.shipping_cost,
        total: row.total,
        createdAt: row.created_at,
        items: itemRows.map(i => ({
            productId: i.product_id,
            productName: i.product_name,
            unitPrice: i.unit_price,
            quantity: i.quantity,
            subtotal: i.subtotal,
        })),
    };
};
