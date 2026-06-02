"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/storage";
import { UserProfile, DailyLog } from "@/types";
import { motion } from "framer-motion";
import { CircularProgress } from "@/features/dashboard/CircularProgress";
import { TrendChart } from "@/features/dashboard/TrendChart";
import { NutritionTips } from "@/features/dashboard/NutritionTips";
import { formatNumber } from "@/lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);

  useEffect(() => {
    const p = storage.getProfile();
    if (!p) {
      router.push("/profile");
      return;
    }
    setProfile(p);

    const today = new Date().toISOString().split("T")[0];
    setTodayLog(storage.getLogByDate(today));
  }, [router]);

  if (!profile) return null;

  const consumedCal = todayLog?.totalCalories || 0;
  const consumedProtein = todayLog?.totalProtein || 0;

  return (
    <div className="space-y-6 pb-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">سلام، {profile.name} 👋</h1>
          <p className="text-slate-500 text-sm">امروز چقدر خوردی؟</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-2xl font-bold text-sm">
          {new Date().toLocaleDateString("fa-IR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
      </header>

      <section className="neu-card flex flex-col items-center">
        <CircularProgress
          value={consumedCal}
          target={profile.dailyCalorieTarget}
          label="کالری مصرفی"
          unit="kcal"
        />

        <div className="flex justify-around w-full mt-8 border-t border-slate-100 pt-6">
          <MacroInfo
            label="پروتئین"
            value={consumedProtein}
            target={profile.dailyProteinTarget}
            unit="g"
          />
          <MacroInfo
            label="کربوهیدرات"
            value={todayLog?.totalCarbs || 0}
            target={profile.dailyCarbTarget}
            unit="g"
          />
          <MacroInfo
            label="چربی"
            value={todayLog?.totalFat || 0}
            target={profile.dailyFatTarget}
            unit="g"
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 pr-2">روند وزن</h2>
        <TrendChart />
      </section>

      <NutritionTips />
    </div>
  );
}

const MacroInfo = ({ label, value, target, unit }: any) => (
  <div className="text-center">
    <div className="text-[10px] text-slate-500 font-bold mb-1">{label}</div>
    <div className="text-sm font-bold">
      {formatNumber(Math.round(value))}
      {unit}
    </div>
    <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
      />
    </div>
  </div>
);
