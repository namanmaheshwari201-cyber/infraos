import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import AppLayout from "./components/Layout";
import { OrgProvider } from "./context/OrgContext";
import AnalysisPage from "./pages/AnalysisPage";
import AssetsPage from "./pages/AssetsPage";
import AuditTrailPage from "./pages/AuditTrailPage";
import CommercialPage from "./pages/CommercialPage";
import DashboardPage from "./pages/DashboardPage";
import ExecutionPage from "./pages/ExecutionPage";
import GovernancePage from "./pages/GovernancePage";
import LandingPage from "./pages/LandingPage";
import LifecyclePage from "./pages/LifecyclePage";
import MapPage from "./pages/MapPage";
import ProcurementPage from "./pages/ProcurementPage";
import ReportsPage from "./pages/ReportsPage";
import RiskHubPage from "./pages/RiskHubPage";
import SettingsPage from "./pages/SettingsPage";
import VendorsPage from "./pages/VendorsPage";

const ROUTE_TITLES: Record<string, string> = {
  "/": "InfraOS — AI Operating System for Infrastructure",
  "/app/dashboard": "Dashboard | InfraOS",
  "/app/procurement": "Procurement Intelligence | InfraOS",
  "/app/execution": "Execution Intelligence | InfraOS",
  "/app/commercial": "Commercial Risk | InfraOS",
  "/app/governance": "Governance Intelligence | InfraOS",
  "/app/assets": "Asset Intelligence | InfraOS",
  "/app/lifecycle": "Project Lifecycle | InfraOS",
  "/app/map": "National Map | InfraOS",
  "/app/vendors": "Vendor Intelligence | InfraOS",
  "/app/reports": "Reports | InfraOS",
  "/app/analysis": "Analysis | InfraOS",
  "/app/settings": "Settings | InfraOS",
  "/app/audit-trail": "Audit Trail | InfraOS",
  "/app/risk-hub": "Risk Hub | InfraOS",
};

function TitleUpdater() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    document.title =
      ROUTE_TITLES[pathname] ??
      "InfraOS — AI Operating System for Infrastructure";
  }, [pathname]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

function RootComponent() {
  return (
    <>
      <TitleUpdater />
      <Outlet />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const appRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: AppLayout,
});

const appIndexRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/app/dashboard" });
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/dashboard",
  component: DashboardPage,
});
const procurementRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/procurement",
  component: ProcurementPage,
});
const executionRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/execution",
  component: ExecutionPage,
});
const commercialRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/commercial",
  component: CommercialPage,
});
const governanceRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/governance",
  component: GovernancePage,
});
const assetsRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/assets",
  component: AssetsPage,
});
const lifecycleRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/lifecycle",
  component: LifecyclePage,
});
const mapRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/map",
  component: MapPage,
});
const vendorsRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/vendors",
  component: VendorsPage,
});
const reportsRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/reports",
  component: ReportsPage,
});
const analysisRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/analysis",
  component: AnalysisPage,
});
const settingsRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/settings",
  component: SettingsPage,
});
const auditTrailRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/audit-trail",
  component: AuditTrailPage,
});
const riskHubRoute = createRoute({
  getParentRoute: () => appRootRoute,
  path: "/risk-hub",
  component: RiskHubPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  appRootRoute.addChildren([
    appIndexRoute,
    dashboardRoute,
    procurementRoute,
    executionRoute,
    commercialRoute,
    governanceRoute,
    assetsRoute,
    lifecycleRoute,
    mapRoute,
    vendorsRoute,
    reportsRoute,
    analysisRoute,
    settingsRoute,
    auditTrailRoute,
    riskHubRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrgProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(13,17,23,0.97)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "#ffffff",
              fontSize: "0.8rem",
            },
          }}
        />
      </OrgProvider>
    </QueryClientProvider>
  );
}
