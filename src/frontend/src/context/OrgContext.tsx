import { type ReactNode, createContext, useContext, useState } from "react";

export type OrgKey = "MoRTH" | "NHAI" | "SmartCities" | "MoRTH_PMU" | "NHIDCL";

export interface OrgMeta {
  key: OrgKey;
  label: string;
  shortLabel: string;
  badge: string;
  tagline: string;
}

export const ORGS: OrgMeta[] = [
  {
    key: "MoRTH",
    label: "Ministry of Road Transport & Highways",
    shortLabel: "Ministry of Road Transport",
    badge: "NATIONAL",
    tagline: "National Highway Development & Policy",
  },
  {
    key: "NHAI",
    label: "NHAI",
    shortLabel: "NHAI",
    badge: "AUTHORITY",
    tagline: "Highway Execution & Concessions",
  },
  {
    key: "SmartCities",
    label: "Smart Cities Mission",
    shortLabel: "Smart Cities Mission",
    badge: "URBAN",
    tagline: "Urban Infrastructure Intelligence",
  },
  {
    key: "MoRTH_PMU",
    label: "MoRTH PMU",
    shortLabel: "MoRTH PMU",
    badge: "MONITORING",
    tagline: "Project Management & Compliance",
  },
  {
    key: "NHIDCL",
    label: "NHIDCL",
    shortLabel: "NHIDCL",
    badge: "STRATEGIC",
    tagline: "NE Corridor & Border Connectivity",
  },
];

interface OrgContextValue {
  selectedOrg: OrgMeta;
  setSelectedOrg: (org: OrgMeta) => void;
}

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [selectedOrg, setSelectedOrg] = useState<OrgMeta>(ORGS[0]);
  return (
    <OrgContext.Provider value={{ selectedOrg, setSelectedOrg }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg(): OrgContextValue {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}
