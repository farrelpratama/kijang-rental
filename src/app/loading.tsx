export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center space-y-4">
        {/* Loading Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#031636] border-t-transparent"></div>
        {/* Loading text */}
        <p className="text-sm font-bold text-[#031636] tracking-wider uppercase">Memuat Halaman...</p>
      </div>
    </div>
  );
}
