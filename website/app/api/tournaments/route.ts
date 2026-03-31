import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const game = searchParams.get("game");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: any = { isPublic: true };
    
    if (game && game !== "All") where.game = game;
    if (status && status !== "All") where.status = status;
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    // Default sorting logic: OPEN (requires custom mapping or just order by createdAt)
    // Here we'll just sort by createdAt desc as default, can sort by status in UI
    const tournaments = await db.tournament.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { teams: true } }
      }
    });

    const total = await db.tournament.count({ where });

    return NextResponse.json({
      success: true,
      data: tournaments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, game, format, teamSize, maxTeams, prize, rules, guildId, teamsPerGroup, pingRoleId } = body;

    const tournament = await db.tournament.create({
      data: {
        name,
        game,
        format,
        teamSize: parseInt(teamSize) || 4,
        maxTeams: parseInt(maxTeams),
        teamsPerGroup: teamsPerGroup ? parseInt(teamsPerGroup) : 12,
        pingRoleId: pingRoleId || null,
        prize,
        rules,
        guildId,
        organizerId: session.user.id,
        status: "OPEN" // Make open by default for web creations
      },
    });

    // Notify the Python bot instantly via Postgres NOTIFY
    const payload = JSON.stringify({
      tournamentId: tournament.id,
      guildId: tournament.guildId,
      name: tournament.name
    });
    await db.$executeRawUnsafe(`NOTIFY tournament_created, '${payload}'`);

    return NextResponse.json({ success: true, tournament });
  } catch (error) {
    console.error("Error creating tournament:", error);
    return NextResponse.json({ error: "Failed to create tournament" }, { status: 500 });
  }
}
