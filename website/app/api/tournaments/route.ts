import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, game, format, teamSize, maxTeams, prize, rules, guildId } = body;

    const tournament = await db.tournament.create({
      data: {
        name,
        game,
        format,
        maxTeams: parseInt(maxTeams),
        prize,
        rules,
        guildId,
        organizerId: session.user.discordId,
      },
    });

    return NextResponse.json({ success: true, tournament });
  } catch (error) {
    console.error("Error creating tournament:", error);
    return NextResponse.json({ error: "Failed to create tournament" }, { status: 500 });
  }
}
