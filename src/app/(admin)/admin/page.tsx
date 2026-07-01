"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import StatCard from "@/src/components/admin/stat-card";
import WeeklyTrends from "@/src/components/admin/weekly-trends";
import QuickActions from "@/src/components/admin/quick-actions";
import RecentBookingsTable, { RecentBooking } from "@/src/components/admin/recent-bookings-table";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    monthlyRevenue: 0,
    activeRentals: 0,
    availableCars: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<{ day: string; count: number }[]>([]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const supabase = createClient();

        // 1. Fetch total bookings count
        const { count: bookingsCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true });

        // 2. Fetch monthly revenue
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const { data: payments } = await supabase
          .from("payments")
          .select("amount")
          .eq("payment_status", "paid")
          .gte("created_at", firstDayOfMonth);
        
        const revenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        // 3. Fetch active rentals (ongoing bookings)
        const { count: activeCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("status", "ongoing");

        // 4. Fetch available cars count
        const { count: availableCount } = await supabase
          .from("cars")
          .select("*", { count: "exact", head: true })
          .eq("available", true);

        setStats({
          totalBookings: bookingsCount || 0,
          monthlyRevenue: revenue,
          activeRentals: activeCount || 0,
          availableCars: availableCount || 0,
        });

        // 5. Fetch recent bookings with user and car data
        const { data: dbBookings } = await supabase
          .from("bookings")
          .select(`
            id,
            start_date,
            end_date,
            total_price,
            status,
            created_at,
            user:users (
              name,
              email
            ),
            car:cars (
              brand,
              model
            )
          `)
          .order("created_at", { ascending: false })
          .limit(5);

        if (dbBookings) {
          const mapped: RecentBooking[] = dbBookings.map((b: any) => ({
            id: b.id,
            customerName: b.user?.name || "Pelanggan",
            customerEmail: b.user?.email || "",
            carName: b.car ? `${b.car.brand} ${b.car.model}` : "Kendaraan",
            startDate: new Date(b.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
            endDate: new Date(b.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
            totalPrice: Number(b.total_price),
            status: b.status,
          }));
          setRecentBookings(mapped);
        }

        // 6. Calculate booking trends (last 7 days)
        const { data: trendBookings } = await supabase
          .from("bookings")
          .select("created_at")
          .order("created_at", { ascending: false });

        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return {
            dateStr: d.toDateString(),
            label: d.toLocaleDateString("id-ID", { weekday: "short" }),
            count: 0,
          };
        }).reverse();

        trendBookings?.forEach((tb) => {
          const bookingDate = new Date(tb.created_at).toDateString();
          const dayObj = last7Days.find((d) => d.dateStr === bookingDate);
          if (dayObj) {
            dayObj.count += 1;
          }
        });

        setWeeklyTrends(last7Days.map((d) => ({ day: d.label, count: d.count })));

      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl"></div>
          <div className="h-96 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-[#031636]">
          Overview Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Selamat datang kembali. Berikut adalah status operasional armada Kijang Rental hari ini.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pemesanan"
          value={stats.totalBookings}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          description="semua status sewa"
          trend={{ value: "12%", isPositive: true }}
        />
        <StatCard
          title="Pendapatan Bulan Ini"
          value={formatIDR(stats.monthlyRevenue)}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          description="transaksi berstatus paid"
          trend={{ value: "8.5%", isPositive: true }}
        />
        <StatCard
          title="Rental Aktif"
          value={stats.activeRentals}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          description="mobil sedang di jalan"
        />
        <StatCard
          title="Armada Tersedia"
          value={stats.availableCars}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586l6.879-6.879A6 6 0 1121 9z" />
            </svg>
          }
          description="siap dipesan oleh pelanggan"
        />
      </div>

      {/* Charts & Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WeeklyTrends trends={weeklyTrends} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Recent Bookings Table */}
      <RecentBookingsTable bookings={recentBookings} formatIDR={formatIDR} />
    </div>
  );
}