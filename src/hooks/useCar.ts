"use client";

import { useMemo, useState, useEffect } from "react";
import { Car } from "@/src/domain/car";
import { createClient } from "@/src/lib/supabase/client";

export function useFleet() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [transmission, setTransmission] = useState("");
  const [seats, setSeats] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    async function fetchCars() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          // Map database columns to Car domain type if needed
          const mappedCars: Car[] = data.map((item: any) => ({
            id: item.id,
            slug: item.slug,
            brand: item.brand,
            model: item.model,
            year: item.year,
            category: item.category,
            transmission: item.transmission,
            fuel: item.fuel,
            seats: item.seats,
            price: Number(item.price),
            rating: Number(item.rating),
            reviews: item.reviews,
            available: item.available,
            thumbnail: item.thumbnail,
            images: item.images || [],
            features: item.features || [],
            description: item.description
          }));
          setCars(mappedCars);
        }
      } catch (err) {
        console.error("Error fetching cars from database:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    let data = [...cars];

    if (search) {
      const keyword = search.toLowerCase();
      data = data.filter((car) =>
        `${car.brand} ${car.model}`.toLowerCase().includes(keyword)
      );
    }

    if (category) {
      data = data.filter((car) => car.category === category);
    }

    if (transmission) {
      data = data.filter((car) => car.transmission === transmission);
    }

    if (seats) {
      data = data.filter((car) => car.seats === Number(seats));
    }

    switch (sort) {
      case "price-low":
        data.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        data.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        data.sort((a, b) => b.rating - a.rating);
        break;

      default:
        break;
    }

    return data;
  }, [cars, search, category, transmission, seats, sort]);

  return {
    filteredCars,
    loading,
    search,
    setSearch,
    category,
    setCategory,
    transmission,
    setTransmission,
    seats,
    setSeats,
    sort,
    setSort,
  };
}