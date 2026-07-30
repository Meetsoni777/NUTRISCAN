"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/api/products";
import type { ScanHistoryItem } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus, ScanLine } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from "recharts";

function getScoreColor(s: number) { return s >= 75 ? "#7BAE6F" : s >= 50 ? "#D1A24A" : "#C4614F"; }
const COLORS = ["#17BEE0", "#7BAE6F", "#D1A24A", "#C4614F", "#3FCDE8", "#E08D7C"];

export default function TrendsPage() {
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getDashboardStats().then((r) => setScans(r.recent_scans)).catch(() => setScans([])).finally(() => setLoading(false)); }, []);

  const scoreOverTime = scans.slice().reverse().map((s, i) => ({ scan: i + 1, score: s.health_score, name: s.product_name.slice(0, 15) }));
  const categoryCounts = scans.reduce((acc, s) => { const c = s.category || "Other"; acc[c] = (acc[c] || 0) + 1; return acc; }, {} as Record<string, number>);
  const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
  const verdictCounts = scans.reduce((acc, s) => { acc[s.verdict] = (acc[s.verdict] || 0) + 1; return acc; }, {} as Record<string, number>);
  const avgScore = scans.length > 0 ? Math.round(scans.reduce((sum, s) => sum + s.health_score, 0) / scans.length) : 0;

  return (
    <div>
      <h1 className="mb-2 font-voice text-[28px] font-medium">Nutrition Trends</h1>
      <p className="mb-8 text-text-secondary">Track your nutrition patterns over time.</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-surface-1"><CardContent className="p-5"><div className="flex items-center justify-between"><p className="text-sm text-text-tertiary">Average Score</p><TrendingUp className="h-4 w-4 text-accent-cyan" /></div><p className="mt-1 font-data text-2xl font-semibold" style={{ color: getScoreColor(avgScore) }}>{loading ? "—" : avgScore}</p></CardContent></Card>
        <Card className="border-border bg-surface-1"><CardContent className="p-5"><div className="flex items-center justify-between"><p className="text-sm text-text-tertiary">Total Scans</p><ScanLine className="h-4 w-4 text-accent-cyan" /></div><p className="mt-1 font-data text-2xl font-semibold">{loading ? "—" : scans.length}</p></CardContent></Card>
        <Card className="border-border bg-surface-1"><CardContent className="p-5"><div className="flex items-center justify-between"><p className="text-sm text-text-tertiary">Trend</p>{scans.length >= 2 ? (scans[scans.length - 1].health_score > scans[scans.length - 2].health_score ? <TrendingUp className="h-4 w-4 text-verdict-healthy" /> : scans[scans.length - 1].health_score < scans[scans.length - 2].health_score ? <TrendingDown className="h-4 w-4 text-verdict-avoid" /> : <Minus className="h-4 w-4 text-verdict-moderate" />) : <Minus className="h-4 w-4 text-text-tertiary" />}</div><p className="mt-1 font-data text-2xl font-semibold text-text-secondary">{scans.length >= 2 ? (scans[scans.length - 1].health_score - scans[scans.length - 2].health_score > 0 ? `+${scans[scans.length - 1].health_score - scans[scans.length - 2].health_score}` : scans[scans.length - 1].health_score - scans[scans.length - 2].health_score) : "—"}</p></CardContent></Card>
      </div>

      {loading ? <div className="grid gap-6 md:grid-cols-2">{Array.from({ length: 2 }).map((_, i) => <Card key={i} className="border-border bg-surface-1"><CardContent className="flex h-[300px] items-center justify-center"><div className="text-center text-sm text-text-tertiary">Loading...</div></CardContent></Card>)}</div>
      : scans.length === 0 ? <Card className="border-border bg-surface-1"><CardContent className="flex h-[300px] flex-col items-center justify-center"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-dark text-accent-cyan"><TrendingUp className="h-5 w-5" /></div><p className="mb-1 text-sm font-medium">No data yet</p><p className="text-xs text-text-tertiary">Scan some food labels to see your nutrition trends</p></CardContent></Card>
      : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border bg-surface-1">
            <CardHeader><CardTitle className="text-sm">Health Score Over Time</CardTitle></CardHeader>
            <CardContent><div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={scoreOverTime}><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#17BEE0" stopOpacity={0.3} /><stop offset="95%" stopColor="#17BEE0" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#1E2228" vertical={false} /><XAxis dataKey="scan" tick={{ fontSize: 11, fill: "#6E7580" }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6E7580" }} axisLine={false} tickLine={false} width={30} /><Tooltip contentStyle={{ background: "#171A1F", border: "1px solid #262B33", borderRadius: "10px", fontSize: "12px", color: "#F3F5F7" }} /><Area type="monotone" dataKey="score" stroke="#17BEE0" strokeWidth={2} fill="url(#sg)" /></AreaChart></ResponsiveContainer></div></CardContent>
          </Card>
          <Card className="border-border bg-surface-1">
            <CardHeader><CardTitle className="text-sm">Categories Scanned</CardTitle></CardHeader>
            <CardContent><div className="h-[250px]">{categoryData.length > 0 ? <ResponsiveContainer width="100%" height="100%"><BarChart data={categoryData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#1E2228" horizontal={false} /><XAxis type="number" tick={{ fontSize: 11, fill: "#6E7580" }} axisLine={false} tickLine={false} allowDecimals={false} /><YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6E7580" }} axisLine={false} tickLine={false} width={80} /><Tooltip contentStyle={{ background: "#171A1F", border: "1px solid #262B33", borderRadius: "10px", fontSize: "12px", color: "#F3F5F7" }} /><Bar dataKey="count" radius={[0, 4, 4, 0]}>{categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % 6]} />)}</Bar></BarChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-text-tertiary">No data</div>}</div></CardContent>
          </Card>
          <Card className="border-border bg-surface-1">
            <CardHeader><CardTitle className="text-sm">Verdict Breakdown</CardTitle></CardHeader>
            <CardContent><div className="space-y-4">
              {[{ label: "Healthy", count: verdictCounts["healthy"] || 0, color: "#7BAE6F", bg: "#16211A" }, { label: "Moderate", count: verdictCounts["moderate"] || 0, color: "#D1A24A", bg: "#241D10" }, { label: "Avoid", count: verdictCounts["avoid"] || 0, color: "#C4614F", bg: "#26140F" }].map((item) => { const pct = scans.length > 0 ? Math.round((item.count / scans.length) * 100) : 0; return (
                <div key={item.label}><div className="mb-1.5 flex items-center justify-between"><span className="text-sm font-medium">{item.label}</span><span className="font-data text-xs text-text-tertiary">{item.count} ({pct}%)</span></div><div className="h-2 overflow-hidden rounded-full" style={{ background: item.bg }}><div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: item.color }} /></div></div>
              );})}
            </div></CardContent>
          </Card>
          <Card className="border-border bg-surface-1">
            <CardHeader><CardTitle className="text-sm">Recent Scores</CardTitle></CardHeader>
            <CardContent><div className="space-y-3">{scans.slice(-5).reverse().map((s) => (<div key={s.id} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2"><div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full" style={{ background: getScoreColor(s.health_score) }} /><span className="text-sm">{s.product_name}</span></div><span className="font-data text-sm font-semibold" style={{ color: getScoreColor(s.health_score) }}>{s.health_score}</span></div>))}</div></CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
