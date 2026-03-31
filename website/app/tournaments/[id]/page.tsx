"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import StandingsTable from "@/components/StandingsTable";
import { 
  Trophy, Users, Gamepad2, CalendarDays, ArrowRight, ChevronDown, ChevronUp,
  ExternalLink, Plus, Clock, CheckCircle, AlertCircle, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TournamentData {
  id: string;
  name: string;
  game: string;
  format: string;
  status: string;
  maxTeams: number;
  teamsPerGroup: number;
  teamSize: number;
  prize: string | null;
  rules: string | null;
  discordInvite: string | null;
  totalMatches: number;
  completedMatches: number;
  teams: any[];
  matches: any[];
  standings: any[];
}

export default function TournamentDetailPage() {
  const params = useParams();
  const [tournament, setTournament] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null);
  const [registering, setRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<"standings" | "matches" | "teams" | "rules">("standings");

  const handleRegister = async () => {
      if (tournament?.status !== "OPEN") {
          alert("Registrations are closed.");
          return;
      }
      const teamName = window.prompt("Enter your Team Name:");
      if (!teamName) return;

      setRegistering(true);
      try {
          const res = await fetch(`/api/tournaments/${tournament.id}/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: teamName, members: [] })
          });
          const data = await res.json();
          if(data.success) {
              alert("Successfully registered!");
              window.location.reload();
          } else {
              alert(data.error);
          }
      } catch (e) {
          alert("Failed to register.");
      }
      setRegistering(false);
  };

  useEffect(() => {
    fetch(`/api/tournaments/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setTournament(data.tournament);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Tournament not found</h2>
          <Link href="/tournaments" className="text-primary hover:underline">Back to tournaments</Link>
        </div>
      </div>
    );
  }

  const progress = (tournament.teams.length / tournament.maxTeams) * 100;
  const isFull = tournament.teams.length >= tournament.maxTeams;

  const tabs = [
    { id: "standings" as const, label: "Standings", count: tournament.standings.length },
    { id: "matches" as const, label: "Matches", count: tournament.matches.length },
    { id: "teams" as const, label: "Teams", count: tournament.teams.length },
    { id: "rules" as const, label: "Rules", hidden: !tournament.rules },
  ].filter(t => !t.hidden);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/tournaments" className="hover:text-white transition-colors">Tournaments</Link>
          <span>/</span>
          <span className="text-white truncate">{tournament.name}</span>
        </div>

        <div className="glass border border-white/5 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  tournament.status === "ACTIVE" ? "bg-red-500/10 text-red-400" :
                  tournament.status === "OPEN" ? "bg-green-500/10 text-green-400" :
                  tournament.status === "COMPLETED" ? "bg-gray-500/10 text-gray-400" :
                  "bg-yellow-500/10 text-yellow-400"
                }`}>
                  {tournament.status === "ACTIVE" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-1.5" />}
                  {tournament.status}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 text-gray-400">{tournament.game}</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 text-gray-400">{tournament.format}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{tournament.name}</h1>

              <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {tournament.teams.length}/{tournament.maxTeams} teams
                </span>
                <span className="flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4" /> {tournament.completedMatches}/{tournament.totalMatches} matches
                </span>
                {tournament.prize && <span className="text-yellow-500 font-medium">{tournament.prize}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              {tournament.discordInvite && (
                <a 
                  href={tournament.discordInvite} 
                  target="_blank"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#5865F2] text-white text-sm font-medium rounded-xl hover:bg-[#4752C4] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Join Discord
                </a>
              )}
              {tournament.status === "OPEN" && !isFull && (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {registering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Register Team
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span>{tournament.teams.length} of {tournament.maxTeams} teams registered</span>
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
        </div>

        <div className="flex items-center gap-1 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === "standings" && (
              <motion.div
                key="standings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {tournament.standings.length > 0 ? (
                  <div className="glass border border-white/5 rounded-2xl overflow-hidden">
                    <StandingsTable
                      standings={tournament.standings}
                      totalMatches={tournament.totalMatches}
                      completedMatches={tournament.completedMatches}
                      isLive={tournament.status === "ACTIVE"}
                    />
                  </div>
                ) : (
                  <div className="glass border border-white/5 rounded-2xl p-12 text-center">
                    <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No standings yet</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "matches" && (
              <motion.div
                key="matches"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {tournament.matches.length > 0 ? (
                  <div className="space-y-3">
                    {tournament.matches.map((match: any) => (
                      <div key={match.id} className="glass border border-white/5 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedMatch(expandedMatch === match.matchNumber ? null : match.matchNumber)}
                          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-white">Match #{match.matchNumber}</span>
                            {match.lobbyName && (
                              <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded">{match.lobbyName}</span>
                            )}
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              match.status === "LIVE" ? "bg-red-500/10 text-red-400" :
                              match.status === "COMPLETED" ? "bg-green-500/10 text-green-400" :
                              "bg-white/5 text-gray-400"
                            }`}>
                              {match.status}
                            </span>
                          </div>
                          {expandedMatch === match.matchNumber ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedMatch === match.matchNumber && match.entries.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-white/5"
                            >
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="text-gray-500 text-xs uppercase">
                                      <th className="p-3 text-left font-medium">Rank</th>
                                      <th className="p-3 text-left font-medium">Team</th>
                                      <th className="p-3 text-center font-medium">Placement</th>
                                      <th className="p-3 text-center font-medium">Kills</th>
                                      <th className="p-3 text-center font-medium">Points</th>
                                      <th className="p-3 text-center font-medium">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/5">
                                    {match.entries
                                      .sort((a: any, b: any) => (b.totalPts || 0) - (a.totalPts || 0))
                                      .map((entry: any, idx: number) => (
                                      <tr key={entry.id} className="hover:bg-white/5">
                                        <td className="p-3 font-medium text-gray-400">
                                          {idx === 0 ? "1st" : idx === 1 ? "2nd" : idx === 2 ? "3rd" : `#${idx + 1}`}
                                        </td>
                                        <td className="p-3 font-medium text-white">{entry.teamName}</td>
                                        <td className="p-3 text-center text-gray-400">#{entry.placement || "?"}</td>
                                        <td className="p-3 text-center text-gray-400">{entry.kills ?? 0}</td>
                                        <td className="p-3 text-center font-semibold text-primary">{entry.totalPts ?? 0}</td>
                                        <td className="p-3 text-center">
                                          <span className={`text-xs px-2 py-0.5 rounded ${
                                            entry.status === "VERIFIED" ? "bg-green-500/10 text-green-400" :
                                            entry.status === "DISPUTED" ? "bg-red-500/10 text-red-400" :
                                            "bg-yellow-500/10 text-yellow-400"
                                          }`}>
                                            {entry.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass border border-white/5 rounded-2xl p-12 text-center">
                    <CalendarDays className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No matches yet</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "teams" && (
              <motion.div
                key="teams"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {tournament.teams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tournament.teams.map((team: any, idx: number) => {
                      const groupNumber = Math.floor(idx / tournament.teamsPerGroup) + 1;
                      const isGroupFilled = (groupNumber * tournament.teamsPerGroup) <= tournament.teams.length;
                      
                      return (
                        <div key={team.id} className="glass border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-600">#{idx + 1}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              isGroupFilled 
                                ? "bg-primary/10 text-primary" 
                                : "bg-white/5 text-gray-500"
                            }`}>
                              {isGroupFilled ? `Group ${groupNumber}` : "Pending"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold">
                              {team.name[0]}
                            </div>
                            <div>
                              <p className="font-medium text-white">{team.name}</p>
                              <p className="text-xs text-gray-500">Captain: {team.captain?.username || "Unknown"}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="glass border border-white/5 rounded-2xl p-12 text-center">
                    <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No teams registered yet</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "rules" && tournament.rules && (
              <motion.div
                key="rules"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="glass border border-white/5 rounded-2xl p-6">
                  <div className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
                    {tournament.rules}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
