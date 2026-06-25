"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Globe, Moon, Sun, Menu, ChevronDown, Settings, User, LogOut } from "lucide-react";
import { avatar } from "../../lib/images";
import { createClient } from "../../utils/supabase/client";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "../ui/popover";

const notifications = [
  { id: 1, title: "New booking received", desc: "Indah Permata booked Labuan Bajo Sailing", time: "8m", unread: true },
  { id: 2, title: "Payment confirmed", desc: "Rp 35.6M for BK-20260614", time: "24m", unread: true },
  { id: 3, title: "Refund approved", desc: "RFD-3201 for Budi Santoso", time: "3h", unread: false },
];

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("EN");
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState({ name: "Admin Travel", email: "admin@travelgo.id" });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Query the profile from m_admin table
        const { data: adminData } = await supabase
          .from("m_admin")
          .select("nama_lengkap")
          .eq("admin_id", user.id)
          .single();

        setProfile({
          name: adminData?.nama_lengkap || user.user_metadata?.nama_lengkap || user.email?.split("@")[0] || "User",
          email: user.email || "",
        });
      }
    }
    loadProfile();
  }, [supabase]);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-6">
      <button onClick={onMenu} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden">
        <Menu className="size-5" />
      </button>

      {/* Search */}
      <div className="relative hidden flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search bookings, customers, packages..."
          className="h-10 w-full max-w-md rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-card"
        />
      </div>
      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-1">
        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground outline-none hover:bg-muted">
            <Globe className="size-[18px]" /> {lang} <ChevronDown className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {["EN", "ID", "JP"].map((l) => (
              <DropdownMenuItem key={l} onClick={() => setLang(l)}>
                {l === "EN" ? "English" : l === "ID" ? "Bahasa Indonesia" : "日本語"}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Toggle theme">
          {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        </button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger className="relative rounded-lg p-2 text-muted-foreground outline-none hover:bg-muted">
            <Bell className="size-[18px]" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-card" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="font-semibold">Notifications</p>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">2 new</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="flex gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-muted/50">
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-transparent"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 text-sm font-medium text-primary hover:bg-muted/50">View all notifications</button>
          </PopoverContent>
        </Popover>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 flex items-center gap-2 rounded-lg p-1 pr-2 outline-none hover:bg-muted">
            <img src={avatar(profile.name)} alt="Admin" className="size-8 rounded-lg bg-muted" />
            <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="font-semibold">{profile.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{profile.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="size-4" /> My Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}><Settings className="size-4" /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
              <LogOut className="size-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
