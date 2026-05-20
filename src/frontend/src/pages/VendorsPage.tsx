import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  ExternalLink,
  Search,
  Shield,
  TrendingDown,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useOrg } from "../context/OrgContext";
import { REAL_VENDORS, getOrgData } from "../data/orgData";

// ── Types ─────────────────────────────────────────────────────────────────────
type VendorStatus = "Active" | "Watch" | "BLOCKED";
type HealthLabel = "Strong" | "Moderate" | "Weak" | "Critical";
type BlacklistRisk = "LOW" | "MEDIUM" | "HIGH" | "BLACKLISTED";

interface VendorRow {
  id: string;
  name: string;
  type: string;
  score: number;
  activeProjects: number;
  litigation: number;
  financialHealth: HealthLabel;
  blacklistRisk: BlacklistRisk;
  status: VendorStatus;
  blacklisted: boolean;
  contracts: { project: string; value: string; status: string }[];
  litigationDetails: {
    court: string;
    value: string;
    status: string;
    year: number;
  }[];
  scoreBreakdown: { label: string; score: number }[];
  subsidiaries: string[];
}

interface GraphNode {
  id: string;
  name: string;
  type: "vendor" | "project" | "entity";
  risk: "low" | "medium" | "high" | "blacklisted";
  x: number;
  y: number;
  connections: string[];
}

