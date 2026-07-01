"use client";

import { Car } from "@/src/domain/car";
import CarCard from "./car-card";

interface FleetGridProps {
  cars: Car[];
  loading: boolean;
  onReset: () => void;
}

export default function FleetGrid({ cars, loading, onReset }: FleetGridProps) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#031636] border-t-transparent"></div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-white p-8 text-center">
        <svg className="h-16 w-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17a2 2 0 11-4 0 2 2 0 014 0zM18 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9H6a2 2 0 00-2 2v3a2 2 0 002 2h12a2 2 0 002-2v-3a2 2 0 00-2-2zM4 11V8a2 2 0 012-2h3m6 0h3a2 2 0 012 2v3m-8-5v5h4V5" />
        </svg>
        <h3 className="text-xl font-bold text-[#031636]">Mobil Tidak Ditemukan</h3>
        <p className="text-slate-500 mt-2">
          Tidak ada kendaraan yang cocok dengan filter atau kata kunci pencarian Anda.
        </p>
        <button
          onClick={onReset}
          className="mt-6 rounded-2xl bg-[#031636] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#05204f]"
        >
          Reset Semua Filter
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}