import { destinationImages, hotelImages, avatar } from "./images";

export type Status = string;

// ---------- KPI / Dashboard stats ----------
export const dashboardStats = [
  { id: "customers", label: "Total Customers", value: "12,840", delta: "+8.2%", trend: "up", icon: "Users", color: "#2563EB" },
  { id: "bookings", label: "Total Bookings", value: "3,127", delta: "+12.5%", trend: "up", icon: "Ticket", color: "#0EA5E9" },
  { id: "revenue", label: "Monthly Revenue", value: "Rp 4.82B", delta: "+18.9%", trend: "up", icon: "Wallet", color: "#22C55E" },
  { id: "packages", label: "Active Tour Packages", value: "186", delta: "+4", trend: "up", icon: "Package", color: "#F59E0B" },
  { id: "departures", label: "Upcoming Departures", value: "42", delta: "Next 30 days", trend: "neutral", icon: "Plane", color: "#8B5CF6" },
  { id: "pending", label: "Pending Payments", value: "Rp 612M", delta: "-3.1%", trend: "down", icon: "Clock", color: "#EF4444" },
];

export const revenueData = [
  { month: "Jan", revenue: 3200, target: 3000 },
  { month: "Feb", revenue: 3500, target: 3200 },
  { month: "Mar", revenue: 3100, target: 3300 },
  { month: "Apr", revenue: 3900, target: 3500 },
  { month: "May", revenue: 4200, target: 3800 },
  { month: "Jun", revenue: 4820, target: 4000 },
  { month: "Jul", revenue: 4600, target: 4300 },
  { month: "Aug", revenue: 5100, target: 4500 },
  { month: "Sep", revenue: 4800, target: 4600 },
  { month: "Oct", revenue: 5400, target: 4800 },
  { month: "Nov", revenue: 5900, target: 5000 },
  { month: "Dec", revenue: 6500, target: 5500 },
];

export const bookingTrend = [
  { month: "Jan", bookings: 210, cancelled: 18 },
  { month: "Feb", bookings: 245, cancelled: 22 },
  { month: "Mar", bookings: 198, cancelled: 15 },
  { month: "Apr", bookings: 287, cancelled: 24 },
  { month: "May", bookings: 312, cancelled: 19 },
  { month: "Jun", bookings: 356, cancelled: 28 },
  { month: "Jul", bookings: 389, cancelled: 31 },
  { month: "Aug", bookings: 412, cancelled: 26 },
];

export const destinationShare = [
  { name: "Bali", value: 38, color: "#2563EB" },
  { name: "Raja Ampat", value: 22, color: "#0EA5E9" },
  { name: "Labuan Bajo", value: 18, color: "#F59E0B" },
  { name: "Bromo", value: 14, color: "#22C55E" },
  { name: "Others", value: 8, color: "#8B5CF6" },
];

export const customerGrowth = [
  { month: "Jan", customers: 8200 },
  { month: "Feb", customers: 8900 },
  { month: "Mar", customers: 9400 },
  { month: "Apr", customers: 10200 },
  { month: "May", customers: 11100 },
  { month: "Jun", customers: 11800 },
  { month: "Jul", customers: 12300 },
  { month: "Aug", customers: 12840 },
];

