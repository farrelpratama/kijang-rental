"use client";

interface FleetFilterProps {
  category: string;
  transmission: string;
  seats: string;
  onCategoryChange: (value: string) => void;
  onTransmissionChange: (value: string) => void;
  onSeatsChange: (value: string) => void;
  onReset: () => void;
}

export default function FleetFilter({
  category,
  transmission,
  seats,
  onCategoryChange,
  onTransmissionChange,
  onSeatsChange,
  onReset,
}: FleetFilterProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm sticky top-24 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-[#031636] flex items-center gap-2">
          <svg className="h-5 w-5 text-[#031636]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filter
        </h2>
        <button
          onClick={onReset}
          className="text-xs font-bold text-[#FEA619] hover:underline"
        >
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
        <div className="flex flex-col gap-2.5">
          {[
            { name: "MPV", label: "MPV (Keluarga)" },
            { name: "SUV", label: "SUV (Tangguh)" },
            { name: "City Car", label: "City Car (Lincah)" },
            { name: "Premium", label: "Premium (Mewah)" },
          ].map((cat) => (
            <label key={cat.name} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={category === cat.name}
                onChange={() => onCategoryChange(category === cat.name ? "" : cat.name)}
                className="w-5 h-5 rounded border-slate-200 text-[#031636] focus:ring-[#031636] transition"
              />
              <span className="text-sm font-medium text-slate-600 group-hover:text-[#031636] transition-colors">
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission Filter */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Transmisi</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "", label: "Semua" },
            { value: "Automatic", label: "Matic" },
            { value: "Manual", label: "Manual" },
          ].map((trans) => {
            const isActive = transmission === trans.value;
            return (
              <button
                key={trans.value}
                onClick={() => onTransmissionChange(trans.value)}
                className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#031636] border-[#031636] text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {trans.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Capacity Filter */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Kapasitas Kursi</label>
        <div className="flex flex-col gap-2.5">
          {[
            { value: "", label: "Semua Kapasitas" },
            { value: "4", label: "4 Kursi" },
            { value: "7", label: "7 Kursi" },
            { value: "15", label: "15 Kursi (Hiace)" },
          ].map((cap) => (
            <label key={cap.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="capacity"
                checked={seats === cap.value}
                onChange={() => onSeatsChange(cap.value)}
                className="w-5 h-5 border-slate-200 text-[#031636] focus:ring-[#031636] transition"
              />
              <span className="text-sm font-medium text-slate-600 group-hover:text-[#031636] transition-colors">
                {cap.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range mock */}
      <div className="space-y-3 pt-2">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
          <span>Rentang Tarif</span>
          <span className="text-[#031636] font-bold">Maks: 1.5jt</span>
        </label>
        <div className="h-2 bg-slate-100 rounded-full w-full relative">
          <div className="absolute left-0 top-0 h-full bg-[#031636] rounded-full w-4/5"></div>
          <div className="absolute w-4 h-4 bg-[#FEA619] rounded-full top-1/2 -translate-y-1/2 -ml-2 left-0 shadow cursor-pointer border-2 border-white"></div>
          <div className="absolute w-4 h-4 bg-[#FEA619] rounded-full top-1/2 -translate-y-1/2 -ml-2 left-4/5 shadow cursor-pointer border-2 border-white"></div>
        </div>
      </div>
    </div>
  );
}