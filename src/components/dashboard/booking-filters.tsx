"use client";

interface BookingFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const FILTERS = ["All", "pending", "confirmed", "ongoing", "completed", "cancelled"];

export default function BookingFilters({
  activeFilter,
  setActiveFilter,
}: BookingFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2.5 pb-2">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-[#031636] text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {filter === "All"
              ? "Semua Booking"
              : filter === "pending"
              ? "Pending"
              : filter === "confirmed"
              ? "Dikonfirmasi"
              : filter === "ongoing"
              ? "Aktif"
              : filter === "completed"
              ? "Selesai"
              : "Dibatalkan"}
          </button>
        );
      })}
    </div>
  );
}
