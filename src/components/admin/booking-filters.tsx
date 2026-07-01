"use client";

interface BookingFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
}

export default function BookingFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: BookingFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Cari ID booking, pelanggan, atau mobil..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm bg-slate-50/50"
        />
        <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm bg-white"
        >
          <option value="">Semua Status</option>
          <option value="pending">Pending (Menunggu)</option>
          <option value="confirmed">Confirmed (Disetujui)</option>
          <option value="ongoing">Ongoing (Sewa Berjalan)</option>
          <option value="completed">Completed (Selesai)</option>
          <option value="cancelled">Cancelled (Batal)</option>
        </select>
      </div>
    </div>
  );
}
