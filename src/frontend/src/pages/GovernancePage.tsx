import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Flag,
  MessageSquare,
  Search,
  Shield,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useOrg } from "../context/OrgContext";
import { GATISHAKTI_DATA, MUNICIPAL_BONDS, getOrgData } from "../data/orgData";

// ── Data ─────────────────────────────────────────────────────────────────────

const SCORECARD_DATA = [
  {
    label: "Overall Governance Score",
    value: 71,
    max: 100,
    unit: "/100",
    status: "MODERATE",
    statusClass: "badge-warning",
    trend: -3,
    trendDir: "down" as const,
    color: "#FFB300",
    icon: Shield,
  },
  {
    label: "Approval SLA Compliance",
    value: 67,
    max: 100,
    unit: "%",
    status: "156 BREACHES",
    statusClass: "badge-high",
    trend: -5,
    trendDir: "down" as const,
    color: "#FF8C42",
    icon: Clock,
  },
  {
    label: "Transparency Index",
    value: 78,
    max: 100,
    unit: "/100",
    status: "GOOD",
    statusClass: "badge-success",
    trend: 2,
    trendDir: "up" as const,
    color: "#00E676",
    icon: Eye,
  },
  {
    label: "Bid Integrity Score",
    value: 62,
    max: 100,
    unit: "/100",
    status: "7 ACTIVE FLAGS",
    statusClass: "badge-critical",
    trend: -8,
    trendDir: "down" as const,
    color: "#FF6B6B",
    icon: Flag,
  },
  {
    label: "Ministry Accountability",
    value: 74,
    max: 100,
    unit: "/100",
    status: "MODERATE",
    statusClass: "badge-warning",
    trend: 1,
    trendDir: "up" as const,
    color: "#FFB300",
    icon: Activity,
  },
];

const MANIPULATION_DATA = [
  {
    id: "TND-2024-WB-PWD-0901",
    project: "Kolkata Hooghly Bridge",
    ministry: "WB PWD",
    alertType: "BID RIGGING",
    alertColor: "#FF3D00",
    alertBg: "rgba(255,61,0,0.12)",
    evidence: 94,
    evidenceLabel: "STRONG",
    evidenceClass: "badge-critical",
    status: "FLAGGED",
    statusClass: "badge-critical",
    action: "Investigate",
  },
  {
    id: "TND-2024-NHA-0891",
    project: "NH-44 Mumbai-Nagpur Pkg 7",
    ministry: "NHAI",
    alertType: "L1 ANOMALY",
    alertColor: "#FF6D00",
    alertBg: "rgba(255,109,0,0.12)",
    evidence: 89,
    evidenceLabel: "STRONG",
    evidenceClass: "badge-high",
    status: "UNDER REVIEW",
    statusClass: "badge-warning",
    action: "View",
  },
  {
    id: "TND-2024-RJ-PWD-0234",
    project: "Rajasthan Rural Roads Ph 4",
    ministry: "Raj PWD",
    alertType: "DOCUMENT DUPLICATION",
    alertColor: "#FF8C00",
    alertBg: "rgba(255,140,0,0.12)",
    evidence: 73,
    evidenceLabel: "MODERATE",
    evidenceClass: "badge-warning",
    status: "FLAGGED",
    statusClass: "badge-critical",
    action: "Investigate",
  },
  {
    id: "TND-2024-UP-PWD-0678",
    project: "UP Expressway Extension",
    ministry: "UP PWD",
    alertType: "CARTEL PATTERN",
    alertColor: "#FF3D00",
    alertBg: "rgba(255,61,0,0.12)",
    evidence: 91,
    evidenceLabel: "STRONG",
    evidenceClass: "badge-critical",
    status: "REFERRED CCI",
    statusClass: "badge-high",
    action: "View",
  },
  {
    id: "TND-2024-HR-PWD-0345",
    project: "Haryana Urban Roads",
    ministry: "HR PWD",
    alertType: "SPEC NARROWING",
    alertColor: "#FFB300",
    alertBg: "rgba(255,179,0,0.12)",
    evidence: 67,
    evidenceLabel: "MODERATE",
    evidenceClass: "badge-warning",
    status: "MONITORING",
    statusClass: "badge-low",
    action: "View",
  },
  {
    id: "TND-2024-OR-PWD-0567",
    project: "Odisha Bridge Package",
    ministry: "Odisha PWD",
    alertType: "FRONT-LOADING",
    alertColor: "#FF6D00",
    alertBg: "rgba(255,109,0,0.12)",
    evidence: 81,
    evidenceLabel: "HIGH",
    evidenceClass: "badge-high",
    status: "FLAGGED",
    statusClass: "badge-critical",
    action: "Investigate",
  },
];

interface ApprovalStage {
  name: string;
  dept: string;
  targetDays: number;
  actualDays: number | null;
  status: "complete" | "breached" | "delayed" | "waiting" | "not_started";
  breach?: number;
}

interface ApprovalProject {
  name: string;
  id: string;
  stages: ApprovalStage[];
}

const APPROVAL_PROJECTS: ApprovalProject[] = [
  {
    name: "Delhi-Meerut RRTS Phase 2",
    id: "PROJ-RRTS-DM-02",
    stages: [
      {
        name: "DPR Approval",
        dept: "DMRC",
        targetDays: 30,
        actualDays: 23,
        status: "complete",
      },
      {
        name: "Forest Clearance",
        dept: "MoEF",
        targetDays: 60,
        actualDays: 89,
        status: "delayed",
        breach: 29,
      },
      {
        name: "Railway NOC",
        dept: "Ministry of Railways",
        targetDays: 90,
        actualDays: 234,
        status: "breached",
        breach: 144,
      },
      {
        name: "Financial Sanction",
        dept: "MoF",
        targetDays: 45,
        actualDays: null,
        status: "waiting",
      },
      {
        name: "Contract Award",
        dept: "DMRC HQ",
        targetDays: 30,
        actualDays: null,
        status: "not_started",
      },
    ],
  },
  {
    name: "Bangalore Metro Extension",
    id: "PROJ-BMRCL-EXT-03",
    stages: [
      {
        name: "DPR Submission",
        dept: "BMRCL",
        targetDays: 45,
        actualDays: 38,
        status: "complete",
      },
      {
        name: "State Govt Approval",
        dept: "GoK PWD",
        targetDays: 60,
        actualDays: 54,
        status: "complete",
      },
      {
        name: "Land Acquisition",
        dept: "Revenue Dept",
        targetDays: 120,
        actualDays: 167,
        status: "delayed",
        breach: 47,
      },
      {
        name: "Central Sanction",
        dept: "MoHUA",
        targetDays: 90,
        actualDays: null,
        status: "waiting",
      },
      {
        name: "Contract Award",
        dept: "BMRCL HQ",
        targetDays: 30,
        actualDays: null,
        status: "not_started",
      },
    ],
  },
  {
    name: "Chennai Port Highway Pkg 3",
    id: "PROJ-TNHB-CPH-03",
    stages: [
      {
        name: "EIA Report",
        dept: "SEIAA-TN",
        targetDays: 90,
        actualDays: 78,
        status: "complete",
      },
      {
        name: "Port Trust Clearance",
        dept: "Chennai Port Trust",
        targetDays: 30,
        actualDays: 112,
        status: "breached",
        breach: 82,
      },
      {
        name: "Utility Shifting NOC",
        dept: "TNEB / BSNL",
        targetDays: 60,
        actualDays: null,
        status: "waiting",
      },
      {
        name: "Financial Approval",
        dept: "MoRTH",
        targetDays: 45,
        actualDays: null,
        status: "waiting",
      },
      {
        name: "Contract Award",
        dept: "NHAI-TN",
        targetDays: 30,
        actualDays: null,
        status: "not_started",
      },
    ],
  },
];

