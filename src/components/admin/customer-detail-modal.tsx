"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

interface CustomerDetailModalProps {
  customer: Customer | null;
  onClose: () => void;
}

interface Document {
  id: string;
  type: string;
  file_url: string;
  status: string;
  created_at: string;
}

interface Booking {
  id: string;
  carBrand: string;
  carModel: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

export default function CustomerDetailModal({
  customer,
  onClose,
}: CustomerDetailModalProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!customer) return;
    const custId = customer.id;

    async function loadCustomerDetail() {
      try {
        setLoading(true);
        const supabase = createClient();

        // 1. Fetch documents
        const { data: dbDocs } = await supabase
          .from("documents")
          .select("id, type, file_url, status, created_at")
          .eq("user_id", custId);

        if (dbDocs) setDocuments(dbDocs);

        // 2. Fetch bookings with car details
        const { data: dbBookings } = await supabase
          .from("bookings")
          .select(`
            id,
            start_date,
            end_date,
            total_price,
            status,
            car:cars (
              brand,
              model
            )
          `)
          .eq("user_id", custId)
          .order("created_at", { ascending: false });

        if (dbBookings) {
          setBookings(
            dbBookings.map((b: any) => ({
              id: b.id,
              carBrand: b.car?.brand || "",
              carModel: b.car?.model || "",
              startDate: b.start_date,
              endDate: b.end_date,
              totalPrice: Number(b.total_price),
              status: b.status,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading customer detail:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCustomerDetail();
  }, [customer]);

  if (!customer) return null;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
      <div className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-[#031636]">Informasi Lengkap Customer</h3>
            <p className="text-xs text-slate-400 mt-0.5">Detail profil, dokumen identitas, dan riwayat penyewaan</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-[#031636] font-bold text-lg p-2 hover:bg-slate-100 rounded-xl transition">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 max-h-[70vh]">
          
          {/* Section 1: Profil */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nama Lengkap</p>
              <p className="font-bold text-[#031636] text-base mt-0.5">{customer.name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Alamat Email</p>
              <p className="font-bold text-[#031636] text-base mt-0.5">{customer.email}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nomor Telepon / WhatsApp</p>
              <p className="font-bold text-[#031636] text-base mt-0.5">{customer.phone || "-"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tanggal Bergabung</p>
              <p className="font-bold text-[#031636] text-base mt-0.5">
                {new Date(customer.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Section 2: Dokumen Identitas */}
          <div>
            <h4 className="text-sm font-black text-[#031636] mb-3">Dokumen Persyaratan</h4>
            {loading ? (
              <div className="h-20 bg-slate-50 animate-pulse rounded-2xl"></div>
            ) : documents.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium">
                Belum ada dokumen KTP/SIM yang diunggah.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 bg-white border border-slate-150 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => setPreviewUrl(doc.file_url)}
                        className="h-12 w-16 bg-slate-100 rounded-lg overflow-hidden cursor-pointer border border-slate-200 shrink-0 relative group"
                      >
                        <img src={doc.file_url} alt={doc.type} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[9px] text-white font-bold">Zoom</div>
                      </div>
                      <div>
                        <p className="font-bold text-xs uppercase text-[#031636]">{doc.type}</p>
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                          doc.status === "Verified"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : doc.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-100 animate-pulse"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setPreviewUrl(doc.file_url)}
                      className="px-3 py-1.5 text-xs font-bold text-[#031636] bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition"
                    >
                      Lihat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Riwayat Transaksi/Penyewaan */}
          <div>
            <h4 className="text-sm font-black text-[#031636] mb-3">Riwayat Penyewaan</h4>
            {loading ? (
              <div className="space-y-2">
                <div className="h-10 bg-slate-50 animate-pulse rounded-xl"></div>
                <div className="h-10 bg-slate-50 animate-pulse rounded-xl"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium">
                Belum ada transaksi penyewaan.
              </div>
            ) : (
              <div className="border border-slate-150 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                      <th className="p-3">Mobil</th>
                      <th className="p-3">Tanggal Sewa</th>
                      <th className="p-3">Biaya</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3 font-bold text-[#031636]">{b.carBrand} {b.carModel}</td>
                        <td className="p-3 text-slate-500">
                          {new Date(b.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - {new Date(b.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="p-3 font-bold text-[#031636]">{formatIDR(b.totalPrice)}</td>
                        <td className="p-3">
                          <span className={`inline-block font-bold px-2 py-0.5 rounded-full text-[9px] uppercase ${
                            b.status === "completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : b.status === "ongoing"
                              ? "bg-blue-50 text-blue-700"
                              : b.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : b.status === "pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}>
                            {b.status === "ongoing" ? "Aktif" : b.status === "confirmed" ? "Lunas" : b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-white bg-[#031636] hover:bg-[#05204f] rounded-xl transition shadow">
            Tutup
          </button>
        </div>

        {/* Nested Document Preview Lightbox */}
        {previewUrl && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 p-4">
            <div className="relative max-w-3xl w-full max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span className="font-bold text-sm text-[#031636]">Pratinjau Dokumen Detail</span>
                <button onClick={() => setPreviewUrl(null)} className="text-slate-400 hover:text-[#031636] font-bold text-lg">✕</button>
              </div>
              <div className="p-6 flex-grow flex items-center justify-center bg-slate-900/5">
                <img src={previewUrl} alt="Document Zoomed" className="max-w-full max-h-[60vh] object-contain rounded-xl" />
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={() => setPreviewUrl(null)} className="px-5 py-2 text-sm font-bold text-white bg-[#031636] hover:bg-[#05204f] rounded-xl">Tutup</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
