"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/lib/api/products";
import { useAuth } from "@/lib/context/AuthContext";
import type { ScanHistoryItem } from "@/lib/types";
import { Camera, TrendingUp, History, ScanLine, ArrowUpRight, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function getScoreColor(score: number): string {
  if (score >= 75) return "#7BAE6F";
  if (score >= 50) return "#D1A24A";
  return "#C4614F";
}

function getVerdictLabel(verdict: string) {
  switch (verdict) {
    case "healthy": return { label: "Healthy", color: "#7BAE6F", bg: "#16211A" };
    case "moderate": return { label: "Moderate", color: "#D1A24A", bg: "#241D10" };
    case "avoid": return { label: "Avoid", color: "#C4614F", bg: "#26140F" };
    default: return { label: verdict, color: "#6E7580", bg: "#171A1F" };
  }
}

const COLORS = ["#7BAE6F", "#D1A24A", "#C4614F"];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ total_scans: number; avg_health_score: number; saved_scans: number; recent_scans: ScanHistoryItem[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => setStats({ total_scans: 0, avg_health_score: 0, saved_scans: 0, recent_scans: [] })).finally(() => setLoading(false));
  }, []);

  const verdictCounts = stats?.recent_scans.reduce((acc, scan) => { acc[scan.verdict] = (acc[scan.verdict] || 0) + 1; return acc; }, {} as Record<string, number>);
  const pieData = verdictCounts ? Object.entries(verdictCounts).map(([name, value]) => ({ name: getVerdictLabel(name).label, value })) : [];
  const barData = stats?.recent_scans.slice(0, 7).map((scan) => ({ name: scan.product_name.slice(0, 12), score: scan.health_score }));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 font-voice text-[28px] font-medium">Dashboard</h1>
          <p className="text-text-secondary">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! Here&apos;s your scanning overview.</p>
        </div>
        <Link href="/scan"><Button className="bg-accent-cyan text-background hover:bg-accent-cyan-light"><Camera className="mr-2 h-4 w-4" />New Scan</Button></Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {loading ? Array.from({ length: 3 }).map((_, i) => (<Card key={i} className="border-border bg-surface-1"><CardContent className="p-6"><Skeleton className="mb-2 h-4 w-24" /><Skeleton className="h-8 w-16" /></CardContent></Card>))
          : [
            { title: "Total Scans", value: stats?.total_scans ?? 0, description: "All time", icon: ScanLine, color: "text-accent-cyan" },
            { title: "Avg Health Score", value: stats?.avg_health_score ? `${Math.round(stats.avg_health_score)}` : "—", description: "Across all scans", icon: TrendingUp, color: "text-accent-cyan" },
            { title: "Saved Scans", value: stats?.saved_scans ?? 0, description: "In your history", icon: History, color: "text-verdict-moderate" },
          ].map((stat) => (
            <Card key={stat.title} className="border-border bg-surface-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-text-tertiary">{stat.title}</CardTitle><stat.icon className={`h-4 w-4 ${stat.color}`} /></CardHeader>
              <CardContent><p className="font-data text-2xl font-semibold">{stat.value}</p><p className="mt-1 text-xs text-text-tertiary">{stat.description}</p></CardContent>
            </Card>
          ))}
      </div>

      {!loading && stats && stats.recent_scans.length > 0 && (
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card className="border-border bg-surface-1">
            <CardHeader><CardTitle className="text-sm">Recent Health Scores</CardTitle></CardHeader>
            <CardContent><div className="h-[220px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={barData}><XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6E7580" }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6E7580" }} axisLine={false} tickLine={false} width={30} /><Tooltip contentStyle={{ background: "#171A1F", border: "1px solid #262B33", borderRadius: "10px", fontSize: "12px", color: "#F3F5F7" }} /><Bar dataKey="score" radius={[4, 4, 0, 0]}>{(barData ?? []).map((entry, i) => <Cell key={i} fill={getScoreColor(entry.score)} />)}</Bar></BarChart></ResponsiveContainer></div></CardContent>
          </Card>
          <Card className="border-border bg-surface-1">
            <CardHeader><CardTitle className="text-sm">Verdict Distribution</CardTitle></CardHeader>
            <CardContent><div className="flex h-[220px] items-center justify-center">{pieData.length > 0 ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: "#171A1F", border: "1px solid #262B33", borderRadius: "10px", fontSize: "12px", color: "#F3F5F7" }} /></PieChart></ResponsiveContainer> : <p className="text-sm text-text-tertiary">No data</p>}</div></CardContent>
          </Card>
        </div>
      )}

      <Card className="border-border bg-surface-1">
        <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-sm">Recent Scans</CardTitle>{stats && stats.recent_scans.length > 0 && <Link href="/dashboard/history" className="flex items-center gap-1 text-xs text-accent-cyan hover:underline">View all <ArrowUpRight className="h-3 w-3" /></Link>}</CardHeader>
        <CardContent>
          {!loading && stats && stats.recent_scans.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_scans.slice(0, 5).map((scan) => { const v = getVerdictLabel(scan.verdict); return (
                <Link key={scan.id} href={`/scan-result/${scan.id}`} className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 transition-colors hover:border-border-strong">
                  <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: v.bg }}><Sparkles className="h-4 w-4" style={{ color: v.color }} /></div><div><p className="text-sm font-medium">{scan.product_name}</p><p className="text-xs text-text-tertiary">{scan.category}</p></div></div>
                  <div className="flex items-center gap-3"><span className="font-data text-sm font-semibold" style={{ color: getScoreColor(scan.health_score) }}>{scan.health_score}</span><span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: v.bg, color: v.color }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: v.color }} />{v.label}</span></div>
                </Link>
              );})}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-dark text-accent-cyan"><Camera className="h-5 w-5" /></div>
              <p className="mb-1 text-sm font-medium">No scans yet</p>
              <p className="mb-4 text-xs text-text-tertiary">Start by scanning a food label</p>
              <Link href="/scan"><Button size="sm" className="bg-accent-cyan text-background hover:bg-accent-cyan-light"><Camera className="mr-2 h-3.5 w-3.5" />Scan your first product</Button></Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
