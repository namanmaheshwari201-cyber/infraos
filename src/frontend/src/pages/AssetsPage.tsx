import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Download,
  FileText,
  MapPin,
  MessageSquare,
  Radio,
  Shield,
  TrendingDown,
  Wifi,
  WifiOff,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useOrg } from "../context/OrgContext";
import { SMART_CITIES_ASSETS, getOrgData } from "../data/orgData";

// ── Static Data ───────────────────────────────────────────────────────────────

const HEALTH_ASSETS = [
  {
    id: "BR-NH48-234",
    name: "NH-48 Overbridge Km 234",
    type: "Bridges",
    health: 72,
    condition: "Fair",
    conditionColor: "#FFB300",
    trend: [75, 74, 73, 73, 72],
    lastInspection: "12 Jan 2026",
    nextInspection: "12 Jul 2026",
    sensorAlerts: 2,
    maintenanceDue: "Aug 2026",
  },
  {
    id: "RD-DRR-R7",
    name: "Delhi Ring Road Stretch R-7",
    type: "Roads",
    health: 45,
    condition: "Poor",
    conditionColor: "#FF8C42",
    trend: [58, 54, 51, 48, 45],
    lastInspection: "03 Nov 2025",
    nextInspection: "03 Feb 2026",
    sensorAlerts: 5,
    maintenanceDue: "OVERDUE",
  },
  {
    id: "TN-MPE-T3",
    name: "Mumbai-Pune Expressway Tunnel T-3",
    type: "Tunnels",
    health: 88,
    condition: "Good",
    conditionColor: "#00E676",
    trend: [90, 90, 89, 89, 88],
    lastInspection: "22 Feb 2026",
    nextInspection: "22 Aug 2026",
    sensorAlerts: 0,
    maintenanceDue: "Sep 2026",
  },
  {
    id: "RD-YEX-165",
    name: "Yamuna Expressway Km 165-170",
    type: "Roads",
    health: 61,
    condition: "Moderate",
    conditionColor: "#FFB300",
    trend: [66, 65, 64, 62, 61],
    lastInspection: "18 Dec 2025",
    nextInspection: "18 Jun 2026",
    sensorAlerts: 3,
    maintenanceDue: "Jul 2026",
  },
  {
    id: "RD-JNPT-AP",
    name: "JNPT Approach Road",
    type: "Port Roads",
    health: 83,
    condition: "Good",
    conditionColor: "#00E676",
    trend: [85, 84, 84, 83, 83],
    lastInspection: "09 Mar 2026",
    nextInspection: "09 Sep 2026",
    sensorAlerts: 1,
    maintenanceDue: "Oct 2026",
  },
  {
    id: "BR-NH24-FC",
    name: "NH-24 Flyover Complex",
    type: "Bridges",
    health: 38,
    condition: "Critical",
    conditionColor: "#FF3D00",
    trend: [55, 49, 44, 41, 38],
    lastInspection: "15 Aug 2025",
    nextInspection: "15 Feb 2026",
    sensorAlerts: 7,
    maintenanceDue: "OVERDUE",
  },
  {
    id: "MT-DMV-V12",
    name: "Delhi Metro Viaduct Section V12",
    type: "Metro",
    health: 91,
    condition: "Excellent",
    conditionColor: "#00E676",
    trend: [92, 92, 91, 91, 91],
    lastInspection: "05 Apr 2026",
    nextInspection: "05 Oct 2026",
    sensorAlerts: 0,
    maintenanceDue: "Nov 2026",
  },
  {
    id: "BR-BWS-ST",
    name: "Bandra-Worli Sea Link South Tower",
    type: "Bridges",
    health: 79,
    condition: "Good",
    conditionColor: "#00E676",
    trend: [82, 81, 81, 80, 79],
    lastInspection: "28 Jan 2026",
    nextInspection: "28 Jul 2026",
    sensorAlerts: 1,
    maintenanceDue: "Aug 2026",
  },
];

const UPCOMING_INSPECTIONS = [
  {
    ref: "INSP/2024/0841",
    asset: "NH-48 Overbridge Km 234",
    date: "15 May 2026",
    type: "Structural",
    agency: "SECON Pvt Ltd",
    status: "SCHEDULED",
  },
  {
    ref: "INSP/2024/0842",
    asset: "Delhi Ring Road Stretch R-7",
    date: "18 May 2026",
    type: "Emergency",
    agency: "NHAI Internal",
    status: "URGENT",
  },
  {
    ref: "INSP/2024/0843",
    asset: "Yamuna Expressway Km 165-170",
    date: "22 May 2026",
    type: "Pre-monsoon",
    agency: "IIT Delhi",
    status: "SCHEDULED",
  },
  {
    ref: "INSP/2024/0844",
    asset: "NH-24 Flyover Complex",
    date: "12 May 2026",
    type: "Comprehensive",
    agency: "Feedback Infrastructure",
    status: "IN PROGRESS",
  },
];

const PREDICTIVE_RISKS = [
  {
    name: "Mahanadi Bridge Cuttack",
    risk: 78,
    timeframe: "within 18 months",
    confidence: "HIGH",
    issue:
      "Advanced corrosion in girder joints. Load-bearing capacity reduced to estimated 67% of original. Immediate inspection recommended.",
    urgency: "CRITICAL",
  },
  {
    name: "Vembanad Rail Bridge",
    risk: 71,
    timeframe: "within 18 months",
    confidence: "HIGH",
    issue:
      "Salt corrosion in marine environment progressing faster than planned. Maintenance behind schedule by 14 months.",
    urgency: "CRITICAL",
  },
  {
    name: "Brahmaputra Rail Bridge",
    risk: 64,
    timeframe: "within 24 months",
    confidence: "MEDIUM",
    issue:
      "Pier scour depth exceeding safety thresholds. Monsoon season amplifies risk. Emergency maintenance allocated.",
    urgency: "HIGH",
  },
  {
    name: "Godavari Rail Bridge",
    risk: 52,
    timeframe: "within 30 months",
    confidence: "MEDIUM",
    issue:
      "Foundation settlement detected via sensor network. Deflection monitoring shows 12mm variance from baseline.",
    urgency: "HIGH",
  },
  {
    name: "Delhi-Agra Expressway Bridge",
    risk: 38,
    timeframe: "within 36 months",
    confidence: "MEDIUM",
    issue:
      "Pot bearing deterioration detected. Routine replacement recommended in next scheduled maintenance cycle.",
    urgency: "MEDIUM",
  },
];

const SENSOR_TYPES = [
  { label: "Structural Load", total: 890, online: 884, warning: 6, offline: 0 },
  {
    label: "Corrosion Monitors",
    total: 456,
    online: 432,
    warning: 24,
    offline: 0,
  },
  {
    label: "Deflection Sensors",
    total: 234,
    online: 198,
    warning: 0,
    offline: 36,
  },
  { label: "Environmental", total: 760, online: 742, warning: 0, offline: 18 },
];

