"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: "MPV" | "SUV" | "City Car" | "Premium";
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid";
  seats: number;
  price: number;
  available: boolean;
  thumbnail: string;
  description: string;
  features: string[];
}

interface CarFormModalProps {
  isOpen: boolean;
  car: Car | null;
  onClose: () => void;
  onSave: (payload: Omit<Car, "id"> & { id?: string }) => Promise<void>;
}

export default function CarFormModal({
  isOpen,
  car,
  onClose,
  onSave,
}: CarFormModalProps) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState<Car["category"]>("MPV");
  const [transmission, setTransmission] = useState<Car["transmission"]>("Automatic");
  const [fuel, setFuel] = useState<Car["fuel"]>("Petrol");
  const [seats, setSeats] = useState(7);
  const [price, setPrice] = useState(0);
  const [available, setAvailable] = useState(true);
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [featuresStr, setFeaturesStr] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const supabase = createClient();
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${brand.toLowerCase().replace(/\s+/g, "-") || "car"}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("car-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("car-images").getPublicUrl(filePath);
      
      setThumbnail(data.publicUrl);
    } catch (err: any) {
      console.error("Error uploading image:", err);
      alert("Gagal mengunggah foto: " + err.message + "\n(Pastikan bucket 'car-images' sudah dibuat di Supabase dashboard)");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (car) {
      setBrand(car.brand);
      setModel(car.model);
      setYear(car.year);
      setCategory(car.category);
      setTransmission(car.transmission);
      setFuel(car.fuel);
      setSeats(car.seats);
      setPrice(car.price);
      setAvailable(car.available);
      setThumbnail(car.thumbnail);
      setDescription(car.description || "");
      setFeaturesStr(car.features?.join(", ") || "");
    } else {
      setBrand("");
      setModel("");
      setYear(new Date().getFullYear());
      setCategory("MPV");
      setTransmission("Automatic");
      setFuel("Petrol");
      setSeats(7);
      setPrice(350000);
      setAvailable(true);
      setThumbnail("https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200");
      setDescription("");
      setFeaturesStr("Air Conditioner, Audio System, Parking Sensor");
    }
  }, [car, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !price || !thumbnail) {
      alert("Harap isi semua kolom wajib.");
      return;
    }

    try {
      setIsSaving(true);
      const features = featuresStr.split(",").map((f) => f.trim()).filter(Boolean);
      await onSave({
        brand,
        model,
        year,
        category,
        transmission,
        fuel,
        seats,
        price,
        available,
        thumbnail,
        description,
        features,
        ...(car && { id: car.id }),
      });
    } catch (err: any) {
      console.error("Form submit error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-extrabold text-[#031636] text-lg">
            {car ? "Edit Kendaraan" : "Tambah Kendaraan Baru"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-[#031636] transition">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Merek (Brand) *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Contoh: Toyota"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Model / Tipe *</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Contoh: Innova Zenix"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tahun Kendaraan *</label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Kapasitas Kursi *</label>
              <input
                type="number"
                required
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Harga Sewa / Hari (Rp) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Kategori *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Car["category"])}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
              >
                <option value="MPV">MPV</option>
                <option value="SUV">SUV</option>
                <option value="City Car">City Car</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Transmisi *</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as Car["transmission"])}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Bahan Bakar *</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value as Car["fuel"])}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Foto Utama *</label>
            
            {thumbnail && (
              <div className="relative w-32 aspect-[3/2] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setThumbnail("")}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/80 transition text-[10px] w-5 h-5 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="car-photo-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="car-photo-upload"
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm font-semibold cursor-pointer hover:bg-slate-50 transition text-slate-600 ${
                    uploading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent"></div>
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Unggah File Foto
                    </>
                  )}
                </label>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="Atau masukkan URL foto langsung..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm h-full"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fitur Utama (Pisahkan dengan koma)</label>
            <input
              type="text"
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              placeholder="Captain Seats, Panoramic Sunroof, GPS"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Deskripsi Kendaraan</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tulis deskripsi detail unit mobil sewa..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="available"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
            />
            <label htmlFor="available" className="text-sm font-semibold text-[#031636]">
              Tandai sebagai langsung tersedia untuk dipesan
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-[#031636] hover:bg-slate-50 rounded-xl transition border border-slate-150"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#031636] hover:bg-[#05204f] rounded-xl transition shadow flex items-center gap-2"
            >
              {isSaving ? "Menyimpan..." : "Simpan Kendaraan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
