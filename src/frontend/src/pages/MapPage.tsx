import "leaflet/dist/leaflet.css";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Filter,
  Layers,
  Map as MapIcon,
  MapPin,
  Satellite,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

// ── State Project Data ───────────────────────────────────────────────────────

interface StateProject {
  name: string;
  sector: string;
  value: string;
  status: string;
  delay: number;
}

const STATE_PROJECTS: Record<string, StateProject[]> = {
  "West Bengal": [
    {
      name: "Kolkata Elevated Corridor Pkg 2",
      sector: "Roads",
      value: "₹4,560 Cr",
      status: "Delayed",
      delay: 18,
    },
    {
      name: "Howrah Bridge Rehabilitation",
      sector: "Urban",
      value: "₹890 Cr",
      status: "On Track",
      delay: 0,
    },
    {
      name: "NH-12 Bengal Widening",
      sector: "Highways",
      value: "₹2,340 Cr",
      status: "Critical",
      delay: 34,
    },
    {
      name: "Kolkata Metro Line 3 Ext.",
      sector: "Metro",
      value: "₹3,100 Cr",
      status: "Delayed",
      delay: 22,
    },
    {
      name: "KMDA Ring Road Phase 2",
      sector: "Roads",
      value: "₹1,780 Cr",
      status: "At Risk",
      delay: 8,
    },
    {
      name: "Haldia Port Connectivity",
      sector: "Ports",
      value: "₹1,450 Cr",
      status: "On Track",
      delay: 0,
    },
    {
      name: "NH-16 Bengal Stretch",
      sector: "Highways",
      value: "₹3,200 Cr",
      status: "At Risk",
      delay: 12,
    },
  ],
  Bihar: [
    {
      name: "Patna-Gaya Expressway",
      sector: "Highways",
      value: "₹5,200 Cr",
      status: "Critical",
      delay: 42,
    },
    {
      name: "NH-22 Bihar Corridor",
      sector: "Highways",
      value: "₹2,780 Cr",
      status: "Delayed",
      delay: 26,
    },
    {
      name: "Ganga Bridge Patna Pkg 3",
      sector: "Roads",
      value: "₹1,890 Cr",
      status: "At Risk",
      delay: 9,
    },
    {
      name: "Bihar Flood Road Network",
      sector: "Roads",
      value: "₹3,400 Cr",
      status: "Delayed",
      delay: 18,
    },
    {
      name: "Muzaffarpur Urban Roads",
      sector: "Urban",
      value: "₹980 Cr",
      status: "On Track",
      delay: 0,
    },
    {
      name: "Bihar SH Network Upgrade",
      sector: "Roads",
      value: "₹2,100 Cr",
      status: "At Risk",
      delay: 14,
    },
  ],
  "Uttar Pradesh": [
    {
      name: "Ganga Expressway",
      sector: "Highways",
      value: "₹7,400 Cr",
      status: "Delayed",
      delay: 28,
    },
    {
      name: "Lucknow Metro Phase 2",
      sector: "Metro",
      value: "₹3,100 Cr",
      status: "On Track",
      delay: 0,
    },
    {
      name: "Agra-Lucknow HAM Pkg 4",
      sector: "Highways",
      value: "₹2,200 Cr",
      status: "At Risk",
      delay: 6,
    },
    {
      name: "Kanpur Ring Road",
      sector: "Roads",
      value: "₹1,650 Cr",
      status: "Delayed",
      delay: 16,
    },
    {
      name: "UP Expressway Industrial Corridor",
      sector: "Urban",
      value: "₹4,800 Cr",
      status: "Critical",
      delay: 38,
    },
    {
      name: "Varanasi-Gorakhpur NH",
      sector: "Highways",
      value: "₹3,900 Cr",
      status: "At Risk",
      delay: 11,
    },
    {
      name: "NH-2 Widening UP Section",
      sector: "Highways",
      value: "₹2,700 Cr",
      status: "On Track",
      delay: 0,
    },
    {
      name: "Noida Elevated Road Ext.",
      sector: "Roads",
      value: "₹1,400 Cr",
      status: "Delayed",
      delay: 20,
    },
  ],
  Maharashtra: [
    {
      name: "Mumbai-Pune Expressway Upgrade",
      sector: "Highways",
      value: "₹5,200 Cr",
      status: "Delayed",
      delay: 22,
    },
    {
      name: "Mumbai Coastal Road Ph 2",
      sector: "Roads",
      value: "₹4,800 Cr",
      status: "Critical",
      delay: 36,
    },
    {
      name: "Pune Ring Road PMRDA",
      sector: "Roads",
      value: "₹6,300 Cr",
      status: "Delayed",
      delay: 18,
    },
    {
      name: "Nagpur Metro Phase 2",
      sector: "Metro",
      value: "₹2,600 Cr",
      status: "On Track",
      delay: 0,
    },
    {
      name: "Samruddhi Mahamarg Pkg 5",
      sector: "Highways",
      value: "₹3,400 Cr",
      status: "At Risk",
      delay: 7,
    },
    {
      name: "Mumbai Trans Harbour Link",
      sector: "Roads",
      value: "₹4,100 Cr",
      status: "On Track",
      delay: 0,
    },
    {
      name: "Nashik-Pune Expressway",
      sector: "Highways",
      value: "₹2,900 Cr",
      status: "At Risk",
      delay: 14,
    },
  ],
  Karnataka: [
    {
      name: "Peripheral Ring Road Pkg 2",
      sector: "Roads",
      value: "₹9,100 Cr",
      status: "Delayed",
      delay: 30,
    },
    {
      name: "NH-44 Bangalore-Chennai",
      sector: "Highways",
      value: "₹3,800 Cr",
      status: "At Risk",
      delay: 8,
    },
    {
      name: "Bengaluru Metro Phase 3",
      sector: "Metro",
      value: "₹5,200 Cr",
      status: "On Track",
      delay: 0,
    },
    {
      name: "Hassan-Mangaluru NH Upgrade",
      sector: "Highways",
      value: "₹2,100 Cr",
      status: "Delayed",
      delay: 15,
    },
    {
      name: "BBMP Road Improvement 2025",
      sector: "Urban",
      value: "₹1,400 Cr",
      status: "On Track",
      delay: 0,
    },
    {
      name: "Mysuru-Bengaluru Expressway",
      sector: "Highways",
      value: "₹4,500 Cr",
      status: "At Risk",
      delay: 11,
    },
  ],
};