// ---------- Customers ----------
export const customers = [
  { id: "CST-1042", name: "Ayu Lestari", email: "ayu.lestari@gmail.com", phone: "+62 812-3456-7890", city: "Jakarta", bookings: 8, lastBooking: "2026-06-12", status: "Active", joined: "2024-03-11", avatar: avatar("Ayu Lestari") },
  { id: "CST-1043", name: "Budi Santoso", email: "budi.santoso@gmail.com", phone: "+62 813-9876-5432", city: "Surabaya", bookings: 3, lastBooking: "2026-05-28", status: "Active", joined: "2024-07-22", avatar: avatar("Budi Santoso") },
  { id: "CST-1044", name: "Citra Dewi", email: "citra.dewi@outlook.com", phone: "+62 821-1122-3344", city: "Bandung", bookings: 12, lastBooking: "2026-06-19", status: "VIP", joined: "2023-11-05", avatar: avatar("Citra Dewi") },
  { id: "CST-1045", name: "Dimas Pratama", email: "dimas.p@gmail.com", phone: "+62 856-7788-9900", city: "Yogyakarta", bookings: 1, lastBooking: "2026-04-02", status: "Inactive", joined: "2025-01-18", avatar: avatar("Dimas Pratama") },
  { id: "CST-1046", name: "Eka Putri", email: "eka.putri@gmail.com", phone: "+62 877-5566-1122", city: "Denpasar", bookings: 6, lastBooking: "2026-06-08", status: "Active", joined: "2024-09-30", avatar: avatar("Eka Putri") },
  { id: "CST-1047", name: "Fajar Nugroho", email: "fajar.n@yahoo.com", phone: "+62 811-2233-4455", city: "Semarang", bookings: 4, lastBooking: "2026-05-15", status: "Active", joined: "2024-12-14", avatar: avatar("Fajar Nugroho") },
  { id: "CST-1048", name: "Gita Rahmawati", email: "gita.r@gmail.com", phone: "+62 838-6677-8899", city: "Medan", bookings: 9, lastBooking: "2026-06-21", status: "VIP", joined: "2023-08-19", avatar: avatar("Gita Rahmawati") },
  { id: "CST-1049", name: "Hendra Wijaya", email: "hendra.w@gmail.com", phone: "+62 819-9988-7766", city: "Makassar", bookings: 2, lastBooking: "2026-03-27", status: "Inactive", joined: "2025-02-08", avatar: avatar("Hendra Wijaya") },
  { id: "CST-1050", name: "Indah Permata", email: "indah.permata@gmail.com", phone: "+62 812-4455-6677", city: "Jakarta", bookings: 15, lastBooking: "2026-06-23", status: "VIP", joined: "2023-05-12", avatar: avatar("Indah Permata") },
  { id: "CST-1051", name: "Joko Susilo", email: "joko.s@gmail.com", phone: "+62 813-3344-5566", city: "Solo", bookings: 5, lastBooking: "2026-06-01", status: "Active", joined: "2024-10-25", avatar: avatar("Joko Susilo") },
];

// ---------- Tour Packages ----------
export const packages = [
  { id: "PKG-001", name: "Bali Cultural Escape", category: "Cultural", destination: "Bali", price: 4500000, duration: "4D3N", quota: 20, booked: 14, rating: 4.8, reviews: 312, status: "Active", image: destinationImages.bali },
  { id: "PKG-002", name: "Raja Ampat Diving Expedition", category: "Adventure", destination: "Raja Ampat", price: 12800000, duration: "6D5N", quota: 12, booked: 9, rating: 4.9, reviews: 184, status: "Active", image: destinationImages.rajaAmpat },
  { id: "PKG-003", name: "Labuan Bajo & Komodo Sailing", category: "Adventure", destination: "Labuan Bajo", price: 8900000, duration: "5D4N", quota: 16, booked: 16, rating: 4.7, reviews: 256, status: "Full", image: destinationImages.labuanBajo },
  { id: "PKG-004", name: "Bromo Sunrise Trek", category: "Nature", destination: "Bromo", price: 2300000, duration: "3D2N", quota: 24, booked: 11, rating: 4.6, reviews: 421, status: "Active", image: destinationImages.bromo },
  { id: "PKG-005", name: "Borobudur Heritage Journey", category: "Cultural", destination: "Yogyakarta", price: 3200000, duration: "3D2N", quota: 20, booked: 7, rating: 4.5, reviews: 198, status: "Active", image: destinationImages.borobudur },
  { id: "PKG-006", name: "Lombok Beach Retreat", category: "Beach", destination: "Lombok", price: 5600000, duration: "4D3N", quota: 18, booked: 3, rating: 4.7, reviews: 143, status: "Draft", image: destinationImages.lombok },
];

