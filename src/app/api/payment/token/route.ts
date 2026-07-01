import { NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import midtransClient from "midtrans-client";

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return Response.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Get user session to verify ownership
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch booking details along with car and profile info
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        id,
        total_price,
        user_id,
        car:cars (
          brand,
          model
        ),
        user:users (
          name,
          email,
          phone
        )
      `)
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if user owns the booking
    if (booking.user_id !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Initialize Midtrans Snap client
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-YOUR_KEY_HERE",
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-YOUR_KEY_HERE",
    });

    const bookingAny = booking as any;
    // Append timestamp suffix to prevent Midtrans "order_id has already been taken" error on retries
    const midtransOrderId = `${bookingAny.id}-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Number(bookingAny.total_price),
      },
      customer_details: {
        first_name: bookingAny.user?.name || "Pelanggan",
        email: bookingAny.user?.email || user.email,
        phone: bookingAny.user?.phone || "",
      },
      item_details: [
        {
          id: bookingAny.id,
          price: Number(bookingAny.total_price),
          quantity: 1,
          name: bookingAny.car ? `${bookingAny.car.brand} ${bookingAny.car.model}` : "Sewa Mobil",
        },
      ],
    };

    // 4. Create Midtrans Transaction
    const transaction = await snap.createTransaction(parameter);

    return Response.json({
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (err: any) {
    console.error("Error creating Midtrans transaction token:", err);
    return Response.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
