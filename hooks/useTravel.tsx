"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { destinationImages, hotelImages, avatar } from "../lib/images";
import * as dummy from "../lib/data";

interface NewCustomerInput {
  nama_lengkap: string;
  email: string;
  no_hp: string;
  tanggal_lahir: string;
  kota: string;
  kode_pos: string;
}

interface TravelContextType {
  customers: typeof dummy.customers;
  packages: typeof dummy.packages;
  departures: typeof dummy.departures;
  bookings: typeof dummy.bookings;
  payments: typeof dummy.payments;
  refunds: typeof dummy.refunds;
  destinations: typeof dummy.destinations;
  hotels: typeof dummy.hotels;
  transports: typeof dummy.transports;
  guides: typeof dummy.guides;
  promotions: typeof dummy.promotions;
  activityLogs: typeof dummy.activityLogs;
  dashboardStats: typeof dummy.dashboardStats;
  revenueData: typeof dummy.revenueData;
  bookingTrend: typeof dummy.bookingTrend;
  destinationShare: typeof dummy.destinationShare;
  customerGrowth: typeof dummy.customerGrowth;
  recentActivities: typeof dummy.recentActivities;
  topPackages: typeof dummy.topPackages;
  bookingSummary: typeof dummy.bookingSummary;
  kotaList: { kota_id: number; nama_kota: string }[];
  loading: boolean;
  error: any;
  refreshData: () => Promise<void>;
  addCustomer: (data: NewCustomerInput) => Promise<{ error: any | null }>;
  updateCustomer: (pelangganId: number, data: Partial<NewCustomerInput>) => Promise<{ error: any | null }>;
  deleteCustomer: (pelangganId: number) => Promise<{ error: any | null }>;
}

const TravelDataContext = createContext<TravelContextType | undefined>(undefined);

