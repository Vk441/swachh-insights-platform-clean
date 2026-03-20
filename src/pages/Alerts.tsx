import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateAlerts, Alert, ZONES } from "@/data/mockData";
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, Siren } from "lucide-react";

const severityConfig = {
  critical: { icon: Siren, class: "bg-destructive text-destructive-foreground" },
  warning: { icon: AlertTriangle, class: "bg-warning text-warning-foreground" },
  info: { icon: Info, class: "bg-info text-info-foreground" },
};

const typeLabels: Record<string, string> = {
  overflow: "Bin Overflow",
  deviation: "Route Deviation",
  "missed-collection": "Missed Collection",
  "sensor-failure": "Sensor Failure",
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter !== "all" && a.severity !== severityFilter) return false;
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      return true;
    });
  }, [alerts, severityFilter, typeFilter]);

  const toggleResolved = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: !a.resolved } : a)));
  };

  const unresolved = alerts.filter((a) => !a.resolved).length;
  const critical = alerts.filter((a) => a.severity === "critical" && !a.resolved).length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Alerts & Notifications</h1>
          <p className="text-sm text-muted-foreground">{unresolved} unresolved • {critical} critical</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="gap-1"><Siren className="h-3 w-3" /> {critical} Critical</Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="overflow">Bin Overflow</SelectItem>
              <SelectItem value="deviation">Route Deviation</SelectItem>
              <SelectItem value="missed-collection">Missed Collection</SelectItem>
              <SelectItem value="sensor-failure">Sensor Failure</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Alert Feed */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {filtered.map((alert) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            return (
              <Card key={alert.id} className={alert.resolved ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.class}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="capitalize text-xs">{typeLabels[alert.type]}</Badge>
                            <Badge className={config.class + " text-xs"}>{alert.severity}</Badge>
                            <span className="text-xs text-muted-foreground">{alert.zone}</span>
                          </div>
                          <p className="mt-1 text-sm">{alert.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString("en-IN")}
                            {alert.binId && <> • {alert.binId}</>}
                            {alert.truckId && <> • {alert.truckId}</>}
                          </p>
                        </div>
                        <Button
                          variant={alert.resolved ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleResolved(alert.id)}
                          className="shrink-0"
                        >
                          {alert.resolved ? <><XCircle className="mr-1 h-3 w-3" /> Reopen</> : <><CheckCircle className="mr-1 h-3 w-3" /> Resolve</>}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
