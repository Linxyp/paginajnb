'use client';
import { MessageCircle } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function WhatsAppButton() {
    const handleWspClick = () => {
        trackEvent({ name: 'contact', method: 'whatsapp' });
        const message = "Hola JNB Importaciones, requiero asesoría personalizada para equipar mi vehículo con tecnología Android.";
        window.open(`https://wa.me/573132602527?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <button 
            onClick={handleWspClick}
            className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20ba59] text-white p-4 rounded-full shadow-2xl z-50 transition-all transform hover:scale-110 flex items-center justify-center group"
            aria-label="Contacto Directo por WhatsApp"
        >
            <MessageCircle size={28} className="fill-white text-[#25D366]" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-2">
                Asesoría En Vivo
            </span>
        </button>
    );
}