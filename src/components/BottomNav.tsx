"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Utensils, Plus, History, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "dashboard", label: "داشبورد", icon: LayoutDashboard, href: "/" },
  { id: "meals", label: "غذاهای من", icon: Utensils, href: "/meals" },
  { id: "add", label: "ثبت وعده", icon: Plus, href: "/add-meal", isFab: true },
  { id: "history", label: "تاریخچه", icon: History, href: "/history" },
  { id: "profile", label: "پروفایل", icon: User, href: "/profile" },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        if (tab.isFab) {
          return (
            <Link key={tab.id} href={tab.href} className="relative -top-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40 border-4 border-white"
              >
                <tab.icon size={32} />
              </motion.div>
            </Link>
          );
        }

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className="flex flex-col items-center gap-1 relative"
          >
            <motion.div
              animate={{
                scale: isActive ? 1.2 : 1,
                color: isActive ? "#8B5CF6" : "#64748b",
              }}
              className={cn(
                "p-2 rounded-xl transition-colors",
                isActive && "bg-primary/10",
              )}
            >
              <tab.icon size={24} />
            </motion.div>
            <span
              className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-slate-400",
              )}
            >
              {tab.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
