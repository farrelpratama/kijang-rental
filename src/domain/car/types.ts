export type CarCategory =
  | "MPV"
  | "SUV"
  | "City Car"
  | "Premium";

export type Transmission =
  | "Automatic"
  | "Manual";

export type FuelType =
  | "Petrol"
  | "Diesel"
  | "Hybrid";

export interface Car {
  id: string;

  slug: string;

  brand: string;

  model: string;

  year: number;

  category: CarCategory;

  transmission: Transmission;

  fuel: FuelType;

  seats: number;

  price: number;

  rating: number;

  reviews: number;

  available: boolean;

  thumbnail: string;

  images: string[];

  features: string[];

  description: string;
}