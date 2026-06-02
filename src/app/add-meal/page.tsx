"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { storage } from "@/storage";
import { MealCategory, Ingredient, Food, DailyLog } from "@/types";
import { FOOD_DATABASE } from "@/data/food-db";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

const CATEGORIES: MealCategory[] = [
  "صبحانه",
  "میان وعده صبح",
  "ناهار",
  "میان وعده عصر",
  "شام",
  "میان وعده قبل خواب",
];

export default function AddMealWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<
    Record<string, Ingredient[]>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [tempQuantity, setTempQuantity] = useState<string>("100");
  const [showSummary, setShowSummary] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeFood, setActiveFood] = useState<Food | null>(null);
  const [unitMode, setUnitMode] = useState<"grams" | "servings">("grams");

  useEffect(() => {
    setTemplates(storage.getTemplates());
  }, []);

  const currentCategory = CATEGORIES[step];

  const filteredFoods = FOOD_DATABASE.filter((f) =>
    f.name.includes(searchTerm),
  );

  const filteredTemplates = templates.filter(
    (t) => t.category === currentCategory && t.name.includes(searchTerm),
  );

  const getQuickAdd = () => {
    if (!searchTerm) return null;

    // Simple regex to find number and food name
    // Matches: "3 تخم مرغ", "۳ عدد موز", "یک کف دست نان"
    const match = searchTerm.match(
      /^(\d+|یک|دو|سه|چهار|پنج)\s*(تا|عدد|کف دست|قاشق)?\s*(.*)$/,
    );
    if (!match) return null;

    const numStr = match[1];
    const foodName = match[3].trim();

    if (foodName.length < 2) return null;

    const food = FOOD_DATABASE.find((f) => f.name.includes(foodName));
    if (!food) return null;

    let qty = 1;
    if (numStr === "یک") qty = 1;
    else if (numStr === "دو") qty = 2;
    else if (numStr === "سه") qty = 3;
    else if (numStr === "چهار") qty = 4;
    else if (numStr === "پنج") qty = 5;
    else qty = Number(numStr) || 1;

    return { food, qty };
  };

  const quickAdd = getQuickAdd();

  const addTemplate = (template: any) => {
    const current = selectedIngredients[currentCategory] || [];
    setSelectedIngredients({
      ...selectedIngredients,
      [currentCategory]: [...current, ...template.ingredients],
    });
    setSearchTerm("");
  };

  const addIngredient = (
    food: Food,
    forcedQty?: number,
    forcedMode?: "grams" | "servings",
  ) => {
    const mode = forcedMode || unitMode;
    const rawQty = forcedQty || Number(tempQuantity);

    let calcQty = rawQty;
    let displayUnit = "گرم";

    if (mode === "servings" && food.servingWeight) {
      calcQty = rawQty * food.servingWeight;
      displayUnit = food.servingUnit || "عدد";
    }

    const ingredient: Ingredient = {
      foodId: food.id,
      name: food.name,
      quantity: rawQty,
      unit: mode === "servings" ? displayUnit : "گرم",
      calories: (food.calories * calcQty) / 100,
      protein: (food.protein * calcQty) / 100,
      fat: (food.fat * calcQty) / 100,
      carbs: (food.carbs * calcQty) / 100,
    };

    const current = selectedIngredients[currentCategory] || [];
    setSelectedIngredients({
      ...selectedIngredients,
      [currentCategory]: [...current, ingredient],
    });
    setSearchTerm("");
    setTempQuantity("100"); // Reset to default
    setUnitMode("grams");
  };

  const removeIngredient = (category: MealCategory, index: number) => {
    const current = selectedIngredients[category] || [];
    const updated = [...current];
    updated.splice(index, 1);
    setSelectedIngredients({
      ...selectedIngredients,
      [category]: updated,
    });
  };

  const handleNext = () => {
    if (step < CATEGORIES.length - 1) {
      setStep(step + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    const today = new Date().toISOString().split("T")[0];

    let totalCal = 0;
    let totalProt = 0;
    let totalFat = 0;
    let totalCarb = 0;

    Object.values(selectedIngredients).forEach((ingredients) => {
      ingredients.forEach((ing) => {
        totalCal += ing.calories;
        totalProt += ing.protein;
        totalFat += ing.fat;
        totalCarb += ing.carbs;
      });
    });

    const log: DailyLog = {
      date: today,
      meals: selectedIngredients,
      totalCalories: totalCal,
      totalProtein: totalProt,
      totalFat: totalFat,
      totalCarbs: totalCarb,
    };

    storage.saveLog(log);
    router.push("/");
  };

  if (showSummary) {
    return (
      <FinalReport
        ingredients={selectedIngredients}
        onFinish={handleFinish}
        onBack={() => setShowSummary(false)}
      />
    );
  }

  return (
    <div className="pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-black text-primary">{currentCategory}</h1>
        <span className="text-slate-400 text-sm font-bold">
          مرحله {step + 1} از ۶
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1 mb-8">
        {CATEGORIES.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i <= step ? "bg-primary" : "bg-slate-200",
            )}
          />
        ))}
      </div>

      <div className="space-y-6">
        {/* Selected Ingredients Card */}
        <section className="neu-card min-h-30">
          <h2 className="text-sm font-bold text-slate-500 mb-4">
            غذاهای انتخاب شده
          </h2>
          {selectedIngredients[currentCategory]?.length ? (
            <div className="space-y-3">
              {selectedIngredients[currentCategory].map((ing, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl"
                >
                  <div>
                    <span className="font-bold text-sm ml-2">{ing.name}</span>
                    <span className="text-xs text-slate-400">
                      {formatNumber(ing.quantity)} {ing.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary">
                      {formatNumber(Math.round(ing.calories))} kcal
                    </span>
                    <button
                      onClick={() => removeIngredient(currentCategory, i)}
                      className="text-red-400 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-400 text-xs">
              هنوز غذایی اضافه نکرده‌اید
            </div>
          )}
        </section>

        {/* Search Food */}
        <section className="space-y-4">
          <div className="relative">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="جستجوی غذا..."
              className="neu-input pr-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && (
            <div className="neu-card p-2 max-h-64 overflow-y-auto space-y-1">
              {quickAdd && (
                <button
                  onClick={() => {
                    addIngredient(quickAdd.food, quickAdd.qty, "servings");
                  }}
                  className="w-full flex justify-between items-center p-4 bg-primary/10 border border-primary/20 rounded-2xl animate-pulse group"
                >
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-primary mb-1">
                      افزودن سریع ⚡️
                    </div>
                    <div className="font-bold text-sm">
                      {quickAdd.qty} {quickAdd.food.servingUnit || "واحد"}{" "}
                      {quickAdd.food.name}
                    </div>
                  </div>
                  <Check className="text-primary group-hover:scale-125 transition-transform" />
                </button>
              )}

              <div className="p-3 mb-2 border-b border-slate-50 bg-slate-50/50 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold text-slate-400">
                    مقدار مصرفی
                  </label>
                  <div className="flex bg-white rounded-lg p-0.5 shadow-inner">
                    <button
                      onClick={() => setUnitMode("grams")}
                      className={cn(
                        "px-2 py-1 text-[10px] rounded-md transition-all",
                        unitMode === "grams"
                          ? "bg-primary text-white shadow-sm"
                          : "text-slate-400",
                      )}
                    >
                      گرم
                    </button>
                    <button
                      onClick={() => setUnitMode("servings")}
                      className={cn(
                        "px-2 py-1 text-[10px] rounded-md transition-all",
                        unitMode === "servings"
                          ? "bg-primary text-white shadow-sm"
                          : "text-slate-400",
                      )}
                    >
                      واحد
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="flex-1 bg-white rounded-xl px-4 py-2 text-sm outline-none border border-slate-100"
                    placeholder={unitMode === "grams" ? "مثلاً ۱۰۰" : "مثلاً ۲"}
                    value={tempQuantity}
                    onChange={(e) => setTempQuantity(e.target.value)}
                  />
                  <span className="text-xs font-bold text-slate-400">
                    {unitMode === "grams" ? "گرم" : "واحد"}
                  </span>
                </div>
              </div>

              {/* Templates */}
              {filteredTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => addTemplate(t)}
                  className="w-full flex justify-between items-center p-3 hover:bg-slate-50 rounded-2xl transition-colors text-right border-b border-slate-50 last:border-0"
                >
                  <div>
                    <div className="font-bold text-sm text-primary">
                      الگو: {t.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {Math.round(t.totalCalories)} کالری کل
                    </div>
                  </div>
                  <Check size={20} className="text-success" />
                </button>
              ))}

              {/* Individual Foods */}
              {filteredFoods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => addIngredient(food)}
                  className="w-full flex justify-between items-center p-3 hover:bg-slate-50 rounded-2xl transition-colors text-right"
                >
                  <div>
                    <div className="font-bold text-sm">{food.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {food.calories} کالری در ۱۰۰ گرم
                      {food.servingUnit && (
                        <span className="text-primary mr-2">
                          (هر {food.servingUnit} ≈ {food.servingWeight} گرم)
                        </span>
                      )}
                    </div>
                  </div>
                  <Plus size={20} className="text-primary" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-24 left-4 right-4 flex gap-4">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="bg-white text-slate-400 p-4 rounded-3xl shadow-sm disabled:opacity-50"
        >
          <ChevronRight size={24} />
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-primary text-white font-bold py-4 rounded-3xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          {step === CATEGORIES.length - 1 ? "مشاهده گزارش" : "وعده بعدی"}
          <ChevronLeft size={20} />
        </button>
      </div>
    </div>
  );
}

const FinalReport = ({ ingredients, onFinish, onBack }: any) => {
  const profile = storage.getProfile();

  let totalCal = 0;
  let totalProt = 0;

  Object.values(ingredients).forEach((meal: any) => {
    meal.forEach((ing: any) => {
      totalCal += ing.calories;
      totalProt += ing.protein;
    });
  });

  const calDiff = (profile?.dailyCalorieTarget || 0) - totalCal;
  const protDiff = (profile?.dailyProteinTarget || 0) - totalProt;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 pb-24"
    >
      <h1 className="text-2xl font-black text-center mb-8">
        گزارش نهایی امروز
      </h1>

      <div className="neu-card space-y-6">
        <ReportItem
          label="کالری مصرفی"
          value={totalCal}
          target={profile?.dailyCalorieTarget}
          unit="kcal"
        />
        <ReportItem
          label="پروتئین مصرفی"
          value={totalProt}
          target={profile?.dailyProteinTarget}
          unit="g"
        />
      </div>

      <div className="neu-card">
        <h3 className="font-bold text-sm mb-4">تحلیل امروز:</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          {calDiff > 0
            ? `شما هنوز ${formatNumber(Math.round(calDiff))} کالری تا هدف خود فاصله دارید.`
            : `شما ${formatNumber(Math.round(Math.abs(calDiff)))} کالری بیش از هدف خود مصرف کرده‌اید.`}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-white rounded-3xl font-bold text-slate-500"
        >
          بازگشت
        </button>
        <button
          onClick={onFinish}
          className="flex-2 py-4 bg-primary text-white rounded-3xl font-bold shadow-lg shadow-primary/30"
        >
          ثبت نهایی
        </button>
      </div>
    </motion.div>
  );
};

const ReportItem = ({ label, value, target, unit }: any) => (
  <div>
    <div className="flex justify-between items-baseline mb-2">
      <span className="text-slate-500 font-bold text-xs">{label}</span>
      <span className="font-black text-lg">
        {formatNumber(Math.round(value))}
        <span className="text-xs font-bold text-slate-400 mr-1">
          / {formatNumber(Math.round(target))} {unit}
        </span>
      </span>
    </div>
    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((value / target) * 100, 100)}%` }}
        className={cn(
          "h-full rounded-full transition-all",
          value > target ? "bg-red-400" : "bg-success",
        )}
      />
    </div>
  </div>
);