const DEFAULT_STATE_PROJECTS: StateProject[] = [
  {
    name: "State Highway Upgrade Package 1",
    sector: "Highways",
    value: "₹1,200 Cr",
    status: "On Track",
    delay: 0,
  },
  {
    name: "National Highway Widening Ph 2",
    sector: "Roads",
    value: "₹2,400 Cr",
    status: "Delayed",
    delay: 14,
  },
  {
    name: "Urban Connectivity Project",
    sector: "Urban",
    value: "₹890 Cr",
    status: "At Risk",
    delay: 6,
  },
  {
    name: "District Road Improvement",
    sector: "Roads",
    value: "₹560 Cr",
    status: "On Track",
    delay: 0,
  },
  {
    name: "Expressway Extension Pkg 3",
    sector: "Highways",
    value: "₹3,100 Cr",
    status: "Delayed",
    delay: 22,
  },
  {
    name: "Metro Phase Integration",
    sector: "Metro",
    value: "₹1,750 Cr",
    status: "Critical",
    delay: 38,
  },
];

// ── State Project List Modal ──────────────────────────────────────────────────

function StateProjectListModal({
  state,
  onClose,
}: { state: StateData; onClose: () => void }) {
  const projects = STATE_PROJECTS[state.name] ?? DEFAULT_STATE_PROJECTS;
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
      data-ocid="map.state_project_list_modal"
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl overflow-hidden"
        style={{
          background: "rgba(8,10,16,0.98)",
          border: "1px solid rgba(0,212,255,0.25)",
          boxShadow:
            "0 0 60px rgba(0,212,255,0.12), 0 24px 60px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
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
              <MapPin size={15} style={{ color: "#00D4FF" }} />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                {state.name} — Project List
              </h2>
              <p className="text-xs" style={{ color: "rgba(176,190,197,0.6)" }}>
                {projects.length} projects · {state.ministry} · Pipeline:{" "}
                {state.value}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-smooth"
            style={{ color: "rgba(176,190,197,0.6)" }}
            data-ocid="map.state_project_list_modal.close_button"
          >
            <X size={16} />
          </button>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-4 gap-3 px-6 py-3 border-b flex-shrink-0"
          style={{ borderColor: "rgba(0,212,255,0.08)" }}
        >
          {[
            {
              label: "Total Projects",
              value: state.projects,
              color: "#00D4FF",
            },
            { label: "Delayed", value: state.delayed, color: "#FF6D00" },
            {
              label: "Risk Score",
              value: `${state.riskScore}/100`,
              color: RISK_COLORS[state.risk],
            },
            {
              label: "Critical Alerts",
              value: state.criticalAlerts,
              color: "#FF3D00",
            },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <div
                className="font-mono font-bold text-lg"
                style={{ color: m.color }}
              >
                {m.value}
              </div>
              <div className="text-[10px] text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-xs">
            <thead
              className="sticky top-0"
              style={{ background: "rgba(8,10,16,0.98)" }}
            >
              <tr
                className="border-b"
                style={{ borderColor: "rgba(0,212,255,0.1)" }}
              >
                {[
                  "Project Name",
                  "Sector",
                  "Value (₹ Cr)",
                  "Status",
                  "Delay (months)",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-2.5 text-muted-foreground font-medium whitespace-nowrap"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => {
                const statusColor =
                  p.status === "Critical"
                    ? "#FF3D00"
                    : p.status === "Delayed"
                      ? "#FF6D00"
                      : p.status === "At Risk"
                        ? "#FFB300"
                        : "#00E676";
                const statusCls =
                  p.status === "Critical"
                    ? "badge-critical"
                    : p.status === "Delayed"
                      ? "badge-high"
                      : p.status === "At Risk"
                        ? "badge-warning"
                        : "badge-success";
                return (
                  <tr
                    key={`${p.name}-${i}`}
                    className="border-b hover:bg-white/[0.03] transition-smooth"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                    data-ocid={`map.state_project_list_modal.item.${i + 1}`}
                  >
                    <td className="px-5 py-3 font-semibold text-foreground max-w-[240px]">
                      <span className="block truncate">{p.name}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          background: "rgba(0,212,255,0.08)",
                          color: "#00D4FF",
                          border: "1px solid rgba(0,212,255,0.15)",
                        }}
                      >
                        {p.sector}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono font-bold text-foreground">
                      {p.value}
                    </td>
                    <td className="px-5 py-3">
                      <span className={statusCls}>{p.status}</span>
                    </td>
                    <td
                      className="px-5 py-3 font-mono"
                      style={{ color: p.delay > 0 ? statusColor : "#00E676" }}
                    >
                      {p.delay > 0 ? `+${p.delay} months` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex items-center justify-between flex-shrink-0"
          style={{ borderColor: "rgba(0,212,255,0.12)" }}
        >
          <p className="text-xs text-muted-foreground">
            Showing {projects.length} of {state.projects} total projects in{" "}
            {state.name}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-sm px-5 py-2"
            data-ocid="map.state_project_list_modal.cancel_button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { useOrg } from "../context/OrgContext";
import { getOrgData } from "../data/orgData";

// ── Types ────────────────────────────────────────────────────────────────────
type RiskLevel = "critical" | "high" | "medium" | "low";
type FilterType = "All" | "Critical Only" | "Roads" | "Metro" | "Highways";
type MapView = "standard" | "satellite";

interface ProjectMarker {
  id: string;
  name: string;
  authority: string;
  value: string;
  status: string;
  risk: RiskLevel;
  delay: number;
  lat: number;
  lng: number;
  type: "roads" | "metro" | "highways";
}

interface StateData {
  id: string;
  name: string;
  projects: number;
  delayed: number;
  riskScore: number;
  risk: RiskLevel;
  value: string;
  capital: string;
  ministry: string;
  criticalAlerts: number;
  lat: number;
  lng: number;
}

// ── Project Markers ──────────────────────────────────────────────────────────
const PROJECT_MARKERS: ProjectMarker[] = [
  {
    id: "p1",
    name: "NH-48 Delhi-Jaipur Expressway",
    authority: "NHAI",
    value: "₹8,420 Cr",
    status: "Under Construction",
    risk: "critical",
    delay: 412,
    lat: 28.7041,
    lng: 77.1025,
    type: "highways",
  },
  {
    id: "p2",
    name: "Mumbai-Pune Expressway Upgrade",
    authority: "MSRDC",
    value: "₹5,200 Cr",
    status: "Delayed",
    risk: "high",
    delay: 287,
    lat: 19.076,
    lng: 72.8777,
    type: "highways",
  },
  {
    id: "p3",
    name: "NH-44 Chennai-Bangalore",
    authority: "NHAI",
    value: "₹3,800 Cr",
    status: "Active",
    risk: "medium",
    delay: 94,
    lat: 13.0827,
    lng: 80.2707,
    type: "roads",
  },
  {
    id: "p4",
    name: "Peripheral Ring Road Phase 2",
    authority: "BBMP / NHAI",
    value: "₹9,100 Cr",
    status: "Delayed",
    risk: "high",
    delay: 321,
    lat: 12.9716,
    lng: 77.5946,
    type: "roads",
  },
  {
    id: "p5",
    name: "ORR Phase 3 Extension",
    authority: "HMDA",
    value: "₹2,740 Cr",
    status: "Active",
    risk: "medium",
    delay: 65,
    lat: 17.385,
    lng: 78.4867,
    type: "roads",
  },
  {
    id: "p6",
    name: "Kolkata Elevated Corridor",
    authority: "KMDA",
    value: "₹4,560 Cr",
    status: "Delayed",
    risk: "high",
    delay: 198,
    lat: 22.5726,
    lng: 88.3639,
    type: "roads",
  },
  {
    id: "p7",
    name: "Ahmedabad-Mumbai Expressway",
    authority: "NHAI",
    value: "₹14,800 Cr",
    status: "Critical Delay",
    risk: "critical",
    delay: 534,
    lat: 23.0225,
    lng: 72.5714,
    type: "highways",
  },
  {
    id: "p8",
    name: "Pune Ring Road",
    authority: "PMRDA",
    value: "₹6,300 Cr",
    status: "Delayed",
    risk: "high",
    delay: 243,
    lat: 18.5204,
    lng: 73.8567,
    type: "roads",
  },
  {
    id: "p9",
    name: "Delhi-Jaipur HAM Project Pkg 4",
    authority: "NHAI",
    value: "₹1,920 Cr",
    status: "On Track",
    risk: "low",
    delay: 12,
    lat: 26.9124,
    lng: 75.7873,
    type: "highways",
  },
  {
    id: "p10",
    name: "Lucknow Metro Phase 2",
    authority: "LMRCL",
    value: "₹3,100 Cr",
    status: "Active",
    risk: "medium",
    delay: 78,
    lat: 26.8467,
    lng: 80.9462,
    type: "metro",
  },
  {
    id: "p11",
    name: "Ganga Expressway",
    authority: "UPEIDA",
    value: "₹7,400 Cr",
    status: "Delayed",
    risk: "high",
    delay: 267,
    lat: 25.5941,
    lng: 85.1376,
    type: "highways",
  },
  {
    id: "p12",
    name: "NHDP Phase VI MP",
    authority: "NHAI / MP PWD",
    value: "₹4,220 Cr",
    status: "Active",
    risk: "medium",
    delay: 55,
    lat: 23.2599,
    lng: 77.4126,
    type: "highways",
  },
  {
    id: "p13",
    name: "Nagpur Metro Phase 2",
    authority: "NMC / NMRCL",
    value: "₹2,600 Cr",
    status: "On Track",
    risk: "low",
    delay: 8,
    lat: 21.1458,
    lng: 79.0882,
    type: "metro",
  },
  {
    id: "p14",
    name: "NH-5 Shimla Bypass",
    authority: "NHAI",
    value: "₹1,480 Cr",
    status: "Active",
    risk: "medium",
    delay: 44,
    lat: 30.7333,
    lng: 76.7794,
    type: "highways",
  },
  {
    id: "p15",
    name: "Z-Morh Tunnel",
    authority: "NHIDCL",
    value: "₹2,519 Cr",
    status: "Critical Delay",
    risk: "critical",
    delay: 720,
    lat: 34.0837,
    lng: 74.7973,
    type: "roads",
  },
  {
    id: "p16",
    name: "NH-17 Assam Corridor",
    authority: "NHAI / BRO",
    value: "₹3,340 Cr",
    status: "Delayed",
    risk: "high",
    delay: 210,
    lat: 26.1445,
    lng: 91.7362,
    type: "highways",
  },
  {
    id: "p17",
    name: "Kochi Metro Extension",
    authority: "KMRL",
    value: "₹1,957 Cr",
    status: "On Track",
    risk: "low",
    delay: 5,
    lat: 9.9312,
    lng: 76.2673,
    type: "metro",
  },
  {
    id: "p18",
    name: "Vizag Metro Phase 1",
    authority: "VGTM UDA",
    value: "₹14,132 Cr",
    status: "Active",
    risk: "medium",
    delay: 110,
    lat: 17.6868,
    lng: 83.2185,
    type: "metro",
  },
  {
    id: "p19",
    name: "Odisha Coast Road",
    authority: "NHAI / ORIDL",
    value: "₹2,890 Cr",
    status: "Active",
    risk: "medium",
    delay: 88,
    lat: 20.2961,
    lng: 85.8245,
    type: "roads",
  },
  {
    id: "p20",
    name: "Indore Metro Rail",
    authority: "MPIDC / IMRCL",
    value: "₹7,500 Cr",
    status: "On Track",
    risk: "low",
    delay: 14,
    lat: 22.7196,
    lng: 75.8577,
    type: "metro",
  },
];

// ── State Data ───────────────────────────────────────────────────────────────
const STATE_DATA: StateData[] = [
  {
    id: "wb",
    name: "West Bengal",
    projects: 67,
    delayed: 23,
    riskScore: 87,
    risk: "critical",
    value: "₹12,400 Cr",
    capital: "Kolkata",
    ministry: "MoRTH / PWD",
    criticalAlerts: 8,
    lat: 22.9868,
    lng: 87.855,
  },
  {
    id: "br",
    name: "Bihar",
    projects: 45,
    delayed: 19,
    riskScore: 81,
    risk: "critical",
    value: "₹8,700 Cr",
    capital: "Patna",
    ministry: "MoRTH / RCD",
    criticalAlerts: 6,
    lat: 25.0961,
    lng: 85.3131,
  },
  {
    id: "od",
    name: "Odisha",
    projects: 34,
    delayed: 14,
    riskScore: 79,
    risk: "critical",
    value: "₹7,200 Cr",
    capital: "Bhubaneswar",
    ministry: "MoRTH / NHAI",
    criticalAlerts: 5,
    lat: 20.9517,
    lng: 85.0985,
  },
  {
    id: "up",
    name: "Uttar Pradesh",
    projects: 89,
    delayed: 27,
    riskScore: 73,
    risk: "high",
    value: "₹18,400 Cr",
    capital: "Lucknow",
    ministry: "MoRTH / NHDP",
    criticalAlerts: 11,
    lat: 26.8467,
    lng: 80.9462,
  },
  {
    id: "mp",
    name: "Madhya Pradesh",
    projects: 58,
    delayed: 18,
    riskScore: 71,
    risk: "high",
    value: "₹9,800 Cr",
    capital: "Bhopal",
    ministry: "MoRTH / PWD",
    criticalAlerts: 7,
    lat: 22.9734,
    lng: 78.6569,
  },
  {
    id: "rj",
    name: "Rajasthan",
    projects: 76,
    delayed: 22,
    riskScore: 69,
    risk: "high",
    value: "₹11,200 Cr",
    capital: "Jaipur",
    ministry: "NHAI / MoRTH",
    criticalAlerts: 9,
    lat: 27.0238,
    lng: 74.2179,
  },
  {
    id: "ka",
    name: "Karnataka",
    projects: 128,
    delayed: 31,
    riskScore: 61,
    risk: "medium",
    value: "₹9,840 Cr",
    capital: "Bengaluru",
    ministry: "MoUD / NHAI",
    criticalAlerts: 4,
    lat: 15.3173,
    lng: 75.7139,
  },
  {
    id: "ap",
    name: "Andhra Pradesh",
    projects: 84,
    delayed: 19,
    riskScore: 58,
    risk: "medium",
    value: "₹8,100 Cr",
    capital: "Amaravati",
    ministry: "MoRTH / NHAI",
    criticalAlerts: 3,
    lat: 15.9129,
    lng: 79.74,
  },
  {
    id: "jh",
    name: "Jharkhand",
    projects: 31,
    delayed: 9,
    riskScore: 55,
    risk: "medium",
    value: "₹4,200 Cr",
    capital: "Ranchi",
    ministry: "MoRTH / RCD",
    criticalAlerts: 2,
    lat: 23.6102,
    lng: 85.2799,
  },
  {
    id: "mh",
    name: "Maharashtra",
    projects: 124,
    delayed: 31,
    riskScore: 47,
    risk: "low",
    value: "₹24,100 Cr",
    capital: "Mumbai",
    ministry: "MSRDC / NHAI",
    criticalAlerts: 3,
    lat: 19.7515,
    lng: 75.7139,
  },
  {
    id: "gj",
    name: "Gujarat",
    projects: 97,
    delayed: 14,
    riskScore: 38,
    risk: "low",
    value: "₹15,600 Cr",
    capital: "Gandhinagar",
    ministry: "MoRTH / GSRDC",
    criticalAlerts: 2,
    lat: 22.2587,
    lng: 71.1924,
  },
  {
    id: "tn",
    name: "Tamil Nadu",
    projects: 118,
    delayed: 22,
    riskScore: 42,
    risk: "low",
    value: "₹8,720 Cr",
    capital: "Chennai",
    ministry: "NHAI / TNRDC",
    criticalAlerts: 2,
    lat: 11.1271,
    lng: 78.6569,
  },
  {
    id: "dl",
    name: "Delhi",
    projects: 48,
    delayed: 8,
    riskScore: 35,
    risk: "low",
    value: "₹7,400 Cr",
    capital: "New Delhi",
    ministry: "DMRC / MoUD",
    criticalAlerts: 1,
    lat: 28.7041,
    lng: 77.1025,
  },
  {
    id: "ts",
    name: "Telangana",
    projects: 97,
    delayed: 18,
    riskScore: 44,
    risk: "low",
    value: "₹7,400 Cr",
    capital: "Hyderabad",
    ministry: "MoRTH / TSRDC",
    criticalAlerts: 3,
    lat: 17.385,
    lng: 78.4867,
  },
  {
    id: "pb",
    name: "Punjab",
    projects: 42,
    delayed: 11,
    riskScore: 52,
    risk: "medium",
    value: "₹5,900 Cr",
    capital: "Chandigarh",
    ministry: "MoRTH / PRBDB",
    criticalAlerts: 4,
    lat: 31.1471,
    lng: 75.3412,
  },
  {
    id: "hr",
    name: "Haryana",
    projects: 53,
    delayed: 14,
    riskScore: 54,
    risk: "medium",
    value: "₹6,800 Cr",
    capital: "Chandigarh",
    ministry: "NHAI / PWD",
    criticalAlerts: 4,
    lat: 29.0588,
    lng: 76.0856,
  },
];

// ── Constants ────────────────────────────────────────────────────────────────
const RISK_COLORS: Record<RiskLevel, string> = {
  critical: "#FF3D00",
  high: "#FF6D00",
  medium: "#FFB300",
  low: "#00E676",
};

const RISK_BADGE: Record<RiskLevel, string> = {
  critical: "badge-critical",
  high: "badge-high",
  medium: "badge-warning",
  low: "badge-success",
};

const FILTER_TYPES: FilterType[] = [
  "All",
  "Critical Only",
  "Roads",
  "Metro",
  "Highways",
];

const OSM_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ESRI_TILES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTRIBUTION =
  "Tiles &copy; Esri — Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community";

// ── Popup style ──────────────────────────────────────────────────────────────
const POPUP_STYLE: React.CSSProperties = {
  background: "#0d1117",
  color: "#fff",
  padding: "12px 14px",
  borderRadius: "10px",
  minWidth: "200px",
  border: "1px solid rgba(0,212,255,0.25)",
  fontSize: "12px",
  fontFamily: "DM Sans, sans-serif",
};

// ── Component ────────────────────────────────────────────────────────────────
export default function MapPage() {
  const { selectedOrg } = useOrg();
  void getOrgData(selectedOrg.key);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [stateSearch, setStateSearch] = useState("");
  const [mapView, setMapView] = useState<MapView>("standard");
  const [showProjectList, setShowProjectList] = useState(false);

  const filteredStates = STATE_DATA.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase()),
  );

  const filteredProjects = PROJECT_MARKERS.filter((p) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Critical Only") return p.risk === "critical";
    if (activeFilter === "Roads") return p.type === "roads";
    if (activeFilter === "Metro") return p.type === "metro";
    if (activeFilter === "Highways") return p.type === "highways";
    return true;
  });

  const tileUrl = mapView === "satellite" ? ESRI_TILES : OSM_TILES;
  const tileAttr = mapView === "satellite" ? ESRI_ATTRIBUTION : OSM_ATTRIBUTION;

  return (
    <div className="p-6 space-y-5" data-ocid="map.page">
      {showProjectList && selectedState && (
        <StateProjectListModal
          state={selectedState}
          onClose={() => setShowProjectList(false)}
        />
      )}
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-label"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                color: "#00D4FF",
              }}
            >
              INDIA PROJECT INTELLIGENCE
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            National Infrastructure Map
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Project concentration · Delay clusters · High-risk states · Approval
            bottlenecks
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center glass-card rounded-lg p-1 gap-1">
            <button
              type="button"
              onClick={() => setMapView("standard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-smooth ${mapView === "standard" ? "bg-primary/15 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"}`}
              data-ocid="map.view.standard_toggle"
            >
              <MapIcon size={13} />
              Standard View
            </button>
            <button
              type="button"
              onClick={() => setMapView("satellite")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-smooth ${mapView === "satellite" ? "bg-primary/15 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"}`}
              data-ocid="map.view.satellite_toggle"
            >
              <Satellite size={13} />
              Satellite View
            </button>
          </div>
          <button
            type="button"
            className="btn-primary text-sm"
            data-ocid="map.export_button"
            onClick={() => {
              const now = new Date().toISOString().split("T")[0];
              const content = STATE_DATA.map(
                (s) =>
                  `${s.name},${s.projects},${s.delayed},${s.riskScore},${s.value},${s.criticalAlerts},${s.risk.toUpperCase()}`,
              ).join("\n");
              const header =
                "State,Projects,Delayed,Risk Score,Pipeline Value,Critical Alerts,Risk Level\n";
              const blob = new Blob([header + content], {
                type: "text/csv;charset=utf-8;",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `InfraOS-State-Risk-Report-${now}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Export State Report
          </button>
        </div>
      </div>

      {/* Stats band */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Projects", value: "1,847", color: "#00D4FF" },
          { label: "Critical Alerts", value: "203", color: "#FF3D00" },
          { label: "Delayed", value: "791", color: "#FF6D00" },
          { label: "On Track", value: "1,044", color: "#00E676" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="glass-card p-4"
            data-ocid={`map.stat.${i + 1}`}
          >
            <div
              className="font-mono font-bold text-2xl"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-label mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Map Controls */}
      <div
        className="glass-card p-3 flex flex-wrap items-center gap-3"
        data-ocid="map.controls"
      >
        <div className="flex items-center gap-1.5">
          <Filter size={12} className="text-muted-foreground" />
          <span className="text-label text-[10px]">FILTER</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {FILTER_TYPES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              data-ocid={`map.filter.${f.toLowerCase().replace(/ /g, "_")}`}
              className="text-[10px] px-2.5 py-1 rounded transition-smooth font-medium"
              style={{
                background:
                  activeFilter === f
                    ? "rgba(0,212,255,0.15)"
                    : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeFilter === f ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: activeFilter === f ? "#00D4FF" : "rgba(176,190,197,0.7)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        {/* Risk Legend inline */}
        <div className="flex items-center gap-3 ml-2 flex-wrap">
          {(["critical", "high", "medium", "low"] as RiskLevel[]).map((r) => (
            <div key={r} className="flex items-center gap-1">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  background: RISK_COLORS[r],
                  boxShadow: `0 0 4px ${RISK_COLORS[r]}80`,
                }}
              />
              <span className="text-[9px] capitalize text-muted-foreground">
                {r}
              </span>
            </div>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded glass-card">
          <Search size={12} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
            placeholder="Search state..."
            className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-28"
            data-ocid="map.search_input"
          />
        </div>
      </div>

      {/* Main Map + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Area */}
        <div
          className="glass-card relative overflow-hidden lg:col-span-2"
          style={{ minHeight: 600 }}
          data-ocid="map.canvas"
        >
          {/* View badge overlay */}
          <div className="absolute top-3 left-14 z-[1000] pointer-events-none">
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold"
              style={{
                background:
                  mapView === "satellite"
                    ? "rgba(255,109,0,0.18)"
                    : "rgba(0,212,255,0.1)",
                color: mapView === "satellite" ? "#FF6D00" : "#00D4FF",
                border: `1px solid ${mapView === "satellite" ? "rgba(255,109,0,0.35)" : "rgba(0,212,255,0.2)"}`,
              }}
            >
              {mapView === "satellite" ? (
                <Satellite size={10} />
              ) : (
                <Layers size={10} />
              )}
              {mapView === "satellite" ? "SATELLITE VIEW" : "STANDARD VIEW"}
            </div>
          </div>

          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ width: "100%", height: "600px", background: "#0a0c0f" }}
            zoomControl={false}
            attributionControl={true}
          >
            <ZoomControl position="bottomright" />
            <TileLayer url={tileUrl} attribution={tileAttr} maxZoom={18} />

            {/* Project Markers */}
            {filteredProjects.map((p) => (
              <CircleMarker
                key={p.id}
                center={[p.lat, p.lng]}
                radius={p.risk === "critical" ? 12 : p.risk === "high" ? 10 : 8}
                pathOptions={{
                  fillColor: RISK_COLORS[p.risk],
                  fillOpacity: 0.85,
                  color: "#0a0c0f",
                  weight: 1.5,
                }}
              >
                <Popup>
                  <div style={POPUP_STYLE}>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#00D4FF",
                        marginBottom: 6,
                        fontSize: 13,
                      }}
                    >
                      {p.name}
                    </p>
                    <p style={{ color: "#aaa", fontSize: 10, marginBottom: 8 }}>
                      {p.authority}
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 6,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: "#666",
                            fontSize: 9,
                            marginBottom: 2,
                          }}
                        >
                          VALUE
                        </div>
                        <div style={{ color: "#00E676", fontWeight: 700 }}>
                          {p.value}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: "#666",
                            fontSize: 9,
                            marginBottom: 2,
                          }}
                        >
                          STATUS
                        </div>
                        <div style={{ color: "#fff", fontWeight: 600 }}>
                          {p.status}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: "#666",
                            fontSize: 9,
                            marginBottom: 2,
                          }}
                        >
                          RISK LEVEL
                        </div>
                        <div
                          style={{
                            color: RISK_COLORS[p.risk],
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          {p.risk}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: "#666",
                            fontSize: 9,
                            marginBottom: 2,
                          }}
                        >
                          DELAY
                        </div>
                        <div
                          style={{
                            color: p.delay > 100 ? "#FF3D00" : "#FFB300",
                            fontWeight: 700,
                          }}
                        >
                          {p.delay} days
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* State Detail / List */}
        <div className="space-y-3">
          {selectedState ? (
            <div
              className="glass-card overflow-hidden"
              data-ocid="map.state_detail"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {selectedState.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {selectedState.capital} · {selectedState.ministry}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedState(null)}
                  className="w-6 h-6 flex items-center justify-center rounded transition-smooth hover:bg-white/10"
                  data-ocid="map.state_detail.close_button"
                >
                  <X size={12} className="text-muted-foreground" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={RISK_BADGE[selectedState.risk]}>
                    {selectedState.risk.toUpperCase()} RISK
                  </span>
                  <span
                    className="font-mono font-bold text-lg"
                    style={{ color: RISK_COLORS[selectedState.risk] }}
                  >
                    {selectedState.riskScore}/100
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Active Projects",
                      value: selectedState.projects,
                      color: "#00D4FF",
                    },
                    {
                      label: "Delayed",
                      value: selectedState.delayed,
                      color: "#FF3D00",
                    },
                    {
                      label: "Pipeline Value",
                      value: selectedState.value,
                      color: "#00E676",
                    },
                    {
                      label: "Critical Alerts",
                      value: selectedState.criticalAlerts,
                      color: "#FFB300",
                    },
                  ].map((item) => (
                    <div key={item.label} className="glass-card p-2.5 rounded">
                      <div
                        className="font-mono font-bold text-base"
                        style={{ color: item.color }}
                      >
                        {item.value}
                      </div>
                      <div
                        className="text-label"
                        style={{ fontSize: "0.58rem" }}
                      >
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-label text-[10px] mb-1.5">DELAY RATE</p>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((selectedState.delayed / selectedState.projects) * 100)}%`,
                        background: RISK_COLORS[selectedState.risk],
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {Math.round(
                      (selectedState.delayed / selectedState.projects) * 100,
                    )}
                    % projects delayed
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary text-xs py-2 w-full"
                  data-ocid="map.state_detail.primary_button"
                  onClick={() => setShowProjectList(true)}
                >
                  View State Project List
                </button>
              </div>
            </div>
          ) : (
            <div
              className="glass-card overflow-hidden"
              data-ocid="map.state_list"
            >
              <div className="px-4 py-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <BarChart3 size={13} className="text-primary" />
                  <h3 className="text-xs font-semibold text-foreground">
                    State Risk Ranking
                  </h3>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Click a row to view details
                </p>
              </div>
              <div className="divide-y divide-border/10 max-h-[560px] overflow-y-auto">
                {filteredStates
                  .sort((a, b) => b.riskScore - a.riskScore)
                  .map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedState(s)}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.03] transition-smooth"
                      data-ocid={`map.state.item.${i + 1}`}
                    >
                      <span className="text-[10px] font-mono text-muted-foreground w-4 flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">
                          {s.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {s.projects} projects · {s.delayed} delayed
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: RISK_COLORS[s.risk] }}
                        />
                        <span
                          className="font-mono font-bold text-sm"
                          style={{ color: RISK_COLORS[s.risk] }}
                        >
                          {s.riskScore}
                        </span>
                        <ChevronRight
                          size={11}
                          className="text-muted-foreground"
                        />
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* State Summary Table */}
      <div className="glass-card overflow-hidden" data-ocid="map.state_table">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <div className="flex items-center gap-2">
            <BarChart3 size={14} className="text-primary" />
            <h2 className="font-semibold text-sm text-foreground">
              Top States by Project Count — State Intelligence Overview
            </h2>
          </div>
          <button
            type="button"
            className="text-xs text-primary"
            data-ocid="map.view_all_button"
            onClick={() => {
              const now = new Date().toISOString().split("T")[0];
              const content = STATE_DATA.map(
                (s) =>
                  `${s.name},${s.capital},${s.projects},${s.delayed},${s.value},${s.criticalAlerts},${s.riskScore},${s.risk.toUpperCase()}`,
              ).join("\n");
              const header =
                "State,Capital,Active Projects,Delayed,Pipeline Value,Critical Alerts,Risk Score,Risk Level\n";
              const blob = new Blob([header + content], {
                type: "text/csv;charset=utf-8;",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `InfraOS-State-Data-${now}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Export Data →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/20">
                {[
                  "State",
                  "Capital",
                  "Active Projects",
                  "Delayed",
                  "Pipeline Value (₹ Cr)",
                  "Critical Alerts",
                  "Risk Score",
                  "Risk Level",
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
              {filteredStates
                .sort((a, b) => b.projects - a.projects)
                .map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b border-border/10 hover:bg-white/[0.03] transition-smooth cursor-pointer"
                    onClick={() => setSelectedState(s)}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedState(s)}
                    tabIndex={0}
                    data-ocid={`map.state_table.item.${i + 1}`}
                  >
                    <td className="px-4 py-2.5 font-semibold text-foreground">
                      {s.name}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {s.capital}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-primary">
                      {s.projects}
                    </td>
                    <td
                      className="px-4 py-2.5 font-mono"
                      style={{ color: "#FF3D00" }}
                    >
                      {s.delayed}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-foreground">
                      {s.value}
                    </td>
                    <td
                      className="px-4 py-2.5 font-mono"
                      style={{
                        color: s.criticalAlerts > 5 ? "#FF3D00" : "#FFB300",
                      }}
                    >
                      {s.criticalAlerts}
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
                              width: `${s.riskScore}%`,
                              background: RISK_COLORS[s.risk],
                            }}
                          />
                        </div>
                        <span
                          className="font-mono font-bold"
                          style={{ color: RISK_COLORS[s.risk] }}
                        >
                          {s.riskScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={RISK_BADGE[s.risk]}>
                        {s.risk.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Activity,
            label: "Most Active State",
            value: "Uttar Pradesh",
            sub: "89 active projects",
            color: "#00D4FF",
          },
          {
            icon: AlertTriangle,
            label: "Highest Risk State",
            value: "West Bengal",
            sub: "Risk Score 87/100",
            color: "#FF3D00",
          },
          {
            icon: MapPin,
            label: "Total Coverage",
            value: "28 States",
            sub: "8 Union Territories",
            color: "#00E676",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="glass-card flex items-center gap-4 p-4"
              data-ocid={`map.summary.${s.label.toLowerCase().replace(/ /g, "_")}`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  color: s.color,
                  background: `${s.color}12`,
                  border: `1px solid ${s.color}20`,
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <p className="text-label">{s.label}</p>
                <p className="font-bold text-base text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
