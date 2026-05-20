import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileBarChart,
  GitBranch,
  HardHat,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  TrendingDown,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { ORGS, useOrg } from "../context/OrgContext";
import { AICopilot } from "./AICopilot";

const NAV = [
  {
    section: "COMMAND CENTER",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/app/dashboard",
      },
    ],
  },
  {
    section: "INTELLIGENCE MODULES",
    items: [
      {
        id: "procurement",
        label: "Procurement",
        icon: ShoppingCart,
        path: "/app/procurement",
      },
      {
        id: "execution",
        label: "Execution Intelligence",
        icon: Zap,
        path: "/app/execution",
      },
      {
        id: "commercial",
        label: "Commercial Risk",
        icon: TrendingDown,
        path: "/app/commercial",
      },
      {
        id: "governance",
        label: "Governance",
        icon: Shield,
        path: "/app/governance",
      },
      {
        id: "assets",
        label: "Asset Intelligence",
        icon: HardHat,
        path: "/app/assets",
      },
    ],
  },
  {
    section: "ANALYTICS",
    items: [
      {
        id: "lifecycle",
        label: "Project Lifecycle",
        icon: GitBranch,
        path: "/app/lifecycle",
      },
      { id: "map", label: "National Map", icon: MapPin, path: "/app/map" },
      {
        id: "vendors",
        label: "Vendor Intelligence",
        icon: Users,
        path: "/app/vendors",
      },
      {
        id: "risk-hub",
        label: "Risk Hub",
        icon: Shield,
        path: "/app/risk-hub",
      },
      {
        id: "audit-trail",
        label: "Audit Trail",
        icon: ClipboardList,
        path: "/app/audit-trail",
      },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      {
        id: "reports",
        label: "Reports",
        icon: FileBarChart,
        path: "/app/reports",
      },
      {
        id: "analysis",
        label: "Analysis",
        icon: BarChart3,
        path: "/app/analysis",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        path: "/app/settings",
      },
    ],
  },
];

