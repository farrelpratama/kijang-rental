"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Car } from "@/src/domain/car";
import { createClient } from "@/src/lib/supabase/client";
import { useToast } from "@/src/providers/toast-provider";

interface CarDetailClientProps {
  car: Car;
}

export default function CarDetailClient({ car }: CarDetailClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  // Gallery state
  const [activeImage, setActiveImage] = useState(car.images[0] || car.thumbnail);

  // Booking Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasDriver, setHasDriver] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("Kantor Kijang Rental (Sleman)");
  const [returnLocation, setReturnLocation] = useState("Kantor Kijang Rental (Sleman)");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  // Calculate rental duration and prices
  const {
    duration,
    basePrice,
    driverPrice,
    serviceFee,
    totalPrice,
    isValidDateRange,
    dateError,
  } = useMemo(() => {
    if (!startDate || !endDate) {
      return {
        duration: 0,
        basePrice: 0,
        driverPrice: 0,
        serviceFee: 50000,
        totalPrice: 0,
        isValidDateRange: false,
        dateError: "",
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return {
        duration: 0,
        basePrice: 0,
        driverPrice: 0,
        serviceFee: 50000,
        totalPrice: 0,
        isValidDateRange: false,
        dateError: "Tanggal mulai tidak boleh di masa lalu",
      };
    }

    if (end < start) {
      return {
        duration: 0,
        basePrice: 0,
        driverPrice: 0,
        serviceFee: 50000,
        totalPrice: 0,
        isValidDateRange: false,
        dateError: "Tanggal selesai harus setelah atau sama dengan tanggal mulai",
      };
    }

    // Calculate difference in days
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const base = car.price * diffDays;
    const driver = hasDriver ? 150000 * diffDays : 0;
    const service = 50000;
    const total = base + driver + service;

    return {
      duration: diffDays,
      basePrice: base,
      driverPrice: driver,
      serviceFee: service,
      totalPrice: total,
      isValidDateRange: true,
      dateError: "",
    };
  }, [startDate, endDate, hasDriver, car.price]);

  // Handle drag events for document upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event for document upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Validate file type and size (under 5MB)
      if (
        (file.type === "image/jpeg" || file.type === "image/png") &&
        file.size <= 5 * 1024 * 1024
      ) {
        setDocumentFile(file);
      } else {
        showToast("Hanya menerima file JPG/PNG maksimal 5MB.", "error");
      }
    }
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (
        (file.type === "image/jpeg" || file.type === "image/png") &&
        file.size <= 5 * 1024 * 1024
      ) {
        setDocumentFile(file);
      } else {
        showToast("Hanya menerima file JPG/PNG maksimal 5MB.", "error");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidDateRange) {
      showToast("Silakan pilih tanggal sewa yang valid terlebih dahulu.", "error");
      return;
    }
    if (!fullName || !phone) {
      showToast("Silakan isi nama lengkap dan nomor WhatsApp.", "error");
      return;
    }
    if (!documentFile) {
      showToast("Silakan unggah dokumen identitas (KTP/SIM) Anda.", "error");
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        showToast("Anda harus login terlebih dahulu untuk membuat sewa.", "info");
        router.push("/login");
        return;
      }

      // 1. Insert booking
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          car_id: car.id,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          status: "pending"
        })
        .select()
        .single();

      if (bookingError) {
        showToast("Gagal membuat booking: " + bookingError.message, "error");
        return;
      }

      setCreatedBookingId(booking.id);

      // 2. Upload document (KTP)
      const fileExt = documentFile.name.split(".").pop();
      const filePath = `${user.id}/booking-${booking.id}-ktp.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, documentFile);

      let fileUrl = "";
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("documents")
          .getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
      } else {
        // Fallback local blob if bucket not created
        fileUrl = URL.createObjectURL(documentFile);
        console.warn("Storage upload failed, using local blob URL:", uploadError.message);
      }

      // 3. Insert document metadata
      await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          type: "ktp",
          file_url: fileUrl,
          status: "Pending"
        });

      // Show success modal
      setShowSuccessModal(true);

    } catch (err) {
      console.error("Error creating booking:", err);
      showToast("Terjadi kesalahan saat memproses booking.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayNow = async () => {
    if (!createdBookingId) return;

    try {
      setPaying(true);
      const res = await fetch("/api/payment/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: createdBookingId }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      if (typeof window !== "undefined" && (window as any).snap) {
        (window as any).snap.pay(data.token, {
          onSuccess: async (result: any) => {
            console.log("payment success:", result);
            showToast("Pembayaran berhasil!", "success");
            try {
              await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId: createdBookingId, orderId: result.order_id }),
              });
            } catch (syncErr) {
              console.error("Failed to sync payment status:", syncErr);
            }
            setShowSuccessModal(false);
            router.push("/dashboard");
          },
          onPending: async (result: any) => {
            console.log("payment pending:", result);
            showToast("Pembayaran sedang diproses, silakan ikuti instruksi pembayaran.", "info");
            try {
              await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId: createdBookingId, orderId: result.order_id }),
              });
            } catch (syncErr) {
              console.error("Failed to sync payment status:", syncErr);
            }
            setShowSuccessModal(false);
            router.push("/dashboard/payment");
          },
          onError: (result: any) => {
            console.error("payment error:", result);
            showToast("Pembayaran gagal. Silakan coba kembali.", "error");
          },
          onClose: () => {
            console.log("payment modal closed");
            setShowSuccessModal(false);
            router.push("/dashboard/payment");
          },
        });
      } else {
        showToast("Sistem pembayaran Midtrans sedang bersiap. Silakan coba lagi.", "info");
        router.push("/dashboard/payment");
      }
    } catch (err: any) {
      console.error("Error initiating payment:", err);
      showToast("Gagal memproses pembayaran: " + err.message, "error");
      router.push("/dashboard/payment");
    } finally {
      setPaying(false);
    }
  };

  // Format currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <main className="bg-[#F8FAFC] pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-[#031636]">
            Beranda
          </Link>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link href="/cars" className="transition hover:text-[#031636]">
            Armada
          </Link>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="font-medium text-[#031636]">
            {car.brand} {car.model}
          </span>
        </nav>

        {/* Title Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#031636]/10 px-4 py-1.5 text-xs font-bold text-[#031636]">
                {car.category}
              </span>
              {car.fuel === "Hybrid" && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-700">
                  ⚡ Hybrid
                </span>
              )}
            </div>
            <h1 className="mt-3 text-4xl font-black text-[#031636] md:text-5xl">
              {car.brand} {car.model}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#FEA619]">★ {car.rating}</span>
            <span className="text-slate-500">({car.reviews} ulasan)</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Gallery & Details */}
          <div className="space-y-8 lg:col-span-2">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-[32px] bg-slate-200 shadow-sm">
                <Image
                  src={activeImage}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  priority
                  className="object-cover transition-all duration-500"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
                {car.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                      activeImage === img
                        ? "border-[#FEA619] scale-95 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${car.brand} ${car.model} gallery ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-150 bg-white p-6 shadow-sm sm:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#031636]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <span className="text-xs text-slate-500">Kapasitas</span>
                <span className="mt-1 font-bold text-[#031636]">{car.seats} Kursi</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#031636]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="text-xs text-slate-500">Transmisi</span>
                <span className="mt-1 font-bold text-[#031636]">{car.transmission}</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#031636]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </span>
                <span className="text-xs text-slate-500">Bahan Bakar</span>
                <span className="mt-1 font-bold text-[#031636]">{car.fuel}</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#031636]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="text-xs text-slate-500">Tahun</span>
                <span className="mt-1 font-bold text-[#031636]">{car.year}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#031636]">Deskripsi Kendaraan</h3>
              <p className="text-lg leading-relaxed text-slate-600">{car.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-4 border-t border-slate-200 pt-8">
              <h3 className="text-2xl font-bold text-[#031636]">Fitur Utama</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {car.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-medium text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6 border-t border-slate-200 pt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[#031636]">Ulasan Pelanggan</h3>
                <div className="flex items-center gap-2 rounded-2xl bg-[#FEA619]/10 px-4 py-2 text-lg font-bold text-[#031636]">
                  <span className="text-[#FEA619]">★</span>
                  <span>{car.rating}</span>
                </div>
              </div>

              {/* Review Item */}
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-150 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#031636] font-bold text-white">
                        B
                      </div>
                      <div>
                        <h4 className="font-bold text-[#031636]">Budi Santoso</h4>
                        <p className="text-xs text-slate-400">2 hari yang lalu</p>
                      </div>
                    </div>
                    <div className="text-[#FEA619]">★★★★★</div>
                  </div>
                  <p className="text-slate-600">
                    Sangat nyaman untuk perjalanan dinas dan keluarga. Mobil sangat bersih, wangi, dan mesinnya halus. Konsumsi bahan bakarnya sangat irit karena mesin Hybrid. Pelayanan dari Kijang Rental juga sangat sigap dan ramah! Recommended sekali.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-[32px] border border-slate-150 bg-white p-8 shadow-[0_20px_50px_rgba(3,22,54,0.08)]">
              <div className="mb-6 flex items-baseline justify-between border-b border-slate-100 pb-4">
                <span className="text-slate-500">Tarif Sewa</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#031636]">
                    {formatIDR(car.price)}
                  </span>
                  <span className="text-sm text-slate-500">/ hari</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Mulai Sewa</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-[#031636] focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Selesai Sewa</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-[#031636] focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636]"
                    />
                  </div>
                </div>

                {dateError && (
                  <p className="text-xs font-semibold text-red-500">{dateError}</p>
                )}

                {/* Driver Option Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Opsi Driver</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHasDriver(false)}
                      className={`rounded-xl py-3 text-sm font-semibold transition ${
                        !hasDriver
                          ? "bg-[#031636] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Lepas Kunci
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasDriver(true)}
                      className={`rounded-xl py-3 text-sm font-semibold transition ${
                        hasDriver
                          ? "bg-[#031636] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Dengan Sopir
                    </button>
                  </div>
                  {hasDriver && (
                    <p className="text-[11px] text-slate-500">
                      * Tambahan biaya sopir: Rp 150.000 / hari
                    </p>
                  )}
                </div>

                {/* Pickup & Return Locations */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Lokasi Penjemputan</label>
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-[#031636] focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636]"
                    >
                      <option>Kantor Kijang Rental (Sleman)</option>
                      <option>Bandara YIA (Yogyakarta International Airport)</option>
                      <option>Stasiun Tugu Yogyakarta</option>
                      <option>Stasiun Lempuyangan</option>
                      <option>Hotel / Area Kota Yogyakarta</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Lokasi Pengembalian</label>
                    <select
                      value={returnLocation}
                      onChange={(e) => setReturnLocation(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-[#031636] focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636]"
                    >
                      <option>Kantor Kijang Rental (Sleman)</option>
                      <option>Bandara YIA (Yogyakarta International Airport)</option>
                      <option>Stasiun Tugu Yogyakarta</option>
                      <option>Stasiun Lempuyangan</option>
                      <option>Hotel / Area Kota Yogyakarta</option>
                    </select>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Nama Lengkap</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Sesuai KTP"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#031636] placeholder-slate-400 focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="Contoh: 08123456789"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#031636] placeholder-slate-400 focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636]"
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Dokumen Identitas (KTP / SIM)</span>
                    <span className="text-[10px] text-red-500">Wajib</span>
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
                      dragActive
                        ? "border-[#FEA619] bg-[#FEA619]/5"
                        : documentFile
                        ? "border-emerald-500 bg-emerald-50/20"
                        : "border-slate-200 hover:border-[#031636] hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    {documentFile ? (
                      <div className="flex flex-col items-center">
                        <span className="mb-2 text-3xl text-emerald-500">✓</span>
                        <span className="max-w-[180px] truncate text-xs font-bold text-slate-700">
                          {documentFile.name}
                        </span>
                        <span className="mt-1 text-[10px] text-slate-400">
                          {(documentFile.size / (1024 * 1024)).toFixed(2)} MB - Siap
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDocumentFile(null);
                          }}
                          className="mt-3 text-xs font-semibold text-red-500 hover:underline"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg className="mb-2 h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-xs font-semibold text-[#031636]">
                          Klik untuk upload atau drag & drop
                        </span>
                        <span className="mt-1 text-[10px] text-slate-400">
                          Format JPG atau PNG (Maks 5MB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Summary */}
                {isValidDateRange && (
                  <div className="rounded-2xl bg-slate-50 p-5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Rincian Biaya ({duration} Hari)
                    </h4>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Sewa Kendaraan</span>
                      <span>{formatIDR(basePrice)}</span>
                    </div>
                    {hasDriver && (
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Biaya Sopir</span>
                        <span>{formatIDR(driverPrice)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Biaya Layanan</span>
                      <span>{formatIDR(serviceFee)}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                      <span className="font-bold text-[#031636]">Total Pembayaran</span>
                      <span className="text-xl font-black text-[#031636]">
                        {formatIDR(totalPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!car.available || submitting}
                  className={`w-full py-4 text-center font-bold rounded-2xl transition shadow-lg ${
                    car.available && !submitting
                      ? "bg-[#FEA619] text-white hover:bg-[#e89500] hover:scale-[1.02]"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {submitting ? "Memproses Pemesanan..." : car.available ? "Lanjut ke Pembayaran" : "Tidak Tersedia"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
            >
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-2xl font-black text-[#031636]">
                  Booking Berhasil Dibuat!
                </h3>
                <p className="mt-2 text-slate-500">
                  Simulasi booking untuk {car.brand} {car.model} berhasil dilakukan.
                </p>
              </div>

              {/* Booking Summary */}
              <div className="my-6 rounded-2xl bg-slate-50 p-5 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span className="font-semibold">Nama Penyewa:</span>
                  <span className="text-[#031636] font-medium">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">No. WhatsApp:</span>
                  <span className="text-[#031636] font-medium">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Durasi Sewa:</span>
                  <span className="text-[#031636] font-medium">{duration} Hari</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Metode Sewa:</span>
                  <span className="text-[#031636] font-medium">
                    {hasDriver ? "Dengan Sopir" : "Lepas Kunci"}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold">
                  <span className="text-[#031636]">Total Tarif:</span>
                  <span className="text-[#FEA619]">{formatIDR(totalPrice)}</span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-xs text-slate-400">
                  Pesanan Anda berhasil dicatat di database. Silakan selesaikan pembayaran di dashboard.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      router.push("/dashboard");
                    }}
                    className="w-full py-4 bg-slate-100 text-[#031636] font-bold rounded-2xl transition hover:bg-slate-200"
                  >
                    Ke Dashboard
                  </button>
                  <button
                    disabled={paying}
                    onClick={handlePayNow}
                    className="w-full py-4 bg-[#031636] text-white font-bold rounded-2xl transition hover:bg-[#05204f] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {paying ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Memproses...
                      </>
                    ) : (
                      "Bayar Sekarang"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
