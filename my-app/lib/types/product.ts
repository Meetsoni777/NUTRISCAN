export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  image_url: string | null;
  ingredients: string;
  nutrition: {
    calories: number | null;
    protein: number | null;
    carbohydrates: number | null;
    fat: number | null;
    fiber: number | null;
    sugar: number | null;
    sodium: number | null;
  };
  health_score: number;
  created_at: string;
}

export interface ScoringRule {
  id: number;
  name: string;
  nutrient: string;
  threshold: number;
  operator: "gt" | "lt" | "gte" | "lte";
  penalty_points: number;
  is_active: boolean;
  description: string;
}

export interface AdminStats {
  total_products: number;
  total_scans: number;
  total_users: number;
  flagged_scans_pending: number;
}

export interface FlaggedScan {
  id: string;
  image_url: string;
  raw_ocr_text: string;
  confidence_score: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}
