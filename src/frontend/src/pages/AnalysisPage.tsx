import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Presentation,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
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
import { toast } from "sonner";

// ── Data ──────────────────────────────────────────────────────────────────────
const NIP_SECTORS = [
  {
    sector: "Energy",
    investment: 26.9,
    pct: 24.2,
    color: "#00D4FF",
    delay: 38,
    overrun: 16,
  },
  {
    sector: "Roads",
    investment: 20.3,
    pct: 18.3,
    color: "#00E676",
    delay: 44,
    overrun: 21,
  },
  {
    sector: "Urban",
    investment: 17.8,
    pct: 16.0,
    color: "#FFB300",
    delay: 54,
    overrun: 28,
  },
  {
    sector: "Railways",
    investment: 13.7,
    pct: 12.3,
    color: "#FF8C42",
    delay: 48,
    overrun: 19,
  },
  {
    sector: "Water",
    investment: 8.9,
    pct: 8.0,
    color: "#C084FC",
    delay: 35,
    overrun: 14,
  },
  {
    sector: "Digital",
    investment: 6.4,
    pct: 5.8,
    color: "#F472B6",
    delay: 22,
    overrun: 9,
  },
  {
    sector: "Health",
    investment: 4.3,
    pct: 3.9,
    color: "#34D399",
    delay: 29,
    overrun: 12,
  },
  {
    sector: "Agriculture",
    investment: 3.6,
    pct: 3.2,
    color: "#FBBF24",
    delay: 26,
    overrun: 11,
  },
];

const SECTOR_COMPARISON = NIP_SECTORS.map((s) => ({
  name: s.sector,
  Budget: s.investment,
  Spent: +(s.investment * 0.72).toFixed(1),
  Overrun: +(s.investment * (s.overrun / 100)).toFixed(1),
}));

const DELAY_BY_SECTOR = [
  { sector: "Urban", delayPct: 54 },
  { sector: "Railways", delayPct: 48 },
  { sector: "Roads", delayPct: 44 },
  { sector: "Energy", delayPct: 38 },
  { sector: "Water", delayPct: 35 },
  { sector: "Health", delayPct: 29 },
  { sector: "Digital", delayPct: 22 },
];

const DELAY_TREND = [
  { year: "2020", delayPct: 35 },
  { year: "2021", delayPct: 38 },
  { year: "2022", delayPct: 40 },
  { year: "2023", delayPct: 41.2 },
  { year: "2024", delayPct: 41.9 },
  { year: "2025", delayPct: 42.8 },
];

const DELAY_CAUSES = [
  { cause: "Land Acquisition", pct: 35, color: "#FF3D00" },
  { cause: "Env. Clearances", pct: 22, color: "#FF8C42" },
  { cause: "Contractual Disputes", pct: 18, color: "#FFB300" },
  { cause: "Funding Issues", pct: 15, color: "#C084FC" },
  { cause: "Technical Issues", pct: 10, color: "#00D4FF" },
];

const OVERRUN_TREND = [
  { year: "2020", overrun: 1.8 },
  { year: "2021", overrun: 2.4 },
  { year: "2022", overrun: 3.1 },
  { year: "2023", overrun: 3.8 },
  { year: "2024", overrun: 4.2 },
  { year: "2025", overrun: 4.8 },
];

const OVERRUN_BY_STATE = [
  { state: "Maharashtra", overrun: 82400 },
  { state: "Uttar Pradesh", overrun: 74200 },
  { state: "Rajasthan", overrun: 61800 },
  { state: "Bihar", overrun: 58300 },
  { state: "West Bengal", overrun: 52100 },
  { state: "Karnataka", overrun: 47600 },
  { state: "MP", overrun: 43200 },
  { state: "Gujarat", overrun: 38900 },
  { state: "Tamil Nadu", overrun: 34700 },
  { state: "Odisha", overrun: 29400 },
];

const OVERRUN_CATEGORIES = [
  { name: "Scope Changes / DPR Gaps", value: 32, color: "#FF3D00" },
  { name: "Material Price Escalation", value: 26, color: "#FF6D00" },
  { name: "Contractor Claims / EOTs", value: 21, color: "#FFB300" },
  { name: "Utility & Land Additions", value: 14, color: "#C084FC" },
  { name: "Force Majeure", value: 7, color: "#00D4FF" },
];

const VENDOR_RISK = [
  {
    vendor: "HCC Ltd",
    exposure: 18200,
    score: 81,
    risk: "CRITICAL",
    blacklist: "None",
  },
  {
    vendor: "Larsen & Toubro",
    exposure: 14800,
    score: 72,
    risk: "HIGH",
    blacklist: "None",
  },
  {
    vendor: "Afcons Infrastructure",
    exposure: 9200,
    score: 58,
    risk: "HIGH",
    blacklist: "None",
  },
  {
    vendor: "KNR Constructions",
    exposure: 7800,
    score: 52,
    risk: "MEDIUM",
    blacklist: "None",
  },
  {
    vendor: "Tata Projects",
    exposure: 6400,
    score: 41,
    risk: "MEDIUM",
    blacklist: "None",
  },
  {
    vendor: "NCC Limited",
    exposure: 4200,
    score: 34,
    risk: "LOW",
    blacklist: "None",
  },
  {
    vendor: "Ashoka Buildcon",
    exposure: 3800,
    score: 28,
    risk: "LOW",
    blacklist: "None",
  },
  {
    vendor: "Dilip Buildcon",
    exposure: 2900,
    score: 22,
    risk: "LOW",
    blacklist: "None",
  },
];

const SMART_CITY_DATA = [
  {
    city: "Pune",
    water: 1240,
    sewage: 680,
    streetlights: 124000,
    cameras: 8400,
  },
  {
    city: "Chennai",
    water: 980,
    sewage: 520,
    streetlights: 98000,
    cameras: 6800,
  },
  {
    city: "Ahmedabad",
    water: 1120,
    sewage: 610,
    streetlights: 112000,
    cameras: 7600,
  },
  {
    city: "Lucknow",
    water: 870,
    sewage: 440,
    streetlights: 86000,
    cameras: 5900,
  },
  {
    city: "Jaipur",
    water: 760,
    sewage: 390,
    streetlights: 74000,
    cameras: 4800,
  },
];

