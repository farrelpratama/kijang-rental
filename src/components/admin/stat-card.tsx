import { ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon, description, trend }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="text-3xl font-extrabold text-[#031636] mt-2 tracking-tight">{value}</h3>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl text-[#031636] border border-slate-100">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
        {trend && (
          <span className={`font-bold flex items-center gap-1 ${trend.isPositive ? "text-emerald-600" : "text-rose-600"}`}>
            <svg className={`h-3 w-3 ${trend.isPositive ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
            {trend.value}
          </span>
        )}
        <span>{description}</span>
      </div>
    </div>
  );
}
