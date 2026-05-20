import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Award,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  FileText,
  Filter,
  Gavel,
  Loader2,
  MapPin,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Upload,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
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
import { GEM_DATA, MATERIAL_COSTS, getOrgData } from "../data/orgData";

// ── Types ──────────────────────────────────────────────────────────────────────
type FraudRisk = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type TenderStatus =
  | "Under Review"
  | "Evaluation"
  | "Open"
  | "Awarded"
  | "Red Flag";
type UploadPhase = "idle" | "uploading" | "complete";
type ClauseTab = "all" | "risk" | "obligations" | "hidden";

interface Tender {
  id: string;
  project: string;
  ministry: string;
  estValue: string;
  l1Bid: string;
  fraudRisk: FraudRisk;
  clausesFlagged: number;
  status: TenderStatus;
  action: "Analyze" | "View" | "Investigate";
}

interface ClauseFlag {
  risk: FraudRisk;
  ref: string;
  description: string;
  recommendation: string;
  type: "risk" | "obligations" | "hidden";
}

interface BoqItem {
  item: string;
  estRate: string;
  marketRate: string;
  variance: string;
  positive: boolean;
  risk: FraudRisk;
}

interface FraudAlert {
  severity: FraudRisk;
  tenderId: string;
  project: string;
  issuer: string;
  description: string;
  anomalyType: string;
  partiesInvolved: string[];
  evidenceItems: string[];
}

// ── Expanded Tender Database (35+ entries) ─────────────────────────────────────
interface FullTender {
  id: string;
  authority: string;
  project: string;
  value: number;
  deadline: string;
  status: "Open" | "Under Review" | "Awarded" | "Closed" | "Cancelled";
  category:
    | "Roads"
    | "Railways"
    | "Urban"
    | "Power"
    | "Ports"
    | "Aviation"
    | "Metro"
    | "Water"
    | "Smart City";
  risk: FraudRisk;
}

const FULL_TENDERS: FullTender[] = [
  {
    id: "NHAI/EPC/2024/0891",
    authority: "NHAI",
    project: "NH-44 Jammu-Srinagar 4-Lane Highway Tunnel Package",
    value: 4230,
    deadline: "2025-02-28",
    status: "Under Review",
    category: "Roads",
    risk: "CRITICAL",
  },
  {
    id: "NHAI/HAM/2024/0456",
    authority: "NHAI",
    project: "NH-48 Vadodara-Mumbai Expressway Phase 2 — 6-Lane EPC",
    value: 3890,
    deadline: "2025-01-15",
    status: "Open",
    category: "Roads",
    risk: "HIGH",
  },
  {
    id: "NHIDCL/EPC/2024/0112",
    authority: "NHIDCL",
    project: "Arunachal Pradesh Frontier Highway Package 4",
    value: 2100,
    deadline: "2025-03-10",
    status: "Open",
    category: "Roads",
    risk: "MEDIUM",
  },
  {
    id: "RVNL/EPC/2024/0234",
    authority: "RVNL",
    project:
      "Dedicated Freight Corridor Ludhiana-Khurja Section Electrical Works",
    value: 1780,
    deadline: "2024-12-30",
    status: "Under Review",
    category: "Railways",
    risk: "HIGH",
  },
  {
    id: "IRCON/EPC/2024/0567",
    authority: "IRCON",
    project: "Jiribam-Imphal New BG Railway Line — Civil Package 3",
    value: 2450,
    deadline: "2025-04-15",
    status: "Open",
    category: "Railways",
    risk: "MEDIUM",
  },
  {
    id: "NTPC/C&I/2024/0789",
    authority: "NTPC",
    project: "Singrauli Super Thermal Power Station Unit 3 — C&I Package",
    value: 890,
    deadline: "2024-11-30",
    status: "Awarded",
    category: "Power",
    risk: "LOW",
  },
  {
    id: "PGCIL/TL/2024/0345",
    authority: "PGCIL",
    project: "400kV D/C Sipat-Bilaspur Transmission Line — 220 km",
    value: 560,
    deadline: "2025-01-31",
    status: "Open",
    category: "Power",
    risk: "LOW",
  },
  {
    id: "GAIL/CP/2024/0678",
    authority: "GAIL",
    project:
      "Jagdishpur-Haldia-Bokaro-Dhamra Pipeline Compressor Station Package",
    value: 1120,
    deadline: "2025-02-14",
    status: "Under Review",
    category: "Power",
    risk: "MEDIUM",
  },
  {
    id: "HPCL/EPC/2024/0901",
    authority: "HPCL",
    project: "Rajasthan Refinery — Crude Distillation Unit EPC",
    value: 3400,
    deadline: "2025-05-20",
    status: "Open",
    category: "Power",
    risk: "HIGH",
  },
  {
    id: "BPCL/MR/2024/0223",
    authority: "BPCL",
    project: "Mumbai Refinery Modernisation — Visbreaker Unit Revamp",
    value: 780,
    deadline: "2024-12-15",
    status: "Awarded",
    category: "Power",
    risk: "LOW",
  },
  {
    id: "LT-INFRA/EPC/2024/0445",
    authority: "L&T Infrastructure",
    project: "Hyderabad Regional Ring Road Section C — EPC Contractor",
    value: 2890,
    deadline: "2025-03-25",
    status: "Open",
    category: "Roads",
    risk: "MEDIUM",
  },
  {
    id: "TATA-PROJ/2024/0112",
    authority: "Tata Projects",
    project: "Mumbai-Ahmedabad Bullet Train Civil Package — Thane Creek Bridge",
    value: 5200,
    deadline: "2024-11-10",
    status: "Awarded",
    category: "Railways",
    risk: "LOW",
  },
  {
    id: "AFCONS/EPC/2024/0678",
    authority: "Afcons Infrastructure",
    project: "Mumbai Coastal Road Tunnel TBM Package North",
    value: 3100,
    deadline: "2025-02-01",
    status: "Closed",
    category: "Urban",
    risk: "HIGH",
  },
  {
    id: "HCC/WB/2024/0334",
    authority: "HCC",
    project: "Kolkata Second Hooghly Bridge Structural Strengthening Package",
    value: 1230,
    deadline: "2025-01-20",
    status: "Under Review",
    category: "Roads",
    risk: "CRITICAL",
  },
  {
    id: "KNR/ROAD/2024/0556",
    authority: "KNR Constructions",
    project: "Telangana State Highway SH-1 Widening & Strengthening 85km",
    value: 480,
    deadline: "2025-04-10",
    status: "Open",
    category: "Roads",
    risk: "LOW",
  },
  {
    id: "NCC/METRO/2024/0789",
    authority: "NCC Limited",
    project: "Hyderabad Metro Rail Phase 2 — Underground Section NATM Package",
    value: 1670,
    deadline: "2025-03-01",
    status: "Open",
    category: "Metro",
    risk: "MEDIUM",
  },
  {
    id: "PNC/NH/2024/0223",
    authority: "PNC Infratech",
    project: "NH-30 Raipur-Visakhapatnam Corridor Package 2 — 4-Lane EPC",
    value: 1120,
    deadline: "2025-02-28",
    status: "Open",
    category: "Roads",
    risk: "MEDIUM",
  },
  {
    id: "DBL/EPC/2024/0445",
    authority: "Dilip Buildcon",
    project: "MP State Highway SH-19 BOT Toll Project — 120km",
    value: 890,
    deadline: "2024-12-20",
    status: "Under Review",
    category: "Roads",
    risk: "HIGH",
  },
  {
    id: "GR-INFRA/2024/0667",
    authority: "GR Infraprojects",
    project: "NH-27 Rajasthan Expressway Package 5 — 6-Lane Greenfield",
    value: 2340,
    deadline: "2025-05-15",
    status: "Open",
    category: "Roads",
    risk: "LOW",
  },
  {
    id: "WELSPUN/PIPE/2024/0112",
    authority: "Welspun Enterprises",
    project: "Krishna-Godavari Basin Subsea Pipeline — Kakinada Phase 2",
    value: 1560,
    deadline: "2025-06-01",
    status: "Open",
    category: "Power",
    risk: "MEDIUM",
  },
  {
    id: "MEIL/LIFT/2024/0234",
    authority: "Megha Engineering (MEIL)",
    project: "Kaleshwaram Lift Irrigation Phase 3 — Pump House & Canal Works",
    value: 4800,
    deadline: "2025-01-10",
    status: "Under Review",
    category: "Water",
    risk: "HIGH",
  },
  {
    id: "ITD-CEM/PORT/2024/0345",
    authority: "ITD Cementation",
    project: "JNPA Container Terminal 5 — Quay Wall & Piling Package",
    value: 2100,
    deadline: "2025-04-30",
    status: "Open",
    category: "Ports",
    risk: "LOW",
  },
  {
    id: "SP-PALLONJI/2024/0567",
    authority: "Shapoorji Pallonji",
    project: "Bandra-Worli Sea Link Extension — Versova to Bandra Pkg",
    value: 6800,
    deadline: "2025-02-20",
    status: "Open",
    category: "Roads",
    risk: "MEDIUM",
  },
  {
    id: "GAYATRI/ROAD/2024/0789",
    authority: "Gayatri Projects",
    project: "Visakhapatnam Steel Plant Internal Roads & Drainage Phase 4",
    value: 340,
    deadline: "2025-03-31",
    status: "Cancelled",
    category: "Roads",
    risk: "LOW",
  },
  {
    id: "CPWD/INST/2024/0901",
    authority: "CPWD",
    project: "New Parliament Complex — Electrical & HVAC Commissioning Package",
    value: 290,
    deadline: "2024-10-15",
    status: "Awarded",
    category: "Urban",
    risk: "LOW",
  },
  {
    id: "PWD-MH/NH/2024/0223",
    authority: "PWD Maharashtra",
    project: "Mumbai-Pune Expressway Widening & Shoulder Development",
    value: 1890,
    deadline: "2025-03-20",
    status: "Open",
    category: "Roads",
    risk: "MEDIUM",
  },
  {
    id: "PWD-UP/NH/2024/0445",
    authority: "PWD UP",
    project: "Bundelkhand Expressway Phase 2 Amenity Facilities & ITS",
    value: 680,
    deadline: "2025-04-25",
    status: "Open",
    category: "Roads",
    risk: "LOW",
  },
  {
    id: "SCMC-PUNE/ICT/2024/0112",
    authority: "Smart Cities SPV Pune",
    project: "Integrated Command & Control Centre — ICCC Phase 3 Expansion",
    value: 340,
    deadline: "2025-01-31",
    status: "Under Review",
    category: "Smart City",
    risk: "MEDIUM",
  },
  {
    id: "SCMC-BPL/WATER/2024/0234",
    authority: "Smart Cities SPV Bhopal",
    project: "Smart Water Distribution Network — SCADA & AMR Meters",
    value: 210,
    deadline: "2025-02-14",
    status: "Open",
    category: "Smart City",
    risk: "LOW",
  },
  {
    id: "DMRC/CIVIL/2024/0567",
    authority: "DMRC",
    project: "Delhi Metro Phase 4 — Janakpuri West-RK Ashram Line Pkg 3",
    value: 3200,
    deadline: "2024-12-31",
    status: "Under Review",
    category: "Metro",
    risk: "HIGH",
  },
  {
    id: "MMRC/TBM/2024/0678",
    authority: "MMRC",
    project: "Mumbai Metro Line 3 Extension — Cuffe Parade-Colaba Underground",
    value: 2800,
    deadline: "2025-05-10",
    status: "Open",
    category: "Metro",
    risk: "MEDIUM",
  },
  {
    id: "BMRC/EL/2024/0789",
    authority: "BMRC",
    project: "Namma Metro Phase 2B — Electronic City to Hoskote Elevated",
    value: 1900,
    deadline: "2025-03-15",
    status: "Open",
    category: "Metro",
    risk: "LOW",
  },
  {
    id: "CMRL/CIVIL/2024/0901",
    authority: "CMRL",
    project:
      "Chennai Metro Phase 2 — Poonamallee-Lighthouse Underground Package",
    value: 2600,
    deadline: "2025-04-20",
    status: "Under Review",
    category: "Metro",
    risk: "MEDIUM",
  },
  {
    id: "JNPA/BERTH/2024/0112",
    authority: "JNPA",
    project: "Fourth Container Terminal Expansion — Quay Crane & Reefer Points",
    value: 1450,
    deadline: "2025-02-10",
    status: "Open",
    category: "Ports",
    risk: "LOW",
  },
  {
    id: "AAI/AIRSIDE/2024/0234",
    authority: "AAI",
    project: "CSIA T3 Airside Apron Expansion — 24 Additional Parking Bays",
    value: 960,
    deadline: "2025-01-25",
    status: "Awarded",
    category: "Aviation",
    risk: "LOW",
  },
  {
    id: "SECI/SOLAR/2024/0567",
    authority: "SECI",
    project: "Rajasthan Ultra Mega Solar Park 1500MW — EPC Package A",
    value: 6200,
    deadline: "2025-06-30",
    status: "Open",
    category: "Power",
    risk: "MEDIUM",
  },
  {
    id: "RECL/GRID/2024/0678",
    authority: "RECL",
    project:
      "National Smart Grid Mission — 33/11kV Substation Upgradation 800 Units",
    value: 3800,
    deadline: "2025-03-31",
    status: "Under Review",
    category: "Power",
    risk: "HIGH",
  },
  {
    id: "NPCIL/CIVIL/2024/0901",
    authority: "NPCIL",
    project: "Gorakhpur Nuclear Power Plant GHAVP 1&2 — Reactor Building Civil",
    value: 8900,
    deadline: "2025-07-01",
    status: "Open",
    category: "Power",
    risk: "CRITICAL",
  },
];

