import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { loadExcelData, getProducts, getProductBySlug } from './services/excelService';

dotenv.config();
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

loadExcelData();

app.get('/api/products', (req: Request, res: Response) => {
    const activeProducts = getProducts().filter(p => p.status === 'Activo' && p.stock > 0);
    res.json(activeProducts);
});

app.get('/api/products/:slug', (req: Request, res: Response) => {
    const product = getProductBySlug(req.params.slug);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado en el catálogo' });
    }
    res.json(product);
});

app.post('/api/payments/wompi-signature', (req: Request, res: Response) => {
    const { reference, amountInCents, currency } = req.body;
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    if (!integritySecret) {
        return res.status(500).json({ error: 'Falta la configuración de seguridad en el servidor' });
    }

    const secureString = `${reference}${amountInCents}${currency}${integritySecret}`;
    const signature = crypto.createHash('sha256').update(secureString).digest('hex');
    
    res.json({ signature });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor backend de JNB operando en puerto ${PORT}`));