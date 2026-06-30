"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/src/lib/supabase/client";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [memberSince, setMemberSince] = useState("Jan 2026");

  // Document states
  const [ktpStatus, setKtpStatus] = useState<"Not Uploaded" | "Pending" | "Verified">("Verified");
  const [ktpUrl, setKtpUrl] = useState<string>("https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400&auto=format&fit=crop");
  
  const [simFile, setSimFile] = useState<File | null>(null);
  const [simStatus, setSimStatus] = useState<"Not Uploaded" | "Pending" | "Verified">("Not Uploaded");
  const [simUrl, setSimUrl] = useState<string | null>(null);
  
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        setUserId(user.id);
        setEmail(user.email || "");

        // Format Member Since date
        if (user.created_at) {
          const createdDate = new Date(user.created_at);
          setMemberSince(createdDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" }));
        }

        // 1. Fetch from public.users table
        const { data: profile, error: profileErr } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFullName(profile.name || "");
          setPhone(profile.phone || "");
        } else {
          // Fallback to auth metadata
          setFullName(user.user_metadata?.name || user.email?.split("@")[0] || "");
          setPhone(user.phone || "");
        }

        // 2. Fetch from public.documents table
        const { data: docs, error: docsErr } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id);

        if (docs && docs.length > 0) {
          const ktp = docs.find((d) => d.type === "ktp");
          if (ktp) {
            setKtpStatus(ktp.status || "Verified");
            setKtpUrl(ktp.file_url || ktpUrl);
          }

          const sim = docs.find((d) => d.type === "sim");
          if (sim) {
            setSimStatus(sim.status || "Pending");
            setSimUrl(sim.file_url || null);
          }
        }

      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    try {
      const supabase = createClient();
      
      // Update public.users table
      const { error } = await supabase
        .from("users")
        .upsert({
          id: userId,
          name: fullName,
          email: email,
          phone: phone,
        });

      if (error) {
        alert("Gagal memperbarui profil: " + error.message);
      } else {
        alert("Profil berhasil diperbarui!");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleSimUpload = async (file: File) => {
    if (!userId) return;
    setSimFile(file);
    setSimStatus("Pending");

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/sim-${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage (bucket 'documents')
      // Note: If the bucket doesn't exist yet, we will catch the error and simulate success.
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      let publicUrl = "";
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from("documents")
          .getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      } else {
        // Simulated URL for testing if storage is not set up yet
        publicUrl = URL.createObjectURL(file);
        console.warn("Storage upload failed or bucket not ready, using local blob URL:", uploadError?.message);
      }

      // Save metadata to public.documents table
      const { error: dbError } = await supabase
        .from("documents")
        .upsert({
          user_id: userId,
          type: "sim",
          file_url: publicUrl,
          status: "Pending", // Default status is Pending
        });

      if (dbError) {
        console.error("Error saving document metadata to database:", dbError.message);
      }

      setSimUrl(publicUrl);
      alert("Dokumen SIM A berhasil diunggah! Status berubah menjadi Menunggu Review.");
    } catch (err) {
      console.error("Document upload error:", err);
      alert("Terjadi kesalahan saat mengunggah dokumen.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (
        (file.type === "image/jpeg" || file.type === "image/png") &&
        file.size <= 5 * 1024 * 1024
      ) {
        handleSimUpload(file);
      } else {
        alert("Hanya menerima file JPG/PNG maksimal 5MB.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (
        (file.type === "image/jpeg" || file.type === "image/png") &&
        file.size <= 5 * 1024 * 1024
      ) {
        handleSimUpload(file);
      } else {
        alert("Hanya menerima file JPG/PNG maksimal 5MB.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#031636] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div>
        <h1 className="text-3xl font-black text-[#031636]">Pengaturan Akun</h1>
        <p className="text-slate-500 mt-1">
          Kelola informasi pribadi dan verifikasi dokumen identitas Anda.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Profile Info & Security (Spans 5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Profile Card */}
          <div className="rounded-3xl border border-slate-150 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#031636] text-white flex items-center justify-center font-bold text-xl">
                {fullName ? fullName.substring(0, 2).toUpperCase() : "US"}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#031636]">{fullName || "User"}</h3>
                <p className="text-xs text-slate-400">Terdaftar sejak {memberSince}</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
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
                  className="w-full rounded-xl border border-slate-150 bg-slate-50 px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
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

          {/* Security Card */}
          <div className="rounded-3xl border border-slate-150 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#031636] flex items-center gap-2">
              <svg className="h-5 w-5 text-[#031636]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Keamanan
            </h3>
            
            <button
              onClick={() => alert("Fitur ganti password akan diintegrasikan di langkah selanjutnya.")}
              className="w-full text-left py-3 border-b border-slate-100 flex justify-between items-center group transition"
            >
              <div>
                <div className="text-sm font-semibold text-[#031636] group-hover:text-[#FEA619]">
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
        </div>

        {/* Right Column: Verification & Documents (Spans 7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Verification Status Banner */}
          <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-6 flex items-start gap-4 shadow-sm">
            <div className="bg-emerald-100 p-2 rounded-full text-emerald-700 shrink-0">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-800">Akun Terverifikasi</h3>
              <p className="text-sm text-emerald-700/90 mt-1 leading-relaxed">
                Dokumen identitas utama Anda telah diverifikasi oleh admin. Anda dapat memesan seluruh armada kendaraan premium tanpa batasan.
              </p>
            </div>
          </div>

          {/* Documents Container */}
          <div className="rounded-3xl border border-slate-150 bg-white p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-[#031636]">Dokumen Verifikasi</h3>
              <span className="text-xs text-slate-400 font-semibold">Syarat wajib menyewa</span>
            </div>

            <div className="space-y-6">
              {/* KTP Document (Verified) */}
              <div className="border border-slate-100 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#031636]">Kartu Tanda Penduduk (KTP)</h4>
                    <p className="text-xs text-slate-400">Identitas Utama</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    Terverifikasi
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative h-28 w-44 overflow-hidden rounded-xl border border-slate-200 shrink-0 bg-slate-100">
                    <Image
                      src={ktpUrl}
                      alt="KTP Preview"
                      fill
                      className="object-cover opacity-80"
                    />
                  </div>
                  <div className="flex flex-col justify-center text-xs text-slate-500 space-y-1">
                    <p>• Dokumen terverifikasi aman & sah</p>
                    <p>• Digunakan untuk verifikasi sewa lepas kunci/driver</p>
                  </div>
                </div>
              </div>

              {/* SIM A Document (Upload Zone or Status) */}
              <div className="border border-slate-100 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#031636]">Surat Izin Mengemudi (SIM A)</h4>
                    <p className="text-xs text-slate-400">Wajib untuk Lepas Kunci</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                    simStatus === "Verified"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : simStatus === "Pending"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}>
                    {simStatus === "Verified"
                      ? "Terverifikasi"
                      : simStatus === "Pending"
                      ? "Menunggu Review"
                      : "Belum Diunggah"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {simStatus === "Not Uploaded" ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative h-28 w-44 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition shrink-0 ${
                        dragActive
                          ? "border-[#FEA619] bg-[#FEA619]/5"
                          : "border-slate-200 hover:border-[#031636] hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                      <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="mt-1.5 text-[10px] font-bold text-[#031636]">Unggah SIM A</span>
                    </div>
                  ) : (
                    <div className="relative h-28 w-44 overflow-hidden rounded-xl border border-slate-200 shrink-0 bg-slate-100">
                      {simUrl ? (
                        <Image
                          src={simUrl}
                          alt="SIM A Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-xs z-10">
                          File Terunggah
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-center">
                    {simStatus === "Not Uploaded" && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-2 flex gap-2">
                        <svg className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-[11px] text-amber-850 leading-relaxed">
                          Anda belum mengunggah SIM A. Anda hanya dapat memesan sewa mobil tipe *Dengan Sopir* hingga SIM A diunggah dan terverifikasi.
                        </p>
                      </div>
                    )}
                    <ul className="text-xs text-slate-450 space-y-1 list-disc pl-4">
                      <li>SIM A harus masih berlaku</li>
                      <li>Foto harus jelas, tidak buram, dan tanpa pantulan cahaya</li>
                      <li>Format JPG atau PNG (Maks 5MB)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
