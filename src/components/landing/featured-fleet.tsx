"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { cars } from "@/src/domain/car";
import CarCard from "@/src/components/cars/car-card";

export default function FeaturedFleet() {
  return (
    <section
      id="fleet"
      className="relative overflow-hidden bg-white py-28"
    >
      {/* Background */}

      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#FEA619]/10 blur-3xl" />

      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#031636]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div className="max-w-2xl">
            <span className="rounded-full bg-[#FEA619]/20 px-4 py-2 text-sm font-semibold text-[#FEA619]">
              Featured Fleet
            </span>

            <h2 className="mt-6 text-5xl font-black leading-tight text-[#031636]">
              Find The Perfect
              <br />
              Vehicle For Every
              <br />
              Journey
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Jelajahi armada pilihan kami yang
              selalu dirawat secara berkala,
              bersih, nyaman, dan siap menemani
              perjalananmu.
            </p>
          </div>

          <Link
            href="/cars"
            className="rounded-2xl border border-[#031636] px-7 py-4 font-semibold text-[#031636] transition hover:bg-[#031636] hover:text-white"
          >
            View All Fleet →
          </Link>
        </motion.div>

        {/* Fleet */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {cars.slice(0, 4).map((car, index) => (
            <motion.div
              key={car.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.15,
              }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.25,
          }}
          className="mt-24 rounded-[36px] bg-[#031636] px-10 py-14"
        >
          <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
            <div>
              <h3 className="text-4xl font-black text-white">
                Looking For More Vehicles?
              </h3>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                Kami memiliki lebih banyak pilihan
                kendaraan yang belum ditampilkan
                pada halaman utama. Lihat seluruh
                katalog armada kami untuk menemukan
                mobil yang paling sesuai dengan
                kebutuhanmu.
              </p>
            </div>

            <Link
              href="/cars"
              className="rounded-2xl bg-[#FEA619] px-8 py-4 text-lg font-bold text-white transition duration-300 hover:scale-105 hover:bg-[#e69500]"
            >
              Explore Fleet
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}