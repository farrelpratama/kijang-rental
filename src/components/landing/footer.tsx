"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const quickLinks = [
  {
    title: "Beranda",
    href: "/",
  },
  {
    title: "Armada",
    href: "/cars",
  },
  {
    title: "Tentang Kami",
    href: "#about",
  },
  {
    title: "Testimoni",
    href: "#testimonials",
  },
];

const services = [
  "Rental Harian",
  "Rental Bulanan",
  "Airport Transfer",
  "Wedding Car",
  "Corporate Rental",
];

const socials = [
  {
    name: "Instagram",
    href: "#",
  },
  {
    name: "Facebook",
    href: "#",
  },
  {
    name: "WhatsApp",
    href: "#",
  },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative overflow-hidden bg-[#021127] text-white"
    >
      {/* Background */}

      <div className="absolute -left-48 top-0 h-96 w-96 rounded-full bg-[#FEA619]/10 blur-3xl" />

      <div className="absolute -right-52 bottom-0 h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* TOP */}

        <div className="grid gap-14 border-b border-white/10 py-20 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* COMPANY */}

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
          >
            <Link
              href="/"
              className="text-3xl font-black tracking-tight"
            >
              KIJANG
              <span className="text-[#FEA619]">
                RENTAL
              </span>
            </Link>

            <p className="mt-6 max-w-sm leading-8 text-slate-300">
              Solusi rental mobil premium di
              Yogyakarta dengan armada terbaik,
              harga transparan, dan pelayanan
              profesional untuk setiap perjalanan.
            </p>

            {/* SOCIAL */}

            <div className="mt-8 flex gap-3">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm transition hover:border-[#FEA619] hover:bg-[#FEA619] hover:text-[#031636]"
                >
                  {social.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* QUICK LINKS */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            viewport={{
              once: true,
            }}
          >
            <h3 className="mb-8 text-xl font-bold">
              Quick Links
            </h3>

            <ul className="space-y-5">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-[#FEA619]"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* SERVICES */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            viewport={{
              once: true,
            }}
          >
            <h3 className="mb-8 text-xl font-bold">
              Services
            </h3>

            <ul className="space-y-5">
              {services.map((service) => (
                <li
                  key={service}
                  className="text-slate-300"
                >
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CONTACT */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            viewport={{
              once: true,
            }}
          >
            <h3 className="mb-8 text-xl font-bold">
              Contact
            </h3>

            <div className="space-y-6 text-slate-300">
              <div>
                <h4 className="font-semibold text-white">
                  Office
                </h4>

                <p className="mt-2 leading-7">
                  Jl. Kaliurang KM 7
                  <br />
                  Sleman
                  <br />
                  Yogyakarta
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white">
                  Phone
                </h4>

                <p className="mt-2">
                  +62 812-3456-7890
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white">
                  Email
                </h4>

                <p className="mt-2">
                  hello@kijangrental.id
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM */}

        <div className="flex flex-col items-center justify-between gap-5 py-8 text-center text-sm text-slate-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} Kijang Rental.
            All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="#"
              className="hover:text-[#FEA619]"
            >
              Privacy Policy
            </Link>

            <Link
              href="#"
              className="hover:text-[#FEA619]"
            >
              Terms of Service
            </Link>

            <Link
              href="#"
              className="hover:text-[#FEA619]"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}