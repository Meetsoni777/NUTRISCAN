export interface NutritionData {
  calories: number | null;
  protein: number | null;
  carbohydrates: number | null;
  fat: number | null;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
  saturated_fat: number | null;
  trans_fat: number | null;
}

export interface IngredientFlag {
  ingredient: string;
  concern: string;
  severity: "low" | "medium" | "high";
}

export interface HealthScore {
  score: number;
  verdict: "healthy" | "moderate" | "avoid";
  explanation: string;
}

export interface Alternative {
  id: number;
  name: string;
  brand: string;
  health_score: number;
  verdict: "healthy" | "moderate" | "avoid";
  image_url: string | null;
  category: string;
}

export interface ScanResult {
  id: string;
  product_name: string;
  brand: string;
  category: string;
  image_url: string;
  raw_ocr_text: string;
  nutrition: NutritionData;
  health_score: HealthScore;
  ingredient_flags: IngredientFlag[];
  alternatives: Alternative[];
  created_at: string;
  is_saved: boolean;
}

export interface ScanHistoryItem {
  id: string;
  product_name: string;
  health_score: number;
  verdict: "healthy" | "moderate" | "avoid";
  category: string;
  image_url: string | null;
  scanned_at: string;
}
