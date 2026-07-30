"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/lib/api/products";
import type { AdminStats } from "@/lib/types";
import { Package, ScanLine, Users, AlertTriangle } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getAdminStats().then(setStats).catch(() => setStats(null)).finally(() => setLoading(false)); }, []);

  const statCards = [
    { title: "Total Products", value: stats?.total_products ?? "—", icon: Package, color: "text-accent-cyan" },
    { title: "Total Scans", value: stats?.total_scans ?? "—", icon: ScanLine, color: "text-verdict-healthy" },
    { title: "Total Users", value: stats?.total_users ?? "—", icon: Users, color: "text-verdict-moderate" },
    { title: "Pending Reviews", value: stats?.flagged_scans_pending ?? "—", icon: AlertTriangle, color: "text-verdict-avoid" },
  ];

  return (
    <div>
      <h1 className="mb-2 font-voice text-[28px] font-medium">Admin Dashboard</h1>
      <p className="mb-8 text-text-secondary">System overview and management.</p>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.title} className="border-border bg-surface-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-text-tertiary">{s.title}</CardTitle><s.icon className={`h-4 w-4 ${s.color}`} /></CardHeader>
            <CardContent><p className="font-data text-2xl font-semibold">{s.value}</p></CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-surface-1">
          <CardHeader><CardTitle className="text-sm">System Health</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            {[{ label: "API Status", status: "Operational" }, { label: "OCR Engine", status: "Active" }, { label: "Database", status: "Connected" }].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-surface-2 px-4 py-3"><span className="text-sm">{item.label}</span><span className="inline-flex items-center gap-1.5 text-xs font-medium text-verdict-healthy-text"><span className="h-2 w-2 rounded-full bg-verdict-healthy" />{item.status}</span></div>
            ))}
          </div></CardContent>
        </Card>
        <Card className="border-border bg-surface-1">
          <CardHeader><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            <a href="/admin/products" className="flex items-center justify-between rounded-lg bg-surface-2 px-4 py-3 transition-colors hover:bg-surface-3"><span className="text-sm">Manage Products</span><span className="text-xs text-accent-cyan">View</span></a>
            <a href="/admin/flagged-scans" className="flex items-center justify-between rounded-lg bg-surface-2 px-4 py-3 transition-colors hover:bg-surface-3"><span className="text-sm">Review Flagged Scans</span><span className="text-xs text-accent-cyan">View</span></a>
            <a href="/admin/scoring-rules" className="flex items-center justify-between rounded-lg bg-surface-2 px-4 py-3 transition-colors hover:bg-surface-3"><span className="text-sm">Configure Scoring Rules</span><span className="text-xs text-accent-cyan">View</span></a>
          </div></CardContent>
        </Card>
      </div>
    </div>
  );
}
