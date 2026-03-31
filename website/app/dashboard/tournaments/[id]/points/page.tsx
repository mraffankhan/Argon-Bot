import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PointsManager from "@/components/PointsManager";

export default async function StaffPointsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  // Fetch Tournament with Stages, Groups, and Teams
  const tournament = await db.tournament.findUnique({
    where: { id },
    include: {
      stages: {
        orderBy: { order: "asc" },
        include: {
          groups: {
            orderBy: { name: "asc" },
            include: {
              teams: {
                  orderBy: { name: "asc" }
              }
            }
          }
        }
      }
    }
  });

  if (!tournament) return <div>Tournament Not Found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl text-white">
        <h1 className="text-3xl font-black italic uppercase tracking-wider mb-2">Staff Points <span className="text-secondary">Manager</span></h1>
        <p className="text-gray-400 mb-8 font-medium">Select a group, input kills and placement points. Total points will calculate automatically.</p>

        <PointsManager tournament={tournament} />
    </div>
  );
}
