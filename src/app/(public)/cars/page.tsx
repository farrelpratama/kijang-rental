"use client";

import { useFleet } from "@/src/hooks/useCar";
import FleetFilter from "@/src/components/cars/fleet-filter";
import FleetToolbar from "@/src/components/cars/fleet-toolbar";
import FleetGrid from "@/src/components/cars/fleet-grid";

export default function CarsPage() {
  const {
    filteredCars,
    loading,
    search,
    setSearch,
    category,
    setCategory,
    transmission,
    setTransmission,
    seats,
    setSeats,
    sort,
    setSort,
  } = useFleet();

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setTransmission("");
    setSeats("");
    setSort("latest");
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-20">
      {/* Page Header */}
      <header className="w-full bg-white py-12 border-b border-slate-150">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-black text-[#031636] md:text-4xl">Armada Kami</h1>
          <p className="text-slate-500 mt-2 max-w-2xl text-sm md:text-base leading-relaxed">
            Temukan kendaraan terbaik untuk perjalanan Anda di Yogyakarta. Mulai dari city car yang lincah hingga MPV keluarga yang luas, semuanya dirawat dengan standar kebersihan dan performa tertinggi.
          </p>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-1/4 flex-shrink-0">
          <FleetFilter
            category={category}
            transmission={transmission}
            seats={seats}
            onCategoryChange={setCategory}
            onTransmissionChange={setTransmission}
            onSeatsChange={setSeats}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Main Grid Area */}
        <section className="w-full lg:w-3/4 space-y-6">
          {/* Toolbar */}
          <FleetToolbar
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            count={filteredCars.length}
          />

          {/* Vehicle Grid */}
          <FleetGrid
            cars={filteredCars}
            loading={loading}
            onReset={handleResetFilters}
          />
        </section>
      </main>
    </div>
  );
}