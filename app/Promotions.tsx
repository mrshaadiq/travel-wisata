import { useState } from "react";
import { Plus, BadgePercent, Copy, Pencil, Trash2, Calendar } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { StatusBadge } from "../components/shared/StatusBadge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "../components/ui/dialog";
import { promotions } from "../lib/data";
import { toast } from "sonner";

export function Promotions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Promotion Management"
        description="Create and manage discount codes and campaigns."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"><Plus className="size-4" /> Create Promo</button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Promotion</DialogTitle>
                <DialogDescription>Set up a new discount code for your customers.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Field label="Promo Code" placeholder="SUMMER26" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Discount" placeholder="25%" />
                  <Field label="Usage Limit" placeholder="1000" type="number" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Valid From" type="date" />
                  <Field label="Valid Until" type="date" />
                </div>
              </div>
              <DialogFooter>
                <button onClick={() => { setOpen(false); toast.success("Promotion created"); }} className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">Create Promotion</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {promotions.map((p) => {
          const pct = Math.round((p.used / p.limit) * 100);
          return (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-sky-500 p-5 text-white">
                <div>
                  <p className="text-xs font-medium text-blue-100">Promo Code</p>
                  <p className="text-xl font-bold tracking-wide">{p.code}</p>
                </div>
                <span className="flex size-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur"><BadgePercent className="size-6" /></span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{p.discount} <span className="text-sm font-normal text-muted-foreground">off</span></span>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="size-3" /> {p.period}</p>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Usage</span><span>{p.used} / {p.limit}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => toast.success(`Copied ${p.code}`)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-foreground hover:bg-muted"><Copy className="size-3.5" /> Copy</button>
                  <button onClick={() => toast.success("Edit promo")} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-primary"><Pencil className="size-3.5" /></button>
                  <button onClick={() => toast.error("Promo deleted")} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <input {...props} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}