const SCADA_DATA = [
  { city: "Pune", total: 1240, scada: 880 },
  { city: "Chennai", total: 980, scada: 640 },
  { city: "Ahmedabad", total: 1120, scada: 820 },
  { city: "Lucknow", total: 870, scada: 540 },
  { city: "Jaipur", total: 760, scada: 440 },
];

const GOV_STATES = [
  { state: "Gujarat", sla: 91, avgDelay: 8, pending: 12 },
  { state: "Maharashtra", sla: 82, avgDelay: 14, pending: 28 },
  { state: "Karnataka", sla: 74, avgDelay: 18, pending: 34 },
  { state: "Rajasthan", sla: 66, avgDelay: 24, pending: 47 },
  { state: "UP", sla: 58, avgDelay: 31, pending: 63 },
  { state: "Tamil Nadu", sla: 78, avgDelay: 16, pending: 22 },
];

const AI_INSIGHTS = [
  {
    icon: AlertCircle,
    title: "Procurement Fraud Alert",
    desc: "L1 bid anomalies up 23% this quarter. 12 tenders show fraud probability >80%. Recommend CVC referral for NH-44 package and WB PWD cluster.",
    severity: "critical",
    color: "#FF3D00",
  },
  {
    icon: TrendingDown,
    title: "Execution Velocity Drop",
    desc: "NH construction rate in Q1 FY25 slipped to 31.2 km/day vs 33.8 km/day peak. Monsoon + resource shortage causing 2.6 km/day decline across 6 critical corridors.",
    severity: "high",
    color: "#FF8C42",
  },
  {
    icon: AlertTriangle,
    title: "Arbitration Exposure ₹70,000+ Cr",
    desc: "Active disputes across HCC, L&T, Afcons, KNR portfolios. CAG flagged ₹259.47 Cr missed toll revenue. Structured settlement guidance recommended.",
    severity: "high",
    color: "#FFB300",
  },
  {
    icon: Shield,
    title: "Governance SLA Breach",
    desc: "Ministry approval SLA compliance at 63%. West Bengal, Bihar, Odisha show highest breach rates. EGOS intervention recommended for 34 critical path approvals.",
    severity: "warning",
    color: "#C084FC",
  },
  {
    icon: Brain,
    title: "Smart Cities Assets At Risk",
    desc: "48% of Smart Cities water supply not SCADA-monitored. 3 cities show NRW losses >35%. Accelerate sensor deployment to hit FY26 coverage target.",
    severity: "info",
    color: "#00D4FF",
  },
  {
    icon: Zap,
    title: "Energy Sector Overspend",
    desc: "Energy at ₹26.9L Cr leads NIP pipeline but cost overrun at 16% — ₹4.3L Cr above budget. Transmission project land disputes are primary driver.",
    severity: "info",
    color: "#F472B6",
  },
];

const DELAYED_PROJECTS = [
  {
    project: "Mumbai Coastal Road",
    auth: "MCGM",
    planned: "Dec 2023",
    actual: "Jun 2026",
    delay: 30,
    cause: "Land Acquisition",
    overrun: 2847,
  },
  {
    project: "Delhi-Meerut RRTS Ph2",
    auth: "NCRTC",
    planned: "Jun 2025",
    actual: "Jun 2027",
    delay: 24,
    cause: "Utility Shifting",
    overrun: 1240,
  },
  {
    project: "Bangalore Metro Purple Ext",
    auth: "BMRCL",
    planned: "Dec 2024",
    actual: "Dec 2026",
    delay: 24,
    cause: "Contractor Issues",
    overrun: 1180,
  },
  {
    project: "Z-Morh Tunnel (NH-1)",
    auth: "NHIDCL",
    planned: "Mar 2022",
    actual: "Mar 2026",
    delay: 48,
    cause: "Geological Surprises",
    overrun: 980,
  },
  {
    project: "Hyderabad ORR Extension",
    auth: "HMDA",
    planned: "Jan 2023",
    actual: "Jan 2027",
    delay: 48,
    cause: "LA Disputes",
    overrun: 1620,
  },
  {
    project: "Chennai Port Highway",
    auth: "NHAI",
    planned: "Sep 2024",
    actual: "Jan 2026",
    delay: 16,
    cause: "Railway NOC Pending",
    overrun: 420,
  },
  {
    project: "Pune Metro Phase 2",
    auth: "PMRDA",
    planned: "Sep 2024",
    actual: "Mar 2027",
    delay: 30,
    cause: "Funding Gap",
    overrun: 760,
  },
  {
    project: "NH-17 Assam Corridor",
    auth: "NHAI/BRO",
    planned: "Jun 2023",
    actual: "Jun 2025",
    delay: 24,
    cause: "Flood / Geo Issues",
    overrun: 540,
  },
];

const CAG_FINDINGS = [
  {
    report: "CAG Report 36/2014",
    finding: "₹259.47 Cr missed toll revenue due to COD delays",
    amount: "₹259.47 Cr",
    status: "Pending",
  },
  {
    report: "CAG Report 12/2019",
    finding: "₹847 Cr DPR cost escalation without approval",
    amount: "₹847 Cr",
    status: "Under Audit",
  },
  {
    report: "CAG Report 28/2022",
    finding: "₹1,240 Cr PPP concession period discrepancy",
    amount: "₹1,240 Cr",
    status: "Pending",
  },
];

