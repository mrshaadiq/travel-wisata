import { Plus, Star, Users, MapPin, Wifi, Waves, Utensils, Dumbbell, Pencil } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { StatusBadge } from "../components/shared/StatusBadge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { hotels } from "../lib/data";
import { toast } from "sonner";

const facilities = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Waves, label: "Infinity Pool" },
  { icon: Utensils, label: "Restaurant" },
  { icon: Dumbbell, label: "Fitness Center" },
];

export function Hotels() {
  return (
    <>
      <PageHeader
        title="Hotel Management"
        description="Partner hotels and accommodations for your tours."
        actions={
          <button onClick={() => toast.success("Add hotel form opened")} className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"><Plus className="size-4" /> Add Hotel</button>
        }
      />

      {/* Featured hotel detail */}
      <Panel title="Featured Hotel" bodyClassName="p-0">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
          <ImageWithFallback src={hotels[0].image} alt={hotels[0].name} className="h-64 w-full bg-muted object-cover lg:h-full lg:rounded-l-2xl" />
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">{hotels[0].name}</h3>
              <StatusBadge status={hotels[0].status} />
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" /> {hotels[0].city}</p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 font-semibold text-amber-600"><Star className="size-4 fill-amber-500 text-amber-500" /> {hotels[0].rating}</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Users className="size-4" /> {hotels[0].capacity} guests capacity</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A breathtaking cliff-top resort offering world-class service, private villas and panoramic ocean views — the perfect base for an unforgettable Bali getaway.</p>
            <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Facilities</p>
            <div className="flex flex-wrap gap-2">
              {facilities.map((f) => (
                <span key={f.label} className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground"><f.icon className="size-3.5 text-primary" /> {f.label}</span>
              ))}
            </div>
            <div className="mt-4 flex h-24 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-blue-50 to-sky-50 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> Location map preview</span>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="All Hotels" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Hotel</th>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium">Rating</th>
                <th className="px-5 py-3 font-medium">Capacity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((h) => (
                <tr key={h.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback src={h.image} alt={h.name} className="size-11 rounded-lg bg-muted object-cover" />
                      <span className="font-medium text-foreground">{h.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{h.city}</td>
                  <td className="px-5 py-3"><span className="inline-flex items-center gap-1 font-medium text-amber-600"><Star className="size-3.5 fill-amber-500 text-amber-500" /> {h.rating}</span></td>
                  <td className="px-5 py-3 text-foreground">{h.capacity}</td>
                  <td className="px-5 py-3"><StatusBadge status={h.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => toast.success("Edit hotel")} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"><Pencil className="size-3.5" /></button>
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
