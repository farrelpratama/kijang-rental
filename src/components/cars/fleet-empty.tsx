"use client";

import Link from "next/link";

export default function FleetEmpty() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white px-8 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-5xl">
        🚗
      </div>

      <h2 className="text-3xl font-bold text-[#031636]">
        Mobil Tidak Ditemukan
      </h2>

      <p className="mt-4 max-w-md text-slate-500">
        Tidak ada kendaraan yang sesuai
        dengan filter atau kata kunci yang
        kamu masukkan.
      </p>

      <Link
        href="/cars"
        className="mt-8 rounded-2xl bg-[#031636] px-8 py-4 font-semibold text-white transition hover:bg-[#05204f]"
      >
        Reset Filter
      </Link>
    </div>
  );
}