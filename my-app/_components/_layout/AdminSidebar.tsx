"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Flag, Sliders, ArrowLeft } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/flagged-scans", label: "Flagged Scans", icon: Flag },
  { href: "/admin/scoring-rules", label: "Scoring Rules", icon: Sliders },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card">
      <div className="sticky top-[72px] flex h-[calc(100vh-72px)] flex-col p-4">
        <Link href="/dashboard" className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">Admin</div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
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
