import { Metadata } from "next";
import Navbar from "@/src/components/landing/navbar";
import HeroSection from "@/src/components/landing/hero-section";
import StatsSection from "@/src/components/landing/stats-section";
import ServicesSection from "@/src/components/landing/services-section";
import FeaturedFleet from "@/src/components/landing/featured-fleet";
import Footer from "@/src/components/landing/footer";
import CtaBanner from "@/src/components/landing/cta-banner";
import TestimonialsSection from "@/src/components/landing/testimonials-section";

export const metadata: Metadata = {
  title: "Sewa Mobil Yogyakarta Murah & Lepas Kunci | Kijang Rental",
  description: "Pilihan rental mobil terlengkap di Jogja. Tersedia Toyota Avanza, Innova Zenix, Fortuner, Hiace, hingga Wuling Air EV dengan harga terbaik, lepas kunci atau dengan driver.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FeaturedFleet />
      <TestimonialsSection />
      <CtaBanner/>
      <Footer />
    </>
  );
}