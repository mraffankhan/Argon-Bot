"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trophy, Crosshair, Target, Swords, Share2, Medal, UserRound, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PlayerProfilePage({ params }: { params: { discordId: string } }) {
  const { data: response, isLoading } = useQuery({
    queryKey: ["player", params.discordId],
    queryFn: async () => {
      const res = await fetch(`/api/players/${params.discordId}`);
      if (!res.ok) throw new Error("Failed to fetch player");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const player = response?.player;

  if (!player) {
    return <div className="text-center py-20 text-white">Player not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      
      {/* Profile Header */}
      <div className="relative w-full h-80 bg-zinc-900 border-b border-zinc-800 flex items-end pb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-2xl bg-zinc-800 border-4 border-black overflow-hidden shadow-2xl relative">
              {player.avatar ? (
                <Image src={player.avatar} alt={player.username} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                  <UserRound className="w-16 h-16 text-zinc-500" />
                </div>
              )}
            </div>
            
            <div className="pb-2">
              <h1 className="text-4xl font-black uppercase italic tracking-tight drop-shadow-lg">
                {player.username}
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-2 font-medium">
                Player ID: <span className="text-zinc-500">{player.discordId}</span>
              </p>
              <p className="text-xs text-zinc-600 mt-2 uppercase tracking-wide">
                Member since {format(new Date(player.createdAt), "MMM yyyy")}
              </p>
            </div>
          </div>
          
          <div className="pb-2">
            <button 
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors font-semibold"
            >
              <Share2 className="w-4 h-4" /> Share Profile
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mt-12 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Trophy className="w-6 h-6 text-yellow-500" />} label="Tournaments" value={player.stats.tournaments} />
          <StatCard icon={<Swords className="w-6 h-6 text-green-500" />} label="Total Wins" value={player.stats.wins} />
          <StatCard icon={<Target className="w-6 h-6 text-blue-500" />} label="Win Rate" value={`${player.stats.winRate}%`} />
          <StatCard icon={<Medal className="w-6 h-6 text-purple-500" />} label="MVPs" value={player.stats.mvp} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tournament History */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" /> Tournament History
            </h3>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-zinc-800">
                    <th className="p-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">Tournament</th>
                    <th className="p-4 text-xs uppercase tracking-wider text-zinc-500 font-bold hidden sm:table-cell">Team</th>
                    <th className="p-4 text-xs uppercase tracking-wider text-zinc-500 font-bold hidden md:table-cell">Date</th>
                    <th className="p-4 text-xs uppercase tracking-wider text-zinc-500 font-bold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {player.history.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-zinc-600">No tournaments played yet.</td>
                    </tr>
                  ) : (
                    player.history.map((h: any, i: number) => (
                      <tr key={i} className="hover:bg-zinc-800/20 transition-colors group">
                        <td className="p-4">
                          <p className="font-bold text-white group-hover:text-primary transition-colors">{h.tournamentName}</p>
                          <p className="text-xs text-zinc-400">{h.game}</p>
                        </td>
                        <td className="p-4 hidden sm:table-cell text-zinc-300">{h.teamName}</td>
                        <td className="p-4 hidden md:table-cell text-sm text-zinc-500">{format(new Date(h.date), "MMM d, yyyy")}</td>
                        <td className="p-4 text-right">
                          <Link href={`/tournaments/${h.tournamentId}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
                            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Matches */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Crosshair className="w-6 h-6 text-red-500" /> Recent Matches
            </h3>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
              {player.recentMatches.length === 0 ? (
                <div className="text-center py-8 text-zinc-600">No recent matches found.</div>
              ) : (
                player.recentMatches.map((m: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-900">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${m.result === 'W' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {m.result}
                      </span>
                      <p className="text-sm font-semibold text-zinc-300 mt-1">vs {m.opponent}</p>
                      <p className="text-xs text-zinc-600">{format(new Date(m.date), "MMM d")}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-white tracking-widest">{m.score}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Badges Placeholder */}
            <h3 className="text-2xl font-bold flex items-center gap-2 mt-8 pt-4">
              <Medal className="w-6 h-6 text-yellow-500" /> Badges
            </h3>
            <div className="flex gap-2 flex-wrap">
              <Badge title="First Blood" desc="Played first tournament" />
              {player.stats.wins >= 5 && <Badge title="Sharpshooter" desc="5 Wins" />}
              {player.stats.mvp >= 1 && <Badge title="MVP" desc="Earned MVP" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center justify-center hover:border-zinc-700 transition-colors">
      <div className="mb-3 p-3 bg-zinc-950 rounded-full">{icon}</div>
      <span className="text-3xl font-black text-white">{value}</span>
      <span className="text-sm text-zinc-400 mt-1 uppercase tracking-wide font-medium">{label}</span>
    </div>
  );
}

function Badge({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="group relative w-12 h-12 bg-zinc-900 rounded-full border border-zinc-700 flex items-center justify-center cursor-help">
      <Medal className="w-6 h-6 text-zinc-500 group-hover:text-primary transition-colors" />
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <strong>{title}</strong><br/>{desc}
      </div>
    </div>
  );
}
