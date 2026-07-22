'use client';
import { useEffect, useState } from 'react';

const FLASH_DURATION_MS = 10 * 60 * 1000;
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Countdown tied to real elapsed time since this product was first opened in
 * this browser tab (sessionStorage, not a number that silently resets on
 * every reload) — when it hits zero it stays there instead of pretending a
 * new 10-minute window just started.
 */
export function useFlashTimer(key: string) {
    const [remainingMs, setRemainingMs] = useState(FLASH_DURATION_MS);

    useEffect(() => {
        const storageKey = `jnb_flash_${key}`;
        let start = Number(sessionStorage.getItem(storageKey) || 0);
        if (!start) {
            start = Date.now();
            sessionStorage.setItem(storageKey, String(start));
        }

        const tick = () => setRemainingMs(Math.max(0, FLASH_DURATION_MS - (Date.now() - start)));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [key]);

    const totalSeconds = Math.floor(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return { minutes, seconds, expired: remainingMs <= 0, label: `${pad(minutes)}:${pad(seconds)}` };
}
