import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactoPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-[#2B2D42] tracking-tight">Ponte en <span className="text-[#C1121F]">Contacto</span></h1>
                <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">Visita nuestras instalaciones o escríbenos para agendar tu cita de instalación tecnológica.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Información de Contacto */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
                        <MapPin className="text-[#C1121F] flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-bold text-[#2B2D42]">Ubicación</h4>
                            <p className="text-gray-500 text-sm mt-1">Bogotá D.C., Colombia<br/>Taller Principal JNB</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
                        <Phone className="text-[#C1121F] flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-bold text-[#2B2D42]">WhatsApp / Teléfono</h4>
                            <p className="text-gray-500 text-sm mt-1">+57 313 260 2527</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
                        <Mail className="text-[#C1121F] flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-bold text-[#2B2D42]">Correo Electrónico</h4>
                            <p className="text-gray-500 text-sm mt-1">ventas@jnbimportaciones.com</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
                        <Clock className="text-[#C1121F] flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-bold text-[#2B2D42]">Horario de Atención</h4>
                            <p className="text-gray-500 text-sm mt-1">Lunes a Sábado<br/>8:00 AM - 6:00 PM</p>
                        </div>
                    </div>
                </div>

                {/* Mapa Interactivo */}
                <div className="lg:col-span-2 bg-gray-200 rounded-2xl overflow-hidden border border-gray-300 min-h-[400px] shadow-sm relative">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127253.13222378368!2d-74.19502949791483!3d4.64828371720815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d635520a33914!2sBogot%C3%A1!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco" 
                        className="absolute inset-0 w-full h-full"
                        style={{ border: 0 }} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}