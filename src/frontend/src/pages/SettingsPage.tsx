import { useActor } from "@caffeineai/core-infrastructure";
import {
  Bell,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Copy,
  Database,
  Eye,
  EyeOff,
  Globe,
  Key,
  Lock,
  Mail,
  Monitor,
  Pencil,
  Plus,
  RefreshCw,
  Shield,
  Smartphone,
  Trash2,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";

// ── Types ─────────────────────────────────────────────────────────────────────
type SettingsTab =
  | "org"
  | "users"
  | "notifications"
  | "datasources"
  | "security"
  | "api";

interface AppUser {
  name: string;
  role: string;
  email: string;
  status: "Active" | "Inactive";
  access: string;
  initials: string;
}

interface NotifPref {
  label: string;
  delivery: string;
  enabled: boolean;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const USERS: AppUser[] = [
  {
    name: "Naman Maheshwari",
    role: "Platform Admin",
    email: "admin@infraos.gov.in",
    status: "Active",
    access: "Full Access",
    initials: "NM",
  },
  {
    name: "Priya Sharma",
    role: "Joint Secretary",
    email: "priya.sharma@morthindia.gov.in",
    status: "Active",
    access: "Procurement + Governance",
    initials: "PS",
  },
  {
    name: "Amit Singh",
    role: "Risk Analyst",
    email: "amit.singh@nhai.gov.in",
    status: "Active",
    access: "Execution + Commercial",
    initials: "AS",
  },
  {
    name: "Sunita Patel",
    role: "Commercial Head",
    email: "sunita.patel@morthindia.gov.in",
    status: "Active",
    access: "Commercial Risk",
    initials: "SP",
  },
  {
    name: "Meera Iyer",
    role: "Asset Manager",
    email: "meera.iyer@nhai.gov.in",
    status: "Active",
    access: "Asset Intelligence",
    initials: "MI",
  },
];

const INITIAL_NOTIFS: NotifPref[] = [
  { label: "Critical Alerts", delivery: "Email + Platform", enabled: true },
  {
    label: "Tender Fraud Detection",
    delivery: "Email + Platform",
    enabled: true,
  },
  { label: "Execution Delay Alerts", delivery: "Platform only", enabled: true },
  {
    label: "Report Generation Complete",
    delivery: "Email + Platform",
    enabled: true,
  },
  { label: "Governance Flags", delivery: "Email + Platform", enabled: true },
  { label: "Asset Health Alerts", delivery: "Platform only", enabled: true },
];

const ORGS = [
  {
    id: "morth",
    name: "Ministry of Road Transport & Highways",
    type: "Central Ministry",
    jurisdiction: "National",
  },
  {
    id: "nhai",
    name: "National Highways Authority of India",
    type: "Statutory Authority",
    jurisdiction: "National",
  },
  {
    id: "smart",
    name: "Smart Cities Mission",
    type: "Government Programme",
    jurisdiction: "Urban India",
  },
];

const TAB_LIST: { id: SettingsTab; label: string; icon: React.ElementType }[] =
  [
    { id: "org", label: "Organization", icon: Building2 },
    { id: "users", label: "Users", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "datasources", label: "Data Sources", icon: Database },
    { id: "security", label: "Security", icon: Shield },
    { id: "api", label: "API Access", icon: Key },
  ];

// ── Toggle ─────────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  id,
}: { checked: boolean; onChange: () => void; id: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-ocid={id}
      onClick={onChange}
      className={`relative w-9 h-5 rounded-full transition-smooth flex-shrink-0 ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all duration-200 ${checked ? "left-[18px]" : "left-0.5"}`}
      />
    </button>
  );
}

