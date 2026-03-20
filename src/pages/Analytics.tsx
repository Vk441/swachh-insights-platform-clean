import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ANALYTICS_DATA, ZONES } from "@/data/mockData";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { TrendingUp, Fuel, Clock, Award } from "lucide-react";

export default function Analytics() {
  const { collectionEfficiency, fuelData, peakHours, zoneWaste, survekshanScore, monthlySummary } = ANALYTICS_DATA;
  const topZones = [...zoneWaste].sort((a, b) => b.daily - a.daily).slice(0, 5);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Waste management performance insights — Ahmedabad</p>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Collections", value: monthlySummary.totalCollections.toLocaleString() },
          { label: "Total Waste", value: monthlySummary.totalWaste },
          { label: "Avg Efficiency", value: monthlySummary.avgEfficiency },
          { label: "Fuel Saved", value: monthlySummary.fuelSaved },
          { label: "Complaints", value: monthlySummary.complaints },
          { label: "Resolved", value: monthlySummary.resolved },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold font-display mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Collection Efficiency */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Collection Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={collectionEfficiency}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Efficiency"]} />
                <Line type="monotone" dataKey="efficiency" stroke="hsl(120,55%,30%)" strokeWidth={2.5} dot={{ fill: "hsl(120,55%,30%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fuel Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2"><Fuel className="h-4 w-4 text-primary" /> Fuel: Consumed vs Saved (₹)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={fuelData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumed" fill="hsl(0,0%,60%)" name="Consumed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saved" fill="hsl(120,55%,40%)" name="Saved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Peak Waste Generation Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`${v} kg`, "Waste"]} />
                <Bar dataKey="waste" fill="hsl(38,92%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Survekshan Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Swachh Survekshan Score</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={survekshanScore}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[3000, 4000]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="hsl(38,92%,50%)" strokeWidth={2.5} dot={{ fill: "hsl(38,92%,50%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Zone-Wise Heatmap Table */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Zone-Wise Waste Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <div className="grid grid-cols-5 text-xs font-medium text-muted-foreground pb-1 border-b">
                <span>Zone</span><span>Daily (kg)</span><span>Weekly</span><span>Monthly</span><span>Intensity</span>
              </div>
              {zoneWaste.map((z) => (
                <div key={z.zone} className="grid grid-cols-5 text-sm py-1">
                  <span className="font-medium">{z.zone}</span>
                  <span className="tabular-nums">{z.daily.toLocaleString()}</span>
                  <span className="tabular-nums">{z.weekly.toLocaleString()}</span>
                  <span className="tabular-nums">{z.monthly.toLocaleString()}</span>
                  <Badge variant={z.intensity === "critical" ? "destructive" : z.intensity === "high" ? "default" : "secondary"} className="w-fit capitalize text-xs">
                    {z.intensity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Top 5 Waste Generating Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topZones.map((z, i) => (
                <div key={z.zone} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{z.zone}</span>
                      <span className="text-sm tabular-nums">{z.daily.toLocaleString()} kg/day</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(z.daily / topZones[0].daily) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