const TENDERS: Tender[] = [
  {
    id: "TND-2024-NHA-0891",
    project: "NH-44 Mumbai-Nagpur Expressway Pkg 7",
    ministry: "NHAI/MoRTH",
    estValue: "₹4,230 Cr",
    l1Bid: "₹2,789 Cr",
    fraudRisk: "CRITICAL",
    clausesFlagged: 18,
    status: "Under Review",
    action: "Analyze",
  },
  {
    id: "TND-2024-PWD-0456",
    project: "Delhi-Meerut Regional Rapid Transit Corridor Pkg 3",
    ministry: "Delhi PWD",
    estValue: "₹2,110 Cr",
    l1Bid: "₹1,987 Cr",
    fraudRisk: "HIGH",
    clausesFlagged: 11,
    status: "Evaluation",
    action: "Analyze",
  },
  {
    id: "TND-2024-MMRDA-0234",
    project: "Mumbai Metro Line 7 Extension Elevated Viaduct",
    ministry: "MMRDA",
    estValue: "₹3,450 Cr",
    l1Bid: "₹3,312 Cr",
    fraudRisk: "MEDIUM",
    clausesFlagged: 6,
    status: "Evaluation",
    action: "Analyze",
  },
  {
    id: "TND-2024-MoRTH-0567",
    project: "NH-48 Pune-Bengaluru Six-Lane Highway Pkg 2",
    ministry: "MoRTH",
    estValue: "₹1,890 Cr",
    l1Bid: "₹1,654 Cr",
    fraudRisk: "HIGH",
    clausesFlagged: 14,
    status: "Open",
    action: "Analyze",
  },
  {
    id: "TND-2024-SCM-0123",
    project: "Ahmedabad Smart City Command Center Phase 2",
    ministry: "Smart Cities",
    estValue: "₹560 Cr",
    l1Bid: "₹523 Cr",
    fraudRisk: "LOW",
    clausesFlagged: 3,
    status: "Awarded",
    action: "View",
  },
  {
    id: "TND-2024-WB-PWD-0901",
    project: "Kolkata Second Hooghly Bridge Approach Road",
    ministry: "WB PWD",
    estValue: "₹1,230 Cr",
    l1Bid: "₹890 Cr",
    fraudRisk: "CRITICAL",
    clausesFlagged: 22,
    status: "Red Flag",
    action: "Investigate",
  },
];

const CLAUSE_FLAGS: ClauseFlag[] = [
  {
    risk: "CRITICAL",
    ref: "Clause 14.3",
    description:
      "Contractor bears ALL force majeure costs including natural disasters exceeding 30 days. Unusual risk transfer.",
    recommendation: "Negotiate equitable risk sharing per FIDIC Red Book §19.4",
    type: "risk",
  },
  {
    risk: "HIGH",
    ref: "Clause 7.1",
    description:
      "No price escalation provision for steel and cement beyond 12 months. Market exposure ₹340Cr.",
    recommendation:
      "Insert MOSPI WPI-linked escalation formula with quarterly indexing",
    type: "risk",
  },
  {
    risk: "HIGH",
    ref: "Clause 22.8",
    description:
      "Arbitration jurisdiction limited to Delhi High Court only. Non-standard for highway contracts.",
    recommendation:
      "Expand to ICADR or ICC arbitration with neutral venue provisions",
    type: "obligations",
  },
  {
    risk: "MEDIUM",
    ref: "Clause 31.2",
    description:
      "Defects liability period extends to 7 years. Standard is 5 years.",
    recommendation:
      "Negotiate DLP reduction to 5 years with performance bond extension",
    type: "obligations",
  },
  {
    risk: "MEDIUM",
    ref: "Clause 18.5",
    description:
      "EOT discretion entirely with Engineer-in-Charge. No independent adjudication.",
    recommendation:
      "Add Independent Adjudicator Board per NHAI Model Contract §17",
    type: "hidden",
  },
  {
    risk: "LOW",
    ref: "Clause 9.3",
    description:
      "Mobilization advance limited to 5% against FIDIC standard of 10%.",
    recommendation:
      "Request mobilization advance of 10% secured by bank guarantee",
    type: "hidden",
  },
];

const BOQ_ITEMS: BoqItem[] = [
  {
    item: "Bituminous Concrete",
    estRate: "₹4,200/MT",
    marketRate: "₹3,890/MT",
    variance: "+8.7%",
    positive: true,
    risk: "LOW",
  },
  {
    item: "RCC Grade M-35",
    estRate: "₹6,800/M³",
    marketRate: "₹6,100/M³",
    variance: "+11.5%",
    positive: true,
    risk: "MEDIUM",
  },
  {
    item: "Structural Steel",
    estRate: "₹78,000/MT",
    marketRate: "₹62,000/MT",
    variance: "+25.8%",
    positive: true,
    risk: "HIGH",
  },
  {
    item: "Prestressed Girder",
    estRate: "₹1,24,000/MT",
    marketRate: "₹89,000/MT",
    variance: "+39.3%",
    positive: true,
    risk: "CRITICAL",
  },
  {
    item: "Earth Filling",
    estRate: "₹890/M³",
    marketRate: "₹920/M³",
    variance: "-3.3%",
    positive: false,
    risk: "LOW",
  },
];

const FRAUD_ALERTS: FraudAlert[] = [
  {
    severity: "CRITICAL",
    tenderId: "TND-2024-NHA-0891",
    project: "NH-44 Mumbai-Nagpur Expressway Pkg 7",
    issuer: "NHAI",
    description:
      "L1 bid is 34.1% below engineer's estimate. Statistical analysis indicates this bid is an outlier with 94% probability of strategic low-bidding.",
    anomalyType: "Strategic Low-Bidding / Predatory Pricing",
    partiesInvolved: [
      "Reliance Infracon Pvt Ltd",
      "Star Constructions",
      "Bridge Works India",
    ],
    evidenceItems: [
      "L1 Bid: ₹2,789 Cr vs Engineer Estimate: ₹4,230 Cr (34.1% below)",
      "Historical pattern: same contractor underbid on 3 prior NHAI contracts",
      "BOQ line-item analysis shows 0% mobilization cost provision",
      "Financial capacity assessment: ₹1,800 Cr vs contract value ₹2,789 Cr",
      "Bid submitted 4 minutes before deadline with incomplete BOQ",
    ],
  },
  {
    severity: "HIGH",
    tenderId: "TND-2024-WB-PWD-0901",
    project: "Kolkata Second Hooghly Bridge Approach Road",
    issuer: "WB PWD",
    description:
      "All 4 bidders submitted bids within 2.3% of each other. Pattern consistent with bid-rigging. Recommend Competition Commission review.",
    anomalyType: "Bid Rigging / Cartel Formation",
    partiesInvolved: [
      "HCC Ltd",
      "Afcons Infrastructure",
      "NCC Limited",
      "PNC Infratech",
    ],
    evidenceItems: [
      "4 bids all within ₹28 Cr of each other on a ₹1,230 Cr contract",
      "All 4 companies share same registered address for GST in WB",
      "Common director identified across 2 companies via MCA database",
      "Bid submission timestamps within 12-minute window (same IP range)",
      "Identical sub-contractor list in all 4 bids (same 6 vendors)",
    ],
  },
];

