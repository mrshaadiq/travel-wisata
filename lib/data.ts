import { destinationImages } from "./images";

export type Status = string;

// Type templates for TypeScript compilation (without actual dummy data)
export const dashboardStats: { id: string; label: string; value: string; delta: string; trend: string; icon: string; color: string }[] = [];
export const revenueData: { month: string; revenue: number; target: number }[] = [];
export const bookingTrend: { month: string; bookings: number; cancelled: number }[] = [];
export const destinationShare: { name: string; value: number; color: string }[] = [];
export const customerGrowth: { month: string; customers: number }[] = [];

export interface CustomerType {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  bookings: number;
  lastBooking: string;
  status: string;
  joined: string;
  avatar: string;
}
export const customers: CustomerType[] = [];

export interface PackageType {
  id: string;
  name: string;
  category: string;
  destination: string;
  price: number;
  duration: string;
  quota: number;
  booked: number;
  rating: number;
  reviews: number;
  status: string;
  image: string;
  description: string;
}
export const packages: PackageType[] = [];

export const itinerary = [
  { day: "Day 1", title: "Arrival & Welcome Dinner", detail: "Airport pickup, hotel check-in at Ubud, welcome dinner with traditional Balinese gamelan performance." },
  { day: "Day 2", title: "Temple & Rice Terrace Tour", detail: "Visit Tegalalang Rice Terrace, Tirta Empul Temple, and a traditional coffee plantation." },
  { day: "Day 3", title: "Beach & Water Activities", detail: "Snorkeling at Nusa Penida, Kelingking Beach viewpoint, and sunset at Tanah Lot." },
  { day: "Day 4", title: "Shopping & Departure", detail: "Free time at Seminyak, souvenir shopping, and airport transfer for departure." },
];

export interface DepartureType {
  id: string;
  package: string;
  guide: string;
  transport: string;
  date: string;
  quota: number;
  remaining: number;
  status: string;
}
export const departures: DepartureType[] = [];

export const bookingSummary: { id: string; label: string; value: number; color: string }[] = [];

export interface BookingType {
  id: string;
  customer: string;
  package: string;
  destination: string;
  date: string;
  participants: number;
  amount: number;
  status: string;
  method: string;
  avatar: string;
}
export const bookings: BookingType[] = [];

export const paymentStats: { id: string; label: string; value: string; delta: string; trend: string; icon: string; color: string }[] = [];

export interface PaymentType {
  id: string;
  booking: string;
  customer: string;
  method: string;
  amount: number;
  date: string;
  status: string;
}
export const payments: PaymentType[] = [];

export interface RefundType {
  id: string;
  booking: string;
  customer: string;
  amount: number;
  reason: string;
  date: string;
  status: string;
}
export const refunds: RefundType[] = [];

export interface DestinationType {
  id: string;
  name: string;
  province: string;
  category: string;
  popularity: number;
  status: string;
  image: string;
}
export const destinations: DestinationType[] = [];

export interface HotelType {
  id: string;
  name: string;
  city: string;
  rating: number;
  capacity: number;
  status: string;
  image: string;
}
export const hotels: HotelType[] = [];

export interface TransportType {
  id: string;
  type: string;
  name: string;
  capacity: number;
  status: string;
  availability: string;
}
export const transports: TransportType[] = [];

export interface GuideType {
  id: string;
  name: string;
  region: string;
  languages: string;
  rating: number;
  tours: number;
  status: string;
  avatar: string;
}
export const guides: GuideType[] = [];

export interface PromotionType {
  id: string;
  code: string;
  discount: string;
  period: string;
  used: number;
  limit: number;
  status: string;
}
export const promotions: PromotionType[] = [];

export interface ActivityLogType {
  id: string;
  user: string;
  action: string;
  module: string;
  date: string;
  status: string;
  avatar: string;
}
export const activityLogs: ActivityLogType[] = [];

export const recentActivities: { id: string; text: string; time: string; type: string }[] = [];

export const topPackages: { name: string; sales: number; revenue: string; image: string }[] = [];

export const formatIDR = (n: number) =>
  "Rp " + n.toLocaleString("id-ID");
