import { Plus, Bus, Ship, Truck, Car, Users, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { StatusBadge } from "../components/shared/StatusBadge";
import { transports } from "../lib/data";
import { toast } from "sonner";

const typeIcon: Record<string, typeof Bus> = {
  Minivan: Car, Boat: Ship, Speedboat: Ship, "Off-road": Truck, Bus: Bus,
};

export function Transportation() {
  const total = transports.length;
  const available = transports.filter((t) => t.availability === "Available").length;
  const onTrip = transports.filter((t) => t.availability === "On Trip").length;

  return (
    <>
      <PageHeader
        title="Transportation Management"
        description="Manage your fleet of vehicles and availability."
        actions={
          <button onClick={() => toast.success("Add vehicle form opened")} className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"><Plus className="size-4" /> Add Vehicle</button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <Stat label="Total Fleet" value={total} color="#2563EB" />
        <Stat label="Available" value={available} color="#22C55E" />
        <Stat label="On Trip" value={onTrip} color="#F59E0B" />
      </div>

      <Panel title="Fleet Overview" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Vehicle Name</th>
                <th className="px-5 py-3 font-medium">Capacity</th>
                <th className="px-5 py-3 font-medium">Availability</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {transports.map((t) => {
                const Icon = typeIcon[t.type] ?? Bus;
                return (
                  <tr key={t.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600"><Icon className="size-4" /></span>
                        <span className="text-foreground">{t.type}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">{t.name}</td>
                    <td className="px-5 py-3"><span className="inline-flex items-center gap-1 text-muted-foreground"><Users className="size-3.5" /> {t.capacity}</span></td>
                    <td className="px-5 py-3"><StatusBadge status={t.availability} /></td>
                    <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => toast.success("Edit vehicle")} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"><Pencil className="size-3.5" /></button>
                        <button onClick={() => toast.error("Vehicle removed")} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600"><Trash2 className="size-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}
