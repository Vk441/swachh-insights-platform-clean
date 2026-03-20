export const ZONES = [
  "Navrangpura", "Bopal", "Satellite", "Maninagar", "Gota",
  "Vastrapur", "Chandkheda", "Nikol", "Vastral", "Naroda", "CTM", "Odhav"
] as const;

export type Zone = typeof ZONES[number];
export type BinType = "public" | "market" | "stadium" | "residential";
export type BinStatus = "active" | "maintenance" | "offline";
export type TruckStatus = "en-route" | "collecting" | "idle" | "returning";
export type AlertSeverity = "critical" | "warning" | "info";
export type AlertType = "overflow" | "deviation" | "missed-collection" | "sensor-failure";
export type UserRole = "super-admin" | "city-operator" | "truck-supervisor";

export interface Bin {
  id: string;
  zone: Zone;
  type: BinType;
  capacity: number;
  fillLevel: number;
  lat: number;
  lng: number;
  address: string;
  lastCollected: string;
  status: BinStatus;
  predictedFullAt: string;
  fillHistory: { hour: number; level: number }[];
}

export interface Truck {
  id: string;
  driverName: string;
  phone: string;
  status: TruckStatus;
  currentRoute: string[];
  binsCollected: number;
  totalBins: number;
  lat: number;
  lng: number;
  fuelLevel: number;
  timeline: { time: string; event: string }[];
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  binId?: string;
  truckId?: string;
  timestamp: string;
  resolved: boolean;
  zone: Zone;
}

const BIN_TYPES: BinType[] = ["public", "market", "stadium", "residential"];
const STATUSES: BinStatus[] = ["active", "active", "active", "active", "active", "maintenance", "offline"];

const ADDRESSES: Record<Zone, string[]> = {
  Navrangpura: ["CG Road", "Law Garden", "Polytechnic Road", "Navrangpura Bus Stand", "Gujarat University Road"],
  Bopal: ["Bopal Cross Road", "South Bopal", "Shilaj Road", "Ghuma Circle", "SP Ring Road"],
  Satellite: ["Jodhpur Cross Road", "Prahladnagar Road", "Anand Nagar Road", "Satellite Road", "Shyamal Cross Road"],
  Maninagar: ["Maninagar Station Road", "Kagdapith", "Jamalpur", "Raipur Gate", "Kalupur"],
  Gota: ["Gota Cross Road", "Ognaj", "Sargasan Circle", "Vaishnodevi Circle", "SG Highway"],
  Vastrapur: ["IIM Road", "Vastrapur Lake", "Helmet Circle", "Bodakdev", "Thaltej Cross Road"],
  Chandkheda: ["Chandkheda Circle", "Zundal", "Adalaj", "Koba Circle", "Infocity"],
  Nikol: ["Nikol Cross Road", "Naroda Road", "Saijpur", "Krishnanagar", "Thakkarnagar"],
  Vastral: ["Vastral Road", "Odhav Ring Road", "Vastral Circle", "Amraiwadi", "Rakhial"],
  Naroda: ["Naroda Patiya", "GIDC Naroda", "Kubernagar", "Saraspur", "Naroda Gam"],
  CTM: ["CTM Cross Road", "Amraiwadi", "Bapunagar", "Rakhial Road", "Shah Alam Road"],
  Odhav: ["GIDC Odhav", "Odhav Cross Road", "Ramol", "Hathijan", "Vinzol"],
};

function generateFillHistory(currentLevel: number): { hour: number; level: number }[] {
  const history: { hour: number; level: number }[] = [];
  let level = Math.max(5, currentLevel - Math.random() * 40 - 20);
  for (let h = 0; h < 24; h++) {
    level = Math.min(100, Math.max(0, level + (Math.random() * 8 - 2)));
    history.push({ hour: h, level: Math.round(level) });
  }
  history[23] = { hour: 23, level: currentLevel };
  return history;
}

