import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Search, Eye, Clock, CheckCircle2, CircleCheck, XCircle } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { StatusBadge } from "../components/shared/StatusBadge";
import { useTravel } from "../hooks/useTravel";
import { formatIDR } from "../lib/data";
import { cn } from "../components/ui/utils";

const summaryIcon = { pending: Clock, confirmed: CheckCircle2, completed: CircleCheck, cancelled: XCircle } as const;

export function Bookings() {
  const router = useRouter();
  const { bookings, bookingSummary, loading } = useTravel();
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  const tabs = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];
  const filtered = bookings.filter(
    (b) =>
      (tab === "All" || b.status === tab) &&
      (b.id.toLowerCase().includes(query.toLowerCase()) || b.customer.toLowerCase().includes(query.toLowerCase()))
  );


  return (
    <>
      <PageHeader
        title="Bookings"
        description="Track and manage all customer bookings."
        actions={
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-muted">
            <Download className="size-4" /> Export
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {bookingSummary.map((s) => {
          const Icon = summaryIcon[s.id as keyof typeof summaryIcon];
          return (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${s.color}18`, color: s.color }}><Icon className="size-5" /></span>
                <span className="text-2xl font-bold text-foreground">{s.value.toLocaleString()}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>

      <Panel bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium transition", tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>{t}</button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search booking code or name" className="h-9 w-full rounded-lg border border-border bg-muted/40 pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-card" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Booking Code</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Package</th>
                <th className="px-5 py-3 font-medium">Departure</th>
                <th className="px-5 py-3 font-medium">Pax</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3 font-medium text-primary">{b.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={b.avatar} alt={b.customer} className="size-8 rounded-full bg-muted" />
                      <span className="font-medium text-foreground">{b.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{b.package}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(b.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                  <td className="px-5 py-3 text-foreground">{b.participants}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{formatIDR(b.amount)}</td>
                  <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => router.push(`/bookings/${b.id}`)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"><Eye className="size-3.5" /> Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
