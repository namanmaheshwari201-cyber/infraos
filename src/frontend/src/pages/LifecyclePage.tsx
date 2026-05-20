import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  GitBranch,
  Package,
  Shield,
  TrendingUp,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useOrg } from "../context/OrgContext";
import { getOrgData } from "../data/orgData";

// ── Deep Dive Data ───────────────────────────────────────────────────────────
interface RiskItem {
  name: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  exposure: string;
  action: string;
}
interface KPIItem {
  label: string;
  value: number;
  unit: string;
  target: number;
}
interface DeepDiveData {
  risks: RiskItem[];
  kpis: KPIItem[];
  aiInsight: string;
}

const DEEP_DIVE: Record<StageName, DeepDiveData> = {
  tender: {
    risks: [
      {
        name: "Bid Rigging Detection",
        severity: "HIGH",
        exposure: "₹1,840 Cr",
        action: "Refer to CVC for investigation, suspend tender process",
      },
      {
        name: "BOQ Inflation Forensics",
        severity: "HIGH",
        exposure: "₹620 Cr",
        action: "Cross-validate against MoRTH Schedule of Rates 2024",
      },
      {
        name: "L1 Anomaly Alert",
        severity: "MEDIUM",
        exposure: "₹340 Cr",
        action: "Flag L1-L2 spread < 0.5% for manual scrutiny",
      },
      {
        name: "Specification Manipulation",
        severity: "MEDIUM",
        exposure: "₹180 Cr",
        action: "Compare specs against NIC database of past tenders",
      },
      {
        name: "Capacity Mismatch",
        severity: "LOW",
        exposure: "₹90 Cr",
        action: "Verify contractor financials against NHAI norms",
      },
    ],
    kpis: [
      { label: "Tenders Issued", value: 89, unit: "", target: 100 },
      { label: "BOQ Variance", value: 18, unit: "%", target: 10 },
      { label: "Fraud Score > 70", value: 12, unit: "", target: 0 },
      { label: "Avg Clause Risk", value: 64, unit: "/100", target: 30 },
    ],
    aiInsight:
      "23% of tenders in the current quarter exhibit abnormal bidding concentration — L1 bidders from the same consortium account for 11 of 89 tenders. NIP corridors in UP and Rajasthan show highest fraud probability. InfraOS recommends mandatory CVC pre-bid scrutiny for all tenders above ₹500 Cr.",
  },
  bid: {
    risks: [
      {
        name: "Cartel Formation Risk",
        severity: "HIGH",
        exposure: "₹2,100 Cr",
        action: "Submit dossier to CCI; trigger independent price audit",
      },
      {
        name: "Front-loading Detection",
        severity: "HIGH",
        exposure: "₹780 Cr",
        action: "Rebalance BOQ payment schedule before award",
      },
      {
        name: "Eligibility Mismatch",
        severity: "MEDIUM",
        exposure: "₹310 Cr",
        action: "Cross-check credentials against NHAI vendor registry",
      },
      {
        name: "Forged Bank Guarantee",
        severity: "MEDIUM",
        exposure: "₹220 Cr",
        action: "Mandatory bank verification for all BGs above ₹50 Cr",
      },
      {
        name: "Technical Disqualification Risk",
        severity: "LOW",
        exposure: "₹140 Cr",
        action: "Pre-qualification committee re-evaluation",
      },
    ],
    kpis: [
      { label: "Active Evaluations", value: 54, unit: "", target: 54 },
      { label: "L1 Anomaly Rate", value: 13, unit: "%", target: 5 },
      { label: "Avg Bidder Count", value: 4, unit: "", target: 6 },
      { label: "Disqualified Bids", value: 18, unit: "", target: 0 },
    ],
    aiInsight:
      "4 bid packages show coordinated pricing with L1-L2 spread under 0.5%, a strong cartel signal. NHAI highway packages in Punjab and Haryana have attracted below-market bids linked to contractors with active CBI investigations. Immediate referral to Competition Commission of India is recommended for 2 priority packages.",
  },
  award: {
    risks: [
      {
        name: "Clause Ambiguity",
        severity: "HIGH",
        exposure: "₹1,420 Cr",
        action: "Issue contract addendum clarifying LD and force majeure terms",
      },
      {
        name: "Force Majeure Gap",
        severity: "HIGH",
        exposure: "₹890 Cr",
        action: "Insert pandemic/climate event coverage clauses",
      },
      {
        name: "Liability Cap Insufficiency",
        severity: "MEDIUM",
        exposure: "₹560 Cr",
        action:
          "Renegotiate liability ceiling to minimum 10% of contract value",
      },
      {
        name: "Payment Milestone Ambiguity",
        severity: "MEDIUM",
        exposure: "₹240 Cr",
        action: "Redefine milestone payment triggers with measurable criteria",
      },
      {
        name: "Sub-Contractor Risk",
        severity: "LOW",
        exposure: "₹130 Cr",
        action: "Mandate pre-approval of all sub-contractors above ₹20 Cr",
      },
    ],
    kpis: [
      { label: "Contracts Awarded", value: 31, unit: "", target: 31 },
      { label: "Clause Alerts", value: 43, unit: "", target: 0 },
      { label: "Avg Contract Size", value: 2340, unit: " Cr", target: 2000 },
      { label: "Under Protest", value: 3, unit: "", target: 0 },
    ],
    aiInsight:
      "11 awarded contracts contain ambiguous LD (Liquidated Damages) clauses that are likely to be challenged in arbitration, representing ₹1,420 Cr in dispute exposure. Force majeure provisions in 8 contracts pre-date 2020 and do not account for climate-related delays — a critical gap as 60% of execution is monsoon-season-sensitive.",
  },
  execution: {
    risks: [
      {
        name: "Land Acquisition Delay",
        severity: "HIGH",
        exposure: "₹3,240 Cr",
        action: "Escalate to state revenue authority; invoke urgency clause",
      },
      {
        name: "Environmental Clearance",
        severity: "HIGH",
        exposure: "₹1,680 Cr",
        action: "Fast-track MoEFCC application for 7 stalled corridors",
      },
      {
        name: "Utility Shift Bottleneck",
        severity: "MEDIUM",
        exposure: "₹920 Cr",
        action: "Coordinate with BSNL, PGCIL for parallel utility relocation",
      },
      {
        name: "Milestone Slippage",
        severity: "MEDIUM",
        exposure: "₹840 Cr",
        action: "Invoke acceleration clause; deploy additional equipment",
      },
      {
        name: "Resource Underutilization",
        severity: "LOW",
        exposure: "₹380 Cr",
        action: "Productivity audit on sites below 60% equipment utilization",
      },
    ],
    kpis: [
      { label: "Avg Completion", value: 58, unit: "%", target: 75 },
      { label: "On Schedule", value: 62, unit: "%", target: 85 },
      { label: "Critical Delays", value: 23, unit: "", target: 0 },
      { label: "Permit Blocks", value: 34, unit: "", target: 0 },
    ],
    aiInsight:
      "Land acquisition remains the single largest execution blocker, affecting 31% of active highway projects and causing an average delay of 14 months per corridor. Seven NH projects on critical path show compounding delays — environmental clearances and utility shifts are co-occurring in 4 of them. InfraOS projects ₹840 Cr in cumulative LD penalty exposure if acceleration measures are not deployed within 60 days.",
  },
  monitoring: {
    risks: [
      {
        name: "Milestone Slippage",
        severity: "HIGH",
        exposure: "₹1,120 Cr",
        action: "Issue show-cause to contractor; trigger IE joint inspection",
      },
      {
        name: "Quality Deviation",
        severity: "HIGH",
        exposure: "₹680 Cr",
        action: "Halt payment until third-party quality audit completed",
      },
      {
        name: "Resource Underutilization",
        severity: "MEDIUM",
        exposure: "₹440 Cr",
        action: "Deploy site productivity monitoring through drone surveys",
      },
      {
        name: "Reporting Inconsistency",
        severity: "MEDIUM",
        exposure: "₹290 Cr",
        action: "Cross-validate physical progress against satellite imagery",
      },
      {
        name: "IE Certificate Delay",
        severity: "LOW",
        exposure: "₹160 Cr",
        action: "Expedite Independent Engineer review schedule",
      },
    ],
    kpis: [
      { label: "On-Track Projects", value: 78, unit: "%", target: 90 },
      { label: "KPI Breaches", value: 17, unit: "", target: 0 },
      { label: "Quality Flags", value: 9, unit: "", target: 0 },
      { label: "Reporting Accuracy", value: 82, unit: "%", target: 98 },
    ],
    aiInsight:
      "17 projects show a >15% variance between physically reported progress and satellite-verified site progress — a strong indicator of milestone gaming. InfraOS's cross-validation engine has flagged 3 highway projects in Bihar and 2 bridge projects in Odisha for immediate third-party verification. Quality deviation in concrete mix has been detected in 9 projects through material test report analysis.",
  },
  claims: {
    risks: [
      {
        name: "EOT Fraud Risk",
        severity: "HIGH",
        exposure: "₹2,840 Cr",
        action:
          "Conduct forensic timeline audit; reject EOT without documented evidence",
      },
      {
        name: "Arbitration Exposure",
        severity: "HIGH",
        exposure: "₹1,940 Cr",
        action: "Engage DIAC/NCAER arbitrators preemptively to reduce timeline",
      },
      {
        name: "Front-loaded Billing",
        severity: "HIGH",
        exposure: "₹1,120 Cr",
        action: "Withhold final milestone payment pending BOQ reconciliation",
      },
      {
        name: "Variation Order Inflation",
        severity: "MEDIUM",
        exposure: "₹680 Cr",
        action:
          "Cap variation orders at 15% of original contract value per FIDIC",
      },
      {
        name: "Defect Liability Dispute",
        severity: "LOW",
        exposure: "₹340 Cr",
        action: "Issue formal defect notice with 28-day cure period",
      },
    ],
    kpis: [
      { label: "Active Claims", value: 67, unit: "", target: 0 },
      { label: "Arbitration Risk", value: 14, unit: "", target: 0 },
      { label: "Avg Claim Age", value: 18, unit: " months", target: 6 },
      { label: "Settlement Rate", value: 29, unit: "%", target: 70 },
    ],
    aiInsight:
      "EOT claim exposure stands at ₹2,840 Cr across 67 active claims, with 14 cases showing arbitration likelihood above 70% based on InfraOS dispute pattern analysis. Front-loaded billing patterns have been detected in 8 claims — contractors have already received 78% payment against 54% certified completion. Immediate forensic BOQ reconciliation is recommended to prevent ₹1,120 Cr in unjustified outflows.",
  },
  maintenance: {
    risks: [
      {
        name: "Asset Degradation",
        severity: "HIGH",
        exposure: "12 bridges critical",
        action:
          "Emergency structural inspection within 14 days; restrict heavy loads",
      },
      {
        name: "Sensor Data Gap",
        severity: "HIGH",
        exposure: "47 sensors offline",
        action: "Restore IoT connectivity; deploy mobile monitoring teams",
      },
      {
        name: "Inspection Backlog",
        severity: "MEDIUM",
        exposure: "89 assets overdue",
        action: "Commission third-party inspection agency for bulk audit",
      },
      {
        name: "Deferred Maintenance",
        severity: "MEDIUM",
        exposure: "₹1,240 Cr",
        action: "Prioritize repair queue by health score and traffic volume",
      },
      {
        name: "O&M Contract Lapse",
        severity: "LOW",
        exposure: "23 assets",
        action: "Issue emergency procurement for O&M service extension",
      },
    ],
    kpis: [
      { label: "Assets Monitored", value: 338, unit: "", target: 338 },
      { label: "Avg Health Score", value: 71, unit: "/100", target: 85 },
      { label: "Emergency Flags", value: 12, unit: "", target: 0 },
      { label: "Inspection Rate", value: 64, unit: "%", target: 95 },
    ],
    aiInsight:
      "89 assets are showing accelerated degradation scores — 12 bridges in Maharashtra and Telangana have been flagged for emergency structural inspection, with load restrictions recommended immediately. 47 IoT sensors across highway corridors are reporting offline, creating critical monitoring blind spots on NH-44 and NH-48. InfraOS recommends deploying mobile inspection units to all 12 emergency-flagged bridges within the next two weeks.",
  },
};

