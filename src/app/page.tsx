import Navbar from "@/src/components/landing/navbar";
import HeroSection from "@/src/components/landing/hero-section";
import StatsSection from "@/src/components/landing/stats-section";
import ServicesSection from "@/src/components/landing/services-section";
import FeaturedFleet from "@/src/components/landing/featured-fleet";
import Footer from "@/src/components/landing/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FeaturedFleet />
      <Footer />
    </>
  );
}