const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// 1. Load env variables from .env.local
const envPath = path.join(__dirname, "../.env.local");
if (!fs.existsSync(envPath)) {
  console.error("File .env.local tidak ditemukan! Pastikan file tersebut ada di root project.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const mockCars = [
  {
    id: "zenix-id-12345",
    slug: "toyota-innova-zenix",
    brand: "Toyota",
    model: "Innova Zenix",
    year: 2024,
    category: "MPV",
    transmission: "Automatic",
    fuel: "Hybrid",
    seats: 7,
    price: 600000,
    rating: 4.9,
    reviews: 124,
    available: true,
    thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "Captain Seats",
      "Panoramic Sunroof",
      "Toyota Safety Sense",
      "Dual Zone AC",
      "Apple CarPlay & Android Auto",
      "6 Airbags",
      "Keyless Entry",
      "Rear Parking Camera"
    ],
    description: "Premium MPV perfect for family trips. Nikmati kenyamanan berkendara dengan kabin yang luas, efisiensi bahan bakar mesin hybrid modern, serta fitur keselamatan canggih untuk seluruh keluarga Anda selama perjalanan di Yogyakarta."
  },
  {
    id: "fortuner-id-12345",
    slug: "toyota-fortuner",
    brand: "Toyota",
    model: "Fortuner",
    year: 2024,
    category: "SUV",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 7,
    price: 1200000,
    rating: 4.8,
    reviews: 96,
    available: true,
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "4x4 Wheel Drive",
      "Leather Seats",
      "Power Backdoor",
      "Hill Start Assist",
      "Dual Zone AC",
      "7 Airbags",
      "Cruise Control",
      "360 Camera"
    ],
    description: "Luxury SUV for every adventure. Ketangguhan mesin diesel dipadukan dengan kemewahan kabin kelas atas, siap menemani petualangan Anda menjelajahi medan perkotaan maupun alam bebas dengan penuh percaya diri."
  },
  {
    id: "avanza-id-12345",
    slug: "toyota-avanza",
    brand: "Toyota",
    model: "Avanza",
    year: 2023,
    category: "MPV",
    transmission: "Manual",
    fuel: "Petrol",
    seats: 7,
    price: 350000,
    rating: 4.7,
    reviews: 211,
    available: true,
    thumbnail: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "Double Blower AC",
      "Touchscreen Head Unit",
      "Dual SRS Airbags",
      "ABS & EBD",
      "Parking Sensors",
      "Electric Mirrors"
    ],
    description: "Affordable family vehicle. Mobil sejuta umat yang andal, hemat bahan bakar, dan sangat cocok untuk mobilitas harian keluarga atau rombongan kecil selama berkunjung di Yogyakarta."
  },
  {
    id: "hiace-id-12345",
    slug: "toyota-hiace",
    brand: "Toyota",
    model: "Hiace",
    year: 2024,
    category: "Premium",
    transmission: "Manual",
    fuel: "Diesel",
    seats: 15,
    price: 1000000,
    rating: 4.9,
    reviews: 54,
    available: true,
    thumbnail: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "15 Passenger Seats",
      "Spacious Cabin",
      "Individual AC Vents",
      "Sliding Door",
      "Audio System",
      "Rear Parking Sensors"
    ],
    description: "Comfortable transport for large groups. Pilihan utama untuk perjalanan wisata rombongan, keperluan bisnis, atau acara keluarga dengan kenyamanan maksimal dan ruang kabin yang sangat lega."
  }
];

