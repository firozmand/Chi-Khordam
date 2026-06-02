"use client";

import React, { useState, useEffect } from "react";
import { storage } from "@/storage";
import { MealTemplate, MealCategory, Food, Ingredient } from "@/types";
import { FOOD_DATABASE } from "@/data/food-db";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ChevronLeft, Search } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

const CATEGORIES: MealCategory[] = [
  "صبحانه",
  "میان وعده صبح",
  "ناهار",
  "میان وعده عصر",
  "شام",
  "میان وعده قبل خواب",
];

export default function MealsPage() {
  const [templates, setTemplates] = useState<MealTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<MealCategory>("صبحانه");
  const [isAdding, setIsAdding] = useState(false);

  const [newTemplate, setNewTemplate] = useState<Partial<MealTemplate>>({
    name: "",
    category: "صبحانه",
    ingredients: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTemplates(storage.getTemplates());
  }, []);

  const filteredTemplates = templates.filter((t) => t.category === activeTab);

  const handleAddIngredient = (food: Food) => {
    const ingredient: Ingredient = {
      foodId: food.id,
      name: food.name,
      quantity: 100,
      unit: food.unit || "گرم",
      calories: food.calories,
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
    };
    setNewTemplate({
      ...newTemplate,
      ingredients: [...(newTemplate.ingredients || []), ingredient],
    });
    setSearchTerm("");
  };

  const saveTemplate = () => {
    if (!newTemplate.name || !newTemplate.ingredients?.length) return;

    const total = newTemplate.ingredients.reduce(
      (acc, ing) => ({
        cal: acc.cal + ing.calories,
        prot: acc.prot + ing.protein,
        fat: acc.fat + ing.fat,
        carb: acc.carb + ing.carbs,
      }),
      { cal: 0, prot: 0, fat: 0, carb: 0 },
    );

    const template: MealTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      category: activeTab,
      ingredients: newTemplate.ingredients,
      totalCalories: total.cal,
      totalProtein: total.prot,
      totalFat: total.fat,
      totalCarbs: total.carb,
    };

    const updated = [...templates, template];
    setTemplates(updated);
    storage.saveTemplates(updated);
    setIsAdding(false);
    setNewTemplate({ name: "", category: activeTab, ingredients: [] });
  };

  const deleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    storage.saveTemplates(updated);
  };

  return (
    <div className="pb-24">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black">غذاهای من</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={cn(
              "px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-bold transition-all",
              activeTab === cat
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white text-slate-400",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4 mt-4">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="neu-card flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-sm mb-1">{t.name}</h3>
                  <div className="flex gap-3 text-[10px] text-slate-400 font-bold">
                    <span>
                      🔥 {formatNumber(Math.round(t.totalCalories))} kcal
                    </span>
                    <span>🥩 {formatNumber(Math.round(t.totalProtein))}g</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTemplate(t.id)}
                  className="text-red-400 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              هنوز الگوی غذایی برای این دسته نساخته‌اید
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-black mb-6">ساخت الگوی جدید</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 mr-2">
                    نام الگو
                  </label>
                  <input
                    className="neu-input"
                    placeholder="مثلاً صبحانه رژیمی"
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 mr-2">
                    افزودن غذا
                  </label>
                  <div className="relative mb-4">
                    <Search
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      className="neu-input pr-12 text-sm"
                      placeholder="جستجو در پایگاه داده..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-3xl mt-2 z-10 max-h-48 overflow-y-auto p-2">
                        {FOOD_DATABASE.filter((f) =>
                          f.name.includes(searchTerm),
                        ).map((f) => (
                          <button
                            key={f.id}
                            onClick={() => handleAddIngredient(f)}
                            className="w-full text-right p-3 hover:bg-slate-50 rounded-xl text-sm font-bold"
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {newTemplate.ingredients?.map((ing, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-xl"
                      >
                        <span>{ing.name} (۱۰۰گرم)</span>
                        <button
                          onClick={() => {
                            const updated = [
                              ...(newTemplate.ingredients || []),
                            ];
                            updated.splice(i, 1);
                            setNewTemplate({
                              ...newTemplate,
                              ingredients: updated,
                            });
                          }}
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 text-slate-400 font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={saveTemplate}
                    className="flex-2 py-4 bg-primary text-white rounded-3xl font-bold shadow-lg shadow-primary/20"
                  >
                    ذخیره الگو
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
