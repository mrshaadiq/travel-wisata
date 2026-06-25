import { cn } from "../ui/utils";

// Maps any domain status string to a consistent colored pill.
const styles: Record<string, string> = {
  // positive / live
  active: "bg-green-50 text-green-700 ring-green-600/20",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-600/20",
  completed: "bg-green-50 text-green-700 ring-green-600/20",
  success: "bg-green-50 text-green-700 ring-green-600/20",
  approved: "bg-green-50 text-green-700 ring-green-600/20",
  open: "bg-blue-50 text-blue-700 ring-blue-600/20",
  available: "bg-green-50 text-green-700 ring-green-600/20",
  vip: "bg-amber-50 text-amber-700 ring-amber-600/20",
  // pending / neutral
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  scheduled: "bg-slate-100 text-slate-600 ring-slate-500/20",
  draft: "bg-slate-100 text-slate-600 ring-slate-500/20",
  paused: "bg-slate-100 text-slate-600 ring-slate-500/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  "on trip": "bg-sky-50 text-sky-700 ring-sky-600/20",
  "on leave": "bg-amber-50 text-amber-700 ring-amber-600/20",
  maintenance: "bg-amber-50 text-amber-700 ring-amber-600/20",
  // negative
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
  expired: "bg-slate-100 text-slate-500 ring-slate-500/20",
  refunded: "bg-purple-50 text-purple-700 ring-purple-600/20",
  inactive: "bg-slate-100 text-slate-500 ring-slate-500/20",
  unavailable: "bg-red-50 text-red-700 ring-red-600/20",
  full: "bg-red-50 text-red-700 ring-red-600/20",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase();
  const dot: Record<string, string> = {
    active: "bg-green-500", confirmed: "bg-blue-500", completed: "bg-green-500",
    success: "bg-green-500", pending: "bg-amber-500", cancelled: "bg-red-500",
    failed: "bg-red-500", open: "bg-blue-500", full: "bg-red-500",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[key] ?? "bg-slate-100 text-slate-600 ring-slate-500/20",
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot[key] ?? "bg-current opacity-60")} />
      {status}
    </span>
  );
}
