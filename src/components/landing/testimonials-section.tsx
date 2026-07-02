"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Andi Saputra",
    role: "Pebisnis",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    review:
      "Pelayanannya sangat profesional. Mobil bersih, tepat waktu, dan proses booking sangat mudah. Sangat direkomendasikan untuk perjalanan bisnis.",
    rating: 5,
  },
  {
    id: 2,
    name: "Nabila Putri",
    role: "Liburan Keluarga",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    review:
      "Liburan keluarga jadi jauh lebih nyaman. Unit Innova Zenix masih seperti baru dan drivernya sangat ramah.",
    rating: 5,
  },
  {
    id: 3,
    name: "Michael Jonathan",
    role: "Antar Jemput Bandara",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    review:
      "Respon admin cepat, harga transparan tanpa biaya tersembunyi. Akan menggunakan Kijang Rental lagi saat ke Jogja.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="bg-slate-50 py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full bg-[#FEA619]/20 px-4 py-2 text-sm font-semibold text-[#FEA619]">
            Testimoni Pelanggan
          </span>

          <h2 className="mt-6 text-4xl font-black text-[#031636] md:text-5xl">
            Dipercaya Oleh Ribuan
            <br />
            Pelanggan Setia Kami
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Kepuasan pelanggan merupakan prioritas
            utama kami. Berikut pengalaman mereka
            menggunakan layanan Kijang Rental.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map(
            (testimonial, index) => (
              <motion.article
                key={testimonial.id}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.15,
                }}
                whileHover={{
                  y: -10,
                }}
                className="rounded-xl bg-white p-8 shadow-sm transition hover:shadow-2xl"
              >
                {/* Quote */}

                <div className="mb-8 flex justify-between">
                  <div className="text-5xl font-black text-[#FEA619]">
                    "
                  </div>

                  <div className="flex gap-1">
                    {Array.from({
                      length: testimonial.rating,
                    }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="#FEA619"
                      >
                        <path d="M9 1.5l2.34 4.74 5.23.76-3.78 3.69.89 5.21L9 13.92l-4.68 2.46.89-5.21L1.43 7l5.23-.76L9 1.5z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Review */}

                <p className="leading-8 text-slate-600">
                  {testimonial.review}
                </p>

                {/* User */}

                <div className="mt-10 flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-[#031636]">
                      {testimonial.name}
                    </h4>

                    <p className="text-sm text-slate-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.article>
            )
          )}
        </div>

        {/* Rating Summary */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mt-20 rounded-xl bg-[#031636] px-10 py-12"
        >
          <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
            <div>
              <p className="text-slate-300">
                Rating Keseluruhan
              </p>

              <div className="mt-2 flex items-end gap-2">
                <h2 className="text-6xl font-black text-white">
                  4.9
                </h2>

                <span className="mb-2 text-3xl text-[#FEA619]">
                  ★
                </span>
              </div>

              <p className="mt-2 text-slate-300">
                Berdasarkan 2.000+ ulasan terverifikasi.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-10 text-center">
              <div>
                <h3 className="text-3xl font-black text-white">
                  5K+
                </h3>

                <p className="mt-2 text-slate-300">
                  Pelanggan
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-white">
                  98%
                </h3>

                <p className="mt-2 text-slate-300">
                  Tingkat Kepuasan
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-white">
                  24/7
                </h3>

                <p className="mt-2 text-slate-300">
                  Layanan Bantuan
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}