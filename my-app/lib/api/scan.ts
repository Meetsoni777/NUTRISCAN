import { api } from "../api-client";
import type { ScanResult } from "../types";

export async function uploadScan(file: File): Promise<ScanResult> {
  const formData = new FormData();
  formData.append("image", file);
  return api.upload<ScanResult>("/scan/upload/", formData);
}

export async function getScanResult(id: string): Promise<ScanResult> {
  return api.get<ScanResult>(`/scan/${id}/`);
}

export async function saveScan(id: string): Promise<void> {
  return api.post(`/scan/${id}/save/`);
}

export async function deleteScan(id: string): Promise<void> {
  return api.delete(`/scan/${id}/`);
}
