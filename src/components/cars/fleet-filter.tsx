"use client";

interface FleetFilterProps {
  category: string;
  transmission: string;
  seats: string;
  maxPrice: number;
  onCategoryChange: (value: string) => void;
  onTransmissionChange: (value: string) => void;
  onSeatsChange: (value: string) => void;
  onMaxPriceChange: (value: number) => void;
  onReset: () => void;
}

export default function FleetFilter({
  category,
  transmission,
  seats,
  maxPrice,
  onCategoryChange,
  onTransmissionChange,
  onSeatsChange,
  onMaxPriceChange,
  onReset,
}: FleetFilterProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(1).replace(".0", "")}jt`;
    }
    return `Rp ${(price / 1000).toLocaleString("id-ID")}rb`;
  };
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24 space-y-6">
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

      {/* Price range filter */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Rentang Tarif</label>
          <span className="text-xs font-bold text-[#031636] bg-[#031636]/5 px-2.5 py-1 rounded-full">
            Maks: {formatPrice(maxPrice)}
          </span>
        </div>
        <div className="pt-2">
          <input
            type="range"
            min="200000"
            max="2000000"
            step="50000"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#FEA619] focus:outline-none transition-all"
            style={{
              background: `linear-gradient(to right, #031636 0%, #031636 ${((maxPrice - 200000) / (2000000 - 200000)) * 100}%, #e2e8f0 ${((maxPrice - 200000) / (2000000 - 200000)) * 100}%, #e2e8f0 100%)`
            }}
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1.5">
            <span>Rp 200rb</span>
            <span>Rp 2jt</span>
          </div>
        </div>
      </div>
    </div>
  );
}