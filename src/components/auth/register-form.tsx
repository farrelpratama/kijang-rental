"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signUp } from "@/src/lib/auth/auth-service";

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const formData =
      new FormData(e.currentTarget);

    const name =
      formData.get("name") as string;

    const email =
      formData.get("email") as string;

    const password =
      formData.get("password") as string;

    setLoading(true);

    const { error } =
      await signUp(
        name,
        email,
        password
      );

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push(
      "/register/success"
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="name"
        required
        placeholder="Nama Lengkap"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="password"
        type="password"
        minLength={8}
        required
        placeholder="Password"
        className="w-full border p-3 rounded-lg"
      />

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          bg-primary
          text-white
          px-4
          py-3
          rounded-lg
        "
      >
        {loading
          ? "Mendaftarkan..."
          : "Daftar"}
      </button>
    </form>
  );
}