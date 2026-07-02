"use client";

import Link from "next/link";

interface DuePayment {
  dueDate: string;
  ref: string;
  amount: number;
}

interface PaymentSummaryProps {
  nextDuePayment: DuePayment | null;
  formatIDR: (num: number) => string;
}

export default function PaymentSummary({
  nextDuePayment,
  formatIDR,
}: PaymentSummaryProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col justify-between space-y-6">
      {nextDuePayment ? (
        <>
          <div>
            <h3 className="text-xl font-bold text-[#031636] mb-6">Ringkasan Pembayaran</h3>
            
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Tagihan Berikutnya</span>
                <span className="font-bold text-[#031636]">{nextDuePayment.dueDate}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Kode Booking</span>
                <span className="font-mono font-bold text-[#031636]">#{nextDuePayment.ref}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-sm text-slate-500">Jumlah Tagihan</span>
                <span className="text-2xl font-black text-[#031636]">
                  {formatIDR(nextDuePayment.amount)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/dashboard/payment"
              className="block w-full py-4 text-center bg-[#031636] hover:bg-[#05204f] text-white font-bold rounded-lg transition shadow-md"
            >
              Bayar Sekarang
            </Link>
            <p className="text-center text-[11px] text-slate-400">
              Pembayaran menggunakan Midtrans Snap aman & terenkripsi.
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center h-full py-8 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="font-bold text-[#031636]">Semua Tagihan Lunas</h4>
          <p className="text-xs text-slate-500 max-w-[200px]">
            Anda tidak memiliki tagihan pembayaran yang tertunda saat ini.
          </p>
          <Link
            href="/cars"
            className="w-full py-3 text-center bg-slate-100 hover:bg-slate-200 text-[#031636] font-bold text-xs rounded-lg transition"
          >
            Sewa Mobil Lagi
          </Link>
        </div>
      )}
    </div>
  );
}
