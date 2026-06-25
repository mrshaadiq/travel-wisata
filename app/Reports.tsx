import { useParams, useRouter } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { FileText, FileSpreadsheet, FileDown, TrendingUp, Users, Ticket, MapPin } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  revenueData, bookingTrend, customerGrowth, destinationShare, topPackages,
} from "../lib/data";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";

const categories = [
  { key: "revenue", label: "Revenue Report", to: "/reports/revenue", icon: TrendingUp },
  { key: "customers", label: "Customer Report", to: "/reports/customers", icon: Users },
  { key: "bookings", label: "Booking Report", to: "/reports/bookings", icon: Ticket },
  { key: "destinations", label: "Destination Report", to: "/reports/destinations", icon: MapPin },
];

export function Reports() {
  const params = useParams();
  const type = (params?.type as string) || "revenue";
  const router = useRouter();
  const active = categories.find((c) => c.key === type) ?? categories[0];

  return (
    <>
      <PageHeader
        title="Report Center"
        description="Analyze business performance and export detailed reports."
        actions={
          <>
            <DownloadBtn icon={FileText} label="PDF" />
            <DownloadBtn icon={FileSpreadsheet} label="Excel" />
            <DownloadBtn icon={FileDown} label="CSV" />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => router.push(c.to)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
              active.key === c.key ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40"
            )}
          >
            <span className={cn("flex size-10 items-center justify-center rounded-xl", active.key === c.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}><c.icon className="size-5" /></span>
            <span className={cn("text-sm font-semibold", active.key === c.key ? "text-primary" : "text-foreground")}>{c.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title={`${active.label} Growth`} description="Last 12 months trend" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={320}>
            {active.key === "revenue" ? (
              <AreaChart data={revenueData} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#rg)" />
              </AreaChart>
            ) : active.key === "customers" ? (
              <LineChart data={customerGrowth} margin={{ left: -10, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Line type="monotone" dataKey="customers" stroke="#0EA5E9" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            ) : active.key === "bookings" ? (
              <BarChart data={bookingTrend} margin={{ left: -10, right: 8 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} cursor={{ fill: "#f1f5f9" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="bookings" fill="#2563EB" radius={[6, 6, 0, 0]} name="Bookings" />
                <Bar dataKey="cancelled" fill="#fca5a5" radius={[6, 6, 0, 0]} name="Cancelled" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie data={destinationShare} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {destinationShare.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} formatter={(v) => `${v}%`} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </Panel>

        <div className="space-y-6">
          <Panel title="Top Selling Package">
            <div className="flex items-center gap-3">
              <ImageWithFallback src={topPackages[3].image} alt={topPackages[3].name} className="size-14 rounded-xl bg-muted object-cover" />
              <div>
                <p className="font-semibold text-foreground">{topPackages[3].name}</p>
                <p className="text-sm text-muted-foreground">{topPackages[3].revenue} · {topPackages[3].sales} sales</p>
              </div>
            </div>
          </Panel>
          <Panel title="Most Popular Destination">
            <div className="space-y-2.5">
              {destinationShare.slice(0, 4).map((d) => (
                <div key={d.name}>
                  <div className="mb-1 flex items-center justify-between text-sm"><span className="text-foreground">{d.name}</span><span className="font-medium text-muted-foreground">{d.value}%</span></div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${d.value * 2.5}%`, backgroundColor: d.color }} /></div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );

  function DownloadBtn({ icon: Icon, label }: { icon: typeof FileText; label: string }) {
    return (
      <button onClick={() => toast.success(`${label} report downloaded`)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-muted">
        <Icon className="size-4" /> {label}
      </button>
    );
  }
}
