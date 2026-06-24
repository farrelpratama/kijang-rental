"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signIn } from "@/src/lib/auth/auth-service";
import { createClient } from "@/src/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    setLoading(true);

    const { error } = await signIn(
      formData.get("email") as string,
      formData.get("password") as string
    );

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user?.id)
      .single();

    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }

    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full border p-3"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full border p-3"
      />

      <button
        disabled={loading}
        className="bg-primary text-white px-4 py-2"
      >
        Login
      </button>
    </form>
  );
}