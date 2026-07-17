'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const AmbientShaderBg = dynamic(() => import('./AmbientShaderBg'), { ssr: false });

/**
 * Client-only, lazy-loaded wrapper around the WebGL shader background.
 * Never touches SSR output (so it can't hurt SEO/first paint), and falls back
 * to a plain CSS gradient for users who prefer reduced motion or lack WebGL.
 */
export default function LazyAmbientBg({ className = '' }: { className?: string }) {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;
        let hasWebGL = false;
        try {
            const canvas = document.createElement('canvas');
            hasWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch {
            hasWebGL = false;
        }
        if (hasWebGL) setEnabled(true);
    }, []);

    if (!enabled) {
        return <div className={`absolute inset-0 jnb-radial-red ${className}`} aria-hidden="true" />;
    }

    return <AmbientShaderBg className={className} />;
}
