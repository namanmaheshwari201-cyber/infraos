import {
  AlertCircle,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  Download,
  Eye,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  Globe,
  HardHat,
  Layers,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Shield,
  TrendingDown,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useOrg } from "../context/OrgContext";
import { getOrgData } from "../data/orgData";

// ── Types ─────────────────────────────────────────────────────────────────────
type ReportStatus = "READY" | "PROCESSING" | "SCHEDULED";
type WizardStep = 1 | 2 | 3 | 4 | 5;
type ImportStep = 1 | 2 | 3 | 4;
type ScheduleFrequency = "daily" | "weekly" | "monthly" | "quarterly";

interface SavedReport {
  name: string;
  type: string;
  module: string;
  createdBy: string;
  date: string;
  status: ReportStatus;
}

interface ReportTemplate {
  icon: React.ElementType;
  name: string;
  description: string;
  color: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const SAVED_REPORTS: SavedReport[] = [
  {
    name: "Q1 2026 Infrastructure Risk Summary",
    type: "Executive Report",
    module: "Dashboard",
    createdBy: "Naman Maheshwari",
    date: "01 Apr 2026",
    status: "READY",
  },
  {
    name: "NH-44 Mumbai-Nagpur Tender Analysis",
    type: "Procurement Report",
    module: "Procurement",
    createdBy: "Priya Sharma",
    date: "28 Mar 2026",
    status: "READY",
  },
  {
    name: "Bangalore Metro Execution Review",
    type: "Execution Report",
    module: "Execution",
    createdBy: "Amit Singh",
    date: "25 Mar 2026",
    status: "READY",
  },
  {
    name: "Maharashtra Claims Intelligence Q1",
    type: "Commercial Report",
    module: "Commercial Risk",
    createdBy: "Sunita Patel",
    date: "20 Mar 2026",
    status: "READY",
  },
  {
    name: "WB PWD Governance Audit Q1 2026",
    type: "Governance Report",
    module: "Governance",
    createdBy: "Naman Maheshwari",
    date: "15 Mar 2026",
    status: "READY",
  },
  {
    name: "Critical Bridge Health Assessment",
    type: "Asset Report",
    module: "Asset Intelligence",
    createdBy: "Meera Iyer",
    date: "10 Mar 2026",
    status: "READY",
  },
  {
    name: "National Vendor Credibility Scan",
    type: "Vendor Report",
    module: "Vendors",
    createdBy: "Vikram Singh",
    date: "05 Mar 2026",
    status: "READY",
  },
  {
    name: "Full Platform Intelligence Q4 2025",
    type: "Comprehensive",
    module: "All Modules",
    createdBy: "Naman Maheshwari",
    date: "01 Jan 2026",
    status: "READY",
  },
];

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    icon: Building2,
    name: "Executive Summary",
    description:
      "High-level KPI snapshot for ministers and board-level decision makers.",
    color: "#00D4FF",
  },
  {
    icon: BarChart3,
    name: "Detailed Analysis",
    description:
      "Full module-level drill-down with charts, tables, and AI observations.",
    color: "#00E676",
  },
  {
    icon: BookOpen,
    name: "Ministry Brief",
    description:
      "Structured policy-ready brief with risk flags, SLA data, and escalation log.",
    color: "#FF8C42",
  },
  {
    icon: BriefcaseBusiness,
    name: "Investor Report",
    description:
      "Infrastructure project health dashboard for fund managers and DFI analysts.",
    color: "#B66DFF",
  },
];

const WIZARD_SECTIONS = [
  "Risk Summary",
  "Tender Pipeline",
  "Execution Status",
  "Claims & Commercial",
  "Governance Flags",
  "Asset Health",
  "AI Insights",
];

const MODULE_COLORS: Record<string, string> = {
  Dashboard: "#00D4FF",
  Procurement: "#B66DFF",
  Execution: "#00E676",
  "Commercial Risk": "#FF8C42",
  Governance: "#FF6B6B",
  "Asset Intelligence": "#FFB300",
  Vendors: "#00D4FF",
  "All Modules": "#00D4FF",
};

const EXPORT_FORMATS = [
  {
    label: "PDF Report",
    icon: FileText,
    desc: "Formatted printable document",
    color: "#FF6B6B",
  },
  {
    label: "Excel (.xlsx)",
    icon: FileSpreadsheet,
    desc: "Full data with pivot tables",
    color: "#00E676",
  },
  {
    label: "PowerPoint",
    icon: BarChart3,
    desc: "Slide-ready executive deck",
    color: "#FF8C42",
  },
  {
    label: "CSV Data",
    icon: FileBarChart,
    desc: "Raw structured data export",
    color: "#00D4FF",
  },
];

const SCHEDULED_REPORTS_SAMPLE = [
  {
    name: "Weekly Execution Summary",
    freq: "Weekly · Mon 08:00",
    recipients: "naman.maheshwari@infraos.gov.in",
    format: "PDF",
    id: "SCHED/2024/0019",
    status: "ACTIVE",
  },
  {
    name: "Monthly Risk Dashboard",
    freq: "Monthly · 1st 09:00",
    recipients: "priya.sharma@infraos.gov.in",
    format: "Excel",
    id: "SCHED/2024/0020",
    status: "ACTIVE",
  },
  {
    name: "Quarterly Governance Audit",
    freq: "Quarterly · 1st 10:00",
    recipients: "amit.singh@infraos.gov.in",
    format: "PDF",
    id: "SCHED/2024/0021",
    status: "PAUSED",
  },
];

const INFRA_OS_FIELDS = [
  "Project ID",
  "Project Name",
  "Investment Value (₹ Cr)",
  "Status",
  "State",
  "Ministry",
  "Start Date",
  "Completion Date",
  "Delay (days)",
  "Cost Overrun (%)",
  "Contractor",
  "Risk Level",
];

const PREVIEW_ROWS = [
  {
    id: "NHAI-2024-001",
    cols: ["NH-44 Nagpur–Hyderabad", "4200", "DELAYED", "Maharashtra", "MoRTH"],
  },
  {
    id: "NHAI-2024-002",
    cols: [
      "Delhi–Meerut Expressway",
      "8450",
      "ON TRACK",
      "Uttar Pradesh",
      "NHAI",
    ],
  },
  {
    id: "RVNL-2024-015",
    cols: ["Mumbai–Ahmedabad HSR", "1,08,000", "CRITICAL", "Gujarat", "MoR"],
  },
  {
    id: "CPWD-2024-031",
    cols: ["AIIMS Patna Expansion", "980", "ON TRACK", "Bihar", "MoHFW"],
  },
  {
    id: "DMRC-2024-008",
    cols: ["Phase-4 Aerocity–Tughlaqabad", "3750", "DELAYED", "Delhi", "MoHUA"],
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReportStatus }) {
  if (status === "READY")
    return (
      <span className="flex items-center gap-1 badge-success">
        <CheckCircle2 size={10} /> READY
      </span>
    );
  if (status === "PROCESSING")
    return <span className="badge-warning">PROCESSING</span>;
  return <span className="badge-low">SCHEDULED</span>;
}

