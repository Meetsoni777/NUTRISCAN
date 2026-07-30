"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getFlaggedScans, reviewFlaggedScan } from "@/lib/api/products";
import type { FlaggedScan } from "@/lib/types";
import { toast } from "sonner";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

export default function FlaggedScansPage() {
  const [scans, setScans] = useState<FlaggedScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { setLoading(true); getFlaggedScans(page, 10).then((r) => { setScans(r.data); setTotalPages(r.total_pages); }).catch(() => setScans([])).finally(() => setLoading(false)); }, [page]);

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    try { await reviewFlaggedScan(id, status); setScans((p) => p.map((s) => s.id === id ? { ...s, status } : s)); toast.success(`Scan ${status}`); } catch { toast.error("Failed to review"); }
  };

  return (
    <div>
      <h1 className="mb-2 font-voice text-[28px] font-medium">Flagged Scans</h1>
      <p className="mb-8 text-text-secondary">Review scans with low OCR confidence or suspicious entries.</p>
      <Card className="border-border bg-surface-1">
        <CardContent className="p-0">
          {loading ? <div className="space-y-0">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-b-0"><Skeleton className="h-10 w-10 rounded-lg" /><Skeleton className="h-4 w-48" /><Skeleton className="h-4 w-20" /><Skeleton className="ml-auto h-8 w-20 rounded" /></div>)}</div>
          : scans.length > 0 ? (
            <div>
              <div className="flex items-center gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary"><span className="w-10" /><span className="flex-1">Reason</span><span className="w-24 text-center">Confidence</span><span className="w-20 text-center">Status</span><span className="w-40 text-center">Actions</span></div>
              {scans.map((s) => (
                <div key={s.id} className="flex items-center gap-4 border-b border-border px-6 py-4 transition-colors last:border-b-0 hover:bg-surface-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-verdict-moderate-bg text-verdict-moderate"><AlertTriangle className="h-4 w-4" /></div>
                  <div className="flex-1"><p className="text-sm font-medium">{s.reason}</p><p className="mt-0.5 text-xs text-text-tertiary">{new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div>
                  <div className="w-24 text-center"><span className={`font-data text-sm font-semibold ${s.confidence_score >= 70 ? "text-verdict-moderate-text" : "text-verdict-avoid-text"}`}>{s.confidence_score}%</span></div>
                  <div className="w-20 text-center"><Badge variant="outline" className={`text-xs ${s.status === "pending" ? "border-verdict-moderate/30 text-verdict-moderate-text" : s.status === "approved" ? "border-verdict-healthy/30 text-verdict-healthy-text" : "border-verdict-avoid/30 text-verdict-avoid-text"}`}>{s.status}</Badge></div>
                  <div className="flex w-40 items-center justify-center gap-2">
                    {s.status === "pending" ? (<>
                      <Button size="sm" variant="outline" onClick={() => handleReview(s.id, "approved")} className="border-verdict-healthy/30 text-verdict-healthy-text hover:bg-verdict-healthy-bg"><CheckCircle className="mr-1 h-3.5 w-3.5" />Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => handleReview(s.id, "rejected")} className="border-verdict-avoid/30 text-verdict-avoid-text hover:bg-verdict-avoid-bg"><XCircle className="mr-1 h-3.5 w-3.5" />Reject</Button>
                    </>) : <span className="text-xs text-text-tertiary">Reviewed</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="flex flex-col items-center py-16 text-center"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-verdict-healthy-bg text-verdict-healthy"><CheckCircle className="h-5 w-5" /></div><p className="mb-1 text-sm font-medium">All clear!</p><p className="text-xs text-text-tertiary">No flagged scans to review.</p></div>}
        </CardContent>
      </Card>
      {totalPages > 1 && <div className="mt-4 flex items-center justify-center gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-border text-foreground"><ChevronLeft className="h-4 w-4" /></Button><span className="px-3 text-sm text-text-secondary">Page {page} of {totalPages}</span><Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="border-border text-foreground"><ChevronRight className="h-4 w-4" /></Button></div>}
    </div>
  );
}
