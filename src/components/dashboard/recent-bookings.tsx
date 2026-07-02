"use client";

import Image from "next/image";
import Link from "next/link";

interface BookingItem {
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

interface RecentBookingsProps {
  bookings: BookingItem[];
  formatIDR: (num: number) => string;
}

export default function RecentBookings({
  bookings,
  formatIDR,
}: RecentBookingsProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-slate-200 bg-white p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <svg className="h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h4 className="font-bold text-[#031636]">Belum Ada Riwayat Sewa</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-[250px] leading-relaxed">
          Anda belum pernah melakukan pemesanan mobil sebelumnya.
        </p>
        <Link
          href="/cars"
          className="mt-4 rounded-xl bg-[#031636] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#05204f]"
        >
          Sewa Mobil Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="rounded-xl bg-white p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition duration-200"
        >
          {/* Thumbnail */}
          <div className="relative h-20 w-32 overflow-hidden rounded-lg bg-slate-100 shrink-0">
            <Image
              src={booking.thumbnail}
              alt={booking.carName}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-[#031636] text-sm sm:text-base truncate">
                {booking.carName}
              </h4>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                  booking.status === "ongoing"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : booking.status === "confirmed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : booking.status === "pending"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : booking.status === "completed"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {booking.status === "ongoing"
                  ? "Terkonfirmasi"
                  : booking.status === "confirmed"
                  ? "Pembayaran Lunas"
                  : booking.status === "pending"
                  ? "Pending"
                  : booking.status === "completed"
                  ? "Selesai"
                  : "Dibatalkan"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {booking.category} • {booking.transmission}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {booking.startDate} s/d {booking.endDate}
            </p>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="font-black text-[#031636] text-sm sm:text-base">
              {formatIDR(booking.totalPrice)}
            </p>
            <p className="text-[10px] text-slate-400">Total Biaya</p>
          </div>
        </div>
      ))}
    </div>
  );
}
