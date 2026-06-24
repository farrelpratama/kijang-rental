import Link from "next/link";

export default function ConfirmedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center space-y-4">

        <h1 className="text-3xl font-bold">
          Email Berhasil Diverifikasi
        </h1>

        <p>
          Akun Kijang Rental kamu sudah aktif.
        </p>

        <Link
          href="/login"
          className="
            inline-flex
            items-center
            justify-center
            rounded-lg
            bg-primary
            px-6
            py-3
            text-white
          "
        >
          Login Sekarang
        </Link>

      </div>
    </main>
  );
}