import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Download,
  ExternalLink,
  Filter,
  Flag,
  Home,
  Search,
  Shield,
} from "lucide-react";
import { useMemo, useState } from "react";

// ── Types ───────────────────────────────────────────────────────────
type Severity = "critical" | "high" | "info";

interface AuditEntry {
  id: number;
  timestamp: Date;
  user: string;
  action: string;
  module: string;
  project: string;
  desc: string;
  before: string;
  after: string;
  severity: Severity;
}

// ── 25 Real Audit Entries ────────────────────────────────────────────────────
const AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: 1,
    timestamp: new Date("2024-03-15T09:14:00"),
    user: "Naman Maheshwari",
    action: "Milestone Added",
    module: "Execution",
    project: "NH-44 Expansion",
    desc: "Lane 3 completion milestone added for IRCON Chennai zone",
    before: "65%",
    after: "68%",
    severity: "info",
  },
  {
    id: 2,
    timestamp: new Date("2024-03-15T08:47:00"),
    user: "System Auto",
    action: "Delay Flagged",
    module: "Execution",
    project: "Zojila Tunnel, NHIDCL",
    desc: "Contractor mobilization delay detected — 47 day slippage",
    before: "On Track",
    after: "Delayed 47d",
    severity: "critical",
  },
  {
    id: 3,
    timestamp: new Date("2024-03-14T16:22:00"),
    user: "Naman Maheshwari",
    action: "Risk Flag",
    module: "Procurement",
    project: "NH Pkg-07, NHAI",
    desc: "L1 Anomaly: bid ratio 0.71x — potential underbidding detected",
    before: "Under Review",
    after: "CVC Referred",
    severity: "high",
  },
  {
    id: 4,
    timestamp: new Date("2024-03-14T14:55:00"),
    user: "System Auto",
    action: "Delay Flagged",
    module: "Execution",
    project: "DMRC Phase-4",
    desc: "Land acquisition incomplete for 3 stations — ROB clearance pending",
    before: "34%",
    after: "29% effective",
    severity: "critical",
  },
  {
    id: 5,
    timestamp: new Date("2024-03-14T11:30:00"),
    user: "Ministry Official",
    action: "Approval Granted",
    module: "Governance",
    project: "RVNL Bullet Train",
    desc: "Forest clearance approved for Sabarmati-Mumbai corridor",
    before: "Pending",
    after: "Approved",
    severity: "info",
  },
  {
    id: 6,
    timestamp: new Date("2024-03-13T15:44:00"),
    user: "System Auto",
    action: "Risk Flag",
    module: "Commercial",
    project: "JNPA Terminal T2",
    desc: "Billing anomaly: 3.2x front-loading ratio in RA Bill #7",
    before: "Normal",
    after: "Audit Hold",
    severity: "high",
  },
  {
    id: 7,
    timestamp: new Date("2024-03-13T13:10:00"),
    user: "Naman Maheshwari",
    action: "Claim Filed",
    module: "Commercial",
    project: "CPWD Convention Centre",
    desc: "EOT Claim: 180-day extension filed due to COVID + design changes",
    before: "No Claim",
    after: "Claim ₹47Cr",
    severity: "high",
  },
  {
    id: 8,
    timestamp: new Date("2024-03-13T10:05:00"),
    user: "System Auto",
    action: "Risk Flag",
    module: "Procurement",
    project: "Pune Smart City",
    desc: "Bid rigging detected: 4 vendors with identical IP addresses",
    before: "Open Bid",
    after: "CCI Referred",
    severity: "critical",
  },
  {
    id: 9,
    timestamp: new Date("2024-03-12T17:33:00"),
    user: "Naman Maheshwari",
    action: "Document Upload",
    module: "Analysis",
    project: "NIP Annual Review",
    desc: "BOQ analysis upload: ₹2,847Cr deviation identified in energy sector",
    before: "Draft",
    after: "Submitted",
    severity: "info",
  },
  {
    id: 10,
    timestamp: new Date("2024-03-12T14:20:00"),
    user: "System Auto",
    action: "Delay Flagged",
    module: "Execution",
    project: "NTPC Leh Solar",
    desc: "Grid connectivity delay — PGCIL interconnection pending 89 days",
    before: "On Track",
    after: "Delayed 89d",
    severity: "high",
  },
  {
    id: 11,
    timestamp: new Date("2024-03-12T11:45:00"),
    user: "Ministry Official",
    action: "Approval Granted",
    module: "Procurement",
    project: "Smart Cities SPV",
    desc: "GeM procurement tender approved — ₹340Cr infrastructure materials",
    before: "Draft",
    after: "Published",
    severity: "info",
  },
  {
    id: 12,
    timestamp: new Date("2024-03-11T16:08:00"),
    user: "Naman Maheshwari",
    action: "Export",
    module: "Analysis",
    project: "NIP Q4 Report",
    desc: "Full infrastructure intelligence report exported — 847 data points",
    before: "Draft",
    after: "Exported PDF",
    severity: "info",
  },
  {
    id: 13,
    timestamp: new Date("2024-03-11T13:55:00"),
    user: "System Auto",
    action: "Risk Flag",
    module: "Governance",
    project: "Multiple States",
    desc: "SLA breach: 23 approvals pending >45 days in UP and Maharashtra",
    before: "In Review",
    after: "SLA Breach",
    severity: "critical",
  },
  {
    id: 14,
    timestamp: new Date("2024-03-11T10:30:00"),
    user: "Naman Maheshwari",
    action: "Milestone Added",
    module: "Execution",
    project: "RVNL Dedicated Freight",
    desc: "Track laying milestone: Km 340-380 completed ahead of schedule",
    before: "71%",
    after: "74%",
    severity: "info",
  },
  {
    id: 15,
    timestamp: new Date("2024-03-10T15:22:00"),
    user: "System Auto",
    action: "Risk Flag",
    module: "Commercial",
    project: "L&T Hyderabad Metro",
    desc: "Arbitration risk escalated: dispute value ₹1,840Cr — ICJ filing likely",
    before: "Negotiation",
    after: "Arbitration",
    severity: "critical",
  },
  {
    id: 16,
    timestamp: new Date("2024-03-10T12:40:00"),
    user: "Ministry Official",
    action: "Approval Granted",
    module: "Governance",
    project: "PGCIL Transmission",
    desc: "Environmental clearance for 400kV Rajasthan corridor",
    before: "Pending EC",
    after: "EC Granted",
    severity: "info",
  },
  {
    id: 17,
    timestamp: new Date("2024-03-10T09:15:00"),
    user: "Naman Maheshwari",
    action: "Claim Filed",
    module: "Commercial",
    project: "Afcons Undersea Tunnel",
    desc: "EOT Claim ₹280Cr: geological surprises + monsoon delays cited",
    before: "No Claim",
    after: "Claim Filed",
    severity: "high",
  },
  {
    id: 18,
    timestamp: new Date("2024-03-09T16:50:00"),
    user: "System Auto",
    action: "Delay Flagged",
    module: "Execution",
    project: "Bangalore Metro Phase 3",
    desc: "Utility relocation incomplete — BESCOM coordination failure 67 days",
    before: "On Track",
    after: "Delayed 67d",
    severity: "high",
  },
  {
    id: 19,
    timestamp: new Date("2024-03-09T14:10:00"),
    user: "System Auto",
    action: "Risk Flag",
    module: "Procurement",
    project: "AAI Terminal 3 Expansion",
    desc: "Vendor financial stress: D/E ratio 4.2x — contract performance risk HIGH",
    before: "Active",
    after: "Watch List",
    severity: "high",
  },
  {
    id: 20,
    timestamp: new Date("2024-03-09T11:05:00"),
    user: "Naman Maheshwari",
    action: "Document Upload",
    module: "Procurement",
    project: "NHAI BOQ Review",
    desc: "DPR updated with revised alignment — ₹340Cr scope change",
    before: "v1.2",
    after: "v2.0",
    severity: "info",
  },
  {
    id: 21,
    timestamp: new Date("2024-03-08T17:30:00"),
    user: "Ministry Official",
    action: "Approval Granted",
    module: "Governance",
    project: "Smart Cities Lucknow",
    desc: "₹200Cr municipal bond issuance approved for water supply",
    before: "Pending Finance",
    after: "Bond Approved",
    severity: "info",
  },
  {
    id: 22,
    timestamp: new Date("2024-03-08T14:45:00"),
    user: "System Auto",
    action: "Risk Flag",
    module: "Commercial",
    project: "IRCON Chennai Metro",
    desc: "Billing milestone front-loading 2.8x detected in RA Bill #12",
    before: "Normal",
    after: "Under Review",
    severity: "high",
  },
  {
    id: 23,
    timestamp: new Date("2024-03-08T10:20:00"),
    user: "Naman Maheshwari",
    action: "Export",
    module: "Analysis",
    project: "Audit Log Q1-2024",
    desc: "Procurement audit log exported — 312 tender entries, 47 risk flags",
    before: "System Log",
    after: "Exported CSV",
    severity: "info",
  },
  {
    id: 24,
    timestamp: new Date("2024-03-07T16:15:00"),
    user: "System Auto",
    action: "Delay Flagged",
    module: "Execution",
    project: "RVNL Vande Bharat",
    desc: "Manufacturing delay at ICF — 34 train sets behind schedule 90 days",
    before: "52%",
    after: "Delayed 90d",
    severity: "critical",
  },
  {
    id: 25,
    timestamp: new Date("2024-03-07T13:30:00"),
    user: "Naman Maheshwari",
    action: "Milestone Added",
    module: "Execution",
    project: "GAIL Pipeline Phase 2",
    desc: "Compressor station commissioning milestone added for Rajasthan leg",
    before: "83%",
    after: "86%",
    severity: "info",
  },
];

