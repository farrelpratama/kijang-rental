import { Metadata } from "next";
import Navbar from "@/src/components/landing/navbar";
import Footer from "@/src/components/landing/footer";

export const metadata: Metadata = {
  title: "Katalog Armada Mobil Yogyakarta | Kijang Rental",
  description: "Cari dan temukan mobil rental terbaik untuk perjalanan Anda di Yogyakarta. Bandingkan tarif sewa harian untuk Avanza, Innova, Fortuner, dan mobil listrik EV.",
};

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
