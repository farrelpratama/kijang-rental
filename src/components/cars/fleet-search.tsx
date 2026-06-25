"use client";

interface FleetSearchProps {
  value: string;

  onChange: (value: string) => void;
}

export default function FleetSearch({
  value,
  onChange,
}: FleetSearchProps) {
  return (
    <div className="relative w-full lg:max-w-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <circle
          cx="11"
          cy="11"
          r="7"
        />

        <path d="m20 20-3-3" />
      </svg>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="Cari mobil..."
        className="
        h-14
        w-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        pl-12
        pr-4
        outline-none
        transition

        focus:border-[#031636]
        focus:ring-4
        focus:ring-[#031636]/10
        "
      />
    </div>
  );
}