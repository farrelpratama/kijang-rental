"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";

interface TransactionItem {
  id: string;
  date: string;
  time: string;
  bookingRef: string;
  carModel: string;
  amount: number;
  status: string;
  statusBg: string;
}

export default function PaymentHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  useEffect(() => {
    async function fetchPayments() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: dbBookings, error: dbError } = await supabase
          .from("bookings")
          .select(`
            *,
            car:cars(*)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (dbError || !dbBookings) {
          console.error("Error fetching bookings:", dbError?.message);
          setLoading(false);
          return;
        }

        // Calculate Outstanding Balance (Pending)
        const pendingSum = dbBookings
          .filter((b) => b.status === "pending")
          .reduce((sum, b) => sum + Number(b.total_price), 0);

        // Calculate Total Spent (Completed or Confirmed)
        const spentSum = dbBookings
          .filter((b) => b.status === "completed" || b.status === "confirmed" || b.status === "ongoing")
          .reduce((sum, b) => sum + Number(b.total_price), 0);

        setOutstandingBalance(pendingSum);
        setTotalSpent(spentSum);

        // Map bookings to transaction items
        const mappedTransactions: TransactionItem[] = dbBookings.map((b: any) => {
          const created = new Date(b.created_at || b.start_date);
          const dateStr = created.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
          const timeStr = created.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

          // Map status
          let status = "Pending";
          let statusBg = "bg-amber-50 text-amber-700 border border-amber-200";

          if (b.status === "completed" || b.status === "confirmed" || b.status === "ongoing") {
            status = "Paid";
            statusBg = "bg-emerald-50 text-emerald-700 border border-emerald-200";
          } else if (b.status === "cancelled") {
            status = "Failed";
            statusBg = "bg-red-50 text-red-700 border border-red-200";
          }

          return {
            id: b.id,
            date: dateStr,
            time: timeStr,
            bookingRef: b.id.substring(0, 8).toUpperCase(),
            carModel: b.car ? `${b.car.brand} ${b.car.model}` : "Kendaraan",
            amount: Number(b.total_price),
            status,
            statusBg,
          };
        });

        setTransactions(mappedTransactions);
      } catch (err) {
        console.error("Error fetching payment history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  const handlePayNow = (ref: string, amount: number) => {
    alert(`Membuka Midtrans Snap Payment untuk booking #${ref} senilai ${formatIDR(amount)}...`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#031636] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bento Grid Summary Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Outstanding Balance */}
        <div className="relative overflow-hidden rounded-3xl bg-[#031636] p-6 text-white shadow-md md:col-span-2 flex flex-col justify-between min-h-[180px]">
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
                onClick={() => handlePayNow(transactions.find(t => t.status === "Pending")?.bookingRef || "TOTAL", outstandingBalance)}
                className="rounded-xl bg-[#FEA619] hover:bg-[#e89500] px-6 py-3 text-xs font-bold text-white transition shadow-md"
              >
                Bayar Sekarang
              </button>
            </div>
          )}
        </div>

        {/* Total Spent */}
        <div className="rounded-3xl border border-slate-150 bg-white p-6 shadow-sm flex flex-col justify-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#031636]">
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

      {/* Transactions Table Card */}
      <div className="rounded-[32px] border border-slate-150 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-[#031636]">Riwayat Transaksi</h3>
        </div>

        <div className="overflow-x-auto w-full">
          {transactions.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              Belum ada riwayat transaksi pembayaran.
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6">ID Booking</th>
                  <th className="py-4 px-6">Kendaraan</th>
                  <th className="py-4 px-6">Jumlah</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#031636]">{tx.date}</span>
                        <span className="text-xs text-slate-400">{tx.time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-[#031636]">
                      #{tx.bookingRef}
                    </td>
                    <td className="py-4 px-6">{tx.carModel}</td>
                    <td className="py-4 px-6 font-bold text-[#031636]">
                      {formatIDR(tx.amount)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${tx.statusBg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          tx.status === "Paid"
                            ? "bg-emerald-500"
                            : tx.status === "Pending"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`} />
                        {tx.status === "Paid" ? "Lunas" : tx.status === "Pending" ? "Pending" : "Batal"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {tx.status === "Pending" && (
                        <button
                          onClick={() => handlePayNow(tx.bookingRef, tx.amount)}
                          className="rounded-lg bg-[#FEA619] hover:bg-[#e89500] px-4 py-2 text-xs font-bold text-white transition"
                        >
                          Bayar
                        </button>
                      )}
                      {tx.status === "Paid" && (
                        <button
                          onClick={() => alert(`Mengunduh kuitansi ${tx.bookingRef}...`)}
                          className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition"
                        >
                          Kuitansi
                        </button>
                      )}
                      {tx.status === "Failed" && (
                        <button
                          onClick={() => handlePayNow(tx.bookingRef, tx.amount)}
                          className="rounded-lg border border-red-200 hover:bg-red-50 px-3.5 py-2 text-xs font-bold text-red-500 transition"
                        >
                          Coba Lagi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
