import Link from "next/link";

export default function ErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center space-y-4">

        <h1 className="text-3xl font-bold">
          Verifikasi Gagal
        </h1>

        <p>
          Link verifikasi tidak valid atau sudah kadaluarsa.
        </p>

        <Link
          href="/register"
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
          Daftar Ulang
        </Link>

      </div>
    </main>
  );
}