const UPLOAD_STEPS = [
  "Document Upload",
  "AI Clause Extraction",
  "BOQ Analysis",
  "Risk Scoring",
  "Report Generated",
];

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
];

// ── Sub-components ─────────────────────────────────────────────────────────────
function RiskBadge({ risk }: { risk: FraudRisk | string }) {
  const cls: Record<string, string> = {
    CRITICAL: "badge-critical",
    HIGH: "badge-high",
    MEDIUM: "badge-warning",
    LOW: "badge-low",
  };
  return <span className={cls[risk] ?? "badge-low"}>{risk}</span>;
}

function StatusBadge({ status }: { status: TenderStatus | string }) {
  const cls: Record<string, string> = {
    "Under Review": "badge-warning",
    Evaluation: "badge-low",
    Open: "badge-success",
    Awarded: "badge-success",
    "Red Flag": "badge-critical",
    Closed: "badge-low",
    Cancelled: "badge-warning",
  };
  return <span className={cls[status] ?? "badge-low"}>{status}</span>;
}

function ScoreBar({
  score,
  tier,
}: { score: number; tier: "green" | "amber" | "red" }) {
  const colors = { green: "#00E676", amber: "#FFB300", red: "#FF3D00" };
  return (
    <div className="flex items-center gap-2 mt-1">
      <div
        className="flex-1 h-1.5 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: colors[tier] }}
        />
      </div>
      <span
        className="font-mono text-xs font-bold w-10 text-right"
        style={{ color: colors[tier] }}
      >
        {score}/100
      </span>
    </div>
  );
}

