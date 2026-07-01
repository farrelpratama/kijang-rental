"use client";

import { useState } from "react";
import Image from "next/image";

interface DocumentVerificationProps {
  ktpUrl: string;
  ktpStatus: string;
  simUrl: string;
  simStatus: string;
  onUploadDocument: (type: "ktp" | "sim", file: File) => Promise<void>;
}

export default function DocumentVerification({
  ktpUrl,
  ktpStatus,
  simUrl,
  simStatus,
  onUploadDocument,
}: DocumentVerificationProps) {
  const [dragActiveKtp, setDragActiveKtp] = useState(false);
  const [dragActiveSim, setDragActiveSim] = useState(false);

  const handleDragKtp = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveKtp(true);
    } else if (e.type === "dragleave") {
      setDragActiveKtp(false);
    }
  };

  const handleDragSim = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveSim(true);
    } else if (e.type === "dragleave") {
      setDragActiveSim(false);
    }
  };

  const handleDropKtp = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveKtp(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await onUploadDocument("ktp", e.dataTransfer.files[0]);
    }
  };

  const handleDropSim = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveSim(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await onUploadDocument("sim", e.dataTransfer.files[0]);
    }
  };

  const handleFileChangeKtp = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await onUploadDocument("ktp", e.target.files[0]);
    }
  };

  const handleFileChangeSim = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await onUploadDocument("sim", e.target.files[0]);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Verified":
        return "Terverifikasi";
      case "Pending":
        return "Menunggu Review";
      case "Rejected":
        return "Ditolak";
      default:
        return "Belum Diunggah";
    }
  };

  return (
    <div className="rounded-3xl border border-slate-150 bg-white p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-[#031636]">Dokumen Verifikasi</h3>
        <span className="text-xs text-slate-400 font-semibold">Syarat wajib menyewa</span>
      </div>

      <div className="space-y-6">
        {/* KTP Document */}
        <div className="border border-slate-105 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-[#031636]">Kartu Tanda Penduduk (KTP)</h4>
              <p className="text-xs text-slate-400">Identitas Utama</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${getStatusBadgeClass(ktpStatus)}`}>
              {getStatusLabel(ktpStatus)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {ktpStatus === "Not Uploaded" ? (
              <div
                onDragEnter={handleDragKtp}
                onDragOver={handleDragKtp}
                onDragLeave={handleDragKtp}
                onDrop={handleDropKtp}
                className={`relative h-28 w-44 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition shrink-0 ${
                  dragActiveKtp
                    ? "border-[#FEA619] bg-[#FEA619]/5"
                    : "border-slate-200 hover:border-[#031636] hover:bg-slate-50"
                }`}
              >
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChangeKtp}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="mt-1.5 text-[10px] font-bold text-[#031636]">Unggah KTP</span>
              </div>
            ) : (
              <div className="relative h-28 w-44 overflow-hidden rounded-xl border border-slate-200 shrink-0 bg-slate-100">
                {ktpUrl ? (
                  <Image
                    src={ktpUrl}
                    alt="KTP Preview"
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
              {ktpStatus === "Not Uploaded" && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-2 flex gap-2">
                  <svg className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-[11px] text-amber-850 leading-relaxed">
                    Anda belum mengunggah KTP. Dokumen ini wajib diunggah untuk memverifikasi identitas Anda.
                  </p>
                </div>
              )}
              <ul className="text-xs text-slate-450 space-y-1 list-disc pl-4">
                <li>KTP harus asli dan masih berlaku</li>
                <li>Foto KTP harus jelas dan terbaca seluruh datanya</li>
                <li>Format JPG atau PNG (Maks 5MB)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SIM A Document */}
        <div className="border border-slate-105 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-[#031636]">Surat Izin Mengemudi (SIM A)</h4>
              <p className="text-xs text-slate-400">Wajib untuk Lepas Kunci</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${getStatusBadgeClass(simStatus)}`}>
              {getStatusLabel(simStatus)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {simStatus === "Not Uploaded" ? (
              <div
                onDragEnter={handleDragSim}
                onDragOver={handleDragSim}
                onDragLeave={handleDragSim}
                onDrop={handleDropSim}
                className={`relative h-28 w-44 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition shrink-0 ${
                  dragActiveSim
                    ? "border-[#FEA619] bg-[#FEA619]/5"
                    : "border-slate-200 hover:border-[#031636] hover:bg-slate-50"
                }`}
              >
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChangeSim}
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
  );
}
