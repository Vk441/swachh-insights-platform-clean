import { useState, useMemo, Suspense, lazy } from "react";
import { Trash2, Truck, AlertTriangle, Fuel, CheckCircle, Search, X } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateBins, Bin } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

const AhmedabadMap = lazy(() => import("@/components/AhmedabadMap"));

const allBins = generateBins(100);

function getFillColor(level: number): string {
  if (level >= 90) return "hsl(0, 84%, 50%)";
  if (level >= 75) return "hsl(25, 95%, 53%)";
  if (level >= 50) return "hsl(45, 93%, 47%)";
  return "hsl(142, 72%, 40%)";
}

function getFillBadge(level: number) {
  if (level >= 90) return <Badge className="bg-bin-red text-white">Critical</Badge>;
  if (level >= 75) return <Badge className="bg-bin-orange text-white">High</Badge>;
  if (level >= 50) return <Badge className="bg-bin-yellow text-foreground">Medium</Badge>;
  return <Badge className="bg-bin-green text-white">Low</Badge>;
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"fill" | "id">("fill");
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);

  const criticalBins = allBins.filter((b) => b.fillLevel >= 90).length;

  const filteredBins = useMemo(() => {
    let bins = [...allBins];
    if (search) {
      const s = search.toLowerCase();
      bins = bins.filter((b) => b.id.toLowerCase().includes(s) || b.zone.toLowerCase().includes(s));
    }
    bins.sort((a, b) => (sortBy === "fill" ? b.fillLevel - a.fillLevel : a.id.localeCompare(b.id)));
    return bins;
  }, [search, sortBy]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Bins" value="847" icon={Trash2} trend="+12 this month" trendUp />
        <StatCard title="Critical Bins" value={criticalBins} icon={AlertTriangle} trend="Needs attention" />
        <StatCard title="Active Trucks" value="6" icon={Truck} trend="All operational" trendUp />
        <StatCard title="Collections Today" value="142" icon={CheckCircle} trend="+18% vs yesterday" trendUp />
        <StatCard title="Fuel Saved" value="₹8,400" icon={Fuel} trend="32% savings" trendUp />
      </div>

      {/* Full City Map Section */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-3">Ahmedabad City — Live Bin Map</h2>
        <Suspense fallback={<DashboardSkeleton />}>
          <AhmedabadMap bins={allBins} className="h-[550px]" />
        </Suspense>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bin List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">Bin Monitor</CardTitle>
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search bin or zone…" className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant="outline" size="sm" onClick={() => setSortBy(sortBy === "fill" ? "id" : "fill")}>
                  {sortBy === "fill" ? "By Fill" : "By ID"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredBins.map((bin) => (
                    <button
                      key={bin.id}
                      onClick={() => setSelectedBin(bin)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50 border-b border-r last:border-0 transition-colors"
                    >
                      <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: getFillColor(bin.fillLevel) }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{bin.id}</p>
                        <p className="text-xs text-muted-foreground truncate">{bin.zone}</p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums">{bin.fillLevel}%</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bin Detail Panel */}
      {selectedBin && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="font-display">{selectedBin.id}</CardTitle>
              <p className="text-sm text-muted-foreground">{selectedBin.address}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedBin(null)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <Badge variant="outline" className="capitalize">{selectedBin.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={selectedBin.status === "active" ? "default" : "destructive"} className="capitalize">{selectedBin.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Capacity</span>
                  <span className="text-sm font-medium">{selectedBin.capacity}L</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Fill Level</span>
                    <span className="text-sm font-bold">{selectedBin.fillLevel}%</span>
                  </div>
                  <Progress value={selectedBin.fillLevel} className="h-3" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Predicted Full</span>
                  <span className="text-sm font-medium">~{Math.round((100 - selectedBin.fillLevel) / 8 * 10) / 10}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Collected</span>
                  <span className="text-sm">{new Date(selectedBin.lastCollected).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <Button className="w-full">Dispatch Truck</Button>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium mb-2">Fill Level — Last 24 Hours</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={selectedBin.fillHistory}>
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} tickFormatter={(h) => `${h}:00`} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Fill Level"]} labelFormatter={(h) => `${h}:00`} />
                    <Line type="monotone" dataKey="level" stroke="hsl(120, 55%, 23%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
