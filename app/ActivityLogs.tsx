import { useState } from "react";
import { Search, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { StatusBadge } from "../components/shared/StatusBadge";
import { useTravel } from "../hooks/useTravel";
import { cn } from "../components/ui/utils";

const statusIcon = { Success: CheckCircle2, Failed: XCircle, Warning: AlertTriangle } as const;
const statusColor = { Success: "text-green-600 bg-green-100", Failed: "text-red-600 bg-red-100", Warning: "text-amber-600 bg-amber-100" } as const;

export function ActivityLogs() {
  const { activityLogs, loading } = useTravel();
  const [query, setQuery] = useState("");
  const [user, setUser] = useState("all");

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  const users = ["all", ...Array.from(new Set(activityLogs.map((l) => l.user)))];
  const filtered = activityLogs.filter(
    (l) => (l.action.toLowerCase().includes(query.toLowerCase()) || l.module.toLowerCase().includes(query.toLowerCase())) && (user === "all" || l.user === user)
  );


  return (
    <>
      <PageHeader title="Activity Logs" description="Audit trail of all system activities." />

      <Panel bodyClassName="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search activity" className="h-10 w-full rounded-lg border border-border bg-muted/40 pl-10 pr-3 text-sm outline-none focus:border-primary focus:bg-card" />
          </div>
          <select value={user} onChange={(e) => setUser(e.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary">
            {users.map((u) => <option key={u} value={u}>{u === "all" ? "All Users" : u}</option>)}
          </select>
          <input type="date" className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground outline-none focus:border-primary" />
        </div>
      </Panel>

      <Panel title="Timeline">
        <div className="relative space-y-6 pl-7">
          <span className="absolute left-[11px] top-2 h-[calc(100%-1.5rem)] w-px bg-border" />
          {filtered.map((l) => {
            const Icon = statusIcon[l.status as keyof typeof statusIcon] ?? CheckCircle2;
            return (
              <div key={l.id} className="relative">
                <span className={cn("absolute -left-7 top-0 flex size-6 items-center justify-center rounded-full ring-4 ring-card", statusColor[l.status as keyof typeof statusColor] ?? "text-slate-600 bg-slate-100")}>
                  <Icon className="size-3.5" />
                </span>
                <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <img src={l.avatar} alt={l.user} className="size-9 rounded-full bg-muted" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{l.action}</p>
                      <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">{l.user}</span> · {l.module}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pl-12 sm:pl-0">
                    <span className="text-xs text-muted-foreground">{l.date}</span>
                    <StatusBadge status={l.status} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}