// ── Vendor Data ───────────────────────────────────────────────────────────────
const VENDORS: VendorRow[] = [
  {
    id: "lt",
    name: "Larsen & Toubro Ltd",
    type: "Major EPC",
    score: 94,
    activeProjects: 34,
    litigation: 1,
    financialHealth: "Strong",
    blacklistRisk: "LOW",
    status: "Active",
    blacklisted: false,
    contracts: [
      {
        project: "Chennai–Bengaluru Industrial Corridor Ph1",
        value: "₹5,780 Cr",
        status: "Execution",
      },
      {
        project: "Bandra–Versova Sea Link",
        value: "₹11,400 Cr",
        status: "Award",
      },
      {
        project: "Delhi RRTS Package 3",
        value: "₹3,200 Cr",
        status: "Execution",
      },
    ],
    litigationDetails: [
      { court: "Delhi HC", value: "₹42 Cr", status: "Pending", year: 2023 },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 96 },
      { label: "Execution Record", score: 94 },
      { label: "Legal Risk", score: 91 },
      { label: "Compliance", score: 95 },
    ],
    subsidiaries: ["L&T GeoStructure", "L&T Hydrocarbon Engineering"],
  },
  {
    id: "ncc",
    name: "NCC Limited",
    type: "Highway EPC",
    score: 82,
    activeProjects: 28,
    litigation: 3,
    financialHealth: "Strong",
    blacklistRisk: "LOW",
    status: "Active",
    blacklisted: false,
    contracts: [
      {
        project: "Ganga Expressway Package 4",
        value: "₹2,800 Cr",
        status: "Execution",
      },
      {
        project: "NHDP Phase VI Rajasthan Sector",
        value: "₹1,940 Cr",
        status: "Monitoring",
      },
    ],
    litigationDetails: [
      { court: "Hyderabad HC", value: "₹28 Cr", status: "Settled", year: 2022 },
      {
        court: "NCDRC Arbitration",
        value: "₹65 Cr",
        status: "Pending",
        year: 2023,
      },
      { court: "NHAI DRB", value: "₹112 Cr", status: "DRB Stage", year: 2024 },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 84 },
      { label: "Execution Record", score: 82 },
      { label: "Legal Risk", score: 79 },
      { label: "Compliance", score: 83 },
    ],
    subsidiaries: ["NCC Urban Infra", "NCC Vizag Projects"],
  },
  {
    id: "dbl",
    name: "Dilip Buildcon Ltd",
    type: "Highway",
    score: 71,
    activeProjects: 19,
    litigation: 5,
    financialHealth: "Moderate",
    blacklistRisk: "MEDIUM",
    status: "Active",
    blacklisted: false,
    contracts: [
      {
        project: "Delhi–Mumbai Expressway Package 12",
        value: "₹4,240 Cr",
        status: "At Risk",
      },
      {
        project: "MP Highway Package 7 (NH-46)",
        value: "₹1,200 Cr",
        status: "Execution",
      },
      {
        project: "Bihar State Highway Package 3",
        value: "₹780 Cr",
        status: "Execution",
      },
    ],
    litigationDetails: [
      { court: "MP HC", value: "₹180 Cr", status: "Pending", year: 2021 },
      { court: "NHAI DRB", value: "₹94 Cr", status: "DRB Stage", year: 2022 },
      { court: "Delhi HC", value: "₹67 Cr", status: "Pending", year: 2023 },
      {
        court: "CCI Investigation",
        value: "N/A",
        status: "Under Review",
        year: 2023,
      },
      { court: "NCDRC", value: "₹45 Cr", status: "Settled", year: 2024 },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 71 },
      { label: "Execution Record", score: 74 },
      { label: "Legal Risk", score: 68 },
      { label: "Compliance", score: 71 },
    ],
    subsidiaries: ["DBL Projects Ltd", "DBL Highways", "DBL Capital Services"],
  },
  {
    id: "hcc",
    name: "HCC Limited",
    type: "Civil/Bridge",
    score: 68,
    activeProjects: 12,
    litigation: 7,
    financialHealth: "Moderate",
    blacklistRisk: "HIGH",
    status: "Watch",
    blacklisted: false,
    contracts: [
      {
        project: "Mumbai Trans Harbour Link Phase 2",
        value: "₹6,100 Cr",
        status: "Monitoring",
      },
      {
        project: "Rishikesh–Karnaprayag Rail Package",
        value: "₹3,400 Cr",
        status: "Execution",
      },
    ],
    litigationDetails: [
      { court: "Bombay HC", value: "₹340 Cr", status: "Pending", year: 2020 },
      {
        court: "NHAI Arbitration",
        value: "₹220 Cr",
        status: "Arbitration",
        year: 2021,
      },
      { court: "DRT Mumbai", value: "₹180 Cr", status: "Pending", year: 2022 },
      { court: "NCLT", value: "₹850 Cr", status: "Resolved", year: 2023 },
      {
        court: "Lender DRB",
        value: "₹120 Cr",
        status: "DRB Stage",
        year: 2024,
      },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 63 },
      { label: "Execution Record", score: 71 },
      { label: "Legal Risk", score: 58 },
      { label: "Compliance", score: 70 },
    ],
    subsidiaries: ["HCC Concessions Ltd", "HCC Infrastructure"],
  },
  {
    id: "afcons",
    name: "Afcons Infrastructure",
    type: "Metro/Tunnel",
    score: 79,
    activeProjects: 8,
    litigation: 4,
    financialHealth: "Strong",
    blacklistRisk: "LOW",
    status: "Active",
    blacklisted: false,
    contracts: [
      {
        project: "Bengaluru Metro Phase 3 Corridor C",
        value: "₹8,920 Cr",
        status: "Execution",
      },
      {
        project: "Kolkata Metro East-West Extension",
        value: "₹3,200 Cr",
        status: "Execution",
      },
    ],
    litigationDetails: [
      { court: "Bombay HC", value: "₹40 Cr", status: "Settled", year: 2022 },
      { court: "NHAI DRB", value: "₹75 Cr", status: "DRB Stage", year: 2023 },
      {
        court: "MMRDA Arbitration",
        value: "₹160 Cr",
        status: "Pending",
        year: 2024,
      },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 80 },
      { label: "Execution Record", score: 82 },
      { label: "Legal Risk", score: 76 },
      { label: "Compliance", score: 78 },
    ],
    subsidiaries: ["Afcons Gulf Contracting", "Afcons International"],
  },
  {
    id: "pnc",
    name: "PNC Infratech",
    type: "Highway",
    score: 76,
    activeProjects: 22,
    litigation: 4,
    financialHealth: "Moderate",
    blacklistRisk: "MEDIUM",
    status: "Active",
    blacklisted: false,
    contracts: [
      {
        project: "NH-27 UP Package 5 (Gorakhpur–Varanasi)",
        value: "₹1,860 Cr",
        status: "Execution",
      },
      {
        project: "Purvanchal Expressway Package 3",
        value: "₹1,480 Cr",
        status: "Monitoring",
      },
    ],
    litigationDetails: [
      { court: "Allahabad HC", value: "₹54 Cr", status: "Pending", year: 2022 },
      { court: "NHAI DRB", value: "₹88 Cr", status: "DRB Stage", year: 2023 },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 77 },
      { label: "Execution Record", score: 79 },
      { label: "Legal Risk", score: 72 },
      { label: "Compliance", score: 76 },
    ],
    subsidiaries: ["PNC Projects", "PNC Highways"],
  },
  {
    id: "abc",
    name: "Ashoka Buildcon",
    type: "Highway",
    score: 74,
    activeProjects: 17,
    litigation: 6,
    financialHealth: "Moderate",
    blacklistRisk: "MEDIUM",
    status: "Active",
    blacklisted: false,
    contracts: [
      {
        project: "Nagpur–Mumbai Super Highway Package 9",
        value: "₹2,100 Cr",
        status: "Execution",
      },
      {
        project: "Samruddhi Mahamarg Package 4",
        value: "₹3,400 Cr",
        status: "At Risk",
      },
    ],
    litigationDetails: [
      { court: "Bombay HC", value: "₹120 Cr", status: "Pending", year: 2021 },
      {
        court: "NHAI Arbitration",
        value: "₹95 Cr",
        status: "Arbitration",
        year: 2022,
      },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 75 },
      { label: "Execution Record", score: 76 },
      { label: "Legal Risk", score: 71 },
      { label: "Compliance", score: 74 },
    ],
    subsidiaries: ["Ashoka Concessions", "Ashoka Highway Solutions"],
  },
  {
    id: "tata",
    name: "Tata Projects Ltd",
    type: "Multi-sector",
    score: 88,
    activeProjects: 15,
    litigation: 2,
    financialHealth: "Strong",
    blacklistRisk: "LOW",
    status: "Active",
    blacklisted: false,
    contracts: [
      {
        project: "Vizag Port Expansion Phase 2",
        value: "₹1,980 Cr",
        status: "Claims",
      },
      {
        project: "New Delhi Central Vista Redevelopment",
        value: "₹862 Cr",
        status: "Monitoring",
      },
    ],
    litigationDetails: [
      { court: "NHAI DRB", value: "₹48 Cr", status: "DRB Stage", year: 2023 },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 91 },
      { label: "Execution Record", score: 89 },
      { label: "Legal Risk", score: 86 },
      { label: "Compliance", score: 86 },
    ],
    subsidiaries: ["Tata Projects International", "Tata Consulting Engineers"],
  },
  {
    id: "jmc",
    name: "JMC Projects",
    type: "Civil",
    score: 61,
    activeProjects: 8,
    litigation: 8,
    financialHealth: "Weak",
    blacklistRisk: "HIGH",
    status: "Watch",
    blacklisted: false,
    contracts: [
      {
        project: "Gujarat State Highway Rehabilitation",
        value: "₹480 Cr",
        status: "Delayed",
      },
      {
        project: "Ahmedabad Ring Road Package 6",
        value: "₹620 Cr",
        status: "At Risk",
      },
    ],
    litigationDetails: [
      { court: "Gujarat HC", value: "₹145 Cr", status: "Pending", year: 2021 },
      {
        court: "NHAI Arbitration",
        value: "₹200 Cr",
        status: "Arbitration",
        year: 2022,
      },
      { court: "IDBI DRT", value: "₹380 Cr", status: "Pending", year: 2023 },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 57 },
      { label: "Execution Record", score: 64 },
      { label: "Legal Risk", score: 54 },
      { label: "Compliance", score: 63 },
    ],
    subsidiaries: ["JMC Highways", "JMC Real Estate"],
  },
  {
    id: "gri",
    name: "GR Infraprojects",
    type: "Highway",
    score: 77,
    activeProjects: 14,
    litigation: 3,
    financialHealth: "Moderate",
    blacklistRisk: "LOW",
    status: "Active",
    blacklisted: false,
    contracts: [
      {
        project: "NHDP Phase V Rajasthan Stretch",
        value: "₹1,640 Cr",
        status: "Execution",
      },
      {
        project: "Delhi–Jaipur NH-48 Package 3",
        value: "₹1,200 Cr",
        status: "Monitoring",
      },
    ],
    litigationDetails: [
      { court: "Rajasthan HC", value: "₹55 Cr", status: "Pending", year: 2022 },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 78 },
      { label: "Execution Record", score: 80 },
      { label: "Legal Risk", score: 74 },
      { label: "Compliance", score: 76 },
    ],
    subsidiaries: ["GR Highways", "GR Projects International"],
  },
  {
    id: "omega",
    name: "Omega Infrastructure Pvt Ltd",
    type: "Civil",
    score: 23,
    activeProjects: 0,
    litigation: 12,
    financialHealth: "Critical",
    blacklistRisk: "BLACKLISTED",
    status: "BLOCKED",
    blacklisted: true,
    contracts: [],
    litigationDetails: [
      {
        court: "CBI Investigation",
        value: "₹480 Cr",
        status: "Criminal Probe",
        year: 2022,
      },
      {
        court: "Enforcement Directorate",
        value: "₹800 Cr",
        status: "Under PMLA",
        year: 2023,
      },
      {
        court: "NHAI Blacklist Order",
        value: "₹1,200 Cr",
        status: "Blacklisted",
        year: 2024,
      },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 18 },
      { label: "Execution Record", score: 21 },
      { label: "Legal Risk", score: 12 },
      { label: "Compliance", score: 15 },
    ],
    subsidiaries: [
      "Omega Civil (shell)",
      "Omega Buildtech (shell)",
      "SGK Infra (linked entity)",
    ],
  },
  {
    id: "satyam",
    name: "Satyam Infra Projects",
    type: "Bridge",
    score: 18,
    activeProjects: 0,
    litigation: 17,
    financialHealth: "Critical",
    blacklistRisk: "BLACKLISTED",
    status: "BLOCKED",
    blacklisted: true,
    contracts: [],
    litigationDetails: [
      {
        court: "SFIO Investigation",
        value: "₹340 Cr",
        status: "Criminal Probe",
        year: 2021,
      },
      {
        court: "MoRTH Blacklist Order",
        value: "₹560 Cr",
        status: "Blacklisted",
        year: 2022,
      },
      {
        court: "ED Asset Attachment",
        value: "₹920 Cr",
        status: "Under PMLA",
        year: 2023,
      },
    ],
    scoreBreakdown: [
      { label: "Financial Health", score: 14 },
      { label: "Execution Record", score: 16 },
      { label: "Legal Risk", score: 9 },
      { label: "Compliance", score: 13 },
    ],
    subsidiaries: ["SIP Highways (shell)", "SPL Bridges (shell)"],
  },
];

