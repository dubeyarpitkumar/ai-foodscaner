
export enum HealthCondition {
  NONE = "None",
  DIABETIC = "Diabetic",
  GYM_GOER = "Gym-Goer",
  HEART_PATIENT = "Heart Patient",
}

export interface UserProfile {
  age: number | null;
  healthCondition: HealthCondition;
  allergies: string[];
}

export interface NutritionalInfo {
  foodName: string;
  calories: number;
  protein: number;
  sugar: number;
  fat: number;
  fiber: number;
  ingredients: string[];
}

export interface AnalysisResult {
  nutritionalInfo: NutritionalInfo;
  healthRecommendation: string;
  isHealthy: boolean;
}

export enum View {
  HOME,
  SCANNING,
  RESULTS,
}

export enum ScanMode {
  IMAGE,
  QR,
}
