import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ZONES, TRUCKS } from "@/data/mockData";
import { Settings as SettingsIcon, MapPin, Bell, Truck, Users } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Platform configuration for Ahmedabad Municipal Corporation</p>
      </div>

      {/* City Config */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> City Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>City Name</Label><Input defaultValue="Ahmedabad Municipal Corporation" /></div>
            <div className="space-y-2"><Label>State</Label><Input defaultValue="Gujarat" /></div>
            <div className="space-y-2"><Label>Working Hours Start</Label><Input type="time" defaultValue="06:00" /></div>
            <div className="space-y-2"><Label>Working Hours End</Label><Input type="time" defaultValue="22:00" /></div>
          </div>
          <div>
            <Label className="mb-2 block">Active Zones ({ZONES.length})</Label>
            <div className="flex flex-wrap gap-2">
              {ZONES.map((z) => <Badge key={z} variant="outline">{z}</Badge>)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Alert Thresholds</CardTitle>
          <CardDescription>Configure when alerts trigger based on bin fill levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Warning Level (%)</Label>
              <Input type="number" defaultValue="75" />
              <p className="text-xs text-muted-foreground">Yellow alert threshold</p>
            </div>
            <div className="space-y-2">
              <Label>High Level (%)</Label>
              <Input type="number" defaultValue="85" />
              <p className="text-xs text-muted-foreground">Orange alert threshold</p>
            </div>
            <div className="space-y-2">
              <Label>Critical Level (%)</Label>
              <Input type="number" defaultValue="90" />
              <p className="text-xs text-muted-foreground">Red alert — immediate dispatch</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            {[
              { label: "Overflow Alerts", desc: "Alert when bins exceed critical level", def: true },
              { label: "Route Deviation Alerts", desc: "Alert when trucks deviate from assigned routes", def: true },
              { label: "Missed Collection Alerts", desc: "Alert when scheduled collections are missed", def: true },
              { label: "Sensor Failure Alerts", desc: "Alert when bin sensors go offline", def: true },
            ].map((a) => (
              <div key={a.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <Switch defaultChecked={a.def} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trucks & Drivers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Truck & Driver Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {TRUCKS.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">{t.id}</Badge>
                  <div>
                    <p className="text-sm font-medium">{t.driverName}</p>
                    <p className="text-xs text-muted-foreground">{t.phone}</p>
                  </div>
                </div>
                <Badge className={
                  t.status === "collecting" ? "bg-success text-success-foreground" :
                  t.status === "en-route" ? "bg-info text-info-foreground" :
                  t.status === "returning" ? "bg-warning text-warning-foreground" :
                  "bg-muted text-muted-foreground"
                }>{t.status.replace("-", " ")}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> User Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { role: "Super Admin", desc: "Full platform access, settings management, user management", users: 2 },
              { role: "City Operator", desc: "Dashboard, route management, fleet tracking, analytics", users: 8 },
              { role: "Truck Supervisor", desc: "Fleet tracking, assigned route view, collection updates", users: 6 },
            ].map((r) => (
              <div key={r.role} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{r.role}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
                <Badge variant="secondary">{r.users} users</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
