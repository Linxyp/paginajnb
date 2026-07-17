'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface Callout {
    x: number; // 0-100, position on the image
    y: number; // 0-100
    title: string;
    text: string;
    side?: 'left' | 'right';
}

interface ScrollStoryProps {
    image: string;
    alt: string;
    callouts: Callout[];
}

/**
 * "Guided tour" of a real product photo: pins the image while the scroll
 * position drives a slow zoom and sequential callouts pointing at specific
 * areas — the same storytelling beat as a 3D disassembly, built from a photo
 * instead of a CAD model. Users who prefer reduced motion get the same
 * information as a plain static list instead of the pinned/animated version,
 * so the content itself is never gated behind an animation.
 */
export default function ScrollStory({ image, alt, callouts }: ScrollStoryProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const imgWrapRef = useRef<HTMLDivElement>(null);
    const calloutRefs = useRef<(HTMLDivElement | null)[]>([]);
    const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }, []);

    useEffect(() => {
        if (reducedMotion || !rootRef.current || !stageRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top top',
                    end: `+=${callouts.length * 60}%`,
                    scrub: 0.6,
                    pin: stageRef.current,
                    anticipatePin: 1,
                },
            });

            tl.fromTo(imgWrapRef.current, { scale: 1 }, { scale: 1.15, ease: 'none', duration: callouts.length });

            callouts.forEach((_, i) => {
                const calloutEl = calloutRefs.current[i];
                const dotEl = dotRefs.current[i];
                if (!calloutEl || !dotEl) return;
                const at = i;
                tl.fromTo(dotEl, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.25 }, at);
                tl.fromTo(calloutEl, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35 }, at + 0.1);
                if (i < callouts.length - 1) {
                    tl.to(calloutEl, { opacity: 0, y: -16, duration: 0.25 }, at + 0.85);
                    tl.to(dotEl, { opacity: 0.35, duration: 0.25 }, at + 0.85);
                }
            });
        }, rootRef);

        return () => ctx.revert();
    }, [callouts, reducedMotion]);

    if (reducedMotion) {
        return (
            <div className="bg-[#07070b] py-16 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="relative w-full aspect-square mb-8">
                        <Image src={`/productos/${image}`} alt={alt} fill className="object-contain" sizes="(max-width: 768px) 90vw, 640px" />
                    </div>
                    <div className="grid gap-4">
                        {callouts.map((c, i) => (
                            <div key={i} className="jnb-glass rounded-xl px-4 py-3">
                                <div className="text-[10px] font-extrabold text-[#ff2d42] uppercase tracking-widest mb-1">{c.title}</div>
                                <div className="text-xs text-gray-300 leading-relaxed">{c.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="relative bg-[#07070b]">
            <div ref={stageRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center">
                <div ref={imgWrapRef} className="relative w-full max-w-2xl aspect-square mx-6">
                    <Image src={`/productos/${image}`} alt={alt} fill className="object-contain" sizes="(max-width: 768px) 90vw, 640px" />
                </div>

                {callouts.map((c, i) => (
                    <div key={i}>
                        <div
                            ref={(el) => { dotRefs.current[i] = el; }}
                            className="absolute w-2.5 h-2.5 rounded-full bg-[#ff2d42] opacity-0 shadow-[0_0_12px_rgba(255,45,66,0.8)]"
                            style={{ left: `${c.x}%`, top: `${c.y}%` }}
                        />
                        <div
                            ref={(el) => { calloutRefs.current[i] = el; }}
                            className={`absolute opacity-0 jnb-glass rounded-xl px-4 py-3 max-w-[220px] ${c.side === 'left' ? 'text-right' : ''}`}
                            style={{
                                left: c.side === 'left' ? undefined : `calc(${c.x}% + 24px)`,
                                right: c.side === 'left' ? `calc(${100 - c.x}% + 24px)` : undefined,
                                top: `calc(${c.y}% - 20px)`,
                            }}
                        >
                            <div className="text-[10px] font-extrabold text-[#ff2d42] uppercase tracking-widest mb-1">{c.title}</div>
                            <div className="text-xs text-gray-300 leading-relaxed">{c.text}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