// ── Graph Nodes ───────────────────────────────────────────────────────────────
const GRAPH_NODES: GraphNode[] = [
  {
    id: "lt",
    name: "L&T",
    type: "vendor",
    risk: "low",
    x: 200,
    y: 180,
    connections: ["p1", "p2", "p3", "p4", "p5"],
  },
  {
    id: "ncc",
    name: "NCC",
    type: "vendor",
    risk: "low",
    x: 380,
    y: 100,
    connections: ["p3", "p6", "p7"],
  },
  {
    id: "hcc",
    name: "HCC",
    type: "vendor",
    risk: "high",
    x: 110,
    y: 320,
    connections: ["p8", "p9", "lc1"],
  },
  {
    id: "omega",
    name: "OMEGA",
    type: "vendor",
    risk: "blacklisted",
    x: 470,
    y: 300,
    connections: [],
  },
  {
    id: "p1",
    name: "NHAI Project 1",
    type: "project",
    risk: "low",
    x: 80,
    y: 100,
    connections: [],
  },
  {
    id: "p2",
    name: "NHAI Project 2",
    type: "project",
    risk: "low",
    x: 80,
    y: 180,
    connections: [],
  },
  {
    id: "p3",
    name: "NHAI Project 3",
    type: "project",
    risk: "medium",
    x: 300,
    y: 50,
    connections: [],
  },
  {
    id: "p4",
    name: "State Project 1",
    type: "project",
    risk: "low",
    x: 110,
    y: 240,
    connections: [],
  },
  {
    id: "p5",
    name: "State Project 2",
    type: "project",
    risk: "low",
    x: 140,
    y: 120,
    connections: [],
  },
  {
    id: "p6",
    name: "NHAI Project 4",
    type: "project",
    risk: "low",
    x: 460,
    y: 50,
    connections: [],
  },
  {
    id: "p7",
    name: "State Project 3",
    type: "project",
    risk: "low",
    x: 500,
    y: 120,
    connections: [],
  },
  {
    id: "p8",
    name: "NHAI Project 5",
    type: "project",
    risk: "high",
    x: 50,
    y: 360,
    connections: [],
  },
  {
    id: "p9",
    name: "State Project 4",
    type: "project",
    risk: "medium",
    x: 160,
    y: 390,
    connections: [],
  },
  {
    id: "lc1",
    name: "Legal Case",
    type: "entity",
    risk: "high",
    x: 230,
    y: 380,
    connections: [],
  },
];

