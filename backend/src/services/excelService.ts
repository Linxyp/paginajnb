import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

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

const filePath = path.join(__dirname, '../../data/productos.xlsx');
let cachedProducts: Product[] = [];

export const loadExcelData = (): void => {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn("⚠️ Archivo Excel no encontrado en la ruta especificada.");
            return;
        }
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        cachedProducts = data.map((row: any) => {
            const nameStr = String(row.Nombre || '');
            const cleanSlug = nameStr
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-");

            return {
                id: String(row.Referencia || ''),
                slug: cleanSlug,
                name: nameStr,
                category: String(row.Categoría || ''),
                brand: String(row.Marca || ''),
                compatibility: String(row.Compatibilidad || ''),
                description: String(row.Descripción || ''),
                price: Number(row.Precio || 0),
                stock: Number(row.Stock || 0),
                status: String(row.Estado || 'Inactivo'),
                images: [row.ImagenPrincipal, row.ImagenSecundaria, row.ImagenTerciaria].filter(Boolean).map(String)
            };
        });
        console.log(`✅ Inventario sincronizado: ${cachedProducts.length} productos cargados.`);
    } catch (error) {
        console.error("❌ Error procesando el archivo de Excel:", error);
    }
};

if (fs.existsSync(filePath)) {
    fs.watchFile(filePath, () => {
        console.log("🔄 Cambio detectado en el archivo Excel. Recargando datos...");
        loadExcelData();
    });
}

export const getProducts = (): Product[] => cachedProducts;
export const getProductBySlug = (slug: string): Product | undefined => cachedProducts.find(p => p.slug === slug);