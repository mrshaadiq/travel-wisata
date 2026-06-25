import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "../ui/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: string;
}

export function StatCard({ label, value, delta, trend = "neutral", icon: Icon, color = "#2563EB" }: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div
          className="flex size-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon className="size-5" />
        </div>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
              trend === "up" && "bg-green-50 text-green-600",
              trend === "down" && "bg-red-50 text-red-600",
              trend === "neutral" && "bg-slate-100 text-slate-500"
            )}
          >
            {trend === "up" && <ArrowUpRight className="size-3" />}
            {trend === "down" && <ArrowDownRight className="size-3" />}
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-[26px] font-bold leading-tight tracking-tight text-foreground">{value}</p>
    </div>
  );
}
