"use client";

interface FleetToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  count: number;
}

export default function FleetToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  count,
}: FleetToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari mobil..."
          className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-slate-50 border-0 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#031636] transition-all text-sm"
        />
      </div>

      {/* Sort & Count */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <span className="text-xs text-slate-400 font-semibold">
          Menampilkan <strong className="text-[#031636]">{count}</strong> armada
        </span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-slate-50 border-0 rounded-lg px-3 py-2 text-xs font-bold text-[#031636] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#031636] outline-none cursor-pointer transition"
        >
          <option value="latest">Terbaru</option>
          <option value="price-low">Tarif: Terendah</option>
          <option value="price-high">Tarif: Tertinggi</option>
          <option value="rating">Rating Tertinggi</option>
        </select>
      </div>
    </div>
  );
}