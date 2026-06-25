import { Heart, Users, Star, MapPin } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTravel } from "../hooks/useTravel";

export function Wishlist() {
  const { packages, customers, loading } = useTravel();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  const wishlist = packages.slice(0, 5).map((p, i) => ({
    ...p,
    saves: [142, 98, 256, 73, 51][i] || 10,
    savers: customers.slice(i, i + 4),
  }));

  return (
    <>
      <PageHeader title="Customer Wishlist" description="See which packages your customers are dreaming about." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Total Saves" value="620" />
        <Stat label="Most Wished" value="Labuan Bajo" />
        <Stat label="Conversion Rate" value="34%" />
      </div>

      <Panel title="Most Wishlisted Packages" bodyClassName="p-0">
        <div className="divide-y divide-border">
          {wishlist.map((p) => (
            <div key={p.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <ImageWithFallback src={p.image} alt={p.name} className="h-20 w-full shrink-0 rounded-xl bg-muted object-cover sm:w-28" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="size-3" /> {p.destination}</span>
                  <span className="flex items-center gap-1"><Star className="size-3 fill-amber-500 text-amber-500" /> {p.rating}</span>
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {p.savers.map((s) => <img key={s.id} src={s.avatar} alt={s.name} className="size-8 rounded-full bg-muted ring-2 ring-card" />)}
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">
                  <Heart className="size-4 fill-red-500 text-red-500" /> {p.saves}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
