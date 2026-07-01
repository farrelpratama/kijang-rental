"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import ProfileForm from "@/src/components/dashboard/profile-form";
import SecurityCard from "@/src/components/dashboard/security-card";
import DocumentVerification from "@/src/components/dashboard/document-verification";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [ktpUrl, setKtpUrl] = useState("");
  const [ktpStatus, setKtpStatus] = useState("Not Uploaded");
  const [simUrl, setSimUrl] = useState("");
  const [simStatus, setSimStatus] = useState("Not Uploaded");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile data
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFullName(profile.name || "");
          setEmail(profile.email || "");
          setPhone(profile.phone || "");

          const joinedDate = new Date(profile.created_at || user.created_at);
          setMemberSince(
            joinedDate.toLocaleDateString("id-ID", {
              month: "long",
              year: "numeric",
            })
          );
        }

        // Fetch documents
        const { data: docs } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id);

        if (docs) {
          const ktpDoc = docs.find((d) => d.type === "ktp");
          if (ktpDoc) {
            setKtpUrl(ktpDoc.file_url);
            setKtpStatus(ktpDoc.status);
          }

          const simDoc = docs.find((d) => d.type === "sim");
          if (simDoc) {
            setSimUrl(simDoc.file_url);
            setSimStatus(simDoc.status);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("users")
        .update({
          name: fullName,
          phone: phone,
        })
        .eq("id", user.id);

      if (error) {
        alert(`Gagal memperbarui profil: ${error.message}`);
      } else {
        alert("Profil berhasil diperbarui!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDocument = async (type: "ktp" | "sim", file: File) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${type}_${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        alert(`Gagal mengunggah file: ${uploadError.message}`);
        return;
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      // Upsert into documents table
      const { error: dbError } = await supabase.from("documents").upsert(
        {
          user_id: user.id,
          type: type,
          file_url: publicUrl,
          status: "Pending",
        },
        { onConflict: "user_id,type" }
      );

      if (dbError) {
        alert(`Gagal memperbarui data dokumen: ${dbError.message}`);
      } else {
        if (type === "ktp") {
          setKtpUrl(publicUrl);
          setKtpStatus("Pending");
        } else {
          setSimUrl(publicUrl);
          setSimStatus("Pending");
        }
        alert(`${type.toUpperCase()} berhasil diunggah dan sedang menunggu verifikasi!`);
      }
    } catch (err) {
      console.error("Error uploading document:", err);
    }
  };

  // Get verification banner status
  const getVerificationBanner = () => {
    if (ktpStatus === "Verified" && simStatus === "Verified") {
      return (
        <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-emerald-100 p-2 rounded-full text-emerald-700 shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-800">Akun Terverifikasi</h3>
            <p className="text-sm text-emerald-700/90 mt-1 leading-relaxed">
              Dokumen identitas utama Anda (KTP & SIM A) telah diverifikasi oleh admin. Anda dapat menyewa seluruh armada premium kami secara lepas kunci tanpa batasan.
            </p>
          </div>
        </div>
      );
    } else if (ktpStatus === "Pending" || simStatus === "Pending") {
      return (
        <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-amber-100 p-2 rounded-full text-amber-700 shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-800">Dokumen Menunggu Review</h3>
            <p className="text-sm text-amber-700/90 mt-1 leading-relaxed">
              Dokumen Anda telah diunggah dan sedang ditinjau oleh tim admin kami. Proses verifikasi biasanya membutuhkan waktu maksimal 1x24 jam.
            </p>
          </div>
        </div>
      );
    } else if (ktpStatus === "Rejected" || simStatus === "Rejected") {
      return (
        <div className="rounded-3xl bg-red-50 border border-red-200 p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-red-100 p-2 rounded-full text-red-700 shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800">Verifikasi Dokumen Ditolak</h3>
            <p className="text-sm text-red-700/90 mt-1 leading-relaxed">
              Salah satu dokumen identitas Anda ditolak karena tidak sesuai ketentuan. Silakan unggah kembali foto dokumen yang jelas dan valid.
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-slate-100 p-2 rounded-full text-slate-700 shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-850">Akun Belum Terverifikasi</h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Anda belum mengunggah seluruh dokumen identitas Anda. Silakan unggah dokumen KTP dan SIM A Anda di bawah untuk mengaktifkan status verifikasi akun.
            </p>
          </div>
        </div>
      );
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
          {/* Profile Card Component */}
          <ProfileForm
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            phone={phone}
            setPhone={setPhone}
            onSubmit={handleProfileSubmit}
            saving={saving}
            memberSince={memberSince}
          />

          {/* Security Card Component */}
          <SecurityCard />
        </div>

        {/* Right Column: Verification & Documents (Spans 7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Verification Status Banner */}
          {getVerificationBanner()}

          {/* Documents Component */}
          <DocumentVerification
            ktpUrl={ktpUrl}
            ktpStatus={ktpStatus}
            simUrl={simUrl}
            simStatus={simStatus}
            onUploadDocument={handleUploadDocument}
          />
        </div>
      </div>
    </div>
  );
}
