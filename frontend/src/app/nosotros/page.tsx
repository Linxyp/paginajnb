import { CheckCircle, Target, Eye, Wrench } from 'lucide-react';

export default function NosotrosPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-[#2B2D42] tracking-tight">Acerca de <span className="text-[#C1121F]">Nosotros</span></h1>
                <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">Conoce la historia, misión y los valores que nos convierten en líderes de tecnología vehicular en Colombia.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                <div className="space-y-6">
                    <h2 className="text-3xl font-extrabold text-[#2B2D42]">Nuestra Historia y Experiencia</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        En JNB Importaciones nacimos con la visión de modernizar el parque automotor colombiano. Nos especializamos exclusivamente en tecnología de infoentretenimiento Android, pantallas multimedia, y sistemas avanzados de seguridad como dashcams y sensores de parqueo.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        Nuestra filosofía de trabajo garantiza que no vendemos repuestos mecánicos, sino que nos dedicamos 100% a la integración tecnológica limpia, manteniendo la estética original de tu vehículo.
                    </p>
                </div>
                <div className="h-80 bg-gray-200 rounded-2xl flex items-center justify-center border border-gray-300">
                    <span className="text-gray-400 font-bold tracking-widest uppercase">Imagen del Equipo / Local</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="bg-[#fce7e8] w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                        <Target className="text-[#C1121F]" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#2B2D42] mb-4">Nuestra Misión</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Proveer e instalar soluciones tecnológicas automotrices de última generación, brindando a nuestros clientes conectividad, seguridad y entretenimiento inigualable en cada trayecto, respaldados por un servicio técnico de excelencia.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="bg-[#fce7e8] w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                        <Eye className="text-[#C1121F]" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#2B2D42] mb-4">Nuestra Visión</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Consolidarnos como el importador y centro de instalación referente a nivel nacional en tecnología vehicular, reconocidos por la calidad premium de nuestros radios Android y el profesionalismo de nuestro equipo humano.
                    </p>
                </div>
            </div>
        </div>
    );
}