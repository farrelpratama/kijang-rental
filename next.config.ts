import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "yndahkywrtvjxvgucywv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  }
};

export default nextConfig;
