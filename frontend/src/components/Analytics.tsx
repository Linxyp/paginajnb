import Script from 'next/script';
import { GA_ID, META_PIXEL_ID } from '@/lib/analytics';

/**
 * Loads GA4 and/or Meta Pixel only when their env vars are set. With no IDs configured
 * (the default today) this renders nothing — zero scripts, zero performance cost.
 * Set NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_META_PIXEL_ID to switch each one on.
 */
export default function Analytics() {
    return (
        <>
            {GA_ID && (
                <>
                    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
                    <Script id="ga4-init" strategy="afterInteractive">
                        {`window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_ID}');`}
                    </Script>
                </>
            )}
            {META_PIXEL_ID && (
                <Script id="meta-pixel-init" strategy="afterInteractive">
                    {`!function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${META_PIXEL_ID}');
                    fbq('track', 'PageView');`}
                </Script>
            )}
        </>
    );
}
