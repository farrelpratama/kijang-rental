export default function RegisterSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">

      <div className="max-w-md text-center space-y-4">

        <h1 className="text-3xl font-bold">
          Cek Email Kamu
        </h1>

        <p>
          Kami telah mengirim email verifikasi.
        </p>

        <p className="text-sm text-gray-500">
          Jika email tidak ditemukan,
          periksa folder Spam atau Promotions.
        </p>

      </div>

    </main>
  );
}