import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, members } = await req.json();

    const tournament = await db.tournament.findUnique({
      where: { id }
    });

    if (!tournament) return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    if (tournament.status !== "OPEN") return NextResponse.json({ error: "Registrations are closed" }, { status: 400 });

    const currentTeamCount = await db.team.count({ where: { tournamentId: id } });
    
    if (currentTeamCount >= tournament.maxTeams) {
        return NextResponse.json({ error: "Tournament is full" }, { status: 400 });
    }

    // Check if user is already in a team
    const existingTeam = await db.team.findFirst({
        where: { tournamentId: id, captainId: session.user.id }
    });
    if (existingTeam) return NextResponse.json({ error: "You are already registered" }, { status: 400 });

    // Create Team
    const newTeam = await db.team.create({
      data: {
        name: name,
        captainId: session.user.id,
        tournamentId: id,
      }
    });

    // Handle automated group provisioning
    const newCount = currentTeamCount + 1;
    if (newCount % tournament.teamsPerGroup === 0 && newCount > 0) {
      const groupNum = newCount / tournament.teamsPerGroup;
      const groupName = `Group-${String(groupNum).padStart(2, '0')}`;
      
      let stage = await db.stage.findFirst({ where: { tournamentId: id, order: 1 } });
      if (!stage) {
        stage = await db.stage.create({
            data: { tournamentId: id, name: "Qualifiers", order: 1, status: "ACTIVE" }
        });
      }

      const group = await db.group.create({
          data: { stageId: stage.id, name: groupName }
      });

      // Get last teamsPerGroup teams to assign to group
      const teamsToAssign = await db.team.findMany({
          where: { tournamentId: id, groups: { none: {} } },
          orderBy: { createdAt: 'asc' },
          take: tournament.teamsPerGroup
      });

      for (const t of teamsToAssign) {
          await db.team.update({
              where: { id: t.id },
              data: { groups: { connect: { id: group.id } } }
          });
      }

      // Trigger Webhook to Python Bot
      const payload = JSON.stringify({
          tournamentId: tournament.id,
          guildId: tournament.guildId,
          groupId: group.id,
          groupName: group.name
      });
      await db.$executeRawUnsafe(`NOTIFY group_created, '${payload}'`);
    }

    // Auto-close if full now
    if (newCount >= tournament.maxTeams) {
        await db.tournament.update({ where: { id }, data: { status: "ACTIVE" } });
    }

    return NextResponse.json({ success: true, team: newTeam });
  } catch (error) {
    console.error("Error registering team:", error);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