const DEPT_DATA = [
  {
    dept: "Ministry of Railways",
    projects: 47,
    avgDays: 186,
    compliance: 34,
    risk: "CRITICAL",
    riskClass: "badge-critical",
    riskColor: "#FF3D00",
    critical: true,
  },
  {
    dept: "MoEF (Environment)",
    projects: 234,
    avgDays: 112,
    compliance: 52,
    risk: "HIGH",
    riskClass: "badge-high",
    riskColor: "#FF6D00",
    critical: false,
  },
  {
    dept: "State Revenue (Land)",
    projects: 456,
    avgDays: 89,
    compliance: 61,
    risk: "HIGH",
    riskClass: "badge-high",
    riskColor: "#FF6D00",
    critical: false,
  },
  {
    dept: "Ministry of Finance",
    projects: 123,
    avgDays: 34,
    compliance: 78,
    risk: "MEDIUM",
    riskClass: "badge-warning",
    riskColor: "#FFB300",
    critical: false,
  },
  {
    dept: "State PWDs",
    projects: 345,
    avgDays: 67,
    compliance: 71,
    risk: "MEDIUM",
    riskClass: "badge-warning",
    riskColor: "#FFB300",
    critical: false,
  },
  {
    dept: "NHAI",
    projects: 234,
    avgDays: 28,
    compliance: 89,
    risk: "LOW",
    riskClass: "badge-low",
    riskColor: "#00D4FF",
    critical: false,
  },
  {
    dept: "DMRC / Metro Corps",
    projects: 67,
    avgDays: 45,
    compliance: 82,
    risk: "LOW",
    riskClass: "badge-low",
    riskColor: "#00D4FF",
    critical: false,
  },
  {
    dept: "Urban Local Bodies",
    projects: 189,
    avgDays: 134,
    compliance: 43,
    risk: "HIGH",
    riskClass: "badge-high",
    riskColor: "#FF6D00",
    critical: false,
  },
];

const STATE_RISK = [
  { state: "WB", score: 87, projects: 124, tier: "critical" },
  { state: "UP", score: 81, projects: 287, tier: "critical" },
  { state: "Odisha", score: 79, projects: 89, tier: "critical" },
  { state: "Bihar", score: 73, projects: 167, tier: "high" },
  { state: "MP", score: 71, projects: 203, tier: "high" },
  { state: "Rajasthan", score: 68, projects: 145, tier: "high" },
  { state: "Karnataka", score: 64, projects: 198, tier: "moderate" },
  { state: "AP", score: 62, projects: 156, tier: "moderate" },
  { state: "Jharkhand", score: 61, projects: 72, tier: "moderate" },
  { state: "Maharashtra", score: 54, projects: 312, tier: "amber" },
  { state: "Gujarat", score: 51, projects: 267, tier: "amber" },
  { state: "TN", score: 49, projects: 178, tier: "amber" },
  { state: "Delhi", score: 41, projects: 89, tier: "low" },
  { state: "Haryana", score: 39, projects: 98, tier: "low" },
  { state: "Punjab", score: 36, projects: 76, tier: "low" },
  { state: "Telangana", score: 44, projects: 112, tier: "amber" },
];

const AUDIT_LOG = [
  {
    ts: "2026-04-30 14:23",
    user: "Priya Sharma",
    role: "Jt Secretary, MoRTH",
    action: "FLAG_APPROVED",
    module: "Procurement",
    desc: "Approved fraud flag on TND-2024-WB-PWD-0901 for CCI referral",
    ip: "10.45.23.11",
    actionColor: "#FF6B6B",
    severity: "Critical",
  },
  {
    ts: "2026-04-30 11:15",
    user: "Rajesh Kumar",
    role: "Platform Admin",
    action: "REPORT_EXPORTED",
    module: "Dashboard",
    desc: "Exported Q4 2025 Cost Overrun Report — 47 projects",
    ip: "10.45.23.45",
    actionColor: "#00D4FF",
    severity: "Low",
  },
  {
    ts: "2026-04-30 09:34",
    user: "Amit Singh",
    role: "NHAI Risk Officer",
    action: "TENDER_ANALYZED",
    module: "Procurement",
    desc: "Initiated AI analysis of TND-2024-NHA-0891",
    ip: "192.168.1.23",
    actionColor: "#00E676",
    severity: "Medium",
  },
  {
    ts: "2026-04-29 17:48",
    user: "Kavita Nair",
    role: "Compliance Auditor",
    action: "AUDIT_INITIATED",
    module: "Governance",
    desc: "Started approval chain audit for PROJ-RRTS-DM-02",
    ip: "10.45.24.67",
    actionColor: "#FFB300",
    severity: "High",
  },
  {
    ts: "2026-04-29 14:22",
    user: "Suresh Patel",
    role: "BMRCL Project Manager",
    action: "SLA_ESCALATED",
    module: "Execution",
    desc: "Escalated Stage 3 SLA breach — Bangalore Metro Extension (Day 167)",
    ip: "192.168.2.15",
    actionColor: "#FF8C42",
    severity: "High",
  },
  {
    ts: "2026-04-29 11:05",
    user: "Dinesh Reddy",
    role: "Ministry Analyst",
    action: "VENDOR_FLAGGED",
    module: "Vendors",
    desc: "Flagged Sai Constructions Pvt Ltd — cartel pattern detection",
    ip: "10.45.25.90",
    actionColor: "#FF6B6B",
    severity: "Critical",
  },
  {
    ts: "2026-04-28 16:30",
    user: "Meera Iyer",
    role: "State PWD Officer, TN",
    action: "COMPLIANCE_REVIEWED",
    module: "Governance",
    desc: "Reviewed Chennai Port Highway Pkg 3 clearance chain",
    ip: "192.168.3.44",
    actionColor: "#00D4FF",
    severity: "Low",
  },
  {
    ts: "2026-04-28 13:17",
    user: "Arun Verma",
    role: "Finance Desk, MoF",
    action: "SANCTION_APPROVED",
    module: "Commercial",
    desc: "Approved financial sanction for NH-58 Expansion Package 2 — ₹847 Cr",
    ip: "10.45.26.11",
    actionColor: "#00E676",
    severity: "Medium",
  },
  {
    ts: "2026-04-28 10:55",
    user: "Platform System",
    role: "Auto-Trigger",
    action: "ALERT_GENERATED",
    module: "Risk Engine",
    desc: "AI detected front-loading risk in TND-2024-OR-PWD-0567 BOQ",
    ip: "10.0.0.1",
    actionColor: "#FF8C42",
    severity: "Critical",
  },
  {
    ts: "2026-04-27 17:20",
    user: "Nakul Bansal",
    role: "Executive Director, NHAI",
    action: "REPORT_EXPORTED",
    module: "Dashboard",
    desc: "Exported National Project Risk Summary — Q1 2026 Board Pack",
    ip: "10.45.27.88",
    actionColor: "#00D4FF",
    severity: "Low",
  },
];

const AUDIT_FILTERS = [
  "All Actions",
  "Approvals",
  "Flags",
  "Escalations",
  "Exports",
];

// ── NH-48 Approval Chain Stages ───────────────────────────────────────────────

interface ChainStage {
  stageNum: number;
  title: string;
  approverName: string;
  designation: string;
  department: string;
  status: "approved" | "pending" | "not_started" | "rejected";
  timestamp?: string;
  comments?: string;
}

