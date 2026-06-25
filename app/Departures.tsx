import { Plus, ChevronLeft, ChevronRight, CalendarClock } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { StatusBadge } from "../components/shared/StatusBadge";
import { useTravel } from "../hooks/useTravel";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";

// Build July 2026 grid. July 1 2026 is a Wednesday (index 3).
const FIRST_WEEKDAY = 3;
const DAYS_IN_MONTH = 31;

export function Departures() {
  const { departures, loading } = useTravel();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading departures schedule...</p>
        </div>
      </div>
    );
  }

  const departuresByDay = departures.reduce<Record<number, typeof departures>>((acc, d) => {
    const day = new Date(d.date).getDate();
    if (new Date(d.date).getMonth() === 6) (acc[day] = acc[day] || []).push(d);
    return acc;
  }, {});

  const cells: (number | null)[] = [
    ...Array(FIRST_WEEKDAY).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];


  return (
    <>
      <PageHeader
        title="Departure Schedule"
        description="Plan and track upcoming tour departures."
        actions={
          <button onClick={() => toast.success("New departure scheduled")} className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
            <Plus className="size-4" /> Schedule Departure
          </button>
        }
      />

      <Panel
        title="July 2026"
        action={
          <div className="flex items-center gap-1">
            <button className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted"><ChevronLeft className="size-4" /></button>
            <button className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted"><ChevronRight className="size-4" /></button>
          </div>
        }
      >
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{d}</div>
          ))}
          {cells.map((day, i) => {
            const events = day ? departuresByDay[day] : undefined;
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[84px] rounded-lg border p-1.5 text-left",
                  day ? "border-border bg-card" : "border-transparent",
                  events && "ring-1 ring-primary/30"
                )}
              >
                {day && <span className="text-xs font-medium text-muted-foreground">{day}</span>}
                <div className="mt-1 space-y-1">
                  {events?.map((e) => (
                    <div key={e.id} className="truncate rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary" title={e.package}>
                      {e.package}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Departure List" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Tour Package</th>
                <th className="px-5 py-3 font-medium">Guide</th>
                <th className="px-5 py-3 font-medium">Transportation</th>
                <th className="px-5 py-3 font-medium">Departure Date</th>
                <th className="px-5 py-3 font-medium">Quota</th>
                <th className="px-5 py-3 font-medium">Remaining</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {departures.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><CalendarClock className="size-4" /></span>
                      <span className="font-medium text-foreground">{d.package}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{d.guide}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.transport}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-5 py-3 text-foreground">{d.quota}</td>
                  <td className="px-5 py-3">
                    <span className={cn("font-medium", d.remaining === 0 ? "text-red-600" : d.remaining <= 5 ? "text-amber-600" : "text-green-600")}>{d.remaining} seats</span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
