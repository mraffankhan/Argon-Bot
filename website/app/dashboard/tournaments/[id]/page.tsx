"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function TournamentManagePage() {
  const params = useParams();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTournament = () => {
    fetch(`/api/tournaments/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setTournament(data.tournament);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTournament(); }, [params.id]);

  const updateStatus = async (status: string) => {
    await fetch(`/api/dashboard/tournaments/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchTournament();
  };

  const verifyEntry = async (entryId: string) => {
    await fetch(`/api/dashboard/matches/${entryId}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "VERIFIED" }),
    });
    fetchTournament();
  };

  const featureTournament = async (tier: string) => {
    const res = await fetch(`/api/tournaments/${params.id}/feature`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`Tournament featured as ${tier}!`);
      fetchTournament();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tournament) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">Not found.</div>;
  }

  const completedMatches = tournament.matches?.filter((m: any) => m.status === "COMPLETED").length || 0;
  const liveMatch = tournament.matches?.find((m: any) => m.status === "LIVE");
  const totalEntries = tournament.matches?.reduce((sum: number, m: any) => sum + (m.entries?.length || 0), 0) || 0;
  const pendingEntries = tournament.matches?.reduce((sum: number, m: any) => 
    sum + (m.entries?.filter((e: any) => e.status === "PENDING").length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">{tournament.name}</h1>
            <p className="text-zinc-400">{tournament.game} • {tournament.format}</p>
          </div>
          <div className="flex gap-2">
            <Link 
              href={`/dashboard/tournaments/${params.id}/points`}
              className="px-6 py-2 bg-gradient-to-r from-primary to-secondary hover:scale-105 active:scale-95 text-white font-black uppercase rounded-lg transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mr-4"
            >
              Update Match Points
            </Link>

            {["OPEN", "ACTIVE", "COMPLETED"].map(s => (
              <button key={s} onClick={() => updateStatus(s)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  tournament.status === s ? "bg-white/20 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Teams", value: `${tournament.teams?.length || 0}/${tournament.maxTeams}`, icon: "👥" },
            { label: "Matches", value: `${completedMatches}/${tournament.totalMatches}`, icon: "🎮" },
            { label: "Live Match", value: liveMatch ? `#${liveMatch.matchNumber}` : "None", icon: "🔴" },
            { label: "Entries", value: totalEntries, icon: "📋" },
            { label: "Pending", value: pendingEntries, icon: "⏳" },
          ].map((s, i) => (
            <div key={i} className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl">{s.icon}</div>
              <div className="text-xl font-black">{s.value}</div>
              <div className="text-xs text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Tournament */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">⭐ Feature This Tournament</h2>
          {tournament.isFeatured ? (
            <div className="text-green-400 font-semibold">
              ✅ Featured ({tournament.featuredTier}) — Expires {new Date(tournament.featuredUntil).toLocaleDateString()}
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => featureTournament("basic")}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-lg font-bold transition-colors">
                Basic (₹199 / 24hrs)
              </button>
              <button onClick={() => featureTournament("premium")}
                className="bg-yellow-600 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg font-bold transition-colors">
                Premium (₹499 / 72hrs)
              </button>
            </div>
          )}
        </div>

        {/* Standings */}
        {tournament.standings?.length > 0 && (
          <section>
            <h2 className="text-xl font-black mb-3">🏆 Current Standings</h2>
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-950/80 border-b border-zinc-800 text-xs text-zinc-500 uppercase">
                    <th className="p-3 text-center">#</th>
                    <th className="p-3 text-left">Team</th>
                    <th className="p-3 text-center">Points</th>
                    <th className="p-3 text-center">Kills</th>
                    <th className="p-3 text-center">Matches</th>
                    <th className="p-3 text-center">Best</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {tournament.standings.map((s: any, i: number) => (
                    <tr key={i} className="hover:bg-zinc-800/30">
                      <td className="p-3 text-center font-black">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
                      </td>
                      <td className="p-3 font-bold text-white">{s.teamName}</td>
                      <td className="p-3 text-center text-purple-400 font-bold">{s.totalPoints}</td>
                      <td className="p-3 text-center text-zinc-300">{s.totalKills}</td>
                      <td className="p-3 text-center text-zinc-300">{s.totalMatches}</td>
                      <td className="p-3 text-center text-yellow-400">{s.bestMatch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Match Entries Management */}
        <section>
          <h2 className="text-xl font-black mb-3">📋 Match Entries</h2>
          <div className="space-y-4">
            {tournament.matches?.map((match: any) => (
              <div key={match.id} className="bg-zinc-900/70 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-4 flex items-center justify-between bg-zinc-900">
                  <div className="flex items-center gap-3">
                    <span className="font-black">Match #{match.matchNumber}</span>
                    {match.lobbyName && <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">{match.lobbyName}</span>}
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      match.status === "LIVE" ? "bg-red-500/20 text-red-400" :
                      match.status === "COMPLETED" ? "bg-green-500/20 text-green-400" :
                      "bg-zinc-700/50 text-zinc-400"
                    }`}>
                      {match.status}
                    </span>
                  </div>
                  <span className="text-sm text-zinc-500">{match.entries?.length || 0} entries</span>
                </div>

                {match.entries?.length > 0 && (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
                        <td className="p-3">Team</td>
                        <td className="p-3 text-center">Place</td>
                        <td className="p-3 text-center">Kills</td>
                        <td className="p-3 text-center">Pts</td>
                        <td className="p-3 text-center">Status</td>
                        <td className="p-3 text-center">Screenshot</td>
                        <td className="p-3 text-center">Action</td>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {match.entries
                        .sort((a: any, b: any) => (b.totalPts || 0) - (a.totalPts || 0))
                        .map((entry: any) => (
                        <tr key={entry.id} className="hover:bg-zinc-800/20">
                          <td className="p-3 font-bold text-white">{entry.teamName}</td>
                          <td className="p-3 text-center">#{entry.placement || "?"}</td>
                          <td className="p-3 text-center">{entry.kills ?? 0}</td>
                          <td className="p-3 text-center font-bold text-purple-400">{entry.totalPts ?? 0}</td>
                          <td className="p-3 text-center">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              entry.status === "VERIFIED" ? "bg-green-500/20 text-green-400" :
                              entry.status === "DISPUTED" ? "bg-red-500/20 text-red-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>{entry.status}</span>
                          </td>
                          <td className="p-3 text-center">
                            {entry.screenshotUrl ? (
                              <a href={entry.screenshotUrl} target="_blank" className="text-blue-400 hover:underline text-xs">View</a>
                            ) : "-"}
                          </td>
                          <td className="p-3 text-center">
                            {entry.status === "PENDING" && (
                              <button onClick={() => verifyEntry(entry.id)}
                                className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded font-bold transition-colors">
                                Verify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
