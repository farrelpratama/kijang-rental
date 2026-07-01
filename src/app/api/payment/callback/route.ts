import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 1. Verify Midtrans signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-YOUR_KEY_HERE";
    const stringToHash = order_id + status_code + gross_amount + serverKey;
    const localSignature = crypto
      .createHash("sha512")
      .update(stringToHash)
      .digest("hex");

    if (localSignature !== signature_key) {
      console.warn(`[Midtrans Webhook] Signature verification failed for order: ${order_id}`);
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Extract the original booking ID (UUID is exactly 36 characters)
    const bookingId = order_id.substring(0, 36);

    // 2. Initialize Supabase Admin with Service Role Key to bypass RLS policies
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Determine booking status based on Midtrans transaction status
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
    } else if (transaction_status === "pending") {
      bookingStatus = "pending";
    }

    console.log(`[Midtrans Webhook] Updating order ${bookingId} (original for ${order_id}) to status: ${bookingStatus}`);

    // 4. Update the booking status in database
    const { error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({ status: bookingStatus })
      .eq("id", bookingId);

    if (updateError) {
      console.error("[Midtrans Webhook] Database update error:", updateError.message);
      return Response.json({ error: "Database update error" }, { status: 500 });
    }

    return Response.json({ success: true, message: `Status updated to ${bookingStatus}` });
  } catch (err: any) {
    console.error("Error in Midtrans webhook callback:", err);
    return Response.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
