import { db } from '../db';

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

interface ProductRow {
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
    images: string;
}

const rowToProduct = (row: ProductRow): Product => ({
    ...row,
    images: JSON.parse(row.images || '[]'),
});

export const getProducts = (): Product[] => {
    const rows = db.prepare('SELECT * FROM products ORDER BY name').all() as unknown as ProductRow[];
    return rows.map(rowToProduct);
};

export const getProductBySlug = (slug: string): Product | undefined => {
    const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug) as ProductRow | undefined;
    return row ? rowToProduct(row) : undefined;
};

export const getProductById = (id: string): Product | undefined => {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as ProductRow | undefined;
    return row ? rowToProduct(row) : undefined;
};

export interface UpsertProductInput {
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

export const upsertProduct = (p: UpsertProductInput): void => {
    db.prepare(`
        INSERT INTO products (id, slug, name, category, brand, compatibility, description, price, stock, status, images)
        VALUES (@id, @slug, @name, @category, @brand, @compatibility, @description, @price, @stock, @status, @images)
        ON CONFLICT(id) DO UPDATE SET
            slug = excluded.slug,
            name = excluded.name,
            category = excluded.category,
            brand = excluded.brand,
            compatibility = excluded.compatibility,
            description = excluded.description,
            price = excluded.price,
            stock = excluded.stock,
            status = excluded.status,
            images = excluded.images
    `).run({ ...p, images: JSON.stringify(p.images) });
};

export const countProducts = (): number => {
    const row = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    return row.count;
};

/** Decrements stock for a product. Throws if insufficient stock remains. Must run inside a transaction. */
export const decrementStock = (id: string, quantity: number): void => {
    const result = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?')
        .run(quantity, id, quantity);
    if (result.changes === 0) {
        throw new Error(`STOCK_INSUFICIENTE:${id}`);
    }
};