function randomDate(hoursAgo: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

function predictedFull(fillLevel: number): string {
  if (fillLevel >= 95) return "Full now";
  const hoursLeft = ((100 - fillLevel) / (Math.random() * 8 + 2));
  const d = new Date();
  d.setHours(d.getHours() + hoursLeft);
  return d.toISOString();
}

// Predefined land-based coordinates for Ahmedabad zones (avoiding Sabarmati river area ~72.56-72.58 near lat 23.02-23.06)
const ZONE_COORDS: Record<Zone, { latMin: number; latMax: number; lngMin: number; lngMax: number }> = {
  Navrangpura: { latMin: 23.03, latMax: 23.05, lngMin: 72.54, lngMax: 72.56 },
  Bopal: { latMin: 23.01, latMax: 23.04, lngMin: 72.46, lngMax: 72.50 },
  Satellite: { latMin: 23.02, latMax: 23.04, lngMin: 72.50, lngMax: 72.53 },
  Maninagar: { latMin: 23.00, latMax: 23.02, lngMin: 72.59, lngMax: 72.63 },
  Gota: { latMin: 23.08, latMax: 23.11, lngMin: 72.51, lngMax: 72.55 },
  Vastrapur: { latMin: 23.03, latMax: 23.05, lngMin: 72.51, lngMax: 72.54 },
  Chandkheda: { latMin: 23.10, latMax: 23.12, lngMin: 72.56, lngMax: 72.60 },
  Nikol: { latMin: 23.04, latMax: 23.07, lngMin: 72.63, lngMax: 72.67 },
  Vastral: { latMin: 23.00, latMax: 23.03, lngMin: 72.63, lngMax: 72.67 },
  Naroda: { latMin: 23.06, latMax: 23.09, lngMin: 72.63, lngMax: 72.67 },
  CTM: { latMin: 23.03, latMax: 23.05, lngMin: 72.60, lngMax: 72.63 },
  Odhav: { latMin: 23.01, latMax: 23.04, lngMin: 72.66, lngMax: 72.70 },
};

// Seeded random to keep consistent positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function generateLandCoordinate(index: number): { lat: number; lng: number } {
  const zone = ZONES[index % ZONES.length];
  const bounds = ZONE_COORDS[zone];
  const r1 = seededRandom(index * 7 + 13);
  const r2 = seededRandom(index * 11 + 37);
  return {
    lat: bounds.latMin + r1 * (bounds.latMax - bounds.latMin),
    lng: bounds.lngMin + r2 * (bounds.lngMax - bounds.lngMin),
  };
}

export function generateBins(count: number = 847): Bin[] {
  const bins: Bin[] = [];
  for (let i = 0; i < count; i++) {
    const zone = ZONES[i % ZONES.length];
    const addrs = ADDRESSES[zone];
    const isMarketZone = ["Maninagar", "Navrangpura", "CTM", "Naroda"].includes(zone);
    let fillLevel: number;
    if (isMarketZone && Math.random() < 0.3) {
      fillLevel = Math.round(75 + Math.random() * 25);
    } else {
      fillLevel = Math.round(15 + Math.random() * 50);
    }
    const binType = isMarketZone && Math.random() < 0.4 ? "market" : BIN_TYPES[Math.floor(Math.random() * BIN_TYPES.length)];
    bins.push({
      id: `BIN-AMD-${String(i + 1).padStart(4, "0")}`,
      zone,
      type: binType,
      capacity: [120, 240, 360, 660][Math.floor(Math.random() * 4)],
      fillLevel,
      lat: generateLandCoordinate(i).lat,
      lng: generateLandCoordinate(i).lng,
      address: `${addrs[i % addrs.length]}, ${zone}`,
      lastCollected: randomDate(Math.floor(Math.random() * 12 + 1)),
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      predictedFullAt: predictedFull(fillLevel),
      fillHistory: generateFillHistory(fillLevel),
    });
  }
  return bins;
}

