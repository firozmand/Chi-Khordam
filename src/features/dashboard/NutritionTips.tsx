"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { NUTRITION_TIPS } from "@/data/food-db";

export const NutritionTips = () => {
  const [tip, setTip] = useState("");

  useEffect(() => {
    const randomTip =
      NUTRITION_TIPS[Math.floor(Math.random() * NUTRITION_TIPS.length)];
    setTip(randomTip);
  }, []);

  return (
    <div className="bg-primary/5 rounded-[24px] p-4 flex gap-4 items-start border border-primary/10">
      <div className="bg-primary text-white p-2 rounded-xl shrink-0">
        <Lightbulb size={20} />
      </div>
      <div>
        <h4 className="font-bold text-sm text-primary mb-1">نکته تغذیه‌ای</h4>
        <p className="text-slate-600 text-xs leading-relaxed">{tip}</p>
      </div>
    </div>
  );
};
