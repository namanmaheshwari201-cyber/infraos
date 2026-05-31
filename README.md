InfraOS — AI Operating System for Infrastructure

India's first AI-native command center for infrastructure governance, procurement, execution, and asset management. Built for governments, ministries, EPCs, and infrastructure funds.

Live Demo: https://infraos-naman-maheshwari-s-projects.vercel.app

The Problem
India's National Infrastructure Pipeline (NIP) commits ₹111 lakh crore across 9,000+ projects. Yet:

42.8% of mega projects are behind schedule (MoSPI, 2025)
₹4.8 lakh crore in total cost overruns across monitored projects
Procurement fraud, BOQ inflation, and L1 bid manipulation go undetected until arbitration
No single system gives a ministry official, NHAI engineer, or fund manager a unified, real-time view across the entire pipeline

Infrastructure governance in India runs on Excel, scattered PDFs, and WhatsApp. InfraOS replaces that.

What InfraOS Does
InfraOS is a full-stack enterprise SaaS platform with five intelligence modules, an AI copilot, and a national infrastructure map — all connected through a multi-organisation command center.
Modules
Procurement Intelligence
Detects fraud before award. Scores BOQ items against market rates, flags abnormal L1 bids, extracts risky clauses from tender documents, and generates fraud alerts with evidence. Covers 35+ real tender entries from MoRTH, NHAI, NHIDCL, and Smart Cities Mission.
Execution Command
Tracks milestone progress across active projects, predicts delay risk, surfaces permit bottlenecks, and monitors resource productivity. Per-project critical path alerts with severity scoring.
Commercial Defense
Anticipates contractor claims before they escalate to arbitration. EOT scoring, BOQ forensics, billing anomaly detection, and arbitration exposure dashboards. Tracks ₹1.8L Cr+ in active exposure across the NHAI portfolio.
Governance Oversight
Ministry-grade compliance tracking. Bid rigging alerts, NOC/approval status, audit trail with timestamped actions, and accountability maps across contractors and officials. CSV export for all trail data.
Asset Intelligence
Predictive maintenance for roads, bridges, tunnels, and metro systems. Sensor-integrated health scores, degradation rate tracking, maintenance prioritisation, and inspection scheduling.
AI Copilot
Always-on infrastructure intelligence assistant. Surfaces top delay risks, arbitration exposure, and executive briefings on demand. Powered by a domain-specific knowledge engine trained on Indian infrastructure terminology, NHAI processes, BOT concession logic, and procurement law.
National Infrastructure Map
Interactive Leaflet map with per-state project overlays, satellite view, delay filtering, and drill-down into individual projects. Real data across 28+ states.
Reports & Analysis
Multi-sheet analytics export, pivot-ready data packs, NotebookLM mind maps, and PDF intelligence reports. All download buttons trigger real file downloads with actual data.

Organisation Switcher
InfraOS supports five distinct government organisations, each with fully isolated data, KPIs, alerts, and AI insights:
OrganisationFocusMoRTHNational Highway Development & PolicyNHAIHighway Execution & ConcessionsSmart Cities MissionUrban Infrastructure IntelligenceMoRTH PMUProject Management & ComplianceNHIDCLNE Corridor & Border Connectivity
Switching organisation re-renders the entire dashboard, map, vendor graph, and risk hub with organisation-specific data.

Tech Stack
Frontend

React 19 with TypeScript
TanStack Router for type-safe client-side routing (14 routes)
TanStack Query for async state management
Recharts for data visualisation (bar, line, pie, area charts)
React Leaflet for the national infrastructure map
Framer Motion for animations
shadcn/ui + Radix UI for accessible component primitives
Tailwind CSS with a custom enterprise design system (OKLCH colour palette, DM Sans + JetBrains Mono typography)
Vite build system

Backend (Internet Computer Protocol)

