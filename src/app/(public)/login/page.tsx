import Link from "next/link";
import LoginForm from "@/src/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex">
      {/* Left Column: Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#031636] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop')" 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/90 via-[#031636]/40 to-transparent" />
        
        {/* Branding & Overlay Text */}
        <div className="absolute top-16 left-16 z-10">
          <Link href="/" className="text-2xl font-black tracking-tight text-white">
            KIJANG<span className="text-[#FEA619]">RENTAL</span>
          </Link>
        </div>

        <div className="absolute bottom-16 left-16 right-16 text-white z-10 space-y-4">
          <h2 className="text-4xl font-black leading-tight text-white">
            Frictionless Path to Mobility.
          </h2>
          <p className="text-slate-200 text-lg max-w-md">
            Nikmati kemudahan sewa kendaraan premium yang dirancang khusus untuk mobilitas profesional dan keluarga Anda di Yogyakarta.
          </p>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8FAFC] lg:bg-white">
        <div className="w-full max-w-[420px] rounded-3xl border border-slate-150 bg-white p-8 shadow-sm lg:border-none lg:shadow-none space-y-8">
          {/* Mobile Logo (Visible only on mobile/tablet) */}
          <div className="text-center space-y-3 lg:hidden">
            <Link href="/" className="text-3xl font-black tracking-tight text-[#031636] block">
              KIJANG<span className="text-[#FEA619]">RENTAL</span>
            </Link>
          </div>

          {/* Header Text */}
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-2xl font-black text-[#031636]">Selamat Datang</h1>
            <p className="text-sm text-slate-400">
              Silakan masuk menggunakan akun Anda untuk memulai.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}