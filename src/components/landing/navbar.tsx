"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";
import { signOut } from "@/src/lib/auth/auth-service";

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
    href: "/#services",
  },
  {
    label: "Testimoni",
    href: "/#testimonials",
  },
  {
    label: "Kontak",
    href: "/#footer",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  // Listen to Supabase auth state
  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
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

  const handleLogout = async () => {
    try {
      setIsOpen(false);
      await signOut();
      setUser(null);
      router.refresh();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // The navbar should be solid on all pages except the landing page (unless scrolled)
  const isSolid = isScrolled || pathname !== "/";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isSolid
            ? "bg-white/95 shadow-lg backdrop-blur-xl border-b border-slate-100"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className={`text-2xl font-black tracking-tight transition ${
              isSolid
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
                  isSolid
                    ? "text-slate-700 hover:text-[#031636]"
                    : "text-white hover:text-[#FEA619]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <Link
                href="/dashboard"
                className={`rounded-xl px-5 py-2 font-semibold transition flex items-center gap-2 ${
                  isSolid
                    ? "bg-[#031636] text-white hover:bg-[#05204f]"
                    : "bg-white text-[#031636] hover:bg-slate-100"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`rounded-xl border px-5 py-2 font-medium transition ${
                    isSolid
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
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className={`lg:hidden ${
              isSolid
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
            className="text-slate-500 hover:text-[#031636] transition font-bold"
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
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl bg-[#031636] py-3 text-center font-semibold text-white hover:bg-[#05204f] transition"
              >
                Dashboard Saya
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full rounded-xl border border-red-200 py-3 text-center font-medium text-red-500 hover:bg-red-50 transition"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl border border-[#031636] py-3 text-center font-medium text-[#031636] hover:bg-[#031636] hover:text-white transition"
              >
                Login
              </Link>

              <Link
                href="/cars"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl bg-[#FEA619] py-3 text-center font-semibold text-white hover:bg-[#e89500] transition"
              >
                Booking Sekarang
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}