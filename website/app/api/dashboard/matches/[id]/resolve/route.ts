import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// POST /api/dashboard/matches/[id]/resolve — Verify or dispute a match entry
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["VERIFIED", "DISPUTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const entry = await db.matchEntry.findUnique({ where: { id } });
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    await db.matchEntry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, message: `Entry ${status.toLowerCase()}` });
  } catch (error) {
    console.error("Resolve entry error:", error);
    return NextResponse.json({ error: "Failed to resolve entry" }, { status: 500 });
  }
}
