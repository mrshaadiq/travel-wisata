"use client";

import { useParams, useRouter } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import {
  FileText, FileSpreadsheet, FileDown, TrendingUp, Users, Ticket, MapPin,
  DollarSign, Calendar, Package, Activity,
} from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { useTravel } from "../hooks/useTravel";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";

const categories = [
  { key: "revenue", label: "Revenue Report", to: "/reports/revenue", icon: TrendingUp },
  { key: "customers", label: "Customer Report", to: "/reports/customers", icon: Users },
  { key: "bookings", label: "Booking Report", to: "/reports/bookings", icon: Ticket },
  { key: "destinations", label: "Destination Report", to: "/reports/destinations", icon: MapPin },
];

// ─── Currency formatter ───────────────────────────────────────────────────────
const fmtIDR = (n: number) =>
  n >= 1_000_000_000
    ? "Rp " + (n / 1_000_000_000).toFixed(1) + "B"
    : n >= 1_000_000
    ? "Rp " + (n / 1_000_000).toFixed(0) + "M"
    : "Rp " + n.toLocaleString("id-ID");

// ─── Summary card ─────────────────────────────────────────────────────────────
function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: color + "20", color }}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-lg font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export function Reports() {
  const params = useParams();
  const type = (params?.type as string) || "revenue";
  const router = useRouter();
  const {
    revenueData,
    bookingTrend,
    customerGrowth,
    destinationShare,
    topPackages,
    bookings,
    customers,
    payments,
    loading,
  } = useTravel();

  const active = categories.find((c) => c.key === type) ?? categories[0];

  // ── Derived summary numbers ──────────────────────────────────────────────
  const totalRevenue = payments
    .filter((p) => p.status === "Success")
    .reduce((s, p) => s + p.amount, 0);

  const totalBookings = bookings.length;
  const totalCustomers = customers.length;
  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  const confirmedBookings = bookings.filter(
    (b) => b.status === "Confirmed" || b.status === "Completed"
  ).length;
  const conversionRate =
    totalBookings > 0
      ? ((confirmedBookings / totalBookings) * 100).toFixed(1)
      : "0.0";

  // ── Export helpers ───────────────────────────────────────────────────────

  /** CSV export for current report type */
  const handleCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (active.key === "revenue") {
      headers = ["Month", "Revenue (Juta)", "Target (Juta)"];
      rows = revenueData.map((r) => [r.month, r.revenue, r.target]);
    } else if (active.key === "customers") {
      headers = ["Month", "Cumulative Customers"];
      rows = customerGrowth.map((c) => [c.month, c.customers]);
    } else if (active.key === "bookings") {
      headers = ["Month", "Bookings", "Cancelled"];
      rows = bookingTrend.map((b) => [b.month, b.bookings, b.cancelled]);
    } else if (active.key === "destinations") {
      headers = ["Destination", "Share (%)"];
      rows = destinationShare.map((d) => [d.name, d.value]);
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${active.key}-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`CSV report untuk "${active.label}" berhasil diunduh`);
  };

  /** Excel export using SheetJS (xlsx) */
  const handleExcel = async () => {
    try {
      // Dynamic import so server-side bundle stays small
      const XLSX = await import("xlsx");

      const wb = XLSX.utils.book_new();

      const addSheet = (name: string, data: Record<string, unknown>[]) => {
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, name);
      };

      if (active.key === "revenue") {
        addSheet("Revenue", revenueData.map((r) => ({
          Bulan: r.month,
          "Revenue (Juta Rp)": r.revenue,
          "Target (Juta Rp)": r.target,
        })));
        addSheet("Top Packages", topPackages.map((p) => ({
          "Nama Paket": p.name,
          "Total Sales": p.sales,
          Revenue: p.revenue,
        })));
      } else if (active.key === "customers") {
        addSheet("Customer Growth", customerGrowth.map((c) => ({
          Bulan: c.month,
          "Jumlah Kumulatif": c.customers,
        })));
        addSheet("Customer List", customers.slice(0, 500).map((c) => ({
          ID: c.id,
          Nama: c.name,
          Email: c.email,
          Kota: c.city,
          Bookings: c.bookings,
          "Last Booking": c.lastBooking,
          Status: c.status,
        })));
      } else if (active.key === "bookings") {
        addSheet("Booking Trend", bookingTrend.map((b) => ({
          Bulan: b.month,
          Bookings: b.bookings,
          Cancelled: b.cancelled,
        })));
        addSheet("Booking List", bookings.slice(0, 500).map((b) => ({
          ID: b.id,
          Customer: b.customer,
          Paket: b.package,
          Destinasi: b.destination,
          Tanggal: b.date,
          Peserta: b.participants,
          "Total (Rp)": b.amount,
          Status: b.status,
          Metode: b.method,
        })));
      } else if (active.key === "destinations") {
        addSheet("Destination Share", destinationShare.map((d) => ({
          Destinasi: d.name,
          "Share (%)": d.value,
        })));
      }

      XLSX.writeFile(wb, `${active.key}-report.xlsx`);
      toast.success(`Excel report untuk "${active.label}" berhasil diunduh`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengekspor Excel");
    }
  };

  /** PDF via browser print dialog — inject print-specific styles */
  const handlePDF = () => {
    const reportTitle = active.label;
    const printDate = new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Build a simple table string for the active report
    let tableHTML = "";

    if (active.key === "revenue") {
      tableHTML = `
        <table>
          <thead><tr><th>Bulan</th><th>Revenue (Juta Rp)</th><th>Target (Juta Rp)</th></tr></thead>
          <tbody>
            ${revenueData.map((r) => `<tr><td>${r.month}</td><td>${r.revenue.toLocaleString("id-ID")}</td><td>${r.target.toLocaleString("id-ID")}</td></tr>`).join("")}
          </tbody>
        </table>`;
    } else if (active.key === "customers") {
      tableHTML = `
        <table>
          <thead><tr><th>Bulan</th><th>Jumlah Kumulatif</th></tr></thead>
          <tbody>
            ${customerGrowth.map((c) => `<tr><td>${c.month}</td><td>${c.customers}</td></tr>`).join("")}
          </tbody>
        </table>`;
    } else if (active.key === "bookings") {
      tableHTML = `
        <table>
          <thead><tr><th>Bulan</th><th>Bookings</th><th>Cancelled</th></tr></thead>
          <tbody>
            ${bookingTrend.map((b) => `<tr><td>${b.month}</td><td>${b.bookings}</td><td>${b.cancelled}</td></tr>`).join("")}
          </tbody>
        </table>`;
    } else if (active.key === "destinations") {
      tableHTML = `
        <table>
          <thead><tr><th>Destinasi</th><th>Share (%)</th></tr></thead>
          <tbody>
            ${destinationShare.map((d) => `<tr><td>${d.name}</td><td>${d.value}%</td></tr>`).join("")}
          </tbody>
        </table>`;
    }

    const win = window.open("", "_blank");
    if (!win) {
      toast.error("Pop-up diblokir. Izinkan pop-up di browser Anda.");
      return;
    }
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${reportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 32px; color: #111; }
            h1 { font-size: 22px; margin-bottom: 4px; }
            .subtitle { color: #555; font-size: 13px; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { background: #2563EB; color: #fff; padding: 8px 12px; text-align: left; font-size: 13px; }
            td { padding: 7px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            tr:nth-child(even) td { background: #f8fafc; }
            .footer { margin-top: 32px; font-size: 11px; color: #888; }
          </style>
        </head>
        <body>
          <h1>Travel Wisata — ${reportTitle}</h1>
          <p class="subtitle">Dicetak pada: ${printDate} | Total data: ${
      active.key === "revenue"
        ? revenueData.length + " bulan"
        : active.key === "customers"
        ? customerGrowth.length + " bulan"
        : active.key === "bookings"
        ? bookingTrend.length + " bulan"
        : destinationShare.length + " destinasi"
    }</p>
          ${tableHTML}
          <p class="footer">Dokumen ini digenerate otomatis dari sistem Travel Wisata.</p>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    toast.success(`PDF report untuk "${active.label}" sedang dicetak`);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading reports data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Report Center"
        description="Analisis performa bisnis dan ekspor laporan detail."
        actions={
          <>
            <button
              onClick={handlePDF}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <FileText className="size-4" /> PDF
            </button>
            <button
              onClick={handleExcel}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <FileSpreadsheet className="size-4" /> Excel
            </button>
            <button
              onClick={handleCSV}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <FileDown className="size-4" /> CSV
            </button>
          </>
        }
      />

      {/* ── Report category tabs ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => router.push(c.to)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
              active.key === c.key
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:bg-muted/40"
            )}
          >
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                active.key === c.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <c.icon className="size-5" />
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                active.key === c.key ? "text-primary" : "text-foreground"
              )}
            >
              {c.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Summary KPI cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard icon={DollarSign} label="Total Revenue" value={fmtIDR(totalRevenue)} sub="Pembayaran sukses" color="#22C55E" />
        <SummaryCard icon={Ticket} label="Total Bookings" value={totalBookings.toLocaleString("id-ID")} sub={`${conversionRate}% conversion`} color="#2563EB" />
        <SummaryCard icon={Users} label="Total Pelanggan" value={totalCustomers.toLocaleString("id-ID")} sub="Terdaftar di sistem" color="#0EA5E9" />
        <SummaryCard icon={Activity} label="Avg. Booking Value" value={fmtIDR(avgBookingValue)} sub="Per transaksi" color="#8B5CF6" />
      </div>

      {/* ── Main chart + side panels ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart */}
        <Panel
          title={`${active.label} — Tren 12 Bulan`}
          description="Data langsung dari database"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={320}>
            {active.key === "revenue" ? (
              <AreaChart data={revenueData} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(v) => `${v}M`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                  formatter={(v) => [`Rp ${Number(v)}M`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#rg)" name="Revenue" />
                <Area type="monotone" dataKey="target" stroke="#22C55E" strokeWidth={2} strokeDasharray="4 4" fill="url(#tg)" name="Target" />
              </AreaChart>
            ) : active.key === "customers" ? (
              <LineChart data={customerGrowth} margin={{ left: -10, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Line type="monotone" dataKey="customers" stroke="#0EA5E9" strokeWidth={2.5} dot={{ r: 3 }} name="Pelanggan" />
              </LineChart>
            ) : active.key === "bookings" ? (
              <BarChart data={bookingTrend} margin={{ left: -10, right: 8 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="bookings" fill="#2563EB" radius={[6, 6, 0, 0]} name="Bookings" />
                <Bar dataKey="cancelled" fill="#fca5a5" radius={[6, 6, 0, 0]} name="Cancelled" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={destinationShare}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                >
                  {destinationShare.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                  formatter={(v) => [`${Number(v)}%`]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </Panel>

        {/* Side panels */}
        <div className="space-y-6">
          {/* Top selling package */}
          <Panel title="Top Selling Package">
            {topPackages && topPackages.length > 0 ? (
              <div className="space-y-3">
                {topPackages.slice(0, 4).map((pkg, idx) => (
                  <div key={pkg.name} className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{pkg.name}</p>
                      <p className="text-xs text-muted-foreground">{pkg.revenue} · {pkg.sales} peserta</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">Belum ada data penjualan.</p>
            )}
          </Panel>

          {/* Destination popularity */}
          <Panel title="Popularitas Destinasi">
            {destinationShare.length > 0 ? (
              <div className="space-y-3">
                {destinationShare.slice(0, 5).map((d) => (
                  <div key={d.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-foreground">{d.name}</span>
                      <span className="font-medium text-muted-foreground">{d.value}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(d.value * 2.5, 100)}%`, backgroundColor: d.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">Belum ada data destinasi.</p>
            )}
          </Panel>
        </div>
      </div>

      {/* ── Recent booking table ─────────────────────────────────────────── */}
      <Panel
        title="Data Booking Terkini"
        description={`${bookings.length} total booking tercatat`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Kode Booking", "Customer", "Paket", "Destinasi", "Tanggal", "Peserta", "Total", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="pb-3 pr-4 text-left text-xs font-semibold text-muted-foreground last:pr-0"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 10).map((b) => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-primary">{b.id}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{b.customer}</td>
                  <td className="max-w-[160px] truncate py-3 pr-4 text-muted-foreground">{b.package}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{b.destination}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{b.date}</td>
                  <td className="py-3 pr-4 text-center text-foreground">{b.participants}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{fmtIDR(b.amount)}</td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        b.status === "Confirmed" || b.status === "Completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : b.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    Belum ada data booking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {bookings.length > 10 && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Menampilkan 10 dari {bookings.length} booking. Gunakan ekspor untuk data lengkap.
          </p>
        )}
      </Panel>
    </>
  );
}
