"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getScanResult, saveScan } from "@/lib/api/scan";
import { useAuth } from "@/lib/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { ScanResult } from "@/lib/types";
import { ArrowLeft, Camera, Save, AlertTriangle } from "lucide-react";

function getVerdictConfig(verdict: string) {
  switch (verdict) {
    case "healthy": return { bg: "bg-verdict-healthy-bg", text: "text-verdict-healthy-text", dot: "bg-verdict-healthy", label: "Healthy" };
    case "moderate": return { bg: "bg-verdict-moderate-bg", text: "text-verdict-moderate-text", dot: "bg-verdict-moderate", label: "Moderate" };
    case "avoid": return { bg: "bg-verdict-avoid-bg", text: "text-verdict-avoid-text", dot: "bg-verdict-avoid", label: "Avoid" };
    default: return { bg: "bg-surface-2", text: "text-text-secondary", dot: "bg-muted-foreground", label: verdict };
  }
}

function getScoreColor(score: number): string {
  if (score >= 75) return "#7BAE6F";
  if (score >= 50) return "#D1A24A";
  return "#C4614F";
}

function HealthGauge({ score, verdict }: { score: number; verdict: string }) {
  const config = getVerdictConfig(verdict);
  const color = getScoreColor(score);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[180px] w-[180px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#1E2228" strokeWidth="12" />
          <circle cx="80" cy="80" r={radius} fill="none" stroke={color} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-data text-[42px] font-semibold" style={{ color }}>{score}</span>
          <span className="text-xs text-text-tertiary">/100</span>
        </div>
      </div>
      <span className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${config.bg} ${config.text}`}>
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    </div>
  );
}

export default function ScanResultPage() {
  const params = useParams();
  const id = params.id as string;
  const { isAuthenticated } = useAuth();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getScanResult(id).then(setResult).catch(() => toast.error("Failed to load scan result")).finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id) return; setSaving(true);
    try { await saveScan(id); setResult((prev) => (prev ? { ...prev, is_saved: true } : prev)); toast.success("Scan saved to your history"); }
    catch { toast.error("Failed to save scan"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="mx-auto max-w-[900px] px-6 py-16 md:px-8">
      <Skeleton className="mb-8 h-8 w-48" />
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-surface-1"><CardContent className="p-8"><Skeleton className="mx-auto h-[180px] w-[180px] rounded-full" /></CardContent></Card>
        <Card className="border-border bg-surface-1"><CardContent className="space-y-3 p-8">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>
      </div>
    </div>
  );

  if (!result) return (
    <div className="mx-auto max-w-[900px] px-6 py-16 text-center md:px-8">
      <h1 className="mb-4 font-voice text-2xl font-medium">Scan not found</h1>
      <p className="mb-6 text-text-secondary">This scan result doesn&apos;t exist or has expired.</p>
      <Link href="/scan"><Button className="bg-accent-cyan text-background hover:bg-accent-cyan-light"><Camera className="mr-2 h-4 w-4" />Scan a label</Button></Link>
    </div>
  );

  const { health_score: hs, nutrition: n } = result;

  return (
    <div className="mx-auto max-w-[900px] px-6 py-8 md:px-8">
      <Link href="/scan" className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />Scan another label
      </Link>
      <h1 className="mb-2 font-voice text-[28px] font-medium">{result.product_name || "Scanned Product"}</h1>
      {result.brand && <p className="mb-8 text-text-secondary">{result.brand}</p>}
      {!result.brand && <div className="mb-8" />}

      <div className="grid gap-6 md:grid-cols-[340px_1fr]">
        <div className="space-y-6">
          <Card className="border-border bg-surface-1"><CardContent className="flex flex-col items-center p-8"><HealthGauge score={hs.score} verdict={hs.verdict} /></CardContent></Card>
          <Card className="border-border bg-surface-1"><CardHeader><CardTitle className="text-sm">Why this score?</CardTitle></CardHeader><CardContent><p className="text-sm leading-relaxed text-text-secondary">{hs.explanation}</p></CardContent></Card>
          {isAuthenticated && (
            <Button onClick={handleSave} disabled={saving || result.is_saved} variant="outline" className="w-full border-border-strong text-foreground">
              <Save className="mr-2 h-4 w-4" />
              {result.is_saved ? "Saved to history" : saving ? "Saving..." : "Save to history"}
            </Button>
          )}
        </div>
        <div className="space-y-6">
          <Card className="border-border bg-surface-1">
            <CardHeader><CardTitle className="text-sm">Nutrition Facts</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <tbody>
                  {[
                    { label: "Calories", value: n.calories, unit: "kcal" },
                    { label: "Protein", value: n.protein, unit: "g" },
                    { label: "Carbohydrates", value: n.carbohydrates, unit: "g" },
                    { label: "Fat", value: n.fat, unit: "g" },
                    { label: "Saturated Fat", value: n.saturated_fat, unit: "g", flag: (n.saturated_fat ?? 0) > 5 ? "High" : null },
                    { label: "Trans Fat", value: n.trans_fat, unit: "g", flag: (n.trans_fat ?? 0) > 0 ? "Concern" : null },
                    { label: "Fiber", value: n.fiber, unit: "g" },
                    { label: "Sugar", value: n.sugar, unit: "g", flag: (n.sugar ?? 0) > 15 ? "High sugar" : null },
                    { label: "Sodium", value: n.sodium, unit: "mg", flag: (n.sodium ?? 0) > 600 ? "Above threshold" : null },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="border-b border-border py-2.5 text-[13.5px] text-text-secondary">{row.label}</td>
                      <td className="border-b border-border py-2.5 text-right font-data text-sm text-foreground">
                        {row.value !== null ? `${row.value} ${row.unit}` : "—"}
                        {row.flag && <span className="mt-0.5 block text-[11px] text-verdict-avoid-text">{row.flag}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {result.ingredient_flags.length > 0 && (
            <Card className="border-border bg-surface-1">
              <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><AlertTriangle className="h-4 w-4 text-verdict-moderate" />Flagged Ingredients</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {result.ingredient_flags.map((flag, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 rounded-lg bg-surface-2 px-4 py-3">
                    <div><p className="text-sm font-medium">{flag.ingredient}</p><p className="text-xs text-text-tertiary">{flag.concern}</p></div>
                    <Badge variant="outline" className={`shrink-0 text-xs ${flag.severity === "high" ? "border-verdict-avoid/30 text-verdict-avoid-text" : flag.severity === "medium" ? "border-verdict-moderate/30 text-verdict-moderate-text" : "border-border-strong text-text-tertiary"}`}>{flag.severity}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {result.alternatives.length > 0 && (
            <Card className="border-border bg-surface-1">
              <CardHeader><CardTitle className="text-sm">Healthier Alternatives</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {result.alternatives.map((alt) => {
                  const ac = getVerdictConfig(alt.verdict);
                  return (
                    <div key={alt.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3">
                      <div><p className="text-sm font-medium">{alt.name}</p><p className="text-xs text-text-tertiary">{alt.brand}</p></div>
                      <div className="text-right">
                        <span className="font-data text-sm font-semibold" style={{ color: getScoreColor(alt.health_score) }}>{alt.health_score}</span>
                        <span className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${ac.bg} ${ac.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${ac.dot}`} />{ac.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/scan"><Button className="bg-accent-cyan text-background hover:bg-accent-cyan-light"><Camera className="mr-2 h-4 w-4" />Scan another product</Button></Link>
      </div>
    </div>
  );
}
