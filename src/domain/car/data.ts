import { Car } from "@/src/domain/car";

export const cars: Car[] = [
  {
    id: crypto.randomUUID(),
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

    thumbnail:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",

    description:
      "Premium MPV perfect for family trips.",
  },

  {
    id: crypto.randomUUID(),

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

    thumbnail:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",

    description:
      "Luxury SUV for every adventure.",
  },

  {
    id: crypto.randomUUID(),

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

    thumbnail:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",

    description:
      "Affordable family vehicle.",
  },

  {
    id: crypto.randomUUID(),

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

    thumbnail:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",

    description:
      "Comfortable transport for large groups.",
  },
];