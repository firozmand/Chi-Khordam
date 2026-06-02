"use client";

import React, { useState, useEffect } from "react";
import { storage } from "@/storage";
import { DailyLog } from "@/types";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";
import { Calendar } from "lucide-react";

export default function HistoryPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);

  useEffect(() => {
    // Current storage doesn't have a 'getAllLogs' method, I should add it
    // For now, I'll just get the last 7 days keys
    const all = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const log = storage.getLogByDate(dateStr);
      if (log) all.push(log);
    }
    setLogs(all);
  }, []);

  return (
    <div className="pb-24">
      <h1 className="text-2xl font-black mb-8">تاریخچه مصرف</h1>

      {logs.length > 0 ? (
        <div className="space-y-4">
          {logs.map((log, i) => (
            <motion.div
              key={log.date}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="neu-card flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-primary" />
                  <span className="font-bold text-sm">{log.date}</span>
                </div>
                <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                  <span>
                    🔥 {formatNumber(Math.round(log.totalCalories))} kcal
                  </span>
                  <span>🥩 {formatNumber(Math.round(log.totalProtein))}g</span>
                </div>
              </div>
              <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-500">
                جزئیات
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-slate-400">
          تاریخچه‌ای یافت نشد.
        </div>
      )}
    </div>
  );
}
