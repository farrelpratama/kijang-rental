"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/client";
import StatsGrid from "@/src/components/dashboard/stats-grid";
import RecentBookings from "@/src/components/dashboard/recent-bookings";
import PaymentSummary from "@/src/components/dashboard/payment-summary";

interface Booking {
  id: string;
  carName: string;
  category: string;
  transmission: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

interface DuePayment {
  dueDate: string;
  ref: string;
  amount: number;
}

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");

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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user profile
        const { data: profile } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single();
        if (profile) {
          setFullName(profile.name);
        }

        // Fetch bookings with related car
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
          const formattedStart = start.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
          const formattedEnd = end.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

          return {
            id: b.id,
            carName: b.car ? `${b.car.brand} ${b.car.model}` : "Kendaraan",
            category: b.car?.category || "N/A",
            transmission: b.car?.transmission || "N/A",
            thumbnail: b.car?.thumbnail || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600",
            startDate: formattedStart,
            endDate: formattedEnd,
            totalPrice: Number(b.total_price),
            status: b.status,
          };
        });

        setBookings(mappedBookings);
      } catch (err) {
        console.error("Error in dashboard fetch:", err);
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

  // Calculate statistics
  const activeCount = bookings.filter((b) => b.status === "ongoing").length;
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  // Find the next due payment (first pending booking)
  const firstPending = bookings.find((b) => b.status === "pending");
  const nextDuePayment: DuePayment | null = firstPending
    ? {
        dueDate: firstPending.startDate,
        ref: firstPending.id.substring(0, 8).toUpperCase(),
        amount: firstPending.totalPrice,
      }
    : null;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-[#031636]">
          Halo, {fullName || "Pelanggan"}!
        </h1>
        <p className="text-slate-500 mt-1">
          Selamat datang kembali di dashboard Anda. Berikut adalah ringkasan perjalanan Anda bersama Kijang Rental.
        </p>
      </div>

      {/* Stats Grid Component */}
      <StatsGrid
        activeCount={activeCount}
        totalCount={totalCount}
        pendingCount={pendingCount}
      />

      {/* Main Sections (Grid) */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Rentals List (Spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#031636]">Riwayat Sewa Terakhir</h3>
            <Link
              href="/dashboard/bookings"
              className="text-xs font-bold text-[#FEA619] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <RecentBookings bookings={bookings.slice(0, 3)} formatIDR={formatIDR} />
        </div>

        {/* Payment Summary Sidebar */}
        <PaymentSummary nextDuePayment={nextDuePayment} formatIDR={formatIDR} />
      </div>
    </div>
  );
}
