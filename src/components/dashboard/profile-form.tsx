"use client";

interface ProfileFormProps {
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  phone: string;
  setPhone: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  memberSince: string;
}

export default function ProfileForm({
  fullName,
  setFullName,
  email,
  phone,
  setPhone,
  onSubmit,
  saving,
  memberSince,
}: ProfileFormProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#031636] text-white flex items-center justify-center font-bold text-xl">
          {fullName ? fullName.substring(0, 2).toUpperCase() : "US"}
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#031636]">{fullName || "User"}</h3>
          <p className="text-xs text-slate-400">Terdaftar sejak {memberSince}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600" htmlFor="name">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Sesuai KTP"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#031636] focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636] transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600" htmlFor="email">
            Alamat Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="w-full rounded-xl border border-slate-155 bg-slate-50 px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600" htmlFor="phone">
            Nomor Telepon
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#031636] focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636] transition"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-[#031636] hover:bg-[#05204f] disabled:bg-slate-300 text-white font-bold rounded-xl transition shadow-md"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
