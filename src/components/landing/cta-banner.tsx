"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-28">
      {/* Background */}

      <div className="absolute inset-0 bg-[#031636]" />

      <div className="absolute -top-48 -left-40 h-96 w-96 rounded-full bg-[#FEA619]/20 blur-3xl" />

      <div className="absolute -bottom-52 -right-40 h-[30rem] w-[30rem] rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl"
        >
          <div className="grid gap-12 p-10 lg:grid-cols-[1.3fr_.7fr] lg:p-16">
            {/* LEFT */}

            <div>
              <span className="inline-flex rounded-full bg-[#FEA619]/20 px-4 py-2 text-sm font-semibold text-[#FEA619]">
                Siap Melakukan Perjalanan?
              </span>

              <h2 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
                Mulai Perjalananmu
                <br />
                Bersama
                <span className="text-[#FEA619]">
                  {" "}
                  Kijang Rental
                </span>
              </h2>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                Dari perjalanan bisnis,
                liburan keluarga,
                airport transfer hingga
                acara spesial, kami siap
                memberikan kendaraan terbaik
                dengan pelayanan profesional.
              </p>

              {/* CTA */}

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/cars"
                  className="rounded-lg bg-[#FEA619] px-8 py-4 text-lg font-bold text-white transition duration-300 hover:scale-105 hover:bg-[#e39400]"
                >
                  Booking Sekarang
                </Link>

                <Link
                  href="/contact"
                  className="rounded-lg border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#031636]"
                >
                  Hubungi Kami
                </Link>
              </div>

              {/* BENEFITS */}

              <div className="mt-12 grid gap-6 sm:grid-cols-3">
                <div>
                  <h3 className="text-3xl font-black text-white">
                    100+
                  </h3>

                  <p className="mt-2 text-slate-300">
                    Armada Premium
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-black text-white">
                    24/7
                  </h3>

                  <p className="mt-2 text-slate-300">
                    Layanan Pelanggan
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-black text-white">
                    5K+
                  </h3>

                  <p className="mt-2 text-slate-300">
                    Pelanggan Puas
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex items-center">
              <div className="w-full rounded-xl bg-white/10 p-8 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-white">
                  Kenapa Memilih Kami?
                </h3>

                <div className="mt-8 space-y-6">
                  {[
                    "Unit selalu bersih & terawat",
                    "Harga transparan tanpa biaya tersembunyi",
                    "Booking online cepat & mudah",
                    "Customer support 24 jam",
                    "Driver profesional & berpengalaman",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#FEA619]">
                        ✓
                      </div>

                      <p className="text-slate-200">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                {/* TRUST */}

                <div className="mt-10 rounded-lg bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Penilaian Google
                      </p>

                      <h4 className="mt-2 text-3xl font-black text-white">
                        4.9 ★
                      </h4>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-400">
                        Ulasan Terverifikasi
                      </p>

                      <h4 className="mt-2 text-2xl font-bold text-[#FEA619]">
                        2.000+
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}