export const TRUCKS: Truck[] = [
  {
    id: "TRK-AMD-01", driverName: "Ramesh Patel", phone: "+91 98765 43210",
    status: "collecting", currentRoute: ["BIN-AMD-0012", "BIN-AMD-0045", "BIN-AMD-0078", "BIN-AMD-0112", "BIN-AMD-0156", "BIN-AMD-0189", "BIN-AMD-0201", "BIN-AMD-0234"],
    binsCollected: 3, totalBins: 8, lat: 23.03, lng: 72.56, fuelLevel: 72,
    timeline: [
      { time: "06:00", event: "Started shift" }, { time: "06:30", event: "First collection at Navrangpura" },
      { time: "07:15", event: "Collected 3 bins in CG Road" }, { time: "08:00", event: "En route to Satellite" },
    ],
  },
  {
    id: "TRK-AMD-02", driverName: "Suresh Kumar", phone: "+91 98765 43211",
    status: "en-route", currentRoute: ["BIN-AMD-0301", "BIN-AMD-0334", "BIN-AMD-0367", "BIN-AMD-0400", "BIN-AMD-0433", "BIN-AMD-0466"],
    binsCollected: 0, totalBins: 6, lat: 23.05, lng: 72.53, fuelLevel: 95,
    timeline: [
      { time: "06:00", event: "Started shift" }, { time: "06:15", event: "Vehicle inspection" },
      { time: "06:30", event: "Departed depot" },
    ],
  },
  {
    id: "TRK-AMD-03", driverName: "Mahesh Sharma", phone: "+91 98765 43212",
    status: "collecting", currentRoute: ["BIN-AMD-0501", "BIN-AMD-0534", "BIN-AMD-0567", "BIN-AMD-0600", "BIN-AMD-0633"],
    binsCollected: 4, totalBins: 5, lat: 23.07, lng: 72.58, fuelLevel: 45,
    timeline: [
      { time: "06:00", event: "Started shift" }, { time: "06:45", event: "First collection at Bopal" },
      { time: "07:30", event: "Collected 2 bins at SP Ring Road" }, { time: "08:15", event: "Collected 2 more at Ghuma" },
    ],
  },
  {
    id: "TRK-AMD-04", driverName: "Dinesh Joshi", phone: "+91 98765 43213",
    status: "idle", currentRoute: [], binsCollected: 0, totalBins: 0,
    lat: 23.02, lng: 72.55, fuelLevel: 88,
    timeline: [{ time: "06:00", event: "Scheduled start: 09:00" }],
  },
  {
    id: "TRK-AMD-05", driverName: "Arvind Singh", phone: "+91 98765 43214",
    status: "returning", currentRoute: ["BIN-AMD-0700", "BIN-AMD-0733", "BIN-AMD-0766", "BIN-AMD-0799"],
    binsCollected: 4, totalBins: 4, lat: 23.04, lng: 72.60, fuelLevel: 30,
    timeline: [
      { time: "05:30", event: "Started shift" }, { time: "06:00", event: "First collection at Nikol" },
      { time: "07:30", event: "All collections complete" }, { time: "08:00", event: "Returning to depot" },
    ],
  },
  {
    id: "TRK-AMD-06", driverName: "Prakash Thakor", phone: "+91 98765 43215",
    status: "en-route", currentRoute: ["BIN-AMD-0820", "BIN-AMD-0825", "BIN-AMD-0830", "BIN-AMD-0835", "BIN-AMD-0840", "BIN-AMD-0845", "BIN-AMD-0847"],
    binsCollected: 2, totalBins: 7, lat: 23.08, lng: 72.54, fuelLevel: 60,
    timeline: [
      { time: "06:00", event: "Started shift" }, { time: "06:20", event: "Departed depot" },
      { time: "07:00", event: "Collected 2 bins at Odhav GIDC" },
    ],
  },
];

