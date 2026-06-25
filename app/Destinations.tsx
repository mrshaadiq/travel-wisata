import { useState } from "react";
import { Plus, MapPin, TrendingUp, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { StatusBadge } from "../components/shared/StatusBadge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "../components/ui/dialog";
import { destinations } from "../lib/data";
import { toast } from "sonner";

export function Destinations() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Destination Management"
        description="Curate the destinations featured across your tour packages."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"><Plus className="size-4" /> Add Destination</button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Destination</DialogTitle>
                <DialogDescription>Add a new destination with photo and location.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground hover:border-primary hover:text-primary">
                  <ImageIcon className="size-7" />
                  <p className="text-sm font-medium">Upload destination photo</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Destination Name" placeholder="Bali" />
                  <Field label="Province" placeholder="Bali" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
                  <textarea rows={3} placeholder="Describe the destination..." className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="flex h-28 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-blue-50 to-sky-50 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> Map preview</span>
                </div>
              </div>
              <DialogFooter>
                <button onClick={() => { setOpen(false); toast.success("Destination added"); }} className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save Destination</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {destinations.map((d) => (
          <div key={d.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
            <div className="relative h-40 bg-muted">
              <ImageWithFallback src={d.image} alt={d.name} className="size-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute left-3 top-3"><StatusBadge status={d.status} className="bg-white/90 backdrop-blur" /></div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{d.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {d.province}</p>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{d.category}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm font-semibold text-green-600"><TrendingUp className="size-3.5" /> {d.popularity}% popularity</span>
                <div className="flex gap-1">
                  <button onClick={() => toast.success("Edit destination")} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"><Pencil className="size-3.5" /></button>
                  <button onClick={() => toast.error("Destination deleted")} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
