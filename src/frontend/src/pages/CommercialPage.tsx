import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart2,
  CheckCircle,
  CheckSquare,
  ChevronRight,
  Download,
  FileBarChart2,
  FileSpreadsheet,
  FileText,
  FileWarning,
  Flag,
  RefreshCcw,
  Scale,
  ShieldAlert,
  Square,
  TrendingDown,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useOrg } from "../context/OrgContext";
import { NATIONAL_STATS, getOrgData } from "../data/orgData";

// ── Data ─────────────────────────────────────────────────────────────────────

const CLAIMS_DATA = [
  {
    id: 1,
    project: "Delhi-Meerut RRTS Phase 2",
    contractor: "Tata Projects",
    claimType: "EOT + Cost Escalation",
    value: "₹1,234 Cr",
    probability: 89,
    eotRisk: "HIGH",
    status: "Active",
  },
  {
    id: 2,
    project: "Mumbai-Nagpur Expressway",
    contractor: "L&T Construction",
    claimType: "BOQ Variation",
    value: "₹678 Cr",
    probability: 67,
    eotRisk: "MEDIUM",
    status: "Pre-Dispute",
  },
  {
    id: 3,
    project: "Bangalore Metro Extension",
    contractor: "Afcons Infrastructure",
    claimType: "Delay Damages",
    value: "₹456 Cr",
    probability: 91,
    eotRisk: "CRITICAL",
    status: "Arbitration",
  },
  {
    id: 4,
    project: "Chennai Port Highway",
    contractor: "HCC Ltd",
    claimType: "EOT + Resource Idle",
    value: "₹340 Cr",
    probability: 74,
    eotRisk: "HIGH",
    status: "Pre-Notice",
  },
  {
    id: 5,
    project: "Pune Ring Road Pkg 5",
    contractor: "NCC Ltd",
    claimType: "Utility Delay Damages",
    value: "₹234 Cr",
    probability: 82,
    eotRisk: "HIGH",
    status: "Active",
  },
  {
    id: 6,
    project: "Mumbai Trans Harbour Link",
    contractor: "L&T IDPL",
    claimType: "Scope Variation",
    value: "₹890 Cr",
    probability: 45,
    eotRisk: "MEDIUM",
    status: "Negotiation",
  },
  {
    id: 7,
    project: "Ahmedabad Greenfield Exp",
    contractor: "Ashoka Buildcon",
    claimType: "Material Escalation",
    value: "₹178 Cr",
    probability: 58,
    eotRisk: "MEDIUM",
    status: "Pre-Dispute",
  },
];

const EOT_DATA = [
  {
    project: "Delhi RRTS",
    days: 127,
    score: 87,
    basis:
      "Strong technical basis: Railway NOC delay (govt-caused) directly attributable",
    recommendation: "HIGH MERIT — Support EOT Grant",
  },
  {
    project: "Bangalore Metro",
    days: 189,
    score: 91,
    basis: "Multiple concurrent delays with clear government-caused events",
    recommendation: "CRITICAL — Immediate EOT resolution required",
  },
  {
    project: "Chennai Highway",
    days: 234,
    score: 78,
    basis:
      "Partial merit: contractor scheduling inefficiencies mixed with genuine delays",
    recommendation: "MODERATE — Partial EOT consideration",
  },
  {
    project: "Mumbai Trans Harbour",
    days: 45,
    score: 34,
    basis: "Weak basis: contractor-caused delays cited as employer risk",
    recommendation: "LOW MERIT — Contest EOT claim",
  },
  {
    project: "Pune Ring Road",
    days: 67,
    score: 61,
    basis:
      "Utility delays partially attributable to contractor coordination failures",
    recommendation: "MEDIUM — Negotiate partial grant",
  },
];

const ANOMALIES = [
  {
    severity: "HIGH",
    project: "Delhi RRTS Pkg 3",
    description:
      "Running Account Bill #14 shows ₹89Cr claim for 'provisional sum' items not in BOQ. Pattern: 7th consecutive over-billing instance.",
    exposure: "₹89 Cr",
  },
  {
    severity: "HIGH",
    project: "Maharashtra Water Supply",
    description:
      "Contractor billing same work items under multiple bill heads. Estimated duplicate billing: ₹23Cr across 4 packages.",
    exposure: "₹23 Cr",
  },
  {
    severity: "CRITICAL",
    project: "Odisha PWD Bridge Package",
    description:
      "Bill #8 front-loads 78% payment against only 31% physical progress. Cash extraction pattern detected.",
    exposure: "₹112 Cr",
  },
  {
    severity: "MEDIUM",
    project: "Gujarat Smart Road",
    description:
      "Consistent 11–13% over-rate claims on steel items correlating with market dips. Market timing exploitation flagged.",
    exposure: "₹34 Cr",
  },
];

const VARIATION_ORDERS = [
  {
    ref: "VO-2024-0341",
    project: "Delhi RRTS Ph2",
    description: "Additional underpasses at NH-58 interchange",
    amount: "₹45 Cr",
    approved: "Pending",
    status: "review",
  },
  {
    ref: "VO-2024-0298",
    project: "Mumbai Nagpur Exp",
    description: "Revised alignment — wetland avoidance Pkg 7",
    amount: "₹67 Cr",
    approved: "Rejected",
    status: "rejected",
  },
  {
    ref: "VO-2024-0276",
    project: "Chennai Port Hwy",
    description: "Grade separator addition at NH-4 junction",
    amount: "₹38 Cr",
    approved: "Approved",
    status: "approved",
  },
  {
    ref: "VO-2024-0251",
    project: "Pune Ring Rd Pk5",
    description: "Utility diversion — MSEDCL overhead lines",
    amount: "₹22 Cr",
    approved: "Pending",
    status: "review",
  },
  {
    ref: "VO-2024-0234",
    project: "Bangalore Metro Ext",
    description: "Revised viaduct design — seismic zone upgrade",
    amount: "₹89 Cr",
    approved: "Pending",
    status: "review",
  },
  {
    ref: "VO-2024-0189",
    project: "Ahmedabad GF Exp",
    description: "Additional toll plaza infrastructure Km 34",
    amount: "₹18 Cr",
    approved: "Approved",
    status: "approved",
  },
];

