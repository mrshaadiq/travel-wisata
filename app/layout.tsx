import type { Metadata } from "next";
import { Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { TravelDataProvider } from "@/hooks/useTravel";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Aircare - Booking Management",
  description: "Aircare Travel & Wisata Booking Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", "font-sans", notoSans.variable, playfairDisplayHeading.variable)}>
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <TravelDataProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </TravelDataProvider>
      </body>
    </html>
  );
}
