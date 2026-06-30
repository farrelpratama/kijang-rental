import { notFound } from "next/navigation";
import { cars } from "@/src/domain/car";
import CarDetailClient from "@/src/components/cars/car-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);

  if (!car) {
    notFound();
  }

  return <CarDetailClient car={car} />;
}
