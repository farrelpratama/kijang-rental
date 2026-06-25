"use client";

import FleetFilter from "./fleet-filter";
import FleetSearch from "./fleet-search";

interface FleetToolbarProps {
  search: string;
  category: string;
  transmission: string;
  seats: string;
  sort: string;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTransmissionChange: (value: string) => void;
  onSeatsChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function FleetToolbar({
  search,
  category,
  transmission,
  seats,
  sort,
  onSearchChange,
  onCategoryChange,
  onTransmissionChange,
  onSeatsChange,
  onSortChange,
}: FleetToolbarProps) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <FleetSearch
          value={search}
          onChange={onSearchChange}
        />

        <div className="w-full lg:max-w-3xl">
          <FleetFilter
            category={category}
            transmission={transmission}
            seats={seats}
            onCategoryChange={onCategoryChange}
            onTransmissionChange={onTransmissionChange}
            onSeatsChange={onSeatsChange}
          />
        </div>

        <select
          value={sort}
          onChange={(e) =>
            onSortChange(e.target.value)
          }
          className="h-14 rounded-2xl border border-slate-200 bg-white px-5 outline-none transition focus:border-[#031636]"
        >
          <option value="latest">
            Terbaru
          </option>

          <option value="price-low">
            Harga Terendah
          </option>

          <option value="price-high">
            Harga Tertinggi
          </option>

          <option value="rating">
            Rating Tertinggi
          </option>
        </select>
      </div>
    </div>
  );
}