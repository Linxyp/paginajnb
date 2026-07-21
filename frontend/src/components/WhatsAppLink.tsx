'use client';
import { ReactNode } from 'react';
import { trackEvent } from '@/lib/analytics';

interface Props {
    href: string;
    className?: string;
    children: ReactNode;
}

/** Drop-in replacement for a plain WhatsApp <a>/<Link> that also fires the 'contact' analytics event. */
export default function WhatsAppLink({ href, className, children }: Props) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            onClick={() => trackEvent({ name: 'contact', method: 'whatsapp' })}
        >
            {children}
        </a>
    );
}
