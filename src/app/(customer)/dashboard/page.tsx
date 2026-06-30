"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/src/lib/supabase/client";

interface BookingItem {
  id: string;
  ref: string;
  carName: string;
  category: string;
  dates: string;
  price: number;
  status: string;
  statusBg: string;
  thumbnail: string;
}

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [stats, setStats] = useState({
    activeCount: 0,
    totalCount: 0,
    pendingAmount: 0,
  });
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [nextDuePayment, setNextDuePayment] = useState<{
    ref: string;
    amount: number;
    dueDate: string;
  } | null>(null);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createClient();
        
        // 1. Get Logged In User
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Get Name from User Metadata
        const name = user.user_metadata?.name || user.email?.split("@")[0] || "User";
        setUserName(name);

        // 2. Fetch User Bookings from Supabase
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

        // 3. Process Stats & Bookings
        const active = dbBookings.filter((b) => b.status === "ongoing").length;
        const total = dbBookings.filter((b) => b.status === "completed").length;
        const pendingBookings = dbBookings.filter((b) => b.status === "pending");
        const pendingSum = pendingBookings.reduce((sum, b) => sum + Number(b.total_price), 0);

        setStats({
          activeCount: active,
          totalCount: dbBookings.length,
          pendingAmount: pendingSum,
        });

        // Map database bookings to UI structure
        const mappedBookings: BookingItem[] = dbBookings.slice(0, 3).map((b: any) => {
          const start = new Date(b.start_date);
          const end = new Date(b.end_date);
          const dateStr = `${start.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} - ${end.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`;

          return {
            id: b.id,
            ref: b.id.substring(0, 8).toUpperCase(),
            carName: b.car ? `${b.car.brand} ${b.car.model}` : "Kendaraan",
            category: b.car?.category || "Mobil",
            dates: dateStr,
            price: Number(b.total_price),
            status: b.status,
            statusBg:
              b.status === "ongoing"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : b.status === "pending"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : b.status === "completed"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-red-50 text-red-700 border border-red-200",
            thumbnail: b.car?.image_url || b.car?.thumbnail || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600&auto=format&fit=crop",
          };
        });

        setBookings(mappedBookings);

        // 4. Next Due Payment
        if (pendingBookings.length > 0) {
          const nextDue = pendingBookings[0];
          const dueD = new Date(nextDue.start_date);
          setNextDuePayment({
            ref: nextDue.id.substring(0, 8).toUpperCase(),
            amount: Number(nextDue.total_price),
            dueDate: dueD.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
          });
        } else {
          setNextDuePayment(null);
        }

      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#031636] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#031636] md:text-4xl">
            Halo, {userName}!
          </h1>
          <p className="text-slate-500 mt-1">
            Berikut adalah ringkasan aktivitas rental mobil Anda hari ini.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#031636] transition hover:bg-slate-50"
          >
            <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Upload Dokumen
          </Link>
          <Link
            href="/cars"
            className="flex items-center gap-2 rounded-2xl bg-[#FEA619] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e89500] hover:scale-[1.02] shadow-md shadow-[#FEA619]/20"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Sewa Mobil
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Active Booking */}
        <div className="rounded-3xl border border-slate-150 bg-white p-6 shadow-sm flex flex-col justify-between h-40 transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            {stats.activeCount > 0 && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-750 border border-emerald-100">
                Aktif
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sewa Aktif</p>
            <h3 className="text-3xl font-black text-[#031636] mt-1">{stats.activeCount}</h3>
          </div>
        </div>

        {/* Card 2: Total Rentals */}
        <div className="rounded-3xl border border-slate-150 bg-white p-6 shadow-sm flex flex-col justify-between h-40 transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Rental</p>
            <h3 className="text-3xl font-black text-[#031636] mt-1">{stats.totalCount}</h3>
          </div>
        </div>

        {/* Card 3: Pending Payments */}
        <div className="rounded-3xl border border-slate-150 bg-white p-6 shadow-sm flex flex-col justify-between h-40 transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            {stats.pendingAmount > 0 && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-750 border border-amber-100">
                Menunggu Bayar
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Belum Dibayar</p>
            <h3 className="text-3xl font-black text-[#031636] mt-1">{formatIDR(stats.pendingAmount)}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Bookings List */}
        <div className="rounded-[32px] border border-slate-150 bg-white p-6 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#031636]">Sewa Terbaru</h3>
            {bookings.length > 0 && (
              <Link
                href="/dashboard/bookings"
                className="text-sm font-bold text-[#FEA619] hover:underline"
              >
                Lihat Semua
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                Belum ada transaksi sewa terdaftar.
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-24 overflow-hidden rounded-xl bg-slate-100 shrink-0">
                      <Image
                        src={booking.thumbnail}
                        alt={booking.carName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {booking.ref}
                      </span>
                      <h4 className="font-bold text-[#031636]">{booking.carName}</h4>
                      <p className="text-xs text-slate-500">{booking.dates}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-[#031636]">
                        {formatIDR(booking.price)}
                      </p>
                      <p className="text-[10px] text-slate-400">{booking.category}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${booking.statusBg}`}>
                      {booking.status === "ongoing" ? "Aktif" : booking.status === "pending" ? "Pending" : booking.status === "completed" ? "Selesai" : "Batal"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="rounded-[32px] border border-slate-150 bg-white p-6 shadow-sm flex flex-col justify-between space-y-6">
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
                  className="block w-full py-4 text-center bg-[#031636] hover:bg-[#05204f] text-white font-bold rounded-2xl transition shadow-md"
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
                className="w-full py-3 text-center bg-slate-100 hover:bg-slate-200 text-[#031636] font-bold text-xs rounded-xl transition"
              >
                Sewa Mobil Lagi
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
