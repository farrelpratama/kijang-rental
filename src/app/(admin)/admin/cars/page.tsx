"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import CarCard from "@/src/components/admin/car-card";
import CarFilters from "@/src/components/admin/car-filters";
import CarFormModal from "@/src/components/admin/car-form-modal";

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

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("brand", { ascending: true });

      if (error) throw error;
      setCars(data || []);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const openAddModal = () => {
    setEditingCar(null);
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const handleSaveCar = async (payload: Omit<Car, "id"> & { id?: string }) => {
    try {
      const supabase = createClient();
      const slug = `${payload.brand.toLowerCase()}-${payload.model.toLowerCase()}-${Date.now().toString().slice(-4)}`.replace(/\s+/g, "-");

      const carPayload = {
        ...payload,
        slug,
      };

      if (payload.id) {
        const { error } = await supabase
          .from("cars")
          .update({
            brand: payload.brand,
            model: payload.model,
            year: Number(payload.year),
            category: payload.category,
            transmission: payload.transmission,
            fuel: payload.fuel,
            seats: Number(payload.seats),
            price: Number(payload.price),
            available: payload.available,
            thumbnail: payload.thumbnail,
            description: payload.description,
            features: payload.features,
          })
          .eq("id", payload.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cars")
          .insert([carPayload]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchCars();
    } catch (err: any) {
      console.error("Error saving car:", err);
      alert("Gagal menyimpan kendaraan: " + err.message);
      throw err;
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kendaraan ini?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("cars")
        .delete()
        .eq("id", id);

      if (error) throw error;
      fetchCars();
    } catch (err: any) {
      console.error("Error deleting car:", err);
      alert("Gagal menghapus kendaraan: " + err.message);
    }
  };

  const toggleAvailability = async (id: string, currentAvailable: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("cars")
        .update({ available: !currentAvailable })
        .eq("id", id);

      if (error) throw error;
      
      setCars(cars.map((c) => c.id === id ? { ...c, available: !currentAvailable } : c));
    } catch (err: any) {
      console.error("Error toggling availability:", err);
    }
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch = 
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || car.category === categoryFilter;
    const matchesTransmission = !transmissionFilter || car.transmission === transmissionFilter;

    return matchesSearch && matchesCategory && matchesTransmission;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#031636]">Kelola Armada</h1>
          <p className="text-slate-500 mt-1">Tambah, edit, atau perbarui status ketersediaan armada mobil.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-[#FEA619] hover:bg-[#e89500] text-white font-bold rounded-xl transition shadow-md flex items-center gap-2 w-fit"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Mobil Baru
        </button>
      </div>

      {/* Filters Toolbar */}
      <CarFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        transmissionFilter={transmissionFilter}
        onTransmissionFilterChange={setTransmissionFilter}
      />

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl h-80"></div>
          ))}
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 font-medium">
          Tidak ada mobil yang cocok dengan filter atau kata kunci Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              formatIDR={formatIDR}
              onEdit={openEditModal}
              onDelete={handleDeleteCar}
              onToggleAvailability={toggleAvailability}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <CarFormModal
        isOpen={isModalOpen}
        car={editingCar}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCar}
      />
    </div>
  );
}