export function TravelDataProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<typeof dummy.customers>(dummy.customers);
  const [packages, setPackages] = useState<typeof dummy.packages>(dummy.packages);
  const [departures, setDepartures] = useState<typeof dummy.departures>(dummy.departures);
  const [bookings, setBookings] = useState<typeof dummy.bookings>(dummy.bookings);
  const [payments, setPayments] = useState<typeof dummy.payments>(dummy.payments);
  const [refunds, setRefunds] = useState<typeof dummy.refunds>(dummy.refunds);
  const [destinations, setDestinations] = useState<typeof dummy.destinations>(dummy.destinations);
  const [hotels, setHotels] = useState<typeof dummy.hotels>(dummy.hotels);
  const [transports, setTransports] = useState<typeof dummy.transports>(dummy.transports);
  const [guides, setGuides] = useState<typeof dummy.guides>(dummy.guides);
  const [promotions, setPromotions] = useState<typeof dummy.promotions>(dummy.promotions);
  const [activityLogs, setActivityLogs] = useState<typeof dummy.activityLogs>(dummy.activityLogs);
  const [kotaList, setKotaList] = useState<{ kota_id: number; nama_kota: string }[]>([]);

  // Dashboards / Analytics states
  const [dashboardStats, setDashboardStats] = useState<typeof dummy.dashboardStats>(dummy.dashboardStats);
  const [revenueData, setRevenueData] = useState<typeof dummy.revenueData>(dummy.revenueData);
  const [bookingTrend, setBookingTrend] = useState<typeof dummy.bookingTrend>(dummy.bookingTrend);
  const [destinationShare, setDestinationShare] = useState<typeof dummy.destinationShare>(dummy.destinationShare);
  const [customerGrowth, setCustomerGrowth] = useState<typeof dummy.customerGrowth>(dummy.customerGrowth);
  const [recentActivities, setRecentActivities] = useState<typeof dummy.recentActivities>(dummy.recentActivities);
  const [topPackages, setTopPackages] = useState<typeof dummy.topPackages>(dummy.topPackages);
  const [bookingSummary, setBookingSummary] = useState<typeof dummy.bookingSummary>(dummy.bookingSummary);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const helperMapDestinationImage = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("bali")) return destinationImages.bali;
    if (lower.includes("lombok")) return destinationImages.lombok;
    if (lower.includes("bajo") || lower.includes("komodo")) return destinationImages.labuanBajo;
    if (lower.includes("bromo")) return destinationImages.bromo;
    if (lower.includes("borobudur") || lower.includes("prambanan") || lower.includes("candi")) return destinationImages.borobudur;
    if (lower.includes("jogja") || lower.includes("yogyakarta") || lower.includes("heritage")) return destinationImages.yogyakarta;
    if (lower.includes("bandung")) return destinationImages.bandung;
    return destinationImages.bali; // default fallback
  };

  const helperMapHotelImage = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("ayana")) return hotelImages.ayana;
    if (lower.includes("mulia")) return hotelImages.mulia;
    if (lower.includes("padma")) return hotelImages.padma;
    if (lower.includes("alila")) return hotelImages.alila;
    if (lower.includes("plataran")) return hotelImages.plataran;
    return hotelImages.ayana;
  };

  const refreshData = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        console.error("[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Please set these in your .env.local file.");
        setError(new Error("Supabase credentials are missing"));
        setLoading(false);
        return;
      }

      setLoading(true);
      const supabase = createClient();

      // Fetch all tables in parallel
      const [
        resPelanggan,
        resPaket,
        resDestinasi,
        resHotel,
        resTransportasi,
        resPemandu,
        resPromo,
        resBooking,
        resPembayaran,
        resRefund,
        resJadwal,
        resAudit,
        resKota
      ] = await Promise.all([
        supabase.from("m_pelanggan").select("*, ref_kota(nama_kota)"),
        supabase.from("m_paket_wisata").select("*, ref_kategori_wisata(nama_kategori)"),
        supabase.from("m_destinasi").select("*, ref_kota(nama_kota, ref_provinsi(nama_provinsi))"),
        supabase.from("m_hotel").select("*, ref_kota(nama_kota)"),
        supabase.from("m_transportasi").select("*"),
        supabase.from("m_pemandu").select("*"),
        supabase.from("m_promo").select("*"),
        supabase.from("t_booking").select("*, m_pelanggan(nama_lengkap), t_jadwal_keberangkatan(tanggal_berangkat, m_paket_wisata(nama_paket)), ref_status_booking(nama_status)"),
        supabase.from("t_pembayaran").select("*, ref_metode_pembayaran(nama_metode)"),
        supabase.from("t_refund").select("*"),
        supabase.from("t_jadwal_keberangkatan").select("*, m_paket_wisata(nama_paket), m_pemandu(nama_pemandu), m_transportasi(nama_armada)"),
        supabase.from("t_log_audit").select("*").order("waktu_log", { ascending: false }).limit(20),
        supabase.from("ref_kota").select("kota_id, nama_kota").order("nama_kota")
      ]);

      // Update kota list for dropdowns
      if (resKota.data && resKota.data.length > 0) {
        setKotaList(resKota.data.map((k: any) => ({ kota_id: k.kota_id, nama_kota: k.nama_kota })));
      }

      if (resPelanggan.error || resPaket.error) {
        console.error("[Supabase] Error loading data from Supabase:", {
          pelangganError: resPelanggan.error,
          paketError: resPaket.error
        });
        setError(resPelanggan.error || resPaket.error);
        setLoading(false);
        return;
      }

      const dbPelanggan = resPelanggan.data || [];
      const dbPaket = resPaket.data || [];
      const dbDestinasi = resDestinasi.data || [];
      const dbHotel = resHotel.data || [];
      const dbTransport = resTransportasi.data || [];
      const dbPemandu = resPemandu.data || [];
      const dbPromo = resPromo.data || [];
      const dbBooking = resBooking.data || [];
      const dbPembayaran = resPembayaran.data || [];
      const dbRefund = resRefund.data || [];
      const dbJadwal = resJadwal.data || [];
      const dbAudit = resAudit.data || [];

      // Helper function to extract destination keyword from a name
      const extractDestinationKeyword = (name: string): string => {
        const lower = name.toLowerCase();
        if (lower.includes("bali")) return "Bali";
        if (lower.includes("bromo")) return "Bromo";
        if (lower.includes("bajo") || lower.includes("komodo")) return "Labuan Bajo";
        if (lower.includes("raja ampat")) return "Raja Ampat";
        if (lower.includes("jogja") || lower.includes("yogyakarta") || lower.includes("borobudur") || lower.includes("prambanan")) return "Yogyakarta";
        if (lower.includes("lombok")) return "Lombok";
        if (lower.includes("bandung")) return "Bandung";
        if (lower.includes("jakarta")) return "Jakarta";
        return "Other";
      };

      // 1. Map Destinations
      const mappedDestinations = dbDestinasi.map((d: any) => ({
        id: `DST-${String(d.destinasi_id).padStart(2, "0")}`,
        name: d.nama_destinasi,
        province: d.ref_kota?.ref_provinsi?.nama_provinsi || "Jawa",
        category: "Beach & Culture",
        popularity: 80 + (d.destinasi_id % 20),
        status: "Active",
        image: helperMapDestinationImage(d.nama_destinasi)
      }));
      setDestinations(mappedDestinations.length > 0 ? mappedDestinations : dummy.destinations);

      // 2. Map Packages
      const mappedPackages = dbPaket.map((p: any) => {
        const dest = extractDestinationKeyword(p.nama_paket);
        return {
          id: `PKG-${String(p.paket_id).padStart(3, "0")}`,
          name: p.nama_paket,
          category: p.ref_kategori_wisata?.nama_kategori || "Adventure",
          destination: dest,
          price: Number(p.harga_dasar),
          duration: `${p.durasi_hari}D${p.durasi_hari > 1 ? p.durasi_hari - 1 : 0}N`,
          quota: 20,
          booked: dbBooking.filter((b: any) => b.t_jadwal_keberangkatan?.paket_id === p.paket_id).length,
          rating: 4.5 + (p.paket_id % 5) * 0.1,
          reviews: 120 + (p.paket_id % 10) * 15,
          status: p.is_aktif ? "Active" : "Draft",
          image: helperMapDestinationImage(p.nama_paket),
          description: p.deskripsi || ""
        };
      });
      setPackages(mappedPackages.length > 0 ? mappedPackages : dummy.packages);

      // 3. Map Customers
      const mappedCustomers = dbPelanggan.map((c: any) => {
        const custBookings = dbBooking.filter((b: any) => b.pelanggan_id === c.pelanggan_id);
        const lastBookDate = custBookings.length > 0 
          ? new Date(Math.max(...custBookings.map((b: any) => new Date(b.tanggal_booking).getTime()))).toISOString().split("T")[0]
          : (c.created_at ? new Date(c.created_at).toISOString().split("T")[0] : "2026-01-01");
        
        return {
          id: `CST-${c.pelanggan_id}`,
          name: c.nama_lengkap,
          email: c.email,
          phone: c.no_hp || "-",
          city: c.ref_kota?.nama_kota || "Jakarta",
          bookings: custBookings.length,
          lastBooking: lastBookDate,
          status: custBookings.length > 5 ? "VIP" : custBookings.length > 0 ? "Active" : "Inactive",
          joined: c.created_at ? new Date(c.created_at).toISOString().split("T")[0] : "2026-01-01",
          avatar: avatar(c.nama_lengkap)
        };
      });
      setCustomers(mappedCustomers.length > 0 ? mappedCustomers : dummy.customers);

      // 4. Map Bookings
      const mappedBookings = dbBooking.map((b: any) => {
        const payment = dbPembayaran.find((p: any) => p.booking_id === b.booking_id);
        const pName = b.t_jadwal_keberangkatan?.m_paket_wisata?.nama_paket || "Tour Package";
        return {
          id: b.kode_booking,
          customer: b.m_pelanggan?.nama_lengkap || "Guest",
          package: pName,
          destination: extractDestinationKeyword(pName),
          date: b.t_jadwal_keberangkatan?.tanggal_berangkat || new Date(b.tanggal_booking).toISOString().split("T")[0],
          participants: b.jumlah_peserta,
          amount: Number(b.total_harga || 0),
          status: b.ref_status_booking?.nama_status || "Pending",
          method: payment?.ref_metode_pembayaran?.nama_metode || "Bank Transfer",
          avatar: avatar(b.m_pelanggan?.nama_lengkap || "Guest")
        };
      });
      setBookings(mappedBookings.length > 0 ? mappedBookings : dummy.bookings);

      // 5. Map Departures
      const mappedDepartures = dbJadwal.map((j: any) => ({
        id: `DEP-${j.jadwal_id}`,
        package: j.m_paket_wisata?.nama_paket || "Tour Package",
        guide: j.m_pemandu?.nama_pemandu || "No Guide Assigned",
        transport: j.m_transportasi?.nama_armada || "Self Transport",
        date: j.tanggal_berangkat,
        quota: j.kuota,
        remaining: j.sisa_kuota,
        status: j.sisa_kuota === 0 ? "Full" : (new Date(j.tanggal_berangkat) > new Date() ? "Open" : "Scheduled")
      }));
      setDepartures(mappedDepartures.length > 0 ? mappedDepartures : dummy.departures);

      // 6. Map Hotels
      const mappedHotels = dbHotel.map((h: any) => ({
        id: `HTL-${String(h.hotel_id).padStart(2, "0")}`,
        name: h.nama_hotel,
        city: h.ref_kota?.nama_kota || "Bali",
        rating: Number(h.bintang || 3),
        capacity: 100 + (h.hotel_id * 50),
        status: "Active",
        image: helperMapHotelImage(h.nama_hotel)
      }));
      setHotels(mappedHotels.length > 0 ? mappedHotels : dummy.hotels);

      // 7. Map Transports
      const mappedTransports = dbTransport.map((t: any) => ({
        id: `TRP-${String(t.transportasi_id).padStart(2, "0")}`,
        type: t.jenis_transportasi,
        name: t.nama_armada || "Minivan",
        capacity: t.kapasitas,
        status: "Active",
        availability: t.transportasi_id % 3 === 0 ? "Maintenance" : "Available"
      }));
      setTransports(mappedTransports.length > 0 ? mappedTransports : dummy.transports);

      // 8. Map Guides
      const mappedGuides = dbPemandu.map((g: any) => ({
        id: `GD-${String(g.pemandu_id).padStart(2, "0")}`,
        name: g.nama_pemandu,
        region: g.pemandu_id % 2 === 0 ? "Bali" : "Yogyakarta",
        languages: "EN, ID",
        rating: Number(g.rating || 4.5),
        tours: 50 + g.pemandu_id * 12,
        status: "Active",
        avatar: avatar(g.nama_pemandu)
      }));
      setGuides(mappedGuides.length > 0 ? mappedGuides : dummy.guides);

      // 9. Map Promotions
      const mappedPromotions = dbPromo.map((p: any) => ({
        id: `PRM-${String(p.promo_id).padStart(2, "0")}`,
        code: p.kode_promo,
        discount: `${Number(p.persentase_diskon)}%`,
        period: `${new Date(p.tanggal_mulai).toLocaleDateString("id-ID")} - ${new Date(p.tanggal_berakhir).toLocaleDateString("id-ID")}`,
        used: 120 + (p.promo_id * 20),
        limit: 1000,
        status: new Date(p.tanggal_berakhir) < new Date() ? "Expired" : "Active"
      }));
      setPromotions(mappedPromotions.length > 0 ? mappedPromotions : dummy.promotions);

      // 10. Map Activity Logs
      const mappedLogs = dbAudit.map((l: any) => ({
        id: `LOG-${l.log_id}`,
        user: "Admin Travel",
        action: l.keterangan || `${l.aksi} on ${l.nama_tabel}`,
        module: l.nama_tabel || "System",
        date: l.waktu_log ? new Date(l.waktu_log).toLocaleString() : "2026-06-25 12:00",
        status: l.aksi === "DELETE" ? "Warning" : (l.aksi === "INSERT" ? "Success" : "Info"),
        avatar: avatar("Admin Travel")
      }));
      setActivityLogs(mappedLogs.length > 0 ? mappedLogs : dummy.activityLogs);

      // 11. Payments & Refunds
      const mappedPayments = dbPembayaran.map((p: any) => ({
        id: `TRX-${p.pembayaran_id}`,
        booking: dbBooking.find((b: any) => b.booking_id === p.booking_id)?.kode_booking || `BK-${p.booking_id}`,
        customer: dbPelanggan.find((cust: any) => cust.pelanggan_id === (dbBooking.find((b: any) => b.booking_id === p.booking_id)?.pelanggan_id))?.nama_lengkap || "Guest",
        method: p.ref_metode_pembayaran?.nama_metode || "Bank Transfer",
        amount: Number(p.jumlah_bayar),
        date: p.tanggal_bayar ? new Date(p.tanggal_bayar).toISOString().split("T")[0] : "2026-06-25",
        status: p.status_bayar === "Success" ? "Success" : (p.status_bayar === "Pending" ? "Pending" : "Failed")
      }));
      setPayments(mappedPayments.length > 0 ? mappedPayments : dummy.payments);

      const mappedRefunds = dbRefund.map((r: any) => {
        const payment = dbPembayaran.find((p: any) => p.pembayaran_id === r.pembayaran_id);
        const booking = dbBooking.find((b: any) => b.booking_id === payment?.booking_id);
        const customer = dbPelanggan.find((c: any) => c.pelanggan_id === booking?.pelanggan_id);
        return {
          id: `RFD-${r.refund_id}`,
          booking: booking?.kode_booking || `BK-${payment?.booking_id}`,
          customer: customer?.nama_lengkap || "Customer",
          amount: Number(r.jumlah_refund),
          reason: r.alasan || "Trip cancelled",
          date: r.tanggal_refund ? new Date(r.tanggal_refund).toISOString().split("T")[0] : "2026-06-25",
          status: "Approved"
        };
      });
      setRefunds(mappedRefunds.length > 0 ? mappedRefunds : dummy.refunds);

      // ---------- Calculate Dashboards & Analytics ----------
      const totalCustCount = mappedCustomers.length > 0 ? mappedCustomers.length : 12840;
      const totalBookingsCount = mappedBookings.length > 0 ? mappedBookings.length : 3127;
      
      const successPaymentsTotal = dbPembayaran
        .filter((p: any) => p.status_bayar === "Success" || p.status_bayar === "Confirmed")
        .reduce((sum: number, p: any) => sum + Number(p.jumlah_bayar), 0);
      
      const monthlyRevenueStr = successPaymentsTotal > 0
        ? "Rp " + (successPaymentsTotal / 1e9).toFixed(2) + "B"
        : "Rp 4.82B";
      
      const activePackagesCount = mappedPackages.filter(p => p.status === "Active").length;
      const upcomingDeparturesCount = mappedDepartures.filter(d => d.status === "Open" || d.status === "Scheduled").length;
      
      const pendingPaymentsTotal = dbPembayaran
        .filter((p: any) => p.status_bayar === "Pending")
        .reduce((sum: number, p: any) => sum + Number(p.jumlah_bayar), 0);
      
      const pendingPaymentsStr = pendingPaymentsTotal > 0
        ? "Rp " + (pendingPaymentsTotal / 1e6).toFixed(0) + "M"
        : "Rp 612M";

      setDashboardStats([
        { id: "customers", label: "Total Customers", value: totalCustCount.toLocaleString(), delta: "+8.2%", trend: "up", icon: "Users", color: "#2563EB" },
        { id: "bookings", label: "Total Bookings", value: totalBookingsCount.toLocaleString(), delta: "+12.5%", trend: "up", icon: "Ticket", color: "#0EA5E9" },
        { id: "revenue", label: "Monthly Revenue", value: monthlyRevenueStr, delta: "+18.9%", trend: "up", icon: "Wallet", color: "#22C55E" },
        { id: "packages", label: "Active Tour Packages", value: activePackagesCount.toString(), delta: "+4", trend: "up", icon: "Package", color: "#F59E0B" },
        { id: "departures", label: "Upcoming Departures", value: upcomingDeparturesCount.toString(), delta: "Next 30 days", trend: "neutral", icon: "Plane", color: "#8B5CF6" },
        { id: "pending", label: "Pending Payments", value: pendingPaymentsStr, delta: "-3.1%", trend: "down", icon: "Clock", color: "#EF4444" },
      ]);

      // Revenue Monthly Data
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyDataMap: Record<string, number> = {};
      dbPembayaran.forEach((p: any) => {
        if (p.status_bayar === "Success") {
          const date = p.tanggal_bayar ? new Date(p.tanggal_bayar) : new Date();
          const monthStr = monthNames[date.getMonth()];
          monthlyDataMap[monthStr] = (monthlyDataMap[monthStr] || 0) + (Number(p.jumlah_bayar) / 1e6);
        }
      });
      const generatedRevenueData = monthNames.map((m, i) => ({
        month: m,
        revenue: Math.round(monthlyDataMap[m] || (2500 + i * 300)), // fallback trend line
        target: Math.round((monthlyDataMap[m] || (2500 + i * 300)) * 0.95)
      }));
      setRevenueData(generatedRevenueData);

      // Booking Trend
      const trendDataMap: Record<string, { bookings: number; cancelled: number }> = {};
      
      monthNames.forEach((m) => {
        trendDataMap[m] = { bookings: 0, cancelled: 0 };
      });

      dbBooking.forEach((b: any) => {
        const date = b.tanggal_booking ? new Date(b.tanggal_booking) : new Date();
        const monthStr = monthNames[date.getMonth()];

        const ID_STATUS_BATAL = 3; 

        if (b.status_id === ID_STATUS_BATAL) {
          trendDataMap[monthStr].cancelled++;
        } else {
          trendDataMap[monthStr].bookings++;
        }
      });

      const generatedBookingTrend = monthNames.map((m) => ({
        month: m,
        bookings: trendDataMap[m].bookings,
        cancelled: trendDataMap[m].cancelled
      }));

      setBookingTrend(generatedBookingTrend);

      // Destination Share
      const destCounts: Record<string, number> = {};
      let totalValidBookings = 0;

      mappedBookings.forEach((b) => {

        const destName = b.destination || "Other";
        
        destCounts[destName] = (destCounts[destName] || 0) + 1;
        totalValidBookings++;
      });

      const colors = ["#2563EB", "#0EA5E9", "#F59E0B", "#22C55E", "#8B5CF6", "#EC4899"];
      
      const generatedDestShare = Object.keys(destCounts).map((name, i) => {
        const shareValue = totalValidBookings > 0 
          ? Math.round((destCounts[name] / totalValidBookings) * 100) 
          : 0;

        return {
          name,
          value: shareValue,
          color: colors[i % colors.length]
        };
      })

      .sort((a, b) => b.value - a.value);

      if (mappedBookings.length > 0) {
        setDestinationShare(generatedDestShare);
      } else {
        setDestinationShare(dummy.destinationShare);
      }

      // Customer Growth
      const custMonthCounts: Record<string, number> = {};
      
      dbPelanggan.forEach((c: any) => {
        if (c.created_at) {
          const date = new Date(c.created_at);
          const monthStr = monthNames[date.getMonth()];
          custMonthCounts[monthStr] = (custMonthCounts[monthStr] || 0) + 1;
        }
      });

      let cumCust = 0;
      const generatedCustGrowth = monthNames.map((m) => {
        const monthlyCount = custMonthCounts[m] || 0;
        cumCust += monthlyCount;
        
        return {
          month: m,
          customers: cumCust
        };
      });

      if (dbPelanggan.length > 0) {
        setCustomerGrowth(generatedCustGrowth);
      } else {
        setCustomerGrowth(dummy.customerGrowth);
      }

      // Top Packages
      const pkgSales: Record<string, { sales: number; revenue: number; image: string }> = {};
      mappedBookings.forEach(b => {
        if (!pkgSales[b.package]) {
          pkgSales[b.package] = { sales: 0, revenue: 0, image: helperMapDestinationImage(b.package) };
        }
        pkgSales[b.package].sales += b.participants;
        pkgSales[b.package].revenue += b.amount;
      });
      const generatedTopPackages = Object.keys(pkgSales)
        .map(name => ({
          name,
          sales: pkgSales[name].sales,
          revenue: pkgSales[name].revenue >= 1e9
            ? "Rp " + (pkgSales[name].revenue / 1e9).toFixed(1) + "B"
            : "Rp " + (pkgSales[name].revenue / 1e6).toFixed(0) + "M",
          image: pkgSales[name].image
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 4);
      setTopPackages(generatedTopPackages.length > 0 ? generatedTopPackages : dummy.topPackages);

      // Booking Summary calculation
      const pendingCount = mappedBookings.filter(b => b.status === "Pending" || b.status === "pending").length;
      const confirmedCount = mappedBookings.filter(b => b.status === "Confirmed" || b.status === "confirmed").length;
      const completedCount = mappedBookings.filter(b => b.status === "Completed" || b.status === "completed").length;
      const cancelledCount = mappedBookings.filter(b => b.status === "Cancelled" || b.status === "cancelled").length;
      setBookingSummary([
        { id: "pending", label: "Pending", value: pendingCount, color: "#F59E0B" },
        { id: "confirmed", label: "Confirmed", value: confirmedCount, color: "#2563EB" },
        { id: "completed", label: "Completed", value: completedCount, color: "#22C55E" },
        { id: "cancelled", label: "Cancelled", value: cancelledCount, color: "#EF4444" },
      ]);

      // Recent activities list
      const activities: typeof dummy.recentActivities = [];
      mappedBookings.slice(0, 3).forEach((b, idx) => {
        activities.push({
          id: `act-b-${idx}`,
          text: `New booking from ${b.customer} for ${b.package}`,
          time: `${idx * 15 + 5} min ago`,
          type: "booking"
        });
      });
      mappedPayments.slice(0, 2).forEach((p, idx) => {
        activities.push({
          id: `act-p-${idx}`,
          text: `Payment of Rp ${(p.amount / 1e6).toFixed(1)}M confirmed for ${p.booking}`,
          time: `${idx * 20 + 24} min ago`,
          type: "payment"
        });
      });
      setRecentActivities(activities.length > 0 ? activities : dummy.recentActivities);

    } catch (err) {
      console.error("[Supabase] Failed to fetch live data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (data: NewCustomerInput): Promise<{ error: any | null }> => {
    try {
      const supabase = createClient();

      // Build insert payload — omit null/empty optional fields
      const payload: Record<string, any> = {
        nama_lengkap: data.nama_lengkap,
        email: data.email,
      };
      if (data.no_hp) payload.no_hp = data.no_hp;
      if (data.tanggal_lahir) payload.tanggal_lahir = data.tanggal_lahir;
      // kota & kode_pos are informational; stored in notes if DB is extended later

      const { error } = await supabase.from("m_pelanggan").insert([payload]);
      if (error) {
        console.error("[Supabase] Failed to insert customer:", error);
        return { error };
      }

      // Refresh customer list after successful insert
      await refreshData();
      return { error: null };
    } catch (err) {
      console.error("[Supabase] addCustomer exception:", err);
      return { error: err };
    }
  };

  const updateCustomer = async (pelangganId: number, data: Partial<NewCustomerInput>): Promise<{ error: any | null }> => {
    try {
      const supabase = createClient();
      const payload: Record<string, any> = {};
      if (data.nama_lengkap !== undefined) payload.nama_lengkap = data.nama_lengkap;
      if (data.email !== undefined) payload.email = data.email;
      if (data.no_hp !== undefined) payload.no_hp = data.no_hp;
      if (data.tanggal_lahir !== undefined) payload.tanggal_lahir = data.tanggal_lahir || null;

      const { error } = await supabase.from("m_pelanggan").update(payload).eq("pelanggan_id", pelangganId);
      if (error) { console.error("[Supabase] updateCustomer error:", error); return { error }; }
      await refreshData();
      return { error: null };
    } catch (err) {
      console.error("[Supabase] updateCustomer exception:", err);
      return { error: err };
    }
  };

  const deleteCustomer = async (pelangganId: number): Promise<{ error: any | null }> => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("m_pelanggan").delete().eq("pelanggan_id", pelangganId);
      if (error) { console.error("[Supabase] deleteCustomer error:", error); return { error }; }
      await refreshData();
      return { error: null };
    } catch (err) {
      console.error("[Supabase] deleteCustomer exception:", err);
      return { error: err };
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <TravelDataContext.Provider
      value={{
        customers,
        packages,
        departures,
        bookings,
        payments,
        refunds,
        destinations,
        hotels,
        transports,
        guides,
        promotions,
        activityLogs,
        dashboardStats,
        revenueData,
        bookingTrend,
        destinationShare,
        customerGrowth,
        recentActivities,
        topPackages,
        bookingSummary,
        kotaList,
        loading,
        error,
        refreshData,
        addCustomer,
        updateCustomer,
        deleteCustomer
      }}
    >
      {children}
    </TravelDataContext.Provider>
  );
}

export function useTravel() {
  const context = useContext(TravelDataContext);
  if (context === undefined) {
    throw new Error("useTravel must be used within a TravelDataProvider");
  }
  return context;
}
