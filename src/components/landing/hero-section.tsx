"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-10">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop"
        alt="Luxury Car"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#031636]/95 via-[#031636]/80 to-[#031636]/30" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
            }}
          >
            <span className="inline-flex items-center rounded-full bg-[#FEA619]/20 px-5 py-2 text-sm font-semibold text-[#FEA619] backdrop-blur">
              Rental Mobil Premium di Yogyakarta
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight text-white md:text-5xl tracking-tight">
              Perjalanan Nyaman,
              <br />
              Tanpa Hambatan.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
              Nikmati pengalaman rental mobil
              premium dengan armada terbaru,
              harga transparan, serta pelayanan
              profesional untuk perjalanan bisnis
              maupun liburan.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/cars"
                className="rounded-xl bg-[#FEA619] px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-[#e69500]"
              >
                Booking Sekarang
              </Link>

              <Link
                href="/cars"
                className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#031636]"
              >
                Lihat Armada
              </Link>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="flex justify-center lg:justify-end"
          >
          </motion.div>
        </div>
      </div>
    </section>
  );
}