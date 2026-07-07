import Link from 'next/link';
import Image from 'next/image';

async function getAllProducts() {
    try {
        const res = await fetch('http://localhost:4000/api/products', { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function CatalogPage() {
    const products = await getAllProducts();

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-[#2B2D42] tracking-tight">Catálogo de Productos</h1>
                <p className="text-gray-500 text-sm mt-1">Explora nuestra línea de infoentretenimiento y seguridad de vanguardia.</p>
            </div>

            {products.length === 0 ? (
                <p className="text-gray-500 bg-white p-8 rounded-xl border text-center">No se encontraron artículos disponibles en el inventario.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((p: any) => (
                        <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                            <div className="relative w-full h-48 bg-gray-50 p-4">
                                <Image src={`/productos/${p.images[0]}`} alt={p.name} fill className="object-contain" />
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <span className="text-[10px] font-extrabold uppercase text-[#C1121F] tracking-widest">{p.category}</span>
                                <h2 className="font-bold text-sm text-[#2B2D42] mt-1 line-clamp-2 h-10">{p.name}</h2>
                                <p className="text-xs text-gray-400 mt-2">Línea: {p.brand}</p>
                                <div className="mt-auto pt-4 border-t flex items-center justify-between">
                                    <span className="font-extrabold text-sm text-[#2B2D42]">${p.price.toLocaleString('es-CO')}</span>
                                    <Link href={`/producto/${p.slug}`} className="bg-[#C1121F] hover:bg-[#E63946] text-white text-xs font-bold px-3 py-2 rounded transition-colors">
                                        Ver Más
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}