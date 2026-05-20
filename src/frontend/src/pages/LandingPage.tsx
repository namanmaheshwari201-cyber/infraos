import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  CheckCircle,
  ChevronRight,
  Globe,
  HardHat,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  TrendingDown,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { NIP_SECTORS } from "../data/orgData";

// ── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  {
    value: "₹111L Cr",
    label: "National Infrastructure Pipeline (FY 2020-25)",
    color: "#00D4FF",
    id: "pipeline",
  },
  {
    value: "1,820",
    label: "Active Mega Projects Monitored by MoSPI",
    color: "#00E676",
    id: "projects",
  },
  {
    value: "42.8%",
    label: "Projects Behind Schedule",
    color: "#FF6D00",
    id: "delayed",
  },
  {
    value: "₹4.8L Cr",
    label: "Total Cost Overruns",
    color: "#FF3D00",
    id: "overruns",
  },
];

const MODULES_LIST = [
  {
    icon: BarChart3,
    title: "Procurement Intelligence",
    desc: "Detect fraud, score vendors, analyze BOQ before award. AI clause extraction and tender risk scoring.",
    color: "#00D4FF",
    href: "/app/procurement",
    id: "procurement",
  },
  {
    icon: Zap,
    title: "Execution Command",
    desc: "Track milestones, predict delays, manage permits in real-time. Live field validation and critical path alerts.",
    color: "#00E676",
    href: "/app/execution",
    id: "execution",
  },
  {
    icon: TrendingDown,
    title: "Commercial Defense",
    desc: "Anticipate claims, detect billing anomalies, control arbitration exposure. EOT scoring and BOQ forensics.",
    color: "#FFB300",
    href: "/app/commercial",
    id: "commercial",
  },
  {
    icon: Shield,
    title: "Governance Oversight",
    desc: "Ministry-grade transparency, audit trails, accountability maps. Bid rigging alerts and compliance dashboards.",
    color: "#FF6D00",
    href: "/app/governance",
    id: "governance",
  },
  {
    icon: HardHat,
    title: "Asset Intelligence",
    desc: "Predictive maintenance, degradation scoring, sensor diagnostics. Infrastructure health monitoring.",
    color: "#C084FC",
    href: "/app/assets",
    id: "assets",
  },
  {
    icon: Brain,
    title: "AI Copilot",
    desc: "Executive-grade insights on every risk, anomaly, and decision point. Real-time risk summaries.",
    color: "#F472B6",
    href: "/app/dashboard",
    id: "copilot",
  },
];

const ARCH_LAYERS = [
  {
    num: "05",
    title: "Decision Layer",
    desc: "Ministry, EPC, Regulator, Investor — role-based command views and executive intelligence",
    icons: ["MoRTH", "NHAI", "EPC", "DFI"],
    id: "decision",
  },
  {
    num: "04",
    title: "Command Interface",
    desc: "Dashboards, alerts, reports, AI Copilot — real-time executive and operational visibility",
    icons: ["Dashboards", "Alerts", "Reports", "Copilot"],
    id: "command",
  },
  {
    num: "03",
    title: "Module Layer",
    desc: "Procurement, Execution, Commercial, Governance, Assets — five intelligence workspaces",
    icons: ["Procurement", "Execution", "Commercial", "Governance"],
    id: "module",
  },
  {
    num: "02",
    title: "Intelligence Engine",
    desc: "NLP clause extraction, risk scoring models, anomaly detection, ML delay forecasting",
    icons: ["NLP", "Risk AI", "Anomaly", "Forecast"],
    id: "intelligence",
  },
  {
    num: "01",
    title: "Data Ingestion Layer",
    desc: "Tenders, BOQs, project MIS, sensor feeds, court records, financial documents",
    icons: ["Tenders", "BOQ", "Sensors", "Docs"],
    id: "data",
  },
];

const BENEFITS = [
  {
    metric: "73%",
    desc: "Reduction in claim escalation across monitored programs",
    id: "claims",
  },
  {
    metric: "89%",
    desc: "Tender fraud detection accuracy on live procurement data",
    id: "fraud",
  },
  {
    metric: "4.2×",
    desc: "Faster approval cycle time with automated SLA tracking",
    id: "approvals",
  },
  {
    metric: "₹800Cr",
    desc: "Average cost saved per infrastructure program annually",
    id: "savings",
  },
];

const FOOTER_LINKS = {
  Platform: [
    "Command Dashboard",
    "Project Lifecycle",
    "National Map",
    "Vendor Intelligence",
  ],
  Modules: [
    "Procurement Intelligence",
    "Execution Command",
    "Commercial Risk",
    "Governance Oversight",
  ],
  Resources: [
    "Documentation",
    "API Reference",
    "Case Studies",
    "Enterprise Blog",
  ],
  Company: ["About InfraOS", "Leadership Team", "Careers", "Press & Media"],
};

