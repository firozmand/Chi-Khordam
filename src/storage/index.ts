import { UserProfile, MealTemplate, DailyLog, WeightEntry } from "../types";

const KEYS = {
  PROFILE: "chi_khordam_profile",
  TEMPLATES: "chi_khordam_templates",
  LOGS: "chi_khordam_logs",
  WEIGHT_HISTORY: "chi_khordam_weight_history",
};

export const storage = {
  getProfile: (): UserProfile | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  },
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  getTemplates: (): MealTemplate[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(KEYS.TEMPLATES);
    return data ? JSON.parse(data) : [];
  },
  saveTemplates: (templates: MealTemplate[]) => {
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates));
  },

  getLogs: (): DailyLog[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },
  getLogByDate: (date: string): DailyLog | null => {
    const logs = storage.getLogs();
    return logs.find((log) => log.date === date) || null;
  },
  saveLog: (log: DailyLog) => {
    const logs = storage.getLogs();
    const index = logs.findIndex((l) => l.date === log.date);
    if (index > -1) {
      logs[index] = log;
    } else {
      logs.push(log);
    }
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  },

  getWeightHistory: (): WeightEntry[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(KEYS.WEIGHT_HISTORY);
    return data ? JSON.parse(data) : [];
  },
  saveWeightEntry: (entry: WeightEntry) => {
    const history = storage.getWeightHistory();
    const index = history.findIndex((e) => e.date === entry.date);
    if (index > -1) {
      history[index] = entry;
    } else {
      history.push(entry);
    }
    localStorage.setItem(KEYS.WEIGHT_HISTORY, JSON.stringify(history));
  },
};
