"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, LogOut, ChevronsUpDown } from "lucide-react";
import { navSections } from "../../lib/nav";
import { avatar } from "../../lib/images";
import { cn } from "../ui/utils";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
          <Plane className="size-5 -rotate-45" />
        </div>
        <div className="leading-none">
          <p className="text-lg font-bold tracking-tight text-foreground">TravelGo</p>
          <p className="text-[11px] text-muted-foreground">Booking Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {navSections.map((section, i) => (
          <div key={section.title ?? `top-${i}`}>
            {section.title && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("size-[18px]", isActive && "text-primary")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile card */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-2.5">
          <img src={avatar("Admin Travel")} alt="Admin Travel" className="size-9 rounded-lg bg-card" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-foreground">Admin Travel</p>
            <p className="truncate text-xs text-muted-foreground">Super Admin</p>
          </div>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </div>
        <Link
          href="/login"
          className="mt-1.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="size-[18px]" /> Sign Out
        </Link>
      </div>
    </aside>
  );
}

