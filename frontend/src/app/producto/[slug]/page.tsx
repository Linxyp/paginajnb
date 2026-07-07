import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/api";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    // RESOLVER LA PROMESA DE PARAMS (Requisito estricto de Next.js 15)
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) notFound();

    const wspMessage = `Hola JNB Importaciones, estoy interesado en este producto: ${product.name} (Ref: ${product.id})`;
    const wspLink = `https://wa.me/573000000000?text=${encodeURIComponent(wspMessage)}`;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C1121F] font-bold mb-8 transition-colors">
                <ArrowLeft size={16} /> Volver al catálogo
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-col gap-4">
                    <div className="relative w-full h-[400px] bg-gray-50 rounded-xl overflow-hidden border p-4">
                        <Image 
                            src={`/productos/${product.images[0]}`} 
                            alt={product.name} 
                            fill 
                            className="object-contain" 
                            priority
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-extrabold text-[#C1121F] bg-[#EDF2F4] px-2.5 py-1 rounded-md uppercase tracking-wider">{product.category}</span>
                        <h1 className="text-3xl font-black text-[#2B2D42] mt-3 tracking-tight">{product.name}</h1>
                        <p className="text-xs text-gray-400 mt-1">Referencia única: {product.id} | Fabricante: {product.brand}</p>
                        
                        <div className="text-3xl font-black text-[#2B2D42] my-6">
                            ${product.price.toLocaleString('es-CO')} <span className="text-xs text-gray-400 font-normal">COP</span>
                        </div>

                        <div className="border-t border-b py-4 my-4">
                            <h3 className="text-xs uppercase font-extrabold text-[#2B2D42] tracking-wider mb-2">Descripción General:</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                        </div>

                        <div className="bg-[#EDF2F4] p-4 rounded-xl border border-gray-200">
                            <h3 className="text-xs uppercase font-extrabold text-[#2B2D42] tracking-wider mb-1">Compatibilidad Garantizada:</h3>
                            <p className="text-sm text-[#2B2D42] font-semibold">{product.compatibility}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <AddToCartButton product={product} />
                        <Link 
                            href={wspLink} 
                            target="_blank" 
                            className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                        >
                            <MessageCircle size={20} />
                            Asesoría Directa
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}