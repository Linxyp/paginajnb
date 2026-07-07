import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import { ZodError } from 'zod';
import { getProducts, getProductBySlug } from './services/productService';
import { createOrder, getOrderByAccessToken, OrderValidationError } from './services/orderService';
import { seedSampleCatalogIfEmpty } from './seed';
import { createOrderSchema, wompiSignatureSchema } from './schemas';

dotenv.config();
seedSampleCatalogIfEmpty();

const app = express();
app.set('trust proxy', 1);

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(helmet());
app.use(cors({ origin: frontendUrl, methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '100kb' }));

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false });
const orderLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false, message: { error: 'Demasiados pedidos creados desde esta conexión. Intenta más tarde.' } });
app.use(generalLimiter);

const asyncHandler = (fn: (req: Request, res: Response) => Promise<void> | void) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = fn(req, res);
            if (result instanceof Promise) result.catch(next);
        } catch (err) {
            next(err);
        }
    };

app.get('/api/products', asyncHandler((req: Request, res: Response) => {
    const activeProducts = getProducts().filter(p => p.status === 'Activo' && p.stock > 0);
    res.json(activeProducts);
}));

app.get('/api/products/:slug', asyncHandler((req: Request, res: Response) => {
    const product = getProductBySlug(req.params.slug);
    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado en el catálogo' });
        return;
    }
    res.json(product);
}));

app.post('/api/orders', orderLimiter, asyncHandler((req: Request, res: Response) => {
    const parsed = createOrderSchema.parse(req.body);

    try {
        const order = createOrder(parsed);
        res.status(201).json({
            orderNumber: order.orderNumber,
            accessToken: order.accessToken,
            total: order.total,
            subtotal: order.subtotal,
            shippingCost: order.shippingCost,
        });
    } catch (err) {
        if (err instanceof OrderValidationError) {
            res.status(409).json({ error: err.message });
            return;
        }
        throw err;
    }
}));

app.get('/api/orders/:token', asyncHandler((req: Request, res: Response) => {
    const order = getOrderByAccessToken(req.params.token);
    if (!order) {
        res.status(404).json({ error: 'Pedido no encontrado' });
        return;
    }
    res.json(order);
}));

app.post('/api/payments/wompi-signature', asyncHandler((req: Request, res: Response) => {
    const { reference, amountInCents, currency } = wompiSignatureSchema.parse(req.body);
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    if (!integritySecret) {
        res.status(503).json({ error: 'La pasarela de pagos aún no está configurada en el servidor' });
        return;
    }

    const secureString = `${reference}${amountInCents}${currency}${integritySecret}`;
    const signature = crypto.createHash('sha256').update(secureString).digest('hex');

    res.json({ signature });
}));

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Recurso no encontrado' });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError) {
        res.status(400).json({ error: 'Datos inválidos', details: err.issues.map(i => ({ path: i.path.join('.'), message: i.message })) });
        return;
    }
    console.error('❌ Error no controlado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor backend de JNB operando en puerto ${PORT}`));
