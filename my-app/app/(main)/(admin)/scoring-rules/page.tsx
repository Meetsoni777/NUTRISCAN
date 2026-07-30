"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getScoringRules, updateScoringRule } from "@/lib/api/products";
import type { ScoringRule } from "@/lib/types";
import { toast } from "sonner";
import { Sliders } from "lucide-react";

export default function ScoringRulesPage() {
  const [rules, setRules] = useState<ScoringRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => { getScoringRules().then(setRules).catch(() => setRules([])).finally(() => setLoading(false)); }, []);

  const handleToggle = async (rule: ScoringRule) => {
    try { await updateScoringRule(rule.id, { is_active: !rule.is_active }); setRules((p) => p.map((r) => r.id === rule.id ? { ...r, is_active: !r.is_active } : r)); toast.success(`Rule ${rule.is_active ? "disabled" : "enabled"}`); } catch { toast.error("Failed to update"); }
  };

  const handleUpdateThreshold = async (rule: ScoringRule, val: number) => {
    setSavingId(rule.id);
    try { await updateScoringRule(rule.id, { threshold: val }); setRules((p) => p.map((r) => r.id === rule.id ? { ...r, threshold: val } : r)); toast.success("Threshold updated"); } catch { toast.error("Failed"); } finally { setSavingId(null); }
  };

  const opLabel = (op: string) => { switch (op) { case "gt": return ">"; case "lt": return "<"; case "gte": return ">="; case "lte": return "<="; default: return op; } };

  return (
    <div>
      <h1 className="mb-2 font-voice text-[28px] font-medium">Scoring Rules</h1>
      <p className="mb-8 text-text-secondary">Configure the thresholds and penalties used by the health scoring engine.</p>
      <Card className="border-border bg-surface-1">
        <CardContent className="p-0">
          {loading ? <div className="space-y-0">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-b-0"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-20" /><Skeleton className="ml-auto h-6 w-12 rounded-full" /></div>)}</div>
          : rules.length > 0 ? (
            <div>
              <div className="flex items-center gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary"><span className="flex-1">Rule Name</span><span className="w-20">Nutrient</span><span className="w-32">Condition</span><span className="w-24 text-center">Penalty</span><span className="w-20 text-center">Status</span></div>
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-4 border-b border-border px-6 py-4 transition-colors last:border-b-0 hover:bg-surface-2">
                  <div className="flex-1"><p className="text-sm font-medium">{rule.name}</p><p className="mt-0.5 text-xs text-text-tertiary">{rule.description}</p></div>
                  <span className="w-20 text-sm text-text-secondary">{rule.nutrient}</span>
                  <div className="flex w-32 items-center gap-2"><span className="text-sm text-text-tertiary">{opLabel(rule.operator)}</span><Input type="number" step="0.1" value={rule.threshold} onChange={(e) => setRules((p) => p.map((r) => r.id === rule.id ? { ...r, threshold: Number(e.target.value) } : r))} onBlur={() => handleUpdateThreshold(rule, rule.threshold)} className="h-8 w-20 border-border bg-surface-2 font-data text-xs" disabled={savingId === rule.id} /><span className="text-xs text-text-tertiary">{rule.nutrient === "sodium" ? "mg" : "g"}</span></div>
                  <span className="w-24 text-center font-data text-sm text-verdict-avoid-text">-{rule.penalty_points} pts</span>
                  <div className="w-20 text-center"><button onClick={() => handleToggle(rule)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${rule.is_active ? "bg-accent-cyan" : "bg-surface-3"}`}><span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${rule.is_active ? "translate-x-[18px]" : "translate-x-[3px]"}`} /></button></div>
                </div>
              ))}
            </div>
          ) : <div className="flex flex-col items-center py-16 text-center"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-dark text-accent-cyan"><Sliders className="h-5 w-5" /></div><p className="mb-1 text-sm font-medium">No scoring rules</p><p className="text-xs text-text-tertiary">Connect to the backend API to manage rules.</p></div>}
        </CardContent>
      </Card>
      <Card className="mt-6 border-border bg-surface-1"><CardContent className="p-5"><div className="flex items-start gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-dark text-accent-cyan"><Sliders className="h-4 w-4" /></div><div><p className="text-sm font-medium">How scoring works</p><p className="mt-1 text-xs leading-relaxed text-text-tertiary">Each rule defines a threshold for a specific nutrient. When a scanned product exceeds the threshold, penalty points are deducted from the base score of 100. Disabled rules are ignored during scoring.</p></div></div></CardContent></Card>
    </div>
  );
}
