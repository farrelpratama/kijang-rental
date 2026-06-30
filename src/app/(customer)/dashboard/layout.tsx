"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/src/lib/auth/auth-service";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    label: "Dashboard Overview",
    href: "/dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    ),
  },
  {
    label: "My Bookings",
    href: "/dashboard/bookings",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Payment History",
    href: "/dashboard/payment",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    label: "Profile & Documents",
    href: "/dashboard/profile",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Clean body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      // Fallback redirect
      router.push("/login");
    }
  };

  // Helper to get active page title
  const getPageTitle = () => {
    const activeItem = menuItems.find((item) => item.href === pathname);
    return activeItem ? activeItem.label : "Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col bg-[#031636] py-8 text-white shadow-xl lg:flex fixed h-full z-30">
        {/* Brand Logo */}
        <div className="px-6 mb-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-white">
            KIJANG<span className="text-[#FEA619]">RENTAL</span>
          </Link>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-bold">
            Customer Dashboard
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#FEA619] text-white shadow-lg shadow-[#FEA619]/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile & Logout */}
        <div className="px-4 mt-auto border-t border-white/10 pt-6">
          <div className="flex items-center gap-3 px-4 mb-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-600 border border-white/10">
              <span className="flex h-full w-full items-center justify-center font-bold text-white text-sm">
                BS
              </span>
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-white truncate">Budi Santoso</p>
              <p className="text-[10px] text-slate-400 font-medium">Premium Member</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-350 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 h-20 flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#031636] hover:bg-slate-100 rounded-xl transition"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl font-extrabold text-[#031636] hidden sm:block">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Icon */}
            <button className="relative p-2 text-slate-500 hover:text-[#031636] hover:bg-slate-50 rounded-xl transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Book Now Button */}
            <Link
              href="/cars"
              className="hidden md:flex items-center gap-2 bg-[#031636] text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#05204f] transition shadow-md"
            >
              Cari Mobil
            </Link>

            {/* Mobile User Avatar */}
            <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-200 border border-slate-100 lg:hidden">
              <span className="flex h-full w-full items-center justify-center font-bold text-[#031636] text-xs">
                BS
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Drawer Content */}
        <aside
          className={`absolute left-0 top-0 bottom-0 w-72 bg-[#031636] py-8 text-white flex flex-col transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 mb-8">
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                KIJANG<span className="text-[#FEA619]">RENTAL</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-bold">
                Customer Dashboard
              </p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-350"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#FEA619] text-white"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 mt-auto border-t border-white/10 pt-6">
            <div className="flex items-center gap-3 px-4 mb-4">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-650 border border-white/10">
                <span className="flex h-full w-full items-center justify-center font-bold text-white text-sm">
                  BS
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Budi Santoso</p>
                <p className="text-[10px] text-slate-400 font-medium">Premium Member</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