// ── Hero Command Center Visual ────────────────────────────────────────────────

function CommandCenterPreview() {
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden scan-line-anim"
      style={{
        background: "rgba(8,11,15,0.95)",
        border: "1px solid rgba(0,212,255,0.2)",
        boxShadow:
          "0 0 60px rgba(0,212,255,0.1), 0 0 120px rgba(0,212,255,0.04)",
        minHeight: "380px",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{
          borderColor: "rgba(0,212,255,0.12)",
          background: "rgba(0,212,255,0.04)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
          <span className="text-[10px] font-mono text-[#00D4FF] tracking-widest uppercase">
            InfraOS Command Center — LIVE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-muted-foreground">
            NIP 2030 · 847 Projects Active
          </span>
          <div className="flex gap-1">
            {(["#FF3D00", "#FFB300", "#00D4FF"] as const).map((c) => (
              <div
                key={c}
                className="w-2 h-2 rounded-full"
                style={{ background: c, opacity: 0.8 }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0 h-full">
        {/* Left column: KPI cards */}
        <div
          className="col-span-1 border-r p-3 flex flex-col gap-2"
          style={{ borderColor: "rgba(0,212,255,0.08)" }}
        >
          <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">
            National KPIs
          </p>
          {[
            {
              label: "Pipeline Value",
              val: "₹111L Cr",
              trend: "+12%",
              id: "pipeline",
            },
            {
              label: "Active Projects",
              val: "847",
              trend: "▲ 23",
              id: "projects",
            },
            {
              label: "Critical Alerts",
              val: "14",
              trend: "HIGH",
              warn: true,
              id: "alerts",
            },
            {
              label: "Avg. Delay",
              val: "18.4 mo",
              trend: "↑ 2.1",
              id: "delay",
            },
            {
              label: "Cost Overrun",
              val: "₹5.61L Cr",
              trend: "↑ 8%",
              danger: true,
              id: "overrun",
            },
          ].map((kpi) => (
            <div
              key={kpi.id}
              className="rounded p-2"
              style={{
                background: "rgba(0,212,255,0.04)",
                border: "1px solid rgba(0,212,255,0.08)",
              }}
            >
              <div className="text-[8px] text-muted-foreground uppercase tracking-wider">
                {kpi.label}
              </div>
              <div className="flex items-end justify-between">
                <span
                  className="text-sm font-mono font-bold"
                  style={{ color: kpi.danger ? "#FF3D00" : "#00D4FF" }}
                >
                  {kpi.val}
                </span>
                <span
                  className="text-[8px] font-mono"
                  style={{
                    color: kpi.warn ? "#FFB300" : "rgba(0,212,255,0.5)",
                  }}
                >
                  {kpi.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Center: India map SVG + heat zones */}
        <div
          className="col-span-1 flex flex-col items-center justify-center p-3 border-r relative"
          style={{ borderColor: "rgba(0,212,255,0.08)" }}
        >
          <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-2">
            Risk Concentration Map
          </p>
          <svg
            viewBox="0 0 200 220"
            className="w-full max-w-[160px]"
            aria-label="India Infrastructure Risk Map"
            style={{ filter: "drop-shadow(0 0 8px rgba(0,212,255,0.2))" }}
          >
            <title>India Infrastructure Risk Map</title>
            {/* Simplified India outline */}
            <path
              d="M95,8 L115,12 L132,20 L148,35 L155,52 L158,70 L152,88 L160,105 L165,122 L162,140 L155,158 L145,172 L130,182 L118,192 L108,200 L100,208 L92,200 L80,188 L68,175 L58,162 L50,148 L45,132 L42,115 L40,98 L45,82 L48,65 L52,50 L60,36 L72,24 L85,14 Z"
              fill="rgba(0,212,255,0.06)"
              stroke="rgba(0,212,255,0.3)"
              strokeWidth="1.2"
            />
            {/* Kashmir / northern regions */}
            <path
              d="M95,8 L105,5 L118,8 L128,15 L132,20 L120,18 L108,14 Z"
              fill="rgba(0,212,255,0.05)"
              stroke="rgba(0,212,255,0.2)"
              strokeWidth="0.8"
            />
            {/* Risk dots */}
            {[
              {
                cx: 80,
                cy: 60,
                r: 5,
                color: "#FF3D00",
                opacity: 0.8,
                id: "dot1",
              },
              {
                cx: 120,
                cy: 75,
                r: 4,
                color: "#FFB300",
                opacity: 0.7,
                id: "dot2",
              },
              {
                cx: 95,
                cy: 100,
                r: 6,
                color: "#FF3D00",
                opacity: 0.9,
                id: "dot3",
              },
              {
                cx: 110,
                cy: 130,
                r: 4,
                color: "#00D4FF",
                opacity: 0.6,
                id: "dot4",
              },
              {
                cx: 75,
                cy: 145,
                r: 3,
                color: "#FFB300",
                opacity: 0.7,
                id: "dot5",
              },
              {
                cx: 130,
                cy: 110,
                r: 3,
                color: "#00D4FF",
                opacity: 0.6,
                id: "dot6",
              },
              {
                cx: 88,
                cy: 170,
                r: 2,
                color: "#00E676",
                opacity: 0.5,
                id: "dot7",
              },
              {
                cx: 105,
                cy: 155,
                r: 3,
                color: "#FF3D00",
                opacity: 0.7,
                id: "dot8",
              },
            ].map((dot) => (
              <circle
                key={dot.id}
                cx={dot.cx}
                cy={dot.cy}
                r={dot.r}
                fill={dot.color}
                opacity={dot.opacity}
                style={{ filter: `drop-shadow(0 0 4px ${dot.color})` }}
              />
            ))}
            {/* Grid lines over map */}
            {[50, 80, 110, 140, 170].map((y) => (
              <line
                key={`hl-${y}`}
                x1="40"
                y1={y}
                x2="165"
                y2={y}
                stroke="rgba(0,212,255,0.06)"
                strokeWidth="0.5"
              />
            ))}
            {[60, 90, 120, 150].map((x) => (
              <line
                key={`vl-${x}`}
                x1={x}
                y1="5"
                x2={x}
                y2="210"
                stroke="rgba(0,212,255,0.06)"
                strokeWidth="0.5"
              />
            ))}
          </svg>
          {/* Legend */}
          <div className="flex gap-3 mt-2">
            {[
              ["#FF3D00", "Critical"],
              ["#FFB300", "High"],
              ["#00D4FF", "Active"],
            ].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: c }}
                />
                <span className="text-[7px] text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Alerts & data streams */}
        <div className="col-span-1 p-3 flex flex-col gap-2">
          <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">
            Live Intelligence Feed
          </p>
          {[
            {
              type: "CRITICAL",
              msg: "NHDP Phase VII — 34% cost overrun",
              time: "2m ago",
              color: "#FF3D00",
              id: "alert1",
            },
            {
              type: "HIGH",
              msg: "Pune Ring Road — Permit NOC delayed 8mo",
              time: "5m ago",
              color: "#FF6D00",
              id: "alert2",
            },
            {
              type: "AI",
              msg: "Tender manipulation detected — NH-48 widening",
              time: "12m ago",
              color: "#FFB300",
              id: "alert3",
            },
            {
              type: "INFO",
              msg: "L&T BOQ variance flagged — ₹23.4Cr",
              time: "18m ago",
              color: "#00D4FF",
              id: "alert4",
            },
            {
              type: "AI",
              msg: "EOT claim probability: 78% — DMIC Corridor",
              time: "25m ago",
              color: "#C084FC",
              id: "alert5",
            },
          ].map((alert) => (
            <div
              key={alert.id}
              className="rounded p-2"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${alert.color}20`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="text-[7px] font-bold font-mono px-1 rounded"
                  style={{ background: `${alert.color}20`, color: alert.color }}
                >
                  {alert.type}
                </span>
                <span className="text-[7px] text-muted-foreground ml-auto">
                  {alert.time}
                </span>
              </div>
              <p
                className="text-[8px] leading-tight"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {alert.msg}
              </p>
            </div>
          ))}
          {/* Data stream lines */}
          <div
            className="mt-auto pt-2 border-t"
            style={{ borderColor: "rgba(0,212,255,0.08)" }}
          >
            <div className="flex gap-1">
              {[
                { h: 70, id: "b1" },
                { h: 45, id: "b2" },
                { h: 85, id: "b3" },
                { h: 55, id: "b4" },
                { h: 90, id: "b5" },
                { h: 40, id: "b6" },
                { h: 75, id: "b7" },
                { h: 65, id: "b8" },
                { h: 80, id: "b9" },
                { h: 50, id: "b10" },
              ].map(({ h, id }) => (
                <div
                  key={id}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h * 0.3}px`,
                    background: `rgba(0,212,255,${0.2 + h * 0.005})`,
                  }}
                />
              ))}
            </div>
            <p className="text-[7px] text-muted-foreground mt-1 font-mono">
              AI RISK SIGNAL — 10D TREND
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Demo Request Modal ────────────────────────────────────────────────────────
function DemoModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.8)" }}
      data-ocid="demo_modal.dialog"
    >
      <div className="glass-elevated w-full max-w-md mx-4 rounded-xl border border-primary/20 shadow-panel overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <div>
            <p className="text-[10px] font-mono text-primary uppercase tracking-widest mb-0.5">
              ENTERPRISE ACCESS
            </p>
            <h3 className="text-lg font-bold text-foreground">
              Request Enterprise Demo
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-2"
            aria-label="Close"
            data-ocid="demo_modal.close_button"
          >
            <X size={15} />
          </button>
        </div>
        {submitted ? (
          <div className="px-6 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-primary" />
            </div>
            <h4 className="text-base font-bold text-foreground mb-2">
              Request Submitted!
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Our enterprise team will reach out within 24 hours to schedule
              your personalized InfraOS demo.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary text-sm px-6 py-2"
              data-ocid="demo_modal.success_state"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label
                htmlFor="demo-name"
                className="text-label text-[10px] block mb-1.5"
              >
                FULL NAME *
              </label>
              <input
                id="demo-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rajesh Sharma, Joint Secretary"
                className="w-full glass-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-smooth"
                data-ocid="demo_modal.name_input"
              />
            </div>
            <div>
              <label
                htmlFor="demo-org"
                className="text-label text-[10px] block mb-1.5"
              >
                ORGANIZATION *
              </label>
              <input
                id="demo-org"
                type="text"
                required
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Ministry of Road Transport & Highways"
                className="w-full glass-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-smooth"
                data-ocid="demo_modal.org_input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="demo-email"
                  className="text-label text-[10px] block mb-1.5"
                >
                  OFFICIAL EMAIL *
                </label>
                <input
                  id="demo-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@gov.in"
                  className="w-full glass-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-smooth"
                  data-ocid="demo_modal.email_input"
                />
              </div>
              <div>
                <label
                  htmlFor="demo-phone"
                  className="text-label text-[10px] block mb-1.5"
                >
                  PHONE *
                </label>
                <input
                  id="demo-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full glass-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-smooth"
                  data-ocid="demo_modal.phone_input"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3 mt-2"
              data-ocid="demo_modal.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  Submit Request <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* NAV */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-10 h-16 border-b"
        style={{
          background: "rgba(8,11,15,0.97)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(0,212,255,0.1)",
        }}
        data-ocid="landing.nav"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(0,212,255,0.12)",
              border: "1px solid rgba(0,212,255,0.3)",
            }}
          >
            <Building2 size={15} className="text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Infra<span className="text-primary">OS</span>
          </span>
          <span
            className="hidden lg:inline text-[10px] font-mono uppercase tracking-widest ml-1 px-2 py-0.5 rounded"
            style={{
              background: "rgba(0,212,255,0.08)",
              color: "rgba(0,212,255,0.6)",
              border: "1px solid rgba(0,212,255,0.15)",
            }}
          >
            Enterprise
          </span>
        </div>

        <nav
          className="hidden md:flex items-center gap-7 text-sm"
          aria-label="Primary navigation"
        >
          {[
            { label: "Platform", id: "why" },
            { label: "Modules", id: "modules" },
            { label: "Architecture", id: "architecture" },
            { label: "About", id: "footer-section" },
          ].map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollTo(link.id)}
              className="text-muted-foreground hover:text-foreground transition-smooth text-sm btn-ghost px-2 py-1"
              data-ocid={`landing.nav.${link.label.toLowerCase()}`}
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowDemo(true)}
            className="btn-primary text-sm px-4 py-1.5"
            data-ocid="landing.nav.demo"
          >
            Enterprise Demo
          </button>
          <Link
            to="/app/dashboard"
            className="btn-secondary text-sm px-4 py-1.5"
            data-ocid="landing.nav.enter_platform"
          >
            Enter Platform
          </Link>
        </nav>

        {/* Mobile CTA */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/app/dashboard"
            className="btn-primary text-xs px-3 py-1.5"
            data-ocid="landing.nav.mobile_enter"
          >
            Enter Platform
          </Link>
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* HERO */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative pt-16 min-h-screen flex items-center overflow-hidden grid-overlay"
        style={{
          background:
            "linear-gradient(160deg, #070A0E 0%, #0A0C0F 40%, #0B0F14 100%)",
        }}
        data-ocid="landing.hero.section"
      >
        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,180,255,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div style={{ animation: "fadeInUp 0.8s ease both" }}>
              {/* Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    color: "#00D4FF",
                    border: "1px solid rgba(0,212,255,0.25)",
                  }}
                >
                  India's Infrastructure Intelligence Platform
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                  <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">
                    NIP 2030
                  </span>
                </div>
              </div>

              {/* H1 */}
              <h1
                className="font-display font-bold leading-[1.05] mb-5"
                style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)" }}
              >
                <span className="text-foreground">InfraOS —</span>
                <br />
                <span className="text-foreground">The AI Operating System</span>
                <br />
                <span
                  className="text-primary"
                  style={{ textShadow: "0 0 40px rgba(0,212,255,0.35)" }}
                >
                  for Infrastructure
                </span>
              </h1>

              <p
                className="text-muted-foreground text-lg mb-8 leading-relaxed"
                style={{ maxWidth: "480px" }}
              >
                Governing India's Infrastructure Lifecycle with Intelligence,
                Risk Control &amp; Execution Visibility. Built for NHAI, MoRTH,
                EPCs &amp; Infrastructure Funds.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowDemo(true)}
                  className="btn-primary flex items-center gap-2 text-sm px-6 py-3"
                  style={{
                    boxShadow:
                      "0 0 32px rgba(0,212,255,0.35), 0 0 64px rgba(0,212,255,0.1)",
                  }}
                  data-ocid="landing.hero.demo_button"
                >
                  Request Enterprise Demo <ArrowRight size={16} />
                </button>
                <Link
                  to="/app/dashboard"
                  className="btn-secondary flex items-center gap-2 text-sm px-6 py-3"
                  data-ocid="landing.hero.command_button"
                >
                  View Command Center <ChevronRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => scrollTo("modules")}
                  className="btn-ghost flex items-center gap-2 text-sm px-4 py-3"
                  style={{ color: "#00D4FF" }}
                  data-ocid="landing.hero.modules_button"
                >
                  Explore Modules <ChevronRight size={14} />
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-5 mt-8">
                {["ISO 27001", "SOC 2 Type II", "GOI Compliant"].map(
                  (badge) => (
                    <div key={badge} className="flex items-center gap-1.5">
                      <CheckCircle size={12} className="text-[#00E676]" />
                      <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                        {badge}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Right: Command Center Preview */}
            <div style={{ animation: "fadeInUp 0.8s 0.2s ease both" }}>
              <CommandCenterPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* STATS BAND */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="stats"
        className="py-16 border-y"
        style={{ background: "#0D1117", borderColor: "rgba(0,212,255,0.08)" }}
        data-ocid="landing.stats.section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            className="grid grid-cols-2 lg:grid-cols-4"
            style={{ borderColor: "rgba(0,212,255,0.08)" }}
          >
            {STATS.map((s) => (
              <div
                key={s.id}
                className="px-8 py-6 text-center"
                style={{ borderColor: "rgba(0,212,255,0.08)" }}
                data-ocid={`landing.stats.item.${s.id}`}
              >
                <div
                  className="font-mono font-bold mb-2 leading-none"
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    color: s.color,
                    textShadow: `0 0 20px ${s.color}60`,
                  }}
                >
                  {s.value}
                </div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* CRISIS NARRATIVE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="crisis"
        className="py-24 grid-overlay"
        style={{ background: "#0A0C0F" }}
        data-ocid="landing.crisis.section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl mb-14">
            <div
              className="inline-block text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded mb-4"
              style={{
                background: "rgba(255,61,0,0.1)",
                color: "#FF6B6B",
                border: "1px solid rgba(255,61,0,0.2)",
              }}
            >
              The Problem
            </div>
            <h2
              className="font-display font-bold leading-tight text-foreground"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
            >
              India Doesn't Have a{" "}
              <span style={{ color: "#00D4FF" }}>Spending Problem.</span>
              <br />
              It Has an{" "}
              <span
                className="underline decoration-dotted"
                style={{ color: "#FF6B6B", textDecorationColor: "#FF6B6B" }}
              >
                Execution Problem.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {[
              {
                icon: TrendingDown,
                stat: "₹4.8L Cr",
                color: "#FF3D00",
                title: "Cost Overruns",
                id: "cost-overruns",
                desc: "₹4.8L Cr in overruns across 1,820+ monitored projects — 18.2% average overrun. 780 projects delayed by 36–48 months on average.",
              },
              {
                icon: AlertTriangle,
                stat: "₹70,000 Cr+",
                color: "#FFB300",
                title: "Stuck in Arbitration",
                id: "arbitration",
                desc: "₹70,000+ Crore locked in arbitration (HCC, L&T, major EPCs). Only 21% private sector participation targeted in NIP — governance failure at every stage.",
              },
              {
                icon: Layers,
                stat: "38%",
                color: "#C084FC",
                title: "Land Acquisition Delays",
                id: "unified",
                desc: "Land acquisition remains the #1 bottleneck — 38% of all delays. Followed by environmental clearances (18%) and contractual disputes (14%).",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="glass-card p-7 flex flex-col"
                  style={{ borderColor: `${card.color}20` }}
                  data-ocid={`landing.crisis.card.${card.id}`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                    style={{
                      background: `${card.color}15`,
                      border: `1px solid ${card.color}30`,
                    }}
                  >
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                  <div
                    className="font-mono font-bold text-3xl mb-1"
                    style={{
                      color: card.color,
                      textShadow: `0 0 20px ${card.color}40`,
                    }}
                  >
                    {card.stat}
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Resolution statement */}
          <div
            className="rounded-xl p-6 flex items-center gap-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(0,180,255,0.03) 100%)",
              border: "1px solid rgba(0,212,255,0.2)",
              boxShadow: "0 0 40px rgba(0,212,255,0.05)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(0,212,255,0.15)",
                border: "1px solid rgba(0,212,255,0.3)",
              }}
            >
              <Brain size={18} className="text-primary" />
            </div>
            <p className="text-foreground text-base leading-relaxed">
              <span className="font-bold text-primary">InfraOS</span> solves
              this with AI-native intelligence across the full project lifecycle
              — from tender award to asset maintenance. One platform. Total
              visibility.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* NIP SECTOR BREAKDOWN */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="nip-sectors"
        className="py-24 border-y"
        style={{ background: "#0D1117", borderColor: "rgba(0,212,255,0.06)" }}
        data-ocid="landing.nip_sectors.section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <p className="text-label mb-3">REAL DATA · NIP 2025</p>
            <h2
              className="font-display font-bold text-foreground"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}
            >
              National Infrastructure Pipeline —{" "}
              <span className="text-primary">Sector Investment Breakdown</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-3 max-w-2xl">
              ₹111 Lakh Crore allocated across sectors for FY 2020–25. Energy
              and Roads account for 42.5% of total pipeline. Hover over charts
              for exact figures.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div
              className="rounded-xl p-6"
              style={{
                background: "rgba(8,11,15,0.9)",
                border: "1px solid rgba(0,212,255,0.12)",
                boxShadow: "0 0 40px rgba(0,212,255,0.04)",
              }}
              data-ocid="landing.nip_sectors.bar_chart"
            >
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-4">
                Investment by Sector (₹ Lakh Crore)
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={NIP_SECTORS}
                  barSize={28}
                  margin={{ top: 4, right: 8, bottom: 40, left: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="sector"
                    tick={{
                      fill: "rgba(176,190,197,0.65)",
                      fontSize: 10,
                    }}
                    angle={-35}
                    textAnchor="end"
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(176,190,197,0.6)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                    tickFormatter={(v: number) => `₹${v}`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,212,255,0.05)" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload as (typeof NIP_SECTORS)[0];
                      return (
                        <div
                          className="rounded px-3 py-2 text-xs"
                          style={{
                            background: "rgba(8,11,15,0.97)",
                            border: "1px solid rgba(0,212,255,0.25)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                          }}
                        >
                          <p className="font-semibold text-foreground mb-1">
                            {d.sector}
                          </p>
                          <p className="font-mono font-bold text-primary">
                            ₹{d.investment} Lakh Crore ({d.pct}%)
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="investment" radius={[4, 4, 0, 0]}>
                    {NIP_SECTORS.map((entry) => (
                      <Cell
                        key={entry.sector}
                        fill={entry.color}
                        opacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div
              className="rounded-xl p-6"
              style={{
                background: "rgba(8,11,15,0.9)",
                border: "1px solid rgba(0,212,255,0.12)",
                boxShadow: "0 0 40px rgba(0,212,255,0.04)",
              }}
              data-ocid="landing.nip_sectors.pie_chart"
            >
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-4">
                Sector Share of ₹111 Lakh Crore Pipeline
              </p>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={200} height={220}>
                  <PieChart>
                    <Pie
                      data={NIP_SECTORS}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={88}
                      paddingAngle={2}
                      dataKey="investment"
                      nameKey="sector"
                      stroke="none"
                    >
                      {NIP_SECTORS.map((entry) => (
                        <Cell
                          key={entry.sector}
                          fill={entry.color}
                          opacity={0.88}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload as (typeof NIP_SECTORS)[0];
                        return (
                          <div
                            className="rounded px-3 py-2 text-xs"
                            style={{
                              background: "rgba(8,11,15,0.97)",
                              border: "1px solid rgba(0,212,255,0.25)",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                            }}
                          >
                            <p className="font-semibold text-foreground mb-1">
                              {d.sector}
                            </p>
                            <p className="font-mono font-bold text-primary">
                              ₹{d.investment} Lakh Crore ({d.pct}%)
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  {NIP_SECTORS.map((s) => (
                    <div
                      key={s.sector}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: s.color }}
                        />
                        <span className="text-xs text-muted-foreground truncate">
                          {s.sector}
                        </span>
                      </div>
                      <span
                        className="font-mono text-xs font-bold flex-shrink-0"
                        style={{ color: s.color }}
                      >
                        {s.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Data source note */}
          <p className="text-label text-xs mt-4 text-center">
            Source: National Infrastructure Pipeline 2025 · Ministry of Finance
            · MoSPI Infrastructure Monitoring Report
          </p>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* WHY INFRAOS / MODULES */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="modules"
        className="py-24"
        style={{ background: "#0D1117" }}
        data-ocid="landing.modules.section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-4">
            <div>
              <p className="text-label mb-3">WHY INFRAOS</p>
              <h2
                className="font-display font-bold text-foreground"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}
              >
                Six Intelligence Modules.{" "}
                <span className="text-primary">One Unified Platform.</span>
              </h2>
              <div
                className="w-16 h-0.5 mt-4"
                style={{
                  background: "linear-gradient(90deg, #00D4FF, transparent)",
                }}
              />
            </div>
            <Link
              to="/app/dashboard"
              className="btn-secondary flex items-center gap-2 text-sm self-start lg:self-auto whitespace-nowrap"
              data-ocid="landing.modules.explore_button"
            >
              View All Modules <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODULES_LIST.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  to={
                    mod.href as
                      | "/app/procurement"
                      | "/app/execution"
                      | "/app/commercial"
                      | "/app/governance"
                      | "/app/assets"
                      | "/app/dashboard"
                  }
                  className="glass-card-hover p-6 flex flex-col group"
                  data-ocid={`landing.module.${mod.id}`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center"
                      style={{
                        background: `${mod.color}12`,
                        border: `1px solid ${mod.color}28`,
                      }}
                    >
                      <Icon size={19} style={{ color: mod.color }} />
                    </div>
                    <ChevronRight
                      size={15}
                      className="opacity-0 group-hover:opacity-100 transition-smooth translate-x-0 group-hover:translate-x-1"
                      style={{ color: mod.color }}
                    />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {mod.desc}
                  </p>
                  <div
                    className="mt-5 h-px"
                    style={{
                      background: `linear-gradient(90deg, ${mod.color}30, transparent)`,
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* PLATFORM ARCHITECTURE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="architecture"
        className="py-24 grid-overlay"
        style={{ background: "#0A0C0F" }}
        data-ocid="landing.architecture.section"
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="mb-14">
            <p className="text-label mb-3">PLATFORM ARCHITECTURE</p>
            <h2
              className="font-display font-bold text-foreground"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}
            >
              Five-Layer{" "}
              <span className="text-primary">Intelligence Architecture</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-3 max-w-xl">
              InfraOS is architected as a layered intelligence stack — from raw
              data ingestion to executive decision support.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {ARCH_LAYERS.map((layer, layerIdx) => (
              <div
                key={layer.id}
                className="glass-card-hover rounded-xl overflow-hidden flex"
                style={{
                  borderLeft: `3px solid rgba(0,212,255,${0.3 + layerIdx * 0.12})`,
                  borderColor: `rgba(0,212,255,${0.08 + layerIdx * 0.02})`,
                }}
                data-ocid={`landing.layer.${layer.id}`}
              >
                <div className="flex items-center px-5 py-4 gap-5 flex-1 min-w-0">
                  <span
                    className="font-mono font-bold text-xl flex-shrink-0 w-8"
                    style={{
                      color: `rgba(0,212,255,${0.4 + layerIdx * 0.12})`,
                    }}
                  >
                    {layer.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">
                      {layer.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {layer.desc}
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                    {layer.icons.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono px-2 py-0.5 rounded"
                        style={{
                          background: "rgba(0,212,255,0.07)",
                          color: "rgba(0,212,255,0.6)",
                          border: "1px solid rgba(0,212,255,0.12)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Architecture connector line */}
          <div className="flex justify-center mt-6">
            <div
              className="text-center px-8 py-4 rounded-xl"
              style={{
                background: "rgba(0,212,255,0.06)",
                border: "1px solid rgba(0,212,255,0.15)",
              }}
            >
              <p className="text-[10px] font-mono text-primary uppercase tracking-widest">
                Deployed on NIC Cloud · MEITY Compliant · Air-gapped deployment
                available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* CUSTOMER SEGMENTS */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="customers"
        className="py-24 border-y"
        style={{ background: "#0D1117", borderColor: "rgba(0,212,255,0.06)" }}
        data-ocid="landing.customers.section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-label mb-3">CUSTOMER SEGMENTS</p>
            <h2
              className="font-display font-bold text-foreground"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}
            >
              Built for India's{" "}
              <span className="text-primary">Infrastructure Ecosystem</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                name: "Government Ministries",
                sub: "MoRTH · MoHUA · Railways",
                icon: Building2,
                color: "#00D4FF",
              },
              {
                name: "Highway Authorities",
                sub: "NHAI · NHIDCL · NHDP",
                icon: Globe,
                color: "#00E676",
              },
              {
                name: "EPC Contractors",
                sub: "L&T · NCC · HCC · Dilip Buildcon",
                icon: HardHat,
                color: "#FFB300",
              },
              {
                name: "Infrastructure Funds",
                sub: "DFIs · InvITs · PE Funds",
                icon: BarChart3,
                color: "#C084FC",
                id: "funds",
              },
              {
                name: "State PWDs & Smart Cities",
                sub: "State agencies · SPVs",
                icon: MapPin,
                color: "#F472B6",
                id: "pwd",
              },
            ].map((seg) => {
              const Icon = seg.icon;
              return (
                <div
                  key={seg.id}
                  className="glass-card-hover p-5 text-center flex flex-col items-center gap-3"
                  data-ocid={`landing.customer.${seg.id}`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${seg.color}12`,
                      border: `1px solid ${seg.color}25`,
                    }}
                  >
                    <Icon size={20} style={{ color: seg.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">
                      {seg.name}
                    </h3>
                    <p className="text-muted-foreground text-[10px] leading-tight">
                      {seg.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* STRATEGIC BENEFITS */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="benefits"
        className="py-24 grid-overlay"
        style={{ background: "#0A0C0F" }}
        data-ocid="landing.benefits.section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-label mb-3">STRATEGIC BENEFITS</p>
            <h2
              className="font-display font-bold text-foreground"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}
            >
              The <span className="text-primary">InfraOS Advantage</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((b) => (
              <div
                key={b.id}
                className="glass-card kpi-glow p-7 text-center flex flex-col items-center"
                data-ocid={`landing.benefit.${b.id}`}
              >
                <div
                  className="font-mono font-bold mb-3 leading-none"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 2.8rem)",
                    color: "#00D4FF",
                    textShadow: "0 0 30px rgba(0,212,255,0.5)",
                  }}
                >
                  {b.metric}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ENTERPRISE FOOTER */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer
        id="footer-section"
        className="border-t"
        style={{ background: "#07090D", borderColor: "rgba(0,212,255,0.1)" }}
        data-ocid="landing.footer"
      >
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(0,212,255,0.12)",
                    border: "1px solid rgba(0,212,255,0.25)",
                  }}
                >
                  <Building2 size={16} className="text-primary" />
                </div>
                <span className="font-display font-bold text-xl tracking-tight">
                  Infra<span className="text-primary">OS</span>
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Governing India's Infrastructure with Intelligence. The AI
                Operating System for procurement, execution, governance, and
                asset lifecycle management.
              </p>
              {/* Contact */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={13} className="text-primary flex-shrink-0" />
                  <span>enterprise@infraos.in</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={13} className="text-primary flex-shrink-0" />
                  <span>+91 11 4000 7000</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={13} className="text-primary flex-shrink-0" />
                  <span>New Delhi · Mumbai · Hyderabad</span>
                </div>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section}>
                <h4 className="text-foreground font-semibold text-sm mb-4 uppercase tracking-wider">
                  {section}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        to="/app/dashboard"
                        className="text-muted-foreground text-sm hover:text-primary transition-smooth"
                        data-ocid={`landing.footer.link.${link.toLowerCase().replace(/\s+/g, "_")}`}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer bottom bar */}
        <div
          className="border-t px-6 lg:px-10 py-5"
          style={{ borderColor: "rgba(0,212,255,0.06)" }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-muted-foreground text-xs">
                © {new Date().getFullYear()} InfraOS Technologies Pvt. Ltd. All
                rights reserved.
              </p>
              <span className="hidden md:block text-muted-foreground/30 text-xs">
                |
              </span>
            </div>
            {/* Compliance badges */}
            <div className="flex items-center gap-4">
              {["ISO 27001", "SOC 2", "GOI Compliant"].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 px-3 py-1 rounded"
                  style={{
                    background: "rgba(0,212,255,0.06)",
                    border: "1px solid rgba(0,212,255,0.12)",
                  }}
                >
                  <CheckCircle size={10} className="text-primary" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
