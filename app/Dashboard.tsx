import { useRouter } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import {
  Users, Ticket, Wallet, Package, Plane, Clock, ArrowRight, Star,
  CreditCard, Heart, RotateCcw, UserPlus, MapPin,
} from "lucide-react";
import { StatCard } from "../components/shared/StatCard";
import { Panel } from "../components/shared/Panel";
import { StatusBadge } from "../components/shared/StatusBadge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  dashboardStats, revenueData, bookingTrend, destinationShare,
  departures, recentActivities, topPackages, bookings, formatIDR, destinations,
} from "../lib/data";
import { heroImages } from "../lib/images";

const iconMap = { Users, Ticket, Wallet, Package, Plane, Clock } as const;
const activityIcon = { booking: Ticket, payment: CreditCard, package: Package, refund: RotateCcw, customer: UserPlus } as const;

export function Dashboard() {
  const router = useRouter();

  return (
    <>
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900">
        <ImageWithFallback src={heroImages.dashboard} alt="Travel landscape" className="absolute inset-0 size-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/60 to-transparent" />
        <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="text-white">
            <p className="text-sm font-medium text-blue-100">Wednesday, 24 June 2026</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Welcome Back, Admin 👋</h1>
            <p className="mt-1 max-w-md text-blue-100">Monitor all business performance today and keep your travelers happy.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push("/bookings")} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50">
              View Bookings
            </button>
            <button onClick={() => router.push("/reports/revenue")} className="rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25">
              Reports
            </button>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardStats.map((s) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            delta={s.delta}
            trend={s.trend as "up" | "down" | "neutral"}
            icon={iconMap[s.icon as keyof typeof iconMap]}
            color={s.color}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Revenue Overview" description="Monthly revenue vs target (in millions IDR)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData} margin={{ left: -10, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#rev)" name="Revenue" />
              <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" fill="none" name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Popular Destinations" description="Booking share by destination">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={destinationShare} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {destinationShare.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} formatter={(v) => `${v}%`} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Booking Trend" description="Confirmed vs cancelled bookings" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bookingTrend} margin={{ left: -10, right: 8, top: 8 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} cursor={{ fill: "#f1f5f9" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="bookings" fill="#2563EB" radius={[6, 6, 0, 0]} name="Bookings" />
              <Bar dataKey="cancelled" fill="#fca5a5" radius={[6, 6, 0, 0]} name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Recent Activities">
          <div className="space-y-4">
            {recentActivities.map((a) => {
              const Icon = activityIcon[a.type as keyof typeof activityIcon] ?? Heart;
              return (
                <div key={a.id} className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Upcoming tours table */}
      <Panel
        title="Upcoming Tours"
        description="Departures scheduled in the coming weeks"
        action={
          <button onClick={() => router.push("/departures")} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="size-4" />
          </button>
        }
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Package</th>
                <th className="px-5 py-3 font-medium">Guide</th>
                <th className="px-5 py-3 font-medium">Departure</th>
                <th className="px-5 py-3 font-medium">Seats</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {departures.slice(0, 5).map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3 font-medium text-foreground">{d.package}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.guide}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-5 py-3">
                    <span className="text-foreground">{d.quota - d.remaining}</span>
                    <span className="text-muted-foreground">/{d.quota}</span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Top Selling Packages">
          <div className="space-y-3">
            {topPackages.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-4 text-sm font-bold text-muted-foreground">{i + 1}</span>
                <ImageWithFallback src={p.image} alt={p.name} className="size-11 rounded-lg bg-muted object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sales} sales</p>
                </div>
                <span className="text-sm font-semibold text-foreground">{p.revenue}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Popular Destinations">
          <div className="space-y-3">
            {destinations.slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <ImageWithFallback src={d.image} alt={d.name} className="size-11 rounded-lg bg-muted object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{d.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {d.province}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                  <Star className="size-3.5 fill-amber-500 text-amber-500" /> {d.popularity}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Latest Transactions">
          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-center gap-3">
                <img src={b.avatar} alt={b.customer} className="size-9 rounded-full bg-muted" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{b.customer}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.package}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{formatIDR(b.amount)}</p>
                  <StatusBadge status={b.status} className="mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
