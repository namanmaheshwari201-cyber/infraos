import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  GitBranch,
  Layers,
  Plus,
  Search,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
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
import { useOrg } from "../context/OrgContext";
import { NH_PACE_DATA, getOrgData } from "../data/orgData";

// ── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type StatusType = "ON TRACK" | "AT RISK" | "DELAYED" | "CRITICAL";
type PermitStatus = "OBTAINED" | "PARTIAL" | "PENDING" | "NOT APPLIED";
type MilestoneStatus = "COMPLETED" | "IN PROGRESS" | "NOT STARTED";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface Milestone {
  id: number;
  name: string;
  status: MilestoneStatus;
  progress?: number;
  date: string;
  slippage?: number;
}

interface UserMilestone {
  id: number;
  project: string;
  name: string;
  targetDate: string;
  responsibleParty: string;
  priority: Priority;
  description: string;
  completionPct: number;
}

interface Permit {
  id: number;
  name: string;
  agency: string;
  status: PermitStatus;
  note: string;
  blocking?: boolean;
}

interface DelayPrediction {
  project: string;
  probability: number;
  months: number;
  cause: string;
}

interface ResourceGauge {
  label: string;
  value: number;
  status: "GOOD" | "MODERATE" | "AT RISK" | "CRITICAL";
}

interface AccelerationStrategy {
  name: string;
  description: string;
  timelineReduction: string;
  costImpact: string;
  riskLevel: "Low" | "Medium" | "High";
  color: string;
}

interface AIRecommendation {
  id: number;
  title: string;
  rationale: string;
  impactScore: number;
  delayReduction: number;
  effort: "Low" | "Medium" | "High";
  accepted?: boolean;
  skipped?: boolean;
}

// ── Static Data ───────────────────────────────────────────────────────────────

const MILESTONES: Milestone[] = [
  { id: 1, name: "Land Acquisition", status: "COMPLETED", date: "Feb 2024" },
  { id: 2, name: "Foundation Works", status: "COMPLETED", date: "Jun 2024" },
  {
    id: 3,
    name: "Viaduct Construction Sec A",
    status: "COMPLETED",
    date: "Nov 2024",
  },
  {
    id: 4,
    name: "Viaduct Construction Sec B",
    status: "IN PROGRESS",
    progress: 78,
    date: "Jul 2025",
    slippage: 45,
  },
  {
    id: 5,
    name: "Station Structure Works",
    status: "IN PROGRESS",
    progress: 34,
    date: "Sep 2025",
    slippage: 89,
  },
  {
    id: 6,
    name: "MEP & Systems Installation",
    status: "NOT STARTED",
    date: "Feb 2026",
  },
  {
    id: 7,
    name: "Testing & Commissioning",
    status: "NOT STARTED",
    date: "Aug 2026",
  },
  {
    id: 8,
    name: "Revenue Operations",
    status: "NOT STARTED",
    date: "Dec 2026",
  },
];

const PERMITS: Permit[] = [
  {
    id: 1,
    name: "Environmental Clearance (MoEF)",
    agency: "MoEF",
    status: "OBTAINED",
    note: "Obtained Jan 2024",
  },
  {
    id: 2,
    name: "Forest Land Diversion (MoEF)",
    agency: "MoEF",
    status: "OBTAINED",
    note: "Obtained Mar 2024",
  },
  {
    id: 3,
    name: "Land Acquisition (Revenue Dept)",
    agency: "Revenue Dept",
    status: "PARTIAL",
    note: "78% acquired — BLOCKING",
    blocking: true,
  },
  {
    id: 4,
    name: "Railway NOC (Ministry of Railways)",
    agency: "MoR",
    status: "PENDING",
    note: "Applied Aug 2024 — 234 days elapsed",
    blocking: true,
  },
  {
    id: 5,
    name: "Utility Shift — TNEB (Power)",
    agency: "TNEB",
    status: "PENDING",
    note: "Dependent on Land Acquisition",
  },
  {
    id: 6,
    name: "Utility Shift — BSNL (Telecom)",
    agency: "BSNL",
    status: "PENDING",
    note: "Dependent on Land Acquisition",
  },
  {
    id: 7,
    name: "Local Body Clearance (CMDA)",
    agency: "CMDA",
    status: "NOT APPLIED",
    note: "Dependent on Railway NOC",
  },
];

const DELAY_PREDICTIONS: DelayPrediction[] = [
  {
    project: "Bangalore Metro Purple Line",
    probability: 94,
    months: 6,
    cause:
      "Monsoon season impact on tunneling + contractor resource constraints",
  },
  {
    project: "Chennai Port Highway",
    probability: 87,
    months: 4,
    cause: "Land acquisition stall + Railway NOC on critical path",
  },
  {
    project: "Pune Ring Road Pkg 5",
    probability: 71,
    months: 2,
    cause: "Sub-contractor cash flow stress signals detected",
  },
  {
    project: "Delhi-Meerut RRTS Ph 2",
    probability: 68,
    months: 3,
    cause: "Viaduct construction velocity 22% below plan",
  },
];

const RESOURCE_GAUGES: ResourceGauge[] = [
  { label: "Labor Productivity", value: 73, status: "MODERATE" },
  { label: "Equipment Utilization", value: 84, status: "GOOD" },
  { label: "Material Delivery Index", value: 61, status: "AT RISK" },
  { label: "Sub-contractor Performance", value: 56, status: "CRITICAL" },
];

const DELAY_CAUSES = [
  { cause: "Land Acquisition", pct: 34, color: "#FF3D00" },
  { cause: "Environmental Clearances", pct: 22, color: "#FF6D00" },
  { cause: "Contractor Issues", pct: 18, color: "#FFB300" },
  { cause: "Design Changes", pct: 14, color: "#00D4FF" },
  { cause: "Force Majeure", pct: 12, color: "#00E676" },
];

const DELAYED_PROJECTS_DATA = [
  { name: "Mumbai Coastal Rd", planned: 85, actual: 62, delay: 234 },
  { name: "Delhi-Meerut RRTS", planned: 70, actual: 48, delay: 189 },
  { name: "Bangalore Metro", planned: 60, actual: 38, delay: 167 },
  { name: "Chennai Port Hwy", planned: 55, actual: 31, delay: 143 },
  { name: "Pune Ring Road", planned: 45, actual: 29, delay: 98 },
];

const ACCOUNTABILITY_DATA = [
  {
    project: "Mumbai Coastal Road",
    delayDays: 234,
    entity: "MCGM (Land)",
    status: "ESCALATED",
  },
  {
    project: "Delhi-Meerut RRTS Ph2",
    delayDays: 189,
    entity: "Railways NOC",
    status: "PENDING",
  },
  {
    project: "Bangalore Metro Purple",
    delayDays: 167,
    entity: "L&T Construction",
    status: "REVIEW",
  },
  {
    project: "Chennai Port Highway",
    delayDays: 143,
    entity: "Revenue Dept",
    status: "ESCALATED",
  },
  {
    project: "Pune Ring Road Pkg 5",
    delayDays: 98,
    entity: "HCC Ltd",
    status: "MONITORING",
  },
];

const _ACCELERATION_STRATEGIES: AccelerationStrategy[] = [
  {
    name: "Fast-Track (Parallel Activities)",
    description:
      "Overlap sequential activities — start MEP installation before viaduct Sec B completion. Requires redesign of work packages and additional site coordination.",
    timelineReduction: "45–60 days",
    costImpact: "+₹12–18 Cr",
    riskLevel: "Medium",
    color: "#00D4FF",
  },
  {
    name: "Resource Injection",
    description:
      "Deploy additional manpower and equipment: 400 extra laborers, 12 concrete pumps, and 6 cranes. Focus on Viaduct Sec B and Station works simultaneously.",
    timelineReduction: "30–45 days",
    costImpact: "+₹8–14 Cr",
    riskLevel: "Low",
    color: "#00E676",
  },
  {
    name: "Schedule Crashing (Overtime & Premium Resources)",
    description:
      "Authorize 24/7 operations with 3 shifts. Use premium contractors for bottleneck activities. Acquire pre-cast components from alternative vendors to bypass supply delays.",
    timelineReduction: "60–90 days",
    costImpact: "+₹22–35 Cr",
    riskLevel: "High",
    color: "#FFB300",
  },
];

const AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 1,
    title: "Escalate Railway NOC to Joint Secretary",
    rationale:
      "234-day delay on Railway NOC is blocking 3 downstream activities. Escalation to Joint Secretary level historically resolves in 21 days vs 60+ days at field level.",
    impactScore: 96,
    delayReduction: 45,
    effort: "Low",
  },
  {
    id: 2,
    title: "Reallocate Resources from Sec A to Station Works",
    rationale:
      "Viaduct Sec A is 100% complete but resources haven't been reallocated. Station works at 34% need acceleration urgently.",
    impactScore: 89,
    delayReduction: 28,
    effort: "Low",
  },
  {
    id: 3,
    title: "Engage Pre-cast Specialist for Viaduct Sec B",
    rationale:
      "Current cast-in-situ approach is 22% behind plan. Pre-cast panels can accelerate the remaining 22% from estimated 90 days to 52 days.",
    impactScore: 84,
    delayReduction: 38,
    effort: "Medium",
  },
  {
    id: 4,
    title: "Deploy Night-Shift for Foundation Concreting",
    rationale:
      "Daytime heat in Tamil Nadu is reducing pour efficiency by 18%. Night concreting with floodlights can increase daily pour from 80m³ to 120m³.",
    impactScore: 76,
    delayReduction: 22,
    effort: "Medium",
  },
  {
    id: 5,
    title: "Activate Alternative Material Supplier for Steel",
    rationale:
      "Primary supplier SAIL delivery index at 61% — activate backup supply from JSW Steel Bellary for next 3 months to stabilize pipeline.",
    impactScore: 71,
    delayReduction: 18,
    effort: "Low",
  },
  {
    id: 6,
    title: "Sub-contractor Financial Stress Intervention",
    rationale:
      "3 sub-contractors show cash flow stress (payment delay >60 days). Advance 15% mobilization to stabilize workforce retention.",
    impactScore: 65,
    delayReduction: 14,
    effort: "High",
  },
  {
    id: 7,
    title: "Fast-Track Land Acquisition in 2 Remaining Plots",
    rationale:
      "Plots 34-B and 67-C are blocking utility shifting. Invoke emergency acquisition clause under LARR Act 2013 Section 40 to expedite.",
    impactScore: 61,
    delayReduction: 32,
    effort: "High",
  },
  {
    id: 8,
    title: "GatiShakti Portal — Multi-agency NOC Sync",
    rationale:
      "Log BSNL and TNEB NOCs on PM GatiShakti portal to trigger automatic inter-ministry coordination workflow. Estimated resolution in 30 days.",
    impactScore: 57,
    delayReduction: 20,
    effort: "Low",
  },
];

const _CRITICAL_PATH_ITEMS = [
  {
    item: "Railway NOC from MoR",
    delay: 234,
    impact: "CRITICAL",
    blockedActivities: 3,
  },
  {
    item: "Land Acquisition — Plots 34-B & 67-C",
    delay: 89,
    impact: "HIGH",
    blockedActivities: 2,
  },
  {
    item: "Viaduct Sec B — 22% velocity gap",
    delay: 45,
    impact: "HIGH",
    blockedActivities: 1,
  },
  {
    item: "TNEB Utility Shift (power line relocation)",
    delay: 34,
    impact: "MEDIUM",
    blockedActivities: 2,
  },
  {
    item: "Station Structural Steel Supply",
    delay: 21,
    impact: "MEDIUM",
    blockedActivities: 1,
  },
];