export function generateAlerts(): Alert[] {
  return [
    { id: "ALT-001", type: "overflow", severity: "critical", message: "Bin BIN-AMD-0042 in Maninagar has reached 98% capacity", binId: "BIN-AMD-0042", timestamp: randomDate(0.5), resolved: false, zone: "Maninagar" },
    { id: "ALT-002", type: "overflow", severity: "critical", message: "Bin BIN-AMD-0118 at CG Road, Navrangpura overflowing", binId: "BIN-AMD-0118", timestamp: randomDate(1), resolved: false, zone: "Navrangpura" },
    { id: "ALT-003", type: "deviation", severity: "warning", message: "TRK-AMD-03 deviated from assigned route near Bopal Cross Road", truckId: "TRK-AMD-03", timestamp: randomDate(0.3), resolved: false, zone: "Bopal" },
    { id: "ALT-004", type: "missed-collection", severity: "warning", message: "Scheduled collection missed for Zone CTM — Bins BIN-AMD-0650 to 0660", timestamp: randomDate(2), resolved: false, zone: "CTM" },
    { id: "ALT-005", type: "sensor-failure", severity: "info", message: "Sensor offline for BIN-AMD-0320 at Gota Cross Road", binId: "BIN-AMD-0320", timestamp: randomDate(3), resolved: false, zone: "Gota" },
    { id: "ALT-006", type: "overflow", severity: "critical", message: "Bin BIN-AMD-0555 at Naroda Patiya is at 96% capacity", binId: "BIN-AMD-0555", timestamp: randomDate(0.8), resolved: false, zone: "Naroda" },
    { id: "ALT-007", type: "sensor-failure", severity: "info", message: "Intermittent signal from BIN-AMD-0710 at Nikol", binId: "BIN-AMD-0710", timestamp: randomDate(5), resolved: true, zone: "Nikol" },
    { id: "ALT-008", type: "deviation", severity: "warning", message: "TRK-AMD-06 stopped for >15 min at Odhav GIDC", truckId: "TRK-AMD-06", timestamp: randomDate(1.5), resolved: false, zone: "Odhav" },
    { id: "ALT-009", type: "missed-collection", severity: "warning", message: "Evening collection delayed in Vastrapur zone", timestamp: randomDate(6), resolved: true, zone: "Vastrapur" },
    { id: "ALT-010", type: "overflow", severity: "critical", message: "Multiple bins critical in Chandkheda market area", timestamp: randomDate(0.2), resolved: false, zone: "Chandkheda" },
    { id: "ALT-011", type: "sensor-failure", severity: "info", message: "Battery low on sensor BIN-AMD-0200 at Satellite Road", binId: "BIN-AMD-0200", timestamp: randomDate(8), resolved: true, zone: "Satellite" },
    { id: "ALT-012", type: "overflow", severity: "critical", message: "Bin BIN-AMD-0400 at Vastral Circle at 95% capacity", binId: "BIN-AMD-0400", timestamp: randomDate(0.1), resolved: false, zone: "Vastral" },
  ];
}

export const ANALYTICS_DATA = {
  collectionEfficiency: [
    { month: "Oct", efficiency: 72 }, { month: "Nov", efficiency: 76 },
    { month: "Dec", efficiency: 74 }, { month: "Jan", efficiency: 81 },
    { month: "Feb", efficiency: 85 }, { month: "Mar", efficiency: 89 },
  ],
  fuelData: [
    { month: "Oct", consumed: 2800, saved: 400 }, { month: "Nov", consumed: 2600, saved: 600 },
    { month: "Dec", consumed: 2700, saved: 550 }, { month: "Jan", consumed: 2400, saved: 800 },
    { month: "Feb", consumed: 2200, saved: 1000 }, { month: "Mar", consumed: 2100, saved: 1150 },
  ],
  peakHours: [
    { hour: "6AM", waste: 120 }, { hour: "7AM", waste: 280 }, { hour: "8AM", waste: 350 },
    { hour: "9AM", waste: 310 }, { hour: "10AM", waste: 240 }, { hour: "11AM", waste: 180 },
    { hour: "12PM", waste: 290 }, { hour: "1PM", waste: 320 }, { hour: "2PM", waste: 260 },
    { hour: "3PM", waste: 200 }, { hour: "4PM", waste: 230 }, { hour: "5PM", waste: 340 },
    { hour: "6PM", waste: 380 }, { hour: "7PM", waste: 300 }, { hour: "8PM", waste: 220 },
  ],
  zoneWaste: ZONES.map((zone) => ({
    zone,
    daily: Math.round(800 + Math.random() * 1200),
    weekly: Math.round(5000 + Math.random() * 8000),
    monthly: Math.round(20000 + Math.random() * 35000),
    intensity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as string,
  })),
  survekshanScore: [
    { month: "Oct", score: 3200 }, { month: "Nov", score: 3350 },
    { month: "Dec", score: 3280 }, { month: "Jan", score: 3500 },
    { month: "Feb", score: 3650 }, { month: "Mar", score: 3800 },
  ],
  monthlySummary: {
    totalCollections: 12450,
    totalWaste: "4,280 tonnes",
    avgEfficiency: "84%",
    fuelSaved: "₹2.8 Lakhs",
    complaints: 42,
    resolved: 38,
  },
};
