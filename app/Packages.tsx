import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Download, Star, Clock, Users, MapPin, Eye, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { StatusBadge } from "../components/shared/StatusBadge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTravel } from "../hooks/useTravel";
import { formatIDR } from "../lib/data";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";

export function Packages() {
  const router = useRouter();
  const { packages, loading } = useTravel();
  const [cat, setCat] = useState("All");

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading packages...</p>
        </div>
      </div>
    );
  }

  const categories = ["All", ...Array.from(new Set(packages.map((p) => p.category)))];
  const list = packages.filter((p) => cat === "All" || p.category === cat);


  return (
    <>
      <PageHeader
        title="Tour Packages"
        description="Browse, create and manage all travel packages."
        actions={
          <>
            <button onClick={() => toast.success("Packages exported")} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition hover:bg-muted">
              <Download className="size-4" /> Export
            </button>
            <button onClick={() => toast.success("New package form opened")} className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
              <Plus className="size-4" /> Add Package
            </button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              cat === c ? "bg-primary text-primary-foreground shadow-sm" : "bg-card text-muted-foreground ring-1 ring-border hover:bg-muted"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => {
          const fill = Math.round((p.booked / p.quota) * 100);
          return (
            <div key={p.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
              <div className="relative h-44 bg-muted">
                <ImageWithFallback src={p.image} alt={p.name} className="size-full object-cover transition duration-300 group-hover:scale-105" />
                <div className="absolute left-3 top-3"><StatusBadge status={p.status} className="bg-white/90 backdrop-blur" /></div>
                <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">{p.category}</span>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-amber-600 backdrop-blur">
                  <Star className="size-3 fill-amber-500 text-amber-500" /> {p.rating}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {p.destination}</p>

                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="size-3.5" /> {p.duration}</span>
                  <span className="flex items-center gap-1"><Users className="size-3.5" /> {p.booked}/{p.quota} booked</span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${fill}%` }} />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-foreground">{formatIDR(p.price)}</p>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => router.push(`/packages/${p.id}`)} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-primary" title="View"><Eye className="size-4" /></button>
                    <button onClick={() => toast.success("Edit package")} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-primary" title="Edit"><Pencil className="size-4" /></button>
                    <button onClick={() => toast.error("Package deleted")} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
