import { upsertProduct } from '../services/productService';
import { sampleCatalog } from '../seed';

for (const product of sampleCatalog) upsertProduct(product);
console.log(`✅ ${sampleCatalog.length} productos de muestra actualizados (incluye rutas de imagen).`);
