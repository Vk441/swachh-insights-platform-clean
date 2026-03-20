import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
  pins?: { x: number; y: number; color: string; label?: string }[];
  routes?: { points: { x: number; y: number }[]; color: string }[];
}

export function MapPlaceholder({ children, className, pins = [], routes = [] }: MapPlaceholderProps) {
  return (
    <div className={cn("relative rounded-lg border bg-card overflow-hidden", className)}>
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Roads */}
      <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="10" y1="30" x2="90" y2="30" stroke="currentColor" strokeWidth="0.5" />
        <line x1="10" y1="60" x2="90" y2="60" stroke="currentColor" strokeWidth="0.5" />
        <line x1="25" y1="10" x2="25" y2="90" stroke="currentColor" strokeWidth="0.5" />
        <line x1="55" y1="10" x2="55" y2="90" stroke="currentColor" strokeWidth="0.5" />
        <line x1="80" y1="10" x2="80" y2="90" stroke="currentColor" strokeWidth="0.5" />
        <path d="M 10 45 Q 30 20 50 45 Q 70 70 90 45" fill="none" stroke="currentColor" strokeWidth="0.3" />
      </svg>
      {/* Routes */}
      {routes.length > 0 && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {routes.map((route, ri) => (
            <polyline
              key={ri}
              points={route.points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={route.color}
              strokeWidth="0.8"
              strokeDasharray="2,1"
              opacity={0.7}
            />
          ))}
        </svg>
      )}
      {/* Pins */}
      {pins.map((pin, i) => (
        <div
          key={i}
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <MapPin className="h-5 w-5 drop-shadow-md" style={{ color: pin.color }} fill={pin.color} />
          {pin.label && (
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-card px-1 text-[10px] font-medium shadow">
              {pin.label}
            </span>
          )}
        </div>
      ))}
      {/* Label */}
      <div className="absolute bottom-2 right-2 rounded bg-card/80 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">
        Ahmedabad • Mock Map View
      </div>
      {children}
    </div>
  );
}
