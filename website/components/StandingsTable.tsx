"use client";

import { useState } from "react";

interface MatchEntryData {
  teamName: string;
  placement: number | null;
  kills: number | null;
  placementPts: number | null;
  killPts: number | null;
  totalPts: number | null;
}

interface StandingRow {
  rank: number | null;
  teamName: string;
  totalPoints: number;
  totalKills: number;
  totalMatches: number;
  bestMatch: number;
  matchScores: (number | null)[]; // points per match M1, M2, M3...
}

interface StandingsTableProps {
  standings: StandingRow[];
  totalMatches: number;
  completedMatches: number;
  isLive: boolean;
}

export default function StandingsTable({ standings, totalMatches, completedMatches, isLive }: StandingsTableProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const matchCols = Array.from({ length: totalMatches }, (_, i) => i + 1);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-zinc-950/80 border-b border-zinc-800">
            <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider w-12 text-center">#</th>
            <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Team</th>
            {matchCols.map(m => (
              <th key={m} className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-center w-16">
                M{m}
              </th>
            ))}
            <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-center w-20">
              Total
              {isLive && <span className="ml-1 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
            </th>
            <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-center w-16">Kills</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {standings.map((s, rowIdx) => {
            const rank = s.rank || rowIdx + 1;
            const rankColor =
              rank === 1 ? "text-yellow-500" :
              rank === 2 ? "text-zinc-300" :
              rank === 3 ? "text-orange-400" : "text-zinc-400";

            const rowBg =
              rank === 1 ? "bg-yellow-500/5" :
              rank === 2 ? "bg-zinc-400/5" :
              rank === 3 ? "bg-orange-500/5" : "";

            return (
              <tr key={rowIdx} className={`${rowBg} hover:bg-zinc-800/30 transition-colors`}>
                <td className={`p-3 text-center font-black text-lg ${rankColor}`}>
                  {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
                </td>
                <td className="p-3 font-bold text-white">{s.teamName}</td>
                {matchCols.map((m, colIdx) => {
                  const pts = s.matchScores?.[colIdx];
                  return (
                    <td
                      key={m}
                      className="p-3 text-center text-sm relative cursor-default"
                      onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {pts !== null && pts !== undefined ? (
                        <span className={`font-semibold ${pts >= 10 ? 'text-green-400' : pts > 0 ? 'text-zinc-300' : 'text-zinc-600'}`}>
                          {pts}
                        </span>
                      ) : (
                        <span className="text-zinc-700">-</span>
                      )}
                    </td>
                  );
                })}
                <td className={`p-3 text-center font-black text-lg ${rankColor}`}>
                  {s.totalPoints}
                </td>
                <td className="p-3 text-center font-semibold text-zinc-300">
                  {s.totalKills} 💀
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