const NOTIFICATIONS = [
  {
    id: 1,
    type: "CRITICAL",
    title: "NH-44 Tender Fraud Alert",
    desc: "L1 bid 34% below estimate — statistical fraud 94% probability",
    time: "3 min ago",
    read: false,
  },
  {
    id: 2,
    type: "HIGH",
    title: "RRTS NOC SLA Breach",
    desc: "Railway NOC pending 234 days on critical path",
    time: "18 min ago",
    read: false,
  },
  {
    id: 3,
    type: "HIGH",
    title: "Bangalore Metro Claims",
    desc: "EOT claim ₹456Cr — 91% merit score detected",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 4,
    type: "AI",
    title: "West Bengal Bid-Rigging",
    desc: "3 tenders show coordinated bidding pattern",
    time: "4 hrs ago",
    read: false,
  },
  {
    id: 5,
    type: "RISK",
    title: "Mahanadi Bridge Failure",
    desc: "78% failure probability in 18 months",
    time: "8 hrs ago",
    read: true,
  },
  {
    id: 6,
    type: "INFO",
    title: "Maharashtra Cost Benchmark",
    desc: "23% better cost control vs national average",
    time: "1 day ago",
    read: true,
  },
  {
    id: 7,
    type: "INFO",
    title: "Q1 Report Ready",
    desc: "Infrastructure risk summary report generated",
    time: "2 days ago",
    read: true,
  },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orgOpen, setOrgOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const { selectedOrg, setSelectedOrg } = useOrg();
  const [orgTransition, setOrgTransition] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentItem = NAV.flatMap((s) => s.items).find(
    (i) => i.path === currentPath,
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleOrgChange(org: (typeof ORGS)[0]) {
    setSelectedOrg(org);
    setOrgOpen(false);
    setOrgTransition(true);
    setTimeout(() => setOrgTransition(false), 600);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleLogout() {
    navigate({ to: "/" });
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0A0C0F" }}
    >
      {/* ── Sidebar ── */}
      <aside
        data-ocid="sidebar"
        className={`flex-shrink-0 flex flex-col transition-all duration-300 z-20 border-r border-border/50 ${sidebarOpen ? "w-60" : "w-14"}`}
        style={{ background: "#080B0F" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 py-4 border-b border-border/40 flex-shrink-0">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-primary/15 border border-primary/30 flex-shrink-0">
            <Building2 size={16} className="text-primary" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-base tracking-tight text-foreground">
              Infra<span className="text-primary">OS</span>
            </span>
          )}
        </div>

        {/* Org switcher */}
        {sidebarOpen && (
          <div className="px-3 py-2.5 border-b border-border/30 relative">
            <button
              type="button"
              data-ocid="org.switcher"
              onClick={() => setOrgOpen((v) => !v)}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded glass-card text-xs transition-smooth hover:border-primary/30"
            >
              <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
                <span
                  className="truncate text-muted-foreground max-w-[130px] leading-tight text-[10px] font-semibold tracking-wide"
                  style={{ color: "#00D4FF" }}
                >
                  {selectedOrg.badge}
                </span>
                <span className="truncate text-foreground max-w-[150px] leading-tight font-medium text-[11px]">
                  {selectedOrg.shortLabel}
                </span>
              </div>
              <ChevronDown
                size={11}
                className={`flex-shrink-0 text-muted-foreground transition-transform ml-1 ${orgOpen ? "rotate-180" : ""}`}
              />
            </button>
            {orgOpen && (
              <div className="absolute left-3 right-3 top-full mt-1 z-50 rounded glass-elevated border border-border shadow-panel">
                {ORGS.map((org) => (
                  <button
                    key={org.key}
                    type="button"
                    className="w-full text-left px-3 py-2.5 text-xs transition-smooth hover:bg-primary/10 hover:text-primary first:rounded-t last:rounded-b flex items-center justify-between gap-2"
                    onClick={() => handleOrgChange(org)}
                    data-ocid="org.option"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">
                        {org.shortLabel}
                      </div>
                      <div
                        className="text-muted-foreground truncate"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {org.tagline}
                      </div>
                    </div>
                    {selectedOrg.key === org.key && (
                      <Check size={11} className="text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Nav items */}
        <nav
          className="flex-1 overflow-y-auto py-2 px-2"
          data-ocid="sidebar.nav"
        >
          {NAV.map((section) => (
            <div key={section.section} className="mb-3">
              {sidebarOpen && (
                <p className="sidebar-section-label">{section.section}</p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = currentPath === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    data-ocid={`nav.${item.id}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-smooth mb-0.5 border-l-2 ${active ? "nav-active text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5 border-transparent"}`}
                  >
                    <Icon size={15} className="flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-border/40 p-3 flex-shrink-0">
          <div
            className={`flex items-center gap-3 ${sidebarOpen ? "" : "justify-center"}`}
          >
            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-xs font-bold">NM</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  Naman Maheshwari
                </p>
                <p
                  className="text-label truncate"
                  style={{ fontSize: "0.6rem" }}
                >
                  Platform Admin
                </p>
              </div>
            )}
            {sidebarOpen && (
              <button
                type="button"
                onClick={handleLogout}
                className="btn-ghost p-1.5 flex-shrink-0"
                aria-label="Logout"
                data-ocid="sidebar.logout_button"
              >
                <LogOut size={13} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Nav */}
        <header
          data-ocid="topnav"
          className="flex items-center gap-3 px-4 h-14 flex-shrink-0 border-b border-border/40 z-10"
          style={{
            background: "rgba(8,11,15,0.95)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button
            type="button"
            data-ocid="topnav.sidebar_toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            className="btn-ghost p-2 flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu size={17} />
          </button>

          <div className="flex items-center gap-1.5 text-xs hidden sm:flex">
            <span className="text-primary font-semibold tracking-wider text-[10px] uppercase">
              InfraOS
            </span>
            <ChevronRight size={10} className="text-muted-foreground" />
            <span className="text-foreground font-medium">
              {currentItem?.label ?? "Dashboard"}
            </span>
          </div>

          <div className="flex-1 max-w-xs mx-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded glass-card">
              <Search
                size={13}
                className="text-muted-foreground flex-shrink-0"
              />
              <input
                type="text"
                placeholder="Search projects, tenders, vendors..."
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                data-ocid="topnav.search_input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold"
              style={{
                background: "rgba(0,230,118,0.1)",
                color: "#00E676",
                border: "1px solid rgba(0,230,118,0.2)",
              }}
            >
              <Activity size={10} />
              LIVE
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                data-ocid="topnav.notifications"
                className="relative btn-ghost p-2"
                aria-label="Notifications"
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setUserMenuOpen(false);
                }}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                    style={{ background: "#FF3D00", fontSize: "0.6rem" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 glass-elevated border border-border/40 rounded-lg shadow-panel z-50"
                  data-ocid="topnav.notifications.dropdown"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                    <span className="text-sm font-bold text-foreground">
                      Notifications
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-xs text-primary hover:text-primary/80 transition-smooth"
                        data-ocid="topnav.notifications.mark_all_read"
                      >
                        Mark all read
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifOpen(false)}
                        className="btn-ghost p-1"
                        data-ocid="topnav.notifications.close_button"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-border/20">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 transition-smooth hover:bg-white/3 ${n.read ? "opacity-60" : ""}`}
                        data-ocid={`topnav.notification.${n.id}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                            style={{
                              background:
                                n.type === "CRITICAL"
                                  ? "#FF3D00"
                                  : n.type === "HIGH"
                                    ? "#FF6D00"
                                    : n.type === "AI"
                                      ? "#C084FC"
                                      : "#00D4FF",
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">
                              {n.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
                              {n.desc}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {n.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                data-ocid="topnav.user_menu"
                className="flex items-center gap-1.5 btn-ghost px-2 py-1.5"
                onClick={() => {
                  setUserMenuOpen((v) => !v);
                  setNotifOpen(false);
                }}
              >
                <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary text-[10px] font-bold">NM</span>
                </div>
                <ChevronDown
                  size={11}
                  className="text-muted-foreground hidden sm:block"
                />
              </button>
              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 glass-elevated border border-border/40 rounded-lg shadow-panel z-50"
                  data-ocid="topnav.user_menu.dropdown"
                >
                  <div className="px-4 py-3 border-b border-border/30">
                    <p className="text-sm font-bold text-foreground">
                      Naman Maheshwari
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Platform Admin
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      admin@infraos.gov.in
                    </p>
                  </div>
                  <div className="p-1.5">
                    <button
                      type="button"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-smooth"
                      onClick={() => {
                        navigate({ to: "/app/settings" });
                        setUserMenuOpen(false);
                      }}
                      data-ocid="topnav.user_menu.profile_settings"
                    >
                      <User size={14} />
                      Profile Settings
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-smooth"
                      onClick={() => {
                        navigate({ to: "/app/settings" });
                        setUserMenuOpen(false);
                      }}
                      data-ocid="topnav.user_menu.settings"
                    >
                      <Settings size={14} />
                      Settings
                    </button>
                    <div className="border-t border-border/30 mt-1 pt-1">
                      <button
                        type="button"
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-red-400 hover:bg-red-500/10 transition-smooth"
                        onClick={handleLogout}
                        data-ocid="topnav.user_menu.logout_button"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content + Copilot */}
        <div
          className="flex flex-1 min-h-0 overflow-hidden"
          onClick={() => {
            if (notifOpen) setNotifOpen(false);
            if (userMenuOpen) setUserMenuOpen(false);
          }}
          onKeyDown={() => {
            if (notifOpen) setNotifOpen(false);
            if (userMenuOpen) setUserMenuOpen(false);
          }}
        >
          <main
            data-ocid="main.content"
            className="flex-1 overflow-y-auto grid-overlay"
            style={{
              background: "#0A0C0F",
              opacity: orgTransition ? 0.3 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            <Outlet />
          </main>
        </div>
        <AICopilot />
      </div>
    </div>
  );
}