const BOQ_FINDINGS = [
  "Steel rates inflated 94% vs. 23% market index — systematic over-pricing across 9 consecutive quarters",
  "Concrete and labour rates show coordinated escalation pattern — 37% above market by Q4 2025",
  "Correlation coefficient 0.98 across packages suggests contractor-level pricing cartel",
];

const BOQ_CHART_DATA = [
  { quarter: "Q1'23", steel: 112, concrete: 108, labour: 104, market: 100 },
  { quarter: "Q2'23", steel: 118, concrete: 111, labour: 106, market: 103 },
  { quarter: "Q3'23", steel: 127, concrete: 114, labour: 108, market: 105 },
  { quarter: "Q4'23", steel: 134, concrete: 118, labour: 111, market: 107 },
  { quarter: "Q1'24", steel: 142, concrete: 124, labour: 113, market: 109 },
  { quarter: "Q2'24", steel: 151, concrete: 129, labour: 116, market: 111 },
  { quarter: "Q3'24", steel: 163, concrete: 135, labour: 118, market: 113 },
  { quarter: "Q4'24", steel: 174, concrete: 141, labour: 121, market: 115 },
  { quarter: "Q1'25", steel: 182, concrete: 147, labour: 124, market: 117 },
  { quarter: "Q2'25", steel: 191, concrete: 153, labour: 127, market: 119 },
  { quarter: "Q3'25", steel: 203, concrete: 159, labour: 130, market: 121 },
  { quarter: "Q4'25", steel: 218, concrete: 167, labour: 133, market: 123 },
];

const ARBITRATION_DATA = [
  { state: "MH", value: 456 },
  { state: "UP", value: 389 },
  { state: "WB", value: 567 },
  { state: "TN", value: 234 },
  { state: "GJ", value: 123 },
  { state: "KA", value: 345 },
  { state: "RJ", value: 89 },
  { state: "DL", value: 234 },
];

// ── Export Modal Types ────────────────────────────────────────────────────────

type ExportFormat = "pdf" | "excel" | "csv";
type GenerateState = "idle" | "generating" | "ready";

const GENERATE_STEPS = [
  "Compiling claims data...",
  "Aggregating EOT risk scores...",
  "Processing billing anomalies...",
  "Building arbitration exposure summary...",
  "Generating BOQ forensics charts...",
  "Finalising report document...",
];

const EXPORT_SECTIONS = [
  { key: "claims", label: "Claims Prediction Dashboard" },
  { key: "eot", label: "EOT Risk Analysis" },
  { key: "billing", label: "Billing Anomaly Report" },
  { key: "arbitration", label: "Arbitration Exposure Summary" },
  { key: "boq", label: "BOQ Inflation Forensics" },
  { key: "stress", label: "Financial Stress Scores" },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

const eotRiskColor = (r: string) => {
  if (r === "CRITICAL")
    return {
      bg: "rgba(255,61,0,0.15)",
      color: "#ff6b6b",
      border: "rgba(255,61,0,0.35)",
    };
  if (r === "HIGH")
    return {
      bg: "rgba(255,109,0,0.15)",
      color: "#ff8c42",
      border: "rgba(255,109,0,0.35)",
    };
  if (r === "MEDIUM")
    return {
      bg: "rgba(255,179,0,0.15)",
      color: "#ffb300",
      border: "rgba(255,179,0,0.35)",
    };
  return {
    bg: "rgba(0,212,255,0.12)",
    color: "#00d4ff",
    border: "rgba(0,212,255,0.25)",
  };
};

const statusBadge = (s: string) => {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    Active: {
      bg: "rgba(0,212,255,0.12)",
      color: "#00d4ff",
      border: "rgba(0,212,255,0.28)",
    },
    "Pre-Dispute": {
      bg: "rgba(255,179,0,0.12)",
      color: "#ffb300",
      border: "rgba(255,179,0,0.28)",
    },
    Arbitration: {
      bg: "rgba(255,61,0,0.15)",
      color: "#ff6b6b",
      border: "rgba(255,61,0,0.3)",
    },
    "Pre-Notice": {
      bg: "rgba(255,109,0,0.13)",
      color: "#ff8c42",
      border: "rgba(255,109,0,0.28)",
    },
    Negotiation: {
      bg: "rgba(0,230,118,0.1)",
      color: "#00e676",
      border: "rgba(0,230,118,0.25)",
    },
  };
  return (
    map[s] ?? {
      bg: "rgba(176,190,197,0.1)",
      color: "#b0bec5",
      border: "rgba(176,190,197,0.2)",
    }
  );
};

const scoreColor = (score: number) => {
  if (score >= 80) return "#ff6b6b";
  if (score >= 60) return "#ff8c42";
  if (score >= 40) return "#ffb300";
  return "#00e676";
};

const probColor = (p: number) => {
  if (p >= 80) return "#ff6b6b";
  if (p >= 60) return "#ff8c42";
  return "#ffb300";
};

const arbitrationColor = (v: number) => {
  if (v >= 500) return "#ff4444";
  if (v >= 350) return "#ff6b35";
  if (v >= 200) return "#ffb300";
  return "#00d4ff";
};

const CustomArbBar = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
}) => {
  const { x = 0, y = 0, width = 0, height = 0, value = 0 } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={arbitrationColor(value)}
      fillOpacity={0.85}
      rx={3}
    />
  );
};

// ── CSV Download Helper ───────────────────────────────────────────────────────

