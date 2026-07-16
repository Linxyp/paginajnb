import { Truck, ShieldCheck, Wrench, Lock } from 'lucide-react';

const badges = [
    { icon: Truck, label: 'Envío nacional', sub: 'A toda Colombia' },
    { icon: ShieldCheck, label: 'Garantía incluida', sub: 'En todos los productos' },
    { icon: Wrench, label: 'Instalación experta', sub: 'Red de técnicos aliados' },
    { icon: Lock, label: 'Compra protegida', sub: 'Datos cifrados' },
];

export default function TrustBadges({ className = '' }: { className?: string }) {
    return (
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
            {badges.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="jnb-glass rounded-xl p-3.5 flex flex-col items-start gap-2">
                    <Icon size={18} className="text-[#ff2d42]" />
                    <div>
                        <div className="text-[11px] font-bold text-white leading-tight">{label}</div>
                        <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{sub}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
