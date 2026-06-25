import { Plus, Star, MapPin, Languages, Pencil } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { StatusBadge } from "../components/shared/StatusBadge";
import { useTravel } from "../hooks/useTravel";
import { toast } from "sonner";

export function Guides() {
  const { guides, loading } = useTravel();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading guides...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Tour Guides"
        description="Manage your team of professional tour guides."
        actions={
          <button onClick={() => toast.success("Add guide form opened")} className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"><Plus className="size-4" /> Add Guide</button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {guides.map((g) => (
          <div key={g.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
              <img src={g.avatar} alt={g.name} className="size-16 rounded-2xl bg-muted" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-semibold text-foreground">{g.name}</h3>
                  <StatusBadge status={g.status} />
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {g.region}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Languages className="size-3" /> {g.languages}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/50 p-3 text-sm">
              <div className="text-center">
                <p className="flex items-center justify-center gap-1 font-semibold text-amber-600"><Star className="size-3.5 fill-amber-500 text-amber-500" /> {g.rating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="font-semibold text-foreground">{g.tours}</p>
                <p className="text-xs text-muted-foreground">Tours led</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <button onClick={() => toast.success("Edit guide")} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"><Pencil className="size-3.5" /> Edit</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
