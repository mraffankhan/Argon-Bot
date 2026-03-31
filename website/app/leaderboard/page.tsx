"use client";

import { useEffect, useState } from "react";

type TabType = "players" | "teams" | "organizers";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<TabType>("players");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?type=${tab}`)
      .then(r => r.json())
      .then(d => {
        setData(d.leaderboard || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tab]);

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: "players", label: "Players", icon: "👤" },
    { key: "teams", label: "Teams", icon: "👥" },
    { key: "organizers", label: "Organizers", icon: "🎯" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 via-zinc-950/80 to-zinc-950"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-black mb-3">🏆 Leaderboard</h1>
          <p className="text-zinc-400 text-lg">The best players, teams, and organizers on Ravonixx</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-zinc-800 pb-4">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                tab === t.key
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">No data yet. Tournaments need to be played!</div>
        ) : (
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl overflow-hidden">
            {tab === "players" && <PlayersTable data={data} />}
            {tab === "teams" && <TeamsTable data={data} />}
            {tab === "organizers" && <OrganizersTable data={data} />}
          </div>
        )}
      </div>
    </div>
  );
}

function PlayersTable({ data }: { data: any[] }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="bg-zinc-950/80 border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider">
          <th className="p-3 w-12 text-center">#</th>
          <th className="p-3">Player</th>
          <th className="p-3 text-center">Tournaments</th>
          <th className="p-3 text-center">Kills 💀</th>
          <th className="p-3 text-center">Booyahs 🏆</th>
          <th className="p-3 text-center">Avg Place</th>
          <th className="p-3 text-center">Score</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-800/50">
        {data.map((p: any) => (
          <tr key={p.discordId} className="hover:bg-zinc-800/30 transition-colors">
            <td className="p-3 text-center font-black text-lg">
              {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : p.rank === 3 ? "🥉" : `#${p.rank}`}
            </td>
            <td className="p-3">
              <a href={`/players/${p.discordId}`} className="font-bold text-white hover:text-purple-400 transition-colors">
                {p.username}
              </a>
            </td>
            <td className="p-3 text-center text-zinc-300">{p.tournaments}</td>
            <td className="p-3 text-center text-zinc-300">{p.kills}</td>
            <td className="p-3 text-center text-yellow-400 font-bold">{p.booyahs}</td>
            <td className="p-3 text-center text-zinc-300">#{p.avgPlacement}</td>
            <td className="p-3 text-center font-black text-purple-400">{p.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TeamsTable({ data }: { data: any[] }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="bg-zinc-950/80 border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider">
          <th className="p-3 w-12 text-center">#</th>
          <th className="p-3">Team</th>
          <th className="p-3">Captain</th>
          <th className="p-3 text-center">Points</th>
          <th className="p-3 text-center">Kills 💀</th>
          <th className="p-3 text-center">Matches</th>
          <th className="p-3 text-center">Best Match</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-800/50">
        {data.map((t: any) => (
          <tr key={t.teamName + t.rank} className="hover:bg-zinc-800/30 transition-colors">
            <td className="p-3 text-center font-black text-lg">
              {t.rank === 1 ? "🥇" : t.rank === 2 ? "🥈" : t.rank === 3 ? "🥉" : `#${t.rank}`}
            </td>
            <td className="p-3 font-bold text-white">{t.teamName}</td>
            <td className="p-3 text-zinc-400">{t.captain}</td>
            <td className="p-3 text-center font-bold text-purple-400">{t.totalPoints}</td>
            <td className="p-3 text-center text-zinc-300">{t.totalKills}</td>
            <td className="p-3 text-center text-zinc-300">{t.totalMatches}</td>
            <td className="p-3 text-center text-yellow-400">{t.bestMatch} pts</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OrganizersTable({ data }: { data: any[] }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="bg-zinc-950/80 border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider">
          <th className="p-3 w-12 text-center">#</th>
          <th className="p-3">Organizer</th>
          <th className="p-3 text-center">Tournaments Hosted</th>
          <th className="p-3 text-center">Total Slots</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-800/50">
        {data.map((o: any) => (
          <tr key={o.username + o.rank} className="hover:bg-zinc-800/30 transition-colors">
            <td className="p-3 text-center font-black text-lg">
              {o.rank === 1 ? "🥇" : o.rank === 2 ? "🥈" : o.rank === 3 ? "🥉" : `#${o.rank}`}
            </td>
            <td className="p-3 font-bold text-white">{o.username}</td>
            <td className="p-3 text-center text-purple-400 font-bold">{o.tournamentsHosted}</td>
            <td className="p-3 text-center text-zinc-300">{o.totalSlotsManaged}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
