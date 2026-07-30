"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, History, Settings, TrendingUp, Camera } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "Scan History", icon: History },
  { href: "/dashboard/preferences", label: "Preferences", icon: Settings },
  { href: "/dashboard/trends", label: "Trends", icon: TrendingUp },
];

export default function AuthSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card">
      <div className="sticky top-[72px] flex h-[calc(100vh-72px)] flex-col p-4">
        <Link
          href="/scan"
          className="mb-4 flex items-center gap-2 rounded-lg bg-accent-cyan/10 px-3 py-2.5 text-sm font-medium text-accent-cyan transition-colors hover:bg-accent-cyan/20"
        >
          <Camera className="h-4 w-4" />
          New Scan
        </Link>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
