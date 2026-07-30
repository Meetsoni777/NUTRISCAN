"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getScanHistory } from "@/lib/api/products";
import { deleteScan } from "@/lib/api/scan";
import type { ScanHistoryItem } from "@/lib/types";
import { toast } from "sonner";
import { Camera, Trash2, Search, ChevronLeft, ChevronRight, ScanLine } from "lucide-react";

function getScoreColor(s: number) { return s >= 75 ? "#7BAE6F" : s >= 50 ? "#D1A24A" : "#C4614F"; }
function getVerdictConfig(v: string) {
  switch (v) {
    case "healthy": return { label: "Healthy", bg: "bg-verdict-healthy-bg", text: "text-verdict-healthy-text", dot: "bg-verdict-healthy" };
    case "moderate": return { label: "Moderate", bg: "bg-verdict-moderate-bg", text: "text-verdict-moderate-text", dot: "bg-verdict-moderate" };
    case "avoid": return { label: "Avoid", bg: "bg-verdict-avoid-bg", text: "text-verdict-avoid-text", dot: "bg-verdict-avoid" };
    default: return { label: v, bg: "bg-surface-2", text: "text-text-secondary", dot: "bg-muted-foreground" };
  }
}

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { setLoading(true); getScanHistory(page, 10).then((r) => { setScans(r.data); setTotalPages(r.total_pages); }).catch(() => setScans([])).finally(() => setLoading(false)); }, [page]);

  const filtered = scans.filter((s) => s.product_name.toLowerCase().includes(search.toLowerCase()) && (filter === "all" || s.verdict === filter));

  const handleDelete = async (id: string) => { try { await deleteScan(id); setScans((p) => p.filter((s) => s.id !== id)); toast.success("Scan deleted"); } catch { toast.error("Failed to delete"); } };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div><h1 className="mb-1 font-voice text-[28px] font-medium">Scan History</h1><p className="text-text-secondary">Browse all your past food label scans.</p></div>
        <Link href="/scan"><Button className="bg-accent-cyan text-background hover:bg-accent-cyan-light"><Camera className="mr-2 h-4 w-4" />New Scan</Button></Link>
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" /><input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-text-tertiary focus:border-accent-cyan focus:outline-none" /></div>
        <div className="flex gap-2">
          {["all", "healthy", "moderate", "avoid"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan" : "border-border bg-surface-2 text-text-secondary hover:border-border-strong"}`}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <Card className="border-border bg-surface-1">
        <CardContent className="p-0">
          {loading ? <div className="space-y-0">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-b-0"><Skeleton className="h-9 w-9 rounded-lg" /><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-20" /><Skeleton className="ml-auto h-4 w-16" /></div>)}</div>
          : filtered.length > 0 ? (
            <div>
              <div className="flex items-center gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                <span className="w-9" /><span className="flex-1">Product</span><span className="w-24 text-center">Category</span><span className="w-16 text-center">Score</span><span className="w-24 text-center">Verdict</span><span className="w-20 text-center">Date</span><span className="w-8" />
              </div>
              {filtered.map((scan) => { const vc = getVerdictConfig(scan.verdict); return (
                <Link key={scan.id} href={`/scan-result/${scan.id}`} className="flex items-center gap-4 border-b border-border px-6 py-3.5 transition-colors last:border-b-0 hover:bg-surface-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-dark text-accent-cyan"><ScanLine className="h-4 w-4" /></div>
                  <div className="flex-1 truncate"><p className="text-sm font-medium">{scan.product_name}</p></div>
                  <span className="w-24 text-center text-xs text-text-tertiary">{scan.category}</span>
                  <span className="w-16 text-center font-data text-sm font-semibold" style={{ color: getScoreColor(scan.health_score) }}>{scan.health_score}</span>
                  <span className="w-24 text-center"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${vc.bg} ${vc.text}`}><span className={`h-1.5 w-1.5 rounded-full ${vc.dot}`} />{vc.label}</span></span>
                  <span className="w-20 text-center text-xs text-text-tertiary">{new Date(scan.scanned_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  <button onClick={(e) => { e.preventDefault(); handleDelete(scan.id); }} className="w-8 rounded p-1 text-text-tertiary transition-colors hover:text-verdict-avoid" title="Delete"><Trash2 className="h-4 w-4" /></button>
                </Link>
              );})}
            </div>
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-dark text-accent-cyan"><Camera className="h-5 w-5" /></div>
              <p className="mb-1 text-sm font-medium">No scans found</p>
              <p className="mb-4 text-xs text-text-tertiary">{search || filter !== "all" ? "Try adjusting your search" : "Scan a food label to get started"}</p>
              {!search && filter === "all" && <Link href="/scan"><Button size="sm" className="bg-accent-cyan text-background hover:bg-accent-cyan-light"><Camera className="mr-2 h-3.5 w-3.5" />Scan your first product</Button></Link>}
            </div>
          )}
        </CardContent>
      </Card>
      {totalPages > 1 && <div className="mt-4 flex items-center justify-center gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-border text-foreground"><ChevronLeft className="h-4 w-4" /></Button><span className="px-3 text-sm text-text-secondary">Page {page} of {totalPages}</span><Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="border-border text-foreground"><ChevronRight className="h-4 w-4" /></Button></div>}
    </div>
  );
}
