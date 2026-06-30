"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/client";

interface BookingItem {
  id: string;
  ref: string;
  carName: string;
  category: string;
  transmission: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  price: number;
  days: number;
  status: string;
  thumbnail: string;
}

type BookingStatusFilter = "All" | "pending" | "confirmed" | "ongoing" | "completed" | "cancelled";

export default function MyBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<BookingStatusFilter>("All");

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  useEffect(() => {
    async function fetchBookings() {
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

        const mappedBookings = dbBookings.map((b: any) => {
          const start = new Date(b.start_date);
          const end = new Date(b.end_date);
          const diffTime = end.getTime() - start.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

          return {
            id: b.id,
            ref: b.id.substring(0, 8).toUpperCase(),
            carName: b.car ? `${b.car.brand} ${b.car.model}` : "Kendaraan",
            category: b.car?.category || "Mobil",
            transmission: b.car?.transmission || "Automatic",
            pickupDate: `${start.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}, 09:00 AM`,
            returnDate: `${end.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}, 09:00 AM`,
            pickupLocation: "Kantor Kijang Rental (Sleman)",
            returnLocation: "Kantor Kijang Rental (Sleman)",
            price: Number(b.total_price),
            days: diffDays,
            status: b.status,
            thumbnail: b.car?.image_url || b.car?.thumbnail || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600&auto=format&fit=crop",
          };
        });

        setBookings(mappedBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    if (activeFilter === "All") return bookings;
    return bookings.filter((b) => b.status === activeFilter);
  }, [activeFilter, bookings]);

  const handleDownloadInvoice = (ref: string) => {
    alert(`Mengunduh invoice untuk booking ${ref}... (Simulasi PDF menggunakan @react-pdf/renderer)`);
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
      {/* Filters */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2 overflow-x-auto scrollbar-none">
        {(["All", "pending", "confirmed", "ongoing", "completed", "cancelled"] as BookingStatusFilter[]).map(
          (filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#031636] text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {filter === "All"
                  ? "Semua Booking"
                  : filter === "pending"
                  ? "Pending"
                  : filter === "confirmed"
                  ? "Dikonfirmasi"
                  : filter === "ongoing"
                  ? "Aktif"
                  : filter === "completed"
                  ? "Selesai"
                  : "Dibatalkan"}
              </button>
            );
          }
        )}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-white p-8 text-center">
            <svg className="h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-bold text-[#031636]">Tidak Ada Booking</h3>
            <p className="text-slate-500 mt-2">
              Anda tidak memiliki data booking untuk status "{
                activeFilter === "All"
                  ? "Semua"
                  : activeFilter === "pending"
                  ? "Pending"
                  : activeFilter === "confirmed"
                  ? "Dikonfirmasi"
                  : activeFilter === "ongoing"
                  ? "Aktif"
                  : activeFilter === "completed"
                  ? "Selesai"
                  : "Dibatalkan"
              }".
            </p>
            <Link
              href="/cars"
              className="mt-6 rounded-2xl bg-[#031636] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#05204f]"
            >
              Mulai Sewa Mobil
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="relative overflow-hidden rounded-3xl border border-slate-150 bg-white p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col md:flex-row gap-6"
            >
              {/* Status Indicator Bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  booking.status === "ongoing"
                    ? "bg-emerald-500"
                    : booking.status === "confirmed"
                    ? "bg-indigo-500"
                    : booking.status === "pending"
                    ? "bg-amber-500"
                    : booking.status === "completed"
                    ? "bg-blue-500"
                    : "bg-red-500"
                }`}
              />

              {/* Thumbnail */}
              <div className="relative h-36 w-full md:w-56 overflow-hidden rounded-2xl bg-slate-150 shrink-0">
                <Image
                  src={booking.thumbnail}
                  alt={booking.carName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Booking Information */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === "ongoing"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : booking.status === "confirmed"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : booking.status === "pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : booking.status === "completed"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {booking.status === "ongoing"
                          ? "Aktif"
                          : booking.status === "confirmed"
                          ? "Dikonfirmasi"
                          : booking.status === "pending"
                          ? "Pending"
                          : booking.status === "completed"
                          ? "Selesai"
                          : "Dibatalkan"}
                      </span>
                      <span className="text-xs text-slate-455 font-semibold">
                        Ref: #{booking.ref}
                      </span>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-black text-[#031636] text-lg">
                        {formatIDR(booking.price)}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Total / {booking.days} Hari
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#031636]">
                    {booking.carName}
                  </h3>
                  <p className="text-xs text-slate-455 mt-0.5">
                    {booking.category} • {booking.transmission}
                  </p>
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-slate-100 my-4 py-3 text-slate-600 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[#031636] shrink-0">
                      <svg className="h-4 w-4 text-[#031636]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Penjemputan</p>
                      <p className="font-semibold text-[#031636]">{booking.pickupDate}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{booking.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[#031636] shrink-0">
                      <svg className="h-4 w-4 text-[#031636]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Pengembalian</p>
                      <p className="font-semibold text-[#031636]">{booking.returnDate}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{booking.returnLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  {booking.status === "pending" && (
                    <>
                      <button className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-55 transition">
                        Batalkan
                      </button>
                      <Link
                        href="/dashboard/payment"
                        className="rounded-xl bg-[#FEA619] hover:bg-[#e89500] px-5 py-2.5 text-xs font-bold text-white transition"
                      >
                        Bayar Sekarang
                      </Link>
                    </>
                  )}
                  {booking.status === "confirmed" && (
                    <>
                      <button className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-55 transition">
                        Batalkan
                      </button>
                      <button className="rounded-xl bg-[#031636] hover:bg-[#05204f] px-5 py-2.5 text-xs font-bold text-white transition">
                        Ubah Tanggal
                      </button>
                    </>
                  )}
                  {booking.status === "ongoing" && (
                    <button className="rounded-xl bg-[#031636] hover:bg-[#05204f] px-5 py-2.5 text-xs font-bold text-white transition">
                      Lacak Lokasi
                    </button>
                  )}
                  {booking.status === "completed" && (
                    <>
                      <button
                        onClick={() => handleDownloadInvoice(booking.ref)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
                      >
                        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Unduh Invoice
                      </button>
                      <Link
                        href={`/cars`}
                        className="rounded-xl bg-[#FEA619] hover:bg-[#e89500] px-5 py-2.5 text-xs font-bold text-white transition"
                      >
                        Sewa Lagi
                      </Link>
                    </>
                  )}
                  {booking.status === "cancelled" && (
                    <Link
                      href={`/cars`}
                      className="rounded-xl bg-[#031636] hover:bg-[#05204f] px-5 py-2.5 text-xs font-bold text-white transition"
                    >
                      Sewa Lagi
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
