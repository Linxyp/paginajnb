/** Decorative blurred color blobs for dark section backgrounds. Purely visual, not interactive. */
export default function GlowOrbs({ variant = 'red' }: { variant?: 'red' | 'mixed' }) {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-[#C1121F]/25 blur-[120px]" />
            {variant === 'mixed' && (
                <div className="absolute top-1/3 right-0 w-[420px] h-[420px] rounded-full bg-[#22d3ee]/10 blur-[120px]" />
            )}
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#C1121F]/10 blur-[100px]" />
        </div>
    );
}
