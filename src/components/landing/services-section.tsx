"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const services = [
  {
    title: "Liburan Keluarga",
    description:
      "Nikmati perjalanan keluarga dengan armada MPV yang luas, nyaman, dan selalu dalam kondisi prima.",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Perjalanan Bisnis",
    description:
      "Perjalanan bisnis menjadi lebih profesional dengan kendaraan premium yang elegan.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    className: "",
  },
  {
    title: "Mobil Pernikahan",
    description:
      "Hadirkan momen istimewa dengan kendaraan eksklusif untuk hari pernikahanmu.",
    image:
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1200&auto=format&fit=crop",
    className: "",
  },
  {
    title: "Antar Jemput Bandara",
    description:
      "Layanan antar jemput Bandara YIA yang tepat waktu dan nyaman.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop",
    className: "md:col-span-2",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-slate-50 py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

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
          transition={{
            duration: 0.6,
          }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full bg-[#FEA619]/20 px-4 py-2 text-sm font-semibold text-[#FEA619]">
            Layanan Kami
          </span>

          <h2 className="mt-6 text-4xl font-black text-[#031636] md:text-5xl">
            Solusi Tepat untuk Setiap Perjalanan
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Apa pun kebutuhan perjalananmu,
            kami menyediakan layanan rental
            mobil yang fleksibel, aman, dan
            profesional.
          </p>
        </motion.div>

        {/* Bento Grid */}

        <div className="grid auto-rows-[280px] gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
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
              transition={{
                delay: index * 0.15,
              }}
              className={`group relative overflow-hidden rounded-xl ${service.className}`}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              {/* Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#031636] via-[#031636]/60 to-transparent" />

              {/* Content */}

              <div className="absolute bottom-0 flex h-full flex-col justify-end p-8">
                <h3 className="text-3xl font-bold text-white">
                  {service.title}
                </h3>

                <p className="mt-4 max-w-sm leading-7 text-slate-200">
                  {service.description}
                </p>

                <button className="mt-6 w-fit rounded-lg bg-[#FEA619] px-6 py-3 font-semibold text-white transition hover:bg-[#e49500]">
                  Pelajari Lebih Lanjut
                </button>
              </div>

              {/* Hover Effect */}

              <div className="absolute inset-0 border-2 border-transparent transition duration-500 group-hover:border-[#FEA619]" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}

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
          transition={{
            delay: 0.3,
          }}
          className="mt-20 rounded-xl bg-[#031636] px-10 py-12 text-center"
        >
          <h3 className="text-3xl font-bold text-white">
            Tidak Menemukan Layanan
            yang Kamu Cari?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Tim kami siap membantu
            menyediakan solusi transportasi
            yang sesuai dengan kebutuhanmu,
            mulai dari rental harian hingga
            corporate rental.
          </p>

          <button className="mt-8 rounded-lg bg-[#FEA619] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#e49500]">
            Hubungi Kami
          </button>
        </motion.div>
      </div>
    </section>
  );
}