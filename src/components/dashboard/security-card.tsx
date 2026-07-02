"use client";

export default function SecurityCard() {
  const handleResetPassword = () => {
    alert("Fitur ganti password akan diintegrasikan di langkah selanjutnya.");
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-[#031636] flex items-center gap-2">
        <svg className="h-5 w-5 text-[#031636]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Keamanan
      </h3>
      
      <button
        onClick={handleResetPassword}
        className="w-full text-left py-3 border-b border-slate-100 flex justify-between items-center group transition"
      >
        <div>
          <div className="text-sm font-semibold text-[#031636] group-hover:text-[#FEA619] transition-colors">
            Ganti Password
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Amankan akun Anda secara berkala</div>
        </div>
        <span className="text-slate-400 group-hover:text-[#FEA619] transition">➔</span>
      </button>

      <div className="w-full py-2 flex justify-between items-center">
        <div>
          <div className="text-sm font-semibold text-[#031636]">Autentikasi Dua Faktor (2FA)</div>
          <div className="text-xs text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Aktif
          </div>
        </div>
      </div>
    </div>
  );
}
