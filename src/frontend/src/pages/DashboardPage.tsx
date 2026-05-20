import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Brain,
  Building2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Settings,
  Shield,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
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
import { useOrg } from "../context/OrgContext";
import {
  COST_OVERRUN_TREND,
  DELAY_CAUSES,
  NIP_SECTORS,
  getOrgData,
} from "../data/orgData";

// ── Types ─────────────────────────────────────────────────────────────────────
type InsightSeverity = "critical" | "risk" | "commercial" | "asset";

// ── Helpers ───────────────────────────────────────────────────────────────────

const now = new Date();
const dateStr = now.toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const timeStr = now.toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

function riskLevelBadge(level: string) {
  const map: Record<string, string> = {
    critical: "badge-critical",
    high: "badge-high",
    warning: "badge-warning",
    success: "badge-success",
    low: "badge-low",
  };
  return map[level] ?? "badge-low";
}

type AlertLevel = "critical" | "high" | "medium" | "low";

function alertBadgeClass(sev: AlertLevel): string {
  const map: Record<AlertLevel, string> = {
    critical: "badge-critical",
    high: "badge-high",
    medium: "badge-warning",
    low: "badge-low",
  };
  return map[sev];
}

function alertDotColor(sev: AlertLevel): string {
  const map: Record<AlertLevel, string> = {
    critical: "#FF3D00",
    high: "#FF6D00",
    medium: "#FFB300",
    low: "#00D4FF",
  };
  return map[sev];
}

function tenderRiskBadge(risk: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"): string {
  const map = {
    CRITICAL: "badge-critical",
    HIGH: "badge-high",
    MEDIUM: "badge-warning",
    LOW: "badge-success",
  };
  return map[risk];
}

function insightAccent(sev: InsightSeverity): {
  bg: string;
  border: string;
  label: string;
} {
  const map: Record<
    InsightSeverity,
    { bg: string; border: string; label: string }
  > = {
    critical: {
      bg: "rgba(255,61,0,0.08)",
      border: "rgba(255,61,0,0.25)",
      label: "#FF6B6B",
    },
    risk: {
      bg: "rgba(255,109,0,0.08)",
      border: "rgba(255,109,0,0.25)",
      label: "#FF8C42",
    },
    commercial: {
      bg: "rgba(255,179,0,0.08)",
      border: "rgba(255,179,0,0.2)",
      label: "#FFB300",
    },
    asset: {
      bg: "rgba(0,212,255,0.06)",
      border: "rgba(0,212,255,0.2)",
      label: "#00D4FF",
    },
  };
  return map[sev];
}

function stateRiskColor(level: "critical" | "warning" | "success"): string {
  if (level === "critical") return "#FF6B6B";
  if (level === "warning") return "#FFB300";
  return "#00E676";
}