const NH48_CHAIN: ChainStage[] = [
  {
    stageNum: 1,
    title: "Technical Clearance",
    approverName: "Dr. Ramesh Babu",
    designation: "Chief Engineer / Project Director",
    department: "NHAI Technical Wing",
    status: "approved",
    timestamp: "2026-01-15 11:32 IST",
    comments:
      "Technical drawings reviewed. Structural integrity confirmed. BOQ aligned with DPR estimates.",
  },
  {
    stageNum: 2,
    title: "Financial Concurrence",
    approverName: "Smt. Anita Krishnan",
    designation: "CFO / FA&CAO",
    department: "Finance & Accounts, NHAI",
    status: "approved",
    timestamp: "2026-01-28 14:17 IST",
    comments:
      "Financial projections validated. IRR at 12.3% meets investment criteria. Budget allocation confirmed for FY26.",
  },
  {
    stageNum: 3,
    title: "Competent Authority Approval",
    approverName: "Shri. Vikram Nair",
    designation: "General Manager / Executive Director",
    department: "NHAI Projects Division",
    status: "approved",
    timestamp: "2026-02-10 09:45 IST",
    comments:
      "Approved subject to completion of land acquisition in Gujarat sector. EPC contract terms validated.",
  },
  {
    stageNum: 4,
    title: "Legal Vetting",
    approverName: "Adv. Priti Mehta",
    designation: "Legal Advisor",
    department: "NHAI Legal Cell",
    status: "approved",
    timestamp: "2026-02-22 16:30 IST",
    comments:
      "Concession agreement clauses reviewed. Force majeure provisions updated per 2025 SBD amendments.",
  },
  {
    stageNum: 5,
    title: "CVO Clearance",
    approverName: "Shri. K.L. Sharma",
    designation: "Chief Vigilance Officer",
    department: "CVO Office, NHAI",
    status: "pending",
    comments:
      "Awaiting response on vendor background verification for L1 bidder — Sadbhav Engineering.",
  },
  {
    stageNum: 6,
    title: "CMD / DG Approval",
    approverName: "Shri. Santosh Kumar",
    designation: "Director General",
    department: "NHAI Headquarters",
    status: "not_started",
  },
  {
    stageNum: 7,
    title: "Ministry Approval",
    approverName: "Shri. Anurag Jain",
    designation: "Secretary, MoRTH",
    department: "Ministry of Road Transport & Highways",
    status: "not_started",
  },
];