// ── Organization Tab ─────────────────────────────────────────────────────────
function OrgTab() {
  const [selectedOrg, setSelectedOrg] = useState("morth");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <div className="space-y-5">
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">
          Organization Profile
        </h3>
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0">
            <Building2 size={28} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                label: "Organization Name",
                value: "Ministry of Road Transport & Highways",
              },
              {
                label: "Organization Type",
                value: "Central Government Ministry",
              },
              { label: "Jurisdiction", value: "National (All India)" },
              { label: "Admin Contact", value: "admin@morthindia.gov.in" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-label text-[10px] mb-0.5">{label}</p>
                <p className="text-sm text-foreground font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-bold text-foreground mb-1">
          Organization Switcher
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Switch between authorized organizations
        </p>
        <div className="space-y-2">
          {ORGS.map((org) => (
            <label
              key={org.id}
              className={`flex items-center gap-3 p-3.5 rounded cursor-pointer transition-smooth border
                ${selectedOrg === org.id ? "border-primary/40 bg-primary/8" : "glass-card hover:border-primary/20"}`}
              data-ocid={`settings.org.${org.id}`}
            >
              <input
                type="radio"
                name="org"
                value={org.id}
                checked={selectedOrg === org.id}
                onChange={() => setSelectedOrg(org.id)}
                className="accent-primary"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {org.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {org.type} · {org.jurisdiction}
                </p>
              </div>
              {selectedOrg === org.id && (
                <CheckCircle2
                  size={15}
                  className="text-primary flex-shrink-0"
                />
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">
          Platform Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-label text-[10px] mb-2">THEME</p>
            <div className="flex items-center gap-2">
              {(["dark", "light"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  data-ocid={`settings.theme.${t}`}
                  onClick={() => setTheme(t)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold transition-smooth border
                    ${theme === t ? "bg-primary/15 border-primary/40 text-primary" : "glass-card text-muted-foreground"}`}
                >
                  <Monitor size={12} />
                  {t === "dark" ? "Dark" : "Light"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-label text-[10px] mb-2">LANGUAGE</p>
            <select
              className="glass-card px-3 py-2 text-xs text-foreground outline-none w-full"
              defaultValue="en"
              data-ocid="settings.language_select"
            >
              <option value="en">English (India)</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
          <div>
            <p className="text-label text-[10px] mb-2">TIMEZONE</p>
            <select
              className="glass-card px-3 py-2 text-xs text-foreground outline-none w-full"
              defaultValue="ist"
              data-ocid="settings.timezone_select"
            >
              <option value="ist">IST (UTC+5:30)</option>
              <option value="utc">UTC</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab() {
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [userList, setUserList] = useState<AppUser[]>(USERS);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    role: "",
    email: "",
    access: "",
  });
  const [addSuccess, setAddSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  function handleAddUser() {
    if (!newUser.name || !newUser.email) return;
    const initials = newUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    setUserList((prev) => [
      ...prev,
      { ...newUser, status: "Active", initials },
    ]);
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setShowAddUser(false);
      setNewUser({ name: "", role: "", email: "", access: "" });
    }, 2000);
  }

  function handleSaveEdit() {
    if (!editingUser) return;
    setUserList((prev) =>
      prev.map((u) => (u.email === editingUser.email ? editingUser : u)),
    );
    setEditSuccess(true);
    setTimeout(() => {
      setEditSuccess(false);
      setEditingUser(null);
    }, 2000);
  }

  function handleDelete(email: string) {
    setUserList((prev) => prev.filter((u) => u.email !== email));
    setDeleteConfirm(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {userList.length} active users in this organization
        </p>
        <button
          type="button"
          className="btn-primary text-sm flex items-center gap-2"
          data-ocid="settings.add_user_button"
          onClick={() => setShowAddUser(true)}
        >
          <Plus size={13} /> Add User
        </button>
      </div>

      {/* Add User Panel */}
      {showAddUser && (
        <div
          className="p-5 rounded-xl space-y-4"
          style={{
            background: "rgba(0,212,255,0.04)",
            border: "1px solid rgba(0,212,255,0.2)",
          }}
          data-ocid="settings.add_user_panel"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Add New User</h3>
            <button
              type="button"
              onClick={() => setShowAddUser(false)}
              className="btn-ghost p-1"
              data-ocid="settings.add_user_panel.close_button"
            >
              <X size={14} className="text-muted-foreground" />
            </button>
          </div>
          {addSuccess ? (
            <div
              className="flex items-center gap-2 p-3 rounded"
              style={{
                background: "rgba(0,230,118,0.08)",
                border: "1px solid rgba(0,230,118,0.2)",
              }}
              data-ocid="settings.add_user_panel.success_state"
            >
              <CheckCircle2 size={14} style={{ color: "#00E676" }} />
              <span className="text-sm" style={{ color: "#00E676" }}>
                User added successfully!
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "add-user-name",
                  label: "Full Name *",
                  key: "name" as const,
                  placeholder: "e.g. Rahul Sharma",
                },
                {
                  id: "add-user-role",
                  label: "Role",
                  key: "role" as const,
                  placeholder: "e.g. Risk Analyst",
                },
                {
                  id: "add-user-email",
                  label: "Email *",
                  key: "email" as const,
                  placeholder: "user@gov.in",
                },
                {
                  id: "add-user-access",
                  label: "Access Level",
                  key: "access" as const,
                  placeholder: "e.g. Procurement",
                },
              ].map(({ id, label, key, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="text-label text-[10px] block mb-1.5"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    value={newUser[key]}
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full glass-card px-3 py-2 text-xs text-foreground outline-none"
                    data-ocid={`settings.add_user_panel.${key}_input`}
                  />
                </div>
              ))}
              <div className="col-span-full flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="btn-ghost text-xs px-4 py-2 border border-border/40 rounded"
                  data-ocid="settings.add_user_panel.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="btn-primary text-xs px-4 py-2"
                  data-ocid="settings.add_user_panel.submit_button"
                >
                  Add User
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit User Panel */}
      {editingUser && (
        <div
          className="p-5 rounded-xl space-y-4"
          style={{
            background: "rgba(255,179,0,0.04)",
            border: "1px solid rgba(255,179,0,0.2)",
          }}
          data-ocid="settings.edit_user_panel"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">
              Edit User — {editingUser.name}
            </h3>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="btn-ghost p-1"
              data-ocid="settings.edit_user_panel.close_button"
            >
              <X size={14} className="text-muted-foreground" />
            </button>
          </div>
          {editSuccess ? (
            <div
              className="flex items-center gap-2 p-3 rounded"
              style={{
                background: "rgba(0,230,118,0.08)",
                border: "1px solid rgba(0,230,118,0.2)",
              }}
              data-ocid="settings.edit_user_panel.success_state"
            >
              <CheckCircle2 size={14} style={{ color: "#00E676" }} />
              <span className="text-sm" style={{ color: "#00E676" }}>
                User updated successfully!
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "edit-user-role", label: "Role", field: "role" as const },
                {
                  id: "edit-user-access",
                  label: "Access Level",
                  field: "access" as const,
                },
              ].map(({ id, label, field }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="text-label text-[10px] block mb-1.5"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type="text"
                    value={editingUser[field]}
                    onChange={(e) =>
                      setEditingUser((prev) =>
                        prev ? { ...prev, [field]: e.target.value } : prev,
                      )
                    }
                    className="w-full glass-card px-3 py-2 text-xs text-foreground outline-none"
                    data-ocid={`settings.edit_user_panel.${field}_input`}
                  />
                </div>
              ))}
              <div className="col-span-full flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn-ghost text-xs px-4 py-2 border border-border/40 rounded"
                  data-ocid="settings.edit_user_panel.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="btn-primary text-xs px-4 py-2"
                  data-ocid="settings.edit_user_panel.save_button"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div
          className="p-4 rounded-xl flex items-center gap-4"
          style={{
            background: "rgba(255,61,0,0.07)",
            border: "1px solid rgba(255,61,0,0.25)",
          }}
          data-ocid="settings.delete_user_dialog"
        >
          <Trash2 size={18} style={{ color: "#FF6B6B", flexShrink: 0 }} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Remove user from organization?
            </p>
            <p className="text-xs text-muted-foreground">
              This will revoke all access for <strong>{deleteConfirm}</strong>.
              This action can be reversed by re-inviting.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setDeleteConfirm(null)}
              className="btn-ghost text-xs px-3 py-1.5 border border-border/40 rounded"
              data-ocid="settings.delete_user_dialog.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDelete(deleteConfirm)}
              className="text-xs px-3 py-1.5 rounded font-bold"
              style={{
                background: "rgba(255,61,0,0.15)",
                color: "#FF6B6B",
                border: "1px solid rgba(255,61,0,0.25)",
              }}
              data-ocid="settings.delete_user_dialog.confirm_button"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div
        className="glass-card overflow-hidden"
        data-ocid="settings.users_table"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              {["User", "Role", "Email", "Status", "Access", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-label text-[10px] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {userList.map((u, i) => (
              <tr
                key={u.email}
                data-ocid={`settings.users_table.item.${i + 1}`}
                className="border-b border-border/20 hover:bg-white/[0.02] transition-smooth"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-[10px] font-bold">
                        {u.initials}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {u.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs text-muted-foreground">
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-mono text-[11px] text-foreground">
                    {u.email}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="badge-success">{u.status}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{
                      background: "rgba(0,212,255,0.1)",
                      color: "#00D4FF",
                      border: "1px solid rgba(0,212,255,0.2)",
                    }}
                  >
                    {u.access}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-ocid={`settings.edit_user_button.${i + 1}`}
                      onClick={() => setEditingUser(u)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-muted-foreground border border-border/40 hover:bg-white/5 hover:text-foreground transition-smooth"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      type="button"
                      data-ocid={`settings.remove_user_button.${i + 1}`}
                      onClick={() => setDeleteConfirm(u.name)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-smooth"
                      style={{
                        color: "#ff6b6b",
                        borderColor: "rgba(255,107,107,0.25)",
                      }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Notifications Tab ─────────────────────────────────────────────────────────
function NotificationsTab() {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [delivery, setDelivery] = useState<"realtime" | "daily" | "weekly">(
    "realtime",
  );

  return (
    <div className="space-y-5">
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold text-foreground mb-1">
          Alert Preferences
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Configure which alerts trigger notifications and delivery mode
        </p>
        <div className="space-y-3">
          {notifs.map((n, i) => (
            <div
              key={n.label}
              data-ocid={`settings.notif.${i + 1}`}
              className="flex items-center justify-between p-3.5 glass-card rounded"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{n.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {n.delivery}
                </p>
              </div>
              <Toggle
                checked={n.enabled}
                onChange={() =>
                  setNotifs((prev) =>
                    prev.map((x, idx) =>
                      idx === i ? { ...x, enabled: !x.enabled } : x,
                    ),
                  )
                }
                id={`settings.notif.toggle.${i + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold text-foreground mb-1">
          Notification Delivery
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Choose how often you receive notification batches
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { id: "realtime" as const, label: "Real-time", icon: Zap },
            { id: "daily" as const, label: "Daily Digest", icon: Mail },
            { id: "weekly" as const, label: "Weekly Summary", icon: Globe },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              data-ocid={`settings.delivery.${id}`}
              onClick={() => setDelivery(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded text-sm font-semibold border transition-smooth
                ${delivery === id ? "bg-primary/15 border-primary/40 text-primary" : "glass-card text-muted-foreground hover:text-foreground"}`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Data Sources Tab ──────────────────────────────────────────────────────────
function DataSourcesTab() {
  const [syncing, setSyncing] = useState<number | null>(null);
  const [synced, setSynced] = useState<number | null>(null);
  const sources = [
    {
      name: "PFMS — Public Financial Management System",
      status: "Connected",
      updated: "2 min ago",
    },
    {
      name: "eProcure — NIC Tender Portal",
      status: "Connected",
      updated: "5 min ago",
    },
    {
      name: "NIC-NHAI Project MIS",
      status: "Connected",
      updated: "12 min ago",
    },
    {
      name: "GIS Asset Database — NRIDA",
      status: "Syncing",
      updated: "30 min ago",
    },
    {
      name: "Ministry of Finance CAPEX Tracker",
      status: "Connected",
      updated: "1 hr ago",
    },
  ];

  function handleSync(i: number) {
    setSyncing(i);
    setSynced(null);
    setTimeout(() => {
      setSyncing(null);
      setSynced(i);
      setTimeout(() => setSynced(null), 3000);
    }, 1800);
  }

  return (
    <div className="space-y-3">
      {sources.map((s, i) => (
        <div
          key={s.name}
          data-ocid={`settings.datasource.${i + 1}`}
          className="flex items-center justify-between p-4 glass-card"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background:
                  syncing === i
                    ? "#FFB300"
                    : synced === i
                      ? "#00E676"
                      : s.status === "Connected"
                        ? "#00E676"
                        : "#FFB300",
              }}
            />
            <div>
              <p className="text-sm font-medium text-foreground">{s.name}</p>
              <p className="text-xs text-muted-foreground">
                {syncing === i
                  ? "Syncing…"
                  : synced === i
                    ? "Synced just now"
                    : `Last sync: ${s.updated}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {synced === i ? (
              <span
                className="badge-success"
                data-ocid={`settings.sync_button.${i + 1}.success_state`}
              >
                Synced
              </span>
            ) : (
              <span
                className={
                  s.status === "Connected" ? "badge-success" : "badge-warning"
                }
              >
                {syncing === i ? "Syncing" : s.status}
              </span>
            )}
            <button
              type="button"
              className="btn-ghost p-1.5"
              data-ocid={`settings.sync_button.${i + 1}`}
              aria-label="Sync"
              onClick={() => handleSync(i)}
            >
              <RefreshCw
                size={13}
                className={syncing === i ? "animate-spin text-primary" : ""}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Security Tab ──────────────────────────────────────────────────────────────
function SecurityTab() {
  const [mfa, setMfa] = useState(true);
  const [sso, setSso] = useState(true);
  const [ipBlock, setIpBlock] = useState(false);
  return (
    <div className="space-y-5">
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-sm font-bold text-foreground">
          Authentication & Access
        </h3>
        {[
          {
            label: "Multi-Factor Authentication",
            desc: "Require MFA for all users",
            state: mfa,
            set: setMfa,
            id: "settings.security.mfa",
          },
          {
            label: "Single Sign-On (SSO)",
            desc: "NIC SSO / National eGov SSO integration",
            state: sso,
            set: setSso,
            id: "settings.security.sso",
          },
          {
            label: "IP Allowlist Enforcement",
            desc: "Restrict access to approved government networks",
            state: ipBlock,
            set: setIpBlock,
            id: "settings.security.ip_block",
          },
        ].map(({ label, desc, state, set, id }) => (
          <div
            key={label}
            className="flex items-center justify-between p-3.5 glass-card rounded"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <Toggle checked={state} onChange={() => set((v) => !v)} id={id} />
          </div>
        ))}
      </div>
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lock size={14} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Session Policy</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "SESSION TIMEOUT", value: "4 hours" },
            { label: "MAX CONCURRENT SESSIONS", value: "3" },
            { label: "PASSWORD ROTATION", value: "90 days" },
            { label: "AUDIT LOG RETENTION", value: "7 years" },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 glass-card rounded">
              <p className="text-label text-[10px] mb-0.5">{label}</p>
              <p className="text-sm font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── API Tab ───────────────────────────────────────────────────────────────────
function ApiTab() {
  const { actor } = useActor(createActor);
  const [geminiKey, setGeminiKey] = useState(
    () =>
      localStorage.getItem("infraos_gemini_key") ??
      localStorage.getItem("gemini_api_key") ??
      "",
  );
  const [showKey, setShowKey] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  const isKeyConfigured = !!(
    localStorage.getItem("infraos_gemini_key") ||
    localStorage.getItem("gemini_api_key")
  );

  async function handleSaveGeminiKey() {
    if (!geminiKey.trim()) {
      toast.error("Please enter a valid AI Copilot API key");
      return;
    }
    setSavingKey(true);
    try {
      if (actor) {
        await actor.setGeminiApiKey(geminiKey.trim());
      }
      localStorage.setItem("infraos_gemini_key", geminiKey.trim());
      // Also write to old key for backward compat
      localStorage.setItem("gemini_api_key", geminiKey.trim());
      toast.success(
        "InfraOS AI Copilot activated! AI intelligence layer is now online.",
        {
          duration: 4000,
        },
      );
    } catch {
      toast.error("Failed to save API key. Please try again.");
    } finally {
      setSavingKey(false);
    }
  }

  const keys = [
    {
      name: "Production API Key",
      prefix: "infra_prod_••••••••••••••••",
      created: "01 Jan 2026",
      lastUsed: "Just now",
    },
    {
      name: "Analytics Webhook",
      prefix: "infra_whk_••••••••••••••••",
      created: "15 Feb 2026",
      lastUsed: "2 hr ago",
    },
    {
      name: "MIS Integration Key",
      prefix: "infra_mis_••••••••••••••••",
      created: "10 Mar 2026",
      lastUsed: "1 day ago",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Gemini AI Copilot Key */}
      <div className="glass-card p-5" data-ocid="settings.gemini_key_section">
        <div className="flex items-center gap-2 mb-1">
          <Bot size={15} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            InfraOS AI Copilot
          </h3>
          <span
            className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${isKeyConfigured ? "badge-success" : "badge-critical"}`}
            data-ocid="settings.gemini_key_status"
          >
            {isKeyConfigured ? "Configured" : "Not configured"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Enter your AI API key to enable the InfraOS AI Copilot intelligence
          layer. Get your key from{" "}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google AI Studio
          </a>
          .
        </p>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="gemini-api-key"
              className="text-label text-[10px] mb-1.5 block"
            >
              AI COPILOT API KEY
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 glass-card px-3 py-2.5 rounded">
                <Key
                  size={12}
                  className="text-muted-foreground flex-shrink-0"
                />
                <input
                  id="gemini-api-key"
                  type={showKey ? "text" : "password"}
                  placeholder="AIzaSy••••••••••••••••••••••••••••••••••"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveGeminiKey()}
                  className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none font-mono"
                  data-ocid="settings.gemini_key_input"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="btn-ghost p-0.5 flex-shrink-0"
                  aria-label={showKey ? "Hide key" : "Show key"}
                  data-ocid="settings.gemini_key_toggle"
                >
                  {showKey ? (
                    <EyeOff size={12} className="text-muted-foreground" />
                  ) : (
                    <Eye size={12} className="text-muted-foreground" />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={handleSaveGeminiKey}
                disabled={savingKey || !geminiKey.trim()}
                className="btn-primary text-xs px-4 py-2.5 flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                data-ocid="settings.gemini_key_save_button"
              >
                {savingKey ? (
                  <RefreshCw size={11} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={11} />
                )}
                {savingKey ? "Saving…" : "Save Key"}
              </button>
            </div>
          </div>
          {isKeyConfigured && (
            <div
              className="flex items-center gap-2 p-2.5 rounded text-xs"
              style={{
                background: "rgba(0,230,118,0.06)",
                border: "1px solid rgba(0,230,118,0.18)",
              }}
              data-ocid="settings.gemini_key_success_state"
            >
              <CheckCircle2
                size={12}
                style={{ color: "#00E676", flexShrink: 0 }}
              />
              <span className="text-foreground">
                AI Copilot is active. Open the{" "}
                <strong className="text-primary">AI Copilot</strong> panel from
                the top nav to start querying.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Platform API Keys */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">
            {keys.length} active platform API keys
          </p>
          <button
            type="button"
            className="btn-primary text-sm flex items-center gap-2"
            data-ocid="settings.generate_api_key_button"
            onClick={() =>
              toast.success("New API key generated", { duration: 3000 })
            }
          >
            <Plus size={13} /> Generate Key
          </button>
        </div>
        {keys.map((k, i) => (
          <div
            key={k.name}
            data-ocid={`settings.api_key.${i + 1}`}
            className="glass-card p-4 flex items-center gap-4 mb-3"
          >
            <div className="w-9 h-9 rounded bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0">
              <Key size={14} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{k.name}</p>
              <p className="text-xs font-mono text-muted-foreground">
                {k.prefix}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Created {k.created} · Last used {k.lastUsed}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="badge-success">Active</span>
              <button
                type="button"
                className="btn-ghost p-1.5"
                data-ocid={`settings.copy_key_button.${i + 1}`}
                aria-label="Copy key"
                onClick={() => {
                  navigator.clipboard.writeText(k.prefix).catch(() => {});
                  toast.success("API key copied to clipboard", {
                    duration: 3000,
                  });
                }}
              >
                <Copy size={13} className="text-muted-foreground" />
              </button>
              <button
                type="button"
                className="btn-ghost p-1.5"
                data-ocid={`settings.revoke_key_button.${i + 1}`}
                aria-label="Revoke key"
                onClick={() =>
                  toast.error(`API key "${k.name}" revoked`, { duration: 3000 })
                }
              >
                <Trash2 size={13} style={{ color: "#ff6b6b" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("org");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  function handleSave() {
    setSaveSuccess(true);
    setResetSuccess(false);
    setTimeout(() => setSaveSuccess(false), 4000);
  }

  function handleReset() {
    setResetSuccess(true);
    setSaveSuccess(false);
    setTimeout(() => setResetSuccess(false), 4000);
  }

  const TAB_PANELS: Record<SettingsTab, React.ReactNode> = {
    org: <OrgTab />,
    users: <UsersTab />,
    notifications: <NotificationsTab />,
    datasources: <DataSourcesTab />,
    security: <SecurityTab />,
    api: <ApiTab />,
  };

  return (
    <div className="p-6 space-y-6" data-ocid="settings.page">
      <div>
        <p className="text-label text-[10px] mb-1">SYSTEM CONFIGURATION</p>
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          Platform Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Organization configuration, user management, and system preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border/40">
        {TAB_LIST.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            data-ocid={`settings.tab.${id}`}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-smooth whitespace-nowrap
              ${activeTab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab panel */}
      <div>{TAB_PANELS[activeTab]}</div>

      {/* Success banners */}
      {saveSuccess && (
        <div
          className="flex items-center gap-3 p-4 rounded-lg"
          style={{
            background: "rgba(0,230,118,0.08)",
            border: "1px solid rgba(0,230,118,0.25)",
          }}
          data-ocid="settings.save_success_state"
        >
          <CheckCircle2 size={16} style={{ color: "#00E676", flexShrink: 0 }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "#00E676" }}>
              Settings saved successfully
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              All changes have been applied and audit-logged per government data
              policy.
            </p>
          </div>
        </div>
      )}
      {resetSuccess && (
        <div
          className="flex items-center gap-3 p-4 rounded-lg"
          style={{
            background: "rgba(0,212,255,0.07)",
            border: "1px solid rgba(0,212,255,0.2)",
          }}
          data-ocid="settings.reset_success_state"
        >
          <RefreshCw size={16} style={{ color: "#00D4FF", flexShrink: 0 }} />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Settings reset to defaults
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              All settings have been restored to system defaults.
            </p>
          </div>
        </div>
      )}

      {/* Save bar */}
      <div
        className="flex items-center justify-between p-4 rounded"
        style={{
          background: "rgba(0,212,255,0.04)",
          border: "1px solid rgba(0,212,255,0.12)",
        }}
      >
        <div className="flex items-center gap-2">
          <UserCheck size={14} className="text-primary" />
          <span className="text-xs text-muted-foreground">
            Changes are auto-saved and audit-logged per government data policy
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary text-sm"
            data-ocid="settings.cancel_button"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn-primary text-sm flex items-center gap-2"
            data-ocid="settings.save_button"
            onClick={handleSave}
          >
            <CheckCircle2 size={13} /> Save Changes
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Smartphone size={11} />
        <span>Settings are synced across all active sessions</span>
        <ChevronRight size={11} className="ml-auto" />
      </div>
    </div>
  );
}