function ModuleDot({ module }: { module: string }) {
  const color = MODULE_COLORS[module] ?? "#00D4FF";
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      <span className="text-xs text-muted-foreground">{module}</span>
    </span>
  );
}

// ── Import Template Modal ─────────────────────────────────────────────────────
function ImportTemplateModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<ImportStep>(1);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [fileName, setFileName] = useState("");
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const FORMATS = [
    {
      id: "xlsx",
      label: "Excel Template",
      ext: ".xlsx",
      icon: FileSpreadsheet,
      color: "#00E676",
      desc: "Multi-sheet workbook with pivot-ready data",
      sample: "Project_ID, Name, Value, Status, Delay_Days, Contractor",
    },
    {
      id: "csv",
      label: "CSV Template",
      ext: ".csv",
      icon: FileBarChart,
      color: "#00D4FF",
      desc: "Flat structured data, compatible with all tools",
      sample: "project_id,name,investment,status,state,ministry",
    },
    {
      id: "pdf",
      label: "PDF Template",
      ext: ".pdf",
      icon: FileText,
      color: "#FF8C42",
      desc: "Formatted report layout with InfraOS branding",
      sample: "Executive Summary · Sections · Charts · Appendix",
    },
  ];

  const SAMPLE_COLUMNS = [
    "Project_ID",
    "Project_Name",
    "Investment_Cr",
    "Status",
    "State_Name",
    "Ministry",
    "Start_Date",
    "Target_Date",
  ];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFileName(f.name);
  }

  const stepLabels = [
    "Select Format",
    "Upload File",
    "Preview & Map",
    "Confirm",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.8)" }}
      data-ocid="import_template.dialog"
    >
      <div
        className="glass-elevated w-full max-w-2xl mx-4 flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.25)",
              }}
            >
              <Upload size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-label text-[10px] mb-0.5">REPORTS ENGINE</p>
              <h3 className="text-base font-bold text-foreground">
                Import Report Template
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-1.5"
            aria-label="Close"
            data-ocid="import_template.close_button"
          >
            <X size={15} />
          </button>
        </div>

        {/* Step indicator */}
        {!done && (
          <div className="flex items-center gap-0 px-6 py-3 border-b border-border/30">
            {stepLabels.map((label, idx) => {
              const s = (idx + 1) as ImportStep;
              const active = step === s;
              const completed = step > s;
              return (
                <div key={label} className="flex items-center">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-smooth
                      ${active ? "bg-primary text-background" : completed ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {completed ? <CheckCircle2 size={12} /> : s}
                    </div>
                    <span
                      className={`text-[10px] font-semibold hidden sm:block ${active ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {label}
                    </span>
                  </div>
                  {idx < stepLabels.length - 1 && (
                    <div
                      className={`h-px w-6 mx-2 ${completed ? "bg-primary/40" : "bg-border"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Step 1 — Select Format */}
          {step === 1 && !done && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-4">
                Choose the template format you'd like to import
              </p>
              <div className="grid gap-3">
                {FORMATS.map(
                  ({ id, label, ext, icon: Icon, color, desc, sample }) => (
                    <button
                      key={id}
                      type="button"
                      data-ocid={`import_template.format.${id}`}
                      onClick={() => setSelectedFormat(id)}
                      className={`flex items-start gap-4 p-4 rounded-lg text-left transition-smooth border
                      ${selectedFormat === id ? "border-primary bg-primary/8" : "glass-card hover:border-primary/30"}`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${color}15`,
                          border: `1px solid ${color}25`,
                        }}
                      >
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-bold text-foreground">
                            {label}
                          </span>
                          <span
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                            style={{ background: `${color}18`, color }}
                          >
                            {ext}
                          </span>
                          {selectedFormat === id && (
                            <CheckCircle2
                              size={13}
                              className="text-primary ml-auto"
                            />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {desc}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground/60 truncate">
                          Sample: {sample}
                        </p>
                      </div>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Step 2 — Upload File */}
          {step === 2 && !done && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-4">
                Upload your template file
              </p>
              <label
                htmlFor="template-file-input"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  document.getElementById("template-file-input")?.click()
                }
                className={`block border-2 border-dashed rounded-xl p-10 text-center transition-smooth cursor-pointer
                  ${fileName ? "border-primary/50 bg-primary/5" : "border-border/40 hover:border-primary/30 hover:bg-white/[0.02]"}`}
                data-ocid="import_template.dropzone"
              >
                <input
                  id="template-file-input"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.csv,.pdf"
                  onChange={handleFileChange}
                />
                {fileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 size={28} className="text-primary" />
                    <p className="text-sm font-bold text-foreground">
                      {fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      File ready for processing
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={28} className="text-muted-foreground/50" />
                    <p className="text-sm font-semibold text-foreground">
                      Drag & drop your file here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                )}
              </label>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <AlertCircle size={11} className="text-primary/70" />
                  Max file size:{" "}
                  <span className="text-foreground font-semibold">10 MB</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  Accepted:{" "}
                  <span className="text-foreground font-semibold">
                    .xlsx · .csv · .pdf
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Preview & Map */}
          {step === 3 && !done && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Map template columns to InfraOS fields
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Preview shows the first 5 rows. Map each column to the correct
                InfraOS field.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border/30 mb-5">
                <table className="w-full text-xs">
                  <thead>
                    <tr
                      className="border-b border-border/30"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      {[
                        "Project_ID",
                        "Project_Name",
                        "Investment",
                        "Status",
                        "State",
                        "Ministry",
                      ].map((c) => (
                        <th
                          key={c}
                          className="px-3 py-2.5 text-left text-label whitespace-nowrap"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PREVIEW_ROWS.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border/10 hover:bg-white/[0.015]"
                      >
                        <td className="px-3 py-2 text-foreground/80 whitespace-nowrap font-mono text-[10px]">
                          {row.id}
                        </td>
                        {row.cols.map((cell) => (
                          <td
                            key={cell}
                            className="px-3 py-2 text-foreground/80 whitespace-nowrap"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-label mb-3">COLUMN MAPPING</p>
              <div className="grid grid-cols-2 gap-2.5">
                {SAMPLE_COLUMNS.map((col) => {
                  const selectId = `map-col-${col}`;
                  return (
                    <div key={col} className="flex items-center gap-2">
                      <label
                        htmlFor={selectId}
                        className="text-[10px] text-muted-foreground font-mono flex-1 truncate"
                      >
                        {col}
                      </label>
                      <span className="text-muted-foreground/40 text-xs">
                        →
                      </span>
                      <select
                        id={selectId}
                        data-ocid={`import_template.map.${col}`}
                        className="glass-card text-[10px] text-foreground px-2 py-1.5 rounded w-40 outline-none focus:border-primary/50 transition-smooth"
                        value={mappings[col] ?? ""}
                        onChange={(e) =>
                          setMappings((prev) => ({
                            ...prev,
                            [col]: e.target.value,
                          }))
                        }
                      >
                        <option value="">— Select field —</option>
                        {INFRA_OS_FIELDS.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 — Confirm */}
          {step === 4 && !done && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-4">
                Review import summary before confirming
              </p>
              <div className="space-y-3 mb-6">
                {[
                  {
                    label: "Template Format",
                    value:
                      FORMATS.find((f) => f.id === selectedFormat)?.label ??
                      "Excel Template",
                  },
                  {
                    label: "File Name",
                    value: fileName || "InfraOS_Template_Q1_2026.xlsx",
                  },
                  { label: "Total Records", value: "47 rows detected" },
                  {
                    label: "Columns Detected",
                    value: `${SAMPLE_COLUMNS.length + 4} columns`,
                  },
                  {
                    label: "Mapped Fields",
                    value: `${Object.values(mappings).filter(Boolean).length} of ${SAMPLE_COLUMNS.length} mapped`,
                  },
                  { label: "Estimated Import Time", value: "~3 seconds" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-4 py-3 rounded-lg glass-card"
                  >
                    <span className="text-xs text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="p-4 rounded-lg"
                style={{
                  background: "rgba(0,212,255,0.06)",
                  border: "1px solid rgba(0,212,255,0.18)",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle
                    size={14}
                    className="text-primary flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    All imported templates are encrypted and versioned. Previous
                    imports are retained for 90 days. Data is processed per
                    MoRTH data governance policy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Done state */}
          {done && (
            <div
              className="py-8 text-center"
              data-ocid="import_template.success_state"
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
              <p className="text-lg font-bold text-foreground mb-2">
                Template Imported Successfully
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                47 records ready for review
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Template is now available across all modules and report
                generation flows.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="btn-primary text-sm flex items-center gap-2"
                  data-ocid="import_template.view_records_button"
                  onClick={() =>
                    toast.success(
                      "Opening imported records in Procurement module...",
                    )
                  }
                >
                  <Eye size={14} /> View 47 Records
                </button>
                <button
                  type="button"
                  className="btn-secondary text-sm"
                  onClick={onClose}
                  data-ocid="import_template.done_button"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/40">
            <button
              type="button"
              className="btn-ghost text-sm px-3 py-2"
              disabled={step === 1}
              onClick={() => setStep((s) => (s - 1) as ImportStep)}
              data-ocid="import_template.back_button"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                className="btn-primary text-sm flex items-center gap-2"
                onClick={() => setStep((s) => (s + 1) as ImportStep)}
                disabled={step === 1 && !selectedFormat}
                data-ocid="import_template.next_button"
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary text-sm flex items-center gap-2"
                onClick={() => setDone(true)}
                data-ocid="import_template.confirm_button"
              >
                <Upload size={14} /> Import Template
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Schedule Report Modal ─────────────────────────────────────────────────────
function ScheduleReportModal({ onClose }: { onClose: () => void }) {
  const [reportName, setReportName] = useState("Weekly Execution Summary");
  const [reportType, setReportType] = useState("Project Status");
  const [frequency, setFrequency] = useState<ScheduleFrequency>("weekly");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [time, setTime] = useState("08:00");
  const [format, setFormat] = useState<"pdf" | "excel" | "both">("pdf");
  const [recipients, setRecipients] = useState([
    "naman.maheshwari@infraos.gov.in",
  ]);
  const [ccList, setCcList] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailNotify, setEmailNotify] = useState(true);
  const [notifyOnFail, setNotifyOnFail] = useState(true);
  const [modules, setModules] = useState({
    procurement: true,
    execution: true,
    commercial: false,
    governance: false,
    asset: false,
  });
  const [created, setCreated] = useState(false);

  const REPORT_TYPES = [
    "Executive Summary",
    "Project Status",
    "Risk Dashboard",
    "Procurement Analysis",
    "Governance Audit",
    "Asset Health",
    "Commercial Risk",
  ];
  const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  function getNextRunLabel() {
    if (frequency === "daily") return `Tomorrow at ${time} IST`;
    if (frequency === "weekly") return `Next ${dayOfWeek} at ${time} IST`;
    if (frequency === "monthly") return `${dayOfMonth} May 2026 at ${time} IST`;
    return `01 Jul 2026 at ${time} IST`;
  }

  function addRecipient() {
    if (newEmail && !recipients.includes(newEmail)) {
      setRecipients((prev) => [...prev, newEmail]);
      setNewEmail("");
    }
  }

  const MODULE_ENTRIES = [
    { key: "procurement" as const, label: "Procurement Intelligence" },
    { key: "execution" as const, label: "Execution Intelligence" },
    { key: "commercial" as const, label: "Commercial Risk" },
    { key: "governance" as const, label: "Governance Intelligence" },
    { key: "asset" as const, label: "Asset Intelligence" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.8)" }}
      data-ocid="schedule_report.dialog"
    >
      <div
        className="glass-elevated w-full max-w-2xl mx-4 flex flex-col"
        style={{ maxHeight: "93vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.25)",
              }}
            >
              <Calendar size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-label text-[10px] mb-0.5">REPORTS ENGINE</p>
              <h3 className="text-base font-bold text-foreground">
                Schedule Automated Report
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-1.5"
            aria-label="Close"
            data-ocid="schedule_report.close_button"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {created ? (
            <div
              className="py-8 text-center"
              data-ocid="schedule_report.success_state"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{
                  background: "rgba(0,212,255,0.1)",
                  border: "1px solid rgba(0,212,255,0.3)",
                }}
              >
                <CheckCircle2 size={28} className="text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground mb-1">
                Schedule Created
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                Schedule ID:{" "}
                <span className="font-mono text-primary">SCHED/2024/0023</span>
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Next run: {getNextRunLabel()}
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Reports will be delivered to {recipients.length} recipient(s) in{" "}
                {format.toUpperCase()} format.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="btn-primary text-sm flex items-center gap-2"
                  data-ocid="schedule_report.view_schedules_button"
                  onClick={() =>
                    toast.success("Navigating to schedule management...")
                  }
                >
                  <Eye size={14} /> View All Schedules
                </button>
                <button
                  type="button"
                  className="btn-secondary text-sm"
                  onClick={onClose}
                  data-ocid="schedule_report.done_button"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Report Configuration */}
              <div>
                <p className="text-[10px] text-label mb-3">
                  REPORT CONFIGURATION
                </p>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="sched-report-name"
                      className="text-[10px] text-muted-foreground block mb-1.5"
                    >
                      REPORT NAME
                    </label>
                    <input
                      id="sched-report-name"
                      type="text"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      data-ocid="schedule_report.name_input"
                      className="w-full glass-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-smooth"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="sched-report-type"
                      className="text-[10px] text-muted-foreground block mb-1.5"
                    >
                      REPORT TYPE
                    </label>
                    <select
                      id="sched-report-type"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      data-ocid="schedule_report.type_select"
                      className="w-full glass-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-smooth"
                    >
                      {REPORT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-2">
                      MODULE COVERAGE
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {MODULE_ENTRIES.map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          data-ocid={`schedule_report.module.${key}`}
                          onClick={() =>
                            setModules((prev) => ({
                              ...prev,
                              [key]: !prev[key],
                            }))
                          }
                          className={`flex items-center gap-2 px-3 py-2 rounded text-xs text-left transition-smooth border
                            ${modules[key] ? "border-primary/50 bg-primary/8 text-primary" : "glass-card text-muted-foreground"}`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0
                            ${modules[key] ? "bg-primary border-primary" : "border-border"}`}
                          >
                            {modules[key] && (
                              <CheckCircle2
                                size={9}
                                className="text-background"
                              />
                            )}
                          </div>
                          <span className="truncate">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Settings */}
              <div>
                <p className="text-[10px] text-label mb-3">SCHEDULE SETTINGS</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-2">
                      FREQUENCY
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {(
                        [
                          "daily",
                          "weekly",
                          "monthly",
                          "quarterly",
                        ] as ScheduleFrequency[]
                      ).map((f) => (
                        <button
                          key={f}
                          type="button"
                          data-ocid={`schedule_report.freq.${f}`}
                          onClick={() => setFrequency(f)}
                          className={`px-3 py-2.5 rounded text-xs font-semibold capitalize text-center transition-smooth border
                            ${frequency === f ? "border-primary bg-primary/10 text-primary" : "glass-card text-muted-foreground hover:text-foreground"}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {frequency === "weekly" && (
                      <div>
                        <label
                          htmlFor="sched-day-week"
                          className="text-[10px] text-muted-foreground block mb-1.5"
                        >
                          DAY OF WEEK
                        </label>
                        <select
                          id="sched-day-week"
                          value={dayOfWeek}
                          onChange={(e) => setDayOfWeek(e.target.value)}
                          data-ocid="schedule_report.day_of_week"
                          className="w-full glass-card px-3 py-2.5 text-xs text-foreground outline-none focus:border-primary/50 transition-smooth"
                        >
                          {DAYS_OF_WEEK.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {frequency === "monthly" && (
                      <div>
                        <label
                          htmlFor="sched-day-month"
                          className="text-[10px] text-muted-foreground block mb-1.5"
                        >
                          DAY OF MONTH
                        </label>
                        <select
                          id="sched-day-month"
                          value={dayOfMonth}
                          onChange={(e) => setDayOfMonth(e.target.value)}
                          data-ocid="schedule_report.day_of_month"
                          className="w-full glass-card px-3 py-2.5 text-xs text-foreground outline-none focus:border-primary/50 transition-smooth"
                        >
                          {Array.from({ length: 28 }, (_, i) =>
                            String(i + 1),
                          ).map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label
                        htmlFor="sched-time"
                        className="text-[10px] text-muted-foreground block mb-1.5"
                      >
                        TIME
                      </label>
                      <input
                        id="sched-time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        data-ocid="schedule_report.time_input"
                        className="w-full glass-card px-3 py-2.5 text-xs text-foreground outline-none focus:border-primary/50 transition-smooth"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="sched-tz"
                        className="text-[10px] text-muted-foreground block mb-1.5"
                      >
                        TIMEZONE
                      </label>
                      <select
                        id="sched-tz"
                        className="w-full glass-card px-3 py-2.5 text-xs text-foreground outline-none transition-smooth"
                      >
                        <option>Asia/Kolkata (IST)</option>
                        <option>UTC</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg"
                    style={{
                      background: "rgba(0,212,255,0.05)",
                      border: "1px solid rgba(0,212,255,0.15)",
                    }}
                  >
                    <Clock size={13} className="text-primary flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      Next scheduled run:{" "}
                      <span className="text-foreground font-semibold">
                        {getNextRunLabel()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Distribution */}
              <div>
                <p className="text-[10px] text-label mb-3">DISTRIBUTION</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-2">
                      RECIPIENTS
                    </p>
                    <div className="space-y-2">
                      {recipients.map((r, i) => (
                        <div
                          key={r}
                          className="flex items-center gap-2 px-3 py-2 rounded glass-card"
                        >
                          <Mail
                            size={11}
                            className="text-primary flex-shrink-0"
                          />
                          <span className="text-xs text-foreground flex-1 truncate">
                            {r}
                          </span>
                          {i > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setRecipients((prev) =>
                                  prev.filter((_, idx) => idx !== i),
                                )
                              }
                              className="btn-ghost p-0.5"
                              aria-label="Remove recipient"
                            >
                              <X size={11} />
                            </button>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <label htmlFor="sched-new-email" className="sr-only">
                          New recipient email
                        </label>
                        <input
                          id="sched-new-email"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Add recipient email..."
                          data-ocid="schedule_report.email_input"
                          className="flex-1 glass-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-smooth"
                          onKeyDown={(e) => e.key === "Enter" && addRecipient()}
                        />
                        <button
                          type="button"
                          onClick={addRecipient}
                          className="btn-secondary text-xs px-3 flex items-center gap-1.5"
                          data-ocid="schedule_report.add_recipient_button"
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="sched-cc"
                      className="text-[10px] text-muted-foreground block mb-1.5"
                    >
                      CC LIST (OPTIONAL)
                    </label>
                    <input
                      id="sched-cc"
                      type="text"
                      value={ccList}
                      onChange={(e) => setCcList(e.target.value)}
                      placeholder="cc1@example.com, cc2@example.com"
                      data-ocid="schedule_report.cc_input"
                      className="w-full glass-card px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-smooth"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-2">
                      OUTPUT FORMAT
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {(["pdf", "excel", "both"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          data-ocid={`schedule_report.format.${f}`}
                          onClick={() => setFormat(f)}
                          className={`px-3 py-2.5 rounded text-xs font-semibold uppercase text-center transition-smooth border
                            ${format === f ? "border-primary bg-primary/10 text-primary" : "glass-card text-muted-foreground hover:text-foreground"}`}
                        >
                          {f === "both" ? "PDF + Excel" : f.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <p className="text-[10px] text-label mb-3">NOTIFICATIONS</p>
                <div className="space-y-2">
                  {(
                    [
                      {
                        label: "Email notification on delivery",
                        state: emailNotify,
                        setter: setEmailNotify,
                        ocid: "schedule_report.email_notify_toggle",
                      },
                      {
                        label: "Notify on generation failure",
                        state: notifyOnFail,
                        setter: setNotifyOnFail,
                        ocid: "schedule_report.fail_notify_toggle",
                      },
                    ] as const
                  ).map(({ label, state, setter, ocid }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-4 py-3 rounded glass-card"
                    >
                      <span className="text-xs text-foreground">{label}</span>
                      <button
                        type="button"
                        data-ocid={ocid}
                        onClick={() => setter((prev) => !prev)}
                        aria-label={label}
                        className={`relative w-9 h-5 rounded-full transition-smooth flex-shrink-0 ${state ? "bg-primary" : "bg-muted"}`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-smooth ${state ? "left-5" : "left-0.5"}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Existing Schedules */}
              <div>
                <p className="text-[10px] text-label mb-3">
                  EXISTING SCHEDULED REPORTS
                </p>
                <div className="space-y-2">
                  {SCHEDULED_REPORTS_SAMPLE.map((s, i) => (
                    <div
                      key={s.id}
                      data-ocid={`schedule_report.existing.item.${i + 1}`}
                      className="flex items-center justify-between px-4 py-3 rounded glass-card"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {s.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {s.freq} · {s.format} · {s.id}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ml-3 flex-shrink-0 ${s.status === "ACTIVE" ? "badge-success" : "badge-low"}`}
                      >
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {!created && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/40">
            <button
              type="button"
              className="btn-ghost text-sm px-3 py-2"
              onClick={onClose}
              data-ocid="schedule_report.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary text-sm flex items-center gap-2"
              onClick={() => setCreated(true)}
              data-ocid="schedule_report.create_button"
            >
              <Calendar size={14} /> Create Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Generate Report Wizard ────────────────────────────────────────────────────
function GenerateReportWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<WizardStep>(1);
  const [reportType, setReportType] = useState("");
  const [scope, setScope] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-03-31");
  const [sections, setSections] = useState<Record<string, boolean>>(
    Object.fromEntries(WIZARD_SECTIONS.map((s) => [s, true])),
  );
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const TYPES = [
    { id: "procurement", label: "Procurement", icon: Upload },
    { id: "execution", label: "Execution", icon: Zap },
    { id: "commercial", label: "Commercial", icon: TrendingDown },
    { id: "governance", label: "Governance", icon: Shield },
    { id: "asset", label: "Asset", icon: HardHat },
    { id: "comprehensive", label: "Comprehensive", icon: Layers },
  ];

  const SCOPES = [
    { id: "all", label: "All India" },
    { id: "states", label: "Select States" },
    { id: "projects", label: "Select Projects" },
  ];

  function startGeneration() {
    setStep(5);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.floor(Math.random() * 18) + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setDone(true);
      }
      setProgress(p);
    }, 350);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <div
        className="glass-elevated w-full max-w-lg mx-4 flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <div>
            <p className="text-label text-[10px] mb-0.5">REPORTS ENGINE</p>
            <h3 className="text-base font-bold text-foreground">
              Generate Report
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-1.5"
            aria-label="Close"
            data-ocid="generate_report.close_button"
          >
            <X size={15} />
          </button>
        </div>

        {step < 5 && (
          <div className="flex items-center gap-1.5 px-5 py-3 border-b border-border/30">
            {([1, 2, 3, 4] as WizardStep[]).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-smooth
                  ${step === s ? "bg-primary text-background" : step > s ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                >
                  {step > s ? <CheckCircle2 size={12} /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`h-px w-8 ${step > s ? "bg-primary/40" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              Step {step} of 4
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === 1 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Select Report Type
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    data-ocid={`generate_report.type.${id}`}
                    onClick={() => setReportType(id)}
                    className={`flex items-center gap-2.5 p-3 rounded text-left transition-smooth border
                      ${reportType === id ? "border-primary bg-primary/10 text-primary" : "glass-card text-muted-foreground hover:text-foreground"}`}
                  >
                    <Icon size={15} />
                    <span className="text-xs font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Select Scope
              </p>
              <div className="space-y-2">
                {SCOPES.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    data-ocid={`generate_report.scope.${id}`}
                    onClick={() => setScope(id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded text-left transition-smooth border
                      ${scope === id ? "border-primary bg-primary/10 text-primary" : "glass-card text-muted-foreground hover:text-foreground"}`}
                  >
                    <Globe size={15} />
                    <span className="text-sm font-medium">{label}</span>
                    {scope === id && (
                      <CheckCircle2
                        size={14}
                        className="ml-auto text-primary"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Select Date Range
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="gen-date-from"
                    className="text-label text-[10px] block mb-1.5"
                  >
                    FROM
                  </label>
                  <input
                    id="gen-date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    data-ocid="generate_report.date_from"
                    className="w-full glass-card px-3 py-2.5 text-xs text-foreground outline-none focus:border-primary/50 transition-smooth"
                  />
                </div>
                <div>
                  <label
                    htmlFor="gen-date-to"
                    className="text-label text-[10px] block mb-1.5"
                  >
                    TO
                  </label>
                  <input
                    id="gen-date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    data-ocid="generate_report.date_to"
                    className="w-full glass-card px-3 py-2.5 text-xs text-foreground outline-none focus:border-primary/50 transition-smooth"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Include Sections
              </p>
              <div className="space-y-2">
                {WIZARD_SECTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      setSections((prev) => ({ ...prev, [s]: !prev[s] }))
                    }
                    className="flex items-center gap-3 p-3 glass-card rounded cursor-pointer hover:border-primary/30 transition-smooth w-full text-left"
                    data-ocid={`generate_report.section.${s.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-smooth
                      ${sections[s] ? "bg-primary border-primary" : "border-border"}`}
                    >
                      {sections[s] && (
                        <CheckCircle2 size={10} className="text-background" />
                      )}
                    </div>
                    <span className="text-sm text-foreground">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="py-4 text-center">
              {!done ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                    <RefreshCw
                      size={22}
                      className="text-primary animate-spin"
                    />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Generating Report…
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Processing{" "}
                    {WIZARD_SECTIONS.filter((s) => sections[s]).length} sections
                  </p>
                  <div className="progress-bar mx-auto max-w-xs mb-2">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-data text-sm">{progress}%</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={22} className="text-primary" />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">
                    Report Ready
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Your report has been generated and added to Saved Reports.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      className="btn-primary flex items-center gap-2 text-sm"
                      onClick={() =>
                        downloadReport(
                          `${reportType.charAt(0).toUpperCase() + reportType.slice(1)}-Intelligence-Report`,
                          "csv",
                        )
                      }
                      data-ocid="generate_report.download_button"
                    >
                      <Download size={14} /> Download PDF
                    </button>
                    <button
                      type="button"
                      className="btn-secondary text-sm"
                      onClick={onClose}
                      data-ocid="generate_report.done_close_button"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {step < 5 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border/40">
            <button
              type="button"
              className="btn-ghost text-sm px-3 py-2"
              onClick={() => step > 1 && setStep((s) => (s - 1) as WizardStep)}
              disabled={step === 1}
              data-ocid="generate_report.back_button"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                className="btn-primary text-sm flex items-center gap-2"
                onClick={() => setStep((s) => (s + 1) as WizardStep)}
                data-ocid="generate_report.next_button"
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary text-sm flex items-center gap-2"
                onClick={startGeneration}
                data-ocid="generate_report.submit_button"
              >
                Generate Now <Zap size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Download Helper ───────────────────────────────────────────────────────────
function downloadReport(reportName: string, format = "csv") {
  const now = new Date().toISOString().split("T")[0];
  const content = `INFRAOS REPORT: ${reportName}
Generated: ${now}
Organization: National Infrastructure Pipeline
Generated By: Naman Maheshwari

=== PROJECT SUMMARY ===
Total Projects Monitored: 1,820
On Track: 1,040 (57.1%)
Delayed: 780 (42.8%)
Critical Risk: 234 (12.9%)

=== KEY PERFORMANCE INDICATORS ===
NIP Total Investment,₹111 Lakh Crore
Cost Overrun (Aggregated),₹4.8 Lakh Crore (18.2%)
Arbitration Exposure,₹70,000+ Crore
Active Tender Pipeline,₹28,400 Crore
Average Project Delay,36-48 months

=== TOP DELAYED PROJECTS ===
Project ID,Project Name,State,Authority,Delay (months),Overrun (₹Cr)
NH-48-KA-2021,NH-48 Bangalore–Chennai Corridor,Karnataka,NHAI,24,1240
MU-MTHL-001,Mumbai Trans Harbour Link,Maharashtra,MMRDA,18,3200
DL-RRTS-001,Delhi-Meerut RRTS Corridor,Uttar Pradesh,NCRTC,12,2100
PU-MRTS-002,Pune Metro Phase 2,Maharashtra,MahaMetro,30,890
HY-ORR-001,Hyderabad Outer Ring Road Ext.,Telangana,HMDA,48,1560

=== RISK INDICATORS ===
High Risk States: Maharashtra, UP, Karnataka, Rajasthan
Sectors at Risk: Urban Infrastructure, Roads, Railways
Procurement Alerts: 47 flagged tenders

=== RECOMMENDATIONS ===
1. Prioritize land acquisition resolution for 156 stalled projects
2. Fast-track environmental clearances for 89 pending projects
3. Deploy dispute resolution panels for 47 arbitration-prone contracts
4. Increase HAM model adoption to reduce contractor financial risk
5. Mandate GatiShakti portal compliance for all new DPRs
`;
  const ext = format === "pdf" ? "txt" : format === "excel" ? "csv" : format;
  const mimeType =
    format === "csv" || format === "excel"
      ? "text/csv;charset=utf-8;"
      : "text/plain;charset=utf-8;";
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `InfraOS-${reportName.replace(/\s+/g, "-")}-${now}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const { selectedOrg } = useOrg();
  const orgData = getOrgData(selectedOrg.key);
  const [showWizard, setShowWizard] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  // ── Advanced Export State ─────────────────────────────────────────────────
  const [exportDateRange, setExportDateRange] = useState<
    "7d" | "30d" | "90d" | "1y" | "custom"
  >("30d");
  const [exportOrg, setExportOrg] = useState("All Orgs");
  const [exportSectors, setExportSectors] = useState<Record<string, boolean>>({
    Energy: true,
    Roads: true,
    Urban: true,
    Railways: true,
    Water: false,
    Digital: false,
  });
  const [exportModules, setExportModules] = useState<Record<string, boolean>>({
    Projects: true,
    Tenders: true,
    Vendors: true,
    "Risk Scores": true,
    Governance: true,
    Assets: true,
  });
  const [exportFormat, setExportFormat] = useState<"csv" | "json" | "txt">(
    "csv",
  );
  const [pivotTables, setPivotTables] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const SECTOR_OPTIONS = [
    "Energy",
    "Roads",
    "Urban",
    "Railways",
    "Water",
    "Digital",
  ];
  const MODULE_OPTIONS = [
    "Projects",
    "Tenders",
    "Vendors",
    "Risk Scores",
    "Governance",
    "Assets",
  ];
  const DATE_RANGES = [
    { id: "7d", label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
    { id: "90d", label: "Last 90 days" },
    { id: "1y", label: "Last Year" },
    { id: "custom", label: "Custom" },
  ] as const;
  const ORG_OPTIONS = [
    "All Orgs",
    "MoRTH",
    "NHAI",
    "Smart Cities",
    "NHIDCL",
    "MoRTH PMU",
  ];

  function handleAdvancedExport() {
    setIsExporting(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const watermark = `InfraOS Intelligence Export — Confidential — ${dateStr}`;
      const selectedSectors = Object.entries(exportSectors)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(", ");
      const selectedModulesStr = Object.entries(exportModules)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(", ");

      let content = "";

      if (exportFormat === "csv") {
        content = `${watermark}

=== SECTION 1: EXPORT METADATA ===
InfraOS Intelligence Export — Confidential
Generated by: Naman Maheshwari
Date: ${dateStr}
Organization: ${exportOrg}
Date Range: ${exportDateRange}
Sectors: ${selectedSectors}
Modules: ${selectedModulesStr}
Pivot Tables: ${pivotTables ? "Yes" : "No"}

`;

        if (exportModules.Projects) {
          content += `=== SECTION 2: PROJECT SUMMARY ===
Project Name,Authority,Sector,Value (Cr),Status,Delay Days,Cost Overrun %
NH-44 Jammu-Srinagar 4-Lane Highway,NHAI,Roads,4230,Under Review,180,18.2
Delhi-Meerut Expressway Phase 2,NHAI,Roads,8450,On Track,0,0
Mumbai-Ahmedabad HSR Corridor,RVNL,Railways,108000,Critical,360,42.3
Bangalore Metro Phase 2B,BMRCL,Urban,8600,Delayed,120,12.8
Rajasthan Ultra Mega Solar 1500MW,SECI,Energy,6200,Open,0,0
BVW Sea Link Extension,PWD MH,Roads,6800,Open,0,0
JNPA Terminal 4 Expansion,JNPA,Ports,1450,Awarded,45,3.2
NH-48 Vadodara-Mumbai EPC,NHAI,Roads,3890,Open,0,0
Gorakhpur Nuclear Plant GHAVP,NPCIL,Energy,8900,Open,0,0
Hyderabad Regional Ring Road,L&T,Roads,2890,Open,0,0
Kaleshwaram Lift Irrigation Ph3,MEIL,Water,4800,Under Review,90,8.5
Mumbai Coastal Road Tunnel TBM,Afcons,Urban,3100,Closed,0,0
DMRC Phase 4 Janakpuri Line,DMRC,Urban,3200,Under Review,60,5.1
Mumbai Metro Line 3 Extension,MMRC,Urban,2800,Open,0,0
Chennai Metro Ph2 Underground,CMRL,Urban,2600,Under Review,30,2.7

`;
        }

        if (exportModules.Tenders) {
          content += `=== SECTION 3: TENDER PIPELINE ===
Tender ID,Authority,Description,Value (Cr),Risk Score,Status
NHAI/EPC/2024/0891,NHAI,NH-44 Jammu-Srinagar 4-Lane Tunnel Package,4230,CRITICAL,Under Review
HCC/WB/2024/0334,HCC,Kolkata Second Hooghly Bridge Strengthening,1230,CRITICAL,Under Review
NPCIL/CIVIL/2024/0901,NPCIL,Gorakhpur Nuclear Power Plant Reactor Civil,8900,CRITICAL,Open
RECL/GRID/2024/0678,RECL,National Smart Grid 33/11kV Substation 800 Units,3800,HIGH,Under Review
NHAI/HAM/2024/0456,NHAI,NH-48 Vadodara-Mumbai Expressway Phase 2,3890,HIGH,Open
RVNL/EPC/2024/0234,RVNL,DFC Ludhiana-Khurja Electrical Works,1780,HIGH,Under Review
MEIL/LIFT/2024/0234,MEIL,Kaleshwaram Lift Irrigation Ph3,4800,HIGH,Under Review
HPCL/EPC/2024/0901,HPCL,Rajasthan Refinery CDU EPC,3400,HIGH,Open
NHIDCL/EPC/2024/0112,NHIDCL,Arunachal Pradesh Frontier Highway Pkg4,2100,MEDIUM,Open
SECI/SOLAR/2024/0567,SECI,Rajasthan Ultra Mega Solar 1500MW EPC-A,6200,MEDIUM,Open

`;
        }

        if (exportModules.Vendors) {
          content += `=== SECTION 4: VENDOR INTELLIGENCE ===
Vendor Name,Credibility Score,Litigation Count,Arbitration Exposure (Cr),Financial Health
Larsen & Toubro Ltd,94,1,42,Strong
Tata Projects,91,0,0,Strong
Afcons Infrastructure,87,2,340,Moderate
NCC Limited,82,3,156,Moderate
GR Infraprojects,89,1,78,Strong
Dilip Buildcon,74,4,234,Moderate
HCC Ltd,61,8,22000,Weak
KNR Constructions,86,1,45,Moderate
PNC Infratech,80,2,89,Moderate
Megha Engineering (MEIL),72,5,312,Moderate

`;
        }

        if (exportModules["Risk Scores"]) {
          content += `=== SECTION 5: RISK SCORES ===
Module,Risk Score,Trend,Critical Items
Procurement,72,increasing,3
Execution,81,stable,5
Commercial,68,decreasing,2
Governance,59,stable,1
Asset Intelligence,65,stable,4
Vendor Intelligence,77,increasing,2

`;
        }

        if (exportModules.Governance) {
          content += `=== SECTION 6: GOVERNANCE METRICS ===
Approval SLA Compliance: 76%
Pending Approvals: 23
Audit Flags: 38
CVC Referrals This Month: 7
Bid Integrity Score: 62/100
Transparency Index: 78/100
Ministry Accountability: 74/100
Manipulation Detection Flags: 12
Bid Rigging Alerts: 4
Active SLA Breaches: 156

`;
        }

        if (exportModules.Assets) {
          content += `=== SECTION 7: ASSET INTELLIGENCE ===
Asset ID,Name,Type,Health Score,Condition,Next Inspection
BR-NH48-234,NH-48 Overbridge Km 234,Bridge,72,Fair,12 Jul 2026
RD-DRR-R7,Delhi Ring Road Stretch R-7,Road,45,Poor,03 Feb 2026
TN-MPE-T3,Mumbai-Pune Expressway Tunnel T-3,Tunnel,88,Good,22 Aug 2026
RD-YEX-165,Yamuna Expressway Km 165-170,Road,61,Moderate,18 Jun 2026
RD-JNPT-AP,JNPT Approach Road,Port Road,83,Good,09 Sep 2026

`;
        }

        if (pivotTables) {
          content += `=== SECTION 8: PIVOT TABLES ===
Sector vs Status Breakdown:
Sector,On Track,Delayed,Critical,Total
Energy,156,45,12,213
Roads,340,189,67,596
Urban,89,67,34,190
Railways,78,34,8,120
Water,45,23,6,74
Digital,34,12,2,48

`;
        }
      } else if (exportFormat === "json") {
        const jsonData = {
          metadata: {
            watermark,
            generatedBy: "Naman Maheshwari",
            date: dateStr,
            organization: exportOrg,
          },
          riskScores: {
            procurement: 72,
            execution: 81,
            commercial: 68,
            governance: 59,
          },
          governanceMetrics: {
            approvalSLACompliance: "76%",
            pendingApprovals: 23,
            auditFlags: 38,
            cvcReferrals: 7,
          },
          projectCount: { total: 1820, delayed: 780, critical: 234 },
        };
        content = JSON.stringify(jsonData, null, 2);
      } else {
        content = `${watermark}\n\nInfraOS Analytics Report\nGenerated by: Naman Maheshwari\nDate: ${dateStr}\nOrg: ${exportOrg}\n\nSummary: NIP ₹111L Cr | 1820 Active Projects | 780 Delayed (42.8%) | Cost Overrun ₹4.8L Cr\nProcurement Risk: 72/100 | Execution: 81/100 | Commercial: 68/100 | Governance: 59/100\n`;
      }

      const ext =
        exportFormat === "json"
          ? "json"
          : exportFormat === "txt"
            ? "txt"
            : "csv";
      const mimeType =
        exportFormat === "json"
          ? "application/json"
          : "text/plain;charset=utf-8;";
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `InfraOS-Advanced-Export-${dateStr}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsExporting(false);
      toast.success(
        `Export downloaded: InfraOS-Advanced-Export-${dateStr}.${ext}`,
      );
    }, 1000);
  }

  return (
    <div className="p-6 space-y-6" data-ocid="reports.page">
      {showWizard && (
        <GenerateReportWizard onClose={() => setShowWizard(false)} />
      )}
      {showImport && (
        <ImportTemplateModal onClose={() => setShowImport(false)} />
      )}
      {showSchedule && (
        <ScheduleReportModal onClose={() => setShowSchedule(false)} />
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-2">
            <span>Home</span>
            <ChevronRight size={10} />
            <span className="text-primary">Reports & Analytics</span>
          </nav>
          <p className="text-label text-[10px] mb-1">
            INTELLIGENCE REPORTS ENGINE
          </p>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Reports & Analytics
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <FileBarChart size={12} className="text-primary" />
              <span className="text-data text-xs">
                {orgData.kpis.totalProjects}
              </span>
              <span className="text-xs text-muted-foreground">
                Active Projects
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-chart-4" />
              <span className="text-data text-xs">
                {orgData.kpis.delayedProjects}
              </span>
              <span className="text-xs text-muted-foreground">Delayed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Download size={12} className="text-chart-3" />
              <span className="text-data text-xs">
                {orgData.kpis.riskAlerts}
              </span>
              <span className="text-xs text-muted-foreground">Risk Alerts</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="btn-secondary text-sm flex items-center gap-2"
            onClick={() => setShowImport(true)}
            data-ocid="reports.import_template_button"
          >
            <Upload size={14} /> Import Template
          </button>
          <button
            type="button"
            className="btn-secondary text-sm flex items-center gap-2"
            onClick={() => setShowSchedule(true)}
            data-ocid="reports.schedule_button"
          >
            <Calendar size={14} /> Schedule Report
          </button>
          <button
            type="button"
            className="btn-primary text-sm flex items-center gap-2"
            onClick={() => setShowWizard(true)}
            data-ocid="reports.generate_button"
          >
            <Plus size={14} /> Generate Report
          </button>
        </div>
      </div>

      {/* ── ADVANCED EXPORT PANEL ──────────────────────────────────────────── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="reports.advanced_export.section"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/30">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.25)",
            }}
          >
            <Database size={15} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Advanced Analytics Export
            </h2>
            <p className="text-[10px] text-muted-foreground">
              Configure and download comprehensive intelligence data packages
            </p>
          </div>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <p className="text-[10px] text-label mb-2">DATE RANGE</p>
              <div className="space-y-1.5">
                {DATE_RANGES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    data-ocid={`reports.export.date_range.${r.id}`}
                    onClick={() =>
                      setExportDateRange(r.id as typeof exportDateRange)
                    }
                    className={`w-full text-left px-3 py-2 rounded text-xs transition-smooth border ${
                      exportDateRange === r.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "glass-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Org Filter */}
            <div>
              <p className="text-[10px] text-label mb-2">ORGANIZATION</p>
              <div className="space-y-1.5">
                {ORG_OPTIONS.map((org) => (
                  <button
                    key={org}
                    type="button"
                    data-ocid={`reports.export.org.${org.toLowerCase().replace(/\s+/g, "_")}`}
                    onClick={() => setExportOrg(org)}
                    className={`w-full text-left px-3 py-2 rounded text-xs transition-smooth border ${
                      exportOrg === org
                        ? "border-primary bg-primary/10 text-primary"
                        : "glass-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {org}
                  </button>
                ))}
              </div>
            </div>

            {/* Sectors */}
            <div>
              <p className="text-[10px] text-label mb-2">SECTORS</p>
              <div className="space-y-1.5">
                {SECTOR_OPTIONS.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    data-ocid={`reports.export.sector.${sec.toLowerCase()}`}
                    onClick={() =>
                      setExportSectors((prev) => ({
                        ...prev,
                        [sec]: !prev[sec],
                      }))
                    }
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-smooth border ${
                      exportSectors[sec]
                        ? "border-primary bg-primary/8 text-primary"
                        : "glass-card text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${
                        exportSectors[sec]
                          ? "bg-primary border-primary"
                          : "border-border"
                      }`}
                    >
                      {exportSectors[sec] && (
                        <CheckCircle2 size={9} className="text-background" />
                      )}
                    </div>
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules + Format */}
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-label mb-2">DATA MODULES</p>
                <div className="space-y-1.5">
                  {MODULE_OPTIONS.map((mod) => (
                    <button
                      key={mod}
                      type="button"
                      data-ocid={`reports.export.module.${mod.toLowerCase().replace(/\s+/g, "_")}`}
                      onClick={() =>
                        setExportModules((prev) => ({
                          ...prev,
                          [mod]: !prev[mod],
                        }))
                      }
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-smooth border ${
                        exportModules[mod]
                          ? "border-primary bg-primary/8 text-primary"
                          : "glass-card text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${
                          exportModules[mod]
                            ? "bg-primary border-primary"
                            : "border-border"
                        }`}
                      >
                        {exportModules[mod] && (
                          <CheckCircle2 size={9} className="text-background" />
                        )}
                      </div>
                      {mod}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-label mb-2">OUTPUT FORMAT</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["csv", "json", "txt"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      data-ocid={`reports.export.format.${fmt}`}
                      onClick={() => setExportFormat(fmt)}
                      className={`px-2 py-2 rounded text-xs font-bold uppercase text-center transition-smooth border ${
                        exportFormat === fmt
                          ? "border-primary bg-primary/10 text-primary"
                          : "glass-card text-muted-foreground"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 glass-card rounded">
                <span className="text-xs text-foreground">
                  Include Pivot Tables
                </span>
                <button
                  type="button"
                  data-ocid="reports.export.pivot_toggle"
                  onClick={() => setPivotTables((p) => !p)}
                  aria-label="Toggle pivot tables"
                  className={`relative w-9 h-5 rounded-full transition-smooth flex-shrink-0 ${pivotTables ? "bg-primary" : "bg-muted"}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-smooth ${pivotTables ? "left-5" : "left-0.5"}`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-[10px] text-muted-foreground">
              Watermark:{" "}
              <span className="text-foreground font-mono">
                InfraOS Intelligence Export — Confidential —{" "}
                {new Date().toISOString().split("T")[0]}
              </span>
            </p>
            <button
              type="button"
              data-ocid="reports.export.generate_button"
              onClick={handleAdvancedExport}
              disabled={isExporting}
              className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 disabled:opacity-60"
            >
              {isExporting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {isExporting
                ? "Generating Export..."
                : "Generate & Download Export"}
            </button>
          </div>
        </div>
      </div>

      {/* Saved Reports Table */}
      <div className="glass-card overflow-hidden" data-ocid="reports.table">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
          <h2 className="text-sm font-bold text-foreground">Saved Reports</h2>
          <span className="text-xs text-muted-foreground">
            {SAVED_REPORTS.length} reports
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                {[
                  "Report Name",
                  "Type",
                  "Module",
                  "Created By",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-label text-[10px] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAVED_REPORTS.map((r, i) => (
                <tr
                  key={r.name}
                  data-ocid={`reports.table.item.${i + 1}`}
                  className="border-b border-border/20 hover:bg-white/[0.02] transition-smooth"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <FileText
                        size={13}
                        className="text-primary flex-shrink-0"
                      />
                      <span className="text-xs font-semibold text-foreground max-w-[220px] truncate">
                        {r.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {r.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <ModuleDot module={r.module} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-foreground">
                      {r.createdBy}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-data text-xs">{r.date}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        data-ocid={`reports.download_button.${i + 1}`}
                        onClick={() => downloadReport(r.name, "csv")}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold text-primary border border-primary/30 hover:bg-primary/10 transition-smooth"
                      >
                        <Download size={11} /> Download
                      </button>
                      <button
                        type="button"
                        data-ocid={`reports.view_button.${i + 1}`}
                        onClick={() =>
                          toast.info(`Opening "${r.name}"...`, {
                            duration: 3000,
                          })
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold text-muted-foreground border border-border/40 hover:bg-white/5 transition-smooth"
                      >
                        <Eye size={11} /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Templates + Export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5">
          <h2 className="text-sm font-bold text-foreground mb-4">
            Report Templates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REPORT_TEMPLATES.map((tmpl, i) => {
              const Icon = tmpl.icon;
              return (
                <div
                  key={tmpl.name}
                  data-ocid={`reports.template.${i + 1}`}
                  className="glass-card-hover p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${tmpl.color}18`,
                        border: `1px solid ${tmpl.color}30`,
                      }}
                    >
                      <Icon size={15} style={{ color: tmpl.color }} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {tmpl.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tmpl.description}
                  </p>
                  <button
                    type="button"
                    data-ocid={`reports.use_template_button.${i + 1}`}
                    onClick={() => setShowWizard(true)}
                    className="mt-1 flex items-center gap-1.5 text-xs font-semibold transition-smooth"
                    style={{ color: tmpl.color }}
                  >
                    Use Template <ChevronRight size={11} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-5">
          <h2 className="text-sm font-bold text-foreground mb-1">
            Export Formats
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Choose output format for your reports
          </p>
          <div className="space-y-2.5">
            {EXPORT_FORMATS.map((fmt, i) => {
              const Icon = fmt.icon;
              return (
                <button
                  key={fmt.label}
                  type="button"
                  data-ocid={`reports.export_format.${i + 1}`}
                  onClick={() => {
                    const fmtKey =
                      fmt.label === "Excel (.xlsx)"
                        ? "excel"
                        : fmt.label === "PDF Report"
                          ? "pdf"
                          : fmt.label === "CSV Data"
                            ? "csv"
                            : "csv";
                    downloadReport("Infrastructure-Report", fmtKey);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded glass-card hover:border-primary/30 transition-smooth text-left"
                >
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${fmt.color}18`,
                      border: `1px solid ${fmt.color}30`,
                    }}
                  >
                    <Icon size={14} style={{ color: fmt.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                      {fmt.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {fmt.desc}
                    </p>
                  </div>
                  <Download
                    size={13}
                    className="text-muted-foreground flex-shrink-0"
                  />
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border/30">
            <div
              className="flex items-center gap-2 p-3 rounded"
              style={{
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.12)",
              }}
            >
              <AlertCircle size={13} className="text-primary flex-shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                All exports are encrypted and audit-logged per MoRTH data
                governance policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