// Approval chain for RVNL Bullet Train project
const APPROVAL_CHAIN = [
  {
    stage: "Initiated",
    approver: "Naman Maheshwari",
    date: "2024-03-10",
    status: "Completed",
    note: "Forest clearance application submitted",
  },
  {
    stage: "Technical Review",
    approver: "Chief Engineer, RVNL",
    date: "2024-03-11",
    status: "Completed",
    note: "DPR and alignment verified",
  },
  {
    stage: "Financial Review",
    approver: "CFO, Railway Ministry",
    date: "2024-03-12",
    status: "Completed",
    note: "Budget allocation confirmed ₹1,240 Cr",
  },
  {
    stage: "Legal Clearance",
    approver: "MoEF Legal Division",
    date: "2024-03-13",
    status: "Completed",
    note: "Forest Act compliance checked",
  },
  {
    stage: "Ministry Approval",
    approver: "Joint Secretary, MoEF",
    date: "2024-03-14",
    status: "In Progress",
    note: "Under final review",
  },
  {
    stage: "Executed",
    approver: "Secretary, Railway Ministry",
    date: "2024-03-15",
    status: "Pending",
    note: "Awaiting execution",
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

// ── Helpers ───────────────────────────────────────────────────────────────
function formatTs(d: Date): string {
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; bg: string; text: string; dot: string }
> = {
  critical: {
    label: "Critical",
    bg: "rgba(255,61,0,0.12)",
    text: "#FF3D00",
    dot: "#FF3D00",
  },
  high: {
    label: "High",
    bg: "rgba(255,109,0,0.12)",
    text: "#FF6D00",
    dot: "#FF6D00",
  },
  info: {
    label: "Info",
    bg: "rgba(0,212,255,0.08)",
    text: "#00D4FF",
    dot: "#00D4FF",
  },
};

const ACTION_COLORS: Record<string, string> = {
  "Milestone Added": "#00E676",
  "Delay Flagged": "#FF6D00",
  "Risk Flag": "#FF3D00",
  "Approval Granted": "#00D4FF",
  "Claim Filed": "#C084FC",
  "Document Upload": "#64B5F6",
  Export: "#FFD740",
};

const ACTION_TYPES = [
  "All",
  "Milestone Added",
  "Delay Flagged",
  "Claim Filed",
  "Approval Granted",
  "Document Upload",
  "Risk Flag",
  "Export",
];
const DATE_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "All Time"];
const USERS = [
  "All Users",
  "Naman Maheshwari",
  "System Auto",
  "Ministry Official",
];
const MODULES = [
  "All",
  "Procurement",
  "Execution",
  "Commercial",
  "Governance",
  "Assets",
  "Analysis",
];
const SEVERITIES = ["All", "Critical", "High", "Info"];
const PAGE_SIZE = 10;

function downloadCSV(entries: AuditEntry[]) {
  const headers = [
    "Timestamp",
    "User",
    "Action Type",
    "Module",
    "Project",
    "Description",
    "Before State",
    "After State",
    "Severity",
  ];
  const rows = entries.map((e) => [
    formatTs(e.timestamp),
    e.user,
    e.action,
    e.module,
    e.project,
    `"${e.desc.replace(/"/g, '""')}"`,
    `"${e.before.replace(/"/g, '""')}"`,
    `"${e.after.replace(/"/g, '""')}"`,
    e.severity,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `InfraOS-Audit-Trail-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex items-start gap-3"
      style={{
        background: "rgba(0,212,255,0.03)",
        border: "1px solid rgba(0,212,255,0.1)",
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p
          className="text-xl font-bold text-white leading-tight"
          style={{ color }}
        >
          {value}
        </p>
        <p className="text-xs font-semibold text-white mt-0.5">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  options,
  onChange,
  dataOcid,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  dataOcid: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-ocid={dataOcid}
      className="px-2.5 py-1.5 rounded text-xs text-white outline-none cursor-pointer transition-all"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(0,212,255,0.15)",
        minWidth: "130px",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o} style={{ background: "#0D1117" }}>
          {o}
        </option>
      ))}
    </select>
  );
}

function AuditRow({ entry, idx }: { entry: AuditEntry; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_CONFIG[entry.severity];
  const actionColor = ACTION_COLORS[entry.action] ?? "#aaa";

  return (
    <div className="border-b" style={{ borderColor: "rgba(0,212,255,0.06)" }}>
      <button
        type="button"
        className="w-full grid gap-2 px-4 py-3.5 hover:bg-white/[0.02] transition-colors items-start text-left"
        style={{ gridTemplateColumns: "140px 130px 120px 100px 1fr 70px 24px" }}
        onClick={() => setExpanded((p) => !p)}
        data-ocid={`audit_trail.item.${idx + 1}`}
      >
        <div className="min-w-0">
          <p className="text-[10px] text-white font-medium leading-tight">
            {formatTs(entry.timestamp)}
          </p>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
              style={{
                background:
                  entry.user === "System Auto"
                    ? "rgba(200,200,200,0.1)"
                    : "rgba(0,212,255,0.1)",
                color: entry.user === "System Auto" ? "#999" : "#00D4FF",
              }}
            >
              {entry.user === "System Auto"
                ? "SYS"
                : entry.user === "Naman Maheshwari"
                  ? "NM"
                  : "MO"}
            </div>
            <span className="text-[10px] text-white truncate">
              {entry.user}
            </span>
          </div>
        </div>
        <div className="min-w-0">
          <span
            className="text-[10px] font-semibold"
            style={{ color: actionColor }}
          >
            {entry.action}
          </span>
        </div>
        <div className="min-w-0">
          <span
            className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
            style={{
              background: "rgba(0,212,255,0.06)",
              color: "rgba(0,212,255,0.8)",
              border: "1px solid rgba(0,212,255,0.12)",
            }}
          >
            {entry.module}
          </span>
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-[11px] font-semibold text-white truncate">
            {entry.project}
          </p>
          <p className="text-[10px] text-muted-foreground line-clamp-1">
            {entry.desc}
          </p>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.05)", color: "#888" }}
            >
              {entry.before}
            </span>
            <span className="text-[9px] text-muted-foreground">→</span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: "rgba(0,230,118,0.08)", color: "#00E676" }}
            >
              {entry.after}
            </span>
          </div>
        </div>
        <div className="min-w-0">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
            style={{ background: sev.bg, color: sev.text }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: sev.dot }}
            />
            {sev.label}
          </span>
        </div>
        <div className="flex items-center justify-center">
          {expanded ? (
            <ChevronUp size={12} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={12} className="text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div
          className="px-4 pb-4"
          style={{ background: "rgba(0,212,255,0.02)" }}
        >
          <div
            className="rounded-lg p-4 space-y-3"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(0,212,255,0.1)",
            }}
          >
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground text-[10px] mb-0.5">
                  Full Description
                </p>
                <p className="text-white leading-relaxed">{entry.desc}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] mb-0.5">
                  Action by
                </p>
                <p className="text-white font-semibold">{entry.user}</p>
                <p className="text-muted-foreground text-[10px] mt-1">
                  {formatTs(entry.timestamp)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div
                className="p-2 rounded"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-muted-foreground text-[10px] mb-1">
                  Before State
                </p>
                <p className="text-white font-mono">{entry.before}</p>
              </div>
              <div
                className="p-2 rounded"
                style={{
                  background: "rgba(0,230,118,0.05)",
                  border: "1px solid rgba(0,230,118,0.15)",
                }}
              >
                <p className="text-muted-foreground text-[10px] mb-1">
                  After State
                </p>
                <p
                  className="font-mono font-semibold"
                  style={{ color: "#00E676" }}
                >
                  {entry.after}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-semibold"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  color: "#00D4FF",
                }}
                data-ocid={`audit_trail.view_project.${idx + 1}`}
              >
                <ExternalLink size={10} /> View Project
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-semibold"
                style={{
                  background: "rgba(255,61,0,0.08)",
                  border: "1px solid rgba(255,61,0,0.2)",
                  color: "#FF6B6B",
                }}
                data-ocid={`audit_trail.flag_review.${idx + 1}`}
              >
                <Flag size={10} /> Flag for Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Approval Chain ───────────────────────────────────────────────────────────────
function ApprovalChainSection() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(0,212,255,0.12)" }}
      data-ocid="audit_trail.approval_chain"
    >
      <div
        className="px-5 py-4 flex items-center gap-2 border-b border-white/5"
        style={{ background: "rgba(0,212,255,0.04)" }}
      >
        <Shield size={16} style={{ color: "#00D4FF" }} />
        <div>
          <h2 className="font-bold text-sm text-white">
            Approval Chain Visualization
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            RVNL Bullet Train — Forest Clearance · 6-Stage Approval Pipeline
          </p>
        </div>
      </div>
      <div className="p-5">
        <div className="relative">
          {/* Connector line */}
          <div
            className="absolute left-4 top-6 bottom-6 w-0.5"
            style={{ background: "rgba(0,212,255,0.15)" }}
          />
          <div className="space-y-4">
            {APPROVAL_CHAIN.map((step, i) => (
              <div
                key={step.stage}
                className="flex items-start gap-4 pl-0"
                data-ocid={`audit_trail.approval_step.${i + 1}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 font-bold text-xs ${
                    step.status === "Completed"
                      ? ""
                      : step.status === "In Progress"
                        ? ""
                        : ""
                  }`}
                  style={{
                    background:
                      step.status === "Completed"
                        ? "rgba(0,230,118,0.15)"
                        : step.status === "In Progress"
                          ? "rgba(0,212,255,0.15)"
                          : "rgba(255,255,255,0.05)",
                    border: `2px solid ${step.status === "Completed" ? "rgba(0,230,118,0.4)" : step.status === "In Progress" ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.12)"}`,
                    color:
                      step.status === "Completed"
                        ? "#00E676"
                        : step.status === "In Progress"
                          ? "#00D4FF"
                          : "rgba(176,190,197,0.5)",
                  }}
                >
                  {step.status === "Completed" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    i + 1
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-sm text-white">
                        {step.stage}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {step.approver}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {step.date}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${
                          step.status === "Completed"
                            ? "badge-success"
                            : step.status === "In Progress"
                              ? "badge-low"
                              : ""
                        }`}
                        style={
                          step.status === "Pending"
                            ? {
                                background: "rgba(255,255,255,0.06)",
                                color: "rgba(176,190,197,0.5)",
                              }
                            : {}
                        }
                      >
                        {step.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {step.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AuditTrailPage() {
  const [actionFilter, setActionFilter] = useState("All");
  const [dateRange, setDateRange] = useState("All Time");
  const [userFilter, setUserFilter] = useState("All Users");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const cutoffMap: Record<string, number> = {
      "Last 7 days": 7 * 86_400_000,
      "Last 30 days": 30 * 86_400_000,
      "Last 90 days": 90 * 86_400_000,
    };
    const cutoff = cutoffMap[dateRange] ? Date.now() - cutoffMap[dateRange] : 0;
    return AUDIT_ENTRIES.filter((e) => {
      if (cutoff && e.timestamp.getTime() < cutoff) return false;
      if (actionFilter !== "All" && e.action !== actionFilter) return false;
      if (userFilter !== "All Users" && e.user !== userFilter) return false;
      if (moduleFilter !== "All" && e.module !== moduleFilter) return false;
      if (
        severityFilter !== "All" &&
        e.severity !== severityFilter.toLowerCase()
      )
        return false;
      if (
        search &&
        !e.project.toLowerCase().includes(search.toLowerCase()) &&
        !e.desc.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [
    actionFilter,
    dateRange,
    userFilter,
    moduleFilter,
    severityFilter,
    search,
  ]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const criticalCount = filtered.filter(
    (e) => e.severity === "critical",
  ).length;
  const approvalCount = filtered.filter(
    (e) => e.action === "Approval Granted",
  ).length;
  const flagCount = filtered.filter(
    (e) => e.action === "Risk Flag" || e.action === "Delay Flagged",
  ).length;

  return (
    <div className="p-6 space-y-6" data-ocid="audit_trail.page">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Home size={11} />
        <ChevronRight size={10} />
        <span style={{ color: "#00D4FF" }} className="font-medium">
          Audit Intelligence Dashboard
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            <ClipboardList size={20} style={{ color: "#00D4FF" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Audit Intelligence Dashboard
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Complete timestamped record of all platform actions and decisions
            </p>
          </div>
        </div>
        <button
          type="button"
          data-ocid="audit_trail.export_button"
          onClick={() => downloadCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "rgba(0,212,255,0.1)",
            border: "1px solid rgba(0,212,255,0.3)",
            color: "#00D4FF",
          }}
        >
          <Download size={14} /> Export Audit Log ({filtered.length})
        </button>
      </div>

      {/* Summary Stats */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="audit_trail.stats"
      >
        <StatCard
          icon={<Activity size={16} />}
          label="Total Actions"
          value="1,247"
          sub="all time"
          color="#00D4FF"
        />
        <StatCard
          icon={<AlertTriangle size={16} />}
          label="Critical Events"
          value={criticalCount.toString()}
          sub="requires review"
          color="#FF3D00"
        />
        <StatCard
          icon={<CheckCircle2 size={16} />}
          label="Approvals Granted"
          value={approvalCount.toString()}
          sub="in filtered view"
          color="#00E676"
        />
        <StatCard
          icon={<Flag size={16} />}
          label="Risk Flags"
          value={flagCount.toString()}
          sub="in filtered view"
          color="#FF6D00"
        />
      </div>

      {/* Filters */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{
          background: "rgba(0,212,255,0.03)",
          border: "1px solid rgba(0,212,255,0.1)",
        }}
        data-ocid="audit_trail.filters"
      >
        <div className="flex items-center gap-2 mb-1">
          <Filter size={13} style={{ color: "#00D4FF" }} />
          <span className="text-xs font-semibold text-white">Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Action Type
            </span>
            <FilterSelect
              value={actionFilter}
              options={ACTION_TYPES}
              onChange={(v) => {
                setActionFilter(v);
                setPage(1);
              }}
              dataOcid="audit_trail.filter.action_type"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Date Range
            </span>
            <FilterSelect
              value={dateRange}
              options={DATE_RANGES}
              onChange={(v) => {
                setDateRange(v);
                setPage(1);
              }}
              dataOcid="audit_trail.filter.date_range"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              User
            </span>
            <FilterSelect
              value={userFilter}
              options={USERS}
              onChange={(v) => {
                setUserFilter(v);
                setPage(1);
              }}
              dataOcid="audit_trail.filter.user"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Module
            </span>
            <FilterSelect
              value={moduleFilter}
              options={MODULES}
              onChange={(v) => {
                setModuleFilter(v);
                setPage(1);
              }}
              dataOcid="audit_trail.filter.module"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Severity
            </span>
            <FilterSelect
              value={severityFilter}
              options={SEVERITIES}
              onChange={(v) => {
                setSeverityFilter(v);
                setPage(1);
              }}
              dataOcid="audit_trail.filter.severity"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Search Project
            </span>
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Project name or description..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                data-ocid="audit_trail.search_input"
                className="pl-8 pr-3 py-1.5 rounded text-xs text-white placeholder:text-muted-foreground outline-none w-full"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(0,212,255,0.15)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(0,212,255,0.1)" }}
        data-ocid="audit_trail.table"
      >
        {/* Header */}
        <div
          className="grid gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          style={{
            background: "rgba(0,212,255,0.05)",
            borderBottom: "1px solid rgba(0,212,255,0.1)",
            gridTemplateColumns: "140px 130px 120px 100px 1fr 70px 24px",
          }}
        >
          <span>Timestamp</span>
          <span>User</span>
          <span>Action</span>
          <span>Module</span>
          <span>Project / Description</span>
          <span>Severity</span>
          <span />
        </div>

        {/* Rows */}
        <div>
          {filtered.length === 0 && (
            <div
              className="px-6 py-12 text-center text-muted-foreground text-sm"
              data-ocid="audit_trail.empty_state"
            >
              No audit entries match the current filters.
            </div>
          )}
          {paginated.map((entry, idx) => (
            <AuditRow
              key={entry.id}
              entry={entry}
              idx={(page - 1) * PAGE_SIZE + idx}
            />
          ))}
        </div>

        {/* Pagination + Footer */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            background: "rgba(0,212,255,0.03)",
            borderTop: "1px solid rgba(0,212,255,0.08)",
          }}
        >
          <span className="text-[10px] text-muted-foreground">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
            entries
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-[10px] px-2.5 py-1 rounded font-semibold disabled:opacity-30 transition-all"
              style={{
                background: "rgba(0,212,255,0.08)",
                color: "#00D4FF",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
              data-ocid="audit_trail.pagination_prev"
            >
              Previous
            </button>
            <span className="text-[10px] text-muted-foreground">
              {page} / {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-[10px] px-2.5 py-1 rounded font-semibold disabled:opacity-30 transition-all"
              style={{
                background: "rgba(0,212,255,0.08)",
                color: "#00D4FF",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
              data-ocid="audit_trail.pagination_next"
            >
              Next
            </button>
            <button
              type="button"
              onClick={() => downloadCSV(filtered)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-semibold"
              style={{
                background: "rgba(0,212,255,0.08)",
                color: "#00D4FF",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
              data-ocid="audit_trail.export_button_footer"
            >
              <Download size={11} /> Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* Approval Chain Visualization */}
      <ApprovalChainSection />

      {/* CAG Findings */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,61,0,0.2)" }}
        data-ocid="audit_trail.cag_panel"
      >
        <div
          className="px-5 py-4 flex items-center gap-2 border-b border-white/5"
          style={{ background: "rgba(255,61,0,0.04)" }}
        >
          <AlertTriangle size={16} style={{ color: "#FF8C42" }} />
          <h2 className="font-bold text-sm text-white">CAG Audit Findings</h2>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              {["Report No.", "Finding", "Amount", "Status"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-muted-foreground font-medium"
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
                data-ocid={`audit_trail.cag_finding.${i + 1}`}
              >
                <td className="px-5 py-3 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                  {f.report}
                </td>
                <td className="px-5 py-3 text-white">{f.finding}</td>
                <td
                  className="px-5 py-3 font-mono font-bold whitespace-nowrap"
                  style={{ color: "#FF8C42" }}
                >
                  {f.amount}
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
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