function downloadCommercialCSV(sections: Set<string>) {
  const rows: string[] = [];
  rows.push("INFRAOS — COMMERCIAL RISK ANALYSIS REPORT");
  rows.push(`Generated: ${new Date().toLocaleString("en-IN")}`);
  rows.push("");

  if (sections.has("claims")) {
    rows.push("=== CLAIMS PREDICTION DASHBOARD ===");
    rows.push(
      "Project,Contractor,Claim Type,Claim Value,Probability (%),EOT Risk,Status",
    );
    for (const c of CLAIMS_DATA) {
      rows.push(
        `"${c.project}","${c.contractor}","${c.claimType}","${c.value}",${c.probability},${c.eotRisk},${c.status}`,
      );
    }
    rows.push("");
  }

  if (sections.has("eot")) {
    rows.push("=== EOT RISK ANALYSIS ===");
    rows.push("Project,Days Requested,Score (/100),Recommendation");
    for (const e of EOT_DATA) {
      rows.push(`"${e.project}",${e.days},${e.score},"${e.recommendation}"`);
    }
    rows.push("");
  }

  if (sections.has("billing")) {
    rows.push("=== BILLING ANOMALY REPORT ===");
    rows.push("Severity,Project,Description,Exposure");
    for (const a of ANOMALIES) {
      rows.push(
        `${a.severity},"${a.project}","${a.description}","${a.exposure}"`,
      );
    }
    rows.push("");
  }

  if (sections.has("arbitration")) {
    rows.push("=== ARBITRATION EXPOSURE SUMMARY ===");
    rows.push("State,Arbitration Value (₹ Cr)");
    for (const a of ARBITRATION_DATA) {
      rows.push(`${a.state},${a.value}`);
    }
    rows.push("Total National Exposure,₹70000+ Cr");
    rows.push("HCC Limited,₹32000 Cr");
    rows.push("L&T Construction,₹38000 Cr");
    rows.push("");
  }

  if (sections.has("boq")) {
    rows.push("=== BOQ INFLATION FORENSICS ===");
    rows.push("Quarter,Steel Index,Concrete Index,Labour Index,Market Index");
    for (const b of BOQ_CHART_DATA) {
      rows.push(
        `${b.quarter},${b.steel},${b.concrete},${b.labour},${b.market}`,
      );
    }
    rows.push("");
    rows.push("Key Findings");
    for (const f of BOQ_FINDINGS) {
      rows.push(`"${f}"`);
    }
    rows.push("");
  }

  if (sections.has("stress")) {
    rows.push("=== FINANCIAL STRESS SCORES ===");
    rows.push("Contractor,Arbitration Exposure,Active Claims,Stress Score");
    rows.push('"HCC Ltd","₹32,000 Cr",4,92');
    rows.push('"L&T Construction","₹38,000 Cr",3,88');
    rows.push('"Afcons Infrastructure","₹4,500 Cr",2,74');
    rows.push('"Tata Projects","₹2,200 Cr",1,61');
    rows.push('"Ashoka Buildcon","₹890 Cr",1,44');
    rows.push("");
  }

  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `InfraOS_CommercialRisk_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Export Analysis Modal ─────────────────────────────────────────────────────

function ExportAnalysisModal({ onClose }: { onClose: () => void }) {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set(EXPORT_SECTIONS.map((s) => s.key)),
  );
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [reportTitle, setReportTitle] = useState(
    `Commercial Risk Analysis — ${today}`,
  );
  const [includeCharts, setIncludeCharts] = useState(true);
  const [genState, setGenState] = useState<GenerateState>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleSection = (key: string) => {
    setSelectedSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const startGenerate = () => {
    setGenState("generating");
    setStepIndex(0);
    setProgress(0);

    let step = 0;
    let prog = 0;
    timerRef.current = setInterval(() => {
      prog += 2.5;
      setProgress(Math.min(prog, 100));
      const newStep = Math.floor((prog / 100) * GENERATE_STEPS.length);
      if (newStep !== step && newStep < GENERATE_STEPS.length) {
        step = newStep;
        setStepIndex(step);
      }
      if (prog >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setGenState("ready");
      }
    }, 60);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleDownload = () => {
    downloadCommercialCSV(selectedSections);
    onClose();
  };

  const SUMMARY_STATS = [
    { label: "Total Claims", value: "₹2,847 Cr", color: "#ff6b6b" },
    { label: "Arbitration Exposure", value: "₹1,203 Cr", color: "#ff8c42" },
    { label: "Billing Anomalies", value: "23 Flagged", color: "#ffb300" },
    { label: "EOT Risk Projects", value: "8 Active", color: "#00d4ff" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      data-ocid="commercial.export_modal"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl flex flex-col"
        style={{
          background: "rgba(10,12,15,0.97)",
          border: "1px solid rgba(0,212,255,0.3)",
          boxShadow:
            "0 0 60px rgba(0,212,255,0.08), 0 24px 48px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "rgba(0,212,255,0.15)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(0,212,255,0.12)",
                border: "1px solid rgba(0,212,255,0.25)",
              }}
            >
              <FileBarChart2 size={16} style={{ color: "#00d4ff" }} />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-foreground">
                Export Analysis Report
              </h2>
              <p className="text-label" style={{ fontSize: "0.68rem" }}>
                Commercial Risk Intelligence — Configure and download
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-smooth hover:opacity-70"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            data-ocid="commercial.export_modal.close_button"
            aria-label="Close modal"
          >
            <X size={15} className="text-muted-foreground" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Summary Stats Preview */}
          <div>
            <p
              className="text-label mb-3"
              style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
            >
              REPORT PREVIEW — SUMMARY STATISTICS
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SUMMARY_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg p-3 text-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="font-mono font-bold text-base mb-0.5"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div className="text-label" style={{ fontSize: "0.6rem" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Checkboxes */}
          <div>
            <p
              className="text-label mb-3"
              style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
            >
              INCLUDE SECTIONS
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXPORT_SECTIONS.map((sec) => {
                const checked = selectedSections.has(sec.key);
                return (
                  <button
                    key={sec.key}
                    type="button"
                    onClick={() => toggleSection(sec.key)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-smooth"
                    style={{
                      background: checked
                        ? "rgba(0,212,255,0.07)"
                        : "rgba(255,255,255,0.02)",
                      border: `1px solid ${checked ? "rgba(0,212,255,0.25)" : "rgba(255,255,255,0.07)"}`,
                      cursor: "pointer",
                    }}
                    data-ocid={`commercial.export_modal.section_${sec.key}`}
                  >
                    {checked ? (
                      <CheckSquare
                        size={14}
                        style={{ color: "#00d4ff", flexShrink: 0 }}
                      />
                    ) : (
                      <Square
                        size={14}
                        style={{
                          color: "rgba(176,190,197,0.35)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: checked ? "#e0f7ff" : "rgba(176,190,197,0.65)",
                      }}
                    >
                      {sec.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Selector */}
          <div>
            <p
              className="text-label mb-3"
              style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
            >
              EXPORT FORMAT
            </p>
            <div className="flex gap-3">
              {(
                [
                  {
                    key: "pdf",
                    label: "PDF Report",
                    Icon: FileText,
                    note: "Formatted",
                  },
                  {
                    key: "excel",
                    label: "Excel Sheet",
                    Icon: FileSpreadsheet,
                    note: ".xlsx",
                  },
                  {
                    key: "csv",
                    label: "CSV Data",
                    Icon: FileBarChart2,
                    note: "Raw data",
                  },
                ] as {
                  key: ExportFormat;
                  label: string;
                  Icon: typeof FileText;
                  note: string;
                }[]
              ).map(({ key, label, Icon, note }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormat(key)}
                  className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg transition-smooth"
                  style={{
                    background:
                      format === key
                        ? "rgba(0,212,255,0.1)"
                        : "rgba(255,255,255,0.02)",
                    border: `1px solid ${format === key ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.07)"}`,
                    cursor: "pointer",
                  }}
                  data-ocid={`commercial.export_modal.format_${key}`}
                >
                  <Icon
                    size={18}
                    style={{
                      color:
                        format === key ? "#00d4ff" : "rgba(176,190,197,0.45)",
                    }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color:
                        format === key ? "#00d4ff" : "rgba(176,190,197,0.55)",
                    }}
                  >
                    {label}
                  </span>
                  <span className="text-label" style={{ fontSize: "0.58rem" }}>
                    {note}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Report Title + Charts Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="export-report-title"
                className="text-label block mb-1.5"
                style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}
              >
                REPORT TITLE
              </label>
              <input
                id="export-report-title"
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium text-foreground"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  outline: "none",
                  color: "#e0f7ff",
                  fontSize: "0.78rem",
                }}
                data-ocid="commercial.export_modal.title_input"
              />
            </div>
            <div>
              <p
                className="text-label block mb-1.5"
                style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}
              >
                INCLUDE CHARTS
              </p>
              <div className="flex gap-3 mt-1">
                {(["yes", "no"] as const).map((opt) => {
                  const active = opt === "yes" ? includeCharts : !includeCharts;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setIncludeCharts(opt === "yes")}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-smooth"
                      style={{
                        background: active
                          ? "rgba(0,212,255,0.1)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${active ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.07)"}`,
                        color: active ? "#00d4ff" : "rgba(176,190,197,0.45)",
                        cursor: "pointer",
                      }}
                      data-ocid={`commercial.export_modal.charts_${opt}`}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Generate / Progress / Download */}
          {genState === "idle" && (
            <button
              type="button"
              onClick={startGenerate}
              disabled={selectedSections.size === 0}
              className="w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-smooth"
              style={{
                background:
                  selectedSections.size === 0
                    ? "rgba(0,212,255,0.05)"
                    : "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,180,220,0.3))",
                border: `1px solid ${selectedSections.size === 0 ? "rgba(0,212,255,0.1)" : "rgba(0,212,255,0.4)"}`,
                color:
                  selectedSections.size === 0
                    ? "rgba(0,212,255,0.35)"
                    : "#00d4ff",
                cursor: selectedSections.size === 0 ? "not-allowed" : "pointer",
                boxShadow:
                  selectedSections.size > 0
                    ? "0 0 20px rgba(0,212,255,0.12)"
                    : "none",
              }}
              data-ocid="commercial.export_modal.generate_button"
            >
              <FileBarChart2 size={16} />
              Generate Report
            </button>
          )}

          {genState === "generating" && (
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(0,212,255,0.04)",
                border: "1px solid rgba(0,212,255,0.15)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(0,212,255,0.12)",
                    border: "1px solid rgba(0,212,255,0.25)",
                  }}
                >
                  <RefreshCcw
                    size={14}
                    style={{
                      color: "#00d4ff",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Compiling Analysis Report
                  </p>
                  <p
                    className="text-label"
                    style={{ fontSize: "0.67rem", color: "#00d4ff" }}
                  >
                    {GENERATE_STEPS[stepIndex]}
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div
                className="h-2 rounded-full overflow-hidden mb-2"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #00d4ff, #00b4dc)",
                    transition: "width 0.1s linear",
                    boxShadow: "0 0 8px rgba(0,212,255,0.4)",
                  }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-label" style={{ fontSize: "0.62rem" }}>
                  Step {stepIndex + 1} of {GENERATE_STEPS.length}
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#00d4ff" }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
              {/* Step list */}
              <div className="mt-3 space-y-1">
                {GENERATE_STEPS.map((step, i) => {
                  const done = i < stepIndex;
                  const active = i === stepIndex;
                  return (
                    <div key={step} className="flex items-center gap-2">
                      {done ? (
                        <CheckCircle
                          size={11}
                          style={{ color: "#00e676", flexShrink: 0 }}
                        />
                      ) : active ? (
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            background: "#00d4ff",
                            animation: "pulse 1s ease-in-out infinite",
                          }}
                        />
                      ) : (
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: "rgba(255,255,255,0.12)" }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: done
                            ? "rgba(0,230,118,0.8)"
                            : active
                              ? "#e0f7ff"
                              : "rgba(176,190,197,0.35)",
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {genState === "ready" && (
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(0,230,118,0.04)",
                border: "1px solid rgba(0,230,118,0.2)",
              }}
              data-ocid="commercial.export_modal.success_state"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(0,230,118,0.12)",
                    border: "1px solid rgba(0,230,118,0.25)",
                  }}
                >
                  <CheckCircle size={16} style={{ color: "#00e676" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#00e676" }}>
                    Report Ready — {selectedSections.size} sections compiled
                  </p>
                  <p className="text-label" style={{ fontSize: "0.67rem" }}>
                    {reportTitle} · {format.toUpperCase()} format
                    {includeCharts ? " · Charts included" : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-smooth"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,230,118,0.2), rgba(0,200,100,0.3))",
                    border: "1px solid rgba(0,230,118,0.4)",
                    color: "#00e676",
                    cursor: "pointer",
                    boxShadow: "0 0 20px rgba(0,230,118,0.1)",
                  }}
                  data-ocid="commercial.export_modal.download_button"
                >
                  <Download size={16} />
                  Download Report
                </button>
                <button
                  type="button"
                  onClick={() => setGenState("idle")}
                  className="px-4 py-3 rounded-lg text-sm font-medium transition-smooth"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(176,190,197,0.7)",
                    cursor: "pointer",
                  }}
                  data-ocid="commercial.export_modal.regenerate_button"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CommercialPage() {
  const navigate = useNavigate();
  const { selectedOrg } = useOrg();
  const orgData = getOrgData(selectedOrg.key);
  const [flaggedAnomalies, setFlaggedAnomalies] = useState<number[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);

  const toggleFlag = (idx: number) =>
    setFlaggedAnomalies((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );

  return (
    <div className="p-5 space-y-5" data-ocid="commercial.page">
      {/* ── Export Modal ──────────────────────────────────────────────────── */}
      {showExportModal && (
        <ExportAnalysisModal onClose={() => setShowExportModal(false)} />
      )}

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="glass-card px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
              <span>Home</span>
              <ChevronRight size={10} />
              <span>Intelligence Modules</span>
              <ChevronRight size={10} />
              <span className="text-primary">Commercial Risk</span>
            </nav>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-label"
                style={{
                  color: "rgba(255,109,0,0.85)",
                  letterSpacing: "0.14em",
                }}
              >
                FINANCIAL DEFENSE ENGINE
              </span>
              <span
                className="text-label px-2 py-0.5 rounded"
                style={{
                  background: "rgba(255,109,0,0.12)",
                  color: "#ff8c42",
                  border: "1px solid rgba(255,109,0,0.25)",
                }}
              >
                LIVE
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
              Commercial Risk Intelligence
            </h1>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                {
                  label: "Arbitration Exposure",
                  val: orgData.kpis.arbitrationExposure,
                  color: "#ff6b6b",
                },
                {
                  label: "Active Claims",
                  val: orgData.kpis.delayedProjects.toString(),
                  color: "#ff8c42",
                },
                {
                  label: "EOT Claims Pending",
                  val: orgData.kpis.costOverrun,
                  color: "#ffb300",
                },
                {
                  label: "Fraud Alerts",
                  val: orgData.kpis.riskAlerts.toString(),
                  color: "#00d4ff",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-1.5"
                  data-ocid={`commercial.header_stat.${s.label.toLowerCase().replace(/\s+/g, "_")}`}
                >
                  <span
                    className="font-mono font-bold text-sm"
                    style={{ color: s.color }}
                  >
                    {s.val}
                  </span>
                  <span className="text-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-ghost text-xs flex items-center gap-1.5 py-2 px-3"
              data-ocid="commercial.export_claims_button"
              onClick={() => {
                const now = new Date().toISOString().split("T")[0];
                const header =
                  "ID,Project,Contractor,Claim Type,Value,Probability %,EOT Risk,Status\n";
                const rows = CLAIMS_DATA.map(
                  (c) =>
                    `${c.id},"${c.project}",${c.contractor},"${c.claimType}",${c.value},${c.probability},${c.eotRisk},${c.status}`,
                ).join("\n");
                const blob = new Blob(
                  [
                    `InfraOS Claims Export\nGenerated: ${now}\n\n${header}${rows}`,
                  ],
                  { type: "text/csv;charset=utf-8;" },
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `InfraOS-Claims-${now}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              <FileSpreadsheet size={13} /> Export Claims CSV
            </button>
            <button
              type="button"
              className="btn-secondary text-xs flex items-center gap-1.5 py-2 px-3"
              data-ocid="commercial.review_claim_button"
              onClick={() => navigate({ to: "/app/reports" })}
            >
              <Scale size={13} /> Review Claim Risk
            </button>
            <button
              type="button"
              className="btn-primary text-xs flex items-center gap-1.5 py-2 px-3"
              data-ocid="commercial.export_button"
              onClick={() => setShowExportModal(true)}
            >
              <Download size={13} /> Export Analysis
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Claim Exposure",
            value: "₹2.3L Cr",
            sub: "+₹340 Cr this month",
            color: "#ff6b6b",
            Icon: FileWarning,
          },
          {
            label: "EOT Pending Decisions",
            value: "₹890 Cr",
            sub: "5 projects awaiting ruling",
            color: "#ff8c42",
            Icon: TrendingDown,
          },
          {
            label: "Billing Anomalies Detected",
            value: "47",
            sub: "4 flagged critical",
            color: "#ffb300",
            Icon: AlertTriangle,
          },
          {
            label: "Variation Orders Open",
            value: "234",
            sub: "₹234 Cr pending approval",
            color: "#00d4ff",
            Icon: BarChart2,
          },
        ].map((k, i) => (
          <div
            key={k.label}
            className="glass-card p-4 kpi-glow"
            data-ocid={`commercial.kpi.${i + 1}`}
          >
            <div className="flex items-start justify-between mb-2">
              <k.Icon size={16} style={{ color: k.color }} />
              <ArrowUpRight
                size={12}
                className="text-muted-foreground opacity-50"
              />
            </div>
            <div
              className="font-mono font-bold text-2xl mb-0.5"
              style={{ color: k.color }}
            >
              {k.value}
            </div>
            <div className="text-label mb-1">{k.label}</div>
            <div
              className="text-xs"
              style={{ color: "rgba(176,190,197,0.5)", fontSize: "0.65rem" }}
            >
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── National Arbitration Exposure ─────────────────────────────────── */}
      <div
        className="glass-card p-5"
        data-ocid="commercial.national_arbitration_panel"
        style={{
          border: "1px solid rgba(255,61,0,0.25)",
          background: "rgba(255,61,0,0.03)",
        }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={16} style={{ color: "#FF3D00" }} />
              <span
                className="text-label font-bold tracking-widest"
                style={{ color: "#FF3D00", fontSize: "0.65rem" }}
              >
                NATIONAL ARBITRATION EXPOSURE
              </span>
            </div>
            <div
              className="font-mono font-bold text-4xl mb-1"
              style={{ color: "#FF6B6B" }}
            >
              ₹70,000+ Crore
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              Locked in infrastructure arbitration across India's major EPC
              players
            </p>
            <div className="flex flex-wrap gap-4 mt-1">
              <div className="flex items-center gap-2">
                <span className="text-label" style={{ fontSize: "0.72rem" }}>
                  HCC Limited:
                </span>
                <span
                  className="font-mono font-bold"
                  style={{ color: "#FF6B6B" }}
                >
                  ₹32,000 Cr
                </span>
              </div>
              <span className="text-muted-foreground">|</span>
              <div className="flex items-center gap-2">
                <span className="text-label" style={{ fontSize: "0.72rem" }}>
                  L&T Construction:
                </span>
                <span
                  className="font-mono font-bold"
                  style={{ color: "#FF8C42" }}
                >
                  ₹38,000 Cr
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 max-w-sm">
            <div
              className="p-3 rounded-lg"
              style={{
                background: "rgba(255,179,0,0.08)",
                border: "1px solid rgba(255,179,0,0.2)",
              }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle
                  size={13}
                  style={{ color: "#FFB300", flexShrink: 0, marginTop: 1 }}
                />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span style={{ color: "#FFB300", fontWeight: 600 }}>
                    CAG Report No. 36 of 2014:
                  </span>{" "}
                  NHAI missed collecting{" "}
                  <span style={{ color: "#FF6B6B", fontWeight: 700 }}>
                    ₹259.47 Crore
                  </span>{" "}
                  in toll revenue due to delayed Commercial Operation Dates
                  (CODs). Inconsistent concession period determination placed
                  higher toll burden on road users.
                </p>
              </div>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{
                background: "rgba(255,61,0,0.06)",
                border: "1px solid rgba(255,61,0,0.15)",
              }}
            >
              <p className="text-xs text-muted-foreground leading-relaxed">
                Procurement model shift to{" "}
                <span style={{ color: "#00D4FF" }}>HAM & EPC</span> aims to
                reduce contractor risk but arbitration pipeline from legacy BOT
                contracts remains critical exposure for 2026–2028.
              </p>
            </div>
          </div>
        </div>
        {/* National stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border/20">
          {[
            {
              label: "National Infrastructure Pipeline",
              value: `₹${NATIONAL_STATS.nipInvestmentLCr}L Cr`,
              sub: "FY 2020–25 outlay",
              color: "#00D4FF",
            },
            {
              label: "Active Mega Projects (MoSPI)",
              value: NATIONAL_STATS.activeMegaProjects.toLocaleString(),
              sub: "Projects under monitoring",
              color: "#00E676",
            },
            {
              label: "Projects Behind Schedule",
              value: `${NATIONAL_STATS.delayRatioPct}%`,
              sub: "Delay ratio across portfolio",
              color: "#FF6D00",
            },
            {
              label: "Total Cost Overruns",
              value: `₹${NATIONAL_STATS.totalCostOverrunLCr}L Cr`,
              sub: `${NATIONAL_STATS.avgCostOverrunPct}% avg overrun`,
              color: "#FF3D00",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className="glass-elevated rounded p-3"
              data-ocid={`commercial.national_stat.${i + 1}`}
            >
              <div className="text-label mb-1" style={{ fontSize: "0.62rem" }}>
                {s.label}
              </div>
              <div
                className="font-mono font-bold text-lg"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div
                className="text-label mt-0.5"
                style={{ fontSize: "0.6rem", color: "rgba(176,190,197,0.5)" }}
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Claims Prediction Dashboard ───────────────────────────────────── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="commercial.claims_panel"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} style={{ color: "#ff8c42" }} />
            <h2 className="font-semibold text-sm text-foreground">
              Claims Prediction Dashboard
            </h2>
            <span className="text-label ml-1">— Active Projects</span>
          </div>
          <button
            type="button"
            className="text-xs"
            style={{ color: "#00d4ff" }}
            data-ocid="commercial.view_all_claims_button"
          >
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: "0.72rem" }}>
            <thead>
              <tr className="border-b border-white/[0.05]">
                {[
                  "Project",
                  "Contractor",
                  "Claim Type",
                  "Claim Value",
                  "Probability",
                  "EOT Risk",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-label whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLAIMS_DATA.map((c, i) => {
                const eot = eotRiskColor(c.eotRisk);
                const st = statusBadge(c.status);
                return (
                  <tr
                    key={c.id}
                    className="border-b border-white/[0.04] transition-smooth cursor-pointer hover:bg-white/[0.02]"
                    style={
                      c.probability > 80
                        ? {
                            background: "rgba(255,61,0,0.04)",
                            borderLeft: "2px solid rgba(255,61,0,0.4)",
                          }
                        : c.probability > 60
                          ? {
                              background: "rgba(255,109,0,0.03)",
                              borderLeft: "2px solid rgba(255,109,0,0.3)",
                            }
                          : c.probability > 40
                            ? {
                                background: "rgba(255,179,0,0.03)",
                                borderLeft: "2px solid rgba(255,179,0,0.25)",
                              }
                            : undefined
                    }
                    data-ocid={`commercial.claim.item.${i + 1}`}
                  >
                    <td className="px-4 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      {c.project}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                      {c.contractor}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                      {c.claimType}
                    </td>
                    <td
                      className="px-4 py-2.5 font-mono font-bold"
                      style={{ color: "#ff8c42" }}
                    >
                      {c.value}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{
                            width: 56,
                            background: "rgba(255,255,255,0.08)",
                          }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${c.probability}%`,
                              background: probColor(c.probability),
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                        <span
                          className="font-mono"
                          style={{ color: probColor(c.probability) }}
                        >
                          {c.probability}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-block px-2 py-0.5 rounded font-bold"
                        style={{
                          fontSize: "0.63rem",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          background: eot.bg,
                          color: eot.color,
                          border: `1px solid ${eot.border}`,
                        }}
                      >
                        {c.eotRisk}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-block px-2 py-0.5 rounded font-semibold"
                        style={{
                          fontSize: "0.65rem",
                          background: st.bg,
                          color: st.color,
                          border: `1px solid ${st.border}`,
                          borderRadius: 4,
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Three Panels ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* COL 1: EOT Risk Scoring */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="commercial.eot_panel"
        >
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Scale size={13} style={{ color: "#ff8c42" }} />
              <h3 className="font-semibold text-sm text-foreground">
                EOT Risk Scoring
              </h3>
            </div>
            <p className="text-label mt-0.5">Extension of Time Analysis</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {EOT_DATA.map((e, i) => {
              const sc = scoreColor(e.score);
              return (
                <div
                  key={e.project}
                  className="px-4 py-3 transition-smooth hover:bg-white/[0.02]"
                  data-ocid={`commercial.eot.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <span className="font-semibold text-foreground text-xs">
                      {e.project}
                    </span>
                    <span
                      className="font-mono font-bold text-xs ml-2 shrink-0"
                      style={{ color: sc }}
                    >
                      {e.score}/100
                    </span>
                  </div>
                  <div
                    className="text-label mb-1.5"
                    style={{ color: "rgba(176,190,197,0.55)" }}
                  >
                    {e.days} days requested
                  </div>
                  <div
                    className="h-1 rounded-full overflow-hidden mb-2"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <div
                      className="h-full rounded-full transition-smooth"
                      style={{ width: `${e.score}%`, background: sc }}
                    />
                  </div>
                  <p
                    className="text-xs leading-relaxed mb-1"
                    style={{
                      color: "rgba(176,190,197,0.7)",
                      fontSize: "0.67rem",
                    }}
                  >
                    {e.basis}
                  </p>
                  <p
                    className="font-semibold"
                    style={{
                      color: sc,
                      fontSize: "0.65rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    → {e.recommendation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* COL 2: Billing Anomaly Detection */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="commercial.anomalies_panel"
        >
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <AlertTriangle size={13} style={{ color: "#ff6b6b" }} />
              <h3 className="font-semibold text-sm text-foreground">
                Billing Anomaly Detection
              </h3>
            </div>
            <p className="text-label mt-0.5">
              Suspicious Billing Patterns — AI Analysis
            </p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {ANOMALIES.map((a, i) => {
              const sev = eotRiskColor(a.severity);
              const flagged = flaggedAnomalies.includes(i);
              return (
                <div
                  key={a.project}
                  className="px-4 py-3 transition-smooth"
                  style={{
                    background: flagged ? "rgba(0,212,255,0.03)" : undefined,
                  }}
                  data-ocid={`commercial.anomaly.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block px-2 py-0.5 rounded font-bold shrink-0"
                        style={{
                          fontSize: "0.6rem",
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          background: sev.bg,
                          color: sev.color,
                          border: `1px solid ${sev.border}`,
                        }}
                      >
                        {a.severity}
                      </span>
                      <span className="font-semibold text-foreground text-xs">
                        {a.project}
                      </span>
                    </div>
                    <span
                      className="font-mono font-bold text-xs shrink-0 ml-1"
                      style={{ color: "#ff8c42" }}
                    >
                      {a.exposure}
                    </span>
                  </div>
                  <p
                    className="text-xs leading-relaxed mb-2.5"
                    style={{
                      color: "rgba(176,190,197,0.72)",
                      fontSize: "0.68rem",
                    }}
                  >
                    {a.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleFlag(i)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded transition-smooth text-xs font-semibold"
                    style={{
                      background: flagged
                        ? "rgba(0,212,255,0.12)"
                        : "rgba(255,109,0,0.1)",
                      color: flagged ? "#00d4ff" : "#ff8c42",
                      border: `1px solid ${flagged ? "rgba(0,212,255,0.25)" : "rgba(255,109,0,0.25)"}`,
                      fontSize: "0.65rem",
                      cursor: "pointer",
                    }}
                    data-ocid={`commercial.flag_audit_button.${i + 1}`}
                  >
                    {flagged ? (
                      <>
                        <CheckCircle size={11} /> Flagged for Audit
                      </>
                    ) : (
                      <>
                        <Flag size={11} /> Flag for Audit
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* COL 3: Variation Order Tracking */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="commercial.vo_panel"
        >
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <RefreshCcw size={13} style={{ color: "#00d4ff" }} />
                  <h3 className="font-semibold text-sm text-foreground">
                    Variation Order Tracking
                  </h3>
                </div>
                <p className="text-label mt-0.5">
                  Variation Orders — Live Status
                </p>
              </div>
              <div className="text-right">
                <div
                  className="font-mono font-bold text-sm"
                  style={{ color: "#ffb300" }}
                >
                  ₹234 Cr
                </div>
                <div className="text-label" style={{ fontSize: "0.6rem" }}>
                  Pending Approval
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: "0.68rem" }}>
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {[
                    "VO Ref",
                    "Project",
                    "Description",
                    "Amount",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2.5 text-label whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VARIATION_ORDERS.map((vo, i) => {
                  const isApproved = vo.status === "approved";
                  const isRejected = vo.status === "rejected";
                  return (
                    <tr
                      key={vo.ref}
                      className="border-b border-white/[0.04] transition-smooth hover:bg-white/[0.02]"
                      data-ocid={`commercial.vo.item.${i + 1}`}
                    >
                      <td
                        className="px-3 py-2.5 font-mono text-foreground whitespace-nowrap"
                        style={{ fontSize: "0.65rem", color: "#00d4ff" }}
                      >
                        {vo.ref}
                      </td>
                      <td
                        className="px-3 py-2.5 text-muted-foreground whitespace-nowrap"
                        style={{ maxWidth: 90 }}
                      >
                        {vo.project}
                      </td>
                      <td
                        className="px-3 py-2.5 text-muted-foreground"
                        style={{
                          maxWidth: 130,
                          fontSize: "0.65rem",
                          color: "rgba(176,190,197,0.65)",
                        }}
                      >
                        {vo.description}
                      </td>
                      <td
                        className="px-3 py-2.5 font-mono font-bold whitespace-nowrap"
                        style={{ color: "#ff8c42" }}
                      >
                        {vo.amount}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="inline-block px-1.5 py-0.5 rounded font-semibold whitespace-nowrap"
                          style={{
                            fontSize: "0.6rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            background: isApproved
                              ? "rgba(0,230,118,0.1)"
                              : isRejected
                                ? "rgba(255,61,0,0.12)"
                                : "rgba(255,179,0,0.12)",
                            color: isApproved
                              ? "#00e676"
                              : isRejected
                                ? "#ff6b6b"
                                : "#ffb300",
                            border: `1px solid ${isApproved ? "rgba(0,230,118,0.22)" : isRejected ? "rgba(255,61,0,0.22)" : "rgba(255,179,0,0.22)"}`,
                          }}
                        >
                          {vo.approved}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {isRejected ? (
                          <button
                            type="button"
                            className="flex items-center gap-1 px-2 py-0.5 rounded transition-smooth"
                            style={{
                              fontSize: "0.6rem",
                              background: "rgba(255,61,0,0.1)",
                              color: "#ff6b6b",
                              border: "1px solid rgba(255,61,0,0.22)",
                              cursor: "pointer",
                            }}
                            data-ocid={`commercial.vo_review_button.${i + 1}`}
                          >
                            <XCircle size={9} /> Appeal
                          </button>
                        ) : isApproved ? (
                          <button
                            type="button"
                            className="flex items-center gap-1 px-2 py-0.5 rounded transition-smooth"
                            style={{
                              fontSize: "0.6rem",
                              background: "rgba(0,212,255,0.08)",
                              color: "#00d4ff",
                              border: "1px solid rgba(0,212,255,0.18)",
                              cursor: "pointer",
                            }}
                            data-ocid={`commercial.vo_view_button.${i + 1}`}
                          >
                            View
                          </button>
                        ) : (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-smooth"
                              style={{
                                fontSize: "0.6rem",
                                background: "rgba(0,230,118,0.1)",
                                color: "#00e676",
                                border: "1px solid rgba(0,230,118,0.2)",
                                cursor: "pointer",
                              }}
                              data-ocid={`commercial.vo_approve_button.${i + 1}`}
                            >
                              <CheckCircle size={9} /> OK
                            </button>
                            <button
                              type="button"
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-smooth"
                              style={{
                                fontSize: "0.6rem",
                                background: "rgba(255,61,0,0.1)",
                                color: "#ff6b6b",
                                border: "1px solid rgba(255,61,0,0.2)",
                                cursor: "pointer",
                              }}
                              data-ocid={`commercial.vo_reject_button.${i + 1}`}
                            >
                              <XCircle size={9} /> No
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Bottom Charts Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* BOQ Inflation Forensics */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="commercial.boq_chart_panel"
        >
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <TrendingDown size={13} style={{ color: "#ff6b6b" }} />
              <h3 className="font-semibold text-sm text-foreground">
                BOQ Inflation Forensics
              </h3>
            </div>
            <p className="text-label mt-0.5">
              BOQ Rate Inflation Analysis — Maharashtra Water Projects
            </p>
          </div>
          <div className="px-4 pt-3 pb-1" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={BOQ_CHART_DATA}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="quarter"
                  tick={{ fill: "rgba(176,190,197,0.5)", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(176,190,197,0.5)", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[95, 230]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0d1117",
                    border: "1px solid rgba(0,212,255,0.2)",
                    borderRadius: 6,
                    fontSize: "0.72rem",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#00d4ff", marginBottom: 4 }}
                />
                <Legend wrapperStyle={{ fontSize: "0.65rem", paddingTop: 4 }} />
                <Line
                  type="monotone"
                  dataKey="steel"
                  stroke="#ff6b6b"
                  strokeWidth={2}
                  dot={false}
                  name="Steel Rate"
                />
                <Line
                  type="monotone"
                  dataKey="concrete"
                  stroke="#ff8c42"
                  strokeWidth={2}
                  dot={false}
                  name="Concrete Rate"
                />
                <Line
                  type="monotone"
                  dataKey="labour"
                  stroke="#ffb300"
                  strokeWidth={2}
                  dot={false}
                  name="Labour Rate"
                />
                <Line
                  type="monotone"
                  dataKey="market"
                  stroke="rgba(0,212,255,0.6)"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="5 3"
                  name="Market Index"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="px-4 pb-3 mt-1 space-y-1">
            {BOQ_FINDINGS.map((f) => (
              <div key={f.slice(0, 30)} className="flex items-start gap-2">
                <span
                  style={{
                    color: "#ff6b6b",
                    fontSize: "0.65rem",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  ▶
                </span>
                <p
                  style={{
                    color: "rgba(176,190,197,0.7)",
                    fontSize: "0.67rem",
                    lineHeight: 1.5,
                  }}
                >
                  {f}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Arbitration Exposure by State */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="commercial.arbitration_chart_panel"
        >
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Scale size={13} style={{ color: "#ff8c42" }} />
              <h3 className="font-semibold text-sm text-foreground">
                Arbitration Exposure by State
              </h3>
            </div>
            <p className="text-label mt-0.5">
              Active arbitration value (₹ Cr) — State-wise distribution
            </p>
          </div>
          <div className="px-4 pt-3 pb-1" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ARBITRATION_DATA}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="state"
                  tick={{ fill: "rgba(176,190,197,0.5)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(176,190,197,0.5)", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" Cr"
                />
                <Tooltip
                  contentStyle={{
                    background: "#0d1117",
                    border: "1px solid rgba(0,212,255,0.2)",
                    borderRadius: 6,
                    fontSize: "0.72rem",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#00d4ff", marginBottom: 4 }}
                  formatter={(value: number) => [
                    `₹${value} Cr`,
                    "Arbitration Value",
                  ]}
                />
                <Bar
                  dataKey="value"
                  shape={<CustomArbBar />}
                  name="₹ Cr"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="px-4 pb-3 mt-2">
            <div
              className="flex items-start gap-2 p-3 rounded"
              style={{
                background: "rgba(255,68,68,0.07)",
                border: "1px solid rgba(255,68,68,0.18)",
              }}
            >
              <AlertTriangle
                size={12}
                style={{ color: "#ff6b6b", flexShrink: 0, marginTop: 1 }}
              />
              <p
                style={{
                  color: "rgba(176,190,197,0.8)",
                  fontSize: "0.68rem",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: "#ff6b6b", fontWeight: 700 }}>
                  West Bengal
                </span>{" "}
                has the highest arbitration concentration — 3 major highway
                projects in dispute totaling ₹567 Cr.{" "}
                <span style={{ color: "#ffb300" }}>Maharashtra</span> and{" "}
                <span style={{ color: "#ff8c42" }}>Karnataka</span> follow at
                ₹456 Cr and ₹345 Cr respectively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