const NODE_COLORS: Record<string, string> = {
  low: "#00E676",
  medium: "#FFB300",
  high: "#FF6D00",
  blacklisted: "#FF3D00",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const scoreColor = (s: number) =>
  s >= 80 ? "#00E676" : s >= 60 ? "#FFB300" : "#FF3D00";

const healthColor: Record<HealthLabel, string> = {
  Strong: "#00E676",
  Moderate: "#FFB300",
  Weak: "#FF6D00",
  Critical: "#FF3D00",
};

const blacklistStyle: Record<
  BlacklistRisk,
  { bg: string; border: string; text: string }
> = {
  LOW: {
    bg: "rgba(0,230,118,0.12)",
    border: "rgba(0,230,118,0.3)",
    text: "#00E676",
  },
  MEDIUM: {
    bg: "rgba(255,179,0,0.12)",
    border: "rgba(255,179,0,0.3)",
    text: "#FFB300",
  },
  HIGH: {
    bg: "rgba(255,109,0,0.15)",
    border: "rgba(255,109,0,0.3)",
    text: "#FF6D00",
  },
  BLACKLISTED: {
    bg: "rgba(255,61,0,0.18)",
    border: "rgba(255,61,0,0.4)",
    text: "#FF3D00",
  },
};

const statusStyle: Record<
  VendorStatus,
  { bg: string; text: string; border: string }
> = {
  Active: {
    bg: "rgba(0,230,118,0.1)",
    text: "#00E676",
    border: "rgba(0,230,118,0.25)",
  },
  Watch: {
    bg: "rgba(255,179,0,0.1)",
    text: "#FFB300",
    border: "rgba(255,179,0,0.25)",
  },
  BLOCKED: {
    bg: "rgba(255,61,0,0.12)",
    text: "#FF3D00",
    border: "rgba(255,61,0,0.3)",
  },
};

// ── Score New Vendor Modal ───────────────────────────────────────────────────
function ScoreVendorModal({ onClose }: { onClose: () => void }) {
  const [vendorName, setVendorName] = useState("");
  const [vendorType, setVendorType] = useState("Highway EPC");
  const [orderBook, setOrderBook] = useState("");
  const [litigations, setLitigations] = useState("0");
  const [financialHealth, setFinancialHealth] = useState("Strong");
  const [yearsExperience, setYearsExperience] = useState("10");
  const [scored, setScored] = useState(false);
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState<
    { label: string; score: number }[]
  >([]);

  function handleScore(e: React.FormEvent) {
    e.preventDefault();
    if (!vendorName) return;
    const litNum = Number(litigations) || 0;
    const health =
      financialHealth === "Strong"
        ? 90
        : financialHealth === "Moderate"
          ? 65
          : 35;
    const exp = Math.min(Number(yearsExperience) * 3, 30);
    const litPenalty = Math.min(litNum * 6, 40);
    const raw = [
      { label: "Financial Health", score: health },
      { label: "Execution Record", score: Math.max(40, 85 - litNum * 4 + exp) },
      { label: "Legal Risk", score: Math.max(10, 95 - litPenalty * 1.5) },
      { label: "Compliance", score: Math.max(30, 90 - litPenalty) },
    ];
    const total = Math.round(raw.reduce((s, b) => s + b.score, 0) / raw.length);
    setBreakdown(raw.map((b) => ({ ...b, score: Math.round(b.score) })));
    setScore(total);
    setScored(true);
  }

  function handleDownload() {
    const now = new Date().toISOString().split("T")[0];
    const content = `INFRAOS VENDOR CREDIBILITY SCORE REPORT
Generated: ${now}
User: Naman Maheshwari

=== VENDOR ASSESSMENT ===
Vendor Name: ${vendorName}
Vendor Type: ${vendorType}
Order Book: ₹${orderBook} Cr
Litigation Count: ${litigations}
Financial Health: ${financialHealth}
Years Experience: ${yearsExperience}

=== CREDIBILITY SCORE ===
Overall Score: ${score}/100

=== BREAKDOWN ===
${breakdown.map((b) => `${b.label},${b.score}/100`).join("\n")}

=== RECOMMENDATION ===
${score >= 80 ? "LOW RISK — Approved for high-value contracts up to ₹50 Cr" : score >= 60 ? "MEDIUM RISK — Approved with enhanced monitoring. Cap at ₹25 Cr per package." : "HIGH RISK — Requires additional financial guarantees. Refer to legal team before award."}

=== NOTES ===
Assessment methodology: InfraOS Vendor Intelligence Framework v3.1
Based on: Financial health, litigation history, execution record, compliance score
`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `InfraOS-Vendor-Score-${vendorName.replace(/\s+/g, "-")}-${now}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded vendor score for ${vendorName}`);
  }

  const scoreColor = (s: number) =>
    s >= 80 ? "#00E676" : s >= 60 ? "#FFB300" : "#FF3D00";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.8)" }}
      data-ocid="vendors.score_modal.dialog"
    >
      <div
        className="glass-elevated w-full max-w-xl mx-4 flex flex-col"
        style={{ maxHeight: "92vh" }}
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
              <Brain size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-label text-[10px] mb-0.5">
                CONTRACTOR INTELLIGENCE ENGINE
              </p>
              <h3 className="text-base font-bold text-foreground">
                Score New Vendor
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-1.5"
            aria-label="Close"
            data-ocid="vendors.score_modal.close_button"
          >
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {scored ? (
            <div className="space-y-5">
              <div
                className="p-5 rounded-xl text-center"
                style={{
                  background: "rgba(0,212,255,0.06)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
              >
                <p className="text-label text-[10px] mb-2">
                  OVERALL CREDIBILITY SCORE
                </p>
                <div
                  className="font-display font-bold text-5xl mb-2"
                  style={{
                    color: scoreColor(score),
                    textShadow: `0 0 20px ${scoreColor(score)}60`,
                  }}
                >
                  {score}
                </div>
                <div className="text-sm text-muted-foreground">
                  /100 —{" "}
                  {score >= 80
                    ? "LOW RISK"
                    : score >= 60
                      ? "MEDIUM RISK"
                      : "HIGH RISK"}
                </div>
              </div>
              <div className="space-y-3">
                {breakdown.map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {b.label}
                      </span>
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: scoreColor(b.score) }}
                      >
                        {b.score}/100
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${b.score}%`,
                          background: scoreColor(b.score),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="p-4 rounded-lg"
                style={{
                  background: `${scoreColor(score)}10`,
                  border: `1px solid ${scoreColor(score)}30`,
                }}
              >
                <p
                  className="text-xs font-bold mb-1"
                  style={{ color: scoreColor(score) }}
                >
                  RECOMMENDATION
                </p>
                <p className="text-xs text-muted-foreground">
                  {score >= 80
                    ? "LOW RISK — Approved for high-value contracts up to ₹50 Cr"
                    : score >= 60
                      ? "MEDIUM RISK — Approved with enhanced monitoring. Cap at ₹25 Cr per package."
                      : "HIGH RISK — Requires additional financial guarantees. Refer to legal team before award."}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                  onClick={handleDownload}
                  data-ocid="vendors.score_modal.download_button"
                >
                  <Download size={14} /> Download Score Report
                </button>
                <button
                  type="button"
                  className="btn-secondary text-sm"
                  onClick={() => setScored(false)}
                >
                  Score Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleScore} className="space-y-4">
              <div>
                <label
                  htmlFor="sv-name"
                  className="text-[10px] text-muted-foreground block mb-1.5"
                >
                  VENDOR / CONTRACTOR NAME *
                </label>
                <input
                  id="sv-name"
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. Ratan Infra Ltd"
                  className="w-full glass-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-smooth"
                  data-ocid="vendors.score_modal.name_input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="sv-type"
                    className="text-[10px] text-muted-foreground block mb-1.5"
                  >
                    VENDOR TYPE
                  </label>
                  <select
                    id="sv-type"
                    value={vendorType}
                    onChange={(e) => setVendorType(e.target.value)}
                    className="w-full glass-card px-3 py-2.5 text-sm text-foreground outline-none transition-smooth"
                    data-ocid="vendors.score_modal.type_select"
                  >
                    {[
                      "Highway EPC",
                      "Bridge EPC",
                      "Metro/Tunnel",
                      "Civil",
                      "Multi-sector",
                      "Power EPC",
                      "Water/Urban",
                    ].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="sv-health"
                    className="text-[10px] text-muted-foreground block mb-1.5"
                  >
                    FINANCIAL HEALTH
                  </label>
                  <select
                    id="sv-health"
                    value={financialHealth}
                    onChange={(e) => setFinancialHealth(e.target.value)}
                    className="w-full glass-card px-3 py-2.5 text-sm text-foreground outline-none transition-smooth"
                    data-ocid="vendors.score_modal.health_select"
                  >
                    {["Strong", "Moderate", "Weak"].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="sv-orderbook"
                    className="text-[10px] text-muted-foreground block mb-1.5"
                  >
                    ORDER BOOK (₹ CR)
                  </label>
                  <input
                    id="sv-orderbook"
                    type="number"
                    value={orderBook}
                    onChange={(e) => setOrderBook(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full glass-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-smooth"
                    data-ocid="vendors.score_modal.orderbook_input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sv-lit"
                    className="text-[10px] text-muted-foreground block mb-1.5"
                  >
                    ACTIVE LITIGATIONS
                  </label>
                  <input
                    id="sv-lit"
                    type="number"
                    min="0"
                    value={litigations}
                    onChange={(e) => setLitigations(e.target.value)}
                    className="w-full glass-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-smooth"
                    data-ocid="vendors.score_modal.litigations_input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sv-exp"
                    className="text-[10px] text-muted-foreground block mb-1.5"
                  >
                    YEARS IN OPERATION
                  </label>
                  <input
                    id="sv-exp"
                    type="number"
                    min="1"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="w-full glass-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-smooth"
                    data-ocid="vendors.score_modal.experience_input"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
                data-ocid="vendors.score_modal.submit_button"
              >
                <Brain size={14} /> Generate AI Score
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VendorsPage() {
  const { selectedOrg } = useOrg();
  const orgData = getOrgData(selectedOrg.key);
  const [search, setSearch] = useState("");
  const [expandedVendor, setExpandedVendor] = useState<string | null>("dbl");
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "litigation" | "name">(
    "score",
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (col: "score" | "litigation" | "name") => {
    if (sortBy === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const filtered = VENDORS.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()),
  ).sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "score") return (a.score - b.score) * dir;
    if (sortBy === "litigation") return (a.litigation - b.litigation) * dir;
    return a.name.localeCompare(b.name) * dir;
  });

  const expanded = VENDORS.find((v) => v.id === expandedVendor);

  function downloadVendorReport(vendorName?: string) {
    const now = new Date().toISOString().split("T")[0];
    const content = `INFRAOS VENDOR INTELLIGENCE REPORT
Generated: ${now}
User: Naman Maheshwari
${vendorName ? `Vendor: ${vendorName}` : "Scope: All Active Vendors"}

=== VENDOR SCORECARD ===
Vendor,Order Book (₹Cr),Litigation (₹Cr),Risk Score,Status
L&T Infrastructure,145000,18000,72/100,High Risk
Afcons Infrastructure,42000,3200,58/100,Medium Risk
Tata Projects,38000,890,41/100,Low Risk
HCC Limited,28000,22000,81/100,Critical Risk
KNR Constructions,18500,420,29/100,Low Risk
PNC Infratech,16200,1800,53/100,Medium Risk
IRCON International,12400,650,35/100,Low Risk
NCC Limited,14800,2100,48/100,Medium Risk
Dilip Buildcon,19600,3400,61/100,High Risk
GMR Infra,22000,5600,67/100,High Risk

=== ARBITRATION EXPOSURE ===
Total Industry Arbitration: ₹70,000+ Crore
HCC vs NHAI (Multiple claims): ₹22,000 Cr
L&T claims portfolio: ₹18,000 Cr
Afcons pending disputes: ₹3,200 Cr

=== BLACKLIST / DEBARMENT STATUS ===
Vendor,Authority,Reason,Period
Coastal Engineering Pvt Ltd,NHAI,Quality Violations,2023-2025
Rapid Infra Solutions,MoRTH,Bid Fraud,2022-2024
BuildFast Contractors,CPWD,Contract Abandonment,2024-2026

=== EXECUTIVE RECOMMENDATIONS ===
1. HCC: Recommend financial health audit before awarding new contracts
2. L&T: High-value partner — maintain with enhanced monitoring
3. KNR: Strong performer — prioritize for new NHAI awards
4. Dilip Buildcon: Escalating litigation — mandate dispute resolution escrow
`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `InfraOS-Vendor-Intelligence-${now}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 space-y-5" data-ocid="vendors.page">
      {showScoreModal && (
        <ScoreVendorModal onClose={() => setShowScoreModal(false)} />
      )}
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
            <span>Home</span>
            <ChevronRight size={10} />
            <span className="text-primary">Vendor Intelligence</span>
          </nav>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label text-[0.6rem] px-2 py-0.5 rounded border border-primary/30 bg-primary/8 text-primary">
              CONTRACTOR INTELLIGENCE ENGINE
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Vendor Intelligence
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Contractor credibility · Litigation exposure · Blacklist risk ·
            Financial health
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary text-sm flex items-center gap-2"
            data-ocid="vendors.export_csv_button"
            onClick={() => downloadVendorReport()}
          >
            <Download size={13} /> Export Vendor CSV
          </button>
          <button
            type="button"
            className="btn-primary text-sm"
            data-ocid="vendors.score_button"
            onClick={() => setShowScoreModal(true)}
          >
            Score New Vendor
          </button>
        </div>
      </div>

      {/* ── KPIs ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Registered Vendors",
            value: orgData.vendors.length.toString(),
            color: "#00D4FF",
            icon: Users,
          },
          {
            label: "High-Risk Vendors",
            value: orgData.vendors
              .filter((v) => v.tier === "red" || v.tier === "amber")
              .length.toString(),
            color: "#FF6D00",
            icon: AlertTriangle,
          },
          {
            label: "Blacklisted",
            value: orgData.vendors
              .filter((v) => v.blacklisted)
              .length.toString(),
            color: "#FF3D00",
            icon: Shield,
          },
          {
            label: "Contracts Tracked",
            value: orgData.kpis.totalInvestment,
            color: "#00E676",
            icon: BarChart3,
          },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="glass-card p-4"
              data-ocid={`vendors.kpi.${k.label.toLowerCase().replace(/ /g, "_")}`}
            >
              <Icon size={16} style={{ color: k.color }} className="mb-2" />
              <div
                className="font-mono font-bold text-2xl"
                style={{ color: k.color }}
              >
                {k.value}
              </div>
              <div className="text-label mt-1">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* ── Real Vendor Intelligence Table ──────────────────────────────── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="vendors.real_intelligence_panel"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-primary" />
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                National EPC Vendor Intelligence Registry
              </h2>
              <p className="text-label mt-0.5" style={{ fontSize: "0.62rem" }}>
                Real contractor data — arbitration exposure, litigation scores,
                financial health
              </p>
            </div>
          </div>
          <span
            className="font-mono text-xs px-2 py-0.5 rounded"
            style={{
              background: "rgba(0,212,255,0.1)",
              color: "#00D4FF",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            {REAL_VENDORS.length} vendors
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/20">
                {[
                  "Vendor Name",
                  "Type",
                  "Active Contracts",
                  "Total Value",
                  "Arbitration Exposure",
                  "Blacklist Risk",
                  "Litigation Score",
                  "Financial Health",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2.5 text-label whitespace-nowrap"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REAL_VENDORS.map((v, i) => {
                const blStyle = blacklistStyle[v.blacklistRisk];
                const stStyle =
                  statusStyle[v.status as keyof typeof statusStyle] ??
                  statusStyle.Active;
                const litColor =
                  v.litigationScore >= 80
                    ? "#FF3D00"
                    : v.litigationScore >= 50
                      ? "#FF6D00"
                      : v.litigationScore >= 30
                        ? "#FFB300"
                        : "#00E676";
                return (
                  <tr
                    key={v.name}
                    className="border-b border-border/10 hover:bg-white/[0.025] transition-smooth"
                    data-ocid={`vendors.real_vendor.item.${i + 1}`}
                  >
                    <td className="px-3 py-2.5">
                      <div className="font-semibold text-foreground">
                        {v.name}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {v.type}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-primary">
                      {v.activeContracts > 0 ? v.activeContracts : "—"}
                    </td>
                    <td
                      className="px-3 py-2.5 font-mono font-bold whitespace-nowrap"
                      style={{ color: "#00D4FF" }}
                    >
                      {v.totalValue}
                    </td>
                    <td
                      className="px-3 py-2.5 font-mono font-bold whitespace-nowrap"
                      style={{
                        color:
                          v.arbitrationExposure !== "—"
                            ? "#FF8C42"
                            : "rgba(176,190,197,0.4)",
                      }}
                    >
                      {v.arbitrationExposure}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="text-[0.6rem] font-bold px-2 py-0.5 rounded"
                        style={{ ...blStyle }}
                      >
                        {v.blacklistRisk}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-1.5 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${v.litigationScore}%`,
                              background: litColor,
                            }}
                          />
                        </div>
                        <span
                          className="font-mono font-bold"
                          style={{ color: litColor }}
                        >
                          {v.litigationScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span
                        className="text-xs"
                        style={{
                          color: v.financialHealth.startsWith("Strong")
                            ? "#00E676"
                            : v.financialHealth.startsWith("Moderate")
                              ? "#FFB300"
                              : "#FF3D00",
                        }}
                      >
                        {v.financialHealth}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="text-[0.6rem] font-bold px-2 py-0.5 rounded"
                        style={{ ...stStyle }}
                      >
                        {v.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* HCC callout */}
        <div
          className="mx-4 mb-4 mt-3 p-3 rounded-lg flex items-start gap-3"
          style={{
            background: "rgba(255,179,0,0.07)",
            border: "1px solid rgba(255,179,0,0.2)",
          }}
        >
          <AlertTriangle
            size={14}
            style={{ color: "#FFB300", flexShrink: 0, marginTop: 1 }}
          />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span style={{ color: "#FFB300", fontWeight: 700 }}>
              ⚠ WATCH FLAG — HCC Limited:
            </span>{" "}
            Litigation Score 87/100 with ₹32,000 Cr arbitration exposure.
            Recommended quarterly re-evaluation. Partial NCLT resolution in 2023
            but new claims filed. Financial health improving but still Moderate
            category.
          </p>
        </div>
      </div>

      {/* ── Main Layout: Table + Detail Panel ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Vendor Table */}
        <div
          className="xl:col-span-2 glass-card overflow-hidden"
          data-ocid="vendors.table_panel"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-primary" />
              <h2 className="font-semibold text-sm text-foreground">
                Contractor Intelligence Database
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded glass-card">
                <Search
                  size={12}
                  className="text-muted-foreground flex-shrink-0"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search vendors..."
                  className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-36"
                  data-ocid="vendors.search_input"
                />
              </div>
              <button
                type="button"
                className="btn-ghost p-2 text-xs"
                data-ocid="vendors.export_button"
                onClick={() => downloadVendorReport()}
              >
                <Download size={13} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/20">
                  <th
                    className="text-left px-4 py-2.5 text-label"
                    style={{ fontSize: "0.6rem", minWidth: 180 }}
                  >
                    VENDOR NAME
                  </th>
                  <th
                    className="text-left px-4 py-2.5 text-label"
                    style={{ fontSize: "0.6rem" }}
                  >
                    TYPE
                  </th>
                  <th
                    className="text-left px-4 py-2.5 text-label cursor-pointer select-none"
                    style={{ fontSize: "0.6rem" }}
                    onClick={() => toggleSort("score")}
                    onKeyDown={(e) => e.key === "Enter" && toggleSort("score")}
                    data-ocid="vendors.sort.score"
                    scope="col"
                  >
                    SCORE{" "}
                    {sortBy === "score" ? (
                      sortDir === "desc" ? (
                        <ChevronDown size={9} className="inline" />
                      ) : (
                        <ChevronUp size={9} className="inline" />
                      )
                    ) : null}
                  </th>
                  <th
                    className="text-left px-4 py-2.5 text-label"
                    style={{ fontSize: "0.6rem" }}
                  >
                    PROJECTS
                  </th>
                  <th
                    className="text-left px-4 py-2.5 text-label cursor-pointer select-none"
                    style={{ fontSize: "0.6rem" }}
                    onClick={() => toggleSort("litigation")}
                    onKeyDown={(e) =>
                      e.key === "Enter" && toggleSort("litigation")
                    }
                    data-ocid="vendors.sort.litigation"
                    scope="col"
                  >
                    LITIGATION{" "}
                    {sortBy === "litigation" ? (
                      sortDir === "desc" ? (
                        <ChevronDown size={9} className="inline" />
                      ) : (
                        <ChevronUp size={9} className="inline" />
                      )
                    ) : null}
                  </th>
                  <th
                    className="text-left px-4 py-2.5 text-label"
                    style={{ fontSize: "0.6rem" }}
                  >
                    FINANCIAL
                  </th>
                  <th
                    className="text-left px-4 py-2.5 text-label"
                    style={{ fontSize: "0.6rem" }}
                  >
                    BLACKLIST RISK
                  </th>
                  <th
                    className="text-left px-4 py-2.5 text-label"
                    style={{ fontSize: "0.6rem" }}
                  >
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => (
                  <tr
                    key={v.id}
                    onClick={() =>
                      setExpandedVendor(expandedVendor === v.id ? null : v.id)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setExpandedVendor(expandedVendor === v.id ? null : v.id)
                    }
                    tabIndex={0}
                    className="border-b border-border/10 transition-smooth cursor-pointer"
                    style={{
                      background:
                        expandedVendor === v.id
                          ? "rgba(0,212,255,0.06)"
                          : v.blacklisted
                            ? "rgba(255,61,0,0.06)"
                            : v.score < 60
                              ? "rgba(255,61,0,0.03)"
                              : v.score < 75
                                ? "rgba(255,109,0,0.02)"
                                : "transparent",
                      borderLeft: v.blacklisted
                        ? "3px solid rgba(255,61,0,0.6)"
                        : v.score < 60
                          ? "3px solid rgba(255,61,0,0.3)"
                          : v.score < 75
                            ? "3px solid rgba(255,109,0,0.25)"
                            : "3px solid transparent",
                    }}
                    data-ocid={`vendors.vendor.item.${i + 1}`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div>
                          <p
                            className="font-semibold text-foreground"
                            style={{ maxWidth: 180 }}
                          >
                            {v.name}
                          </p>
                          {v.blacklisted && (
                            <span
                              className="text-[0.58rem] font-bold px-1.5 py-0.5 rounded"
                              style={{
                                background: "rgba(255,61,0,0.15)",
                                color: "#FF3D00",
                                border: "1px solid rgba(255,61,0,0.3)",
                              }}
                            >
                              BLACKLISTED
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                      {v.type}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-12 h-1.5 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${v.score}%`,
                              background: scoreColor(v.score),
                            }}
                          />
                        </div>
                        <span
                          className="font-mono font-bold"
                          style={{ color: scoreColor(v.score) }}
                        >
                          {v.score}/100
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-primary">
                      {v.activeProjects}
                    </td>
                    <td
                      className="px-4 py-2.5 font-mono font-bold"
                      style={{
                        color:
                          v.litigation > 8
                            ? "#FF3D00"
                            : v.litigation > 4
                              ? "#FFB300"
                              : "#00E676",
                      }}
                    >
                      {v.litigation}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: healthColor[v.financialHealth] }}
                      >
                        {v.financialHealth}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="text-[0.6rem] font-bold px-2 py-0.5 rounded"
                        style={{ ...blacklistStyle[v.blacklistRisk] }}
                      >
                        {v.blacklistRisk}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="text-[0.6rem] font-bold px-2 py-0.5 rounded"
                        style={{ ...statusStyle[v.status] }}
                      >
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vendor Detail Panel */}
        <div className="space-y-4">
          {expanded ? (
            <div
              className="glass-card overflow-hidden"
              data-ocid="vendors.detail_panel"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {expanded.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {expanded.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedVendor(null)}
                  className="w-6 h-6 flex items-center justify-center rounded transition-smooth hover:bg-white/10"
                  data-ocid="vendors.detail.close_button"
                >
                  <X size={12} className="text-muted-foreground" />
                </button>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto max-h-[600px]">
                {/* Score */}
                <div>
                  <p className="text-label text-[10px] mb-2">
                    CREDIBILITY BREAKDOWN
                  </p>
                  <div className="space-y-2">
                    {expanded.scoreBreakdown.map((s) => (
                      <div key={s.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            {s.label}
                          </span>
                          <span
                            className="font-mono text-xs font-bold"
                            style={{ color: scoreColor(s.score) }}
                          >
                            {s.score}
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${s.score}%`,
                              background: scoreColor(s.score),
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Contracts */}
                {expanded.contracts.length > 0 && (
                  <div>
                    <p className="text-label text-[10px] mb-2">
                      ACTIVE CONTRACTS
                    </p>
                    <div className="space-y-2">
                      {expanded.contracts.map((c) => (
                        <div
                          key={c.project}
                          className="glass-card p-2.5 rounded"
                        >
                          <p className="text-[10px] font-semibold text-foreground leading-snug">
                            {c.project}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-mono text-[10px] text-primary">
                              {c.value}
                            </span>
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                              style={{
                                color:
                                  c.status === "At Risk"
                                    ? "#FF3D00"
                                    : c.status === "Claims"
                                      ? "#FF6D00"
                                      : "#00D4FF",
                                background:
                                  c.status === "At Risk"
                                    ? "rgba(255,61,0,0.12)"
                                    : "rgba(0,212,255,0.08)",
                                border: "1px solid currentColor",
                              }}
                            >
                              {c.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Litigation */}
                <div>
                  <p className="text-label text-[10px] mb-2">
                    LITIGATION HISTORY ({expanded.litigationDetails.length}{" "}
                    cases)
                  </p>
                  <div className="space-y-1.5">
                    {expanded.litigationDetails.map((l) => (
                      <div
                        key={`${l.court}-${l.year}`}
                        className="flex items-start gap-2 text-[10px] p-2 rounded"
                        style={{
                          background: "rgba(255,61,0,0.04)",
                          border: "1px solid rgba(255,61,0,0.1)",
                        }}
                      >
                        <TrendingDown
                          size={10}
                          style={{
                            color: "#FF6D00",
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground">
                            {l.court}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            ({l.year})
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="font-mono text-[9px]"
                              style={{ color: "#FF6D00" }}
                            >
                              {l.value}
                            </span>
                            <span
                              className="text-[9px] px-1 py-0.5 rounded"
                              style={{
                                background: "rgba(255,179,0,0.12)",
                                color: "#FFB300",
                              }}
                            >
                              {l.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subsidiaries */}
                <div>
                  <p className="text-label text-[10px] mb-2">
                    RELATED ENTITIES
                  </p>
                  <div className="space-y-1.5">
                    {expanded.subsidiaries.map((s) => (
                      <div
                        key={s}
                        className="flex items-center gap-2 text-[10px] text-muted-foreground p-1.5 rounded"
                        style={{ background: "rgba(0,212,255,0.04)" }}
                      >
                        <ExternalLink
                          size={9}
                          className="text-primary flex-shrink-0"
                        />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary text-xs w-full py-2"
                  data-ocid="vendors.detail.generate_report_button"
                  onClick={() => {
                    if (!expanded) return;
                    const now = new Date().toISOString().split("T")[0];
                    const content = `INFRAOS VENDOR CREDIBILITY REPORT\nGenerated: ${now}\nUser: Naman Maheshwari\n\nVendor: ${expanded.name}\nType: ${expanded.type}\nStatus: ${expanded.status}\nCredibility Score: ${expanded.score}/100\nActive Projects: ${expanded.activeProjects}\nBlacklist Risk: ${expanded.blacklistRisk}\nFinancial Health: ${expanded.financialHealth}\n\n=== SCORE BREAKDOWN ===\n${expanded.scoreBreakdown.map((b) => `${b.label},${b.score}/100`).join("\n")}\n\n=== ACTIVE CONTRACTS ===\n${expanded.contracts.length > 0 ? expanded.contracts.map((c) => `${c.project},${c.value},${c.status}`).join("\n") : "No active contracts"}\n\n=== LITIGATION HISTORY ===\n${expanded.litigationDetails.map((l) => `${l.court} (${l.year}),${l.value},${l.status}`).join("\n")}\n\n=== RELATED ENTITIES ===\n${expanded.subsidiaries.join("\n")}\n`;
                    const blob = new Blob([content], {
                      type: "text/csv;charset=utf-8;",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `InfraOS-Vendor-${expanded.name.replace(/\s+/g, "-")}-${now}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    toast.success(
                      `Downloaded credibility report for ${expanded.name}`,
                    );
                  }}
                >
                  Generate Credibility Report
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-4" data-ocid="vendors.select_prompt">
              <div className="text-center py-6">
                <Users size={32} className="text-primary/40 mx-auto mb-3" />
                <p className="text-sm font-semibold text-foreground/60">
                  Select a vendor
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click a row to view vendor intelligence
                </p>
              </div>
            </div>
          )}

          {/* AI Insight */}
          <div
            className="glass-card p-4"
            style={{ border: "1px solid rgba(0,212,255,0.2)" }}
            data-ocid="vendors.ai_panel"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(0,212,255,0.15)",
                  border: "1px solid rgba(0,212,255,0.3)",
                }}
              >
                <Brain size={13} style={{ color: "#00D4FF" }} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  AI Vendor Intelligence
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Portfolio Risk Summary
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-primary font-semibold">ALERT: </span>2
              blacklisted vendors identified with active shell company networks.
              3 "Watch" vendors showing financial stress — recommended quarterly
              re-evaluation. Dilip Buildcon Ltd showing 18-month trend of
              increasing litigation with concurrent milestone delays.
            </p>
            <button
              type="button"
              className="btn-secondary text-xs w-full mt-3 py-2"
              data-ocid="vendors.ai_report_button"
              onClick={() => {
                const now = new Date().toISOString().split("T")[0];
                const content = `INFRAOS FULL AI VENDOR INTELLIGENCE REPORT\nGenerated: ${now}\nUser: Naman Maheshwari\n\n=== PORTFOLIO RISK SUMMARY ===\n2 blacklisted vendors identified with active shell company networks.\n3 Watch vendors showing financial stress — recommended quarterly re-evaluation.\nDilip Buildcon Ltd showing 18-month trend of increasing litigation with concurrent milestone delays.\n\n=== ALL VENDORS SCORECARD ===\nVendor Name,Type,Score,Active Projects,Litigation Count,Financial Health,Blacklist Risk,Status\n${VENDORS.map((v) => `${v.name},${v.type},${v.score}/100,${v.activeProjects},${v.litigation},${v.financialHealth},${v.blacklistRisk},${v.status}`).join("\n")}\n\n=== ARBITRATION EXPOSURE ===\nTotal Estimated Exposure: ₹70000+ Cr\nHCC Limited: ₹18200 Cr\nL&T Infrastructure: ₹14800 Cr\nAfcons Infrastructure: ₹9200 Cr\nKNR Constructions: ₹7800 Cr\n\n=== RECOMMENDATIONS ===\n1. HCC: Recommend financial health audit before new contracts\n2. L&T: Maintain as preferred partner with enhanced monitoring\n3. KNR: Strong performer \u2014 prioritize for NHAI awards\n4. Dilip Buildcon: Mandate dispute resolution escrow\n5. Omega/Satyam: BLACKLISTED \u2014 Investigate shell company links\n`;
                const blob = new Blob([content], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `InfraOS-Vendor-AI-Report-${now}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success("Downloaded AI Vendor Intelligence Report");
              }}
            >
              Full AI Report →
            </button>
          </div>
        </div>
      </div>

      {/* ── Relationship Graph ────────────────────────────────────────────── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="vendors.graph_panel"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-primary" />
            <h2 className="font-semibold text-sm text-foreground">
              Contractor Relationship Graph
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {[
              { color: "#00E676", label: "Low Risk" },
              { color: "#FFB300", label: "Medium Risk" },
              { color: "#FF6D00", label: "High Risk" },
              { color: "#FF3D00", label: "Blacklisted" },
            ].map((l) => (
              <span
                key={l.label}
                className="flex items-center gap-1 text-[10px] text-muted-foreground"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: l.color }}
                />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div
            className="relative overflow-hidden rounded-lg"
            style={{
              height: 260,
              background: "rgba(0,212,255,0.02)",
              border: "1px solid rgba(0,212,255,0.08)",
            }}
            data-ocid="vendors.graph_canvas"
          >
            <div className="absolute inset-0 grid-overlay opacity-30" />
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 540 260"
              className="relative z-10"
              role="img"
              aria-label="Vendor relationship graph"
            >
              <title>Vendor Relationship Graph</title>
              {/* Draw edges */}
              {GRAPH_NODES.map((node) =>
                node.connections.map((targetId) => {
                  const target = GRAPH_NODES.find((n) => n.id === targetId);
                  if (!target) return null;
                  return (
                    <line
                      key={`${node.id}-${targetId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={NODE_COLORS[node.risk]}
                      strokeWidth="1"
                      strokeOpacity="0.3"
                      strokeDasharray={
                        node.risk === "blacklisted" ? "4 4" : "none"
                      }
                    />
                  );
                }),
              )}
              {/* Draw nodes */}
              {GRAPH_NODES.map((node) => {
                const isVendor = node.type === "vendor";
                const r = isVendor ? 18 : 10;
                const color = NODE_COLORS[node.risk];
                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={r}
                      fill={`${color}20`}
                      stroke={color}
                      strokeWidth={isVendor ? 2 : 1}
                    />
                    {node.risk === "blacklisted" && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={r + 4}
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        strokeOpacity="0.5"
                      />
                    )}
                    <text
                      x={node.x}
                      y={node.y + (isVendor ? r + 12 : r + 10)}
                      textAnchor="middle"
                      fill={isVendor ? color : "rgba(176,190,197,0.7)"}
                      fontSize={isVendor ? 9 : 7}
                      fontWeight={isVendor ? "700" : "400"}
                      fontFamily="monospace"
                    >
                      {node.name.length > 12
                        ? `${node.name.slice(0, 11)}…`
                        : node.name}
                    </text>
                    {node.risk === "blacklisted" && (
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill={color}
                        fontSize="9"
                        fontWeight="700"
                      >
                        ✕
                      </text>
                    )}
                    {node.type === "vendor" && node.risk !== "blacklisted" && (
                      <text
                        x={node.x}
                        y={node.y + 3}
                        textAnchor="middle"
                        fill={color}
                        fontSize="8"
                        fontWeight="700"
                      >
                        {node.id === "lt"
                          ? "L&T"
                          : node.id === "ncc"
                            ? "NCC"
                            : "HCC"}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            {/* Graph legend */}
            <div className="absolute bottom-3 left-3 glass-elevated px-2 py-1.5 rounded">
              <p className="text-[9px] text-muted-foreground">
                Nodes: Vendors (large) · Projects (small) · Legal entities
                (grey)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Risk Summary Bar ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Avg Credibility Score",
            value: "72/100",
            color: "#00D4FF",
            icon: CheckCircle2,
          },
          {
            label: "Watch-List Vendors",
            value: "2 this portfolio",
            color: "#FFB300",
            icon: AlertTriangle,
          },
          {
            label: "Total Litigation Exposure",
            value: "₹4,200+ Cr",
            color: "#FF3D00",
            icon: TrendingDown,
          },
          {
            label: "Clean Vendor Share",
            value: "67%",
            color: "#00E676",
            icon: Shield,
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="glass-card p-4 flex items-center gap-3"
              data-ocid={`vendors.risksummary.${s.label.toLowerCase().replace(/ /g, "_")}`}
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
                  className="font-mono font-bold text-base"
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
