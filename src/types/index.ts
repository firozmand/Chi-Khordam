export type Gender = "male" | "female";
export type GoalType = "weight-loss" | "maintenance" | "muscle-gain";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very-active";

export interface UserProfile {
  name: string;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  monthlyWeightLoss: number;
  activityLevel: ActivityLevel;
  workoutDays: number;
  goalType: GoalType;
  bmr: number;
  tdee: number;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbTarget: number;
  dailyFatTarget: number;
  createdAt: string;
}

export interface Food {
  id: string;
  name: string;
  calories: number; // per 100g
  protein: number;
  fat: number;
  carbs: number;
  unit?: string;
  servingUnit?: string; // e.g. "عدد", "کف دست", "قاشق"
  servingWeight?: number; // weight of one serving unit in grams
}

export interface Ingredient {
  foodId: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface MealTemplate {
  id: string;
  name: string;
  category: MealCategory;
  ingredients: Ingredient[];
  colorTag?: string;
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

export type MealCategory =
  | "صبحانه"
  | "میان وعده صبح"
  | "ناهار"
  | "میان وعده عصر"
  | "شام"
  | "میان وعده قبل خواب";

export interface DailyLog {
  date: string; // ISO string YYYY-MM-DD
  meals: {
    [key in MealCategory]?: Ingredient[];
  };
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  weight?: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
}