// ── Types ────────────────────────────────────────────────────────────────────
type StageName =
  | "tender"
  | "bid"
  | "award"
  | "execution"
  | "monitoring"
  | "claims"
  | "maintenance";

interface Stage {
  id: StageName;
  name: string;
  count: number;
  icon: React.ElementType;
  risks: string[];
  dependencies: string[];
  aiInsight: string;
  stats: { label: string; value: string; color?: string }[];
}

interface LifecycleProject {
  id: number;
  name: string;
  type: string;
  state: string;
  value: string;
  stage: StageName;
  completion: number;
  riskScore: number;
  timeline: Record<StageName, "done" | "active" | "at-risk" | "pending">;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const STAGES: Stage[] = [
  {
    id: "tender",
    name: "TENDER",
    count: 89,
    icon: FileText,
    risks: ["BOQ inflation", "Spec manipulation", "Capacity mismatch"],
    dependencies: [
      "Ministry approval",
      "Land acquisition >60%",
      "DPR sign-off",
    ],
    aiInsight:
      "23% of tenders show abnormal bidding patterns this quarter. Flagged 3 for manual review.",
    stats: [
      { label: "Active Tenders", value: "89", color: "#00D4FF" },
      { label: "Flagged Clauses", value: "234", color: "#FF3D00" },
      { label: "Avg BOQ Variance", value: "18.4%", color: "#FFB300" },
      { label: "Fraud Score >70", value: "12", color: "#FF6B35" },
    ],
  },
  {
    id: "bid",
    name: "BID",
    count: 54,
    icon: Package,
    risks: ["L1 cartel formation", "Lowball bidding", "Forged credentials"],
    dependencies: [
      "Tender document finalized",
      "Bid bond verified",
      "Technical eligibility cleared",
    ],
    aiInsight:
      "4 bid clusters show coordinated pricing patterns — L1-L2 spread < 0.5% in 3 packages.",
    stats: [
      { label: "Active Evaluations", value: "54", color: "#00D4FF" },
      { label: "L1 Anomalies", value: "7", color: "#FF3D00" },
      { label: "Avg Bidders", value: "4.2", color: "#00E676" },
      { label: "Disqualified Bids", value: "18", color: "#FFB300" },
    ],
  },
  {
    id: "award",
    name: "AWARD",
    count: 31,
    icon: Shield,
    risks: [
      "Clause risk post-award",
      "Contractual ambiguity",
      "Milestone under-definition",
    ],
    dependencies: [
      "L1 evaluation completed",
      "Financial bid opened",
      "Approval committee clearance",
    ],
    aiInsight:
      "11 awarded contracts have ambiguous LD clauses — disputes likely in arbitration phase.",
    stats: [
      { label: "Recently Awarded", value: "31", color: "#00D4FF" },
      { label: "Clause Alerts", value: "43", color: "#FF3D00" },
      { label: "Avg Contract Size", value: "₹2,340 Cr", color: "#00E676" },
      { label: "Under Protest", value: "3", color: "#FFB300" },
    ],
  },
  {
    id: "execution",
    name: "EXECUTION",
    count: 156,
    icon: Zap,
    risks: ["Milestone slippage", "Permit delays", "Resource constraints"],
    dependencies: [
      "Contract signed",
      "Mobilization advance released",
      "Insurance in place",
    ],
    aiInsight:
      "7 highway projects showing critical path delays. Cumulative slippage risk: ₹840 Cr penalty exposure.",
    stats: [
      { label: "In Execution", value: "156", color: "#00D4FF" },
      { label: "Critical Delays", value: "23", color: "#FF3D00" },
      { label: "Avg Completion", value: "58%", color: "#00E676" },
      { label: "Permit Blocks", value: "34", color: "#FFB300" },
    ],
  },
  {
    id: "monitoring",
    name: "MONITORING",
    count: 112,
    icon: Activity,
    risks: ["KPI drift", "Reporting gaps", "Milestone gaming"],
    dependencies: [
      "Physical progress >40%",
      "Quality audit passed",
      "IE certificate issued",
    ],
    aiInsight:
      "17 projects showing milestone reporting inconsistency vs. actual site progress (>15% variance).",
    stats: [
      { label: "Under Monitoring", value: "112", color: "#00D4FF" },
      { label: "KPI Breaches", value: "17", color: "#FF3D00" },
      { label: "On-Track", value: "78%", color: "#00E676" },
      { label: "IE Flags", value: "9", color: "#FFB300" },
    ],
  },
  {
    id: "claims",
    name: "CLAIMS",
    count: 67,
    icon: AlertTriangle,
    risks: ["EOT exposure", "Variation order inflation", "Arbitration risk"],
    dependencies: [
      "Practical completion issued",
      "Defect list issued",
      "Final measurement done",
    ],
    aiInsight:
      "EOT claim exposure: ₹2,840 Cr across 67 projects. 14 cases showing arbitration likelihood >70%.",
    stats: [
      { label: "Active Claims", value: "67", color: "#00D4FF" },
      { label: "EOT Exposure", value: "₹2,840 Cr", color: "#FF3D00" },
      { label: "Arbitration Risk", value: "14", color: "#FF6B35" },
      { label: "Avg Claim Age", value: "18 months", color: "#FFB300" },
    ],
  },
  {
    id: "maintenance",
    name: "MAINTENANCE",
    count: 338,
    icon: Wrench,
    risks: ["Asset degradation", "Sensor failure", "Deferred maintenance"],
    dependencies: [
      "DLP expired",
      "O&M contract signed",
      "Asset register submitted",
    ],
    aiInsight:
      "89 assets showing accelerated degradation. 12 bridges flagged for emergency inspection by Q2.",
    stats: [
      { label: "Assets Monitored", value: "338", color: "#00D4FF" },
      { label: "Degraded Assets", value: "89", color: "#FF3D00" },
      { label: "Avg Health Score", value: "71/100", color: "#00E676" },
      { label: "Emergency Flags", value: "12", color: "#FFB300" },
    ],
  },
];

const PROJECTS: LifecycleProject[] = [
  {
    id: 1,
    name: "Delhi–Mumbai Expressway (NH-48) Package 12",
    type: "Highway",
    state: "Rajasthan",
    value: "₹4,240 Cr",
    stage: "execution",
    completion: 67,
    riskScore: 74,
    timeline: {
      tender: "done",
      bid: "done",
      award: "done",
      execution: "active",
      monitoring: "pending",
      claims: "pending",
      maintenance: "pending",
    },
  },
  {
    id: 2,
    name: "Bengaluru Metro Phase 3 Corridor C",
    type: "Metro",
    state: "Karnataka",
    value: "₹8,920 Cr",
    stage: "execution",
    completion: 41,
    riskScore: 82,
    timeline: {
      tender: "done",
      bid: "done",
      award: "done",
      execution: "at-risk",
      monitoring: "pending",
      claims: "pending",
      maintenance: "pending",
    },
  },
  {
    id: 3,
    name: "Mumbai Trans Harbour Link Phase 2",
    type: "Bridge",
    state: "Maharashtra",
    value: "₹6,100 Cr",
    stage: "monitoring",
    completion: 82,
    riskScore: 45,
    timeline: {
      tender: "done",
      bid: "done",
      award: "done",
      execution: "done",
      monitoring: "active",
      claims: "pending",
      maintenance: "pending",
    },
  },
  {
    id: 4,
    name: "Ganga Expressway Package 7 (Kanpur–Lucknow)",
    type: "Highway",
    state: "Uttar Pradesh",
    value: "₹2,780 Cr",
    stage: "tender",
    completion: 0,
    riskScore: 68,
    timeline: {
      tender: "active",
      bid: "pending",
      award: "pending",
      execution: "pending",
      monitoring: "pending",
      claims: "pending",
      maintenance: "pending",
    },
  },
  {
    id: 5,
    name: "Pune Ring Road (PMRDA) Package 4",
    type: "Highway",
    state: "Maharashtra",
    value: "₹3,450 Cr",
    stage: "bid",
    completion: 0,
    riskScore: 71,
    timeline: {
      tender: "done",
      bid: "active",
      award: "pending",
      execution: "pending",
      monitoring: "pending",
      claims: "pending",
      maintenance: "pending",
    },
  },
  {
    id: 6,
    name: "Chennai–Bengaluru Highway (NH-48) Upgrade",
    type: "Highway",
    state: "Tamil Nadu",
    value: "₹5,680 Cr",
    stage: "claims",
    completion: 100,
    riskScore: 89,
    timeline: {
      tender: "done",
      bid: "done",
      award: "done",
      execution: "done",
      monitoring: "done",
      claims: "at-risk",
      maintenance: "pending",
    },
  },
  {
    id: 7,
    name: "Kolkata East-West Metro Extension",
    type: "Metro",
    state: "West Bengal",
    value: "₹7,200 Cr",
    stage: "execution",
    completion: 54,
    riskScore: 91,
    timeline: {
      tender: "done",
      bid: "done",
      award: "done",
      execution: "at-risk",
      monitoring: "pending",
      claims: "pending",
      maintenance: "pending",
    },
  },
  {
    id: 8,
    name: "Bandra–Versova Sea Link (MSRDC)",
    type: "Bridge",
    state: "Maharashtra",
    value: "₹11,400 Cr",
    stage: "award",
    completion: 4,
    riskScore: 63,
    timeline: {
      tender: "done",
      bid: "done",
      award: "active",
      execution: "pending",
      monitoring: "pending",
      claims: "pending",
      maintenance: "pending",
    },
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const stageTimelineColor: Record<string, string> = {
  done: "#00E676",
  active: "#00D4FF",
  "at-risk": "#FF3D00",
  pending: "rgba(176,190,197,0.2)",
};

const stageStatusLabel: Record<string, string> = {
  done: "COMPLETE",
  active: "ACTIVE",
  "at-risk": "AT RISK",
  pending: "PENDING",
};

const stageBadgeCls: Record<string, string> = {
  tender: "badge-warning",
  bid: "badge-low",
  award: "badge-warning",
  execution: "badge-low",
  monitoring: "badge-success",
  claims: "badge-high",
  maintenance: "badge-success",
};

const riskColor = (r: number) =>
  r >= 80 ? "#FF3D00" : r >= 60 ? "#FFB300" : "#00E676";

// ── Download Helpers ─────────────────────────────────────────────────────────
function downloadLifecycleReport(
  stages: Stage[],
  projects: LifecycleProject[],
) {
  const today = new Date().toISOString().slice(0, 10);
  const stageHeaders = [
    "Stage",
    "Project Count",
    "Active Projects",
    "Flagged Items",
    "Avg Completion %",
    "Risk Score",
    "Key Risks",
    "Dependencies",
    "AI Insight",
  ];
  const stageRows = stages.map((s) => [
    s.name,
    s.count.toString(),
    s.stats[0]?.value ?? "",
    s.stats[1]?.value ?? "",
    s.stats[2]?.value ?? "N/A",
    s.stats[3]?.value ?? "N/A",
    `"${s.risks.join(" | ")}"`,
    `"${s.dependencies.join(" | ")}"`,
    `"${s.aiInsight.replace(/"/g, '""')}"`,
  ]);
  const projectHeaders = [
    "Project Name",
    "Type",
    "State",
    "Value",
    "Current Stage",
    "Completion %",
    "Risk Score",
  ];
  const projectRows = projects.map((p) => [
    `"${p.name}"`,
    p.type,
    p.state,
    p.value,
    p.stage.toUpperCase(),
    `${p.completion}%`,
    p.riskScore.toString(),
  ]);
  const csv = [
    "INFRAOS PROJECT LIFECYCLE INTELLIGENCE REPORT",
    `Generated: ${today}`,
    "",
    "STAGE INTELLIGENCE SUMMARY",
    stageHeaders.join(","),
    ...stageRows.map((r) => r.join(",")),
    "",
    "PORTFOLIO PROJECT TRACKER",
    projectHeaders.join(","),
    ...projectRows.map((r) => r.join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `InfraOS-Project-Lifecycle-${today}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadStageReport(stage: Stage, deepDive: DeepDiveData) {
  const today = new Date().toISOString().slice(0, 10);
  const riskHeaders = [
    "Risk Name",
    "Severity",
    "Exposure",
    "Recommended Action",
  ];
  const riskRows = deepDive.risks.map((r) => [
    `"${r.name}"`,
    r.severity,
    `"${r.exposure}"`,
    `"${r.action.replace(/"/g, '""')}"`,
  ]);
  const kpiHeaders = ["KPI", "Current Value", "Target"];
  const kpiRows = deepDive.kpis.map((k) => [
    k.label,
    `${k.value}${k.unit}`,
    `${k.target}${k.unit}`,
  ]);
  const csv = [
    `INFRAOS STAGE DEEP DIVE REPORT — ${stage.name}`,
    `Generated: ${today}`,
    "",
    "RISK BREAKDOWN",
    riskHeaders.join(","),
    ...riskRows.map((r) => r.join(",")),
    "",
    "STAGE KPIs",
    kpiHeaders.join(","),
    ...kpiRows.map((r) => r.join(",")),
    "",
    "AI INSIGHT",
    `"${deepDive.aiInsight.replace(/"/g, '""')}"`,
    "",
    "STAGE DEPENDENCIES",
    ...stage.dependencies.map((d) => `"${d}"`),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `InfraOS-Stage-${stage.name}-${today}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function LifecyclePage() {
  const { selectedOrg } = useOrg();
  const orgData = getOrgData(selectedOrg.key);
  const [activeStage, setActiveStage] = useState<StageName>("execution");
  const [selectedProject, setSelectedProject] =
    useState<LifecycleProject | null>(null);
  const [showDeepDive, setShowDeepDive] = useState(false);

  const currentStage = STAGES.find((s) => s.id === activeStage)!;
  const currentDeepDive = DEEP_DIVE[activeStage];

  return (
    <div className="p-6 space-y-5" data-ocid="lifecycle.page">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
            <span>Home</span>
            <ChevronRight size={10} />
            <span className="text-primary">Project Lifecycle</span>
          </nav>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label text-[0.6rem] px-2 py-0.5 rounded border border-primary/30 bg-primary/8 text-primary">
              END-TO-END TRACKER
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Project Lifecycle Intelligence
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track infrastructure projects across the complete execution
            lifecycle
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card flex items-center gap-6 px-4 py-2.5">
            {[
              {
                label: "Projects Tracked",
                value: orgData.kpis.totalProjects.toString(),
                color: "#00D4FF",
              },
              {
                label: "Tender Stage",
                value: Math.round(orgData.kpis.totalProjects * 0.1).toString(),
                color: "#FFB300",
              },
              {
                label: "Execution",
                value: Math.round(orgData.kpis.totalProjects * 0.18).toString(),
                color: "#00E676",
              },
              {
                label: "Claims Stage",
                value: Math.round(
                  orgData.kpis.delayedProjects * 0.35,
                ).toString(),
                color: "#FF6B35",
              },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-mono font-bold text-base"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-label text-[0.55rem]">{s.label}</div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn-primary text-sm flex items-center gap-2"
            data-ocid="lifecycle.export_button"
            onClick={() => downloadLifecycleReport(STAGES, PROJECTS)}
          >
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* ── Stage Tracker ──────────────────────────────────────────────────── */}
      <div className="glass-card p-5" data-ocid="lifecycle.stages_panel">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={14} className="text-primary" />
          <h2 className="font-semibold text-sm text-foreground">
            Lifecycle Stage Intelligence Tracker
          </h2>
          <span className="text-label text-[0.6rem] ml-auto">
            Click a stage to view intelligence
          </span>
        </div>

        {/* Stage pills */}
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const isActive = stage.id === activeStage;
            return (
              <div key={stage.id} className="flex items-center flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveStage(stage.id)}
                  className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg transition-smooth relative group"
                  style={{
                    background: isActive
                      ? "rgba(0,212,255,0.12)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(0,212,255,0.4)"
                      : "1px solid transparent",
                    boxShadow: isActive
                      ? "0 0 18px rgba(0,212,255,0.15)"
                      : "none",
                    minWidth: 90,
                  }}
                  data-ocid={`lifecycle.stage.${i + 1}`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-smooth group-hover:scale-105"
                    style={{
                      borderColor: isActive
                        ? "#00D4FF"
                        : "rgba(176,190,197,0.25)",
                      background: isActive
                        ? "rgba(0,212,255,0.15)"
                        : "rgba(176,190,197,0.05)",
                    }}
                  >
                    <Icon
                      size={14}
                      style={{
                        color: isActive ? "#00D4FF" : "rgba(176,190,197,0.5)",
                      }}
                    />
                  </div>
                  <span
                    className="text-[0.65rem] font-bold tracking-wider"
                    style={{
                      color: isActive ? "#00D4FF" : "rgba(176,190,197,0.6)",
                    }}
                  >
                    {stage.name}
                  </span>
                  <span
                    className="font-mono text-[0.65rem] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: isActive
                        ? "rgba(0,212,255,0.15)"
                        : "rgba(255,255,255,0.06)",
                      color: isActive ? "#00D4FF" : "rgba(176,190,197,0.5)",
                      border: `1px solid ${isActive ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    {stage.count} projects
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
                {i < STAGES.length - 1 && (
                  <div
                    className="w-6 h-0.5 flex-shrink-0"
                    style={{
                      background:
                        STAGES.findIndex((s) => s.id === activeStage) > i
                          ? "#00D4FF"
                          : "rgba(176,190,197,0.15)",
                      opacity: 0.6,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Stage Detail Panel */}
        <div
          className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4"
          data-ocid="lifecycle.stage_detail"
        >
          {/* Stats */}
          <div className="glass-elevated p-4">
            <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
              <Activity size={12} className="text-primary" />
              Stage Overview — {currentStage.name}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {currentStage.stats.map((s) => (
                <div
                  key={s.label}
                  className="p-2 rounded"
                  style={{
                    background: "rgba(0,212,255,0.04)",
                    border: "1px solid rgba(0,212,255,0.08)",
                  }}
                >
                  <div
                    className="font-mono font-bold text-base"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div className="text-label text-[0.58rem] mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risks + Dependencies */}
          <div className="glass-elevated p-4 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle size={12} style={{ color: "#FF3D00" }} />
                Key Risks
              </h3>
              <div className="space-y-1.5">
                {currentStage.risks.map((r) => (
                  <div key={r} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#FF3D00" }}
                    />
                    <span className="text-foreground/80">{r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-border/20 pt-3">
              <h3 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
                <ChevronRight size={12} className="text-primary" />
                Stage Dependencies
              </h3>
              <div className="space-y-1.5">
                {currentStage.dependencies.map((d) => (
                  <div key={d} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={10} style={{ color: "#00E676" }} />
                    <span className="text-muted-foreground">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div
            className="glass-elevated p-4"
            style={{
              border: "1px solid rgba(0,212,255,0.2)",
              background: "rgba(0,212,255,0.04)",
            }}
          >
            <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
              <Brain size={12} className="text-primary" />
              AI Stage Intelligence
            </h3>
            <div
              className="p-3 rounded-lg text-sm text-foreground leading-relaxed"
              style={{
                background: "rgba(0,212,255,0.06)",
                border: "1px solid rgba(0,212,255,0.12)",
              }}
            >
              <span className="text-primary font-semibold">INSIGHT: </span>
              {currentStage.aiInsight}
            </div>
            <button
              type="button"
              className="btn-secondary text-xs mt-3 w-full flex items-center justify-center gap-2"
              data-ocid="lifecycle.ai_deep_dive_button"
              onClick={() => setShowDeepDive(true)}
            >
              <Brain size={12} />
              Deep Dive Analysis →
            </button>
          </div>
        </div>
      </div>

      {/* ── Projects List ──────────────────────────────────────────────────── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="lifecycle.projects_panel"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <h2 className="font-semibold text-sm text-foreground">
            Portfolio — All Projects with Lifecycle Tracking
          </h2>
          <span className="text-label text-xs">
            Click project to expand lifecycle timeline
          </span>
        </div>
        <div className="divide-y divide-border/10">
          {PROJECTS.map((p, i) => (
            <div key={p.id}>
              <button
                type="button"
                onClick={() =>
                  setSelectedProject(selectedProject?.id === p.id ? null : p)
                }
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-smooth cursor-pointer text-left"
                data-ocid={`lifecycle.project.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {p.name}
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground mt-0.5">
                    {p.type} · {p.state} · {p.value}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center gap-2 w-28">
                    <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p.completion}%`,
                          background: riskColor(100 - p.completion),
                        }}
                      />
                    </div>
                    <span className="text-[0.65rem] font-mono text-muted-foreground w-8 text-right">
                      {p.completion}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[0.6rem] font-mono font-bold"
                      style={{ color: riskColor(p.riskScore) }}
                    >
                      R:{p.riskScore}
                    </span>
                  </div>
                  <span
                    className={`${stageBadgeCls[p.stage]} capitalize`}
                    style={{ fontSize: "0.6rem" }}
                  >
                    {p.stage}
                  </span>
                  <ChevronRight
                    size={12}
                    className="text-muted-foreground transition-smooth"
                    style={{
                      transform:
                        selectedProject?.id === p.id ? "rotate(90deg)" : "none",
                    }}
                  />
                </div>
              </button>

              {/* Expanded timeline */}
              {selectedProject?.id === p.id && (
                <div
                  className="px-4 py-4 border-t border-primary/10"
                  style={{ background: "rgba(0,212,255,0.03)" }}
                  data-ocid={`lifecycle.project.timeline.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-foreground">
                      Full Lifecycle Timeline
                    </h4>
                    <button
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      className="text-muted-foreground hover:text-foreground transition-smooth"
                      data-ocid="lifecycle.close_timeline_button"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="flex items-start gap-1 overflow-x-auto pb-1">
                    {STAGES.map((stage, si) => {
                      const status = p.timeline[stage.id];
                      const Icon = stage.icon;
                      return (
                        <div
                          key={stage.id}
                          className="flex items-center flex-shrink-0"
                        >
                          <div className="flex flex-col items-center gap-1 min-w-[80px]">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center border"
                              style={{
                                borderColor: stageTimelineColor[status],
                                background: `${stageTimelineColor[status]}18`,
                              }}
                            >
                              <Icon
                                size={12}
                                style={{ color: stageTimelineColor[status] }}
                              />
                            </div>
                            <span
                              className="text-[0.58rem] font-bold"
                              style={{ color: stageTimelineColor[status] }}
                            >
                              {stage.name}
                            </span>
                            <span
                              className="text-[0.55rem] font-mono"
                              style={{
                                color: stageTimelineColor[status],
                                opacity: 0.8,
                              }}
                            >
                              {stageStatusLabel[status]}
                            </span>
                          </div>
                          {si < STAGES.length - 1 && (
                            <div
                              className="w-4 h-px flex-shrink-0 mt-0 -mt-5"
                              style={{
                                background: stageTimelineColor[status],
                                opacity: 0.4,
                                marginTop: "-28px",
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Deep Dive Modal ───────────────────────────────────────────────── */}
      {showDeepDive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
          }}
          onClick={() => setShowDeepDive(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowDeepDive(false)}
          role="presentation"
          data-ocid="lifecycle.deep_dive_modal"
        >
          <dialog
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-5"
            style={{
              background: "rgba(12,18,28,0.97)",
              border: "1px solid rgba(0,212,255,0.25)",
              boxShadow:
                "0 0 60px rgba(0,212,255,0.12), 0 32px 64px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            open
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(0,212,255,0.12)",
                    border: "1px solid rgba(0,212,255,0.3)",
                  }}
                >
                  {(() => {
                    const Icon = currentStage.icon;
                    return <Icon size={18} style={{ color: "#00D4FF" }} />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-lg text-foreground">
                      {currentStage.name} Stage — Deep Dive Analysis
                    </h2>
                    <span
                      className="text-[0.6rem] font-bold px-2 py-0.5 rounded uppercase tracking-widest"
                      style={{
                        background: "rgba(0,212,255,0.12)",
                        color: "#00D4FF",
                        border: "1px solid rgba(0,212,255,0.25)",
                      }}
                    >
                      LIVE INTELLIGENCE
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    InfraOS AI Copilot · Stage Risk &amp; KPI Intelligence
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeepDive(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-smooth"
                style={{ background: "rgba(255,255,255,0.05)" }}
                data-ocid="lifecycle.deep_dive.close_button"
              >
                <X size={16} />
              </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentStage.stats.map((s) => (
                <div
                  key={s.label}
                  className="p-3 rounded-xl text-center"
                  style={{
                    background: "rgba(0,212,255,0.05)",
                    border: "1px solid rgba(0,212,255,0.1)",
                  }}
                >
                  <div
                    className="font-mono font-bold text-xl"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[0.6rem] text-muted-foreground mt-1 uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Risk Breakdown Table */}
            <div>
              <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle size={12} style={{ color: "#FF3D00" }} />
                Risk Breakdown — {currentStage.name} Stage
              </h3>
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                      <th className="text-left px-3 py-2 text-muted-foreground font-semibold uppercase tracking-wider text-[0.6rem]">
                        Risk
                      </th>
                      <th className="text-left px-3 py-2 text-muted-foreground font-semibold uppercase tracking-wider text-[0.6rem]">
                        Severity
                      </th>
                      <th className="text-left px-3 py-2 text-muted-foreground font-semibold uppercase tracking-wider text-[0.6rem]">
                        Exposure
                      </th>
                      <th className="text-left px-3 py-2 text-muted-foreground font-semibold uppercase tracking-wider text-[0.6rem]">
                        Recommended Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDeepDive.risks.map((risk, i) => (
                      <tr
                        key={risk.name}
                        style={{
                          background:
                            i % 2 === 0
                              ? "rgba(255,255,255,0.02)"
                              : "transparent",
                        }}
                        className="border-t border-white/5"
                      >
                        <td className="px-3 py-2.5 text-foreground font-medium">
                          {risk.name}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded uppercase"
                            style={{
                              background:
                                risk.severity === "HIGH"
                                  ? "rgba(255,61,0,0.15)"
                                  : risk.severity === "MEDIUM"
                                    ? "rgba(255,179,0,0.15)"
                                    : "rgba(0,230,118,0.12)",
                              color:
                                risk.severity === "HIGH"
                                  ? "#FF3D00"
                                  : risk.severity === "MEDIUM"
                                    ? "#FFB300"
                                    : "#00E676",
                              border: `1px solid ${risk.severity === "HIGH" ? "rgba(255,61,0,0.3)" : risk.severity === "MEDIUM" ? "rgba(255,179,0,0.3)" : "rgba(0,230,118,0.25)"}`,
                            }}
                          >
                            {risk.severity}
                          </span>
                        </td>
                        <td
                          className="px-3 py-2.5 font-mono text-[0.7rem]"
                          style={{ color: "#FFB300" }}
                        >
                          {risk.exposure}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">
                          {risk.action}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* KPIs with Progress Bars */}
            <div>
              <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp size={12} className="text-primary" />
                Stage KPIs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentDeepDive.kpis.map((kpi) => {
                  const pct = Math.min(
                    100,
                    Math.round(
                      (kpi.value / Math.max(kpi.target, kpi.value)) * 100,
                    ),
                  );
                  const isGood = kpi.value <= kpi.target;
                  const barColor = isGood
                    ? "#00E676"
                    : kpi.value / kpi.target > 1.5
                      ? "#FF3D00"
                      : "#FFB300";
                  return (
                    <div
                      key={kpi.label}
                      className="p-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[0.7rem] text-muted-foreground">
                          {kpi.label}
                        </span>
                        <span
                          className="font-mono text-xs font-bold"
                          style={{ color: barColor }}
                        >
                          {kpi.value}
                          {kpi.unit}
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: barColor }}
                        />
                      </div>
                      <div className="text-[0.58rem] text-muted-foreground mt-1">
                        Target: {kpi.target}
                        {kpi.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dependencies */}
            <div>
              <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                <ChevronRight size={12} className="text-primary" />
                Stage Entry Dependencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentStage.dependencies.map((d) => (
                  <div
                    key={d}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                    style={{
                      background: "rgba(0,230,118,0.08)",
                      border: "1px solid rgba(0,230,118,0.2)",
                      color: "#00E676",
                    }}
                  >
                    <CheckCircle2 size={10} />
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight */}
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.18)",
              }}
            >
              <h3 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
                <Brain size={12} className="text-primary" />
                InfraOS AI Copilot — Stage Intelligence
              </h3>
              <p className="text-sm text-foreground/85 leading-relaxed">
                <span className="text-primary font-semibold">INSIGHT: </span>
                {currentDeepDive.aiInsight}
              </p>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/8">
              <span className="text-[0.65rem] text-muted-foreground">
                InfraOS Intelligence Engine · {currentStage.name} Stage ·{" "}
                {new Date().toLocaleDateString("en-IN")}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeepDive(false)}
                  className="btn-secondary text-xs"
                  data-ocid="lifecycle.deep_dive.cancel_button"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadStageReport(currentStage, currentDeepDive)
                  }
                  className="btn-primary text-xs flex items-center gap-1.5"
                  data-ocid="lifecycle.deep_dive.download_button"
                >
                  <Download size={12} />
                  Download Stage Report
                </button>
              </div>
            </div>
          </dialog>
        </div>
      )}

      {/* ── Summary Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Avg Lifecycle Duration",
            value: "34 months",
            color: "#00D4FF",
            icon: Clock,
          },
          {
            label: "On-Time Delivery Rate",
            value: "38%",
            color: "#FF3D00",
            icon: AlertTriangle,
          },
          {
            label: "Claims Conversion Rate",
            value: "71%",
            color: "#FFB300",
            icon: FileText,
          },
          {
            label: "Completed Projects",
            value: "338",
            color: "#00E676",
            icon: CheckCircle2,
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="glass-card p-4 flex items-center gap-3"
              data-ocid={`lifecycle.stat.${s.label}`}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${s.color}15`,
                  border: `1px solid ${s.color}30`,
                }}
              >
                <Icon size={15} style={{ color: s.color }} />
              </div>
              <div>
                <div
                  className="font-mono font-bold text-lg"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-label text-[0.6rem]">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
