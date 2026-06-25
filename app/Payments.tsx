import { useState } from "react";
import { Download, Search, Wallet, Clock, CheckCircle2, RotateCcw, Eye, Check, X } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { StatCard } from "../components/shared/StatCard";
import { StatusBadge } from "../components/shared/StatusBadge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "../components/ui/dialog";
import { useTravel } from "../hooks/useTravel";
import { formatIDR } from "../lib/data";
import { destinationImages } from "../lib/images";
import { toast } from "sonner";

const iconMap = { Wallet, Clock, CheckCircle2, RotateCcw } as const;

export function Payments() {
  const { payments, refunds, loading } = useTravel();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof payments[number] | null>(null);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = payments.filter(p => p.status === "Success").reduce((acc, curr) => acc + curr.amount, 0);
  const pendingRevenue = payments.filter(p => p.status === "Pending").reduce((acc, curr) => acc + curr.amount, 0);
  const successfulCount = payments.filter(p => p.status === "Success").length;
  const refundRequestsCount = refunds.length;
  const refundTotal = refunds.reduce((acc, curr) => acc + curr.amount, 0);

  const paymentStats = [
    { id: "revenue", label: "Total Revenue", value: totalRevenue >= 1e9 ? "Rp " + (totalRevenue / 1e9).toFixed(1) + "B" : "Rp " + (totalRevenue / 1e6).toFixed(0) + "M", delta: "+18.9%", trend: "up", icon: "Wallet" as const, color: "#22C55E" },
    { id: "pending", label: "Pending Payments", value: pendingRevenue >= 1e9 ? "Rp " + (pendingRevenue / 1e9).toFixed(1) + "B" : "Rp " + (pendingRevenue / 1e6).toFixed(0) + "M", delta: `${payments.filter(p => p.status === "Pending").length} invoices`, trend: "neutral" as const, icon: "Clock" as const, color: "#F59E0B" },
    { id: "success", label: "Successful Payments", value: successfulCount.toLocaleString(), delta: "+12.5%", trend: "up" as const, icon: "CheckCircle2" as const, color: "#2563EB" },
    { id: "refund", label: "Refund Requests", value: refundRequestsCount.toString(), delta: "Rp " + (refundTotal / 1e6).toFixed(0) + "M", trend: "down" as const, icon: "RotateCcw" as const, color: "#EF4444" },
  ];

  const filtered = payments.filter((p) => p.id.toLowerCase().includes(query.toLowerCase()) || p.customer.toLowerCase().includes(query.toLowerCase()));


  return (
    <>
      <PageHeader
        title="Payment Management"
        description="Verify transactions, manage refunds and track revenue."
        actions={
          <button onClick={() => toast.success("Report exported")} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-muted">
            <Download className="size-4" /> Export
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {paymentStats.map((s) => (
          <StatCard key={s.id} label={s.label} value={s.value} delta={s.delta} trend={s.trend as "up" | "down" | "neutral"} icon={iconMap[s.icon as keyof typeof iconMap]} color={s.color} />
        ))}
      </div>

      <Panel bodyClassName="p-0">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-semibold text-foreground">Transactions</h3>
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transaction" className="h-9 w-full rounded-lg border border-border bg-muted/40 pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-card" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Transaction ID</th>
                <th className="px-5 py-3 font-medium">Booking</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3 font-medium text-foreground">{p.id}</td>
                  <td className="px-5 py-3 text-primary">{p.booking}</td>
                  <td className="px-5 py-3 text-foreground">{p.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.method}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{formatIDR(p.amount)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setSelected(p)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"><Eye className="size-3.5" /> Verify</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Verification</DialogTitle>
            <DialogDescription>{selected?.id} · {selected?.booking}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-border">
                <ImageWithFallback src={destinationImages.bali} alt="Payment proof" className="h-44 w-full bg-muted object-cover" />
                <p className="bg-muted/50 px-3 py-2 text-center text-xs text-muted-foreground">Payment proof uploaded by customer</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium text-foreground">{selected.customer}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="font-medium text-foreground">{selected.method}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold text-primary">{formatIDR(selected.amount)}</span></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { toast.success("Payment approved"); setSelected(null); }} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Check className="size-4" /> Approve</button>
                <button onClick={() => { toast.error("Payment rejected"); setSelected(null); }} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-red-600 hover:bg-red-50"><X className="size-4" /> Reject</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
