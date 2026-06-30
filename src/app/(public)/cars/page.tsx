"use client";

import { useFleet } from "@/src/hooks/useCar";
import Link from "next/link";
import Image from "next/image";

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

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

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
          <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#031636] flex items-center gap-2">
                <svg className="h-5 w-5 text-[#031636]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filter
              </h2>
              <button
                onClick={handleResetFilters}
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
                      onChange={() => setCategory(category === cat.name ? "" : cat.name)}
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
                      onClick={() => setTransmission(trans.value)}
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
                      onChange={() => setSeats(cap.value)}
                      className="w-5 h-5 border-slate-200 text-[#031636] focus:ring-[#031636] transition"
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-[#031636] transition-colors">
                      {cap.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range mock */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Rentang Tarif</span>
                <span className="text-[#031636] font-bold">Maks: 1.5jt</span>
              </label>
              <div className="h-2 bg-slate-100 rounded-full w-full relative">
                <div className="absolute left-0 top-0 h-full bg-[#031636] rounded-full w-4/5"></div>
                <div className="absolute w-4 h-4 bg-[#FEA619] rounded-full top-1/2 -translate-y-1/2 -ml-2 left-0 shadow cursor-pointer border-2 border-white"></div>
                <div className="absolute w-4 h-4 bg-[#FEA619] rounded-full top-1/2 -translate-y-1/2 -ml-2 left-4/5 shadow cursor-pointer border-2 border-white"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid Area */}
        <section className="w-full lg:w-3/4 space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-3xl border border-slate-150 shadow-sm">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari mobil..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636] transition-all text-sm"
              />
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-semibold">
                Menampilkan <strong className="text-[#031636]">{filteredCars.length}</strong> armada
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#031636] focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636] outline-none cursor-pointer hover:border-slate-300 transition"
              >
                <option value="latest">Terbaru</option>
                <option value="price-low">Tarif: Terendah</option>
                <option value="price-high">Tarif: Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Vehicle Grid */}
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#031636] border-t-transparent"></div>
            </div>
          ) : filteredCars.length === 0 ? (
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
                onClick={handleResetFilters}
                className="mt-6 rounded-2xl bg-[#031636] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#05204f]"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <article
                  key={car.id}
                  className="bg-white rounded-3xl border border-slate-150 overflow-hidden flex flex-col hover:shadow-lg hover:scale-[1.01] transition-all duration-300 relative group shadow-sm"
                >
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                    car.available
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${car.available ? "bg-emerald-500" : "bg-red-500"}`} />
                    {car.available ? "Tersedia" : "Disewa"}
                  </div>



                  {/* Image */}
                  <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                    <Image
                      src={car.thumbnail}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {car.category}
                      </span>
                      <h3 className="text-lg font-bold text-[#031636] mt-0.5 group-hover:text-[#FEA619] transition-colors">
                        {car.brand} {car.model}
                      </h3>
                    </div>

                    {/* Specs Icons */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-1.5" title="Kapasitas Penumpang">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>{car.seats} Kursi</span>
                      </div>
                      <div className="flex items-center gap-1.5" title="Transmisi">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{car.transmission === "Automatic" ? "Matic" : "Manual"}</span>
                      </div>
                      <div className="flex items-center gap-1.5" title="Bahan Bakar">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{car.fuel}</span>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="border-t border-slate-100 pt-4 flex justify-between items-center mt-auto">
                      <div>
                        <span className="text-lg font-black text-[#031636]">{formatIDR(car.price)}</span>
                        <span className="text-[10px] text-slate-400"> /hari</span>
                      </div>

                      {car.available ? (
                        <Link
                          href={`/cars/${car.slug}`}
                          className="bg-[#FEA619] hover:bg-[#e89500] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
                        >
                          Booking
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="bg-slate-100 text-slate-400 font-bold text-xs px-4 py-2.5 rounded-xl cursor-not-allowed"
                        >
                          Penuh
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}