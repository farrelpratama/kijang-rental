import { NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, orderId } = await request.json();

    if (!bookingId || !orderId) {
      return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 1. Verify user authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch booking to verify ownership
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.user_id !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Query Midtrans API to verify transaction status directly
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const midtransBaseUrl = isProduction 
      ? "https://api.midtrans.com/v2" 
      : "https://api.sandbox.midtrans.com/v2";

    const authHeader = "Basic " + Buffer.from(serverKey + ":").toString("base64");

    const midtransRes = await fetch(`${midtransBaseUrl}/${orderId}/status`, {
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });

    if (!midtransRes.ok) {
      return Response.json({ error: "Failed to verify with Midtrans API" }, { status: 400 });
    }

    const transaction = await midtransRes.json();
    const { transaction_status, fraud_status } = transaction;

    // 4. Map Midtrans status to booking status
    let bookingStatus = "pending";
    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        bookingStatus = "pending";
      } else if (fraud_status === "accept") {
        bookingStatus = "confirmed";
      }
    } else if (transaction_status === "settlement") {
      bookingStatus = "confirmed";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      bookingStatus = "cancelled";
    }

    // 5. Update database using Admin Client to bypass client RLS if needed (same as Webhook)
    if (bookingStatus !== booking.status) {
      const supabaseAdmin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { error: updateError } = await supabaseAdmin
        .from("bookings")
        .update({ status: bookingStatus })
        .eq("id", bookingId);

      if (updateError) {
        return Response.json({ error: "Database update failed" }, { status: 500 });
      }
    }

    return Response.json({ success: true, status: bookingStatus });
  } catch (err: any) {
    console.error("Error verifying payment status:", err);
    return Response.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
