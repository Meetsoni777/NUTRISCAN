"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminProducts, deleteProduct } from "@/lib/api/products";
import type { Product } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

function getScoreColor(s: number) { return s >= 75 ? "#7BAE6F" : s >= 50 ? "#D1A24A" : "#C4614F"; }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => { setLoading(true); getAdminProducts(page, 20, search || undefined).then((r) => { setProducts(r.data); setTotalPages(r.total_pages); }).catch(() => setProducts([])).finally(() => setLoading(false)); }, [page, search]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await deleteProduct(id); setProducts((p) => p.filter((x) => x.id !== id)); toast.success("Product deleted"); } catch { toast.error("Failed to delete"); }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div><h1 className="mb-1 font-voice text-[28px] font-medium">Products</h1><p className="text-text-secondary">Manage the product database.</p></div>
        <Button className="bg-accent-cyan text-background hover:bg-accent-cyan-light"><Plus className="mr-2 h-4 w-4" />Add Product</Button>
      </div>
      <div className="mb-6"><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" /><input type="text" placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-text-tertiary focus:border-accent-cyan focus:outline-none" /></div></div>
      <Card className="border-border bg-surface-1">
        <CardContent className="p-0">
          {loading ? <div className="space-y-0">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-b-0"><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-20" /><Skeleton className="ml-auto h-4 w-16" /></div>)}</div>
          : products.length > 0 ? (
            <div>
              <div className="flex items-center gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                <span className="flex-1">Product Name</span><span className="w-28">Brand</span><span className="w-28">Category</span><span className="w-16 text-center">Score</span><span className="w-20 text-center">Calories</span><span className="w-16" />
              </div>
              {products.map((p) => (
                <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center gap-4 border-b border-border px-6 py-3.5 transition-colors last:border-b-0 hover:bg-surface-2">
                  <div className="flex-1 truncate"><p className="text-sm font-medium">{p.name}</p></div>
                  <span className="w-28 truncate text-xs text-text-secondary">{p.brand}</span>
                  <span className="w-28 truncate text-xs text-text-tertiary">{p.category}</span>
                  <span className="w-16 text-center font-data text-sm font-semibold" style={{ color: getScoreColor(p.health_score) }}>{p.health_score}</span>
                  <span className="w-20 text-center font-data text-xs text-text-secondary">{p.nutrition.calories ?? "—"} kcal</span>
                  <div className="flex w-16 items-center justify-end"><button onClick={(e) => { e.preventDefault(); handleDelete(p.id, p.name); }} className="rounded p-1 text-text-tertiary transition-colors hover:text-verdict-avoid"><Trash2 className="h-3.5 w-3.5" /></button></div>
                </Link>
              ))}
            </div>
          ) : <div className="flex flex-col items-center py-16 text-center"><p className="mb-1 text-sm font-medium">No products found</p><p className="mb-4 text-xs text-text-tertiary">{search ? "Try a different search" : "Add your first product"}</p></div>}
        </CardContent>
      </Card>
      {totalPages > 1 && <div className="mt-4 flex items-center justify-center gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-border text-foreground"><ChevronLeft className="h-4 w-4" /></Button><span className="px-3 text-sm text-text-secondary">Page {page} of {totalPages}</span><Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="border-border text-foreground"><ChevronRight className="h-4 w-4" /></Button></div>}
    </div>
  );
}
