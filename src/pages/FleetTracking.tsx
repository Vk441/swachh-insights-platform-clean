import { MapPlaceholder } from "@/components/MapPlaceholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TRUCKS } from "@/data/mockData";
import { Truck, Fuel, AlertTriangle } from "lucide-react";

const statusColor: Record<string, string> = {
  "en-route": "bg-info text-info-foreground",
  collecting: "bg-success text-success-foreground",
  idle: "bg-muted text-muted-foreground",
  returning: "bg-warning text-warning-foreground",
};

const truckPins = TRUCKS.map((t, i) => ({
  x: 15 + i * 14,
  y: 30 + (i % 3) * 20,
  color: t.status === "collecting" ? "hsl(142,72%,40%)" : t.status === "en-route" ? "hsl(205,85%,50%)" : t.status === "returning" ? "hsl(38,92%,50%)" : "hsl(0,0%,60%)",
  label: t.id.slice(-2),
}));

export default function FleetTracking() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Fleet Tracking</h1>
          <p className="text-sm text-muted-foreground">Live truck positions and route progress</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Live
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapPlaceholder className="h-[500px]" pins={truckPins}>
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {["Collecting", "En Route", "Returning", "Idle"].map((s) => (
                <div key={s} className="flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-[10px] shadow backdrop-blur">
                  <span className={`h-2 w-2 rounded-full ${
                    s === "Collecting" ? "bg-success" : s === "En Route" ? "bg-info" : s === "Returning" ? "bg-warning" : "bg-muted-foreground"
                  }`} />
                  {s}
                </div>
              ))}
            </div>
          </MapPlaceholder>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {TRUCKS.map((truck) => (
              <Card key={truck.id}>
                <CardHeader className="pb-2 p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-display flex items-center gap-2">
                      <Truck className="h-4 w-4" /> {truck.id}
                    </CardTitle>
                    <Badge className={statusColor[truck.status]}>{truck.status.replace("-", " ")}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Driver</span>
                    <span className="font-medium">{truck.driverName}</span>
                  </div>
                  {truck.totalBins > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Route Progress</span>
                        <span className="font-medium">{truck.binsCollected}/{truck.totalBins} bins</span>
                      </div>
                      <Progress value={(truck.binsCollected / truck.totalBins) * 100} className="h-2" />
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1"><Fuel className="h-3 w-3" /> Fuel</span>
                    <span className="font-medium">{truck.fuelLevel}%</span>
                  </div>
                  {/* Timeline */}
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Today's Activity</p>
                    {truck.timeline.map((t, i) => (
                      <div key={i} className="flex gap-2 text-xs py-0.5">
                        <span className="text-muted-foreground w-10 shrink-0">{t.time}</span>
                        <span>{t.event}</span>
                      </div>
                    ))}
                  </div>
                  {truck.id === "TRK-AMD-03" && (
                    <div className="flex items-center gap-1.5 rounded-md bg-warning/10 px-2 py-1.5 text-xs text-warning">
                      <AlertTriangle className="h-3 w-3" /> Route deviation detected near Bopal
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
