'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sun, Moon, Cpu, Smartphone, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';

interface Props {
    image: string;
    name: string;
}

const FEATURES = [
    { icon: Cpu, title: '4GB RAM / 64GB', text: 'Android 15 fluido — abre mapas, música y apps sin trabarse.' },
    { icon: Smartphone, title: 'CarPlay & Android Auto', text: 'Incluye Magic Box para conectar tu teléfono también de forma inalámbrica.' },
    { icon: ShieldCheck, title: 'Cámara de reversa incluida', text: 'Con guía de estacionamiento y visión nocturna en pantalla, sin costo aparte.' },
    { icon: Moon, title: 'Visión nocturna', text: 'La cámara incluida ve con claridad incluso en parqueaderos sin luz.' },
];

/**
 * Unique interactive hero for the "Radio 9" product page: a stylized head-unit
 * frame with a day/night toggle and a scanning-light overlay, showcasing the
 * bundled reverse camera feed on the radio's own screen. Explicitly labeled as
 * an illustrative recreation — the goal is to make the screen-quality pitch
 * tangible, not to claim it's a live feed from the customer's own camera.
 */
export default function RadioScreenDemo({ image, name }: Props) {
    const [mode, setMode] = useState<'dia' | 'noche'>('dia');

    return (
        <section className="relative bg-[#050508] py-16 px-4 border-b border-white/5 overflow-hidden">
            <div className="absolute inset-0 jnb-grid-bg opacity-40" />
            <div className="relative max-w-4xl mx-auto text-center">
                <Reveal>
                    <p className="jnb-accent text-2xl text-gray-300">Mira su pantalla en acción</p>
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest mt-1">
                        Simulación de Pantalla en Vivo
                    </h2>
                    <p className="text-gray-500 text-xs mt-2 max-w-lg mx-auto">
                        Recreación de la pantalla de {name} mostrando la cámara de reversa incluida — toca &ldquo;Noche&rdquo; para ver la visión nocturna en acción.
                    </p>
                </Reveal>

                {/* Device frame */}
                <Reveal delay={0.1} className="mt-10">
                    <div className="relative mx-auto max-w-2xl rounded-[28px] border-[6px] border-[#1a1a22] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
                        {/* Screen */}
                        <div className="relative aspect-video overflow-hidden">
                            <motion.div
                                animate={{
                                    filter: mode === 'noche'
                                        ? 'brightness(0.6) contrast(1.4) saturate(0.6) hue-rotate(-8deg)'
                                        : 'brightness(1) contrast(1) saturate(1)',
                                }}
                                transition={{ duration: 0.8, ease: 'easeInOut' }}
                                className="absolute inset-0"
                            >
                                <Image src={`/productos/${image}`} alt={name} fill className="object-cover" sizes="(max-width: 768px) 90vw, 700px" />
                            </motion.div>

                            {/* Scanline sweep */}
                            <motion.div
                                aria-hidden
                                className="absolute inset-x-0 h-1/4 bg-gradient-to-b from-transparent via-[#ff2d42]/25 to-transparent pointer-events-none"
                                animate={{ top: ['-25%', '110%'] }}
                                transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* HUD frame */}
                            <div className="absolute inset-3 border border-white/10 rounded-lg pointer-events-none" />

                            {/* REC badge */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d42] animate-pulse" />
                                <span className="text-[9px] font-bold text-white tracking-widest">RADIO 9&Prime; · CÁM REVERSA</span>
                            </div>

                            {/* Mode badge */}
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-[9px] font-bold text-white tracking-widest uppercase">
                                {mode === 'dia' ? 'Modo Día' : 'Modo Noche'}
                            </div>
                        </div>

                        {/* Toggle bar */}
                        <div className="flex items-center justify-center gap-2 bg-[#0e0e15] py-3 px-4">
                            <button
                                onClick={() => setMode('dia')}
                                className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${mode === 'dia' ? 'bg-[#C1121F] text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Sun size={13} /> Día
                            </button>
                            <button
                                onClick={() => setMode('noche')}
                                className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${mode === 'noche' ? 'bg-[#C1121F] text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Moon size={13} /> Noche
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-3 uppercase tracking-widest">
                        *Recreación ilustrativa de pantalla — la imagen real depende de tu instalación
                    </p>
                </Reveal>

                {/* Feature chips */}
                <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 text-left">
                    {FEATURES.map((f) => (
                        <StaggerItem key={f.title}>
                            <div className="jnb-glass rounded-2xl p-4 h-full">
                                <f.icon size={18} className="text-[#ff2d42] mb-2" />
                                <div className="text-xs font-extrabold text-white uppercase tracking-wide">{f.title}</div>
                                <div className="text-[11px] text-gray-400 mt-1 leading-relaxed">{f.text}</div>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerGroup>
            </div>
        </section>
    );
}
