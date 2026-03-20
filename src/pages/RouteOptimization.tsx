import { useState } from "react";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TRUCKS, generateBins } from "@/data/mockData";
import { Route as RouteIcon, Fuel, Clock, MapPin } from "lucide-react";

const criticalBins = generateBins(100).filter((b) => b.fillLevel >= 75).slice(0, 15);

const mockRoutes = [
  {
    truckId: "TRK-AMD-01", color: "hsl(120, 55%, 30%)", bins: criticalBins.slice(0, 5),
    distance: "18.4 km", time: "1h 20min", fuelCost: "₹420", savings: "32%",
    points: [{ x: 15, y: 20 }, { x: 30, y: 35 }, { x: 45, y: 25 }, { x: 60, y: 45 }, { x: 75, y: 30 }],
  },
  {
    truckId: "TRK-AMD-02", color: "hsl(205, 85%, 50%)", bins: criticalBins.slice(5, 10),
    distance: "22.1 km", time: "1h 45min", fuelCost: "₹510", savings: "28%",
    points: [{ x: 20, y: 60 }, { x: 35, y: 50 }, { x: 50, y: 70 }, { x: 65, y: 55 }, { x: 80, y: 65 }],
  },
  {
    truckId: "TRK-AMD-03", color: "hsl(38, 92%, 50%)", bins: criticalBins.slice(10, 15),
    distance: "15.7 km", time: "1h 05min", fuelCost: "₹360", savings: "35%",
    points: [{ x: 25, y: 80 }, { x: 40, y: 75 }, { x: 55, y: 85 }, { x: 70, y: 78 }, { x: 85, y: 82 }],
  },
];

export default function RouteOptimization() {
  const [selectedRoute, setSelectedRoute] = useState(0);
  const route = mockRoutes[selectedRoute];

  const allPins = mockRoutes.flatMap((r, ri) =>
    r.points.map((p, pi) => ({ x: p.x, y: p.y, color: r.color, label: `${ri + 1}.${pi + 1}` }))
  );

  const allRouteLines = mockRoutes.map((r) => ({ points: r.points, color: r.color }));

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Route Optimization</h1>
          <p className="text-sm text-muted-foreground">AI-optimized collection routes for active trucks</p>
        </div>
        <Button><RouteIcon className="mr-2 h-4 w-4" /> Generate New Route</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Bin List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Bins Flagged for Collection</CardTitle>
            <p className="text-xs text-muted-foreground">{criticalBins.length} bins — critical + predicted</p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {criticalBins.map((bin, i) => (
                <div key={bin.id} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{bin.id}</p>
                    <p className="text-xs text-muted-foreground">{bin.zone} • {bin.type}</p>
                  </div>
                  <Badge className={bin.fillLevel >= 90 ? "bg-bin-red text-white" : "bg-bin-orange text-white"}>
                    {bin.fillLevel}%
                  </Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Center: Map */}
        <div className="lg:col-span-2 space-y-4">
          <MapPlaceholder className="h-[400px]" pins={allPins} routes={allRouteLines}>
            <div className="absolute top-3 left-3 flex gap-2">
              {mockRoutes.map((r, i) => (
                <button
                  key={r.truckId}
                  onClick={() => setSelectedRoute(i)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium shadow backdrop-blur transition-all ${
                    i === selectedRoute ? "bg-card ring-2 ring-primary" : "bg-card/80"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.truckId}
                </button>
              ))}
            </div>
          </MapPlaceholder>

          {/* Route Summary */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-display">Route Summary — {route.truckId}</CardTitle>
                <Select defaultValue={route.truckId}>
                  <SelectTrigger className="w-40 h-8">
                    <SelectValue placeholder="Assign truck" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRUCKS.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.id} — {t.driverName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Bins</p>
                  <p className="text-lg font-bold font-display">{route.bins.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Distance</p>
                  <p className="text-lg font-bold font-display">{route.distance}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Est. Time</p>
                  <p className="text-lg font-bold font-display">{route.time}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Fuel className="h-3 w-3" /> Fuel Cost</p>
                  <p className="text-lg font-bold font-display">{route.fuelCost}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fuel Saved</p>
                  <p className="text-lg font-bold font-display text-success">{route.savings}</p>
                </div>
              </div>
              <Button className="mt-4">Assign to {route.truckId}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