const SENSOR_ALERTS = [
  {
    status: "OFFLINE",
    asset: "Mahanadi Bridge",
    desc: "Pier 7 structural load sensor offline for 23 days. Last reading: 94% load capacity.",
  },
  {
    status: "WARNING",
    asset: "Brahmaputra Bridge",
    desc: "Scour monitor reading 2.3m depth vs 1.8m baseline. Monsoon season approaching.",
  },
  {
    status: "WARNING",
    asset: "Godavari Bridge",
    desc: "Deflection sensor cluster showing +12mm variance from design baseline.",
  },
  {
    status: "OFFLINE",
    asset: "Vembanad Bridge",
    desc: "4 of 6 corrosion monitors offline. Battery replacement overdue.",
  },
  {
    status: "OK",
    asset: "Bandra-Worli Sea Link",
    desc: "All 48 sensors nominal. Last calibration 15 Dec 2025.",
  },
];

const DEGRADATION_TREND = [
  { year: "2020", bridges: 87, highways: 81, tunnels: 94, metro: 96 },
  { year: "2021", bridges: 83, highways: 80, tunnels: 93, metro: 95 },
  { year: "2022", bridges: 79, highways: 78, tunnels: 92, metro: 94 },
  { year: "2023", bridges: 75, highways: 76, tunnels: 91, metro: 93 },
  { year: "2024", bridges: 71, highways: 74, tunnels: 90, metro: 92 },
  { year: "2025", bridges: 67, highways: 73, tunnels: 89, metro: 91 },
  { year: "2026", bridges: 64, highways: 72, tunnels: 89, metro: 91 },
];

const COMPLAINTS = [
  {
    count: 234,
    asset: "Mumbai Ring Road",
    issue: "Waterlogging, drainage failure",
    density: "HIGH",
  },
  {
    count: 134,
    asset: "NH-44 Pune-Bengaluru",
    issue: "Road surface deterioration, potholes",
    density: "HIGH",
  },
  {
    count: 89,
    asset: "Kolkata Metro Blue Line",
    issue: "Platform floor cracking",
    density: "MEDIUM",
  },
  {
    count: 67,
    asset: "Delhi-Agra Expressway",
    issue: "Median barrier deterioration",
    density: "MEDIUM",
  },
  {
    count: 45,
    asset: "Chennai Expressway",
    issue: "Street lighting failures",
    density: "LOW",
  },
];

const REPAIR_MATRIX = [
  {
    label: "IMMEDIATE ACTION",
    urgency: "HIGH",
    impact: "HIGH",
    count: 34,
    budget: "₹890 Cr",
    color: "#FF3D00",
    bg: "rgba(255,61,0,0.08)",
    border: "rgba(255,61,0,0.25)",
    assets: [
      "Mahanadi Bridge Cuttack",
      "Vembanad Rail Bridge",
      "Brahmaputra Rail Bridge",
    ],
    position: "top-right",
  },
  {
    label: "SCHEDULE SOON",
    urgency: "HIGH",
    impact: "LOW",
    count: 67,
    budget: "₹340 Cr",
    color: "#FF8C42",
    bg: "rgba(255,140,66,0.08)",
    border: "rgba(255,140,66,0.25)",
    assets: ["Godavari Rail Bridge", "Delhi-Agra Expressway Bridge"],
    position: "top-left",
  },
  {
    label: "PLAN NEXT QUARTER",
    urgency: "LOW",
    impact: "HIGH",
    count: 123,
    budget: "₹620 Cr",
    color: "#FFB300",
    bg: "rgba(255,179,0,0.08)",
    border: "rgba(255,179,0,0.25)",
    assets: ["Bandra-Worli Sea Link", "NH-44 Section", "Chennai Water Plant"],
    position: "bottom-right",
  },
  {
    label: "ROUTINE CYCLE",
    urgency: "LOW",
    impact: "LOW",
    count: 234,
    budget: "₹490 Cr",
    color: "#00D4FF",
    bg: "rgba(0,212,255,0.06)",
    border: "rgba(0,212,255,0.2)",
    assets: ["Zojila Pass Tunnel", "Delhi Metro Blue Line Depot"],
    position: "bottom-left",
  },
];

