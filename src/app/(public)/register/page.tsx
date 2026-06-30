import Link from "next/link";
import RegisterForm from "@/src/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex">
      {/* Left Column: Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#031636] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80" 
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2LYyjMdKK-P2Tk3gpcTNRaJ2s-fq-h8-A65iPSZg7zTzCTXYBrFSM8zNUANAldyulv83VzuTvZqxCPjqrIdSMl1uCU7td4bFWom36eC8E4enLpoE9EdBG1WXF1idhrIs04BNLGucl8bxI1L_43E8Br0i-xFh6NYyZBMs1ot5gIO4HUgvRxq7snbxB_QTMUF-gJzPESgbJABYalUHhF6Z8mL-p4pMZomUFN15oXcLwOOiv3QYNYQ2vySvdVVHj84qcsaG2cBhhx5mr')" 
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
            Your journey begins here.
          </h2>
          <p className="text-slate-200 text-lg max-w-md">
            Bergabunglah dengan ribuan pelanggan yang mempercayakan perjalanan mereka di Yogyakarta kepada Kijang Rental.
          </p>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8FAFC] lg:bg-white overflow-y-auto">
        <div className="w-full max-w-[420px] rounded-3xl border border-slate-150 bg-white p-8 my-8 shadow-sm lg:border-none lg:shadow-none space-y-8">
          {/* Mobile Logo (Visible only on mobile/tablet) */}
          <div className="text-center space-y-3 lg:hidden">
            <Link href="/" className="text-3xl font-black tracking-tight text-[#031636] block">
              KIJANG<span className="text-[#FEA619]">RENTAL</span>
            </Link>
          </div>

          {/* Header Text */}
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-2xl font-black text-[#031636]">Buat Akun Baru</h1>
            <p className="text-sm text-slate-400">
              Lengkapi formulir di bawah ini untuk memulai pemesanan.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}