export const itinerary = [
  { day: "Day 1", title: "Arrival & Welcome Dinner", detail: "Airport pickup, hotel check-in at Ubud, welcome dinner with traditional Balinese gamelan performance." },
  { day: "Day 2", title: "Temple & Rice Terrace Tour", detail: "Visit Tegalalang Rice Terrace, Tirta Empul Temple, and a traditional coffee plantation." },
  { day: "Day 3", title: "Beach & Water Activities", detail: "Snorkeling at Nusa Penida, Kelingking Beach viewpoint, and sunset at Tanah Lot." },
  { day: "Day 4", title: "Shopping & Departure", detail: "Free time at Seminyak, souvenir shopping, and airport transfer for departure." },
];

// ---------- Departures ----------
export const departures = [
  { id: "DEP-9001", package: "Bali Cultural Escape", guide: "Made Wirawan", transport: "Toyota Hiace Premio", date: "2026-07-05", quota: 20, remaining: 6, status: "Open" },
  { id: "DEP-9002", package: "Raja Ampat Diving Expedition", guide: "Yusuf Maulana", transport: "Speedboat + Liveaboard", date: "2026-07-12", quota: 12, remaining: 3, status: "Open" },
  { id: "DEP-9003", package: "Labuan Bajo & Komodo Sailing", guide: "Rina Hartati", transport: "Phinisi Boat", date: "2026-07-18", quota: 16, remaining: 0, status: "Full" },
  { id: "DEP-9004", package: "Bromo Sunrise Trek", guide: "Agus Setiawan", transport: "Jeep 4x4", date: "2026-07-22", quota: 24, remaining: 13, status: "Open" },
  { id: "DEP-9005", package: "Borobudur Heritage Journey", guide: "Sari Wulandari", transport: "Toyota Hiace", date: "2026-07-28", quota: 20, remaining: 8, status: "Open" },
  { id: "DEP-9006", package: "Bali Cultural Escape", guide: "Made Wirawan", transport: "Toyota Hiace Premio", date: "2026-08-02", quota: 20, remaining: 20, status: "Scheduled" },
];

// ---------- Bookings ----------
export const bookingSummary = [
  { id: "pending", label: "Pending", value: 86, color: "#F59E0B" },
  { id: "confirmed", label: "Confirmed", value: 214, color: "#2563EB" },
  { id: "completed", label: "Completed", value: 1842, color: "#22C55E" },
  { id: "cancelled", label: "Cancelled", value: 47, color: "#EF4444" },
];

export const bookings = [
  { id: "BK-20260612", customer: "Ayu Lestari", package: "Bali Cultural Escape", destination: "Bali", date: "2026-07-05", participants: 2, amount: 9000000, status: "Confirmed", method: "Credit Card", avatar: avatar("Ayu Lestari") },
  { id: "BK-20260613", customer: "Citra Dewi", package: "Raja Ampat Diving Expedition", destination: "Raja Ampat", date: "2026-07-12", participants: 1, amount: 12800000, status: "Pending", method: "Bank Transfer", avatar: avatar("Citra Dewi") },
  { id: "BK-20260614", customer: "Indah Permata", package: "Labuan Bajo & Komodo Sailing", destination: "Labuan Bajo", date: "2026-07-18", participants: 4, amount: 35600000, status: "Confirmed", method: "Credit Card", avatar: avatar("Indah Permata") },
  { id: "BK-20260615", customer: "Fajar Nugroho", package: "Bromo Sunrise Trek", destination: "Bromo", date: "2026-07-22", participants: 3, amount: 6900000, status: "Completed", method: "E-Wallet", avatar: avatar("Fajar Nugroho") },
  { id: "BK-20260616", customer: "Joko Susilo", package: "Borobudur Heritage Journey", destination: "Yogyakarta", date: "2026-07-28", participants: 2, amount: 6400000, status: "Pending", method: "Bank Transfer", avatar: avatar("Joko Susilo") },
  { id: "BK-20260617", customer: "Gita Rahmawati", package: "Bali Cultural Escape", destination: "Bali", date: "2026-08-02", participants: 5, amount: 22500000, status: "Confirmed", method: "Credit Card", avatar: avatar("Gita Rahmawati") },
  { id: "BK-20260618", customer: "Budi Santoso", package: "Lombok Beach Retreat", destination: "Lombok", date: "2026-08-09", participants: 2, amount: 11200000, status: "Cancelled", method: "E-Wallet", avatar: avatar("Budi Santoso") },
  { id: "BK-20260619", customer: "Eka Putri", package: "Bromo Sunrise Trek", destination: "Bromo", date: "2026-08-14", participants: 1, amount: 2300000, status: "Completed", method: "Credit Card", avatar: avatar("Eka Putri") },
];

