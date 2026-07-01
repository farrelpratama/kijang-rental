"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/client";
import BookingFilters from "@/src/components/dashboard/booking-filters";
import BookingCard from "@/src/components/dashboard/booking-card";

interface Booking {
  id: string;
  ref: string;
  carName: string;
  category: string;
  transmission: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  price: number;
  days: number;
  status: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

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
        if (!user) return;

        const { data: dbBookings, error: dbError } = await supabase
          .from("bookings")
          .select(`
            id,
            start_date,
            end_date,
            total_price,
            status,
            car:cars (
              brand,
              model,
              category,
              transmission,
              thumbnail
            )
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
          const daysDiff = Math.max(
            1,
            Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
          );

          const formattedStart = start.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const formattedEnd = end.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return {
            id: b.id,
            ref: b.id.substring(0, 8).toUpperCase(),
            carName: b.car ? `${b.car.brand} ${b.car.model}` : "Kendaraan",
            category: b.car?.category || "N/A",
            transmission: b.car?.transmission || "N/A",
            thumbnail: b.car?.thumbnail || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600",
            startDate: formattedStart,
            endDate: formattedEnd,
            pickupDate: `${formattedStart}, 09:00 WIB`,
            returnDate: `${formattedEnd}, 09:00 WIB`,
            pickupLocation: "Kantor Kijang Rental (Sleman, DIY)",
            returnLocation: "Kantor Kijang Rental (Sleman, DIY)",
            price: Number(b.total_price),
            days: daysDiff,
            status: b.status,
          };
        });

        setBookings(mappedBookings);
      } catch (err) {
        console.error("Error in bookings fetch:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const handleDownloadInvoice = (ref: string) => {
    alert(`Mengunduh berkas invoice PDF untuk booking #${ref}...`);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === "All") return true;
    return booking.status === activeFilter;
  });

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#031636] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div>
        <h1 className="text-3xl font-black text-[#031636]">Pesanan Saya</h1>
        <p className="text-slate-500 mt-1">
          Pantau status booking, lakukan pembayaran, atau unduh invoice resmi Anda.
        </p>
      </div>

      {/* Booking Filter Tabs Component */}
      <BookingFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-white p-8 text-center">
            <svg className="h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-bold text-[#031636]">Tidak Ada Booking</h3>
            <p className="text-slate-500 mt-2">
              Anda tidak memiliki data booking untuk status &ldquo;
              {activeFilter === "All"
                ? "Semua"
                : activeFilter === "pending"
                ? "Pending"
                : activeFilter === "confirmed"
                ? "Dikonfirmasi"
                : activeFilter === "ongoing"
                ? "Aktif"
                : activeFilter === "completed"
                ? "Selesai"
                : "Dibatalkan"}
              &rdquo;.
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
            <BookingCard
              key={booking.id}
              booking={booking}
              formatIDR={formatIDR}
              onDownloadInvoice={handleDownloadInvoice}
            />
          ))
        )}
      </div>
    </div>
  );
}
