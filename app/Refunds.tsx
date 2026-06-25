import { RotateCcw, Check, X } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { StatusBadge } from "../components/shared/StatusBadge";
import { useTravel } from "../hooks/useTravel";
import { formatIDR } from "../lib/data";
import { toast } from "sonner";

export function Refunds() {
  const { refunds, loading } = useTravel();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading refunds...</p>
        </div>
      </div>
    );
  }

  const pending = refunds.filter((r) => r.status === "Pending").length;
  const approved = refunds.filter((r) => r.status === "Approved").length;
  const total = refunds.reduce((s, r) => s + (r.status === "Approved" ? r.amount : 0), 0);


  return (
    <>
      <PageHeader title="Refund Management" description="Review and process customer refund requests." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Pending Requests" value={String(pending)} color="#F59E0B" />
        <Stat label="Approved Refunds" value={String(approved)} color="#22C55E" />
        <Stat label="Total Refunded" value={formatIDR(total)} color="#EF4444" />
      </div>

      <Panel title="Refund Requests" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Refund ID</th>
                <th className="px-5 py-3 font-medium">Booking</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-2 font-medium text-foreground">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600"><RotateCcw className="size-4" /></span>
                      {r.id}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-primary">{r.booking}</td>
                  <td className="px-5 py-3 text-foreground">{r.customer}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{formatIDR(r.amount)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.reason}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3 text-right">
                    {r.status === "Pending" ? (
                      <div className="flex justify-end gap-1">
                        <button onClick={() => toast.success("Refund approved")} className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"><Check className="size-3.5" /> Approve</button>
                        <button onClick={() => toast.error("Refund rejected")} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"><X className="size-3.5" /> Reject</button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    )}
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

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}
