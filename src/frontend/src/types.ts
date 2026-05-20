// ─── InfraOS TypeScript Types ──────────────────────────────────────────────

export type RiskLevel = "critical" | "high" | "warning" | "low" | "success";
export type StatusType =
  | "active"
  | "delayed"
  | "completed"
  | "at-risk"
  | "on-hold";
export type ModuleId =
  | "dashboard"
  | "procurement"
  | "execution"
  | "commercial"
  | "governance"
  | "assets"
  | "lifecycle"
  | "map"
  | "vendors"
  | "reports"
  | "settings";

export interface NavItem {
  id: ModuleId;
  label: string;
  path: string;
  icon: string;
  section: "command" | "intelligence" | "analytics" | "system";
  badge?: number;
}

export interface Project {
  id: string;
  name: string;
  state: string;
  projectType:
    | "highway"
    | "bridge"
    | "tunnel"
    | "metro"
    | "port"
    | "airport"
    | "urban";
  contractor: string;
  value: number; // in crores
  status: StatusType;
  completion: number; // 0-100
  delayDays: number;
  costOverrun: number; // percentage
  riskScore: number; // 0-100
  ministry: string;
  startDate: string;
  targetDate: string;
}

export interface Tender {
  id: string;
  title: string;
  ministry: string;
  estimatedValue: number; // crores
  l1Bid: number;
  l2Bid: number;
  fraudRisk: RiskLevel;
  fraudScore: number; // 0-100
  clauses: number;
  flaggedClauses: number;
  status: "open" | "evaluation" | "awarded" | "cancelled";
  publishedDate: string;
  closingDate: string;
  state: string;
}

export interface Vendor {
  id: string;
  name: string;
  credibilityScore: number; // 0-100
  litigationCount: number;
  blacklisted: boolean;
  financialHealth: RiskLevel;
  activeProjects: number;
  completedProjects: number;
  avgDelayDays: number;
  netWorth: number; // crores
  arbitrationCases: number;
  state: string;
  specialization: string[];
}

export interface Asset {
  id: string;
  name: string;
  assetType: "bridge" | "road" | "tunnel" | "dam" | "flyover" | "metro-station";
  location: string;
  state: string;
  healthScore: number; // 0-100
  degradationRate: number; // % per year
  lastInspection: string;
  nextInspection: string;
  maintenancePriority: RiskLevel;
  sensorStatus: "online" | "offline" | "degraded";
  yearBuilt: number;
  estimatedLife: number; // years
  repairCostEstimate: number; // crores
}

export interface Alert {
  id: string;
  severity: RiskLevel;
  module: ModuleId;
  description: string;
  project: string;
  timestamp: string;
  resolved: boolean;
  actionRequired: boolean;
}

export interface DashboardStats {
  totalProjects: number;
  delayedProjects: number;
  totalPipelineValue: number; // lakh crores
  costOverruns: number; // lakh crores
  arbitrationExposure: number; // lakh crores
  onTrackPercent: number;
  criticalAlerts: number;
  activeVendors: number;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  riskLevel?: RiskLevel;
  icon: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  module: ModuleId;
  timestamp: string;
  category: "fraud" | "delay" | "cost" | "compliance" | "performance";
}

export interface ModuleConfig {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  stats: { label: string; value: string }[];
}

// ─── National-Level Data Types ─────────────────────────────────────────────────

export interface NationalStats {
  nipInvestmentLCr: number; // ₹111 Lakh Crore
  activeMegaProjects: number; // 1820
  delayRatioPct: number; // 42.8
  avgCostOverrunPct: number; // 18.2
  delayedProjectsCount: number; // 780
  avgDelayMonthsMin: number; // 36
  avgDelayMonthsMax: number; // 48
  totalCostOverrunLCr: number; // 4.8
  arbitrationLockedCr: number; // 70000
  cagMissedTollRevCr: number; // 259.47
  lpiRank2023: number; // 38
  lpiRank2018: number; // 44
  logisticsCostCurrentPct: number; // 13.5 (midpoint of 13-14%)
  logisticsCostTargetPct: number; // 8
}

export interface NipSector {
  sector: string;
  investment: number; // Lakh Crore
  pct: number;
  color: string;
}

export interface DelayCause {
  cause: string;
  pct: number;
  projects: number;
  color: string;
}

export interface NhPaceData {
  year: string;
  kmPerDay: number;
  corridors: number;
}

export interface MaterialCost {
  material: string;
  unit: string;
  rateMH: number; // Maharashtra rate ₹/unit
  rateKA: number; // Karnataka rate ₹/unit
  trend: string; // e.g. "+2.0%"
  risk: "low" | "medium" | "high";
}

export interface GemSectorShare {
  sector: string;
  share: number; // percentage
  avgValue: number; // USD
}

export interface GemData {
  tenderDuration: {
    year2020: number;
    year2026: number;
    improvement: string;
  };
  sectorShares: GemSectorShare[];
}

export interface RealTender {
  id: string;
  authority: string;
  description: string;
  scope: string;
  status: "Active" | "In Progress" | "Completed";
  deadline?: string;
  model: "EPC" | "HAM" | "BOT" | "Consultancy" | "PPP";
  riskScore: number; // 0-100
}

export interface RealVendor {
  name: string;
  type: "Large EPC" | "Mid EPC" | "Small EPC" | "Consultancy";
  activeContracts: number;
  totalValue: string;
  arbitrationExposure: string;
  blacklistRisk: "LOW" | "MEDIUM" | "HIGH";
  litigationScore: number; // 0-100
  financialHealth: string; // credit rating
  status: "Active" | "Watch" | "Suspended";
  keyProjects: string[];
}

export interface SmartCitiesAssets {
  waterSupplyPipelines: { km: number; scadaMonitored: number };
  seweragePipelines: { km: number };
  smartToilets: number;
  ledStreetlights: number;
  videoSurveillanceCameras: number;
  emergencyCallBoxes: number;
  citiesMonitored: number;
}

export interface GatiShaktiData {
  gisLayers: number;
  ministriesIntegrated: number;
  statesUTs: number;
  nodal_agency: string;
  governanceTiers: string[];
  logisticsRank: { rank2018: number; rank2023: number; index: string };
  railPrealignment: { before: string; after: string };
  locationSurveys: { fy21: number; fy22: number };
}

export interface MunicipalBond {
  city: string;
  amount: number; // crores
  year: number;
}

export interface CostOverrunTrend {
  year: string;
  overrunLCr: number; // Lakh Crore
  projects: number;
}
