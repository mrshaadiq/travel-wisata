import { useState } from "react";
import { Building2, Palette, Bell, Shield, UsersRound, Upload, Check } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { Switch } from "../components/ui/switch";
import { StatusBadge } from "../components/shared/StatusBadge";
import { avatar } from "../lib/images";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";

const tabs = [
  { key: "company", label: "Company", icon: Building2 },
  { key: "theme", label: "Theme", icon: Palette },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "roles", label: "User Roles", icon: UsersRound },
];

const palette = ["#2563EB", "#0EA5E9", "#22C55E", "#F59E0B", "#8B5CF6", "#EF4444"];

const roles = [
  { name: "Super Admin", user: "Admin Travel", perms: "Full access", status: "Active" },
  { name: "Finance Manager", user: "Rina Hartati", perms: "Payments, Reports", status: "Active" },
  { name: "Tour Coordinator", user: "Made Wirawan", perms: "Packages, Departures", status: "Active" },
  { name: "Support Agent", user: "Sari Wulandari", perms: "Bookings, Customers", status: "Inactive" },
];

export function Settings() {
  const [tab, setTab] = useState("company");
  const [color, setColor] = useState("#2563EB");

  return (
    <>
      <PageHeader title="Settings" description="Manage your business profile, appearance and team." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-2 lg:flex-col">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={cn("flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition", tab === t.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          {tab === "company" && (
            <Panel title="Company Information">
              <div className="flex items-center gap-4">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold">TG</div>
                <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"><Upload className="size-4" /> Upload Logo</button>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Business Name" defaultValue="TravelGo Indonesia" />
                <Field label="Email" defaultValue="hello@travelgo.id" />
                <Field label="Phone" defaultValue="+62 21 5050 6060" />
                <Field label="Website" defaultValue="www.travelgo.id" />
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Address</label>
                  <textarea rows={2} defaultValue="Jl. Sudirman No. 88, Jakarta Pusat, DKI Jakarta 10220" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <SaveBar />
            </Panel>
          )}

          {tab === "theme" && (
            <Panel title="Theme Customization">
              <p className="mb-3 text-sm font-medium text-foreground">Primary Color</p>
              <div className="flex flex-wrap gap-3">
                {palette.map((c) => (
                  <button key={c} onClick={() => setColor(c)} className="flex size-10 items-center justify-center rounded-xl ring-2 ring-offset-2" style={{ backgroundColor: c, ...(color === c ? { boxShadow: `0 0 0 2px ${c}` } : {}) }}>
                    {color === c && <Check className="size-5 text-white" />}
                  </button>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <ToggleRow label="Dark mode" desc="Use a darker color scheme across the dashboard" />
                <ToggleRow label="Compact layout" desc="Reduce spacing for denser data views" defaultChecked={false} />
                <ToggleRow label="Glassmorphism cards" desc="Apply frosted glass effect on selected cards" />
              </div>
              <SaveBar />
            </Panel>
          )}

          {tab === "notifications" && (
            <Panel title="Notification Settings">
              <div className="space-y-3">
                <ToggleRow label="New bookings" desc="Notify when a new booking is created" />
                <ToggleRow label="Payment received" desc="Notify when a payment is confirmed" />
                <ToggleRow label="Refund requests" desc="Notify when a customer requests a refund" />
                <ToggleRow label="Low seat availability" desc="Alert when a departure is nearly full" defaultChecked={false} />
                <ToggleRow label="Weekly summary email" desc="Receive a performance digest every Monday" />
              </div>
              <SaveBar />
            </Panel>
          )}

          {tab === "security" && (
            <Panel title="Security Settings">
              <div className="space-y-4">
                <Field label="Current Password" type="password" defaultValue="••••••••" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="New Password" type="password" />
                  <Field label="Confirm Password" type="password" />
                </div>
                <div className="space-y-3 pt-2">
                  <ToggleRow label="Two-factor authentication" desc="Add an extra layer of security at sign-in" />
                  <ToggleRow label="Login alerts" desc="Email me about unrecognized sign-ins" />
                </div>
              </div>
              <SaveBar />
            </Panel>
          )}

          {tab === "roles" && (
            <Panel title="User Roles & Permissions" bodyClassName="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-5 py-3 font-medium">User</th>
                      <th className="px-5 py-3 font-medium">Role</th>
                      <th className="px-5 py-3 font-medium">Permissions</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((r) => (
                      <tr key={r.name} className="border-b border-border last:border-0 hover:bg-muted/40">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img src={avatar(r.user)} alt={r.user} className="size-9 rounded-full bg-muted" />
                            <span className="font-medium text-foreground">{r.user}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-foreground">{r.name}</td>
                        <td className="px-5 py-3 text-muted-foreground">{r.perms}</td>
                        <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </>
  );

  function SaveBar() {
    return (
      <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
        <button className="h-9 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted">Cancel</button>
        <button onClick={() => toast.success("Settings saved")} className="h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save Changes</button>
      </div>
    );
  }
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <input {...props} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}

function ToggleRow({ label, desc, defaultChecked = true }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
