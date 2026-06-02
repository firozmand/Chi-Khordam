"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { storage } from "@/storage";
import { WeightEntry } from "@/types";

export const TrendChart = () => {
  const [data, setData] = useState<WeightEntry[]>([]);

  useEffect(() => {
    const history = storage.getWeightHistory();
    // Sort by date and take last 7 days
    const sorted = [...history]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);

    // Format date for display
    const formatted = sorted.map((item) => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString("fa-IR", {
        day: "numeric",
        month: "short",
      }),
    }));

    setData(formatted);
  }, []);

  if (data.length === 0) {
    return (
      <div className="neu-card h-48 flex items-center justify-center text-slate-400 text-sm">
        داده‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  return (
    <div className="neu-card h-64 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={["dataMin - 1", "dataMax + 1"]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              direction: "rtl",
            }}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#8B5CF6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorWeight)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
