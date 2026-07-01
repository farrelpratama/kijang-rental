"use client";

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
}

interface BookingCardProps {
  booking: Booking;
  formatIDR: (num: number) => string;
  updatingId: string | null;
  onUpdateStatus: (id: string, newStatus: Booking["status"]) => Promise<void>;
}

export default function BookingCard({
  booking,
  formatIDR,
  updatingId,
  onUpdateStatus,
}: BookingCardProps) {
  const days = Math.max(
    Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 365 * 24)) || 1,
    Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)) || 1
  );

  return (
    <div 
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6"
    >
      {/* Main Details */}
      <div className="space-y-3 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded">
            ID: {booking.id.substring(0, 8).toUpperCase()}
          </span>
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
            booking.status === "completed" 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-150" 
              : booking.status === "ongoing" 
              ? "bg-blue-50 text-blue-700 border border-blue-150"
              : booking.status === "pending" 
              ? "bg-amber-50 text-amber-700 border border-amber-150" 
              : booking.status === "confirmed" 
              ? "bg-indigo-50 text-indigo-700 border border-indigo-150" 
              : "bg-rose-50 text-rose-700 border border-rose-150"
          }`}>
            {booking.status}
          </span>
          <span className="text-xs text-slate-400">
            Dibuat pada: {new Date(booking.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer */}
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pelanggan</p>
            <p className="font-bold text-[#031636] mt-0.5">{booking.customerName}</p>
            <p className="text-xs text-slate-400">{booking.customerEmail} • {booking.customerPhone}</p>
          </div>

          {/* Car */}
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mobil</p>
            <p className="font-bold text-[#031636] mt-0.5">{booking.carBrand} {booking.carModel}</p>
            <p className="text-xs text-slate-400">{formatIDR(booking.carPrice)} / hari</p>
          </div>

          {/* Dates */}
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Jadwal Sewa</p>
            <p className="font-bold text-[#031636] mt-0.5">
              {new Date(booking.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} - {new Date(booking.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <p className="text-xs text-slate-400">{days} hari sewa</p>
          </div>
        </div>
      </div>

      {/* Total and CTA Actions */}
      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-50 lg:pl-6">
        <div className="text-left lg:text-right">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Biaya</p>
          <p className="text-xl font-extrabold text-[#031636] mt-0.5">{formatIDR(booking.totalPrice)}</p>
        </div>

        <div className="flex gap-2">
          {booking.status === "pending" && (
            <>
              <button
                disabled={updatingId === booking.id}
                onClick={() => onUpdateStatus(booking.id, "cancelled")}
                className="px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:text-white rounded-xl transition"
              >
                Tolak
              </button>
              <button
                disabled={updatingId === booking.id}
                onClick={() => onUpdateStatus(booking.id, "confirmed")}
                className="px-3 py-2 text-xs font-bold text-white bg-[#031636] hover:bg-[#05204f] rounded-xl transition shadow"
              >
                Setujui
              </button>
            </>
          )}

          {booking.status === "confirmed" && (
            <button
              disabled={updatingId === booking.id}
              onClick={() => onUpdateStatus(booking.id, "ongoing")}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow flex items-center gap-1.5"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 11-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586l6.879-6.879A6 6 0 1121 9z" />
              </svg>
              Serah Terima Kunci
            </button>
          )}

          {booking.status === "ongoing" && (
            <button
              disabled={updatingId === booking.id}
              onClick={() => onUpdateStatus(booking.id, "completed")}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow flex items-center gap-1.5"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Mobil Kembali
            </button>
          )}

          {booking.status === "completed" && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Transaksi Selesai
            </span>
          )}

          {booking.status === "cancelled" && (
            <span className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Pemesanan Dibatalkan
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
