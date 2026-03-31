import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "players";
  const game = searchParams.get("game");
  const limit = parseInt(searchParams.get("limit") || "50");

  try {
    if (type === "players") {
      // Aggregate player stats
      const players = await db.playerStat.groupBy({
        by: ['userId'],
        _sum: {
          totalKills: true,
          booyahCount: true,
          wins: true,
          mvpCount: true,
        },
        _avg: {
          avgPlacement: true,
        },
        _min: {
          bestPlacement: true,
        },
        _count: {
          tournamentId: true,
        },
        orderBy: {
          _sum: { totalKills: 'desc' }
        },
        take: limit,
      });

      // Get user details
      const userIds = players.map(p => p.userId);
      const users = await db.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, username: true, avatar: true, discordId: true }
      });
      const userMap = Object.fromEntries(users.map(u => [u.id, u]));

      const leaderboard = players.map((p, idx) => {
        const user = userMap[p.userId];
        const kills = p._sum.totalKills || 0;
        const booyahs = p._sum.booyahCount || 0;
        const tournaments = p._count.tournamentId || 0;
        const score = (kills * 1) + (booyahs * 10) + (tournaments * 5);
        return {
          rank: idx + 1,
          username: user?.username || "Unknown",
          avatar: user?.avatar,
          discordId: user?.discordId,
          tournaments,
          kills,
          booyahs,
          avgPlacement: Math.round((p._avg.avgPlacement || 0) * 10) / 10,
          bestPlacement: p._min.bestPlacement,
          mvps: p._sum.mvpCount || 0,
          wins: p._sum.wins || 0,
          score,
        };
      }).sort((a, b) => b.score - a.score).map((p, idx) => ({ ...p, rank: idx + 1 }));

      return NextResponse.json({ success: true, type, leaderboard });
    }

    if (type === "teams") {
      const standings = await db.tournamentStanding.groupBy({
        by: ['teamId'],
        _sum: {
          totalPoints: true,
          totalKills: true,
          totalMatches: true,
        },
        _max: {
          bestMatch: true,
        },
        orderBy: {
          _sum: { totalPoints: 'desc' }
        },
        take: limit,
      });

      const teamIds = standings.map(s => s.teamId);
      const teams = await db.team.findMany({
        where: { id: { in: teamIds } },
        include: {
          captain: { select: { username: true } },
          tournament: { select: { name: true } }
        }
      });
      const teamMap = Object.fromEntries(teams.map(t => [t.id, t]));

      const leaderboard = standings.map((s, idx) => {
        const team = teamMap[s.teamId];
        return {
          rank: idx + 1,
          teamName: team?.name || "Unknown",
          captain: team?.captain?.username || "Unknown",
          totalPoints: s._sum.totalPoints || 0,
          totalKills: s._sum.totalKills || 0,
          totalMatches: s._sum.totalMatches || 0,
          bestMatch: s._max.bestMatch || 0,
        };
      });

      return NextResponse.json({ success: true, type, leaderboard });
    }

    if (type === "organizers") {
      const organizers = await db.tournament.groupBy({
        by: ['organizerId'],
        _count: { id: true },
        _sum: { maxTeams: true },
        orderBy: { _count: { id: 'desc' } },
        take: limit,
      });

      const orgIds = organizers.map(o => o.organizerId);
      const users = await db.user.findMany({
        where: { id: { in: orgIds } },
        select: { id: true, username: true, avatar: true, discordId: true }
      });
      const userMap = Object.fromEntries(users.map(u => [u.id, u]));

      const leaderboard = organizers.map((o, idx) => {
        const user = userMap[o.organizerId];
        return {
          rank: idx + 1,
          username: user?.username || "Unknown",
          avatar: user?.avatar,
          tournamentsHosted: o._count.id,
          totalSlotsManaged: o._sum.maxTeams || 0,
        };
      });

      return NextResponse.json({ success: true, type, leaderboard });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
