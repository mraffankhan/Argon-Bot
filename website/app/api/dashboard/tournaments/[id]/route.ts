import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// PATCH /api/dashboard/tournaments/[id] — Update tournament status
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["OPEN", "ACTIVE", "COMPLETED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await db.tournament.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, message: `Tournament status set to ${status}` });
  } catch (error) {
    console.error("Update tournament error:", error);
    return NextResponse.json({ error: "Failed to update tournament" }, { status: 500 });
  }
}
