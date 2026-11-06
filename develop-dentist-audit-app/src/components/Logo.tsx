interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <span dir="ltr" className={`font-display tracking-tight ${className}`}>
      <span className="font-bold">MAPSO</span>
      <span className="font-light">
        <span className="font-bold text-accent">.</span>RADAR
      </span>
    </span>
  );
}
