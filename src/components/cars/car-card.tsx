"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Car } from "@/src/types/car";

interface CarCardProps {
  car: Car;
}

export default function CarCard({
  car,
}: CarCardProps) {
  const {
    slug,
    brand,
    model,
    category,
    transmission,
    fuel,
    seats,
    price,
    available,
    thumbnail,
    rating,
    reviews,
  } = car;

  return (
    <motion.article
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition-all hover:shadow-2xl"
    >
      {/* IMAGE */}

      <div className="relative h-64 overflow-hidden">
        <Image
          src={thumbnail}
          alt={`${brand} ${model}`}
          fill
          sizes="(max-width:768px)100vw,33vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* CATEGORY */}

        <div className="absolute left-5 top-5">
          <span className="rounded-full bg-[#FEA619] px-4 py-2 text-sm font-semibold text-white">
            {category}
          </span>
        </div>

        {/* STATUS */}

        <div className="absolute right-5 bottom-5">
          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold backdrop-blur ${
              available
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {available
              ? "Available"
              : "Booked"}
          </span>
        </div>

        {/* FAVORITE */}

        <button className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow transition hover:scale-110">
          ❤
        </button>
      </div>

      {/* CONTENT */}

      <div className="space-y-6 p-7">
        <div>
          <h3 className="text-2xl font-bold text-[#031636]">
            {brand} {model}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold text-[#FEA619]">
              ★ {rating}
            </span>

            <span className="text-sm text-slate-500">
              ({reviews} reviews)
            </span>
          </div>
        </div>

        {/* FEATURES */}

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-center">
            <p className="font-bold text-[#031636]">
              {seats}
            </p>

            <p className="text-xs text-slate-500">
              Seats
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 p-3 text-center">
            <p className="font-semibold text-[#031636]">
              {transmission}
            </p>

            <p className="text-xs text-slate-500">
              Gear
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 p-3 text-center">
            <p className="font-semibold text-[#031636]">
              {fuel}
            </p>

            <p className="text-xs text-slate-500">
              Fuel
            </p>
          </div>
        </div>

        {/* PRICE */}

        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Start From
              </p>

              <div className="mt-1 flex items-end gap-1">
                <span className="text-3xl font-black text-[#031636]">
                  Rp{" "}
                  {price.toLocaleString("id-ID")}
                </span>

                <span className="mb-1 text-slate-500">
                  /day
                </span>
              </div>
            </div>

            <Link
              href={`/cars/${slug}`}
              className="rounded-2xl bg-[#031636] px-6 py-3 font-semibold text-white transition hover:bg-[#05204f]"
            >
              View Detail
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}