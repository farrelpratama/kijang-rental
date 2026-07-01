"use client";

interface CarFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  transmissionFilter: string;
  onTransmissionFilterChange: (val: string) => void;
}

export default function CarFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  transmissionFilter,
  onTransmissionFilterChange,
}: CarFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Cari brand atau tipe mobil..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm bg-slate-50/50"
        />
        <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm bg-white"
        >
          <option value="">Semua Kategori</option>
          <option value="MPV">MPV</option>
          <option value="SUV">SUV</option>
          <option value="City Car">City Car</option>
          <option value="Premium">Premium</option>
        </select>

        <select
          value={transmissionFilter}
          onChange={(e) => onTransmissionFilterChange(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm bg-white"
        >
          <option value="">Semua Transmisi</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>
    </div>
  );
}