const PROJECT_OPTIONS = [
  "Delhi-Meerut RRTS Phase 2",
  "Mumbai Coastal Road Project",
  "Bangalore Metro Purple Line Ext",
  "Chennai Port Access Highway",
  "Pune Ring Road — Package 5",
  "Hyderabad Outer Ring Road Ph3",
  "Ahmedabad-Dholera Expressway",
  "NHAI NH-48 Widening (Kerala)",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusBadgeClass(s: StatusType): string {
  return (
    {
      "ON TRACK": "badge-success",
      "AT RISK": "badge-warning",
      DELAYED: "badge-high",
      CRITICAL: "badge-critical",
    }[s] ?? "badge-low"
  );
}

function riskBadgeClass(r: RiskLevel): string {
  return (
    {
      CRITICAL: "badge-critical",
      HIGH: "badge-high",
      MEDIUM: "badge-warning",
      LOW: "badge-low",
    }[r] ?? "badge-low"
  );
}

function progressColor(status: StatusType): string {
  return (
    {
      "ON TRACK": "#00E676",
      "AT RISK": "#FFB300",
      DELAYED: "#FF6D00",
      CRITICAL: "#FF3D00",
    }[status] ?? "#00D4FF"
  );
}

function permitStatusStyle(s: PermitStatus): {
  color: string;
  icon: string;
  cls: string;
} {
  return (
    {
      OBTAINED: { color: "#00E676", icon: "✓", cls: "badge-success" },
      PARTIAL: { color: "#FFB300", icon: "⚠", cls: "badge-warning" },
      PENDING: { color: "#FF6D00", icon: "✗", cls: "badge-high" },
      "NOT APPLIED": { color: "rgba(176,190,197,0.5)", icon: "○", cls: "" },
    }[s] ?? { color: "#aaa", icon: "?", cls: "" }
  );
}

function gaugeStatusColor(s: ResourceGauge["status"]): string {
  return (
    {
      GOOD: "#00E676",
      MODERATE: "#00D4FF",
      "AT RISK": "#FFB300",
      CRITICAL: "#FF3D00",
    }[s] ?? "#00D4FF"
  );
}

function gaugeStatusClass(s: ResourceGauge["status"]): string {
  return (
    {
      GOOD: "badge-success",
      MODERATE: "badge-low",
      "AT RISK": "badge-warning",
      CRITICAL: "badge-critical",
    }[s] ?? "badge-low"
  );
}

function priorityColor(p: Priority): string {
  return (
    { LOW: "#00E676", MEDIUM: "#00D4FF", HIGH: "#FFB300", CRITICAL: "#FF3D00" }[
      p
    ] ?? "#00D4FF"
  );
}

function priorityBadgeClass(p: Priority): string {
  return (
    {
      LOW: "badge-success",
      MEDIUM: "badge-low",
      HIGH: "badge-warning",
      CRITICAL: "badge-critical",
    }[p] ?? "badge-low"
  );
}

function effortColor(e: "Low" | "Medium" | "High"): string {
  return { Low: "#00E676", Medium: "#FFB300", High: "#FF6D00" }[e] ?? "#00D4FF";
}

// ── Modal: Add Milestone ──────────────────────────────────────────────────────

function AddMilestoneModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (m: UserMilestone) => void;
}) {
  const [form, setForm] = useState({
    project: PROJECT_OPTIONS[0],
    name: "",
    targetDate: "",
    responsibleParty: "",
    priority: "MEDIUM" as Priority,
    description: "",
    completionPct: 0,
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.targetDate || !form.responsibleParty) return;
    onAdd({
      id: Date.now(),
      ...form,
    });
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      data-ocid="execution.add_milestone_modal"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl"
        style={{
          background: "rgba(10,12,18,0.97)",
          border: "1px solid rgba(0,212,255,0.25)",
          boxShadow:
            "0 0 60px rgba(0,212,255,0.12), 0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "rgba(0,212,255,0.15)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(0,212,255,0.12)",
                border: "1px solid rgba(0,212,255,0.25)",
              }}
            >
              <Plus size={16} style={{ color: "#00D4FF" }} />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                Add Milestone
              </h2>
              <p className="text-xs" style={{ color: "rgba(176,190,197,0.6)" }}>
                Define a new project milestone with tracking parameters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-smooth"
            style={{ color: "rgba(176,190,197,0.6)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(176,190,197,0.6)";
            }}
            data-ocid="execution.add_milestone_modal.close_button"
          >
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0,230,118,0.12)",
                border: "2px solid rgba(0,230,118,0.3)",
              }}
            >
              <CheckCircle2 size={32} style={{ color: "#00E676" }} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground mb-1">
                Milestone Added Successfully
              </h3>
              <p className="text-sm text-muted-foreground">
                "{form.name}" has been added to the project timeline for{" "}
                {form.project}.
              </p>
            </div>
            <div
              className="w-full p-4 rounded-lg text-left"
              style={{
                background: "rgba(0,230,118,0.06)",
                border: "1px solid rgba(0,230,118,0.18)",
              }}
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span style={{ color: "rgba(176,190,197,0.5)" }}>
                    Project
                  </span>
                  <p className="font-semibold text-foreground mt-0.5">
                    {form.project}
                  </p>
                </div>
                <div>
                  <span style={{ color: "rgba(176,190,197,0.5)" }}>
                    Target Date
                  </span>
                  <p className="font-semibold text-foreground mt-0.5">
                    {form.targetDate}
                  </p>
                </div>
                <div>
                  <span style={{ color: "rgba(176,190,197,0.5)" }}>
                    Responsible
                  </span>
                  <p className="font-semibold text-foreground mt-0.5">
                    {form.responsibleParty}
                  </p>
                </div>
                <div>
                  <span style={{ color: "rgba(176,190,197,0.5)" }}>
                    Priority
                  </span>
                  <span
                    className={`${priorityBadgeClass(form.priority)} mt-0.5 inline-block`}
                  >
                    {form.priority}
                  </span>
                </div>
                <div className="col-span-2">
                  <span style={{ color: "rgba(176,190,197,0.5)" }}>
                    Current Completion
                  </span>
                  <p
                    className="font-mono font-bold mt-0.5"
                    style={{ color: "#00D4FF" }}
                  >
                    {form.completionPct}%
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary text-sm px-6 py-2.5"
              data-ocid="execution.add_milestone_modal.confirm_button"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Project */}
            <div>
              <label
                htmlFor="ms-project"
                className="block text-xs font-semibold text-muted-foreground mb-1.5"
              >
                Project *
              </label>
              <select
                id="ms-project"
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none"
                style={{
                  background: "rgba(26,35,50,0.9)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
                data-ocid="execution.add_milestone_modal.project_select"
              >
                {PROJECT_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Milestone Name + Target Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ms-name"
                  className="block text-xs font-semibold text-muted-foreground mb-1.5"
                >
                  Milestone Name *
                </label>
                <input
                  id="ms-name"
                  type="text"
                  required
                  placeholder="e.g., Foundation Completion"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  style={{
                    background: "rgba(26,35,50,0.9)",
                    border: "1px solid rgba(0,212,255,0.2)",
                  }}
                  data-ocid="execution.add_milestone_modal.name_input"
                />
              </div>
              <div>
                <label
                  htmlFor="ms-date"
                  className="block text-xs font-semibold text-muted-foreground mb-1.5"
                >
                  Target Date *
                </label>
                <input
                  id="ms-date"
                  type="date"
                  required
                  value={form.targetDate}
                  onChange={(e) =>
                    setForm({ ...form, targetDate: e.target.value })
                  }
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none"
                  style={{
                    background: "rgba(26,35,50,0.9)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    colorScheme: "dark",
                  }}
                  data-ocid="execution.add_milestone_modal.date_input"
                />
              </div>
            </div>

            {/* Responsible Party + Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ms-responsible"
                  className="block text-xs font-semibold text-muted-foreground mb-1.5"
                >
                  Responsible Party *
                </label>
                <input
                  id="ms-responsible"
                  type="text"
                  required
                  placeholder="e.g., L&T Construction / PMU"
                  value={form.responsibleParty}
                  onChange={(e) =>
                    setForm({ ...form, responsibleParty: e.target.value })
                  }
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  style={{
                    background: "rgba(26,35,50,0.9)",
                    border: "1px solid rgba(0,212,255,0.2)",
                  }}
                  data-ocid="execution.add_milestone_modal.responsible_input"
                />
              </div>
              <div>
                <label
                  htmlFor="ms-priority"
                  className="block text-xs font-semibold text-muted-foreground mb-1.5"
                >
                  Priority
                </label>
                <select
                  id="ms-priority"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value as Priority })
                  }
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none"
                  style={{
                    background: "rgba(26,35,50,0.9)",
                    border: "1px solid rgba(0,212,255,0.2)",
                  }}
                  data-ocid="execution.add_milestone_modal.priority_select"
                >
                  {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as Priority[]).map(
                    (p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="ms-description"
                className="block text-xs font-semibold text-muted-foreground mb-1.5"
              >
                Description
              </label>
              <textarea
                id="ms-description"
                rows={3}
                placeholder="Describe what needs to be achieved for this milestone…"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
                style={{
                  background: "rgba(26,35,50,0.9)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
                data-ocid="execution.add_milestone_modal.description_textarea"
              />
            </div>

            {/* Completion % */}
            <div>
              <label
                htmlFor="ms-completion"
                className="block text-xs font-semibold text-muted-foreground mb-1.5"
              >
                Current Completion —{" "}
                <span
                  className="font-mono"
                  style={{ color: priorityColor(form.priority) }}
                >
                  {form.completionPct}%
                </span>
              </label>
              <input
                id="ms-completion"
                type="range"
                min={0}
                max={100}
                value={form.completionPct}
                onChange={(e) =>
                  setForm({ ...form, completionPct: Number(e.target.value) })
                }
                className="w-full accent-[#00D4FF]"
                data-ocid="execution.add_milestone_modal.completion_input"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost flex-1 text-sm border border-border/30 rounded-lg"
                data-ocid="execution.add_milestone_modal.cancel_button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 text-sm"
                data-ocid="execution.add_milestone_modal.submit_button"
              >
                Add Milestone
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Modal: Track Delay ────────────────────────────────────────────────────────

function TrackDelayDrawer({ onClose }: { onClose: () => void }) {
  const [reportGenerated, setReportGenerated] = useState(false);

  function downloadExecutionReport() {
    const now = new Date().toISOString().split("T")[0];
    const content = `INFRAOS EXECUTION INTELLIGENCE REPORT
Generated: ${now}
User: Naman Maheshwari

=== PROJECT EXECUTION OVERVIEW ===
Total Projects in Execution: 1,820
On Schedule: 1,040 (57.1%)
Delayed: 780 (42.8%)
Critical Delay (>12 months): 234 (12.9%)

=== NH CONSTRUCTION PROGRESS ===
FY2014-15,12.1 km/day
FY2019-20,28.4 km/day
FY2023-24,33.8 km/day
High-Speed Corridors 2014,93 km
High-Speed Corridors 2024,2474 km

=== MILESTONE TRACKING ===
Project ID,Project Name,Planned Completion,Actual/Forecast,Delay,Reason
NH-48-KA-2021,NH-48 Bangalore–Chennai,Mar 2024,Mar 2026,24 months,Land Acquisition
MU-MTHL-001,Mumbai Trans Harbour Link,Dec 2023,Jun 2025,18 months,Environmental
DL-RRTS-001,Delhi-Meerut RRTS,Jun 2025,Jun 2026,12 months,Utility Shifts
PU-MRTS-002,Pune Metro Phase 2,Sep 2024,Mar 2027,30 months,Funding Gap
HY-ORR-001,Hyderabad ORR Extension,Jan 2023,Jan 2027,48 months,LA Disputes

=== PERMIT/NOC STATUS ===
Project,Permit Type,Status,Days Pending
NH-48,Forest Clearance,Pending,180
RRTS Delhi,Railway Crossing NOC,Approved,0
MTHL Mumbai,Coastal CRZ Clearance,Pending,240
Pune Metro,Utility Shifting Order,In Progress,90

=== DELAY ROOT CAUSES ===
Land Acquisition,34%
Environmental Clearances,22%
Contractual Disputes,19%
Utility Shifts,13%
Law & Order Issues,7%
Funding Delays,5%

=== AI DELAY FORECASTS ===
1. NH-48 corridor: 85% probability of additional 6-month slip if LA not resolved by Q2
2. MTHL: CRZ clearance bottleneck may push completion to Q3 FY2026
3. Delhi RRTS: On track with 92% milestone completion
`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `InfraOS-Execution-Report-${now}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleGenerateReport() {
    setReportGenerated(true);
    downloadExecutionReport();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      data-ocid="execution.track_delay_modal"
    >
      <div
        className="ml-auto w-full max-w-4xl h-full overflow-y-auto"
        style={{
          background: "rgba(8,10,16,0.98)",
          borderLeft: "1px solid rgba(0,212,255,0.2)",
          boxShadow: "-24px 0 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
          style={{
            background: "rgba(8,10,16,0.98)",
            borderColor: "rgba(0,212,255,0.15)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255,179,0,0.12)",
                border: "1px solid rgba(255,179,0,0.25)",
              }}
            >
              <Clock size={16} style={{ color: "#FFB300" }} />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                Delay Tracking Analysis
              </h2>
              <p className="text-xs" style={{ color: "rgba(176,190,197,0.6)" }}>
                Portfolio-wide delay intelligence · Real-time
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-smooth"
            style={{ color: "rgba(176,190,197,0.6)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
            data-ocid="execution.track_delay_modal.close_button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Avg Delay", value: "186 days", color: "#FF3D00" },
              { label: "Projects Delayed", value: "780", color: "#FF6D00" },
              { label: "Cost Impact", value: "₹4.8L Cr", color: "#FFB300" },
              { label: "On Critical Path", value: "234", color: "#FF6D00" },
            ].map((k) => (
              <div
                key={k.label}
                className="glass-elevated p-3 rounded-lg text-center"
              >
                <div
                  className="font-mono font-bold text-xl"
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

          {/* Delay Cause Breakdown */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#FF6D00" }}
              />
              Delay Root Cause Breakdown
            </h3>
            <div className="space-y-3">
              {DELAY_CAUSES.map((d) => (
                <div key={d.cause} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-foreground">
                      {d.cause}
                    </span>
                    <span
                      className="font-mono font-bold text-sm"
                      style={{ color: d.color }}
                    >
                      {d.pct}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${d.pct}%`,
                        background: `linear-gradient(90deg, ${d.color}66, ${d.color})`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {d.pct === 34 &&
                      "Primary driver: 22% projects blocked by land disputes. LARR Act delays."}
                    {d.pct === 22 &&
                      "MoEF clearances averaging 14 months vs 6-month statutory limit."}
                    {d.pct === 18 &&
                      "Sub-contractor insolvency + labor migration post-monsoon."}
                    {d.pct === 14 &&
                      "Scope changes mid-execution due to geological surprises and DPR gaps."}
                    {d.pct === 12 &&
                      "COVID, cyclones, floods causing force majeure claims."}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Planned vs Actual Progress */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#00D4FF" }}
              />
              Planned vs Actual Progress — Top 5 Delayed Projects
            </h3>
            <div className="space-y-4">
              {DELAYED_PROJECTS_DATA.map((p) => (
                <div key={p.name} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-foreground">
                      {p.name}
                    </span>
                    <span
                      className="font-mono text-xs"
                      style={{ color: "#FF6D00" }}
                    >
                      +{p.delay}d delay
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-12 text-muted-foreground">
                        Planned
                      </span>
                      <div
                        className="flex-1 h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${p.planned}%`,
                            background: "rgba(0,212,255,0.4)",
                          }}
                        />
                      </div>
                      <span
                        className="font-mono text-xs w-8 text-right"
                        style={{ color: "#00D4FF" }}
                      >
                        {p.planned}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-12 text-muted-foreground">
                        Actual
                      </span>
                      <div
                        className="flex-1 h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${p.actual}%`,
                            background:
                              "linear-gradient(90deg, #FF6D0066, #FF6D00)",
                          }}
                        />
                      </div>
                      <span
                        className="font-mono text-xs w-8 text-right"
                        style={{ color: "#FF6D00" }}
                      >
                        {p.actual}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accountability Table */}
          <div className="glass-card overflow-hidden">
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: "rgba(0,212,255,0.1)" }}
            >
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#FFB300" }}
                />
                Responsible Party Accountability
              </h3>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  {[
                    "Project",
                    "Delay (Days)",
                    "Responsible Entity",
                    "Status",
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
                {ACCOUNTABILITY_DATA.map((row) => (
                  <tr
                    key={row.project}
                    className="border-b hover:bg-white/3 transition-smooth"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      {row.project}
                    </td>
                    <td
                      className="px-4 py-2.5 font-mono font-bold"
                      style={{ color: "#FF6D00" }}
                    >
                      +{row.delayDays}d
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {row.entity}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{
                          background:
                            row.status === "ESCALATED"
                              ? "rgba(255,61,0,0.15)"
                              : row.status === "PENDING"
                                ? "rgba(255,179,0,0.12)"
                                : "rgba(0,212,255,0.1)",
                          color:
                            row.status === "ESCALATED"
                              ? "#FF6B6B"
                              : row.status === "PENDING"
                                ? "#FFB300"
                                : "#00D4FF",
                          border: `1px solid ${row.status === "ESCALATED" ? "rgba(255,61,0,0.25)" : row.status === "PENDING" ? "rgba(255,179,0,0.2)" : "rgba(0,212,255,0.2)"}`,
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Generate Report Button */}
          <div className="flex gap-3 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 text-sm border border-border/30 rounded-lg"
              data-ocid="execution.track_delay_modal.cancel_button"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleGenerateReport}
              className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
              data-ocid="execution.track_delay_modal.generate_report_button"
            >
              {reportGenerated ? (
                <>
                  <CheckCircle2 size={14} /> Report Generated — Downloading
                </>
              ) : (
                <>
                  <TrendingUp size={14} /> Generate Delay Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Accelerate Now ─────────────────────────────────────────────────────

function AccelerationModal({ onClose }: { onClose: () => void }) {
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const BLOCKERS = [
    {
      name: "Railway NOC Clearance",
      delay: 234,
      level: "CRITICAL",
      color: "#FF3D00",
      project: "Chennai Port Highway",
    },
    {
      name: "Utility Coordination Failure",
      delay: 89,
      level: "HIGH",
      color: "#FF8C42",
      project: "Bangalore Metro Purple Line",
    },
    {
      name: "Contractor Resource Shortfall",
      delay: 45,
      level: "MEDIUM",
      color: "#FFB300",
      project: "Viaduct Section B",
    },
  ];

  const STRATEGIES = [
    {
      title: "Resource Reallocation",
      desc: "Deploy 2 additional contractor teams + equipment mobilization across blocked zones.",
      risk: "MEDIUM" as const,
      riskColor: "#FFB300",
      timelineDays: 47,
      costImpact: "+\u20b912.4 Cr",
      color: "#00D4FF",
    },
    {
      title: "Parallel Work Streams",
      desc: "Overlap dependent activities using fast-track method. Requires redesign of work packages.",
      risk: "HIGH" as const,
      riskColor: "#FF8C42",
      timelineDays: 89,
      costImpact: "+\u20b928.7 Cr",
      color: "#00E676",
    },
    {
      title: "Fast-Track Approvals",
      desc: "Executive escalation to ministry level for NOC/clearances. Lowest cost, highest policy impact.",
      risk: "LOW" as const,
      riskColor: "#00E676",
      timelineDays: 120,
      costImpact: "+\u20b94.2 Cr",
      color: "#C084FC",
    },
  ];

  function downloadActionPlan() {
    const strategy =
      selectedStrategy !== null ? STRATEGIES[selectedStrategy] : STRATEGIES[0];
    const now = new Date().toISOString().split("T")[0];
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (90 - strategy.timelineDays));
    const csv = [
      "INFRAOS ACCELERATION ACTION PLAN",
      `Generated,${now}`,
      "Prepared By,Naman Maheshwari",
      "Classification,RESTRICTED",
      "",
      "=== ACTIVE BLOCKERS ===",
      "Blocker,Delay (days),Impact Level,Affected Project",
      ...BLOCKERS.map((b) => `${b.name},${b.delay},${b.level},${b.project}`),
      "",
      "=== SELECTED STRATEGY ===",
      `Strategy,${strategy.title}`,
      `Description,${strategy.desc}`,
      `Timeline Reduction,${strategy.timelineDays} days`,
      `Cost Impact,${strategy.costImpact}`,
      `Risk Level,${strategy.risk}`,
      "",
      "=== EXECUTION DETAILS ===",
      `Target Completion Date,${targetDate.toISOString().split("T")[0]}`,
      "Responsible Officer,Naman Maheshwari",
      "Resource Requirements,Additional contractor teams + Equipment mobilization",
      "Ministry Escalation,Joint Secretary MoR + MoEF",
      "Review Schedule,Weekly progress review",
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `InfraOS-Acceleration-Plan-${now}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const projectedDate = () => {
    if (selectedStrategy === null) return "";
    const d = new Date();
    d.setMonth(
      d.getMonth() +
        Math.round((90 - STRATEGIES[selectedStrategy].timelineDays) / 30),
    );
    return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
      data-ocid="execution.acceleration_modal"
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-xl"
        style={{
          background: "rgba(8,10,16,0.98)",
          border: "1px solid rgba(255,61,0,0.25)",
          boxShadow: "0 0 60px rgba(255,61,0,0.1), 0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "rgba(255,61,0,0.2)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255,61,0,0.12)",
                border: "1px solid rgba(255,61,0,0.3)",
              }}
            >
              <Zap size={16} style={{ color: "#FF6B6B" }} />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                Critical Path Acceleration
              </h2>
              <p className="text-xs" style={{ color: "rgba(176,190,197,0.6)" }}>
                Railway NOC · Chennai Port Highway · Current delay: 234 days
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-smooth"
            style={{ color: "rgba(176,190,197,0.6)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
            data-ocid="execution.acceleration_modal.close_button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Active Blockers */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle size={13} style={{ color: "#FF3D00" }} />
              Active Critical Path Blockers
            </h3>
            <div className="space-y-2">
              {BLOCKERS.map((blocker, i) => (
                <div
                  key={blocker.name}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg"
                  style={{
                    background: `${blocker.color}08`,
                    border: `1px solid ${blocker.color}20`,
                  }}
                  data-ocid={`execution.acceleration_modal.blocker.${i + 1}`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: `${blocker.color}20`,
                        color: blocker.color,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {blocker.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {blocker.project}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color: blocker.color }}
                    >
                      +{blocker.delay}d
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded font-bold"
                      style={{
                        background: `${blocker.color}15`,
                        color: blocker.color,
                        border: `1px solid ${blocker.color}30`,
                      }}
                    >
                      {blocker.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acceleration Strategies */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Choose Acceleration Strategy
            </h3>
            <div className="space-y-3">
              {STRATEGIES.map((s, i) => (
                <button
                  type="button"
                  key={s.title}
                  onClick={() => setSelectedStrategy(i)}
                  className="w-full text-left p-4 rounded-lg cursor-pointer transition-smooth"
                  style={{
                    background:
                      selectedStrategy === i
                        ? `${s.color}0e`
                        : "rgba(26,35,50,0.6)",
                    border: `1px solid ${selectedStrategy === i ? `${s.color}40` : "rgba(255,255,255,0.07)"}`,
                    boxShadow:
                      selectedStrategy === i ? `0 0 20px ${s.color}15` : "none",
                  }}
                  data-ocid={`execution.acceleration_modal.strategy.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor:
                            selectedStrategy === i
                              ? s.color
                              : "rgba(255,255,255,0.2)",
                        }}
                      >
                        {selectedStrategy === i && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: s.color }}
                          />
                        )}
                      </div>
                      <span className="font-semibold text-sm text-foreground">
                        {s.title}
                      </span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded font-bold flex-shrink-0"
                      style={{
                        background: `${s.riskColor}12`,
                        color: s.riskColor,
                        border: `1px solid ${s.riskColor}25`,
                      }}
                    >
                      {s.risk} Risk
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 ml-6">
                    {s.desc}
                  </p>
                  <div className="grid grid-cols-2 gap-3 ml-6">
                    <div
                      className="p-2.5 rounded"
                      style={{
                        background: "rgba(0,230,118,0.06)",
                        border: "1px solid rgba(0,230,118,0.15)",
                      }}
                    >
                      <div className="text-[10px] text-muted-foreground">
                        Timeline Reduction
                      </div>
                      <div
                        className="font-mono font-bold text-lg mt-0.5"
                        style={{ color: "#00E676" }}
                      >
                        {s.timelineDays} days
                      </div>
                    </div>
                    <div
                      className="p-2.5 rounded"
                      style={{
                        background: "rgba(255,179,0,0.06)",
                        border: "1px solid rgba(255,179,0,0.15)",
                      }}
                    >
                      <div className="text-[10px] text-muted-foreground">
                        Cost Impact
                      </div>
                      <div
                        className="font-mono font-bold text-lg mt-0.5"
                        style={{ color: "#FFB300" }}
                      >
                        {s.costImpact}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Confirm / Success */}
          {confirmed ? (
            <div
              className="p-5 rounded-xl text-center"
              style={{
                background: "rgba(0,230,118,0.07)",
                border: "1px solid rgba(0,230,118,0.25)",
              }}
            >
              <CheckCircle2
                size={36}
                className="mx-auto mb-3"
                style={{ color: "#00E676" }}
              />
              <p className="font-bold text-base" style={{ color: "#00E676" }}>
                Acceleration Protocol Initiated
              </p>
              <p className="text-sm text-muted-foreground mt-1 mb-2">
                "
                {selectedStrategy !== null
                  ? STRATEGIES[selectedStrategy].title
                  : ""}
                " — authorized and dispatched to PMU
              </p>
              {selectedStrategy !== null && (
                <p className="text-xs text-muted-foreground mb-4">
                  Projected new completion:{" "}
                  <span className="font-bold text-white">
                    {projectedDate()}
                  </span>{" "}
                  · Saving{" "}
                  <span className="font-bold" style={{ color: "#00E676" }}>
                    {STRATEGIES[selectedStrategy].timelineDays} days
                  </span>
                </p>
              )}
              <button
                type="button"
                onClick={downloadActionPlan}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold mx-auto transition-smooth"
                style={{
                  background: "rgba(0,230,118,0.1)",
                  border: "1px solid rgba(0,230,118,0.3)",
                  color: "#00E676",
                }}
                data-ocid="execution.acceleration_modal.download_button"
              >
                <Download size={14} /> Download Action Plan
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pb-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost flex-1 text-sm border border-border/30 rounded-lg"
                data-ocid="execution.acceleration_modal.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedStrategy === null}
                onClick={() => setConfirmed(true)}
                className="btn-primary flex-1 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                data-ocid="execution.acceleration_modal.confirm_button"
              >
                <Zap size={14} /> Confirm Acceleration Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Modal: AI Recommendations ─────────────────────────────────────────────────

function AIRecommendationsModal({
  onClose,
  project,
}: { onClose: () => void; project?: string }) {
  const [recs, setRecs] = useState<AIRecommendation[]>(AI_RECOMMENDATIONS);

  const accepted = recs.filter((r) => r.accepted);
  const totalImprovement = accepted.reduce(
    (sum, r) => sum + r.delayReduction,
    0,
  );
  const pending = recs.filter((r) => !r.accepted && !r.skipped);

  function handleAccept(id: number) {
    setRecs((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, accepted: true, skipped: false } : r,
      ),
    );
  }

  function handleSkip(id: number) {
    setRecs((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, skipped: true, accepted: false } : r,
      ),
    );
  }

  function impactScoreColor(score: number): string {
    if (score >= 85) return "#FF3D00";
    if (score >= 70) return "#FFB300";
    if (score >= 55) return "#00D4FF";
    return "#00E676";
  }

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      data-ocid="execution.recommendations_modal"
    >
      <div
        className="ml-auto w-full max-w-3xl h-full overflow-y-auto"
        style={{
          background: "rgba(8,10,16,0.98)",
          borderLeft: "1px solid rgba(0,212,255,0.2)",
          boxShadow: "-24px 0 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
          style={{
            background: "rgba(8,10,16,0.98)",
            borderColor: "rgba(0,212,255,0.15)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(0,212,255,0.12)",
                border: "1px solid rgba(0,212,255,0.25)",
              }}
            >
              <Bot size={16} style={{ color: "#00D4FF" }} />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                AI Recommendable Actions
              </h2>
              <p className="text-xs" style={{ color: "rgba(176,190,197,0.6)" }}>
                {project ?? "Bangalore Metro Purple Line"} · {pending.length}{" "}
                actions pending review
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-smooth"
            style={{ color: "rgba(176,190,197,0.6)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
            data-ocid="execution.recommendations_modal.close_button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Predicted Improvement Banner */}
          <div
            className="p-4 rounded-xl flex items-center justify-between gap-4"
            style={{
              background: "rgba(0,212,255,0.07)",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            <div className="flex items-center gap-3">
              <Target size={20} style={{ color: "#00D4FF", flexShrink: 0 }} />
              <div>
                <p className="text-xs text-muted-foreground">
                  Overall Predicted Improvement (if all accepted)
                </p>
                <p
                  className="font-mono font-bold text-2xl mt-0.5"
                  style={{ color: "#00D4FF" }}
                >
                  {AI_RECOMMENDATIONS.reduce((s, r) => s + r.delayReduction, 0)}{" "}
                  days
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Currently Accepted
              </p>
              <p
                className="font-mono font-bold text-2xl mt-0.5"
                style={{ color: "#00E676" }}
              >
                {totalImprovement} days
              </p>
            </div>
          </div>

          {/* Recommendation Cards */}
          <div className="space-y-3">
            {recs.map((rec, i) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl transition-smooth"
                style={{
                  background: rec.accepted
                    ? "rgba(0,230,118,0.05)"
                    : rec.skipped
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(26,35,50,0.7)",
                  border: `1px solid ${rec.accepted ? "rgba(0,230,118,0.2)" : rec.skipped ? "rgba(255,255,255,0.06)" : "rgba(0,212,255,0.12)"}`,
                  opacity: rec.skipped ? 0.5 : 1,
                }}
                data-ocid={`execution.recommendations_modal.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                        style={{
                          background: `${impactScoreColor(rec.impactScore)}18`,
                          color: impactScoreColor(rec.impactScore),
                          border: `1px solid ${impactScoreColor(rec.impactScore)}30`,
                        }}
                      >
                        Score: {rec.impactScore}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded font-bold"
                        style={{
                          background: `${effortColor(rec.effort)}12`,
                          color: effortColor(rec.effort),
                          border: `1px solid ${effortColor(rec.effort)}25`,
                        }}
                      >
                        {rec.effort} Effort
                      </span>
                      {rec.accepted && (
                        <span className="badge-success">✓ ACCEPTED</span>
                      )}
                      {rec.skipped && (
                        <span
                          style={{
                            color: "rgba(176,190,197,0.4)",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                          }}
                        >
                          SKIPPED
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm text-foreground leading-tight">
                      {rec.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {rec.rationale}
                </p>

                {/* Impact Score Bar */}
                <div className="mb-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Impact Score</span>
                    <span
                      className="font-mono font-bold"
                      style={{ color: impactScoreColor(rec.impactScore) }}
                    >
                      Saves ~{rec.delayReduction} days
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${rec.impactScore}%`,
                        background: `linear-gradient(90deg, ${impactScoreColor(rec.impactScore)}66, ${impactScoreColor(rec.impactScore)})`,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                {!rec.accepted && !rec.skipped && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSkip(rec.id)}
                      className="flex-1 text-xs py-1.5 rounded font-semibold transition-smooth"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        color: "rgba(176,190,197,0.6)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.04)";
                      }}
                      data-ocid={`execution.recommendations_modal.skip_button.${i + 1}`}
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccept(rec.id)}
                      className="flex-1 text-xs py-1.5 rounded font-bold transition-smooth"
                      style={{
                        background: "rgba(0,212,255,0.1)",
                        color: "#00D4FF",
                        border: "1px solid rgba(0,212,255,0.25)",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(0,212,255,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(0,212,255,0.1)";
                      }}
                      data-ocid={`execution.recommendations_modal.accept_button.${i + 1}`}
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Accepted Summary */}
          {accepted.length > 0 && (
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(0,230,118,0.05)",
                border: "1px solid rgba(0,230,118,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} style={{ color: "#00E676" }} />
                <h4
                  className="font-semibold text-sm"
                  style={{ color: "#00E676" }}
                >
                  Accepted Actions ({accepted.length})
                </h4>
                <span
                  className="ml-auto font-mono font-bold text-sm"
                  style={{ color: "#00E676" }}
                >
                  Total: -{totalImprovement} days
                </span>
              </div>
              <div className="space-y-1.5">
                {accepted.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight size={11} style={{ color: "#00E676" }} />
                      <span className="text-xs text-foreground">{r.title}</span>
                    </div>
                    <span
                      className="font-mono text-xs flex-shrink-0"
                      style={{ color: "#00E676" }}
                    >
                      -{r.delayReduction}d
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 text-sm border border-border/30 rounded-lg"
              data-ocid="execution.recommendations_modal.close_button"
            >
              Close
            </button>
            {accepted.length > 0 && (
              <button
                type="button"
                className="btn-primary flex-1 text-sm"
                data-ocid="execution.recommendations_modal.submit_button"
              >
                Submit {accepted.length} Actions to PMU
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CircularGauge({
  value,
  color,
  label,
  status,
}: {
  value: number;
  color: string;
  label: string;
  status: ResourceGauge["status"];
}) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const fill = circ - (circ * value) / 100;
  return (
    <div className="flex flex-col items-center gap-2 py-3">
      <div className="relative w-24 h-24">
        <svg
          className="w-24 h-24 -rotate-90"
          viewBox="0 0 100 100"
          aria-label={`${label}: ${value}%`}
          role="img"
        >
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${circ}`}
            strokeDashoffset={fill}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${color}88)`,
              transition: "stroke-dashoffset 1s ease",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-bold text-lg leading-none"
            style={{ color }}
          >
            {value}%
          </span>
        </div>
      </div>
      <p className="text-xs text-center text-foreground font-medium leading-tight max-w-[80px]">
        {label}
      </p>
      <span className={gaugeStatusClass(status)}>{status}</span>
    </div>
  );
}

function MilestoneRow({ m, idx }: { m: Milestone; idx: number }) {
  const icon =
    m.status === "COMPLETED" ? "✓" : m.status === "IN PROGRESS" ? "⏳" : "○";
  const iconColor =
    m.status === "COMPLETED"
      ? "#00E676"
      : m.status === "IN PROGRESS"
        ? "#00D4FF"
        : "rgba(176,190,197,0.4)";
  const badgeCls =
    m.status === "COMPLETED"
      ? "badge-success"
      : m.status === "IN PROGRESS"
        ? "badge-low"
        : "";
  return (
    <div
      className="flex items-start gap-3 py-2.5 border-b border-border/10 last:border-0"
      data-ocid={`execution.milestone.item.${idx + 1}`}
    >
      <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
        <span
          className="text-sm font-bold w-6 text-center leading-none"
          style={{ color: iconColor }}
        >
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-foreground">
            {m.name}
          </span>
          {badgeCls && <span className={badgeCls}>{m.status}</span>}
          {m.slippage && (
            <span className="badge-high">⚠ +{m.slippage}d slipped</span>
          )}
        </div>
        {m.progress !== undefined && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${m.progress}%`,
                  background: "linear-gradient(90deg,#00b8d4,#00d4ff)",
                }}
              />
            </div>
            <span className="font-mono text-primary text-xs">
              {m.progress}%
            </span>
          </div>
        )}
      </div>
      <span
        className="text-xs font-mono flex-shrink-0"
        style={{ color: "rgba(176,190,197,0.6)" }}
      >
        {m.date}
      </span>
    </div>
  );
}

function UserMilestoneCard({ m, idx }: { m: UserMilestone; idx: number }) {
  return (
    <div
      className="p-3 rounded-lg mb-2"
      style={{
        background: `${priorityColor(m.priority)}08`,
        border: `1px solid ${priorityColor(m.priority)}25`,
      }}
      data-ocid={`execution.user_milestone.item.${idx + 1}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <span className="text-xs font-bold text-foreground">{m.name}</span>
          <p className="text-xs text-muted-foreground mt-0.5">{m.project}</p>
        </div>
        <span className={priorityBadgeClass(m.priority)}>{m.priority}</span>
      </div>
      <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
        <span>🗓 {m.targetDate}</span>
        <span>👤 {m.responsibleParty}</span>
      </div>
      {m.description && (
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          {m.description}
        </p>
      )}
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${m.completionPct}%`,
              background: `linear-gradient(90deg, ${priorityColor(m.priority)}66, ${priorityColor(m.priority)})`,
            }}
          />
        </div>
        <span
          className="font-mono text-xs"
          style={{ color: priorityColor(m.priority) }}
        >
          {m.completionPct}%
        </span>
      </div>
    </div>
  );
}

function PermitRow({ p, idx }: { p: Permit; idx: number }) {
  const s = permitStatusStyle(p.status);
  return (
    <div
      className={`flex items-start gap-3 py-2.5 border-b border-border/10 last:border-0 ${p.blocking ? "bg-red-500/5" : ""}`}
      data-ocid={`execution.permit.item.${idx + 1}`}
    >
      <span
        className="text-sm font-bold w-5 text-center flex-shrink-0 mt-0.5"
        style={{ color: s.color }}
      >
        {s.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">
          {p.name}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: p.blocking ? "#FF6D00" : "rgba(176,190,197,0.6)" }}
        >
          {p.note}
        </p>
      </div>
      {s.cls && <span className={`${s.cls} flex-shrink-0`}>{p.status}</span>}
    </div>
  );
}

function DelayCard({
  d,
  idx,
  onViewActions,
}: {
  d: DelayPrediction;
  idx: number;
  onViewActions: (project: string) => void;
}) {
  const probColor =
    d.probability >= 90
      ? "#FF3D00"
      : d.probability >= 80
        ? "#FF6D00"
        : d.probability >= 70
          ? "#FFB300"
          : "#00D4FF";
  return (
    <div
      className="glass-card p-3 space-y-2"
      data-ocid={`execution.delay_prediction.item.${idx + 1}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-foreground leading-tight">
          {d.project}
        </p>
        <span
          className="font-mono font-bold text-sm flex-shrink-0"
          style={{ color: probColor }}
        >
          {d.probability}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${d.probability}%`,
            background: `linear-gradient(90deg, ${probColor}88, ${probColor})`,
          }}
        />
      </div>
      <p className="text-label" style={{ fontSize: "0.65rem" }}>
        {d.probability}% probability of &gt;{d.months} month delay
      </p>
      <p className="text-xs text-muted-foreground leading-snug">{d.cause}</p>
      <button
        type="button"
        onClick={() => onViewActions(d.project)}
        className="btn-secondary text-xs w-full py-1.5"
        data-ocid={`execution.delay_action_button.${idx + 1}`}
      >
        View Recommended Actions
      </button>
    </div>
  );
}

// ── Modal: Filter Panel ───────────────────────────────────────────────────────

const FILTER_STATUSES = ["All", "ON TRACK", "AT RISK", "DELAYED", "CRITICAL"];
const FILTER_SECTORS = [
  "All",
  "Roads",
  "Railways",
  "Urban",
  "Energy",
  "Ports",
  "Airports",
];
const FILTER_STATES = [
  "All",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
  "West Bengal",
  "Telangana",
  "Andhra Pradesh",
  "Kerala",
  "Bihar",
  "Jharkhand",
  "Odisha",
  "Punjab",
  "Haryana",
];

function FilterPanel({
  onClose,
  filterStatus,
  setFilterStatus,
  filterSector,
  setFilterSector,
  filterState,
  setFilterState,
  onApply,
  onReset,
}: {
  onClose: () => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterSector: string;
  setFilterSector: (v: string) => void;
  filterState: string;
  setFilterState: (v: string) => void;
  onApply: () => void;
  onReset: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      data-ocid="execution.filter_modal"
    >
      <div
        className="w-full max-w-lg rounded-xl overflow-hidden"
        style={{
          background: "rgba(10,12,18,0.97)",
          border: "1px solid rgba(0,212,255,0.25)",
          boxShadow:
            "0 0 60px rgba(0,212,255,0.12), 0 24px 60px rgba(0,0,0,0.6)",
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
              <Filter size={14} style={{ color: "#00D4FF" }} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-foreground">
                Filter Projects
              </h2>
              <p className="text-xs" style={{ color: "rgba(176,190,197,0.6)" }}>
                Narrow results by status, sector, or state
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-smooth"
            style={{ color: "rgba(176,190,197,0.6)" }}
            data-ocid="execution.filter_modal.close_button"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Filter */}
          <div>
            <label
              htmlFor="filter-status"
              className="block text-xs font-semibold text-muted-foreground mb-2"
              style={{ letterSpacing: "0.08em" }}
            >
              PROJECT STATUS
            </label>
            <div className="flex flex-wrap gap-2">
              {FILTER_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilterStatus(s)}
                  data-ocid={`execution.filter_modal.status.${s.toLowerCase().replace(/ /g, "_")}`}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-smooth"
                  style={{
                    background:
                      filterStatus === s
                        ? "rgba(0,212,255,0.15)"
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${filterStatus === s ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                    color:
                      filterStatus === s ? "#00D4FF" : "rgba(176,190,197,0.7)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sector Filter */}
          <div>
            <label
              htmlFor="filter-sector"
              className="block text-xs font-semibold text-muted-foreground mb-2"
              style={{ letterSpacing: "0.08em" }}
            >
              SECTOR
            </label>
            <select
              id="filter-sector"
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none"
              style={{
                background: "rgba(26,35,50,0.9)",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
              data-ocid="execution.filter_modal.sector_select"
            >
              {FILTER_SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label
              htmlFor="filter-state"
              className="block text-xs font-semibold text-muted-foreground mb-2"
              style={{ letterSpacing: "0.08em" }}
            >
              STATE
            </label>
            <select
              id="filter-state"
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none"
              style={{
                background: "rgba(26,35,50,0.9)",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
              data-ocid="execution.filter_modal.state_select"
            >
              {FILTER_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters Summary */}
          {(filterStatus !== "All" ||
            filterSector !== "All" ||
            filterState !== "All") && (
            <div
              className="p-3 rounded-lg text-xs"
              style={{
                background: "rgba(0,212,255,0.06)",
                border: "1px solid rgba(0,212,255,0.18)",
              }}
            >
              <p className="font-semibold text-primary mb-1">Active Filters</p>
              <div className="flex flex-wrap gap-2">
                {filterStatus !== "All" && (
                  <span className="badge-low">Status: {filterStatus}</span>
                )}
                {filterSector !== "All" && (
                  <span className="badge-low">Sector: {filterSector}</span>
                )}
                {filterState !== "All" && (
                  <span className="badge-low">State: {filterState}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex gap-3 px-6 py-4 border-t"
          style={{ borderColor: "rgba(0,212,255,0.12)" }}
        >
          <button
            type="button"
            onClick={() => {
              onReset();
              onClose();
            }}
            className="btn-ghost flex-1 text-sm border border-border/30 rounded-lg"
            data-ocid="execution.filter_modal.reset_button"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="btn-primary flex-1 text-sm"
            data-ocid="execution.filter_modal.apply_button"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ExecutionPage() {
  const { selectedOrg } = useOrg();
  const orgData = getOrgData(selectedOrg.key);
  const PROJECTS = orgData.projects;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // Modal states
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showTrackDelay, setShowTrackDelay] = useState(false);
  const [showAcceleration, setShowAcceleration] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [activeRecommendationProject, setActiveRecommendationProject] =
    useState<string | undefined>(undefined);

  // Filter state
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterSector, setFilterSector] = useState<string>("All");
  const [filterState, setFilterState] = useState<string>("All");
  const [appliedStatus, setAppliedStatus] = useState<string>("All");
  const [appliedSector, setAppliedSector] = useState<string>("All");
  const [appliedState, setAppliedState] = useState<string>("All");

  // User-added milestones
  const [userMilestones, setUserMilestones] = useState<UserMilestone[]>([]);

  const filteredProjects = PROJECTS.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contractor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      appliedStatus === "All" ||
      p.status.toUpperCase() === appliedStatus.toUpperCase();
    const matchesSector =
      appliedSector === "All" ||
      p.type.toLowerCase().includes(appliedSector.toLowerCase());
    const matchesState =
      appliedState === "All" ||
      p.state.toLowerCase().includes(appliedState.toLowerCase());
    return matchesSearch && matchesStatus && matchesSector && matchesState;
  });

  function handleAddMilestone(m: UserMilestone) {
    setUserMilestones((prev) => [m, ...prev]);
  }

  function handleViewActions(project: string) {
    setActiveRecommendationProject(project);
    setShowRecommendations(true);
  }

  return (
    <div
      className="p-6 space-y-5 min-h-full"
      style={{ animation: "fadeInUp 0.35s ease both" }}
      data-ocid="execution.page"
    >
      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {showAddMilestone && (
        <AddMilestoneModal
          onClose={() => setShowAddMilestone(false)}
          onAdd={(m) => {
            handleAddMilestone(m);
          }}
        />
      )}
      {showTrackDelay && (
        <TrackDelayDrawer onClose={() => setShowTrackDelay(false)} />
      )}
      {showAcceleration && (
        <AccelerationModal onClose={() => setShowAcceleration(false)} />
      )}
      {showRecommendations && (
        <AIRecommendationsModal
          onClose={() => {
            setShowRecommendations(false);
            setActiveRecommendationProject(undefined);
          }}
          project={activeRecommendationProject}
        />
      )}
      {showFilter && (
        <FilterPanel
          onClose={() => setShowFilter(false)}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterSector={filterSector}
          setFilterSector={setFilterSector}
          filterState={filterState}
          setFilterState={setFilterState}
          onApply={() => {
            setAppliedStatus(filterStatus);
            setAppliedSector(filterSector);
            setAppliedState(filterState);
          }}
          onReset={() => {
            setFilterStatus("All");
            setFilterSector("All");
            setFilterState("All");
            setAppliedStatus("All");
            setAppliedSector("All");
            setAppliedState("All");
          }}
        />
      )}

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
            <span>Home</span>
            <ChevronRight size={10} />
            <span>Intelligence Modules</span>
            <ChevronRight size={10} />
            <span className="text-primary">Execution Intelligence</span>
          </nav>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-label text-xs tracking-widest"
              style={{ color: "#00D4FF" }}
            >
              PROJECT DELIVERY ENGINE
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            Execution Intelligence
          </h1>
          <div className="flex flex-wrap gap-4 mt-2">
            {[
              {
                label: "Active Projects",
                value: orgData.kpis.totalProjects.toString(),
                color: "#00D4FF",
              },
              {
                label: "On Track",
                value: Math.round(
                  (orgData.kpis.totalProjects * orgData.kpis.onTrackPct) / 100,
                ).toString(),
                color: "#00E676",
              },
              {
                label: "At Risk",
                value: Math.round(orgData.kpis.totalProjects * 0.25).toString(),
                color: "#FFB300",
              },
              {
                label: "Delayed",
                value: orgData.kpis.delayedProjects.toString(),
                color: "#FF6D00",
              },
              {
                label: "Critical",
                value: Math.round(
                  orgData.kpis.delayedProjects * 0.18,
                ).toString(),
                color: "#FF3D00",
              },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span
                  className="font-mono font-bold text-sm"
                  style={{ color: s.color }}
                >
                  {s.value}
                </span>
                <span className="text-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded glass-card"
            style={{ minWidth: 180 }}
          >
            <Search size={13} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search projects…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full"
              data-ocid="execution.search_input"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilter(true)}
            className="btn-ghost text-xs flex items-center gap-1.5 px-3 py-2 border border-border/40 rounded"
            data-ocid="execution.filter_button"
            style={
              appliedStatus !== "All" ||
              appliedSector !== "All" ||
              appliedState !== "All"
                ? { borderColor: "rgba(0,212,255,0.5)", color: "#00D4FF" }
                : undefined
            }
          >
            <Filter size={13} />
            Filter
            {(appliedStatus !== "All" ||
              appliedSector !== "All" ||
              appliedState !== "All") && (
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "#00D4FF" }}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowTrackDelay(true)}
            className="btn-secondary text-xs flex items-center gap-1.5"
            data-ocid="execution.track_delay_button"
          >
            <Clock size={13} />
            Track Delay
          </button>
          <button
            type="button"
            onClick={() => setShowAddMilestone(true)}
            className="btn-primary text-xs flex items-center gap-1.5"
            data-ocid="execution.add_milestone_button"
          >
            <Plus size={13} />
            Add Milestone
          </button>
        </div>
      </div>

      {/* ── Section 1: Mini KPI Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Avg Completion",
            value: "47.3%",
            icon: TrendingUp,
            color: "#00D4FF",
            sub: "Across all active",
          },
          {
            label: "Avg Delay",
            value: "89 days",
            icon: Clock,
            color: "#FF6D00",
            sub: "Portfolio average",
          },
          {
            label: "Projects At Risk",
            value: "346",
            icon: AlertTriangle,
            color: "#FFB300",
            sub: "Needs intervention",
          },
          {
            label: "Permit Backlog",
            value: "234",
            icon: Layers,
            color: "#FF3D00",
            sub: "NOCs pending",
          },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="glass-card kpi-glow p-4"
              data-ocid={`execution.kpi.${i + 1}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-label">{k.label}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${k.color}18` }}
                >
                  <Icon size={14} style={{ color: k.color }} />
                </div>
              </div>
              <div
                className="font-mono font-bold text-xl"
                style={{ color: k.color }}
              >
                {k.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Section 2: NH Construction Pace ──────────────────────────────── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="execution.nh_pace_panel"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" />
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                National Highway Construction Rate
              </h2>
              <p className="text-label" style={{ fontSize: "0.62rem" }}>
                km/day — FY14 to FY24 · Peak: 33.8 km/day (FY24)
              </p>
            </div>
          </div>
          <span
            className="font-mono font-bold text-xl"
            style={{ color: "#00E676" }}
          >
            33.8 km/day
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 py-3 border-b border-border/20">
          {[
            {
              label: "Current Pace (FY24)",
              value: "33.8 km/day",
              sub: "vs 12.1 km/day in FY14",
              color: "#00E676",
            },
            {
              label: "High-Speed Corridors",
              value: "2,474 km",
              sub: "vs 93 km in FY14",
              color: "#00D4FF",
            },
            {
              label: "Rail Pre-Alignment Pace",
              value: "12 km/day",
              sub: "vs 4 km/day earlier",
              color: "#FFB300",
            },
            {
              label: "Location Surveys FY22",
              value: "449 surveys",
              sub: "vs 21 surveys in FY21",
              color: "#FF8C42",
            },
          ].map((k, i) => (
            <div
              key={k.label}
              className="glass-elevated rounded p-3"
              data-ocid={`execution.nh_kpi.${i + 1}`}
            >
              <div className="text-label mb-1" style={{ fontSize: "0.62rem" }}>
                {k.label}
              </div>
              <div
                className="font-mono font-bold text-base"
                style={{ color: k.color }}
              >
                {k.value}
              </div>
              <div
                className="text-label mt-0.5"
                style={{ fontSize: "0.6rem", color: "rgba(176,190,197,0.5)" }}
              >
                {k.sub}
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 pt-3 pb-2" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={NH_PACE_DATA}
              margin={{ top: 4, right: 8, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                tick={{ fill: "rgba(176,190,197,0.6)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(176,190,197,0.6)", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                unit=" km"
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
                  _name: string,
                  entry: { payload?: { corridors?: number; year?: string } },
                ) => [
                  `${value} km/day | High-speed corridors: ${entry.payload?.corridors ?? 0} km`,
                  entry.payload?.year ?? "",
                ]}
              />
              <Bar dataKey="kmPerDay" radius={[3, 3, 0, 0]} name="km/day">
                {NH_PACE_DATA.map((entry) => (
                  <Cell
                    key={`cell-${entry.year}`}
                    fill={
                      entry.year === "FY24"
                        ? "#00E676"
                        : entry.kmPerDay >= 13
                          ? "#00B8D4"
                          : "#007B9A"
                    }
                    opacity={entry.year === "FY24" ? 1 : 0.75}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Section 3: Active Projects Table ─────────────────────────────── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="execution.projects_panel"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-primary" />
            <h2 className="font-semibold text-sm text-foreground">
              Active Projects — Execution Overview
            </h2>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                background: "rgba(0,212,255,0.1)",
                color: "#00D4FF",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
            >
              {filteredProjects.length} projects
            </span>
          </div>
          <button
            type="button"
            className="text-xs text-primary hover:text-primary/80 transition-colors"
            data-ocid="execution.view_all_button"
          >
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/20">
                {[
                  "Project Name",
                  "State",
                  "Type",
                  "Contractor",
                  "Value",
                  "Progress",
                  "Delay",
                  "Status",
                  "Risk",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2.5 text-label whitespace-nowrap"
                    style={{ fontSize: "0.62rem" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-border/10 transition-smooth cursor-pointer ${selectedProject === p.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-white/3"}`}
                  onClick={() =>
                    setSelectedProject(selectedProject === p.id ? null : p.id)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setSelectedProject(
                        selectedProject === p.id ? null : p.id,
                      );
                  }}
                  tabIndex={0}
                  data-ocid={`execution.project.item.${i + 1}`}
                >
                  <td className="px-3 py-2.5">
                    <p
                      className="font-semibold text-foreground leading-tight"
                      style={{ maxWidth: 220, minWidth: 180 }}
                    >
                      {p.name}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                    {p.state}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(0,212,255,0.07)",
                        color: "rgba(0,212,255,0.85)",
                        border: "1px solid rgba(0,212,255,0.15)",
                      }}
                    >
                      {p.type}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                    {p.contractor}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-primary whitespace-nowrap">
                    {p.value}
                  </td>
                  <td className="px-3 py-2.5" style={{ minWidth: 110 }}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${p.progress}%`,
                            background: `linear-gradient(90deg, ${progressColor(p.status)}88, ${progressColor(p.status)})`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground w-8 text-right">
                        {p.progress}%
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-3 py-2.5 font-mono whitespace-nowrap"
                    style={{ color: p.delay > 0 ? "#FF6D00" : "#00E676" }}
                  >
                    {p.delay > 0 ? `+${p.delay}d` : "On time"}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className={statusBadgeClass(p.status)}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className={riskBadgeClass(p.risk)}>{p.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 4: Milestone + Permit Tracking ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Milestone Tracking */}
        <div
          className="lg:col-span-3 glass-card overflow-hidden"
          data-ocid="execution.milestone_panel"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <GitBranch size={14} className="text-primary" />
              <div>
                <h2 className="font-semibold text-sm text-foreground">
                  Milestone Tracking
                </h2>
                <p className="text-label" style={{ fontSize: "0.6rem" }}>
                  Delhi-Meerut RRTS Phase 2 Corridor
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="font-mono font-bold text-base text-primary">
                  62%
                </div>
                <div className="text-label" style={{ fontSize: "0.58rem" }}>
                  COMPLETE
                </div>
              </div>
              <div>
                <div className="font-mono font-bold text-base text-yellow-400">
                  +127d
                </div>
                <div className="text-label" style={{ fontSize: "0.58rem" }}>
                  DELAYED
                </div>
              </div>
            </div>
          </div>

          {/* User-added milestones */}
          {userMilestones.length > 0 && (
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                <Plus size={11} className="text-primary" />
                Newly Added ({userMilestones.length})
              </p>
              {userMilestones.map((m, idx) => (
                <UserMilestoneCard key={m.id} m={m} idx={idx} />
              ))}
            </div>
          )}

          <div className="px-4 py-1">
            {MILESTONES.map((m, idx) => (
              <MilestoneRow key={m.id} m={m} idx={idx} />
            ))}
          </div>

          <div
            className="mx-4 mb-4 mt-2 p-3 rounded-lg flex items-start gap-3"
            style={{
              background: "rgba(0,212,255,0.07)",
              border: "1px solid rgba(0,212,255,0.18)",
            }}
            data-ocid="execution.milestone_ai_forecast"
          >
            <Bot size={14} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-primary mb-1">
                AI Delay Forecast
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Based on current velocity, projected completion is{" "}
                <span className="text-yellow-400 font-semibold">
                  March 2027
                </span>
                . Total slippage risk:{" "}
                <span className="text-red-400 font-semibold">4.5 months</span>.
                Viaduct Sec B is the critical bottleneck — immediate resource
                reallocation recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Permit & NOC Tracking */}
        <div
          className="lg:col-span-2 glass-card overflow-hidden"
          data-ocid="execution.permit_panel"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <Layers size={14} className="text-primary" />
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                Permit & NOC Tracking
              </h2>
              <p className="text-label" style={{ fontSize: "0.6rem" }}>
                Dependency Chain — Chennai Port Highway
              </p>
            </div>
          </div>

          <div className="px-4 py-1">
            {PERMITS.map((p, idx) => (
              <PermitRow key={p.id} p={p} idx={idx} />
            ))}
          </div>

          {/* Critical path alert with Accelerate Now */}
          <div
            className="mx-4 mb-4 mt-2 p-3 rounded-lg"
            style={{
              background: "rgba(255,61,0,0.08)",
              border: "1px solid rgba(255,61,0,0.25)",
            }}
            data-ocid="execution.critical_path_alert"
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={12} style={{ color: "#FF3D00" }} />
              <p className="text-xs font-bold" style={{ color: "#FF6B6B" }}>
                Critical Path Alert
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Railway NOC is on critical path. Current delay:{" "}
              <span className="text-red-400 font-semibold">234 days</span>.
              Escalation recommended to{" "}
              <span className="text-foreground font-semibold">
                Joint Secretary, MoR
              </span>
              .
            </p>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                className="text-xs font-semibold"
                style={{ color: "#FF6B6B" }}
                data-ocid="execution.escalation_button"
              >
                Escalate Now →
              </button>
              <button
                type="button"
                onClick={() => setShowAcceleration(true)}
                className="text-xs font-bold px-3 py-1 rounded transition-smooth"
                style={{
                  background: "rgba(255,61,0,0.12)",
                  color: "#FF8C42",
                  border: "1px solid rgba(255,61,0,0.25)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,61,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,61,0,0.12)";
                }}
                data-ocid="execution.accelerate_button"
              >
                ⚡ Accelerate Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 5: AI Delay Prediction + Resource Gauges ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* AI Delay Prediction Engine */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="execution.delay_prediction_panel"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <Bot size={14} className="text-primary" />
            <h2 className="font-semibold text-sm text-foreground">
              AI Delay Prediction Engine
            </h2>
            <span
              className="ml-auto text-xs font-mono px-2 py-0.5 rounded"
              style={{
                background: "rgba(0,212,255,0.08)",
                color: "#00D4FF",
                border: "1px solid rgba(0,212,255,0.18)",
              }}
            >
              LIVE
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DELAY_PREDICTIONS.map((d, idx) => (
              <DelayCard
                key={d.project}
                d={d}
                idx={idx}
                onViewActions={handleViewActions}
              />
            ))}
          </div>
        </div>

        {/* Resource Productivity Gauges */}
        <div
          className="glass-card overflow-hidden"
          data-ocid="execution.resource_panel"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <TrendingUp size={14} className="text-primary" />
            <h2 className="font-semibold text-sm text-foreground">
              Resource Productivity Gauges
            </h2>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RESOURCE_GAUGES.map((g, idx) => (
              <div
                key={g.label}
                data-ocid={`execution.resource_gauge.${idx + 1}`}
                className="glass-card"
              >
                <CircularGauge
                  value={g.value}
                  color={gaugeStatusColor(g.status)}
                  label={g.label}
                  status={g.status}
                />
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <div
              className="p-3 rounded-lg"
              style={{
                background: "rgba(255,179,0,0.07)",
                border: "1px solid rgba(255,179,0,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={12} style={{ color: "#FFB300" }} />
                <p
                  className="text-xs font-semibold"
                  style={{ color: "#FFB300" }}
                >
                  Resource Intelligence Summary
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Material delivery index at{" "}
                <span className="text-yellow-400 font-semibold">61%</span> is
                the leading risk indicator. Sub-contractor performance at{" "}
                <span className="text-red-400 font-semibold">56%</span> signals
                potential project acceleration failure across 3 packages in
                Maharashtra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
