import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: string;
}

export function StatsCard({ title, value, change, trend, icon: Icon, color = "from-brand-500 to-brand-600" }: StatsCardProps) {
  return (
    <div className="card-premium rounded-2xl p-5 flex items-start gap-4 group">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 leading-none">{value}</p>
        {change && (
          <p className={cn(
            "text-xs font-medium mt-1.5 flex items-center gap-1",
            trend === "up"      && "text-green-500",
            trend === "down"    && "text-red-500",
            trend === "neutral" && "text-gray-500 dark:text-gray-400"
          )}>
            {trend === "up"   && "↑ "}
            {trend === "down" && "↓ "}
            {change}
          </p>
        )}
      </div>
    </div>
  );
}
