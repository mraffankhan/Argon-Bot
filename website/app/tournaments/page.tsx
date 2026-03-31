import Link from "next/link";
import { db } from "@/lib/prisma";
import { Trophy, Users, Gamepad2, CalendarDays, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function PublicTournamentsPage() {
  const tournaments = await db.tournament.findMany({
    where: {
      isPublic: true,
      status: { in: ["OPEN", "ACTIVE"] }
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { teams: true } }
    }
  });

  const eventsJsonLd = tournaments.map(t => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: t.name,
    description: `${t.game} ${t.format} tournament hosted by Ravonixx. ${t.prize ? `Prize pool: ${t.prize}.` : ""} ${t._count.teams}/${t.maxTeams} teams registered.`,
    eventStatus: t.status === "ACTIVE" ? "https://schema.org/EventScheduled" : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    organizer: {
      "@type": "Organization",
      name: "Ravonixx",
      url: "https://ravonixx.xyz",
    },
    offers: {
      "@type": "Offer",
      url: `https://ravonixx.xyz/tournaments/${t.id}`,
      availability: t._count.teams >= t.maxTeams ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
  }));

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Tournaments</h1>
            <p className="text-gray-500">Find and join competitive esports events</p>
          </div>
        </div>

        {tournaments.length === 0 ? (
          <div className="glass border border-white/5 rounded-2xl p-16 text-center">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Tournaments</h3>
            <p className="text-gray-500 mb-6">Check back soon for new events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map(tournament => {
              const isFull = tournament._count.teams >= tournament.maxTeams;
              const progress = (tournament._count.teams / tournament.maxTeams) * 100;
              
              return (
                <Link 
                  key={tournament.id} 
                  href={`/tournaments/${tournament.id}`}
                  className="glass border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      tournament.status === "ACTIVE" 
                        ? "bg-red-500/10 text-red-400" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      {tournament.status === "ACTIVE" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-1.5" />}
                      {tournament.status}
                    </span>
                    {tournament.prize && (
                      <span className="text-sm font-semibold text-yellow-500">{tournament.prize}</span>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {tournament.name}
                  </h2>

                  <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Gamepad2 className="w-3.5 h-3.5" /> {tournament.game}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> {tournament.format}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>{tournament._count.teams} / {tournament.maxTeams} teams</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isFull ? 'bg-red-500' : progress > 75 ? 'bg-yellow-500' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${isFull ? 'text-red-400' : 'text-gray-400'}`}>
                      {isFull ? 'Full' : 'Open for registration'}
                    </span>
                    <span className="text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
