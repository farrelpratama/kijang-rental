import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[700px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#031636]/95 via-[#031636]/70 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="max-w-2xl">
          <span className="mb-6 inline-block rounded-full bg-[#fea619]/20 px-4 py-2 text-[#fea619] font-medium">
            Premium Mobility Solution
          </span>

          <h1 className="mb-6 text-6xl font-black leading-tight text-white">
            Frictionless Path
            <br />
            to Mobility.
          </h1>

          <p className="mb-8 text-xl text-slate-300">
            Yogyakarta's premier car rental since
            2019. Experience professional reliability
            and seamless travel.
          </p>

          <div className="flex gap-4">
            <Link
              href="/cars"
              className="rounded-xl bg-[#fea619] px-8 py-4 text-lg font-bold text-white"
            >
              Cari Mobil Sekarang
            </Link>

            <Link
              href="/cars"
              className="rounded-xl border border-white/30 px-8 py-4 text-lg text-white"
            >
              Lihat Armada
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}