// ---------- Payments ----------
export const paymentStats = [
  { id: "revenue", label: "Total Revenue", value: "Rp 48.2B", delta: "+18.9%", trend: "up", icon: "Wallet", color: "#22C55E" },
  { id: "pending", label: "Pending Payments", value: "Rp 612M", delta: "23 invoices", trend: "neutral", icon: "Clock", color: "#F59E0B" },
  { id: "success", label: "Successful Payments", value: "2,940", delta: "+12.5%", trend: "up", icon: "CheckCircle2", color: "#2563EB" },
  { id: "refund", label: "Refund Requests", value: "18", delta: "Rp 142M", trend: "down", icon: "RotateCcw", color: "#EF4444" },
];

export const payments = [
  { id: "TRX-58210", booking: "BK-20260612", customer: "Ayu Lestari", method: "Credit Card", amount: 9000000, date: "2026-06-12", status: "Success" },
  { id: "TRX-58211", booking: "BK-20260613", customer: "Citra Dewi", method: "Bank Transfer", amount: 12800000, date: "2026-06-13", status: "Pending" },
  { id: "TRX-58212", booking: "BK-20260614", customer: "Indah Permata", method: "Credit Card", amount: 35600000, date: "2026-06-14", status: "Success" },
  { id: "TRX-58213", booking: "BK-20260615", customer: "Fajar Nugroho", method: "E-Wallet", amount: 6900000, date: "2026-06-15", status: "Success" },
  { id: "TRX-58214", booking: "BK-20260616", customer: "Joko Susilo", method: "Bank Transfer", amount: 6400000, date: "2026-06-16", status: "Pending" },
  { id: "TRX-58215", booking: "BK-20260618", customer: "Budi Santoso", method: "E-Wallet", amount: 11200000, date: "2026-06-17", status: "Refunded" },
  { id: "TRX-58216", booking: "BK-20260617", customer: "Gita Rahmawati", method: "Credit Card", amount: 22500000, date: "2026-06-18", status: "Success" },
  { id: "TRX-58217", booking: "BK-20260619", customer: "Eka Putri", method: "Credit Card", amount: 2300000, date: "2026-06-19", status: "Failed" },
];

export const refunds = [
  { id: "RFD-3201", booking: "BK-20260618", customer: "Budi Santoso", amount: 11200000, reason: "Trip cancelled by customer", date: "2026-06-17", status: "Approved" },
  { id: "RFD-3202", booking: "BK-20260609", customer: "Hendra Wijaya", amount: 4500000, reason: "Medical emergency", date: "2026-06-10", status: "Pending" },
  { id: "RFD-3203", booking: "BK-20260604", customer: "Dimas Pratama", amount: 3200000, reason: "Schedule conflict", date: "2026-06-04", status: "Rejected" },
  { id: "RFD-3204", booking: "BK-20260601", customer: "Eka Putri", amount: 2300000, reason: "Duplicate payment", date: "2026-06-02", status: "Approved" },
];

