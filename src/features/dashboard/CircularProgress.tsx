"use client";

import React from "react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  target: number;
  label: string;
  unit: string;
}

export const CircularProgress = ({
  value,
  target,
  label,
  unit,
}: CircularProgressProps) => {
  const percentage = Math.min((value / target) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 90;
  const strokeDashoffset =
    strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Background Circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="128"
          cy="128"
          r="90"
          fill="none"
          stroke="#F3F4F6"
          strokeWidth="16"
          className="shadow-inner"
        />
        <motion.circle
          cx="128"
          cy="128"
          r="90"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="16"
          strokeLinecap="round"
          initial={{ strokeDashoffset: strokeDasharray }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-slate-800">
            {formatNumber(Math.round(value))}
          </span>
          <span className="text-slate-400 font-bold text-sm">
            / {formatNumber(Math.round(target))}
          </span>
        </div>
        <span className="text-slate-400 text-xs mt-1">{unit}</span>
      </div>
    </div>
  );
};
