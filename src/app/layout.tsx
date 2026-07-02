import { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ToastProvider } from "@/src/providers/toast-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kijang Rental - Sewa Mobil Yogyakarta Terpercaya",
    template: "%s | Kijang Rental",
  },
  description: "Sewa mobil murah di Yogyakarta dengan Kijang Rental. Armada terawat, bersih, wangi, aman dan siap untuk liburan, bisnis, atau acara dinas Anda di Jogja.",
  keywords: ["sewa mobil jogja", "rental mobil yogyakarta", "innova zenix jogja", "sewa fortuner jogja", "rental mobil murah yogyakarta"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://kijangrental.com"),
  openGraph: {
    title: "Kijang Rental - Sewa Mobil Yogyakarta Terpercaya",
    description: "Sewa mobil murah di Yogyakarta dengan Kijang Rental. Booking mudah 100% online, transaksi aman via Midtrans.",
    type: "website",
    locale: "id_ID",
    url: "https://kijangrental.com",
    siteName: "Kijang Rental",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const snapUrl = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
        <Script
          src={snapUrl}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
