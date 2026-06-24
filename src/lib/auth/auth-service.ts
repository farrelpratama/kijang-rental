"use client";

import { createClient } from "@/src/lib/supabase/client";

export async function signUp(
  name: string,
  email: string,
  password: string
) {
  const supabase = createClient();

  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo:
        `${window.location.origin}/auth/confirm`,
    },
  });
}

export async function signIn(
  email: string,
  password: string
) {
  const supabase = createClient();

  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  const supabase = createClient();

  return await supabase.auth.signOut();
}