import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createClient } from "@/src/lib/supabase/server";

export async function GET(
  request: NextRequest
) {
  const requestUrl =
    new URL(request.url);

  const code =
    requestUrl.searchParams.get(
      "code"
    );

  if (code) {
    const supabase =
      await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(
        code
      );

    if (!error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/confirmed`
      );
    }

    console.error(error);
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/auth/error`
  );
}