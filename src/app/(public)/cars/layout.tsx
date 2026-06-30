import Navbar from "@/src/components/landing/navbar";
import Footer from "@/src/components/landing/footer";

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
