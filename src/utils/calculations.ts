import { Gender, ActivityLevel, GoalType } from "../types";

export const calculateBMR = (
  gender: Gender,
  weight: number,
  height: number,
  age: number,
): number => {
  if (gender === "male") {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }
};

export const getActivityMultiplier = (level: ActivityLevel): number => {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very-active": 1.9,
  };
  return multipliers[level];
};

export const calculateTargets = (
  tdee: number,
  goalType: GoalType,
  monthlyWeightLoss: number,
  weight: number,
) => {
  let dailyCalorieTarget = tdee;

  if (goalType === "weight-loss") {
    // 1kg weight loss per month is roughly 7700 calories deficit per month
    // so monthlyWeightLoss * 7700 / 30
    const dailyDeficit = (monthlyWeightLoss * 7700) / 30;
    dailyCalorieTarget = tdee - dailyDeficit;
  } else if (goalType === "muscle-gain") {
    dailyCalorieTarget = tdee + 250; // Moderate surplus
  }

  // Basic macro split (can be refined)
  // Protein: 1.8g - 2.2g per kg of body weight
  const dailyProteinTarget = weight * 2;
  const proteinCalories = dailyProteinTarget * 4;

  // Fat: 25% of daily calories
  const dailyFatTarget = (dailyCalorieTarget * 0.25) / 9;
  const fatCalories = dailyFatTarget * 9;

  // Carbs: rest
  const dailyCarbTarget =
    (dailyCalorieTarget - proteinCalories - fatCalories) / 4;

  return {
    dailyCalorieTarget: Math.round(dailyCalorieTarget),
    dailyProteinTarget: Math.round(dailyProteinTarget),
    dailyFatTarget: Math.round(dailyFatTarget),
    dailyCarbTarget: Math.round(dailyCarbTarget),
  };
};
