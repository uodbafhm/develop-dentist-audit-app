interface RadarBackdropProps {
  className?: string;
}

export function RadarBackdrop({ className = "" }: RadarBackdropProps) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <div className="relative h-full w-full">
        {/* Concentric rings */}
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-[12%] rounded-full border border-white/10" />
        <div className="absolute inset-[24%] rounded-full border border-white/10" />
        <div className="absolute inset-[36%] rounded-full border border-white/10" />
        {/* Crosshair */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/5" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/5" />
        {/* Rotating sweep */}
        <div className="radar-sweep absolute inset-0" />
        {/* Blips */}
        <span className="absolute left-[30%] top-[36%] size-1.5 rounded-full bg-accent" />
        <span className="animate-blip absolute left-[30%] top-[36%] size-1.5 rounded-full bg-accent" />
        <span className="absolute left-[68%] top-[58%] size-1.5 rounded-full bg-accent/80" />
        <span
          className="animate-blip absolute left-[68%] top-[58%] size-1.5 rounded-full bg-accent/80"
          style={{ animationDelay: "0.9s" }}
        />
        <span className="absolute left-[52%] top-[22%] size-1.5 rounded-full bg-accent/60" />
        <span
          className="animate-blip absolute left-[52%] top-[22%] size-1.5 rounded-full bg-accent/60"
          style={{ animationDelay: "1.7s" }}
        />
        {/* Center */}
        <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper" />
      </div>
    </div>
  );
}
