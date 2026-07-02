"use client";

interface WeeklyTrendsProps {
  trends: { day: string; count: number }[];
}

export default function WeeklyTrends({ trends }: WeeklyTrendsProps) {
  const maxCount = Math.max(...trends.map((t) => t.count), 1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#031636]">Tren Pemesanan Mingguan</h3>
        <span className="text-xs text-slate-400">7 Hari Terakhir</span>
      </div>

      <div className="relative h-64 w-full flex items-end justify-between pt-8 pb-4 px-2">
        {trends.map((t, idx) => {
          const percent = (t.count / maxCount) * 100;
          return (
            <div key={idx} className="flex flex-col items-center flex-1 group">
              <div className="relative w-full max-w-[48px] flex justify-center items-end h-48">
                {/* Tooltip */}
                <span className="absolute -top-8 bg-[#031636] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow z-10 whitespace-nowrap">
                  {t.count} booking
                </span>
                {/* Bar */}
                <div 
                  style={{ height: `${Math.max(percent, 4)}%` }} 
                  className={`w-full max-w-[32px] mx-1 rounded-t-lg transition-all duration-300 ${
                    percent > 0 
                      ? "bg-[#FEA619] shadow-[#FEA619]/20" 
                      : "bg-slate-100"
                  } hover:bg-[#e89500]`}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500 mt-2">{t.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
