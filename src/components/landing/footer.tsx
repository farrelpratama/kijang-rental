export default function Footer() {
  return (
    <footer className="bg-[#031636] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-2xl font-bold">
            Kijang Rental
          </h3>

          <p>
            Solusi rental mobil terpercaya
            untuk perjalanan bisnis maupun
            liburan.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">
            Quick Links
          </h4>

          <ul className="space-y-2">
            <li>Beranda</li>
            <li>Armada</li>
            <li>Layanan</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">
            Kontak
          </h4>

          <p>Yogyakarta</p>
          <p>+62 812 3456 7890</p>
        </div>
      </div>
    </footer>
  );
}