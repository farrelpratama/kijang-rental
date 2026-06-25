"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navigation = [
  {
    label: "Beranda",
    href: "/",
  },
  {
    label: "Armada",
    href: "/cars",
  },
  {
    label: "Layanan",
    href: "#services",
  },
  {
    label: "Testimoni",
    href: "#testimonials",
  },
  {
    label: "Kontak",
    href: "#footer",
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 shadow-lg backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className={`text-2xl font-black tracking-tight transition ${
              isScrolled
                ? "text-[#031636]"
                : "text-white"
            }`}
          >
            KIJANG
            <span className="text-[#FEA619]">
              RENTAL
            </span>
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`font-medium transition ${
                  isScrolled
                    ? "text-slate-700 hover:text-[#031636]"
                    : "text-white hover:text-[#FEA619]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className={`rounded-xl border px-5 py-2 font-medium transition ${
                isScrolled
                  ? "border-[#031636] text-[#031636] hover:bg-[#031636] hover:text-white"
                  : "border-white text-white hover:bg-white hover:text-[#031636]"
              }`}
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-[#FEA619] px-5 py-2 font-semibold text-white transition hover:scale-105 hover:bg-[#e89500]"
            >
              Register
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className={`lg:hidden ${
              isScrolled
                ? "text-[#031636]"
                : "text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 7h22M4 15h22M4 23h22" />
            </svg>
          </button>
        </div>
      </header>

      {/* Overlay */}

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition ${
          isOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* Drawer */}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold text-[#031636]">
            Menu
          </h2>

          <button
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-6 p-8">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-700 transition hover:text-[#FEA619]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-3 border-t p-6">
          <Link
            href="/login"
            className="block rounded-xl border border-[#031636] py-3 text-center font-medium text-[#031636]"
          >
            Login
          </Link>

          <Link
            href="/cars"
            className="block rounded-xl bg-[#FEA619] py-3 text-center font-semibold text-white"
          >
            Booking Sekarang
          </Link>
        </div>
      </aside>
    </>
  );
}