const INSPECTION_TYPES = [
  "Routine",
  "Structural",
  "Emergency",
  "Comprehensive",
  "Pre-monsoon",
  "Post-monsoon",
];
const INSPECTION_AGENCIES = [
  "NHAI Internal",
  "Third Party Engineer",
  "IIT Delhi",
  "SECON Pvt Ltd",
  "Feedback Infrastructure",
];
const SCOPE_OPTIONS = [
  "Visual Survey",
  "Load Testing",
  "NDT",
  "Drainage Check",
  "Structural Assessment",
  "Sensor Calibration",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const healthColor = (h: number) =>
  h >= 70 ? "#00E676" : h >= 50 ? "#FFB300" : "#FF3D00";

const priorityBadge = (p: string) => {
  const map: Record<string, string> = {
    CRITICAL: "badge-critical",
    HIGH: "badge-high",
    MEDIUM: "badge-warning",
    LOW: "badge-success",
  };
  return map[p] ?? "badge-low";
};

const sensorBadge = (s: string) => {
  const map: Record<string, string> = {
    Online: "badge-success",
    Offline: "badge-critical",
    Warning: "badge-warning",
  };
  return map[s] ?? "badge-low";
};

const sensorIcon = (s: string) => {
  if (s === "Online") return <Wifi size={12} style={{ color: "#00E676" }} />;
  if (s === "Offline")
    return <WifiOff size={12} style={{ color: "#FF3D00" }} />;
  return <Radio size={12} style={{ color: "#FFB300" }} />;
};

const alertStatusConfig = {
  OFFLINE: { cls: "badge-critical", icon: <WifiOff size={10} /> },
  WARNING: { cls: "badge-warning", icon: <AlertTriangle size={10} /> },
  OK: { cls: "badge-success", icon: <CheckCircle2 size={10} /> },
} as const;

type AlertStatus = keyof typeof alertStatusConfig;

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 24;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      width={w}
      height={h}
      className="flex-shrink-0"
      aria-label="Health trend sparkline"
      role="img"
    >
      <title>Health trend</title>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Chart Tooltip ─────────────────────────────────────────────────────────────
const ChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs" style={{ minWidth: 140 }}>
      <div className="text-label mb-2">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4 mb-0.5">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono font-bold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  sub,
  action,
}: {
  icon: React.ElementType;
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between px-5 py-3.5 border-b border-border/20">
      <div className="flex items-center gap-2.5">
        <Icon size={14} className="text-primary flex-shrink-0" />
        <div>
          <h2 className="font-semibold text-sm text-foreground">{title}</h2>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ── Asset Health Monitor Panel ────────────────────────────────────────────────
function AssetHealthMonitorPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("All Assets");
  const tabs = [
    "All Assets",
    "Critical",
    "Bridges",
    "Roads",
    "Tunnels",
    "Metro",
  ];

  const filtered = HEALTH_ASSETS.filter((a) => {
    if (activeTab === "All Assets") return true;
    if (activeTab === "Critical") return a.health < 50;
    return (
      a.type === activeTab || (activeTab === "Roads" && a.type === "Port Roads")
    );
  });

  const handleExportReport = () => {
    const rows = [
      [
        "Asset ID",
        "Name",
        "Type",
        "Health Score",
        "Condition",
        "Last Inspection",
        "Next Inspection",
        "Sensor Alerts",
        "Maintenance Due",
      ],
      ...HEALTH_ASSETS.map((a) => [
        a.id,
        a.name,
        a.type,
        a.health.toString(),
        a.condition,
        a.lastInspection,
        a.nextInspection,
        a.sensorAlerts.toString(),
        a.maintenanceDue,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "InfraOS_Asset_Health_Report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Asset health report exported successfully");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
      data-ocid="assets.health_monitor.dialog"
    >
      <div
        className="flex flex-col w-full h-full overflow-auto"
        style={{
          background: "rgba(10,12,18,0.98)",
          border: "1px solid rgba(0,212,255,0.15)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{
            borderColor: "rgba(0,212,255,0.15)",
            background: "rgba(0,212,255,0.03)",
          }}
        >
          <div className="flex items-center gap-3">
            <Activity size={18} style={{ color: "#00D4FF" }} />
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">
                Asset Health Monitoring Dashboard
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time infrastructure health intelligence · InfraOS Asset
                Intelligence Layer
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn-primary text-sm flex items-center gap-2"
              onClick={handleExportReport}
              data-ocid="assets.health_monitor.export_button"
            >
              <Download size={13} />
              Export Health Report
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded transition-colors hover:bg-white/10"
              style={{ color: "rgba(176,190,197,0.6)" }}
              data-ocid="assets.health_monitor.close_button"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4 flex-shrink-0">
          {[
            { label: "Total Assets", value: "1,247", color: "#00D4FF" },
            { label: "Critical (Health < 50)", value: "23", color: "#FF3D00" },
            { label: "Due Inspection", value: "89", color: "#FFB300" },
            { label: "Active Sensor Alerts", value: "14", color: "#FF8C42" },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(0,212,255,0.1)",
              }}
            >
              <div
                className="font-mono font-bold text-2xl"
                style={{ color: k.color }}
              >
                {k.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {k.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className="flex items-center gap-1 px-6 pb-0 flex-shrink-0 border-b"
          style={{ borderColor: "rgba(0,212,255,0.1)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2.5 text-xs font-medium transition-colors border-b-2"
              style={{
                borderColor: activeTab === tab ? "#00D4FF" : "transparent",
                color: activeTab === tab ? "#00D4FF" : "rgba(176,190,197,0.6)",
              }}
              data-ocid={`assets.health_monitor.tab.${tab.replace(/\s/g, "_").toLowerCase()}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Asset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6 flex-1">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="rounded-lg p-4 flex flex-col gap-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${asset.health < 50 ? "rgba(255,61,0,0.3)" : "rgba(0,212,255,0.1)"}`,
              }}
              data-ocid={`assets.health_monitor.card.${asset.id}`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground leading-tight">
                    {asset.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {asset.id}
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                  style={{
                    background: `${asset.conditionColor}18`,
                    color: asset.conditionColor,
                    border: `1px solid ${asset.conditionColor}40`,
                  }}
                >
                  {asset.condition}
                </span>
              </div>

              {/* Health Gauge */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">
                    Health Score
                  </span>
                  <span
                    className="font-mono font-bold text-lg"
                    style={{ color: healthColor(asset.health) }}
                  >
                    {asset.health}%
                  </span>
                </div>
                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${asset.health}%`,
                      background: `linear-gradient(90deg, ${healthColor(asset.health)}80, ${healthColor(asset.health)})`,
                    }}
                  />
                </div>
              </div>

              {/* Trend Sparkline */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Trend (5 qtr)
                </span>
                <Sparkline
                  data={asset.trend}
                  color={healthColor(asset.health)}
                />
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div
                    className="text-muted-foreground"
                    style={{ fontSize: "0.62rem" }}
                  >
                    LAST INSPECTION
                  </div>
                  <div className="text-foreground font-medium mt-0.5">
                    {asset.lastInspection}
                  </div>
                </div>
                <div>
                  <div
                    className="text-muted-foreground"
                    style={{ fontSize: "0.62rem" }}
                  >
                    NEXT INSPECTION
                  </div>
                  <div className="text-foreground font-medium mt-0.5">
                    {asset.nextInspection}
                  </div>
                </div>
                <div>
                  <div
                    className="text-muted-foreground"
                    style={{ fontSize: "0.62rem" }}
                  >
                    SENSOR ALERTS
                  </div>
                  <div
                    className="font-mono font-bold mt-0.5"
                    style={{
                      color:
                        asset.sensorAlerts > 3
                          ? "#FF3D00"
                          : asset.sensorAlerts > 0
                            ? "#FFB300"
                            : "#00E676",
                    }}
                  >
                    {asset.sensorAlerts} active
                  </div>
                </div>
                <div>
                  <div
                    className="text-muted-foreground"
                    style={{ fontSize: "0.62rem" }}
                  >
                    MAINTENANCE DUE
                  </div>
                  <div
                    className="font-medium mt-0.5"
                    style={{
                      color:
                        asset.maintenanceDue === "OVERDUE"
                          ? "#FF3D00"
                          : "#00E676",
                    }}
                  >
                    {asset.maintenanceDue}
                  </div>
                </div>
              </div>

              {/* Type badge */}
              <div
                className="text-xs px-2 py-0.5 rounded self-start"
                style={{ background: "rgba(0,212,255,0.1)", color: "#00D4FF" }}
              >
                {asset.type}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-4 flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Shield size={36} className="mb-3 opacity-30" />
              <p className="text-sm">No assets found for this filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Schedule Inspection Modal ─────────────────────────────────────────────────
function ScheduleInspectionModal({ onClose }: { onClose: () => void }) {
  const [assetId, setAssetId] = useState("");
  const [inspType, setInspType] = useState("Routine");
  const [date, setDate] = useState("");
  const [agency, setAgency] = useState("NHAI Internal");
  const [inspector, setInspector] = useState("");
  const [scope, setScope] = useState<string[]>([]);
  const [priority, setPriority] = useState("Normal");
  const [instructions, setInstructions] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const toggleScope = (item: string) =>
    setScope((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item],
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId || !date) {
      toast.error("Please select an asset and inspection date.");
      return;
    }
    setConfirmed(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
      data-ocid="assets.schedule_inspection.dialog"
    >
      <div
        className="w-full max-w-3xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          background: "rgba(10,12,18,0.98)",
          border: "1px solid rgba(0,212,255,0.2)",
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{
            borderColor: "rgba(0,212,255,0.15)",
            background: "rgba(0,212,255,0.04)",
          }}
        >
          <div className="flex items-center gap-3">
            <Calendar size={16} style={{ color: "#00D4FF" }} />
            <div>
              <h2 className="font-display font-bold text-base text-foreground">
                Schedule Infrastructure Inspection
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Asset Lifecycle Management · InfraOS
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded transition-colors hover:bg-white/10"
            style={{ color: "rgba(176,190,197,0.6)" }}
            data-ocid="assets.schedule_inspection.close_button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {confirmed ? (
            /* Confirmation View */
            <div
              className="flex flex-col items-center py-10 text-center"
              data-ocid="assets.schedule_inspection.success_state"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                style={{
                  background: "rgba(0,230,118,0.1)",
                  border: "1px solid rgba(0,230,118,0.3)",
                }}
              >
                <CheckCircle2 size={32} style={{ color: "#00E676" }} />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                Inspection Scheduled Successfully
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Your inspection has been confirmed and assigned.
              </p>
              <div
                className="rounded-lg p-5 text-left w-full max-w-md"
                style={{
                  background: "rgba(0,212,255,0.05)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Reference No.", "INSP/2024/0847"],
                    ["Asset", assetId],
                    ["Type", inspType],
                    ["Date", date],
                    ["Agency", agency],
                    ["Priority", priority],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div
                        className="text-muted-foreground"
                        style={{ fontSize: "0.65rem" }}
                      >
                        {label.toUpperCase()}
                      </div>
                      <div
                        className="font-semibold text-foreground mt-0.5"
                        style={{
                          color:
                            label === "Reference No." ? "#00D4FF" : undefined,
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
                {scope.length > 0 && (
                  <div className="mt-3">
                    <div
                      className="text-muted-foreground mb-1"
                      style={{ fontSize: "0.65rem" }}
                    >
                      SCOPE OF INSPECTION
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {scope.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            background: "rgba(0,212,255,0.1)",
                            color: "#00D4FF",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  className="btn-secondary text-sm"
                  onClick={() => setConfirmed(false)}
                >
                  Schedule Another
                </button>
                <button
                  type="button"
                  className="btn-primary text-sm"
                  onClick={onClose}
                  data-ocid="assets.schedule_inspection.confirm_button"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Asset Name/ID */}
                  <div>
                    <label
                      htmlFor="insp-asset"
                      className="block text-xs text-muted-foreground mb-1.5"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
                    >
                      ASSET NAME / ID *
                    </label>
                    <select
                      id="insp-asset"
                      className="w-full rounded px-3 py-2.5 text-sm text-foreground"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(0,212,255,0.2)",
                      }}
                      value={assetId}
                      onChange={(e) => setAssetId(e.target.value)}
                      required
                      data-ocid="assets.schedule_inspection.asset_select"
                    >
                      <option value="">-- Select Asset --</option>
                      {HEALTH_ASSETS.map((a) => (
                        <option key={a.id} value={a.name}>
                          {a.name} ({a.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Inspection Type */}
                  <div>
                    <label
                      htmlFor="insp-type"
                      className="block text-xs text-muted-foreground mb-1.5"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
                    >
                      INSPECTION TYPE
                    </label>
                    <select
                      id="insp-type"
                      className="w-full rounded px-3 py-2.5 text-sm text-foreground"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(0,212,255,0.2)",
                      }}
                      value={inspType}
                      onChange={(e) => setInspType(e.target.value)}
                      data-ocid="assets.schedule_inspection.type_select"
                    >
                      {INSPECTION_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Scheduled Date */}
                  <div>
                    <label
                      htmlFor="insp-date"
                      className="block text-xs text-muted-foreground mb-1.5"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
                    >
                      SCHEDULED DATE *
                    </label>
                    <input
                      id="insp-date"
                      type="date"
                      className="w-full rounded px-3 py-2.5 text-sm text-foreground"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(0,212,255,0.2)",
                      }}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      data-ocid="assets.schedule_inspection.date_input"
                    />
                  </div>

                  {/* Inspection Agency */}
                  <div>
                    <label
                      htmlFor="insp-agency"
                      className="block text-xs text-muted-foreground mb-1.5"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
                    >
                      INSPECTION AGENCY
                    </label>
                    <select
                      id="insp-agency"
                      className="w-full rounded px-3 py-2.5 text-sm text-foreground"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(0,212,255,0.2)",
                      }}
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      data-ocid="assets.schedule_inspection.agency_select"
                    >
                      {INSPECTION_AGENCIES.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  {/* Inspector Name */}
                  <div>
                    <label
                      htmlFor="insp-inspector"
                      className="block text-xs text-muted-foreground mb-1.5"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
                    >
                      INSPECTOR NAME
                    </label>
                    <input
                      id="insp-inspector"
                      type="text"
                      placeholder="e.g. Er. Rajesh Kumar, SE"
                      className="w-full rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(0,212,255,0.2)",
                      }}
                      value={inspector}
                      onChange={(e) => setInspector(e.target.value)}
                      data-ocid="assets.schedule_inspection.inspector_input"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <div
                      className="block text-xs text-muted-foreground mb-1.5"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
                    >
                      PRIORITY
                    </div>
                    <div className="flex gap-2">
                      {["Normal", "High", "Emergency"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className="flex-1 py-2 rounded text-xs font-semibold transition-colors"
                          style={{
                            background:
                              priority === p
                                ? p === "Emergency"
                                  ? "rgba(255,61,0,0.2)"
                                  : p === "High"
                                    ? "rgba(255,140,66,0.2)"
                                    : "rgba(0,212,255,0.2)"
                                : "rgba(255,255,255,0.04)",
                            border:
                              priority === p
                                ? p === "Emergency"
                                  ? "1px solid rgba(255,61,0,0.5)"
                                  : p === "High"
                                    ? "1px solid rgba(255,140,66,0.5)"
                                    : "1px solid rgba(0,212,255,0.4)"
                                : "1px solid rgba(255,255,255,0.08)",
                            color:
                              priority === p
                                ? p === "Emergency"
                                  ? "#FF3D00"
                                  : p === "High"
                                    ? "#FF8C42"
                                    : "#00D4FF"
                                : "rgba(176,190,197,0.6)",
                          }}
                          data-ocid={`assets.schedule_inspection.priority_${p.toLowerCase()}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scope Checkboxes */}
                <div>
                  <div
                    className="block text-xs text-muted-foreground mb-2"
                    style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
                  >
                    SCOPE OF INSPECTION
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SCOPE_OPTIONS.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2.5 px-3 py-2 rounded cursor-pointer transition-colors"
                        style={{
                          background: scope.includes(item)
                            ? "rgba(0,212,255,0.1)"
                            : "rgba(255,255,255,0.03)",
                          border: scope.includes(item)
                            ? "1px solid rgba(0,212,255,0.3)"
                            : "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={scope.includes(item)}
                          onChange={() => toggleScope(item)}
                          className="accent-cyan-400"
                          data-ocid={`assets.schedule_inspection.scope_${item.replace(/\s/g, "_").toLowerCase()}`}
                        />
                        <span className="text-xs text-foreground">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label
                    htmlFor="insp-instructions"
                    className="block text-xs text-muted-foreground mb-1.5"
                    style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
                  >
                    SPECIAL INSTRUCTIONS
                  </label>
                  <textarea
                    id="insp-instructions"
                    rows={3}
                    placeholder="Any site-specific requirements, access restrictions, or safety notes..."
                    className="w-full rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(0,212,255,0.2)",
                    }}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    data-ocid="assets.schedule_inspection.instructions_textarea"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3 text-sm font-semibold"
                  data-ocid="assets.schedule_inspection.submit_button"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Calendar size={14} />
                    Schedule Inspection
                  </span>
                </button>
              </form>

              {/* Upcoming Inspections */}
              <div>
                <div
                  className="text-xs font-bold mb-3 pb-2 border-b"
                  style={{
                    color: "rgba(176,190,197,0.7)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    borderColor: "rgba(0,212,255,0.1)",
                  }}
                >
                  UPCOMING SCHEDULED INSPECTIONS
                </div>
                <div className="space-y-2">
                  {UPCOMING_INSPECTIONS.map((insp, i) => (
                    <div
                      key={insp.ref}
                      className="flex items-center gap-4 px-4 py-3 rounded"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(0,212,255,0.08)",
                      }}
                      data-ocid={`assets.schedule_inspection.upcoming.${i + 1}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">
                          {insp.asset}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {insp.ref} · {insp.type} · {insp.agency}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-mono text-foreground">
                          {insp.date}
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded mt-1 inline-block"
                          style={{
                            background:
                              insp.status === "URGENT"
                                ? "rgba(255,61,0,0.15)"
                                : insp.status === "IN PROGRESS"
                                  ? "rgba(0,212,255,0.15)"
                                  : "rgba(0,230,118,0.12)",
                            color:
                              insp.status === "URGENT"
                                ? "#FF3D00"
                                : insp.status === "IN PROGRESS"
                                  ? "#00D4FF"
                                  : "#00E676",
                          }}
                        >
                          {insp.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Export Report Modal ───────────────────────────────────────────────────────
function ExportReportModal({ onClose }: { onClose: () => void }) {
  const [format, setFormat] = useState<"PDF" | "Excel">("Excel");
  const [sections, setSections] = useState<string[]>([
    "Asset Registry",
    "Health Scores",
    "Sensor Diagnostics",
    "Predictive Risks",
  ]);

  const allSections = [
    "Asset Registry",
    "Health Scores",
    "Sensor Diagnostics",
    "Predictive Risks",
    "Degradation Trends",
    "Repair Matrix",
    "Citizen Complaints",
    "Smart Cities Assets",
  ];

  const toggleSection = (s: string) =>
    setSections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const handleDownload = () => {
    const rows = [
      ["InfraOS — Asset Intelligence Report", "", "", "", ""],
      ["Generated:", new Date().toLocaleString(), "", "", ""],
      ["Sections Included:", sections.join(", "), "", "", ""],
      [],
      ["=== ASSET REGISTRY ===", "", "", "", ""],
      [
        "Asset ID",
        "Name",
        "Type",
        "Health Score",
        "Condition",
        "Priority",
        "Last Inspection",
      ],
      ...HEALTH_ASSETS.map((a) => [
        a.id,
        a.name,
        a.type,
        `${a.health}%`,
        a.condition,
        a.health < 50 ? "CRITICAL" : a.health < 70 ? "HIGH" : "NORMAL",
        a.lastInspection,
      ]),
      [],
      ["=== PREDICTIVE FAILURE RISKS ===", "", "", "", ""],
      ["Asset Name", "Failure Risk %", "Timeframe", "Confidence", "Urgency"],
      ...PREDICTIVE_RISKS.map((r) => [
        r.name,
        `${r.risk}%`,
        r.timeframe,
        r.confidence,
        r.urgency,
      ]),
      [],
      ["=== SENSOR DIAGNOSTICS ===", "", "", "", ""],
      ["Sensor Type", "Total", "Online", "Warning", "Offline"],
      ...SENSOR_TYPES.map((s) => [
        s.label,
        s.total,
        s.online,
        s.warning,
        s.offline,
      ]),
    ];
    const csv = (rows as (string | number)[][])
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "InfraOS_Asset_Intelligence_Report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(
      `Asset Intelligence Report exported as ${format === "PDF" ? "CSV/PDF" : "CSV"}`,
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
      data-ocid="assets.export_report.dialog"
    >
      <div
        className="w-full max-w-lg rounded-xl overflow-hidden"
        style={{
          background: "rgba(10,12,18,0.98)",
          border: "1px solid rgba(0,212,255,0.2)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderColor: "rgba(0,212,255,0.15)",
            background: "rgba(0,212,255,0.03)",
          }}
        >
          <div className="flex items-center gap-3">
            <FileText size={16} style={{ color: "#00D4FF" }} />
            <div>
              <h2 className="font-display font-bold text-base text-foreground">
                Export Asset Intelligence Report
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select data sections and export format
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded transition-colors hover:bg-white/10"
            style={{ color: "rgba(176,190,197,0.6)" }}
            data-ocid="assets.export_report.close_button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Format Selection */}
          <div>
            <div
              className="text-xs font-bold mb-3"
              style={{ color: "rgba(176,190,197,0.7)", letterSpacing: "0.1em" }}
            >
              EXPORT FORMAT
            </div>
            <div className="flex gap-3">
              {(["PDF", "Excel"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className="flex-1 py-3 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  style={{
                    background:
                      format === f
                        ? "rgba(0,212,255,0.15)"
                        : "rgba(255,255,255,0.04)",
                    border:
                      format === f
                        ? "1px solid rgba(0,212,255,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",
                    color: format === f ? "#00D4FF" : "rgba(176,190,197,0.6)",
                  }}
                  data-ocid={`assets.export_report.format_${f.toLowerCase()}`}
                >
                  <FileText size={13} />
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className="text-xs font-bold"
                style={{
                  color: "rgba(176,190,197,0.7)",
                  letterSpacing: "0.1em",
                }}
              >
                DATA SECTIONS
              </div>
              <button
                type="button"
                className="text-xs"
                style={{ color: "#00D4FF" }}
                onClick={() =>
                  setSections(
                    sections.length === allSections.length
                      ? []
                      : [...allSections],
                  )
                }
                data-ocid="assets.export_report.select_all_toggle"
              >
                {sections.length === allSections.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {allSections.map((sec) => (
                <label
                  key={sec}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded cursor-pointer transition-colors"
                  style={{
                    background: sections.includes(sec)
                      ? "rgba(0,212,255,0.08)"
                      : "rgba(255,255,255,0.03)",
                    border: sections.includes(sec)
                      ? "1px solid rgba(0,212,255,0.25)"
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={sections.includes(sec)}
                    onChange={() => toggleSection(sec)}
                    className="accent-cyan-400"
                    data-ocid={`assets.export_report.section_${sec.replace(/\s/g, "_").toLowerCase()}`}
                  />
                  <span className="text-xs text-foreground">{sec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div
            className="rounded-lg px-4 py-3 text-xs"
            style={{
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.15)",
            }}
          >
            <span style={{ color: "#00D4FF" }}>
              {sections.length} section{sections.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
            <span className="text-muted-foreground">
              {" "}
              · {HEALTH_ASSETS.length} assets · {PREDICTIVE_RISKS.length} risk
              forecasts
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-secondary flex-1 text-sm"
              onClick={onClose}
              data-ocid="assets.export_report.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
              onClick={handleDownload}
              disabled={sections.length === 0}
              data-ocid="assets.export_report.download_button"
            >
              <Download size={13} />
              Download {format}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AssetsPage() {
  const { selectedOrg } = useOrg();
  const orgData = getOrgData(selectedOrg.key);
  const ASSETS = orgData.assets;
  const criticalAssets = ASSETS.filter((a) => a.priority === "CRITICAL").length;
  const maintenanceDue = ASSETS.filter(
    (a) => a.nextMaintenance === "OVERDUE",
  ).length;
  const sensorsOffline = ASSETS.filter((a) => a.sensor !== "Online").length;

  const [showHealthMonitor, setShowHealthMonitor] = useState(false);
  const [showScheduleInspection, setShowScheduleInspection] = useState(false);
  const [showExportReport, setShowExportReport] = useState(false);

  return (
    <div className="p-6 space-y-5" data-ocid="assets.page">
      {/* ── Modals / Overlays ─────────────────────────────────────────────────── */}
      {showHealthMonitor && (
        <AssetHealthMonitorPanel onClose={() => setShowHealthMonitor(false)} />
      )}
      {showScheduleInspection && (
        <ScheduleInspectionModal
          onClose={() => setShowScheduleInspection(false)}
        />
      )}
      {showExportReport && (
        <ExportReportModal onClose={() => setShowExportReport(false)} />
      )}

      {/* Assets Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
            <span>Home</span>
            <ChevronRight size={10} />
            <span>Intelligence Modules</span>
            <ChevronRight size={10} />
            <span className="text-primary">Asset Intelligence</span>
          </nav>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label">INFRASTRUCTURE LIFECYCLE ENGINE</span>
            <span
              className="badge-low"
              style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem" }}
            >
              LIVE
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            Asset Intelligence
          </h1>
          <div className="flex flex-wrap gap-4 mt-2">
            {[
              {
                v: ASSETS.length.toString(),
                l: "Monitored Assets",
                c: "#00D4FF",
              },
              {
                v: criticalAssets.toString(),
                l: "Critical Health Alerts",
                c: "#FF3D00",
              },
              {
                v: maintenanceDue.toString(),
                l: "Maintenance Due",
                c: "#FFB300",
              },
              {
                v: sensorsOffline.toString(),
                l: "Sensors Offline",
                c: "#FF8C42",
              },
            ].map((s) => (
              <div key={s.l} className="flex items-center gap-1.5">
                <span
                  className="font-mono font-bold text-sm"
                  style={{ color: s.c }}
                >
                  {s.v}
                </span>
                <span className="text-xs text-muted-foreground">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0 flex-wrap">
          <button
            type="button"
            className="btn-secondary text-sm"
            data-ocid="assets.export_report_button"
            onClick={() => setShowExportReport(true)}
          >
            <span className="flex items-center gap-1.5">
              <Download size={13} />
              Export Report
            </span>
          </button>
          <button
            type="button"
            className="btn-secondary text-sm"
            data-ocid="assets.schedule_inspection_button"
            onClick={() => setShowScheduleInspection(true)}
          >
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              Schedule Inspection
            </span>
          </button>
          <button
            type="button"
            className="btn-primary text-sm"
            data-ocid="assets.monitor_health_button"
            onClick={() => setShowHealthMonitor(true)}
          >
            <span className="flex items-center gap-1.5">
              <Activity size={13} />
              Monitor Asset Health
            </span>
          </button>
        </div>
      </div>

      {/* ── KPI Row ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Avg Asset Health Score",
            value: "67",
            unit: "/100",
            color: "#FFB300",
            icon: Shield,
            trend: "↓ 4pts vs last quarter",
          },
          {
            label: "Assets in Critical Zone",
            value: "127",
            unit: "",
            color: "#FF3D00",
            icon: AlertTriangle,
            trend: "Health score < 40",
          },
          {
            label: "Predictive Failures (6-mo)",
            value: "34",
            unit: "",
            color: "#FF8C42",
            icon: TrendingDown,
            trend: "AI confidence: HIGH",
          },
          {
            label: "Annual Maintenance Budget",
            value: "₹2,340",
            unit: " Cr",
            color: "#00D4FF",
            icon: Wrench,
            trend: "FY 2025–26 allocation",
          },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="glass-card kpi-glow p-4"
              data-ocid={`assets.kpi.${i + 1}`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={15} style={{ color: k.color }} />
                <span
                  className="text-xs font-mono"
                  style={{ color: k.color, opacity: 0.7 }}
                >
                  {k.trend}
                </span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span
                  className="font-mono font-bold text-2xl"
                  style={{ color: k.color }}
                >
                  {k.value}
                </span>
                <span className="font-mono text-sm text-muted-foreground">
                  {k.unit}
                </span>
              </div>
              <div className="text-label mt-1.5">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* ── Smart Cities Mission Assets Dashboard ───────────────────────────── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="assets.smart_cities_panel"
      >
        <SectionHeader
          icon={Zap}
          title="Smart Cities Mission — National Asset Dashboard"
          sub="Real-time infrastructure footprint across 100 Smart Cities · Mission Period 2015–2025"
        />
        <div className="p-4">
          {(() => {
            const scaItems = [
              {
                label: "Water Supply Pipelines",
                value:
                  SMART_CITIES_ASSETS.waterSupplyPipelines.km.toLocaleString(),
                unit: "km",
                icon: "💧",
                category: "Water & Sewerage",
              },
              {
                label: "SCADA-Monitored Water",
                value:
                  SMART_CITIES_ASSETS.waterSupplyPipelines.scadaMonitored.toLocaleString(),
                unit: "km",
                icon: "📡",
                category: "Digital Infrastructure",
              },
              {
                label: "Sewerage Pipelines",
                value:
                  SMART_CITIES_ASSETS.seweragePipelines.km.toLocaleString(),
                unit: "km",
                icon: "🔩",
                category: "Water & Sewerage",
              },
              {
                label: "Smart / Public Toilets",
                value: SMART_CITIES_ASSETS.smartToilets.toLocaleString(),
                unit: "units",
                icon: "🏗️",
                category: "Public Sanitation",
              },
              {
                label: "LED / Solar Streetlights",
                value: "2.7M+",
                unit: "units",
                icon: "💡",
                category: "Energy & Lighting",
              },
              {
                label: "Video Surveillance Cameras",
                value: `${SMART_CITIES_ASSETS.videoSurveillanceCameras.toLocaleString()}+`,
                unit: "units",
                icon: "📷",
                category: "Security",
              },
              {
                label: "Emergency Call Boxes",
                value: SMART_CITIES_ASSETS.emergencyCallBoxes.toLocaleString(),
                unit: "units",
                icon: "📞",
                category: "Safety",
              },
            ];
            return (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {scaItems.slice(0, 4).map((asset, i) => (
                    <div
                      key={asset.label}
                      className="glass-elevated rounded p-3 flex items-start gap-2.5"
                      data-ocid={`assets.smart_cities.item.${i + 1}`}
                    >
                      <span className="text-xl flex-shrink-0">
                        {asset.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-lg text-foreground">
                          {asset.value}
                        </div>
                        <div
                          className="text-label leading-tight mt-0.5"
                          style={{ fontSize: "0.65rem" }}
                        >
                          {asset.unit}
                        </div>
                        <div className="text-foreground text-xs font-medium mt-1 leading-tight">
                          {asset.label}
                        </div>
                        <div
                          className="text-label mt-0.5"
                          style={{
                            fontSize: "0.6rem",
                            color: "rgba(0,212,255,0.6)",
                          }}
                        >
                          {asset.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {scaItems.slice(4).map((asset, i) => (
                    <div
                      key={asset.label}
                      className="glass-elevated rounded p-3 flex items-center gap-3"
                      data-ocid={`assets.smart_cities.item.${i + 5}`}
                    >
                      <span className="text-2xl flex-shrink-0">
                        {asset.icon}
                      </span>
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-mono font-bold text-xl text-foreground">
                            {asset.value}
                          </span>
                          <span
                            className="text-label"
                            style={{ fontSize: "0.65rem" }}
                          >
                            {asset.unit}
                          </span>
                        </div>
                        <div className="text-foreground text-xs font-medium mt-0.5">
                          {asset.label}
                        </div>
                        <div
                          className="text-label mt-0.5"
                          style={{
                            fontSize: "0.6rem",
                            color: "rgba(0,212,255,0.6)",
                          }}
                        >
                          {asset.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* ── Asset Registry Table ─────────────────────────────────────────────── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="assets.registry.table"
      >
        <SectionHeader
          icon={Cpu}
          title="Infrastructure Asset Registry"
          sub="Full asset inventory with health scores, degradation rates and sensor status"
          action={
            <button
              type="button"
              className="text-xs text-primary hover:text-foreground transition-colors"
              data-ocid="assets.registry.export_button"
              onClick={() => setShowExportReport(true)}
            >
              Export CSV →
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/20">
                {[
                  "Asset ID",
                  "Name",
                  "Type",
                  "Location",
                  "Health Score",
                  "Degradation Rate",
                  "Last Inspection",
                  "Next Maintenance",
                  "Priority",
                  "Sensor Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-label whitespace-nowrap"
                    style={{ fontSize: "0.62rem" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ASSETS.map((a, i) => (
                <tr
                  key={a.id}
                  className="border-b border-border/10 hover:bg-white/[0.03] transition-smooth cursor-pointer"
                  data-ocid={`assets.registry.item.${i + 1}`}
                >
                  <td className="px-4 py-2.5 font-mono text-muted-foreground text-xs">
                    {a.id}
                  </td>
                  <td
                    className="px-4 py-2.5 font-semibold text-foreground"
                    style={{ maxWidth: 200, minWidth: 160 }}
                  >
                    <span className="truncate block">{a.name}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="badge-low">{a.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={10} className="flex-shrink-0" />
                      {a.location}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${a.health}%`,
                            background: healthColor(a.health),
                          }}
                        />
                      </div>
                      <span
                        className="font-mono font-bold"
                        style={{ color: healthColor(a.health) }}
                      >
                        {a.health}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">
                    {a.degradation}%/yr
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                    {a.lastInspection}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {a.nextMaintenance === "OVERDUE" ? (
                      <span className="badge-critical flex items-center gap-1 w-fit">
                        <AlertCircle size={9} />
                        OVERDUE
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {a.nextMaintenance}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={priorityBadge(a.priority)}>
                      {a.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`${sensorBadge(a.sensor)} flex items-center gap-1 w-fit`}
                    >
                      {sensorIcon(a.sensor)}
                      {a.sensor}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Predictive Maintenance + Sensor Diagnostics ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Predictive Maintenance Engine */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="assets.predictive.panel"
        >
          <SectionHeader
            icon={Zap}
            title="Predictive Maintenance Engine"
            sub="AI-Powered Failure Risk Assessment"
          />
          <div className="p-4 space-y-3">
            {PREDICTIVE_RISKS.map((r, i) => (
              <div
                key={r.name}
                className="glass-elevated p-3.5 rounded"
                data-ocid={`assets.predictive.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">
                      {r.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {r.timeframe} · Confidence:{" "}
                      <span
                        style={{
                          color:
                            r.confidence === "HIGH" ? "#FFB300" : "#00D4FF",
                        }}
                      >
                        {r.confidence}
                      </span>
                    </div>
                  </div>
                  <span className={`${priorityBadge(r.urgency)} flex-shrink-0`}>
                    {r.urgency}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-label">FAILURE RISK</span>
                    <span
                      className="font-mono font-bold text-sm"
                      style={{
                        color:
                          r.risk >= 70
                            ? "#FF3D00"
                            : r.risk >= 50
                              ? "#FF8C42"
                              : "#FFB300",
                      }}
                    >
                      {r.risk}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${r.risk}%`,
                        background:
                          r.risk >= 70
                            ? "linear-gradient(90deg,#FF6D00,#FF3D00)"
                            : r.risk >= 50
                              ? "linear-gradient(90deg,#FFB300,#FF8C42)"
                              : "linear-gradient(90deg,#FFD740,#FFB300)",
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {r.issue}
                </p>
                <button
                  type="button"
                  className="btn-secondary text-xs py-1.5 px-3"
                  data-ocid={`assets.predictive.inspect_button.${i + 1}`}
                  style={{ padding: "0.35rem 0.75rem" }}
                  onClick={() => setShowScheduleInspection(true)}
                >
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    Schedule Inspection
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sensor Diagnostics Dashboard */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="assets.sensors.panel"
        >
          <SectionHeader
            icon={Radio}
            title="Sensor Diagnostics Dashboard"
            sub="IoT Sensor Network — Live Status"
          />
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "2,340", l: "Total Sensors", c: "#00D4FF" },
                { v: "2,156", l: "Online (92.1%)", c: "#00E676" },
                { v: "89 / 34", l: "Offline / Warning", c: "#FF3D00" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="glass-elevated rounded p-2.5 text-center"
                >
                  <div
                    className="font-mono font-bold text-base"
                    style={{ color: s.c }}
                  >
                    {s.v}
                  </div>
                  <div className="text-label mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-label mb-2">SENSOR TYPE BREAKDOWN</div>
              <div className="grid grid-cols-2 gap-2">
                {SENSOR_TYPES.map((st) => {
                  const pct = Math.round((st.online / st.total) * 100);
                  return (
                    <div
                      key={st.label}
                      className="glass-elevated rounded p-2.5"
                    >
                      <div className="font-semibold text-xs text-foreground mb-1">
                        {st.label}
                      </div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span
                          className="font-mono text-xs"
                          style={{ color: "#00D4FF" }}
                        >
                          {st.total}
                        </span>
                        <span
                          className="text-xs font-mono"
                          style={{ color: pct >= 95 ? "#00E676" : "#FFB300" }}
                        >
                          {pct}% online
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background:
                              pct >= 95
                                ? "linear-gradient(90deg,#00B8D4,#00E676)"
                                : "linear-gradient(90deg,#FFB300,#FF8C42)",
                          }}
                        />
                      </div>
                      {(st.warning > 0 || st.offline > 0) && (
                        <div className="flex gap-2 mt-1.5">
                          {st.warning > 0 && (
                            <span
                              className="badge-warning"
                              style={{
                                padding: "0.1rem 0.3rem",
                                fontSize: "0.6rem",
                              }}
                            >
                              {st.warning} warn
                            </span>
                          )}
                          {st.offline > 0 && (
                            <span
                              className="badge-critical"
                              style={{
                                padding: "0.1rem 0.3rem",
                                fontSize: "0.6rem",
                              }}
                            >
                              {st.offline} offline
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-label mb-2">RECENT ALERTS</div>
              <div className="space-y-2">
                {SENSOR_ALERTS.map((al, idx) => {
                  const cfg = alertStatusConfig[al.status as AlertStatus];
                  return (
                    <div
                      key={al.asset}
                      className="glass-elevated rounded p-2.5 flex gap-2.5"
                      data-ocid={`assets.sensor_alert.item.${idx + 1}`}
                    >
                      <span
                        className={`${cfg.cls} flex items-center gap-1 flex-shrink-0 h-fit mt-0.5`}
                        style={{
                          padding: "0.15rem 0.4rem",
                          fontSize: "0.6rem",
                        }}
                      >
                        {cfg.icon}
                        {al.status}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-foreground mb-0.5">
                          {al.asset}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {al.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart + Repair Matrix + Complaints ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Degradation Trend */}
        <div
          className="glass-card overflow-hidden lg:col-span-1"
          data-ocid="assets.degradation.panel"
        >
          <SectionHeader
            icon={TrendingDown}
            title="Asset Degradation Trend"
            sub="Average Health Score Trend by Asset Type (2020–2026)"
          />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={DEGRADATION_TREND}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,212,255,0.06)"
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "rgba(176,190,197,0.6)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[60, 100]}
                  tick={{ fill: "rgba(176,190,197,0.6)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontSize: "10px",
                    color: "rgba(176,190,197,0.7)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bridges"
                  name="Bridges"
                  stroke="#FF6D00"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: "#FF6D00" }}
                />
                <Line
                  type="monotone"
                  dataKey="highways"
                  name="Highways"
                  stroke="#FFB300"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: "#FFB300" }}
                />
                <Line
                  type="monotone"
                  dataKey="tunnels"
                  name="Tunnels"
                  stroke="#00D4FF"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: "#00D4FF" }}
                />
                <Line
                  type="monotone"
                  dataKey="metro"
                  name="Metro"
                  stroke="#00E676"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: "#00E676" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Repair Prioritization Matrix */}
        <div
          className="glass-card overflow-hidden lg:col-span-1"
          data-ocid="assets.repair.matrix"
        >
          <SectionHeader
            icon={Wrench}
            title="Repair Prioritization Matrix"
            sub="2×2 urgency × impact quadrant analysis"
          />
          <div className="p-4">
            <div className="flex justify-between mb-1">
              <span className="text-label" style={{ fontSize: "0.58rem" }}>
                LOW IMPACT
              </span>
              <span className="text-label" style={{ fontSize: "0.58rem" }}>
                HIGH IMPACT →
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                REPAIR_MATRIX[1],
                REPAIR_MATRIX[0],
                REPAIR_MATRIX[3],
                REPAIR_MATRIX[2],
              ].map((q, i) => (
                <div
                  key={q.label}
                  className="rounded p-3"
                  style={{ background: q.bg, border: `1px solid ${q.border}` }}
                  data-ocid={`assets.repair.quadrant.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-xs font-bold"
                      style={{ color: q.color, fontSize: "0.65rem" }}
                    >
                      {q.label}
                    </span>
                    <span
                      className="font-mono font-bold text-base"
                      style={{ color: q.color }}
                    >
                      {q.count}
                    </span>
                  </div>
                  <div
                    className="text-xs font-mono mb-2"
                    style={{ color: q.color, opacity: 0.8 }}
                  >
                    {q.budget}
                  </div>
                  <div className="space-y-0.5">
                    {q.assets.map((a) => (
                      <div
                        key={a}
                        className="text-xs text-muted-foreground flex items-center gap-1 truncate"
                      >
                        <ChevronRight size={9} style={{ color: q.color }} />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-label" style={{ fontSize: "0.58rem" }}>
                ↑ HIGH URGENCY
              </span>
              <span className="text-label" style={{ fontSize: "0.58rem" }}>
                LOW URGENCY
              </span>
            </div>
          </div>
        </div>

        {/* Citizen Complaint Intelligence */}
        <div
          className="glass-card overflow-hidden lg:col-span-1"
          data-ocid="assets.complaints.panel"
        >
          <SectionHeader
            icon={MessageSquare}
            title="Citizen Complaint Intelligence"
            sub="Complaint Cluster Analysis — Citizen Feedback"
          />
          <div className="p-4 space-y-2.5">
            {COMPLAINTS.map((c, i) => {
              const densityBadge =
                c.density === "HIGH"
                  ? "badge-critical"
                  : c.density === "MEDIUM"
                    ? "badge-warning"
                    : "badge-success";
              return (
                <div
                  key={c.asset}
                  className="glass-elevated rounded p-3"
                  data-ocid={`assets.complaint.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-foreground truncate">
                        {c.asset}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c.issue}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className="font-mono font-bold text-base"
                        style={{
                          color:
                            c.density === "HIGH"
                              ? "#FF3D00"
                              : c.density === "MEDIUM"
                                ? "#FFB300"
                                : "#00E676",
                        }}
                      >
                        {c.count}
                      </span>
                      <span
                        className={densityBadge}
                        style={{
                          fontSize: "0.58rem",
                          padding: "0.1rem 0.35rem",
                        }}
                      >
                        {c.density}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-label">CLUSTER DENSITY</span>
                    <button
                      type="button"
                      className="text-xs text-primary hover:text-foreground transition-colors flex items-center gap-1"
                      data-ocid={`assets.complaint.inspect_button.${i + 1}`}
                      onClick={() => setShowScheduleInspection(true)}
                    >
                      Inspect <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
