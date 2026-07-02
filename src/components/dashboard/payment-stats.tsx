"use client";

interface PaymentStatsProps {
  outstandingBalance: number;
  totalSpent: number;
  formatIDR: (num: number) => string;
  onPayNow: () => void;
}

export default function PaymentStats({
  outstandingBalance,
  totalSpent,
  formatIDR,
  onPayNow,
}: PaymentStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Outstanding Balance */}
      <div className="relative overflow-hidden rounded-xl bg-[#031636] p-6 text-white shadow-md md:col-span-2 flex flex-col justify-between min-h-[180px]">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tagihan Belum Dibayar</p>
          <h3 className="text-3xl font-black md:text-4xl">{formatIDR(outstandingBalance)}</h3>
          {outstandingBalance > 0 && (
            <p className="text-xs text-slate-350">Silakan selesaikan pembayaran secepatnya.</p>
          )}
        </div>

        {outstandingBalance > 0 && (
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={onPayNow}
              className="rounded-lg bg-[#FEA619] hover:bg-[#e89500] px-6 py-3 text-xs font-bold text-white transition shadow-md"
            >
              Bayar Sekarang
            </button>
          </div>
        )}
      </div>

      {/* Total Spent */}
      <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-[#031636]">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran Anda</p>
          <h3 className="text-2xl font-black text-[#031636] mt-1">{formatIDR(totalSpent)}</h3>
        </div>
      </div>
    </div>
  );
}
