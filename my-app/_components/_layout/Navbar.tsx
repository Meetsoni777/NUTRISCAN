"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, LogOut, LayoutDashboard, Shield } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/scan", label: "Scan" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "?";

  const visibleLinks = navLinks.filter(
    (link) => !link.authOnly || isAuthenticated
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/72 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center">
          <Image src="/nlogo.png" alt="NutriScan Logo" width={40} height={40} className="h-50 w-10 rounded-md object-contain" />
           
        <h1 className="text-2xl font-heading leading-none w-10 m-3">
          <span className="text-white">NUTRI</span>
          <span className="text-sky-400">SCAN</span>
        </h1>
        </Link>

        <nav className="hidden items-center gap-9 text-[15px] font-semibold md:flex" aria-label="Primary">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3.5 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none transition-all hover:ring-2 hover:ring-accent-cyan/40">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent-dark text-xs text-accent-cyan">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => (window.location.href = "/dashboard")} className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => (window.location.href = "/admin")} className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-all hover:bg-muted">
                Login
              </Link>
              <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-accent-cyan px-4 text-sm font-semibold text-background transition-all hover:bg-accent-cyan-light">
                Register
              </Link>
            </>
          )}
        </div>

        <button className="flex items-center p-2 text-foreground md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <span className="text-lg">✕</span> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {visibleLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-[15px] font-semibold text-muted-foreground transition-colors hover:text-foreground" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <hr className="border-border" />
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-[15px] font-semibold text-muted-foreground" onClick={() => setOpen(false)}>Dashboard</Link>
                {isAdmin && <Link href="/admin" className="text-[15px] font-semibold text-muted-foreground" onClick={() => setOpen(false)}>Admin</Link>}
                <button onClick={() => { logout(); setOpen(false); }} className="text-left text-[15px] font-semibold text-destructive">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[15px] font-semibold text-muted-foreground" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/register" className="text-[15px] font-semibold text-accent-cyan" onClick={() => setOpen(false)}>Sign up</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
