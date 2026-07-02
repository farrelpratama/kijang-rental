"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car } from "@/src/domain/car";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
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
  } = car;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 relative group shadow-sm"
    >
      {/* Status Badge */}
      <div
        className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
          available
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-red-50 text-red-700 border-red-200"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${available ? "bg-emerald-500" : "bg-red-500"}`} />
        {available ? "Tersedia" : "Disewa"}
      </div>

      {/* Image */}
      <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
        <Image
          src={thumbnail}
          alt={`${brand} ${model}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Details */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {category}
          </span>
          <h3 className="text-lg font-bold text-[#031636] mt-0.5 group-hover:text-[#FEA619] transition-colors">
            {brand} {model}
          </h3>
        </div>

        {/* Specs Icons */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-1.5" title="Kapasitas Penumpang">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{seats} Kursi</span>
          </div>
          <div className="flex items-center gap-1.5" title="Transmisi">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{transmission === "Automatic" ? "Matic" : "Manual"}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Bahan Bakar">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{fuel}</span>
          </div>
        </div>

        {/* Footer Row */}
        <div className="border-t border-slate-100 pt-4 flex justify-between items-center mt-auto">
          <div>
            <span className="text-lg font-black text-[#031636]">{formatIDR(price)}</span>
            <span className="text-[10px] text-slate-400"> /hari</span>
          </div>

          {available ? (
            <Link
              href={`/cars/${slug}`}
              className="bg-[#FEA619] hover:bg-[#e89500] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition shadow-sm"
            >
              Booking
            </Link>
          ) : (
            <button
              disabled
              className="bg-slate-100 text-slate-400 font-bold text-xs px-4 py-2.5 rounded-lg cursor-not-allowed"
            >
              Penuh
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}