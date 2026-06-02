"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserProfile, Gender, GoalType, ActivityLevel } from "@/types";
import { storage } from "@/storage";
import {
  calculateBMR,
  getActivityMultiplier,
  calculateTargets,
} from "@/utils/calculations";

export const ProfileForm = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: "",
    gender: "male",
    age: 25,
    height: 175,
    weight: 75,
    targetWeight: 70,
    monthlyWeightLoss: 2,
    activityLevel: "moderate",
    workoutDays: 3,
    goalType: "weight-loss",
  });

  useEffect(() => {
    const existing = storage.getProfile();
    if (existing) {
      setProfile(existing);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bmr = calculateBMR(
      profile.gender as Gender,
      profile.weight!,
      profile.height!,
      profile.age!,
    );
    const multiplier = getActivityMultiplier(
      profile.activityLevel as ActivityLevel,
    );
    const tdee = bmr * multiplier;

    const targets = calculateTargets(
      tdee,
      profile.goalType as GoalType,
      profile.monthlyWeightLoss!,
      profile.weight!,
    );

    const fullProfile: UserProfile = {
      ...(profile as UserProfile),
      bmr,
      tdee,
      ...targets,
      createdAt: new Date().toISOString(),
    };

    storage.saveProfile(fullProfile);

    // Also save initial weight entry
    storage.saveWeightEntry({
      date: new Date().toISOString().split("T")[0],
      weight: profile.weight!,
    });

    router.push("/");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 pb-12"
    >
      <div className="bg-white rounded-[32px] p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          تنظیمات پروفایل
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 pr-2">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              required
              className="neu-input"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 pr-2">جنسیت</label>
              <select
                className="neu-input"
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value as Gender })
                }
              >
                <option value="male">مرد</option>
                <option value="female">زن</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 pr-2">سن</label>
              <input
                type="number"
                required
                className="neu-input"
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 pr-2">
                قد (سانتی‌متر)
              </label>
              <input
                type="number"
                required
                className="neu-input"
                value={profile.height}
                onChange={(e) =>
                  setProfile({ ...profile, height: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 pr-2">
                وزن فعلی (کیلوگرم)
              </label>
              <input
                type="number"
                step="0.1"
                required
                className="neu-input"
                value={profile.weight}
                onChange={(e) =>
                  setProfile({ ...profile, weight: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 pr-2">
                وزن هدف
              </label>
              <input
                type="number"
                step="0.1"
                className="neu-input"
                value={profile.targetWeight}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    targetWeight: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 pr-2">
                کاهش وزن در ماه
              </label>
              <input
                type="number"
                step="0.5"
                className="neu-input"
                value={profile.monthlyWeightLoss}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    monthlyWeightLoss: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 pr-2">
              سطح فعالیت
            </label>
            <select
              className="neu-input"
              value={profile.activityLevel}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  activityLevel: e.target.value as ActivityLevel,
                })
              }
            >
              <option value="sedentary">بدون فعالیت</option>
              <option value="light">فعالیت کم</option>
              <option value="moderate">فعالیت متوسط</option>
              <option value="active">فعالیت زیاد</option>
              <option value="very-active">فعالیت خیلی زیاد</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 pr-2">نوع هدف</label>
            <div className="flex bg-slate-100 rounded-[20px] p-1">
              {["weight-loss", "maintenance", "muscle-gain"].map((g) => (
                <button
                  key={g}
                  type="button"
                  className={cn(
                    "flex-1 py-2 rounded-[18px] text-[10px] font-bold transition-all",
                    profile.goalType === g
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-500",
                  )}
                  onClick={() =>
                    setProfile({ ...profile, goalType: g as GoalType })
                  }
                >
                  {g === "weight-loss"
                    ? "کاهش وزن"
                    : g === "maintenance"
                      ? "تثبیت"
                      : "عضله‌سازی"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="neu-button w-full mt-8 text-lg font-bold"
        >
          ذخیره اطلاعات
        </button>
      </div>
    </motion.form>
  );
};

// Helper function to concatenate classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
