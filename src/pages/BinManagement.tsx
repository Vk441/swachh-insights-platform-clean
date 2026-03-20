import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateBins, ZONES, Bin } from "@/data/mockData";
import { Plus, Search, Wrench, Wifi, WifiOff } from "lucide-react";

const allBins = generateBins(100);

const statusIcon = { active: Wifi, maintenance: Wrench, offline: WifiOff };
const statusVariant: Record<string, "default" | "secondary" | "destructive"> = { active: "default", maintenance: "secondary", offline: "destructive" };

export default function BinManagement() {
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return allBins.filter((b) => {
      if (search && !b.id.toLowerCase().includes(search.toLowerCase()) && !b.zone.toLowerCase().includes(search.toLowerCase())) return false;
      if (zoneFilter !== "all" && b.zone !== zoneFilter) return false;
      if (typeFilter !== "all" && b.type !== typeFilter) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      return true;
    });
  }, [search, zoneFilter, typeFilter, statusFilter]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Bin Management</h1>
          <p className="text-sm text-muted-foreground">847 bins across 12 zones — Ahmedabad Municipal Corporation</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add New Bin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add New Bin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Zone</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
                    <SelectContent>{ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Type</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{["public", "market", "stadium", "residential"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Capacity (Liters)</Label><Input type="number" placeholder="240" /></div>
              <div className="space-y-2"><Label>Address</Label><Input placeholder="e.g., CG Road, Navrangpura" /></div>
              <Button className="w-full">Add Bin</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by ID or zone…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Zone" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Zones</SelectItem>{ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Types</SelectItem>{["public", "market", "stadium", "residential"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Status</SelectItem>{["active", "maintenance", "offline"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bin ID</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Fill %</TableHead>
                <TableHead>Last Collected</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Predicted Full</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((bin) => {
                const Icon = statusIcon[bin.status];
                return (
                  <TableRow key={bin.id}>
                    <TableCell className="font-medium font-mono text-xs">{bin.id}</TableCell>
                    <TableCell>{bin.zone}</TableCell>
                    <TableCell className="capitalize">{bin.type}</TableCell>
                    <TableCell>{bin.capacity}L</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${bin.fillLevel}%`,
                              backgroundColor: bin.fillLevel >= 90 ? "hsl(0,84%,50%)" : bin.fillLevel >= 75 ? "hsl(25,95%,53%)" : bin.fillLevel >= 50 ? "hsl(45,93%,47%)" : "hsl(142,72%,40%)",
                            }}
                          />
                        </div>
                        <span className="text-sm tabular-nums">{bin.fillLevel}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{new Date(bin.lastCollected).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[bin.status]} className="gap-1 capitalize">
                        <Icon className="h-3 w-3" />{bin.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{bin.fillLevel >= 95 ? "Now" : `~${Math.round((100 - bin.fillLevel) / 8)}h`}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