function UploadPanel({
  phase,
  step,
  stepProgress,
  onDrop,
  onTrigger,
}: {
  phase: UploadPhase;
  step: number;
  stepProgress: number;
  onDrop: (e: React.DragEvent) => void;
  onTrigger: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  if (phase === "complete") {
    return (
      <div
        className="glass-card p-5 border border-cyan-500/20"
        style={{ background: "rgba(0,212,255,0.04)" }}
        data-ocid="procurement.upload.success_state"
      >
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 size={18} style={{ color: "#00E676" }} />
          <span className="font-semibold text-foreground">
            Analysis Complete — TND-2024-NHA-0891
          </span>
          <span className="badge-success ml-auto">Report Ready</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Risk Score",
              value: "78/100",
              sub: "HIGH RISK",
              color: "#FF6D00",
            },
            {
              label: "Clauses Extracted",
              value: "23",
              sub: "Analyzed",
              color: "#00D4FF",
            },
            {
              label: "Risk Flags",
              value: "7",
              sub: "Flagged",
              color: "#FFB300",
            },
            {
              label: "BOQ Variance",
              value: "₹340 Cr",
              sub: "Over-estimated",
              color: "#FF3D00",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="glass-card p-3 text-center"
              data-ocid={`procurement.analysis.${m.label.toLowerCase().replace(/ /g, "_")}`}
            >
              <div className="text-label mb-1">{m.label}</div>
              <div
                className="font-mono font-bold text-lg"
                style={{ color: m.color }}
              >
                {m.value}
              </div>
              <div className="text-label mt-0.5" style={{ fontSize: "0.6rem" }}>
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (phase === "uploading") {
    return (
      <div
        className="glass-card p-5"
        data-ocid="procurement.upload.loading_state"
      >
        <div className="flex items-center gap-2 mb-4">
          <Loader2
            size={14}
            className="animate-spin"
            style={{ color: "#00D4FF" }}
          />
          <span className="text-sm font-semibold text-foreground">
            AI Processing Tender Document…
          </span>
        </div>
        <div className="space-y-2.5">
          {UPLOAD_STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: done
                      ? "rgba(0,230,118,0.2)"
                      : active
                        ? "rgba(0,212,255,0.15)"
                        : "rgba(255,255,255,0.04)",
                    border: done
                      ? "1px solid rgba(0,230,118,0.5)"
                      : active
                        ? "1px solid rgba(0,212,255,0.5)"
                        : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {done ? (
                    <CheckCircle2 size={11} style={{ color: "#00E676" }} />
                  ) : active ? (
                    <Loader2
                      size={11}
                      className="animate-spin"
                      style={{ color: "#00D4FF" }}
                    />
                  ) : (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: "rgba(255,255,255,0.2)" }}
                    />
                  )}
                </div>
                <span
                  className="text-xs flex-1"
                  style={{
                    color: done
                      ? "#00E676"
                      : active
                        ? "#ffffff"
                        : "rgba(255,255,255,0.35)",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {s}
                </span>
                {active && (
                  <div className="flex-1 max-w-[120px]">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${stepProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {done && (
                  <span
                    className="text-label"
                    style={{ fontSize: "0.6rem", color: "#00E676" }}
                  >
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <label
      htmlFor="tender-upload-input"
      className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-smooth w-full"
      style={{
        borderColor: "rgba(0,212,255,0.25)",
        background: "rgba(0,212,255,0.02)",
      }}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      data-ocid="procurement.upload.dropzone"
    >
      <input
        id="tender-upload-input"
        ref={inputRef}
        type="file"
        className="sr-only"
        accept=".pdf,.docx,.xlsx"
        onChange={onTrigger}
      />
      <Upload size={28} style={{ color: "rgba(0,212,255,0.6)" }} />
      <p className="text-sm text-foreground font-medium">
        Drag & Drop Tender Document or Click to Upload
      </p>
      <p className="text-xs text-muted-foreground">
        Supports AI clause extraction, BOQ analysis, and risk scoring
      </p>
      <div className="flex gap-2 mt-1">
        {["PDF", "DOCX", "XLSX"].map((ext) => (
          <span key={ext} className="badge-low" style={{ fontSize: "0.65rem" }}>
            {ext}
          </span>
        ))}
      </div>
    </label>
  );
}

// ── CVC Referral Modal ─────────────────────────────────────────────────────────
function CVCModal({
  alert,
  onClose,
}: { alert: FraudAlert; onClose: () => void }) {
  const [violationType, setViolationType] = useState("Bid Rigging");
  const [evidenceSummary, setEvidenceSummary] = useState(
    `Anomaly detected in ${alert.tenderId}: ${alert.description}`,
  );
  const [priority, setPriority] = useState("Critical");
  const [selectedEvidence, setSelectedEvidence] = useState<
    Record<number, boolean>
  >(Object.fromEntries(alert.evidenceItems.map((_, i) => [i, true])));
  const [submitted, setSubmitted] = useState(false);
  const caseNumber = `CVC/INF/2024/${Math.floor(80 + Math.random() * 20)
    .toString()
    .padStart(4, "0")}`;

  const toggleEvidence = (i: number) =>
    setSelectedEvidence((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="glass-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl"
        style={{ border: "1px solid rgba(255,61,0,0.3)" }}
        data-ocid="procurement.cvc.dialog"
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
                background: "rgba(255,61,0,0.15)",
                border: "1px solid rgba(255,61,0,0.3)",
              }}
            >
              <Shield size={18} style={{ color: "#FF6B6B" }} />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base">
                CVC Referral — Central Vigilance Commission
              </h2>
              <p className="text-label" style={{ fontSize: "0.6rem" }}>
                GOVERNMENT OF INDIA — ANTI-CORRUPTION WATCHDOG
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-2"
            data-ocid="procurement.cvc.close_button"
          >
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div
            className="p-8 text-center space-y-4"
            data-ocid="procurement.cvc.success_state"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{
                background: "rgba(0,230,118,0.15)",
                border: "2px solid rgba(0,230,118,0.4)",
              }}
            >
              <CheckCircle2 size={28} style={{ color: "#00E676" }} />
            </div>
            <h3 className="font-bold text-xl text-foreground">
              CVC Referral Submitted
            </h3>
            <p className="text-muted-foreground text-sm">
              Your referral has been registered with the Central Vigilance
              Commission
            </p>
            <div
              className="glass-card p-4 mx-auto max-w-xs"
              style={{ border: "1px solid rgba(0,230,118,0.3)" }}
            >
              <div className="text-label mb-1">Case Reference Number</div>
              <div
                className="font-mono font-bold text-lg"
                style={{ color: "#00E676" }}
              >
                {caseNumber}
              </div>
              <div className="text-label mt-1" style={{ fontSize: "0.6rem" }}>
                REGISTERED:{" "}
                {new Date()
                  .toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .toUpperCase()}
              </div>
            </div>
            <div className="glass-card p-4 text-left space-y-2">
              <div className="text-label mb-2">Investigation Timeline</div>
              {[
                { step: "Referral Submitted", status: "done", date: "Today" },
                {
                  step: "Preliminary Examination",
                  status: "active",
                  date: "5-7 working days",
                },
                {
                  step: "Investigation Order",
                  status: "pending",
                  date: "15-30 days",
                },
                {
                  step: "Investigation Report",
                  status: "pending",
                  date: "60-90 days",
                },
                {
                  step: "Action / Closure",
                  status: "pending",
                  date: "90-180 days",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        item.status === "done"
                          ? "rgba(0,230,118,0.2)"
                          : item.status === "active"
                            ? "rgba(0,212,255,0.15)"
                            : "rgba(255,255,255,0.05)",
                      border: `1px solid ${item.status === "done" ? "rgba(0,230,118,0.5)" : item.status === "active" ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {item.status === "done" ? (
                      <CheckCircle2 size={10} style={{ color: "#00E676" }} />
                    ) : (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background:
                            item.status === "active"
                              ? "#00D4FF"
                              : "rgba(255,255,255,0.15)",
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="text-xs flex-1"
                    style={{
                      color:
                        item.status === "done"
                          ? "#00E676"
                          : item.status === "active"
                            ? "#ffffff"
                            : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {item.step}
                  </span>
                  <span className="text-label">{item.date}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-sm py-2 px-6"
              data-ocid="procurement.cvc.close_button"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Tender Summary */}
            <div
              className="glass-card p-4"
              style={{
                background: "rgba(255,61,0,0.04)",
                borderColor: "rgba(255,61,0,0.2)",
              }}
            >
              <div className="text-label mb-2">Tender Being Referred</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Tender ID: </span>
                  <span className="font-mono text-foreground">
                    {alert.tenderId}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Issuing Authority:{" "}
                  </span>
                  <span className="font-semibold text-foreground">
                    {alert.issuer}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Project: </span>
                  <span className="text-foreground">{alert.project}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Anomaly: </span>
                  <span className="font-semibold" style={{ color: "#FF6B6B" }}>
                    {alert.anomalyType}
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="cvc-violation"
                  className="text-label block mb-1.5"
                >
                  Nature of Violation
                </label>
                <select
                  id="cvc-violation"
                  value={violationType}
                  onChange={(e) => setViolationType(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  data-ocid="procurement.cvc.violation_select"
                >
                  {[
                    "Bid Rigging",
                    "Tender Manipulation",
                    "Cartel Formation",
                    "False Documents",
                    "Fraudulent Certification",
                    "Others",
                  ].map((v) => (
                    <option key={v} value={v} style={{ background: "#1a1f2e" }}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="cvc-officer"
                    className="text-label block mb-1.5"
                  >
                    Referring Officer
                  </label>
                  <input
                    id="cvc-officer"
                    type="text"
                    value="Naman Maheshwari"
                    readOnly
                    className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none"
                    style={{
                      background: "rgba(0,212,255,0.06)",
                      border: "1px solid rgba(0,212,255,0.2)",
                    }}
                    data-ocid="procurement.cvc.officer_input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvc-priority"
                    className="text-label block mb-1.5"
                  >
                    Priority Level
                  </label>
                  <select
                    id="cvc-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                    data-ocid="procurement.cvc.priority_select"
                  >
                    {["High", "Critical", "Urgent"].map((p) => (
                      <option
                        key={p}
                        value={p}
                        style={{ background: "#1a1f2e" }}
                      >
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="cvc-evidence"
                  className="text-label block mb-1.5"
                >
                  Evidence Summary
                </label>
                <textarea
                  id="cvc-evidence"
                  value={evidenceSummary}
                  onChange={(e) => setEvidenceSummary(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none resize-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  data-ocid="procurement.cvc.evidence_textarea"
                />
              </div>

              <div>
                <p className="text-label block mb-2">
                  Supporting Documents / Evidence
                </p>
                <div className="space-y-2">
                  {alert.evidenceItems.map((item, i) => (
                    <label
                      key={`evidence-${item.slice(0, 20)}`}
                      className="flex items-start gap-2.5 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEvidence[i] ?? true}
                        onChange={() => toggleEvidence(i)}
                        className="mt-0.5 flex-shrink-0"
                        data-ocid={`procurement.cvc.evidence.${i + 1}`}
                      />
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-label block mb-2">Parties Involved</p>
                <div className="flex flex-wrap gap-2">
                  {alert.partiesInvolved.map((party) => (
                    <span key={party} className="badge-warning text-xs">
                      {party}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex justify-end gap-3 pt-2 border-t"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost text-sm py-2 px-4"
                data-ocid="procurement.cvc.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="btn-primary text-sm py-2 px-5 flex items-center gap-2"
                style={{
                  background: "#FF3D00",
                  boxShadow: "0 0 20px rgba(255,61,0,0.3)",
                }}
                data-ocid="procurement.cvc.submit_button"
              >
                <Shield size={13} />
                Submit CVC Referral
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── CCI Referral Modal ─────────────────────────────────────────────────────────
function CCIModal({
  alert,
  onClose,
}: { alert: FraudAlert; onClose: () => void }) {
  const [practiceType, setPracticeType] = useState("Bid Rigging");
  const [marketAffected, setMarketAffected] = useState(
    "National Highway Construction Market — India",
  );
  const [evidenceDesc, setEvidenceDesc] = useState(
    `Statistical analysis shows anti-competitive behaviour in tender ${alert.tenderId}. ${alert.description}`,
  );
  const [submitted, setSubmitted] = useState(false);
  const caseNumber = `CCI/INF/2024/${Math.floor(20 + Math.random() * 20)
    .toString()
    .padStart(4, "0")}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="glass-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl"
        style={{ border: "1px solid rgba(255,109,0,0.3)" }}
        data-ocid="procurement.cci.dialog"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "rgba(255,109,0,0.2)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255,109,0,0.15)",
                border: "1px solid rgba(255,109,0,0.3)",
              }}
            >
              <Gavel size={18} style={{ color: "#FF8C42" }} />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base">
                CCI Referral — Competition Commission of India
              </h2>
              <p className="text-label" style={{ fontSize: "0.6rem" }}>
                UNDER COMPETITION ACT 2002 — ANTI-COMPETITIVE PRACTICES
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-2"
            data-ocid="procurement.cci.close_button"
          >
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div
            className="p-8 text-center space-y-4"
            data-ocid="procurement.cci.success_state"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{
                background: "rgba(255,109,0,0.15)",
                border: "2px solid rgba(255,109,0,0.4)",
              }}
            >
              <CheckCircle2 size={28} style={{ color: "#FF8C42" }} />
            </div>
            <h3 className="font-bold text-xl text-foreground">
              CCI Referral Filed
            </h3>
            <p className="text-muted-foreground text-sm">
              Filed under Section 43A of Competition Act, 2002
            </p>
            <div
              className="glass-card p-4 mx-auto max-w-xs"
              style={{ border: "1px solid rgba(255,109,0,0.3)" }}
            >
              <div className="text-label mb-1">CCI Case Number</div>
              <div
                className="font-mono font-bold text-lg"
                style={{ color: "#FF8C42" }}
              >
                {caseNumber}
              </div>
              <div className="text-label mt-1" style={{ fontSize: "0.6rem" }}>
                FILED:{" "}
                {new Date()
                  .toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .toUpperCase()}
              </div>
            </div>
            <div className="glass-card p-4 text-left space-y-2">
              <div className="text-label mb-2">CCI Investigation Process</div>
              {[
                {
                  step: "Complaint / Referral Filed",
                  status: "done",
                  date: "Today",
                },
                {
                  step: "Prima Facie Review by CCI",
                  status: "active",
                  date: "30 days",
                },
                {
                  step: "Director General Investigation",
                  status: "pending",
                  date: "60-120 days",
                },
                {
                  step: "Hearing & Submissions",
                  status: "pending",
                  date: "3-6 months",
                },
                {
                  step: "Order / Penalty",
                  status: "pending",
                  date: "6-12 months",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        item.status === "done"
                          ? "rgba(255,109,0,0.2)"
                          : item.status === "active"
                            ? "rgba(0,212,255,0.15)"
                            : "rgba(255,255,255,0.05)",
                      border: `1px solid ${item.status === "done" ? "rgba(255,109,0,0.5)" : item.status === "active" ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {item.status === "done" ? (
                      <CheckCircle2 size={10} style={{ color: "#FF8C42" }} />
                    ) : (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background:
                            item.status === "active"
                              ? "#00D4FF"
                              : "rgba(255,255,255,0.15)",
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="text-xs flex-1"
                    style={{
                      color:
                        item.status === "done"
                          ? "#FF8C42"
                          : item.status === "active"
                            ? "#ffffff"
                            : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {item.step}
                  </span>
                  <span className="text-label">{item.date}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-sm py-2 px-6"
              data-ocid="procurement.cci.close_button"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Legal Angle */}
            <div
              className="glass-card p-4"
              style={{
                background: "rgba(255,109,0,0.04)",
                borderColor: "rgba(255,109,0,0.2)",
              }}
            >
              <div className="text-label mb-2">Competition Law Angle</div>
              <p className="text-xs text-muted-foreground mb-2">
                The Competition Act 2002 prohibits agreements (Section 3) that
                cause/likely cause appreciation, prevention or restriction of
                competition in India. Bid rigging is per se void under Section
                3(3)(d).
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Tender: </span>
                  <span className="font-mono" style={{ color: "#00D4FF" }}>
                    {alert.tenderId}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Anomaly: </span>
                  <span className="font-semibold" style={{ color: "#FF8C42" }}>
                    {alert.anomalyType}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="cci-practice"
                  className="text-label block mb-1.5"
                >
                  Anti-Competitive Practice Type
                </label>
                <select
                  id="cci-practice"
                  value={practiceType}
                  onChange={(e) => setPracticeType(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  data-ocid="procurement.cci.practice_select"
                >
                  {[
                    "Bid Rigging",
                    "Market Division",
                    "Abuse of Dominance",
                    "Cartel Behavior",
                    "Predatory Pricing",
                    "Exclusive Supply Agreement",
                  ].map((v) => (
                    <option key={v} value={v} style={{ background: "#1a1f2e" }}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="cci-market" className="text-label block mb-1.5">
                  Relevant Market / Market Affected
                </label>
                <input
                  id="cci-market"
                  type="text"
                  value={marketAffected}
                  onChange={(e) => setMarketAffected(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  data-ocid="procurement.cci.market_input"
                />
              </div>

              <div>
                <p className="text-label block mb-2">
                  Parties Involved / Enterprises
                </p>
                <div className="space-y-2 glass-card p-3">
                  {alert.partiesInvolved.map((party) => (
                    <div
                      key={party}
                      className="flex items-center gap-3 p-2 rounded"
                      style={{ background: "rgba(255,109,0,0.06)" }}
                    >
                      <Building2 size={13} style={{ color: "#FF8C42" }} />
                      <span className="text-xs text-foreground font-medium">
                        {party}
                      </span>
                      <span
                        className="badge-warning ml-auto text-xs"
                        style={{ fontSize: "0.6rem" }}
                      >
                        Respondent
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="cci-evidence"
                  className="text-label block mb-1.5"
                >
                  Evidence Description
                </label>
                <textarea
                  id="cci-evidence"
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none resize-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  data-ocid="procurement.cci.evidence_textarea"
                />
              </div>

              <div
                className="glass-card p-3"
                style={{ background: "rgba(0,212,255,0.04)" }}
              >
                <div className="text-label mb-1">Key Evidence Points</div>
                {alert.evidenceItems.slice(0, 4).map((item) => (
                  <div
                    key={`evpt-${item.slice(0, 20)}`}
                    className="flex items-start gap-2 mt-1.5"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: "#00D4FF" }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="flex justify-end gap-3 pt-2 border-t"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost text-sm py-2 px-4"
                data-ocid="procurement.cci.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="btn-primary text-sm py-2 px-5 flex items-center gap-2"
                style={{
                  background: "#FF6D00",
                  boxShadow: "0 0 20px rgba(255,109,0,0.3)",
                }}
                data-ocid="procurement.cci.submit_button"
              >
                <Gavel size={13} />
                Submit CCI Referral
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── AI Vendor Scoring Modal ────────────────────────────────────────────────────
function VendorScoringModal({ onClose }: { onClose: () => void }) {
  const [vendorName, setVendorName] = useState("");
  const [regNum, setRegNum] = useState("");
  const [turnover, setTurnover] = useState("");
  const [activeProjects, setActiveProjects] = useState("");
  const [litigation, setLitigation] = useState("");
  const [blacklist, setBlacklist] = useState<"No" | "Yes">("No");
  const [techScore, setTechScore] = useState(7);
  const [completionRate, setCompletionRate] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<{
    financial: number;
    technical: number;
    compliance: number;
    execution: number;
    overall: number;
  } | null>(null);
  const [addedToDb, setAddedToDb] = useState(false);

  const toggleState = (s: string) =>
    setSelectedStates((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const handleCalculate = () => {
    if (!vendorName || !turnover) {
      toast.error("Please fill in at least Vendor Name and Annual Turnover");
      return;
    }
    setCalculating(true);
    setTimeout(() => {
      const litNum = Number.parseInt(litigation || "0");
      const crateNum = Number.parseFloat(completionRate || "85");
      const turnoverNum = Number.parseFloat(turnover || "1000");
      const projectsNum = Number.parseInt(activeProjects || "3");

      const financial = Math.min(
        25,
        Math.max(
          5,
          blacklist === "Yes"
            ? 5
            : Math.round(25 - litNum * 2 - (turnoverNum < 500 ? 5 : 0)),
        ),
      );
      const technical = Math.min(
        25,
        Math.max(
          5,
          Math.round((techScore / 10) * 25 - (projectsNum > 10 ? 5 : 0)),
        ),
      );
      const compliance = Math.min(
        25,
        Math.max(
          5,
          blacklist === "Yes"
            ? 2
            : Math.round(25 - litNum * 3 - (litNum > 5 ? 5 : 0)),
        ),
      );
      const execution = Math.min(
        25,
        Math.max(5, Math.round((crateNum / 100) * 25)),
      );
      const overall = financial + technical + compliance + execution;
      setResult({ financial, technical, compliance, execution, overall });
      setCalculating(false);
    }, 2200);
  };

  const riskClass =
    result === null
      ? null
      : result.overall >= 75
        ? "green"
        : result.overall >= 50
          ? "amber"
          : "red";
  const riskLabel =
    result === null
      ? null
      : result.overall >= 75
        ? "Low Risk — Approved"
        : result.overall >= 50
          ? "Medium Risk — Conditional"
          : "High Risk — Disqualify";
  const riskColor =
    result === null
      ? "#00D4FF"
      : result.overall >= 75
        ? "#00E676"
        : result.overall >= 50
          ? "#FFB300"
          : "#FF3D00";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="glass-elevated w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl"
        style={{ border: "1px solid rgba(0,212,255,0.25)" }}
        data-ocid="procurement.vendor_scoring.dialog"
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "rgba(0,212,255,0.15)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(0,212,255,0.12)",
                border: "1px solid rgba(0,212,255,0.3)",
              }}
            >
              <Award size={18} style={{ color: "#00D4FF" }} />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base">
                AI Vendor Scoring Engine
              </h2>
              <p className="text-label" style={{ fontSize: "0.6rem" }}>
                NHAI-COMPLIANT MULTI-CRITERIA EVALUATION SYSTEM
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-2"
            data-ocid="procurement.vendor_scoring.close_button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="vs-name" className="text-label block mb-1.5">
                  Vendor / Company Name
                </label>
                <input
                  id="vs-name"
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. L&T Construction Ltd"
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  data-ocid="procurement.vendor_scoring.name_input"
                />
              </div>
              <div>
                <label htmlFor="vs-reg" className="text-label block mb-1.5">
                  Registration Number
                </label>
                <input
                  id="vs-reg"
                  type="text"
                  value={regNum}
                  onChange={(e) => setRegNum(e.target.value)}
                  placeholder="CIN / DIPP No."
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  data-ocid="procurement.vendor_scoring.reg_input"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="vs-turnover"
                  className="text-label block mb-1.5"
                >
                  Annual Turnover (₹ Cr)
                </label>
                <input
                  id="vs-turnover"
                  type="number"
                  value={turnover}
                  onChange={(e) => setTurnover(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  data-ocid="procurement.vendor_scoring.turnover_input"
                />
              </div>
              <div>
                <label
                  htmlFor="vs-projects"
                  className="text-label block mb-1.5"
                >
                  Active Projects Count
                </label>
                <input
                  id="vs-projects"
                  type="number"
                  value={activeProjects}
                  onChange={(e) => setActiveProjects(e.target.value)}
                  placeholder="e.g. 8"
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  data-ocid="procurement.vendor_scoring.projects_input"
                />
              </div>
              <div>
                <label
                  htmlFor="vs-litigation"
                  className="text-label block mb-1.5"
                >
                  Litigation Cases
                </label>
                <input
                  id="vs-litigation"
                  type="number"
                  value={litigation}
                  onChange={(e) => setLitigation(e.target.value)}
                  placeholder="e.g. 2"
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  data-ocid="procurement.vendor_scoring.litigation_input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-label block mb-1.5">Blacklist History</p>
                <div className="flex gap-2">
                  {(["No", "Yes"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setBlacklist(v)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-smooth"
                      style={{
                        background:
                          blacklist === v
                            ? v === "No"
                              ? "rgba(0,230,118,0.15)"
                              : "rgba(255,61,0,0.15)"
                            : "rgba(255,255,255,0.04)",
                        color:
                          blacklist === v
                            ? v === "No"
                              ? "#00E676"
                              : "#FF6B6B"
                            : "rgba(255,255,255,0.5)",
                        border: `1px solid ${blacklist === v ? (v === "No" ? "rgba(0,230,118,0.35)" : "rgba(255,61,0,0.35)") : "rgba(255,255,255,0.1)"}`,
                      }}
                      data-ocid={`procurement.vendor_scoring.blacklist_${v.toLowerCase()}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="vs-completion"
                  className="text-label block mb-1.5"
                >
                  Project Completion Rate (%)
                </label>
                <input
                  id="vs-completion"
                  type="number"
                  min={0}
                  max={100}
                  value={completionRate}
                  onChange={(e) => setCompletionRate(e.target.value)}
                  placeholder="e.g. 92"
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  data-ocid="procurement.vendor_scoring.completion_input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="vs-tech" className="text-label block mb-1.5">
                Technical Capacity Score:{" "}
                <span style={{ color: "#00D4FF" }}>{techScore}/10</span>
              </label>
              <input
                id="vs-tech"
                type="range"
                min={1}
                max={10}
                value={techScore}
                onChange={(e) => setTechScore(Number(e.target.value))}
                className="w-full accent-cyan-400"
                data-ocid="procurement.vendor_scoring.tech_slider"
              />
              <div className="flex justify-between text-label mt-0.5">
                <span>1 — Minimal</span>
                <span>5 — Average</span>
                <span>10 — Expert</span>
              </div>
            </div>

            <div>
              <p className="text-label block mb-2">
                Geographic Coverage (select states)
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {STATES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleState(s)}
                    className="text-xs px-2 py-1 rounded transition-smooth"
                    style={{
                      background: selectedStates.includes(s)
                        ? "rgba(0,212,255,0.15)"
                        : "rgba(255,255,255,0.04)",
                      color: selectedStates.includes(s)
                        ? "#00D4FF"
                        : "rgba(255,255,255,0.5)",
                      border: `1px solid ${selectedStates.includes(s) ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                    }}
                    data-ocid={`procurement.vendor_scoring.state_${s.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {selectedStates.length > 0 && (
                <p className="text-label mt-1">
                  {selectedStates.length} states selected
                </p>
              )}
            </div>
          </div>

          {/* Calculate Button */}
          {!result && (
            <button
              type="button"
              onClick={handleCalculate}
              disabled={calculating}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
              data-ocid="procurement.vendor_scoring.calculate_button"
            >
              {calculating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Calculating Score…
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Calculate Vendor Score
                </>
              )}
            </button>
          )}

          {/* Calculating Animation */}
          {calculating && (
            <div
              className="glass-card p-5 space-y-3"
              data-ocid="procurement.vendor_scoring.loading_state"
            >
              {[
                "Analysing Financial Capacity…",
                "Scoring Technical Capability…",
                "Checking Compliance Record…",
                "Evaluating Execution History…",
              ].map((step) => (
                <div key={step} className="flex items-center gap-3">
                  <Loader2
                    size={12}
                    className="animate-spin flex-shrink-0"
                    style={{ color: "#00D4FF" }}
                  />
                  <span className="text-xs text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          )}

          {/* Score Result */}
          {result && !calculating && (
            <div
              className="space-y-4"
              data-ocid="procurement.vendor_scoring.result"
            >
              <div
                className="glass-card p-5 text-center"
                style={{ border: `1px solid ${riskColor}33` }}
              >
                <div className="text-label mb-2">Overall Vendor Score</div>
                <div
                  className="font-mono font-bold text-5xl mb-2"
                  style={{ color: riskColor }}
                >
                  {result.overall}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <span
                  className="text-sm font-bold px-4 py-1.5 rounded-full"
                  style={{
                    background: `${riskColor}20`,
                    color: riskColor,
                    border: `1px solid ${riskColor}40`,
                  }}
                >
                  {riskLabel}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    label: "Financial Health",
                    value: result.financial,
                    max: 25,
                    color: "#00D4FF",
                  },
                  {
                    label: "Technical Capability",
                    value: result.technical,
                    max: 25,
                    color: "#00E676",
                  },
                  {
                    label: "Compliance Record",
                    value: result.compliance,
                    max: 25,
                    color: "#FFB300",
                  },
                  {
                    label: "Execution History",
                    value: result.execution,
                    max: 25,
                    color: "#FF8C42",
                  },
                ].map((sub) => (
                  <div
                    key={sub.label}
                    className="glass-card p-3 text-center"
                    data-ocid={`procurement.vendor_scoring.subscore_${sub.label.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    <div
                      className="text-label mb-1"
                      style={{ fontSize: "0.6rem" }}
                    >
                      {sub.label}
                    </div>
                    <div
                      className="font-mono font-bold text-xl"
                      style={{ color: sub.color }}
                    >
                      {sub.value}
                      <span className="text-xs text-muted-foreground">
                        /{sub.max}
                      </span>
                    </div>
                    <div
                      className="h-1 rounded-full mt-2"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(sub.value / sub.max) * 100}%`,
                          background: sub.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="glass-card p-4"
                style={{
                  background: `${riskColor}08`,
                  border: `1px solid ${riskColor}25`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: riskColor }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: riskColor }}
                  >
                    Risk Classification:{" "}
                    {riskClass === "green"
                      ? "GREEN ZONE (75-100)"
                      : riskClass === "amber"
                        ? "YELLOW ZONE (50-74)"
                        : "RED ZONE (0-49)"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {riskClass === "green"
                    ? "This vendor meets all NHAI qualification criteria. Eligible for contract award consideration."
                    : riskClass === "amber"
                      ? "Conditional approval recommended. Additional performance bank guarantee of 15% required. Senior review mandatory."
                      : "Vendor does not meet minimum qualification standards. Disqualification from tender recommended. Escalate to Procurement Committee."}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setVendorName("");
                    setRegNum("");
                    setTurnover("");
                    setActiveProjects("");
                    setLitigation("");
                    setBlacklist("No");
                    setTechScore(7);
                    setCompletionRate("");
                    setSelectedStates([]);
                  }}
                  className="flex-1 btn-ghost text-sm border"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  data-ocid="procurement.vendor_scoring.reset_button"
                >
                  Score Another Vendor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddedToDb(true);
                    toast.success(
                      `${vendorName} added to Vendor Intelligence Database`,
                      { duration: 4000 },
                    );
                  }}
                  disabled={addedToDb}
                  className="flex-1 btn-primary text-sm flex items-center justify-center gap-2 py-2.5"
                  style={
                    addedToDb
                      ? {
                          background: "rgba(0,230,118,0.2)",
                          color: "#00E676",
                          boxShadow: "none",
                        }
                      : {}
                  }
                  data-ocid="procurement.vendor_scoring.add_to_db_button"
                >
                  {addedToDb ? (
                    <>
                      <CheckCircle2 size={14} />
                      Added to Database
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      Add to Vendor Database
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function ProcurementPage() {
  const navigate = useNavigate();
  const { selectedOrg } = useOrg();
  const orgData = getOrgData(selectedOrg.key);
  const orgVendors = orgData.vendors;

  // Upload state
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("idle");
  const [uploadStep, setUploadStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clause state
  const [clauseTab, setClauseTab] = useState<ClauseTab>("all");

  // Active tenders state
  const [search, setSearch] = useState("");
  const [sortRisk, setSortRisk] = useState(false);

  // Full tender database state
  const [dbSearch, setDbSearch] = useState("");
  const [filterOrg, setFilterOrg] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRisk, setFilterRisk] = useState("All");
  const [sortField, setSortField] = useState<keyof FullTender>("id");
  const [sortAsc, setSortAsc] = useState(true);
  const [dbExpanded, setDbExpanded] = useState(true);

  // Modal state
  const [cvcAlert, setCvcAlert] = useState<FraudAlert | null>(null);
  const [cciAlert, setCciAlert] = useState<FraudAlert | null>(null);
  const [showVendorScoring, setShowVendorScoring] = useState(false);

  function downloadTenderDatabase() {
    const now = new Date().toISOString().split("T")[0];
    const headers = [
      "Tender ID",
      "Authority",
      "Project Description",
      "Value (₹ Cr)",
      "Deadline",
      "Category",
      "Status",
      "Risk Level",
    ];
    const rows = filteredDb.map((t) =>
      [
        `"${t.id}"`,
        `"${t.authority}"`,
        `"${t.project}"`,
        t.value.toString(),
        `"${t.deadline}"`,
        `"${t.category}"`,
        `"${t.status}"`,
        `"${t.risk}"`,
      ].join(","),
    );
    const totalValue = filteredDb.reduce((s, t) => s + t.value, 0);
    const content = [
      "INFRAOS NATIONAL TENDER INTELLIGENCE DATABASE",
      `Generated: ${now}`,
      "User: Naman Maheshwari",
      `Total Tenders Exported: ${filteredDb.length}`,
      `Total Pipeline Value: ₹${totalValue.toLocaleString()} Cr`,
      `Filters Applied: Org=${filterOrg}, Category=${filterCategory}, Status=${filterStatus}, Risk=${filterRisk}`,
      "",
      headers.join(","),
      ...rows,
      "",
      "=== SUMMARY ===",
      `Open Tenders,${filteredDb.filter((t) => t.status === "Open").length}`,
      `Under Review,${filteredDb.filter((t) => t.status === "Under Review").length}`,
      `Awarded,${filteredDb.filter((t) => t.status === "Awarded").length}`,
      `Critical Risk,${filteredDb.filter((t) => t.risk === "CRITICAL").length}`,
      `High Risk,${filteredDb.filter((t) => t.risk === "HIGH").length}`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `InfraOS-Tender-Database-${now}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const simulateUpload = useCallback(() => {
    setUploadPhase("uploading");
    setUploadStep(0);
    setStepProgress(0);
    let currentStep = 0;
    let progress = 0;
    const tick = () => {
      progress += 18;
      if (progress >= 100) {
        progress = 0;
        currentStep += 1;
        if (currentStep >= UPLOAD_STEPS.length) {
          setUploadPhase("complete");
          return;
        }
        setUploadStep(currentStep);
      }
      setStepProgress(Math.min(progress, 100));
      timerRef.current = setTimeout(tick, 220);
    };
    timerRef.current = setTimeout(tick, 220);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      simulateUpload();
    },
    [simulateUpload],
  );

  // Filtered active tenders
  const filtered = TENDERS.filter(
    (t) =>
      t.project.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.ministry.toLowerCase().includes(search.toLowerCase()),
  );
  const sorted = sortRisk
    ? [...filtered].sort((a, b) => {
        const order: Record<FraudRisk, number> = {
          CRITICAL: 0,
          HIGH: 1,
          MEDIUM: 2,
          LOW: 3,
        };
        return order[a.fraudRisk] - order[b.fraudRisk];
      })
    : filtered;

  const filteredClauses =
    clauseTab === "all"
      ? CLAUSE_FLAGS
      : CLAUSE_FLAGS.filter((c) => c.type === clauseTab);

  // Full tender database filters
  const orgs = [
    "All",
    ...Array.from(new Set(FULL_TENDERS.map((t) => t.authority))).sort(),
  ];
  const categories = [
    "All",
    "Roads",
    "Railways",
    "Urban",
    "Power",
    "Ports",
    "Aviation",
    "Metro",
    "Water",
    "Smart City",
  ];
  const statuses = [
    "All",
    "Open",
    "Under Review",
    "Awarded",
    "Closed",
    "Cancelled",
  ];
  const risks = ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

  const filteredDb = FULL_TENDERS.filter((t) => {
    const matchesSearch =
      dbSearch === "" ||
      t.id.toLowerCase().includes(dbSearch.toLowerCase()) ||
      t.project.toLowerCase().includes(dbSearch.toLowerCase()) ||
      t.authority.toLowerCase().includes(dbSearch.toLowerCase());
    const matchesOrg = filterOrg === "All" || t.authority === filterOrg;
    const matchesCat =
      filterCategory === "All" || t.category === filterCategory;
    const matchesStatus = filterStatus === "All" || t.status === filterStatus;
    const matchesRisk = filterRisk === "All" || t.risk === filterRisk;
    return (
      matchesSearch && matchesOrg && matchesCat && matchesStatus && matchesRisk
    );
  }).sort((a, b) => {
    const av = a[sortField];
    const bv = b[sortField];
    if (typeof av === "number" && typeof bv === "number")
      return sortAsc ? av - bv : bv - av;
    return sortAsc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const handleSort = (field: keyof FullTender) => {
    if (sortField === field) setSortAsc((v) => !v);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="p-6 space-y-6" data-ocid="procurement.page">
      {/* Modals */}
      {cvcAlert && (
        <CVCModal alert={cvcAlert} onClose={() => setCvcAlert(null)} />
      )}
      {cciAlert && (
        <CCIModal alert={cciAlert} onClose={() => setCciAlert(null)} />
      )}
      {showVendorScoring && (
        <VendorScoringModal onClose={() => setShowVendorScoring(false)} />
      )}

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
            <span>Home</span>
            <ChevronRight size={10} />
            <span>Intelligence Modules</span>
            <ChevronRight size={10} />
            <span className="text-primary">Procurement Intelligence</span>
          </nav>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-label font-bold tracking-widest"
              style={{ color: "#00D4FF", fontSize: "0.65rem" }}
            >
              PRE-AWARD RISK ENGINE
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Procurement Intelligence
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Search size={13} className="text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tenders…"
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-40"
              data-ocid="procurement.search_input"
            />
          </div>
          <button
            type="button"
            className="btn-ghost text-sm flex items-center gap-1.5 py-2 px-3"
            onClick={() => setSortRisk((v) => !v)}
            data-ocid="procurement.filter.toggle"
          >
            <Filter size={13} />
            {sortRisk ? "Clear Sort" : "Sort by Risk"}
          </button>
          <button
            type="button"
            className="btn-ghost text-sm flex items-center gap-2 py-2 px-3"
            style={{
              color: "#00D4FF",
              border: "1px solid rgba(0,212,255,0.25)",
            }}
            onClick={() => setShowVendorScoring(true)}
            data-ocid="procurement.score_vector_button"
          >
            <Award size={13} /> Score New Vector
          </button>
          <button
            type="button"
            className="btn-secondary text-sm flex items-center gap-2 py-2 px-4"
            data-ocid="procurement.report_button"
            onClick={() => navigate({ to: "/app/reports" })}
          >
            <FileText size={13} /> Generate Report
          </button>
          <button
            type="button"
            className="btn-secondary text-sm flex items-center gap-2 py-2 px-3"
            onClick={downloadTenderDatabase}
            data-ocid="procurement.export_tenders_button"
          >
            <Download size={13} /> Export Tenders CSV
          </button>
          <button
            type="button"
            className="btn-primary text-sm flex items-center gap-2 py-2 px-4"
            onClick={simulateUpload}
            data-ocid="procurement.upload_button"
          >
            <Upload size={13} /> Upload Tender
          </button>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Active Tenders",
            value: FULL_TENDERS.filter(
              (t) => t.status === "Open" || t.status === "Under Review",
            ).length.toString(),
            icon: FileText,
            color: "#00D4FF",
          },
          {
            label: "Pipeline Value",
            value: `₹${(FULL_TENDERS.reduce((sum, t) => sum + t.value, 0) / 100).toFixed(0)}K Cr`,
            icon: TrendingUp,
            color: "#00D4FF",
          },
          {
            label: "High-Risk Flags",
            value: FULL_TENDERS.filter(
              (t) => t.risk === "HIGH" || t.risk === "CRITICAL",
            ).length.toString(),
            icon: AlertTriangle,
            color: "#FFB300",
          },
          {
            label: "Fraud Alerts",
            value: FULL_TENDERS.filter(
              (t) => t.risk === "CRITICAL",
            ).length.toString(),
            icon: ShieldAlert,
            color: "#FF3D00",
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className="glass-card kpi-glow p-4 flex items-center gap-3"
            data-ocid={`procurement.stat.${i + 1}`}
          >
            <s.icon size={18} style={{ color: s.color, flexShrink: 0 }} />
            <div>
              <div className="text-label mb-0.5">{s.label}</div>
              <div
                className="font-mono font-bold text-xl"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TENDER COMMAND DASHBOARD ── */}
      <div
        className="glass-card p-5 space-y-4"
        data-ocid="procurement.command_dashboard"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck size={16} style={{ color: "#00D4FF" }} />
            Tender Command Dashboard
          </h2>
          <span className="text-label">AI-Powered Pre-Award Intelligence</span>
        </div>
        <UploadPanel
          phase={uploadPhase}
          step={uploadStep}
          stepProgress={stepProgress}
          onDrop={handleDrop}
          onTrigger={simulateUpload}
        />
      </div>

      {/* ── FULL TENDER DATABASE ── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="procurement.tender_database"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/30">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Zap size={14} style={{ color: "#00D4FF" }} />
              National Tender Intelligence Database
            </h2>
            <span className="badge-low" style={{ fontSize: "0.6rem" }}>
              {filteredDb.length} / {FULL_TENDERS.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-label hidden md:block">
              NHAI · NHIDCL · NPCIL · RVNL · NTPC · AAI + 30 more
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={downloadTenderDatabase}
                className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
                data-ocid="procurement.tender_database.export_button"
              >
                <ChevronDown size={12} /> Export CSV
              </button>
              <button
                type="button"
                onClick={() => setDbExpanded((v) => !v)}
                className="btn-ghost p-1.5"
                data-ocid="procurement.tender_database.toggle"
              >
                {dbExpanded ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            </div>
          </div>
        </div>

        {dbExpanded && (
          <>
            {/* Filters */}
            <div
              className="px-5 py-3 border-b border-border/20 flex flex-wrap gap-3 items-center"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                <Search
                  size={12}
                  className="text-muted-foreground flex-shrink-0"
                />
                <input
                  type="text"
                  value={dbSearch}
                  onChange={(e) => setDbSearch(e.target.value)}
                  placeholder="Search tender ID or project…"
                  className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full"
                  data-ocid="procurement.tender_database.search_input"
                />
              </div>
              {[
                {
                  label: "Organization",
                  value: filterOrg,
                  set: setFilterOrg,
                  options: orgs,
                  ocid: "procurement.tender_database.filter_org",
                },
                {
                  label: "Category",
                  value: filterCategory,
                  set: setFilterCategory,
                  options: categories,
                  ocid: "procurement.tender_database.filter_category",
                },
                {
                  label: "Status",
                  value: filterStatus,
                  set: setFilterStatus,
                  options: statuses,
                  ocid: "procurement.tender_database.filter_status",
                },
                {
                  label: "Risk",
                  value: filterRisk,
                  set: setFilterRisk,
                  options: risks,
                  ocid: "procurement.tender_database.filter_risk",
                },
              ].map((f) => (
                <select
                  key={f.label}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-md outline-none text-foreground"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  data-ocid={f.ocid}
                >
                  <option value="All" style={{ background: "#1a1f2e" }}>
                    {f.label}: All
                  </option>
                  {f.options
                    .filter((o) => o !== "All")
                    .map((o) => (
                      <option
                        key={o}
                        value={o}
                        style={{ background: "#1a1f2e" }}
                      >
                        {o}
                      </option>
                    ))}
                </select>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {[
                      { key: "id" as keyof FullTender, label: "Tender ID" },
                      {
                        key: "authority" as keyof FullTender,
                        label: "Authority",
                      },
                      {
                        key: "project" as keyof FullTender,
                        label: "Project Description",
                      },
                      {
                        key: "value" as keyof FullTender,
                        label: "Value (₹ Cr)",
                      },
                      {
                        key: "deadline" as keyof FullTender,
                        label: "Deadline",
                      },
                      {
                        key: "category" as keyof FullTender,
                        label: "Category",
                      },
                      { key: "status" as keyof FullTender, label: "Status" },
                      { key: "risk" as keyof FullTender, label: "Risk" },
                    ].map((h) => (
                      <th
                        key={h.key}
                        className="text-left px-4 py-3 text-label font-medium whitespace-nowrap cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => handleSort(h.key)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSort(h.key)
                        }
                        data-ocid={`procurement.tender_database.sort_${h.key}`}
                      >
                        <span className="flex items-center gap-1">
                          {h.label}
                          {sortField === h.key &&
                            (sortAsc ? (
                              <ChevronUp size={10} />
                            ) : (
                              <ChevronDown size={10} />
                            ))}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDb.map((t, i) => (
                    <tr
                      key={t.id}
                      className="transition-smooth hover:bg-white/2"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                      data-ocid={`procurement.tender_database.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <span
                          className="font-mono text-xs"
                          style={{ color: "#00D4FF" }}
                        >
                          {t.id}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-muted-foreground font-medium text-xs">
                          {t.authority}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ maxWidth: 280 }}>
                        <span className="text-foreground text-xs leading-tight line-clamp-2">
                          {t.project}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="font-mono font-bold text-xs"
                          style={{ color: "#00D4FF" }}
                        >
                          ₹{t.value.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {t.deadline}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="badge-low"
                          style={{ fontSize: "0.6rem" }}
                        >
                          {t.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-4 py-3">
                        <RiskBadge risk={t.risk} />
                      </td>
                    </tr>
                  ))}
                  {filteredDb.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-10 text-center"
                        data-ocid="procurement.tender_database.empty_state"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search
                            size={24}
                            className="text-muted-foreground opacity-40"
                          />
                          <span className="text-muted-foreground text-sm">
                            No tenders match your filters
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setDbSearch("");
                              setFilterOrg("All");
                              setFilterCategory("All");
                              setFilterStatus("All");
                              setFilterRisk("All");
                            }}
                            className="btn-secondary text-xs py-1.5 px-3 mt-1"
                          >
                            Clear Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── ACTIVE TENDERS TABLE ── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="procurement.tenders_table"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/30">
          <h2 className="font-semibold text-foreground">
            Active Tenders — Risk Analysis
          </h2>
          <span className="text-label">{sorted.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  "Tender ID",
                  "Project Name",
                  "Ministry",
                  "Est. Value",
                  "L1 Bid",
                  "Fraud Risk",
                  "Clauses Flagged",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-label font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((t, i) => (
                <tr
                  key={t.id}
                  className="transition-smooth hover:bg-white/2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  data-ocid={`procurement.tenders.item.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <span
                      className="font-mono text-xs"
                      style={{ color: "#00D4FF" }}
                    >
                      {t.id}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <span className="text-foreground text-xs leading-tight line-clamp-2">
                      {t.project}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-muted-foreground text-xs">
                      {t.ministry}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-xs text-foreground">
                      {t.estValue}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-xs text-muted-foreground">
                      {t.l1Bid}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge risk={t.fraudRisk} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="font-mono font-bold text-sm"
                      style={{
                        color:
                          t.clausesFlagged >= 15
                            ? "#FF3D00"
                            : t.clausesFlagged >= 8
                              ? "#FF6D00"
                              : "#FFB300",
                      }}
                    >
                      {t.clausesFlagged}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="btn-ghost text-xs py-1 px-3 rounded"
                      style={{
                        color:
                          t.action === "Investigate" ? "#FF3D00" : "#00D4FF",
                        border: `1px solid ${t.action === "Investigate" ? "rgba(255,61,0,0.3)" : "rgba(0,212,255,0.25)"}`,
                      }}
                      data-ocid={`procurement.tenders.action.${i + 1}`}
                      onClick={() =>
                        toast.info(`Opening ${t.action} panel for ${t.id}`)
                      }
                    >
                      {t.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MATERIAL COST INTELLIGENCE ── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="procurement.material_costs_panel"
      >
        <div className="px-5 py-3 border-b border-border/30">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <ChevronDown size={14} style={{ color: "#00D4FF" }} />
            Material Cost Intelligence
          </h2>
          <p className="text-label mt-0.5">
            Karnataka & Maharashtra Schedule of Rates 2023–25 — Market
            Benchmarks
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  "Material",
                  "Unit",
                  "Maharashtra Rate",
                  "Karnataka Rate",
                  "Trend",
                  "Risk Level",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-label font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATERIAL_COSTS.map((m, i) => (
                <tr
                  key={m.material}
                  className="transition-smooth hover:bg-white/2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  data-ocid={`procurement.material.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                    {m.material}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {m.unit}
                  </td>
                  <td className="px-4 py-3 font-mono text-foreground whitespace-nowrap">
                    ₹{m.rateMH.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-foreground whitespace-nowrap">
                    ₹{m.rateKA.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="font-mono font-bold text-base"
                      style={{
                        color: m.trend.startsWith("+")
                          ? "#FF3D00"
                          : m.trend.startsWith("-")
                            ? "#00E676"
                            : "#FFB300",
                      }}
                    >
                      {m.trend}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        m.risk === "high"
                          ? "badge-critical"
                          : m.risk === "medium"
                            ? "badge-warning"
                            : "badge-low"
                      }
                      style={{ fontSize: "0.62rem" }}
                    >
                      {m.risk.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── GEM EFFICIENCY + CLAUSE FLAGS ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div
          className="glass-card overflow-hidden"
          data-ocid="procurement.gem_panel"
        >
          <div className="px-5 py-3 border-b border-border/30">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp size={14} style={{ color: "#00E676" }} />
              GeM Procurement Efficiency
            </h2>
            <p className="text-label mt-0.5">
              Government e-Marketplace — Sector Share & Avg Value
            </p>
          </div>
          <div className="p-4">
            <div
              className="flex items-center gap-3 mb-4 p-3 rounded-lg"
              style={{
                background: "rgba(0,230,118,0.07)",
                border: "1px solid rgba(0,230,118,0.2)",
              }}
            >
              <span className="text-foreground text-sm font-semibold">
                ⏱ Tender Duration:
              </span>
              <span
                className="font-mono font-bold"
                style={{ color: "#00E676" }}
              >
                28 days (2020) → 19 days (2026)
              </span>
              <span className="badge-success ml-auto">32% Faster</span>
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={GEM_DATA.sectorShares}
                  margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="sector"
                    tick={{ fill: "rgba(176,190,197,0.5)", fontSize: 8 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(176,190,197,0.5)", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
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
                      entry: { payload?: { avgValue?: number } },
                    ) => [
                      `${value}% share — Avg: $${((entry.payload?.avgValue ?? 0) / 1000).toFixed(0)}K`,
                      "Sector Share",
                    ]}
                  />
                  <Bar dataKey="share" radius={[3, 3, 0, 0]} name="Share %">
                    {GEM_DATA.sectorShares.map((entry, idx) => (
                      <Cell
                        key={`cell-${entry.sector}`}
                        fill={`hsl(${180 + idx * 15}, 70%, ${50 + idx * 3}%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div
          className="glass-card overflow-hidden"
          data-ocid="procurement.clauses_panel"
        >
          <div className="px-5 py-3 border-b border-border/30">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle size={14} style={{ color: "#FFB300" }} />
                AI Clause Extraction & Risk Flags
              </h2>
              <span className="font-mono text-xs" style={{ color: "#00D4FF" }}>
                TND-2024-NHA-0891
              </span>
            </div>
            <div className="flex gap-1">
              {(
                [
                  { key: "all", label: "All Clauses" },
                  { key: "risk", label: "Risk Flags" },
                  { key: "obligations", label: "Obligations" },
                  { key: "hidden", label: "Hidden Liabilities" },
                ] as { key: ClauseTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setClauseTab(tab.key)}
                  className="text-xs px-2.5 py-1 rounded transition-smooth"
                  style={{
                    background:
                      clauseTab === tab.key
                        ? "rgba(0,212,255,0.12)"
                        : "transparent",
                    color:
                      clauseTab === tab.key
                        ? "#00D4FF"
                        : "rgba(255,255,255,0.5)",
                    border:
                      clauseTab === tab.key
                        ? "1px solid rgba(0,212,255,0.3)"
                        : "1px solid transparent",
                  }}
                  data-ocid={`procurement.clauses.tab.${tab.key}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-border/20 max-h-72 overflow-y-auto">
            {filteredClauses.map((c, i) => (
              <div
                key={`${c.ref}-${i}`}
                className="px-5 py-3.5 flex gap-3"
                data-ocid={`procurement.clause.item.${i + 1}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <AlertTriangle
                    size={13}
                    style={{
                      color:
                        c.risk === "CRITICAL"
                          ? "#FF3D00"
                          : c.risk === "HIGH"
                            ? "#FF6D00"
                            : c.risk === "MEDIUM"
                              ? "#FFB300"
                              : "#00D4FF",
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {c.ref}
                    </span>
                    <RiskBadge risk={c.risk} />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">
                    {c.description}
                  </p>
                  <p
                    className="text-xs italic"
                    style={{ color: "rgba(0,212,255,0.6)" }}
                  >
                    → {c.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOQ + VENDOR SCORING ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div
          className="glass-card overflow-hidden"
          data-ocid="procurement.boq_panel"
        >
          <div className="px-5 py-3 border-b border-border/30">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <ChevronDown size={14} style={{ color: "#00D4FF" }} />
              BOQ Intelligence & Inflation Analysis
            </h2>
            <p className="text-label mt-0.5">
              Rate variance against MOSPI market indices
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {[
                    "BOQ Item",
                    "Estimated Rate",
                    "Market Rate",
                    "Variance",
                    "Risk",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 text-label font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BOQ_ITEMS.map((b, i) => (
                  <tr
                    key={b.item}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    className="transition-smooth hover:bg-white/2"
                    data-ocid={`procurement.boq.item.${i + 1}`}
                  >
                    <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">
                      {b.item}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">
                      {b.estRate}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">
                      {b.marketRate}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className="font-mono font-bold"
                        style={{
                          color: b.positive
                            ? b.risk === "CRITICAL"
                              ? "#FF3D00"
                              : b.risk === "HIGH"
                                ? "#FF6D00"
                                : b.risk === "MEDIUM"
                                  ? "#FFB300"
                                  : "#00E676"
                            : "#00E676",
                        }}
                      >
                        {b.variance}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <RiskBadge risk={b.risk} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="glass-card overflow-hidden"
          data-ocid="procurement.vendor_panel"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/30">
            <div>
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck size={14} style={{ color: "#00D4FF" }} />
                Vendor Credibility Scoring
              </h2>
              <p className="text-label mt-0.5">
                Vendor Intelligence — Bidder Analysis
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowVendorScoring(true)}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              data-ocid="procurement.vendor_panel.score_button"
            >
              <Plus size={11} /> Score New Vector
            </button>
          </div>
          <div className="divide-y divide-border/20 max-h-72 overflow-y-auto">
            {orgVendors.map((v, i) => (
              <div
                key={v.name}
                className="px-5 py-4"
                style={
                  v.blacklisted
                    ? {
                        background: "rgba(255,61,0,0.04)",
                        borderLeft: "3px solid rgba(255,61,0,0.5)",
                      }
                    : {}
                }
                data-ocid={`procurement.vendor.item.${i + 1}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {v.name}
                      </span>
                      {v.blacklisted ? (
                        <span
                          className="badge-critical"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <XCircle size={9} /> BLACKLIST ALERT
                        </span>
                      ) : (
                        <span
                          className={
                            v.tier === "green"
                              ? "badge-success"
                              : v.tier === "amber"
                                ? "badge-warning"
                                : "badge-critical"
                          }
                        >
                          {v.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ScoreBar score={v.score} tier={v.tier} />
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-label" style={{ fontSize: "0.65rem" }}>
                    Litigations:{" "}
                    <span
                      className="font-mono font-bold"
                      style={{
                        color:
                          v.litigations === 0
                            ? "#00E676"
                            : v.litigations <= 3
                              ? "#FFB300"
                              : "#FF3D00",
                      }}
                    >
                      {v.litigations}
                    </span>
                  </span>
                  <span className="text-label" style={{ fontSize: "0.65rem" }}>
                    Financial:{" "}
                    <span
                      className="font-mono font-bold"
                      style={{
                        color: v.tier === "red" ? "#FF3D00" : "#00D4FF",
                      }}
                    >
                      {v.financial}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FRAUD DETECTION ── */}
      <div
        className="glass-card overflow-hidden"
        data-ocid="procurement.fraud_panel"
      >
        <div className="px-5 py-3 border-b border-border/30">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <ShieldAlert size={14} style={{ color: "#FF3D00" }} />
            L1 Anomaly & Fraud Detection
          </h2>
          <p className="text-label mt-0.5">
            Suspicious Bid Pattern Analysis — AI-Powered Statistical Anomaly
            Engine
          </p>
        </div>
        <div className="p-4 space-y-4">
          {FRAUD_ALERTS.map((a, i) => (
            <div
              key={a.tenderId}
              className="rounded-lg p-4"
              style={{
                background:
                  a.severity === "CRITICAL"
                    ? "rgba(255,61,0,0.06)"
                    : "rgba(255,109,0,0.06)",
                border: `1px solid ${a.severity === "CRITICAL" ? "rgba(255,61,0,0.25)" : "rgba(255,109,0,0.2)"}`,
              }}
              data-ocid={`procurement.fraud.item.${i + 1}`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={16}
                  className="flex-shrink-0 mt-0.5"
                  style={{
                    color: a.severity === "CRITICAL" ? "#FF3D00" : "#FF6D00",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <RiskBadge risk={a.severity} />
                    <span
                      className="font-mono text-xs"
                      style={{ color: "#00D4FF" }}
                    >
                      {a.tenderId}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      — {a.anomalyType}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {a.description}
                  </p>

                  {/* Evidence Summary */}
                  <div
                    className="glass-card p-3 mb-3 space-y-1"
                    style={{ background: "rgba(0,0,0,0.2)" }}
                  >
                    <div className="text-label mb-1.5">
                      Key Anomaly Indicators
                    </div>
                    {a.evidenceItems.slice(0, 3).map((item) => (
                      <div
                        key={`${a.tenderId}-${item.slice(0, 20)}`}
                        className="flex items-start gap-2"
                      >
                        <div
                          className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                          style={{
                            background:
                              a.severity === "CRITICAL" ? "#FF3D00" : "#FF6D00",
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Parties */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {a.partiesInvolved.map((party) => (
                      <span
                        key={party}
                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.7)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <MapPin size={9} /> {party}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setCvcAlert(a)}
                      className="text-xs px-4 py-1.5 rounded font-semibold transition-smooth flex items-center gap-1.5"
                      style={{
                        background: "rgba(255,61,0,0.15)",
                        color: "#FF6B6B",
                        border: "1px solid rgba(255,61,0,0.3)",
                      }}
                      data-ocid={`procurement.fraud.cvc_button.${i + 1}`}
                    >
                      <Shield size={11} /> Refer to CVC
                    </button>
                    <button
                      type="button"
                      onClick={() => setCciAlert(a)}
                      className="text-xs px-4 py-1.5 rounded font-semibold transition-smooth flex items-center gap-1.5"
                      style={{
                        background: "rgba(255,109,0,0.12)",
                        color: "#FF8C42",
                        border: "1px solid rgba(255,109,0,0.25)",
                      }}
                      data-ocid={`procurement.fraud.cci_button.${i + 1}`}
                    >
                      <Gavel size={11} /> Refer to CCI
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
