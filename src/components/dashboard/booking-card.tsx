"use client";

import Image from "next/image";
import Link from "next/link";

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

interface BookingCardProps {
  booking: Booking;
  formatIDR: (num: number) => string;
  onDownloadInvoice: (ref: string) => void;
}

export default function BookingCard({
  booking,
  formatIDR,
  onDownloadInvoice,
}: BookingCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-150 bg-white p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col md:flex-row gap-6">
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
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : booking.status === "completed"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-red-50 text-red-700 border-red-200"
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
              <span className="text-xs text-slate-400 font-semibold">
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
          <p className="text-xs text-slate-400 mt-0.5">
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
              <button className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition">
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
              <button className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition">
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
                onClick={() => onDownloadInvoice(booking.ref)}
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
        </div>
      </div>
    </div>
  );
}
