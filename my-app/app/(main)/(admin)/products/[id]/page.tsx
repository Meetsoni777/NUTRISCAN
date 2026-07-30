"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProduct } from "@/lib/api/products";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ProductDetailPage() {
  const params = useParams(); const router = useRouter(); const id = params.id as string;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", brand: "", category: "", ingredients: "", calories: "", protein: "", carbohydrates: "", fat: "", fiber: "", sugar: "", sodium: "" });
  const handleChange = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await updateProduct(Number(id), { name: form.name, brand: form.brand, category: form.category, ingredients: form.ingredients, nutrition: { calories: form.calories ? Number(form.calories) : null, protein: form.protein ? Number(form.protein) : null, carbohydrates: form.carbohydrates ? Number(form.carbohydrates) : null, fat: form.fat ? Number(form.fat) : null, fiber: form.fiber ? Number(form.fiber) : null, sugar: form.sugar ? Number(form.sugar) : null, sodium: form.sodium ? Number(form.sodium) : null } });
      toast.success("Product updated"); router.push("/admin/products");
    } catch { toast.error("Failed to update"); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to products</Link>
      <h1 className="mb-2 font-voice text-[28px] font-medium">Product #{id}</h1>
      <p className="mb-8 text-text-secondary">Edit product details below.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border bg-surface-1"><CardHeader><CardTitle className="text-sm">Basic Info</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Product Name</Label><Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g. Whole Wheat Bread" className="border-border bg-surface-2" /></div><div className="space-y-2"><Label>Brand</Label><Input value={form.brand} onChange={(e) => handleChange("brand", e.target.value)} placeholder="e.g. Britannia" className="border-border bg-surface-2" /></div></div>
          <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => handleChange("category", e.target.value)} placeholder="e.g. Bakery, Dairy, Snacks" className="border-border bg-surface-2" /></div>
          <div className="space-y-2"><Label>Ingredients</Label><textarea value={form.ingredients} onChange={(e) => handleChange("ingredients", e.target.value)} placeholder="List of ingredients..." rows={3} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-text-tertiary focus:border-accent-cyan focus:outline-none" /></div>
        </CardContent></Card>
        <Card className="border-border bg-surface-1"><CardHeader><CardTitle className="text-sm">Nutrition Facts (per serving)</CardTitle></CardHeader><CardContent><div className="grid gap-4 sm:grid-cols-3">
          {[{ f: "calories", l: "Calories", u: "kcal" }, { f: "protein", l: "Protein", u: "g" }, { f: "carbohydrates", l: "Carbs", u: "g" }, { f: "fat", l: "Fat", u: "g" }, { f: "fiber", l: "Fiber", u: "g" }, { f: "sugar", l: "Sugar", u: "g" }, { f: "sodium", l: "Sodium", u: "mg" }].map((i) => (
            <div key={i.f} className="space-y-2"><Label>{i.l} ({i.u})</Label><Input type="number" step="0.1" min="0" value={form[i.f as keyof typeof form]} onChange={(e) => handleChange(i.f, e.target.value)} placeholder="0" className="border-border bg-surface-2 font-data" /></div>
          ))}
        </div></CardContent></Card>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-accent-cyan text-background hover:bg-accent-cyan-light">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{saving ? "Saving..." : "Save changes"}</Button>
          <Link href="/admin/products"><Button type="button" variant="outline" className="border-border text-foreground">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
