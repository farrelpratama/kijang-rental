"use client";

import { useMemo, useState } from "react";

import { cars } from "@/src/domain/car";

export function useFleet() {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [transmission, setTransmission] =
    useState("");

  const [seats, setSeats] =
    useState("");

  const [sort, setSort] =
    useState("latest");

  const filteredCars =
    useMemo(() => {
      let data = [...cars];

      if (search) {
        const keyword =
          search.toLowerCase();

        data = data.filter((car) =>
          `${car.brand} ${car.model}`
            .toLowerCase()
            .includes(keyword)
        );
      }

      if (category) {
        data = data.filter(
          (car) =>
            car.category ===
            category
        );
      }

      if (transmission) {
        data = data.filter(
          (car) =>
            car.transmission ===
            transmission
        );
      }

      if (seats) {
        data = data.filter(
          (car) =>
            car.seats ===
            Number(seats)
        );
      }

      switch (sort) {
        case "price-low":
          data.sort(
            (a, b) =>
              a.price - b.price
          );
          break;

        case "price-high":
          data.sort(
            (a, b) =>
              b.price - a.price
          );
          break;

        case "rating":
          data.sort(
            (a, b) =>
              b.rating - a.rating
          );
          break;

        default:
          break;
      }

      return data;
    }, [
      search,
      category,
      transmission,
      seats,
      sort,
    ]);

  return {
    filteredCars,

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