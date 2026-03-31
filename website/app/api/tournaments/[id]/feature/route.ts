import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// POST /api/tournaments/[id]/feature — Create a featured order (stub for Razorpay)
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { tier } = body; // "basic" | "premium"

    const tournament = await db.tournament.findUnique({ where: { id } });
    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    // Tier config
    const tiers: Record<string, { price: number; hours: number }> = {
      basic: { price: 19900, hours: 24 },   // ₹199 in paise
      premium: { price: 49900, hours: 72 },  // ₹499 in paise
    };

    const tierConfig = tiers[tier];
    if (!tierConfig) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // In production: Create Razorpay order here
    // const Razorpay = require('razorpay');
    // const instance = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET,
    // });
    // const order = await instance.orders.create({
    //   amount: tierConfig.price,
    //   currency: "INR",
    //   receipt: `feature_${params.id}_${Date.now()}`,
    // });
    // return NextResponse.json({ success: true, orderId: order.id, amount: tierConfig.price, tier });

    // STUB: Directly feature the tournament for development
    const featuredUntil = new Date(Date.now() + tierConfig.hours * 60 * 60 * 1000);

    await db.tournament.update({
      where: { id },
      data: {
        isFeatured: true,
        featuredUntil,
        featuredTier: tier,
      }
    });

    return NextResponse.json({
      success: true,
      message: `Tournament featured as ${tier} until ${featuredUntil.toISOString()}`,
      featuredUntil,
      tier,
      // orderId: order.id  // Uncomment when Razorpay is live
    });
  } catch (error) {
    console.error("Feature tournament error:", error);
    return NextResponse.json({ error: "Failed to feature tournament" }, { status: 500 });
  }
}
