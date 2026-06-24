export default function ServicesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="mb-12 text-center text-4xl font-bold">
        Tailored For Your Journey
      </h2>

      <div className="grid auto-rows-[260px] gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl md:col-span-2">
          <img
            src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b"
            className="h-full w-full object-cover"
            alt=""
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          <div className="absolute bottom-6 left-6">
            <h3 className="text-3xl font-bold text-white">
              Family Vacations
            </h3>

            <p className="text-white/80">
              Spacious comfort for the whole crew
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
            className="h-full w-full object-cover"
            alt=""
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          <div className="absolute bottom-6 left-6">
            <h3 className="text-xl font-bold text-white">
              Business Trips
            </h3>
          </div>
        </div>

        <div className="rounded-3xl bg-[#031636] p-8 text-white">
          <h3 className="text-2xl font-bold">
            Weddings
          </h3>

          <p className="mt-3 text-slate-300">
            Elegant rides for your special day.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl md:col-span-2">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05"
            className="h-full w-full object-cover"
            alt=""
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          <div className="absolute bottom-6 left-6">
            <h3 className="text-3xl font-bold text-white">
              Airport Transfers
            </h3>

            <p className="text-white/80">
              Punctual YIA pick-ups and drop-offs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}