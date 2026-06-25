"use client";

interface FleetFilterProps {
  category: string;

  transmission: string;

  seats: string;

  onCategoryChange: (
    value: string
  ) => void;

  onTransmissionChange: (
    value: string
  ) => void;

  onSeatsChange: (
    value: string
  ) => void;
}

export default function FleetFilter({
  category,
  transmission,
  seats,

  onCategoryChange,
  onTransmissionChange,
  onSeatsChange,
}: FleetFilterProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <select
        value={category}
        onChange={(e) =>
          onCategoryChange(e.target.value)
        }
        className="h-14 rounded-2xl border border-slate-200 bg-white px-4"
      >
        <option value="">
          Semua Kategori
        </option>

        <option value="MPV">
          MPV
        </option>

        <option value="SUV">
          SUV
        </option>

        <option value="City Car">
          City Car
        </option>

        <option value="Premium">
          Premium
        </option>
      </select>

      <select
        value={transmission}
        onChange={(e) =>
          onTransmissionChange(
            e.target.value
          )
        }
        className="h-14 rounded-2xl border border-slate-200 bg-white px-4"
      >
        <option value="">
          Semua Transmisi
        </option>

        <option value="Automatic">
          Automatic
        </option>

        <option value="Manual">
          Manual
        </option>
      </select>

      <select
        value={seats}
        onChange={(e) =>
          onSeatsChange(
            e.target.value
          )
        }
        className="h-14 rounded-2xl border border-slate-200 bg-white px-4"
      >
        <option value="">
          Semua Kursi
        </option>

        <option value="4">
          4 Seat
        </option>

        <option value="5">
          5 Seat
        </option>

        <option value="7">
          7 Seat
        </option>

        <option value="15">
          15 Seat
        </option>
      </select>
    </div>
  );
}