const RECOMMENDATIONS = [
  {
    num: 1,
    title: "Fast-Track Land Acquisition Courts",
    detail:
      "Establish 22 dedicated LA tribunals in UP, Bihar, WB, Rajasthan targeting 90-day resolution.",
    impact: "HIGH",
    savings: "₹18,000 Cr",
    color: "#FF3D00",
  },
  {
    num: 2,
    title: "Mandate GatiShakti for All MoSPI Projects",
    detail:
      "Target 100% GatiShakti adoption (currently 38%) for all 1,820 monitored projects by Q2 FY26.",
    impact: "HIGH",
    savings: "₹12,400 Cr",
    color: "#FF6D00",
  },
  {
    num: 3,
    title: "Resolve ₹70,000+ Cr Arbitration Backlog",
    detail:
      "NITI Aayog-led task force for structured EOT/claim resolution protocol to cut litigation by 60%.",
    impact: "HIGH",
    savings: "₹42,000 Cr",
    color: "#FF8C42",
  },
  {
    num: 4,
    title: "Scale GeM to 100% for Infrastructure Materials",
    detail:
      "Mandate GeM for steel, cement, bitumen procurement <₹5 Cr. Reduce avg tender duration to 15 days.",
    impact: "MEDIUM",
    savings: "₹2,400 Cr",
    color: "#FFB300",
  },
  {
    num: 5,
    title: "Deploy CVC Automated Fraud Detection",
    detail:
      "Automate CVC referral threshold at ₹50 Cr. Cover 3.2% of tenders showing >80% fraud probability.",
    impact: "MEDIUM",
    savings: "₹10,000 Cr",
    color: "#C084FC",
  },
  {
    num: 6,
    title: "Accelerate SCADA to 100% Smart City Water Networks",
    detail:
      "Expand from 52% to 100% SCADA coverage by FY2026. Reduce NRW losses by 22%.",
    impact: "MEDIUM",
    savings: "₹1,800 Cr",
    color: "#00E676",
  },
  {
    num: 7,
    title: "Predictive Maintenance for NH Bridge Inventory",
    detail:
      "Deploy IoT sensors on 500 critical bridges in Phase 1. Target 40% emergency repair cost reduction.",
    impact: "LOW",
    savings: "₹900 Cr",
    color: "#00D4FF",
  },
];

// ── Export helpers ─────────────────────────────────────────────────────────────
const EXPORT_SECTIONS = [
  { id: "nip_overview", label: "NIP Overview" },
  { id: "sectoral_breakdown", label: "Sectoral Breakdown" },
  { id: "delay_analysis", label: "Delay Analysis" },
  { id: "cost_overrun", label: "Cost Overrun Analysis" },
  { id: "vendor_risk", label: "Vendor Risk Assessment" },
  { id: "governance_health", label: "Governance Health" },
  { id: "asset_intelligence", label: "Asset Intelligence" },
  { id: "recommendations", label: "Key Recommendations" },
  { id: "ai_insights", label: "AI Insights" },
];

const PERIOD_OPTIONS = [
  { id: "30d", label: "Last 30 days" },
  { id: "quarter", label: "Last Quarter" },
  { id: "6m", label: "Last 6 months" },
  { id: "fy2425", label: "Financial Year 2024-25" },
];

const TABS = [
  "Overview",
  "Sector Analysis",
  "Delay Intelligence",
  "Cost Overrun",
  "Vendor Risk",
  "Governance",
  "Smart Cities",
];

type ExportFormat = "pdf" | "excel" | "ppt";

function impactClass(impact: string): string {
  return impact === "HIGH"
    ? "badge-critical"
    : impact === "MEDIUM"
      ? "badge-warning"
      : "badge-success";
}

function riskColor(risk: string): string {
  return risk === "CRITICAL"
    ? "#FF3D00"
    : risk === "HIGH"
      ? "#FF8C42"
      : risk === "MEDIUM"
        ? "#FFB300"
        : "#00E676";
}

function riskBadgeClass(risk: string): string {
  return risk === "CRITICAL"
    ? "badge-critical"
    : risk === "HIGH"
      ? "badge-high"
      : risk === "MEDIUM"
        ? "badge-warning"
        : "badge-success";
}

