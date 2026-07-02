import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import CarDetailClient from "@/src/components/cars/car-detail-client";
import { Car } from "@/src/domain/car";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const supabase = await createClient();
    const { data: dbCar } = await supabase
      .from("cars")
      .select("brand, model, category, description, price")
      .eq("slug", slug)
      .single();

    if (!dbCar) {
      return {
        title: "Mobil Tidak Ditemukan",
      };
    }

    const title = `${dbCar.brand} ${dbCar.model} - Sewa Mobil ${dbCar.category} Jogja`;
    const description = dbCar.description || `Sewa mobil ${dbCar.brand} ${dbCar.model} di Yogyakarta. Harga terbaik Rp ${Number(dbCar.price).toLocaleString("id-ID")}/hari. Kondisi prima, bersih & nyaman. Hubungi Kijang Rental sekarang!`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  } catch (err) {
    return {
      title: "Detail Mobil",
    };
  }
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const supabase = await createClient();
  const { data: dbCar, error } = await supabase
    .from("cars")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !dbCar) {
    notFound();
  }

  const car: Car = {
    id: dbCar.id,
    slug: dbCar.slug,
    brand: dbCar.brand,
    model: dbCar.model,
    year: dbCar.year,
    category: dbCar.category,
    transmission: dbCar.transmission,
    fuel: dbCar.fuel,
    seats: dbCar.seats,
    price: Number(dbCar.price),
    rating: Number(dbCar.rating || 4.8),
    reviews: dbCar.reviews || 0,
    available: dbCar.available,
    thumbnail: dbCar.thumbnail,
    images: dbCar.images || [dbCar.thumbnail],
    features: dbCar.features || [],
    description: dbCar.description || "",
  };

  return <CarDetailClient car={car} />;
}
