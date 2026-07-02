"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-6 text-center">
      <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm max-w-md w-full space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#031636]">Terjadi Kesalahan</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Maaf, sistem mendeteksi kegagalan koneksi atau error internal pada aplikasi. Silakan klik tombol di bawah untuk mencoba memuat ulang.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="w-full bg-[#031636] hover:bg-[#05204f] text-white font-bold text-sm px-6 py-3 rounded-2xl transition shadow-sm cursor-pointer"
          >
            Coba Lagi
          </button>
          <a
            href="/"
            className="w-full bg-white border border-slate-200 hover:border-slate-355 text-slate-600 font-bold text-sm px-6 py-3 rounded-2xl transition shadow-sm inline-flex items-center justify-center"
          >
            Kembali ke Home
          </a>
        </div>
      </div>
    </div>
  );
}
