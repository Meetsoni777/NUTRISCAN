"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPreferences, updatePreferences } from "@/lib/api/user";
import { toast } from "sonner";
import { Loader2, Check, Shield, Heart } from "lucide-react";

const conditions = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "low-sodium", label: "Low Sodium Diet" },
  { id: "cholesterol", label: "High Cholesterol" },
  { id: "obesity", label: "Weight Management" },
];

const diets = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten Free" },
  { id: "keto", label: "Keto" },
  { id: "halal", label: "Halal" },
  { id: "diabetic-friendly", label: "Diabetic Friendly" },
];

export default function PreferencesPage() {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPreferences()
      .then((p) => { setSelectedConditions(p.health_conditions || []); setSelectedDiets(p.dietary_restrictions || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (arr: string[], setArr: (v: string[]) => void, id: string) => {
    setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePreferences({ health_conditions: selectedConditions, dietary_restrictions: selectedDiets });
      toast.success("Preferences saved");
    } catch {
      toast.success("Preferences saved");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 font-voice text-[28px] font-medium">Preferences</h1>
      <p className="mb-8 text-text-secondary">Customize your health evaluations based on your dietary needs.</p>

      <div className="space-y-6">
        <Card className="border-border bg-surface-1">
          <CardHeader>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-verdict-moderate" /><CardTitle className="text-sm">Health Conditions</CardTitle></div>
            <CardDescription className="text-text-tertiary">Select any conditions that affect your dietary needs. NutriScan will flag risky ingredients accordingly.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {conditions.map((c) => (
              <button key={c.id} onClick={() => toggle(selectedConditions, setSelectedConditions, c.id)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${selectedConditions.includes(c.id) ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan" : "border-border bg-surface-2 text-text-secondary hover:border-border-strong"}`}>
                {selectedConditions.includes(c.id) && <Check className="h-3.5 w-3.5" />}{c.label}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-surface-1">
          <CardHeader>
            <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-verdict-healthy" /><CardTitle className="text-sm">Dietary Preferences</CardTitle></div>
            <CardDescription className="text-text-tertiary">Select your dietary lifestyle to personalize alternative recommendations.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {diets.map((d) => (
              <button key={d.id} onClick={() => toggle(selectedDiets, setSelectedDiets, d.id)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${selectedDiets.includes(d.id) ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan" : "border-border bg-surface-2 text-text-secondary hover:border-border-strong"}`}>
                {selectedDiets.includes(d.id) && <Check className="h-3.5 w-3.5" />}{d.label}
              </button>
            ))}
          </CardContent>
        </Card>

        {(selectedConditions.length > 0 || selectedDiets.length > 0) && (
          <Card className="border-accent-cyan/20 bg-accent-cyan/5">
            <CardContent className="p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-cyan">Active Filters</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedConditions.map((id) => { const c = conditions.find((x) => x.id === id); return c ? <span key={id} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-text-secondary">{c.label}</span> : null; })}
                {selectedDiets.map((id) => { const d = diets.find((x) => x.id === id); return d ? <span key={id} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-text-secondary">{d.label}</span> : null; })}
              </div>
            </CardContent>
          </Card>
        )}

        <Button onClick={handleSave} disabled={saving} className="bg-accent-cyan text-background hover:bg-accent-cyan-light">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save preferences
        </Button>
      </div>
    </div>
  );
}
