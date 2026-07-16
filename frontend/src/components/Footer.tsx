export default function Footer() {
    return (
        <footer className="bg-[#07070b] text-white border-t border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div>
                    <h3 className="text-lg font-bold mb-3">JNB<span className="text-[#ff2d42]">IMPO</span></h3>
                    <p className="text-gray-500 leading-relaxed">
                        Especialistas en la comercialización e instalación premium de pantallas Android, dashcams y seguridad tecnológica avanzada para tu vehículo en Colombia.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-3">Garantía y Confianza</h3>
                    <p className="text-gray-500 leading-relaxed">
                        Todos nuestros productos tecnológicos cuentan con soporte de instalación calificado y políticas de protección al consumidor directa.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-3">Contacto</h3>
                    <p className="text-gray-500">Bogotá D.C, Colombia</p>
                    <p className="text-gray-500 mt-1">Soporte Técnico Certificado</p>
                </div>
            </div>
            <div className="border-t border-white/5 text-center py-4 text-xs text-gray-600">
                &copy; {new Date().getFullYear()} JNB Importaciones. Todos los derechos reservados. Plataforma Corporativa Premium.
            </div>
        </footer>
    );
}
