"use client";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: "MPV" | "SUV" | "City Car" | "Premium";
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid";
  seats: number;
  price: number;
  available: boolean;
  thumbnail: string;
  description: string;
  features: string[];
}

interface CarCardProps {
  car: Car;
  formatIDR: (num: number) => string;
  onEdit: (car: Car) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, currentAvailable: boolean) => void;
}

export default function CarCard({
  car,
  formatIDR,
  onEdit,
  onDelete,
  onToggleAvailability,
}: CarCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
      <div>
        {/* Image */}
        <div className="aspect-[3/2] relative w-full bg-slate-100 overflow-hidden">
          <img
            src={car.thumbnail}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <button
            onClick={() => onToggleAvailability(car.id, car.available)}
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow ${
              car.available 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-250" 
                : "bg-rose-50 text-rose-700 border border-rose-250"
            }`}
          >
            {car.available ? "Tersedia" : "Disewa"}
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <span className="text-xs font-bold text-[#FEA619] tracking-wider uppercase">{car.category}</span>
            <h3 className="text-lg font-bold text-[#031636] mt-0.5">{car.brand} {car.model}</h3>
            <p className="text-xs text-slate-400 font-medium">Tahun {car.year} • {car.fuel}</p>
          </div>

          <div className="flex gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {car.transmission}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {car.seats} Kursi
            </span>
          </div>

          <p className="text-sm font-bold text-[#031636]">
            {formatIDR(car.price)} <span className="text-xs font-normal text-slate-400">/ hari</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-5 pt-0 flex gap-2 border-t border-slate-50 mt-auto">
        <button
          onClick={() => onEdit(car)}
          className="flex-1 py-2 text-center text-xs font-bold text-[#031636] bg-slate-50 border border-slate-100 hover:bg-[#031636] hover:text-white rounded-lg transition"
        >
          Edit Unit
        </button>
        <button
          onClick={() => onDelete(car.id)}
          className="py-2 px-3 text-center text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:text-white rounded-lg transition"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
