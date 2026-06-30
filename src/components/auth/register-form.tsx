"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signInWithGoogle } from "@/src/lib/auth/auth-service";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Anda harus menyetujui Syarat dan Ketentuan.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !password || !confirmPassword) {
      alert("Silakan isi semua kolom.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    const { error } = await signUp(name, email, password);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/register/success");
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        alert(error.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google sign up error:", err);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600" htmlFor="name">
            Nama Lengkap
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="John Doe"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#031636] placeholder-slate-450 focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636] transition"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600" htmlFor="email">
            Alamat Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="nama@perusahaan.com"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#031636] placeholder-slate-450 focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636] transition"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 pl-4 pr-12 py-3 text-sm text-[#031636] placeholder-slate-450 focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#031636] transition"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600" htmlFor="confirmPassword">
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 pl-4 pr-12 py-3 text-sm text-[#031636] placeholder-slate-450 focus:border-[#031636] focus:outline-none focus:ring-1 focus:ring-[#031636] transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#031636] transition"
            >
              {showConfirmPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start pt-2">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-slate-200 text-[#031636] focus:ring-[#031636] h-4 w-4"
            />
          </div>
          <div className="ml-3 text-xs text-slate-550 leading-relaxed">
            Saya menyetujui{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Syarat Ketentuan"); }} className="font-bold text-[#031636] hover:underline">
              Syarat & Ketentuan
            </a>{" "}
            serta{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Kebijakan Privasi"); }} className="font-bold text-[#031636] hover:underline">
              Kebijakan Privasi
            </a>{" "}
            yang berlaku.
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full mt-2 bg-[#FEA619] text-white font-bold text-sm py-3.5 px-4 rounded-xl hover:bg-[#e89500] hover:scale-[1.01] hover:shadow-lg hover:shadow-[#FEA619]/15 transition duration-200 flex items-center justify-center gap-2 disabled:bg-slate-350 disabled:cursor-not-allowed"
        >
          {loading ? "Mendaftarkan..." : "Daftar Akun"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-slate-100"></div>
        <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Atau Daftar Dengan
        </span>
        <div className="flex-grow border-t border-slate-100"></div>
      </div>

      {/* Google Sign-Up Button */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={loading || googleLoading}
        className="w-full bg-white border border-slate-200 text-[#031636] font-bold text-sm py-3.5 px-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          ></path>
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          ></path>
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          ></path>
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          ></path>
          <path d="M1 1h22v22H1z" fill="none"></path>
        </svg>
        Google Account
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-slate-500">
        Sudah memiliki akun?{" "}
        <Link
          href="/login"
          className="font-bold text-[#031636] hover:text-[#FEA619] hover:underline transition ml-1"
        >
          Masuk Sekarang
        </Link>
      </p>
    </div>
  );
}