// ── Subcomponents ─────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  badge,
  action,
  actionOcid,
}: {
  icon: React.ElementType;
  title: string;
  badge?: React.ReactNode;
  action?: { label: string; onClick: () => void };
  actionOcid?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-primary" />
        <h2 className="font-semibold text-sm text-foreground">{title}</h2>
        {badge}
      </div>
      {action && (
        <button
          type="button"
          className="text-xs text-primary hover:text-primary/80 transition-smooth flex items-center gap-1"
          onClick={action.onClick}
          data-ocid={actionOcid}
        >
          {action.label} <ChevronRight size={11} />
        </button>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const { selectedOrg } = useOrg();
  const orgData = getOrgData(selectedOrg.key);
  const { kpis, alerts, tenders, stateHeatmap, aiInsights } = orgData;

  const [alertFilter, setAlertFilter] = useState<
    "All" | "Critical" | "High" | "Medium"
  >("All");

  function downloadDashboardSummary() {
    const now = new Date().toISOString().split("T")[0];
    const content = `INFRAOS DASHBOARD SUMMARY
Generated: ${now}
User: Naman Maheshwari

=== COMMAND CENTER KPIs ===
Metric,Value,Status
Total NIP Investment,₹111 Lakh Crore,Active
Active Projects,1820,Monitoring
Delayed Projects,780 (42.8%),At Risk
Cost Overrun,₹4.8L Cr (18.2%),Alert
Arbitration Exposure,₹70000+ Cr,Critical
Active Tender Pipeline,₹28400 Cr,Tracking

=== SECTOR HEALTH ===
Energy,26.9L Cr,On Track
Roads & Highways,20.3L Cr,Delayed 34%
Urban Infrastructure,17.8L Cr,Critical 18%
Railways,13.7L Cr,On Track

=== ACTIVE ALERTS ===
Alert,Severity,Module
NH-48 Corridor delay >24 months,Critical,Execution
HCC arbitration exposure ₹22000Cr,High,Commercial Risk
47 tender manipulation flags,High,Governance
NTPC Vindhyachal Phase overrun,Medium,Procurement

=== NH CONSTRUCTION PACE ===
FY2014-15,12.1 km/day
FY2019-20,28.4 km/day
FY2023-24,33.8 km/day
`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `InfraOS-Dashboard-Summary-${now}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const filteredAlerts = alerts.filter((a) => {
    if (alertFilter === "All") return true;
    return a.severity === alertFilter.toLowerCase();
  });

  const KPI_CARDS = [
    {
      id: "active",
      label: "Active Projects",
      value: kpis.totalProjects.toLocaleString("en-IN"),
      sublabel: `${selectedOrg.badge} portfolio`,
      trend: "up" as const,
      icon: Building2,
      accentColor: "#00D4FF",
      glowColor: "rgba(0,212,255,0.18)",
    },
    {
      id: "pipeline",
      label: "Pipeline Value",
      value: kpis.totalInvestment,
      sublabel: `${selectedOrg.label} programs`,
      trend: "up" as const,
      icon: BarChart3,
      accentColor: "#00D4FF",
      glowColor: "rgba(0,212,255,0.18)",
    },
    {
      id: "delayed",
      label: "Delayed Projects",
      value: kpis.delayedProjects.toLocaleString("en-IN"),
      sublabel: "Require intervention",
      trend: "up" as const,
      icon: Clock,
      accentColor: "#FF8C42",
      glowColor: "rgba(255,109,0,0.18)",
    },
    {
      id: "overrun",
      label: "Cost Overruns",
      value: kpis.costOverrun,
      sublabel: "Across portfolio",
      trend: "up" as const,
      icon: TrendingDown,
      accentColor: "#FF6B6B",
      glowColor: "rgba(255,61,0,0.2)",
    },
    {
      id: "arbitration",
      label: "Arbitration Exposure",
      value: kpis.arbitrationExposure,
      sublabel: "Active disputes",
      trend: "up" as const,
      icon: AlertTriangle,
      accentColor: "#FF6B6B",
      glowColor: "rgba(255,61,0,0.16)",
    },
    {
      id: "ontrack",
      label: "On-Track Projects",
      value: `${kpis.onTrackPct}%`,
      sublabel: `Compliance: ${kpis.complianceScore}/100`,
      trend: "up" as const,
      icon: Activity,
      accentColor: "#00E676",
      glowColor: "rgba(0,230,118,0.15)",
    },
  ];

  return (
    <div
      className="p-5 space-y-5 grid-overlay min-h-screen"
      data-ocid="dashboard.page"
    >
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5">
            <span>Home</span>
            <ChevronRight size={10} />
            <span className="text-primary">Command Center</span>
          </nav>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            AI Command Center
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            <span className="text-primary font-semibold">
              {selectedOrg.label}
            </span>
            {" — "}
            {orgData.dashboardSubtitle.split("—")[1]?.trim() ??
              "Intelligence Dashboard"}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="glass-card px-3 py-1.5 flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#00E676",
                boxShadow: "0 0 6px #00E676",
                animation: "glowPulse 2s ease-in-out infinite",
              }}
            />
            <span className="text-xs font-bold" style={{ color: "#00E676" }}>
              LIVE
            </span>
            <span className="text-xs text-muted-foreground">
              {dateStr} · {timeStr}
            </span>
          </div>
          <button
            type="button"
            className="btn-secondary flex items-center gap-2 py-1.5 px-3 text-xs"
            onClick={() => navigate({ to: "/app/reports" })}
            data-ocid="dashboard.generate_report_button"
          >
            <FileText size={13} />
            Generate Report
          </button>
          <button
            type="button"
            className="btn-secondary flex items-center gap-2 py-1.5 px-3 text-xs"
            onClick={downloadDashboardSummary}
            data-ocid="dashboard.export_button"
          >
            <Download size={13} />
            Export
          </button>
          <button
            type="button"
            className="btn-ghost p-2 rounded"
            onClick={() => navigate({ to: "/app/settings" })}
            data-ocid="dashboard.settings_button"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 flex-wrap"
        data-ocid="dashboard.quick_actions.section"
      >
        <span className="text-[10px] text-label mr-1">QUICK ACTIONS:</span>
        {[
          {
            label: "Add Project",
            icon: Building2,
            to: "/app/execution",
            ocid: "dashboard.quick_actions.add_project",
          },
          {
            label: "Upload Tender",
            icon: FileText,
            to: "/app/procurement",
            ocid: "dashboard.quick_actions.upload_tender",
          },
          {
            label: "Generate Report",
            icon: BarChart3,
            to: "/app/reports",
            ocid: "dashboard.quick_actions.generate_report",
          },
          {
            label: "View Alerts",
            icon: AlertTriangle,
            to: "/app/governance",
            ocid: "dashboard.quick_actions.view_alerts",
          },
        ].map(({ label, icon: Icon, to, ocid }) => (
          <button
            key={label}
            type="button"
            data-ocid={ocid}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded glass-card text-xs font-semibold text-primary hover:bg-primary/10 transition-smooth border border-primary/20"
            onClick={() =>
              navigate({
                to: to as
                  | "/app/execution"
                  | "/app/procurement"
                  | "/app/reports"
                  | "/app/governance",
              })
            }
          >
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>

      {/* ── ROW 1 — KPI Cards ─────────────────────────────────────────────── */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3"
        data-ocid="dashboard.kpi.section"
      >
        {KPI_CARDS.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="glass-card p-4 flex flex-col gap-2 transition-smooth"
              style={{
                boxShadow: `0 0 20px ${kpi.glowColor}, 0 4px 20px rgba(0,0,0,0.4)`,
              }}
              data-ocid={`dashboard.kpi.item.${i + 1}`}
            >
              {(() => {
                const changePcts = [
                  "+2.3%",
                  "+1.8%",
                  "+4.1%",
                  "+3.2%",
                  "+5.7%",
                  "+0.9%",
                ];
                const changePct = changePcts[i] ?? "+1.0%";
                const badgeColor =
                  kpi.id === "ontrack"
                    ? "#00E676"
                    : ["delayed", "overrun", "arbitration"].includes(kpi.id)
                      ? "#FF6B6B"
                      : "#FFB300";
                return (
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: `${kpi.accentColor}15`,
                        border: `1px solid ${kpi.accentColor}30`,
                      }}
                    >
                      <Icon size={15} style={{ color: kpi.accentColor }} />
                    </div>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: `${badgeColor}18`,
                        color: badgeColor,
                        border: `1px solid ${badgeColor}30`,
                      }}
                    >
                      ↑ {changePct}
                    </span>
                  </div>
                );
              })()}
              <p
                className="font-display font-bold text-xl leading-tight"
                style={{
                  color: kpi.accentColor,
                  textShadow: `0 0 16px ${kpi.accentColor}60`,
                }}
              >
                {kpi.value}
              </p>
              <div>
                <p className="text-xs font-semibold text-foreground leading-tight">
                  {kpi.label}
                </p>
                <p
                  className="text-label mt-0.5"
                  style={{ fontSize: "0.62rem" }}
                >
                  {kpi.sublabel}
                </p>
                <p className="text-[9px] text-muted-foreground/50 mt-0.5">
                  vs last month
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ROW 2 — Heatmap + Alerts ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* State Risk Heatmap */}
        <div
          className="xl:col-span-2 glass-card overflow-hidden"
          data-ocid="dashboard.heatmap.section"
        >
          <SectionHeader
            icon={Activity}
            title="Infrastructure Risk Heatmap by State"
          />
          <div className="overflow-auto" style={{ maxHeight: 420 }}>
            <table className="w-full text-xs">
              <thead
                className="sticky top-0"
                style={{ background: "rgba(13,17,23,0.95)" }}
              >
                <tr className="border-b border-border/30">
                  {[
                    "State",
                    "Active Projects",
                    "Delayed",
                    "Risk Score",
                    "Level",
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
                {stateHeatmap.map((row, i) => (
                  <tr
                    key={row.state}
                    className="border-b border-border/10 hover:bg-white/3 transition-smooth cursor-pointer"
                    data-ocid={`dashboard.heatmap.item.${i + 1}`}
                  >
                    <td className="px-4 py-2.5 font-semibold text-foreground">
                      {row.state}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-primary">
                      {row.projects}
                    </td>
                    <td
                      className="px-4 py-2.5 font-mono"
                      style={{ color: "#FF8C42" }}
                    >
                      {row.delayed}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden"
                          style={{ minWidth: 60 }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${row.risk}%`,
                              background: `linear-gradient(90deg, ${stateRiskColor(row.level)}88, ${stateRiskColor(row.level)})`,
                            }}
                          />
                        </div>
                        <span
                          className="font-mono font-bold w-7 text-right"
                          style={{ color: stateRiskColor(row.level) }}
                        >
                          {row.risk}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={riskLevelBadge(row.level)}>
                        {row.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert Command Panel */}
        <div
          className="glass-card flex flex-col overflow-hidden"
          data-ocid="dashboard.alerts.section"
        >
          <div className="px-4 py-3 border-b border-border/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} style={{ color: "#FF6B6B" }} />
                <h2 className="font-semibold text-sm text-foreground">
                  Active Alerts
                </h2>
                <span
                  className="badge-critical"
                  style={{ padding: "0.1rem 0.5rem", fontSize: "0.6rem" }}
                >
                  {kpis.riskAlerts}
                </span>
              </div>
            </div>
            <div className="flex gap-1.5">
              {(["All", "Critical", "High", "Medium"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  className="text-xs px-2.5 py-1 rounded transition-smooth"
                  style={{
                    background:
                      alertFilter === f
                        ? "rgba(0,212,255,0.15)"
                        : "transparent",
                    border:
                      alertFilter === f
                        ? "1px solid rgba(0,212,255,0.35)"
                        : "1px solid rgba(255,255,255,0.08)",
                    color:
                      alertFilter === f ? "#00D4FF" : "rgba(176,190,197,0.7)",
                    fontWeight: alertFilter === f ? 600 : 400,
                  }}
                  onClick={() => setAlertFilter(f)}
                  data-ocid={`dashboard.alerts.filter.${f.toLowerCase()}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div
            className="overflow-y-auto flex-1 divide-y divide-border/15"
            style={{ maxHeight: 360 }}
          >
            {filteredAlerts.map((alert, i) => (
              <div
                key={alert.id}
                className="flex items-start gap-2.5 px-4 py-3 hover:bg-white/3 transition-smooth cursor-pointer"
                data-ocid={`dashboard.alert.item.${i + 1}`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                  style={{
                    background: alertDotColor(alert.severity),
                    boxShadow: `0 0 6px ${alertDotColor(alert.severity)}80`,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <span
                      className={alertBadgeClass(alert.severity)}
                      style={{ fontSize: "0.58rem" }}
                    >
                      {alert.severity}
                    </span>
                    <span
                      className="text-label"
                      style={{ fontSize: "0.58rem", flexShrink: 0 }}
                    >
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-snug line-clamp-2">
                    {alert.desc}
                  </p>
                  <p
                    className="text-label mt-0.5"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {alert.module}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border/30">
            <button
              type="button"
              className="btn-secondary w-full text-xs py-1.5"
              onClick={() => navigate({ to: "/app/governance" })}
              data-ocid="dashboard.alerts.view_all_button"
            >
              View All Alerts
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 3 — Analytics Charts ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Bar Chart: NIP Sector Investment */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="dashboard.chart.pipeline"
        >
          <SectionHeader
            icon={BarChart3}
            title="Sector-Wise Investment (₹ Lakh Crore)"
          />
          <div className="px-2 py-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={NIP_SECTORS} barSize={18} margin={{ bottom: 32 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="sector"
                  tick={{ fill: "rgba(176,190,197,0.6)", fontSize: 9 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                  tickLine={false}
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: "rgba(176,190,197,0.6)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                  tickFormatter={(v: number) => `₹${v}`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,212,255,0.04)" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as (typeof NIP_SECTORS)[0];
                    return (
                      <div
                        className="rounded px-3 py-2 text-xs"
                        style={{
                          background: "rgba(8,11,15,0.97)",
                          border: "1px solid rgba(0,212,255,0.25)",
                        }}
                      >
                        <p className="text-muted-foreground mb-0.5">
                          {d.sector}
                        </p>
                        <p
                          className="font-mono font-bold"
                          style={{ color: "#00D4FF" }}
                        >
                          ₹{d.investment} Lakh Crore ({d.pct}%)
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="investment" radius={[3, 3, 0, 0]}>
                  {NIP_SECTORS.map((entry) => (
                    <Cell
                      key={entry.sector}
                      fill={entry.color}
                      opacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Overrun Trend Line Chart */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="dashboard.chart.overrun"
        >
          <SectionHeader
            icon={TrendingDown}
            title="Cost Overrun Trend (₹ Lakh Crore)"
          />
          <div className="px-2 py-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={COST_OVERRUN_TREND}>
                <defs>
                  <linearGradient id="overrunGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "rgba(176,190,197,0.6)", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(176,190,197,0.6)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                  tickFormatter={(v: number) => `₹${v}L`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]
                      .payload as (typeof COST_OVERRUN_TREND)[0];
                    return (
                      <div
                        className="rounded px-3 py-2 text-xs"
                        style={{
                          background: "rgba(8,11,15,0.97)",
                          border: "1px solid rgba(0,212,255,0.25)",
                        }}
                      >
                        <p className="text-muted-foreground mb-0.5">{d.year}</p>
                        <p
                          className="font-mono font-bold"
                          style={{ color: "#00D4FF" }}
                        >
                          ₹{d.overrunLCr}L Cr overrun across {d.projects}{" "}
                          projects
                        </p>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="overrunLCr"
                  stroke="#00D4FF"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: "#00D4FF",
                    stroke: "#0a0c0f",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5,
                    fill: "#00D4FF",
                    stroke: "#0a0c0f",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut: Delay Root Causes */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="dashboard.chart.health"
        >
          <SectionHeader icon={Activity} title="Delay Root Causes" />
          <div className="px-2 py-4 flex items-center gap-2">
            <div
              className="relative"
              style={{ width: 150, height: 150, flexShrink: 0 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DELAY_CAUSES}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={66}
                    paddingAngle={2}
                    dataKey="pct"
                    nameKey="cause"
                    stroke="none"
                  >
                    {DELAY_CAUSES.map((entry) => (
                      <Cell
                        key={entry.cause}
                        fill={entry.color}
                        opacity={0.9}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload as (typeof DELAY_CAUSES)[0];
                      return (
                        <div
                          className="rounded px-3 py-2 text-xs"
                          style={{
                            background: "rgba(8,11,15,0.97)",
                            border: "1px solid rgba(0,212,255,0.25)",
                          }}
                        >
                          <p className="text-muted-foreground mb-0.5">
                            {d.cause}
                          </p>
                          <p
                            className="font-mono font-bold"
                            style={{ color: "#00D4FF" }}
                          >
                            {d.pct}% ({d.projects} projects)
                          </p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p
                  className="font-bold text-base font-mono"
                  style={{ color: "#FF6B6B" }}
                >
                  42.8%
                </p>
                <p className="text-label" style={{ fontSize: "0.55rem" }}>
                  DELAYED
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              {DELAY_CAUSES.map((seg) => (
                <div
                  key={seg.cause}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: seg.color }}
                    />
                    <span className="text-[10px] text-muted-foreground truncate">
                      {seg.cause}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-semibold text-foreground flex-shrink-0">
                    {seg.pct}%
                  </span>
                </div>
              ))}
              <Legend />
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 4 — Tender Pipeline + AI Insights ─────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Tender Pipeline */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="dashboard.tenders.section"
        >
          <SectionHeader
            icon={FileText}
            title="Tender Pipeline — This Quarter"
            action={{
              label: "View All Tenders",
              onClick: () => navigate({ to: "/app/procurement" }),
            }}
            actionOcid="dashboard.tenders.view_all_button"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/20">
                  {[
                    "Tender Title",
                    "Ministry",
                    "Est. Value",
                    "Status",
                    "Fraud Risk",
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
                {tenders.map((t, i) => (
                  <tr
                    key={t.id}
                    className="border-b border-border/10 hover:bg-white/3 transition-smooth cursor-pointer"
                    onClick={() => navigate({ to: "/app/procurement" })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        navigate({ to: "/app/procurement" });
                    }}
                    data-ocid={`dashboard.tender.item.${i + 1}`}
                  >
                    <td className="px-4 py-2.5">
                      <p
                        className="font-semibold text-foreground leading-tight"
                        style={{ maxWidth: 180 }}
                      >
                        {t.title}
                      </p>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                      {t.ministry}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-primary whitespace-nowrap">
                      {t.value}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className="text-xs"
                        style={{
                          color:
                            t.status === "Awarded"
                              ? "#00E676"
                              : t.status === "Open"
                                ? "#00D4FF"
                                : "#FFB300",
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={tenderRiskBadge(t.risk)}>{t.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Engine */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="dashboard.ai_insights.section"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-primary" />
              <h2 className="font-semibold text-sm text-foreground">
                AI Insight Engine
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded font-bold"
                style={{
                  background: "rgba(0,212,255,0.15)",
                  color: "#00D4FF",
                  border: "1px solid rgba(0,212,255,0.3)",
                }}
              >
                AI
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#00D4FF",
                  animation: "glowPulse 2s ease-in-out infinite",
                }}
              />
            </div>
            <span className="text-label" style={{ fontSize: "0.6rem" }}>
              Executive Observations
            </span>
          </div>
          <div className="divide-y divide-border/15">
            {aiInsights.map((insight, i) => {
              const accent = insightAccent(insight.severity);
              const iconMap = {
                critical: AlertCircle,
                risk: TrendingDown,
                commercial: Shield,
                asset: Zap,
              };
              const Icon = iconMap[insight.severity];
              return (
                <div
                  key={insight.id}
                  className="flex items-start gap-3 px-4 py-3.5 transition-smooth hover:bg-white/2"
                  data-ocid={`dashboard.insight.item.${i + 1}`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: accent.bg,
                      border: `1px solid ${accent.border}`,
                    }}
                  >
                    <Icon size={14} style={{ color: accent.label }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-bold mb-1"
                      style={{ color: accent.label, letterSpacing: "0.06em" }}
                    >
                      {insight.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.text}
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold flex items-center gap-1 transition-smooth"
                      style={{ color: "#00D4FF" }}
                      onClick={() =>
                        navigate({
                          to: insight.module as
                            | "/app/procurement"
                            | "/app/execution"
                            | "/app/commercial"
                            | "/app/governance"
                            | "/app/assets",
                        })
                      }
                      data-ocid={`dashboard.insight.analyze_button.${i + 1}`}
                    >
                      Analyze in {insight.moduleLabel}
                      <ChevronRight size={11} />
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
