import { z } from 'zod';

export const orderItemSchema = z.object({
    productId: z.string().trim().min(1).max(64),
    quantity: z.coerce.number().int().min(1).max(50),
});

export const createOrderSchema = z.object({
    customerName: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres').max(120),
    customerPhone: z.string().trim().regex(/^[0-9+()\s-]{7,20}$/, 'Teléfono inválido'),
    customerEmail: z.string().trim().email('Email inválido').max(160),
    address: z.string().trim().min(5, 'La dirección es muy corta').max(200),
    city: z.string().trim().min(2).max(80),
    vehicle: z.string().trim().min(3, 'Indica marca, modelo y año de tu vehículo').max(120),
    notes: z.string().trim().max(500).optional().default(''),
    paymentMethod: z.enum(['contraentrega', 'whatsapp']),
    items: z.array(orderItemSchema).min(1, 'El pedido no contiene productos').max(50),
});

export const wompiSignatureSchema = z.object({
    reference: z.string().trim().min(1).max(120),
    amountInCents: z.coerce.number().int().min(100),
    currency: z.enum(['COP', 'USD']),
});
