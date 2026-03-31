import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ discordId: string }> }) {
  try {
    const { discordId } = await params;
    const user = await db.user.findUnique({
      where: { discordId },
      include: {
        playerStats: true,
        teamMembers: {
          include: {
            team: {
              include: {
                tournament: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Since a user is in teams, we can get their matches by fetching matches for their teams.
    const teamIds = user.teamMembers.map(tm => tm.teamId);

    const recentMatches = await db.match.findMany({
      where: {
        entries: {
          some: {
            teamId: { in: teamIds }
          }
        },
        status: "COMPLETED"
      },
      orderBy: { scheduledAt: 'desc' },
      take: 5,
      include: {
        entries: {
          include: { team: { select: { name: true, id: true } } }
        }
      }
    });

    // Formatting History
    const history = user.teamMembers.map(tm => ({
      tournamentId: tm.team.tournamentId,
      tournamentName: tm.team.tournament?.name,
      game: tm.team.tournament?.game,
      teamName: tm.team.name,
      date: tm.team.createdAt
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Compute Stats
    let totalTournaments = user.teamMembers.length;
    let sumWins = 0;
    let sumLosses = 0;
    let sumMvp = 0;

    user.playerStats.forEach(s => {
      sumWins += s.wins;
      sumLosses += s.losses;
      sumMvp += s.mvpCount;
    });

    const totalMatches = sumWins + sumLosses;
    const winRate = totalMatches > 0 ? ((sumWins / totalMatches) * 100).toFixed(1) : 0;

    // Formatting Recent Matches
    const formattedMatches = recentMatches.map(m => {
      const userEntry = m.entries.find(e => teamIds.includes(e.teamId));
      return {
        id: m.id,
        opponent: "Lobby",
        score: `Kills: ${userEntry?.kills || 0} | Pts: ${userEntry?.totalPts || 0}`,
        result: userEntry?.placement === 1 ? "W" : (userEntry?.placement ? `Top ${userEntry.placement}` : "-"),
        date: m.scheduledAt || m.completedAt || new Date()
      };
    });

    return NextResponse.json({
      success: true,
      player: {
        username: user.username,
        avatar: user.avatar,
        discordId: user.discordId,
        createdAt: user.createdAt,
        stats: {
          tournaments: totalTournaments,
          wins: sumWins,
          winRate,
          mvp: sumMvp
        },
        history,
        recentMatches: formattedMatches
      }
    });
  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json({ error: "Failed to fetch player" }, { status: 500 });
  }
}
