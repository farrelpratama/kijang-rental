import Link from "next/link";

export interface RecentBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

interface RecentBookingsTableProps {
  bookings: RecentBooking[];
  formatIDR: (num: number) => string;
}

export default function RecentBookingsTable({ bookings, formatIDR }: RecentBookingsTableProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#031636]">Pemesanan Terbaru</h3>
        <Link href="/admin/bookings" className="text-xs font-bold text-[#FEA619] hover:underline">
          Lihat Semua Pemesanan
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-4">Pelanggan</th>
              <th className="py-4 px-4">Kendaraan</th>
              <th className="py-4 px-4">Tanggal Sewa</th>
              <th className="py-4 px-4">Total Biaya</th>
              <th className="py-4 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                  Belum ada pemesanan masuk.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="py-4 px-4">
                    <p className="font-bold text-[#031636] text-sm">{b.customerName}</p>
                    <p className="text-xs text-slate-400">{b.customerEmail}</p>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#031636] text-sm">
                    {b.carName}
                  </td>
                  <td className="py-4 px-4 text-slate-500 text-sm">
                    {b.startDate} - {b.endDate}
                  </td>
                  <td className="py-4 px-4 font-bold text-[#031636] text-sm">
                    {formatIDR(b.totalPrice)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      b.status === "completed" 
                        ? "bg-emerald-50 text-emerald-700" 
                        : b.status === "ongoing" 
                        ? "bg-blue-50 text-blue-700"
                        : b.status === "pending" 
                        ? "bg-amber-50 text-amber-700 animate-pulse" 
                        : b.status === "confirmed" 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "bg-rose-50 text-rose-700"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
