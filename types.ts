
export enum HealthCondition {
  NONE = "None",
  DIABETIC = "Diabetic",
  GYM_GOER = "Gym-Goer",
  HEART_PATIENT = "Heart Patient",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
  PREFER_NOT_TO_SAY = "Prefer not to say",
}

export enum DietType {
  NONE = "None",
  VEGETARIAN = "Vegetarian",
  VEGAN = "Vegan",
  PESCATARIAN = "Pescatarian",
  KETO = "Keto",
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  age: number | null;
  gender: Gender;
  dietType: DietType;
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