Motoko smart contracts deployed on ICP
Caffeine AI framework for canister scaffolding and HTTP outcalls
Internet Identity for decentralised authentication
Gemini 2.0 Flash via ICP HTTP outcalls for AI inference from the canister layer
Full type definitions for Project, Tender, Vendor, Asset, Alert, and DashboardStats
Compiled WASM binary included (backend.wasm, backend.did)

Why ICP?
Infrastructure data for government systems must be tamper-proof, auditable, and not dependent on a centralised cloud provider that can be politically pressured or go offline. ICP's on-chain computation model makes InfraOS's audit trail and governance data immutable by design — not just logged, but cryptographically committed.

Project Structure
infraos-main/
├── src/
│   ├── backend/                   # ICP Motoko backend
│   │   ├── main.mo                # Actor entry point
│   │   ├── mixins/
│   │   │   ├── ai-copilot.mo      # Gemini HTTP outcall integration
│   │   │   └── projects-api.mo    # Projects/Tenders/Vendors/Assets API
│   │   ├── types/
│   │   │   ├── projects.mo        # Core data types
│   │   │   └── common.mo          # Shared ID types
│   │   └── dist/
│   │       ├── backend.wasm       # Compiled canister
│   │       └── backend.did        # Candid interface
│   └── frontend/
│       ├── src/
│       │   ├── pages/             # 14 full-featured page components
│       │   ├── components/        # Layout, AI Copilot, UI primitives
│       │   ├── data/orgData.ts    # Org-specific data layer (2,557 lines)
│       │   ├── services/          # AI copilot engine (2,716 lines)
│       │   ├── context/           # Organisation context provider
│       │   └── types.ts           # Shared TypeScript types
│       └── dist/                  # Production build (deployed to Vercel)
├── DESIGN.md                      # Design system specification
└── project.json                   # Project metadata

Running Locally
Prerequisites

Node.js ≥ 16
pnpm ≥ 7

Frontend
bashcd src/frontend
pnpm install --prefer-offline
pnpm dev
The app runs at http://localhost:5173.
Build for production
bashcd src/frontend
pnpm build
Backend (requires DFX + Mops)
bash# From src/backend/
mops install
mops build

# Generate frontend bindings (from root)
pnpm bindgen

Data & Domain Accuracy
InfraOS is not a demo with placeholder data. Every dataset reflects real Indian infrastructure:

Tenders: NH-44 Jammu-Pathankot widening, Delhi-Mumbai Expressway Phase II, NHAI BOT concessions, NHIDCL border road packages, Smart Cities urban projects
KPIs: Based on MoSPI quarterly infrastructure reports, NIP sector breakdowns, and NHAI annual data
Vendor data: Modelled on publicly known contractor risk profiles, litigation history, and financial health categories
GEM data: Government e-Marketplace procurement categories and values
Material costs: Steel, cement, bitumen, and aggregate rates grounded in 2025 market benchmarks
State heatmap: Per-state delay and risk scores derived from NITI Aayog and MoSPI project monitoring data


Key Features at a Glance

✅ 14 fully functional routes, each with multiple sub-sections and interactive data
✅ 5 government organisations with completely isolated, realistic data
✅ 35+ real tender entries with fraud scoring, clause analysis, and BOQ comparison
✅ Interactive national map covering all major Indian states
✅ AI Copilot with domain-specific infrastructure knowledge
✅ Vendor intelligence with credibility scoring, blacklist flags, and litigation tracking
✅ Audit trail with timestamped actions and CSV export
✅ All export/download buttons produce real files
✅ ICP blockchain backend with Motoko smart contracts and compiled WASM
✅ Internet Identity integration for decentralised auth
✅ Production build deployed and live on Vercel


Design System
InfraOS uses a custom enterprise design language: matte black backgrounds (OKLCH 0.06), teal accent (#00D4FF), glassmorphism cards with backdrop blur, and a strict typography system (DM Sans for UI, JetBrains Mono for data values). The full specification is in DESIGN.md.
The aesthetic is intentionally institutional — Palantir meets SAP meets Autodesk Construction Cloud. Zero startup fluff.

Team
Built for submission to the hackathon.
Naman Maheshwari
