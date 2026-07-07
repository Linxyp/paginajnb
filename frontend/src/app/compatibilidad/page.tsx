import Link from 'next/link';

export default function CompatibilityPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-black text-[#2B2D42]">Búsqueda Avanzada por Vehículo</h1>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">Próxima optimización automatizada de filtros cruzados.</p>
            <div className="mt-8">
                <Link href="/catalogo" className="bg-[#2B2D42] text-white font-bold px-6 py-3 rounded-lg text-xs tracking-wider uppercase">
                    Ver Todos los Equipos
                </Link>
            </div>
        </div>
    );
}