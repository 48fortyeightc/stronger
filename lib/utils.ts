import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clampScore(value: number) {
  return Math.max(1, Math.min(10, value));
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function trendLabel(trend: "up" | "steady" | "down") {
  if (trend === "up") return "上升";
  if (trend === "down") return "波动";
  return "稳定";
}
