import CarCard from "@/src/components/cars/car-card";
import { featuredCars } from "@/src/constants/mock-data";

export default function FeaturedFleet() {
  return (
    <section
      id="fleet"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-bold">
              Premium Fleet
            </h2>

            <p className="mt-2 text-slate-500">
              Select from our meticulously
              maintained vehicles.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredCars.map((car) => (
            <CarCard
              key={car.id}
              {...car}
            />
          ))}
        </div>
      </div>
    </section>
  );
}