// ---------- Destinations ----------
export const destinations = [
  { id: "DST-01", name: "Bali", province: "Bali", category: "Beach & Culture", popularity: 98, status: "Active", image: destinationImages.bali },
  { id: "DST-02", name: "Raja Ampat", province: "West Papua", category: "Diving", popularity: 92, status: "Active", image: destinationImages.rajaAmpat },
  { id: "DST-03", name: "Labuan Bajo", province: "East Nusa Tenggara", category: "Adventure", popularity: 89, status: "Active", image: destinationImages.labuanBajo },
  { id: "DST-04", name: "Bromo", province: "East Java", category: "Mountain", popularity: 85, status: "Active", image: destinationImages.bromo },
  { id: "DST-05", name: "Borobudur", province: "Central Java", category: "Heritage", popularity: 80, status: "Active", image: destinationImages.borobudur },
  { id: "DST-06", name: "Lombok", province: "West Nusa Tenggara", category: "Beach", popularity: 76, status: "Draft", image: destinationImages.lombok },
];

// ---------- Hotels ----------
export const hotels = [
  { id: "HTL-01", name: "Ayana Resort & Spa", city: "Bali", rating: 4.9, capacity: 290, status: "Active", image: hotelImages.ayana },
  { id: "HTL-02", name: "The Mulia Nusa Dua", city: "Bali", rating: 4.8, capacity: 526, status: "Active", image: hotelImages.mulia },
  { id: "HTL-03", name: "Plataran Komodo Resort", city: "Labuan Bajo", rating: 4.7, capacity: 96, status: "Active", image: hotelImages.plataran },
  { id: "HTL-04", name: "Alila Ubud", city: "Bali", rating: 4.8, capacity: 64, status: "Active", image: hotelImages.alila },
  { id: "HTL-05", name: "Padma Resort Legian", city: "Bali", rating: 4.6, capacity: 432, status: "Maintenance", image: hotelImages.padma },
];

// ---------- Transportation ----------
export const transports = [
  { id: "TRP-01", type: "Minivan", name: "Toyota Hiace Premio", capacity: 14, status: "Active", availability: "Available" },
  { id: "TRP-02", type: "Boat", name: "Phinisi Liveaboard", capacity: 16, status: "Active", availability: "On Trip" },
  { id: "TRP-03", type: "Speedboat", name: "Komodo Express", capacity: 24, status: "Active", availability: "Available" },
  { id: "TRP-04", type: "Off-road", name: "Jeep 4x4 Bromo", capacity: 6, status: "Active", availability: "Maintenance" },
  { id: "TRP-05", type: "Bus", name: "Mercedes-Benz Tourismo", capacity: 45, status: "Active", availability: "Available" },
  { id: "TRP-06", type: "Minivan", name: "Toyota Hiace Standard", capacity: 14, status: "Inactive", availability: "Unavailable" },
];

// ---------- Tour Guides ----------
export const guides = [
  { id: "GD-01", name: "Made Wirawan", region: "Bali", languages: "EN, ID, JP", rating: 4.9, tours: 184, status: "Active", avatar: avatar("Made Wirawan") },
  { id: "GD-02", name: "Yusuf Maulana", region: "Raja Ampat", languages: "EN, ID", rating: 4.8, tours: 96, status: "Active", avatar: avatar("Yusuf Maulana") },
  { id: "GD-03", name: "Rina Hartati", region: "Labuan Bajo", languages: "EN, ID, DE", rating: 4.7, tours: 142, status: "Active", avatar: avatar("Rina Hartati") },
  { id: "GD-04", name: "Agus Setiawan", region: "Bromo", languages: "EN, ID", rating: 4.6, tours: 210, status: "On Leave", avatar: avatar("Agus Setiawan") },
  { id: "GD-05", name: "Sari Wulandari", region: "Yogyakarta", languages: "EN, ID, FR", rating: 4.8, tours: 168, status: "Active", avatar: avatar("Sari Wulandari") },
];

