"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-[#031636]"
        >
          Kijang Rental
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="font-semibold text-[#855300]">
            Home
          </a>

          <a
            href="#fleet"
            className="text-slate-600 hover:text-[#031636]"
          >
            Catalog
          </a>

          <a
            href="#about"
            className="text-slate-600 hover:text-[#031636]"
          >
            About
          </a>

          <a
            href="#contact"
            className="text-slate-600 hover:text-[#031636]"
          >
            Contact
          </a>
        </nav>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="hidden md:flex border border-[#031636] px-4 py-2 rounded-lg text-[#031636]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-[#fea619] text-white font-semibold px-4 py-2 rounded-lg"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}