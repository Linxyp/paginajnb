import { db } from '../db';
import { upsertProduct } from '../services/productService';
import { sampleCatalog } from '../seed';

const keepIds = sampleCatalog.map((p) => p.id);
const placeholders = keepIds.map(() => '?').join(',');
db.prepare(`DELETE FROM products WHERE id NOT IN (${placeholders})`).run(...keepIds);

for (const product of sampleCatalog) upsertProduct(product);
console.log(`✅ Catálogo reemplazado: ${sampleCatalog.length} productos activos.`);
