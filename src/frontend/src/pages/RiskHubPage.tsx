import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Download,
  Home,
  Info,
  Shield,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────
interface RiskProject {
  name: string;
  overall: number;
  procurement: number;
  execution: number;
  commercial: number;
  governance: number;
  trend: number[];
  authority: string;
  location: string;
  value: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const RISK_PROJECTS: RiskProject[] = [
  {
    name: "NH-44 Delhi-Srinagar Highway",
    overall: 87,
    procurement: 82,
    execution: 91,
    commercial: 85,
    governance: 79,
    trend: [72, 75, 78, 81, 84, 86, 87],
    authority: "NHAI",
    location: "J&K / Himachal Pradesh",
    value: "₹25,360 Cr",
  },
  {
    name: "RVNL Mumbai Elevated Corridor",
    overall: 79,
    procurement: 70,
    execution: 83,
    commercial: 77,
    governance: 74,
    trend: [71, 73, 74, 76, 77, 78, 79],
    authority: "RVNL",
    location: "Mumbai, Maharashtra",
    value: "₹18,940 Cr",
  },
  {
    name: "NHAI Samruddhi Expressway Ext",
    overall: 73,
    procurement: 68,
    execution: 77,
    commercial: 74,
    governance: 65,
    trend: [68, 69, 70, 71, 72, 72, 73],
    authority: "NHAI",
    location: "Nagpur, Maharashtra",
    value: "₹12,200 Cr",
  },
  {
    name: "Smart Cities Pune Junction",
    overall: 68,
    procurement: 62,
    execution: 72,
    commercial: 66,
    governance: 61,
    trend: [65, 65, 66, 66, 67, 67, 68],
    authority: "Pune Smart City",
    location: "Pune, Maharashtra",
    value: "₹4,800 Cr",
  },
  {
    name: "NHIDCL Zojila Tunnel Phase 2",
    overall: 91,
    procurement: 88,
    execution: 95,
    commercial: 87,
    governance: 84,
    trend: [85, 87, 88, 89, 90, 90, 91],
    authority: "NHIDCL",
    location: "Ladakh",
    value: "₹6,809 Cr",
  },
  {
    name: "IRCON Chennai Metro Phase 3",
    overall: 55,
    procurement: 50,
    execution: 59,
    commercial: 53,
    governance: 48,
    trend: [58, 57, 56, 56, 55, 55, 55],
    authority: "IRCON / CMRL",
    location: "Chennai, Tamil Nadu",
    value: "₹9,100 Cr",
  },
  {
    name: "NTPC Leh Solar Power Grid",
    overall: 42,
    procurement: 38,
    execution: 45,
    commercial: 41,
    governance: 37,
    trend: [45, 44, 44, 43, 43, 42, 42],
    authority: "NTPC",
    location: "Leh, Ladakh",
    value: "₹3,200 Cr",
  },
  {
    name: "PGCIL East-West Transmission",
    overall: 38,
    procurement: 35,
    execution: 41,
    commercial: 37,
    governance: 33,
    trend: [40, 40, 39, 39, 38, 38, 38],
    authority: "PGCIL",
    location: "Multiple States",
    value: "₹7,800 Cr",
  },
  {
    name: "DMRC Phase-4 Janakpuri Ext",
    overall: 64,
    procurement: 58,
    execution: 68,
    commercial: 62,
    governance: 57,
    trend: [60, 61, 62, 62, 63, 63, 64],
    authority: "DMRC",
    location: "Delhi",
    value: "₹8,950 Cr",
  },
  {
    name: "JNPA Container Terminal T4",
    overall: 47,
    procurement: 43,
    execution: 51,
    commercial: 45,
    governance: 39,
    trend: [49, 48, 48, 47, 47, 47, 47],
    authority: "JNPA",
    location: "Nhava Sheva, Maharashtra",
    value: "₹5,600 Cr",
  },
  {
    name: "AAI Chennai Airport T2",
    overall: 33,
    procurement: 29,
    execution: 36,
    commercial: 31,
    governance: 27,
    trend: [35, 35, 34, 34, 33, 33, 33],
    authority: "AAI",
    location: "Chennai, Tamil Nadu",
    value: "₹2,467 Cr",
  },
  {
    name: "SECI Rajasthan Solar Phase 5",
    overall: 28,
    procurement: 25,
    execution: 31,
    commercial: 26,
    governance: 22,
    trend: [30, 30, 29, 29, 28, 28, 28],
    authority: "SECI",
    location: "Jodhpur, Rajasthan",
    value: "₹4,100 Cr",
  },
  {
    name: "CPWD Dwarka Expressway",
    overall: 76,
    procurement: 72,
    execution: 79,
    commercial: 75,
    governance: 71,
    trend: [70, 71, 72, 73, 74, 75, 76],
    authority: "CPWD",
    location: "Gurugram, Haryana",
    value: "₹3,300 Cr",
  },
  {
    name: "GAIL Jagdishpur Haldia Pipeline",
    overall: 52,
    procurement: 48,
    execution: 55,
    commercial: 50,
    governance: 44,
    trend: [54, 53, 53, 52, 52, 52, 52],
    authority: "GAIL",
    location: "UP / Bihar / WB",
    value: "₹12,940 Cr",
  },
  {
    name: "MoRTH NH-48 Mumbai-Pune",
    overall: 61,
    procurement: 56,
    execution: 65,
    commercial: 59,
    governance: 54,
    trend: [57, 58, 59, 60, 60, 61, 61],
    authority: "MoRTH / NHAI",
    location: "Pune–Mumbai Corridor",
    value: "₹7,200 Cr",
  },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TREND_DATA = DAYS.map((day, i) => ({
  day,
  "NH-44 Delhi-Srinagar": RISK_PROJECTS[0].trend[i],
  "NHIDCL Zojila Tunnel": RISK_PROJECTS[4].trend[i],
  "RVNL Mumbai Corridor": RISK_PROJECTS[1].trend[i],
}));

const PIE_LEVEL_DATA = [
  { name: "Critical (>75)", value: 2, color: "#FF3D00" },
  { name: "High (50–75)", value: 4, color: "#FF6D00" },
  { name: "Medium (25–50)", value: 6, color: "#FFD600" },
  { name: "Low (<25)", value: 3, color: "#00E676" },
];

const PIE_MODULE_DATA = [
  { name: "Execution", value: 32, color: "#00D4FF" },
  { name: "Procurement", value: 28, color: "#7B61FF" },
  { name: "Commercial", value: 22, color: "#FF6D00" },
  { name: "Governance", value: 18, color: "#00E676" },
];

const RISK_FACTORS: Record<
  string,
  { factor: string; desc: string; action: string }[]
> = {
  "NH-44 Delhi-Srinagar Highway": [
    {
      factor: "Land Acquisition Delays",
      desc: "12.4 km of right-of-way still pending forest clearance in Ramban district",
      action: "Escalate to District Collector for emergency acquisition order",
    },
    {
      factor: "Execution Slippage",
      desc: "Progress at 34% vs 52% planned — 4-month cumulative delay",
      action:
        "Deploy additional drilling rigs; invoke penalty clause on EPC contractor",
    },
    {
      factor: "BOQ Inflation Risk",
      desc: "Steel prices up 18% since DPR; contract has no price escalation clause",
      action:
        "Initiate variation order; budget revision of ₹840 Cr pending approval",
    },
  ],
  "NHIDCL Zojila Tunnel Phase 2": [
    {
      factor: "High-Altitude Weather Risk",
      desc: "Work window only 6 months/year; 2 lost seasons push completion to FY29",
      action: "Negotiate fast-track winter excavation schedule with NHIDCL",
    },
    {
      factor: "Geotechnical Uncertainty",
      desc: "Rock formation at chainage 8.2 km deviating from DPR assumptions",
      action:
        "Commission emergency geotechnical survey; redesign support system",
    },
    {
      factor: "EOT Claim Exposure",
      desc: "Contractor filed EOT of 540 days; commercial exposure ₹620 Cr",
      action:
        "Appoint independent arbitrator; dispute resolution panel to meet within 30 days",
    },
  ],
};

function getDefaultFactors(p: RiskProject) {
  return [
    {
      factor: "Schedule Overrun",
      desc: `Execution progress at risk — ${p.execution}% execution risk score indicates 2–4 month slippage likelihood`,
      action: "Review milestone schedule; enforce EPC contractor SLA",
    },
    {
      factor: "Procurement Compliance",
      desc: `Procurement risk score ${p.procurement} — L1 anomalies detected in 2 tender packages`,
      action: "Refer to CVC for review; place bid evaluation on hold",
    },
    {
      factor: "Commercial Exposure",
      desc: `Commercial risk ${p.commercial} — billing irregularities flagged in last 3 RA bills`,
      action:
        "Audit billing history; escalate to project director for financial review",
    },
  ];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function riskColor(score: number): string {
  if (score > 75) return "#FF3D00";
  if (score > 50) return "#FF6D00";
  if (score > 25) return "#FFD600";
  return "#00E676";
}

function riskLabel(score: number): string {
  if (score > 75) return "Critical";
  if (score > 50) return "High";
  if (score > 25) return "Medium";
  return "Low";
}

function riskBg(score: number): string {
  if (score > 75) return "rgba(255,61,0,0.12)";
  if (score > 50) return "rgba(255,109,0,0.12)";
  if (score > 25) return "rgba(255,214,0,0.12)";
  return "rgba(0,230,118,0.12)";
}

function MiniSparkline({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 60;
  const h = 24;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const rising = values[values.length - 1] >= values[0];
  return (
    <svg
      width={w}
      height={h}
      className="overflow-visible"
      aria-label="Risk trend sparkline"
      role="img"
    >
      <polyline
        points={pts}
        fill="none"
        stroke={rising ? "#FF3D00" : "#00E676"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-bold" style={{ color: riskColor(score) }}>
          {score}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: riskColor(score) }}
        />
      </div>
    </div>
  );
}

// ── Export Helper ─────────────────────────────────────────────────────────────
function exportRiskSnapshot() {
  const today = new Date().toISOString().split("T")[0];
  const headers = [
    "Project Name",
    "Authority",
    "Location",
    "Value",
    "Overall Risk",
    "Procurement Risk",
    "Execution Risk",
    "Commercial Risk",
    "Governance Risk",
    "Risk Level",
    "7-Day Trend (Mon-Sun)",
  ];
  const rows = RISK_PROJECTS.map((p) =>
    [
      `"${p.name}"`,
      p.authority,
      `"${p.location}"`,
      p.value,
      p.overall,
      p.procurement,
      p.execution,
      p.commercial,
      p.governance,
      riskLabel(p.overall),
      `"${p.trend.join(",")}"`,
    ].join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const header = `# InfraOS Risk Hub Snapshot\n# Generated: ${new Date().toLocaleString("en-IN")}\n# Generated by: Naman Maheshwari (NM)\n# Platform: InfraOS — India's AI Operating System for Infrastructure\n#\n`;
  const blob = new Blob([header + csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `InfraOS-Risk-Hub-Snapshot-${today}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RiskHubPage() {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [detailProject, setDetailProject] = useState<RiskProject | null>(null);

  const critical = RISK_PROJECTS.filter((p) => p.overall > 75).length;
  const high = RISK_PROJECTS.filter(
    (p) => p.overall > 50 && p.overall <= 75,
  ).length;
  const medium = RISK_PROJECTS.filter(
    (p) => p.overall > 25 && p.overall <= 50,
  ).length;
  const low = RISK_PROJECTS.filter((p) => p.overall <= 25).length;
  const total = RISK_PROJECTS.length;

  const kpis = [
    {
      label: "Critical Risk",
      count: critical,
      pct: Math.round((critical / total) * 100),
      trend: "+1",
      up: true,
      color: "#FF3D00",
      bg: "rgba(255,61,0,0.08)",
      border: "rgba(255,61,0,0.25)",
      icon: AlertCircle,
    },
    {
      label: "High Risk",
      count: high,
      pct: Math.round((high / total) * 100),
      trend: "+2",
      up: true,
      color: "#FF6D00",
      bg: "rgba(255,109,0,0.08)",
      border: "rgba(255,109,0,0.25)",
      icon: AlertTriangle,
    },
    {
      label: "Medium Risk",
      count: medium,
      pct: Math.round((medium / total) * 100),
      trend: "-1",
      up: false,
      color: "#FFD600",
      bg: "rgba(255,214,0,0.08)",
      border: "rgba(255,214,0,0.25)",
      icon: Info,
    },
    {
      label: "Low Risk",
      count: low,
      pct: Math.round((low / total) * 100),
      trend: "-2",
      up: false,
      color: "#00E676",
      bg: "rgba(0,230,118,0.08)",
      border: "rgba(0,230,118,0.25)",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="p-6 space-y-6 min-h-full" style={{ background: "#0A0C0F" }}>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/app/dashboard" })}
              className="hover:text-primary transition-colors flex items-center gap-1"
              data-ocid="riskhub.breadcrumb.home"
            >
              <Home size={11} />
              Home
            </button>
            <ChevronRight size={10} />
            <span className="text-gray-300">Risk Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(255,61,0,0.12)",
                border: "1px solid rgba(255,61,0,0.3)",
              }}
            >
              <Shield size={20} style={{ color: "#FF3D00" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Risk Hub
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Real-time project risk intelligence across all infrastructure
                portfolios
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          data-ocid="riskhub.export_button"
          onClick={exportRiskSnapshot}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
          style={{
            background: "rgba(0,212,255,0.1)",
            border: "1px solid rgba(0,212,255,0.3)",
            color: "#00D4FF",
          }}
        >
          <Download size={15} />
          Export Risk Snapshot
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="riskhub.kpi_cards"
      >
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-xl p-4 backdrop-blur-sm"
              style={{ background: kpi.bg, border: `1px solid ${kpi.border}` }}
              data-ocid={`riskhub.kpi.${kpi.label.toLowerCase().replace(" ", "_")}`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} style={{ color: kpi.color }} />
                <span
                  className="flex items-center gap-1 text-xs font-bold"
                  style={{ color: kpi.up ? "#FF6D00" : "#00E676" }}
                >
                  {kpi.up ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {kpi.trend} vs last month
                </span>
              </div>
              <div className="text-3xl font-black text-white">{kpi.count}</div>
              <div
                className="text-xs font-semibold mt-0.5"
                style={{ color: kpi.color }}
              >
                {kpi.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {kpi.pct}% of portfolio
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Trend line chart */}
        <div
          className="xl:col-span-2 rounded-xl p-5"
          style={{
            background: "rgba(0,212,255,0.03)",
            border: "1px solid rgba(0,212,255,0.1)",
          }}
          data-ocid="riskhub.trend_chart"
        >
          <h2 className="text-sm font-bold text-white mb-1">
            7-Day Risk Trend — Top 3 Critical Projects
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Risk score trajectory over the last 7 days
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={TREND_DATA}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[65, 100]}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#0D1117",
                  border: "1px solid rgba(0,212,255,0.15)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#00D4FF", fontWeight: 700 }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }} />
              <Line
                type="monotone"
                dataKey="NH-44 Delhi-Srinagar"
                stroke="#FF3D00"
                strokeWidth={2}
                dot={{ fill: "#FF3D00", r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="NHIDCL Zojila Tunnel"
                stroke="#FF6D00"
                strokeWidth={2}
                dot={{ fill: "#FF6D00", r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="RVNL Mumbai Corridor"
                stroke="#FFD600"
                strokeWidth={2}
                dot={{ fill: "#FFD600", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie charts */}
        <div className="flex flex-col gap-4">
          {/* Level distribution */}
          <div
            className="flex-1 rounded-xl p-4"
            style={{
              background: "rgba(0,212,255,0.03)",
              border: "1px solid rgba(0,212,255,0.1)",
            }}
            data-ocid="riskhub.pie_level"
          >
            <h3 className="text-xs font-bold text-white mb-3">
              Projects by Risk Level
            </h3>
            <div className="flex items-center gap-3">
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie
                    data={PIE_LEVEL_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={46}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {PIE_LEVEL_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {PIE_LEVEL_DATA.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: d.color }}
                      />
                      <span className="text-[10px] text-gray-400">
                        {d.name.split(" ")[0]}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-white">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module breakdown */}
          <div
            className="flex-1 rounded-xl p-4"
            style={{
              background: "rgba(0,212,255,0.03)",
              border: "1px solid rgba(0,212,255,0.1)",
            }}
            data-ocid="riskhub.pie_module"
          >
            <h3 className="text-xs font-bold text-white mb-3">
              Risk by Module
            </h3>
            <div className="flex items-center gap-3">
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie
                    data={PIE_MODULE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={46}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {PIE_MODULE_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {PIE_MODULE_DATA.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: d.color }}
                      />
                      <span className="text-[10px] text-gray-400">
                        {d.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-white">
                      {d.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Risk Table ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(0,212,255,0.02)",
          border: "1px solid rgba(0,212,255,0.1)",
        }}
        data-ocid="riskhub.table"
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(0,212,255,0.08)" }}
        >
          <h2 className="text-sm font-bold text-white">
            Risk Breakdown — All Projects
          </h2>
          <span className="text-xs text-gray-500">
            {RISK_PROJECTS.length} projects monitored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,212,255,0.08)" }}>
                {[
                  "Project Name",
                  "Overall",
                  "Procurement",
                  "Execution",
                  "Commercial",
                  "Governance",
                  "7-Day Trend",
                  "Action",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: "rgba(0,212,255,0.6)" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RISK_PROJECTS.map((project, idx) => (
                <>
                  <tr
                    key={project.name}
                    className="transition-colors hover:bg-white/3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    data-ocid={`riskhub.table.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {project.name}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {project.authority}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                        style={{
                          background: riskBg(project.overall),
                          color: riskColor(project.overall),
                          border: `1px solid ${riskColor(project.overall)}40`,
                        }}
                      >
                        {project.overall} — {riskLabel(project.overall)}
                      </span>
                    </td>
                    {(
                      [
                        "procurement",
                        "execution",
                        "commercial",
                        "governance",
                      ] as const
                    ).map((dim) => (
                      <td key={dim} className="px-4 py-3">
                        <span
                          className="text-xs font-bold"
                          style={{ color: riskColor(project[dim]) }}
                        >
                          {project[dim]}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <MiniSparkline values={project.trend} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        data-ocid={`riskhub.view_details.${idx + 1}`}
                        onClick={() => {
                          if (expandedRow === project.name) {
                            setExpandedRow(null);
                            setDetailProject(null);
                          } else {
                            setExpandedRow(project.name);
                            setDetailProject(project);
                          }
                        }}
                        className="text-xs font-semibold transition-colors hover:text-white px-3 py-1.5 rounded-lg"
                        style={
                          expandedRow === project.name
                            ? {
                                background: "rgba(0,212,255,0.15)",
                                color: "#00D4FF",
                                border: "1px solid rgba(0,212,255,0.3)",
                              }
                            : {
                                background: "rgba(255,255,255,0.05)",
                                color: "#9CA3AF",
                                border: "1px solid rgba(255,255,255,0.08)",
                              }
                        }
                      >
                        {expandedRow === project.name
                          ? "Collapse"
                          : "View Details"}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {expandedRow === project.name && (
                    <tr
                      key={`${project.name}-detail`}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <td colSpan={8} className="px-4 py-0">
                        <div
                          className="my-3 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-5"
                          style={{
                            background: "rgba(0,212,255,0.03)",
                            border: "1px solid rgba(0,212,255,0.12)",
                          }}
                          data-ocid={`riskhub.expanded.${idx + 1}`}
                        >
                          {/* Project info */}
                          <div>
                            <h4
                              className="text-xs font-bold uppercase tracking-widest mb-3"
                              style={{ color: "#00D4FF" }}
                            >
                              Project Info
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <span className="text-[10px] text-gray-500 block">
                                  Authority
                                </span>
                                <span className="text-xs text-white font-medium">
                                  {project.authority}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-gray-500 block">
                                  Location
                                </span>
                                <span className="text-xs text-white font-medium">
                                  {project.location}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-gray-500 block">
                                  Project Value
                                </span>
                                <span className="text-xs text-white font-medium">
                                  {project.value}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-gray-500 block">
                                  Last Updated
                                </span>
                                <span className="text-xs text-white font-medium">
                                  {new Date().toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                                Risk Score Breakdown
                              </h5>
                              <ScoreBar
                                score={project.overall}
                                label="Overall Risk"
                              />
                              <ScoreBar
                                score={project.procurement}
                                label="Procurement"
                              />
                              <ScoreBar
                                score={project.execution}
                                label="Execution"
                              />
                              <ScoreBar
                                score={project.commercial}
                                label="Commercial"
                              />
                              <ScoreBar
                                score={project.governance}
                                label="Governance"
                              />
                            </div>
                          </div>

                          {/* Risk factors */}
                          <div>
                            <h4
                              className="text-xs font-bold uppercase tracking-widest mb-3"
                              style={{ color: "#FF6D00" }}
                            >
                              Top Risk Factors
                            </h4>
                            <div className="space-y-3">
                              {(
                                RISK_FACTORS[project.name] ??
                                getDefaultFactors(project)
                              ).map((rf) => (
                                <div
                                  key={`${project.name}-rf-${rf.factor}`}
                                  className="p-3 rounded-lg"
                                  style={{
                                    background: "rgba(255,109,0,0.05)",
                                    border: "1px solid rgba(255,109,0,0.15)",
                                  }}
                                >
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <AlertTriangle
                                      size={11}
                                      style={{ color: "#FF6D00" }}
                                    />
                                    <span className="text-[11px] font-bold text-white">
                                      {rf.factor}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 leading-relaxed">
                                    {rf.desc}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recommended actions */}
                          <div>
                            <h4
                              className="text-xs font-bold uppercase tracking-widest mb-3"
                              style={{ color: "#00E676" }}
                            >
                              Recommended Actions
                            </h4>
                            <div className="space-y-3">
                              {(
                                RISK_FACTORS[project.name] ??
                                getDefaultFactors(project)
                              ).map((rf) => (
                                <div
                                  key={`${project.name}-action-${rf.factor}`}
                                  className="p-3 rounded-lg"
                                  style={{
                                    background: "rgba(0,230,118,0.05)",
                                    border: "1px solid rgba(0,230,118,0.15)",
                                  }}
                                >
                                  <div className="flex items-start gap-2">
                                    <span
                                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5"
                                      style={{
                                        background: "rgba(0,230,118,0.2)",
                                        color: "#00E676",
                                      }}
                                    >
                                      {1}
                                    </span>
                                    <p className="text-[10px] text-gray-300 leading-relaxed">
                                      {rf.action}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-in detail panel ── */}
      {detailProject && (
        <div
          className="fixed inset-y-0 right-0 w-full max-w-md z-50 flex flex-col shadow-2xl"
          style={{
            background: "#080B0F",
            borderLeft: "1px solid rgba(0,212,255,0.2)",
          }}
          data-ocid="riskhub.detail_panel"
        >
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}
          >
            <div>
              <h3 className="text-sm font-bold text-white">Risk Detail</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                {detailProject.name}
              </p>
            </div>
            <button
              type="button"
              data-ocid="riskhub.detail_panel.close_button"
              onClick={() => {
                setDetailProject(null);
                setExpandedRow(null);
              }}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close detail panel"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Overall score */}
            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: riskBg(detailProject.overall),
                border: `1px solid ${riskColor(detailProject.overall)}40`,
              }}
            >
              <div
                className="text-5xl font-black"
                style={{ color: riskColor(detailProject.overall) }}
              >
                {detailProject.overall}
              </div>
              <div
                className="text-xs font-bold mt-1"
                style={{ color: riskColor(detailProject.overall) }}
              >
                {riskLabel(detailProject.overall)} Risk
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {detailProject.name}
              </div>
            </div>

            {/* Project metadata */}
            <div
              className="rounded-xl p-4 space-y-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h4
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#00D4FF" }}
              >
                Project Information
              </h4>
              {[
                ["Authority", detailProject.authority],
                ["Location", detailProject.location],
                ["Value", detailProject.value],
                [
                  "Last Updated",
                  new Date().toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                ],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-start gap-3">
                  <span className="text-[10px] text-gray-500 flex-shrink-0">
                    {k}
                  </span>
                  <span className="text-xs text-white font-medium text-right">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Risk score bars */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#00D4FF" }}
              >
                Risk Dimension Scores
              </h4>
              <ScoreBar score={detailProject.overall} label="Overall Risk" />
              <ScoreBar
                score={detailProject.procurement}
                label="Procurement Risk"
              />
              <ScoreBar
                score={detailProject.execution}
                label="Execution Risk"
              />
              <ScoreBar
                score={detailProject.commercial}
                label="Commercial Risk"
              />
              <ScoreBar
                score={detailProject.governance}
                label="Governance Risk"
              />
            </div>

            {/* Risk factors */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#FF6D00" }}
              >
                Top Risk Factors
              </h4>
              <div className="space-y-3">
                {(
                  RISK_FACTORS[detailProject.name] ??
                  getDefaultFactors(detailProject)
                ).map((rf) => (
                  <div
                    key={`detail-rf-${rf.factor}`}
                    className="p-3 rounded-lg"
                    style={{
                      background: "rgba(255,109,0,0.06)",
                      border: "1px solid rgba(255,109,0,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <AlertTriangle size={11} style={{ color: "#FF6D00" }} />
                      <span className="text-xs font-bold text-white">
                        {rf.factor}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      {rf.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended actions */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#00E676" }}
              >
                Recommended Actions
              </h4>
              <div className="space-y-3">
                {(
                  RISK_FACTORS[detailProject.name] ??
                  getDefaultFactors(detailProject)
                ).map((rf, idx2) => (
                  <div
                    key={`detail-action-${rf.factor}`}
                    className="p-3 rounded-lg"
                    style={{
                      background: "rgba(0,230,118,0.06)",
                      border: "1px solid rgba(0,230,118,0.15)",
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5"
                        style={{
                          background: "rgba(0,230,118,0.2)",
                          color: "#00E676",
                        }}
                      >
                        {idx2 + 1}
                      </span>
                      <p className="text-[10px] text-gray-300 leading-relaxed">
                        {rf.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
