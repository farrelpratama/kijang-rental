"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/src/lib/auth/auth-service";
import { createClient } from "@/src/lib/supabase/client";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    label: "Dashboard Overview",
    href: "/admin",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    ),
  },
  {
    label: "Manage Fleet",
    href: "/admin/cars",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    label: "Bookings List",
    href: "/admin/bookings",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    label: "Customers & Documents",
    href: "/admin/customers",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Administrator");
  const [initials, setInitials] = useState("AD");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single();

        if (profile && profile.name) {
          setUserName(profile.name);
          const nameParts = profile.name.trim().split(/\s+/);
          const init = nameParts.length > 1 
            ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
            : nameParts[0].substring(0, 2).toUpperCase();
          setInitials(init);
        } else if (user.email) {
          const emailName = user.email.split("@")[0];
          setUserName(emailName);
          setInitials(emailName.substring(0, 2).toUpperCase());
        }
      } catch (err) {
        console.error("Error fetching user data in layout:", err);
      }
    }

    fetchUserData();
  }, []);

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
      router.push("/login");
    }
  };

  const getPageTitle = () => {
    const activeItem = menuItems.find((item) => item.href === pathname);
    return activeItem ? activeItem.label : "Admin Dashboard";
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
          <p className="text-[10px] uppercase tracking-wider text-[#FEA619] mt-1 font-bold">
            Administrator Area
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#FEA619] text-white shadow-lg shadow-[#FEA619]/25"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Admin Profile & Logout */}
        <div className="px-4 mt-auto border-t border-white/10 pt-6">
          <div className="flex items-center gap-3 px-4 mb-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#FEA619] flex items-center justify-center font-bold text-white text-sm">
              {initials}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 font-medium">Administrator</p>
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
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full min-w-0 overflow-hidden">
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
            {/* Switch to Customer Mode */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 bg-slate-50 text-slate-700 hover:bg-slate-105 hover:text-[#031636] font-bold text-xs px-3 py-2.5 sm:px-4 rounded-xl border border-slate-200 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">Mode Pelanggan</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-250">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="hidden sm:inline">Admin Mode</span>
            </span>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="relative z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer Body */}
            <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-[#031636] py-6 shadow-xl">
              <div className="flex items-center justify-between px-6 mb-8">
                <div>
                  <h2 className="text-xl font-black text-white">KIJANG<span className="text-[#FEA619]">RENTAL</span></h2>
                  <p className="text-[10px] text-slate-400 font-bold tracking-wider">ADMIN AREA</p>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-[#FEA619] p-1.5 hover:bg-white/5 rounded-xl transition"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 space-y-1 px-4">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-[#FEA619] text-white"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
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
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-[#FEA619] flex items-center justify-center font-bold text-white text-sm">
                    {initials}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-white truncate">{userName}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Administrator</p>
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
            </div>
          </div>
        )}

        {/* Child Page Wrapper */}
        <main className="flex-1 p-6 md:p-8 w-full min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
