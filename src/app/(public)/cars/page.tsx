"use client";

import FleetEmpty from "@/src/components/cars/fleet-empty";
import FleetGrid from "@/src/components/cars/fleet-grid";
import FleetToolbar from "@/src/components/cars/fleet-toolbar";

import { useFleet } from "@/src/hooks/useCar";

export default function CarsPage() {
  const fleet = useFleet();

  return (
    <main className="bg-[#F8FAFC]">
      <section className="bg-[#031636] py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-semibold text-[#FEA619]">
            Premium Fleet
          </p>

          <h1 className="mt-5 text-5xl font-black text-white">
            Choose Your Perfect Ride
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Temukan kendaraan terbaik
            untuk perjalananmu.
          </p>
        </div>
      </section>

      <section className="-mt-12 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <FleetToolbar
            search={fleet.search}
            category={fleet.category}
            transmission={
              fleet.transmission
            }
            seats={fleet.seats}
            sort={fleet.sort}
            onSearchChange={
              fleet.setSearch
            }
            onCategoryChange={
              fleet.setCategory
            }
            onTransmissionChange={
              fleet.setTransmission
            }
            onSeatsChange={
              fleet.setSeats
            }
            onSortChange={
              fleet.setSort
            }
          />

          <div className="mt-12">
            {fleet.filteredCars.length ===
            0 ? (
              <FleetEmpty />
            ) : (
              <FleetGrid
                cars={
                  fleet.filteredCars
                }
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}