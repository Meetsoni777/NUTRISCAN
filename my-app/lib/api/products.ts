import { api } from "../api-client";
import type {
  Product,
  PaginatedResponse,
  ScanHistoryItem,
  AdminStats,
  ScoringRule,
  FlaggedScan,
} from "../types";

/* ── User APIs ── */

export async function getScanHistory(
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<ScanHistoryItem>> {
  return api.get<PaginatedResponse<ScanHistoryItem>>(
    `/user/scan-history/?page=${page}&page_size=${pageSize}`
  );
}

export async function getProducts(
  page: number = 1,
  pageSize: number = 20,
  search?: string
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (search) params.set("search", search);
  return api.get<PaginatedResponse<Product>>(
    `/user/products/?${params.toString()}`
  );
}

export async function getDashboardStats(): Promise<{
  total_scans: number;
  avg_health_score: number;
  saved_scans: number;
  recent_scans: ScanHistoryItem[];
}> {
  return api.get("/user/dashboard-stats/");
}

/* ── Admin APIs ── */

export async function getAdminStats(): Promise<AdminStats> {
  return api.get<AdminStats>("/admin/stats/");
}

export async function getAdminProducts(
  page: number = 1,
  pageSize: number = 20,
  search?: string
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (search) params.set("search", search);
  return api.get<PaginatedResponse<Product>>(
    `/admin/products/?${params.toString()}`
  );
}

export async function createProduct(
  data: Omit<Product, "id" | "created_at">
): Promise<Product> {
  return api.post<Product>("/admin/products/", data);
}

export async function updateProduct(
  id: number,
  data: Partial<Product>
): Promise<Product> {
  return api.patch<Product>(`/admin/products/${id}/`, data);
}

export async function deleteProduct(id: number): Promise<void> {
  return api.delete(`/admin/products/${id}/`);
}

export async function getFlaggedScans(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<FlaggedScan>> {
  return api.get<PaginatedResponse<FlaggedScan>>(
    `/admin/flagged-scans/?page=${page}&page_size=${pageSize}`
  );
}

export async function reviewFlaggedScan(
  id: string,
  status: "approved" | "rejected"
): Promise<void> {
  return api.patch(`/admin/flagged-scans/${id}/`, { status });
}

export async function getScoringRules(): Promise<ScoringRule[]> {
  return api.get<ScoringRule[]>("/admin/scoring-rules/");
}

export async function updateScoringRule(
  id: number,
  data: Partial<ScoringRule>
): Promise<ScoringRule> {
  return api.patch<ScoringRule>(`/admin/scoring-rules/${id}/`, data);
}

export async function createScoringRule(
  data: Omit<ScoringRule, "id">
): Promise<ScoringRule> {
  return api.post<ScoringRule>("/admin/scoring-rules/", data);
}