async function seed() {
  console.log("Memulai proses seeding Supabase...");

  try {
    // 1. Seed Cars (menggunakan upsert berdasarkan slug)
    console.log("Memasukkan data mobil...");
    const { error: carError } = await supabase
      .from("cars")
      .upsert(mockCars, { onConflict: "slug" });

    if (carError) {
      throw new Error(`Gagal memasukkan data mobil: ${carError.message}`);
    }
    console.log("✓ Data mobil berhasil dimasukkan.");

    // 2. Ambil user terdaftar di public.users untuk memasukkan data transaksi sewa
    console.log("Mengambil data user terdaftar...");
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id, name, email");

    if (userError) {
      throw new Error(`Gagal mengambil data user: ${userError.message}`);
    }

    if (!users || users.length === 0) {
      console.log("⚠ Tidak ada user yang terdaftar di database. Silakan daftar akun terlebih dahulu di website untuk membuat data sewa otomatis.");
      console.log("Proses seeding mobil selesai.");
      return;
    }

    console.log(`Menemukan ${users.length} user. Membuat data transaksi untuk masing-masing user...`);

    for (const user of users) {
      console.log(`Mengisi data untuk user: ${user.name} (${user.email})...`);

      // Buat beberapa booking dummy
      const mockBookings = [
        {
          id: `b1-${user.id.substring(0, 8)}`,
          user_id: user.id,
          car_id: "zenix-id-12345", // Innova Zenix
          start_date: "2026-06-30",
          end_date: "2026-07-03",
          total_price: 1850000,
          status: "ongoing", // Aktif
        },
        {
          id: `b2-${user.id.substring(0, 8)}`,
          user_id: user.id,
          car_id: "fortuner-id-12345", // Fortuner
          start_date: "2026-05-15",
          end_date: "2026-05-18",
          total_price: 3650000,
          status: "completed", // Selesai
        },
        {
          id: `b3-${user.id.substring(0, 8)}`,
          user_id: user.id,
          car_id: "avanza-id-12345", // Avanza
          start_date: "2026-04-02",
          end_date: "2026-04-03",
          total_price: 400000,
          status: "completed", // Selesai
        },
        {
          id: `b4-${user.id.substring(0, 8)}`,
          user_id: user.id,
          car_id: "hiace-id-12345", // Hiace
          start_date: "2026-02-12",
          end_date: "2026-02-14",
          total_price: 2000000,
          status: "cancelled", // Batal
        }
      ];

      const { error: bookingError } = await supabase
        .from("bookings")
        .upsert(mockBookings, { onConflict: "id" });

      if (bookingError) {
        console.error(`Gagal membuat booking untuk ${user.name}:`, bookingError.message);
        continue;
      }

      // Buat data dokumen dummy (KTP verified, SIM A belum/pending)
      const mockDocs = [
        {
          id: `doc-ktp-${user.id.substring(0, 8)}`,
          user_id: user.id,
          type: "ktp",
          file_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400&auto=format&fit=crop",
          status: "Verified",
        }
      ];

      const { error: docError } = await supabase
        .from("documents")
        .upsert(mockDocs, { onConflict: "id" });

      if (docError) {
        console.error(`Gagal membuat dokumen untuk ${user.name}:`, docError.message);
      }

      // Buat data payment dummy untuk booking yang selesai
      const mockPayments = [
        {
          id: `pay-b2-${user.id.substring(0, 8)}`,
          booking_id: `b2-${user.id.substring(0, 8)}`,
          amount: 3650000,
          method: "qris",
          payment_status: "paid",
          transaction_id: `midtrans-tx-2-${user.id.substring(0, 4)}`,
        },
        {
          id: `pay-b3-${user.id.substring(0, 8)}`,
          booking_id: `b3-${user.id.substring(0, 8)}`,
          amount: 400000,
          method: "bank_transfer",
          payment_status: "paid",
          transaction_id: `midtrans-tx-3-${user.id.substring(0, 4)}`,
        }
      ];

      const { error: paymentError } = await supabase
        .from("payments")
        .upsert(mockPayments, { onConflict: "id" });

      if (paymentError) {
        console.error(`Gagal membuat data pembayaran untuk ${user.name}:`, paymentError.message);
      }

      console.log(`✓ Data transaksi untuk ${user.name} berhasil di-seed.`);
    }

    console.log("Seeding Supabase berhasil selesai!");

  } catch (err) {
    console.error("Error selama proses seeding:", err.message);
  }
}

seed();