function downloadRealCSV() {
  const now = new Date().toISOString().split("T")[0];
  const lines: string[] = [
    "INFRAOS COMPREHENSIVE INFRASTRUCTURE ANALYTICS REPORT",
    `Generated,${now}`,
    "Prepared For,Naman Maheshwari",
    "Classification,RESTRICTED",
    "",
    "=== EXECUTIVE KPIs ===",
    "Metric,Value",
    "NIP Total Investment,₹111 Lakh Crore",
    "Active Mega Projects,1820",
    "Delay Ratio,42.8%",
    "Cost Overrun Aggregate,₹4.8L Cr (18.2%)",
    "Arbitration Exposure,₹70000 Cr+",
    "",
    "=== NIP SECTOR BREAKDOWN ===",
    "Sector,Budget (₹L Cr),Share (%),Delay Rate,Overrun %,Key Risk",
    "Energy,26.9,24.2%,38%,16%,Land / Transmission delays",
    "Roads & Highways,20.3,18.3%,44%,21%,Land Acquisition / DPR gaps",
    "Urban Infrastructure,17.8,16.0%,54%,28%,Utility shifting / civic delays",
    "Railways,13.7,12.3%,48%,19%,Land / Geological surprises",
    "Water & Irrigation,8.9,8.0%,35%,14%,Execution bottlenecks",
    "Digital Infrastructure,6.4,5.8%,22%,9%,Low risk",
    "Health & Education,4.3,3.9%,29%,12%,Funding gaps",
    "Agriculture & Processing,3.6,3.2%,26%,11%,Private sector coordination",
    "",
    "=== TOP DELAYED PROJECTS ===",
    "Project,Authority,Planned,Actual,Delay (months),Cause,Overrun (₹Cr)",
    ...DELAYED_PROJECTS.map(
      (p) =>
        `${p.project},${p.auth},${p.planned},${p.actual},${p.delay},${p.cause},${p.overrun}`,
    ),
    "",
    "=== COST OVERRUN BY STATE (TOP 10) ===",
    "State,Overrun (₹Cr)",
    ...OVERRUN_BY_STATE.map((s) => `${s.state},${s.overrun}`),
    "",
    "=== VENDOR RISK ASSESSMENT ===",
    "Vendor,Arbitration Exposure (₹Cr),Risk Score,Risk Level,Blacklist Status",
    ...VENDOR_RISK.map(
      (v) =>
        `${v.vendor},${v.exposure},${v.score}/100,${v.risk},${v.blacklist}`,
    ),
    "",
    "=== SMART CITIES ASSET DATA ===",
    "City,Water Pipelines (km),Sewerage (km),Streetlights,Cameras",
    ...SMART_CITY_DATA.map(
      (c) => `${c.city},${c.water},${c.sewage},${c.streetlights},${c.cameras}`,
    ),
    "",
    "=== GOVERNANCE HEALTH ===",
    "State,SLA Compliance (%),Avg Approval Delay (days),Pending Approvals",
    ...GOV_STATES.map((s) => `${s.state},${s.sla}%,${s.avgDelay},${s.pending}`),
    "",
    "=== KEY RECOMMENDATIONS ===",
    "Priority,Title,Impact,Estimated Savings",
    ...RECOMMENDATIONS.map(
      (r) => `${r.num},"${r.title}",${r.impact},${r.savings}`,
    ),
  ];
  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `InfraOS-Analytics-Full-Report-${now}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("Report downloaded — InfraOS-Analytics-Full-Report.csv", {
    duration: 4000,
  });
}

// ── Export Full Report Modal ──────────────────────────────────────────────────
const EXPORT_GEN_STEPS = [
  "Fetching data",
  "Compiling sections",
  "Rendering charts",
  "Generating report",
  "Ready",
];

function ExportFullReportModal({ onClose }: { onClose: () => void }) {
  const [sections, setSections] = useState<Record<string, boolean>>(
    Object.fromEntries(EXPORT_SECTIONS.map((s) => [s.id, true])),
  );
  const [period, setPeriod] = useState("fy2425");
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(-1);
  const [done, setDone] = useState(false);
  const selectedCount = Object.values(sections).filter(Boolean).length;
  const SIZE_MAP: Record<ExportFormat, string> = {
    pdf: "4.2 MB",
    excel: "2.8 MB",
    ppt: "6.1 MB",
  };
  const FORMAT_OPTIONS: {
    id: ExportFormat;
    label: string;
    icon: React.ElementType;
    color: string;
    desc: string;
  }[] = [
    {
      id: "pdf",
      label: "PDF",
      icon: FileText,
      color: "#FF6B6B",
      desc: "Formatted document",
    },
    {
      id: "excel",
      label: "Excel",
      icon: FileSpreadsheet,
      color: "#00E676",
      desc: "Data + charts",
    },
    {
      id: "ppt",
      label: "PowerPoint",
      icon: Presentation,
      color: "#FF8C42",
      desc: "Slide deck",
    },
  ];

  function startGeneration() {
    setGenerating(true);
    setGenStep(0);
    let step = 0;
    const iv = setInterval(() => {
      step += 1;
      if (step >= EXPORT_GEN_STEPS.length - 1) {
        clearInterval(iv);
        setGenStep(EXPORT_GEN_STEPS.length - 1);
        setDone(true);
      } else setGenStep(step);
    }, 800);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.82)" }}
      data-ocid="export_report.dialog"
    >
      <div
        className="glass-elevated w-full max-w-2xl mx-4 flex flex-col"
        style={{ maxHeight: "93vh" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.25)",
              }}
            >
              <Download size={16} className="text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Export Comprehensive Report
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-1.5"
            aria-label="Close"
            data-ocid="export_report.close_button"
          >
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {done ? (
            <div
              className="py-8 text-center"
              data-ocid="export_report.success_state"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{
                  background: "rgba(0,230,118,0.1)",
                  border: "1px solid rgba(0,230,118,0.3)",
                }}
              >
                <CheckCircle2 size={28} style={{ color: "#00E676" }} />
              </div>
              <p className="text-lg font-bold text-foreground mb-1">
                Report Ready
              </p>
              <p className="text-xs text-muted-foreground mb-8">
                {selectedCount} sections ·{" "}
                {PERIOD_OPTIONS.find((p) => p.id === period)?.label}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="btn-primary text-sm flex items-center gap-2"
                  onClick={downloadRealCSV}
                  data-ocid="export_report.download_button"
                >
                  <Download size={14} /> Download {format.toUpperCase()} (
                  {SIZE_MAP[format]})
                </button>
                <button
                  type="button"
                  className="btn-secondary text-sm"
                  onClick={onClose}
                  data-ocid="export_report.done_button"
                >
                  Close
                </button>
              </div>
            </div>
          ) : generating ? (
            <div className="py-6" data-ocid="export_report.loading_state">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                <RefreshCw size={22} className="text-primary animate-spin" />
              </div>
              <p className="text-sm font-bold text-foreground text-center mb-6">
                Generating Comprehensive Report…
              </p>
              <div className="space-y-2.5 max-w-sm mx-auto">
                {EXPORT_GEN_STEPS.map((stepLabel, i) => {
                  const isActive = genStep === i;
                  const isDone = genStep > i;
                  return (
                    <div
                      key={stepLabel}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-smooth ${isActive ? "bg-primary/10 border border-primary/30" : isDone ? "opacity-50" : "opacity-30"}`}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isDone
                            ? "rgba(0,230,118,0.15)"
                            : isActive
                              ? "rgba(0,212,255,0.15)"
                              : "rgba(255,255,255,0.05)",
                        }}
                      >
                        {isDone ? (
                          <CheckCircle2
                            size={12}
                            style={{ color: "#00E676" }}
                          />
                        ) : isActive ? (
                          <Loader2
                            size={12}
                            className="text-primary animate-spin"
                          />
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            {i + 1}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {stepLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-label">REPORT SECTIONS</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-[10px] text-primary hover:underline"
                      onClick={() =>
                        setSections(
                          Object.fromEntries(
                            EXPORT_SECTIONS.map((s) => [s.id, true]),
                          ),
                        )
                      }
                    >
                      Select All
                    </button>
                    <span className="text-muted-foreground/40">·</span>
                    <button
                      type="button"
                      className="text-[10px] text-muted-foreground hover:underline"
                      onClick={() =>
                        setSections(
                          Object.fromEntries(
                            EXPORT_SECTIONS.map((s) => [s.id, false]),
                          ),
                        )
                      }
                    >
                      Clear All
                    </button>
                    <span className="text-[10px] text-muted-foreground ml-1">
                      ({selectedCount} selected)
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EXPORT_SECTIONS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      data-ocid={`export_report.section.${id}`}
                      onClick={() =>
                        setSections((prev) => ({ ...prev, [id]: !prev[id] }))
                      }
                      className={`flex items-center gap-2 px-3 py-2.5 rounded text-xs text-left transition-smooth border ${sections[id] ? "border-primary/50 bg-primary/8 text-primary" : "glass-card text-muted-foreground hover:text-foreground"}`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${sections[id] ? "bg-primary border-primary" : "border-border"}`}
                      >
                        {sections[id] && (
                          <CheckCircle2 size={9} className="text-background" />
                        )}
                      </div>
                      <span className="truncate">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-label mb-3">REPORT PERIOD</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PERIOD_OPTIONS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      data-ocid={`export_report.period.${id}`}
                      onClick={() => setPeriod(id)}
                      className={`px-3 py-2.5 rounded text-xs font-medium text-center transition-smooth border ${period === id ? "border-primary bg-primary/10 text-primary" : "glass-card text-muted-foreground hover:text-foreground"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-label mb-3">OUTPUT FORMAT</p>
                <div className="grid grid-cols-3 gap-3">
                  {FORMAT_OPTIONS.map(
                    ({ id, label, icon: Icon, color, desc }) => (
                      <button
                        key={id}
                        type="button"
                        data-ocid={`export_report.format.${id}`}
                        onClick={() => setFormat(id)}
                        className={`flex items-center gap-3 p-3.5 rounded-lg text-left transition-smooth border ${format === id ? "border-primary bg-primary/8" : "glass-card hover:border-primary/20"}`}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `${color}15`,
                            border: `1px solid ${color}25`,
                          }}
                        >
                          <Icon size={16} style={{ color }} />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-bold ${format === id ? "text-primary" : "text-foreground"}`}
                          >
                            {label}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {desc}
                          </p>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        {!generating && !done && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/40">
            <span className="text-xs text-muted-foreground">
              {selectedCount} sections
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-ghost text-sm px-3 py-2"
                onClick={onClose}
                data-ocid="export_report.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary text-sm flex items-center gap-2"
                onClick={startGeneration}
                disabled={selectedCount === 0}
                data-ocid="export_report.generate_button"
              >
                <Zap size={14} /> Generate Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-xs shadow-xl"
      style={{
        background: "rgba(8,10,16,0.95)",
        border: "1px solid rgba(0,212,255,0.2)",
      }}
    >
      {label && <p className="font-bold text-white mb-1">{label}</p>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Tab Views ────────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div className="space-y-6" data-ocid="analysis.overview_tab">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(13,17,23,0.95)",
            border: "1px solid rgba(0,212,255,0.12)",
          }}
        >
          <h3 className="font-semibold text-sm text-white mb-4">
            NIP Sector Breakdown (₹ Lakh Crore)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={NIP_SECTORS}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="sector"
                tick={{ fill: "#808080", fontSize: 10 }}
              />
              <YAxis tick={{ fill: "#808080", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="investment" name="₹ L Cr" radius={[3, 3, 0, 0]}>
                {NIP_SECTORS.map((s) => (
                  <Cell key={s.sector} fill={s.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(13,17,23,0.95)",
            border: "1px solid rgba(0,212,255,0.12)",
          }}
        >
          <h3 className="font-semibold text-sm text-white mb-4">
            Delay Rate by Sector (%)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={DELAY_BY_SECTOR}
                dataKey="delayPct"
                nameKey="sector"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={3}
                label={(e) => `${e.sector}`}
              >
                {DELAY_BY_SECTOR.map((entry, i) => (
                  <Cell
                    key={entry.sector}
                    fill={NIP_SECTORS[i % NIP_SECTORS.length].color}
                    fillOpacity={0.85}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`${v}%`, "Delay Rate"]}
                contentStyle={{
                  background: "rgba(8,10,16,0.95)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(13,17,23,0.95)",
          border: "1px solid rgba(255,61,0,0.15)",
        }}
      >
        <h3 className="font-semibold text-sm text-white mb-4">
          Cumulative Cost Overrun Trend (₹ Lakh Crore)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={OVERRUN_TREND}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="overrunGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF3D00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF3D00" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis dataKey="year" tick={{ fill: "#808080", fontSize: 10 }} />
            <YAxis tick={{ fill: "#808080", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="overrun"
              name="Overrun (₹L Cr)"
              stroke="#FF3D00"
              strokeWidth={2}
              fill="url(#overrunGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="font-semibold text-sm text-white mb-3">
          AI Intelligence Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {AI_INSIGHTS.map((insight) => (
            <div
              key={insight.title}
              className="rounded-xl p-4"
              style={{
                background: `${insight.color}08`,
                border: `1px solid ${insight.color}25`,
              }}
            >
              <div className="flex items-start gap-2 mb-2">
                <insight.icon
                  size={14}
                  style={{ color: insight.color, flexShrink: 0, marginTop: 2 }}
                />
                <p className="font-bold text-xs text-white leading-tight">
                  {insight.title}
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {insight.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectorAnalysisTab() {
  return (
    <div className="space-y-6" data-ocid="analysis.sector_tab">
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(0,212,255,0.12)" }}
      >
        <div
          className="px-5 py-3 border-b border-white/5"
          style={{ background: "rgba(0,212,255,0.04)" }}
        >
          <h3 className="font-semibold text-sm text-white">
            NIP Sector Breakdown — Full Detail
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  "Sector",
                  "Budget (₹L Cr)",
                  "Share (%)",
                  "Projects Est.",
                  "Delayed %",
                  "Cost Overrun %",
                  "Key Risk",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-muted-foreground font-medium whitespace-nowrap"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NIP_SECTORS.map((s, i) => (
                <tr
                  key={s.sector}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                  data-ocid={`analysis.sector_row.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: s.color }}
                      />
                      <span className="font-semibold text-white">
                        {s.sector}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 font-mono font-bold"
                    style={{ color: s.color }}
                  >
                    ₹{s.investment}L
                  </td>
                  <td className="px-4 py-3 font-mono text-white">{s.pct}%</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {Math.round(s.investment * 12)}
                  </td>
                  <td
                    className="px-4 py-3 font-mono font-bold"
                    style={{ color: s.delay > 40 ? "#FF6D00" : "#FFB300" }}
                  >
                    {s.delay}%
                  </td>
                  <td
                    className="px-4 py-3 font-mono"
                    style={{ color: s.overrun > 20 ? "#FF3D00" : "#FFB300" }}
                  >
                    {s.overrun}%
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.delay > 45
                      ? "Land / Clearances"
                      : s.delay > 35
                        ? "Execution velocity"
                        : "Low"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(13,17,23,0.95)",
          border: "1px solid rgba(0,212,255,0.12)",
        }}
      >
        <h3 className="font-semibold text-sm text-white mb-4">
          Budget vs Spent vs Overrun per Sector (₹ L Cr)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={SECTOR_COMPARISON}
            margin={{ top: 0, right: 0, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis dataKey="name" tick={{ fill: "#808080", fontSize: 9 }} />
            <YAxis tick={{ fill: "#808080", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10, color: "#808080" }} />
            <Bar
              dataKey="Budget"
              fill="#00D4FF"
              fillOpacity={0.7}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="Spent"
              fill="#00E676"
              fillOpacity={0.7}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="Overrun"
              fill="#FF3D00"
              fillOpacity={0.7}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DelayIntelligenceTab() {
  return (
    <div className="space-y-6" data-ocid="analysis.delay_tab">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(13,17,23,0.95)",
            border: "1px solid rgba(0,212,255,0.12)",
          }}
        >
          <h3 className="font-semibold text-sm text-white mb-4">
            Delay Root Causes Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={DELAY_CAUSES}
                dataKey="pct"
                nameKey="cause"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={50}
                paddingAngle={3}
                label={({ pct }) => `${pct}%`}
              >
                {DELAY_CAUSES.map((d) => (
                  <Cell key={d.cause} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`${v}%`, "Share"]}
                contentStyle={{
                  background: "rgba(8,10,16,0.95)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {DELAY_CAUSES.map((d) => (
              <div key={d.cause} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: d.color }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {d.cause} ({d.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(13,17,23,0.95)",
            border: "1px solid rgba(255,109,0,0.15)",
          }}
        >
          <h3 className="font-semibold text-sm text-white mb-4">
            National Delay Rate Trend 2020–2025 (%)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={DELAY_TREND}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis dataKey="year" tick={{ fill: "#808080", fontSize: 10 }} />
              <YAxis
                domain={[30, 46]}
                tick={{ fill: "#808080", fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="delayPct"
                name="Delay Rate %"
                stroke="#FF8C42"
                strokeWidth={2}
                dot={{ fill: "#FF8C42", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,61,0,0.15)" }}
      >
        <div
          className="px-5 py-3 border-b border-white/5"
          style={{ background: "rgba(255,61,0,0.04)" }}
        >
          <h3 className="font-semibold text-sm text-white">
            Top 8 Delayed Projects — National Portfolio
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  "Project",
                  "Authority",
                  "Planned",
                  "Actual",
                  "Delay (mo)",
                  "Cause",
                  "Overrun ₹Cr",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-muted-foreground font-medium whitespace-nowrap"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DELAYED_PROJECTS.map((r, i) => (
                <tr
                  key={r.project}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                  data-ocid={`analysis.delayed_project.${i + 1}`}
                >
                  <td className="px-4 py-3 font-semibold text-white max-w-[180px]">
                    <span className="block truncate">{r.project}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {r.auth}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {r.planned}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                    {r.actual}
                  </td>
                  <td
                    className="px-4 py-3 font-mono font-bold whitespace-nowrap"
                    style={{ color: "#FF6D00" }}
                  >
                    +{r.delay}mo
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {r.cause}
                  </td>
                  <td
                    className="px-4 py-3 font-mono font-bold whitespace-nowrap"
                    style={{ color: "#FF3D00" }}
                  >
                    ₹{r.overrun}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CostOverrunTab() {
  const maxOverrun = Math.max(...OVERRUN_BY_STATE.map((s) => s.overrun));
  return (
    <div className="space-y-6" data-ocid="analysis.cost_tab">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Overrun", value: "₹4.8L Cr", color: "#FF3D00" },
          { label: "Avg per Project", value: "₹260 Cr", color: "#FF8C42" },
          { label: "Max Single Project", value: "₹2,847 Cr", color: "#FFB300" },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl p-4 text-center"
            style={{
              background: `${k.color}08`,
              border: `1px solid ${k.color}20`,
            }}
          >
            <p
              className="font-mono font-bold text-xl"
              style={{ color: k.color }}
            >
              {k.value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">{k.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(13,17,23,0.95)",
            border: "1px solid rgba(0,212,255,0.12)",
          }}
        >
          <h3 className="font-semibold text-sm text-white mb-4">
            Cost Overrun by State — Top 10 (₹ Cr)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={OVERRUN_BY_STATE}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#808080", fontSize: 10 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <YAxis
                type="category"
                dataKey="state"
                tick={{ fill: "#808080", fontSize: 10 }}
                width={80}
              />
              <Tooltip
                formatter={(v) => [`₹${v.toLocaleString()} Cr`, "Overrun"]}
                contentStyle={{
                  background: "rgba(8,10,16,0.95)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
              />
              <Bar dataKey="overrun" radius={[0, 3, 3, 0]}>
                {OVERRUN_BY_STATE.map((s) => (
                  <Cell
                    key={s.state}
                    fill={`rgba(255,61,0,${0.4 + (s.overrun / maxOverrun) * 0.6})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(13,17,23,0.95)",
            border: "1px solid rgba(255,109,0,0.15)",
          }}
        >
          <h3 className="font-semibold text-sm text-white mb-4">
            Cost Overrun Category Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={OVERRUN_CATEGORIES}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={3}
                label={({ value }) => `${value}%`}
              >
                {OVERRUN_CATEGORIES.map((c) => (
                  <Cell key={c.name} fill={c.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`${v}%`, "Share"]}
                contentStyle={{
                  background: "rgba(8,10,16,0.95)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {OVERRUN_CATEGORIES.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: c.color }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {c.name}
                  </span>
                </div>
                <span
                  className="font-mono font-bold text-[10px]"
                  style={{ color: c.color }}
                >
                  {c.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VendorRiskTab() {
  const maxExposure = Math.max(...VENDOR_RISK.map((v) => v.exposure));
  return (
    <div className="space-y-6" data-ocid="analysis.vendor_tab">
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,109,0,0.15)" }}
      >
        <div
          className="px-5 py-3 border-b border-white/5"
          style={{ background: "rgba(255,109,0,0.04)" }}
        >
          <h3 className="font-semibold text-sm text-white">
            Vendor Risk Heatmap — Top 8 Contractors
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  "Vendor",
                  "Arbitration Exposure",
                  "Risk Score",
                  "Risk Level",
                  "Blacklist",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-muted-foreground font-medium whitespace-nowrap"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VENDOR_RISK.map((v, i) => (
                <tr
                  key={v.vendor}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                  data-ocid={`analysis.vendor_row.${i + 1}`}
                >
                  <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                    {v.vendor}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          minWidth: 60,
                        }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(v.exposure / maxExposure) * 100}%`,
                            background: riskColor(v.risk),
                          }}
                        />
                      </div>
                      <span
                        className="font-mono font-bold whitespace-nowrap"
                        style={{ color: riskColor(v.risk) }}
                      >
                        ₹{v.exposure.toLocaleString()} Cr
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs"
                      style={{
                        background: `${riskColor(v.risk)}18`,
                        color: riskColor(v.risk),
                        border: `1px solid ${riskColor(v.risk)}30`,
                      }}
                    >
                      {v.score}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={riskBadgeClass(v.risk)}>{v.risk}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-success">{v.blacklist}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(13,17,23,0.95)",
          border: "1px solid rgba(255,109,0,0.15)",
        }}
      >
        <h3 className="font-semibold text-sm text-white mb-4">
          Arbitration Exposure by Vendor (₹ Cr)
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={VENDOR_RISK}
            layout="vertical"
            margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: "#808080", fontSize: 10 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />
            <YAxis
              type="category"
              dataKey="vendor"
              tick={{ fill: "#808080", fontSize: 10 }}
              width={140}
            />
            <Tooltip
              formatter={(v) => [
                `₹${v.toLocaleString()} Cr`,
                "Arbitration Exposure",
              ]}
              contentStyle={{
                background: "rgba(8,10,16,0.95)",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
            />
            <Bar dataKey="exposure" name="Exposure (₹Cr)" radius={[0, 3, 3, 0]}>
              {VENDOR_RISK.map((v) => (
                <Cell
                  key={v.vendor}
                  fill={riskColor(v.risk)}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function GovernanceTab() {
  return (
    <div className="space-y-6" data-ocid="analysis.governance_tab">
      <div>
        <h3 className="font-semibold text-sm text-white mb-3">
          State Governance Health
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GOV_STATES.map((s, i) => (
            <div
              key={s.state}
              className="rounded-xl p-4"
              style={{
                background: "rgba(13,17,23,0.95)",
                border: `1px solid ${s.sla >= 80 ? "rgba(0,230,118,0.2)" : s.sla >= 70 ? "rgba(0,212,255,0.15)" : "rgba(255,109,0,0.18)"}`,
              }}
              data-ocid={`analysis.gov_state.${i + 1}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-white">{s.state}</span>
                <span
                  className={
                    s.sla >= 80
                      ? "badge-success"
                      : s.sla >= 70
                        ? "badge-low"
                        : "badge-warning"
                  }
                >
                  {s.sla}% SLA
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Avg Approval Delay
                  </span>
                  <span
                    className="font-mono"
                    style={{ color: s.avgDelay > 25 ? "#FF8C42" : "#00D4FF" }}
                  >
                    {s.avgDelay} days
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Pending Approvals
                  </span>
                  <span
                    className="font-mono"
                    style={{ color: s.pending > 40 ? "#FF3D00" : "#FFB300" }}
                  >
                    {s.pending}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.sla}%`,
                      background:
                        s.sla >= 80
                          ? "#00E676"
                          : s.sla >= 70
                            ? "#00D4FF"
                            : "#FF8C42",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,61,0,0.2)" }}
      >
        <div
          className="px-5 py-3 border-b border-white/5"
          style={{ background: "rgba(255,61,0,0.04)" }}
        >
          <h3 className="font-semibold text-sm text-white">
            CAG Audit Findings
          </h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              {["Report", "Finding", "Amount", "Status"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 text-muted-foreground font-medium whitespace-nowrap"
                  style={{ fontSize: "0.65rem" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAG_FINDINGS.map((f, i) => (
              <tr
                key={f.report}
                className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                data-ocid={`analysis.cag_finding.${i + 1}`}
              >
                <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                  {f.report}
                </td>
                <td className="px-4 py-3 text-white">{f.finding}</td>
                <td
                  className="px-4 py-3 font-mono font-bold whitespace-nowrap"
                  style={{ color: "#FF8C42" }}
                >
                  {f.amount}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={
                      f.status === "Pending"
                        ? "badge-warning"
                        : f.status === "Under Audit"
                          ? "badge-high"
                          : "badge-success"
                    }
                  >
                    {f.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SmartCitiesTab() {
  return (
    <div className="space-y-6" data-ocid="analysis.smart_cities_tab">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Water Pipelines", value: "13,144 km", color: "#00D4FF" },
          { label: "Sewerage Pipelines", value: "5,385 km", color: "#00E676" },
          { label: "LED Streetlights", value: "2.7M+", color: "#FFB300" },
          { label: "Surveillance Cameras", value: "76,000+", color: "#C084FC" },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl p-4 text-center"
            style={{
              background: `${k.color}08`,
              border: `1px solid ${k.color}20`,
            }}
          >
            <p
              className="font-mono font-bold text-lg"
              style={{ color: k.color }}
            >
              {k.value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">{k.label}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="font-semibold text-sm text-white mb-3">
          Smart Cities — Infrastructure Assets per City
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SMART_CITY_DATA.map((c, i) => (
            <div
              key={c.city}
              className="rounded-xl p-4"
              style={{
                background: "rgba(0,212,255,0.04)",
                border: "1px solid rgba(0,212,255,0.12)",
              }}
              data-ocid={`analysis.smart_city.${i + 1}`}
            >
              <p className="font-bold text-sm text-white mb-3">{c.city}</p>
              <div className="space-y-2">
                {[
                  {
                    label: "Water Pipelines",
                    value: `${c.water} km`,
                    color: "#00D4FF",
                  },
                  {
                    label: "Sewerage",
                    value: `${c.sewage} km`,
                    color: "#00E676",
                  },
                  {
                    label: "Streetlights",
                    value: c.streetlights.toLocaleString(),
                    color: "#FFB300",
                  },
                  {
                    label: "Cameras",
                    value: c.cameras.toLocaleString(),
                    color: "#C084FC",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between text-xs"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span
                      className="font-mono font-semibold"
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(13,17,23,0.95)",
          border: "1px solid rgba(0,212,255,0.12)",
        }}
      >
        <h3 className="font-semibold text-sm text-white mb-4">
          SCADA Monitoring Coverage — Water Supply (km)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={SCADA_DATA}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis dataKey="city" tick={{ fill: "#808080", fontSize: 10 }} />
            <YAxis tick={{ fill: "#808080", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10, color: "#808080" }} />
            <Bar
              dataKey="total"
              name="Total Network (km)"
              fill="rgba(0,212,255,0.3)"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="scada"
              name="SCADA Monitored (km)"
              fill="#00D4FF"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className="p-6 space-y-6 min-h-full" data-ocid="analysis.page">
      {showExportModal && (
        <ExportFullReportModal onClose={() => setShowExportModal(false)} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
            >
              <BarChart3 size={20} style={{ color: "#00D4FF" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Infrastructure Analytics Command Center
              </h1>
              <p className="text-xs text-muted-foreground">
                National Infrastructure Pipeline · FY 2020-25 · Real-time
                Intelligence
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={downloadRealCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.25)",
              color: "#00D4FF",
            }}
            data-ocid="analysis.export_data_button"
          >
            <Download size={13} /> Export Data
          </button>
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "rgba(0,230,118,0.08)",
              border: "1px solid rgba(0,230,118,0.25)",
              color: "#00E676",
            }}
            data-ocid="analysis.generate_report_button"
          >
            <FileText size={13} /> Generate Full Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="analysis.kpis"
      >
        {[
          {
            label: "NIP Pipeline",
            value: "₹111L Cr",
            sub: "FY 2020-25",
            color: "#00D4FF",
            icon: TrendingUp,
          },
          {
            label: "Active Projects",
            value: "1,820",
            sub: "MoSPI Monitored",
            color: "#00E676",
            icon: Building2,
          },
          {
            label: "Delay Ratio",
            value: "42.8%",
            sub: "780 projects",
            color: "#FF8C42",
            icon: TrendingDown,
          },
          {
            label: "Cost Overrun",
            value: "18.2%",
            sub: "₹4.8L Cr",
            color: "#FF3D00",
            icon: AlertTriangle,
          },
        ].map((k, i) => (
          <div
            key={k.label}
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: `${k.color}08`,
              border: `1px solid ${k.color}20`,
            }}
            data-ocid={`analysis.kpi.${i + 1}`}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${k.color}18`, color: k.color }}
            >
              <k.icon size={16} />
            </div>
            <div className="min-w-0">
              <p
                className="font-mono font-bold text-xl text-white leading-tight"
                style={{ color: k.color }}
              >
                {k.value}
              </p>
              <p className="text-xs font-semibold text-white">{k.label}</p>
              <p className="text-[10px] text-muted-foreground">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Nav */}
      <div
        className="flex gap-1 flex-wrap rounded-xl p-1"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(0,212,255,0.08)",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={
              activeTab === tab
                ? {
                    background: "rgba(0,212,255,0.15)",
                    color: "#00D4FF",
                    border: "1px solid rgba(0,212,255,0.3)",
                  }
                : { color: "rgba(176,190,197,0.7)" }
            }
            data-ocid={`analysis.tab.${tab.toLowerCase().replace(/ /g, "_")}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Sector Analysis" && <SectorAnalysisTab />}
        {activeTab === "Delay Intelligence" && <DelayIntelligenceTab />}
        {activeTab === "Cost Overrun" && <CostOverrunTab />}
        {activeTab === "Vendor Risk" && <VendorRiskTab />}
        {activeTab === "Governance" && <GovernanceTab />}
        {activeTab === "Smart Cities" && <SmartCitiesTab />}
      </div>

      {/* Key Recommendations (always visible) */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(0,212,255,0.12)" }}
        data-ocid="analysis.recommendations"
      >
        <div
          className="px-5 py-4 flex items-center justify-between border-b border-white/5"
          style={{ background: "rgba(0,212,255,0.04)" }}
        >
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: "#00D4FF" }} />
            <h2 className="font-bold text-sm text-white">
              Key Recommendations — Ranked by Impact
            </h2>
          </div>
          <button
            type="button"
            onClick={downloadRealCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-semibold"
            style={{
              background: "rgba(0,230,118,0.08)",
              border: "1px solid rgba(0,230,118,0.2)",
              color: "#00E676",
            }}
            data-ocid="analysis.export_full_button"
          >
            <Download size={11} /> Export Full Report
          </button>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {RECOMMENDATIONS.map((r) => (
            <div
              key={r.num}
              className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02]"
              data-ocid={`analysis.recommendation.${r.num}`}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs flex-shrink-0"
                style={{
                  background: `${r.color}15`,
                  color: r.color,
                  border: `1px solid ${r.color}30`,
                }}
              >
                {r.num.toString().padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm text-white">
                    {r.title}
                  </span>
                  <span className={impactClass(r.impact)}>{r.impact}</span>
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: "#00E676" }}
                  >
                    Savings: {r.savings}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {r.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
