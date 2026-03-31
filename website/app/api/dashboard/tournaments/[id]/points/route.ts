import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { groupId, stageId, results } = body;
        if (!groupId || !results || !Array.isArray(results)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const matchCount = await db.match.count({ where: { groupId } });
        
        // 1. Create a Match
        const match = await db.match.create({
            data: {
                tournamentId: id,
                groupId,
                matchNumber: matchCount + 1,
                status: "COMPLETED",
                completedAt: new Date()
            }
        });

        // 2. Create Match Entries and update Standings
        for (const r of results) {
            const totalPts = r.kills + r.placementPoints;

            await db.matchEntry.create({
                data: {
                    matchId: match.id,
                    teamId: r.teamId,
                    kills: r.kills,
                    placementPts: r.placementPoints,
                    killPts: r.kills, // assuming 1 kill = 1 pt
                    totalPts: totalPts,
                    status: "VERIFIED",
                    verifiedBy: session.user.id
                }
            });

            // Update or Create Standing
            const standing = await db.tournamentStanding.findFirst({
                where: { tournamentId: id, teamId: r.teamId }
            });

            if (standing) {
                await db.tournamentStanding.update({
                    where: { id: standing.id },
                    data: {
                        totalPoints: standing.totalPoints + totalPts,
                        totalKills: standing.totalKills + r.kills,
                        totalMatches: standing.totalMatches + 1,
                        bestMatch: Math.max(standing.bestMatch, totalPts)
                    }
                });
            } else {
                await db.tournamentStanding.create({
                    data: {
                        tournamentId: id,
                        teamId: r.teamId,
                        totalPoints: totalPts,
                        totalKills: r.kills,
                        totalMatches: 1,
                        bestMatch: totalPts
                    }
                });
            }
        }

        // Re-calculate ranks
        const allStandings = await db.tournamentStanding.findMany({
            where: { tournamentId: id },
            orderBy: [
                { totalPoints: 'desc' },
                { totalKills: 'desc' }
            ]
        });

        for (let i = 0; i < allStandings.length; i++) {
            await db.tournamentStanding.update({
                where: { id: allStandings[i].id },
                data: { rank: i + 1 }
            });
        }

        // 3. PostgreSQL NOTIFY
        const payload = JSON.stringify({
            tournamentId: id,
            groupId,
            triggerAuth: session.user.id
        });
        await db.$executeRawUnsafe(`NOTIFY standings_updated, '${payload}'`);

        return NextResponse.json({ success: true, message: "Points processed and leaderboard updated" });

    } catch (error) {
        console.error("Points update error:", error);
        return NextResponse.json({ error: "Failed to update points" }, { status: 500 });
    }
}
