import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tournament = await db.tournament.findUnique({
      where: { id },
      include: {
        teams: {
          include: {
            captain: {
              select: { username: true, avatar: true, discordId: true }
            }
          }
        },
        matches: {
          orderBy: { matchNumber: 'asc' },
          include: {
            entries: {
              include: {
                team: { select: { name: true, id: true } }
              },
              orderBy: { placement: 'asc' }
            }
          }
        },
        standings: {
          orderBy: { rank: 'asc' },
          include: {
            team: { select: { name: true, id: true } }
          }
        }
      }
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    // Build per-team match scores for the standings table
    const teamMatchScores: Record<string, (number | null)[]> = {};
    tournament.standings.forEach(s => {
      teamMatchScores[s.teamId] = [];
    });

    // For each match, find each team's entry
    for (const match of tournament.matches) {
      for (const teamId of Object.keys(teamMatchScores)) {
        const entry = match.entries.find(e => e.teamId === teamId);
        teamMatchScores[teamId].push(entry?.totalPts ?? null);
      }
    }

    const standingsWithScores = tournament.standings.map(s => ({
      rank: s.rank,
      teamId: s.teamId,
      teamName: s.team.name,
      totalPoints: s.totalPoints,
      totalKills: s.totalKills,
      totalMatches: s.totalMatches,
      bestMatch: s.bestMatch,
      matchScores: teamMatchScores[s.teamId] || []
    }));

    // Format matches with entries
    const formattedMatches = tournament.matches.map(m => ({
      id: m.id,
      matchNumber: m.matchNumber,
      lobbyName: m.lobbyName,
      status: m.status,
      killMultiplier: m.killMultiplier,
      entries: m.entries.map(e => ({
        id: e.id,
        teamName: e.team.name,
        teamId: e.teamId,
        placement: e.placement,
        kills: e.kills,
        placementPts: e.placementPts,
        killPts: e.killPts,
        totalPts: e.totalPts,
        screenshotUrl: e.screenshotUrl,
        status: e.status
      }))
    }));

    const completedMatches = tournament.matches.filter(m => m.status === "COMPLETED").length;

    return NextResponse.json({
      success: true,
      tournament: {
        id: tournament.id,
        name: tournament.name,
        game: tournament.game,
        format: tournament.format,
        status: tournament.status,
        teamSize: tournament.teamSize,
        maxTeams: tournament.maxTeams,
        teamsPerGroup: (tournament as any).teamsPerGroup,
        prize: tournament.prize,
        rules: tournament.rules,
        discordInvite: tournament.discordInvite,
        organizerId: tournament.organizerId,
        totalMatches: tournament.totalMatches,
        completedMatches,
        teams: tournament.teams,
        matches: formattedMatches,
        standings: standingsWithScores
      }
    });
  } catch (error) {
    console.error("Error fetching tournament:", error);
    return NextResponse.json({ error: "Failed to fetch tournament details" }, { status: 500 });
  }
}
