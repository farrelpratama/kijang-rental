"use client";

interface StatsGridProps {
  activeCount: number;
  totalCount: number;
  pendingCount: number;
}

export default function StatsGrid({
  activeCount,
  totalCount,
  pendingCount,
}: StatsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Active Bookings Card */}
      <div className="rounded-xl bg-white p-6 shadow-sm flex items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sewa Aktif</p>
          <h4 className="text-2xl font-black text-[#031636] mt-1">{activeCount} Mobil</h4>
        </div>
      </div>

      {/* Total Rentals Card */}
      <div className="rounded-xl bg-white p-6 shadow-sm flex items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-50 text-slate-600 shrink-0">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Transaksi</p>
          <h4 className="text-2xl font-black text-[#031636] mt-1">{totalCount} Kali</h4>
        </div>
      </div>

      {/* Pending Payments Card */}
      <div className="rounded-xl bg-white p-6 shadow-sm flex items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-50 text-amber-600 shrink-0">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menunggu Pembayaran</p>
          <h4 className="text-2xl font-black text-[#031636] mt-1">{pendingCount} Invoice</h4>
        </div>
      </div>
    </div>
  );
}
