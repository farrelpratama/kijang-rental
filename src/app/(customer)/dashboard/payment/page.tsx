"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import PaymentStats from "@/src/components/dashboard/payment-stats";
import TransactionTable from "@/src/components/dashboard/transaction-table";

interface Transaction {
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

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
        if (!user) return;

        // Fetch bookings for this user
        const { data: dbBookings, error: dbError } = await supabase
          .from("bookings")
          .select(`
            id,
            total_price,
            status,
            created_at,
            car:cars (
              brand,
              model
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (dbError || !dbBookings) {
          console.error("Error fetching bookings:", dbError?.message);
          setLoading(false);
          return;
        }

        // Calculate stats
        const pendingBookings = dbBookings.filter((b) => b.status === "pending");
        const unpaidSum = pendingBookings.reduce((sum, b) => sum + Number(b.total_price), 0);
        setOutstandingBalance(unpaidSum);

        const paidBookings = dbBookings.filter(
          (b) => b.status === "confirmed" || b.status === "ongoing" || b.status === "completed"
        );
        const paidSum = paidBookings.reduce((sum, b) => sum + Number(b.total_price), 0);
        setTotalSpent(paidSum);

        // Map bookings to transactions
        const mappedTransactions = dbBookings.map((b: any) => {
          const createdAt = new Date(b.created_at);
          const dateStr = createdAt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          const timeStr = createdAt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB";

          let status = "Pending";
          let statusBg = "bg-amber-50 text-amber-700 border border-amber-200";

          if (b.status === "confirmed" || b.status === "ongoing") {
            status = "Lunas";
            statusBg = "bg-emerald-50 text-emerald-700 border border-emerald-200";
          } else if (b.status === "completed") {
            status = "Selesai";
            statusBg = "bg-blue-50 text-blue-700 border border-blue-200";
          } else if (b.status === "cancelled") {
            status = "Batal";
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

  const pendingRef = transactions.find((t) => t.status === "Pending")?.bookingRef || "TOTAL";

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div>
        <h1 className="text-3xl font-black text-[#031636]">Riwayat Transaksi</h1>
        <p className="text-slate-500 mt-1">
          Pantau status transaksi pembayaran Anda dan selesaikan tagihan pending dengan cepat.
        </p>
      </div>

      {/* Payment Stats Cards Component */}
      <PaymentStats
        outstandingBalance={outstandingBalance}
        totalSpent={totalSpent}
        formatIDR={formatIDR}
        onPayNow={() => handlePayNow(pendingRef, outstandingBalance)}
      />

      {/* Transaction Table Component */}
      <TransactionTable
        transactions={transactions}
        formatIDR={formatIDR}
      />
    </div>
  );
}