// ---------- Promotions ----------
export const promotions = [
  { id: "PRM-01", code: "SUMMER26", discount: "25%", period: "01 Jun – 31 Aug 2026", used: 482, limit: 1000, status: "Active" },
  { id: "PRM-02", code: "EARLYBIRD", discount: "Rp 500K", period: "01 May – 30 Jun 2026", used: 213, limit: 500, status: "Active" },
  { id: "PRM-03", code: "BALI10", discount: "10%", period: "15 Jun – 15 Jul 2026", used: 97, limit: 300, status: "Active" },
  { id: "PRM-04", code: "NEWYEAR25", discount: "30%", period: "20 Dec – 05 Jan 2026", used: 640, limit: 640, status: "Expired" },
  { id: "PRM-05", code: "WEEKEND", discount: "15%", period: "Every weekend", used: 158, limit: 800, status: "Paused" },
];

// ---------- Activity Logs ----------
export const activityLogs = [
  { id: "LOG-1", user: "Admin Travel", action: "Confirmed booking BK-20260612", module: "Bookings", date: "2026-06-24 09:42", status: "Success", avatar: avatar("Admin Travel") },
  { id: "LOG-2", user: "Sari Wulandari", action: "Updated departure DEP-9005 schedule", module: "Departures", date: "2026-06-24 08:15", status: "Success", avatar: avatar("Sari Wulandari") },
  { id: "LOG-3", user: "Admin Travel", action: "Approved refund RFD-3201", module: "Refunds", date: "2026-06-23 17:30", status: "Success", avatar: avatar("Admin Travel") },
  { id: "LOG-4", user: "Finance Bot", action: "Failed payment verification TRX-58217", module: "Payments", date: "2026-06-23 14:05", status: "Failed", avatar: avatar("Finance Bot") },
  { id: "LOG-5", user: "Made Wirawan", action: "Added new package PKG-006", module: "Packages", date: "2026-06-22 11:20", status: "Success", avatar: avatar("Made Wirawan") },
  { id: "LOG-6", user: "Admin Travel", action: "Created promo SUMMER26", module: "Promotions", date: "2026-06-21 10:00", status: "Success", avatar: avatar("Admin Travel") },
  { id: "LOG-7", user: "Citra Dewi", action: "Login attempt blocked (2FA)", module: "Security", date: "2026-06-21 07:48", status: "Warning", avatar: avatar("Citra Dewi") },
];

export const recentActivities = [
  { id: "a1", text: "New booking from Indah Permata for Labuan Bajo Sailing", time: "8 min ago", type: "booking" },
  { id: "a2", text: "Payment of Rp 35.6M confirmed for BK-20260614", time: "24 min ago", type: "payment" },
  { id: "a3", text: "Raja Ampat Diving Expedition is 75% booked", time: "1 hr ago", type: "package" },
  { id: "a4", text: "Refund RFD-3201 approved for Budi Santoso", time: "3 hr ago", type: "refund" },
  { id: "a5", text: "New customer registered: Joko Susilo", time: "5 hr ago", type: "customer" },
];

export const topPackages = [
  { name: "Bali Cultural Escape", sales: 312, revenue: "Rp 1.4B", image: destinationImages.bali },
  { name: "Bromo Sunrise Trek", sales: 421, revenue: "Rp 968M", image: destinationImages.bromo },
  { name: "Labuan Bajo Sailing", sales: 256, revenue: "Rp 2.3B", image: destinationImages.labuanBajo },
  { name: "Raja Ampat Diving", sales: 184, revenue: "Rp 2.4B", image: destinationImages.rajaAmpat },
];

export const formatIDR = (n: number) =>
  "Rp " + n.toLocaleString("id-ID");
