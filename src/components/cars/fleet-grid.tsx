"use client";

import { Car } from "@/src/domain/car";
import CarCard from "./car-card";

interface FleetGridProps {
  cars: Car[];
}

export default function FleetGrid({
  cars,
}: FleetGridProps) {
  if (cars.length === 0) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white">
        <div className="text-center">
          <div className="mb-6 text-6xl">🚗</div>

          <h2 className="text-2xl font-bold text-[#031636]">
            Mobil Tidak Ditemukan
          </h2>

          <p className="mt-3 text-slate-500">
            Coba ubah filter atau kata kunci pencarian.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
        />
      ))}
    </div>
  );
}