import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bin } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Satellite } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AHMEDABAD_CENTER: [number, number] = [23.0225, 72.5714];

const TILE_LAYERS = {
  normal: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS',
  },
};

function createBinIcon(fillLevel: number) {
  let color: string;
  if (fillLevel >= 90) color = "#ef4444";
  else if (fillLevel >= 75) color = "#f97316";
  else if (fillLevel >= 50) color = "#eab308";
  else color = "#22c55e";

  return L.divIcon({
    className: "custom-bin-icon",
    html: `<div style="
      width: 24px; height: 24px; border-radius: 50%;
      background: ${color}; border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      display: flex; align-items: center; justify-content: center;
      font-size: 8px; font-weight: 700; color: white;
    ">${fillLevel}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

function getTimeToFull(fillLevel: number): { hours: number; text: string } {
  if (fillLevel >= 98) return { hours: 0, text: "Full now" };
  const rate = 5 + Math.random() * 8; // % per hour
  const hours = Math.round(((100 - fillLevel) / rate) * 10) / 10;
  return { hours, text: `~${hours}h` };
}

function MapLayerSwitcher({ layer }: { layer: "normal" | "satellite" }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [layer, map]);
  return null;
}

function BinPopupContent({ bin }: { bin: Bin }) {
  const ttf = useMemo(() => getTimeToFull(bin.fillLevel), [bin.fillLevel]);
  const maxHours = 12;
  const elapsed = maxHours - ttf.hours;
  const progress = Math.min(100, Math.max(0, (elapsed / maxHours) * 100));

  return (
    <div className="min-w-[200px] p-1 text-xs space-y-2">
      <div className="font-bold text-sm text-foreground">{bin.id}</div>
      <div className="text-muted-foreground">{bin.address}</div>

      {/* Fill % */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="font-medium">Fill Level</span>
          <span className="font-bold">{bin.fillLevel}%</span>
        </div>
        <Progress value={bin.fillLevel} className="h-2" />
      </div>

      {/* Time to full */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="font-medium">Time to Full</span>
          <span className="font-bold">{ttf.text}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background: progress > 80 ? "#ef4444" : progress > 50 ? "#f97316" : "#22c55e",
            }}
          />
        </div>
        <div className="flex justify-between mt-0.5 text-[10px] text-muted-foreground">
          <span>0h</span>
          <span>{maxHours}h</span>
        </div>
      </div>

      {/* Last cleared */}
      <div className="flex justify-between pt-1 border-t">
        <span className="font-medium">Last Cleared</span>
        <span>{new Date(bin.lastCollected).toLocaleString("en-IN", {
          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
        })}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-medium">Type</span>
        <span className="capitalize">{bin.type}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Zone</span>
        <span>{bin.zone}</span>
      </div>
    </div>
  );
}

interface AhmedabadMapProps {
  bins: Bin[];
  className?: string;
}

export default function AhmedabadMap({ bins, className }: AhmedabadMapProps) {
  const [layer, setLayer] = useState<"normal" | "satellite">("normal");
  const tileConfig = TILE_LAYERS[layer];

  return (
    <Card className={`relative overflow-hidden ${className || ""}`}>
      {/* Layer toggle */}
      <div className="absolute top-3 right-3 z-[1000] flex gap-1">
        <Button
          size="sm"
          variant={layer === "normal" ? "default" : "outline"}
          className="h-8 text-xs gap-1.5"
          onClick={() => setLayer("normal")}
        >
          <Map className="h-3.5 w-3.5" /> Normal
        </Button>
        <Button
          size="sm"
          variant={layer === "satellite" ? "default" : "outline"}
          className="h-8 text-xs gap-1.5"
          onClick={() => setLayer("satellite")}
        >
          <Satellite className="h-3.5 w-3.5" /> Satellite
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] flex gap-2 flex-wrap">
        {[
          { color: "bg-bin-green", label: "0-50%" },
          { color: "bg-bin-yellow", label: "50-75%" },
          { color: "bg-bin-orange", label: "75-90%" },
          { color: "bg-bin-red", label: "90-100%" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-medium shadow backdrop-blur">
            <span className={`h-2 w-2 rounded-full ${l.color}`} />
            {l.label}
          </div>
        ))}
      </div>

      <MapContainer
        center={AHMEDABAD_CENTER}
        zoom={12}
        className="h-full w-full"
        style={{ minHeight: "500px" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer url={tileConfig.url} attribution={tileConfig.attribution} />
        <MapLayerSwitcher layer={layer} />
        {bins.map((bin) => (
          <Marker
            key={bin.id}
            position={[bin.lat, bin.lng]}
            icon={createBinIcon(bin.fillLevel)}
          >
            <Popup>
              <BinPopupContent bin={bin} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
}
