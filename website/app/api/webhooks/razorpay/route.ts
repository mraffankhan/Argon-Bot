import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// POST /api/webhooks/razorpay — Handle payment confirmation
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // In production: Verify Razorpay webhook signature
    // const crypto = require('crypto');
    // const signature = req.headers.get('x-razorpay-signature');
    // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
    // hmac.update(JSON.stringify(body));
    // if (hmac.digest('hex') !== signature) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const { event, payload } = body;

    if (event === "payment.captured") {
      const receipt = payload?.payment?.entity?.notes?.receipt;
      if (!receipt) {
        return NextResponse.json({ error: "Missing receipt" }, { status: 400 });
      }

      // Parse receipt format: feature_{tournamentId}_{timestamp}
      const parts = receipt.split("_");
      if (parts.length < 2 || parts[0] !== "feature") {
        return NextResponse.json({ error: "Invalid receipt format" }, { status: 400 });
      }
      const tournamentId = parts[1];
      const tier = payload?.payment?.entity?.notes?.tier || "basic";

      const hours = tier === "premium" ? 72 : 24;
      const featuredUntil = new Date(Date.now() + hours * 60 * 60 * 1000);

      await db.tournament.update({
        where: { id: tournamentId },
        data: {
          isFeatured: true,
          featuredUntil,
          featuredTier: tier,
        }
      });

      return NextResponse.json({ status: "ok", featured: true });
    }

    return NextResponse.json({ status: "ignored" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
