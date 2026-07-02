import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
      <h3 className="text-lg font-bold text-[#031636] mb-4">Navigasi Cepat</h3>
      <div className="space-y-3 flex-1 flex flex-col justify-center">
        <Link 
          href="/admin/cars" 
          className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-[#031636] hover:text-white transition group"
        >
          <span className="font-semibold text-sm">Kelola Armada</span>
          <svg className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link 
          href="/admin/bookings" 
          className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-[#031636] hover:text-white transition group"
        >
          <span className="font-semibold text-sm">Daftar Pemesanan</span>
          <svg className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link 
          href="/admin/customers" 
          className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-[#031636] hover:text-white transition group"
        >
          <span className="font-semibold text-sm">Verifikasi Dokumen</span>
          <svg className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
