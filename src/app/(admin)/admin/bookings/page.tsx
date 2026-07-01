"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import BookingFilters from "@/src/components/admin/booking-filters";
import BookingCard from "@/src/components/admin/booking-card";
import CustomerDetailModal from "@/src/components/admin/customer-detail-modal";

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carBrand: string;
  carModel: string;
  carPrice: number;
  customerId: string;
  customerCreatedAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string; email: string; phone: string | null; createdAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          user_id,
          start_date,
          end_date,
          total_price,
          status,
          created_at,
          user:users (
            id,
            name,
            email,
            phone,
            created_at
          ),
          car:cars (
            brand,
            model,
            price
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const mapped: Booking[] = data.map((b: any) => ({
          id: b.id,
          startDate: b.start_date,
          endDate: b.end_date,
          totalPrice: Number(b.total_price),
          status: b.status,
          createdAt: b.created_at,
          customerName: b.user?.name || "Pelanggan",
          customerEmail: b.user?.email || "",
          customerPhone: b.user?.phone || "-",
          carBrand: b.car?.brand || "Merek",
          carModel: b.car?.model || "Model",
          carPrice: Number(b.car?.price || 0),
          customerId: b.user?.id || b.user_id,
          customerCreatedAt: b.user?.created_at || b.created_at,
        }));
        setBookings(mapped);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId: string, newStatus: Booking["status"]) => {
    try {
      setUpdatingId(bookingId);
      const supabase = createClient();
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      setBookings(bookings.map((b) => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err: any) {
      console.error("Error updating booking status:", err);
      alert("Gagal memperbarui status booking: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = !statusFilter || b.status === statusFilter;
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.carBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.carModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.substring(0, 8).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#031636]">Daftar Pemesanan</h1>
        <p className="text-slate-500 mt-1">Kelola permohonan sewa, setujui pembayaran, dan pantau status mobil.</p>
      </div>

      {/* Filter toolbar */}
      <BookingFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Bookings List/Table */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white border border-slate-100 rounded-2xl"></div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 font-medium">
          Tidak ada pemesanan yang cocok dengan filter atau kata kunci.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              formatIDR={formatIDR}
              updatingId={updatingId}
              onUpdateStatus={updateBookingStatus}
              onViewCustomer={(cust) => setSelectedCustomer(cust)}
            />
          ))}
        </div>
      )}

      {/* Customer Detail Information Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}
