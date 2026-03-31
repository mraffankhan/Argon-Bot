import { getSession } from "@/lib/session";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy, Settings, Users, Gamepad2, Calendar } from "lucide-react";
import ConnectedServers from "@/components/ConnectedServers";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/api/auth/discord");
  }

  const userDiscordId = session.user.id;

  const tournaments = await db.tournament.findMany({
    where: { organizerId: userDiscordId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { teams: true, matches: true } }
    }
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tight drop-shadow-lg">
            Organizer <span className="text-secondary drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg font-medium">Manage your active tournaments and resolve disputes.</p>
        </div>
      </div>

      <ConnectedServers />

      <div className="glass border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
        
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 relative z-10">
          <Trophy className="w-6 h-6 text-primary" /> My Tournaments ({tournaments.length})
        </h2>

        {tournaments.length === 0 ? (
          <div className="text-center py-20 bg-black/40 rounded-2xl border border-white/5 relative z-10">
            <Trophy className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Tournaments Yet</h3>
            <p className="text-gray-400 mb-6 font-medium">Create your first tournament to start managing.</p>
            <Link href="/tournaments/create" className="px-6 py-3 bg-white/5 hover:bg-white/10 font-bold uppercase tracking-wider rounded-xl transition-all border border-white/10">
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {tournaments.map(t => (
              <div key={t.id} className="bg-black/60 border border-white/10 rounded-2xl p-6 hover:border-primary/40 hover:bg-surface transition-all flex flex-col group relative overflow-hidden shadow-xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      t.status === 'OPEN' ? 'bg-green-500/10 text-green-500' :
                      t.status === 'ACTIVE' ? 'bg-red-500/10 text-red-500' :
                      t.status === 'COMPLETED' ? 'bg-zinc-800 text-zinc-400' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {t.status}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2 mb-1">{t.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3" />{t.game}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t.format}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 bg-white/5 p-3 rounded-xl border border-white/5 relative z-10">
                  <div className="text-center">
                    <p className="text-xs text-secondary uppercase font-bold mb-1"><Users className="w-3 h-3 inline mr-1" />Teams</p>
                    <p className="font-semibold text-white">{t._count.teams} / {t.maxTeams}</p>
                  </div>
                  <div className="text-center border-l border-white/10">
                    <p className="text-xs text-primary uppercase font-bold mb-1">Matches</p>
                    <p className="font-semibold text-white">{t._count.matches}</p>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-2 relative z-10">
                  <Link 
                    href={`/dashboard/tournaments/${t.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl transition-colors font-bold uppercase text-xs tracking-wider"
                  >
                    <Settings className="w-4 h-4" /> Manage
                  </Link>
                  <Link 
                    href={`/tournaments/${t.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 text-white rounded-xl transition-colors font-bold uppercase text-xs tracking-wider"
                  >
                    <Trophy className="w-4 h-4 text-secondary" /> View Public
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