// ── Helper ────────────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  icon: Icon,
}: { title: string; subtitle?: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/30">
      <Icon size={14} className="text-primary flex-shrink-0" />
      <div>
        <h2 className="font-semibold text-sm text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-label mt-0.5" style={{ fontSize: "0.62rem" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function StageStatusIcon({ status }: { status: ApprovalStage["status"] }) {
  if (status === "complete")
    return <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />;
  if (status === "breached")
    return (
      <XCircle
        size={14}
        className="flex-shrink-0"
        style={{ color: "#FF3D00" }}
      />
    );
  if (status === "delayed")
    return (
      <AlertTriangle
        size={14}
        className="flex-shrink-0"
        style={{ color: "#FFB300" }}
      />
    );
  if (status === "waiting")
    return <Clock size={14} className="text-muted-foreground flex-shrink-0" />;
  return (
    <div className="w-3.5 h-3.5 rounded-full border border-border/40 flex-shrink-0" />
  );
}

function StateTierColor(tier: string) {
  if (tier === "critical")
    return {
      bg: "rgba(255,61,0,0.18)",
      border: "rgba(255,61,0,0.35)",
      text: "#FF6B6B",
    };
  if (tier === "high")
    return {
      bg: "rgba(255,109,0,0.15)",
      border: "rgba(255,109,0,0.3)",
      text: "#FF8C42",
    };
  if (tier === "moderate")
    return {
      bg: "rgba(255,179,0,0.12)",
      border: "rgba(255,179,0,0.25)",
      text: "#FFB300",
    };
  if (tier === "amber")
    return {
      bg: "rgba(255,210,0,0.1)",
      border: "rgba(255,210,0,0.2)",
      text: "#FFD600",
    };
  return {
    bg: "rgba(0,230,118,0.1)",
    border: "rgba(0,230,118,0.2)",
    text: "#00E676",
  };
}

function chainStatusStyle(status: ChainStage["status"]) {
  if (status === "approved")
    return {
      dot: "#00E676",
      badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      label: "APPROVED",
      line: "#00E67644",
    };
  if (status === "pending")
    return {
      dot: "#FFB300",
      badge: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      label: "PENDING",
      line: "rgba(255,179,0,0.2)",
    };
  if (status === "rejected")
    return {
      dot: "#FF3D00",
      badge: "bg-red-500/20 text-red-400 border border-red-500/30",
      label: "REJECTED",
      line: "rgba(255,61,0,0.2)",
    };
  return {
    dot: "#374151",
    badge: "bg-gray-700/40 text-gray-500 border border-gray-600/30",
    label: "NOT STARTED",
    line: "rgba(255,255,255,0.06)",
  };
}

// ── Export Audit Log Modal ────────────────────────────────────────────────────

function ExportAuditLogModal({ onClose }: { onClose: () => void }) {
  const [fromDate, setFromDate] = useState("2026-04-27");
  const [toDate, setToDate] = useState("2026-04-30");
  const [ministry, setMinistry] = useState("All");
  const [auditType, setAuditType] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [format, setFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [exportState, setExportState] = useState<
    "idle" | "generating" | "ready"
  >("idle");
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const previewRows = AUDIT_LOG.slice(0, 5);

  function handleGenerate() {
    setExportState("generating");
    setProgress(0);
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) {
        p = 100;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => setExportState("ready"), 300);
      }
      setProgress(Math.min(p, 100));
    }, 220);
  }

  function handleDownload() {
    const headers = [
      "Timestamp",
      "User",
      "Role",
      "Action",
      "Module",
      "Description",
      "IP Address",
      "Severity",
    ];
    const rows = AUDIT_LOG.map((e) => [
      e.ts,
      e.user,
      e.role,
      e.action,
      e.module,
      `"${e.desc}"`,
      e.ip,
      e.severity,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `InfraOS_Audit_Log_${fromDate}_to_${toDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded: InfraOS_Audit_Log_${fromDate}_to_${toDate}.csv`);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      data-ocid="governance.export_audit_dialog"
    >
      <div
        className="w-full max-w-3xl rounded-xl overflow-hidden"
        style={{
          background: "rgba(10,12,15,0.97)",
          border: "1px solid rgba(0,212,255,0.25)",
          boxShadow: "0 0 80px rgba(0,212,255,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
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
              <Download size={15} style={{ color: "#00D4FF" }} />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                Export Audit Log
              </h2>
              <p className="text-label" style={{ fontSize: "0.63rem" }}>
                Configure filters and download system audit records
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            data-ocid="governance.export_audit_dialog.close_button"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Date Range */}
          <div>
            <span
              className="block text-xs font-semibold text-foreground mb-3"
              style={{ letterSpacing: "0.08em" }}
            >
              DATE RANGE
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="audit-from-date"
                  className="block text-label mb-1"
                  style={{ fontSize: "0.65rem" }}
                >
                  From
                </label>
                <input
                  id="audit-from-date"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    colorScheme: "dark",
                  }}
                  data-ocid="governance.export_audit_dialog.from_date_input"
                />
              </div>
              <div>
                <label
                  htmlFor="audit-to-date"
                  className="block text-label mb-1"
                  style={{ fontSize: "0.65rem" }}
                >
                  To
                </label>
                <input
                  id="audit-to-date"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    colorScheme: "dark",
                  }}
                  data-ocid="governance.export_audit_dialog.to_date_input"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="audit-ministry"
                className="block text-label mb-1.5"
                style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}
              >
                MINISTRY / DEPT
              </label>
              <select
                id="audit-ministry"
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                data-ocid="governance.export_audit_dialog.ministry_select"
              >
                {[
                  "All",
                  "MoRTH",
                  "NHAI",
                  "MoHUA",
                  "MoEF",
                  "Ministry of Finance",
                  "State PWDs",
                ].map((o) => (
                  <option key={o} value={o} style={{ background: "#0d1117" }}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="audit-type"
                className="block text-label mb-1.5"
                style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}
              >
                AUDIT TYPE
              </label>
              <select
                id="audit-type"
                value={auditType}
                onChange={(e) => setAuditType(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                data-ocid="governance.export_audit_dialog.audit_type_select"
              >
                {[
                  "All",
                  "Financial",
                  "Process",
                  "Compliance",
                  "Performance",
                ].map((o) => (
                  <option key={o} value={o} style={{ background: "#0d1117" }}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="audit-severity"
                className="block text-label mb-1.5"
                style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}
              >
                SEVERITY
              </label>
              <select
                id="audit-severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                data-ocid="governance.export_audit_dialog.severity_select"
              >
                {["All", "High", "Critical"].map((o) => (
                  <option key={o} value={o} style={{ background: "#0d1117" }}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview Table */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Eye size={12} className="text-primary" />
              <span className="text-xs font-semibold text-foreground">
                Preview (First 5 Records)
              </span>
              <span className="text-label" style={{ fontSize: "0.62rem" }}>
                {AUDIT_LOG.length} total records matched
              </span>
            </div>
            <div
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    {["Event", "Date", "Entity", "Severity", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-3 py-2 text-label"
                          style={{
                            fontSize: "0.62rem",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row) => (
                    <tr
                      key={`${row.ts}-${row.user}`}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="px-3 py-2">
                        <span
                          className="font-mono text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: `${row.actionColor}18`,
                            color: row.actionColor,
                            border: `1px solid ${row.actionColor}33`,
                            fontSize: "0.62rem",
                          }}
                        >
                          {row.action}
                        </span>
                      </td>
                      <td
                        className="px-3 py-2 font-mono text-muted-foreground"
                        style={{ fontSize: "0.65rem", whiteSpace: "nowrap" }}
                      >
                        {row.ts.split(" ")[0]}
                      </td>
                      <td
                        className="px-3 py-2 text-foreground"
                        style={{ maxWidth: 160 }}
                      >
                        <div className="truncate">{row.user}</div>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-semibold"
                          style={{
                            background:
                              row.severity === "Critical"
                                ? "rgba(255,61,0,0.15)"
                                : row.severity === "High"
                                  ? "rgba(255,109,0,0.12)"
                                  : "rgba(0,212,255,0.1)",
                            color:
                              row.severity === "Critical"
                                ? "#FF6B6B"
                                : row.severity === "High"
                                  ? "#FF8C42"
                                  : "#00D4FF",
                            fontSize: "0.6rem",
                          }}
                        >
                          {row.severity}
                        </span>
                      </td>
                      <td
                        className="px-3 py-2 text-muted-foreground"
                        style={{ fontSize: "0.65rem" }}
                      >
                        {row.module}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Format Selector */}
          <div>
            <span
              className="block text-xs font-semibold text-foreground mb-3"
              style={{ letterSpacing: "0.08em" }}
            >
              EXPORT FORMAT
            </span>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  {
                    value: "csv",
                    label: "CSV",
                    icon: Filter,
                    desc: "Comma-separated values",
                  },
                  {
                    value: "excel",
                    label: "Excel",
                    icon: FileSpreadsheet,
                    desc: "Microsoft Excel (.xlsx)",
                  },
                  {
                    value: "pdf",
                    label: "PDF Report",
                    icon: FileText,
                    desc: "Formatted audit report",
                  },
                ] as const
              ).map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormat(value)}
                  className="flex items-center gap-3 p-3 rounded-lg text-left transition-all"
                  style={{
                    background:
                      format === value
                        ? "rgba(0,212,255,0.1)"
                        : "rgba(255,255,255,0.03)",
                    border:
                      format === value
                        ? "1px solid rgba(0,212,255,0.4)"
                        : "1px solid rgba(255,255,255,0.07)",
                    boxShadow:
                      format === value
                        ? "0 0 12px rgba(0,212,255,0.1)"
                        : "none",
                  }}
                  data-ocid={`governance.export_audit_dialog.format_${value}`}
                >
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        format === value
                          ? "rgba(0,212,255,0.2)"
                          : "rgba(255,255,255,0.07)",
                    }}
                  >
                    <Icon
                      size={14}
                      style={{
                        color: format === value ? "#00D4FF" : "#6B7280",
                      }}
                    />
                  </div>
                  <div>
                    <div
                      className="text-xs font-semibold"
                      style={{
                        color: format === value ? "#00D4FF" : "#E5E7EB",
                      }}
                    >
                      {label}
                    </div>
                    <div className="text-label" style={{ fontSize: "0.6rem" }}>
                      {desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          {exportState === "generating" && (
            <div
              className="rounded-lg p-4 space-y-2"
              style={{
                background: "rgba(0,212,255,0.06)",
                border: "1px solid rgba(0,212,255,0.15)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#00D4FF" }}
                >
                  Generating export…
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#00D4FF" }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #0077aa, #00D4FF)",
                    boxShadow: "0 0 8px rgba(0,212,255,0.5)",
                  }}
                />
              </div>
              <p className="text-label" style={{ fontSize: "0.62rem" }}>
                Compiling {AUDIT_LOG.length} audit records from {fromDate} to{" "}
                {toDate}…
              </p>
            </div>
          )}

          {/* Download Ready */}
          {exportState === "ready" && (
            <div
              className="rounded-lg p-4 space-y-3"
              style={{
                background: "rgba(0,230,118,0.07)",
                border: "1px solid rgba(0,230,118,0.25)",
              }}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} style={{ color: "#00E676" }} />
                <div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: "#00E676" }}
                  >
                    Export Ready
                  </div>
                  <div className="text-label" style={{ fontSize: "0.62rem" }}>
                    {AUDIT_LOG.length} records · {format.toUpperCase()} format ·{" "}
                    {fromDate} to {toDate}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                style={{
                  background: "rgba(0,230,118,0.15)",
                  border: "1px solid rgba(0,230,118,0.4)",
                  color: "#00E676",
                }}
                data-ocid="governance.export_audit_dialog.download_button"
              >
                <Download size={15} />
                Download InfraOS_Audit_Log.csv
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost text-xs"
            data-ocid="governance.export_audit_dialog.cancel_button"
          >
            Cancel
          </button>
          {exportState === "idle" && (
            <button
              type="button"
              onClick={handleGenerate}
              className="btn-primary text-xs flex items-center gap-2"
              data-ocid="governance.export_audit_dialog.generate_button"
            >
              <Zap size={13} />
              Generate Export
            </button>
          )}
          {exportState === "generating" && (
            <button
              type="button"
              className="btn-primary text-xs opacity-50 cursor-not-allowed"
              disabled
            >
              Generating…
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Audit Approval Chain Modal ────────────────────────────────────────────────

function ApprovalChainModal({ onClose }: { onClose: () => void }) {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showCommentFor, setShowCommentFor] = useState<number | null>(null);

  const approvedCount = NH48_CHAIN.filter(
    (s) => s.status === "approved",
  ).length;
  const totalCount = NH48_CHAIN.length;
  const progressPct = (approvedCount / totalCount) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      data-ocid="governance.approval_chain_dialog"
    >
      <div
        className="w-full max-w-3xl rounded-xl overflow-hidden"
        style={{
          background: "rgba(9,11,14,0.98)",
          border: "1px solid rgba(0,212,255,0.2)",
          boxShadow: "0 0 100px rgba(0,212,255,0.06)",
          minHeight: "auto",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
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
              <Shield size={15} style={{ color: "#00D4FF" }} />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                Approval Chain Visualization
              </h2>
              <p className="text-label" style={{ fontSize: "0.63rem" }}>
                NH-48 Delhi–Mumbai Expressway · Project ID: NH48-DM-EXPR-2025
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            data-ocid="governance.approval_chain_dialog.close_button"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Progress Bar */}
        <div
          className="px-6 py-4 border-b"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(0,212,255,0.04)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">
              Overall Approval Progress
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: "#00D4FF" }}
            >
              {approvedCount}/{totalCount} Stages Completed
            </span>
          </div>
          <div
            className="w-full h-3 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #00a89c, #00E676)",
                boxShadow: "0 0 10px rgba(0,230,118,0.4)",
              }}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            {[
              { dot: "#00E676", label: "Approved (4)" },
              { dot: "#FFB300", label: "Pending (1)" },
              { dot: "#374151", label: "Not Started (2)" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: l.dot }}
                />
                <span className="text-label" style={{ fontSize: "0.62rem" }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chain Stages */}
        <div className="p-6 space-y-0">
          {NH48_CHAIN.map((stage, idx) => {
            const style = chainStatusStyle(stage.status);
            const isExpanded = expandedStage === idx;
            const isLast = idx === NH48_CHAIN.length - 1;

            return (
              <div key={stage.stageNum} className="flex gap-4">
                {/* Timeline column */}
                <div
                  className="flex flex-col items-center flex-shrink-0"
                  style={{ width: 32 }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 z-10 relative"
                    style={{
                      background: `${style.dot}22`,
                      border: `2px solid ${style.dot}`,
                      color: style.dot,
                      boxShadow:
                        stage.status === "approved"
                          ? `0 0 12px ${style.dot}44`
                          : "none",
                    }}
                  >
                    {stage.status === "approved" ? "✓" : stage.stageNum}
                  </div>
                  {!isLast && (
                    <div
                      className="flex-1 w-0.5 my-1"
                      style={{ background: style.line, minHeight: 24 }}
                    />
                  )}
                </div>

                {/* Stage content */}
                <div className="flex-1 pb-4">
                  <button
                    type="button"
                    className="w-full text-left rounded-lg p-4 transition-all"
                    style={{
                      background: isExpanded
                        ? `${style.dot}0d`
                        : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isExpanded ? `${style.dot}33` : "rgba(255,255,255,0.07)"}`,
                    }}
                    onClick={() => setExpandedStage(isExpanded ? null : idx)}
                    data-ocid={`governance.approval_chain_dialog.stage.${idx + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">
                              {stage.title}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded font-bold ${style.badge}`}
                              style={{ fontSize: "0.6rem" }}
                            >
                              {style.label}
                            </span>
                          </div>
                          <div
                            className="text-label mt-0.5"
                            style={{ fontSize: "0.65rem" }}
                          >
                            {stage.approverName} ·{" "}
                            <span style={{ color: "rgba(176,190,197,0.5)" }}>
                              {stage.designation}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {stage.timestamp && (
                          <span
                            className="font-mono text-label"
                            style={{ fontSize: "0.6rem" }}
                          >
                            {stage.timestamp.split(" ")[0]}
                          </span>
                        )}
                        <ChevronDown
                          size={13}
                          className="text-muted-foreground transition-transform"
                          style={{
                            transform: isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div
                      className="mt-1 rounded-lg p-4 space-y-4"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div
                            className="text-label mb-1"
                            style={{
                              fontSize: "0.6rem",
                              letterSpacing: "0.08em",
                            }}
                          >
                            APPROVER
                          </div>
                          <div className="text-sm font-semibold text-foreground">
                            {stage.approverName}
                          </div>
                          <div
                            className="text-muted-foreground"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {stage.designation}
                          </div>
                        </div>
                        <div>
                          <div
                            className="text-label mb-1"
                            style={{
                              fontSize: "0.6rem",
                              letterSpacing: "0.08em",
                            }}
                          >
                            DEPARTMENT
                          </div>
                          <div className="text-sm text-foreground">
                            {stage.department}
                          </div>
                          {stage.timestamp && (
                            <div
                              className="font-mono text-muted-foreground"
                              style={{ fontSize: "0.68rem" }}
                            >
                              {stage.timestamp}
                            </div>
                          )}
                        </div>
                      </div>
                      {stage.comments && (
                        <div
                          className="rounded-lg p-3"
                          style={{
                            background: `${style.dot}0a`,
                            border: `1px solid ${style.dot}22`,
                          }}
                        >
                          <div
                            className="text-label mb-1"
                            style={{
                              fontSize: "0.6rem",
                              letterSpacing: "0.08em",
                            }}
                          >
                            COMMENTS / REMARKS
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {stage.comments}
                          </p>
                        </div>
                      )}
                      {stage.status === "not_started" && (
                        <div
                          className="text-label"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Awaiting completion of prior stages before this stage
                          can begin.
                        </div>
                      )}
                      {stage.status === "pending" && (
                        <div
                          className="text-label"
                          style={{ fontSize: "0.7rem", color: "#FFB300" }}
                        >
                          ⏳ This stage is currently in review. CVO verification
                          is in progress.
                        </div>
                      )}

                      {/* Comment input */}
                      {showCommentFor === idx ? (
                        <div className="space-y-2">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add your comment or remark…"
                            rows={3}
                            className="w-full rounded-lg px-3 py-2 text-xs text-foreground resize-none focus:outline-none"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                            data-ocid={`governance.approval_chain_dialog.comment_input.${idx + 1}`}
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                toast.success("Comment added successfully.");
                                setShowCommentFor(null);
                                setCommentText("");
                              }}
                              className="btn-primary text-xs"
                              data-ocid={`governance.approval_chain_dialog.comment_submit.${idx + 1}`}
                            >
                              Submit Comment
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowCommentFor(null)}
                              className="btn-ghost text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setShowCommentFor(idx)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{
                              background: "rgba(0,212,255,0.1)",
                              border: "1px solid rgba(0,212,255,0.25)",
                              color: "#00D4FF",
                            }}
                            data-ocid={`governance.approval_chain_dialog.add_comment.${idx + 1}`}
                          >
                            <MessageSquare size={12} /> Add Comment
                          </button>
                          {(stage.status === "pending" ||
                            stage.status === "not_started") && (
                            <button
                              type="button"
                              onClick={() =>
                                toast.info(
                                  "Escalation sent to supervisor and logged in audit trail.",
                                  { duration: 4000 },
                                )
                              }
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                              style={{
                                background: "rgba(255,179,0,0.1)",
                                border: "1px solid rgba(255,179,0,0.3)",
                                color: "#FFB300",
                              }}
                              data-ocid={`governance.approval_chain_dialog.escalate.${idx + 1}`}
                            >
                              <AlertTriangle size={12} /> Escalate
                            </button>
                          )}
                          {stage.status === "pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                toast.success(
                                  "Approval request re-sent to CVO Office.",
                                  { duration: 4000 },
                                )
                              }
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                              style={{
                                background: "rgba(0,230,118,0.1)",
                                border: "1px solid rgba(0,230,118,0.25)",
                                color: "#00E676",
                              }}
                              data-ocid={`governance.approval_chain_dialog.request_approval.${idx + 1}`}
                            >
                              <CheckCircle2 size={12} /> Request Approval
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <span className="text-label" style={{ fontSize: "0.65rem" }}>
            Last updated: 2026-04-30 · NH-48 Delhi–Mumbai Expressway · ₹1,24,000
            Cr
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs"
            data-ocid="governance.approval_chain_dialog.cancel_button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function GovernancePage() {
  const { selectedOrg } = useOrg();
  const orgData = getOrgData(selectedOrg.key);
  const [auditFilter, setAuditFilter] = useState("All Actions");
  const [expandedProject, setExpandedProject] = useState<string | null>(
    "PROJ-RRTS-DM-02",
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [showChainModal, setShowChainModal] = useState(false);

  const filteredAudit = AUDIT_LOG.filter((entry) => {
    if (auditFilter === "All Actions") return true;
    if (auditFilter === "Approvals")
      return (
        entry.action.includes("APPROV") || entry.action.includes("SANCTION")
      );
    if (auditFilter === "Flags")
      return (
        entry.action.includes("FLAG") ||
        entry.action.includes("ALERT") ||
        entry.action.includes("VENDOR_FLAGGED")
      );
    if (auditFilter === "Escalations") return entry.action.includes("ESCALAT");
    if (auditFilter === "Exports") return entry.action.includes("EXPORT");
    return true;
  });

  return (
    <div className="p-6 space-y-6" data-ocid="governance.page">
      {/* Modals */}
      {showExportModal && (
        <ExportAuditLogModal onClose={() => setShowExportModal(false)} />
      )}
      {showChainModal && (
        <ApprovalChainModal onClose={() => setShowChainModal(false)} />
      )}

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
              <span>Home</span>
              <ChevronRight size={10} />
              <span>Intelligence Modules</span>
              <ChevronRight size={10} />
              <span className="text-primary">Governance Intelligence</span>
            </nav>
            <span
              className="text-label"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                color: "#00D4FF",
              }}
            >
              OVERSIGHT & COMPLIANCE ENGINE
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            Governance Intelligence
          </h1>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            {[
              {
                label: "Manipulation Alerts",
                value: orgData.kpis.riskAlerts.toString(),
                color: "#FF3D00",
              },
              {
                label: "Bid Rigging Flags",
                value: Math.round(orgData.kpis.riskAlerts * 0.38).toString(),
                color: "#FF6D00",
              },
              {
                label: "SLA Breaches",
                value: Math.round(
                  orgData.kpis.delayedProjects * 0.7,
                ).toString(),
                color: "#FFB300",
              },
              {
                label: "Compliance Score",
                value: `${orgData.kpis.complianceScore}%`,
                color: "#00E676",
              },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span
                  className="font-mono font-bold text-sm"
                  style={{ color: s.color }}
                >
                  {s.value}
                </span>
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "0.72rem" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="btn-secondary text-xs"
            data-ocid="governance.audit_chain_button"
            onClick={() => setShowChainModal(true)}
          >
            Audit Approval Chain
          </button>
          <button
            type="button"
            className="btn-primary text-xs"
            data-ocid="governance.export_audit_button"
            onClick={() => setShowExportModal(true)}
          >
            <Download size={13} className="inline mr-1.5 -mt-0.5" />
            Export Audit Log
          </button>
        </div>
      </div>

      {/* ── Section 1: Governance Scorecards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {SCORECARD_DATA.map((card, i) => {
          const Icon = card.icon;
          const pct = (card.value / card.max) * 100;
          return (
            <div
              key={card.label}
              className="glass-card p-4 space-y-2.5 transition-smooth hover:border-primary/30"
              data-ocid={`governance.scorecard.${i + 1}`}
            >
              <div className="flex items-center justify-between">
                <Icon size={13} style={{ color: card.color }} />
                <span
                  className={card.statusClass}
                  style={{ fontSize: "0.58rem" }}
                >
                  {card.status}
                </span>
              </div>
              <div>
                <div
                  className="font-mono font-bold text-2xl"
                  style={{ color: card.color }}
                >
                  {card.value}
                  <span className="text-sm font-normal text-muted-foreground">
                    {card.unit}
                  </span>
                </div>
                <div
                  className="text-label mt-0.5"
                  style={{ fontSize: "0.65rem" }}
                >
                  {card.label}
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${card.color}aa, ${card.color})`,
                  }}
                />
              </div>
              <div className="flex items-center gap-1">
                {card.trendDir === "down" ? (
                  <TrendingDown size={11} style={{ color: "#FF6B6B" }} />
                ) : (
                  <TrendingUp size={11} style={{ color: "#00E676" }} />
                )}
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: card.trendDir === "down" ? "#FF6B6B" : "#00E676",
                  }}
                >
                  {card.trend > 0 ? "+" : ""}
                  {card.trend} pts this quarter
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Section 2: PM GatiShakti Governance Framework ── */}
      <div className="glass-card" data-ocid="governance.gatishakti_panel">
        <SectionHeader
          title="PM GatiShakti Governance Framework"
          subtitle="National Master Plan — Integrated Infrastructure Intelligence"
          icon={Shield}
        />
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {[
              {
                name: "EGOS",
                fullName: "Empowered Group of Secretaries",
                role: "Policy Direction",
                description: GATISHAKTI_DATA.governanceTiers[0],
                color: "#00D4FF",
              },
              {
                name: "NPG",
                fullName: "Network Planning Group",
                role: "Planning Alignment",
                description: GATISHAKTI_DATA.governanceTiers[1],
                color: "#00E676",
              },
              {
                name: "TSU",
                fullName: "Technical Support Unit",
                role: "Analytical Support",
                description: GATISHAKTI_DATA.governanceTiers[2],
                color: "#FFB300",
              },
            ].map((tier, i) => (
              <div
                key={tier.name}
                className="rounded-lg p-4"
                style={{
                  background: `${tier.color}0d`,
                  border: `1px solid ${tier.color}33`,
                }}
                data-ocid={`governance.gatishakti_tier.${i + 1}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm"
                    style={{
                      background: `${tier.color}22`,
                      border: `2px solid ${tier.color}55`,
                      color: tier.color,
                    }}
                  >
                    {tier.name}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">
                      {tier.role}
                    </div>
                    <div className="text-label" style={{ fontSize: "0.62rem" }}>
                      {tier.fullName}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                icon: Activity,
                color: "#00D4FF",
                title: "1,500+",
                subtitle: (
                  <>
                    GIS Data Layers integrated from{" "}
                    <span style={{ color: "#00D4FF" }}>
                      44 Central Ministries
                    </span>{" "}
                    + <span style={{ color: "#00E676" }}>36 States/UTs</span>
                  </>
                ),
              },
              {
                icon: Shield,
                color: "#00E676",
                title: "BISAG-N",
                subtitle:
                  "Nodal GIS platform developer — Bhaskaracharya National Institute for Space Applications & Geo-informatics",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{
                  background: `${item.color}0c`,
                  border: `1px solid ${item.color}22`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}20` }}
                >
                  <item.icon size={14} style={{ color: item.color }} />
                </div>
                <div>
                  <div className="font-mono font-bold text-xl text-foreground">
                    {item.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 3: Municipal Bond Issuances ── */}
      <div className="glass-card" data-ocid="governance.municipal_bonds_panel">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/30">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" />
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                Municipal Bond Issuances
              </h2>
              <p className="text-label mt-0.5" style={{ fontSize: "0.62rem" }}>
                ₹ Crore — 2017–2025 · Total: ₹3,579 Crore across 13 cities
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className="font-mono font-bold text-xl"
              style={{ color: "#00D4FF" }}
            >
              ₹3,579 Cr
            </div>
            <div className="text-label" style={{ fontSize: "0.6rem" }}>
              Total Issuances
            </div>
          </div>
        </div>
        <div className="px-4 pt-3 pb-2" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MUNICIPAL_BONDS}
              margin={{ top: 4, right: 8, left: -15, bottom: 40 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="city"
                tick={{ fill: "rgba(176,190,197,0.6)", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fill: "rgba(176,190,197,0.6)", fontSize: 9 }}
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
                formatter={(
                  value: number,
                  _: string,
                  entry: { payload?: { city?: string; year?: number } },
                ) => [
                  `₹${value} Crore (${entry.payload?.year ?? ""})`,
                  entry.payload?.city ?? "",
                ]}
              />
              <Bar dataKey="amount" radius={[3, 3, 0, 0]} name="₹ Crore">
                {MUNICIPAL_BONDS.map((entry) => (
                  <Cell
                    key={`bond-${entry.city}`}
                    fill={
                      entry.amount >= 300
                        ? "#00E676"
                        : entry.amount >= 200
                          ? "#00D4FF"
                          : entry.amount >= 150
                            ? "#00B8D4"
                            : "#007B9A"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Section 4: Tender Manipulation & Bid Rigging ── */}
      <div className="glass-card" data-ocid="governance.manipulation_panel">
        <SectionHeader
          title="Tender Manipulation Detection"
          subtitle="AI Risk Analysis — Live Monitoring"
          icon={AlertTriangle}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/20">
                {[
                  "Tender ID",
                  "Project",
                  "Ministry",
                  "Alert Type",
                  "Evidence Strength",
                  "Status",
                  "Action",
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
              {MANIPULATION_DATA.map((row, i) => (
                <tr
                  key={row.id}
                  className="border-b border-border/10 hover:bg-white/[0.03] transition-smooth"
                  data-ocid={`governance.manipulation.item.${i + 1}`}
                >
                  <td
                    className="px-4 py-3 font-mono text-muted-foreground whitespace-nowrap"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {row.id}
                  </td>
                  <td
                    className="px-4 py-3 font-semibold text-foreground"
                    style={{ maxWidth: 180 }}
                  >
                    <div className="truncate">{row.project}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {row.ministry}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide"
                      style={{
                        background: row.alertBg,
                        color: row.alertColor,
                        border: `1px solid ${row.alertColor}44`,
                      }}
                    >
                      {row.alertType}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-border/30 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.evidence}%`,
                            background: row.alertColor,
                          }}
                        />
                      </div>
                      <span className={row.evidenceClass}>
                        {row.evidenceLabel} ({row.evidence}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={row.statusClass}>{row.status}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      type="button"
                      className={
                        row.action === "Investigate"
                          ? "btn-secondary"
                          : "btn-ghost"
                      }
                      style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}
                      data-ocid={`governance.manipulation.action.${i + 1}`}
                      onClick={() =>
                        toast.info(
                          `${row.action === "Investigate" ? "Investigation" : "Review"} opened for ${row.project}`,
                          { duration: 3000 },
                        )
                      }
                    >
                      {row.action === "Investigate" ? (
                        <>
                          <Search size={11} className="inline mr-1 -mt-0.5" />
                          Investigate
                        </>
                      ) : (
                        <>
                          <Eye size={11} className="inline mr-1 -mt-0.5" />
                          View
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 5: Approval SLA Tracking ── */}
      <div className="glass-card" data-ocid="governance.sla_panel">
        <SectionHeader
          title="Approval Chain Intelligence"
          subtitle="Active Projects — SLA Monitoring"
          icon={Clock}
        />
        <div className="p-5 space-y-4">
          {APPROVAL_PROJECTS.map((proj) => {
            const isExpanded = expandedProject === proj.id;
            return (
              <div
                key={proj.id}
                className="glass-elevated rounded overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedProject(isExpanded ? null : proj.id)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-smooth text-left"
                  data-ocid={`governance.approval_project.${proj.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-semibold text-sm text-foreground">
                      {proj.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {proj.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {proj.stages.some((s) => s.status === "breached") && (
                      <span className="badge-critical">CRITICAL BREACH</span>
                    )}
                    <ChevronRight
                      size={14}
                      className="text-muted-foreground transition-smooth"
                      style={{
                        transform: isExpanded
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <div className="flex items-center mb-4 overflow-x-auto pb-1">
                      {proj.stages.map((stage, si) => {
                        const isLast = si === proj.stages.length - 1;
                        const dotColor =
                          stage.status === "complete"
                            ? "#00E676"
                            : stage.status === "breached"
                              ? "#FF3D00"
                              : stage.status === "delayed"
                                ? "#FFB300"
                                : stage.status === "waiting"
                                  ? "#4B5563"
                                  : "#2D3748";
                        return (
                          <div
                            key={`dot-${stage.name}`}
                            className="flex items-center"
                            style={{ minWidth: 0 }}
                          >
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0 z-10"
                              style={{
                                background: dotColor,
                                boxShadow:
                                  stage.status === "breached"
                                    ? "0 0 10px #FF3D0066"
                                    : "none",
                              }}
                            />
                            {!isLast && (
                              <div
                                className="h-px flex-1"
                                style={{
                                  minWidth: 40,
                                  background:
                                    stage.status === "complete"
                                      ? "#00E67644"
                                      : "rgba(255,255,255,0.08)",
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                      {proj.stages.map((stage, si) => {
                        const stageColors = {
                          complete: {
                            border: "rgba(0,230,118,0.2)",
                            bg: "rgba(0,230,118,0.05)",
                          },
                          breached: {
                            border: "rgba(255,61,0,0.35)",
                            bg: "rgba(255,61,0,0.07)",
                          },
                          delayed: {
                            border: "rgba(255,179,0,0.25)",
                            bg: "rgba(255,179,0,0.05)",
                          },
                          waiting: {
                            border: "rgba(255,255,255,0.08)",
                            bg: "transparent",
                          },
                          not_started: {
                            border: "rgba(255,255,255,0.05)",
                            bg: "transparent",
                          },
                        }[stage.status];
                        return (
                          <div
                            key={`stage-${stage.name}`}
                            className="rounded p-3 space-y-1.5"
                            style={{
                              border: `1px solid ${stageColors.border}`,
                              background: stageColors.bg,
                            }}
                            data-ocid={`governance.approval_stage.${proj.id}.${si + 1}`}
                          >
                            <div className="flex items-center gap-1.5">
                              <StageStatusIcon status={stage.status} />
                              <span className="text-xs font-semibold text-foreground leading-tight">
                                {stage.name}
                              </span>
                            </div>
                            <div
                              className="text-label"
                              style={{ fontSize: "0.6rem" }}
                            >
                              {stage.dept}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <div>
                                <div
                                  className="text-label"
                                  style={{ fontSize: "0.58rem" }}
                                >
                                  Target
                                </div>
                                <div className="font-mono text-xs text-muted-foreground">
                                  {stage.targetDays}d
                                </div>
                              </div>
                              <div>
                                <div
                                  className="text-label"
                                  style={{ fontSize: "0.58rem" }}
                                >
                                  Actual
                                </div>
                                <div
                                  className="font-mono text-xs"
                                  style={{
                                    color:
                                      stage.status === "complete"
                                        ? "#00E676"
                                        : stage.status === "breached"
                                          ? "#FF3D00"
                                          : stage.status === "delayed"
                                            ? "#FFB300"
                                            : "rgba(176,190,197,0.4)",
                                  }}
                                >
                                  {stage.actualDays !== null
                                    ? `${stage.actualDays}d`
                                    : "—"}
                                </div>
                              </div>
                            </div>
                            {stage.breach && (
                              <div
                                className="text-xs font-bold"
                                style={{
                                  color:
                                    stage.status === "breached"
                                      ? "#FF3D00"
                                      : "#FFB300",
                                }}
                              >
                                {stage.status === "breached"
                                  ? `⚠ BREACHED +${stage.breach}d`
                                  : `+${stage.breach}d DELAYED`}
                              </div>
                            )}
                            {(stage.status === "waiting" ||
                              stage.status === "not_started") && (
                              <div
                                className="text-label"
                                style={{ fontSize: "0.62rem" }}
                              >
                                {stage.status === "waiting"
                                  ? "Waiting on prior"
                                  : "Not Started"}
                              </div>
                            )}
                            {(stage.status === "breached" ||
                              stage.status === "delayed") && (
                              <button
                                type="button"
                                className="w-full text-center py-0.5 rounded text-xs font-semibold transition-smooth hover:opacity-80"
                                style={{
                                  background: "rgba(255,61,0,0.12)",
                                  color: "#FF6B6B",
                                  border: "1px solid rgba(255,61,0,0.25)",
                                }}
                                onClick={() =>
                                  toast.warning(
                                    `Escalation triggered for ${stage.name} — ${stage.dept}`,
                                    { duration: 4000 },
                                  )
                                }
                                data-ocid={`governance.escalate_button.${proj.id}.${si + 1}`}
                              >
                                Escalate
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 6: Dept Accountability + State Heatmap ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div
          className="glass-card"
          data-ocid="governance.dept_accountability_panel"
        >
          <SectionHeader title="Department Accountability Map" icon={Shield} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/20">
                  {[
                    "Department",
                    "Projects",
                    "Avg Days",
                    "SLA Compliance",
                    "Risk",
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
                {DEPT_DATA.map((d, i) => (
                  <tr
                    key={d.dept}
                    className="border-b border-border/10 hover:bg-white/[0.03] transition-smooth"
                    style={
                      d.critical
                        ? { background: "rgba(255,61,0,0.04)" }
                        : undefined
                    }
                    data-ocid={`governance.dept.item.${i + 1}`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {d.critical && (
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: "#FF3D00" }}
                          />
                        )}
                        <span className="font-semibold text-foreground text-xs">
                          {d.dept}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">
                      {d.projects}
                    </td>
                    <td
                      className="px-4 py-2.5 font-mono"
                      style={{
                        color:
                          d.avgDays > 120
                            ? "#FF6B6B"
                            : d.avgDays > 70
                              ? "#FFB300"
                              : "#00E676",
                      }}
                    >
                      {d.avgDays}d
                    </td>
                    <td className="px-4 py-2.5" style={{ width: 140 }}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${d.compliance}%`,
                              background:
                                d.compliance >= 75
                                  ? "linear-gradient(90deg,#00b8d4,#00E676)"
                                  : d.compliance >= 50
                                    ? "linear-gradient(90deg,#FF8C42,#FFB300)"
                                    : "linear-gradient(90deg,#FF3D00,#FF6B6B)",
                            }}
                          />
                        </div>
                        <span
                          className="font-mono text-xs"
                          style={{ color: d.riskColor, minWidth: 28 }}
                        >
                          {d.compliance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className={d.riskClass}>{d.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card" data-ocid="governance.state_heatmap_panel">
          <SectionHeader
            title="Executive Risk Heatmap"
            subtitle="State-Level Governance Risk Matrix"
            icon={Activity}
          />
          <div className="p-5">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {STATE_RISK.map((s, i) => {
                const colors = StateTierColor(s.tier);
                return (
                  <div
                    key={s.state}
                    className="rounded p-2.5 text-center transition-smooth hover:scale-105 cursor-default"
                    style={{
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                    }}
                    data-ocid={`governance.state_cell.${i + 1}`}
                  >
                    <div
                      className="font-bold text-xs"
                      style={{ color: colors.text }}
                    >
                      {s.state}
                    </div>
                    <div
                      className="font-mono font-bold text-base"
                      style={{ color: colors.text }}
                    >
                      {s.score}
                    </div>
                    <div
                      className="text-label mt-0.5"
                      style={{ fontSize: "0.55rem" }}
                    >
                      {s.projects} proj
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-border/20">
              {[
                {
                  label: "Critical",
                  color: "#FF6B6B",
                  bg: "rgba(255,61,0,0.15)",
                },
                { label: "High", color: "#FF8C42", bg: "rgba(255,109,0,0.12)" },
                {
                  label: "Moderate",
                  color: "#FFB300",
                  bg: "rgba(255,179,0,0.12)",
                },
                { label: "Amber", color: "#FFD600", bg: "rgba(255,210,0,0.1)" },
                { label: "Low", color: "#00E676", bg: "rgba(0,230,118,0.1)" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded"
                    style={{
                      background: l.bg,
                      border: `1px solid ${l.color}44`,
                    }}
                  />
                  <span className="text-label" style={{ fontSize: "0.62rem" }}>
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 7: Audit Log ── */}
      <div className="glass-card" data-ocid="governance.audit_log_panel">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/30 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-primary" />
            <h2 className="font-semibold text-sm text-foreground">
              System Audit Trail
            </h2>
            <span className="text-label ml-1" style={{ fontSize: "0.62rem" }}>
              ({filteredAudit.length} entries)
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {AUDIT_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setAuditFilter(f)}
                className="transition-smooth text-xs px-3 py-1 rounded"
                style={{
                  background:
                    auditFilter === f ? "rgba(0,212,255,0.12)" : "transparent",
                  border:
                    auditFilter === f
                      ? "1px solid rgba(0,212,255,0.3)"
                      : "1px solid rgba(255,255,255,0.08)",
                  color:
                    auditFilter === f ? "#00D4FF" : "rgba(176,190,197,0.7)",
                  fontWeight: auditFilter === f ? 600 : 400,
                }}
                data-ocid={`governance.audit_filter.${f.toLowerCase().replace(/\s+/g, "_")}`}
              >
                {f}
              </button>
            ))}
            <button
              type="button"
              className="btn-secondary text-xs flex items-center gap-1.5"
              style={{ padding: "0.3rem 0.75rem" }}
              data-ocid="governance.export_audit_log_button"
              onClick={() => setShowExportModal(true)}
            >
              <Download size={11} />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/20">
                {[
                  "Timestamp",
                  "User",
                  "Action",
                  "Module",
                  "Description",
                  "IP Address",
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
              {filteredAudit.map((entry, idx) => (
                <tr
                  key={`${entry.ts}-${entry.user}`}
                  className="border-b border-border/10 hover:bg-white/[0.03] transition-smooth"
                  data-ocid={`governance.audit_log.item.${idx + 1}`}
                >
                  <td
                    className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {entry.ts}
                  </td>
                  <td className="px-4 py-2.5" style={{ minWidth: 160 }}>
                    <div className="font-semibold text-foreground text-xs">
                      {entry.user}
                    </div>
                    <div
                      className="text-muted-foreground"
                      style={{ fontSize: "0.62rem" }}
                    >
                      {entry.role}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span
                      className="font-mono font-bold px-2 py-0.5 rounded"
                      style={{
                        background: `${entry.actionColor}18`,
                        color: entry.actionColor,
                        border: `1px solid ${entry.actionColor}33`,
                        fontSize: "0.65rem",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                    {entry.module}
                  </td>
                  <td
                    className="px-4 py-2.5 text-muted-foreground"
                    style={{ maxWidth: 320 }}
                  >
                    <div className="truncate">{entry.desc}</div>
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {entry.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/20">
          <span
            className="text-muted-foreground"
            style={{ fontSize: "0.7rem" }}
          >
            Showing {filteredAudit.length} of {AUDIT_LOG.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-ghost text-xs"
              style={{ padding: "0.3rem 0.75rem" }}
              data-ocid="governance.audit_log.pagination_prev"
            >
              ← Prev
            </button>
            <span className="text-xs text-muted-foreground px-2">
              Page 1 of 1
            </span>
            <button
              type="button"
              className="btn-ghost text-xs"
              style={{ padding: "0.3rem 0.75rem" }}
              data-ocid="governance.audit_log.pagination_next"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
