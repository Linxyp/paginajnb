// SECURITY NOTE: xlsx@0.18.5 has known unpatched advisories (prototype pollution / ReDoS) on npm —
// the maintainer moved fixes to their own CDN instead of publishing here. Risk is low in this specific
// use: this script only runs locally against a file you provide yourself, it's never exposed to the
// internet or arbitrary user uploads. Revisit if this ever accepts untrusted files.
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { upsertProduct, UpsertProductInput } from '../services/productService';

const filePath = path.join(__dirname, '../../data/productos.xlsx');

const slugify = (value: string): string =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

const run = (): void => {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ No se encontró el archivo: ${filePath}`);
        process.exit(1);
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rows: Record<string, unknown>[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rows.length === 0) {
        console.error('❌ El archivo Excel no contiene filas de datos. No se importó nada.');
        process.exit(1);
    }

    let imported = 0;
    for (const row of rows) {
        const nameStr = String(row.Nombre || '').trim();
        const idStr = String(row.Referencia || '').trim();
        if (!nameStr || !idStr) {
            console.warn('⚠️  Fila omitida por falta de Nombre o Referencia:', row);
            continue;
        }

        const product: UpsertProductInput = {
            id: idStr,
            slug: slugify(nameStr),
            name: nameStr,
            category: String(row.Categoría || ''),
            brand: String(row.Marca || ''),
            compatibility: String(row.Compatibilidad || ''),
            description: String(row.Descripción || ''),
            price: Number(row.Precio || 0),
            stock: Number(row.Stock || 0),
            status: String(row.Estado || 'Inactivo'),
            images: [row.ImagenPrincipal, row.ImagenSecundaria, row.ImagenTerciaria]
                .filter(Boolean)
                .map(String),
            vehicleBrand: String(row.MarcaVehiculo || 'Universal'),
            vehicleModel: String(row.ModeloVehiculo || ''),
        };
        upsertProduct(product);
        imported++;
    }

    console.log(`✅ Importación completa: ${imported} productos cargados/actualizados desde productos.xlsx.`);
};

run();
