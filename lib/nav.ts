import {
  LayoutDashboard, Users, Heart, Package, CalendarClock, MapPin, Building2,
  Bus, UserCheck, Ticket, CreditCard, RotateCcw, TrendingUp, BarChart3,
  PieChart, BadgePercent, ScrollText, Settings, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}
export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  { items: [{ label: "Dashboard", to: "/dashboard", icon: LayoutDashboard }] },
  {
    title: "Customers",
    items: [
      { label: "Customers", to: "/customers", icon: Users },
      { label: "Wishlist", to: "/wishlist", icon: Heart },
    ],
  },
  {
    title: "Tour Management",
    items: [
      { label: "Tour Packages", to: "/packages", icon: Package },
      { label: "Departure Schedule", to: "/departures", icon: CalendarClock },
      { label: "Destinations", to: "/destinations", icon: MapPin },
      { label: "Hotels", to: "/hotels", icon: Building2 },
      { label: "Transportation", to: "/transportation", icon: Bus },
      { label: "Tour Guides", to: "/guides", icon: UserCheck },
    ],
  },
  {
    title: "Transactions",
    items: [
      { label: "Bookings", to: "/bookings", icon: Ticket },
      { label: "Payments", to: "/payments", icon: CreditCard },
      { label: "Refunds", to: "/refunds", icon: RotateCcw },
    ],
  },
  {
    title: "Reports",
    items: [
      { label: "Revenue Report", to: "/reports/revenue", icon: TrendingUp },
      { label: "Customer Report", to: "/reports/customers", icon: BarChart3 },
      { label: "Booking Report", to: "/reports/bookings", icon: PieChart },
    ],
  },
  {
    title: "Marketing",
    items: [{ label: "Promotions", to: "/promotions", icon: BadgePercent }],
  },
  {
    title: "System",
    items: [
      { label: "Activity Logs", to: "/logs", icon: ScrollText },
      { label: "Settings", to: "/settings", icon: Settings },
    ],
  },
];
